import React, { useEffect, useState } from 'react';
import './MyTickets.css';
import { supportTicketService } from '../../services/supportTicketService';
import { Ticket, TicketStatus } from '../../types/supportTypes';

type FilterStatus = 'all' | TicketStatus;

const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [processingTickets, setProcessingTickets] = useState<Set<string>>(new Set());

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, activeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await supportTicketService.initialize();
      const ticketsData = await supportTicketService.getTickets();
      
      setTickets(ticketsData);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      setError('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    if (activeFilter === 'all') {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(tickets.filter(ticket => ticket.status === activeFilter));
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  const handleTicketAction = async (ticketId: string, action: 'start_progress' | 'complete' | 'cancel' | 'reopen') => {
    if (processingTickets.has(ticketId)) return;

    setProcessingTickets(prev => new Set(prev).add(ticketId));

    try {
      let newStatus: TicketStatus;
      let resolution: string | undefined;

      switch (action) {
        case 'start_progress':
          newStatus = 'in_progress';
          break;
        case 'complete':
          newStatus = 'resolved';
          resolution = 'Marked as resolved by user';
          break;
        case 'cancel':
          newStatus = 'cancelled';
          resolution = 'Cancelled by user request';
          break;
        case 'reopen':
          newStatus = 'open';
          resolution = undefined;
          break;
        default:
          throw new Error('Invalid action');
      }

      const updatedTicket = await supportTicketService.updateTicketStatus(ticketId, newStatus, resolution);
      
      if (updatedTicket) {
        setTickets(prevTickets => 
          prevTickets.map(ticket => 
            ticket.id === ticketId ? updatedTicket : ticket
          )
        );
        
        // Show success message
        const actionMessages = {
          start_progress: 'Ticket moved to In Progress',
          complete: 'Ticket marked as resolved',
          cancel: 'Ticket cancelled',
          reopen: 'Ticket reopened'
        };
        
        // You could add a toast notification here
        console.log(actionMessages[action]);
      }
    } catch (err) {
      console.error(`Failed to ${action} ticket:`, err);
      setError(`Failed to ${action.replace('_', ' ')} ticket. Please try again.`);
    } finally {
      setProcessingTickets(prev => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });
    }
  };

  const getAvailableActions = (ticket: Ticket) => {
    const actions = [];

    switch (ticket.status) {
      case 'open':
        actions.push({
          id: 'start_progress',
          label: 'Start Progress',
          class: 'action-primary'
        });
        actions.push({
          id: 'cancel',
          label: 'Cancel',
          class: 'action-danger'
        });
        break;
      case 'in_progress':
        actions.push({
          id: 'complete',
          label: 'Mark Complete',
          class: 'action-success'
        });
        actions.push({
          id: 'cancel',
          label: 'Cancel',
          class: 'action-danger'
        });
        break;
      case 'resolved':
        actions.push({
          id: 'reopen',
          label: 'Reopen',
          class: 'action-secondary'
        });
        break;
      case 'cancelled':
        actions.push({
          id: 'reopen',
          label: 'Reopen',
          class: 'action-secondary'
        });
        break;
    }

    return actions;
  };

  const getFilterCount = (status: FilterStatus): number => {
    if (status === 'all') return tickets.length;
    return tickets.filter(ticket => ticket.status === status).length;
  };

  if (loading) {
    return (
      <div className="my-tickets-loading">
        <div className="loading-spinner"></div>
        <p>Loading your tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-tickets-error">
        <p>{error}</p>
        <button onClick={initializeData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="my-tickets">
      <div className="tickets-header">
        <div className="header-content">
          <h2 className="tickets-title">My Support Tickets</h2>
          <div className="tickets-summary">
            Total: {tickets.length} tickets
          </div>
        </div>
        
        <div className="filter-controls">
          <button
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({getFilterCount('all')})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'open' ? 'active' : ''}`}
            onClick={() => setActiveFilter('open')}
          >
            Open ({getFilterCount('open')})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'in_progress' ? 'active' : ''}`}
            onClick={() => setActiveFilter('in_progress')}
          >
            In Progress ({getFilterCount('in_progress')})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'resolved' ? 'active' : ''}`}
            onClick={() => setActiveFilter('resolved')}
          >
            Resolved ({getFilterCount('resolved')})
          </button>
          <button
            className={`filter-btn ${activeFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveFilter('cancelled')}
          >
            Cancelled ({getFilterCount('cancelled')})
          </button>
        </div>
      </div>

      <div className="tickets-container">
        {filteredTickets.length === 0 ? (
          <div className="no-tickets">
            <h3>No tickets found</h3>
            <p>
              {activeFilter === 'all' 
                ? 'You haven\'t submitted any support tickets yet.'
                : `No tickets with status "${activeFilter.replace('_', ' ')}"`
              }
            </p>
          </div>
        ) : (
          <div className="tickets-grid">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-card-header">
                  <div className="ticket-id-section">
                    <span className="ticket-number">{ticket.ticketNumber}</span>
                    <span className={`priority-badge ${getPriorityClass(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                  <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                    {ticket.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="ticket-card-content">
                  <h3 className="ticket-subject">{ticket.subject}</h3>
                  <div className="ticket-details">
                    <div className="detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{ticket.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Created:</span>
                      <span className="detail-value">{formatDate(ticket.createdAt)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Updated:</span>
                      <span className="detail-value">{formatDate(ticket.updatedAt)}</span>
                    </div>
                    {ticket.assignedTo && (
                      <div className="detail-item">
                        <span className="detail-label">Assigned to:</span>
                        <span className="detail-value">{ticket.assignedTo}</span>
                      </div>
                    )}
                  </div>

                  <div className="ticket-description">
                    <p>{ticket.description}</p>
                  </div>

                  {ticket.resolution && (
                    <div className="ticket-resolution">
                      <div className="resolution-label">Resolution:</div>
                      <div className="resolution-text">{ticket.resolution}</div>
                    </div>
                  )}
                </div>

                <div className="ticket-card-actions">
                  {getAvailableActions(ticket).map((action) => (
                    <button
                      key={action.id}
                      className={`action-btn ${action.class}`}
                      onClick={() => handleTicketAction(ticket.id, action.id as any)}
                      disabled={processingTickets.has(ticket.id)}
                    >
                      {processingTickets.has(ticket.id) ? 'Processing...' : action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;