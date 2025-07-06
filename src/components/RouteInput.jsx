import { useState } from 'react'
import './RouteInput.css'

/**
 * RouteInput Component
 * Provides a text input interface for users to describe their route
 */
const RouteInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  disabled = false,
  error = null,
  placeholder = "Describe your route from start to finish..."
}) => {
  const [showHelp, setShowHelp] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const handleInputChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Update word count
    const words = newValue.trim().split(/\s+/)
    setWordCount(newValue.trim() === '' ? 0 : words.length)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim() && !disabled) {
      onSubmit()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e)
    }
  }

  const getWordCountColor = () => {
    if (wordCount < 10) return '#f44336' // Red - too short
    if (wordCount > 100) return '#ff9800' // Orange - getting long
    return '#4caf50' // Green - good range
  }

  return (
    <div className="route-input">
      <div className="route-input-header">
        <h3>Describe Your Route</h3>
        <button 
          type="button"
          className="help-button"
          onClick={() => setShowHelp(!showHelp)}
          aria-label="Toggle help"
        >
          ?
        </button>
      </div>

      {showHelp && (
        <div className="help-panel">
          <h4>How to describe your route:</h4>
          <ul>
            <li><strong>Start simple:</strong> "Go north on Main Street"</li>
            <li><strong>Include turns:</strong> "Turn left at the intersection"</li>
            <li><strong>Mention landmarks:</strong> "Pass the church on your right"</li>
            <li><strong>Be specific:</strong> "Continue for 2 blocks"</li>
            <li><strong>End clearly:</strong> "Destination is on your left"</li>
          </ul>
          <div className="help-examples">
            <p><strong>Good example:</strong></p>
            <p>"Head north on Main Street for 3 blocks. Turn right at Oak Avenue. Continue past the park until you reach the library."</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="route-input-form">
        <div className="input-container">
          <textarea
            value={value}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={4}
            className={`route-textarea ${error ? 'error' : ''}`}
            aria-describedby={error ? 'route-error' : undefined}
          />
          
          <div className="input-footer">
            <div className="word-count" style={{ color: getWordCountColor() }}>
              {wordCount} words
              {wordCount < 10 && <span className="word-hint"> (aim for 10-50 words)</span>}
              {wordCount > 100 && <span className="word-hint"> (try to be more concise)</span>}
            </div>
            
            <button
              type="submit"
              disabled={disabled || !value.trim()}
              className="submit-button"
            >
              {disabled ? 'Processing...' : 'Submit Route'}
            </button>
          </div>
        </div>

        {error && (
          <div id="route-error" className="error-message" role="alert">
            {error}
          </div>
        )}
      </form>

      <div className="route-tips">
        <p><strong>Tips for better scores:</strong></p>
        <ul>
          <li>Use directional words (north, south, left, right)</li>
          <li>Mention street names when possible</li>
          <li>Include landmarks and notable buildings</li>
          <li>Be clear about turns and intersections</li>
          <li>Keep it concise but complete</li>
        </ul>
      </div>
    </div>
  )
}

export default RouteInput 