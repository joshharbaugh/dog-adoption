export interface Dog {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

export interface Match {
  match: string
}

export interface Location {
  zip_code: string
  latitude: number
  longitude: number
  city: string
  state: string
  county: string
}

export interface Coordinates {
  lat: number
  lon: number
}

export interface LocationSearchParams {
  city?: string
  states?: string[]
  size?: number
  from?: number
  geoBoundingBox?: {
    top?: Coordinates
    left?: Coordinates
    bottom?: Coordinates
    right?: Coordinates
    bottom_left?: Coordinates
    top_right?: Coordinates
    bottom_right?: Coordinates
    top_left?: Coordinates
  }
}
