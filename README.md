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

#### Primary Colors
- **Background Dark**: `#060605` - Main page background
- **Card Dark**: `#0A0A0A` - Primary card backgrounds
- **Card Hover**: `#1A1A1A` - Interactive card hover states
- **Brand Cyan**: `#00bcd4` - Primary brand color, CTAs, links
- **Brand Cyan Dark**: `#0097a7` - Gradient secondary
- **Brand Cyan Light**: `#00acc1` - Hover states

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

### 🎯 Component Patterns

#### Page Layout Structure
```
.page-container {
  min-height: 100vh;
  background-color: #060605;
  background-attachment: fixed;
  padding-top: 120px; /* Account for fixed header */
  padding-bottom: 60px;
}
```

#### Hero Section Pattern
```
.hero-section {
  text-align: center;
  margin-bottom: 80px;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}
```

#### Badge Component
```
.badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 14px;
}
```

#### Card Component Pattern
```
.card {
  background: rgba(255, 255, 255, 0.95); /* Light cards */
  /* OR */
  background: #0A0A0A; /* Dark cards */
  
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  background: #1A1A1A; /* Darker on hover */
  border-color: rgba(0, 188, 212, 0.5);
  box-shadow: 0 10px 30px rgba(0, 188, 212, 0.2);
}
```

#### Button Variants
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #00bcd4, #0097a7);
  border: none;
  border-radius: 12px;
  padding: 15px 30px;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #00acc1, #00838f);
  transform: translateY(-2px);
}

/* Secondary Button */
.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
}

/* Task/Action Button */
.btn-task {
  background: #e8f5e8;
  color: #28a745;
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: 500;
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

### 🎭 Interactive States

#### Hover Animations
- **Cards**: `transform: translateY(-5px)` + shadow enhancement
- **Buttons**: `transform: translateY(-2px)` + color transition
- **Links**: `opacity: 0.8` transition

#### Loading States
- Use skeleton loaders matching component structure
- Maintain layout stability during content loading

#### Focus States
- Ensure all interactive elements have visible focus indicators
- Use `outline` or `box-shadow` for keyboard navigation

### 🌐 Accessibility Guidelines

#### Color Contrast
- **Text on Light**: Use `#333` for sufficient contrast
- **Text on Dark**: Use `white` or `#cccccc` for readability
- **Interactive Elements**: Ensure 4.5:1 contrast minimum

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

## 🔧 Development Standards

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

### 1. **Design Compliance Checklist**
- [ ] Uses established color palette
- [ ] Follows typography scale
- [ ] Implements proper border radius
- [ ] Includes hover/focus states
- [ ] Mobile-responsive design
- [ ] Accessible markup and interactions

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

The design system documented above ensures consistency, accessibility, and maintainability across the entire platform. All new additions should integrate seamlessly with these established patterns.