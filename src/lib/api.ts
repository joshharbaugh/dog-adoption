import type { LocationSearchParams } from './types'

export async function searchLocations(params: LocationSearchParams) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to search locations')
  }

  return response.json()
}

export async function getLocationsByZipCodes(zipCodes: string[]) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(zipCodes),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch locations')
  }

  return response.json()
}