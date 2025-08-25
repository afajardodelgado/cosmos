import React, { useEffect, useState } from 'react';
import './OpportunitiesManagement.css';
import { salesDataService } from '../../services/salesDataService';
import { SalesRecord, SearchFilters, PaginationInfo, LeadStage } from '../../types/salesTypes';

const OpportunitiesManagement: React.FC = () => {
  const [opportunities, setOpportunities] = useState<SalesRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 20
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAndLoadOpportunities();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadOpportunities();
  }, [searchTerm, pagination.currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeAndLoadOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      await salesDataService.initialize();
      await loadOpportunities();
    } catch (err) {
      console.error('Failed to initialize opportunities:', err);
      setError('Failed to load opportunities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadOpportunities = async () => {
    try {
      const filters: SearchFilters = {};
      if (searchTerm.trim()) {
        filters.searchTerm = searchTerm.trim();
      }

      const result = await salesDataService.getOpportunities(filters, pagination.currentPage, pagination.pageSize);
      setOpportunities(result.records);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Failed to load opportunities:', err);
      setError('Failed to load opportunities. Please try again.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleStageUpdate = async (opportunityId: string, newStage: LeadStage) => {
    try {
      await salesDataService.updateOpportunityStage(opportunityId, newStage);
      await loadOpportunities(); // Refresh the list
      alert(`Opportunity stage updated to ${newStage}!`);
    } catch (err) {
      console.error('Failed to update opportunity stage:', err);
      alert('Failed to update opportunity stage. Please try again.');
    }
  };

  const formatAddress = (record: SalesRecord): string => {
    const parts = [record.address, record.city, record.stateProvince, record.postalCode].filter(Boolean);
    return parts.join(', ');
  };

  const getStageClass = (stage: string): string => {
    switch (stage) {
      case 'Converted to Opportunity':
        return 'stage-converted';
      case 'Contract Sent':
        return 'stage-contract';
      case 'Closed Won':
        return 'stage-closed';
      default:
        return 'stage-default';
    }
  };

  const getNextStage = (currentStage: LeadStage): LeadStage | null => {
    switch (currentStage) {
      case 'Converted to Opportunity':
        return 'Contract Sent';
      case 'Contract Sent':
        return 'Closed Won';
      default:
        return null;
    }
  };

  const canAdvanceStage = (stage: LeadStage): boolean => {
    return stage === 'Converted to Opportunity' || stage === 'Contract Sent';
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
      <div className="opportunities-loading">
        <div className="loading-spinner"></div>
        <p>Loading opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="opportunities-error">
        <p>{error}</p>
        <button onClick={initializeAndLoadOpportunities} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="opportunities-management">
      <div className="opportunities-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search Opportunities"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">⌕</span>
          </div>
        </div>
        <div className="controls-info">
          <span className="total-opportunities">
            Total Opportunities: {pagination.totalRecords}
          </span>
        </div>
      </div>

      <div className="opportunities-table-container">
        <table className="opportunities-table">
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
            {opportunities.map((opportunity) => (
              <tr key={opportunity.id} className="opportunities-table-row">
                <td className="name-cell">
                  <span className="full-name">{`${opportunity.firstName} ${opportunity.lastName}`}</span>
                </td>
                <td className="hes-id-cell">{opportunity.hesId}</td>
                <td className="address-cell">{formatAddress(opportunity)}</td>
                <td className="email-cell">
                  <a href={`mailto:${opportunity.email}`} className="email-link">
                    {opportunity.email}
                  </a>
                </td>
                <td className="phone-cell">
                  <a href={`tel:${opportunity.phone}`} className="phone-link">
                    {opportunity.phone}
                  </a>
                </td>
                <td>
                  <span className={`stage-badge ${getStageClass(opportunity.stage)}`}>
                    {opportunity.stage}
                  </span>
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn"
                      title="View Opportunity Details"
                    >
                      View
                    </button>
                    {canAdvanceStage(opportunity.stage) && (
                      <button 
                        className="action-btn advance-btn"
                        onClick={() => {
                          const nextStage = getNextStage(opportunity.stage);
                          if (nextStage) {
                            handleStageUpdate(opportunity.id, nextStage);
                          }
                        }}
                        title={`Advance to ${getNextStage(opportunity.stage) || 'Next Stage'}`}
                      >
                        {opportunity.stage === 'Converted to Opportunity' ? 'Send Contract' : 'Close Won'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {opportunities.length === 0 && (
          <div className="no-opportunities">
            <p>No opportunities found. {searchTerm ? 'Try adjusting your search.' : 'Convert some leads to opportunities!'}</p>
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
    </div>
  );
};

export default OpportunitiesManagement;