// SREC Management System Types

export type SRECStatus = 'Generated' | 'Verified' | 'Listed' | 'Sold' | 'Settled' | 'Retired' | 'Expired';

export type SRECType = 'Solar';

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

// Residential installation workflow
export type ResidentialJobStatus =
  | 'Before Installation'
  | 'Installation in Progress'
  | 'Installation Completed'
  | 'PTO Completed'
  | 'Cancelled';

export type TaskStatus = 'Open' | 'In Progress' | 'Completed' | 'Cancelled' | 'On Hold';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface SRECRecord {
  id: string;
  certificateId: string;
  vintage: string; // Year/Quarter (e.g., "2024-Q3")
  generationDate: string;
  generationPeriodStart: string;
  generationPeriodEnd: string;
  mwhGenerated: number;
  facilityName: string;
  facilityId: string;
  facilityLocation: string;
  state: string;
  srecType: SRECType;
  status: SRECStatus;
  marketPrice: number;
  salePrice?: number;
  buyerId?: string;
  buyerName?: string;
  saleDate?: string;
  expirationDate: string;
  registryId: string;
  installationProjectId?: string;
  createdDate: string;
  updatedDate: string;
  notes?: string;
  // Optional residential fields
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  installationAddress?: string;
  jobStatus?: ResidentialJobStatus;
  ptoDate?: string; // ISO date
  systemSizeKw?: number;
}

export interface MarketData {
  id: string;
  state: string;
  vintage: string;
  currentPrice: number;
  previousPrice: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  lastTradeDate: string;
  highPrice: number;
  lowPrice: number;
  avgPrice: number;
  marketCap: number;
  timestamp: string;
}

export interface SRECTransaction {
  id: string;
  srecId: string;
  certificateId: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  salePrice: number;
  quantity: number;
  totalValue: number;
  transactionDate: string;
  settlementDate: string;
  brokerage?: number;
  fees: number;
  netAmount: number;
  status: 'Pending' | 'Completed' | 'Failed' | 'Cancelled';
  notes?: string;
}

export interface SRECInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  srecIds: string[];
  certificateIds: string[];
  totalSRECs: number;
  pricePerSREC: number;
  subtotal: number;
  brokerageFee: number;
  processingFee: number;
  taxes: number;
  totalAmount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  createdDate: string;
  updatedDate: string;
}

export interface SRECTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  assignedBy: string;
  srecId?: string;
  certificateId?: string;
  invoiceId?: string;
  facilityId?: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  category: 'Verification' | 'Registration' | 'Trading' | 'Compliance' | 'Reporting' | 'Customer Service';
  tags: string[];
  attachments?: string[];
  comments?: TaskComment[];
  createdDate: string;
  updatedDate: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdDate: string;
}

export interface SRECFacility {
  id: string;
  name: string;
  location: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  capacity: number; // MW
  technology: 'Solar';
  commissionDate: string;
  registryId: string;
  ownerId: string;
  ownerName: string;
  utilityCompany: string;
  isActive: boolean;
  certificationExpiry?: string;
  totalGeneration: number; // MWh lifetime
  totalSRECs: number;
  activeSRECs: number;
  createdDate: string;
  updatedDate: string;
}

export interface SRECDashboardMetrics {
  totalSRECs: number;
  activeSRECs: number;
  soldSRECs: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averagePrice: number;
  marketValue: number;
  pendingTransactions: number;
  overdueInvoices: number;
  activeTasks: number;
  completionRate: number;
  topPerformingFacility: string;
  revenueGrowth: number;
  volumeGrowth: number;
  priceVolatility: number;
}

export interface SRECSearchFilters {
  searchTerm?: string;
  status?: SRECStatus;
  srecType?: SRECType;
  state?: string;
  vintage?: string;
  facilityId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  mwhRange?: {
    min: number;
    max: number;
  };
}

export interface InvoiceSearchFilters {
  searchTerm?: string;
  status?: InvoiceStatus;
  customerId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface TaskSearchFilters {
  searchTerm?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  category?: string;
  dueDate?: {
    start: Date;
    end: Date;
  };
  overdue?: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
}

export interface NewSRECData {
  certificateId: string;
  vintage: string;
  generationDate: string;
  generationPeriodStart: string;
  generationPeriodEnd: string;
  mwhGenerated: number;
  facilityId: string;
  srecType: 'Solar';
  registryId: string;
  installationProjectId?: string;
  notes?: string;
}

export interface NewInvoiceData {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  srecIds: string[];
  pricePerSREC: number;
  brokerageFee: number;
  processingFee: number;
  taxes: number;
  dueDate: string;
  notes?: string;
}

export interface NewTaskData {
  title: string;
  description: string;
  priority: TaskPriority;
  assignedTo: string;
  srecId?: string;
  invoiceId?: string;
  facilityId?: string;
  dueDate: string;
  category: string;
  tags: string[];
  estimatedHours?: number;
}

// Report types
export interface SRECReport {
  id: string;
  name: string;
  type: 'Summary' | 'Detailed' | 'Compliance' | 'Financial' | 'Market Analysis';
  description: string;
  parameters: Record<string, any>;
  generatedDate: string;
  generatedBy: string;
  format: 'PDF' | 'Excel' | 'CSV';
  fileUrl?: string;
  status: 'Generating' | 'Ready' | 'Failed';
}

export interface MarketTrend {
  date: string;
  price: number;
  volume: number;
  state: string;
  vintage: string;
}

export interface ComplianceRequirement {
  id: string;
  state: string;
  vintage: string;
  requirement: number; // Percentage or absolute number
  deadline: string;
  penalty: number;
  status: 'Met' | 'At Risk' | 'Non-Compliant';
  progress: number; // 0-100%
}