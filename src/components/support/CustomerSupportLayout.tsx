import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './CustomerSupportLayout.css';
import backgroundImage from '../../assets/images/Background-1Component4.png';
import { BackLink } from '../common/BackLink';
import { Tabs } from '../common/Tabs';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface CustomerSupportLayoutProps {
  children?: React.ReactNode;
}

const CustomerSupportLayout: React.FC<CustomerSupportLayoutProps> = ({ children }) => {
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
    { id: 'dashboard', label: 'Dashboard', to: '/partners/es-portal/support' },
    { id: 'submit', label: 'Submit Ticket', to: '/partners/es-portal/support/submit' },
    { id: 'tickets', label: 'My Tickets', to: '/partners/es-portal/support/tickets' }
  ];

  const getActiveTab = (): string => {
    const path = location.pathname;
    if (path.endsWith('/submit')) return 'submit';
    if (path.endsWith('/tickets')) return 'tickets';
    return 'dashboard';
  };

  return (
    <div className="support-layout" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="support-content">
        <BackLink fallbackTo="/partners/es-portal" />
        <Breadcrumbs />
        
        <div className="support-greeting-section">
          <div className="support-greeting">
            <div className="greeting-icon-support"></div>
            <div className="greeting-content">
              <h2 className="greeting-title">Customer Support Portal</h2>
              <p className="greeting-date">{greeting}</p>
            </div>
          </div>
        </div>

        <div className="support-navigation">
          <Tabs
            items={tabItems}
            activeId={getActiveTab()}
            ariaLabel="Support sections"
            className="support-tabs"
          />
        </div>

        <main id="main-content" className="support-main-content" tabIndex={-1}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default CustomerSupportLayout;