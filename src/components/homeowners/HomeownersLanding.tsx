import React from 'react';
import './HomeownersLanding.css';
import vppLogo from '../../assets/icons/vpp-logo.jpeg';

interface HomeownersLandingProps {
  onProductsClick: () => void;
  onEnergyServicesClick: () => void;
}

const HomeownersLanding: React.FC<HomeownersLandingProps> = ({ 
  onProductsClick, 
  onEnergyServicesClick 
}) => {
  return (
    <div className="homeowners-landing">
      <div className="homeowners-hero">
        <div className="hero-badge">
          For Homeowners
        </div>
        <h1 className="hero-title">
          All-In-One <span className="highlight">Solution</span>
        </h1>
      </div>
      
      <div className="products-grid">
        <div className="product-card" onClick={onProductsClick}>
          <div className="product-icon">
            <img src={vppLogo} alt="Products" />
          </div>
          <h2 className="product-title">Products</h2>
          <button className="get-started-btn">Get Started</button>
        </div>
        
        <div className="product-card" onClick={onEnergyServicesClick}>
          <div className="product-icon">
            <img src={vppLogo} alt="Energy Services" />
          </div>
          <h2 className="product-title">Energy Services</h2>
          <button className="get-started-btn">Get Started</button>
        </div>
      </div>
      
      <div className="login-section">
        <p className="login-text">Already have a Cosmos by Qcells account?</p>
        <button className="login-btn">Log In</button>
      </div>
    </div>
  );
};

export default HomeownersLanding;