import {
  SRECRecord,
  SRECTransaction,
  SRECInvoice,
  SRECTask,
  SRECFacility,
  SRECDashboardMetrics,
  MarketData,
  SRECSearchFilters,
  InvoiceSearchFilters,
  TaskSearchFilters,
  PaginationInfo,
  NewSRECData,
  NewInvoiceData,
  NewTaskData,
  SRECStatus,
  InvoiceStatus,
  TaskStatus,
  TaskPriority
} from '../types/srecTypes';

class SRECDataService {
  private storageKey = 'srecRecords';
  private invoiceStorageKey = 'srecInvoices';
  private taskStorageKey = 'srecTasks';
  private facilityStorageKey = 'srecFacilities';
  private transactionStorageKey = 'srecTransactions';
  private marketStorageKey = 'srecMarketData';
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const keys = [
        this.storageKey,
        this.invoiceStorageKey,
        this.taskStorageKey,
        this.facilityStorageKey,
        this.transactionStorageKey,
        this.marketStorageKey
      ];

      for (const key of keys) {
        if (!localStorage.getItem(key)) {
          const mockData = this.generateMockData(key);
          localStorage.setItem(key, JSON.stringify(mockData));
        }
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize SREC data service:', error);
      throw new Error('SREC data service initialization failed');
    }
  }

  private generateMockData(key: string): any[] {
    switch (key) {
      case this.storageKey:
        return this.generateMockSRECRecords();
      case this.invoiceStorageKey:
        return this.generateMockInvoices();
      case this.taskStorageKey:
        return this.generateMockTasks();
      case this.facilityStorageKey:
        return this.generateMockFacilities();
      case this.transactionStorageKey:
        return this.generateMockTransactions();
      case this.marketStorageKey:
        return this.generateMockMarketData();
      default:
        return [];
    }
  }

  private generateMockSRECRecords(): SRECRecord[] {
    const records: SRECRecord[] = [];
    const states = ['NJ', 'PA', 'MD', 'DC', 'DE', 'OH', 'MA', 'CA', 'AZ', 'NV'];
    const statuses: SRECStatus[] = ['Generated', 'Verified', 'Listed', 'Sold', 'Settled', 'Retired'];
    const facilities = this.generateMockFacilities();

    for (let i = 0; i < 150; i++) {
      const state = states[Math.floor(Math.random() * states.length)];
      const facility = facilities[Math.floor(Math.random() * facilities.length)];
      const generationDate = new Date();
      generationDate.setDate(generationDate.getDate() - Math.floor(Math.random() * 365));
      
      const periodStart = new Date(generationDate);
      periodStart.setDate(1); // First of month
      const periodEnd = new Date(periodStart);
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      periodEnd.setDate(0); // Last day of month

      const vintage = `${generationDate.getFullYear()}-Q${Math.ceil((generationDate.getMonth() + 1) / 3)}`;
      const mwhGenerated = Math.round((Math.random() * 50 + 10) * 100) / 100; // 10-60 MWh
      const marketPrice = Math.round((Math.random() * 300 + 50) * 100) / 100; // $50-$350
      
      const statusIndex = Math.floor(Math.random() * statuses.length);
      const status = statuses[statusIndex];
      
      const record: SRECRecord = {
        id: `srec-${(i + 1).toString().padStart(3, '0')}`,
        certificateId: `SREC-${state}-${vintage}-${(i + 1).toString().padStart(6, '0')}`,
        vintage,
        generationDate: generationDate.toISOString(),
        generationPeriodStart: periodStart.toISOString(),
        generationPeriodEnd: periodEnd.toISOString(),
        mwhGenerated,
        facilityName: facility.name,
        facilityId: facility.id,
        facilityLocation: `${facility.city}, ${facility.state}`,
        state,
        srecType: 'Solar',
        status,
        marketPrice,
        salePrice: status === 'Sold' || status === 'Settled' ? Math.round((marketPrice * (0.85 + Math.random() * 0.3)) * 100) / 100 : undefined,
        buyerId: status === 'Sold' || status === 'Settled' ? `buyer-${Math.floor(Math.random() * 20) + 1}` : undefined,
        buyerName: status === 'Sold' || status === 'Settled' ? ['Energy Corp', 'Solar Traders LLC', 'Green Power Co', 'Renewable Solutions'][Math.floor(Math.random() * 4)] : undefined,
        saleDate: status === 'Sold' || status === 'Settled' ? new Date(generationDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        expirationDate: new Date(generationDate.getFullYear() + 3, 11, 31).toISOString(),
        registryId: `REG-${state}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        installationProjectId: Math.random() > 0.3 ? `proj-${Math.floor(Math.random() * 100) + 1}` : undefined,
        createdDate: generationDate.toISOString(),
        updatedDate: new Date().toISOString(),
        notes: Math.random() > 0.7 ? ['Verified by state registry', 'Pending documentation', 'Priority sale requested'][Math.floor(Math.random() * 3)] : undefined
      };

      records.push(record);
    }

    return records.sort((a, b) => new Date(b.generationDate).getTime() - new Date(a.generationDate).getTime());
  }

  private generateMockFacilities(): SRECFacility[] {
    const facilities: SRECFacility[] = [];
    const states = ['NJ', 'PA', 'MD', 'DC', 'DE', 'OH', 'MA', 'CA', 'AZ', 'NV'];
    
    const facilityNames = [
      'Sunrise Solar Farm', 'Desert Sun Power', 'Green Valley Solar', 'Phoenix Solar Park',
      'Golden State Solar', 'Liberty Solar Complex', 'Independence Solar', 'Valley View Solar',
      'Mountain Peak Solar', 'Coastal Solar Farm', 'Prairie Wind Solar', 'Desert Bloom Solar',
      'Sunshine Heights', 'Solar Ridge Facility', 'Bright Future Solar'
    ];

    const cities: Record<string, string[]> = {
      'NJ': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton'],
      'PA': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'],
      'MD': ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie'],
      'DC': ['Washington'],
      'DE': ['Wilmington', 'Dover', 'Newark', 'Middletown'],
      'OH': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
      'MA': ['Boston', 'Worcester', 'Springfield', 'Lowell', 'Cambridge'],
      'CA': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Fresno'],
      'AZ': ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'],
      'NV': ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks']
    };

    for (let i = 0; i < 25; i++) {
      const state = states[Math.floor(Math.random() * states.length)];
      const city = cities[state][Math.floor(Math.random() * cities[state].length)];
      const commissionDate = new Date();
      commissionDate.setDate(commissionDate.getDate() - Math.floor(Math.random() * 1000));

      const facility: SRECFacility = {
        id: `facility-${(i + 1).toString().padStart(3, '0')}`,
        name: facilityNames[i % facilityNames.length] + (i >= facilityNames.length ? ` ${Math.floor(i / facilityNames.length) + 1}` : ''),
        location: `${city}, ${state}`,
        address: `${Math.floor(Math.random() * 9999) + 1} Solar Drive`,
        city,
        state,
        postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        coordinates: {
          latitude: 35 + Math.random() * 15, // Rough US latitude range
          longitude: -125 + Math.random() * 50 // Rough US longitude range
        },
        capacity: Math.round((Math.random() * 100 + 5) * 100) / 100, // 5-105 MW
        technology: 'Solar',
        commissionDate: commissionDate.toISOString(),
        registryId: `FCREG-${state}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
        ownerId: `owner-${Math.floor(Math.random() * 15) + 1}`,
        ownerName: ['SunPower Corp', 'First Solar Inc', 'NextEra Energy', 'Brookfield Renewable', 'Clearway Energy'][Math.floor(Math.random() * 5)],
        utilityCompany: this.getUtilityCompany(state),
        isActive: Math.random() > 0.1, // 90% active
        certificationExpiry: new Date(commissionDate.getFullYear() + 5, commissionDate.getMonth(), commissionDate.getDate()).toISOString(),
        totalGeneration: Math.round((Math.random() * 1000 + 100) * 100) / 100, // 100-1100 MWh
        totalSRECs: Math.floor(Math.random() * 500 + 50), // 50-550 SRECs
        activeSRECs: Math.floor(Math.random() * 100 + 10), // 10-110 active SRECs
        createdDate: commissionDate.toISOString(),
        updatedDate: new Date().toISOString()
      };

      facilities.push(facility);
    }

    return facilities;
  }

  private getUtilityCompany(state: string): string {
    const utilities: Record<string, string[]> = {
      'NJ': ['Public Service Electric & Gas', 'Jersey Central Power & Light', 'Atlantic City Electric'],
      'PA': ['PECO Energy', 'PPL Electric Utilities', 'Duquesne Light'],
      'MD': ['Baltimore Gas and Electric', 'Potomac Electric Power', 'Delmarva Power'],
      'DC': ['Potomac Electric Power'],
      'DE': ['Delmarva Power'],
      'OH': ['FirstEnergy', 'American Electric Power', 'Duke Energy Ohio'],
      'MA': ['Eversource Energy', 'National Grid', 'Unitil'],
      'CA': ['Pacific Gas & Electric', 'Southern California Edison', 'San Diego Gas & Electric'],
      'AZ': ['Arizona Public Service', 'Tucson Electric Power', 'Salt River Project'],
      'NV': ['NV Energy', 'Sierra Pacific Power']
    };
    
    const stateUtilities = utilities[state] || ['Local Utility Company'];
    return stateUtilities[Math.floor(Math.random() * stateUtilities.length)];
  }

  private generateMockInvoices(): SRECInvoice[] {
    const invoices: SRECInvoice[] = [];
    const statuses: InvoiceStatus[] = ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'];
    
    const customers = [
      { name: 'Atlantic Energy Trading', email: 'billing@atlanticenergy.com', address: '123 Energy Plaza, Philadelphia, PA 19102' },
      { name: 'Green Power Solutions', email: 'accounts@greenpowersol.com', address: '456 Solar Street, Newark, NJ 07102' },
      { name: 'Renewable Trading Corp', email: 'finance@renewabletrading.com', address: '789 Clean Ave, Baltimore, MD 21201' },
      { name: 'EcoEnergy Partners', email: 'payments@ecoenergy.com', address: '321 Sustainable Blvd, Boston, MA 02101' },
      { name: 'Solar Market LLC', email: 'billing@solarmarket.com', address: '654 Green Lane, Columbus, OH 43215' }
    ];

    for (let i = 0; i < 75; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const issueDate = new Date();
      issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 90));
      
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 30);
      
      const srecCount = Math.floor(Math.random() * 10) + 1;
      const pricePerSREC = Math.round((Math.random() * 200 + 100) * 100) / 100;
      const subtotal = Math.round(srecCount * pricePerSREC * 100) / 100;
      const brokerageFee = Math.round(subtotal * 0.05 * 100) / 100;
      const processingFee = 25.00;
      const taxes = Math.round(subtotal * 0.0625 * 100) / 100; // 6.25% tax
      const totalAmount = Math.round((subtotal + brokerageFee + processingFee + taxes) * 100) / 100;
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const invoice: SRECInvoice = {
        id: `inv-${(i + 1).toString().padStart(3, '0')}`,
        invoiceNumber: `INV-SREC-${new Date().getFullYear()}-${(i + 1).toString().padStart(4, '0')}`,
        customerId: `customer-${Math.floor(Math.random() * 5) + 1}`,
        customerName: customer.name,
        customerEmail: customer.email,
        customerAddress: customer.address,
        srecIds: Array.from({length: srecCount}, (_, idx) => `srec-${Math.floor(Math.random() * 150) + 1}`),
        certificateIds: Array.from({length: srecCount}, (_, idx) => `SREC-${['NJ', 'PA', 'MD'][Math.floor(Math.random() * 3)]}-2024-Q${Math.floor(Math.random() * 4) + 1}-${(Math.floor(Math.random() * 100000) + 1).toString().padStart(6, '0')}`),
        totalSRECs: srecCount,
        pricePerSREC,
        subtotal,
        brokerageFee,
        processingFee,
        taxes,
        totalAmount,
        status,
        issueDate: issueDate.toISOString(),
        dueDate: dueDate.toISOString(),
        paidDate: status === 'Paid' ? new Date(dueDate.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        paymentMethod: status === 'Paid' ? ['ACH Transfer', 'Wire Transfer', 'Check'][Math.floor(Math.random() * 3)] : undefined,
        paymentReference: status === 'Paid' ? `PAY-${Math.floor(Math.random() * 1000000)}` : undefined,
        notes: Math.random() > 0.6 ? ['Rush delivery requested', 'Regular customer - net 30 terms', 'First-time buyer'][Math.floor(Math.random() * 3)] : undefined,
        createdDate: issueDate.toISOString(),
        updatedDate: new Date().toISOString()
      };

      invoices.push(invoice);
    }

    return invoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }

  private generateMockTasks(): SRECTask[] {
    const tasks: SRECTask[] = [];
    const statuses: TaskStatus[] = ['Open', 'In Progress', 'Completed', 'Cancelled', 'On Hold'];
    const priorities: TaskPriority[] = ['Low', 'Medium', 'High', 'Critical'];
    const categories = ['Verification', 'Registration', 'Trading', 'Compliance', 'Reporting', 'Customer Service'];
    
    const taskTemplates = [
      { title: 'Verify SREC Generation Data', description: 'Review and verify monthly generation data for SREC certification', category: 'Verification', estimatedHours: 2 },
      { title: 'Submit Registry Documentation', description: 'Upload required documentation to state SREC registry', category: 'Registration', estimatedHours: 1 },
      { title: 'Process Customer Sale Order', description: 'Execute SREC sale transaction for customer account', category: 'Trading', estimatedHours: 3 },
      { title: 'Complete Quarterly Compliance Report', description: 'Prepare and submit quarterly SREC compliance documentation', category: 'Compliance', estimatedHours: 4 },
      { title: 'Generate Monthly Revenue Report', description: 'Create detailed revenue analysis report for management', category: 'Reporting', estimatedHours: 2 },
      { title: 'Resolve Customer Invoice Query', description: 'Address customer questions regarding SREC invoice charges', category: 'Customer Service', estimatedHours: 1 },
      { title: 'Update Facility Registration', description: 'Renew facility certification with state registry', category: 'Registration', estimatedHours: 2 },
      { title: 'Market Price Analysis', description: 'Analyze current market trends and pricing forecasts', category: 'Trading', estimatedHours: 3 },
      { title: 'Certificate Expiration Review', description: 'Review expiring SRECs and notify customers', category: 'Compliance', estimatedHours: 2 }
    ];

    const assignees = [
      'Sarah Mitchell', 'David Chen', 'Emily Rodriguez', 'Michael Thompson', 'Jennifer Park',
      'Robert Wilson', 'Lisa Anderson', 'James Davis', 'Maria Gonzalez', 'Thomas Brown'
    ];

    for (let i = 0; i < 100; i++) {
      const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) - 10); // -10 to +20 days
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 14));

      const task: SRECTask = {
        id: `task-${(i + 1).toString().padStart(3, '0')}`,
        title: template.title + (Math.random() > 0.7 ? ` - ${['Q1', 'Q2', 'Q3', 'Q4'][Math.floor(Math.random() * 4)]} 2024` : ''),
        description: template.description,
        status,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        assignedTo: assignees[Math.floor(Math.random() * assignees.length)],
        assignedBy: assignees[Math.floor(Math.random() * assignees.length)],
        srecId: Math.random() > 0.5 ? `srec-${Math.floor(Math.random() * 150) + 1}` : undefined,
        certificateId: Math.random() > 0.5 ? `SREC-${['NJ', 'PA', 'MD'][Math.floor(Math.random() * 3)]}-2024-Q${Math.floor(Math.random() * 4) + 1}-${(Math.floor(Math.random() * 100000) + 1).toString().padStart(6, '0')}` : undefined,
        invoiceId: Math.random() > 0.7 ? `inv-${Math.floor(Math.random() * 75) + 1}` : undefined,
        facilityId: Math.random() > 0.6 ? `facility-${Math.floor(Math.random() * 25) + 1}` : undefined,
        dueDate: dueDate.toISOString(),
        completedDate: status === 'Completed' ? new Date(dueDate.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        estimatedHours: template.estimatedHours + Math.floor(Math.random() * 3),
        actualHours: status === 'Completed' ? template.estimatedHours + Math.floor(Math.random() * 5) - 2 : undefined,
        category: template.category as any,
        tags: [template.category.toLowerCase(), `2024-q${Math.floor(Math.random() * 4) + 1}`],
        attachments: Math.random() > 0.8 ? [`document-${Math.floor(Math.random() * 100)}.pdf`] : undefined,
        createdDate: createdDate.toISOString(),
        updatedDate: new Date().toISOString()
      };

      tasks.push(task);
    }

    return tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  private generateMockTransactions(): SRECTransaction[] {
    const transactions: SRECTransaction[] = [];
    const statuses: Array<'Pending' | 'Completed' | 'Failed' | 'Cancelled'> = ['Pending', 'Completed', 'Failed', 'Cancelled'];
    
    const sellers = ['ABC Solar Company', 'Green Energy Partners', 'Renewable Solutions LLC', 'Solar Dynamics Inc'];
    const buyers = ['Energy Trading Corp', 'Power Purchase Partners', 'Clean Energy Buyers', 'Sustainable Power Co'];

    for (let i = 0; i < 60; i++) {
      const transactionDate = new Date();
      transactionDate.setDate(transactionDate.getDate() - Math.floor(Math.random() * 180));
      
      const settlementDate = new Date(transactionDate);
      settlementDate.setDate(settlementDate.getDate() + Math.floor(Math.random() * 14) + 1);
      
      const quantity = Math.floor(Math.random() * 20) + 1;
      const salePrice = Math.round((Math.random() * 200 + 100) * 100) / 100;
      const totalValue = Math.round(quantity * salePrice * 100) / 100;
      const brokerage = Math.round(totalValue * 0.03 * 100) / 100;
      const fees = Math.round(totalValue * 0.02 * 100) / 100;
      const netAmount = Math.round((totalValue - brokerage - fees) * 100) / 100;

      const transaction: SRECTransaction = {
        id: `txn-${(i + 1).toString().padStart(3, '0')}`,
        srecId: `srec-${Math.floor(Math.random() * 150) + 1}`,
        certificateId: `SREC-${['NJ', 'PA', 'MD'][Math.floor(Math.random() * 3)]}-2024-Q${Math.floor(Math.random() * 4) + 1}-${(Math.floor(Math.random() * 100000) + 1).toString().padStart(6, '0')}`,
        sellerId: `seller-${Math.floor(Math.random() * 4) + 1}`,
        sellerName: sellers[Math.floor(Math.random() * sellers.length)],
        buyerId: `buyer-${Math.floor(Math.random() * 4) + 1}`,
        buyerName: buyers[Math.floor(Math.random() * buyers.length)],
        salePrice,
        quantity,
        totalValue,
        transactionDate: transactionDate.toISOString(),
        settlementDate: settlementDate.toISOString(),
        brokerage,
        fees,
        netAmount,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        notes: Math.random() > 0.7 ? ['Expedited settlement requested', 'Regular customer transaction', 'First-time transaction'][Math.floor(Math.random() * 3)] : undefined
      };

      transactions.push(transaction);
    }

    return transactions.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
  }

  private generateMockMarketData(): MarketData[] {
    const marketData: MarketData[] = [];
    const states = ['NJ', 'PA', 'MD', 'DC', 'DE', 'OH', 'MA'];
    const vintages = ['2024-Q1', '2024-Q2', '2024-Q3', '2024-Q4'];

    states.forEach(state => {
      vintages.forEach(vintage => {
        const basePrice = Math.round((Math.random() * 200 + 100) * 100) / 100;
        const previousPrice = Math.round((basePrice * (0.85 + Math.random() * 0.3)) * 100) / 100;
        const priceChange = Math.round((basePrice - previousPrice) * 100) / 100;
        const priceChangePercent = Math.round((priceChange / previousPrice) * 10000) / 100;

        marketData.push({
          id: `market-${state}-${vintage}`,
          state,
          vintage,
          currentPrice: basePrice,
          previousPrice,
          priceChange,
          priceChangePercent,
          volume: Math.floor(Math.random() * 1000) + 100,
          lastTradeDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          highPrice: Math.round((basePrice * 1.15) * 100) / 100,
          lowPrice: Math.round((basePrice * 0.85) * 100) / 100,
          avgPrice: Math.round((basePrice * 0.98) * 100) / 100,
          marketCap: Math.round((basePrice * (Math.random() * 50000 + 10000)) * 100) / 100,
          timestamp: new Date().toISOString()
        });
      });
    });

    return marketData;
  }

  // SREC Records Management
  async getSRECRecords(filters?: SRECSearchFilters, page = 1, pageSize = 20): Promise<{
    records: SRECRecord[];
    pagination: PaginationInfo;
  }> {
    await this.initialize();
    const allRecords = this.getAllSRECRecords();
    const filtered = this.filterSRECRecords(allRecords, filters);
    
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const records = filtered.slice(startIndex, endIndex);

    return {
      records,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        pageSize
      }
    };
  }

  private getAllSRECRecords(): SRECRecord[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private filterSRECRecords(records: SRECRecord[], filters?: SRECSearchFilters): SRECRecord[] {
    let filtered = records;

    if (filters?.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.certificateId.toLowerCase().includes(searchTerm) ||
        record.facilityName.toLowerCase().includes(searchTerm) ||
        record.facilityLocation.toLowerCase().includes(searchTerm) ||
        record.state.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.status) {
      filtered = filtered.filter(record => record.status === filters.status);
    }

    if (filters?.state) {
      filtered = filtered.filter(record => record.state === filters.state);
    }

    if (filters?.vintage) {
      filtered = filtered.filter(record => record.vintage === filters.vintage);
    }

    if (filters?.facilityId) {
      filtered = filtered.filter(record => record.facilityId === filters.facilityId);
    }

    return filtered;
  }

  async getDashboardMetrics(): Promise<SRECDashboardMetrics> {
    await this.initialize();
    const records = this.getAllSRECRecords();
    const invoices = this.getAllInvoices();
    const tasks = this.getAllTasks();
    const transactions = this.getAllTransactions();

    const totalSRECs = records.length;
    const activeSRECs = records.filter(r => ['Generated', 'Verified', 'Listed'].includes(r.status)).length;
    const soldSRECs = records.filter(r => ['Sold', 'Settled'].includes(r.status)).length;
    
    const completedTransactions = transactions.filter(t => t.status === 'Completed');
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.netAmount, 0);
    
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = completedTransactions
      .filter(t => new Date(t.transactionDate).getMonth() === currentMonth)
      .reduce((sum, t) => sum + t.netAmount, 0);

    const averagePrice = records.length > 0 ? records.reduce((sum, r) => sum + r.marketPrice, 0) / records.length : 0;
    const marketValue = records.reduce((sum, r) => sum + (r.marketPrice * r.mwhGenerated), 0);

    const pendingTransactions = transactions.filter(t => t.status === 'Pending').length;
    const overdueInvoices = invoices.filter(i => i.status === 'Overdue').length;
    const activeTasks = tasks.filter(t => ['Open', 'In Progress'].includes(t.status)).length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    return {
      totalSRECs,
      activeSRECs,
      soldSRECs,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      averagePrice: Math.round(averagePrice * 100) / 100,
      marketValue: Math.round(marketValue * 100) / 100,
      pendingTransactions,
      overdueInvoices,
      activeTasks,
      completionRate: Math.round(completionRate * 100) / 100,
      topPerformingFacility: 'Sunrise Solar Farm',
      revenueGrowth: Math.round((Math.random() * 20 - 10) * 100) / 100, // -10% to +10%
      volumeGrowth: Math.round((Math.random() * 25 - 5) * 100) / 100, // -5% to +20%
      priceVolatility: Math.round((Math.random() * 15 + 5) * 100) / 100 // 5% to 20%
    };
  }

  // Invoice Management
  async getInvoices(filters?: InvoiceSearchFilters, page = 1, pageSize = 20): Promise<{
    invoices: SRECInvoice[];
    pagination: PaginationInfo;
  }> {
    await this.initialize();
    const allInvoices = this.getAllInvoices();
    const filtered = this.filterInvoices(allInvoices, filters);
    
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const invoices = filtered.slice(startIndex, endIndex);

    return {
      invoices,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        pageSize
      }
    };
  }

  private getAllInvoices(): SRECInvoice[] {
    const data = localStorage.getItem(this.invoiceStorageKey);
    return data ? JSON.parse(data) : [];
  }

  private filterInvoices(invoices: SRECInvoice[], filters?: InvoiceSearchFilters): SRECInvoice[] {
    let filtered = invoices;

    if (filters?.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchTerm) ||
        invoice.customerName.toLowerCase().includes(searchTerm) ||
        invoice.customerEmail.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.status) {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
    }

    return filtered;
  }

  // Task Management
  async getTasks(filters?: TaskSearchFilters, page = 1, pageSize = 20): Promise<{
    tasks: SRECTask[];
    pagination: PaginationInfo;
  }> {
    await this.initialize();
    const allTasks = this.getAllTasks();
    const filtered = this.filterTasks(allTasks, filters);
    
    const totalRecords = filtered.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const tasks = filtered.slice(startIndex, endIndex);

    return {
      tasks,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        pageSize
      }
    };
  }

  private getAllTasks(): SRECTask[] {
    const data = localStorage.getItem(this.taskStorageKey);
    return data ? JSON.parse(data) : [];
  }

  private filterTasks(tasks: SRECTask[], filters?: TaskSearchFilters): SRECTask[] {
    let filtered = tasks;

    if (filters?.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.assignedTo.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters?.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters?.overdue) {
      const now = new Date();
      filtered = filtered.filter(task => 
        task.status !== 'Completed' && new Date(task.dueDate) < now
      );
    }

    return filtered;
  }

  // Additional methods
  async getFacilities(): Promise<SRECFacility[]> {
    await this.initialize();
    const data = localStorage.getItem(this.facilityStorageKey);
    return data ? JSON.parse(data) : [];
  }

  async getTransactions(): Promise<SRECTransaction[]> {
    await this.initialize();
    return this.getAllTransactions();
  }

  private getAllTransactions(): SRECTransaction[] {
    const data = localStorage.getItem(this.transactionStorageKey);
    return data ? JSON.parse(data) : [];
  }

  async getMarketData(): Promise<MarketData[]> {
    await this.initialize();
    const data = localStorage.getItem(this.marketStorageKey);
    return data ? JSON.parse(data) : [];
  }

  async updateSRECStatus(srecId: string, status: SRECStatus): Promise<void> {
    const records = this.getAllSRECRecords();
    const recordIndex = records.findIndex(r => r.id === srecId);
    if (recordIndex !== -1) {
      records[recordIndex].status = status;
      records[recordIndex].updatedDate = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(records));
    }
  }

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
    const tasks = this.getAllTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = status;
      if (status === 'Completed') {
        tasks[taskIndex].completedDate = new Date().toISOString();
      }
      tasks[taskIndex].updatedDate = new Date().toISOString();
      localStorage.setItem(this.taskStorageKey, JSON.stringify(tasks));
    }
  }
}

export const srecDataService = new SRECDataService();