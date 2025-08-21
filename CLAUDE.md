# Claude Code Project Configuration

## 🔧 Project-Specific Instructions

This file contains specific instructions and preferences for working with this Cosmos by Qcells landing platform project.

---

## 📋 Git Workflow Preferences

### **Branch Creation Workflow**

When creating a new feature branch, follow this **exact workflow**:

1. **Create Branch**: Run `git checkout -b branch-name`
2. **Launch Development Server**: Run `npm start` in background to track UI changes
3. **Proceed with development work**

### **Commit OR Checkpoint Workflow - NO PULL REQUESTS**

When you request to commit or checkpoint changes, I will:
1. **Summarize the workflow steps** that need to be taken
2. **Wait for your authorization** to proceed
3. **Execute each step one at a time** after confirmation

**Workflow Steps** (executed after your authorization):

0. **Production Compatibility Check**: Before any git commands, perform Railway deployment validation
   - Run `npm run build` to verify production build succeeds
   - Check for ESLint errors (CI treats warnings as errors)
   - Verify TypeScript compilation passes
   - Confirm no unused variables or invalid href attributes
   - Validate all imports resolve correctly
   - Report any issues that could break Railway pipeline

1. **Status Check**: Run `git status` to show current changes
2. **Review Changes**: Run `git diff` to show what will be committed
3. **Stage Changes**: Run `git add .` to stage all changes
4. **Commit**: Create commit with descriptive message following our format
5. **Merge to Main**: If on feature branch, switch to main and merge
6. **Push to Main**: Run `git push origin main` directly
7. **Branch Cleanup**: Delete feature branch to keep repo clean
8. **Final Status**: Run `git status` to confirm clean state

### **Important Notes:**
- **SUMMARY FIRST**: Always provide workflow summary and wait for authorization
- **PRODUCTION COMPATIBILITY FIRST**: Always run build check before committing
- **NO PULL REQUESTS**: Always push directly to main branch
- **One Command at a Time**: Wait for each command to complete before running the next
- **Authorization Required**: Don't proceed without explicit approval from user
- **Always Launch Dev Server**: When creating branches, start `npm start` to track UI changes
- **Background Process**: Run development server in background for live UI feedback
- **Railway Pipeline Protection**: Never push code that breaks production build

### **Commit Message Format:**
```
[Action] Brief description of changes

- Specific change 1
- Specific change 2
- Specific change 3

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 🎨 UI/UX Development Guidelines

### **Design System Compliance**
Before adding any new UI components, ensure compliance with:

1. **Color Palette**: Use only established colors from README.md
2. **Typography**: Follow the 8-tier typography scale
3. **Spacing**: Use consistent padding/margin patterns
4. **Border Radius**: Apply appropriate radius from the 4-tier system
5. **Responsive**: Test across all 4 breakpoints
6. **Accessibility**: Include proper ARIA attributes

### **Component Development Process**
1. **Plan**: Use TodoWrite tool to break down component requirements
2. **Template**: Start with the component template from README.md
3. **Style**: Apply design system patterns consistently
4. **Test**: Verify responsiveness and accessibility
5. **Document**: Update README.md if new patterns are introduced

---

## 🛠️ Build & Development

### **Production Compatibility Checklist**
Before every commit, verify these Railway deployment requirements:

✅ **Build Verification**: `npm run build` completes successfully  
✅ **ESLint Compliance**: No errors or warnings (CI treats warnings as errors)  
✅ **TypeScript Compilation**: All types resolve correctly  
✅ **Import Resolution**: All imports are valid and accessible  
✅ **Accessibility**: No invalid href attributes or ARIA violations  
✅ **Unused Code**: No unused variables, imports, or functions  
✅ **Asset References**: All image/icon paths are correct  

### **Build Commands**
- **Development**: `npm start` (runs on port 3000)
- **Production Build**: `npm run build`
- **Pre-Commit Check**: `npm run build` to verify Railway compatibility

### **ESLint Compliance**
- All ESLint errors must be fixed before committing
- CI treats warnings as errors - ensure clean builds
- Use accessible patterns (proper href attributes, no unused variables)

### **Railway Deployment**
- Build must pass without ESLint errors
- TypeScript compilation must succeed
- Test build locally before pushing to main

---

## 📁 Project Structure Preferences

### **File Organization**
- Each component should have its own `.tsx` and `.css` file
- Place assets in appropriate `src/assets/` subdirectories
- Follow the established naming conventions

### **Component Naming**
- Use PascalCase for component names
- CSS classes use kebab-case with component prefix
- Files should match component names exactly

---

## 🔄 Common Tasks

### **Adding New Pages/Components**
1. Create feature branch and launch dev server
2. Create component using template from README.md
3. Add appropriate routing in App.tsx
4. Update navigation components if needed
5. Test responsiveness across breakpoints (use live dev server)
6. Verify accessibility compliance
7. Commit using the git workflow above

### **Fixing Build Errors**
1. Create feature branch for fixes and launch dev server
2. Identify and fix ESLint/TypeScript errors
3. Test build locally with `npm run build`
4. Verify fixes in live UI (dev server)
5. Merge to main and push using workflow above
6. Delete feature branch to keep repo clean

### **Updating Styles**
1. Check existing patterns in README.md design system
2. Use established colors, typography, and spacing
3. Maintain responsive design patterns
4. Test across all breakpoints
5. Commit changes following git workflow

---

## ⚡ Quick Commands

### **Development**
```bash
npm start          # Start development server
npm run build      # Test production build
git status         # Check current changes
git diff          # Review changes
```

### **Commit/Checkpoint Workflow (No PRs)**

**Summary Process:**
1. I provide workflow summary with all steps
2. Wait for your authorization to proceed
3. Execute each command one at a time

**Commands (executed after authorization):**
```bash
npm run build                 # 0. Production compatibility check FIRST
git status                    # 1. Check status
git diff                     # 2. Review changes
git add .                    # 3. Stage all changes
git commit -m "message"      # 4. Commit with message
git checkout main            # 5. Switch to main (if on feature branch)
git merge feature-branch     # 6. Merge feature branch (if applicable)
git push origin main         # 7. Push to main directly
git branch -d feature-branch # 8. Delete feature branch (cleanup)
git status                   # 9. Verify clean state
```

---

## 📝 Notes

- **Branch Strategy**: Work directly on main or feature branches, merge to main
- **No Pull Requests**: Always push directly to main branch after merge
- **Component Consistency**: Follow established UI patterns religiously
- **Performance**: Keep bundle size optimized, use code splitting when needed
- **Accessibility**: Maintain WCAG compliance for all interactive elements

---

## 🚀 Deployment

The project auto-deploys to Railway when changes are pushed to main branch. Ensure:
- Build passes locally with `npm run build`
- All ESLint errors are resolved
- Components follow responsive design patterns
- Accessibility standards are maintained

---

*This configuration ensures consistent development workflow and maintains the high quality standards established for the Cosmos by Qcells partner platform.*