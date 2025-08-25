import React, { useEffect, useState } from 'react';
import './CompletedProjects.css';
import { installationDataService } from '../../services/installationDataService';
import { InstallationProject, InstallationSearchFilters, PaginationInfo } from '../../types/installationTypes';

const CompletedProjects: React.FC = () => {
  const [projects, setProjects] = useState<InstallationProject[]>([]);
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
    initializeAndLoadProjects();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadProjects();
  }, [searchTerm, pagination.currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeAndLoadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      await installationDataService.initialize();
      await loadProjects();
    } catch (err) {
      console.error('Failed to initialize completed projects:', err);
      setError('Failed to load completed projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const filters: InstallationSearchFilters = {};
      if (searchTerm.trim()) {
        filters.searchTerm = searchTerm.trim();
      }

      const result = await installationDataService.getCompletedProjects(filters, pagination.currentPage, pagination.pageSize);
      setProjects(result.records);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Failed to load completed projects:', err);
      setError('Failed to load completed projects. Please try again.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const formatAddress = (project: InstallationProject): string => {
    const parts = [project.siteAddress, project.city, project.stateProvince, project.postalCode].filter(Boolean);
    return parts.join(', ');
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getSatisfactionStars = (rating: number): string => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const getSatisfactionClass = (rating: number): string => {
    if (rating >= 4.5) return 'satisfaction-excellent';
    if (rating >= 4.0) return 'satisfaction-good';
    if (rating >= 3.0) return 'satisfaction-average';
    return 'satisfaction-poor';
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
      <div className="completed-loading">
        <div className="loading-spinner"></div>
        <p>Loading completed projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="completed-error">
        <p>{error}</p>
        <button onClick={initializeAndLoadProjects} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="completed-projects">
      <div className="projects-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search Completed Projects"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">⌕</span>
          </div>
        </div>

        <div className="controls-info">
          <span className="total-projects">
            Completed Projects: {pagination.totalRecords}
          </span>
        </div>
      </div>

      <div className="projects-table-container">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Customer</th>
              <th>Location</th>
              <th>System Size</th>
              <th>Value</th>
              <th>Duration</th>
              <th>Completed Date</th>
              <th>Customer Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="projects-table-row">
                <td className="project-cell">
                  <div className="project-info">
                    <span className="project-name">{project.projectName}</span>
                    <span className="project-id">ID: {project.id.toUpperCase()}</span>
                  </div>
                </td>
                <td className="customer-cell">
                  <div className="customer-info">
                    <span className="customer-name">{project.customerName}</span>
                    <div className="contact-info">
                      <a href={`mailto:${project.customerEmail}`} className="email-link">
                        {project.customerEmail}
                      </a>
                      <a href={`tel:${project.customerPhone}`} className="phone-link">
                        {project.customerPhone}
                      </a>
                    </div>
                  </div>
                </td>
                <td className="address-cell">{formatAddress(project)}</td>
                <td className="system-cell">
                  <div className="system-info">
                    <span className="system-size">{project.systemSize} kW</span>
                    <span className="panel-count">{project.panelCount} panels</span>
                    <span className="inverter-type">{project.inverterType}</span>
                  </div>
                </td>
                <td className="value-cell">{formatCurrency(project.estimatedValue)}</td>
                <td className="duration-cell">
                  <div className="duration-info">
                    {project.actualStartDate && project.actualEndDate && (
                      <>
                        <span className="duration-days">
                          {calculateDuration(project.actualStartDate, project.actualEndDate)} days
                        </span>
                        <span className="duration-schedule">
                          {calculateDuration(project.actualStartDate, project.actualEndDate) <= 
                           calculateDuration(project.scheduledStartDate, project.scheduledEndDate) ? 
                           'On Schedule' : 'Extended'}
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="completion-cell">
                  {project.actualEndDate ? formatDate(project.actualEndDate) : 'N/A'}
                </td>
                <td className="satisfaction-cell">
                  {project.customerSatisfaction ? (
                    <div className="satisfaction-rating">
                      <div className={`stars ${getSatisfactionClass(project.customerSatisfaction)}`}>
                        {getSatisfactionStars(project.customerSatisfaction)}
                      </div>
                      <span className="rating-number">{project.customerSatisfaction.toFixed(1)}/5</span>
                    </div>
                  ) : (
                    <span className="no-rating">Not rated</span>
                  )}
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn"
                      title="View Project Details"
                    >
                      View
                    </button>
                    <button 
                      className="action-btn report-btn"
                      title="Generate Report"
                    >
                      Report
                    </button>
                    <button 
                      className="action-btn photos-btn"
                      title="View Photos"
                    >
                      Photos
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="no-projects">
            <p>No completed projects found. {searchTerm ? 'Try adjusting your search.' : 'No projects have been completed yet.'}</p>
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

      <div className="summary-stats">
        <div className="stat-card">
          <h4 className="stat-title">Total Completed</h4>
          <div className="stat-value">{pagination.totalRecords}</div>
          <div className="stat-subtitle">Projects</div>
        </div>
        
        <div className="stat-card">
          <h4 className="stat-title">Average Rating</h4>
          <div className="stat-value">
            {projects.length > 0 ? (
              projects.filter(p => p.customerSatisfaction)
                .reduce((sum, p) => sum + (p.customerSatisfaction || 0), 0) / 
                projects.filter(p => p.customerSatisfaction).length
            ).toFixed(1) : '0.0'}
          </div>
          <div className="stat-subtitle">Out of 5 stars</div>
        </div>
        
        <div className="stat-card">
          <h4 className="stat-title">Total Value</h4>
          <div className="stat-value">
            {formatCurrency(projects.reduce((sum, p) => sum + p.estimatedValue, 0))}
          </div>
          <div className="stat-subtitle">Revenue Generated</div>
        </div>
        
        <div className="stat-card">
          <h4 className="stat-title">On-Time Rate</h4>
          <div className="stat-value">
            {projects.length > 0 ? (
              (projects.filter(p => 
                p.actualStartDate && p.actualEndDate &&
                calculateDuration(p.actualStartDate, p.actualEndDate) <= 
                calculateDuration(p.scheduledStartDate, p.scheduledEndDate)
              ).length / projects.length * 100).toFixed(1)
            ) : '0.0'}%
          </div>
          <div className="stat-subtitle">Completion Rate</div>
        </div>
      </div>
    </div>
  );
};

export default CompletedProjects;