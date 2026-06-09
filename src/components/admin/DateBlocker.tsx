'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import 'react-calendar/dist/Calendar.css'
import '@/styles/calendar-custom.css'
import Toast from '@/components/shared/Toast'
import type { BlockedDate } from '@/lib/db/blocked-dates'

// Dynamic import of Calendar to avoid SSR issues
const Calendar = dynamic(
  () => import('react-calendar').then((mod) => mod.Calendar),
  { ssr: false }
)

interface DateBlockerProps {
  propertyId: string
  blockedDates: BlockedDate[]
  onUpdate: () => void
}

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
}

export default function DateBlocker({
  propertyId,
  blockedDates,
  onUpdate,
}: DateBlockerProps) {
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null)
  const [reason, setReason] = useState<string>('reserva')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRange) return

    setLoading(true)

    try {
      const response = await fetch('/api/blocked-dates/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: propertyId,
          start_date: selectedRange[0].toISOString().split('T')[0],
          end_date: selectedRange[1].toISOString().split('T')[0],
          reason,
          notes: notes || null,
        }),
      })

      if (!response.ok) throw new Error('Error al bloquear fechas')

      setToast({
        message: 'Fechas bloqueadas exitosamente',
        type: 'success',
      })
      setSelectedRange(null)
      setReason('reserva')
      setNotes('')
      onUpdate()
    } catch (error) {
      console.error(error)
      setToast({
        message: 'Error al bloquear fechas. Intenta nuevamente.',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este bloqueo?')) return

    try {
      const response = await fetch(`/api/blocked-dates/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Error al eliminar bloqueo')

      setToast({
        message: 'Bloqueo eliminado exitosamente',
        type: 'success',
      })
      onUpdate()
    } catch (error) {
      console.error(error)
      setToast({
        message: 'Error al eliminar bloqueo. Intenta nuevamente.',
        type: 'error',
      })
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Calendar */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-accent mb-4">
          Seleccionar fechas
        </h3>
        <Calendar
          selectRange
          onChange={(value: any) => setSelectedRange(value)}
          value={selectedRange}
          minDate={new Date()}
          locale="es-UY"
          className="w-full"
        />

        {selectedRange && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Razón
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="reserva">Reserva</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="bloqueado">Bloqueado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notas (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Agregar notas..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>{loading ? 'Bloqueando...' : 'Bloquear fechas'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Blocked Dates List */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-accent mb-4">
          Fechas bloqueadas ({blockedDates.length})
        </h3>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {blockedDates.length > 0 ? (
            blockedDates.map((blocked) => (
              <div
                key={blocked.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {new Date(blocked.start_date).toLocaleDateString('es-UY')}{' '}
                      - {new Date(blocked.end_date).toLocaleDateString('es-UY')}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {blocked.reason || 'No especificado'}
                    </p>
                    {blocked.notes && (
                      <p className="text-sm text-gray-500 mt-1">
                        {blocked.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(blocked.id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay fechas bloqueadas</p>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
