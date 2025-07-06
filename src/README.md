# Source Code & Unit Testing

## Overview

This directory contains the source code for the Map Game application, including React components, utilities, services, and comprehensive unit tests.

*Last updated: Complete TypeScript conversion with comprehensive type safety and enhanced development experience*

> **📚 Related Documentation:**
> - **[../README.md](../README.md)** - Project overview, development scripts, and setup
> - **[../ARCHITECTURE.md](../ARCHITECTURE.md)** - Technical architecture and project structure
> - **[../QA.md](../QA.md)** - Testing strategy and quality assurance
> - **[../e2e/README.md](../e2e/README.md)** - End-to-end testing specifics
> - **[../PRODUCT.md](../PRODUCT.md)** - Product vision and features

## Directory Structure

```
src/
├── components/           # React components (TypeScript)
│   ├── Game.tsx         # Main game orchestration component
│   ├── Game.css         # Game component styling
│   ├── Map.tsx          # Google Maps display component (renamed from Map to MapComponent)
│   ├── Map.css          # Map component styling
│   ├── RouteInput.tsx   # Route description input component
│   └── RouteInput.css   # Route input styling
├── hooks/               # Custom React hooks (TypeScript)
│   └── useGame.ts       # Game state management hook
├── services/            # API and external services (TypeScript)
│   ├── maps.ts          # Google Maps integration service
│   └── scoring.ts       # Route comparison and scoring service
├── utils/               # Pure utility functions (TypeScript)
│   ├── testUtils.ts     # Testing utilities
│   └── testUtils.test.ts # Utility tests
├── types/               # TypeScript type definitions
│   ├── game.ts          # Game state and logic types
│   ├── components.ts    # Component prop types
│   ├── global.d.ts      # Global type declarations (Google Maps, etc.)
│   └── index.ts         # Type exports
├── __tests__/           # Test utilities and mocks (TypeScript)
│   ├── integration/     # Integration tests
│   │   └── app.integration.test.tsx
│   └── mocks/           # Mock implementations
│       └── googleMaps.ts
├── App.tsx              # Main application component
├── App.test.tsx         # App component tests
├── main.tsx             # Application entry point
├── setupTests.ts        # Test configuration
├── vite-env.d.ts        # Vite environment types
└── **/*.test.ts*        # Component and utility tests
```

## 🔷 TypeScript Features

### Complete TypeScript Conversion
- **React Components**: All components (.tsx) with comprehensive prop typing
- **Services Layer**: Fully typed API integrations and business logic
- **Hooks**: Type-safe custom React hooks with proper generics
- **Utilities**: Pure functions with input/output type safety
- **Tests**: All test files converted to TypeScript with proper typing

### Type Safety Benefits
- **Compile-time Error Detection**: Catch errors before runtime
- **Enhanced IDE Support**: Better autocomplete, refactoring, and navigation
- **Self-documenting Code**: Types serve as inline documentation
- **Refactoring Safety**: Type checking prevents breaking changes
- **Google Maps Integration**: Comprehensive typing for complex API interactions

### Type Architecture
- **Centralized Types**: All types organized in `src/types/` directory
- **Component Props**: Strongly typed component interfaces
- **Game State**: Comprehensive game logic type definitions
- **External APIs**: Type definitions for Google Maps and other integrations
- **Test Utilities**: Type-safe testing helpers and mocks

### TypeScript Configuration
- **Strict Mode**: Enabled with comprehensive type checking
- **React Support**: Optimized for React + Vite development
- **Path Mapping**: Clean imports with absolute paths
- **Modern Features**: Latest TypeScript features enabled

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
- **services/maps.ts**: Replaced `<[^>]*>` regex with safe `removeHtmlTags()` function
- **services/scoring.ts**: Fixed complex alternation patterns in street/distance extraction
- **utils/testUtils.ts**: Added bounded quantifiers to prevent backtracking
- **components/Map.tsx**: Renamed to avoid JavaScript `Map` constructor shadowing

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
- `vitest.config.ts` - Main Vitest configuration (TypeScript)
- `setupTests.ts` - Test setup and global mocks (TypeScript)
- `__tests__/mocks/` - Mock implementations (TypeScript)

### Writing Tests

#### Component Testing
```typescript
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
```typescript
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
```typescript
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
- Test files: `ComponentName.test.tsx` (for components) or `utilityName.test.ts` (for utilities)
- Test descriptions: `should [expected behavior]`
- Test groups: Use `describe` blocks for organization

#### Test Structure
```typescript
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
```typescript
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { GameProvider } from '../contexts/GameContext'

export function renderWithProvider(
  ui: ReactElement,
  options: RenderOptions = {}
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <GameProvider>{children}</GameProvider>
    ),
    ...options
  })
}
```

#### Test Helpers
- `testUtils.ts` - Common testing utilities (TypeScript)
- Custom matchers for domain-specific assertions
- Setup and teardown helpers with proper typing

### Integration Testing

Integration tests verify component interactions:
- Located in `__tests__/integration/`
- Test complete user flows
- Verify component communication
- Test with real (non-mocked) dependencies when appropriate

### Mock Strategy

#### Google Maps Mocking
```typescript
// __tests__/mocks/googleMaps.ts
// Comprehensive TypeScript mocks for Google Maps API
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