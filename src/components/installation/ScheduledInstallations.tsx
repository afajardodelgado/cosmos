import React, { useEffect, useState } from 'react';
import './ScheduledInstallations.css';
import { installationDataService } from '../../services/installationDataService';
import { ScheduledVisit, UpcomingInstallation } from '../../types/installationTypes';

const ScheduledInstallations: React.FC = () => {
  const [scheduledVisits, setScheduledVisits] = useState<ScheduledVisit[]>([]);
  const [upcomingInstallations, setUpcomingInstallations] = useState<UpcomingInstallation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAndLoadSchedule();
  }, []);

  const initializeAndLoadSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      await installationDataService.initialize();
      
      const [visits, installations] = await Promise.all([
        installationDataService.getScheduledVisits(),
        installationDataService.getUpcomingInstallations(10)
      ]);
      
      setScheduledVisits(visits);
      setUpcomingInstallations(installations);
    } catch (err) {
      console.error('Failed to load scheduled installations:', err);
      setError('Failed to load scheduled installations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getVisitTypeClass = (visitType: string): string => {
    switch (visitType) {
      case 'Site Survey':
        return 'visit-survey';
      case 'Installation':
        return 'visit-installation';
      case 'Inspection':
        return 'visit-inspection';
      case 'Service Call':
        return 'visit-service';
      case 'Final Walkthrough':
        return 'visit-walkthrough';
      default:
        return 'visit-default';
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'Scheduled':
        return 'status-scheduled';
      case 'In Progress':
        return 'status-progress';
      case 'Completed':
        return 'status-completed';
      case 'Cancelled':
        return 'status-cancelled';
      case 'Rescheduled':
        return 'status-rescheduled';
      default:
        return 'status-default';
    }
  };

  const getDaysUntil = (dateString: string): number => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysUntilText = (days: number): string => {
    if (days < 0) return `${Math.abs(days)} days ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  if (loading) {
    return (
      <div className="scheduled-loading">
        <div className="loading-spinner"></div>
        <p>Loading scheduled installations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scheduled-error">
        <p>{error}</p>
        <button onClick={initializeAndLoadSchedule} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="scheduled-installations">
      <div className="schedule-content">
        <div className="schedule-section">
          <div className="section-header">
            <h3 className="section-title">Scheduled Site Visits</h3>
            <button className="schedule-btn">Schedule New Visit</button>
          </div>
          
          <div className="visits-grid">
            {scheduledVisits.map((visit) => (
              <div key={visit.id} className="visit-card">
                <div className="visit-header">
                  <div className="visit-date-time">
                    <div className="visit-date">{formatDate(visit.scheduledDate)}</div>
                    <div className="visit-time">{formatTime(visit.scheduledTime)}</div>
                  </div>
                  <span className={`visit-type-badge ${getVisitTypeClass(visit.visitType)}`}>
                    {visit.visitType}
                  </span>
                </div>
                
                <div className="visit-project">
                  <h4 className="project-name">{visit.projectName}</h4>
                  <p className="customer-name">{visit.customerName}</p>
                </div>
                
                <div className="visit-location">
                  <span className="location-icon">📍</span>
                  <span className="address">{visit.siteAddress}</span>
                </div>
                
                <div className="visit-crew">
                  <span className="crew-label">Assigned Crew:</span>
                  <div className="crew-members">
                    {visit.assignedCrew.map((crew, index) => (
                      <span key={crew.id} className="crew-member">
                        {crew.name}
                        {index < visit.assignedCrew.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="visit-details">
                  <div className="duration">
                    Duration: {visit.estimatedDuration}h
                  </div>
                  <span className={`status-badge ${getStatusClass(visit.status)}`}>
                    {visit.status}
                  </span>
                </div>
                
                {visit.notes && (
                  <div className="visit-notes">
                    <strong>Notes:</strong> {visit.notes}
                  </div>
                )}
                
                <div className="visit-actions">
                  <button className="action-btn view-btn">View Details</button>
                  <button className="action-btn edit-btn">Edit</button>
                  <button className="action-btn reschedule-btn">Reschedule</button>
                </div>
              </div>
            ))}
          </div>
          
          {scheduledVisits.length === 0 && (
            <div className="no-visits">
              <p>No scheduled visits found. Schedule your first visit!</p>
            </div>
          )}
        </div>

        <div className="schedule-section">
          <div className="section-header">
            <h3 className="section-title">Upcoming Installation Pipeline</h3>
          </div>
          
          <div className="pipeline-list">
            {upcomingInstallations.map((installation) => {
              const daysUntil = getDaysUntil(installation.scheduledDate);
              return (
                <div key={installation.id} className="pipeline-item">
                  <div className="pipeline-date">
                    <div className="date-badge">
                      <div className="date-day">
                        {new Date(installation.scheduledDate).getDate()}
                      </div>
                      <div className="date-month">
                        {new Date(installation.scheduledDate).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                    <div className="days-until">
                      {getDaysUntilText(daysUntil)}
                    </div>
                  </div>
                  
                  <div className="pipeline-content">
                    <div className="pipeline-project">
                      <h4 className="project-title">{installation.projectName}</h4>
                      <p className="project-customer">{installation.customerName}</p>
                      <p className="project-location">{installation.siteAddress}</p>
                    </div>
                    
                    <div className="pipeline-crew">
                      <div className="crew-info">
                        <span className="crew-label">Crew:</span>
                        <div className="crew-names">
                          {installation.assignedCrew.length > 0 ? (
                            installation.assignedCrew.map((crewName, index) => (
                              <span key={index} className="crew-name">
                                {crewName}
                                {index < installation.assignedCrew.length - 1 && ', '}
                              </span>
                            ))
                          ) : (
                            <span className="no-crew">Not assigned</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pipeline-actions">
                    <button className="action-btn assign-btn">Assign Crew</button>
                    <button className="action-btn details-btn">Details</button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {upcomingInstallations.length === 0 && (
            <div className="no-pipeline">
              <p>No upcoming installations in the pipeline.</p>
            </div>
          )}
        </div>
      </div>

      <div className="schedule-sidebar">
        <div className="calendar-widget">
          <h4 className="widget-title">Calendar Overview</h4>
          <div className="calendar-placeholder">
            <p>Calendar integration coming soon...</p>
          </div>
        </div>
        
        <div className="crew-availability">
          <h4 className="widget-title">Crew Availability</h4>
          <div className="availability-list">
            <div className="availability-item">
              <div className="crew-status available">
                <span className="status-dot"></span>
                <span className="crew-name">Mike Rodriguez</span>
              </div>
              <span className="availability-text">Available</span>
            </div>
            <div className="availability-item">
              <div className="crew-status available">
                <span className="status-dot"></span>
                <span className="crew-name">Sarah Chen</span>
              </div>
              <span className="availability-text">Available</span>
            </div>
            <div className="availability-item">
              <div className="crew-status busy">
                <span className="status-dot"></span>
                <span className="crew-name">David Thompson</span>
              </div>
              <span className="availability-text">On Project</span>
            </div>
          </div>
        </div>
        
        <div className="quick-stats">
          <h4 className="widget-title">Quick Stats</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{scheduledVisits.length}</div>
              <div className="stat-label">Scheduled Visits</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{upcomingInstallations.length}</div>
              <div className="stat-label">Upcoming Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">3</div>
              <div className="stat-label">Available Crew</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledInstallations;