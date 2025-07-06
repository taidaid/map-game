// Simple utility functions for testing demonstration
// These will be expanded as we build out the game features

/**
 * Validates if a route description follows the expected format
 * @param {string} route - The route description to validate
 * @returns {boolean} - True if the route format is valid
 */
export const validateRouteFormat = (route) => {
  if (!route || typeof route !== 'string') {
    return false
  }
  
  // Basic validation: should contain direction and street name
  const basicPattern = /go\s+(north|south|east|west|left|right|straight)/i
  return basicPattern.test(route)
}

/**
 * Calculates basic similarity score between two route descriptions
 * @param {string} userRoute - User provided route description
 * @param {string} correctRoute - Correct route description
 * @returns {number} - Similarity score between 0-100
 */
export const calculateBasicScore = (userRoute, correctRoute) => {
  if (!userRoute || !correctRoute) {
    return 0
  }
  
  const userWords = userRoute.toLowerCase().split(' ')
  const correctWords = correctRoute.toLowerCase().split(' ')
  
  let matchingWords = 0
  userWords.forEach(word => {
    if (correctWords.includes(word)) {
      matchingWords++
    }
  })
  
  return Math.round((matchingWords / correctWords.length) * 100)
}

/**
 * Extracts street names from route description
 * @param {string} route - Route description
 * @returns {string[]} - Array of street names found
 */
export const extractStreetNames = (route) => {
  if (!route || typeof route !== 'string') {
    return []
  }
  
  // Simple pattern to find "on [street name]" or "onto [street name]"
  const streetPattern = /(?:on|onto)\s+([a-zA-Z\s]+?)(?:\.|,|$|turn)/gi
  const matches = []
  let match
  
  while ((match = streetPattern.exec(route)) !== null) {
    matches.push(match[1].trim())
  }
  
  return matches
} 