// Installation Management Data Service

import {
  InstallationProject,
  InstallationKPIMetrics,
  CrewMember,
  EquipmentItem,
  ScheduledVisit,
  RecentProject,
  UpcomingInstallation,
  InstallationSearchFilters,
  PaginationInfo,
  DateRangeType,
  InstallationStage,
  NewProjectData,
  ProjectMilestone,
  ProjectTask,
  MilestoneTemplate,
  EnhancedInstallationKPIMetrics,
  EnhancedInstallationSearchFilters,
  MilestoneStatus,
  TaskStatus
} from '../types/installationTypes';

class InstallationDataService {
  private initialized = false;
  private projects: InstallationProject[] = [];
  private crew: CrewMember[] = [];
  private equipment: EquipmentItem[] = [];
  private visits: ScheduledVisit[] = [];
  private milestones: ProjectMilestone[] = [];
  private tasks: ProjectTask[] = [];
  private milestoneTemplates: MilestoneTemplate[] = [];

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Initialize mock data
    this.initializeMockData();
    this.initialized = true;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private initializeMockData(): void {
    // Mock crew members
    this.crew = [
      {
        id: 'crew-1',
        name: 'Mike Rodriguez',
        role: 'Lead Installer',
        email: 'mike.rodriguez@cosmos.com',
        phone: '(555) 123-4567',
        certifications: ['NABCEP PV', 'OSHA 30'],
        isAvailable: true,
        currentProjects: ['proj-1', 'proj-3']
      },
      {
        id: 'crew-2',
        name: 'Sarah Chen',
        role: 'Electrician',
        email: 'sarah.chen@cosmos.com',
        phone: '(555) 234-5678',
        certifications: ['Licensed Electrician', 'NABCEP PV'],
        isAvailable: true,
        currentProjects: ['proj-2']
      },
      {
        id: 'crew-3',
        name: 'David Thompson',
        role: 'Assistant',
        email: 'david.thompson@cosmos.com',
        phone: '(555) 345-6789',
        certifications: ['OSHA 10'],
        isAvailable: false,
        currentProjects: ['proj-1', 'proj-4']
      }
    ];

    // Mock equipment
    this.equipment = [
      {
        id: 'eq-1',
        name: 'Solar Panel Installation Kit',
        type: 'Tools',
        model: 'SPK-2024',
        status: 'Available',
        purchaseDate: '2024-01-15',
        warrantyExpiry: '2026-01-15'
      },
      {
        id: 'eq-2',
        name: 'Inverter - String Type',
        type: 'Component',
        model: 'SMA-7000',
        serialNumber: 'SMA-789456123',
        status: 'Assigned',
        purchaseDate: '2024-02-20',
        assignedProject: 'proj-1'
      }
    ];

    // Mock installation projects
    this.projects = [
      {
        id: 'proj-1',
        projectName: 'Johnson Residence Solar',
        customerId: 'cust-1',
        customerName: 'Timothy Johnson',
        customerEmail: 'timothy.johnson@email.com',
        customerPhone: '(555) 987-6543',
        siteAddress: '235 Cupcake Street',
        city: 'Bordentown',
        stateProvince: 'CA',
        postalCode: '02345',
        stage: 'Installation In Progress',
        scheduledStartDate: '2024-08-20',
        scheduledEndDate: '2024-08-25',
        actualStartDate: '2024-08-20',
        systemSize: 8.4,
        panelCount: 24,
        inverterType: 'String Inverter',
        estimatedValue: 25200,
        assignedCrew: [this.crew[0], this.crew[2]],
        equipment: [
          {
            equipmentId: 'eq-1',
            equipmentName: 'Solar Panel Installation Kit',
            quantity: 1,
            assignedDate: '2024-08-19'
          }
        ],
        progress: 65,
        notes: 'Installation proceeding on schedule. Weather conditions good.',
        permitNumber: 'PRM-2024-0856',
        createdDate: '2024-08-01',
        updatedDate: '2024-08-24'
      },
      {
        id: 'proj-2',
        projectName: 'Smith Family Solar System',
        customerId: 'cust-2',
        customerName: 'Jennifer Smith',
        customerEmail: 'jennifer.smith@email.com',
        customerPhone: '(555) 876-5432',
        siteAddress: '1425 Oak Tree Drive',
        city: 'Sacramento',
        stateProvince: 'CA',
        postalCode: '95814',
        stage: 'Permits Pending',
        scheduledStartDate: '2024-09-01',
        scheduledEndDate: '2024-09-05',
        systemSize: 12.6,
        panelCount: 36,
        inverterType: 'Micro Inverters',
        estimatedValue: 37800,
        assignedCrew: [this.crew[1]],
        equipment: [],
        progress: 15,
        notes: 'Awaiting final permit approval from city planning.',
        permitNumber: 'PRM-2024-0923',
        createdDate: '2024-08-10',
        updatedDate: '2024-08-23'
      },
      {
        id: 'proj-3',
        projectName: 'Commercial Office Building',
        customerId: 'cust-3',
        customerName: 'Metro Business Center',
        customerEmail: 'facilities@metrobiz.com',
        customerPhone: '(555) 765-4321',
        siteAddress: '890 Business Park Way',
        city: 'San Francisco',
        stateProvince: 'CA',
        postalCode: '94105',
        stage: 'Site Survey',
        scheduledStartDate: '2024-09-15',
        scheduledEndDate: '2024-09-30',
        systemSize: 45.2,
        panelCount: 129,
        inverterType: 'Central Inverter',
        estimatedValue: 135600,
        assignedCrew: [this.crew[0]],
        equipment: [],
        progress: 5,
        notes: 'Large commercial installation. Coordinating with building management.',
        createdDate: '2024-08-15',
        updatedDate: '2024-08-22'
      },
      {
        id: 'proj-4',
        projectName: 'Williams Residence',
        customerId: 'cust-4',
        customerName: 'Robert Williams',
        customerEmail: 'robert.williams@email.com',
        customerPhone: '(555) 654-3210',
        siteAddress: '742 Maple Avenue',
        city: 'Los Angeles',
        stateProvince: 'CA',
        postalCode: '90210',
        stage: 'Completed',
        scheduledStartDate: '2024-08-01',
        scheduledEndDate: '2024-08-05',
        actualStartDate: '2024-08-01',
        actualEndDate: '2024-08-04',
        systemSize: 6.3,
        panelCount: 18,
        inverterType: 'String Inverter',
        estimatedValue: 18900,
        assignedCrew: [this.crew[2]],
        equipment: [],
        progress: 100,
        notes: 'Installation completed ahead of schedule. Customer very satisfied.',
        permitNumber: 'PRM-2024-0745',
        inspectionDate: '2024-08-05',
        customerSatisfaction: 5,
        createdDate: '2024-07-20',
        updatedDate: '2024-08-05'
      }
    ];

    // Mock scheduled visits
    this.visits = [
      {
        id: 'visit-1',
        projectId: 'proj-2',
        projectName: 'Smith Family Solar System',
        customerName: 'Jennifer Smith',
        siteAddress: '1425 Oak Tree Drive, Sacramento, CA',
        visitType: 'Site Survey',
        scheduledDate: '2024-08-26',
        scheduledTime: '09:00',
        assignedCrew: [this.crew[1]],
        estimatedDuration: 2,
        status: 'Scheduled',
        notes: 'Final site assessment before permit submission'
      },
      {
        id: 'visit-2',
        projectId: 'proj-3',
        projectName: 'Commercial Office Building',
        customerName: 'Metro Business Center',
        siteAddress: '890 Business Park Way, San Francisco, CA',
        visitType: 'Installation',
        scheduledDate: '2024-08-27',
        scheduledTime: '08:00',
        assignedCrew: [this.crew[0], this.crew[2]],
        estimatedDuration: 8,
        status: 'Scheduled',
        notes: 'First day of installation - roof preparation'
      }
    ];

    // Mock milestone templates
    this.milestoneTemplates = [
      {
        id: 'template-1',
        name: 'Site Survey',
        description: 'Complete site assessment and measurements',
        stage: 'Site Survey',
        estimatedDays: 1,
        defaultTasks: [
          {
            title: 'Roof Assessment',
            description: 'Evaluate roof condition and structural integrity',
            status: 'Open',
            priority: 'High',
            dueDate: new Date().toISOString(),
            estimatedHours: 2
          },
          {
            title: 'Electrical Panel Review',
            description: 'Assess electrical panel capacity and compatibility',
            status: 'Open',
            priority: 'High',
            dueDate: new Date().toISOString(),
            estimatedHours: 1
          }
        ]
      },
      {
        id: 'template-2',
        name: 'Permits & Documentation',
        description: 'Submit and track permit applications',
        stage: 'Permits Pending',
        estimatedDays: 7,
        defaultTasks: [
          {
            title: 'Submit Permit Application',
            description: 'Submit all required documentation to local authority',
            status: 'Open',
            priority: 'High',
            dueDate: new Date().toISOString(),
            estimatedHours: 3
          },
          {
            title: 'HOA Approval (if applicable)',
            description: 'Obtain homeowners association approval',
            status: 'Open',
            priority: 'Medium',
            dueDate: new Date().toISOString(),
            estimatedHours: 2
          }
        ]
      }
    ];

    // Mock project milestones
    this.milestones = [
      {
        id: 'milestone-1',
        projectId: 'proj-1',
        name: 'Site Survey Complete',
        description: 'Initial site assessment and measurements completed',
        stage: 'Site Survey',
        status: 'Completed',
        plannedDate: '2024-08-15',
        actualDate: '2024-08-14',
        dependencies: [],
        assignedTo: 'crew-1',
        createdDate: '2024-08-01',
        updatedDate: '2024-08-14'
      },
      {
        id: 'milestone-2',
        projectId: 'proj-1',
        name: 'Permits Approved',
        description: 'All required permits obtained',
        stage: 'Permits Pending',
        status: 'Completed',
        plannedDate: '2024-08-18',
        actualDate: '2024-08-17',
        dependencies: ['milestone-1'],
        createdDate: '2024-08-01',
        updatedDate: '2024-08-17'
      },
      {
        id: 'milestone-3',
        projectId: 'proj-1',
        name: 'Installation Complete',
        description: 'Solar panel installation finished',
        stage: 'Installation In Progress',
        status: 'In Progress',
        plannedDate: '2024-08-25',
        dependencies: ['milestone-2'],
        assignedTo: 'crew-1',
        createdDate: '2024-08-01',
        updatedDate: '2024-08-24'
      }
    ];

    // Mock project tasks
    this.tasks = [
      {
        id: 'task-1',
        projectId: 'proj-1',
        milestoneId: 'milestone-3',
        title: 'Install Roof Racking System',
        description: 'Mount racking system on roof according to engineering plans',
        status: 'Completed',
        priority: 'High',
        assignedTo: 'crew-1',
        assignedBy: 'user-1',
        dueDate: '2024-08-20',
        completedDate: '2024-08-20',
        estimatedHours: 6,
        actualHours: 5.5,
        createdDate: '2024-08-19',
        updatedDate: '2024-08-20'
      },
      {
        id: 'task-2',
        projectId: 'proj-1',
        milestoneId: 'milestone-3',
        title: 'Install Solar Panels',
        description: 'Mount solar panels on racking system',
        status: 'In Progress',
        priority: 'High',
        assignedTo: 'crew-1',
        assignedBy: 'user-1',
        dueDate: '2024-08-22',
        estimatedHours: 8,
        actualHours: 4,
        createdDate: '2024-08-19',
        updatedDate: '2024-08-21'
      },
      {
        id: 'task-3',
        projectId: 'proj-1',
        milestoneId: 'milestone-3',
        title: 'Connect DC Wiring',
        description: 'Wire panels to inverter system',
        status: 'Open',
        priority: 'High',
        assignedTo: 'crew-2',
        assignedBy: 'user-1',
        dueDate: '2024-08-23',
        estimatedHours: 4,
        createdDate: '2024-08-19',
        updatedDate: '2024-08-19'
      },
      {
        id: 'task-4',
        projectId: 'proj-2',
        title: 'Schedule Permit Inspection',
        description: 'Coordinate with local authority for permit approval',
        status: 'Open',
        priority: 'Medium',
        assignedTo: 'crew-2',
        assignedBy: 'user-1',
        dueDate: '2024-08-28',
        estimatedHours: 1,
        createdDate: '2024-08-22',
        updatedDate: '2024-08-22'
      }
    ];
  }

  // Get KPI metrics
  async getKPIData(dateRange: DateRangeType = 'YTD'): Promise<InstallationKPIMetrics> {
    await this.initialize();
    
    // Calculate metrics from mock data
    const completedProjects = this.projects.filter(p => p.stage === 'Completed');
    const activeProjects = this.projects.filter(p => p.stage !== 'Completed');
    
    // Calculate on-time completion rate
    const onTimeProjects = completedProjects.filter(p => {
      if (!p.actualEndDate) return false;
      return new Date(p.actualEndDate) <= new Date(p.scheduledEndDate);
    });
    const onTimeRate = completedProjects.length > 0 ? (onTimeProjects.length / completedProjects.length) * 100 : 0;

    const avgSatisfaction = completedProjects
      .filter(p => p.customerSatisfaction)
      .reduce((sum, p) => sum + (p.customerSatisfaction || 0), 0) / completedProjects.length;

    return {
      totalActiveProjects: activeProjects.length,
      completedProjectsMTD: 2,
      completedProjectsYTD: 12,
      onTimeCompletionRate: onTimeRate,
      customerSatisfactionAvg: avgSatisfaction || 4.8,
      averageInstallationTime: 4.2,
      revenueGeneratedMTD: 187500,
      revenueGeneratedYTD: 1250000,
      crewUtilizationRate: 78.5,
      equipmentUtilizationRate: 82.3,
      permitApprovalTime: 12.5,
      reworkRate: 3.2
    };
  }

  // Get all projects with filtering and pagination
  async getProjects(filters?: InstallationSearchFilters, page = 1, pageSize = 20): Promise<{
    records: InstallationProject[];
    pagination: PaginationInfo;
  }> {
    await this.initialize();
    
    let filteredProjects = [...this.projects];

    // Apply filters
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredProjects = filteredProjects.filter(project =>
        project.projectName.toLowerCase().includes(searchLower) ||
        project.customerName.toLowerCase().includes(searchLower) ||
        project.siteAddress.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.stage) {
      filteredProjects = filteredProjects.filter(project => project.stage === filters.stage);
    }

    // Pagination
    const totalRecords = filteredProjects.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    return {
      records: paginatedProjects,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        pageSize
      }
    };
  }

  // Get active projects only
  async getActiveProjects(filters?: InstallationSearchFilters, page = 1, pageSize = 20): Promise<{
    records: InstallationProject[];
    pagination: PaginationInfo;
  }> {
    const activeFilters = {
      ...filters,
      stage: undefined // We'll filter manually to exclude completed
    };
    
    const result = await this.getProjects(activeFilters, page, pageSize);
    
    // Filter out completed projects
    const activeProjects = result.records.filter(p => p.stage !== 'Completed');
    
    return {
      records: activeProjects,
      pagination: result.pagination
    };
  }

  // Get completed projects only
  async getCompletedProjects(filters?: InstallationSearchFilters, page = 1, pageSize = 20): Promise<{
    records: InstallationProject[];
    pagination: PaginationInfo;
  }> {
    const completedFilters = {
      ...filters,
      stage: 'Completed' as InstallationStage
    };
    
    return this.getProjects(completedFilters, page, pageSize);
  }

  // Get scheduled visits
  async getScheduledVisits(): Promise<ScheduledVisit[]> {
    await this.initialize();
    return this.visits.filter(visit => visit.status === 'Scheduled');
  }

  // Get recent projects
  async getRecentProjects(limit = 5): Promise<RecentProject[]> {
    await this.initialize();
    
    return this.projects
      .sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime())
      .slice(0, limit)
      .map(project => ({
        id: project.id,
        projectName: project.projectName,
        customerName: project.customerName,
        stage: project.stage,
        progress: project.progress,
        scheduledDate: project.scheduledStartDate
      }));
  }

  // Get upcoming installations
  async getUpcomingInstallations(limit = 5): Promise<UpcomingInstallation[]> {
    await this.initialize();
    
    return this.projects
      .filter(p => ['Scheduled', 'Site Survey', 'Permits Pending'].includes(p.stage))
      .sort((a, b) => new Date(a.scheduledStartDate).getTime() - new Date(b.scheduledStartDate).getTime())
      .slice(0, limit)
      .map(project => ({
        id: project.id,
        projectName: project.projectName,
        customerName: project.customerName,
        siteAddress: project.siteAddress,
        scheduledDate: project.scheduledStartDate,
        assignedCrew: project.assignedCrew.map(crew => crew.name)
      }));
  }

  // Update project stage
  async updateProjectStage(projectId: string, newStage: InstallationStage): Promise<void> {
    await this.initialize();
    
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      project.stage = newStage;
      project.updatedDate = new Date().toISOString();
      
      // Update progress based on stage
      switch (newStage) {
        case 'Scheduled':
          project.progress = 0;
          break;
        case 'Site Survey':
          project.progress = 10;
          break;
        case 'Permits Pending':
          project.progress = 20;
          break;
        case 'Installation In Progress':
          project.progress = 50;
          break;
        case 'Inspection':
          project.progress = 90;
          break;
        case 'Completed':
          project.progress = 100;
          project.actualEndDate = new Date().toISOString();
          break;
      }
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Create new project
  async createProject(projectData: NewProjectData): Promise<void> {
    await this.initialize();
    
    const newProject: InstallationProject = {
      id: `proj-${Date.now()}`,
      customerId: `cust-${Date.now()}`,
      stage: 'Scheduled',
      assignedCrew: [],
      equipment: [],
      progress: 0,
      notes: projectData.notes || '',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      ...projectData
    };
    
    this.projects.unshift(newProject);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Get crew members
  async getCrewMembers(): Promise<CrewMember[]> {
    await this.initialize();
    return this.crew;
  }

  // Get equipment
  async getEquipment(): Promise<EquipmentItem[]> {
    await this.initialize();
    return this.equipment;
  }

  // Milestone Management Methods
  async getProjectMilestones(projectId: string): Promise<ProjectMilestone[]> {
    await this.initialize();
    return this.milestones.filter(m => m.projectId === projectId);
  }

  async updateMilestoneStatus(milestoneId: string, status: MilestoneStatus): Promise<void> {
    await this.initialize();
    const milestone = this.milestones.find(m => m.id === milestoneId);
    if (milestone) {
      milestone.status = status;
      milestone.updatedDate = new Date().toISOString();
      if (status === 'Completed') {
        milestone.actualDate = new Date().toISOString();
      }
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Task Management Methods
  async getProjectTasks(projectId: string): Promise<ProjectTask[]> {
    await this.initialize();
    return this.tasks.filter(t => t.projectId === projectId);
  }

  async getMilestoneTasks(milestoneId: string): Promise<ProjectTask[]> {
    await this.initialize();
    return this.tasks.filter(t => t.milestoneId === milestoneId);
  }

  async createTask(taskData: Omit<ProjectTask, 'id' | 'createdDate' | 'updatedDate'>): Promise<ProjectTask> {
    await this.initialize();
    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };
    this.tasks.unshift(newTask);
    await new Promise(resolve => setTimeout(resolve, 300));
    return newTask;
  }

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
    await this.initialize();
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      task.updatedDate = new Date().toISOString();
      if (status === 'Completed') {
        task.completedDate = new Date().toISOString();
      }
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  async assignTask(taskId: string, assignedTo: string): Promise<void> {
    await this.initialize();
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.assignedTo = assignedTo;
      task.updatedDate = new Date().toISOString();
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Enhanced KPI Methods
  async getEnhancedKPIData(dateRange: DateRangeType = 'YTD'): Promise<EnhancedInstallationKPIMetrics> {
    await this.initialize();
    
    const baseKPIs = await this.getKPIData(dateRange);
    
    // Calculate milestone metrics
    const completedMilestones = this.milestones.filter(m => m.status === 'Completed');
    const overdueMilestones = this.milestones.filter(m => {
      if (m.status === 'Completed') return false;
      return new Date(m.plannedDate) < new Date();
    });

    const avgMilestoneTime = completedMilestones.length > 0
      ? completedMilestones.reduce((sum, m) => {
          if (m.actualDate && m.plannedDate) {
            const planned = new Date(m.plannedDate).getTime();
            const actual = new Date(m.actualDate).getTime();
            return sum + Math.abs(actual - planned) / (1000 * 60 * 60 * 24);
          }
          return sum;
        }, 0) / completedMilestones.length
      : 0;

    // Calculate task metrics
    const completedTasks = this.tasks.filter(t => t.status === 'Completed');
    const totalTasks = this.tasks.length;
    const overdueTasks = this.tasks.filter(t => {
      if (t.status === 'Completed') return false;
      return new Date(t.dueDate) < new Date();
    });

    const taskCompletionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

    // Calculate crew productivity
    const crewProductivityScore = completedTasks.length > 0
      ? completedTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0) / this.crew.length
      : 0;

    // Calculate milestone accuracy
    const onTimeMilestones = completedMilestones.filter(m => {
      if (!m.actualDate || !m.plannedDate) return false;
      return new Date(m.actualDate) <= new Date(m.plannedDate);
    });
    const milestoneAccuracy = completedMilestones.length > 0 
      ? (onTimeMilestones.length / completedMilestones.length) * 100 
      : 0;

    return {
      ...baseKPIs,
      averageMilestoneCompletionTime: avgMilestoneTime,
      taskCompletionRate,
      overdueMilestones: overdueMilestones.length,
      overdueTasksCount: overdueTasks.length,
      crewProductivityScore,
      milestoneAccuracy
    };
  }

  // Enhanced Search and Filtering
  async getProjectsWithTasks(filters?: EnhancedInstallationSearchFilters, page = 1, pageSize = 20): Promise<{
    records: InstallationProject[];
    pagination: PaginationInfo;
  }> {
    await this.initialize();

    let filteredProjects = [...this.projects];

    // Apply base filters first
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredProjects = filteredProjects.filter(project =>
        project.projectName.toLowerCase().includes(searchLower) ||
        project.customerName.toLowerCase().includes(searchLower) ||
        project.siteAddress.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.stage) {
      filteredProjects = filteredProjects.filter(project => project.stage === filters.stage);
    }

    // Apply enhanced filters
    if (filters?.hasOverdueTasks) {
      const projectsWithOverdueTasks = new Set(
        this.tasks
          .filter(t => t.status !== 'Completed' && new Date(t.dueDate) < new Date())
          .map(t => t.projectId)
      );
      filteredProjects = filteredProjects.filter(p => projectsWithOverdueTasks.has(p.id));
    }

    if (filters?.hasOverdueMilestones) {
      const projectsWithOverdueMilestones = new Set(
        this.milestones
          .filter(m => m.status !== 'Completed' && new Date(m.plannedDate) < new Date())
          .map(m => m.projectId)
      );
      filteredProjects = filteredProjects.filter(p => projectsWithOverdueMilestones.has(p.id));
    }

    // Enhance projects with milestone and task data
    const enhancedProjects = filteredProjects.map(project => ({
      ...project,
      milestones: this.milestones.filter(m => m.projectId === project.id),
      tasks: this.tasks.filter(t => t.projectId === project.id)
    }));

    // Pagination
    const totalRecords = enhancedProjects.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProjects = enhancedProjects.slice(startIndex, endIndex);

    return {
      records: paginatedProjects,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        pageSize
      }
    };
  }
}

export const installationDataService = new InstallationDataService();