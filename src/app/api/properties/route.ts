import { NextRequest, NextResponse } from 'next/server'
import { getProperties } from '@/lib/db/properties'
import type { PropertyFilters } from '@/types/property'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Build filters from query params
    const filters: PropertyFilters = {}

    const location = searchParams.get('location')
    if (location) filters.location = location

    const propertyType = searchParams.get('property_type')
    if (propertyType) filters.property_type = propertyType

    const minPrice = searchParams.get('min_price')
    if (minPrice) filters.min_price = parseFloat(minPrice)

    const maxPrice = searchParams.get('max_price')
    if (maxPrice) filters.max_price = parseFloat(maxPrice)

    const minGuests = searchParams.get('min_guests')
    if (minGuests) filters.min_guests = parseInt(minGuests)

    const checkIn = searchParams.get('check_in')
    if (checkIn) filters.check_in = checkIn

    const checkOut = searchParams.get('check_out')
    if (checkOut) filters.check_out = checkOut

    // Fetch properties from database
    const { data, error } = await getProperties(filters)

    if (error) {
      console.error('Error fetching properties:', error)
      return NextResponse.json(
        { error: 'Error fetching properties' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      properties: data || [],
      total: data?.length || 0,
    })
  } catch (error) {
    console.error('Unexpected error in /api/properties:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
