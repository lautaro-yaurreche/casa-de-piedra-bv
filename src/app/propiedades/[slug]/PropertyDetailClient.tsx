'use client'

import { useState } from 'react'
import AvailabilityCalendar from '@/components/properties/AvailabilityCalendar'
import InquiryForm from '@/components/properties/InquiryForm'
import type { Property } from '@/types/property'
import type { BlockedDate } from '@/lib/db/blocked-dates'

interface PropertyDetailClientProps {
  property: Property
  blockedDates: BlockedDate[]
}

export default function PropertyDetailClient({
  property,
  blockedDates,
}: PropertyDetailClientProps) {
  const [selectedDates, setSelectedDates] = useState<{
    checkIn: Date | null
    checkOut: Date | null
  }>({
    checkIn: null,
    checkOut: null,
  })

  const handleDateSelect = (startDate: Date, endDate: Date) => {
    setSelectedDates({ checkIn: startDate, checkOut: endDate })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Calendario */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        <AvailabilityCalendar
          blockedDates={blockedDates}
          onDateSelect={handleDateSelect}
        />
      </div>

      {/* Formulario de consulta */}
      <div>
        <InquiryForm
          propertyTitle={property.title}
          propertySlug={property.slug}
          selectedDates={selectedDates}
        />
      </div>
    </div>
  )
}
