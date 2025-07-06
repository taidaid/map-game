/**
 * Page Object Model for the Map Game main page
 * Provides reusable methods for interacting with the game interface
 */
export class GamePage {
  constructor(page) {
    this.page = page
    
    // Selectors for main page elements
    this.selectors = {
      title: 'h1',
      helloWorld: 'text=Hello World! 🗺️',
      description: 'text=This is the proof of concept for the Blind Navigator map game.',
      comingSoonHeading: 'text=Coming Soon:',
      featuresList: 'ul',
      container: '.container',
      featuresSection: '.features'
    }
    
    // Future selectors for when game functionality is added
    this.gameSelectors = {
      mapContainer: '[data-testid="map-container"]',
      routeInput: '[data-testid="route-input"]',
      submitButton: '[data-testid="submit-route"]',
      resultsSection: '[data-testid="results-section"]',
      scoreDisplay: '[data-testid="score-display"]',
      googleRoute: '[data-testid="google-route"]',
      startMarker: '[data-testid="start-marker"]',
      endMarker: '[data-testid="end-marker"]'
    }
  }

  /**
   * Navigate to the game homepage
   */
  async goto() {
    await this.page.goto('/')
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Wait for the page to fully load
   */
  async waitForLoad() {
    await this.page.waitForSelector(this.selectors.title)
    await this.page.waitForSelector(this.selectors.container)
  }

  /**
   * Get the page title text
   */
  async getTitle() {
    return await this.page.textContent(this.selectors.title)
  }

  /**
   * Check if the Hello World message is visible
   */
  async isHelloWorldVisible() {
    return await this.page.isVisible(this.selectors.helloWorld)
  }

  /**
   * Check if the description is visible
   */
  async isDescriptionVisible() {
    return await this.page.isVisible(this.selectors.description)
  }

  /**
   * Check if the Coming Soon section is visible
   */
  async isComingSoonVisible() {
    return await this.page.isVisible(this.selectors.comingSoonHeading)
  }

  /**
   * Get all feature list items
   */
  async getFeatureItems() {
    const listItems = await this.page.locator(`${this.selectors.featuresList} li`)
    return await listItems.allTextContents()
  }

  /**
   * Check if all expected features are displayed
   */
  async hasAllExpectedFeatures() {
    const expectedFeatures = [
      'Interactive map without street names',
      'Route description interface', 
      'Route comparison with Google Maps',
      'Scoring system'
    ]
    
    const actualFeatures = await this.getFeatureItems()
    
    return expectedFeatures.every(feature => 
      actualFeatures.some(actual => actual.includes(feature))
    )
  }

  /**
   * Check if the page has proper CSS styling applied
   */
  async hasProperStyling() {
    const container = this.page.locator(this.selectors.container)
    const featuresSection = this.page.locator(this.selectors.featuresSection)
    
    return await container.isVisible() && await featuresSection.isVisible()
  }

  /**
   * Take a screenshot of the current page state
   */
  async takeScreenshot(name = 'game-page') {
    await this.page.screenshot({ 
      path: `playwright-report/screenshots/${name}.png`,
      fullPage: true 
    })
  }

  // Future methods for when game functionality is implemented
  
  /**
   * Wait for map to load (future implementation)
   */
  async waitForMapLoad() {
    await this.page.waitForSelector(this.gameSelectors.mapContainer, { timeout: 10000 })
  }

  /**
   * Enter route description (future implementation)
   */
  async enterRoute(routeText) {
    await this.page.fill(this.gameSelectors.routeInput, routeText)
  }

  /**
   * Submit route (future implementation)
   */
  async submitRoute() {
    await this.page.click(this.gameSelectors.submitButton)
  }

  /**
   * Get score display text (future implementation)
   */
  async getScore() {
    return await this.page.textContent(this.gameSelectors.scoreDisplay)
  }

  /**
   * Check if results section is visible (future implementation)
   */
  async isResultsVisible() {
    return await this.page.isVisible(this.gameSelectors.resultsSection)
  }

  /**
   * Check if Google route is displayed (future implementation)
   */
  async isGoogleRouteVisible() {
    return await this.page.isVisible(this.gameSelectors.googleRoute)
  }
} 