import { validateRouteFormat, calculateBasicScore, extractStreetNames } from './testUtils'

describe('Route Utility Functions', () => {
  describe('validateRouteFormat', () => {
    test('returns true for valid route format with direction', () => {
      expect(validateRouteFormat('Go north on Main Street')).toBe(true)
      expect(validateRouteFormat('go south on Oak Avenue')).toBe(true)
      expect(validateRouteFormat('Go east on First Street')).toBe(true)
      expect(validateRouteFormat('Go west on Second Avenue')).toBe(true)
    })

    test('returns true for valid route format with turn directions', () => {
      expect(validateRouteFormat('Go left on Main Street')).toBe(true)
      expect(validateRouteFormat('Go right on Oak Avenue')).toBe(true)
      expect(validateRouteFormat('Go straight on First Street')).toBe(true)
    })

    test('returns false for invalid route format', () => {
      expect(validateRouteFormat('Walk down the street')).toBe(false)
      expect(validateRouteFormat('Turn around')).toBe(false)
      expect(validateRouteFormat('Main Street')).toBe(false)
    })

    test('returns false for empty or null inputs', () => {
      expect(validateRouteFormat('')).toBe(false)
      expect(validateRouteFormat(null)).toBe(false)
      expect(validateRouteFormat(undefined)).toBe(false)
    })

    test('returns false for non-string inputs', () => {
      expect(validateRouteFormat(123)).toBe(false)
      expect(validateRouteFormat({})).toBe(false)
      expect(validateRouteFormat([])).toBe(false)
    })

    test('is case insensitive', () => {
      expect(validateRouteFormat('GO NORTH ON MAIN STREET')).toBe(true)
      expect(validateRouteFormat('go North on main street')).toBe(true)
    })
  })

  describe('calculateBasicScore', () => {
    test('returns 100 for identical routes', () => {
      const route = 'Go north on Main Street'
      expect(calculateBasicScore(route, route)).toBe(100)
    })

    test('returns 0 for completely different routes', () => {
      const userRoute = 'Go north on Main Street'
      const correctRoute = 'Walk south through the park'
      expect(calculateBasicScore(userRoute, correctRoute)).toBe(0)
    })

    test('returns partial score for partially matching routes', () => {
      const userRoute = 'Go north on Main Street'
      const correctRoute = 'Go south on Main Street'
      const score = calculateBasicScore(userRoute, correctRoute)
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThan(100)
    })

    test('returns 0 for empty or null inputs', () => {
      expect(calculateBasicScore('', 'Go north')).toBe(0)
      expect(calculateBasicScore('Go north', '')).toBe(0)
      expect(calculateBasicScore(null, 'Go north')).toBe(0)
      expect(calculateBasicScore('Go north', null)).toBe(0)
    })

    test('handles case sensitivity correctly', () => {
      const userRoute = 'GO NORTH ON MAIN STREET'
      const correctRoute = 'go north on main street'
      expect(calculateBasicScore(userRoute, correctRoute)).toBe(100)
    })

    test('calculates score based on word matching', () => {
      const userRoute = 'Go north on Main'
      const correctRoute = 'Go south on Oak'
      // Should match 'Go' and 'on' = 2 out of 4 words = 50%
      expect(calculateBasicScore(userRoute, correctRoute)).toBe(50)
    })
  })

  describe('extractStreetNames', () => {
    test('extracts single street name from route', () => {
      const route = 'Go north on Main Street'
      expect(extractStreetNames(route)).toEqual(['Main Street'])
    })

    test('extracts multiple street names from route', () => {
      const route = 'Go north on Main Street. Turn right on Oak Avenue.'
      expect(extractStreetNames(route)).toEqual(['Main Street', 'Oak Avenue'])
    })

    test('handles "onto" as well as "on"', () => {
      const route = 'Go north on Main Street. Turn onto Oak Avenue.'
      expect(extractStreetNames(route)).toEqual(['Main Street', 'Oak Avenue'])
    })

    test('returns empty array for route without street names', () => {
      const route = 'Go north for 2 blocks'
      expect(extractStreetNames(route)).toEqual([])
    })

    test('returns empty array for empty or null inputs', () => {
      expect(extractStreetNames('')).toEqual([])
      expect(extractStreetNames(null)).toEqual([])
      expect(extractStreetNames(undefined)).toEqual([])
    })

    test('returns empty array for non-string inputs', () => {
      expect(extractStreetNames(123)).toEqual([])
      expect(extractStreetNames({})).toEqual([])
      expect(extractStreetNames([])).toEqual([])
    })

    test('handles complex street names with multiple words', () => {
      const route = 'Go north on Martin Luther King Jr Boulevard'
      expect(extractStreetNames(route)).toEqual(['Martin Luther King Jr Boulevard'])
    })

    test('handles multiple patterns in the same route', () => {
      const route = 'Go north on First Street, then turn right on Second Avenue, then left onto Third Boulevard.'
      expect(extractStreetNames(route)).toEqual(['First Street', 'Second Avenue', 'Third Boulevard'])
    })
  })
}) 