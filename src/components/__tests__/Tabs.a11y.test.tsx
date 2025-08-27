import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { toHaveNoViolations } from 'jest-axe';
import { axe } from 'jest-axe';
import { Tabs } from '../common/Tabs';
import { TabItem } from '../common/Tabs/Tabs.types';

expect.extend(toHaveNoViolations);

const mockTabItems: TabItem[] = [
  { id: 'tab1', label: 'First Tab', to: '/first' },
  { id: 'tab2', label: 'Second Tab', to: '/second' },
  { id: 'tab3', label: 'Third Tab', to: '/third', disabled: true },
];

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Tabs Accessibility', () => {
  test('should not have accessibility violations', async () => {
    const { container } = renderWithRouter(
      <Tabs
        items={mockTabItems}
        activeId="tab1"
        ariaLabel="Test navigation"
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have proper ARIA roles and attributes', () => {
    const { getByRole, getAllByRole } = renderWithRouter(
      <Tabs
        items={mockTabItems}
        activeId="tab1"
        ariaLabel="Test navigation"
      />
    );
    
    // Should have tablist
    const tablist = getByRole('tablist', { name: /test navigation/i });
    expect(tablist).toBeInTheDocument();
    
    // Should have all tabs
    const tabs = getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    
    // Active tab should have aria-selected="true"
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
    
    // Disabled tab should have aria-disabled
    expect(tabs[2]).toHaveAttribute('aria-disabled', 'true');
  });

  test('should have proper tabIndex management', () => {
    const { getAllByRole } = renderWithRouter(
      <Tabs
        items={mockTabItems}
        activeId="tab2"
        ariaLabel="Test navigation"
      />
    );
    
    const tabs = getAllByRole('tab');
    
    // Only active tab should be tabbable
    expect(tabs[0]).toHaveAttribute('tabIndex', '-1');
    expect(tabs[1]).toHaveAttribute('tabIndex', '0'); // Active
    expect(tabs[2]).toHaveAttribute('tabIndex', '-1');
  });

  test('should support keyboard navigation', async () => {
    const { getAllByRole } = renderWithRouter(
      <Tabs
        items={mockTabItems}
        activeId="tab1"
        ariaLabel="Test navigation"
      />
    );
    
    const tabs = getAllByRole('tab');
    const firstTab = tabs[0];
    
    // Focus first tab
    firstTab.focus();
    expect(firstTab).toHaveFocus();
    
    // Arrow right should focus next enabled tab
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveFocus();
    
    // Arrow right again should skip disabled tab and go to first
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[0]).toHaveFocus();
    
    // Arrow left should go to previous enabled tab
    await userEvent.keyboard('{ArrowLeft}');
    expect(tabs[1]).toHaveFocus();
  });

  test('should support Home and End keys', async () => {
    const { getAllByRole } = renderWithRouter(
      <Tabs
        items={mockTabItems}
        activeId="tab2"
        ariaLabel="Test navigation"
      />
    );
    
    const tabs = getAllByRole('tab');
    const secondTab = tabs[1];
    
    // Focus second tab
    secondTab.focus();
    expect(secondTab).toHaveFocus();
    
    // Home should go to first enabled tab
    await userEvent.keyboard('{Home}');
    expect(tabs[0]).toHaveFocus();
    
    // End should go to last enabled tab (skip disabled)
    await userEvent.keyboard('{End}');
    expect(tabs[1]).toHaveFocus(); // Last enabled is tab2
  });

  test('should support Enter and Space activation', async () => {
    const mockOnChange = jest.fn();
    
    const { getAllByRole } = renderWithRouter(
      <Tabs
        items={mockTabItems}
        activeId="tab1"
        onChange={mockOnChange}
        ariaLabel="Test navigation"
      />
    );
    
    const tabs = getAllByRole('tab');
    const secondTab = tabs[1];
    
    secondTab.focus();
    
    // Enter should activate tab
    await userEvent.keyboard('{Enter}');
    expect(mockOnChange).toHaveBeenCalledWith('tab2');
    
    // Space should also activate tab
    mockOnChange.mockClear();
    await userEvent.keyboard(' ');
    expect(mockOnChange).toHaveBeenCalledWith('tab2');
  });

  test('should have unique IDs for tabs and panels', () => {
    const { getAllByRole } = renderWithRouter(
      <Tabs
        items={mockTabItems}
        activeId="tab1"
        ariaLabel="Test navigation"
      />
    );
    
    const tabs = getAllByRole('tab');
    
    // Each tab should have unique ID
    expect(tabs[0]).toHaveAttribute('id', 'tab-tab1');
    expect(tabs[1]).toHaveAttribute('id', 'tab-tab2');
    expect(tabs[2]).toHaveAttribute('id', 'tab-tab3');
    
    // Each tab should control its corresponding panel
    expect(tabs[0]).toHaveAttribute('aria-controls', 'panel-tab1');
    expect(tabs[1]).toHaveAttribute('aria-controls', 'panel-tab2');
    expect(tabs[2]).toHaveAttribute('aria-controls', 'panel-tab3');
  });
});