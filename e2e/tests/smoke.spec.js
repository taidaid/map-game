import { test, expect } from '@playwright/test'
import { GamePage } from '../page-objects/GamePage.js'

test.describe('Smoke Tests - Critical Functionality', () => {
  
  test('app loads and displays basic content', async ({ page }) => {
    const gamePage = new GamePage(page)
    
    // Navigate to the app
    await gamePage.goto()
    
    // Verify critical elements are present
    await expect(page.locator('h1')).toContainText('Map Game - Blind Navigator')
    await expect(page.locator('text=Hello World! 🗺️')).toBeVisible()
    await expect(page.locator('text=Coming Soon:')).toBeVisible()
    
    // Verify the page structure is correct
    await expect(page.locator('.container')).toBeVisible()
    await expect(page.locator('.features')).toBeVisible()
    
    // Verify feature list exists
    const featureItems = page.locator('ul li')
    await expect(featureItems).toHaveCount(4)
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
    
    // Verify content is still visible and properly formatted
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('.container')).toBeVisible()
    await expect(page.locator('.features')).toBeVisible()
    
    // Check that text is readable (not too small)
    const containerWidth = await page.locator('.container').boundingBox()
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
}) 