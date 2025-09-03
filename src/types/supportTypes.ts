export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'cancelled';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'hardware' | 'financing' | 'installation' | 'sales' | 'general';

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  assignedTo?: string;
  resolution?: string;
  userType: string;
}

export interface TicketStats {
  totalOpen: number;
  inProgress: number;
  resolvedToday: number;
  totalResolved: number;
  cancelled: number;
  avgResponseTime: string;
}

export interface CreateTicketData {
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  userType: string;
}