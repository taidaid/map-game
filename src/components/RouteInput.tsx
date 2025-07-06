import React, { useState } from 'react'
import type { RouteInputProps } from '../types'
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
  placeholder = "Describe your route from start to finish...",
  maxLength
}: RouteInputProps) => {
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [wordCount, setWordCount] = useState<number>(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Update word count
    const words = newValue.trim().split(/\s+/)
    setWordCount(newValue.trim() === '' ? 0 : words.length)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (value.trim() && !disabled) {
      onSubmit()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const getWordCountColor = (): string => {
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
            <li><strong>Start simple:</strong> &quot;Go north on Main Street&quot;</li>
            <li><strong>Include turns:</strong> &quot;Turn left at the intersection&quot;</li>
            <li><strong>Mention landmarks:</strong> &quot;Pass the church on your right&quot;</li>
            <li><strong>Be specific:</strong> &quot;Continue for 2 blocks&quot;</li>
            <li><strong>End clearly:</strong> &quot;Destination is on your left&quot;</li>
          </ul>
          <div className="help-examples">
            <p><strong>Good example:</strong></p>
            <p>&quot;Head north on Main Street for 3 blocks. Turn right at Oak Avenue. Continue past the park until you reach the library.&quot;</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="route-input-form">
        <div className="input-container">
          <textarea
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={4}
            maxLength={maxLength}
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