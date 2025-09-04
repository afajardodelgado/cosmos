import React, { useState } from 'react';
import Header from './Header';
import HomeownersLanding from './homeowners/HomeownersLanding';
import ConsultationFlow from './homeowners/ConsultationFlow';

type ViewType = 'landing' | 'products-flow' | 'energy-services-flow';

const Homeowners: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('landing');

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return (
          <HomeownersLanding
            onProductsClick={() => setCurrentView('products-flow')}
            onEnergyServicesClick={() => setCurrentView('energy-services-flow')}
          />
        );
      case 'products-flow':
      case 'energy-services-flow':
        return (
          <ConsultationFlow
            onBack={() => setCurrentView('landing')}
          />
        );
      default:
        return (
          <HomeownersLanding
            onProductsClick={() => setCurrentView('products-flow')}
            onEnergyServicesClick={() => setCurrentView('energy-services-flow')}
          />
        );
    }
  };

  return (
    <div>
      <Header />
      {renderContent()}
    </div>
  );
};

export default Homeowners;