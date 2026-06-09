'use client'

import { useState } from 'react'
import type { PropertyFilters as Filters } from '@/types/property'

interface PropertyFiltersProps {
  onFilterChange: (filters: Filters) => void
  locations: string[]
  propertyTypes: string[]
}

export default function PropertyFilters({
  onFilterChange,
  locations,
  propertyTypes,
}: PropertyFiltersProps) {
  const [filters, setFilters] = useState<Filters>({})

  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    const newFilters = {
      ...filters,
      [key]: value === '' ? undefined : value,
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    setFilters({})
    onFilterChange({})
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ''
  )

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Location Filter */}
      {locations.length > 0 && (
        <div className="relative">
          <select
            value={filters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white text-sm appearance-none cursor-pointer"
          >
            <option value="">Ubicación</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Property Type Filter */}
      {propertyTypes.length > 0 && (
        <div className="relative">
          <select
            value={filters.property_type || ''}
            onChange={(e) =>
              handleFilterChange('property_type', e.target.value)
            }
            className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white text-sm appearance-none cursor-pointer"
          >
            <option value="">Tipo</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Guests Filter */}
      <div className="relative">
        <select
          value={filters.min_guests || ''}
          onChange={(e) =>
            handleFilterChange('min_guests', parseInt(e.target.value) || '')
          }
          className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white text-sm appearance-none cursor-pointer"
        >
          <option value="">Huéspedes</option>
          {[2, 4, 6, 8, 10].map((guests) => (
            <option key={guests} value={guests}>
              {guests}+
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Price Range */}
      <input
        type="number"
        placeholder="Precio mín"
        value={filters.min_price || ''}
        onChange={(e) =>
          handleFilterChange('min_price', parseInt(e.target.value) || '')
        }
        className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
      />
      <input
        type="number"
        placeholder="Precio máx"
        value={filters.max_price || ''}
        onChange={(e) =>
          handleFilterChange('max_price', parseInt(e.target.value) || '')
        }
        className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
      />

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
        >
          Limpiar
        </button>
      )}
    </div>
  )
}
