import Link from 'next/link'
import Image from 'next/image'
import type { Property } from '@/types/property'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    slug,
    title,
    location,
    price_per_night,
    currency,
    max_guests,
    bedrooms,
    bathrooms,
    featured_image_url,
    is_featured,
  } = property

  return (
    <Link
      href={`/propiedades/${slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        {featured_image_url ? (
          <Image
            src={featured_image_url}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        )}

        {/* Featured Badge */}
        {is_featured && (
          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Destacada
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Location */}
        <p className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </p>

        {/* Title */}
        <h3 className="text-xl font-bold text-accent mb-3 line-clamp-2">
          {title}
        </h3>

        {/* Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          {bedrooms !== null && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {bedrooms} {bedrooms === 1 ? 'dormitorio' : 'dormitorios'}
            </span>
          )}
          {bathrooms !== null && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 21h20M6 18V9.5C6 7 8 5 10.5 5S15 7 15 9.5V18M3 18h18v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1z" />
              </svg>
              {bathrooms} {bathrooms === 1 ? 'baño' : 'baños'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Hasta {max_guests} {max_guests === 1 ? 'huésped' : 'huéspedes'}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-4" />

        {/* Price */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-bold text-accent">
              {currency === 'USD' ? '$' : currency}{' '}
              {price_per_night.toLocaleString()}
            </span>
            <span className="text-gray-600 ml-2">/ noche</span>
          </div>
          <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform inline-block">
            Ver más →
          </span>
        </div>
      </div>
    </Link>
  )
}
