import React from 'react';
import './Hero.css';
import backgroundImage from '../assets/images/MAIN.png';

const Hero: React.FC = () => {
  return (
    <section className="hero" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="hero-content">
        <h1 className="hero-title">
          Your All-in-One Platform<br />
          for Residential Energy
        </h1>
        <div className="hero-buttons">
          <button className="hero-button">Homeowners</button>
          <button className="hero-button">Partners</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;