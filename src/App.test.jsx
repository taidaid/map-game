import { render, screen } from '@testing-library/react'
import App from './App'

describe('App Component', () => {
  test('renders Map Game title', () => {
    render(<App />)
    const titleElement = screen.getByText('Map Game - Blind Navigator')
    expect(titleElement).toBeInTheDocument()
  })

  test('renders Hello World message', () => {
    render(<App />)
    const helloWorldElement = screen.getByText('Hello World! 🗺️')
    expect(helloWorldElement).toBeInTheDocument()
  })

  test('renders POC description', () => {
    render(<App />)
    const descriptionElement = screen.getByText('This is the proof of concept for the Blind Navigator map game.')
    expect(descriptionElement).toBeInTheDocument()
  })

  test('renders Coming Soon section', () => {
    render(<App />)
    const comingSoonElement = screen.getByText('Coming Soon:')
    expect(comingSoonElement).toBeInTheDocument()
  })

  test('renders feature list items', () => {
    render(<App />)
    
    // Check that all feature items are present
    expect(screen.getByText('Interactive map without street names')).toBeInTheDocument()
    expect(screen.getByText('Route description interface')).toBeInTheDocument()
    expect(screen.getByText('Route comparison with Google Maps')).toBeInTheDocument()
    expect(screen.getByText('Scoring system')).toBeInTheDocument()
  })

  test('has correct structure with container div', () => {
    render(<App />)
    const container = document.querySelector('.container')
    expect(container).toBeInTheDocument()
  })

  test('has features section with proper styling', () => {
    render(<App />)
    const featuresSection = document.querySelector('.features')
    expect(featuresSection).toBeInTheDocument()
  })
}) 