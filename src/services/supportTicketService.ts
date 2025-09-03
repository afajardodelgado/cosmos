import { Ticket, TicketStats, TicketStatus, CreateTicketData } from '../types/supportTypes';

class SupportTicketService {
  private tickets: Ticket[] = [
    {
      id: '1',
      ticketNumber: 'TKT-2024-0001',
      subject: 'Solar panel not generating expected output',
      category: 'hardware',
      priority: 'high',
      status: 'in_progress',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      description: 'Panels showing only 70% of expected efficiency. Need technical review.',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '555-0123',
      customerCompany: 'Smith Solar Solutions',
      userType: 'partner',
      assignedTo: 'Tech Support Team'
    },
    {
      id: '2',
      ticketNumber: 'TKT-2024-0002',
      subject: 'Installation schedule conflict',
      category: 'installation',
      priority: 'medium',
      status: 'open',
      createdAt: '2024-01-16T09:15:00Z',
      updatedAt: '2024-01-16T09:15:00Z',
      description: 'Customer requested installation date conflicts with permit timeline.',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.johnson@email.com',
      customerCompany: 'Green Energy Partners',
      userType: 'partner'
    },
    {
      id: '3',
      ticketNumber: 'TKT-2024-0003',
      subject: 'Financing application status',
      category: 'financing',
      priority: 'low',
      status: 'resolved',
      createdAt: '2024-01-14T16:20:00Z',
      updatedAt: '2024-01-16T11:45:00Z',
      description: 'Customer inquiring about financing application approval status.',
      customerName: 'Mike Davis',
      customerEmail: 'mike.davis@email.com',
      customerPhone: '555-0456',
      userType: 'homeowner',
      resolution: 'Application approved and customer notified via email.'
    },
    {
      id: '4',
      ticketNumber: 'TKT-2024-0004',
      subject: 'Portal login issues',
      category: 'general',
      priority: 'medium',
      status: 'in_progress',
      createdAt: '2024-01-16T11:30:00Z',
      updatedAt: '2024-01-16T13:15:00Z',
      description: 'Unable to access partner portal after password reset.',
      customerName: 'Lisa Rodriguez',
      customerEmail: 'lisa.rodriguez@email.com',
      customerCompany: 'Rodriguez Energy',
      userType: 'partner',
      assignedTo: 'IT Support'
    },
    {
      id: '5',
      ticketNumber: 'TKT-2024-0005',
      subject: 'Equipment delivery delay',
      category: 'hardware',
      priority: 'urgent',
      status: 'open',
      createdAt: '2024-01-16T14:45:00Z',
      updatedAt: '2024-01-16T14:45:00Z',
      description: 'Solar equipment delivery is delayed by 2 weeks, affecting installation timeline.',
      customerName: 'Robert Chen',
      customerEmail: 'robert.chen@email.com',
      customerPhone: '555-0789',
      customerCompany: 'Chen Solar Systems',
      userType: 'partner'
    },
    {
      id: '6',
      ticketNumber: 'TKT-2024-0006',
      subject: 'Sales commission inquiry',
      category: 'sales',
      priority: 'low',
      status: 'resolved',
      createdAt: '2024-01-13T10:00:00Z',
      updatedAt: '2024-01-15T16:30:00Z',
      description: 'Question about commission calculation for Q4 2023.',
      customerName: 'Jennifer Wilson',
      customerEmail: 'jennifer.wilson@email.com',
      customerCompany: 'Wilson Solar Group',
      userType: 'partner',
      resolution: 'Commission details sent via email with breakdown.'
    },
    {
      id: '7',
      ticketNumber: 'TKT-2024-0007',
      subject: 'System monitoring alerts',
      category: 'hardware',
      priority: 'medium',
      status: 'cancelled',
      createdAt: '2024-01-12T08:30:00Z',
      updatedAt: '2024-01-14T09:00:00Z',
      description: 'Receiving false monitoring alerts from solar system.',
      customerName: 'David Thompson',
      customerEmail: 'david.thompson@email.com',
      customerPhone: '555-0321',
      userType: 'homeowner',
      resolution: 'Cancelled at customer request - resolved internally.'
    },
    {
      id: '8',
      ticketNumber: 'TKT-2024-0008',
      subject: 'Training session request',
      category: 'general',
      priority: 'low',
      status: 'in_progress',
      createdAt: '2024-01-15T13:20:00Z',
      updatedAt: '2024-01-16T10:00:00Z',
      description: 'Request for additional training on new portal features.',
      customerName: 'Amanda Garcia',
      customerEmail: 'amanda.garcia@email.com',
      customerCompany: 'Garcia Renewable Energy',
      userType: 'partner',
      assignedTo: 'Training Team'
    },
    {
      id: '9',
      ticketNumber: 'TKT-2024-0009',
      subject: 'Permit application support',
      category: 'installation',
      priority: 'high',
      status: 'open',
      createdAt: '2024-01-16T15:10:00Z',
      updatedAt: '2024-01-16T15:10:00Z',
      description: 'Need assistance with local permit application requirements.',
      customerName: 'Kevin Lee',
      customerEmail: 'kevin.lee@email.com',
      customerPhone: '555-0654',
      customerCompany: 'Lee Solar Installations',
      userType: 'partner'
    },
    {
      id: '10',
      ticketNumber: 'TKT-2024-0010',
      subject: 'Invoice discrepancy',
      category: 'financing',
      priority: 'medium',
      status: 'resolved',
      createdAt: '2024-01-14T12:00:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      description: 'Customer reports billing amount differs from contract.',
      customerName: 'Nicole Brown',
      customerEmail: 'nicole.brown@email.com',
      userType: 'homeowner',
      resolution: 'Billing error corrected and refund processed.'
    }
  ];

  private ticketCounter = 11;

  // Initialize service (no async operations needed for mock data)
  async initialize(): Promise<void> {
    // Mock async initialization
    return Promise.resolve();
  }

  // Get all tickets
  async getTickets(): Promise<Ticket[]> {
    // Sort by created date (newest first)
    return [...this.tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Get tickets filtered by status
  async getTicketsByStatus(status: TicketStatus): Promise<Ticket[]> {
    return this.tickets.filter(ticket => ticket.status === status);
  }

  // Get ticket by ID
  async getTicketById(id: string): Promise<Ticket | null> {
    return this.tickets.find(ticket => ticket.id === id) || null;
  }

  // Create new ticket
  async createTicket(ticketData: CreateTicketData): Promise<Ticket> {
    const newTicket: Ticket = {
      ...ticketData,
      id: this.ticketCounter.toString(),
      ticketNumber: `TKT-2024-${this.ticketCounter.toString().padStart(4, '0')}`,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.tickets.unshift(newTicket);
    this.ticketCounter++;
    
    return newTicket;
  }

  // Update ticket status
  async updateTicketStatus(ticketId: string, status: TicketStatus, resolution?: string): Promise<Ticket | null> {
    const ticketIndex = this.tickets.findIndex(ticket => ticket.id === ticketId);
    
    if (ticketIndex === -1) {
      return null;
    }

    this.tickets[ticketIndex] = {
      ...this.tickets[ticketIndex],
      status,
      updatedAt: new Date().toISOString(),
      ...(resolution && { resolution })
    };

    return this.tickets[ticketIndex];
  }

  // Cancel ticket
  async cancelTicket(ticketId: string, reason: string): Promise<Ticket | null> {
    return this.updateTicketStatus(ticketId, 'cancelled', `Cancelled: ${reason}`);
  }

  // Get dashboard statistics
  async getTicketStats(): Promise<TicketStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalOpen = this.tickets.filter(t => t.status === 'open').length;
    const inProgress = this.tickets.filter(t => t.status === 'in_progress').length;
    const totalResolved = this.tickets.filter(t => t.status === 'resolved').length;
    const cancelled = this.tickets.filter(t => t.status === 'cancelled').length;
    
    // Count tickets resolved today
    const resolvedToday = this.tickets.filter(t => 
      t.status === 'resolved' && 
      new Date(t.updatedAt) >= today
    ).length;

    return {
      totalOpen,
      inProgress,
      resolvedToday,
      totalResolved,
      cancelled,
      avgResponseTime: '2.5 hours'
    };
  }

  // Get recent tickets (for dashboard)
  async getRecentTickets(limit: number = 5): Promise<Ticket[]> {
    const sorted = [...this.tickets].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return sorted.slice(0, limit);
  }
}

export const supportTicketService = new SupportTicketService();