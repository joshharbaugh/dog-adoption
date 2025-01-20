'use client'

import * as React from 'react'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { searchLocations } from '@/lib/api'
import type { Location } from '@/lib/types'

interface LocationFilterProps {
  onLocationSelect: (zipCodes: string[]) => void
}

export default function LocationFilter({ onLocationSelect }: LocationFilterProps) {
  const [open, setOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([])
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleSearch = async () => {
    if (!searchInput.trim()) return

    setLoading(true)
    setSearchPerformed(true)
    try {
      const { results } = await searchLocations({
        city: searchInput.trim(),
        size: 100,
      })
      setLocations(results || [])
    } catch (error) {
      console.error('Error searching locations:', error)
      setLocations([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (location: Location) => {
    const isSelected = selectedLocations.some(l => l.zip_code === location.zip_code)
    
    if (isSelected) {
      const newSelected = selectedLocations.filter(l => l.zip_code !== location.zip_code)
      setSelectedLocations(newSelected)
      onLocationSelect(newSelected.map(l => l.zip_code))
    } else {
      const newSelected = [...selectedLocations, location]
      setSelectedLocations(newSelected)
      onLocationSelect(newSelected.map(l => l.zip_code))
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Location</label>
      <div className="flex gap-2">
        <Input
          placeholder="Enter city..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={handleSearch}
          disabled={loading}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
          >
            {selectedLocations.length > 0
              ? `${selectedLocations.length} location${selectedLocations.length === 1 ? '' : 's'} selected`
              : "Select locations..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search locations..." 
              value={searchInput}
              onValueChange={setSearchInput}
            />
            <CommandList>
              {!searchPerformed ? (
                <CommandEmpty>Search for a city to see locations.</CommandEmpty>
              ) : loading ? (
                <CommandEmpty>Loading...</CommandEmpty>
              ) : locations.length === 0 ? (
                <CommandEmpty>No locations found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {locations.map((location) => {
                    const isSelected = selectedLocations.some(
                      l => l.zip_code === location.zip_code
                    )
                    
                    return (
                      <CommandItem
                        key={location.zip_code}
                        onSelect={() => handleSelect(location)}
                        className="flex items-center gap-2"
                      >
                        <div className={`w-4 h-4 border rounded-sm ${
                          isSelected ? 'bg-primary border-primary' : 'border-input'
                        }`}>
                          {isSelected && (
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="w-4 h-4 text-primary-foreground"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <span>
                          {location.city}, {location.state} ({location.zip_code})
                        </span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedLocations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedLocations.map((location) => (
            <div
              key={location.zip_code}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
            >
              {location.city}, {location.state} ({location.zip_code})
              <button
                onClick={() => handleSelect(location)}
                className="hover:text-destructive"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}