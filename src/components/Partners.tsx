import React from 'react';
import './Partners.css';
import backgroundImage from '../assets/images/BACKGROUND_GROUP.png';
import partnerPortalIcon from '../assets/icons/partner_portal.png';
import qcellsProductIcon from '../assets/icons/qcells_hw_products.png';
import esProgramIcon from '../assets/icons/es_program.png';
import customerSupportIcon from '../assets/icons/customer_support.png';

const Partners: React.FC = () => {
  return (
    <div className="partners-page" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="partners-hero">
        <div className="partners-badge">For Partners</div>
        <h1 className="partners-title">
          <span className="title-blue">All-in-One</span> Solution
        </h1>
      </div>
      
      <div className="partners-grid">
        <a href="#" className="partner-card">
          <div className="card-icon">
            <img src={partnerPortalIcon} alt="Partner Portal" className="icon-image" />
          </div>
          <h3 className="card-title">Partner Portal</h3>
          <div className="card-link">Get Started →</div>
        </a>
        
        <a href="#" className="partner-card">
          <div className="card-icon">
            <img src={qcellsProductIcon} alt="Qcells Product" className="icon-image" />
          </div>
          <h3 className="card-title">Qcells Product</h3>
          <div className="card-link">Get Started →</div>
        </a>
        
        <a href="#" className="partner-card">
          <div className="card-icon">
            <img src={esProgramIcon} alt="ES Program" className="icon-image" />
          </div>
          <h3 className="card-title">ES Program</h3>
          <div className="card-link">Get Started →</div>
        </a>
        
        <a href="#" className="partner-card">
          <div className="card-icon">
            <img src={customerSupportIcon} alt="Customer Support" className="icon-image" />
          </div>
          <h3 className="card-title">Customer Support</h3>
          <div className="card-link">Get Started →</div>
        </a>
      </div>
    </div>
  );
};

export default Partners;