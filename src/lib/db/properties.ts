import { createClient } from '@/lib/supabase/server'
import type { Property, PropertyFilters } from '@/types/property'

/**
 * Get all active properties with optional filters
 */
export async function getProperties(
  filters?: PropertyFilters
): Promise<{ data: Property[] | null; error: any }> {
  const supabase = await createClient()

  let query = supabase
    .from('properties')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })

  // Apply filters
  if (filters?.location) {
    query = query.eq('location', filters.location)
  }

  if (filters?.property_type) {
    query = query.eq('property_type', filters.property_type)
  }

  if (filters?.min_price) {
    query = query.gte('price_per_night', filters.min_price)
  }

  if (filters?.max_price) {
    query = query.lte('price_per_night', filters.max_price)
  }

  if (filters?.min_guests) {
    query = query.gte('max_guests', filters.min_guests)
  }

  const { data, error } = await query

  return { data, error }
}

/**
 * Get a single property by slug
 */
export async function getPropertyBySlug(
  slug: string
): Promise<{ data: Property | null; error: any }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  return { data, error }
}

/**
 * Get a single property by ID
 */
export async function getPropertyById(
  id: string
): Promise<{ data: Property | null; error: any }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}

/**
 * Get unique locations from active properties
 */
export async function getUniqueLocations(): Promise<{
  data: string[] | null
  error: any
}> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .select('location')
    .eq('is_active', true)

  if (error || !data) {
    return { data: null, error }
  }

  // Extract unique locations
  const locations = [...new Set(data.map((p) => p.location))].sort()

  return { data: locations, error: null }
}

/**
 * Get unique property types from active properties
 */
export async function getUniquePropertyTypes(): Promise<{
  data: string[] | null
  error: any
}> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .select('property_type')
    .eq('is_active', true)

  if (error || !data) {
    return { data: null, error }
  }

  // Extract unique property types
  const types = [...new Set(data.map((p) => p.property_type))].sort()

  return { data: types, error: null }
}
