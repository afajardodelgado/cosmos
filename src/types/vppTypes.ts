// VPP (Virtual Power Plant) Types
export interface VPPDevice {
  id: string;
  name: string;
  type: 'battery' | 'solar' | 'ev_charger';
  brand: string;
  model: string;
  capacity: number; // kWh
  currentCharge: number; // kWh
  chargeLevel: number; // percentage 0-100
  status: 'active' | 'inactive' | 'charging' | 'discharging' | 'maintenance';
  lastActivity: string;
  location: string;
  enrollmentDate: string;
  settings: {
    backupReserve: number; // percentage
    participationEnabled: boolean;
    maxDischargeRate: number; // kW
    schedules: DischargeSchedule[];
  };
}

export interface VPPSite {
  id: number;
  name: string;
  address: string;
  battery: string;
  capacity: number;
  solar: number;
  devices: VPPDevice[];
  currentPowerFlow: PowerFlow;
  dailyData: EnergyDataPoint[];
  weeklyData: EnergyDataPoint[];
}

export interface PowerFlow {
  timestamp: string;
  solar: number; // kW (positive = generating)
  home: number; // kW (positive = consuming)
  battery: number; // kW (positive = discharging, negative = charging)
  grid: number; // kW (positive = importing, negative = exporting)
}

export interface EnergyDataPoint {
  timestamp: string;
  solarGeneration: number;
  homeConsumption: number;
  batteryCharge: number;
  batteryDischarge: number;
  gridImport: number;
  gridExport: number;
  batteryLevel: number; // percentage
}

export interface GridEvent {
  id: string;
  type: 'peak_shaving' | 'frequency_regulation' | 'demand_response' | 'voltage_support';
  title: string;
  description: string;
  scheduledStart: string;
  scheduledEnd: string;
  duration: number; // minutes
  compensation: number; // $ per event
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  participationOptional: boolean;
  estimatedDischarge: number; // kWh
  devices: string[]; // device IDs
  userOptedIn: boolean;
}

export interface VPPEarnings {
  id: string;
  month: string;
  totalEarnings: number;
  breakdown: {
    peakShaving: number;
    frequencyRegulation: number;
    demandResponse: number;
    voltageSupport: number;
  };
  kWhContributed: number;
  eventsParticipated: number;
  paymentStatus: 'pending' | 'paid' | 'processing';
  paymentDate?: string;
}

export interface DischargeSchedule {
  id: string;
  name: string;
  enabled: boolean;
  days: string[]; // ['monday', 'tuesday', etc.]
  startTime: string; // 'HH:MM'
  endTime: string; // 'HH:MM'
  dischargeRate: number; // kW
  targetSOC: number; // percentage
}

export interface DischargeCommand {
  deviceId: string;
  rate: number; // kW
  duration: number; // minutes
  targetSOC: number; // percentage
  reason: string;
}

export interface VPPDashboardMetrics {
  totalDevices: number;
  activeDevices: number;
  totalCapacity: number; // kWh
  currentTotalCharge: number; // kWh
  averageChargeLevel: number; // percentage
  monthlyEarnings: number;
  kWhContributedToday: number;
  kWhContributedMonth: number;
  co2AvoidedMonth: number; // kg
  nextEvent?: GridEvent;
  systemStatus: 'online' | 'offline' | 'maintenance';
  gridConnection: 'connected' | 'disconnected' | 'unstable';
}

export interface DuckCurveData {
  date: string;
  hourlyData: {
    hour: number;
    solarGeneration: number;
    homeConsumption: number;
    netLoad: number; // consumption - solar
    gridDemand: number;
    batteryAction: number; // positive = discharge, negative = charge
  }[];
}

// Chart data interfaces
export interface ChartDataPoint {
  time: string;
  value: number;
  label?: string;
}

export interface PowerFlowChartData {
  timestamp: string;
  flows: {
    solarToHome: number;
    solarToBattery: number;
    solarToGrid: number;
    batteryToHome: number;
    batteryToGrid: number;
    gridToHome: number;
    gridToBattery: number;
  };
}