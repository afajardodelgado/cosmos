// Sites Management System Types

export type SiteStage = 
  | 'Sales Handoff'
  | 'Site Survey Scheduled' 
  | 'Site Survey Completed'
  | 'Permit Submitted'
  | 'Permit Approved'
  | 'Installation Scheduled'
  | 'Installation in Progress'
  | 'Installation Complete'
  | 'PTO Pending'
  | 'PTO Granted';

export type SiteType = 'Residential' | 'Commercial' | 'Industrial';

export type SystemType = 'Grid-Tied' | 'Grid-Tied + Battery' | 'Off-Grid';

export interface SiteRecord {
  id: string;
  siteId: string; // Unique site identifier (e.g., SITE-001)
  
  // Customer Information (from original sales record)
  customerId: string; // Original sales record ID
  customerName: string;
  email: string;
  phone: string;
  
  // Site Address
  address: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  
  // System Details
  systemSize: number; // kW
  panelCount: number;
  systemType: SystemType;
  siteType: SiteType;
  utilityCompany: string;
  
  // Project Information
  stage: SiteStage;
  contractValue: number;
  hesId: string;
  
  // Timeline Tracking
  createdDate: string;
  handoffDate?: string;
  surveyScheduledDate?: string;
  surveyCompletedDate?: string;
  permitSubmittedDate?: string;
  permitApprovedDate?: string;
  installationScheduledDate?: string;
  installationStartDate?: string;
  installationCompletedDate?: string;
  ptoSubmittedDate?: string;
  ptoGrantedDate?: string;
  
  // Assigned Teams
  salesRepId?: string;
  surveyorId?: string;
  projectManagerId?: string;
  installationCrewId?: string;
  
  // Progress Tracking
  overallProgress: number; // 0-100%
  stageProgress: number; // 0-100% for current stage
  
  // Additional Details
  notes?: string;
  permits?: {
    number: string;
    type: string;
    status: string;
    submittedDate: string;
    approvedDate?: string;
  }[];
  
  // Equipment Details
  panelModel?: string;
  inverterModel?: string;
  batteryModel?: string;
  
  // Financials
  downPayment?: number;
  monthlyPayment?: number;
  loanTerm?: number;
  
  updatedDate: string;
}

export interface NewSiteData {
  customerId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  systemSize: number;
  panelCount: number;
  systemType: SystemType;
  siteType: SiteType;
  utilityCompany: string;
  contractValue: number;
  hesId: string;
}

export interface SiteSearchFilters {
  searchTerm?: string;
  stage?: SiteStage;
  siteType?: SiteType;
  systemType?: SystemType;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SiteKPIMetrics {
  totalSites: number;
  activeSites: number;
  completedSites: number;
  averageInstallTime: number; // days
  totalContractValue: number;
  sitesInPermitting: number;
  sitesReadyForInstallation: number;
  ptosPending: number;
}

export interface SitePaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
}

export interface StageTimeline {
  stage: SiteStage;
  startDate?: string;
  completedDate?: string;
  estimatedDuration: number; // days
  isComplete: boolean;
  isCurrent: boolean;
  notes?: string;
}

export interface SiteProgressData {
  siteId: string;
  timeline: StageTimeline[];
  overallProgress: number;
  currentStage: SiteStage;
  nextMilestone: string;
  estimatedCompletion: string;
}