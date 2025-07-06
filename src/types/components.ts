import type { Point, GoogleRoute } from './game'

/**
 * Game Component Props
 */
export interface GameProps {
  apiKey?: string
  initialStartPoint?: Point
  initialEndPoint?: Point
}

/**
 * Map Component Props
 */
export interface MapProps {
  apiKey: string
  startPoint: Point | null
  endPoint: Point | null
  googleRoute?: GoogleRoute | null
  showRoute?: boolean
  onMapReady?: (map: google.maps.Map) => void
  onError?: (error: Error) => void
  height?: string
  width?: string
  zoom?: number
}

/**
 * Route Input Component Props
 */
export interface RouteInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  error?: string | null
  placeholder?: string
  maxLength?: number
}

/**
 * Generic Component Props
 */
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Component State Types
 */
export interface ComponentError {
  message: string
  code?: string
  details?: unknown
}

export interface LoadingState {
  isLoading: boolean
  message?: string
}

/**
 * Event Handler Types
 */
export type ErrorHandler = (error: Error) => void
export type SuccessHandler = () => void
export type ChangeHandler<T> = (value: T) => void 