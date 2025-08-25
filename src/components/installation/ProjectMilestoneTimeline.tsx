import React, { useEffect, useState } from 'react';
import './ProjectMilestoneTimeline.css';
import { installationDataService } from '../../services/installationDataService';
import { ProjectMilestone, ProjectTask, MilestoneStatus, TaskStatus } from '../../types/installationTypes';

interface ProjectMilestoneTimelineProps {
  projectId: string;
  className?: string;
}

const ProjectMilestoneTimeline: React.FC<ProjectMilestoneTimelineProps> = ({ 
  projectId, 
  className = '' 
}) => {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMilestoneData();
  }, [projectId]);

  const loadMilestoneData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projectMilestones, projectTasks] = await Promise.all([
        installationDataService.getProjectMilestones(projectId),
        installationDataService.getProjectTasks(projectId)
      ]);
      
      setMilestones(projectMilestones);
      setTasks(projectTasks);
    } catch (err) {
      console.error('Failed to load milestone data:', err);
      setError('Failed to load milestone data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneStatusUpdate = async (milestoneId: string, newStatus: MilestoneStatus) => {
    try {
      await installationDataService.updateMilestoneStatus(milestoneId, newStatus);
      await loadMilestoneData(); // Refresh data
      alert(`Milestone status updated to ${newStatus}!`);
    } catch (err) {
      console.error('Failed to update milestone status:', err);
      alert('Failed to update milestone status. Please try again.');
    }
  };

  const handleTaskStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await installationDataService.updateTaskStatus(taskId, newStatus);
      await loadMilestoneData(); // Refresh data
      alert(`Task status updated to ${newStatus}!`);
    } catch (err) {
      console.error('Failed to update task status:', err);
      alert('Failed to update task status. Please try again.');
    }
  };

  const getMilestoneStatusClass = (status: MilestoneStatus): string => {
    switch (status) {
      case 'Completed':
        return 'milestone-completed';
      case 'In Progress':
        return 'milestone-in-progress';
      case 'Pending':
        return 'milestone-pending';
      case 'Overdue':
        return 'milestone-overdue';
      case 'Blocked':
        return 'milestone-blocked';
      default:
        return 'milestone-default';
    }
  };

  const getTaskStatusClass = (status: TaskStatus): string => {
    switch (status) {
      case 'Completed':
        return 'task-completed';
      case 'In Progress':
        return 'task-in-progress';
      case 'Open':
        return 'task-open';
      case 'On Hold':
        return 'task-on-hold';
      case 'Cancelled':
        return 'task-cancelled';
      default:
        return 'task-default';
    }
  };

  const getTaskPriorityClass = (priority: string): string => {
    switch (priority) {
      case 'Critical':
        return 'priority-critical';
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return 'priority-default';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dateString: string, status: string): boolean => {
    if (status === 'Completed') return false;
    return new Date(dateString) < new Date();
  };

  const getMilestoneTasks = (milestoneId: string): ProjectTask[] => {
    return tasks.filter(task => task.milestoneId === milestoneId);
  };

  const getUnassignedTasks = (): ProjectTask[] => {
    return tasks.filter(task => !task.milestoneId);
  };

  if (loading) {
    return (
      <div className={`milestone-timeline-loading ${className}`}>
        <div className="loading-spinner"></div>
        <p>Loading milestone timeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`milestone-timeline-error ${className}`}>
        <p>{error}</p>
        <button onClick={loadMilestoneData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`project-milestone-timeline ${className}`}>
      <div className="timeline-header">
        <h3 className="timeline-title">Project Milestones & Tasks</h3>
        <div className="timeline-stats">
          <span className="milestone-count">
            {milestones.filter(m => m.status === 'Completed').length} of {milestones.length} milestones completed
          </span>
          <span className="task-count">
            {tasks.filter(t => t.status === 'Completed').length} of {tasks.length} tasks completed
          </span>
        </div>
      </div>

      <div className="timeline-content">
        <div className="timeline-track">
          {milestones.map((milestone, index) => {
            const milestoneTasks = getMilestoneTasks(milestone.id);
            const isLast = index === milestones.length - 1;
            
            return (
              <div key={milestone.id} className="milestone-item">
                <div className="milestone-marker">
                  <div className={`milestone-status-indicator ${getMilestoneStatusClass(milestone.status)}`}>
                    {milestone.status === 'Completed' ? '✓' : index + 1}
                  </div>
                  {!isLast && <div className="timeline-connector"></div>}
                </div>
                
                <div className="milestone-content">
                  <div className="milestone-header">
                    <div className="milestone-info">
                      <h4 className="milestone-name">{milestone.name}</h4>
                      <p className="milestone-description">{milestone.description}</p>
                    </div>
                    
                    <div className="milestone-dates">
                      <div className="milestone-planned">
                        <span className="date-label">Planned:</span>
                        <span className={`date-value ${isOverdue(milestone.plannedDate, milestone.status) ? 'overdue' : ''}`}>
                          {formatDate(milestone.plannedDate)}
                        </span>
                      </div>
                      {milestone.actualDate && (
                        <div className="milestone-actual">
                          <span className="date-label">Actual:</span>
                          <span className="date-value">{formatDate(milestone.actualDate)}</span>
                        </div>
                      )}
                    </div>

                    <div className="milestone-actions">
                      <select 
                        value={milestone.status}
                        onChange={(e) => handleMilestoneStatusUpdate(milestone.id, e.target.value as MilestoneStatus)}
                        className="status-selector"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                    </div>
                  </div>

                  {milestoneTasks.length > 0 && (
                    <div className="milestone-tasks">
                      <h5 className="tasks-title">Associated Tasks ({milestoneTasks.length})</h5>
                      <div className="task-list">
                        {milestoneTasks.map((task) => (
                          <div key={task.id} className="task-item">
                            <div className="task-header">
                              <div className="task-info">
                                <div className="task-title-row">
                                  <span className="task-title">{task.title}</span>
                                  <span className={`task-priority ${getTaskPriorityClass(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                </div>
                                <p className="task-description">{task.description}</p>
                              </div>
                              
                              <div className="task-meta">
                                <div className="task-assignee">
                                  Assigned to: <strong>{task.assignedTo}</strong>
                                </div>
                                <div className="task-due">
                                  Due: <span className={isOverdue(task.dueDate, task.status) ? 'overdue' : ''}>
                                    {formatDate(task.dueDate)}
                                  </span>
                                </div>
                                {task.estimatedHours && (
                                  <div className="task-hours">
                                    Est: {task.estimatedHours}h
                                    {task.actualHours && ` | Actual: ${task.actualHours}h`}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="task-actions">
                              <select 
                                value={task.status}
                                onChange={(e) => handleTaskStatusUpdate(task.id, e.target.value as TaskStatus)}
                                className={`task-status-selector ${getTaskStatusClass(task.status)}`}
                              >
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Unassigned Tasks Section */}
        {getUnassignedTasks().length > 0 && (
          <div className="unassigned-tasks">
            <h4 className="unassigned-title">General Project Tasks</h4>
            <div className="task-list">
              {getUnassignedTasks().map((task) => (
                <div key={task.id} className="task-item standalone">
                  <div className="task-header">
                    <div className="task-info">
                      <div className="task-title-row">
                        <span className="task-title">{task.title}</span>
                        <span className={`task-priority ${getTaskPriorityClass(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="task-description">{task.description}</p>
                    </div>
                    
                    <div className="task-meta">
                      <div className="task-assignee">
                        Assigned to: <strong>{task.assignedTo}</strong>
                      </div>
                      <div className="task-due">
                        Due: <span className={isOverdue(task.dueDate, task.status) ? 'overdue' : ''}>
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="task-actions">
                    <select 
                      value={task.status}
                      onChange={(e) => handleTaskStatusUpdate(task.id, e.target.value as TaskStatus)}
                      className={`task-status-selector ${getTaskStatusClass(task.status)}`}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMilestoneTimeline;