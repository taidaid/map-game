import { useState, useCallback } from 'react'

/**
 * Game states
 */
export const GAME_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  MAP_LOADED: 'mapLoaded',
  ROUTE_INPUT: 'routeInput',
  CALCULATING: 'calculating',
  RESULTS: 'results',
  ERROR: 'error'
}

/**
 * Game hook for managing game state and flow
 * @returns {Object} Game state and actions
 */
export const useGame = () => {
  const [gameState, setGameState] = useState(GAME_STATES.IDLE)
  const [startPoint, setStartPoint] = useState(null)
  const [endPoint, setEndPoint] = useState(null)
  const [userRoute, setUserRoute] = useState('')
  const [googleRoute, setGoogleRoute] = useState(null)
  const [score, setScore] = useState(0)
  const [error, setError] = useState(null)
  const [gameData, setGameData] = useState({
    startTime: null,
    endTime: null,
    attempts: 0
  })

  /**
   * Initialize a new game with start and end points
   * @param {Object} start - Starting point {lat, lng}
   * @param {Object} end - End point {lat, lng}
   */
  const initializeGame = useCallback((start, end) => {
    setStartPoint(start)
    setEndPoint(end)
    setUserRoute('')
    setGoogleRoute(null)
    setScore(0)
    setError(null)
    setGameData({
      startTime: new Date(),
      endTime: null,
      attempts: 0
    })
    setGameState(GAME_STATES.MAP_LOADED)
  }, [])

  /**
   * Start route input phase
   */
  const startRouteInput = useCallback(() => {
    setGameState(GAME_STATES.ROUTE_INPUT)
  }, [])

  /**
   * Update user's route description
   * @param {string} route - User's route description
   */
  const updateUserRoute = useCallback((route) => {
    setUserRoute(route)
  }, [])

  /**
   * Submit user's route for comparison
   */
  const submitRoute = useCallback(() => {
    if (!userRoute.trim()) {
      setError('Please enter a route description')
      return
    }

    setGameState(GAME_STATES.CALCULATING)
    setGameData(prev => ({
      ...prev,
      attempts: prev.attempts + 1
    }))
  }, [userRoute])

  /**
   * Set Google's calculated route
   * @param {Object} route - Google Maps route result
   */
  const setGoogleRouteResult = useCallback((route) => {
    setGoogleRoute(route)
  }, [])

  /**
   * Calculate and set the game score
   * @param {number} calculatedScore - Calculated score
   */
  const setGameScore = useCallback((calculatedScore) => {
    setScore(calculatedScore)
    setGameData(prev => ({
      ...prev,
      endTime: new Date()
    }))
    setGameState(GAME_STATES.RESULTS)
  }, [])

  /**
   * Handle game error
   * @param {string} errorMessage - Error message
   */
  const handleError = useCallback((errorMessage) => {
    setError(errorMessage)
    setGameState(GAME_STATES.ERROR)
  }, [])

  /**
   * Reset game to initial state
   */
  const resetGame = useCallback(() => {
    setGameState(GAME_STATES.IDLE)
    setStartPoint(null)
    setEndPoint(null)
    setUserRoute('')
    setGoogleRoute(null)
    setScore(0)
    setError(null)
    setGameData({
      startTime: null,
      endTime: null,
      attempts: 0
    })
  }, [])

  /**
   * Start a new game round
   */
  const startNewRound = useCallback(() => {
    // Keep the same points but reset other state
    setUserRoute('')
    setGoogleRoute(null)
    setScore(0)
    setError(null)
    setGameData({
      startTime: new Date(),
      endTime: null,
      attempts: 0
    })
    setGameState(GAME_STATES.MAP_LOADED)
  }, [])

  /**
   * Get game duration in seconds
   * @returns {number} Duration in seconds
   */
  const getGameDuration = useCallback(() => {
    if (!gameData.startTime) return 0
    const endTime = gameData.endTime || new Date()
    return Math.floor((endTime - gameData.startTime) / 1000)
  }, [gameData.startTime, gameData.endTime])

  /**
   * Check if game is in progress
   * @returns {boolean} True if game is active
   */
  const isGameActive = useCallback(() => {
    return ![GAME_STATES.IDLE, GAME_STATES.RESULTS, GAME_STATES.ERROR].includes(gameState)
  }, [gameState])

  /**
   * Check if user can submit route
   * @returns {boolean} True if route can be submitted
   */
  const canSubmitRoute = useCallback(() => {
    return gameState === GAME_STATES.ROUTE_INPUT && userRoute.trim().length > 0
  }, [gameState, userRoute])

  /**
   * Get formatted game stats
   * @returns {Object} Formatted game statistics
   */
  const getGameStats = useCallback(() => {
    return {
      duration: getGameDuration(),
      attempts: gameData.attempts,
      score: score,
      hasStarted: gameData.startTime !== null,
      hasEnded: gameData.endTime !== null
    }
  }, [getGameDuration, gameData.attempts, gameData.startTime, gameData.endTime, score])

  return {
    // State
    gameState,
    startPoint,
    endPoint,
    userRoute,
    googleRoute,
    score,
    error,
    gameData,
    
    // Actions
    initializeGame,
    startRouteInput,
    updateUserRoute,
    submitRoute,
    setGoogleRouteResult,
    setGameScore,
    handleError,
    resetGame,
    startNewRound,
    
    // Computed values
    getGameDuration,
    isGameActive,
    canSubmitRoute,
    getGameStats,
    
    // Constants
    GAME_STATES
  }
} 