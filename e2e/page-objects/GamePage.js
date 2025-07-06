/**
 * Page Object Model for the Map Game main page
 * Provides reusable methods for interacting with the game interface
 */
export class GamePage {
  constructor(page) {
    this.page = page
    
    // Selectors for main game elements
    this.selectors = {
      title: 'h1', // Main title in game header
      gameContainer: '.game-container',
      gameHeader: '.game-header',
      gameContent: '.game-content',
      gameLoading: '.game-loading',
      gameError: '.game-error',
      progressSteps: '.progress-steps',
      mapSection: '.map-section',
      inputSection: '.input-section',
      resultsSection: '.results-section'
    }
    
    // Game-specific selectors
    this.gameSelectors = {
      mapContainer: '#map',
      routeInput: 'textarea[placeholder*="describe how you would walk"]',
      submitButton: 'button[type="submit"]',
      scoreDisplay: '.score-display',
      scoreNumber: '.score-number',
      scoreDescription: '.score-description h3',
      scoreBreakdown: '.score-breakdown',
      newRoundButton: 'button:has-text("New Round")',
      resetButton: 'button:has-text("Reset Game")',
      startMarker: 'img[alt="Start Point"]',
      endMarker: 'img[alt="End Point"]'
    }
    
    // Game states
    this.gameStates = {
      IDLE: 'idle',
      LOADING: 'loading', 
      MAP_LOADED: 'mapLoaded',
      ROUTE_INPUT: 'routeInput',
      CALCULATING: 'calculating',
      RESULTS: 'results',
      ERROR: 'error'
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
    // Wait for either the main game interface or loading state
    await this.page.waitForSelector(this.selectors.gameContainer)
    
    // Wait for either the main title or loading message
    try {
      await this.page.waitForSelector(this.selectors.title, { timeout: 5000 })
    } catch {
      // If no h1, might be in loading state with h2
      await this.page.waitForSelector('h2', { timeout: 5000 })
    }
  }

  /**
   * Get the page title text
   */
  async getTitle() {
    // Try h1 first, then h2 for loading states
    try {
      return await this.page.textContent(this.selectors.title)
    } catch {
      return await this.page.textContent('h2')
    }
  }

  /**
   * Check if the game is in loading state
   */
  async isInLoadingState() {
    return await this.page.isVisible(this.selectors.gameLoading)
  }

  /**
   * Check if the game is in error state
   */
  async isInErrorState() {
    return await this.page.isVisible(this.selectors.gameError)
  }

  /**
   * Check if the main game interface is visible
   */
  async isGameInterfaceVisible() {
    return await this.page.isVisible(this.selectors.gameHeader) &&
           await this.page.isVisible(this.selectors.gameContent)
  }

  /**
   * Check if the map is visible
   */
  async isMapVisible() {
    return await this.page.isVisible(this.selectors.mapSection)
  }

  /**
   * Check if the route input section is visible
   */
  async isRouteInputVisible() {
    return await this.page.isVisible(this.selectors.inputSection)
  }

  /**
   * Check if the results section is visible
   */
  async isResultsVisible() {
    return await this.page.isVisible(this.selectors.resultsSection)
  }

  /**
   * Get the current game progress step
   */
  async getCurrentStep() {
    const activeStep = await this.page.locator('.step.active').first()
    return await activeStep.textContent()
  }

  /**
   * Enter route description
   */
  async enterRoute(routeText) {
    await this.page.fill(this.gameSelectors.routeInput, routeText)
  }

  /**
   * Submit route
   */
  async submitRoute() {
    await this.page.click(this.gameSelectors.submitButton)
  }

  /**
   * Get the score number
   */
  async getScore() {
    return await this.page.textContent(this.gameSelectors.scoreNumber)
  }

  /**
   * Get the score description
   */
  async getScoreDescription() {
    return await this.page.textContent(this.gameSelectors.scoreDescription)
  }

  /**
   * Wait for map to load
   */
  async waitForMapLoad() {
    await this.page.waitForSelector(this.gameSelectors.mapContainer, { timeout: 10000 })
  }

  /**
   * Wait for route input to be available
   */
  async waitForRouteInput() {
    await this.page.waitForSelector(this.gameSelectors.routeInput, { timeout: 10000 })
  }

  /**
   * Wait for results to be displayed
   */
  async waitForResults() {
    await this.page.waitForSelector(this.selectors.resultsSection, { timeout: 15000 })
  }

  /**
   * Click new round button
   */
  async clickNewRound() {
    await this.page.click(this.gameSelectors.newRoundButton)
  }

  /**
   * Click reset game button
   */
  async clickResetGame() {
    await this.page.click(this.gameSelectors.resetButton)
  }

  /**
   * Check if the page has proper game styling applied
   */
  async hasProperStyling() {
    const gameContainer = this.page.locator(this.selectors.gameContainer)
    
    // Game container should always be visible
    const isGameContainerVisible = await gameContainer.isVisible()
    
    // Check if we're in a valid state (loading, error, or main game)
    const isLoading = await this.isInLoadingState()
    const isError = await this.isInErrorState()
    const isGameVisible = await this.isGameInterfaceVisible()
    
    // Should have game container and be in one of the valid states
    return isGameContainerVisible && (isLoading || isError || isGameVisible)
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

  /**
   * Get all visible progress steps
   */
  async getProgressSteps() {
    const steps = await this.page.locator('.step')
    return await steps.allTextContents()
  }

  /**
   * Check if game has loaded successfully (not in loading or error state)
   */
  async hasGameLoaded() {
    const isLoading = await this.isInLoadingState()
    const isError = await this.isInErrorState()
    const isGameVisible = await this.isGameInterfaceVisible()
    
    return !isLoading && !isError && isGameVisible
  }
} 