# Map Game - Development

A web-based geographic puzzle game that challenges players to navigate using visual landmarks and spatial reasoning.

*Last updated: December 19, 2024 - Added ESLint with SonarJS static analysis and security vulnerability fixes* 

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

# Set up environment variables
cp .env.example .env
# Edit .env and add your Google Maps API key
```

### Google Maps API Setup
1. **Get API Key**: Visit [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable APIs**: Enable the following APIs for your project:
   - Maps JavaScript API
   - Directions API
   - Places API (optional)
3. **Configure Environment**: Add your API key to `.env`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

### Start Development
```bash
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
npm run lint         # Run ESLint with SonarJS static analysis

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage report

# E2E Testing
npm run test:e2e     # Run all E2E tests (all browsers)
npm run test:e2e:dev # Run E2E tests (Chromium only - fast)
npm run test:e2e:ui  # Run E2E tests with interactive UI
npm run test:e2e:headed # Run E2E tests in headed mode
npm run test:all     # Run both unit and E2E tests (all browsers)
npm run test:all:dev # Run both unit and E2E tests (Chromium only)

# Commit Management
npm run commit       # Interactive commit with Commitizen (recommended)
```

## ⚛️ Atomic Commits & Commit Discipline

### Using Commitizen for Standardized Commits
We use **Commitizen** to enforce consistent, conventional commit messages:

```bash
# Instead of: git commit -m "fix stuff"
npm run commit
```

This opens an interactive prompt that guides you through:
- **Type**: feat, fix, docs, style, refactor, test, chore
- **Scope**: Optional component/area affected  
- **Description**: Clear, concise summary
- **Body**: Detailed explanation (optional)
- **Breaking Changes**: If applicable

### Atomic Commit Principles
Each commit should:
- ✅ **Single Purpose**: Accomplish exactly one specific goal
- ✅ **Minimal Changes**: 1-3 files, <50 lines of changes  
- ✅ **Self-Contained**: Can be safely reverted independently
- ✅ **Testable**: Includes tests and passes all existing tests
- ✅ **Clear Message**: Conventional commit format with descriptive summary

**Good Examples:**
```
feat: add route input validation
fix: correct map marker positioning  
test: add unit tests for scoring service
docs: update installation instructions
```

**Avoid:**
```
feat: implement complete Google Maps integration with scoring and UI
fix: various bugs and add new features
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
- [x] **Development Scripts** - Fast Chromium-only testing for development workflow
- [x] **Test Utilities** - Updated Page Object Model, test helpers, and fixtures
- [x] **Test Scripts** - Complete test command suite with development and CI options

### ✅ Documentation & Quality Assurance
- [x] **Pre-commit README Enforcer** - Automatically requires README updates when code changes
- [x] **Documentation Consolidation** - Single source of truth with cross-references
- [x] **Git Hooks** - Husky integration for automated documentation enforcement
- [x] **ESLint + SonarJS** - Static analysis with security vulnerability detection
- [x] **ReDoS Protection** - Fixed all regular expression denial of service vulnerabilities
- [x] **Code Quality Standards** - Comprehensive linting rules with zero warnings
- [x] **Quality Gates** - TypeScript, ESLint, testing, and documentation validation
- [x] **Documentation Standards** - Consistent formatting and progress tracking
- [x] **Development Workflow** - Complete workflow with automated validation

### ✅ Documentation
- [x] **README.md** - Developer-focused setup and usage guide
- [x] **PRODUCT.md** - Complete product vision and feature specifications
- [x] **ARCHITECTURE.md** - Technical planning and implementation details
- [x] **QA.md** - Comprehensive testing strategy and best practices
- [x] **E2E Documentation** - Complete Playwright testing guide

### ✅ Core Features (Completed)
- [x] **Google Maps Integration** - Maps JavaScript API setup and configuration
- [x] **Route Input Interface** - Text input component with format validation
- [x] **Basic Scoring System** - Simple route comparison and scoring logic
- [x] **Game State Management** - React hooks for game flow and state
- [x] **Map Display Component** - Interactive map with custom styling and markers
- [x] **Complete Game Flow** - End-to-end game experience with scoring and feedback

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

## 🏗️ Project Structure & Architecture

For detailed technical architecture, project structure, and technology stack information, see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

**Current Stack:**
- **Frontend**: React 18 + Vite
- **Testing**: Vitest + Playwright
- **Quality**: ESLint + TypeScript
- **Build**: Vite with optimizations

## 📚 Documentation

Our documentation is organized for easy navigation:

### **Core Documentation**
- **[PRODUCT.md](./PRODUCT.md)** - Product vision, features, and user experience
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture and project structure
- **[QA.md](./QA.md)** - Testing strategy and quality assurance

### **Specialized Documentation**
- **[src/README.md](./src/README.md)** - Unit testing specifics
- **[e2e/README.md](./e2e/README.md)** - E2E testing specifics

### **Documentation Standards**
Each document follows our consolidation principle:
- **Single source of truth** - Information exists in only one authoritative place
- **Cross-references** - Documents link to authoritative sources rather than duplicating
- **Consistent navigation** - Related Documentation sections guide readers

## 🧪 Testing

For comprehensive testing strategy and coverage information, see **[QA.md](./QA.md)**.

**Quick Test Commands:**
```bash
# Development workflow (fast)
npm run test           # Unit tests
npm run test:e2e:dev   # E2E tests (Chromium only)
npm run test:all:dev   # Both unit and E2E tests (Chromium only)

# Comprehensive testing (CI/pre-release)
npm run test:e2e       # E2E tests (all browsers)
npm run test:all       # Both unit and E2E tests (all browsers)
npm run test:coverage  # Coverage report
```

**Test Coverage Summary:**
- **Unit Tests**: 32 passing tests (100% coverage)
- **E2E Tests**: 102 passing tests across all browsers
- **Total**: 134+ comprehensive tests

## 🔗 Next Steps

- **[PRODUCT.md](./PRODUCT.md)** - Understand the product vision and features
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Explore technical architecture
- **[QA.md](./QA.md)** - Review testing strategy and standards


