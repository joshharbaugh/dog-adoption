'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { LogOut, Heart } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Dog, Match } from '@/lib/types'
import BreedFilter from './breed-filter'
import LocationFilter from './location-filter'

export default function SearchContent() {
  const router = useRouter()
  const [breeds, setBreeds] = useState<string[]>([])
  const [dogs, setDogs] = useState<Dog[]>([])
  const [favorites, setFavorites] = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    breeds: [] as string[],
    zipCodes: [] as string[],
    ageMin: '',
    ageMax: '',
    sort: 'breed:asc',
    size: 25,
    from: 0
  })
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null)

  // Check authentication and fetch breeds on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dogs/breeds`, {
          credentials: 'include'
        })
        if (!response.ok) {
          router.replace('/')
          return
        }
        const breedsData = await response.json()
        setBreeds(breedsData)
      } catch (error) {
        router.replace('/')
        console.error(`Auth Check Error:`, error)
      }
    }
    
    initialize()
  }, [router])

  // Fetch dogs whenever search params change
  useEffect(() => {
    const fetchDogs = async () => {
      setLoading(true)
      try {
        // Build query parameters
        const params = new URLSearchParams()
        if (searchParams.breeds.length > 0) {
          searchParams.breeds.forEach((breed) => {
            params.append('breeds', breed.toString())
          })
        }
        if (searchParams.ageMin) {
          params.append('ageMin', searchParams.ageMin)
        }
        if (searchParams.ageMax) {
          params.append('ageMax', searchParams.ageMax)
        }
        params.append('sort', searchParams.sort)
        params.append('size', searchParams.size.toString())
        params.append('from', searchParams.from.toString())

        if (searchParams.zipCodes.length > 0) {
          searchParams.zipCodes.forEach((zipCode) => {
            params.append('zipCodes', zipCode.toString())
          })
        }

        // Get dog IDs
        const searchResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dogs/search?${params}`,
          { credentials: 'include' }
        )
        if (!searchResponse.ok) throw new Error('Failed to fetch dogs')
        const { resultIds } = await searchResponse.json()
        
        // Get dog details
        const dogsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resultIds),
          credentials: 'include'
        })
        if (!dogsResponse.ok) throw new Error('Failed to fetch dog details')
        const dogsData = await dogsResponse.json()
        setDogs(dogsData)
      } catch (error) {
        console.error('Error fetching dogs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDogs()
  }, [searchParams])

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      router.replace('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const generateMatch = async () => {
    if (favorites.length === 0) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dogs/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(favorites.map(dog => dog.id)),
        credentials: 'include'
      })
      
      if (!response.ok) throw new Error('Failed to generate match')
      const { match }: Match = await response.json()
      
      const matchedDog = favorites.find(dog => dog.id === match)
      if (matchedDog) {
        setMatchedDog(matchedDog)
      }
    } catch (error) {
      console.error('Error generating match:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Find Your Perfect Dog</h1>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  disabled={favorites.length === 0}
                  onClick={generateMatch}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Match ({favorites.length})
                </Button>
              </DialogTrigger>
              {matchedDog && (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Your Perfect Match!</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Image
                      width={100}
                      height={64}
                      src={matchedDog.img} 
                      alt={matchedDog.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{matchedDog.name}</h3>
                      <p className="text-gray-600">{matchedDog.breed}</p>
                      <p className="text-gray-600">{matchedDog.age} years old</p>
                      <p className="text-gray-600">Location: {matchedDog.zip_code}</p>
                    </div>
                  </div>
                </DialogContent>
              )}
            </Dialog>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <BreedFilter
                  breeds={breeds}
                  selectedBreeds={searchParams.breeds}
                  onBreedsChange={(newBreeds) => 
                    setSearchParams({
                      ...searchParams,
                      breeds: newBreeds
                    })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <LocationFilter
                  onLocationSelect={(zipCodes: string[]) => 
                    setSearchParams({
                      ...searchParams,
                      zipCodes
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Min Age</label>
                <Input
                  type="number"
                  min="0"
                  value={searchParams.ageMin}
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    ageMin: e.target.value
                  })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Max Age</label>
                <Input
                  type="number"
                  min="0"
                  value={searchParams.ageMax}
                  onChange={(e) => setSearchParams({
                    ...searchParams,
                    ageMax: e.target.value
                  })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Sort</label>
                <Select
                  value={searchParams.sort}
                  onValueChange={(value) => setSearchParams({
                    ...searchParams,
                    sort: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breed:asc">Breed (A-Z)</SelectItem>
                    <SelectItem value="breed:desc">Breed (Z-A)</SelectItem>
                    <SelectItem value="age:asc">Age (Youngest)</SelectItem>
                    <SelectItem value="age:desc">Age (Oldest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map((dog) => (
              <Card key={dog.id} className="overflow-hidden">
                <Image
                  width={100}
                  height={48}
                  src={dog.img} 
                  alt={dog.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{dog.name}</h3>
                      <p className="text-sm text-gray-600">{dog.breed}</p>
                      <p className="text-sm text-gray-600">{dog.age} years old</p>
                      <p className="text-sm text-gray-600">ZIP: {dog.zip_code}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (favorites.find(f => f.id === dog.id)) {
                          setFavorites(favorites.filter(f => f.id !== dog.id))
                        } else {
                          setFavorites([...favorites, dog])
                        }
                      }}
                    >
                      <Heart 
                        className={`h-5 w-5 ${
                          favorites.find(f => f.id === dog.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-500'
                        }`}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-4 pt-6">
          <Button
            variant="outline"
            onClick={() => setSearchParams({
              ...searchParams,
              from: Math.max(0, searchParams.from - searchParams.size)
            })}
            disabled={searchParams.from === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setSearchParams({
              ...searchParams,
              from: searchParams.from + searchParams.size
            })}
            disabled={dogs.length < searchParams.size}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}