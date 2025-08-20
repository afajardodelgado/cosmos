import React from 'react';
import './Partners.css';
import backgroundImage from '../assets/images/BACKGROUND_GROUP.png';
import partnerPortalIcon from '../assets/icons/partner_portal.png';
import qcellsProductIcon from '../assets/icons/qcells_hw_products.png';
import esProgramIcon from '../assets/icons/es_program.png';
import customerSupportIcon from '../assets/icons/customer_support.png';
import esPartnerPortalIcon from '../assets/icons/ES-Partner-Portal.png';
import enfinPartnerPortalIcon from '../assets/icons/Enfin-Partner-Portal.png';
import trainingLogoIcon from '../assets/icons/TrainingLogo.png';
import installingLogoIcon from '../assets/icons/Installing-Logo.png';

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
        <div className="partner-card partner-portal-card">
          <div className="card-icon">
            <img src={partnerPortalIcon} alt="Partner Portal" className="icon-image" />
          </div>
          <h3 className="card-title">Partner Portal</h3>
          <div className="card-link">Select Portal</div>
          
          <div className="portal-options">
            <div className="partner-portal-row">
              <a href="#" className="portal-option mini-card">
                <div className="portal-icon">
                  <img src={esPartnerPortalIcon} alt="ES Partner Portal" className="portal-icon-image" />
                </div>
                <div className="portal-text">
                  <div className="portal-name">ES Partner</div>
                  <div className="portal-subtitle">Portal</div>
                </div>
              </a>
              
              <a href="#" className="portal-option mini-card">
                <div className="portal-icon">
                  <img src={enfinPartnerPortalIcon} alt="Enfin Partner Portal" className="portal-icon-image" />
                </div>
                <div className="portal-text">
                  <div className="portal-name">Enfin Partner</div>
                  <div className="portal-subtitle">Portal</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="partner-card qcells-hardware-card">
          <div className="card-icon">
            <img src={qcellsProductIcon} alt="Qcells Hardware Product" className="icon-image" />
          </div>
          <h3 className="card-title">Qcells Hardware Product</h3>
          <div className="card-link">Select Hardware</div>
          
          <div className="hardware-options">
            <div className="hardware-portal-row">
              <a href="https://www.qpartnerus.com/qpp/s/login/?ec=302&startURL=%2Fqpp%2Fs%2Fmy-learning" target="_blank" rel="noopener noreferrer" className="hardware-option mini-card">
                <div className="portal-icon">
                  <img src={trainingLogoIcon} alt="Training" className="portal-icon-image" />
                </div>
                <div className="portal-text">
                  <div className="portal-name">Training</div>
                  <div className="portal-subtitle"></div>
                </div>
              </a>
              
              <a href="#" className="hardware-option mini-card">
                <div className="portal-icon">
                  <img src={installingLogoIcon} alt="Installing" className="portal-icon-image" />
                </div>
                <div className="portal-text">
                  <div className="portal-name">Installing</div>
                  <div className="portal-subtitle"></div>
                </div>
              </a>
            </div>
            
            <div className="hardware-portal-row">
              <a href="https://www.portal-q-cells.us/#/login" target="_blank" rel="noopener noreferrer" className="hardware-option mini-card">
                <div className="portal-icon">
                  <img src={qcellsProductIcon} alt="Gen2 Q.Home HW" className="portal-icon-image" />
                </div>
                <div className="portal-text">
                  <div className="portal-name">Gen2 Q.Home HW</div>
                  <div className="portal-subtitle"></div>
                </div>
              </a>
              
              <a href="https://us.qommand.qcells.com/" target="_blank" rel="noopener noreferrer" className="hardware-option mini-card">
                <div className="portal-icon">
                  <img src={qcellsProductIcon} alt="Gen3 AC System Hardware" className="portal-icon-image" />
                </div>
                <div className="portal-text">
                  <div className="portal-name">Gen3 AC System Hardware</div>
                  <div className="portal-subtitle"></div>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="partner-card es-program-card">
          <div className="card-icon">
            <img src={esProgramIcon} alt="ES Program" className="icon-image" />
          </div>
          <h3 className="card-title">ES Program</h3>
          <div className="card-link">Select Program</div>
          
          <div className="es-program-options">
            <div className="es-program-portal-row">
              <a href="https://partners.es.qcells.com/" target="_blank" rel="noopener noreferrer" className="es-program-option mini-card">
                <div className="portal-icon">
                  <img src={esProgramIcon} alt="Enrollment" className="portal-icon-image" />
                </div>
                <div className="portal-text">
                  <div className="portal-name">Enrollment</div>
                  <div className="portal-subtitle"></div>
                </div>
              </a>
              
              <a href="#" className="es-program-option mini-card">
                <div className="portal-icon">
                  <img src={qcellsProductIcon} alt="Operations" className="portal-icon-image" />
                </div>
                <div className="portal-text">
                  <div className="portal-name">Operations</div>
                  <div className="portal-subtitle"></div>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <a href="https://www.qpartnerus.com/qpp/s/qcellssupport" target="_blank" rel="noopener noreferrer" className="partner-card">
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