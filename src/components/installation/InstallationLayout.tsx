import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './InstallationLayout.css';
import backgroundImage from '../../assets/images/BACKGROUND_GROUP.png';
import { BackLink } from '../common/BackLink';
import { Tabs } from '../common/Tabs';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface InstallationLayoutProps {
  children?: React.ReactNode;
}

const InstallationLayout: React.FC<InstallationLayoutProps> = ({ children }) => {
  const location = useLocation();
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

  const tabItems = [
    { id: 'home', label: 'Installation Dashboard', to: '/partners/es-portal/installation' },
    { id: 'active', label: 'Active Projects', to: '/partners/es-portal/installation/active' },
    { id: 'scheduled', label: 'Scheduled Installations', to: '/partners/es-portal/installation/scheduled' },
    { id: 'completed', label: 'Completed Projects', to: '/partners/es-portal/installation/completed' },
    { id: 'tasks', label: 'Tasks & Actions', to: '/partners/es-portal/installation/tasks' },
    { id: 'crew', label: 'Crew Management', to: '/partners/es-portal/installation/crew' }
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


  return (
    <div className="installation-layout" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="installation-content">
        <BackLink fallbackTo="/partners/es-portal" />
        <Breadcrumbs />
        
        <div className="installation-greeting-section">
          <div className="installation-greeting">
            <div className="greeting-icon-installation"></div>
            <div className="greeting-content">
              <h2 className="greeting-title">Installation Management Portal</h2>
              <p className="greeting-date">{greeting}</p>
            </div>
          </div>
        </div>

        <div className="installation-navigation">
          <Tabs
            items={tabItems}
            activeId={getActiveTab()}
            ariaLabel="Installation sections"
            className="installation-tabs"
          />
        </div>

        <main id="main-content" className="installation-main-content" tabIndex={-1}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default InstallationLayout;