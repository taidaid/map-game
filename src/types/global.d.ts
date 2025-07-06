/**
 * Global type definitions for external dependencies
 */

/**
 * Google Maps API Types
 * Simplified types for the Google Maps API objects we use
 */
declare global {
  namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options?: MapOptions)
      fitBounds(bounds: LatLngBounds): void
    }

    class Marker {
      constructor(options?: MarkerOptions)
      setMap(map: Map | null): void
    }

    class Size {
      constructor(width: number, height: number)
      width: number
      height: number
    }

    class Point {
      constructor(x: number, y: number)
      x: number
      y: number
    }

    class LatLngBounds {
      constructor()
      extend(point: { lat: number; lng: number }): void
    }

    class DirectionsService {
      route(
        request: DirectionsRequest,
        callback: (result: DirectionsResult, status: DirectionsStatus) => void
      ): void
    }

    class DirectionsRenderer {
      constructor(options?: DirectionsRendererOptions)
      setMap(map: Map | null): void
      setDirections(directions: DirectionsResult): void
    }

    interface MapOptions {
      center?: { lat: number; lng: number }
      zoom?: number
      mapTypeId?: string
      styles?: MapTypeStyle[]
      disableDefaultUI?: boolean
      zoomControl?: boolean
      scrollwheel?: boolean
      gestureHandling?: string
      [key: string]: unknown
    }

    interface MarkerOptions {
      position?: { lat: number; lng: number }
      map?: Map
      title?: string
      icon?: string | Icon
      [key: string]: unknown
    }

    interface DirectionsRequest {
      origin: { lat: number; lng: number } | string
      destination: { lat: number; lng: number } | string
      travelMode: TravelMode
      unitSystem?: UnitSystem
      avoidHighways?: boolean
      avoidTolls?: boolean
      [key: string]: unknown
    }

    interface DirectionsResult {
      routes: DirectionsRoute[]
      [key: string]: unknown
    }

    interface DirectionsRoute {
      legs: DirectionsLeg[]
      overview_polyline: {
        points: string
      }
      [key: string]: unknown
    }

    interface DirectionsLeg {
      distance: { text: string; value: number }
      duration: { text: string; value: number }
      steps: DirectionsStep[]
      [key: string]: unknown
    }

    interface DirectionsStep {
      instructions: string
      distance: { text: string; value: number }
      duration: { text: string; value: number }
      [key: string]: unknown
    }

    interface DirectionsRendererOptions {
      suppressMarkers?: boolean
      polylineOptions?: PolylineOptions
      [key: string]: unknown
    }

    interface PolylineOptions {
      strokeColor?: string
      strokeWeight?: number
      strokeOpacity?: number
      [key: string]: unknown
    }

    interface Icon {
      url: string
      scaledSize?: Size
      anchor?: Point
      [key: string]: unknown
    }

    interface MapTypeStyle {
      featureType?: string
      elementType?: string
      stylers?: Array<{ [key: string]: unknown }>
    }

    enum TravelMode {
      DRIVING = 'DRIVING',
      WALKING = 'WALKING',
      BICYCLING = 'BICYCLING',
      TRANSIT = 'TRANSIT'
    }

    enum DirectionsStatus {
      OK = 'OK',
      NOT_FOUND = 'NOT_FOUND',
      ZERO_RESULTS = 'ZERO_RESULTS',
      MAX_WAYPOINTS_EXCEEDED = 'MAX_WAYPOINTS_EXCEEDED',
      INVALID_REQUEST = 'INVALID_REQUEST',
      OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
      REQUEST_DENIED = 'REQUEST_DENIED',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR'
    }

    enum UnitSystem {
      METRIC = 'METRIC',
      IMPERIAL = 'IMPERIAL'
    }
  }
  }
}

export {} 