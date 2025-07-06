/**
 * Game State Types
 */
export const GAME_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  MAP_LOADED: 'mapLoaded',
  ROUTE_INPUT: 'routeInput',
  CALCULATING: 'calculating',
  RESULTS: 'results',
  ERROR: 'error'
} as const

export type GameState = typeof GAME_STATES[keyof typeof GAME_STATES]

/**
 * Coordinate/Point Types
 */
export interface Point {
  lat: number
  lng: number
}

/**
 * Game Data Types
 */
export interface GameData {
  startTime: Date | null
  endTime: Date | null
  attempts: number
}

/**
 * Game Statistics
 */
export interface GameStats {
  duration: number
  attempts: number
  score: number
  hasStarted: boolean
  hasEnded: boolean
}

/**
 * Score Breakdown
 */
export interface ScoreBreakdown {
  routeMatch: number
  directionAccuracy: number
  landmarkMention: number
  completeness: number
}

/**
 * Score Result
 */
export interface ScoreResult {
  score: number
  maxScore: number
  breakdown: ScoreBreakdown
  feedback: string[]
}

/**
 * Route Step
 */
export interface RouteStep {
  instruction: string
  distance: string
  duration?: string
}

/**
 * Route Summary
 */
export interface RouteSummary {
  distance: string
  duration: string
  steps: RouteStep[]
}

/**
 * Google Maps Route (simplified representation)
 */
export interface GoogleRoute {
  routes: Array<{
    legs: Array<{
      distance: { text: string; value: number }
      duration: { text: string; value: number }
      steps: Array<{
        instructions: string
        distance: { text: string; value: number }
        duration: { text: string; value: number }
      }>
    }>
    overview_polyline: {
      points: string
    }
  }>
}

/**
 * Game Hook Return Type
 */
export interface GameHookReturn {
  // State
  gameState: GameState
  startPoint: Point | null
  endPoint: Point | null
  userRoute: string
  googleRoute: GoogleRoute | null
  score: number
  error: string | null
  gameData: GameData
  
  // Actions
  initializeGame: (start: Point, end: Point) => void
  startRouteInput: () => void
  updateUserRoute: (route: string) => void
  submitRoute: () => void
  setGoogleRouteResult: (route: GoogleRoute) => void
  setGameScore: (score: number) => void
  handleError: (error: string) => void
  resetGame: () => void
  startNewRound: () => void
  
  // Computed values
  getGameDuration: () => number
  isGameActive: () => boolean
  canSubmitRoute: () => boolean
  getGameStats: () => GameStats
  
  // Constants
  GAME_STATES: typeof GAME_STATES
} 