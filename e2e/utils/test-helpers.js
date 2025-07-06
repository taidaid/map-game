import gameData from '../fixtures/game-data.json' with { type: 'json' }

/**
 * Utility functions for E2E tests
 */
export class TestHelpers {
  
  /**
   * Wait for network to be idle with custom timeout
   */
  static async waitForNetworkIdle(page, timeout = 5000) {
    await page.waitForLoadState('networkidle', { timeout })
  }

  /**
   * Take a screenshot with timestamp
   */
  static async takeTimestampedScreenshot(page, baseName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `${baseName}-${timestamp}.png`
    await page.screenshot({ 
      path: `playwright-report/screenshots/${filename}`,
      fullPage: true 
    })
    return filename
  }

  /**
   * Check if all expected page elements are visible
   */
  static async verifyPageElements(page) {
    const elements = gameData.pageElements
    
    // Check for game container (should always be present)
    const hasGameContainer = await page.isVisible('.game-container')
    
    // Check for title (could be h1 or h2 depending on state)
    const hasTitle = await page.isVisible(`text=${elements.title}`) ||
                    await page.isVisible('h1') || 
                    await page.isVisible('h2')
    
    return hasGameContainer && hasTitle
  }

  /**
   * Get browser and viewport info for debugging
   */
  static async getBrowserInfo(page) {
    return await page.evaluate(() => ({
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      url: window.location.href
    }))
  }

  /**
   * Wait for element to be visible with retry
   */
  static async waitForElementWithRetry(page, selector, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 })
        return true
      } catch (error) {
        if (i === maxRetries - 1) throw error
        await page.waitForTimeout(1000)
      }
    }
    return false
  }

  /**
   * Check responsive design at different viewport sizes
   */
  static async checkResponsiveDesign(page, viewports = [
    { width: 1920, height: 1080 }, // Desktop
    { width: 768, height: 1024 },  // Tablet
    { width: 375, height: 667 }    // Mobile
  ]) {
    const results = []
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.waitForTimeout(500) // Let layout settle
      
      const isContentVisible = await TestHelpers.verifyPageElements(page)
      results.push({
        viewport,
        isContentVisible,
        screenshot: await TestHelpers.takeTimestampedScreenshot(
          page, 
          `responsive-${viewport.width}x${viewport.height}`
        )
      })
    }
    
    return results
  }

  /**
   * Simulate slow network conditions
   */
  static async simulateSlowNetwork(page) {
    const client = await page.context().newCDPSession(page)
    await client.send('Network.enable')
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 50 * 1024, // 50 KB/s
      uploadThroughput: 50 * 1024,   // 50 KB/s
      latency: 2000                   // 2 seconds
    })
  }

  /**
   * Reset network conditions to normal
   */
  static async resetNetworkConditions(page) {
    const client = await page.context().newCDPSession(page)
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0
    })
  }

  /**
   * Check accessibility basics (color contrast, focus, etc.)
   */
  static async checkBasicAccessibility(page) {
    return await page.evaluate(() => {
      const results = {
        hasTitle: !!document.title,
        hasMainHeading: !!document.querySelector('h1') || !!document.querySelector('h2'),
        hasProperHeadingStructure: true,
        focusableElements: []
      }
      
      // Check heading structure - accept either h1 or h2 as main heading
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      if (headings.length > 0) {
        const firstHeading = headings[0]
        results.hasProperHeadingStructure = firstHeading.tagName === 'H1' || firstHeading.tagName === 'H2'
      }
      
      // Find focusable elements
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
      ]
      
      focusableSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        results.focusableElements.push({
          selector,
          count: elements.length
        })
      })
      
      return results
    })
  }

  /**
   * Get performance metrics
   */
  static async getPerformanceMetrics(page) {
    return await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0]
      const paint = performance.getEntriesByType('paint')
      
      return {
        loadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : null,
        domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.fetchStart : null,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || null,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || null
      }
    })
  }

  /**
   * Validate that all expected features are displayed
   */
  static async validateExpectedFeatures(page) {
    const expectedFeatures = gameData.expectedFeatures
    const results = []
    
    for (const feature of expectedFeatures) {
      const isVisible = await page.isVisible(`text=${feature}`)
      results.push({
        feature,
        isVisible
      })
    }
    
    return {
      allFeaturesVisible: results.every(r => r.isVisible),
      results
    }
  }
} 