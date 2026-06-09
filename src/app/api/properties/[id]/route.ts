import { NextRequest, NextResponse } from 'next/server'
import { getPropertyById } from '@/lib/db/properties'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await getPropertyById(id)

    if (error) {
      console.error('Error fetching property:', error)
      return NextResponse.json(
        { error: 'Error fetching property' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error in /api/properties/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
