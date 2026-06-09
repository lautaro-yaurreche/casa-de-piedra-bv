'use client'

import { useState } from 'react'
import DateBlocker from '@/components/admin/DateBlocker'
import type { BlockedDate } from '@/lib/db/blocked-dates'

interface DateBlockerClientProps {
  propertyId: string
  initialBlockedDates: BlockedDate[]
}

export default function DateBlockerClient({
  propertyId,
  initialBlockedDates,
}: DateBlockerClientProps) {
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates)

  const handleUpdate = async () => {
    // Refetch blocked dates
    const response = await fetch(
      `/api/blocked-dates?propertyId=${propertyId}`
    )
    const data = await response.json()
    setBlockedDates(data.blocked_dates || [])
  }

  return (
    <DateBlocker
      propertyId={propertyId}
      blockedDates={blockedDates}
      onUpdate={handleUpdate}
    />
  )
}
