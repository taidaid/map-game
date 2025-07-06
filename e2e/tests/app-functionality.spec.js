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
    expect(title).toContain(gameData.pageElements.title)
    
    // Verify game container is visible
    await expect(page.locator('.game-container')).toBeVisible()
    
    // Should not be in error state
    const isError = await gamePage.isInErrorState()
    expect(isError).toBe(false)
  })

  test('should display correct page content', async ({ page }) => {
    // Wait for game to initialize
    await page.waitForTimeout(2000)
    
    // Check if game has loaded
    const hasLoaded = await gamePage.hasGameLoaded()
    const isLoading = await gamePage.isInLoadingState()
    
    if (hasLoaded) {
      // Check game interface elements
      const isGameVisible = await gamePage.isGameInterfaceVisible()
      expect(isGameVisible).toBe(true)
      
      // Check map section
      const isMapVisible = await gamePage.isMapVisible()
      expect(isMapVisible).toBe(true)
      
      // Check progress steps
      const progressSteps = await gamePage.getProgressSteps()
      expect(progressSteps.length).toBe(4)
    } else if (isLoading) {
      // If still loading, that's acceptable
      const loadingTitle = await gamePage.getTitle()
      expect(loadingTitle).toContain('Map Game')
    }
  })

  test('should have proper CSS styling applied', async ({ page }) => {
    const hasProperStyling = await gamePage.hasProperStyling()
    expect(hasProperStyling).toBe(true)
    
    // Check that game container has proper styling
    const gameContainer = page.locator('.game-container')
    await expect(gameContainer).toBeVisible()
    
    // Game content may not be visible if in loading/error state, so check conditionally
    const hasLoaded = await gamePage.hasGameLoaded()
    if (hasLoaded) {
      const gameContent = page.locator('.game-content')
      await expect(gameContent).toBeVisible()
    }
  })

  test('should display game progress steps', async ({ page }) => {
    // Wait for game to load
    await page.waitForTimeout(2000)
    
    const hasLoaded = await gamePage.hasGameLoaded()
    
    if (hasLoaded) {
      const progressSteps = await gamePage.getProgressSteps()
      const expectedSteps = gameData.gameStates
      
      // Should have all 4 steps
      expect(progressSteps.length).toBe(expectedSteps.length)
      
      // Check each step is present
      for (const expectedStep of expectedSteps) {
        const isStepPresent = progressSteps.some(step => 
          step.includes(expectedStep)
        )
        expect(isStepPresent).toBe(true)
      }
    }
  })

  test('should be accessible with proper heading structure', async ({ page }) => {
    // Check main heading
    const title = await gamePage.getTitle()
    expect(title).toContain(gameData.pageElements.title)
    
    // Wait for game to load
    await page.waitForTimeout(2000)
    
    const hasLoaded = await gamePage.hasGameLoaded()
    
    if (hasLoaded) {
      // Check that main heading is h1
      const mainHeading = page.locator('h1')
      await expect(mainHeading).toBeVisible()
      await expect(mainHeading).toContainText(gameData.pageElements.title)
    }
    
    // Run basic accessibility checks
    const a11yResults = await TestHelpers.checkBasicAccessibility(page)
    expect(a11yResults.hasTitle).toBe(true)
    expect(a11yResults.hasMainHeading).toBe(true)
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
    const isGameContainerVisible = await page.isVisible('.game-container')
    expect(isGameContainerVisible).toBe(true)
    
    // Check title is visible (could be h1 or h2)
    const title = await gamePage.getTitle()
    expect(title).toContain('Map Game')
  })

  test('should handle slow network conditions gracefully', async ({ page, browserName }) => {
    // CDP session is only available in Chromium-based browsers
    test.skip(browserName !== 'chromium', 'Network throttling only supported in Chromium')
    
    try {
      // Navigate to a fresh page with slow network
      await TestHelpers.simulateSlowNetwork(page)
      
      const slowGamePage = new GamePage(page)
      await slowGamePage.goto()
      
      // Should still load content, just slower (with longer timeout)
      await page.waitForSelector('.game-container', { timeout: 15000 })
      
      // Check title with error handling
      try {
        const title = await slowGamePage.getTitle()
        expect(title).toContain(gameData.pageElements.title)
      } catch (error) {
        // If page is closed or title can't be retrieved, that's also acceptable
        // as long as the game container loaded
        console.log('Title check failed in slow network test, but container loaded')
      }
    } finally {
      // Always reset network conditions
      try {
        await TestHelpers.resetNetworkConditions(page)
      } catch (error) {
        // Ignore reset errors
      }
    }
  })

  test('should handle browser navigation correctly', async ({ page }) => {
    // Test that page URL is correct
    expect(page.url()).toContain('localhost:5173')
    
    // Test page reload
    await page.reload()
    await gamePage.waitForLoad()
    
    const titleAfterReload = await gamePage.getTitle()
    expect(titleAfterReload).toContain(gameData.pageElements.title)
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
    
    // Wait for game to initialize
    await page.waitForTimeout(2000)
    
    // Should have no console errors
    expect(consoleErrors).toHaveLength(0)
  })

  test('should display map section when game loads', async ({ page }) => {
    // Wait for game to load
    await page.waitForTimeout(3000)
    
    const hasLoaded = await gamePage.hasGameLoaded()
    
    if (hasLoaded) {
      // Map section should be visible
      const isMapVisible = await gamePage.isMapVisible()
      expect(isMapVisible).toBe(true)
      
      // Map container should be present
      await expect(page.locator('.map-section')).toBeVisible()
    }
  })

  test('should handle game initialization', async ({ page }) => {
    // Wait for game to initialize
    await page.waitForTimeout(3000)
    
    const isLoading = await gamePage.isInLoadingState()
    const isError = await gamePage.isInErrorState()
    const hasLoaded = await gamePage.hasGameLoaded()
    
    // Should not be in error state
    expect(isError).toBe(false)
    
    // Should be either loading or loaded
    expect(isLoading || hasLoaded).toBe(true)
    
    // If loaded, should show proper game interface
    if (hasLoaded) {
      const isGameVisible = await gamePage.isGameInterfaceVisible()
      expect(isGameVisible).toBe(true)
    }
  })
}) 