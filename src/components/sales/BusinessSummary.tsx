import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BusinessSummary.css';
import { salesDataService } from '../../services/salesDataService';
import { KPIMetrics, RecentLead, DateRangeType } from '../../types/salesTypes';

const BusinessSummary: React.FC = () => {
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState<KPIMetrics | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [dateRange, setDateRange] = useState<DateRangeType>('YTD');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeData();
  }, [dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize database if needed
      await salesDataService.initialize();
      
      // Load KPI data and recent leads
      const [kpis, leads] = await Promise.all([
        salesDataService.getKPIData(dateRange),
        salesDataService.getRecentLeads(3)
      ]);
      
      setKpiData(kpis);
      setRecentLeads(leads);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getProgressAngle = (percentage: number): number => {
    return Math.min(percentage * 3.6, 360); // Convert percentage to degrees (max 360°)
  };

  const handleLeadView = (leadId: string): void => {
    navigate(`/partners/es-portal/sales/leads?highlight=${leadId}`);
  };

  const mockUpcomingAppointments = [
    {
      id: '1',
      customerName: 'No Upcoming Appointments!',
      date: '',
      time: '',
      type: ''
    }
  ];

  if (loading) {
    return (
      <div className="business-summary-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="business-summary-error">
        <p>{error}</p>
        <button onClick={initializeData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="business-summary">
      <div className="business-summary-content">
        <div className="main-dashboard">
          <div className="date-range-selector">
            <button
              className={`date-range-btn ${dateRange === 'MTD' ? 'active' : ''}`}
              onClick={() => setDateRange('MTD')}
            >
              MTD
            </button>
            <button
              className={`date-range-btn ${dateRange === 'YTD' ? 'active' : ''}`}
              onClick={() => setDateRange('YTD')}
            >
              YTD
            </button>
          </div>

          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-header">
                <h3 className="kpi-title">Lead Conversion (%)</h3>
              </div>
              <div className="kpi-gauge-container">
                <div className="kpi-gauge">
                  <svg className="gauge-svg" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke="#e9ecef"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke="url(#leadGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${getProgressAngle(kpiData?.leadConversionRate || 0) * 0.785} 283`}
                      transform="rotate(-90 60 60)"
                    />
                    <defs>
                      <linearGradient id="leadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00bcd4" />
                        <stop offset="100%" stopColor="#4caf50" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="gauge-value">
                    {formatPercentage(kpiData?.leadConversionRate || 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <h3 className="kpi-title">Net Close Rate (%)</h3>
              </div>
              <div className="kpi-gauge-container">
                <div className="kpi-gauge">
                  <svg className="gauge-svg" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke="#e9ecef"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke="url(#closeGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${getProgressAngle(kpiData?.netCloseRate || 0) * 0.785} 283`}
                      transform="rotate(-90 60 60)"
                    />
                    <defs>
                      <linearGradient id="closeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00bcd4" />
                        <stop offset="100%" stopColor="#4caf50" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="gauge-value">
                    {formatPercentage(kpiData?.netCloseRate || 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <h3 className="kpi-title">MTD Sales</h3>
              </div>
              <div className="kpi-number-container">
                <div className="kpi-number">
                  {dateRange === 'MTD' ? kpiData?.mtdSales || 0 : kpiData?.ytdSales || 0}
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <h3 className="kpi-title">YTD Sales</h3>
              </div>
              <div className="kpi-number-container">
                <div className="kpi-number">
                  {kpiData?.ytdSales || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-section">
            <div className="quick-create-section">
              <button 
                className="quick-create-btn"
                onClick={() => navigate('/partners/es-portal/sales/leads')}
              >
                Quick Create Lead
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Recent Leads</h3>
            <div className="recent-leads">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="recent-lead-item">
                  <div className="lead-icon"></div>
                  <div className="lead-info">
                    <div className="lead-name">{lead.name}</div>
                    <div className="lead-contact">{lead.phone}</div>
                    <div className="lead-email">{lead.email}</div>
                  </div>
                  <button 
                    className="view-btn"
                    onClick={() => handleLeadView(lead.id)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Upcoming Appointments</h3>
            <div className="upcoming-appointments">
              {mockUpcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-empty">
                    {appointment.customerName}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="energysaver-card">
              <div className="energysaver-logo">
                <div className="logo-placeholder"></div>
              </div>
              <h4 className="energysaver-title">EnergySaver</h4>
              <div className="energysaver-contact">
                <div className="contact-phone">(123) 456-7890</div>
                <div className="contact-email">test@energysaver.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSummary;