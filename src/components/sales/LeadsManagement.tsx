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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAndLoadLeads();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadLeads();
  }, [searchTerm, pagination.currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

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
              <tr key={lead.id} className="leads-table-row">
                <td className="name-cell">
                  <span className="full-name">{`${lead.firstName} ${lead.lastName}`}</span>
                </td>
                <td className="hes-id-cell">{lead.hesId}</td>
                <td className="address-cell">{formatAddress(lead)}</td>
                <td className="email-cell">
                  <a href={`mailto:${lead.email}`} className="email-link">
                    {lead.email}
                  </a>
                </td>
                <td className="phone-cell">
                  <a href={`tel:${lead.phone}`} className="phone-link">
                    {lead.phone}
                  </a>
                </td>
                <td>
                  <span className={`stage-badge ${getStageClass(lead.stage)}`}>
                    {lead.stage}
                  </span>
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn"
                      title="View Lead Details"
                    >
                      View
                    </button>
                    {lead.stage !== 'Converted to Opportunity' && (
                      <button 
                        className="action-btn convert-btn"
                        onClick={() => handleConvertToOpportunity(lead.id)}
                        title="Convert to Opportunity"
                      >
                        Convert
                      </button>
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
    </div>
  );
};

export default LeadsManagement;