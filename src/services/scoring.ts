import type { GoogleRoute, ScoreResult, ScoreBreakdown } from '../types'

/**
 * Scoring Service
 * Handles route comparison and scoring logic for the game
 */

/**
 * Normalized route data structure
 */
interface NormalizedRoute {
  original: string
  cleaned: string
  directions: string[]
  streets: string[]
  landmarks: string[]
  distances: string[]
  wordCount: number
}

/**
 * Route step from Google Maps
 */
interface RouteStep {
  instruction: string
  distance: string
  duration: string
  direction: string
}

/**
 * Calculate a simple score based on route comparison
 * @param userRoute - User's route description
 * @param googleRoute - Google Maps route result
 * @returns Score result with details
 */
export const calculateScore = (userRoute: string, googleRoute: GoogleRoute): ScoreResult => {
  if (!userRoute || !googleRoute) {
    return {
      score: 0,
      maxScore: 100,
      breakdown: {
        routeMatch: 0,
        directionAccuracy: 0,
        landmarkMention: 0,
        completeness: 0
      },
      feedback: []
    }
  }

  const userRouteNormalized = normalizeRoute(userRoute)
  const googleSteps = extractRouteSteps(googleRoute)
  
  const breakdown: ScoreBreakdown = {
    routeMatch: calculateRouteMatch(userRouteNormalized, googleSteps),
    directionAccuracy: calculateDirectionAccuracy(userRouteNormalized, googleSteps),
    landmarkMention: calculateLandmarkScore(userRouteNormalized),
    completeness: calculateCompletenessScore(userRouteNormalized, googleSteps)
  }

  const score = Math.round(
    breakdown.routeMatch * 0.4 +
    breakdown.directionAccuracy * 0.3 +
    breakdown.landmarkMention * 0.2 +
    breakdown.completeness * 0.1
  )

  const feedback = generateFeedback(breakdown, userRouteNormalized, googleSteps)

  return {
    score,
    maxScore: 100,
    breakdown,
    feedback
  }
}

/**
 * Normalize route description for comparison
 * @param route - Raw route description
 * @returns Normalized route data
 */
const normalizeRoute = (route: string): NormalizedRoute => {
  const cleaned = route.toLowerCase().trim()
  
  // Extract directions
  const directions = extractDirections(cleaned)
  
  // Extract street names
  const streets = extractStreets(cleaned)
  
  // Extract landmarks
  const landmarks = extractLandmarks(cleaned)
  
  // Extract distance/time indicators
  const distances = extractDistances(cleaned)

  return {
    original: route,
    cleaned,
    directions,
    streets,
    landmarks,
    distances,
    wordCount: cleaned.split(/\s+/).length
  }
}

/**
 * Extract direction words from route description
 * @param route - Route description
 * @returns Array of direction words
 */
const extractDirections = (route: string): string[] => {
  const directionWords = [
    'north', 'south', 'east', 'west',
    'left', 'right', 'straight', 'forward',
    'turn', 'continue', 'head', 'go'
  ]
  
  return directionWords.filter(word => route.includes(word))
}

/**
 * Extract street names from route description
 * @param route - Route description
 * @returns Array of potential street names
 */
const extractStreets = (route: string): string[] => {
  // Look for patterns like "Main Street", "Oak Ave", etc.
  // Fixed: Use separate patterns to avoid backtracking issues
  const streetSuffixes = ['boulevard', 'street', 'avenue', 'drive', 'lane', 'road', 'way', 'blvd', 'st', 'ave', 'rd', 'dr', 'ln']
  const matches: string[] = []
  
  for (const suffix of streetSuffixes) {
    const pattern = new RegExp(`(\\w+)\\s+${suffix}\\b`, 'gi')
    const found = route.match(pattern) ?? []
    matches.push(...found)
  }
  
  return [...new Set(matches)].map(match => match.toLowerCase().trim())
}

/**
 * Extract landmarks from route description
 * @param route - Route description
 * @returns Array of potential landmarks
 */
const extractLandmarks = (route: string): string[] => {
  const landmarkWords = [
    'park', 'church', 'school', 'hospital', 'mall', 'store',
    'restaurant', 'cafe', 'bank', 'library', 'museum',
    'bridge', 'station', 'plaza', 'square', 'center'
  ]
  
  return landmarkWords.filter(word => route.includes(word))
}

/**
 * Extract distance/time indicators from route description
 * @param route - Route description
 * @returns Array of distance indicators
 */
const extractDistances = (route: string): string[] => {
  // Fixed: Use separate patterns to avoid backtracking issues
  const distanceUnits = ['kilometers', 'kilometer', 'minutes', 'minute', 'meters', 'meter', 'blocks', 'block', 'miles', 'mile', 'km', 'min', 'mi', 'm']
  const matches: string[] = []
  
  for (const unit of distanceUnits) {
    const pattern = new RegExp(`(\\d+)\\s*${unit}\\b`, 'gi')
    const found = route.match(pattern) ?? []
    matches.push(...found)
  }
  
  return [...new Set(matches)].map(match => match.toLowerCase().trim())
}

/**
 * Safely remove HTML tags from text to prevent ReDoS
 * @param text - Text with HTML tags
 * @returns Text without HTML tags
 */
const removeHtmlTags = (text: string): string => {
  if (!text || typeof text !== 'string') return ''
  
  // Use a simple approach that doesn't rely on regex backtracking
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .split('<')
    .map((part, index) => index === 0 ? part : part.substring(part.indexOf('>') + 1))
    .join('')
}

/**
 * Extract route steps from Google Maps result
 * @param googleRoute - Google Maps route result
 * @returns Array of route steps
 */
const extractRouteSteps = (googleRoute: GoogleRoute): RouteStep[] => {
  if (!googleRoute?.routes || googleRoute.routes.length === 0) {
    return []
  }

  const leg = googleRoute.routes[0]?.legs?.[0]
  if (!leg) {
    return []
  }

  return leg.steps.map(step => ({
    instruction: removeHtmlTags(step.instructions).toLowerCase(),
    distance: step.distance.text,
    duration: step.duration.text,
    direction: extractDirectionFromInstruction(step.instructions)
  }))
}

/**
 * Extract direction from Google Maps instruction
 * @param instruction - HTML instruction from Google Maps
 * @returns Direction keyword
 */
const extractDirectionFromInstruction = (instruction: string): string => {
  const cleaned = removeHtmlTags(instruction).toLowerCase()
  
  if (cleaned.includes('turn left') || cleaned.includes('left')) return 'left'
  if (cleaned.includes('turn right') || cleaned.includes('right')) return 'right'
  if (cleaned.includes('straight') || cleaned.includes('continue')) return 'straight'
  if (cleaned.includes('north')) return 'north'
  if (cleaned.includes('south')) return 'south'
  if (cleaned.includes('east')) return 'east'
  if (cleaned.includes('west')) return 'west'
  
  return 'unknown'
}

/**
 * Calculate route match score
 * @param userRoute - Normalized user route
 * @param googleSteps - Google route steps
 * @returns Route match score (0-100)
 */
const calculateRouteMatch = (userRoute: NormalizedRoute, googleSteps: RouteStep[]): number => {
  if (googleSteps.length === 0) return 0
  
  let matches = 0
  
  // Check for street name matches
  const googleStreets = googleSteps.flatMap(step => 
    extractStreets(step.instruction)
  )
  
  for (const userStreet of userRoute.streets) {
    if (googleStreets.some(gStreet => gStreet.includes(userStreet) || userStreet.includes(gStreet))) {
      matches += 1
    }
  }
  
  // Normalize score based on number of streets mentioned
  const maxPossibleMatches = Math.max(userRoute.streets.length, googleStreets.length)
  return maxPossibleMatches > 0 ? (matches / maxPossibleMatches) * 100 : 0
}

/**
 * Calculate direction accuracy score
 * @param userRoute - Normalized user route
 * @param googleSteps - Google route steps
 * @returns Direction accuracy score (0-100)
 */
const calculateDirectionAccuracy = (userRoute: NormalizedRoute, googleSteps: RouteStep[]): number => {
  if (googleSteps.length === 0) return 0
  
  let matches = 0
  const googleDirections = googleSteps.map(step => step.direction)
  
  for (const userDirection of userRoute.directions) {
    if (googleDirections.includes(userDirection)) {
      matches += 1
    }
  }
  
  const maxPossibleMatches = Math.max(userRoute.directions.length, googleDirections.length)
  return maxPossibleMatches > 0 ? (matches / maxPossibleMatches) * 100 : 0
}

/**
 * Calculate landmark mention score
 * @param userRoute - Normalized user route
 * @returns Landmark score (0-100)
 */
const calculateLandmarkScore = (userRoute: NormalizedRoute): number => {
  // Basic scoring: more landmarks mentioned = higher score
  const landmarkCount = userRoute.landmarks.length
  
  if (landmarkCount === 0) return 0
  if (landmarkCount === 1) return 40
  if (landmarkCount === 2) return 70
  if (landmarkCount >= 3) return 100
  
  return 0
}

/**
 * Calculate completeness score
 * @param userRoute - Normalized user route
 * @param _googleSteps - Google route steps (unused but kept for consistency)
 * @returns Completeness score (0-100)
 */
const calculateCompletenessScore = (userRoute: NormalizedRoute, _googleSteps: RouteStep[]): number => {
  // Score based on description length and detail
  const wordCount = userRoute.wordCount
  const hasDirections = userRoute.directions.length > 0
  const hasStreets = userRoute.streets.length > 0
  const hasLandmarks = userRoute.landmarks.length > 0
  const hasDistances = userRoute.distances.length > 0
  
  let score = 0
  
  // Word count scoring
  if (wordCount >= 50) score += 30
  else if (wordCount >= 30) score += 20
  else if (wordCount >= 15) score += 10
  
  // Detail scoring
  if (hasDirections) score += 20
  if (hasStreets) score += 20
  if (hasLandmarks) score += 20
  if (hasDistances) score += 10
  
  return Math.min(score, 100)
}

/**
 * Generate feedback based on scoring breakdown
 * @param breakdown - Score breakdown
 * @param userRoute - Normalized user route
 * @param _googleSteps - Google route steps (unused but kept for consistency)
 * @returns Array of feedback messages
 */
const generateFeedback = (breakdown: ScoreBreakdown, userRoute: NormalizedRoute, _googleSteps: RouteStep[]): string[] => {
  const feedback: string[] = []
  
  if (breakdown.routeMatch < 50) {
    feedback.push("Try to mention more specific street names or landmarks")
  }
  
  if (breakdown.directionAccuracy < 50) {
    feedback.push("Include more directional information (left, right, north, south, etc.)")
  }
  
  if (breakdown.landmarkMention < 50) {
    feedback.push("Mention notable landmarks to help with navigation")
  }
  
  if (breakdown.completeness < 50) {
    feedback.push("Provide more detailed descriptions of the route")
  }
  
  if (userRoute.wordCount < 20) {
    feedback.push("Your description is quite short - try to add more detail")
  }
  
  if (userRoute.directions.length === 0) {
    feedback.push("Include directional instructions in your route")
  }
  
  if (feedback.length === 0) {
    feedback.push("Great job! Your route description was detailed and accurate.")
  }
  
  return feedback
}

/**
 * Get score description based on score value
 * @param score - Score value (0-100)
 * @returns Score description
 */
export const getScoreDescription = (score: number): string => {
  if (score >= 90) return "Excellent Navigation!"
  if (score >= 80) return "Great Job!"
  if (score >= 70) return "Good Navigation"
  if (score >= 60) return "Not Bad"
  if (score >= 50) return "Needs Work"
  return "Keep Practicing"
}

/**
 * Get score color based on score value
 * @param score - Score value (0-100)
 * @returns CSS color value
 */
export const getScoreColor = (score: number): string => {
  if (score >= 90) return "#4CAF50"  // Green
  if (score >= 80) return "#8BC34A"  // Light Green
  if (score >= 70) return "#FFC107"  // Yellow
  if (score >= 60) return "#FF9800"  // Orange
  if (score >= 50) return "#FF5722"  // Deep Orange
  return "#F44336"  // Red
} 