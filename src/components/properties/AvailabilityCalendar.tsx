'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'react-calendar/dist/Calendar.css'
import '@/styles/calendar-custom.css'
import type { BlockedDate } from '@/lib/db/blocked-dates'

// Dynamic import of Calendar to avoid SSR issues
const Calendar = dynamic(
  () => import('react-calendar').then((mod) => mod.Calendar),
  { ssr: false }
)

interface AvailabilityCalendarProps {
  blockedDates: BlockedDate[]
  onDateSelect?: (startDate: Date, endDate: Date) => void
}

export default function AvailabilityCalendar({
  blockedDates,
  onDateSelect,
}: AvailabilityCalendarProps) {
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null
    end: Date | null
  }>({ start: null, end: null })

  // Convert blocked dates to Date objects for easier comparison
  const blockedRanges = useMemo(() => {
    return blockedDates.map((blocked) => ({
      start: new Date(blocked.start_date),
      end: new Date(blocked.end_date),
      reason: blocked.reason,
    }))
  }, [blockedDates])

  // Check if a date is blocked
  const isDateBlocked = (date: Date): boolean => {
    return blockedRanges.some((range) => {
      const dateTime = date.getTime()
      return dateTime >= range.start.getTime() && dateTime <= range.end.getTime()
    })
  }

  // Disable past dates and blocked dates
  const tileDisabled = ({ date }: { date: Date }) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Disable past dates
    if (date < today) return true

    // Disable blocked dates
    return isDateBlocked(date)
  }

  // Add custom class names for styling
  const tileClassName = ({ date }: { date: Date }) => {
    const classes: string[] = []

    // Blocked dates
    if (isDateBlocked(date)) {
      classes.push('blocked-date')
    }

    // Selected range
    if (selectedRange.start && selectedRange.end) {
      const dateTime = date.getTime()
      const startTime = selectedRange.start.getTime()
      const endTime = selectedRange.end.getTime()

      if (dateTime >= startTime && dateTime <= endTime) {
        // Check if it's the first day
        if (dateTime === startTime) {
          classes.push('range-start')
        }
        // Check if it's the last day
        else if (dateTime === endTime) {
          classes.push('range-end')
        }
        // Middle days
        else {
          classes.push('range-middle')
        }
      }
    }

    return classes.join(' ')
  }

  const handleDateChange = (value: any) => {
    if (Array.isArray(value)) {
      // Range selection
      const [start, end] = value
      setSelectedRange({ start, end })
      if (onDateSelect && start && end) {
        onDateSelect(start, end)
      }
    } else {
      // Single date selection (start of range)
      if (!selectedRange.start) {
        setSelectedRange({ start: value, end: null })
      } else if (!selectedRange.end && value > selectedRange.start) {
        setSelectedRange({ ...selectedRange, end: value })
        if (onDateSelect) {
          onDateSelect(selectedRange.start, value)
        }
      } else {
        // Reset selection
        setSelectedRange({ start: value, end: null })
      }
    }
  }

  return (
    <div className="availability-calendar-container">
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-accent mb-2">
            Disponibilidad
          </h3>
          <p className="text-gray-600 mb-6">
            Selecciona las fechas de check-in y check-out
          </p>
        </div>

        <Calendar
          onChange={handleDateChange}
          selectRange={false}
          minDate={new Date()}
          tileDisabled={tileDisabled}
          tileClassName={tileClassName}
          locale="es-UY"
        />

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white border border-gray-300" />
            <span className="text-gray-600">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-300 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-gray-600" />
              </div>
            </div>
            <span className="text-gray-600">No disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-beige border-l-2 border-r-2 border-primary" style={{ borderRadius: '0.25rem' }} />
            <span className="text-gray-600">Seleccionado</span>
          </div>
        </div>
      </div>
    </div>
  )
}
