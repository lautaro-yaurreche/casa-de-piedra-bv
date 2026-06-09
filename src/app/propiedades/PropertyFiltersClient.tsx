'use client'

import { useState, useMemo } from 'react'
import PropertyCard from '@/components/properties/PropertyCard'
import PropertyFilters from '@/components/properties/PropertyFilters'
import type { Property, PropertyFilters as Filters } from '@/types/property'

interface PropertyFiltersClientProps {
  initialProperties: Property[]
  locations: string[]
  propertyTypes: string[]
}

export default function PropertyFiltersClient({
  initialProperties,
  locations,
  propertyTypes,
}: PropertyFiltersClientProps) {
  const [filters, setFilters] = useState<Filters>({})

  // Filter properties client-side
  const filteredProperties = useMemo(() => {
    let result = [...initialProperties]

    if (filters.location) {
      result = result.filter((p) => p.location === filters.location)
    }

    if (filters.property_type) {
      result = result.filter((p) => p.property_type === filters.property_type)
    }

    if (filters.min_guests) {
      result = result.filter((p) => p.max_guests >= filters.min_guests!)
    }

    if (filters.min_price) {
      result = result.filter((p) => p.price_per_night >= filters.min_price!)
    }

    if (filters.max_price) {
      result = result.filter((p) => p.price_per_night <= filters.max_price!)
    }

    return result
  }, [initialProperties, filters])

  return (
    <div>
      {/* Top Bar - Results and Filters */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Results Count */}
        <div>
          <p className="text-gray-600">
            {filteredProperties.length === 0 ? (
              'No se encontraron propiedades'
            ) : (
              <>
                <span className="font-semibold text-accent">
                  {filteredProperties.length}
                </span>{' '}
                {filteredProperties.length === 1
                  ? 'propiedad encontrada'
                  : 'propiedades encontradas'}
              </>
            )}
          </p>
        </div>

        {/* Filters - Inline */}
        <PropertyFilters
          onFilterChange={setFilters}
          locations={locations}
          propertyTypes={propertyTypes}
        />
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No hay propiedades disponibles
          </h3>
          <p className="text-gray-600">
            Intenta ajustar los filtros para ver más resultados
          </p>
        </div>
      )}
    </div>
  )
}
