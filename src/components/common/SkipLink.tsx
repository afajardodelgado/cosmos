import React from 'react';
import './SkipLink.css';

interface SkipLinkProps {
  targetId?: string;
  children?: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ 
  targetId = 'main-content', 
  children = 'Skip to content' 
}) => {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView();
    }
  };

  return (
    <a 
      href={`#${targetId}`} 
      className="skip-link"
      onClick={handleSkip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSkip(e as any);
        }
      }}
    >
      {children}
    </a>
  );
};