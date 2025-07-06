// Simple utility functions for testing demonstration
// These will be expanded as we build out the game features

/**
 * Validates if a route description follows the expected format
 * @param route - The route description to validate
 * @returns True if the route format is valid
 */
export const validateRouteFormat = (route: string): boolean => {
  if (!route || typeof route !== 'string') {
    return false
  }
  
  // Basic validation: should contain direction and street name
  const basicPattern = /go\s+(north|south|east|west|left|right|straight)/i
  return basicPattern.test(route)
}

/**
 * Calculates basic similarity score between two route descriptions
 * @param userRoute - User provided route description
 * @param correctRoute - Correct route description
 * @returns Similarity score between 0-100
 */
export const calculateBasicScore = (userRoute: string, correctRoute: string): number => {
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
 * @param route - Route description
 * @returns Array of street names found
 */
export const extractStreetNames = (route: string): string[] => {
  if (!route || typeof route !== 'string') {
    return []
  }
  
  // Fixed: Use a more specific pattern to avoid backtracking issues
  const streetPattern = /(?:on|onto)\s+([\w ]{1,50})(?:\.|,|$|turn)/gi
  const matches: string[] = []
  let match: RegExpExecArray | null
  
  while ((match = streetPattern.exec(route)) !== null) {
    if (match[1]) {
      matches.push(match[1].trim())
    }
  }
  
  return matches
} 