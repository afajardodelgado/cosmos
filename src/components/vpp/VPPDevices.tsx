import React, { useEffect, useState, useCallback } from 'react';
import './VPPDevices.css';
import { vppDataService } from '../../services/vppDataService';
import { VPPDevice, VPPSite } from '../../types/vppTypes';

const VPPDevices: React.FC = () => {
  const [devices, setDevices] = useState<VPPDevice[]>([]);
  const [sites, setSites] = useState<VPPSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeviceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      vppDataService.setCurrentSite(selectedSite);
      
      const [devicesData, sitesData] = await Promise.all([
        vppDataService.getDevices(),
        vppDataService.getAllSites()
      ]);
      
      setDevices(devicesData);
      setSites(sitesData);
    } catch (err) {
      console.error('Failed to load device data:', err);
      setError('Failed to load device data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedSite]);

  useEffect(() => {
    loadDeviceData();
  }, [loadDeviceData]);

  const handleSiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const siteId = parseInt(event.target.value);
    setSelectedSite(siteId);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'charging': return '#2196f3';
      case 'discharging': return '#ff9800';
      case 'inactive': return '#9e9e9e';
      case 'maintenance': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (type: string): string => {
    switch (type) {
      case 'battery': return 'B';
      case 'solar': return 'S';
      case 'ev_charger': return 'E';
      default: return 'D';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="devices-loading">
        <div className="loading-spinner"></div>
        <p>Loading device information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="devices-error">
        <p>{error}</p>
        <button onClick={loadDeviceData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  const currentSite = sites.find(s => s.id === selectedSite);

  return (
    <div className="vpp-devices">
      <div className="devices-header">
        <div className="header-content">
          <h1 className="devices-title">Device Management</h1>
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
        {currentSite && (
          <div className="site-info">
            <p className="site-address">{currentSite.address}</p>
            <div className="site-summary">
              <span className="summary-item">{devices.length} devices enrolled</span>
              <span className="summary-divider">•</span>
              <span className="summary-item">
                {devices.filter(d => d.status === 'active' || d.status === 'charging' || d.status === 'discharging').length} active
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="devices-grid">
        {devices.map(device => (
          <div key={device.id} className={`device-card ${device.type}`}>
            <div className="device-header">
              <div className="device-icon">
                {getStatusIcon(device.type)}
              </div>
              <div className="device-info">
                <h3 className="device-name">{device.name}</h3>
                <p className="device-model">{device.brand} - {device.model}</p>
              </div>
              <div className="device-status">
                <span 
                  className="status-dot" 
                  style={{ backgroundColor: getStatusColor(device.status) }}
                ></span>
                <span className="status-text">{device.status}</span>
              </div>
            </div>

            <div className="device-metrics">
              {device.type === 'battery' && (
                <>
                  <div className="metric-item">
                    <span className="metric-label">Charge Level</span>
                    <span className="metric-value">{device.chargeLevel.toFixed(1)}%</span>
                    <div className="charge-bar">
                      <div 
                        className="charge-fill" 
                        style={{ width: `${device.chargeLevel}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Current Charge</span>
                    <span className="metric-value">{device.currentCharge.toFixed(1)} kWh</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Total Capacity</span>
                    <span className="metric-value">{device.capacity.toFixed(1)} kWh</span>
                  </div>
                </>
              )}
              
              {device.type === 'solar' && (
                <>
                  <div className="metric-item">
                    <span className="metric-label">Current Output</span>
                    <span className="metric-value">{device.chargeLevel.toFixed(1)}%</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Max Capacity</span>
                    <span className="metric-value">{device.capacity.toFixed(1)} kW</span>
                  </div>
                </>
              )}
            </div>

            <div className="device-settings">
              <h4 className="settings-title">Settings</h4>
              <div className="settings-grid">
                {device.type === 'battery' && (
                  <>
                    <div className="setting-item">
                      <label>Backup Reserve</label>
                      <span className="setting-value">{device.settings.backupReserve}%</span>
                    </div>
                    <div className="setting-item">
                      <label>Max Discharge Rate</label>
                      <span className="setting-value">{device.settings.maxDischargeRate} kW</span>
                    </div>
                  </>
                )}
                <div className="setting-item">
                  <label>Participation</label>
                  <span className={`setting-value ${device.settings.participationEnabled ? 'enabled' : 'disabled'}`}>
                    {device.settings.participationEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>

            <div className="device-details">
              <div className="detail-item">
                <span className="detail-label">Enrolled:</span>
                <span className="detail-value">{formatDate(device.enrollmentDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Activity:</span>
                <span className="detail-value">
                  {new Date(device.lastActivity).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <div className="device-actions">
              <button className="action-button primary">View Details</button>
              <button className="action-button secondary">Settings</button>
            </div>
          </div>
        ))}
      </div>

      {devices.length === 0 && (
        <div className="no-devices">
          <h3>No Devices Found</h3>
          <p>No devices are currently enrolled for this site.</p>
          <button className="add-device-button">Add Device</button>
        </div>
      )}
    </div>
  );
};

export default VPPDevices;