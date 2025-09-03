import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SupportDashboard.css';
import { supportTicketService } from '../../services/supportTicketService';
import { Ticket, TicketStats } from '../../types/supportTypes';

const SupportDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await supportTicketService.initialize();
      
      const [statsData, tickets] = await Promise.all([
        supportTicketService.getTicketStats(),
        supportTicketService.getRecentTickets(5)
      ]);
      
      setStats(statsData);
      setRecentTickets(tickets);
    } catch (err) {
      console.error('Failed to load support dashboard data:', err);
      setError('Failed to load support dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'open':
        return 'status-open';
      case 'in_progress':
        return 'status-progress';
      case 'resolved':
        return 'status-resolved';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const getPriorityClass = (priority: string): string => {
    switch (priority) {
      case 'urgent':
        return 'priority-urgent';
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-default';
    }
  };

  const handleViewTicket = (ticketId: string): void => {
    navigate(`/partners/es-portal/support/tickets?highlight=${ticketId}`);
  };

  if (loading) {
    return (
      <div className="support-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading support dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="support-dashboard-error">
        <p>{error}</p>
        <button onClick={initializeData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="support-dashboard">
      <div className="dashboard-content">
        <div className="main-dashboard">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <h3 className="stat-title">Open Tickets</h3>
              </div>
              <div className="stat-value-container">
                <div className="stat-value">{stats?.totalOpen || 0}</div>
                <div className="stat-label">Active Issues</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <h3 className="stat-title">In Progress</h3>
              </div>
              <div className="stat-value-container">
                <div className="stat-value">{stats?.inProgress || 0}</div>
                <div className="stat-label">Being Resolved</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <h3 className="stat-title">Resolved Today</h3>
              </div>
              <div className="stat-value-container">
                <div className="stat-value">{stats?.resolvedToday || 0}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <h3 className="stat-title">Avg Response</h3>
              </div>
              <div className="stat-value-container">
                <div className="stat-value-text">{stats?.avgResponseTime || 'N/A'}</div>
                <div className="stat-label">Response Time</div>
              </div>
            </div>
          </div>

          {/* Recent Tickets */}
          <div className="recent-tickets-section">
            <div className="section-header">
              <h2 className="section-title">Recent Tickets</h2>
              <Link to="/partners/es-portal/support/tickets" className="view-all-link">
                View All Tickets
              </Link>
            </div>
            
            <div className="tickets-table">
              {recentTickets.length === 0 ? (
                <div className="no-tickets">
                  <p>No tickets found.</p>
                  <Link to="/partners/es-portal/support/submit" className="create-ticket-btn">
                    Submit Your First Ticket
                  </Link>
                </div>
              ) : (
                <div className="tickets-list">
                  {recentTickets.map((ticket) => (
                    <div key={ticket.id} className="ticket-item">
                      <div className="ticket-main-info">
                        <div className="ticket-header">
                          <span className="ticket-number">{ticket.ticketNumber}</span>
                          <span className={`priority-badge ${getPriorityClass(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="ticket-subject">{ticket.subject}</div>
                        <div className="ticket-meta">
                          <span className="ticket-category">{ticket.category}</span>
                          <span className="ticket-date">{formatDate(ticket.updatedAt)}</span>
                          <span className="ticket-customer">{ticket.customerName}</span>
                        </div>
                      </div>
                      <div className="ticket-actions">
                        <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <button 
                          onClick={() => handleViewTicket(ticket.id)}
                          className="view-ticket-btn"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="quick-actions-sidebar">
          <div className="quick-actions-section">
            <h3 className="sidebar-title">Quick Actions</h3>
            
            <div className="quick-actions-list">
              <Link to="/partners/es-portal/support/submit" className="quick-action-btn">
                <div className="action-icon">+</div>
                <div className="action-content">
                  <div className="action-title">Submit New Ticket</div>
                  <div className="action-description">Report an issue or ask a question</div>
                </div>
              </Link>

              <Link to="/partners/es-portal/support/tickets" className="quick-action-btn">
                <div className="action-icon">📋</div>
                <div className="action-content">
                  <div className="action-title">View All Tickets</div>
                  <div className="action-description">See your complete ticket history</div>
                </div>
              </Link>

              <button className="quick-action-btn" onClick={() => window.open('mailto:support@cosmosbyqcells.com')}>
                <div className="action-icon">✉</div>
                <div className="action-content">
                  <div className="action-title">Email Support</div>
                  <div className="action-description">Direct email to support team</div>
                </div>
              </button>
            </div>
          </div>

          <div className="support-info-section">
            <h3 className="sidebar-title">Support Hours</h3>
            <div className="support-hours">
              <div className="hours-item">
                <span className="day">Monday - Friday</span>
                <span className="time">8:00 AM - 6:00 PM EST</span>
              </div>
              <div className="hours-item">
                <span className="day">Saturday</span>
                <span className="time">9:00 AM - 2:00 PM EST</span>
              </div>
              <div className="hours-item">
                <span className="day">Sunday</span>
                <span className="time">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;