import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className = '' }) => {
  const location = useLocation();

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/' }
    ];

    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip intermediate paths like 'partners' or 'es-portal' that don't have useful labels
      if (segment === 'partners' && pathSegments.length > 1) {
        breadcrumbs.push({ label: 'Partners', path: currentPath });
        return;
      }

      if (segment === 'es-portal' && pathSegments.length > 2) {
        breadcrumbs.push({ label: 'ES Portal', path: currentPath });
        return;
      }

      // Add specific section breadcrumbs
      switch (segment) {
        case 'homeowners':
          breadcrumbs.push({ label: 'Homeowners', path: currentPath });
          break;
        case 'login':
          breadcrumbs.push({ label: 'Login' });
          break;
        case 'become':
          breadcrumbs.push({ label: 'Become a Partner' });
          break;
        case 'existing':
          breadcrumbs.push({ label: 'Partner Portal' });
          break;
        case 'srec':
          if (index === pathSegments.length - 1) {
            breadcrumbs.push({ label: 'SREC Management' });
          } else {
            breadcrumbs.push({ label: 'SREC Management', path: currentPath });
          }
          break;
        case 'records':
          breadcrumbs.push({ label: 'SREC Records' });
          break;
        case 'invoicing':
          breadcrumbs.push({ label: 'Invoicing & Payments' });
          break;
        case 'tasks':
          breadcrumbs.push({ label: 'Tasks & Workflow' });
          break;
        case 'installation':
          if (index === pathSegments.length - 1) {
            breadcrumbs.push({ label: 'Installation Management' });
          } else {
            breadcrumbs.push({ label: 'Installation Management', path: currentPath });
          }
          break;
        case 'active':
          breadcrumbs.push({ label: 'Active Projects' });
          break;
        case 'scheduled':
          breadcrumbs.push({ label: 'Scheduled Installations' });
          break;
        case 'completed':
          breadcrumbs.push({ label: 'Completed Projects' });
          break;
        case 'crew':
          breadcrumbs.push({ label: 'Crew Management' });
          break;
        case 'sales':
          if (index === pathSegments.length - 1) {
            breadcrumbs.push({ label: 'Sales Management' });
          } else {
            breadcrumbs.push({ label: 'Sales Management', path: currentPath });
          }
          break;
        case 'leads':
          breadcrumbs.push({ label: 'My Leads' });
          break;
        case 'opportunities':
          breadcrumbs.push({ label: 'My Opportunities' });
          break;
        case 'sites':
          breadcrumbs.push({ label: 'My Sites' });
          break;
        case 'contacts':
          breadcrumbs.push({ label: 'My Contacts' });
          break;
        case 'support':
          breadcrumbs.push({ label: 'Customer Support' });
          break;
        default:
          // Don't add unknown segments
          break;
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on home page or if only one item
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`breadcrumbs ${className}`} aria-label="Breadcrumb navigation">
      <ol className="breadcrumbs__list">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={index} className="breadcrumbs__item">
              {isLast || !item.path ? (
                <span 
                  className="breadcrumbs__current" 
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link 
                  to={item.path} 
                  className="breadcrumbs__link"
                >
                  {item.label}
                </Link>
              )}
              
              {!isLast && (
                <span className="breadcrumbs__separator" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};