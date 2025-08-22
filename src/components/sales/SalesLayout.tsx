import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './SalesLayout.css';
import backgroundImage from '../../assets/images/BACKGROUND_GROUP.png';

interface SalesLayoutProps {
  children?: React.ReactNode;
}

const SalesLayout: React.FC<SalesLayoutProps> = ({ children }) => {
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
    { id: 'home', label: 'Business Summary', path: '/partners/es-portal/sales' },
    { id: 'leads', label: 'My Leads', path: '/partners/es-portal/sales/leads' },
    { id: 'opportunities', label: 'My Opportunities', path: '/partners/es-portal/sales/opportunities' },
    { id: 'sites', label: 'My Sites', path: '/partners/es-portal/sales/sites' },
    { id: 'contacts', label: 'My Contacts', path: '/partners/es-portal/sales/contacts' }
  ];

  const getActiveTab = (): string => {
    const path = location.pathname;
    if (path.endsWith('/leads')) return 'leads';
    if (path.endsWith('/opportunities')) return 'opportunities';
    if (path.endsWith('/sites')) return 'sites';
    if (path.endsWith('/contacts')) return 'contacts';
    return 'home';
  };

  const handleTabClick = (path: string): void => {
    navigate(path);
  };

  return (
    <div className="sales-layout" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="sales-content">
        <div className="sales-greeting-section">
          <div className="sales-greeting">
            <div className="greeting-icon"></div>
            <div className="greeting-content">
              <h2 className="greeting-title">Greetings RE+ Demo User!</h2>
              <p className="greeting-date">{greeting}</p>
            </div>
          </div>
        </div>

        <div className="sales-navigation">
          <div className="sales-nav-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`sales-nav-tab ${getActiveTab() === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.path)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sales-main-content">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default SalesLayout;