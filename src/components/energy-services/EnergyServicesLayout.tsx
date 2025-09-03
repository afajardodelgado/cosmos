import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './EnergyServicesLayout.css';
import backgroundImage from '../../assets/images/Background-1Component4.png';
import { BackLink } from '../common/BackLink';
import { Tabs } from '../common/Tabs';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface EnergyServicesLayoutProps {
  children?: React.ReactNode;
}

const EnergyServicesLayout: React.FC<EnergyServicesLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const day = now.getDate();
    const year = now.getFullYear();
    
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
    { id: 'home', label: 'Energy Overview', to: '/partners/es-portal/energy-services' },
    { id: 'srec', label: 'SREC Management', to: '/partners/es-portal/energy-services/srec' },
    { id: 'vpp', label: 'Virtual Power Plant', to: '/partners/es-portal/energy-services/vpp' }
  ];

  const getActiveTab = (): string => {
    const path = location.pathname;
    if (path.includes('/srec')) return 'srec';
    if (path.includes('/vpp')) return 'vpp';
    return 'home';
  };

  return (
    <div className="energy-services-layout" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="energy-services-content">
        <BackLink fallbackTo="/partners/es-portal" />
        <Breadcrumbs />
        
        <div className="energy-services-greeting-section">
          <div className="energy-services-greeting">
            <div className="greeting-icon-energy-services"></div>
            <div className="greeting-content">
              <h2 className="greeting-title">Energy Services Management Portal</h2>
              <p className="greeting-date">{greeting}</p>
            </div>
          </div>
        </div>

        <div className="energy-services-navigation">
          <Tabs
            items={tabItems}
            activeId={getActiveTab()}
            ariaLabel="Energy Services sections"
            className="energy-services-tabs"
          />
        </div>

        <main id="main-content" className="energy-services-main-content" tabIndex={-1}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default EnergyServicesLayout;