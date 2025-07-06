import { useState, useCallback } from 'react'
import type { Point, GoogleRoute, GameState, GameData, GameStats, GameHookReturn } from '../types'
import { GAME_STATES } from '../types'

// Re-export game states for backward compatibility
export { GAME_STATES }

/**
 * Game hook for managing game state and flow
 * @returns Game state and actions
 */
export const useGame = (): GameHookReturn => {
  const [gameState, setGameState] = useState<GameState>(GAME_STATES.IDLE)
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [endPoint, setEndPoint] = useState<Point | null>(null)
  const [userRoute, setUserRoute] = useState<string>('')
  const [googleRoute, setGoogleRoute] = useState<GoogleRoute | null>(null)
  const [score, setScore] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [gameData, setGameData] = useState<GameData>({
    startTime: null,
    endTime: null,
    attempts: 0
  })

  /**
   * Initialize a new game with start and end points
   * @param start - Starting point {lat, lng}
   * @param end - End point {lat, lng}
   */
  const initializeGame = useCallback((start: Point, end: Point): void => {
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
  const startRouteInput = useCallback((): void => {
    setGameState(GAME_STATES.ROUTE_INPUT)
  }, [])

  /**
   * Update user's route description
   * @param route - User's route description
   */
  const updateUserRoute = useCallback((route: string): void => {
    setUserRoute(route)
  }, [])

  /**
   * Submit user's route for comparison
   */
  const submitRoute = useCallback((): void => {
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
   * @param route - Google Maps route result
   */
  const setGoogleRouteResult = useCallback((route: GoogleRoute): void => {
    setGoogleRoute(route)
  }, [])

  /**
   * Calculate and set the game score
   * @param calculatedScore - Calculated score
   */
  const setGameScore = useCallback((calculatedScore: number): void => {
    setScore(calculatedScore)
    setGameData(prev => ({
      ...prev,
      endTime: new Date()
    }))
    setGameState(GAME_STATES.RESULTS)
  }, [])

  /**
   * Handle game error
   * @param errorMessage - Error message
   */
  const handleError = useCallback((errorMessage: string): void => {
    setError(errorMessage)
    setGameState(GAME_STATES.ERROR)
  }, [])

  /**
   * Reset game to initial state
   */
  const resetGame = useCallback((): void => {
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
  const startNewRound = useCallback((): void => {
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
   * @returns Duration in seconds
   */
  const getGameDuration = useCallback((): number => {
    if (!gameData.startTime) return 0
    const endTime = gameData.endTime ?? new Date()
    return Math.floor((endTime.getTime() - gameData.startTime.getTime()) / 1000)
  }, [gameData.startTime, gameData.endTime])

  /**
   * Check if game is in progress
   * @returns True if game is active
   */
  const isGameActive = useCallback((): boolean => {
    const inactiveStates: GameState[] = [GAME_STATES.IDLE, GAME_STATES.RESULTS, GAME_STATES.ERROR]
    return !inactiveStates.includes(gameState)
  }, [gameState])

  /**
   * Check if user can submit route
   * @returns True if route can be submitted
   */
  const canSubmitRoute = useCallback((): boolean => {
    return gameState === GAME_STATES.ROUTE_INPUT && userRoute.trim().length > 0
  }, [gameState, userRoute])

  /**
   * Get formatted game stats
   * @returns Formatted game statistics
   */
  const getGameStats = useCallback((): GameStats => {
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