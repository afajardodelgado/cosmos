import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toHaveNoViolations } from 'jest-axe';
import { axe } from 'jest-axe';
import Header from '../Header';

expect.extend(toHaveNoViolations);

// Mock the logo image import
jest.mock('../../assets/logos/Cosmos bu Qcells_White.png', () => 'test-logo.png');

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Accessibility', () => {
  test('should not have accessibility violations', async () => {
    const { container } = renderWithRouter(<Header />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have proper navigation structure', () => {
    const { getByRole } = renderWithRouter(<Header />);
    
    // Should have a banner (header) landmark
    const header = getByRole('banner');
    expect(header).toBeInTheDocument();
    
    // Should have navigation
    const nav = getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  test('should have accessible links', () => {
    const { getByRole } = renderWithRouter(<Header />);
    
    // Check main navigation links
    const homeownersLink = getByRole('link', { name: /homeowners/i });
    expect(homeownersLink).toBeInTheDocument();
    
    const partnersLink = getByRole('link', { name: /partners/i });
    expect(partnersLink).toBeInTheDocument();
    
    // Check external link has proper attributes
    const externalLink = getByRole('link', { name: /visit qcells website/i });
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should have accessible logo', () => {
    const { getByRole } = renderWithRouter(<Header />);
    
    const logoImage = getByRole('img', { name: /cosmos by qcells/i });
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('alt', 'Cosmos by Qcells');
  });
});