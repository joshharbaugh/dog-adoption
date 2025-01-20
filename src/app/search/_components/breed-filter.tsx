'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
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
import { cn } from "@/lib/utils"
import { Command } from 'cmdk'

interface BreedFilterProps {
  breeds: string[]
  selectedBreeds: string[]
  onBreedsChange: (breeds: string[]) => void
}

export default function BreedFilter({ breeds, selectedBreeds, onBreedsChange }: BreedFilterProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (breed: string) => {
    if (selectedBreeds.includes(breed)) {
      onBreedsChange(selectedBreeds.filter(b => b !== breed))
    } else {
      onBreedsChange([...selectedBreeds, breed])
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Breeds</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start"
          >
            {selectedBreeds.length > 0
              ? `${selectedBreeds.length} breed${selectedBreeds.length === 1 ? '' : 's'} selected`
              : "Select breeds..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command shouldFilter={true}>
            <CommandInput placeholder="Search breeds..." />
            <CommandList>
              <CommandEmpty>No breeds found.</CommandEmpty>
              <CommandGroup heading="Breeds">
                {breeds.map((breed) => {
                  const isSelected = selectedBreeds.includes(breed)
                  return (
                    <CommandItem
                      key={breed}
                      value={breed}
                      onSelect={() => handleSelect(breed)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <svg
                          className={cn("h-4 w-4")}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span>{breed}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedBreeds.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedBreeds.map((breed) => (
            <div
              key={breed}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
            >
              {breed}
              <button
                onClick={() => handleSelect(breed)}
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