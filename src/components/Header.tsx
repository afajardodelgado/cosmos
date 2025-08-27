import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import logoImage from '../assets/logos/Cosmos bu Qcells_White.png';

const Header: React.FC = () => {
  return (
    <header className="site-header">
      <div className="brand">
        <Link to="/">
          <img 
            src={logoImage} 
            alt="Cosmos by Qcells" 
            className="logo-image"
          />
        </Link>
      </div>
      
      <nav className="top-links">
        <NavLink to="/homeowners">Homeowners</NavLink>
        <NavLink to="/partners">Partners</NavLink>
      </nav>

      <div className="actions">
        <div className="icon-circle">?</div>
        <a href="https://us.qcells.com/" target="_blank" rel="noopener noreferrer" className="icon-circle" aria-label="Visit Qcells website">🌐</a>
        <div className="icon-circle"></div>
      </div>
    </header>
  );
};

export default Header;