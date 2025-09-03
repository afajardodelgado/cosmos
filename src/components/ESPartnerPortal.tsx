import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ESPartnerPortal.css';
import backgroundImage from '../assets/images/Background-1Component4.png';
import customerSupportIcon from '../assets/icons/customer_support.png';
import qcellsProductIcon from '../assets/icons/qcells_hw_products.png';
import esProgramIcon from '../assets/icons/es_program.png';
import partnerPortalIcon from '../assets/icons/partner_portal.png';
import { unifiedPortalService } from '../services/unifiedPortalService';
import { QuickAccessWidget, ActivityItem } from '../types/installationTypes';

const ESPartnerPortal: React.FC = () => {
  const [widgets, setWidgets] = useState<QuickAccessWidget[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('modules');

  useEffect(() => {
    initializePortalData();
    // Check URL hash for active tab
    const hash = window.location.hash.replace('#', '');
    if (hash === 'global-dashboard' || hash === 'modules') {
      setActiveTab(hash);
    } else {
      // Default to modules tab
      setActiveTab('modules');
    }
  }, []);

  useEffect(() => {
    // Update URL hash when tab changes
    window.location.hash = activeTab;
  }, [activeTab]);



  const initializePortalData = async () => {
    try {
      setLoading(true);
      await unifiedPortalService.initialize();
      
      const [widgetData, activityData] = await Promise.all([
        unifiedPortalService.getQuickAccessWidgets(6),
        unifiedPortalService.getActivities(5)
      ]);
      
      setWidgets(widgetData);
      setActivities(activityData);
    } catch (error) {
      console.error('Failed to load portal data:', error);
    } finally {
      setLoading(false);
    }
  };




  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };


  const getTrendIcon = (direction: 'up' | 'down' | 'stable'): string => {
    switch (direction) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabChange(tabId);
    }
  };

  return (
    <div className="es-partner-portal-page" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="es-portal-hero">
        <div className="hero-content">
          <div className="es-portal-badge">ES Partner Portal</div>
          <h1 className="es-portal-title">
            <span className="title-blue">Energy</span> Solutions
          </h1>
          <p className="es-portal-subtitle">
            Access all your energy solutions tools and resources in one place
          </p>
        </div>
      </div>
      
      {/* Sticky Search and Navigation */}
      <div className="portal-nav-sticky">
        <div className="portal-nav-content">
          
          <div className="portal-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'modules'}
              aria-controls="modules-panel"
              tabIndex={activeTab === 'modules' ? 0 : -1}
              className={`portal-tab ${activeTab === 'modules' ? 'active' : ''}`}
              onClick={() => handleTabChange('modules')}
              onKeyDown={(e) => handleKeyDown(e, 'modules')}
            >
              Modules
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'global-dashboard'}
              aria-controls="global-dashboard-panel"
              tabIndex={activeTab === 'global-dashboard' ? 0 : -1}
              className={`portal-tab ${activeTab === 'global-dashboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('global-dashboard')}
              onKeyDown={(e) => handleKeyDown(e, 'global-dashboard')}
            >
              Global Dashboard
            </button>
          </div>
        </div>
      </div>
      {/* Tab Content */}
      <div className="portal-content">
        {/* Modules Tab */}
        <div 
          id="modules-panel"
          role="tabpanel"
          aria-labelledby="modules-tab"
          className={`tab-panel ${activeTab === 'modules' ? 'active' : ''}`}
        >
          <div className="es-portal-grid">
            <Link to="/partners/es-portal/sales" className="es-portal-card">
              <div className="card-icon">
                <img src={customerSupportIcon} alt="Sales" className="icon-image" />
              </div>
              <h3 className="card-title">Sales</h3>
              <p className="card-description">
                Access sales tools, pricing, and customer management resources
              </p>
              <div className="card-link">Access Sales →</div>
            </Link>

            <Link to="/partners/es-portal/installation" className="es-portal-card">
              <div className="card-icon">
                <img src={qcellsProductIcon} alt="Installation/Fulfillment" className="icon-image" />
              </div>
              <h3 className="card-title">Installation/Fulfillment</h3>
              <p className="card-description">
                Manage installations, fulfillment processes, and project tracking
              </p>
              <div className="card-link">Access Installation →</div>
            </Link>

            <Link to="/partners/es-portal/monitoring" className="es-portal-card">
              <div className="card-icon">
                <img src={partnerPortalIcon} alt="Monitoring" className="icon-image" />
              </div>
              <h3 className="card-title">Monitoring</h3>
              <p className="card-description">
                Monitor system performance and track energy production data
              </p>
              <div className="card-link">Access Monitoring →</div>
            </Link>

            <Link to="/partners/es-portal/energy-services" className="es-portal-card">
              <div className="card-icon">
                <img src={esProgramIcon} alt="Energy Services" className="icon-image" />
              </div>
              <h3 className="card-title">Energy Services</h3>
              <p className="card-description">
                Manage renewable energy programs including SREC trading and Virtual Power Plant participation
              </p>
              <div className="card-link">Access Energy Services →</div>
            </Link>

            <Link to="/partners/es-portal/support" className="es-portal-card">
              <div className="card-icon">
                <img src={customerSupportIcon} alt="Customer Support" className="icon-image" />
              </div>
              <h3 className="card-title">Customer Support</h3>
              <p className="card-description">
                Get help and support for ES Partner Portal services
              </p>
              <div className="card-link">Get Support →</div>
            </Link>
          </div>
        </div>
        
        {/* Global Dashboard Tab */}
        <div 
          id="global-dashboard-panel"
          role="tabpanel"
          aria-labelledby="global-dashboard-tab"
          className={`tab-panel ${activeTab === 'global-dashboard' ? 'active' : ''}`}
        >
          {/* Quick Access Widgets */}
          <div className="quick-access-section">
            <h2 className="section-title">Global Dashboard</h2>
            <div className="widgets-grid">
              {loading ? (
                <div className="widgets-loading">Loading dashboard...</div>
              ) : (
                widgets.map((widget) => (
                  <div key={widget.id} className={`widget-card ${widget.type}`}>
                    <div className="widget-header">
                      <h3 className="widget-title">{widget.title}</h3>
                      <span className={`module-indicator ${widget.moduleType}`}>
                        {widget.moduleType === 'combined' ? 'All' : widget.moduleType}
                      </span>
                    </div>
                    
                    <div className="widget-value">
                      <span className="main-value">{widget.value}</span>
                      {widget.trend && (
                        <div className={`trend ${widget.trend.direction}`}>
                          <span className="trend-icon">{getTrendIcon(widget.trend.direction)}</span>
                          <span className="trend-text">
                            {widget.trend.value}% {widget.trend.label}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {widget.actionUrl && (
                      <Link to={widget.actionUrl} className="widget-action">
                        {widget.actionLabel} →
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Recent Activity Feed */}
          <div className="activity-section">
            <div className="activity-header">
              <h2 className="section-title">Recent Activity</h2>
              <Link to="/partners/es-portal/activity" className="view-all-link">View All Activity</Link>
            </div>
            
            <div className="activity-feed">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    <span className={`activity-type ${activity.type}`}></span>
                  </div>
                  
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-description">{activity.description}</div>
                    <div className="activity-meta">
                      <span className="activity-user">{activity.userName}</span>
                      <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
                      <span className={`activity-module ${activity.moduleType}`}>
                        {activity.moduleType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESPartnerPortal;