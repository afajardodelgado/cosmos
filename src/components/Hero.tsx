import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import backgroundImage from '../assets/images/Background-1Component4.png';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main id="main-content" className="hero" style={{backgroundImage: `url(${backgroundImage})`}} tabIndex={-1}>
      <div className="hero-content">
        <h1 className="hero-title">
          Your All-in-One Platform<br />
          for Residential Energy
        </h1>
        <div className="hero-buttons">
          <button className="hero-button disabled" disabled title="Coming Soon">Homeowners</button>
          <button className="hero-button" onClick={() => navigate('/partners')}>Partners</button>
        </div>
      </div>
    </main>
  );
};

export default Hero;