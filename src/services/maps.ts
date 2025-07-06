import { Loader } from '@googlemaps/js-api-loader'
import type { Point, GoogleRoute, RouteSummary } from '../types'

/**
 * Maps Service
 * Handles Google Maps API integration with custom styling for the game
 */
class MapsService {
  private loader: Loader | null = null
  private map: google.maps.Map | null = null
  private directionsService: google.maps.DirectionsService | null = null
  private directionsRenderer: google.maps.DirectionsRenderer | null = null
  private isLoaded: boolean = false

  /**
   * Check if Google Maps API is loaded
   * @returns boolean
   */
  get loaded(): boolean {
    return this.isLoaded
  }

  /**
   * Initialize Google Maps API
   * @param apiKey - Google Maps API key
   * @returns Promise<void>
   */
  async initialize(apiKey: string): Promise<void> {
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
   * @param element - DOM element to render the map
   * @param options - Map configuration options
   * @returns google.maps.Map
   */
  createMap(element: HTMLElement, options: Partial<google.maps.MapOptions> = {}): google.maps.Map {
    const defaultOptions: google.maps.MapOptions = {
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
   * @returns Google Maps style array
   */
  getCustomMapStyles(): google.maps.MapTypeStyle[] {
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
   * @param position - {lat, lng} coordinates
   * @param options - Marker options
   * @returns google.maps.Marker
   */
  addMarker(position: Point, options: Partial<google.maps.MarkerOptions> = {}): google.maps.Marker {
    if (!this.map) throw new Error('Map not initialized')

    return new google.maps.Marker({
      position,
      map: this.map,
      ...options
    })
  }

  /**
   * Initialize directions service
   */
  initializeDirections(): void {
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
   * @param origin - Starting point {lat, lng}
   * @param destination - End point {lat, lng}
   * @returns Promise<GoogleRoute> Route result
   */
  async calculateRoute(origin: Point, destination: Point): Promise<GoogleRoute> {
    if (!this.directionsService) {
      this.initializeDirections()
    }

    return new Promise((resolve, reject) => {
      this.directionsService!.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.WALKING,
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false
        },
        (result: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {
          if (status === google.maps.DirectionsStatus.OK) {
            resolve(result as unknown as GoogleRoute)
          } else {
            reject(new Error(`Directions request failed: ${status}`))
          }
        }
      )
    })
  }

  /**
   * Display route on the map
   * @param route - Route result from calculateRoute
   */
  displayRoute(route: GoogleRoute): void {
    if (!this.directionsRenderer) {
      this.initializeDirections()
    }

    this.directionsRenderer!.setDirections(route as unknown as google.maps.DirectionsResult)
  }

  /**
   * Clear route from the map
   */
  clearRoute(): void {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] } as google.maps.DirectionsResult)
    }
  }

  /**
   * Safely remove HTML tags from text to prevent ReDoS
   * @param text - Text with HTML tags
   * @returns Text without HTML tags
   */
  removeHtmlTags(text: string): string {
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
   * Get route summary information
   * @param route - Route result from calculateRoute
   * @returns Route summary
   */
  getRouteSummary(route: GoogleRoute): RouteSummary | null {
    if (!route?.routes || route.routes.length === 0) {
      return null
    }

    const leg = route.routes[0]?.legs?.[0]
    if (!leg) {
      return null
    }

    return {
      distance: leg.distance.text,
      duration: leg.duration.text,
      steps: leg.steps.map((step: { instructions: string; distance: { text: string }; duration: { text: string } }) => ({
        instruction: this.removeHtmlTags(step.instructions), // Remove HTML tags safely
        distance: step.distance.text,
        duration: step.duration.text
      }))
    }
  }
}

// Export singleton instance
export const mapsService = new MapsService()
export default mapsService 