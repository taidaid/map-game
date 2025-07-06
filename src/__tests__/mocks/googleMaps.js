// Mock Google Maps API for testing
// This mock will be used to simulate Google Maps functionality in tests

export const mockGoogleMaps = {
  maps: {
    Map: vi.fn().mockImplementation(() => ({
      setCenter: vi.fn(),
      setZoom: vi.fn(),
      addListener: vi.fn(),
      getCenter: vi.fn(),
      getZoom: vi.fn(),
    })),
    
    Marker: vi.fn().mockImplementation(() => ({
      setMap: vi.fn(),
      setPosition: vi.fn(),
      setTitle: vi.fn(),
      getPosition: vi.fn(),
    })),
    
    DirectionsService: vi.fn().mockImplementation(() => ({
      route: vi.fn().mockImplementation((request, callback) => {
        // Mock successful route response
        const mockResponse = {
          routes: [{
            legs: [{
              distance: { text: '1.2 km', value: 1200 },
              duration: { text: '5 mins', value: 300 },
              steps: [
                {
                  instructions: 'Go north on Main Street',
                  distance: { text: '0.5 km', value: 500 },
                  duration: { text: '2 mins', value: 120 }
                },
                {
                  instructions: 'Turn right on Oak Avenue',
                  distance: { text: '0.7 km', value: 700 },
                  duration: { text: '3 mins', value: 180 }
                }
              ]
            }]
          }]
        }
        callback(mockResponse, 'OK')
      })
    })),
    
    DirectionsRenderer: vi.fn().mockImplementation(() => ({
      setMap: vi.fn(),
      setDirections: vi.fn(),
      setRouteIndex: vi.fn(),
    })),
    
    DirectionsStatus: {
      OK: 'OK',
      NOT_FOUND: 'NOT_FOUND',
      ZERO_RESULTS: 'ZERO_RESULTS',
      MAX_WAYPOINTS_EXCEEDED: 'MAX_WAYPOINTS_EXCEEDED',
      INVALID_REQUEST: 'INVALID_REQUEST',
      OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
      REQUEST_DENIED: 'REQUEST_DENIED',
      UNKNOWN_ERROR: 'UNKNOWN_ERROR'
    },
    
    TravelMode: {
      DRIVING: 'DRIVING',
      WALKING: 'WALKING',
      BICYCLING: 'BICYCLING',
      TRANSIT: 'TRANSIT'
    },
    
    MapTypeId: {
      ROADMAP: 'roadmap',
      SATELLITE: 'satellite',
      HYBRID: 'hybrid',
      TERRAIN: 'terrain'
    },
    
    LatLng: vi.fn().mockImplementation((lat, lng) => ({
      lat: () => lat,
      lng: () => lng,
      equals: vi.fn(),
      toString: vi.fn()
    })),
    
    event: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
      trigger: vi.fn()
    }
  }
}

// Setup global mock for Google Maps API
export const setupGoogleMapsMock = () => {
  global.google = mockGoogleMaps
  global.window.google = mockGoogleMaps
}

// Reset all mocks
export const resetGoogleMapsMocks = () => {
  vi.clearAllMocks()
}

// Mock specific API responses
export const mockApiResponses = {
  successfulRoute: {
    routes: [{
      legs: [{
        distance: { text: '1.2 km', value: 1200 },
        duration: { text: '5 mins', value: 300 },
        steps: [
          {
            instructions: 'Go north on Main Street',
            distance: { text: '0.5 km', value: 500 },
            duration: { text: '2 mins', value: 120 }
          }
        ]
      }]
    }]
  },
  
  noRouteFound: {
    routes: []
  },
  
  error: null
} 