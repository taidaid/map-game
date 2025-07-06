# Source Code & Unit Testing

## Overview

This directory contains the source code for the Map Game application, including React components, utilities, services, and comprehensive unit tests.

*Last updated: December 19, 2024 - Implemented ESLint with SonarJS static analysis and security fixes*

> **📚 Related Documentation:**
> - **[../README.md](../README.md)** - Project overview, development scripts, and setup
> - **[../ARCHITECTURE.md](../ARCHITECTURE.md)** - Technical architecture and project structure
> - **[../QA.md](../QA.md)** - Testing strategy and quality assurance
> - **[../e2e/README.md](../e2e/README.md)** - End-to-end testing specifics
> - **[../PRODUCT.md](../PRODUCT.md)** - Product vision and features

## Directory Structure

```
src/
├── components/           # React components
│   ├── Game.jsx         # Main game orchestration component
│   ├── Game.css         # Game component styling
│   ├── Map.jsx          # Google Maps display component (renamed from Map to MapComponent)
│   ├── Map.css          # Map component styling
│   ├── RouteInput.jsx   # Route description input component
│   └── RouteInput.css   # Route input styling
├── hooks/               # Custom React hooks
│   └── useGame.js       # Game state management hook
├── services/            # API and external services
│   ├── maps.js          # Google Maps integration service
│   └── scoring.js       # Route comparison and scoring service
├── utils/               # Pure utility functions
├── types/               # TypeScript type definitions
├── __tests__/           # Test utilities and mocks
│   ├── integration/     # Integration tests
│   └── mocks/           # Mock implementations
├── App.jsx              # Main application component
├── App.test.jsx         # App component tests
├── main.jsx             # Application entry point
├── setupTests.js        # Test configuration
└── **/*.test.jsx        # Component and utility tests
```

## 🔍 Code Quality & Static Analysis

### ESLint + SonarJS Configuration
- **ESLint**: Comprehensive linting with React and TypeScript rules
- **SonarJS**: Advanced static analysis for code quality and security
- **Zero Tolerances**: No warnings or errors allowed in codebase
- **Environment-Specific Rules**: Tailored rules for source code vs. test files

### Security Improvements
- **ReDoS Protection**: Fixed all Regular Expression Denial of Service vulnerabilities
- **Safe HTML Processing**: Replaced vulnerable regex patterns with secure string manipulation
- **Backtracking Prevention**: Eliminated catastrophic backtracking in regex patterns
- **Performance Optimization**: Improved regex performance with bounded quantifiers

### Code Quality Standards
- **Component Naming**: Avoid global shadowing (Map → MapComponent)
- **Import Management**: Clean imports without unused references
- **Function Parameters**: Proper parameter naming with underscore prefix for unused params
- **Error Handling**: Consistent error handling patterns

### Recent Security Fixes
- **services/maps.js**: Replaced `<[^>]*>` regex with safe `removeHtmlTags()` function
- **services/scoring.js**: Fixed complex alternation patterns in street/distance extraction
- **utils/testUtils.js**: Added bounded quantifiers to prevent backtracking
- **components/Map.jsx**: Renamed to avoid JavaScript `Map` constructor shadowing

## 🧪 Unit Testing

### Framework & Tools
- **Testing Framework**: Vitest
- **React Testing**: React Testing Library
- **Assertions**: Vitest's built-in assertions
- **Mock Functions**: vi.mock() and vi.fn()
- **Test Environment**: jsdom

### Running Tests

For complete testing commands and scripts, see **[../README.md](../README.md#development-scripts)**.

**Quick unit testing commands:**
```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Test Configuration

Test configuration is managed in:
- `vitest.config.js` - Main Vitest configuration
- `setupTests.js` - Test setup and global mocks
- `__tests__/mocks/` - Mock implementations

### Writing Tests

#### Component Testing
```javascript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
```

#### Utility Testing
```javascript
import { describe, it, expect } from 'vitest'
import { formatRoute } from './routeUtils'

describe('formatRoute', () => {
  it('formats route correctly', () => {
    const result = formatRoute('Main St, Oak Ave, Park Rd')
    expect(result).toEqual(['Main St', 'Oak Ave', 'Park Rd'])
  })
})
```

#### Hook Testing
```javascript
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useGame } from './useGame'

describe('useGame', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useGame())
    expect(result.current.gameState).toBe('idle')
  })
})
```

### Test Best Practices

#### Naming Conventions
- Test files: `ComponentName.test.jsx`
- Test descriptions: `should [expected behavior]`
- Test groups: Use `describe` blocks for organization

#### Test Structure
```javascript
describe('ComponentName', () => {
  describe('when [condition]', () => {
    it('should [expected behavior]', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

#### Mocking Guidelines
- Mock external dependencies
- Use `vi.mock()` for module mocks
- Mock at the module level when possible
- Keep mocks in `__tests__/mocks/`

### Test Utilities

#### Custom Render
```javascript
import { render } from '@testing-library/react'
import { GameProvider } from '../contexts/GameContext'

export function renderWithProvider(ui, options = {}) {
  return render(ui, {
    wrapper: ({ children }) => (
      <GameProvider>{children}</GameProvider>
    ),
    ...options
  })
}
```

#### Test Helpers
- `testUtils.js` - Common testing utilities
- Custom matchers for domain-specific assertions
- Setup and teardown helpers

### Integration Testing

Integration tests verify component interactions:
- Located in `__tests__/integration/`
- Test complete user flows
- Verify component communication
- Test with real (non-mocked) dependencies when appropriate

### Mock Strategy

#### Google Maps Mocking
```javascript
// __tests__/mocks/googleMaps.js
export const mockGoogleMaps = {
  maps: {
    Map: vi.fn(),
    Marker: vi.fn(),
    DirectionsService: vi.fn(),
    DirectionsRenderer: vi.fn()
  }
}
```

#### Service Mocking
- Mock external APIs
- Mock complex services
- Provide deterministic responses
- Test error conditions

### Coverage Reports

For comprehensive coverage information and standards, see **[../QA.md](../QA.md#coverage-standards)**.

Coverage reports are generated in multiple formats:
- **HTML**: `coverage/index.html` - Interactive browser report
- **JSON**: `coverage/coverage-final.json` - Machine-readable format
- **LCOV**: `coverage/lcov.info` - CI/CD integration
- **Text**: Terminal output during test runs

### Debugging Tests

```bash
# Run specific test with debug output
npm run test -- --reporter=verbose Button.test.jsx

# Run tests in debug mode
npm run test:debug

# Run tests with browser debugging
npm run test:ui
```

### Performance Testing

Unit tests also include performance considerations:
- Test component render performance
- Verify hook optimization
- Test utility function efficiency
- Monitor test execution time

### Future Enhancements

As the application grows, consider:
- Property-based testing with fast-check
- Snapshot testing for UI components
- Performance benchmarking
- Mutation testing for test quality
- Contract testing for API interactions

## 🔗 Next Steps

- **[../e2e/README.md](../e2e/README.md)** - End-to-end testing with Playwright
- **[../QA.md](../QA.md)** - Overall testing strategy and standards
- **[../README.md](../README.md)** - Development scripts and project setup 