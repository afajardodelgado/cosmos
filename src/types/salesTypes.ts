// Sales Management System Types

export type LeadStage = 'New Lead' | 'Qualified' | 'Converted to Opportunity' | 'Contract Sent' | 'Closed Won';

export interface SalesRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hesId: string;
  address: string;
  street?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  stage: LeadStage;
  monthlyElectricBill?: number;
  kwhRate?: number;
  leadType?: string;
  referredBy?: string;
  communicationPreference?: string;
  gcid?: string;
  utilityCompany?: string;
  createdDate: string;
  updatedDate: string;
  isOpportunity: boolean;
}

export interface NewLeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  street?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
  monthlyElectricBill?: number;
  kwhRate?: number;
  leadType?: string;
  referredBy?: string;
  communicationPreference?: string;
  gcid?: string;
  utilityCompany?: string;
}

export interface SearchFilters {
  searchTerm?: string;
  stage?: LeadStage;
  dateRange?: {
    start: Date;
    end: Date;
  };
  isOpportunity?: boolean;
}

export interface KPIMetrics {
  leadConversionRate: number;
  netCloseRate: number;
  mtdSales: number;
  ytdSales: number;
  totalLeads: number;
  totalOpportunities: number;
  totalClosed: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
}

export interface SalesTableProps {
  records: SalesRecord[];
  onEdit?: (record: SalesRecord) => void;
  onConvert?: (record: SalesRecord) => void;
  onDelete?: (record: SalesRecord) => void;
  isOpportunityView?: boolean;
}

export interface SalesFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  street: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  monthlyElectricBill: string;
  kwhRate: string;
  leadType: string;
  referredBy: string;
  communicationPreference: string;
  gcid: string;
}

export interface SalesFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: string | undefined;
}

export type DateRangeType = 'MTD' | 'YTD' | 'custom';

export interface RecentLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  stage: LeadStage;
}

export interface UpcomingAppointment {
  id: string;
  customerName: string;
  date: string;
  time: string;
  type: string;
}