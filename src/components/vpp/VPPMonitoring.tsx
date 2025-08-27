import React, { useEffect, useState, useCallback } from 'react';
import './VPPMonitoring.css';
import { vppDataService } from '../../services/vppDataService';
import { VPPSite, DuckCurveData, PowerFlow, DischargeCommand } from '../../types/vppTypes';

const VPPMonitoring: React.FC = () => {
  const [sites, setSites] = useState<VPPSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<number>(1);
  const [duckCurveData, setDuckCurveData] = useState<DuckCurveData | null>(null);
  const [currentPowerFlow, setCurrentPowerFlow] = useState<PowerFlow | null>(null);
  const [, setLoading] = useState(true);
  const [dischargeLoading, setDischargeLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Discharge control state
  const [dischargeRate, setDischargeRate] = useState(2.5);
  const [dischargeDuration, setDischargeDuration] = useState(60);
  const [targetSOC, setTargetSOC] = useState(30);

  const loadMonitoringData = useCallback(async () => {
    try {
      setLoading(true);
      
      vppDataService.setCurrentSite(selectedSite);
      
      const [sitesData, duckData, siteData] = await Promise.all([
        vppDataService.getAllSites(),
        vppDataService.getDuckCurveData(),
        vppDataService.getSiteData(selectedSite)
      ]);
      
      setSites(sitesData);
      setDuckCurveData(duckData);
      setCurrentPowerFlow(siteData.currentPowerFlow);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSite]);

  useEffect(() => {
    loadMonitoringData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadMonitoringData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [loadMonitoringData]);

  const handleSiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const siteId = parseInt(event.target.value);
    setSelectedSite(siteId);
  };

  const handleDischarge = async () => {
    try {
      setDischargeLoading(true);
      
      const command: DischargeCommand = {
        deviceId: `${selectedSite}_battery`,
        rate: dischargeRate,
        duration: dischargeDuration,
        targetSOC: targetSOC,
        reason: 'Manual discharge initiated by user'
      };
      
      const response = await vppDataService.initiateDischarge(`${selectedSite}_battery`, command);
      
      if (response.success) {
        alert(`Discharge initiated successfully!\n${response.message}`);
        loadMonitoringData(); // Refresh data
      } else {
        alert('Failed to initiate discharge. Please try again.');
      }
    } catch (error) {
      console.error('Discharge error:', error);
      alert('Error initiating discharge. Please try again.');
    } finally {
      setDischargeLoading(false);
    }
  };

  const currentSite = sites.find(s => s.id === selectedSite);
  const currentBatteryLevel = currentSite?.devices.find(d => d.type === 'battery')?.chargeLevel || 0;

  return (
    <div className="vpp-monitoring">
      <div className="monitoring-header">
        <div className="header-content">
          <h1 className="monitoring-title">Energy Monitoring</h1>
          <div className="site-selector">
            <label htmlFor="site-select">Site:</label>
            <select 
              id="site-select" 
              value={selectedSite} 
              onChange={handleSiteChange}
              className="site-select"
            >
              {sites.map(site => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      <div className="monitoring-grid">
        {/* Real-time Power Flow */}
        <div className="power-flow-section">
          <h3 className="section-title">Real-time Power Flow</h3>
          {currentPowerFlow && (
            <div className="power-flow-diagram">
              <div className="power-node solar">
                <div className="node-label">Solar</div>
                <div className="node-value">{currentPowerFlow.solar.toFixed(1)} kW</div>
              </div>
              
              <div className="power-node home">
                <div className="node-label">Home</div>
                <div className="node-value">{currentPowerFlow.home.toFixed(1)} kW</div>
              </div>
              
              <div className="power-node battery">
                <div className="node-label">Battery</div>
                <div className="node-value">
                  {currentPowerFlow.battery > 0 ? '+' : ''}{currentPowerFlow.battery.toFixed(1)} kW
                </div>
                <div className="battery-level">
                  <div className="battery-bar">
                    <div 
                      className="battery-fill" 
                      style={{ height: `${currentBatteryLevel}%` }}
                    ></div>
                  </div>
                  <span className="battery-percentage">{currentBatteryLevel.toFixed(0)}%</span>
                </div>
              </div>
              
              <div className="power-node grid">
                <div className="node-label">Grid</div>
                <div className="node-value">
                  {currentPowerFlow.grid > 0 ? '+' : ''}{currentPowerFlow.grid.toFixed(1)} kW
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Energy Pattern Visualization */}
        <div className="duck-curve-section">
          <h3 className="section-title">24-Hour Energy Pattern</h3>
          {duckCurveData && (
            <div className="duck-curve-chart">
              <div className="chart-container">
                <svg viewBox="0 0 800 300" className="chart-svg">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                    <line 
                      key={i}
                      x1="60" 
                      y1={260 - i * 20} 
                      x2="740" 
                      y2={260 - i * 20}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Time axis */}
                  {[0, 3, 6, 9, 12, 15, 18, 21].map(hour => (
                    <g key={hour}>
                      <line 
                        x1={60 + (hour / 23) * 680} 
                        y1="260" 
                        x2={60 + (hour / 23) * 680} 
                        y2="265"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1"
                      />
                      <text 
                        x={60 + (hour / 23) * 680} 
                        y="280" 
                        textAnchor="middle" 
                        fill="rgba(255,255,255,0.7)"
                        fontSize="12"
                      >
                        {hour}:00
                      </text>
                    </g>
                  ))}
                  
                  {/* Solar generation curve */}
                  <path
                    d={`M 60,260 ${duckCurveData.hourlyData.map((point, index) => 
                      `L ${60 + (index / 23) * 680},${260 - (point.solarGeneration / 10) * 200}`
                    ).join(' ')}`}
                    fill="none"
                    stroke="#ffc107"
                    strokeWidth="3"
                    opacity="0.9"
                  />
                  
                  {/* Home consumption curve */}
                  <path
                    d={`M 60,260 ${duckCurveData.hourlyData.map((point, index) => 
                      `L ${60 + (index / 23) * 680},${260 - (point.homeConsumption / 10) * 200}`
                    ).join(' ')}`}
                    fill="none"
                    stroke="#2196f3"
                    strokeWidth="3"
                    opacity="0.9"
                  />
                  
                  {/* Net load (duck curve) */}
                  <path
                    d={`M 60,260 ${duckCurveData.hourlyData.map((point, index) => 
                      `L ${60 + (index / 23) * 680},${260 - (Math.max(0, point.netLoad) / 10) * 200}`
                    ).join(' ')}`}
                    fill="none"
                    stroke="#f44336"
                    strokeWidth="3"
                    opacity="0.9"
                  />
                </svg>
                
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: '#ffc107'}}></div>
                    <span>Solar Generation</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: '#2196f3'}}></div>
                    <span>Home Consumption</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{backgroundColor: '#f44336'}}></div>
                    <span>Net Grid Demand</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Discharge Control Panel */}
      <div className="discharge-control-section">
        <h3 className="section-title">Manual Discharge Control</h3>
        <div className="discharge-controls">
          <div className="control-group">
            <label htmlFor="discharge-rate">Discharge Rate (kW)</label>
            <input
              type="range"
              id="discharge-rate"
              min="0.5"
              max="5"
              step="0.1"
              value={dischargeRate}
              onChange={(e) => setDischargeRate(parseFloat(e.target.value))}
              className="slider"
            />
            <span className="slider-value">{dischargeRate.toFixed(1)} kW</span>
          </div>
          
          <div className="control-group">
            <label htmlFor="discharge-duration">Duration (minutes)</label>
            <input
              type="range"
              id="discharge-duration"
              min="15"
              max="240"
              step="15"
              value={dischargeDuration}
              onChange={(e) => setDischargeDuration(parseInt(e.target.value))}
              className="slider"
            />
            <span className="slider-value">{dischargeDuration} min</span>
          </div>
          
          <div className="control-group">
            <label htmlFor="target-soc">Target State of Charge (%)</label>
            <input
              type="range"
              id="target-soc"
              min="20"
              max="95"
              step="5"
              value={targetSOC}
              onChange={(e) => setTargetSOC(parseInt(e.target.value))}
              className="slider"
            />
            <span className="slider-value">{targetSOC}%</span>
          </div>
          
          <button 
            onClick={handleDischarge}
            disabled={dischargeLoading || currentBatteryLevel <= targetSOC}
            className="discharge-button"
          >
            {dischargeLoading ? 'Initiating...' : 'Start Discharge'}
          </button>
          
          {currentBatteryLevel <= targetSOC && (
            <p className="discharge-warning">
              Cannot discharge: Current battery level ({currentBatteryLevel.toFixed(0)}%) is at or below target SOC ({targetSOC}%)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VPPMonitoring;