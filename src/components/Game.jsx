import { useState, useEffect } from 'react'
import { useGame } from '../hooks/useGame'
import { mapsService } from '../services/maps'
import { calculateScore, getScoreDescription, getScoreColor } from '../services/scoring'
import Map from './Map'
import RouteInput from './RouteInput'
import './Game.css'

/**
 * Game Component
 * Main game interface that orchestrates the complete game experience
 */
const Game = ({ 
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  initialStartPoint = { lat: 52.0907, lng: 5.1214 }, // Utrecht Central Station
  initialEndPoint = { lat: 52.0799, lng: 5.1265 }   // Utrecht University
}) => {
  const game = useGame()
  const [isCalculating, setIsCalculating] = useState(false)
  const [scoreResult, setScoreResult] = useState(null)

  // Initialize the game when component mounts
  useEffect(() => {
    if (apiKey) {
      game.initializeGame(initialStartPoint, initialEndPoint)
    }
  }, [apiKey, initialStartPoint, initialEndPoint, game])

  // Handle route submission
  const handleRouteSubmit = async () => {
    if (!game.canSubmitRoute()) return

    setIsCalculating(true)
    game.submitRoute()

    try {
      // Calculate Google's route
      const googleRoute = await mapsService.calculateRoute(
        game.startPoint,
        game.endPoint
      )

      // Store the Google route in game state
      game.setGoogleRouteResult(googleRoute)

      // Calculate the score
      const score = calculateScore(game.userRoute, googleRoute)
      setScoreResult(score)

      // Update game with final score
      game.setGameScore(score.score)

    } catch (error) {
      console.error('Route calculation failed:', error)
      game.handleError('Failed to calculate route. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  // Handle starting a new round
  const handleNewRound = () => {
    setScoreResult(null)
    game.startNewRound()
  }

  // Handle complete game reset
  const handleResetGame = () => {
    setScoreResult(null)
    game.resetGame()
    // Re-initialize with same points
    setTimeout(() => {
      game.initializeGame(initialStartPoint, initialEndPoint)
    }, 100)
  }

  // Handle map ready
  const handleMapReady = (mapInstance) => {
    game.startRouteInput()
  }

  // Handle map error
  const handleMapError = (error) => {
    game.handleError(`Map loading failed: ${error.message}`)
  }

  // Render loading state
  if (game.gameState === game.GAME_STATES.IDLE) {
    return (
      <div className="game-container">
        <div className="game-loading">
          <h2>Map Game - Blind Navigator</h2>
          <p>Initializing game...</p>
        </div>
      </div>
    )
  }

  // Render error state
  if (game.gameState === game.GAME_STATES.ERROR) {
    return (
      <div className="game-container">
        <div className="game-error">
          <h2>Game Error</h2>
          <p>{game.error}</p>
          <button onClick={handleResetGame} className="reset-button">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-container">
      <header className="game-header">
        <h1>Map Game - Blind Navigator</h1>
        <p>Navigate using visual landmarks without street names!</p>
      </header>

      <div className="game-content">
        {/* Game Progress Indicator */}
        <div className="game-progress">
          <div className="progress-steps">
            <div className={`step ${game.gameState === game.GAME_STATES.MAP_LOADED ? 'active' : ''}`}>
              1. Study Map
            </div>
            <div className={`step ${game.gameState === game.GAME_STATES.ROUTE_INPUT ? 'active' : ''}`}>
              2. Describe Route
            </div>
            <div className={`step ${game.gameState === game.GAME_STATES.CALCULATING ? 'active' : ''}`}>
              3. Calculating
            </div>
            <div className={`step ${game.gameState === game.GAME_STATES.RESULTS ? 'active' : ''}`}>
              4. Results
            </div>
          </div>
        </div>

        {/* Map Display */}
        <div className="map-section">
          <Map
            apiKey={apiKey}
            startPoint={game.startPoint}
            endPoint={game.endPoint}
            googleRoute={game.googleRoute}
            showRoute={game.gameState === game.GAME_STATES.RESULTS}
            onMapReady={handleMapReady}
            onError={handleMapError}
            height="500px"
          />
        </div>

        {/* Route Input Section */}
        {(game.gameState === game.GAME_STATES.ROUTE_INPUT || 
          game.gameState === game.GAME_STATES.CALCULATING) && (
          <div className="input-section">
            <RouteInput
              value={game.userRoute}
              onChange={game.updateUserRoute}
              onSubmit={handleRouteSubmit}
              disabled={isCalculating}
              error={game.error}
              placeholder="Look at the map above and describe how you would walk from the green start point (S) to the red end point (E)..."
            />
          </div>
        )}

        {/* Results Section */}
        {game.gameState === game.GAME_STATES.RESULTS && scoreResult && (
          <div className="results-section">
            <div className="score-display">
              <div className="score-main">
                <div 
                  className="score-circle"
                  style={{ 
                    background: `conic-gradient(${getScoreColor(scoreResult.score)} ${scoreResult.score * 3.6}deg, #e0e0e0 0deg)` 
                  }}
                >
                  <div className="score-inner">
                    <div className="score-number">{scoreResult.score}</div>
                    <div className="score-max">/ {scoreResult.maxScore}</div>
                  </div>
                </div>
                <div className="score-description">
                  <h3 style={{ color: getScoreColor(scoreResult.score) }}>
                    {getScoreDescription(scoreResult.score)}
                  </h3>
                </div>
              </div>

              <div className="score-breakdown">
                <h4>Score Breakdown:</h4>
                <div className="breakdown-item">
                  <span>Route Match ({Math.round(scoreResult.breakdown.routeMatch)}%)</span>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill"
                      style={{ width: `${scoreResult.breakdown.routeMatch}%` }}
                    />
                  </div>
                </div>
                <div className="breakdown-item">
                  <span>Direction Accuracy ({Math.round(scoreResult.breakdown.directionAccuracy)}%)</span>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill"
                      style={{ width: `${scoreResult.breakdown.directionAccuracy}%` }}
                    />
                  </div>
                </div>
                <div className="breakdown-item">
                  <span>Landmark Mentions ({Math.round(scoreResult.breakdown.landmarkMention)}%)</span>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill"
                      style={{ width: `${scoreResult.breakdown.landmarkMention}%` }}
                    />
                  </div>
                </div>
                <div className="breakdown-item">
                  <span>Completeness ({Math.round(scoreResult.breakdown.completeness)}%)</span>
                  <div className="breakdown-bar">
                    <div 
                      className="breakdown-fill"
                      style={{ width: `${scoreResult.breakdown.completeness}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback */}
            {scoreResult.feedback && scoreResult.feedback.length > 0 && (
              <div className="feedback-section">
                <h4>Feedback:</h4>
                <ul>
                  {scoreResult.feedback.map((feedback, index) => (
                    <li key={index}>{feedback}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Route Comparison */}
            <div className="route-comparison">
              <div className="comparison-item">
                <h4>Your Route:</h4>
                <p className="user-route">{game.userRoute}</p>
              </div>
              <div className="comparison-item">
                <h4>Google's Route:</h4>
                <div className="google-route">
                  {game.googleRoute && mapsService.getRouteSummary(game.googleRoute)?.steps.map((step, index) => (
                    <div key={index} className="route-step">
                      <span className="step-number">{index + 1}</span>
                      <span className="step-instruction">{step.instruction}</span>
                      <span className="step-distance">({step.distance})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Stats */}
            <div className="game-stats">
              <div className="stat-item">
                <span className="stat-label">Time:</span>
                <span className="stat-value">{game.getGameDuration()}s</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Attempts:</span>
                <span className="stat-value">{game.gameData.attempts}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="game-actions">
              <button 
                onClick={handleNewRound}
                className="action-button primary"
              >
                Try Again
              </button>
              <button 
                onClick={handleResetGame}
                className="action-button secondary"
              >
                New Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Game 