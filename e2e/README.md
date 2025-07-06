# End-to-End Testing with Playwright

## Overview

This directory contains end-to-end (E2E) tests for the Map Game application using Playwright. The tests verify the complete application behavior from a user's perspective across multiple browsers.

## Directory Structure

```
e2e/
├── tests/                 # Test files
│   ├── smoke.spec.js     # Quick smoke tests
│   └── app-functionality.spec.js  # Comprehensive app tests
├── page-objects/          # Page Object Model classes
│   └── GamePage.js       # Main game page interactions
├── fixtures/             # Test data
│   └── game-data.json    # Static test data
├── utils/                # Utility functions
│   └── test-helpers.js   # Common test helpers
└── README.md            # This file
```

## Available Scripts

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests with debug mode
npm run test:e2e:debug

# Run both unit and E2E tests
npm run test:all
```

## Test Categories

### Smoke Tests (`smoke.spec.js`)
- Quick verification of critical functionality
- Runs across all browsers and device types
- Focuses on basic app loading and core features

### App Functionality Tests (`app-functionality.spec.js`)
- Comprehensive testing of all current features
- Performance testing
- Accessibility testing
- Responsive design testing
- Error handling

## Browser Support

Tests run on:
- ✅ **Desktop**: Chrome, Firefox, Safari, Edge
- ✅ **Mobile**: Mobile Chrome, Mobile Safari

## Key Features

### Page Object Model
- Maintainable test code using POM pattern
- Reusable page interactions
- Clear separation of test logic and UI selectors

### Test Data Management
- Centralized test data in `fixtures/game-data.json`
- Easy to maintain and update test scenarios

### Utility Functions
- Network simulation (Chromium only)
- Performance monitoring
- Accessibility checks
- Responsive design testing

### Cross-Browser Testing
- Automatically runs on multiple browsers
- Consistent test results across platforms
- Mobile viewport testing

## Running Specific Tests

```bash
# Run only smoke tests
npx playwright test e2e/tests/smoke.spec.js

# Run on specific browser
npx playwright test --project=chromium

# Run specific test by name
npx playwright test -g "should load the application"

# Run with visual debugging
npx playwright test --headed --slowMo=1000
```

## Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

Reports include:
- Test results with screenshots
- Performance metrics
- Error logs and stack traces
- Video recordings of failures

## Adding New Tests

1. **Create test file** in `e2e/tests/`
2. **Import required modules**:
   ```javascript
   import { test, expect } from '@playwright/test'
   import { GamePage } from '../page-objects/GamePage.js'
   ```
3. **Use Page Object Model** for interactions
4. **Add test data** to `fixtures/game-data.json` if needed
5. **Follow naming conventions**: `should [expected behavior]`

## Best Practices

### Test Structure
- Use descriptive test names
- Group related tests in `describe` blocks
- Keep tests independent and isolated
- Use beforeEach for common setup

### Assertions
- Wait for elements before interacting
- Use explicit waits (`waitForSelector`)
- Verify both positive and negative cases
- Check for absence of errors

### Page Object Model
```javascript
// Good: Use page objects
const gamePage = new GamePage(page)
await gamePage.goto()
const title = await gamePage.getTitle()

// Avoid: Direct page interactions in tests
await page.goto('/')
const title = await page.textContent('h1')
```

### Test Data
```javascript
// Good: Use fixtures
import gameData from '../fixtures/game-data.json' with { type: 'json' }
expect(title).toBe(gameData.pageElements.title)

// Avoid: Hardcoded values
expect(title).toBe('Map Game - Blind Navigator')
```

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in playwright.config.js
   - Use proper wait strategies
   - Check network conditions

2. **Element not found**
   - Verify selectors are correct
   - Wait for element to be visible
   - Check if element is in viewport

3. **Flaky tests**
   - Add explicit waits
   - Use `page.waitForLoadState('networkidle')`
   - Avoid hard-coded delays

### Debug Mode
```bash
# Run with debug mode
npx playwright test --debug

# Run with browser visible
npx playwright test --headed

# Run with slow motion
npx playwright test --slowMo=1000
```

## Future Enhancements

As the application grows, consider:
- API testing with request/response validation
- Visual regression testing
- Performance benchmarking
- Integration with CI/CD pipelines
- Test parallelization optimization

## Contributing

When adding new tests:
1. Follow the existing patterns
2. Add appropriate documentation
3. Ensure tests are cross-browser compatible
4. Update fixtures if needed
5. Run full test suite before committing 