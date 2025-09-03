import React from 'react';
import './BecomePartner.css';
import backgroundImage from '../assets/images/Background-1Component4.png';

const BecomePartner: React.FC = () => {
  return (
    <div className="become-partner-page" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="become-partner-hero">
        <div className="become-partner-badge">Partnership Opportunity</div>
        <h1 className="become-partner-title">
          <span className="title-blue">Become</span> a Partner
        </h1>
        <p className="become-partner-subtitle">
          Join our growing network of solar professionals and unlock new opportunities
        </p>
      </div>
      
      <div className="become-partner-content">
        <div className="partner-info-card">
          <h2>Partnership Benefits</h2>
          <ul>
            <li>Access to premium solar products and solutions</li>
            <li>Technical training and certification programs</li>
            <li>Marketing support and sales resources</li>
            <li>Dedicated partner support team</li>
            <li>Competitive pricing and incentives</li>
          </ul>
          
          <div className="contact-info">
            <h3>Ready to Get Started?</h3>
            <p>Contact our partnership team to learn more about joining the Qcells partner network.</p>
            <a href="mailto:partnerships@qcells.com" className="contact-button">
              Contact Partnership Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomePartner;