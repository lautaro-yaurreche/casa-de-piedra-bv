import { createClient } from '@/lib/supabase/server'

export interface BlockedDate {
  id: string
  property_id: string
  start_date: string
  end_date: string
  reason: string | null
  notes: string | null
  created_at: string
}

/**
 * Get all blocked dates for a specific property
 */
export async function getBlockedDatesByProperty(
  propertyId: string
): Promise<{ data: BlockedDate[] | null; error: any }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blocked_dates')
    .select('*')
    .eq('property_id', propertyId)
    .order('start_date', { ascending: true })

  return { data, error }
}

/**
 * Check if a property is available for given dates
 */
export async function isPropertyAvailable(
  propertyId: string,
  checkIn: string,
  checkOut: string
): Promise<{ available: boolean; error: any }> {
  const supabase = await createClient()

  // Query for any blocked dates that overlap with the requested range
  const { data, error } = await supabase
    .from('blocked_dates')
    .select('*')
    .eq('property_id', propertyId)
    .or(`start_date.lte.${checkOut},end_date.gte.${checkIn}`)

  if (error) {
    return { available: false, error }
  }

  // If there are any overlapping blocked dates, property is not available
  const available = !data || data.length === 0

  return { available, error: null }
}

/**
 * Get blocked dates within a date range
 */
export async function getBlockedDatesInRange(
  propertyId: string,
  startDate: string,
  endDate: string
): Promise<{ data: BlockedDate[] | null; error: any }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blocked_dates')
    .select('*')
    .eq('property_id', propertyId)
    .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)
    .order('start_date', { ascending: true })

  return { data, error }
}
