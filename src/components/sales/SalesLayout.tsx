import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './SalesLayout.css';
import backgroundImage from '../../assets/images/BACKGROUND_GROUP.png';
import { BackLink } from '../common/BackLink';
import { Tabs } from '../common/Tabs';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface SalesLayoutProps {
  children?: React.ReactNode;
}

const SalesLayout: React.FC<SalesLayoutProps> = ({ children }) => {
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
    { id: 'home', label: 'Business Summary', to: '/partners/es-portal/sales' },
    { id: 'leads', label: 'My Leads', to: '/partners/es-portal/sales/leads' },
    { id: 'opportunities', label: 'My Opportunities', to: '/partners/es-portal/sales/opportunities' },
    { id: 'sites', label: 'My Sites', to: '/partners/es-portal/sales/sites' },
    { id: 'contacts', label: 'My Contacts', to: '/partners/es-portal/sales/contacts' }
  ];

  const getActiveTab = (): string => {
    const path = location.pathname;
    if (path.endsWith('/leads')) return 'leads';
    if (path.endsWith('/opportunities')) return 'opportunities';
    if (path.endsWith('/sites')) return 'sites';
    if (path.endsWith('/contacts')) return 'contacts';
    return 'home';
  };


  return (
    <div className="sales-layout" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="sales-content">
        <BackLink fallbackTo="/partners/es-portal" />
        <Breadcrumbs />
        
        <div className="sales-greeting-section">
          <div className="sales-greeting">
            <div className="greeting-icon-sales"></div>
            <div className="greeting-content">
              <h2 className="greeting-title">Greetings RE+ Demo User!</h2>
              <p className="greeting-date">{greeting}</p>
            </div>
          </div>
        </div>

        <div className="sales-navigation">
          <Tabs
            items={tabItems}
            activeId={getActiveTab()}
            ariaLabel="Sales sections"
            className="sales-tabs"
          />
        </div>

        <main id="main-content" className="sales-main-content" tabIndex={-1}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default SalesLayout;