import { NextRequest, NextResponse } from 'next/server'
import { getBlockedDatesByProperty } from '@/lib/db/blocked-dates'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const propertyId = searchParams.get('propertyId')

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await getBlockedDatesByProperty(propertyId)

    if (error) {
      console.error('Error fetching blocked dates:', error)
      return NextResponse.json(
        { error: 'Error fetching blocked dates' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      blocked_dates: data || [],
      total: data?.length || 0,
    })
  } catch (error) {
    console.error('Unexpected error in /api/blocked-dates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
