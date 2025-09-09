import React, { useEffect, useState } from 'react';
import './ActiveProjects.css';
import { installationDataService } from '../../services/installationDataService';
import { InstallationProject, InstallationSearchFilters, PaginationInfo, InstallationStage, ProjectTask, ProjectMilestone } from '../../types/installationTypes';

const ActiveProjects: React.FC = () => {
  const [projects, setProjects] = useState<InstallationProject[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 20
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<InstallationStage | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<'High Priority' | 'Has Overdue Tasks' | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectTasks, setProjectTasks] = useState<Record<string, ProjectTask[]>>({});
  const [projectMilestones, setProjectMilestones] = useState<Record<string, ProjectMilestone[]>>({});

  useEffect(() => {
    initializeAndLoadProjects();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadProjects();
  }, [searchTerm, stageFilter, priorityFilter, pagination.currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeAndLoadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      await installationDataService.initialize();
      await loadProjects();
    } catch (err) {
      console.error('Failed to initialize active projects:', err);
      setError('Failed to load active projects. Please try again.');
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
      if (stageFilter) {
        filters.stage = stageFilter;
      }

      const result = await installationDataService.getActiveProjects(filters, pagination.currentPage, pagination.pageSize);
      let filteredProjects = result.records;
      
      // Load task and milestone data for each project
      const tasksData: Record<string, ProjectTask[]> = {};
      const milestonesData: Record<string, ProjectMilestone[]> = {};
      
      for (const project of filteredProjects) {
        const [tasks, milestones] = await Promise.all([
          installationDataService.getProjectTasks(project.id),
          installationDataService.getProjectMilestones(project.id)
        ]);
        tasksData[project.id] = tasks;
        milestonesData[project.id] = milestones;
      }
      
      // Apply priority-based filters
      if (priorityFilter === 'High Priority') {
        filteredProjects = filteredProjects.filter(project => {
          const tasks = tasksData[project.id] || [];
          return tasks.some(task => task.priority === 'Critical' || task.priority === 'High');
        });
      } else if (priorityFilter === 'Has Overdue Tasks') {
        filteredProjects = filteredProjects.filter(project => {
          const tasks = tasksData[project.id] || [];
          return tasks.some(task => {
            if (task.status === 'Completed') return false;
            return new Date(task.dueDate) < new Date();
          });
        });
      }
      
      setProjects(filteredProjects);
      setProjectTasks(tasksData);
      setProjectMilestones(milestonesData);
      setPagination(prev => ({
        ...prev,
        totalRecords: filteredProjects.length,
        totalPages: Math.ceil(filteredProjects.length / prev.pageSize)
      }));
    } catch (err) {
      console.error('Failed to load active projects:', err);
      setError('Failed to load active projects. Please try again.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleStageFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStageFilter(e.target.value as InstallationStage | '');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePriorityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriorityFilter(e.target.value as 'High Priority' | 'Has Overdue Tasks' | '');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleStageUpdate = async (projectId: string, newStage: InstallationStage) => {
    try {
      await installationDataService.updateProjectStage(projectId, newStage);
      await loadProjects(); // Refresh the list
      alert(`Project stage updated to ${newStage}!`);
    } catch (err) {
      console.error('Failed to update project stage:', err);
      alert('Failed to update project stage. Please try again.');
    }
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

  const getStageClass = (stage: string): string => {
    switch (stage) {
      case 'Scheduled':
        return 'stage-scheduled';
      case 'Site Survey':
        return 'stage-survey';
      case 'Permits Pending':
        return 'stage-permits';
      case 'Installation In Progress':
        return 'stage-progress';
      case 'Inspection':
        return 'stage-inspection';
      case 'On Hold':
        return 'stage-hold';
      default:
        return 'stage-default';
    }
  };

  const getNextStage = (currentStage: InstallationStage): InstallationStage | null => {
    switch (currentStage) {
      case 'Scheduled':
        return 'Site Survey';
      case 'Site Survey':
        return 'Permits Pending';
      case 'Permits Pending':
        return 'Installation In Progress';
      case 'Installation In Progress':
        return 'Inspection';
      case 'Inspection':
        return 'Completed';
      default:
        return null;
    }
  };

  const canAdvanceStage = (stage: InstallationStage): boolean => {
    return ['Scheduled', 'Site Survey', 'Permits Pending', 'Installation In Progress', 'Inspection'].includes(stage);
  };

  const getProjectTaskSummary = (projectId: string) => {
    const tasks = projectTasks[projectId] || [];
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const overdue = tasks.filter(t => {
      if (t.status === 'Completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length;
    const highPriority = tasks.filter(t => t.priority === 'Critical' || t.priority === 'High').length;
    
    return { total, completed, overdue, highPriority };
  };

  const getMilestoneSummary = (projectId: string) => {
    const milestones = projectMilestones[projectId] || [];
    const total = milestones.length;
    const completed = milestones.filter(m => m.status === 'Completed').length;
    const overdue = milestones.filter(m => {
      if (m.status === 'Completed') return false;
      return new Date(m.plannedDate) < new Date();
    }).length;
    
    return { total, completed, overdue };
  };

  const getTaskPriorityIndicator = (projectId: string) => {
    const summary = getProjectTaskSummary(projectId);
    if (summary.overdue > 0) return { type: 'overdue', count: summary.overdue };
    if (summary.highPriority > 0) return { type: 'high-priority', count: summary.highPriority };
    return null;
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
      <div className="projects-loading">
        <div className="loading-spinner"></div>
        <p>Loading active projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-error">
        <p>{error}</p>
        <button onClick={initializeAndLoadProjects} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="active-projects">
      <div className="projects-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search Projects"
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
            <option value="Scheduled">Scheduled</option>
            <option value="Site Survey">Site Survey</option>
            <option value="Permits Pending">Permits Pending</option>
            <option value="Installation In Progress">Installation In Progress</option>
            <option value="Inspection">Inspection</option>
            <option value="On Hold">On Hold</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={handlePriorityFilterChange}
            className="priority-filter"
          >
            <option value="">All Projects</option>
            <option value="High Priority">High Priority Tasks</option>
            <option value="Has Overdue Tasks">Projects with Overdue Tasks</option>
          </select>
        </div>

        <div className="controls-info">
          <span className="total-projects">
            Active Projects: {pagination.totalRecords}
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
              <th>Stage</th>
              <th>Progress</th>
              <th>Tasks & Milestones</th>
              <th>Crew</th>
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
                  </div>
                </td>
                <td className="value-cell">{formatCurrency(project.estimatedValue)}</td>
                <td className="stage-cell">
                  <span className={`stage-badge ${getStageClass(project.stage)}`}>
                    {project.stage}
                  </span>
                </td>
                <td className="progress-cell">
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{project.progress}%</span>
                  </div>
                </td>
                <td className="tasks-milestones-cell">
                  <div className="task-milestone-summary">
                    <div className="task-summary-item">
                      <span className="summary-label">Tasks:</span>
                      <span className="summary-value">
                        {getProjectTaskSummary(project.id).completed}/{getProjectTaskSummary(project.id).total}
                      </span>
                      {getTaskPriorityIndicator(project.id) && (
                        <span className={`task-indicator ${getTaskPriorityIndicator(project.id)?.type}`}>
                          {getTaskPriorityIndicator(project.id)?.count}
                          {getTaskPriorityIndicator(project.id)?.type === 'overdue' ? ' overdue' : ' high priority'}
                        </span>
                      )}
                    </div>
                    <div className="milestone-summary-item">
                      <span className="summary-label">Milestones:</span>
                      <span className="summary-value">
                        {getMilestoneSummary(project.id).completed}/{getMilestoneSummary(project.id).total}
                      </span>
                      {getMilestoneSummary(project.id).overdue > 0 && (
                        <span className="milestone-indicator overdue">
                          {getMilestoneSummary(project.id).overdue} overdue
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="crew-cell">
                  {project.assignedCrew.length > 0 ? (
                    <div className="crew-list">
                      {project.assignedCrew.map((crew, index) => (
                        <span key={crew.id} className="crew-member">
                          {crew.name}
                          {index < project.assignedCrew.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="no-crew">Not assigned</span>
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
                    {canAdvanceStage(project.stage) && (
                      <button 
                        className="action-btn advance-btn"
                        onClick={() => {
                          const nextStage = getNextStage(project.stage);
                          if (nextStage) {
                            handleStageUpdate(project.id, nextStage);
                          }
                        }}
                        title={`Advance to ${getNextStage(project.stage) || 'Next Stage'}`}
                      >
                        {project.stage === 'Scheduled' ? 'Start Survey' :
                         project.stage === 'Site Survey' ? 'Submit Permits' :
                         project.stage === 'Permits Pending' ? 'Begin Install' :
                         project.stage === 'Installation In Progress' ? 'Schedule Insp.' :
                         'Complete'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="no-projects">
            <p>No active projects found. {searchTerm || stageFilter ? 'Try adjusting your filters.' : 'All projects are completed!'}</p>
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

export default ActiveProjects;