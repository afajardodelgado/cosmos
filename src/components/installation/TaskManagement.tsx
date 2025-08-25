import React, { useEffect, useState } from 'react';
import './TaskManagement.css';
import { installationDataService } from '../../services/installationDataService';
import { 
  ProjectTask, 
  CrewMember,
  InstallationProject,
  TaskStatus,
  TaskPriority,
  PaginationInfo 
} from '../../types/installationTypes';

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [projects, setProjects] = useState<InstallationProject[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 20
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    initializeAndLoadData();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [
    searchTerm, 
    statusFilter, 
    priorityFilter, 
    assigneeFilter, 
    projectFilter,
    showOverdueOnly,
    pagination.currentPage
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeAndLoadData = async () => {
    try {
      setLoading(true);
      setError(null);
      await installationDataService.initialize();
      
      const [allProjects, allCrew] = await Promise.all([
        installationDataService.getProjects(),
        installationDataService.getCrewMembers()
      ]);
      
      setProjects(allProjects.records);
      setCrew(allCrew);
      await loadTasks();
    } catch (err) {
      console.error('Failed to initialize task management:', err);
      setError('Failed to load task management. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      // Get all tasks from all projects
      const allProjectTasks: ProjectTask[] = [];
      
      for (const project of projects) {
        const projectTasks = await installationDataService.getProjectTasks(project.id);
        allProjectTasks.push(...projectTasks);
      }

      // Apply filters
      let filteredTasks = allProjectTasks;

      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
        );
      }

      if (statusFilter) {
        filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
      }

      if (priorityFilter) {
        filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
      }

      if (assigneeFilter) {
        filteredTasks = filteredTasks.filter(task => task.assignedTo === assigneeFilter);
      }

      if (projectFilter) {
        filteredTasks = filteredTasks.filter(task => task.projectId === projectFilter);
      }

      if (showOverdueOnly) {
        filteredTasks = filteredTasks.filter(task => {
          if (task.status === 'Completed') return false;
          return new Date(task.dueDate) < new Date();
        });
      }

      // Sort by priority and due date
      filteredTasks.sort((a, b) => {
        const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });

      // Pagination
      const totalRecords = filteredTasks.length;
      const totalPages = Math.ceil(totalRecords / pagination.pageSize);
      const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

      setTasks(paginatedTasks);
      setPagination(prev => ({
        ...prev,
        totalPages,
        totalRecords
      }));

    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks. Please try again.');
    }
  };

  const handleTaskStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await installationDataService.updateTaskStatus(taskId, newStatus);
      await loadTasks();
      alert(`Task status updated to ${newStatus}!`);
    } catch (err) {
      console.error('Failed to update task status:', err);
      alert('Failed to update task status. Please try again.');
    }
  };

  const handleTaskAssignment = async (taskId: string, assignedTo: string) => {
    try {
      await installationDataService.assignTask(taskId, assignedTo);
      await loadTasks();
      alert('Task assignment updated!');
    } catch (err) {
      console.error('Failed to assign task:', err);
      alert('Failed to assign task. Please try again.');
    }
  };

  const getProjectName = (projectId: string): string => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.projectName : 'Unknown Project';
  };

  const getCrewMemberName = (crewId: string): string => {
    const member = crew.find(c => c.id === crewId);
    return member ? member.name : 'Unknown';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dateString: string, status: TaskStatus): boolean => {
    if (status === 'Completed') return false;
    return new Date(dateString) < new Date();
  };

  const getStatusClass = (status: TaskStatus): string => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-in-progress';
      case 'Open': return 'status-open';
      case 'On Hold': return 'status-on-hold';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const getPriorityClass = (priority: TaskPriority): string => {
    switch (priority) {
      case 'Critical': return 'priority-critical';
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-default';
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key="first" onClick={() => handlePageChange(1)} className="pagination-btn">
          First
        </button>
      );
    }

    if (pagination.currentPage > 1) {
      pages.push(
        <button key="prev" onClick={() => handlePageChange(pagination.currentPage - 1)} className="pagination-btn">
          Previous
        </button>
      );
    }

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

    if (pagination.currentPage < pagination.totalPages) {
      pages.push(
        <button key="next" onClick={() => handlePageChange(pagination.currentPage + 1)} className="pagination-btn">
          Next
        </button>
      );
    }

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
      <div className="task-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-management-error">
        <p>{error}</p>
        <button onClick={initializeAndLoadData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="task-management">
      <div className="task-controls">
        <div className="search-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search Tasks"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">⌕</span>
          </div>
        </div>

        <div className="filter-section">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | '')}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Assignees</option>
            {crew.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.projectName}</option>
            ))}
          </select>

          <label className="overdue-filter">
            <input
              type="checkbox"
              checked={showOverdueOnly}
              onChange={(e) => setShowOverdueOnly(e.target.checked)}
            />
            Overdue Only
          </label>
        </div>

        <div className="action-section">
          <button 
            className="create-task-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Task +
          </button>
        </div>
      </div>

      <div className="task-summary">
        <div className="summary-card">
          <div className="summary-value">{tasks.filter(t => t.status === 'Open').length}</div>
          <div className="summary-label">Open Tasks</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{tasks.filter(t => t.status === 'In Progress').length}</div>
          <div className="summary-label">In Progress</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">
            {tasks.filter(t => t.status !== 'Completed' && isOverdue(t.dueDate, t.status)).length}
          </div>
          <div className="summary-label">Overdue</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">{pagination.totalRecords}</div>
          <div className="summary-label">Total Tasks</div>
        </div>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <div className="task-title-section">
                <div className="task-title-row">
                  <h4 className="task-title">{task.title}</h4>
                  <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-project">
                  Project: <strong>{getProjectName(task.projectId)}</strong>
                </div>
              </div>

              <div className="task-status-section">
                <span className={`task-status ${getStatusClass(task.status)}`}>
                  {task.status}
                </span>
              </div>
            </div>

            <div className="task-body">
              <div className="task-details">
                <div className="task-assignee">
                  <strong>Assigned to:</strong> {getCrewMemberName(task.assignedTo)}
                </div>
                <div className="task-due">
                  <strong>Due:</strong> 
                  <span className={isOverdue(task.dueDate, task.status) ? 'overdue' : ''}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
                {task.estimatedHours && (
                  <div className="task-hours">
                    <strong>Estimated:</strong> {task.estimatedHours}h
                    {task.actualHours && ` | Actual: ${task.actualHours}h`}
                  </div>
                )}
              </div>

              <div className="task-actions">
                <select
                  value={task.status}
                  onChange={(e) => handleTaskStatusUpdate(task.id, e.target.value as TaskStatus)}
                  className="action-select status-select"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <select
                  value={task.assignedTo}
                  onChange={(e) => handleTaskAssignment(task.id, e.target.value)}
                  className="action-select assignee-select"
                >
                  {crew.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>

                <button className="task-detail-btn" title="View Details">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="no-tasks">
          <p>No tasks found matching your filters.</p>
        </div>
      )}

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

      {/* Create Task Modal Placeholder */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="create-task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Task</h3>
              <button className="modal-close" onClick={() => setIsCreateModalOpen(false)}>×</button>
            </div>
            <div className="modal-content">
              <p>Task creation form coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;