import { 
  VPPDevice, 
  VPPSite, 
  GridEvent, 
  VPPEarnings, 
  VPPDashboardMetrics,
  DuckCurveData,
  EnergyDataPoint,
  PowerFlow,
  DischargeCommand
} from '../types/vppTypes';

// Mock data for 10 residential sites
const mockSites: VPPSite[] = [
  {
    id: 1,
    name: "Johnson Residence",
    address: "123 Oak St, Austin, TX",
    battery: "Tesla Powerwall 2",
    capacity: 13.5,
    solar: 8.5,
    devices: [],
    currentPowerFlow: {} as PowerFlow,
    dailyData: [],
    weeklyData: []
  },
  {
    id: 2,
    name: "Smith Home",
    address: "456 Elm Ave, San Diego, CA",
    battery: "LG Chem RESU 10H",
    capacity: 9.8,
    solar: 6.5,
    devices: [],
    currentPowerFlow: {} as PowerFlow,
    dailyData: [],
    weeklyData: []
  },
  {
    id: 3,
    name: "Garcia Property",
    address: "789 Pine Rd, Phoenix, AZ",
    battery: "Enphase IQ Battery 10",
    capacity: 10.08,
    solar: 9.0,
    devices: [],
    currentPowerFlow: {} as PowerFlow,
    dailyData: [],
    weeklyData: []
  },
  {
    id: 4,
    name: "Williams House",
    address: "321 Maple Dr, Denver, CO",
    battery: "sonnenCore 10",
    capacity: 10.0,
    solar: 7.0,
    devices: [],
    currentPowerFlow: {} as PowerFlow,
    dailyData: [],
    weeklyData: []
  },
  {
    id: 5,
    name: "Brown Residence",
    address: "654 Cedar Ln, Portland, OR",
    battery: "Tesla Powerwall 3",
    capacity: 13.5,
    solar: 5.5,
    devices: [],
    currentPowerFlow: {} as PowerFlow,
    dailyData: [],
    weeklyData: []
  },
  {
    id: 6,
    name: "Davis Home",
    address: "987 Birch Ct, Sacramento, CA",
    battery: "BYD Battery-Box Premium LVL",
    capacity: 11.5,
    solar: 8.0,
    devices: [],
    currentPowerFlow: {} as PowerFlow,
    dailyData: [],
    weeklyData: []
  },
  {
    id: 7,
    name: "Miller Property",
    address: "147 Spruce Way, Las Vegas, NV",
    battery: "Generac PWRcell M6",
    capacity: 18.0,
    solar: 10.0,
    devices: [],
    currentPowerFlow: {} as PowerFlow,
    dailyData: [],
    weeklyData: []
  },
  {
    id: 8,
    name: "Wilson House",
    address: "258 Willow Pl, Miami, FL",
    battery: "Franklin WH aPower",
    capacity: 13.5,
    solar: 7.5,
    devices: [],
    currentPowerFlow: {} as PowerFlow,
    dailyData: [],
    weeklyData: []
  },
  {
    id: 9,
    name: "Moore Residence",
    address: "369 Ash Blvd, Atlanta, GA",
    battery: "SolarEdge Home Battery",
    capacity: 9.7,
    solar: 6.0,
    devices: [],
    currentPowerFlow: {} as PowerFlow,
    dailyData: [],
    weeklyData: []
  },
  {
    id: 10,
    name: "Taylor Home",
    address: "741 Fir St, Seattle, WA",
    battery: "Panasonic EverVolt 2.0",
    capacity: 11.4,
    solar: 4.5,
    devices: [],
    currentPowerFlow: {} as PowerFlow,
    dailyData: [],
    weeklyData: []
  }
];

// Generate realistic hourly energy patterns based on duck curve
const generateHourlyPattern = (siteId: number, day: number): EnergyDataPoint[] => {
  const site = mockSites[siteId - 1];
  const solarCapacity = site.solar;
  const batteryCapacity = site.capacity;
  
  // Base patterns - duck curve characteristics
  const solarPattern = [0, 0, 0, 0, 0, 0.05, 0.2, 0.4, 0.65, 0.8, 0.9, 0.95, 1.0, 0.95, 0.85, 0.7, 0.5, 0.25, 0.1, 0.02, 0, 0, 0, 0];
  const homePattern = [0.3, 0.25, 0.25, 0.25, 0.3, 0.5, 0.7, 0.9, 0.6, 0.5, 0.55, 0.6, 0.7, 0.75, 0.8, 1.0, 1.4, 1.8, 1.6, 1.2, 0.9, 0.7, 0.5, 0.4];
  
  const data: EnergyDataPoint[] = [];
  let currentBatteryLevel = 65 + Math.random() * 20; // Start between 65-85%
  
  for (let hour = 0; hour < 24; hour++) {
    const timestamp = new Date();
    timestamp.setHours(hour, 0, 0, 0);
    timestamp.setDate(timestamp.getDate() - (6 - day));
    
    // Add some randomization
    const weatherFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const usageVariation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
    
    const solar = solarPattern[hour] * solarCapacity * weatherFactor;
    const home = homePattern[hour] * (2.5 + Math.random()) * usageVariation; // 2.5-3.5 kW peak
    
    let batteryCharge = 0;
    let batteryDischarge = 0;
    let gridImport = 0;
    let gridExport = 0;
    
    const excess = solar - home;
    
    if (excess > 0) {
      // Solar excess - charge battery or export to grid
      if (currentBatteryLevel < 95) {
        const chargeAmount = Math.min(excess, 5, (95 - currentBatteryLevel) * batteryCapacity / 100);
        batteryCharge = chargeAmount;
        currentBatteryLevel += (chargeAmount / batteryCapacity) * 100;
        
        if (excess > chargeAmount) {
          gridExport = excess - chargeAmount;
        }
      } else {
        gridExport = excess;
      }
    } else {
      // Solar deficit - discharge battery or import from grid
      const deficit = Math.abs(excess);
      
      if (currentBatteryLevel > 20) {
        const maxDischarge = Math.min(5, (currentBatteryLevel - 20) * batteryCapacity / 100);
        const dischargeAmount = Math.min(deficit, maxDischarge);
        batteryDischarge = dischargeAmount;
        currentBatteryLevel -= (dischargeAmount / batteryCapacity) * 100;
        
        if (deficit > dischargeAmount) {
          gridImport = deficit - dischargeAmount;
        }
      } else {
        gridImport = deficit;
      }
    }
    
    data.push({
      timestamp: timestamp.toISOString(),
      solarGeneration: Math.round(solar * 100) / 100,
      homeConsumption: Math.round(home * 100) / 100,
      batteryCharge: Math.round(batteryCharge * 100) / 100,
      batteryDischarge: Math.round(batteryDischarge * 100) / 100,
      gridImport: Math.round(gridImport * 100) / 100,
      gridExport: Math.round(gridExport * 100) / 100,
      batteryLevel: Math.round(currentBatteryLevel * 10) / 10
    });
  }
  
  return data;
};

// Initialize sites with generated data
mockSites.forEach(site => {
  // Generate 7 days of data
  for (let day = 0; day < 7; day++) {
    const dayData = generateHourlyPattern(site.id, day);
    site.weeklyData.push(...dayData);
  }
  
  // Today's data is the most recent day
  site.dailyData = site.weeklyData.slice(-24);
  
  // Generate current power flow (latest data point)
  const latest = site.dailyData[site.dailyData.length - 1];
  site.currentPowerFlow = {
    timestamp: latest.timestamp,
    solar: latest.solarGeneration,
    home: latest.homeConsumption,
    battery: latest.batteryDischarge - latest.batteryCharge,
    grid: latest.gridImport - latest.gridExport
  };
  
  // Create devices for each site
  site.devices = [
    {
      id: `${site.id}_battery`,
      name: site.battery,
      type: 'battery',
      brand: site.battery.split(' ')[0],
      model: site.battery,
      capacity: site.capacity,
      currentCharge: site.capacity * (latest.batteryLevel / 100),
      chargeLevel: latest.batteryLevel,
      status: latest.batteryCharge > 0 ? 'charging' : latest.batteryDischarge > 0 ? 'discharging' : 'active',
      lastActivity: latest.timestamp,
      location: site.address,
      enrollmentDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      settings: {
        backupReserve: 20,
        participationEnabled: true,
        maxDischargeRate: 5,
        schedules: []
      }
    }
  ];
  
  if (site.solar > 0) {
    site.devices.push({
      id: `${site.id}_solar`,
      name: `Solar Array ${site.solar}kW`,
      type: 'solar',
      brand: 'SunPower',
      model: `${site.solar}kW Solar System`,
      capacity: site.solar,
      currentCharge: 0,
      chargeLevel: Math.round((latest.solarGeneration / site.solar) * 100),
      status: latest.solarGeneration > 0 ? 'active' : 'inactive',
      lastActivity: latest.timestamp,
      location: site.address,
      enrollmentDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      settings: {
        backupReserve: 0,
        participationEnabled: true,
        maxDischargeRate: site.solar,
        schedules: []
      }
    });
  }
});

// Mock grid events
const generateGridEvents = (): GridEvent[] => {
  const events: GridEvent[] = [];
  const now = new Date();
  
  // Generate upcoming events
  for (let i = 0; i < 5; i++) {
    const startTime = new Date(now);
    startTime.setDate(now.getDate() + i + 1);
    startTime.setHours(17 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60));
    
    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + 60 + Math.floor(Math.random() * 120));
    
    const eventTypes = ['peak_shaving', 'frequency_regulation', 'demand_response', 'voltage_support'];
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)] as any;
    
    events.push({
      id: `event_${i + 1}`,
      type,
      title: `${type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Event`,
      description: `Grid support event for ${type.replace('_', ' ')} services`,
      scheduledStart: startTime.toISOString(),
      scheduledEnd: endTime.toISOString(),
      duration: Math.round((endTime.getTime() - startTime.getTime()) / 60000),
      compensation: 15 + Math.floor(Math.random() * 35),
      status: 'scheduled',
      participationOptional: true,
      estimatedDischarge: 2 + Math.random() * 8,
      devices: [`1_battery`, `2_battery`],
      userOptedIn: Math.random() > 0.3
    });
  }
  
  return events;
};

class VPPDataService {
  private sites: VPPSite[] = mockSites;
  private currentSiteId: number = 1;
  
  // Initialize the service
  async initialize(): Promise<void> {
    return Promise.resolve();
  }
  
  // Get all sites overview
  async getAllSites(): Promise<VPPSite[]> {
    return Promise.resolve(this.sites);
  }
  
  // Get specific site data
  async getSiteData(siteId: number): Promise<VPPSite> {
    const site = this.sites.find(s => s.id === siteId);
    if (!site) {
      throw new Error(`Site ${siteId} not found`);
    }
    return Promise.resolve(site);
  }
  
  // Set current site for data context
  setCurrentSite(siteId: number): void {
    this.currentSiteId = siteId;
  }
  
  getCurrentSite(): number {
    return this.currentSiteId;
  }
  
  // Get dashboard metrics
  async getDashboardMetrics(): Promise<VPPDashboardMetrics> {
    const site = this.sites.find(s => s.id === this.currentSiteId)!;
    const devices = site.devices;
    const activeDevices = devices.filter(d => d.status === 'active' || d.status === 'charging' || d.status === 'discharging');
    
    return Promise.resolve({
      totalDevices: devices.length,
      activeDevices: activeDevices.length,
      totalCapacity: devices.reduce((sum, d) => sum + (d.type === 'battery' ? d.capacity : 0), 0),
      currentTotalCharge: devices.reduce((sum, d) => sum + (d.type === 'battery' ? d.currentCharge : 0), 0),
      averageChargeLevel: devices.filter(d => d.type === 'battery').reduce((sum, d) => sum + d.chargeLevel, 0) / devices.filter(d => d.type === 'battery').length,
      monthlyEarnings: 450 + Math.floor(Math.random() * 200),
      kWhContributedToday: 12.5 + Math.random() * 10,
      kWhContributedMonth: 285 + Math.floor(Math.random() * 100),
      co2AvoidedMonth: 156 + Math.floor(Math.random() * 50),
      systemStatus: 'online',
      gridConnection: 'connected'
    });
  }
  
  // Get devices for current site
  async getDevices(): Promise<VPPDevice[]> {
    const site = this.sites.find(s => s.id === this.currentSiteId)!;
    return Promise.resolve(site.devices);
  }
  
  // Get grid events
  async getGridEvents(): Promise<GridEvent[]> {
    return Promise.resolve(generateGridEvents());
  }
  
  // Get earnings data
  async getEarnings(): Promise<VPPEarnings[]> {
    const earnings: VPPEarnings[] = [];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const month = new Date(now);
      month.setMonth(now.getMonth() - i);
      
      const baseEarnings = 400 + Math.floor(Math.random() * 300);
      
      earnings.push({
        id: `earnings_${i}`,
        month: month.toISOString().slice(0, 7),
        totalEarnings: baseEarnings,
        breakdown: {
          peakShaving: Math.floor(baseEarnings * 0.4),
          frequencyRegulation: Math.floor(baseEarnings * 0.3),
          demandResponse: Math.floor(baseEarnings * 0.2),
          voltageSupport: Math.floor(baseEarnings * 0.1)
        },
        kWhContributed: 200 + Math.floor(Math.random() * 150),
        eventsParticipated: 8 + Math.floor(Math.random() * 12),
        paymentStatus: i === 0 ? 'pending' : 'paid',
        paymentDate: i === 0 ? undefined : new Date(month.getFullYear(), month.getMonth() + 1, 15).toISOString()
      });
    }
    
    return Promise.resolve(earnings);
  }
  
  // Get duck curve data
  async getDuckCurveData(date?: string): Promise<DuckCurveData> {
    const site = this.sites.find(s => s.id === this.currentSiteId)!;
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const hourlyData = [];
    for (let hour = 0; hour < 24; hour++) {
      const dataPoint = site.dailyData[hour];
      const netLoad = dataPoint.homeConsumption - dataPoint.solarGeneration;
      
      hourlyData.push({
        hour,
        solarGeneration: dataPoint.solarGeneration,
        homeConsumption: dataPoint.homeConsumption,
        netLoad,
        gridDemand: Math.max(0, netLoad),
        batteryAction: dataPoint.batteryDischarge - dataPoint.batteryCharge
      });
    }
    
    return Promise.resolve({
      date: targetDate,
      hourlyData
    });
  }
  
  // Discharge control (mock implementation)
  async initiateDischarge(deviceId: string, command: DischargeCommand): Promise<{ success: boolean; message: string }> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return Promise.resolve({
      success: true,
      message: `Discharge initiated for device ${deviceId} at ${command.rate}kW for ${command.duration} minutes`
    });
  }
  
  async cancelDischarge(deviceId: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return Promise.resolve({
      success: true,
      message: `Discharge cancelled for device ${deviceId}`
    });
  }
}

export const vppDataService = new VPPDataService();