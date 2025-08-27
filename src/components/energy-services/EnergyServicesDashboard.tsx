import React from 'react';
import { Link } from 'react-router-dom';
import './EnergyServicesDashboard.css';
import backgroundImage from '../../assets/images/BACKGROUND_GROUP.png';

const EnergyServicesDashboard: React.FC = () => {
  return (
    <div className="energy-services-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="portal-content">
        <div className="es-portal-grid">
          <Link to="/partners/es-portal/energy-services/srec" className="es-portal-card">
            <div className="card-icon">
              <div className="icon-circle srec-icon">
              </div>
            </div>
            <h3 className="card-title">SREC</h3>
            <p className="card-description">
              Manage Solar Renewable Energy Certificates and trading
            </p>
            <div className="card-link">Access SREC →</div>
          </Link>

          <Link to="/partners/es-portal/energy-services/vpp" className="es-portal-card">
            <div className="card-icon">
              <div className="icon-circle vpp-icon">
              </div>
            </div>
            <h3 className="card-title">VPP</h3>
            <p className="card-description">
              Virtual Power Plant management and grid services
            </p>
            <div className="card-link">Access VPP →</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnergyServicesDashboard;