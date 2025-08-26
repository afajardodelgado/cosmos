import { SiteRecord, SiteSearchFilters, SiteKPIMetrics, SitePaginationInfo, SiteStage, StageTimeline, SiteProgressData } from '../types/sitesTypes';
import { salesDataService } from './salesDataService';

class SitesDataService {
  private storageKey = 'siteRecords';
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const existingData = localStorage.getItem(this.storageKey);
      if (!existingData) {
        // Initialize with empty array - sites are created from closed won opportunities
        localStorage.setItem(this.storageKey, JSON.stringify([]));
      }
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize sites data service:', error);
      throw new Error('Sites data service initialization failed');
    }
  }

  private getAllSites(): SiteRecord[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveAllSites(sites: SiteRecord[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(sites));
  }

  private filterSites(sites: SiteRecord[], filters?: SiteSearchFilters): SiteRecord[] {
    let filtered = sites;

    if (filters?.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(site =>
        site.customerName.toLowerCase().includes(searchTerm) ||
        site.siteId.toLowerCase().includes(searchTerm) ||
        site.hesId.toLowerCase().includes(searchTerm) ||
        site.address.toLowerCase().includes(searchTerm) ||
        site.stage.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.stage) {
      filtered = filtered.filter(site => site.stage === filters.stage);
    }

    if (filters?.siteType) {
      filtered = filtered.filter(site => site.siteType === filters.siteType);
    }

    if (filters?.systemType) {
      filtered = filtered.filter(site => site.systemType === filters.systemType);
    }

    return filtered;
  }

  // Create new site from closed won opportunity
  async createSiteFromOpportunity(opportunityId: string): Promise<SiteRecord> {
    // Get the sales data service to fetch opportunity details
    await salesDataService.initialize();
    const salesRecords = JSON.parse(localStorage.getItem('salesRecords') || '[]');
    const opportunity = salesRecords.find((record: any) => record.id === opportunityId && record.stage === 'Closed Won');
    
    if (!opportunity) {
      throw new Error('Opportunity not found or not in Closed Won stage');
    }

    const sites = this.getAllSites();
    const siteNumber = (sites.length + 1).toString().padStart(3, '0');
    const siteId = `SITE-${siteNumber}`;
    const now = new Date().toISOString();

    // Generate realistic system details
    const systemSize = Math.floor(Math.random() * 15) + 5; // 5-20 kW
    const panelCount = Math.ceil(systemSize / 0.4); // ~400W panels
    const contractValue = systemSize * (3500 + Math.random() * 1500); // $3.50-5.00 per watt

    const newSite: SiteRecord = {
      id: `site-${Date.now()}`,
      siteId,
      customerId: opportunity.id,
      customerName: `${opportunity.firstName} ${opportunity.lastName}`,
      email: opportunity.email,
      phone: opportunity.phone,
      address: opportunity.address,
      city: opportunity.city,
      stateProvince: opportunity.stateProvince,
      postalCode: opportunity.postalCode,
      systemSize: Math.round(systemSize * 100) / 100,
      panelCount,
      systemType: ['Grid-Tied', 'Grid-Tied + Battery'][Math.floor(Math.random() * 2)] as any,
      siteType: opportunity.leadType || 'Residential',
      utilityCompany: opportunity.utilityCompany,
      stage: 'Sales Handoff',
      contractValue: Math.round(contractValue),
      hesId: opportunity.hesId,
      createdDate: now,
      handoffDate: now,
      overallProgress: 5, // 5% - just started
      stageProgress: 0,
      panelModel: ['Qcells Q.PEAK DUO BLK ML-G10+', 'Qcells Q.PEAK DUO ML-G10+'][Math.floor(Math.random() * 2)],
      inverterModel: ['SolarEdge HD-Wave SE7600H', 'Enphase IQ8PLUS'][Math.floor(Math.random() * 2)],
      updatedDate: now
    };

    sites.push(newSite);
    this.saveAllSites(sites);
    return newSite;
  }

  // Get all sites with pagination
  async getSites(filters?: SiteSearchFilters, page = 1, pageSize = 20): Promise<{ records: SiteRecord[], pagination: SitePaginationInfo }> {
    const allSites = this.getAllSites();
    const filtered = this.filterSites(allSites, filters);
    
    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecords = filtered.slice(startIndex, endIndex);

    return {
      records: paginatedRecords,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        pageSize
      }
    };
  }

  // Update site stage
  async updateSiteStage(siteId: string, newStage: SiteStage): Promise<SiteRecord> {
    const sites = this.getAllSites();
    const siteIndex = sites.findIndex(site => site.id === siteId);
    
    if (siteIndex === -1) {
      throw new Error('Site not found');
    }

    const now = new Date().toISOString();
    const site = sites[siteIndex];

    // Update stage-specific dates
    const stageProgressMap: { [key in SiteStage]: number } = {
      'Sales Handoff': 10,
      'Site Survey Scheduled': 20,
      'Site Survey Completed': 30,
      'Permit Submitted': 40,
      'Permit Approved': 50,
      'Installation Scheduled': 60,
      'Installation in Progress': 80,
      'Installation Complete': 90,
      'PTO Pending': 95,
      'PTO Granted': 100
    };

    // Update the appropriate date field based on stage
    switch (newStage) {
      case 'Site Survey Scheduled':
        site.surveyScheduledDate = now;
        break;
      case 'Site Survey Completed':
        site.surveyCompletedDate = now;
        break;
      case 'Permit Submitted':
        site.permitSubmittedDate = now;
        break;
      case 'Permit Approved':
        site.permitApprovedDate = now;
        break;
      case 'Installation Scheduled':
        site.installationScheduledDate = now;
        break;
      case 'Installation in Progress':
        site.installationStartDate = now;
        break;
      case 'Installation Complete':
        site.installationCompletedDate = now;
        break;
      case 'PTO Pending':
        site.ptoSubmittedDate = now;
        break;
      case 'PTO Granted':
        site.ptoGrantedDate = now;
        break;
    }

    sites[siteIndex] = {
      ...site,
      stage: newStage,
      overallProgress: stageProgressMap[newStage],
      stageProgress: 0, // Reset stage progress
      updatedDate: now
    };

    this.saveAllSites(sites);
    return sites[siteIndex];
  }

  // Get KPI metrics
  async getKPIData(): Promise<SiteKPIMetrics> {
    const sites = this.getAllSites();
    
    const totalSites = sites.length;
    const activeSites = sites.filter(site => site.stage !== 'PTO Granted').length;
    const completedSites = sites.filter(site => site.stage === 'PTO Granted').length;
    const sitesInPermitting = sites.filter(site => ['Permit Submitted', 'Permit Approved'].includes(site.stage)).length;
    const sitesReadyForInstallation = sites.filter(site => site.stage === 'Installation Scheduled').length;
    const ptosPending = sites.filter(site => site.stage === 'PTO Pending').length;
    const totalContractValue = sites.reduce((sum, site) => sum + site.contractValue, 0);

    // Calculate average install time for completed sites
    const completedWithDates = sites.filter(site => 
      site.stage === 'PTO Granted' && 
      site.createdDate && 
      site.ptoGrantedDate
    );
    
    const averageInstallTime = completedWithDates.length > 0 
      ? completedWithDates.reduce((sum, site) => {
          const start = new Date(site.createdDate);
          const end = new Date(site.ptoGrantedDate!);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / completedWithDates.length
      : 0;

    return {
      totalSites,
      activeSites,
      completedSites,
      averageInstallTime: Math.round(averageInstallTime),
      totalContractValue,
      sitesInPermitting,
      sitesReadyForInstallation,
      ptosPending
    };
  }

  // Get site progress timeline
  async getSiteProgress(siteId: string): Promise<SiteProgressData> {
    const sites = this.getAllSites();
    const site = sites.find(s => s.id === siteId);
    
    if (!site) {
      throw new Error('Site not found');
    }

    const stages: SiteStage[] = [
      'Sales Handoff',
      'Site Survey Scheduled',
      'Site Survey Completed', 
      'Permit Submitted',
      'Permit Approved',
      'Installation Scheduled',
      'Installation in Progress',
      'Installation Complete',
      'PTO Pending',
      'PTO Granted'
    ];

    const stageEstimates = [5, 7, 2, 10, 21, 14, 3, 1, 28, 7]; // Typical days for each stage

    const timeline: StageTimeline[] = stages.map((stage, index) => {
      const isComplete = stages.indexOf(site.stage) > index;
      const isCurrent = site.stage === stage;
      
      return {
        stage,
        estimatedDuration: stageEstimates[index],
        isComplete,
        isCurrent,
        startDate: isComplete || isCurrent ? site.createdDate : undefined,
        completedDate: isComplete ? site.createdDate : undefined // Simplified - would use actual stage dates
      };
    });

    const currentStageIndex = stages.indexOf(site.stage);
    const nextMilestone = currentStageIndex < stages.length - 1 
      ? stages[currentStageIndex + 1] 
      : 'Project Complete';

    // Estimate completion date
    const remainingDays = stageEstimates.slice(currentStageIndex).reduce((sum, days) => sum + days, 0);
    const estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + remainingDays);

    return {
      siteId: site.siteId,
      timeline,
      overallProgress: site.overallProgress,
      currentStage: site.stage,
      nextMilestone,
      estimatedCompletion: estimatedCompletion.toISOString()
    };
  }

  // Get next stage in workflow
  getNextStage(currentStage: SiteStage): SiteStage | null {
    const stages: SiteStage[] = [
      'Sales Handoff',
      'Site Survey Scheduled',
      'Site Survey Completed',
      'Permit Submitted', 
      'Permit Approved',
      'Installation Scheduled',
      'Installation in Progress',
      'Installation Complete',
      'PTO Pending',
      'PTO Granted'
    ];

    const currentIndex = stages.indexOf(currentStage);
    return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
  }

  // Force regenerate data (for testing)
  async regenerateData(): Promise<void> {
    localStorage.removeItem(this.storageKey);
    this.initialized = false;
    await this.initialize();
  }
}

export const sitesDataService = new SitesDataService();