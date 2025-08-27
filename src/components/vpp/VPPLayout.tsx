import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './VPPLayout.css';
import backgroundImage from '../../assets/images/BACKGROUND_GROUP.png';
import { BackLink } from '../common/BackLink';
import { Tabs } from '../common/Tabs';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface VPPLayoutProps {
  children?: React.ReactNode;
}

const VPPLayout: React.FC<VPPLayoutProps> = ({ children }) => {
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
    { id: 'home', label: 'VPP Dashboard', to: '/partners/es-portal/energy-services/vpp' },
    { id: 'devices', label: 'My Devices', to: '/partners/es-portal/energy-services/vpp/devices' },
    { id: 'monitoring', label: 'Energy Monitoring', to: '/partners/es-portal/energy-services/vpp/monitoring' },
    { id: 'events', label: 'Grid Events', to: '/partners/es-portal/energy-services/vpp/events' },
    { id: 'earnings', label: 'Earnings', to: '/partners/es-portal/energy-services/vpp/earnings' }
  ];

  const getActiveTab = (): string => {
    const path = location.pathname;
    if (path.endsWith('/devices')) return 'devices';
    if (path.endsWith('/monitoring')) return 'monitoring';
    if (path.endsWith('/events')) return 'events';
    if (path.endsWith('/earnings')) return 'earnings';
    return 'home';
  };

  return (
    <div className="vpp-layout" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="vpp-content">
        <BackLink fallbackTo="/partners/es-portal/energy-services" />
        <Breadcrumbs />
        
        <div className="vpp-greeting-section">
          <div className="vpp-greeting">
            <div className="greeting-icon-vpp"></div>
            <div className="greeting-content">
              <h2 className="greeting-title">Virtual Power Plant Portal</h2>
              <p className="greeting-date">{greeting}</p>
            </div>
          </div>
        </div>

        <div className="vpp-navigation">
          <Tabs
            items={tabItems}
            activeId={getActiveTab()}
            ariaLabel="VPP sections"
            className="vpp-tabs"
          />
        </div>

        <main id="main-content" className="vpp-main-content" tabIndex={-1}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default VPPLayout;