import React, { useEffect, useState, useCallback } from 'react';
import './SRECTasks.css';
import { srecDataService } from '../../services/srecDataService';
import { 
  SRECTask, 
  TaskSearchFilters, 
  PaginationInfo,
  TaskStatus,
  TaskPriority 
} from '../../types/srecTypes';

const SRECTasks: React.FC = () => {
  const [tasks, setTasks] = useState<SRECTask[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 20
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: TaskSearchFilters = {};
      if (searchTerm.trim()) filters.searchTerm = searchTerm;
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      
      const result = await srecDataService.getTasks(
        filters,
        pagination.currentPage,
        pagination.pageSize
      );
      
      setTasks(result.tasks);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, priorityFilter, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map(t => t.id));
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusClass = (status: TaskStatus): string => {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-in-progress';
      case 'On Hold': return 'status-on-hold';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const getPriorityClass = (priority: TaskPriority): string => {
    switch (priority) {
      case 'Low': return 'priority-low';
      case 'Medium': return 'priority-medium';
      case 'High': return 'priority-high';
      case 'Critical': return 'priority-critical';
      default: return 'priority-default';
    }
  };

  const isOverdue = (dueDate: string, status: TaskStatus): boolean => {
    if (status === 'Completed' || status === 'Cancelled') return false;
    return new Date(dueDate) < new Date();
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

  const getTaskStats = () => {
    return {
      totalTasks: pagination.totalRecords,
      openTasks: tasks.filter(t => t.status === 'Open').length,
      inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
      completedTasks: tasks.filter(t => t.status === 'Completed').length,
      overdueTasks: tasks.filter(t => isOverdue(t.dueDate, t.status)).length
    };
  };

  if (loading) {
    return (
      <div className="srec-loading">
        <div className="srec-loading-spinner"></div>
        <p>Loading SREC tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="srec-error">
        <p>{error}</p>
        <button onClick={loadTasks} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  const stats = getTaskStats();

  return (
    <div className="srec-tasks">
      <div className="tasks-header">
        <h2 className="tasks-title">SREC Tasks & Workflow</h2>
        <div className="tasks-actions">
          <button 
            className="create-task-btn"
            onClick={() => setShowCreateModal(true)}
          >
            Create Task +
          </button>
          {selectedTasks.length > 0 && (
            <button className="bulk-action-btn">
              Bulk Actions ({selectedTasks.length})
            </button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="task-stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalTasks}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <div className="stat-value">{stats.openTasks}</div>
            <div className="stat-label">Open Tasks</div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <div className="stat-value">{stats.inProgressTasks}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <div className="stat-value">{stats.completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon"></div>
          <div className="stat-content">
            <div className="stat-value">{stats.overdueTasks}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      </div>

      <div className="tasks-controls">
        <div className="search-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search by Task Title, Category, Assignee..."
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
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | '')}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="tasks-table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedTasks.length === tasks.length && tasks.length > 0}
                  onChange={handleSelectAll}
                  className="table-checkbox"
                />
              </th>
              <th>Task</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assignee</th>
              <th>Due Date</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr 
                key={task.id} 
                className={`${selectedTasks.includes(task.id) ? 'selected' : ''} ${isOverdue(task.dueDate, task.status) ? 'overdue-row' : ''}`}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => handleSelectTask(task.id)}
                    className="table-checkbox"
                  />
                </td>
                <td className="task-info">
                  <div className="task-details">
                    <div className="task-title">{task.title}</div>
                    <div className="task-description">{task.description}</div>
                  </div>
                </td>
                <td>
                  <span className="task-type">{task.category}</span>
                </td>
                <td>
                  <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td>
                  <span className={`task-status ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                  {isOverdue(task.dueDate, task.status) && (
                    <div className="overdue-badge">OVERDUE</div>
                  )}
                </td>
                <td className="assignee-info">
                  <div className="assignee-name">{task.assignedTo}</div>
                </td>
                <td className="due-date">
                  <div className={isOverdue(task.dueDate, task.status) ? 'overdue' : ''}>
                    {formatDate(task.dueDate)}
                  </div>
                </td>
                <td className="progress-cell">
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${task.status === 'Completed' ? '100' : task.status === 'In Progress' ? '50' : '0'}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{task.status === 'Completed' ? '100' : task.status === 'In Progress' ? '50' : '0'}%</span>
                  </div>
                </td>
                <td className="actions-column">
                  <div className="action-buttons">
                    <button className="action-btn view-btn" title="View Task">
                      
                    </button>
                    <button className="action-btn edit-btn" title="Edit Task">
                      ✏️
                    </button>
                    <button className="action-btn comment-btn" title="Add Comment">
                      
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon"></div>
          <p>No tasks found matching your criteria.</p>
          <button 
            className="create-task-btn"
            onClick={() => setShowCreateModal(true)}
          >
            Create Your First Task
          </button>
        </div>
      )}

      <div className="pagination-container">
        <div className="pagination-info">
          Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1}-{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of {pagination.totalRecords} tasks
        </div>
        <div className="pagination-controls">
          {renderPagination()}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="create-task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New SREC Task</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="task-form">
                <div className="form-section">
                  <h4>Task Information</h4>
                  <div className="form-group">
                    <label>Task Title</label>
                    <input type="text" placeholder="Enter task title" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea placeholder="Enter task description" className="form-textarea"></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Task Type</label>
                      <select className="form-select">
                        <option>Verification</option>
                        <option>Registration</option>
                        <option>Trading</option>
                        <option>Compliance</option>
                        <option>Reporting</option>
                        <option>Customer Service</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Priority</label>
                      <select className="form-select">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Assignment & Timeline</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Assignee</label>
                      <select className="form-select">
                        <option>Select assignee...</option>
                        <option>Sarah Chen</option>
                        <option>Michael Rodriguez</option>
                        <option>Emily Johnson</option>
                        <option>David Kumar</option>
                        <option>Lisa Thompson</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Due Date</label>
                      <input type="date" className="form-input" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Related SRECs</label>
                    <input type="text" placeholder="Enter SREC Certificate IDs (comma-separated)" className="form-input" />
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary">
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SRECTasks;