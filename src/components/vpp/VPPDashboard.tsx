import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './VPPDashboard.css';
import { vppDataService } from '../../services/vppDataService';
import { VPPDashboardMetrics, VPPSite, GridEvent } from '../../types/vppTypes';

const VPPDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<VPPDashboardMetrics | null>(null);
  const [sites, setSites] = useState<VPPSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<number>(1);
  const [upcomingEvents, setUpcomingEvents] = useState<GridEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      vppDataService.setCurrentSite(selectedSite);
      
      const [metricsData, sitesData, eventsData] = await Promise.all([
        vppDataService.getDashboardMetrics(),
        vppDataService.getAllSites(),
        vppDataService.getGridEvents()
      ]);
      
      setMetrics(metricsData);
      setSites(sitesData);
      setUpcomingEvents(eventsData.slice(0, 3));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedSite]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSiteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const siteId = parseInt(event.target.value);
    setSelectedSite(siteId);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online': return '#4caf50';
      case 'charging': return '#2196f3';
      case 'discharging': return '#ff9800';
      case 'maintenance': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  if (loading) {
    return (
      <div className="vpp-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading VPP dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vpp-dashboard-error">
        <p>{error}</p>
        <button onClick={loadDashboardData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  const currentSite = sites.find(s => s.id === selectedSite);

  return (
    <div className="vpp-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">VPP Dashboard</h1>
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
            <div className="site-specs">
              <span className="spec-item">{currentSite.battery}</span>
              <span className="spec-divider">•</span>
              <span className="spec-item">{currentSite.capacity}kWh</span>
              {currentSite.solar > 0 && (
                <>
                  <span className="spec-divider">•</span>
                  <span className="spec-item">{currentSite.solar}kW Solar</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {metrics && (
        <>
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-header">
                <h3 className="metric-title">Battery Status</h3>
              </div>
              <div className="metric-value">{Math.round(metrics.averageChargeLevel)}%</div>
              <div className="metric-subtitle">
                {metrics.currentTotalCharge.toFixed(1)}kWh of {metrics.totalCapacity.toFixed(1)}kWh
              </div>
              <div className="battery-visual">
                <div className="battery-shell">
                  <div 
                    className="battery-fill" 
                    style={{ width: `${metrics.averageChargeLevel}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">Monthly Earnings</h3>
              </div>
              <div className="metric-value">{formatCurrency(metrics.monthlyEarnings)}</div>
              <div className="metric-subtitle">{metrics.kWhContributedMonth} kWh contributed</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">Today's Contribution</h3>
              </div>
              <div className="metric-value">{metrics.kWhContributedToday.toFixed(1)} kWh</div>
              <div className="metric-subtitle">{metrics.activeDevices} devices active</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <h3 className="metric-title">CO₂ Avoided</h3>
              </div>
              <div className="metric-value">{metrics.co2AvoidedMonth} kg</div>
              <div className="metric-subtitle">This month</div>
            </div>
          </div>

          <div className="status-section">
            <div className="status-card">
              <h3 className="status-title">System Status</h3>
              <div className="status-indicators">
                <div className="status-item">
                  <span 
                    className="status-dot" 
                    style={{ backgroundColor: getStatusColor(metrics.systemStatus) }}
                  ></span>
                  <span className="status-label">System: {metrics.systemStatus}</span>
                </div>
                <div className="status-item">
                  <span 
                    className="status-dot" 
                    style={{ backgroundColor: getStatusColor(metrics.gridConnection) }}
                  ></span>
                  <span className="status-label">Grid: {metrics.gridConnection}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="events-section">
              <div className="section-header">
                <h3 className="section-title">Upcoming Grid Events</h3>
                <Link to="/partners/es-portal/energy-services/vpp/events" className="view-all-link">
                  View All →
                </Link>
              </div>
              <div className="events-list">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map(event => (
                    <div key={event.id} className="event-card">
                      <div className="event-header">
                        <h4 className="event-title">{event.title}</h4>
                        <span className="event-compensation">+{formatCurrency(event.compensation)}</span>
                      </div>
                      <div className="event-details">
                        <p className="event-time">
                          {formatDate(event.scheduledStart)} - {new Date(event.scheduledEnd).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="event-duration">Duration: {event.duration} minutes</p>
                      </div>
                      <div className="event-actions">
                        <span className={`participation-status ${event.userOptedIn ? 'opted-in' : 'opted-out'}`}>
                          {event.userOptedIn ? 'Participating' : 'Not Participating'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-events">
                    <p>No upcoming grid events scheduled.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="quick-actions">
              <h3 className="section-title">Quick Actions</h3>
              <div className="actions-grid">
                <Link to="/partners/es-portal/energy-services/vpp/monitoring" className="action-card">
                  <h4 className="action-title">Energy Monitoring</h4>
                  <p className="action-description">View real-time energy flow and analysis</p>
                </Link>
                
                <Link to="/partners/es-portal/energy-services/vpp/devices" className="action-card">
                  <h4 className="action-title">Device Settings</h4>
                  <p className="action-description">Manage battery settings and discharge preferences</p>
                </Link>
                
                <Link to="/partners/es-portal/energy-services/vpp/earnings" className="action-card">
                  <h4 className="action-title">Earnings Report</h4>
                  <p className="action-description">Track compensation and performance analytics</p>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VPPDashboard;