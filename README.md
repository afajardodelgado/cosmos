# Cosmos by Qcells - Partner Landing Platform

A comprehensive React-based landing platform for Cosmos by Qcells partner portal, featuring energy solutions management, SREC tracking, and partner onboarding workflows.

## 🚀 Quick Start

### Development Environment
```bash
npm install
npm start
```
Runs the app at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
```
Builds optimized production bundle in `build/` folder.

### Testing
```bash
npm test
```
Launches interactive test runner.

---

## 🎨 UI/UX Design System

### Core Design Principles
Our design system is built around **accessibility**, **consistency**, and **modern aesthetics** with a focus on clean, professional interfaces for energy solution partners.

### 🎨 Color Palette

#### Primary Colors (Unified System)
- **Background Dark**: `#060605` - Main page background for all portals
- **Glass Background**: `rgba(255, 255, 255, 0.05)` - Glassmorphism card backgrounds
- **Glass Border**: `rgba(255, 255, 255, 0.1)` - Glassmorphism borders
- **Brand Cyan**: `#00bcd4` - Sales portal brand color
- **Brand Cyan Dark**: `#0097a7` - Sales gradient secondary
- **Brand Green**: `#4caf50` - Installation/SREC portal brand color
- **Brand Green Light**: `#66bb6a` - Installation/SREC gradient secondary

#### Status Colors
- **Success Green**: `#28a745` - Success states, completed tasks
- **Success Light**: `#e8f5e8` - Success backgrounds
- **Warning Yellow**: `#ffc107` - Warnings, ratings
- **Error Red**: `#ff4444` - Error states, validation
- **Info Blue**: `#007bff` - Information, buttons
- **Info Hover**: `#0056b3` - Button hover states

#### Neutral Colors
- **Text Primary**: `#333` - Primary text (light backgrounds)
- **Text Secondary**: `#666` - Secondary text
- **Text Muted**: `#888` - Muted text, placeholders
- **Text Light**: `#cccccc` - Light text on dark backgrounds
- **Border Light**: `#e9ecef`, `#f0f0f0`, `#f1f3f4` - Subtle borders
- **Background Light**: `#f8f9fa` - Light section backgrounds

### 📐 Typography Scale

#### Heading Hierarchy
- **Hero Titles**: `3.5rem` (56px) - Main landing titles
- **Page Titles**: `2.5rem` (40px) - Section titles
- **Card Titles**: `1.8rem` (29px) - Component titles
- **Subtitles**: `1.6rem` (26px) - Section subtitles
- **Content Titles**: `1.3rem` (21px) - Content headers
- **Body Text**: `1rem` (16px) - Standard content
- **Small Text**: `0.9rem` (14px) - Secondary info
- **Caption**: `0.85rem` (14px) - Captions, metadata

#### Responsive Typography
- **Mobile Large**: Hero titles scale to `2.5rem`, content adjusts proportionally
- **Mobile Small**: Hero titles scale to `2rem`, optimized for readability

### 🔘 Border Radius System

#### Radius Scale
- **Small Elements**: `4px`, `6px`, `8px` - Buttons, form inputs
- **Cards**: `12px`, `15px`, `20px` - Cards, panels, major containers  
- **Badges/Pills**: `25px` - Pill-shaped elements
- **Circular**: `50%` - Icons, avatars, status indicators

### 🎯 Component Patterns (Unified Design System)

**All portal layouts (Sales, Installation, SREC) now follow a unified glassmorphism dark theme pattern for consistency.**

#### Page Layout Structure (Standard Pattern)
```css
.layout-container {
  min-height: 100vh;
  background-color: #060605;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: white;
  padding-top: 120px;
  padding-bottom: 60px;
}

.layout-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}
```

#### Greeting Section Pattern (All Portals)
```css
.greeting-section {
  margin-bottom: 40px;
  text-align: left;
}

.greeting-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 25px 30px;
}

.greeting-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #brand-color, #brand-color-light);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}
```

#### Navigation Tabs Pattern (Unified)
```css
.nav-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
  gap: 4px;
  overflow-x: auto;
}

.nav-tab {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-tab.active {
  background: linear-gradient(135deg, #brand-color, #brand-color-light);
  color: white;
  box-shadow: 0 4px 15px rgba(brand-color, 0.2);
}
```

#### Main Content Area Pattern
```css
.main-content {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  min-height: 600px;
}
```

#### Glassmorphism Card System
```css
/* Dashboard Cards */
.dashboard-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.dashboard-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

/* Metric Cards with Color-Coded Headers */
.metric-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  position: relative;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #brand-color, #brand-color-light);
  border-radius: 12px 12px 0 0;
}
```

#### Portal Brand Color Usage
- **Sales Portal**: Cyan theme (`#00bcd4` → `#0097a7`)
- **Installation Portal**: Green theme (`#4caf50` → `#66bb6a`)
- **SREC Portal**: Green theme (`#4caf50` → `#66bb6a`)

#### Icon System (Consistent Across Portals)
- **Sales**: Analytics/Performance themed elements
- **Installation**: Tools/Construction themed elements
- **SREC**: Energy/Power themed elements
- **General Actions**: Financial, Markets, Calendar themed elements

#### Interactive States (Unified)
```css
/* Hover Effects */
.card:hover, .metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Loading States */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid var(--brand-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

#### Button Variants (Updated for Glassmorphism)
```css
/* Primary Action Button (Portal-Branded) */
.btn-primary {
  background: linear-gradient(135deg, var(--brand-color), var(--brand-color-light));
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--brand-color), 0.3);
}

/* Secondary/Ghost Button */
.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Quick Action Buttons */
.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
}
```

#### Data Display/Table Pattern (Unified Format)
```css
/* List-based data display (preferred over HTML tables) */
.data-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.data-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

/* Multi-line item structure */
.data-item-complex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  gap: 15px;
}

.item-main-info {
  flex: 1;
}

.item-primary {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  margin-bottom: 5px;
}

.item-details {
  display: flex;
  gap: 10px;
  font-size: 0.8rem;
  color: #cccccc;
  margin-bottom: 5px;
}

.item-meta {
  font-size: 0.75rem;
  color: var(--brand-color);
  font-weight: 500;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

/* Status badges */
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
```

### 📱 Responsive Design Guidelines

#### Breakpoint System
- **Desktop**: `> 1024px` - Full layout with sidebars and multi-column grids
- **Tablet**: `768px - 1024px` - Collapsed sidebars, adjusted grids
- **Mobile Large**: `480px - 768px` - Single column, stacked elements
- **Mobile Small**: `< 480px` - Minimal padding, condensed content

#### Grid Patterns
```css
/* Responsive Card Grid */
.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

/* Two Column Layout */
.grid-two-column {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

/* Mobile: Single Column */
@media (max-width: 1024px) {
  .grid-two-column {
    grid-template-columns: 1fr;
  }
}
```

#### Mobile-First Padding/Margin
- **Desktop**: `padding: 0 40px;`
- **Mobile**: `padding: 0 20px;`

### 🎭 Interactive States (Updated for Consistency)

#### Hover Animations (Unified)
- **Cards**: `transform: translateY(-2px)` + enhanced glass effect
- **Buttons**: `transform: translateY(-2px)` + branded shadow
- **Nav Tabs**: Subtle background opacity increase
- **Quick Actions**: `translateY(-2px)` + opacity change

#### Loading States (Consistent)
- **Spinner**: Glassmorphism spinner with portal brand color
- **Skeleton**: Glass-effect placeholders maintaining layout
- **Error States**: Unified error messaging with retry buttons

#### Focus States (Accessibility)
- All interactive elements have `outline: none` with custom focus indicators
- Tab navigation follows logical flow in all portal layouts
- Focus indicators use glassmorphism styling for consistency

### 🌐 Accessibility Guidelines

#### Color Contrast (Updated for Dark Theme)
- **Primary Text**: `white` with `text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5)`
- **Secondary Text**: `#cccccc` for supporting information
- **Muted Text**: `rgba(255, 255, 255, 0.7)` for inactive states
- **Interactive Elements**: Maintain 4.5:1 contrast on glassmorphism backgrounds

#### Interactive Elements
- **Buttons**: Always include `aria-label` for icon-only buttons
- **Forms**: Proper `label` association and validation feedback
- **Navigation**: Semantic HTML structure with proper heading hierarchy

#### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order throughout the interface
- Clear focus indicators on all focusable elements

---

## 🧩 Component Architecture

### Page Components
Each page follows a consistent structure:

```typescript
interface PageComponent {
  // Fixed dark background with hero section
  hero: HeroSection;
  // Main content area with cards/grids
  content: ContentGrid;
  // Responsive navigation breadcrumbs
  navigation?: Navigation;
}
```

### Reusable Components

#### 1. **Header Component** (`Header.tsx`)
- Fixed position navigation
- Brand logo and navigation links
- Responsive hamburger menu for mobile

#### 2. **Hero Component** (`Hero.tsx`)
- Full-screen landing section
- Background image with overlay
- Call-to-action buttons

#### 3. **Card Components**
- **Portal Cards**: Navigation cards with icons
- **Form Cards**: White background with form inputs
- **Stats Cards**: Metric display with large numbers
- **Info Cards**: Content cards with structured information

#### 4. **Form Components**
- Consistent input styling with focus states
- Validation feedback with error colors
- Accessible label associations

### 🗂️ File Structure
```
src/
├── components/           # Reusable UI components
│   ├── Header.tsx/css   # Site navigation
│   ├── Hero.tsx/css     # Landing hero sections
│   ├── Partners.tsx/css # Partner portal hub
│   ├── ESPartnerPortal.tsx/css  # ES portal navigation
│   ├── SRECHome.tsx/css         # SREC management
│   ├── Fulfillment.tsx/css      # Installation tracking
│   └── [Component].tsx/css      # Component + styles
├── assets/              # Static assets
│   ├── images/         # Background images, graphics
│   ├── icons/          # Component icons
│   └── logos/          # Brand assets
└── App.tsx             # Main routing and layout
```

### 🎛️ State Management Patterns
- **Local State**: `useState` for component-specific data
- **Form State**: Controlled components with validation
- **Navigation State**: React Router for page routing

---

## Development Standards

### CSS Architecture
- **Component-scoped CSS**: Each component has its own CSS file
- **BEM-like naming**: `.component-element--modifier` pattern
- **Mobile-first**: Start with mobile styles, enhance for desktop

### Component Standards
- **TypeScript**: All components use TypeScript interfaces
- **Props Interface**: Define clear prop interfaces for reusability
- **Accessibility**: Include ARIA attributes and semantic HTML
- **Responsive**: Test all components across breakpoints

### Code Quality
- **ESLint**: Enforce code standards and accessibility rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety and developer experience

### Performance Considerations
- **Image Optimization**: Use appropriate formats and sizes
- **Code Splitting**: Dynamic imports for large components
- **Lazy Loading**: Implement for non-critical content

---

## 🔄 Adding New UI Components

When adding new components, ensure they follow our established patterns:

### 1. **Design Compliance Checklist (Updated)**
- [ ] **Glassmorphism Theme**: Uses dark background (#060605) with glass effects
- [ ] **Portal Branding**: Applies correct brand colors (Cyan for Sales, Green for Installation/SREC)
- [ ] **Unified Layout**: Follows greeting section + navigation tabs + main content pattern  
- [ ] **Typography**: Uses white text with text-shadow, consistent font sizes
- [ ] **Hover States**: Implements `translateY(-2px)` + enhanced glass effects
- [ ] **Border Radius**: Uses 12px for cards, 8px for buttons, 16px for main containers
- [ ] **Mobile Responsive**: Tests across all 4 breakpoints with proper padding
- [ ] **Accessibility**: Includes ARIA attributes, keyboard navigation, proper contrast

### 2. **Component Template**
```typescript
import React from 'react';
import './ComponentName.css';

interface ComponentNameProps {
  title: string;
  // Define all props with types
}

const ComponentName: React.FC<ComponentNameProps> = ({ title }) => {
  return (
    <div className="component-name-page">
      <div className="component-hero">
        <h1 className="component-title">{title}</h1>
      </div>
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### 3. **CSS Template**
```css
.component-name-page {
  min-height: 100vh;
  background-color: #060605;
  color: white;
  padding-top: 120px;
  padding-bottom: 60px;
}

.component-hero {
  text-align: center;
  margin-bottom: 80px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
}

.component-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 20px 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .component-name-page {
    padding-top: 100px;
  }
  
  .component-title {
    font-size: 2.5rem;
  }
  
  .component-hero {
    padding: 0 20px;
  }
}

@media (max-width: 480px) {
  .component-title {
    font-size: 2rem;
  }
}
```

### 4. **Testing New Components**
1. **Visual Testing**: Test across all breakpoints (desktop, tablet, mobile)
2. **Accessibility Testing**: Use screen readers and keyboard navigation
3. **Performance Testing**: Check for smooth animations and fast load times
4. **Cross-browser Testing**: Ensure compatibility across major browsers

### 5. **Integration Guidelines**
- **Routing**: Add new routes to `App.tsx` following existing patterns
- **Navigation**: Update navigation components with new routes
- **Assets**: Place images in appropriate `assets/` subdirectories
- **Documentation**: Update this README with any new patterns or components

---

## 🚀 Deployment

### Railway Deployment
The application is configured for Railway deployment with:
- **Build Command**: `npm run build`
- **Start Command**: Serve static files from `build/`
- **Environment**: Production optimized React build

### Build Requirements
- Node.js 16+ recommended
- All ESLint errors must be resolved (CI treats warnings as errors)
- TypeScript compilation must pass without errors

---

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Responsive Design Patterns](https://web.dev/responsive-web-design-basics/)

---

## 🤝 Contributing

When contributing new features or modifications:

1. **Follow Design System**: Ensure all additions comply with established UI/UX guidelines
2. **Test Responsiveness**: Verify functionality across all supported breakpoints  
3. **Maintain Accessibility**: Include proper ARIA attributes and semantic HTML
4. **Update Documentation**: Add any new patterns or components to this README
5. **Code Quality**: Run ESLint and fix all violations before submission

---

## 🎯 **UNIFIED DESIGN CONSISTENCY REQUIREMENTS**

**⚠️ CRITICAL**: All portal interfaces (Sales, Installation, SREC) must follow these unified patterns:

### **Layout Consistency Checklist**
- [ ] **Dark glassmorphism theme** with `#060605` background
- [ ] **Greeting section** with branded icon and glassmorphism card
- [ ] **Navigation tabs** with unified styling and active states
- [ ] **Main content area** with glass background and proper padding
- [ ] **Data displays** use card-based lists (not HTML tables)
- [ ] **Portal branding**: Sales=Cyan, Installation/SREC=Green
- [ ] **Interactive states** use `translateY(-2px)` hover animations
- [ ] **Status badges** follow unified color and styling patterns

### **🚨 Breaking Changes Made**
- **2024-08-26**: Sales and Installation layouts updated from light theme to unified dark glassmorphism theme
- **Pattern Change**: All data displays now use SREC-style card lists instead of traditional tables
- **Color System**: Portal-specific brand colors (Cyan/Green) applied consistently

### **Design Review Process**
1. **Verify glassmorphism consistency** across all three portals
2. **Test responsive behavior** at all breakpoints (1024px, 768px, 480px)
3. **Validate accessibility** with screen readers and keyboard navigation
4. **Check brand color usage** matches portal assignment
5. **Ensure table/list format** follows SREC card-based pattern

The unified design system documented above ensures consistency, accessibility, and maintainability across the entire platform. All new additions must integrate seamlessly with these established patterns.