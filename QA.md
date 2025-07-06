# Quality Assurance & Testing Strategy

## Overview
This document outlines the comprehensive testing strategy for the **Map Game - Blind Navigator** project, ensuring robust quality assurance throughout development.

> **📚 Related Documentation:**
> - **[README.md](./README.md)** - Project overview, quick start, and development progress
> - **[src/README.md](./src/README.md)** - Unit testing with Vitest & React Testing Library
> - **[e2e/README.md](./e2e/README.md)** - End-to-end testing with Playwright
> - **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture and technology stack
> - **[PRODUCT.md](./PRODUCT.md)** - Product vision, features, and user experience

## Testing Philosophy

### **Test Pyramid Strategy**
```
      🔺 E2E Tests (Few)
     🔺🔺 Integration Tests (Some)  
    🔺🔺🔺 Unit Tests (Many)
```

**Principles:**
- **Fast feedback** - Unit tests run quickly during development
- **Comprehensive coverage** - Test all critical paths and edge cases
- **Realistic scenarios** - E2E tests simulate real user interactions
- **Maintainable tests** - Clear, readable, and easy to update

## Unit Testing with Jest

### **Setup & Configuration**

**Dependencies:**
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.5.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@vitejs/plugin-react": "^4.2.1",
    "vitest": "^1.0.4"
  }
}
```

**Jest Configuration (`jest.config.js`):**
```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/main.jsx',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### **Testing Structure**

**Directory Organization:**
```
src/
├── components/
│   ├── Map/
│   │   ├── Map.jsx
│   │   └── Map.test.jsx
│   ├── RouteInput/
│   │   ├── RouteInput.jsx
│   │   └── RouteInput.test.jsx
│   └── RouteComparison/
│       ├── RouteComparison.jsx
│       └── RouteComparison.test.jsx
├── hooks/
│   ├── useMap.js
│   ├── useMap.test.js
│   ├── useGame.js
│   └── useGame.test.js
├── services/
│   ├── maps.js
│   ├── maps.test.js
│   ├── game.js
│   └── game.test.js
├── utils/
│   ├── routing.js
│   ├── routing.test.js
│   ├── scoring.js
│   └── scoring.test.js
└── __tests__/
    ├── integration/
    └── mocks/
```

### **Testing Categories**

**1. Component Testing**
```javascript
// components/Map/Map.test.jsx
import { render, screen } from '@testing-library/react'
import { Map } from './Map'

describe('Map Component', () => {
  test('renders map container', () => {
    render(<Map />)
    expect(screen.getByTestId('map-container')).toBeInTheDocument()
  })

  test('displays start and end markers', () => {
    const props = {
      startPoint: { lat: 52.0907, lng: 5.1214 },
      endPoint: { lat: 52.0799, lng: 5.1265 }
    }
    render(<Map {...props} />)
    expect(screen.getByTestId('start-marker')).toBeInTheDocument()
    expect(screen.getByTestId('end-marker')).toBeInTheDocument()
  })
})
```

**2. Hook Testing**
```javascript
// hooks/useGame.test.js
import { renderHook, act } from '@testing-library/react'
import { useGame } from './useGame'

describe('useGame Hook', () => {
  test('initializes with default game state', () => {
    const { result } = renderHook(() => useGame())
    
    expect(result.current.gameState).toBe('idle')
    expect(result.current.score).toBe(0)
    expect(result.current.userRoute).toBe('')
  })

  test('updates user route correctly', () => {
    const { result } = renderHook(() => useGame())
    
    act(() => {
      result.current.setUserRoute('Go north on Main Street')
    })
    
    expect(result.current.userRoute).toBe('Go north on Main Street')
  })
})
```

**3. Service Testing**
```javascript
// services/maps.test.js
import { mapsService } from './maps'
import { jest } from '@jest/globals'

// Mock Google Maps API
global.google = {
  maps: {
    DirectionsService: jest.fn(),
    DirectionsRenderer: jest.fn()
  }
}

describe('Maps Service', () => {
  test('calculates route correctly', async () => {
    const mockRoute = {
      legs: [{ distance: { value: 1500 }, duration: { value: 300 } }]
    }
    
    const result = await mapsService.calculateRoute(
      { lat: 52.0907, lng: 5.1214 },
      { lat: 52.0799, lng: 5.1265 }
    )
    
    expect(result).toHaveProperty('distance')
    expect(result).toHaveProperty('duration')
  })
})
```

**4. Utility Testing**
```javascript
// utils/scoring.test.js
import { calculateScore } from './scoring'

describe('Scoring Utility', () => {
  test('calculates perfect score for identical routes', () => {
    const userRoute = 'Go north on Main Street. Turn right on Oak Avenue.'
    const googleRoute = 'Go north on Main Street. Turn right on Oak Avenue.'
    
    const score = calculateScore(userRoute, googleRoute)
    expect(score).toBe(100)
  })

  test('penalizes incorrect street names', () => {
    const userRoute = 'Go north on Wrong Street'
    const googleRoute = 'Go north on Main Street'
    
    const score = calculateScore(userRoute, googleRoute)
    expect(score).toBeLessThan(100)
  })
})
```

## End-to-End Testing with Playwright

### **Setup & Configuration**

**Installation:**
```bash
npm install -D @playwright/test
npx playwright install
```

**Playwright Configuration (`playwright.config.js`):**
```javascript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
})
```

### **E2E Testing Structure**

**Directory Organization:**
```
e2e/
├── tests/
│   ├── game-flow.spec.js
│   ├── map-interaction.spec.js
│   ├── route-submission.spec.js
│   └── scoring.spec.js
├── fixtures/
│   ├── game-data.json
│   └── routes.json
├── page-objects/
│   ├── GamePage.js
│   ├── MapPage.js
│   └── ResultsPage.js
└── utils/
    ├── test-helpers.js
    └── mock-data.js
```

### **E2E Test Examples**

**1. Complete Game Flow**
```javascript
// e2e/tests/game-flow.spec.js
import { test, expect } from '@playwright/test'
import { GamePage } from '../page-objects/GamePage'

test.describe('Complete Game Flow', () => {
  test('user can complete a full game round', async ({ page }) => {
    const gamePage = new GamePage(page)
    
    await gamePage.goto()
    await gamePage.waitForMapLoad()
    
    // Enter route description
    await gamePage.enterRoute('Go north on Main Street. Turn right on Oak Avenue.')
    
    // Submit route
    await gamePage.submitRoute()
    
    // Verify results appear
    await expect(gamePage.resultsSection).toBeVisible()
    await expect(gamePage.scoreDisplay).toContainText('Score:')
    
    // Verify Google route is displayed
    await expect(gamePage.googleRoute).toBeVisible()
  })
})
```

**2. Map Interaction**
```javascript
// e2e/tests/map-interaction.spec.js
import { test, expect } from '@playwright/test'

test.describe('Map Interaction', () => {
  test('map loads without street names', async ({ page }) => {
    await page.goto('/')
    
    // Wait for map to load
    await page.waitForSelector('[data-testid="map-container"]')
    
    // Verify map is visible
    await expect(page.locator('[data-testid="map-container"]')).toBeVisible()
    
    // Verify start and end markers are present
    await expect(page.locator('[data-testid="start-marker"]')).toBeVisible()
    await expect(page.locator('[data-testid="end-marker"]')).toBeVisible()
  })

  test('user can zoom and pan the map', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('[data-testid="map-container"]')
    
    // Test zoom functionality
    await page.locator('[data-testid="zoom-in"]').click()
    await page.locator('[data-testid="zoom-out"]').click()
    
    // Test pan functionality (simulate drag)
    const map = page.locator('[data-testid="map-container"]')
    await map.dragTo(map, { 
      sourcePosition: { x: 100, y: 100 },
      targetPosition: { x: 200, y: 200 }
    })
  })
})
```

**3. Route Submission**
```javascript
// e2e/tests/route-submission.spec.js
import { test, expect } from '@playwright/test'

test.describe('Route Submission', () => {
  test('validates route input format', async ({ page }) => {
    await page.goto('/')
    
    // Test empty submission
    await page.locator('[data-testid="submit-route"]').click()
    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Please enter a route description')
    
    // Test invalid format
    await page.locator('[data-testid="route-input"]').fill('invalid route')
    await page.locator('[data-testid="submit-route"]').click()
    await expect(page.locator('[data-testid="error-message"]'))
      .toContainText('Please use the format: Go [direction] on [street]')
  })

  test('accepts valid route format', async ({ page }) => {
    await page.goto('/')
    
    const validRoute = 'Go north on Main Street. Turn right on Oak Avenue.'
    await page.locator('[data-testid="route-input"]').fill(validRoute)
    await page.locator('[data-testid="submit-route"]').click()
    
    await expect(page.locator('[data-testid="results-section"]')).toBeVisible()
  })
})
```

## Page Object Model

**Example Page Object:**
```javascript
// e2e/page-objects/GamePage.js
export class GamePage {
  constructor(page) {
    this.page = page
    this.mapContainer = page.locator('[data-testid="map-container"]')
    this.routeInput = page.locator('[data-testid="route-input"]')
    this.submitButton = page.locator('[data-testid="submit-route"]')
    this.resultsSection = page.locator('[data-testid="results-section"]')
    this.scoreDisplay = page.locator('[data-testid="score-display"]')
    this.googleRoute = page.locator('[data-testid="google-route"]')
  }

  async goto() {
    await this.page.goto('/')
  }

  async waitForMapLoad() {
    await this.mapContainer.waitFor({ state: 'visible' })
  }

  async enterRoute(routeText) {
    await this.routeInput.fill(routeText)
  }

  async submitRoute() {
    await this.submitButton.click()
  }

  async getScore() {
    return await this.scoreDisplay.textContent()
  }
}
```

## Testing Scripts

**Package.json Scripts:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

## Code Quality Tools

### **ESLint Configuration**
```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    '@vitejs/eslint-config-react',
    'plugin:testing-library/react'
  ],
  rules: {
    'testing-library/no-debugging-utils': 'warn',
    'testing-library/prefer-screen-queries': 'error'
  }
}
```

### **Prettier Configuration**
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

## CI/CD Integration

### **GitHub Actions Workflow**
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:coverage
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

## Testing Best Practices

### **Unit Testing**
- **Test behavior, not implementation**
- **Use descriptive test names**
- **Follow AAA pattern: Arrange, Act, Assert**
- **Mock external dependencies**
- **Test edge cases and error conditions**

### **E2E Testing**
- **Test critical user journeys**
- **Use data-testid attributes for reliable selectors**
- **Keep tests independent and isolated**
- **Use Page Object Model for maintainability**
- **Test across different browsers and devices**

### **General Guidelines**
- **Maintain high test coverage (>80%)**
- **Run tests in CI/CD pipeline**
- **Fix failing tests immediately**
- **Review test code as carefully as production code**
- **Use meaningful test data**

## Performance Testing

### **Load Testing Considerations**
- **Google Maps API rate limits**
- **Concurrent user scenarios**
- **Memory usage during map interactions**
- **Network latency simulation**

### **Tools for Performance Testing**
- **Lighthouse** - Core Web Vitals
- **WebPageTest** - Real-world performance
- **Artillery** - Load testing APIs
- **Playwright** - Performance metrics

## Accessibility Testing

### **Automated A11y Testing**
```javascript
// Add to E2E tests
import { injectAxe, checkA11y } from 'axe-playwright'

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
  await checkA11y(page)
})
```

### **Manual Testing Checklist**
- **Keyboard navigation**
- **Screen reader compatibility**
- **Color contrast compliance**
- **Focus management**
- **Alt text for images**

## Security Testing

### **Security Considerations**
- **API key exposure**
- **XSS prevention**
- **Input validation**
- **Rate limiting**
- **HTTPS enforcement**

## Documentation Quality Assurance

### **Pre-commit README Enforcer**
We use an automated git hook to ensure documentation stays current with code changes.

**Tool:** [pre-commit-readme-enforcer](https://github.com/taidaid/pre-commit-readme-enforcer)

**How it works:**
- Automatically runs before each commit
- Checks if code files are being committed
- Requires corresponding README file updates
- Prevents commits without documentation updates

**Implementation:**
```bash
# Setup (already completed)
npm install --save-dev husky
npm pkg set scripts.prepare="husky"
npm run prepare
echo "node check-readme-updated.cjs" > .husky/pre-commit
chmod +x .husky/pre-commit
```

**Benefits:**
- **Enforces documentation discipline** - No code changes without docs
- **Maintains documentation currency** - Docs stay up-to-date automatically
- **Prevents documentation debt** - Catches missed updates immediately
- **Supports team collaboration** - Consistent documentation standards

**Example workflow:**
```bash
# ❌ Commit fails without README update
git add src/components/NewComponent.jsx
git commit -m "Add new component"
# Result: "❌ README update required!"

# ✅ Commit succeeds with README update
git add README.md
git commit -m "Add new component and update docs"
# Result: "✓ README update requirement satisfied!"
```

This tool is part of our comprehensive quality assurance strategy, ensuring that our documentation remains as reliable and current as our code.

## 📋 Testing Implementation Progress

### ✅ Testing Foundation (Completed)
- [x] **Testing Strategy** - Comprehensive test pyramid approach defined
- [x] **Unit Testing Framework** - Vitest + React Testing Library setup
- [x] **E2E Testing Framework** - Playwright cross-browser testing configured
- [x] **Test Configuration** - Coverage thresholds and reporting setup
- [x] **Test Scripts** - Complete npm script suite for all testing scenarios
- [x] **Test Documentation** - Comprehensive testing guides and best practices

### ✅ Unit Testing (Completed)
- [x] **Test Environment** - JSDOM setup with proper React testing support
- [x] **Component Testing** - App component tests with 7 test scenarios
- [x] **Utility Testing** - 20 comprehensive tests for utility functions
- [x] **Integration Testing** - Complete app functionality testing
- [x] **Test Coverage** - 100% coverage on application code (32/32 tests passing)
- [x] **Test Utilities** - Custom testing helpers and mock implementations

### ✅ E2E Testing (Completed)
- [x] **Cross-Browser Testing** - Chrome, Firefox, Safari, Edge support
- [x] **Mobile Testing** - Mobile Chrome and Safari viewport testing
- [x] **Page Object Model** - Maintainable test structure with GamePage class
- [x] **Test Fixtures** - Centralized test data management
- [x] **Test Utilities** - Advanced helpers for performance, accessibility, responsive testing
- [x] **Test Coverage** - 102 passing tests across all browsers and devices
- [x] **Visual Testing** - Screenshot and video recording for debugging

### ✅ Test Automation (Completed)
- [x] **Test Scripts** - Automated test execution with npm commands
- [x] **Coverage Reporting** - HTML and JSON coverage reports
- [x] **Test Watching** - Development-time test watching and re-execution
- [x] **Test UI** - Interactive test interfaces for both unit and E2E tests
- [x] **Performance Testing** - Load time and rendering performance validation
- [x] **Accessibility Testing** - Basic a11y validation in E2E tests

### ✅ Documentation Quality Assurance (Completed)
- [x] **Pre-commit README Enforcer** - Automated git hook requiring documentation updates
- [x] **Git Hooks Setup** - Husky integration for automated validation
- [x] **Documentation Standards** - Consistent formatting and progress tracking
- [x] **Quality Gates** - Automated enforcement of documentation requirements
- [x] **Developer Workflow** - Seamless integration with development process
- [x] **Comprehensive Coverage** - All code changes require corresponding documentation

### 🔄 Enhanced Testing (In Progress)
- [ ] **API Testing** - Test Google Maps API integration
- [ ] **Mock Services** - Advanced mocking for external dependencies
- [ ] **Visual Regression Testing** - Automated UI change detection
- [ ] **Performance Benchmarking** - Detailed performance metrics and thresholds
- [ ] **Accessibility Compliance** - Full WCAG 2.1 AA compliance testing
- [ ] **Security Testing** - API key protection and XSS prevention

### 📅 Future Testing (Planned)
- [ ] **Backend Testing** - API endpoint testing when backend is implemented
- [ ] **Database Testing** - Data integrity and migration testing
- [ ] **Authentication Testing** - User login and session management testing
- [ ] **Load Testing** - Concurrent user and stress testing
- [ ] **CI/CD Integration** - Automated testing in deployment pipeline
- [ ] **Monitoring Integration** - Production error tracking and alerting

### 📅 Advanced Testing (Long-term)
- [ ] **Multi-Browser Automation** - Extended browser and device coverage
- [ ] **Internationalization Testing** - Multi-language and localization testing
- [ ] **Offline Testing** - PWA offline functionality testing
- [ ] **Real Device Testing** - Physical device testing on mobile platforms
- [ ] **Penetration Testing** - Security vulnerability assessment
- [ ] **Performance Profiling** - Advanced performance analysis and optimization

---

This comprehensive testing strategy ensures the Map Game maintains high quality, reliability, and user experience throughout development and deployment.

## 🔗 Next Steps

- **[src/README.md](./src/README.md)** - Dive into unit testing implementation details
- **[e2e/README.md](./e2e/README.md)** - Explore end-to-end testing specifics
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Understand technical architecture
- **[PRODUCT.md](./PRODUCT.md)** - Review product vision and features
- **[README.md](./README.md)** - Return to project overview 