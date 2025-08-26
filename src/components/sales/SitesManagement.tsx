import React, { useEffect, useState } from 'react';
import './SitesManagement.css';
import { sitesDataService } from '../../services/sitesDataService';
import { SiteRecord, SiteSearchFilters, SitePaginationInfo, SiteStage } from '../../types/sitesTypes';

const SitesManagement: React.FC = () => {
  const [sites, setSites] = useState<SiteRecord[]>([]);
  const [pagination, setPagination] = useState<SitePaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 20
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<SiteStage | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAndLoadSites();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadSites();
  }, [searchTerm, stageFilter, pagination.currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeAndLoadSites = async () => {
    try {
      setLoading(true);
      setError(null);
      await sitesDataService.initialize();
      await loadSites();
    } catch (err) {
      console.error('Failed to initialize sites:', err);
      setError('Failed to load sites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadSites = async () => {
    try {
      const filters: SiteSearchFilters = {};
      if (searchTerm.trim()) {
        filters.searchTerm = searchTerm.trim();
      }
      if (stageFilter) {
        filters.stage = stageFilter;
      }

      const result = await sitesDataService.getSites(filters, pagination.currentPage, pagination.pageSize);
      setSites(result.records);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Failed to load sites:', err);
      setError('Failed to load sites. Please try again.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleStageFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStageFilter(e.target.value as SiteStage | '');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleStageUpdate = async (siteId: string, newStage: SiteStage) => {
    try {
      await sitesDataService.updateSiteStage(siteId, newStage);
      await loadSites(); // Refresh the list
      alert(`Site stage updated to ${newStage}!`);
    } catch (err) {
      console.error('Failed to update site stage:', err);
      alert('Failed to update site stage. Please try again.');
    }
  };

  const formatAddress = (site: SiteRecord): string => {
    const parts = [site.address, site.city, site.stateProvince, site.postalCode].filter(Boolean);
    return parts.join(', ');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageClass = (stage: string): string => {
    switch (stage) {
      case 'Sales Handoff':
        return 'stage-handoff';
      case 'Site Survey Scheduled':
      case 'Site Survey Completed':
        return 'stage-survey';
      case 'Permit Submitted':
      case 'Permit Approved':
        return 'stage-permit';
      case 'Installation Scheduled':
      case 'Installation in Progress':
        return 'stage-installation';
      case 'Installation Complete':
        return 'stage-complete';
      case 'PTO Pending':
        return 'stage-pto';
      case 'PTO Granted':
        return 'stage-active';
      default:
        return 'stage-default';
    }
  };

  const canAdvanceStage = (stage: SiteStage): boolean => {
    return stage !== 'PTO Granted';
  };

  const getNextStage = (currentStage: SiteStage): SiteStage | null => {
    return sitesDataService.getNextStage(currentStage);
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
      <div className="sites-loading">
        <div className="loading-spinner"></div>
        <p>Loading sites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sites-error">
        <p>{error}</p>
        <button onClick={initializeAndLoadSites} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="sites-management">
      <div className="sites-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search Sites"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">⌕</span>
          </div>
        </div>
        <div className="filter-container">
          <select
            value={stageFilter}
            onChange={handleStageFilterChange}
            className="stage-filter"
          >
            <option value="">All Stages</option>
            <option value="Sales Handoff">Sales Handoff</option>
            <option value="Site Survey Scheduled">Site Survey Scheduled</option>
            <option value="Site Survey Completed">Site Survey Completed</option>
            <option value="Permit Submitted">Permit Submitted</option>
            <option value="Permit Approved">Permit Approved</option>
            <option value="Installation Scheduled">Installation Scheduled</option>
            <option value="Installation in Progress">Installation in Progress</option>
            <option value="Installation Complete">Installation Complete</option>
            <option value="PTO Pending">PTO Pending</option>
            <option value="PTO Granted">PTO Granted</option>
          </select>
        </div>
        <div className="controls-info">
          <span className="total-sites">
            Total Sites: {pagination.totalRecords}
          </span>
        </div>
        <button 
          className="demo-data-btn"
          onClick={async () => {
            setLoading(true);
            await sitesDataService.regenerateData();
            await loadSites();
            setLoading(false);
          }}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.8rem',
            padding: '8px 12px',
            borderRadius: '6px'
          }}
        >
          Demo Data
        </button>
      </div>

      <div className="sites-table-container">
        <table className="sites-table">
          <thead>
            <tr>
              <th>Site ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>System Size</th>
              <th>Contract Value</th>
              <th>Stage</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id} className="sites-table-row">
                <td className="site-id-cell">
                  <span className="site-id">{site.siteId}</span>
                  <span className="hes-id">{site.hesId}</span>
                </td>
                <td className="customer-cell">
                  <span className="customer-name">{site.customerName}</span>
                  <span className="customer-contact">
                    <a href={`tel:${site.phone}`}>{site.phone}</a>
                  </span>
                </td>
                <td className="address-cell">{formatAddress(site)}</td>
                <td className="system-cell">
                  <span className="system-size">{site.systemSize} kW</span>
                  <span className="panel-count">{site.panelCount} panels</span>
                </td>
                <td className="contract-cell">
                  {formatCurrency(site.contractValue)}
                </td>
                <td>
                  <span className={`stage-badge ${getStageClass(site.stage)}`}>
                    {site.stage}
                  </span>
                </td>
                <td className="progress-cell">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${site.overallProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{site.overallProgress}%</span>
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn"
                      title="View Site Details"
                    >
                      View
                    </button>
                    {canAdvanceStage(site.stage) && (
                      <button 
                        className="action-btn advance-btn"
                        onClick={() => {
                          const nextStage = getNextStage(site.stage);
                          if (nextStage) {
                            handleStageUpdate(site.id, nextStage);
                          }
                        }}
                        title={`Advance to ${getNextStage(site.stage) || 'Next Stage'}`}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sites.length === 0 && (
          <div className="no-sites">
            <p>No sites found. {searchTerm ? 'Try adjusting your search.' : 'Sites are created from Closed Won opportunities.'}</p>
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

export default SitesManagement;