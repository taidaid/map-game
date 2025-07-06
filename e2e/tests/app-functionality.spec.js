import { test, expect } from '@playwright/test'
import { GamePage } from '../page-objects/GamePage.js'
import { TestHelpers } from '../utils/test-helpers.js'
import gameData from '../fixtures/game-data.json' with { type: 'json' }

test.describe('Map Game - App Functionality', () => {
  let gamePage

  test.beforeEach(async ({ page }) => {
    gamePage = new GamePage(page)
    await gamePage.goto()
    await gamePage.waitForLoad()
  })

  test('should load the application successfully', async ({ page }) => {
    // Verify page loads without errors
    await expect(page).toHaveTitle(/Map Game/i)
    
    // Check that main elements are visible
    const title = await gamePage.getTitle()
    expect(title).toBe(gameData.pageElements.title)
    
    // Verify Hello World message
    const isHelloWorldVisible = await gamePage.isHelloWorldVisible()
    expect(isHelloWorldVisible).toBe(true)
  })

  test('should display correct page content', async ({ page }) => {
    // Check description
    const isDescriptionVisible = await gamePage.isDescriptionVisible()
    expect(isDescriptionVisible).toBe(true)
    
    // Check Coming Soon section
    const isComingSoonVisible = await gamePage.isComingSoonVisible()
    expect(isComingSoonVisible).toBe(true)
    
    // Verify all expected features are displayed
    const hasAllFeatures = await gamePage.hasAllExpectedFeatures()
    expect(hasAllFeatures).toBe(true)
  })

  test('should have proper CSS styling applied', async ({ page }) => {
    const hasProperStyling = await gamePage.hasProperStyling()
    expect(hasProperStyling).toBe(true)
    
    // Check that container has correct styling
    const container = page.locator('.container')
    await expect(container).toHaveCSS('max-width', '800px')
    
    // Check features section styling
    const featuresSection = page.locator('.features')
    await expect(featuresSection).toBeVisible()
  })

  test('should display all expected feature items', async ({ page }) => {
    const featureItems = await gamePage.getFeatureItems()
    const expectedFeatures = gameData.expectedFeatures
    
    // Verify we have the correct number of features
    expect(featureItems.length).toBe(expectedFeatures.length)
    
    // Verify each expected feature is present
    for (const expectedFeature of expectedFeatures) {
      const isFeaturePresent = featureItems.some(item => 
        item.includes(expectedFeature)
      )
      expect(isFeaturePresent).toBe(true)
    }
  })

  test('should be accessible with proper heading structure', async ({ page }) => {
    // Check main heading
    const mainHeading = page.locator('h1')
    await expect(mainHeading).toBeVisible()
    await expect(mainHeading).toHaveText(gameData.pageElements.title)
    
    // Check subheading
    const subHeading = page.locator('h3')
    await expect(subHeading).toBeVisible()
    await expect(subHeading).toHaveText(gameData.pageElements.comingSoonText)
    
    // Run basic accessibility checks
    const a11yResults = await TestHelpers.checkBasicAccessibility(page)
    expect(a11yResults.hasTitle).toBe(true)
    expect(a11yResults.hasMainHeading).toBe(true)
    expect(a11yResults.hasProperHeadingStructure).toBe(true)
  })

  test('should have good performance metrics', async ({ page }) => {
    const metrics = await TestHelpers.getPerformanceMetrics(page)
    
    // Page should load within reasonable time (5 seconds)
    expect(metrics.loadTime).toBeLessThan(5000)
    
    // DOM content should be loaded quickly (3 seconds)
    expect(metrics.domContentLoaded).toBeLessThan(3000)
    
    // First paint should happen quickly (2 seconds)
    if (metrics.firstPaint) {
      expect(metrics.firstPaint).toBeLessThan(2000)
    }
  })

  test('should work correctly on different screen sizes', async ({ page }) => {
    const responsiveResults = await TestHelpers.checkResponsiveDesign(page)
    
    // All viewport sizes should display content correctly
    for (const result of responsiveResults) {
      expect(result.isContentVisible).toBe(true)
    }
    
    // Test specific mobile viewport manually
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)
    
    // Verify content is still visible on mobile
    const isTitleVisible = await page.isVisible('h1')
    const isFeaturesVisible = await page.isVisible('.features')
    
    expect(isTitleVisible).toBe(true)
    expect(isFeaturesVisible).toBe(true)
  })

  test('should handle slow network conditions gracefully', async ({ page, browserName }) => {
    // CDP session is only available in Chromium-based browsers
    test.skip(browserName !== 'chromium', 'Network throttling only supported in Chromium')
    
    // Navigate to a fresh page with slow network
    await TestHelpers.simulateSlowNetwork(page)
    
    const slowGamePage = new GamePage(page)
    await slowGamePage.goto()
    
    // Should still load content, just slower
    await slowGamePage.waitForLoad()
    const title = await slowGamePage.getTitle()
    expect(title).toBe(gameData.pageElements.title)
    
    // Reset network conditions
    await TestHelpers.resetNetworkConditions(page)
  })

  test('should handle browser navigation correctly', async ({ page }) => {
    // Test that page URL is correct
    expect(page.url()).toContain('localhost:5173')
    
    // Test page reload
    await page.reload()
    await gamePage.waitForLoad()
    
    const titleAfterReload = await gamePage.getTitle()
    expect(titleAfterReload).toBe(gameData.pageElements.title)
  })

  test('should not have console errors', async ({ page }) => {
    const consoleErrors = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    // Reload page to capture any console errors
    await page.reload()
    await gamePage.waitForLoad()
    
    // Should have no console errors
    expect(consoleErrors).toHaveLength(0)
  })
}) 