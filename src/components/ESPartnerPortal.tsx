import React from 'react';
import { Link } from 'react-router-dom';
import './ESPartnerPortal.css';
import backgroundImage from '../assets/images/BACKGROUND_GROUP.png';
import customerSupportIcon from '../assets/icons/customer_support.png';
import qcellsProductIcon from '../assets/icons/qcells_hw_products.png';
import esProgramIcon from '../assets/icons/es_program.png';
import partnerPortalIcon from '../assets/icons/partner_portal.png';

const ESPartnerPortal: React.FC = () => {
  return (
    <div className="es-partner-portal-page" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="es-portal-hero">
        <div className="es-portal-badge">ES Partner Portal</div>
        <h1 className="es-portal-title">
          <span className="title-blue">Energy</span> Solutions
        </h1>
        <p className="es-portal-subtitle">
          Access all your energy solutions tools and resources in one place
        </p>
      </div>
      
      <div className="es-portal-grid">
        <Link to="/partners/es-portal/sales" className="es-portal-card">
          <div className="card-icon">
            <img src={customerSupportIcon} alt="Sales" className="icon-image" />
          </div>
          <h3 className="card-title">Sales</h3>
          <p className="card-description">
            Access sales tools, pricing, and customer management resources
          </p>
          <div className="card-link">Access Sales →</div>
        </Link>

        <Link to="/partners/es-portal/installation" className="es-portal-card">
          <div className="card-icon">
            <img src={qcellsProductIcon} alt="Installation/Fulfillment" className="icon-image" />
          </div>
          <h3 className="card-title">Installation/Fulfillment</h3>
          <p className="card-description">
            Manage installations, fulfillment processes, and project tracking
          </p>
          <div className="card-link">Access Installation →</div>
        </Link>

        <Link to="/partners/es-portal/monitoring" className="es-portal-card">
          <div className="card-icon">
            <img src={partnerPortalIcon} alt="Monitoring" className="icon-image" />
          </div>
          <h3 className="card-title">Monitoring</h3>
          <p className="card-description">
            Monitor system performance and track energy production data
          </p>
          <div className="card-link">Access Monitoring →</div>
        </Link>

        <Link to="/partners/es-portal/srec" className="es-portal-card">
          <div className="card-icon">
            <img src={esProgramIcon} alt="SREC" className="icon-image" />
          </div>
          <h3 className="card-title">SREC</h3>
          <p className="card-description">
            Manage Solar Renewable Energy Certificates and trading
          </p>
          <div className="card-link">Access SREC →</div>
        </Link>

        <Link to="/partners/es-portal/vpp" className="es-portal-card">
          <div className="card-icon">
            <img src={esProgramIcon} alt="VPP" className="icon-image" />
          </div>
          <h3 className="card-title">VPP</h3>
          <p className="card-description">
            Virtual Power Plant management and grid services
          </p>
          <div className="card-link">Access VPP →</div>
        </Link>

        <Link to="/partners/es-portal/support" className="es-portal-card">
          <div className="card-icon">
            <img src={customerSupportIcon} alt="Customer Support" className="icon-image" />
          </div>
          <h3 className="card-title">Customer Support</h3>
          <p className="card-description">
            Get help and support for ES Partner Portal services
          </p>
          <div className="card-link">Get Support →</div>
        </Link>
      </div>
    </div>
  );
};

export default ESPartnerPortal;