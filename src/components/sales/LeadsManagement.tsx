import React, { useEffect, useState } from 'react';
import './LeadsManagement.css';
import { salesDataService } from '../../services/salesDataService';
import { SalesRecord, SearchFilters, PaginationInfo } from '../../types/salesTypes';
import NewLeadModal from './NewLeadModal';

const LeadsManagement: React.FC = () => {
  const [leads, setLeads] = useState<SalesRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 20
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<SalesRecord | null>(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<SalesRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAndLoadLeads();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadLeads();
  }, [searchTerm, pagination.currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };
    
    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  const initializeAndLoadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      await salesDataService.initialize();
      await loadLeads();
    } catch (err) {
      console.error('Failed to initialize leads:', err);
      setError('Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadLeads = async () => {
    try {
      const filters: SearchFilters = {};
      if (searchTerm.trim()) {
        filters.searchTerm = searchTerm.trim();
      }

      const result = await salesDataService.getLeads(filters, pagination.currentPage, pagination.pageSize);
      setLeads(result.records);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Failed to load leads:', err);
      setError('Failed to load leads. Please try again.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleConvertToOpportunity = async (leadId: string) => {
    try {
      await salesDataService.convertToOpportunity(leadId);
      await loadLeads(); // Refresh the list
      alert('Lead successfully converted to opportunity!');
    } catch (err) {
      console.error('Failed to convert lead:', err);
      alert('Failed to convert lead. Please try again.');
    }
  };

  const handleCreateLead = async (leadData: any) => {
    try {
      await salesDataService.createLead(leadData);
      await loadLeads(); // Refresh the list
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create lead:', err);
      throw err;
    }
  };

  const handleRowClick = (lead: SalesRecord) => {
    setSelectedLead(lead);
    setEditedLead(lead);
    setShowLeadDetails(true);
    setIsEditing(false);
  };

  const handleCloseLeadDetails = () => {
    setSelectedLead(null);
    setEditedLead(null);
    setShowLeadDetails(false);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && selectedLead) {
      setEditedLead({...selectedLead});
    }
  };

  const handleFieldChange = (field: string, value: string | number) => {
    if (editedLead) {
      setEditedLead({
        ...editedLead,
        [field]: value
      });
    }
  };

  const handleSaveLead = async () => {
    if (editedLead) {
      try {
        // Update the lead in localStorage
        const allRecords = JSON.parse(localStorage.getItem('salesRecords') || '[]');
        const updatedRecords = allRecords.map((record: SalesRecord) => 
          record.id === editedLead.id 
            ? {...editedLead, updatedDate: new Date().toISOString()}
            : record
        );
        localStorage.setItem('salesRecords', JSON.stringify(updatedRecords));
        
        // Update local state
        setSelectedLead(editedLead);
        setIsEditing(false);
        
        // Refresh the leads list
        await loadLeads();
        
        alert('Lead updated successfully!');
      } catch (err) {
        console.error('Failed to save lead:', err);
        alert('Failed to save lead. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedLead(selectedLead);
    setIsEditing(false);
  };

  const handleDropdownToggle = (leadId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === leadId ? null : leadId);
  };

  const handleDropdownAction = (action: string, leadId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdown(null);
    
    switch (action) {
      case 'convert':
        handleConvertToOpportunity(leadId);
        break;
      case 'view':
        const lead = leads.find(l => l.id === leadId);
        if (lead) handleRowClick(lead);
        break;
      case 'edit':
        const editLead = leads.find(l => l.id === leadId);
        if (editLead) handleRowClick(editLead);
        break;
      default:
        break;
    }
  };

  const formatAddress = (record: SalesRecord): string => {
    const parts = [record.address, record.city, record.stateProvince, record.postalCode].filter(Boolean);
    return parts.join(', ');
  };

  const getStageClass = (stage: string): string => {
    switch (stage) {
      case 'New Lead':
        return 'stage-new';
      case 'Qualified':
        return 'stage-qualified';
      case 'Converted to Opportunity':
        return 'stage-converted';
      default:
        return 'stage-default';
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button key="first" onClick={() => handlePageChange(1)} className="pagination-btn">
          First
        </button>
      );
    }

    // Previous page
    if (pagination.currentPage > 1) {
      pages.push(
        <button key="prev" onClick={() => handlePageChange(pagination.currentPage - 1)} className="pagination-btn">
          Previous
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${pagination.currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Next page
    if (pagination.currentPage < pagination.totalPages) {
      pages.push(
        <button key="next" onClick={() => handlePageChange(pagination.currentPage + 1)} className="pagination-btn">
          Next
        </button>
      );
    }

    // Last page
    if (endPage < pagination.totalPages) {
      pages.push(
        <button key="last" onClick={() => handlePageChange(pagination.totalPages)} className="pagination-btn">
          Last
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="leads-loading">
        <div className="loading-spinner"></div>
        <p>Loading leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leads-error">
        <p>{error}</p>
        <button onClick={initializeAndLoadLeads} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="leads-management">
      <div className="leads-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search Leads"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">⌕</span>
          </div>
        </div>
        <button 
          className="create-lead-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Create Lead +
        </button>
        <button 
          className="demo-data-btn"
          onClick={async () => {
            setLoading(true);
            await salesDataService.regenerateData();
            await loadLeads();
            setLoading(false);
          }}
          style={{
            marginLeft: '10px', 
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.8rem',
            padding: '8px 12px'
          }}
        >
          Demo Data
        </button>
      </div>

      <div className="leads-table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>HES ID</th>
              <th>Address</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Stage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr 
                key={lead.id} 
                className="leads-table-row clickable-row"
                onClick={() => handleRowClick(lead)}
                style={{cursor: 'pointer'}}
              >
                <td className="name-cell">
                  <span className="full-name">{`${lead.firstName} ${lead.lastName}`}</span>
                </td>
                <td className="hes-id-cell">{lead.hesId}</td>
                <td className="address-cell">{formatAddress(lead)}</td>
                <td className="email-cell">
                  <a 
                    href={`mailto:${lead.email}`} 
                    className="email-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {lead.email}
                  </a>
                </td>
                <td className="phone-cell">
                  <a 
                    href={`tel:${lead.phone}`} 
                    className="phone-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {lead.phone}
                  </a>
                </td>
                <td>
                  <span className={`stage-badge ${getStageClass(lead.stage)}`}>
                    {lead.stage}
                  </span>
                </td>
                <td className="actions-cell">
                  <div className="actions-dropdown">
                    <button
                      className="dropdown-trigger"
                      onClick={(e) => handleDropdownToggle(lead.id, e)}
                      title="Lead Actions"
                    >
                      Actions ▼
                    </button>
                    {openDropdown === lead.id && (
                      <div className="dropdown-menu">
                        <button
                          className="dropdown-item"
                          onClick={(e) => handleDropdownAction('view', lead.id, e)}
                        >
                          View Details
                        </button>
                        {lead.stage !== 'Converted to Opportunity' && (
                          <button
                            className="dropdown-item convert-item"
                            onClick={(e) => handleDropdownAction('convert', lead.id, e)}
                          >
                            Convert to Opportunity
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        
        {leads.length === 0 && (
          <div className="no-leads">
            <p>No leads found. {searchTerm ? 'Try adjusting your search.' : 'Create your first lead!'}</p>
          </div>
        )}
      </div>

      <div className="pagination-container">
        <div className="pagination-info">
          Showing {pagination.currentPage} of {pagination.totalPages} pages
        </div>
        <div className="pagination-controls">
          {renderPagination()}
        </div>
        <div className="records-info">
          Records: {pagination.totalRecords}
        </div>
      </div>

      {isModalOpen && (
        <NewLeadModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateLead}
        />
      )}

      {showLeadDetails && selectedLead && (
        <div className="lead-details-overlay" onClick={handleCloseLeadDetails}>
          <div className="lead-details-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn-absolute" onClick={handleCloseLeadDetails}>×</button>
            <div className="modal-content">
              <div className="modal-edit-header">
                <button
                  className="edit-toggle-btn"
                  onClick={handleEditToggle}
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Lead'}
                </button>
              </div>

              <div className="lead-info-grid">
                <div className="info-section">
                  <h3>Personal Information</h3>
                  <div className="info-item">
                    <label>First Name:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="text"
                        value={editedLead.firstName}
                        onChange={(e) => handleFieldChange('firstName', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span>{selectedLead.firstName}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Last Name:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="text"
                        value={editedLead.lastName}
                        onChange={(e) => handleFieldChange('lastName', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span>{selectedLead.lastName}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="email"
                        value={editedLead.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span><a href={`mailto:${selectedLead.email}`}>{selectedLead.email}</a></span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="tel"
                        value={editedLead.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span><a href={`tel:${selectedLead.phone}`}>{selectedLead.phone}</a></span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Communication Preference:</label>
                    {isEditing && editedLead ? (
                      <select
                        value={editedLead.communicationPreference || ''}
                        onChange={(e) => handleFieldChange('communicationPreference', e.target.value)}
                        className="edit-select"
                      >
                        <option value="">Select...</option>
                        <option value="Email">Email</option>
                        <option value="Phone">Phone</option>
                        <option value="Text">Text</option>
                      </select>
                    ) : (
                      <span>{selectedLead.communicationPreference || 'Not specified'}</span>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <h3>Lead Information</h3>
                  <div className="info-item">
                    <label>HES ID:</label>
                    <span className="hes-id">{selectedLead.hesId}</span>
                  </div>
                  <div className="info-item">
                    <label>Stage:</label>
                    <span className={`stage-badge ${getStageClass(selectedLead.stage)}`}>
                      {selectedLead.stage}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Lead Type:</label>
                    {isEditing && editedLead ? (
                      <select
                        value={editedLead.leadType || ''}
                        onChange={(e) => handleFieldChange('leadType', e.target.value)}
                        className="edit-select"
                      >
                        <option value="">Select...</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    ) : (
                      <span>{selectedLead.leadType || 'Not specified'}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Created Date:</label>
                    <span>{new Date(selectedLead.createdDate).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <label>Last Updated:</label>
                    <span>{new Date(selectedLead.updatedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <label>Referred By:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="text"
                        value={editedLead.referredBy || ''}
                        onChange={(e) => handleFieldChange('referredBy', e.target.value)}
                        className="edit-input"
                        placeholder="Enter referrer name"
                      />
                    ) : (
                      <span>{selectedLead.referredBy || 'Not specified'}</span>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <h3>Address</h3>
                  <div className="info-item">
                    <label>Street Address:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="text"
                        value={editedLead.address}
                        onChange={(e) => handleFieldChange('address', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span>{selectedLead.address}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>City:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="text"
                        value={editedLead.city}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span>{selectedLead.city}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>State/Province:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="text"
                        value={editedLead.stateProvince}
                        onChange={(e) => handleFieldChange('stateProvince', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span>{selectedLead.stateProvince}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Postal Code:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="text"
                        value={editedLead.postalCode}
                        onChange={(e) => handleFieldChange('postalCode', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span>{selectedLead.postalCode}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Country:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="text"
                        value={editedLead.country}
                        onChange={(e) => handleFieldChange('country', e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      <span>{selectedLead.country}</span>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <h3>Energy Information</h3>
                  <div className="info-item">
                    <label>Monthly Electric Bill:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="number"
                        value={editedLead.monthlyElectricBill || ''}
                        onChange={(e) => handleFieldChange('monthlyElectricBill', parseFloat(e.target.value) || 0)}
                        className="edit-input"
                        placeholder="Enter amount"
                      />
                    ) : (
                      <span>${selectedLead.monthlyElectricBill || 'Not specified'}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>kWh Rate:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editedLead.kwhRate || ''}
                        onChange={(e) => handleFieldChange('kwhRate', parseFloat(e.target.value) || 0)}
                        className="edit-input"
                        placeholder="Rate per kWh"
                      />
                    ) : (
                      <span>${selectedLead.kwhRate || 'Not specified'}/kWh</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>Utility Company:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="text"
                        value={editedLead.utilityCompany || ''}
                        onChange={(e) => handleFieldChange('utilityCompany', e.target.value)}
                        className="edit-input"
                        placeholder="Enter utility company"
                      />
                    ) : (
                      <span>{selectedLead.utilityCompany || 'Not specified'}</span>
                    )}
                  </div>
                  <div className="info-item">
                    <label>GCID:</label>
                    {isEditing && editedLead ? (
                      <input
                        type="text"
                        value={editedLead.gcid || ''}
                        onChange={(e) => handleFieldChange('gcid', e.target.value)}
                        className="edit-input"
                        placeholder="Enter GCID"
                      />
                    ) : (
                      <span>{selectedLead.gcid || 'Not specified'}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                {isEditing ? (
                  <>
                    <button 
                      className="action-btn save-btn-modal"
                      onClick={handleSaveLead}
                    >
                      Save Changes
                    </button>
                    <button 
                      className="action-btn cancel-btn-modal"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {selectedLead.stage !== 'Converted to Opportunity' && (
                      <button 
                        className="action-btn convert-btn-modal"
                        onClick={() => {
                          handleConvertToOpportunity(selectedLead.id);
                          handleCloseLeadDetails();
                        }}
                      >
                        Convert to Opportunity
                      </button>
                    )}
                    <button className="action-btn close-btn-modal" onClick={handleCloseLeadDetails}>
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsManagement;