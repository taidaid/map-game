# Map Game - Development

A web-based geographic puzzle game that challenges players to navigate using visual landmarks and spatial reasoning. 

## 📖 Product Documentation

For comprehensive product information, game concept, and feature specifications, see **[PRODUCT.md](./PRODUCT.md)**.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Installation & Setup
```bash
# Clone the repository
git clone <repository-url>
cd map-game

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🛠️ Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report

# E2E Testing
npm run test:e2e     # Run all E2E tests
npm run test:e2e:ui  # Run E2E tests with interactive UI
npm run test:e2e:headed # Run E2E tests in headed mode
npm run test:all     # Run both unit and E2E tests
```

## 🔒 Git Hooks & Documentation Enforcement

### Pre-commit README Enforcer
We use a pre-commit hook that automatically enforces documentation updates:

**How it works:**
- When you commit code changes, the hook checks for updates to relevant README files
- If you change code files, you **must** also update the nearest README file
- The commit will fail if documentation is not updated

**Example workflow:**
```bash
# ❌ This will fail - no README update
git add src/components/Button.jsx
git commit -m "Add button component"
# Hook says: "README update required!"

# ✅ This will succeed - README also updated
git add README.md  # Update documentation
git commit -m "Add button component and update docs"
# Hook says: "README update requirement satisfied!"
```

**What counts as a README update:**
- Adding documentation about your changes
- Updating progress checklists
- Adding timestamps or version info
- Even minor formatting changes (if you've reviewed the docs)

This ensures our documentation stays current with code changes and maintains our comprehensive development tracking.

## 📋 Development Progress

### ✅ Foundation & Setup
- [x] **React + Vite Setup** - Modern development environment with hot reload
- [x] **Project Structure** - Well-organized directory structure (`src/`, `e2e/`, docs)
- [x] **Package Configuration** - Dependencies, scripts, and build configuration
- [x] **Development Scripts** - All npm commands for dev, build, test workflows
- [x] **Basic UI** - Hello World interface with feature preview
- [x] **CSS Styling** - Modern responsive design with container and features layout

### ✅ Testing Foundation
- [x] **Unit Testing Setup** - Vitest + React Testing Library configuration
- [x] **Unit Test Coverage** - 100% coverage with 32 passing tests
- [x] **E2E Testing Setup** - Playwright with cross-browser configuration
- [x] **E2E Test Suite** - 102 passing tests across all browsers and devices
- [x] **Test Utilities** - Page Object Model, test helpers, and fixtures
- [x] **Test Scripts** - Complete test command suite with coverage reporting

### ✅ Documentation & Quality Assurance
- [x] **Pre-commit README Enforcer** - Automatically requires README updates when code changes
- [x] **Cursor Rules** - 6 comprehensive rules implementing self-correcting feedback loop
- [x] **Git Hooks** - Husky integration for automated documentation enforcement
- [x] **Quality Gates** - TypeScript, ESLint, testing, and documentation validation
- [x] **Documentation Standards** - Consistent formatting and progress tracking
- [x] **Development Workflow** - Complete workflow with automated validation

### ✅ Documentation
- [x] **README.md** - Developer-focused setup and usage guide
- [x] **PRODUCT.md** - Complete product vision and feature specifications
- [x] **ARCHITECTURE.md** - Technical planning and implementation details
- [x] **QA.md** - Comprehensive testing strategy and best practices
- [x] **E2E Documentation** - Complete Playwright testing guide

### 🔄 Core Features (In Progress)
- [ ] **Google Maps Integration** - Maps JavaScript API setup and configuration
- [ ] **Route Input Interface** - Text input component with format validation
- [ ] **Basic Scoring System** - Simple route comparison and scoring logic
- [ ] **Game State Management** - React hooks for game flow and state

### 📅 POC Features (Planned)
- [ ] **Map Display** - Google Maps embed without street labels
- [ ] **Point Selection** - Hardcoded start/end points with markers
- [ ] **Route Description** - Text input with format guidance
- [ ] **Route Comparison** - Display user route vs Google route
- [ ] **Simple Scoring** - Binary match/different scoring
- [ ] **Complete Game Flow** - End-to-end single round gameplay

### 📅 Advanced Features (Future)
- [ ] **Backend Integration** - API routes or separate backend service
- [ ] **User Authentication** - User accounts and session management
- [ ] **Database Integration** - Persistent game data and user progress
- [ ] **Advanced Scoring** - Multi-factor scoring algorithm
- [ ] **Multiple Game Modes** - Different challenge types and difficulty levels
- [ ] **Social Features** - Leaderboards, sharing, and multiplayer

## 🏗️ Proof of Concept Scope

The current POC focuses on:
1. **Map Display**: Basic Google Maps embed without street labels
2. **Point Selection**: Two hardcoded start/end points  
3. **Route Interface**: Text input with basic format guidance
4. **Comparison**: Simple binary scoring (Match/Different)
5. **Game Flow**: Single round gameplay

See **[PRODUCT.md](./PRODUCT.md)** for complete feature specifications and **[ARCHITECTURE.md](./ARCHITECTURE.md)** for technical implementation details.

## 📚 Documentation

- **[PRODUCT.md](./PRODUCT.md)** - Complete product vision, features, user experience, and game mechanics
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical planning, technology stack, and implementation details
- **[QA.md](./QA.md)** - Testing strategy, unit testing with Vitest, and E2E testing with Playwright

## 🧪 Testing

### Unit Tests
- **Framework**: Vitest + React Testing Library
- **Coverage**: 100% on application code
- **Tests**: 32 passing tests covering components and utilities
- **Location**: `src/**/*.test.jsx`

### E2E Tests  
- **Framework**: Playwright
- **Coverage**: 102 passing tests across all browsers
- **Browsers**: Chrome, Firefox, Safari, Edge, Mobile Chrome, Mobile Safari
- **Location**: `e2e/tests/`

### Test Commands
```bash
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run test:all       # Both unit and E2E tests
npm run test:coverage  # Coverage report
```

## 🏛️ Architecture

### Current Stack
- **Frontend**: React 18 + Vite
- **Styling**: CSS3 with modern features
- **Testing**: Vitest + Playwright
- **Build**: Vite with optimizations

### Future Integrations
- **Google Maps Platform** - Interactive maps and directions
- **Backend API** - Route processing and scoring
- **Database** - User progress and leaderboards


