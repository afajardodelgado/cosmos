import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { toHaveNoViolations } from 'jest-axe';
import { axe } from 'jest-axe';
import { BackLink } from '../common/BackLink';

expect.extend(toHaveNoViolations);

const mockNavigate = jest.fn();

// Mock the navigate function at the top level
jest.mock('react-router-dom', () => {
  const actualReactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...actualReactRouterDom,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('BackLink Accessibility', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    // Mock window.history.length
    Object.defineProperty(window, 'history', {
      value: { length: 2 },
      writable: true,
    });
  });

  test('should not have accessibility violations', async () => {
    const { container } = renderWithRouter(<BackLink />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have proper button role and attributes', () => {
    const { getByRole } = renderWithRouter(<BackLink />);
    
    const button = getByRole('button', { name: /go back/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Go back');
  });

  test('should have visible text content', () => {
    const { getByText } = renderWithRouter(<BackLink label="Go Back" />);
    
    expect(getByText('Go Back')).toBeInTheDocument();
  });

  test('should be keyboard accessible', async () => {
    const { getByRole } = renderWithRouter(<BackLink />);
    
    const button = getByRole('button');
    
    // Should be focusable
    await userEvent.tab();
    expect(button).toHaveFocus();
    
    // Should activate on Enter
    await userEvent.keyboard('{Enter}');
    expect(mockNavigate).toHaveBeenCalledWith(-1);
    
    mockNavigate.mockClear();
    
    // Should activate on Space
    await userEvent.keyboard(' ');
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('should have proper focus styling', () => {
    const { getByRole } = renderWithRouter(<BackLink />);
    
    const button = getByRole('button');
    button.focus();
    
    // Check that focus styles are applied (CSS-in-JS or class-based)
    expect(button).toHaveClass('back-link');
    expect(button).toHaveFocus();
  });

  test('should handle different navigation scenarios', () => {
    // Test with specific 'to' prop
    const { rerender } = renderWithRouter(<BackLink to="/specific-path" />);
    
    let button = document.querySelector('.back-link') as HTMLButtonElement;
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/specific-path');
    
    mockNavigate.mockClear();
    
    // Test with fallback when no history
    Object.defineProperty(window, 'history', {
      value: { length: 1 },
      writable: true,
    });
    
    rerender(<BackLink fallbackTo="/fallback" />);
    button = document.querySelector('.back-link') as HTMLButtonElement;
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/fallback');
  });

  test('should have semantic HTML structure', () => {
    const { container } = renderWithRouter(<BackLink />);
    
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    
    // Should have icon and text spans
    const iconSpan = container.querySelector('.back-link__icon');
    const textSpan = container.querySelector('.back-link__text');
    
    expect(iconSpan).toBeInTheDocument();
    expect(textSpan).toBeInTheDocument();
    
    // Icon should be hidden from screen readers
    expect(iconSpan).toHaveAttribute('aria-hidden', 'true');
  });

  test('should support custom className', () => {
    const { container } = renderWithRouter(
      <BackLink className="custom-class" />
    );
    
    const button = container.querySelector('.back-link');
    expect(button).toHaveClass('back-link', 'custom-class');
  });
});