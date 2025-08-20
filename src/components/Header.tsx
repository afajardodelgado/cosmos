import React from 'react';
import './Header.css';
import logoImage from '../assets/logos/Cosmos bu Qcells_White.png';

const Header: React.FC = () => {
  return (
    <header className="site-header">
      <div className="brand">
        <img 
          src={logoImage} 
          alt="Cosmos by Qcells" 
          className="logo-image"
        />
      </div>
      
      <nav className="top-links">
        <a href="/homeowners">Homeowners</a>
        <a href="/partners">Partners</a>
      </nav>

      <div className="actions">
        <div className="icon-circle">?</div>
        <a href="https://us.qcells.com/" target="_blank" rel="noopener noreferrer" className="icon-circle">🌐</a>
        <div className="icon-circle">⚙️</div>
      </div>
    </header>
  );
};

export default Header;