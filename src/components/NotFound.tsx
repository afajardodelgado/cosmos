import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';
import backgroundImage from '../assets/images/Background-1Component4.png';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-page" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="not-found-content">
        <div className="not-found-hero">
          <h1 className="not-found-code">404</h1>
          <h2 className="not-found-title">Page Not Found</h2>
          <p className="not-found-description">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="not-found-actions">
          <Link to="/" className="not-found-btn primary">
            Go Home
          </Link>
          <Link to="/partners" className="not-found-btn secondary">
            Partner Portal
          </Link>
          <Link to="/support" className="not-found-btn secondary">
            Get Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;