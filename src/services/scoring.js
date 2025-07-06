/**
 * Scoring Service
 * Handles route comparison and scoring logic for the game
 */

/**
 * Calculate a simple score based on route comparison
 * @param {string} userRoute - User's route description
 * @param {Object} googleRoute - Google Maps route result
 * @returns {Object} Score result with details
 */
export const calculateScore = (userRoute, googleRoute) => {
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
  
  const breakdown = {
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
 * @param {string} route - Raw route description
 * @returns {Object} Normalized route data
 */
const normalizeRoute = (route) => {
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
 * @param {string} route - Route description
 * @returns {Array} Array of direction words
 */
const extractDirections = (route) => {
  const directionWords = [
    'north', 'south', 'east', 'west',
    'left', 'right', 'straight', 'forward',
    'turn', 'continue', 'head', 'go'
  ]
  
  return directionWords.filter(word => route.includes(word))
}

/**
 * Extract street names from route description
 * @param {string} route - Route description
 * @returns {Array} Array of potential street names
 */
const extractStreets = (route) => {
  // Look for patterns like "Main Street", "Oak Ave", etc.
  const streetPattern = /(\w+)\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|blvd|boulevard)/gi
  const matches = route.match(streetPattern) || []
  
  return matches.map(match => match.toLowerCase().trim())
}

/**
 * Extract landmarks from route description
 * @param {string} route - Route description
 * @returns {Array} Array of potential landmarks
 */
const extractLandmarks = (route) => {
  const landmarkWords = [
    'park', 'church', 'school', 'hospital', 'mall', 'store',
    'restaurant', 'cafe', 'bank', 'library', 'museum',
    'bridge', 'station', 'plaza', 'square', 'center'
  ]
  
  return landmarkWords.filter(word => route.includes(word))
}

/**
 * Extract distance/time indicators from route description
 * @param {string} route - Route description
 * @returns {Array} Array of distance indicators
 */
const extractDistances = (route) => {
  const distancePattern = /(\d+)\s*(meters?|m|kilometers?|km|miles?|mi|blocks?|minutes?|min)/gi
  const matches = route.match(distancePattern) || []
  
  return matches.map(match => match.toLowerCase().trim())
}

/**
 * Extract route steps from Google Maps result
 * @param {Object} googleRoute - Google Maps route result
 * @returns {Array} Array of route steps
 */
const extractRouteSteps = (googleRoute) => {
  if (!googleRoute || !googleRoute.routes || googleRoute.routes.length === 0) {
    return []
  }

  const leg = googleRoute.routes[0].legs[0]
  return leg.steps.map(step => ({
    instruction: step.instructions.replace(/<[^>]*>/g, '').toLowerCase(),
    distance: step.distance.text,
    duration: step.duration.text,
    direction: extractDirectionFromInstruction(step.instructions)
  }))
}

/**
 * Extract direction from Google Maps instruction
 * @param {string} instruction - HTML instruction from Google Maps
 * @returns {string} Direction keyword
 */
const extractDirectionFromInstruction = (instruction) => {
  const cleaned = instruction.replace(/<[^>]*>/g, '').toLowerCase()
  
  if (cleaned.includes('turn left') || cleaned.includes('left')) return 'left'
  if (cleaned.includes('turn right') || cleaned.includes('right')) return 'right'
  if (cleaned.includes('straight') || cleaned.includes('continue')) return 'straight'
  if (cleaned.includes('head north') || cleaned.includes('north')) return 'north'
  if (cleaned.includes('head south') || cleaned.includes('south')) return 'south'
  if (cleaned.includes('head east') || cleaned.includes('east')) return 'east'
  if (cleaned.includes('head west') || cleaned.includes('west')) return 'west'
  
  return 'unknown'
}

/**
 * Calculate route match score
 * @param {Object} userRoute - Normalized user route
 * @param {Array} googleSteps - Google route steps
 * @returns {number} Score 0-100
 */
const calculateRouteMatch = (userRoute, googleSteps) => {
  if (googleSteps.length === 0) return 0
  
  // Simple matching based on direction keywords
  const userDirections = userRoute.directions
  const googleDirections = googleSteps.map(step => step.direction)
  
  let matches = 0
  userDirections.forEach(direction => {
    if (googleDirections.includes(direction)) {
      matches++
    }
  })
  
  return Math.min(100, (matches / Math.max(userDirections.length, 1)) * 100)
}

/**
 * Calculate direction accuracy score
 * @param {Object} userRoute - Normalized user route
 * @param {Array} googleSteps - Google route steps
 * @returns {number} Score 0-100
 */
const calculateDirectionAccuracy = (userRoute, googleSteps) => {
  const userDirections = userRoute.directions
  const googleDirections = googleSteps.map(step => step.direction)
  
  if (userDirections.length === 0) return 0
  
  // Check if user mentions the right number of turns
  const userTurns = userDirections.filter(d => ['left', 'right'].includes(d)).length
  const googleTurns = googleDirections.filter(d => ['left', 'right'].includes(d)).length
  
  const turnAccuracy = Math.abs(userTurns - googleTurns) <= 1 ? 100 : 50
  
  return turnAccuracy
}

/**
 * Calculate landmark mention score
 * @param {Object} userRoute - Normalized user route
 * @returns {number} Score 0-100
 */
const calculateLandmarkScore = (userRoute) => {
  const landmarkCount = userRoute.landmarks.length
  const streetCount = userRoute.streets.length
  
  // Give points for mentioning landmarks and streets
  const landmarkPoints = Math.min(50, landmarkCount * 25)
  const streetPoints = Math.min(50, streetCount * 15)
  
  return landmarkPoints + streetPoints
}

/**
 * Calculate completeness score
 * @param {Object} userRoute - Normalized user route
 * @param {Array} googleSteps - Google route steps
 * @returns {number} Score 0-100
 */
const calculateCompletenessScore = (userRoute, googleSteps) => {
  const wordCount = userRoute.wordCount
  const stepCount = googleSteps.length
  
  // Ideal range: 3-5 words per step
  const idealWords = stepCount * 4
  const wordDifference = Math.abs(wordCount - idealWords)
  
  // Score based on how close to ideal word count
  const completenessScore = Math.max(0, 100 - (wordDifference * 5))
  
  return Math.min(100, completenessScore)
}

/**
 * Generate feedback for the user
 * @param {Object} breakdown - Score breakdown
 * @param {Object} userRoute - Normalized user route
 * @param {Array} googleSteps - Google route steps
 * @returns {Array} Array of feedback messages
 */
const generateFeedback = (breakdown, userRoute, googleSteps) => {
  const feedback = []
  
  // Route match feedback
  if (breakdown.routeMatch < 50) {
    feedback.push("Try to include more specific directions like 'turn left' or 'head north'")
  } else if (breakdown.routeMatch >= 80) {
    feedback.push("Great job following the correct directions!")
  }
  
  // Direction accuracy feedback
  if (breakdown.directionAccuracy < 50) {
    feedback.push("Check your turns - you might have missed some or added extra ones")
  }
  
  // Landmark feedback
  if (breakdown.landmarkMention < 30) {
    feedback.push("Consider mentioning street names or landmarks to improve your score")
  } else if (breakdown.landmarkMention >= 70) {
    feedback.push("Excellent use of landmarks and street names!")
  }
  
  // Completeness feedback
  if (breakdown.completeness < 40) {
    if (userRoute.wordCount < 20) {
      feedback.push("Your route description could be more detailed")
    } else {
      feedback.push("Your route description might be too lengthy - try to be more concise")
    }
  }
  
  return feedback
}

/**
 * Get score description based on score value
 * @param {number} score - Score value 0-100
 * @returns {string} Score description
 */
export const getScoreDescription = (score) => {
  if (score >= 90) return "Excellent Navigator!"
  if (score >= 80) return "Great Job!"
  if (score >= 70) return "Good Navigation"
  if (score >= 60) return "Not Bad"
  if (score >= 50) return "Keep Trying"
  return "Need More Practice"
}

/**
 * Get score color based on score value
 * @param {number} score - Score value 0-100
 * @returns {string} CSS color
 */
export const getScoreColor = (score) => {
  if (score >= 80) return "#4CAF50" // Green
  if (score >= 60) return "#FF9800" // Orange
  return "#F44336" // Red
} 