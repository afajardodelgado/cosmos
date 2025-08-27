import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './SRECLayout.css';
import backgroundImage from '../../assets/images/BACKGROUND_GROUP.png';
import { BackLink } from '../common/BackLink';
import { Tabs } from '../common/Tabs';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface SRECLayoutProps {
  children?: React.ReactNode;
}

const SRECLayout: React.FC<SRECLayoutProps> = ({ children }) => {
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
    { id: 'home', label: 'SREC Dashboard', to: '/partners/es-portal/srec' },
    { id: 'records', label: 'SREC Records', to: '/partners/es-portal/srec/records' },
    { id: 'invoicing', label: 'Invoicing & Payments', to: '/partners/es-portal/srec/invoicing' },
    { id: 'tasks', label: 'Tasks & Workflow', to: '/partners/es-portal/srec/tasks' }
  ];

  const getActiveTab = (): string => {
    const path = location.pathname;
    if (path.endsWith('/records')) return 'records';
    if (path.endsWith('/invoicing')) return 'invoicing';
    if (path.endsWith('/tasks')) return 'tasks';
    return 'home';
  };


  return (
    <div className="srec-layout" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="srec-content">
        <BackLink fallbackTo="/partners/es-portal" />
        <Breadcrumbs />
        
        <div className="srec-greeting-section">
          <div className="srec-greeting">
            <div className="greeting-icon-srec"></div>
            <div className="greeting-content">
              <h2 className="greeting-title">SREC Management Portal</h2>
              <p className="greeting-date">{greeting}</p>
            </div>
          </div>
        </div>

        <div className="srec-navigation">
          <Tabs
            items={tabItems}
            activeId={getActiveTab()}
            ariaLabel="SREC sections"
            className="srec-tabs"
          />
        </div>

        <main id="main-content" className="srec-main-content" tabIndex={-1}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default SRECLayout;