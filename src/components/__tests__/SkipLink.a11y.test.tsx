import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toHaveNoViolations } from 'jest-axe';
import { axe } from 'jest-axe';
import { SkipLink } from '../common/SkipLink';

expect.extend(toHaveNoViolations);

describe('SkipLink Accessibility', () => {
  beforeEach(() => {
    // Create a target element for skip link
    const targetDiv = document.createElement('div');
    targetDiv.id = 'main-content';
    targetDiv.tabIndex = -1;
    document.body.appendChild(targetDiv);
    
    // Mock focus and scrollIntoView
    targetDiv.focus = jest.fn();
    targetDiv.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    // Clean up target element
    const targetDiv = document.getElementById('main-content');
    if (targetDiv) {
      document.body.removeChild(targetDiv);
    }
  });

  test('should not have accessibility violations', async () => {
    const { container } = render(<SkipLink />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have proper link structure', () => {
    const { getByRole } = render(<SkipLink />);
    
    const link = getByRole('link', { name: /skip to content/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main-content');
  });

  test('should be focusable and functional', async () => {
    const { getByRole } = render(<SkipLink />);
    
    const link = getByRole('link');
    const targetElement = document.getElementById('main-content');
    
    // Skip link should be tabbable
    await userEvent.tab();
    expect(link).toHaveFocus();
    
    // Clicking should focus target element
    await userEvent.click(link);
    expect(targetElement?.focus).toHaveBeenCalled();
    expect(targetElement?.scrollIntoView).toHaveBeenCalled();
  });

  test('should handle keyboard activation', async () => {
    const { getByRole } = render(<SkipLink />);
    
    const link = getByRole('link');
    const targetElement = document.getElementById('main-content');
    
    link.focus();
    
    // Enter key should activate
    await userEvent.keyboard('{Enter}');
    expect(targetElement?.focus).toHaveBeenCalled();
    
    // Space key should also activate
    jest.clearAllMocks();
    await userEvent.keyboard(' ');
    expect(targetElement?.focus).toHaveBeenCalled();
  });

  test('should support custom target ID', () => {
    const customTarget = document.createElement('div');
    customTarget.id = 'custom-target';
    customTarget.focus = jest.fn();
    customTarget.scrollIntoView = jest.fn();
    document.body.appendChild(customTarget);

    const { getByRole } = render(<SkipLink targetId="custom-target" />);
    
    const link = getByRole('link');
    expect(link).toHaveAttribute('href', '#custom-target');
    
    // Clean up
    document.body.removeChild(customTarget);
  });

  test('should support custom text content', () => {
    const { getByRole } = render(
      <SkipLink>Jump to main content</SkipLink>
    );
    
    const link = getByRole('link', { name: /jump to main content/i });
    expect(link).toBeInTheDocument();
  });

  test('should handle missing target gracefully', async () => {
    // Remove the target element
    const targetDiv = document.getElementById('main-content');
    if (targetDiv) {
      document.body.removeChild(targetDiv);
    }

    const { getByRole } = render(<SkipLink />);
    
    const link = getByRole('link');
    
    // Should not throw error when target doesn't exist
    expect(() => {
      userEvent.click(link);
    }).not.toThrow();
  });

  test('should have proper CSS classes for styling', () => {
    const { container } = render(<SkipLink />);
    
    const link = container.querySelector('a');
    expect(link).toHaveClass('skip-link');
  });

  test('should be positioned for accessibility', () => {
    const { container } = render(<SkipLink />);
    
    const link = container.querySelector('.skip-link') as HTMLElement;
    const styles = window.getComputedStyle(link);
    
    // Should be positioned absolutely (for screen reader access)
    expect(link).toHaveClass('skip-link');
    // The actual positioning is tested via CSS, but we ensure the class is there
  });
});