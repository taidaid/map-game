import React, { useEffect, useRef, useState } from 'react'
import { mapsService } from '../services/maps'
import type { MapProps } from '../types'
import './Map.css'

/**
 * Map Component
 * Displays Google Maps with custom styling and markers
 */
const MapComponent = ({ 
  apiKey,
  startPoint,
  endPoint,
  googleRoute,
  showRoute = false,
  onMapReady = () => {},
  onError = () => {},
  height = '400px',
  zoom = 15
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<{
    start: google.maps.Marker | null
    end: google.maps.Marker | null
  }>({ start: null, end: null })

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async (): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)

        // Initialize the maps service
        await mapsService.initialize(apiKey)

        // Calculate center point between start and end
        const center = startPoint && endPoint 
          ? {
              lat: (startPoint.lat + endPoint.lat) / 2,
              lng: (startPoint.lng + endPoint.lng) / 2
            }
          : startPoint ?? { lat: 52.0907, lng: 5.1214 }

        // Create map instance
        const mapInstance = mapsService.createMap(mapRef.current!, {
          center,
          zoom
        })

        setMap(mapInstance)
        onMapReady(mapInstance)

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(errorMessage)
        onError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    if (apiKey && mapRef.current) {
      void initializeMap()
    }
  }, [apiKey, startPoint, endPoint, zoom, onMapReady, onError])

  // Add/update markers when points change
  useEffect(() => {
    if (!map || !mapsService.loaded) return

    // Clear existing markers
    if (markers.start) {
      markers.start.setMap(null)
    }
    if (markers.end) {
      markers.end.setMap(null)
    }

    const newMarkers: {
      start: google.maps.Marker | null
      end: google.maps.Marker | null
    } = { start: null, end: null }

    // Add start marker
    if (startPoint) {
      newMarkers.start = mapsService.addMarker(startPoint, {
        title: 'Start',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
              <circle cx="12" cy="12" r="10" fill="#4CAF50" stroke="#ffffff" stroke-width="2"/>
              <text x="12" y="17" text-anchor="middle" fill="white" font-size="12" font-weight="bold">S</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        }
      })
    }

    // Add end marker
    if (endPoint) {
      newMarkers.end = mapsService.addMarker(endPoint, {
        title: 'End',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
              <circle cx="12" cy="12" r="10" fill="#f44336" stroke="#ffffff" stroke-width="2"/>
              <text x="12" y="17" text-anchor="middle" fill="white" font-size="12" font-weight="bold">E</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        }
      })
    }

    setMarkers(newMarkers)

    // Adjust map bounds to show both markers
    if (newMarkers.start && newMarkers.end && startPoint && endPoint) {
      const bounds = new google.maps.LatLngBounds()
      bounds.extend(startPoint)
      bounds.extend(endPoint)
      map.fitBounds(bounds)
    }

  }, [map, startPoint, endPoint, markers.start, markers.end])

  // Display/hide route
  useEffect(() => {
    if (!map || !mapsService.loaded) return

    if (showRoute && googleRoute) {
      mapsService.displayRoute(googleRoute)
    } else {
      mapsService.clearRoute()
    }
  }, [map, showRoute, googleRoute])

  if (error) {
    return (
      <div className="map-error" style={{ height }}>
        <div className="error-content">
          <h3>Map Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="map-container" style={{ height }}>
      {isLoading && (
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Loading map...</p>
        </div>
      )}
      
      <div 
        ref={mapRef}
        className="map-element"
        style={{ 
          height: '100%',
          width: '100%',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
        data-testid="map-container"
      />

      {!isLoading && startPoint && endPoint && (
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-marker start">S</div>
            <span>Start Point</span>
          </div>
          <div className="legend-item">
            <div className="legend-marker end">E</div>
            <span>End Point</span>
          </div>
          {showRoute && (
            <div className="legend-item">
              <div className="legend-line"></div>
              <span>Google Route</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MapComponent 