import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './SRECDashboard.css';
import { srecDataService } from '../../services/srecDataService';
import { SRECDashboardMetrics, SRECRecord, SRECTask, MarketData } from '../../types/srecTypes';

const SRECDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SRECDashboardMetrics | null>(null);
  const [recentSRECs, setRecentSRECs] = useState<SRECRecord[]>([]);
  const [urgentTasks, setUrgentTasks] = useState<SRECTask[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [metricsData, srecsData, tasksData, marketDataResult] = await Promise.all([
        srecDataService.getDashboardMetrics(),
        srecDataService.getSRECRecords(undefined, 1, 5),
        srecDataService.getTasks({ priority: 'High' }, 1, 5),
        srecDataService.getMarketData()
      ]);
      
      setMetrics(metricsData);
      setRecentSRECs(srecsData.records);
      setUrgentTasks(tasksData.tasks);
      setMarketData(marketDataResult.slice(0, 4)); // Top 4 markets
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (percent: number): string => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'Generated': return 'status-generated';
      case 'Verified': return 'status-verified';
      case 'Listed': return 'status-listed';
      case 'Sold': return 'status-sold';
      case 'Settled': return 'status-settled';
      case 'Retired': return 'status-retired';
      default: return 'status-default';
    }
  };

  const getTrendClass = (value: number): string => {
    if (value > 0) return 'trend-up';
    if (value < 0) return 'trend-down';
    return 'trend-neutral';
  };

  const getTrendIcon = (value: number): string => {
    if (value > 0) return '↗';
    if (value < 0) return '↘';
    return '→';
  };

  if (loading) {
    return (
      <div className="srec-loading">
        <div className="srec-loading-spinner"></div>
        <p>Loading SREC dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="srec-error">
        <p>{error}</p>
        <button onClick={loadDashboardData} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="srec-dashboard">
      {/* KPI Metrics Grid */}
      <div className="srec-metrics-grid">
        <div className="metric-card primary">
          <div className="metric-header">
            <h3 className="metric-title">Total SRECs</h3>
            <span className="metric-icon"></span>
          </div>
          <div className="metric-value">{formatNumber(metrics?.totalSRECs || 0)}</div>
          <div className="metric-footer">
            <span className={`metric-trend ${getTrendClass(metrics?.volumeGrowth || 0)}`}>
              {getTrendIcon(metrics?.volumeGrowth || 0)} {formatPercentage(metrics?.volumeGrowth || 0)}
            </span>
            <span className="metric-label">vs last period</span>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-header">
            <h3 className="metric-title">Total Revenue</h3>
            <span className="metric-icon"></span>
          </div>
          <div className="metric-value">{formatCurrency(metrics?.totalRevenue || 0)}</div>
          <div className="metric-footer">
            <span className={`metric-trend ${getTrendClass(metrics?.revenueGrowth || 0)}`}>
              {getTrendIcon(metrics?.revenueGrowth || 0)} {formatPercentage(metrics?.revenueGrowth || 0)}
            </span>
            <span className="metric-label">revenue growth</span>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-header">
            <h3 className="metric-title">Average Price</h3>
            <span className="metric-icon"></span>
          </div>
          <div className="metric-value">{formatCurrency(metrics?.averagePrice || 0)}</div>
          <div className="metric-footer">
            <span className={`metric-trend ${getTrendClass(metrics?.priceVolatility || 0)}`}>
              {getTrendIcon(metrics?.priceVolatility || 0)} {formatPercentage(metrics?.priceVolatility || 0)}
            </span>
            <span className="metric-label">volatility</span>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-header">
            <h3 className="metric-title">Active SRECs</h3>
            <span className="metric-icon"></span>
          </div>
          <div className="metric-value">{formatNumber(metrics?.activeSRECs || 0)}</div>
          <div className="metric-footer">
            <span className="metric-label">{formatNumber(metrics?.soldSRECs || 0)} sold</span>
            <span className="metric-percentage">{metrics?.totalSRECs ? Math.round(((metrics.soldSRECs || 0) / metrics.totalSRECs) * 100) : 0}%</span>
          </div>
        </div>

        <div className="metric-card secondary">
          <div className="metric-header">
            <h3 className="metric-title">Monthly Revenue</h3>
            <span className="metric-icon"></span>
          </div>
          <div className="metric-value">{formatCurrency(metrics?.monthlyRevenue || 0)}</div>
          <div className="metric-footer">
            <span className="metric-label">{formatNumber(metrics?.pendingTransactions || 0)} pending</span>
          </div>
        </div>

        <div className="metric-card accent">
          <div className="metric-header">
            <h3 className="metric-title">Market Value</h3>
            <span className="metric-icon"></span>
          </div>
          <div className="metric-value">{formatCurrency(metrics?.marketValue || 0)}</div>
          <div className="metric-footer">
            <span className="metric-label">total portfolio</span>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="srec-content-grid">
        {/* Recent SRECs */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Recent SREC Records</h3>
            <Link to="/partners/es-portal/srec/records" className="card-action">
              View All →
            </Link>
          </div>
          <div className="card-content">
            {recentSRECs.length > 0 ? (
              <div className="recent-srecs-list">
                {recentSRECs.map((srec) => (
                  <div key={srec.id} className="srec-item">
                    <div className="srec-info">
                      <div className="srec-id">{srec.certificateId}</div>
                      <div className="srec-details">
                        <span className="srec-facility">{srec.facilityName}</span>
                        <span className="srec-location">{srec.facilityLocation}</span>
                      </div>
                      <div className="srec-generation">
                        {srec.mwhGenerated} MWh • {srec.vintage}
                      </div>
                    </div>
                    <div className="srec-status-price">
                      <span className={`srec-status ${getStatusClass(srec.status)}`}>
                        {srec.status}
                      </span>
                      <div className="srec-price">{formatCurrency(srec.marketPrice)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No recent SREC records available</p>
              </div>
            )}
          </div>
        </div>

        {/* Market Prices */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Market Prices</h3>
            <Link to="/partners/es-portal/srec/trading" className="card-action">
              View Market →
            </Link>
          </div>
          <div className="card-content">
            {marketData.length > 0 ? (
              <div className="market-data-list">
                {marketData.map((market) => (
                  <div key={market.id} className="market-item">
                    <div className="market-info">
                      <div className="market-state">{market.state}</div>
                      <div className="market-vintage">{market.vintage}</div>
                    </div>
                    <div className="market-prices">
                      <div className="market-current-price">
                        {formatCurrency(market.currentPrice)}
                      </div>
                      <div className={`market-change ${getTrendClass(market.priceChangePercent)}`}>
                        {getTrendIcon(market.priceChangePercent)} {formatPercentage(market.priceChangePercent)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No market data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Urgent Tasks */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Urgent Tasks</h3>
            <Link to="/partners/es-portal/srec/tasks" className="card-action">
              View All →
            </Link>
          </div>
          <div className="card-content">
            {urgentTasks.length > 0 ? (
              <div className="urgent-tasks-list">
                {urgentTasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <div className="task-info">
                      <div className="task-title">{task.title}</div>
                      <div className="task-details">
                        <span className="task-assignee">{task.assignedTo}</span>
                        <span className="task-due">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="task-priority">
                      <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No urgent tasks at this time</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-content">
            <div className="quick-actions-grid">
              <Link to="/partners/es-portal/srec/records" className="quick-action-btn primary">
                <span className="action-icon" aria-hidden="true">▦</span>
                <span className="action-label">Manage SRECs</span>
              </Link>
              <Link to="/partners/es-portal/srec/invoicing" className="quick-action-btn success">
                <span className="action-icon" aria-hidden="true">＋</span>
                <span className="action-label">Create Invoice</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SRECDashboard;