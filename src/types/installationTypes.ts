// Installation Management System Types

export type InstallationStage = 'Scheduled' | 'Site Survey' | 'Permits Pending' | 'Installation In Progress' | 'Inspection' | 'Completed' | 'On Hold';

export type CrewRole = 'Lead Installer' | 'Assistant' | 'Electrician' | 'Supervisor';

export type EquipmentStatus = 'Available' | 'Assigned' | 'In Use' | 'Maintenance' | 'Out of Service';

export type MilestoneStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue' | 'Blocked';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TaskStatus = 'Open' | 'In Progress' | 'Completed' | 'Cancelled' | 'On Hold';

export interface InstallationProject {
  id: string;
  projectName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  siteAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  stage: InstallationStage;
  scheduledStartDate: string;
  scheduledEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  systemSize: number; // kW
  panelCount: number;
  inverterType: string;
  estimatedValue: number;
  assignedCrew: CrewMember[];
  equipment: EquipmentAssignment[];
  progress: number; // 0-100%
  notes?: string;
  permitNumber?: string;
  inspectionDate?: string;
  customerSatisfaction?: number; // 1-5 stars
  milestones?: ProjectMilestone[];
  tasks?: ProjectTask[];
  createdDate: string;
  updatedDate: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: CrewRole;
  email: string;
  phone: string;
  certifications: string[];
  isAvailable: boolean;
  currentProjects: string[]; // project IDs
}

export interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  model: string;
  serialNumber?: string;
  status: EquipmentStatus;
  purchaseDate: string;
  warrantyExpiry?: string;
  assignedProject?: string;
  maintenanceSchedule?: string;
}

export interface EquipmentAssignment {
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  assignedDate: string;
  returnDate?: string;
}

export interface InstallationKPIMetrics {
  totalActiveProjects: number;
  completedProjectsMTD: number;
  completedProjectsYTD: number;
  onTimeCompletionRate: number; // percentage
  customerSatisfactionAvg: number; // 1-5 stars
  averageInstallationTime: number; // days
  revenueGeneratedMTD: number;
  revenueGeneratedYTD: number;
  crewUtilizationRate: number; // percentage
  equipmentUtilizationRate: number; // percentage
  permitApprovalTime: number; // average days
  reworkRate: number; // percentage
}

export interface ScheduledVisit {
  id: string;
  projectId: string;
  projectName: string;
  customerName: string;
  siteAddress: string;
  visitType: 'Site Survey' | 'Installation' | 'Inspection' | 'Service Call' | 'Final Walkthrough';
  scheduledDate: string;
  scheduledTime: string;
  assignedCrew: CrewMember[];
  estimatedDuration: number; // hours
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes?: string;
}

export interface InstallationSearchFilters {
  searchTerm?: string;
  stage?: InstallationStage;
  dateRange?: {
    start: Date;
    end: Date;
  };
  assignedCrew?: string;
  customerSatisfaction?: number;
}

export interface NewProjectData {
  projectName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  siteAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  systemSize: number;
  panelCount: number;
  inverterType: string;
  estimatedValue: number;
  scheduledStartDate: string;
  scheduledEndDate: string;
  notes?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
}

export interface RecentProject {
  id: string;
  projectName: string;
  customerName: string;
  stage: InstallationStage;
  progress: number;
  scheduledDate: string;
}

export interface UpcomingInstallation {
  id: string;
  projectName: string;
  customerName: string;
  siteAddress: string;
  scheduledDate: string;
  assignedCrew: string[];
}

export type DateRangeType = 'MTD' | 'YTD' | 'custom';

export interface InstallationFormData {
  projectName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  siteAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  systemSize: string;
  panelCount: string;
  inverterType: string;
  estimatedValue: string;
  scheduledStartDate: string;
  scheduledEndDate: string;
  notes: string;
}

export interface InstallationFormErrors {
  projectName?: string;
  customerName?: string;
  customerEmail?: string;
  siteAddress?: string;
  systemSize?: string;
  [key: string]: string | undefined;
}

// Enhanced Milestone and Task Management Types

export interface ProjectMilestone {
  id: string;
  projectId: string;
  name: string;
  description: string;
  stage: InstallationStage;
  status: MilestoneStatus;
  plannedDate: string;
  actualDate?: string;
  dependencies: string[]; // other milestone IDs
  assignedTo?: string; // crew member ID
  notes?: string;
  documents?: string[]; // document IDs or URLs
  createdDate: string;
  updatedDate: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string; // crew member ID
  assignedBy: string; // user ID who assigned the task
  dueDate: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  notes?: string;
  attachments?: string[]; // file URLs or IDs
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

export interface MilestoneTemplate {
  id: string;
  name: string;
  description: string;
  stage: InstallationStage;
  estimatedDays: number;
  defaultTasks: Omit<ProjectTask, 'id' | 'projectId' | 'milestoneId' | 'assignedTo' | 'assignedBy' | 'createdDate' | 'updatedDate'>[];
}

export interface EnhancedInstallationKPIMetrics extends InstallationKPIMetrics {
  averageMilestoneCompletionTime: number; // days
  taskCompletionRate: number; // percentage
  overdueMilestones: number;
  overdueTasksCount: number;
  crewProductivityScore: number; // tasks completed per day
  milestoneAccuracy: number; // percentage of milestones completed on time
}

// Enhanced search filters
export interface EnhancedInstallationSearchFilters extends InstallationSearchFilters {
  milestoneStatus?: MilestoneStatus;
  taskStatus?: TaskStatus;
  taskPriority?: TaskPriority;
  hasOverdueTasks?: boolean;
  hasOverdueMilestones?: boolean;
}

// Unified Platform Types
export interface UnifiedNotification {
  id: string;
  type: 'appointment' | 'milestone' | 'task' | 'lead' | 'urgent' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  moduleType: 'sales' | 'installation' | 'monitoring' | 'support';
  relatedId?: string;
}

export interface ActivityItem {
  id: string;
  type: 'lead_created' | 'project_milestone' | 'task_completed' | 'appointment_scheduled' | 'proposal_sent' | 'contract_signed';
  title: string;
  description: string;
  timestamp: string;
  moduleType: 'sales' | 'installation';
  userId: string;
  userName: string;
  relatedId?: string;
  relatedName?: string;
}

export interface UnifiedSearchResult {
  id: string;
  type: 'lead' | 'project' | 'task' | 'contact' | 'proposal';
  title: string;
  subtitle: string;
  description: string;
  moduleType: 'sales' | 'installation';
  url: string;
  lastUpdated: string;
  status?: string;
  priority?: string;
}

export interface QuickAccessWidget {
  id: string;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
    label: string;
  };
  actionUrl?: string;
  actionLabel?: string;
  type: 'metric' | 'list' | 'alert' | 'action';
  moduleType: 'sales' | 'installation' | 'combined';
  priority: number;
}