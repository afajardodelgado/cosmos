import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ESPartnerPortal.css';
import backgroundImage from '../assets/images/BACKGROUND_GROUP.png';
import customerSupportIcon from '../assets/icons/customer_support.png';
import qcellsProductIcon from '../assets/icons/qcells_hw_products.png';
import esProgramIcon from '../assets/icons/es_program.png';
import partnerPortalIcon from '../assets/icons/partner_portal.png';
import { unifiedPortalService } from '../services/unifiedPortalService';
import { QuickAccessWidget, UnifiedNotification, ActivityItem, UnifiedSearchResult } from '../types/installationTypes';

const ESPartnerPortal: React.FC = () => {
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState<QuickAccessWidget[]>([]);
  const [notifications, setNotifications] = useState<UnifiedNotification[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UnifiedSearchResult[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('quick-access');

  useEffect(() => {
    initializePortalData();
    // Check URL hash for active tab
    const hash = window.location.hash.replace('#', '');
    if (hash === 'quick-access' || hash === 'modules') {
      setActiveTab(hash);
    }
  }, []);

  useEffect(() => {
    // Update URL hash when tab changes
    window.location.hash = activeTab;
  }, [activeTab]);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.unified-search') && !target.closest('.notification-center')) {
        setShowSearch(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const initializePortalData = async () => {
    try {
      setLoading(true);
      await unifiedPortalService.initialize();
      
      const [widgetData, notificationData, activityData] = await Promise.all([
        unifiedPortalService.getQuickAccessWidgets(6),
        unifiedPortalService.getUnreadNotifications(),
        unifiedPortalService.getActivities(5)
      ]);
      
      setWidgets(widgetData);
      setNotifications(notificationData);
      setActivities(activityData);
    } catch (error) {
      console.error('Failed to load portal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    try {
      const results = await unifiedPortalService.search(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSearchSelect = (result: UnifiedSearchResult) => {
    navigate(result.url);
    setSearchQuery('');
    setShowSearch(false);
  };

  const handleNotificationClick = async (notification: UnifiedNotification) => {
    await unifiedPortalService.markNotificationAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    setShowNotifications(false);
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPriorityClass = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'priority-urgent';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      default: return 'priority-low';
    }
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
          <div className="search-notification-wrapper">
            <div className="unified-search">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search across all modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  onBlur={(e) => {
                    // Only close if not clicking on dropdown
                    if (!e.relatedTarget || !e.relatedTarget.closest('.search-dropdown')) {
                      setTimeout(() => setShowSearch(false), 150);
                    }
                  }}
                  className="unified-search-input"
                />
                <span className="search-icon">⌕</span>
              </div>
              
              {showSearch && (searchResults.length > 0 || searchQuery.trim()) && (
                <div className="search-dropdown">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="search-header">Results for "{searchQuery}"</div>
                      {searchResults.map((result) => (
                        <div 
                          key={result.id} 
                          className="search-result-item"
                          onClick={() => handleSearchSelect(result)}
                        >
                          <div className="result-main">
                            <div className="result-title">{result.title}</div>
                            <div className="result-subtitle">{result.subtitle}</div>
                          </div>
                          <div className="result-meta">
                            <span className={`result-module ${result.moduleType}`}>
                              {result.moduleType}
                            </span>
                            <span className="result-time">{result.lastUpdated}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : searchQuery.trim() && (
                    <div className="no-results">No results found for "{searchQuery}"</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="notification-center">
              <button 
                className="notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="View notifications"
              >
                <span className="bell-icon">🔔</span>
                {notifications.length > 0 && (
                  <span className="notification-badge" aria-label={`${notifications.length} unread notifications`}>
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    {notifications.length > 0 && (
                      <button 
                        className="mark-all-read"
                        onClick={() => unifiedPortalService.markAllNotificationsAsRead()}
                      >
                        Mark All Read
                      </button>
                    )}
                  </div>
                  
                  <div className="notifications-list">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`notification-item ${getPriorityClass(notification.priority)}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="notification-content">
                            <div className="notification-title">{notification.title}</div>
                            <div className="notification-message">{notification.message}</div>
                            <div className="notification-time">{formatTimeAgo(notification.timestamp)}</div>
                          </div>
                          <div className="notification-actions">
                            <span className={`module-badge ${notification.moduleType}`}>
                              {notification.moduleType}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">All caught up! No new notifications.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="portal-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'quick-access'}
              aria-controls="quick-access-panel"
              tabIndex={activeTab === 'quick-access' ? 0 : -1}
              className={`portal-tab ${activeTab === 'quick-access' ? 'active' : ''}`}
              onClick={() => handleTabChange('quick-access')}
              onKeyDown={(e) => handleKeyDown(e, 'quick-access')}
            >
              Quick Access
            </button>
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
          </div>
        </div>
      </div>
      {/* Tab Content */}
      <div className="portal-content">
        {/* Quick Access Tab */}
        <div 
          id="quick-access-panel"
          role="tabpanel"
          aria-labelledby="quick-access-tab"
          className={`tab-panel ${activeTab === 'quick-access' ? 'active' : ''}`}
        >
          {/* Quick Access Widgets */}
          <div className="quick-access-section">
            <h2 className="section-title">Quick Access</h2>
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

            <Link to="/partners/es-portal/srec" className="es-portal-card">
              <div className="card-icon">
                <img src={esProgramIcon} alt="SREC" className="icon-image" />
              </div>
              <h3 className="card-title">SREC</h3>
              <p className="card-description">
                Manage Solar Renewable Energy Certificates and trading
              </p>
              <div className="card-link">Access SREC →</div>
            </Link>

            <Link to="/partners/es-portal/vpp" className="es-portal-card">
              <div className="card-icon">
                <img src={esProgramIcon} alt="VPP" className="icon-image" />
              </div>
              <h3 className="card-title">VPP</h3>
              <p className="card-description">
                Virtual Power Plant management and grid services
              </p>
              <div className="card-link">Access VPP →</div>
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
      </div>
    </div>
  );
};

export default ESPartnerPortal;