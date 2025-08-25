import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InstallationSummary.css';
import { installationDataService } from '../../services/installationDataService';
import { RecentProject, DateRangeType, UpcomingInstallation, EnhancedInstallationKPIMetrics } from '../../types/installationTypes';

const InstallationSummary: React.FC = () => {
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState<EnhancedInstallationKPIMetrics | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [upcomingInstallations, setUpcomingInstallations] = useState<UpcomingInstallation[]>([]);
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
      await installationDataService.initialize();
      
      // Load enhanced KPI data, recent projects, and upcoming installations
      const [kpis, projects, upcoming] = await Promise.all([
        installationDataService.getEnhancedKPIData(dateRange),
        installationDataService.getRecentProjects(3),
        installationDataService.getUpcomingInstallations(3)
      ]);
      
      setKpiData(kpis);
      setRecentProjects(projects);
      setUpcomingInstallations(upcoming);
    } catch (err) {
      console.error('Failed to load installation dashboard data:', err);
      setError('Failed to load installation dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getProgressAngle = (percentage: number): number => {
    return Math.min(percentage * 3.6, 360); // Convert percentage to degrees (max 360°)
  };

  const handleProjectView = (projectId: string): void => {
    navigate(`/partners/es-portal/installation/active?highlight=${projectId}`);
  };

  const getStageClass = (stage: string): string => {
    switch (stage) {
      case 'Scheduled':
        return 'stage-scheduled';
      case 'Site Survey':
        return 'stage-survey';
      case 'Permits Pending':
        return 'stage-permits';
      case 'Installation In Progress':
        return 'stage-progress';
      case 'Inspection':
        return 'stage-inspection';
      case 'Completed':
        return 'stage-completed';
      default:
        return 'stage-default';
    }
  };

  const mockQuickActions = [
    {
      id: '1',
      title: 'Schedule Site Visit',
      description: 'Plan new installation visits'
    },
    {
      id: '2',
      title: 'Crew Assignment',
      description: 'Assign crews to projects'
    },
    {
      id: '3',
      title: 'Equipment Check',
      description: 'Review equipment availability'
    }
  ];

  if (loading) {
    return (
      <div className="installation-summary-loading">
        <div className="loading-spinner"></div>
        <p>Loading installation dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="installation-summary-error">
        <p>{error}</p>
        <button onClick={initializeData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="installation-summary">
      <div className="installation-summary-content">
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
                <h3 className="kpi-title">Milestone Completion Rate</h3>
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
                      stroke="url(#milestoneGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${getProgressAngle(kpiData?.milestoneAccuracy || 0) * 0.785} 283`}
                      transform="rotate(-90 60 60)"
                    />
                    <defs>
                      <linearGradient id="milestoneGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4caf50" />
                        <stop offset="100%" stopColor="#8bc34a" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="gauge-value">
                    {formatPercentage(kpiData?.milestoneAccuracy || 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <h3 className="kpi-title">Task Completion Rate</h3>
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
                      stroke="url(#taskGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${getProgressAngle(kpiData?.taskCompletionRate || 0) * 0.785} 283`}
                      transform="rotate(-90 60 60)"
                    />
                    <defs>
                      <linearGradient id="taskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2196f3" />
                        <stop offset="100%" stopColor="#64b5f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="gauge-value">
                    {formatPercentage(kpiData?.taskCompletionRate || 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <h3 className="kpi-title">Revenue {dateRange}</h3>
              </div>
              <div className="kpi-number-container">
                <div className="kpi-number">
                  {formatCurrency(dateRange === 'MTD' ? kpiData?.revenueGeneratedMTD || 0 : kpiData?.revenueGeneratedYTD || 0)}
                </div>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <h3 className="kpi-title">Overdue Items</h3>
              </div>
              <div className="kpi-number-container">
                <div className="kpi-number overdue-indicator">
                  {(kpiData?.overdueTasksCount || 0) + (kpiData?.overdueMilestones || 0)}
                </div>
                <div className="kpi-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-value">{kpiData?.overdueTasksCount || 0}</span>
                    <span className="breakdown-label">Tasks</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-value">{kpiData?.overdueMilestones || 0}</span>
                    <span className="breakdown-label">Milestones</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="kpi-card">
              <div className="kpi-header">
                <h3 className="kpi-title">Crew Productivity</h3>
              </div>
              <div className="kpi-number-container">
                <div className="kpi-number priority-indicator">
                  {Math.round((kpiData?.crewProductivityScore || 0) * 10)}
                </div>
                <div className="kpi-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-value">{kpiData?.crewProductivityScore ? Math.round(kpiData.crewProductivityScore * 10) : 0}</span>
                    <span className="breakdown-label">Daily Score</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-value">{kpiData?.averageMilestoneCompletionTime ? Math.round(kpiData.averageMilestoneCompletionTime) : 0}</span>
                    <span className="breakdown-label">Avg Days</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="kpi-card">
              <div className="kpi-header">
                <h3 className="kpi-title">Active Projects</h3>
              </div>
              <div className="kpi-number-container">
                <div className="kpi-number">
                  {kpiData?.totalActiveProjects || 0}
                </div>
                <div className="kpi-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-value">{Math.round((kpiData?.onTimeCompletionRate || 0))}%</span>
                    <span className="breakdown-label">On Time</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-value">{Math.round(100 - (kpiData?.onTimeCompletionRate || 0))}%</span>
                    <span className="breakdown-label">Behind</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Quick Actions</h3>
            <div className="quick-actions">
              {mockQuickActions.map((action) => (
                <div key={action.id} className="quick-action-item">
                  <div className="action-icon"></div>
                  <div className="action-info">
                    <div className="action-title">{action.title}</div>
                    <div className="action-description">{action.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Recent Projects</h3>
            <div className="recent-projects">
              {recentProjects.map((project) => (
                <div key={project.id} className="recent-project-item">
                  <div className="project-icon"></div>
                  <div className="project-info">
                    <div className="project-name">{project.projectName}</div>
                    <div className="project-customer">{project.customerName}</div>
                    <div className="project-progress">
                      <span className={`stage-badge ${getStageClass(project.stage)}`}>
                        {project.stage}
                      </span>
                      <span className="progress-text">{project.progress}%</span>
                    </div>
                  </div>
                  <button 
                    className="view-btn"
                    onClick={() => handleProjectView(project.id)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Upcoming Installations</h3>
            <div className="upcoming-installations">
              {upcomingInstallations.map((installation) => (
                <div key={installation.id} className="upcoming-item">
                  <div className="installation-date">
                    {new Date(installation.scheduledDate).toLocaleDateString()}
                  </div>
                  <div className="installation-info">
                    <div className="installation-project">{installation.projectName}</div>
                    <div className="installation-customer">{installation.customerName}</div>
                    <div className="installation-crew">
                      Crew: {installation.assignedCrew.join(', ') || 'Not assigned'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="company-card">
              <div className="company-logo">
                <div className="logo-placeholder"></div>
              </div>
              <h4 className="company-title">Cosmos Installation</h4>
              <div className="company-contact">
                <div className="contact-phone">(555) 123-4567</div>
                <div className="contact-email">installs@cosmos.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallationSummary;