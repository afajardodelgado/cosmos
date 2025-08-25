import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './InstallationLayout.css';
import backgroundImage from '../../assets/images/BACKGROUND_GROUP.png';

interface InstallationLayoutProps {
  children?: React.ReactNode;
}

const InstallationLayout: React.FC<InstallationLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const day = now.getDate();
    const year = now.getFullYear();
    
    // Add ordinal suffix to day
    const getOrdinalSuffix = (day: number): string => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    setGreeting(`Today is ${dayOfWeek}, ${month} ${day}${getOrdinalSuffix(day)}, ${year}`);
  }, []);

  const tabs = [
    { id: 'home', label: 'Installation Dashboard', path: '/partners/es-portal/installation' },
    { id: 'active', label: 'Active Projects', path: '/partners/es-portal/installation/active' },
    { id: 'scheduled', label: 'Scheduled Installations', path: '/partners/es-portal/installation/scheduled' },
    { id: 'completed', label: 'Completed Projects', path: '/partners/es-portal/installation/completed' },
    { id: 'tasks', label: 'Tasks & Actions', path: '/partners/es-portal/installation/tasks' },
    { id: 'crew', label: 'Crew Management', path: '/partners/es-portal/installation/crew' }
  ];

  const getActiveTab = (): string => {
    const path = location.pathname;
    if (path.endsWith('/active')) return 'active';
    if (path.endsWith('/scheduled')) return 'scheduled';
    if (path.endsWith('/completed')) return 'completed';
    if (path.endsWith('/tasks')) return 'tasks';
    if (path.endsWith('/crew')) return 'crew';
    return 'home';
  };

  const handleTabClick = (path: string): void => {
    navigate(path);
  };

  return (
    <div className="installation-layout" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="installation-content">
        <div className="installation-greeting-section">
          <div className="installation-greeting">
            <div className="greeting-icon"></div>
            <div className="greeting-content">
              <h2 className="greeting-title">Installation Management Portal</h2>
              <p className="greeting-date">{greeting}</p>
            </div>
          </div>
        </div>

        <div className="installation-navigation">
          <div className="installation-nav-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`installation-nav-tab ${getActiveTab() === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.path)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="installation-main-content">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default InstallationLayout;