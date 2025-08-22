import { SalesRecord, NewLeadData, SearchFilters, KPIMetrics, PaginationInfo, RecentLead, LeadStage } from '../types/salesTypes';

class SalesDataService {
  private storageKey = 'salesRecords';
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const existingData = localStorage.getItem(this.storageKey);
      if (!existingData) {
        const mockData = this.generateMockData();
        localStorage.setItem(this.storageKey, JSON.stringify(mockData));
      }
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize data service:', error);
      throw new Error('Data service initialization failed');
    }
  }

  private generateMockData(): SalesRecord[] {
    const firstNames = [
      'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Chris', 'Jessica', 'Daniel', 'Ashley',
      'Matthew', 'Amanda', 'Joshua', 'Melissa', 'Andrew', 'Michelle', 'James', 'Kimberly', 'Justin', 'Amy',
      'Robert', 'Angela', 'Ryan', 'Helen', 'Brian', 'Deborah', 'Kevin', 'Rachel', 'Thomas', 'Carolyn'
    ];

    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
      'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
      'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
    ];

    const cities: Record<string, { city: string; zip: string }[]> = {
      CA: [
        { city: 'Los Angeles', zip: '90210' },
        { city: 'San Francisco', zip: '94102' },
        { city: 'San Diego', zip: '92101' },
        { city: 'Sacramento', zip: '95814' },
        { city: 'Fresno', zip: '93721' },
        { city: 'Long Beach', zip: '90802' },
        { city: 'Oakland', zip: '94612' },
        { city: 'Bakersfield', zip: '93301' },
        { city: 'Anaheim', zip: '92805' },
        { city: 'Santa Ana', zip: '92701' }
      ],
      FL: [
        { city: 'Miami', zip: '33101' },
        { city: 'Tampa', zip: '33602' },
        { city: 'Orlando', zip: '32801' },
        { city: 'Jacksonville', zip: '32099' },
        { city: 'St. Petersburg', zip: '33701' },
        { city: 'Hialeah', zip: '33010' },
        { city: 'Tallahassee', zip: '32301' },
        { city: 'Fort Lauderdale', zip: '33301' },
        { city: 'Port St. Lucie', zip: '34952' },
        { city: 'Cape Coral', zip: '33904' }
      ],
      TX: [
        { city: 'Houston', zip: '77002' },
        { city: 'San Antonio', zip: '78205' },
        { city: 'Dallas', zip: '75201' },
        { city: 'Austin', zip: '73301' },
        { city: 'Fort Worth', zip: '76102' },
        { city: 'El Paso', zip: '79901' },
        { city: 'Arlington', zip: '76010' },
        { city: 'Corpus Christi', zip: '78401' },
        { city: 'Plano', zip: '75023' },
        { city: 'Lubbock', zip: '79401' }
      ]
    };

    const utilityCompanies: Record<string, string[]> = {
      CA: ['Pacific Gas & Electric Co', 'Southern California Edison', 'San Diego Gas & Electric'],
      FL: ['Florida Power & Light', 'Duke Energy Florida', 'Tampa Electric Company'],
      TX: ['Oncor Electric Delivery', 'CenterPoint Energy', 'AEP Texas']
    };

    const stages: LeadStage[] = ['New Lead', 'Qualified', 'Converted to Opportunity', 'Contract Sent', 'Closed Won'];
    const stageDistribution = [0.6, 0.15, 0.15, 0.05, 0.05];

    const records: SalesRecord[] = [];
    const states = ['CA', 'FL', 'TX'] as const;

    for (let i = 0; i < 100; i++) {
      const state = states[Math.floor(Math.random() * states.length)];
      const cityData = cities[state][Math.floor(Math.random() * cities[state].length)];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      // Determine stage based on distribution
      let stage: LeadStage = 'New Lead';
      const rand = Math.random();
      let cumulative = 0;
      for (let j = 0; j < stageDistribution.length; j++) {
        cumulative += stageDistribution[j];
        if (rand <= cumulative) {
          stage = stages[j];
          break;
        }
      }

      const isOpportunity = ['Converted to Opportunity', 'Contract Sent', 'Closed Won'].includes(stage);
      
      // Generate random dates within the last 6 months
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 180));

      const record: SalesRecord = {
        id: `sales-${(i + 1).toString().padStart(3, '0')}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${Math.random() > 0.5 ? 'gmail.com' : 'yahoo.com'}`,
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        hesId: `HES-10713${(i).toString().padStart(2, '0')}`,
        address: `${Math.floor(Math.random() * 9999) + 1} ${['Minada Avenue', 'Oak Street', 'Main Street', 'First Avenue', 'Second Street'][Math.floor(Math.random() * 5)]}`,
        street: '',
        city: cityData.city,
        stateProvince: state,
        postalCode: cityData.zip,
        country: 'United States',
        stage,
        monthlyElectricBill: Math.floor(Math.random() * 300) + 100,
        kwhRate: Math.round((Math.random() * 0.2 + 0.1) * 100) / 100,
        leadType: ['Residential', 'Commercial', 'Industrial'][Math.floor(Math.random() * 3)],
        referredBy: Math.random() > 0.7 ? `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}` : '',
        communicationPreference: ['Email', 'Phone', 'Text'][Math.floor(Math.random() * 3)],
        gcid: `GC${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        utilityCompany: utilityCompanies[state][Math.floor(Math.random() * utilityCompanies[state].length)],
        createdDate: randomDate.toISOString(),
        updatedDate: randomDate.toISOString(),
        isOpportunity
      };

      records.push(record);
    }

    return records;
  }

  private getAllRecords(): SalesRecord[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveAllRecords(records: SalesRecord[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(records));
  }

  private filterRecords(records: SalesRecord[], filters?: SearchFilters): SalesRecord[] {
    let filtered = records;

    if (filters?.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.firstName.toLowerCase().includes(searchTerm) ||
        record.lastName.toLowerCase().includes(searchTerm) ||
        record.email.toLowerCase().includes(searchTerm) ||
        record.phone.includes(searchTerm) ||
        record.address.toLowerCase().includes(searchTerm) ||
        record.hesId.toLowerCase().includes(searchTerm) ||
        record.stage.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.stage) {
      filtered = filtered.filter(record => record.stage === filters.stage);
    }

    if (filters?.isOpportunity !== undefined) {
      filtered = filtered.filter(record => record.isOpportunity === filters.isOpportunity);
    }

    return filtered;
  }

  // CRUD Operations
  async createLead(leadData: NewLeadData): Promise<SalesRecord> {
    const records = this.getAllRecords();
    const id = `sales-${Date.now()}`;
    const hesId = `HES-${Math.floor(Math.random() * 1000000) + 1000000}`;
    const now = new Date().toISOString();

    const newRecord: SalesRecord = {
      id,
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone || '',
      hesId,
      address: leadData.address || '',
      street: leadData.street || '',
      city: leadData.city || '',
      stateProvince: leadData.stateProvince || '',
      postalCode: leadData.postalCode || '',
      country: leadData.country || 'United States',
      stage: 'New Lead',
      monthlyElectricBill: leadData.monthlyElectricBill,
      kwhRate: leadData.kwhRate,
      leadType: leadData.leadType,
      referredBy: leadData.referredBy,
      communicationPreference: leadData.communicationPreference,
      gcid: leadData.gcid,
      utilityCompany: leadData.utilityCompany,
      createdDate: now,
      updatedDate: now,
      isOpportunity: false
    };

    records.push(newRecord);
    this.saveAllRecords(records);
    return newRecord;
  }

  async getLeads(filters?: SearchFilters, page = 1, pageSize = 20): Promise<{ records: SalesRecord[], pagination: PaginationInfo }> {
    const allRecords = this.getAllRecords();
    const leads = allRecords.filter(record => !record.isOpportunity);
    const filtered = this.filterRecords(leads, filters);
    
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

  async getOpportunities(filters?: SearchFilters, page = 1, pageSize = 20): Promise<{ records: SalesRecord[], pagination: PaginationInfo }> {
    const allRecords = this.getAllRecords();
    const opportunities = allRecords.filter(record => record.isOpportunity);
    const filtered = this.filterRecords(opportunities, filters);
    
    // Sort by update date (newest first)
    filtered.sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime());

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

  async convertToOpportunity(leadId: string): Promise<SalesRecord> {
    const records = this.getAllRecords();
    const recordIndex = records.findIndex(record => record.id === leadId && !record.isOpportunity);
    
    if (recordIndex === -1) {
      throw new Error('Lead not found or already converted');
    }

    records[recordIndex] = {
      ...records[recordIndex],
      stage: 'Converted to Opportunity',
      isOpportunity: true,
      updatedDate: new Date().toISOString()
    };

    this.saveAllRecords(records);
    return records[recordIndex];
  }

  async updateOpportunityStage(id: string, stage: LeadStage): Promise<SalesRecord> {
    const records = this.getAllRecords();
    const recordIndex = records.findIndex(record => record.id === id);
    
    if (recordIndex === -1) {
      throw new Error('Opportunity not found');
    }

    records[recordIndex] = {
      ...records[recordIndex],
      stage,
      updatedDate: new Date().toISOString()
    };

    this.saveAllRecords(records);
    return records[recordIndex];
  }

  async getKPIData(dateRange: 'MTD' | 'YTD' | 'custom' = 'YTD'): Promise<KPIMetrics> {
    const records = this.getAllRecords();
    
    let filteredRecords = records;
    const now = new Date();
    
    if (dateRange === 'MTD') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredRecords = records.filter(record => new Date(record.createdDate) >= startOfMonth);
    } else if (dateRange === 'YTD') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      filteredRecords = records.filter(record => new Date(record.createdDate) >= startOfYear);
    }

    const totalLeads = filteredRecords.filter(record => !record.isOpportunity).length;
    const totalOpportunities = filteredRecords.filter(record => record.isOpportunity).length;
    const convertedOpportunities = filteredRecords.filter(record => record.stage === 'Converted to Opportunity').length;
    const closedWon = filteredRecords.filter(record => record.stage === 'Closed Won').length;
    const allLeads = filteredRecords.length;

    const leadConversionRate = allLeads > 0 ? (convertedOpportunities / allLeads) * 100 : 0;
    const netCloseRate = totalOpportunities > 0 ? (closedWon / totalOpportunities) * 100 : 0;

    // For MTD vs YTD sales, we need to filter by different date ranges
    let mtdSales = 0;
    if (dateRange === 'MTD') {
      mtdSales = closedWon;
    } else {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      mtdSales = records.filter(record => 
        record.stage === 'Closed Won' && new Date(record.updatedDate) >= startOfMonth
      ).length;
    }

    return {
      leadConversionRate: Math.round(leadConversionRate * 10) / 10,
      netCloseRate: Math.round(netCloseRate * 10) / 10,
      mtdSales,
      ytdSales: closedWon,
      totalLeads,
      totalOpportunities,
      totalClosed: closedWon
    };
  }

  async getRecentLeads(limit = 5): Promise<RecentLead[]> {
    const records = this.getAllRecords();
    const leads = records
      .filter(record => !record.isOpportunity)
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      .slice(0, limit);

    return leads.map(lead => ({
      id: lead.id,
      name: `${lead.firstName} ${lead.lastName}`,
      phone: lead.phone,
      email: lead.email,
      stage: lead.stage
    }));
  }
}

export const salesDataService = new SalesDataService();