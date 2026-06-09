// Domain types for properties

export interface PropertyImage {
  url: string
  order: number
  alt: string
}

export interface Property {
  id: string
  created_at: string
  updated_at: string
  title: string
  slug: string
  description: string
  location: string
  property_type: string
  price_per_night: number
  currency: string
  max_guests: number
  bedrooms: number | null
  bathrooms: number | null
  featured_image_url: string | null
  images: PropertyImage[] | null
  meta_title: string | null
  meta_description: string | null
  is_active: boolean
  is_featured: boolean
  amenities: string[] | null
}

export interface PropertyFilters {
  location?: string
  property_type?: string
  min_price?: number
  max_price?: number
  min_guests?: number
  check_in?: string
  check_out?: string
}

export interface PropertyListResponse {
  properties: Property[]
  total: number
  page: number
  per_page: number
}
