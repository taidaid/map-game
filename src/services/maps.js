import { Loader } from '@googlemaps/js-api-loader'

/**
 * Maps Service
 * Handles Google Maps API integration with custom styling for the game
 */
class MapsService {
  constructor() {
    this.loader = null
    this.map = null
    this.directionsService = null
    this.directionsRenderer = null
    this.isLoaded = false
  }

  /**
   * Initialize Google Maps API
   * @param {string} apiKey - Google Maps API key
   * @returns {Promise<void>}
   */
  async initialize(apiKey) {
    if (this.isLoaded) return

    this.loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry']
    })

    await this.loader.load()
    this.isLoaded = true
  }

  /**
   * Create a map instance with custom styling
   * @param {HTMLElement} element - DOM element to render the map
   * @param {Object} options - Map configuration options
   * @returns {google.maps.Map}
   */
  createMap(element, options = {}) {
    const defaultOptions = {
      zoom: 15,
      center: { lat: 52.0907, lng: 5.1214 }, // Default to Utrecht, Netherlands
      disableDefaultUI: true,
      gestureHandling: 'cooperative',
      styles: this.getCustomMapStyles(),
      ...options
    }

    this.map = new google.maps.Map(element, defaultOptions)
    return this.map
  }

  /**
   * Get custom map styles to hide street names and labels
   * @returns {Array} Google Maps style array
   */
  getCustomMapStyles() {
    return [
      {
        featureType: 'road',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'administrative',
        elementType: 'labels.text',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'landscape',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'water',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  }

  /**
   * Add a marker to the map
   * @param {Object} position - {lat, lng} coordinates
   * @param {Object} options - Marker options
   * @returns {google.maps.Marker}
   */
  addMarker(position, options = {}) {
    if (!this.map) throw new Error('Map not initialized')

    const marker = new google.maps.Marker({
      position,
      map: this.map,
      ...options
    })

    return marker
  }

  /**
   * Initialize directions service
   */
  initializeDirections() {
    if (!this.isLoaded) throw new Error('Maps API not loaded')

    this.directionsService = new google.maps.DirectionsService()
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#4285f4',
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    })

    if (this.map) {
      this.directionsRenderer.setMap(this.map)
    }
  }

  /**
   * Calculate route between two points
   * @param {Object} origin - Starting point {lat, lng}
   * @param {Object} destination - End point {lat, lng}
   * @returns {Promise<Object>} Route result
   */
  async calculateRoute(origin, destination) {
    if (!this.directionsService) {
      this.initializeDirections()
    }

    return new Promise((resolve, reject) => {
      this.directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.WALKING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        },
        (result, status) => {
          if (status === 'OK') {
            resolve(result)
          } else {
            reject(new Error(`Directions request failed: ${status}`))
          }
        }
      )
    })
  }

  /**
   * Display route on the map
   * @param {Object} route - Route result from calculateRoute
   */
  displayRoute(route) {
    if (!this.directionsRenderer) {
      this.initializeDirections()
    }

    this.directionsRenderer.setDirections(route)
  }

  /**
   * Clear route from the map
   */
  clearRoute() {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] })
    }
  }

  /**
   * Get route summary information
   * @param {Object} route - Route result from calculateRoute
   * @returns {Object} Route summary
   */
  getRouteSummary(route) {
    if (!route || !route.routes || route.routes.length === 0) {
      return null
    }

    const leg = route.routes[0].legs[0]
    return {
      distance: leg.distance.text,
      duration: leg.duration.text,
      steps: leg.steps.map(step => ({
        instruction: step.instructions.replace(/<[^>]*>/g, ''), // Remove HTML tags
        distance: step.distance.text,
        duration: step.duration.text
      }))
    }
  }
}

// Export singleton instance
export const mapsService = new MapsService()
export default mapsService 