import { test, expect } from '@playwright/test'
import { GamePage } from '../page-objects/GamePage.js'

test.describe('Smoke Tests - Critical Functionality', () => {
  
  test('app loads and displays basic content', async ({ page }) => {
    const gamePage = new GamePage(page)
    
    // Navigate to the app
    await gamePage.goto()
    
    // Wait for the game to load (may be in loading state initially)
    await gamePage.waitForLoad()
    
    // Verify the page title is correct
    await expect(page).toHaveTitle('Map Game - Blind Navigator')
    
    // Verify critical elements are present
    const title = await gamePage.getTitle()
    expect(title).toContain('Map Game - Blind Navigator')
    
    // Verify the game container is visible
    await expect(page.locator('.game-container')).toBeVisible()
    
    // The game should either be in loading state or show the main interface
    const isLoading = await gamePage.isInLoadingState()
    const isGameVisible = await gamePage.isGameInterfaceVisible()
    const isError = await gamePage.isInErrorState()
    
    // Should not be in error state
    expect(isError).toBe(false)
    
    // Should be either loading or showing the game interface
    expect(isLoading || isGameVisible).toBe(true)
  })
  
  test('app has correct title and meta information', async ({ page }) => {
    await page.goto('/')
    
    // Check page title
    await expect(page).toHaveTitle('Map Game - Blind Navigator')
    
    // Check that viewport meta tag is properly set for responsive design
    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content')
    expect(viewportMeta).toContain('width=device-width')
  })
  
  test('app renders without JavaScript errors', async ({ page }) => {
    const jsErrors = []
    
    // Listen for JavaScript errors
    page.on('pageerror', error => {
      jsErrors.push(error.message)
    })
    
    // Navigate to the app
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Verify no JavaScript errors occurred
    expect(jsErrors).toHaveLength(0)
  })
  
  test('app is responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Wait for game to load
    const gamePage = new GamePage(page)
    await gamePage.waitForLoad()
    
    // Verify content is still visible and properly formatted
    const title = await gamePage.getTitle()
    expect(title).toContain('Map Game - Blind Navigator')
    
    await expect(page.locator('.game-container')).toBeVisible()
    
    // Check that container fits within mobile viewport
    const containerWidth = await page.locator('.game-container').boundingBox()
    expect(containerWidth.width).toBeLessThanOrEqual(375)
  })
  
  test('app loads within performance budget', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    await page.waitForLoadState('load')
    
    const loadTime = Date.now() - startTime
    
    // App should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })
  
  test('game interface loads correctly', async ({ page }) => {
    const gamePage = new GamePage(page)
    await gamePage.goto()
    await gamePage.waitForLoad()
    
    // Wait a bit for the game to initialize
    await page.waitForTimeout(2000)
    
    // Check if game has loaded successfully
    const hasLoaded = await gamePage.hasGameLoaded()
    const isLoading = await gamePage.isInLoadingState()
    const isError = await gamePage.isInErrorState()
    
    // Game should either be loaded or still loading (not in error state)
    expect(isError).toBe(false)
    
    // If not loading, should show the game interface
    if (!isLoading) {
      expect(hasLoaded).toBe(true)
      
      // Should show map section
      const isMapVisible = await gamePage.isMapVisible()
      expect(isMapVisible).toBe(true)
      
      // Should show progress steps
      const progressSteps = await gamePage.getProgressSteps()
      expect(progressSteps.length).toBeGreaterThan(0)
    }
  })
}) 