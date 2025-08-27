import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackLink.css';

interface BackLinkProps {
  to?: string;
  fallbackTo?: string;
  label?: string;
  className?: string;
}

export const BackLink: React.FC<BackLinkProps> = ({
  to,
  fallbackTo = '/',
  label = 'Back',
  className = ''
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackTo);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`back-link ${className}`}
      aria-label="Go back"
    >
      <span className="back-link__icon" aria-hidden="true">←</span>
      <span className="back-link__text">{label}</span>
    </button>
  );
};