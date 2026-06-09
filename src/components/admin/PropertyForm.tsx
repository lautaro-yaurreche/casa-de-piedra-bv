'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertySchema, type PropertyFormData } from '@/lib/validations/property'
import { useState, forwardRef } from 'react'
import type { Property } from '@/types/property'

interface PropertyFormProps {
  property?: Property
  onSubmit: (data: PropertyFormData) => Promise<void>
  isSubmitting?: boolean
  onSubmitClick?: () => void
}

const AMENITIES_OPTIONS = [
  'WiFi de alta velocidad',
  'Estacionamiento privado',
  'Cocina completa',
  'Aires acondicionados',
  'Calefacción',
  'Piscina climatizada',
  'Quincho',
  'Barbacoa',
  'Mesa de pool',
  'Mesa de ping pong',
  'Cancha de fútbol',
  'Smart TV',
  'Seguridad 24/7',
  'Predio cerrado',
  'Jardín',
  'Terraza',
  'Vista al mar',
  'Cerca de la playa',
]

const PropertyForm = forwardRef<HTMLFormElement, PropertyFormProps>(function PropertyForm({
  property,
  onSubmit,
  isSubmitting = false,
  onSubmitClick,
}, ref) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    mode: 'onChange',
    defaultValues: property
      ? {
          title: property.title,
          slug: property.slug,
          description: property.description,
          location: property.location,
          property_type: property.property_type,
          price_per_night: String(property.price_per_night),
          currency: property.currency,
          max_guests: String(property.max_guests),
          bedrooms: String(property.bedrooms),
          bathrooms: String(property.bathrooms),
          is_active: property.is_active,
          is_featured: property.is_featured,
          amenities: property.amenities || [],
          meta_title: property.meta_title,
          meta_description: property.meta_description,
        }
      : {
          currency: 'USD',
          is_active: true,
          is_featured: false,
          amenities: [],
        },
  })

  const selectedAmenities = watch('amenities') || []

  // Estado para controlar secciones expandidas
  const [expandedSections, setExpandedSections] = useState({
    basic: false,
    pricing: false,
    amenities: false,
    status: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Contar errores por sección
  const getBasicErrors = () => {
    const basicFields = ['title', 'slug', 'description', 'location', 'property_type'] as const
    return basicFields.filter(field => errors[field]).length
  }

  const getPricingErrors = () => {
    const pricingFields = ['price_per_night', 'max_guests', 'bedrooms', 'bathrooms'] as const
    return pricingFields.filter(field => errors[field]).length
  }

  // Obtener lista de errores por sección
  const getBasicErrorsList = () => {
    const basicFields = ['title', 'slug', 'description', 'location', 'property_type'] as const
    const fieldLabels = {
      title: 'Título',
      slug: 'Slug (URL)',
      description: 'Descripción',
      location: 'Ubicación',
      property_type: 'Tipo de propiedad',
    }
    return basicFields
      .filter(field => errors[field])
      .map(field => ({
        field,
        label: fieldLabels[field],
        message: errors[field]?.message as string,
      }))
  }

  const getPricingErrorsList = () => {
    const pricingFields = ['price_per_night', 'max_guests', 'bedrooms', 'bathrooms'] as const
    const fieldLabels = {
      price_per_night: 'Precio por noche',
      max_guests: 'Máximo de huéspedes',
      bedrooms: 'Dormitorios',
      bathrooms: 'Baños',
    }
    return pricingFields
      .filter(field => errors[field])
      .map(field => ({
        field,
        label: fieldLabels[field],
        message: errors[field]?.message as string,
      }))
  }

  const getTotalErrors = () => {
    return getBasicErrors() + getPricingErrors()
  }

  const toggleAmenity = (amenity: string) => {
    const current = selectedAmenities
    if (current.includes(amenity)) {
      setValue(
        'amenities',
        current.filter((a) => a !== amenity)
      )
    } else {
      setValue('amenities', [...current, amenity])
    }
  }

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setValue('title', title, { shouldValidate: true })

    if (!property) {
      // Only auto-generate for new properties
      const slug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setValue('slug', slug, { shouldValidate: true })
    }
  }

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('basic')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-accent">Información básica</h3>
            {!expandedSections.basic && getBasicErrors() > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                {getBasicErrors()} {getBasicErrors() === 1 ? 'error' : 'errores'}
              </span>
            )}
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${expandedSections.basic ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className={`transition-all duration-200 ease-out overflow-hidden ${
          expandedSections.basic ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título *
            </label>
            <input
              {...register('title')}
              onChange={handleTitleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Casa de Piedra en Bella Vista"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slug (URL) *
            </label>
            <input
              {...register('slug')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="casa-de-piedra-bella-vista"
            />
            {errors.slug && (
              <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              {...register('description')}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              placeholder="Describe la propiedad..."
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ubicación *
            </label>
            <input
              {...register('location')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Bella Vista, Piriápolis"
            />
            {errors.location && (
              <p className="text-red-600 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de propiedad *
            </label>
            <input
              {...register('property_type')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="casa, apartamento, cabaña"
            />
            {errors.property_type && (
              <p className="text-red-600 text-sm mt-1">
                {errors.property_type.message}
              </p>
            )}
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* Pricing & Capacity */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('pricing')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-accent">Precio y capacidad</h3>
            {!expandedSections.pricing && getPricingErrors() > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                {getPricingErrors()} {getPricingErrors() === 1 ? 'error' : 'errores'}
              </span>
            )}
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${expandedSections.pricing ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className={`transition-all duration-200 ease-out overflow-hidden ${
          expandedSections.pricing ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Precio por noche *
            </label>
            <input
              type="number"
              {...register('price_per_night')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="150"
            />
            {errors.price_per_night && (
              <p className="text-red-600 text-sm mt-1">
                {errors.price_per_night.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Máximo de huéspedes *
            </label>
            <input
              type="number"
              {...register('max_guests')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="10"
            />
            {errors.max_guests && (
              <p className="text-red-600 text-sm mt-1">
                {errors.max_guests.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Moneda
            </label>
            <select
              {...register('currency')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="USD">USD</option>
              <option value="UYU">UYU</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dormitorios *
            </label>
            <input
              type="number"
              {...register('bedrooms')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="3"
            />
            {errors.bedrooms && (
              <p className="text-red-600 text-sm mt-1">
                {errors.bedrooms.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Baños *
            </label>
            <input
              type="number"
              {...register('bathrooms')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="2"
            />
            {errors.bathrooms && (
              <p className="text-red-600 text-sm mt-1">
                {errors.bathrooms.message}
              </p>
            )}
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('amenities')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <h3 className="text-xl font-bold text-accent">Servicios</h3>
          <svg
            className={`w-5 h-5 transition-transform ${expandedSections.amenities ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className={`transition-all duration-200 ease-out overflow-hidden ${
          expandedSections.amenities ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {AMENITIES_OPTIONS.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('status')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <h3 className="text-xl font-bold text-accent">Estado</h3>
          <svg
            className={`w-5 h-5 transition-transform ${expandedSections.status ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className={`transition-all duration-200 ease-out overflow-hidden ${
          expandedSections.status ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register('is_active')}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <div>
              <span className="font-semibold text-gray-900">Activa</span>
              <p className="text-sm text-gray-600">
                La propiedad aparecerá en el sitio público
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register('is_featured')}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <div>
              <span className="font-semibold text-gray-900">Destacada</span>
              <p className="text-sm text-gray-600">
                Aparecerá primero en los listados
              </p>
            </div>
          </label>
        </div>
          </div>
        </div>
      </div>
    </form>
  )
})

export default PropertyForm
