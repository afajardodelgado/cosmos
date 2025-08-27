import React, { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabsProps, TabItem } from './Tabs.types';
import './Tabs.css';

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  variant = 'underline',
  ariaLabel = 'Tab navigation',
  className = ''
}) => {
  const navigate = useNavigate();
  const tablistRef = useRef<HTMLDivElement>(null);

  const handleTabClick = useCallback((item: TabItem) => {
    if (item.disabled) return;
    
    if (item.to) {
      navigate(item.to);
    }
    
    if (onChange) {
      onChange(item.id);
    }
  }, [navigate, onChange]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, currentIndex: number) => {
    const { key } = event;
    const enabledItems = items.filter(item => !item.disabled);
    const currentEnabledIndex = enabledItems.findIndex(item => item.id === items[currentIndex].id);
    
    let nextIndex = currentEnabledIndex;
    
    switch (key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentEnabledIndex > 0 ? currentEnabledIndex - 1 : enabledItems.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentEnabledIndex < enabledItems.length - 1 ? currentEnabledIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = enabledItems.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleTabClick(items[currentIndex]);
        return;
      default:
        return;
    }

    // Focus the next tab
    const nextItem = enabledItems[nextIndex];
    const nextTabIndex = items.findIndex(item => item.id === nextItem.id);
    const tabElement = tablistRef.current?.children[nextTabIndex] as HTMLElement;
    if (tabElement) {
      tabElement.focus();
    }
  }, [items, handleTabClick]);

  return (
    <div 
      className={`tabs tabs--${variant} ${className}`}
      role="tablist" 
      aria-label={ariaLabel}
      ref={tablistRef}
    >
      {items.map((item, index) => {
        const isActive = item.id === activeId;
        const tabId = `tab-${item.id}`;
        const panelId = `panel-${item.id}`;

        return (
          <button
            key={item.id}
            id={tabId}
            role="tab"
            type="button"
            className={`tabs__tab ${isActive ? 'tabs__tab--active' : ''} ${item.disabled ? 'tabs__tab--disabled' : ''}`}
            aria-selected={isActive}
            aria-controls={panelId}
            aria-disabled={item.disabled}
            tabIndex={isActive ? 0 : -1}
            onClick={() => handleTabClick(item)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={item.disabled}
          >
            <span className="tabs__tab-text">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};