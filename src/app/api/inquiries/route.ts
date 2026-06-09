import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { propertySlug, fullName, email, phone, checkIn, checkOut, guests, message } = body

    // Validate required fields
    if (!propertySlug || !fullName || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Get property ID from slug
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id')
      .eq('slug', propertySlug)
      .single()

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Propiedad no encontrada' },
        { status: 404 }
      )
    }

    // Insert inquiry
    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        property_id: property.id,
        full_name: fullName,
        email: email || null,
        phone: phone || null,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        notes: message || null,
        status: 'pending',
        whatsapp_sent: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating inquiry:', error)
      return NextResponse.json(
        { error: 'Error al crear la consulta' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/inquiries:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('inquiries')
      .select('*, properties(title, slug)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching inquiries:', error)
      return NextResponse.json(
        { error: 'Error al obtener consultas' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Error in GET /api/inquiries:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
