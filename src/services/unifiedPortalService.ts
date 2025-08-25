// Unified Portal Service - Cross-module data and notifications

import { 
  UnifiedNotification, 
  ActivityItem, 
  UnifiedSearchResult, 
  QuickAccessWidget 
} from '../types/installationTypes';

class UnifiedPortalService {
  private initialized = false;
  private notifications: UnifiedNotification[] = [];
  private activities: ActivityItem[] = [];
  private searchResults: UnifiedSearchResult[] = [];
  private widgets: QuickAccessWidget[] = [];

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Initialize mock data
    this.initializeMockNotifications();
    this.initializeMockActivities();
    this.initializeMockSearchResults();
    this.initializeMockWidgets();

    this.initialized = true;
  }

  private initializeMockNotifications(): void {
    this.notifications = [
      {
        id: 'notif-1',
        type: 'appointment',
        title: 'Site Survey Scheduled',
        message: 'Site survey for Johnson Solar Project scheduled for tomorrow at 2:00 PM',
        timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'high',
        actionUrl: '/partners/es-portal/installation/active',
        actionLabel: 'View Project',
        moduleType: 'installation',
        relatedId: 'proj-001'
      },
      {
        id: 'notif-2',
        type: 'lead',
        title: 'New Lead Assigned',
        message: 'Hot lead from downtown residential area requires immediate follow-up',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'urgent',
        actionUrl: '/partners/es-portal/sales/leads',
        actionLabel: 'View Lead',
        moduleType: 'sales',
        relatedId: 'lead-123'
      },
      {
        id: 'notif-3',
        type: 'milestone',
        title: 'Permit Approved',
        message: 'Building permits approved for Smith Residence solar installation',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        priority: 'medium',
        actionUrl: '/partners/es-portal/installation/active',
        actionLabel: 'Start Installation',
        moduleType: 'installation',
        relatedId: 'proj-002'
      },
      {
        id: 'notif-4',
        type: 'task',
        title: 'Overdue Task',
        message: '3 tasks are overdue and require immediate attention',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'urgent',
        actionUrl: '/partners/es-portal/installation/tasks',
        actionLabel: 'Review Tasks',
        moduleType: 'installation',
        relatedId: 'tasks-overdue'
      },
      {
        id: 'notif-5',
        type: 'urgent',
        title: 'Contract Awaiting Signature',
        message: 'Wilson Family solar contract has been pending signature for 5 days',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        priority: 'high',
        actionUrl: '/partners/es-portal/sales/opportunities',
        actionLabel: 'Follow Up',
        moduleType: 'sales',
        relatedId: 'contract-456'
      }
    ];
  }

  private initializeMockActivities(): void {
    this.activities = [
      {
        id: 'activity-1',
        type: 'project_milestone',
        title: 'Installation Completed',
        description: 'Thompson Solar Project installation phase completed successfully',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        moduleType: 'installation',
        userId: 'installer-01',
        userName: 'Mike Rodriguez',
        relatedId: 'proj-003',
        relatedName: 'Thompson Solar Project'
      },
      {
        id: 'activity-2',
        type: 'lead_created',
        title: 'New Lead Generated',
        description: 'Lead from online solar calculator for commercial property',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        moduleType: 'sales',
        userId: 'sales-01',
        userName: 'Sarah Chen',
        relatedId: 'lead-124',
        relatedName: 'Downtown Office Complex'
      },
      {
        id: 'activity-3',
        type: 'task_completed',
        title: 'Site Survey Completed',
        description: 'Electrical assessment and roof measurements completed',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        moduleType: 'installation',
        userId: 'surveyor-01',
        userName: 'Tom Wilson',
        relatedId: 'proj-001',
        relatedName: 'Johnson Solar Project'
      },
      {
        id: 'activity-4',
        type: 'proposal_sent',
        title: 'Proposal Delivered',
        description: '15kW solar system proposal sent to Garcia Family',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        moduleType: 'sales',
        userId: 'sales-02',
        userName: 'David Park',
        relatedId: 'proposal-789',
        relatedName: 'Garcia Residence Solar'
      },
      {
        id: 'activity-5',
        type: 'appointment_scheduled',
        title: 'Consultation Booked',
        description: 'Initial solar consultation scheduled for next Tuesday',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        moduleType: 'sales',
        userId: 'sales-01',
        userName: 'Sarah Chen',
        relatedId: 'appt-456',
        relatedName: 'Martinez Family Consultation'
      }
    ];
  }

  private initializeMockSearchResults(): void {
    this.searchResults = [
      {
        id: 'search-1',
        type: 'project',
        title: 'Johnson Solar Project',
        subtitle: 'Residential 12kW Installation',
        description: 'Site survey completed, permits pending approval',
        moduleType: 'installation',
        url: '/partners/es-portal/installation/active',
        lastUpdated: '2 hours ago',
        status: 'Site Survey',
        priority: 'high'
      },
      {
        id: 'search-2',
        type: 'lead',
        title: 'Downtown Office Complex',
        subtitle: 'Commercial Solar Inquiry',
        description: 'Large commercial property interested in 100kW system',
        moduleType: 'sales',
        url: '/partners/es-portal/sales/leads',
        lastUpdated: '1 hour ago',
        status: 'Hot Lead',
        priority: 'urgent'
      },
      {
        id: 'search-3',
        type: 'task',
        title: 'Electrical Assessment',
        subtitle: 'Pre-installation Task',
        description: 'Complete electrical panel assessment for Johnson project',
        moduleType: 'installation',
        url: '/partners/es-portal/installation/tasks',
        lastUpdated: '30 minutes ago',
        status: 'In Progress',
        priority: 'medium'
      },
      {
        id: 'search-4',
        type: 'proposal',
        title: 'Garcia Family Solar Proposal',
        subtitle: '15kW Residential System',
        description: 'Comprehensive solar proposal with financing options',
        moduleType: 'sales',
        url: '/partners/es-portal/sales/opportunities',
        lastUpdated: '3 hours ago',
        status: 'Sent',
        priority: 'medium'
      }
    ];
  }

  private initializeMockWidgets(): void {
    this.widgets = [
      {
        id: 'widget-1',
        title: 'Today\'s Appointments',
        value: 4,
        trend: {
          value: 25,
          direction: 'up',
          label: 'vs yesterday'
        },
        actionUrl: '/partners/es-portal/sales/leads',
        actionLabel: 'View Schedule',
        type: 'metric',
        moduleType: 'sales',
        priority: 1
      },
      {
        id: 'widget-2',
        title: 'Active Projects',
        value: 12,
        trend: {
          value: 8,
          direction: 'up',
          label: 'this month'
        },
        actionUrl: '/partners/es-portal/installation/active',
        actionLabel: 'Manage Projects',
        type: 'metric',
        moduleType: 'installation',
        priority: 2
      },
      {
        id: 'widget-3',
        title: 'Urgent Tasks',
        value: 3,
        trend: {
          value: 2,
          direction: 'down',
          label: 'resolved today'
        },
        actionUrl: '/partners/es-portal/installation/tasks',
        actionLabel: 'Review Tasks',
        type: 'alert',
        moduleType: 'installation',
        priority: 3
      },
      {
        id: 'widget-4',
        title: 'Hot Leads',
        value: 8,
        trend: {
          value: 15,
          direction: 'up',
          label: 'this week'
        },
        actionUrl: '/partners/es-portal/sales/leads',
        actionLabel: 'Follow Up',
        type: 'alert',
        moduleType: 'sales',
        priority: 4
      },
      {
        id: 'widget-5',
        title: 'Revenue Pipeline',
        value: '$1.2M',
        trend: {
          value: 18,
          direction: 'up',
          label: 'vs last month'
        },
        actionUrl: '/partners/es-portal/sales',
        actionLabel: 'View Details',
        type: 'metric',
        moduleType: 'combined',
        priority: 5
      },
      {
        id: 'widget-6',
        title: 'Completion Rate',
        value: '94%',
        trend: {
          value: 3,
          direction: 'up',
          label: 'this quarter'
        },
        actionUrl: '/partners/es-portal/installation',
        actionLabel: 'View Metrics',
        type: 'metric',
        moduleType: 'installation',
        priority: 6
      }
    ];
  }

  // Notification Management
  async getNotifications(limit?: number): Promise<UnifiedNotification[]> {
    await this.initialize();
    const sorted = [...this.notifications].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }

  async getUnreadNotifications(): Promise<UnifiedNotification[]> {
    await this.initialize();
    return this.notifications.filter(n => !n.isRead);
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    this.notifications.forEach(n => n.isRead = true);
  }

  // Activity Feed
  async getActivities(limit?: number): Promise<ActivityItem[]> {
    await this.initialize();
    const sorted = [...this.activities].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return limit ? sorted.slice(0, limit) : sorted;
  }

  // Search Functionality
  async search(query: string, moduleFilter?: 'sales' | 'installation'): Promise<UnifiedSearchResult[]> {
    await this.initialize();
    if (!query.trim()) return [];

    const queryLower = query.toLowerCase();
    let results = this.searchResults.filter(result => 
      result.title.toLowerCase().includes(queryLower) ||
      result.subtitle.toLowerCase().includes(queryLower) ||
      result.description.toLowerCase().includes(queryLower)
    );

    if (moduleFilter) {
      results = results.filter(result => result.moduleType === moduleFilter);
    }

    return results.sort((a, b) => {
      // Priority sorting: urgent > high > medium > low
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4;
      return aPriority - bPriority;
    });
  }

  // Quick Access Widgets
  async getQuickAccessWidgets(limit?: number): Promise<QuickAccessWidget[]> {
    await this.initialize();
    const sorted = [...this.widgets].sort((a, b) => a.priority - b.priority);
    return limit ? sorted.slice(0, limit) : sorted;
  }

  // Notification Statistics
  async getNotificationStats(): Promise<{
    total: number;
    unread: number;
    urgent: number;
    byModule: Record<string, number>;
  }> {
    await this.initialize();
    const unread = this.notifications.filter(n => !n.isRead);
    const urgent = this.notifications.filter(n => n.priority === 'urgent');
    
    const byModule: Record<string, number> = {};
    this.notifications.forEach(n => {
      byModule[n.moduleType] = (byModule[n.moduleType] || 0) + 1;
    });

    return {
      total: this.notifications.length,
      unread: unread.length,
      urgent: urgent.length,
      byModule
    };
  }
}

export const unifiedPortalService = new UnifiedPortalService();