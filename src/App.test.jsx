import { render, screen } from '@testing-library/react'
import App from './App'

describe('App Component', () => {
  test('renders Map Game title', () => {
    render(<App />)
    const titleElement = screen.getByText('Map Game - Blind Navigator')
    expect(titleElement).toBeInTheDocument()
  })

  test('renders game loading state', () => {
    render(<App />)
    const loadingElement = screen.getByText('Initializing game...')
    expect(loadingElement).toBeInTheDocument()
  })

  test('renders game container', () => {
    render(<App />)
    const container = document.querySelector('.game-container')
    expect(container).toBeInTheDocument()
  })

  test('has App wrapper with correct class', () => {
    render(<App />)
    const appWrapper = document.querySelector('.App')
    expect(appWrapper).toBeInTheDocument()
  })

  test('shows loading state when no API key provided', () => {
    render(<App />)
    
    // Should show the loading state since no API key is provided
    expect(screen.getByText('Map Game - Blind Navigator')).toBeInTheDocument()
    expect(screen.getByText('Initializing game...')).toBeInTheDocument()
  })

  test('has proper heading structure', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Map Game - Blind Navigator')
  })

  test('renders Game component', () => {
    render(<App />)
    // Check that the game-specific content is present
    const gameContainer = document.querySelector('.game-container')
    expect(gameContainer).toBeInTheDocument()
    
    const gameLoading = document.querySelector('.game-loading')
    expect(gameLoading).toBeInTheDocument()
  })
}) 