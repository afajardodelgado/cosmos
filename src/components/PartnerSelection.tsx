import React from 'react';
import { Link } from 'react-router-dom';
import './PartnerSelection.css';
import backgroundImage from '../assets/images/BACKGROUND_GROUP.png';
import partnerPortalIcon from '../assets/icons/partner_portal.png';
import customerSupportIcon from '../assets/icons/customer_support.png';
import { BackLink } from './common/BackLink';

const PartnerSelection: React.FC = () => {
  return (
    <div className="partner-selection-page" style={{backgroundImage: `url(${backgroundImage})`}}>
      <BackLink fallbackTo="/" />
      
      <main id="main-content" tabIndex={-1}>
        <div className="partner-selection-hero">
          <div className="partner-selection-badge">Partner Portal</div>
          <h1 className="partner-selection-title">
            <span className="title-blue">Welcome</span> Partners
          </h1>
          <p className="partner-selection-subtitle">
            Choose your path to access the tools and resources you need
          </p>
        </div>
        
        <div className="partner-selection-grid">
        <Link to="/partners/login" className="partner-selection-card">
          <div className="card-icon">
            <img src={partnerPortalIcon} alt="Existing Partner" className="icon-image" />
          </div>
          <h3 className="card-title">Existing Partner</h3>
          <p className="card-description">
            Access your partner portal, training materials, and support tools
          </p>
          <div className="card-link">Access Portal →</div>
        </Link>
        
        <Link to="/partners/become" className="partner-selection-card">
          <div className="card-icon">
            <img src={customerSupportIcon} alt="Become a Partner" className="icon-image" />
          </div>
          <h3 className="card-title">Become a Partner</h3>
          <p className="card-description">
            Join our network and start your journey as a Qcells partner
          </p>
          <div className="card-link">Get Started →</div>
        </Link>
        </div>
      </main>
    </div>
  );
};

export default PartnerSelection;