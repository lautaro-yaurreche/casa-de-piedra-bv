'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect } from 'react'
import Toast from '@/components/shared/Toast'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    const fetchInquiries = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('inquiries')
        .select('*, properties(title, slug)')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching inquiries:', error)
      } else {
        setInquiries(data || [])
      }
      setLoading(false)
    }

    fetchInquiries()
  }, [])

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const updateInquiryStatus = async (id: string, status: 'pending' | 'confirmed' | 'rejected') => {
    setUpdatingId(id)
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar la consulta')
      }

      // Actualizar el estado local
      setInquiries(prev =>
        prev.map(inquiry =>
          inquiry.id === id ? { ...inquiry, status } : inquiry
        )
      )

      const statusLabels = {
        pending: 'pendiente',
        confirmed: 'confirmada',
        rejected: 'rechazada',
      }

      setToast({
        message: `Consulta marcada como ${statusLabels[status]}`,
        type: 'success',
      })
    } catch (error) {
      console.error('Error updating inquiry:', error)
      setToast({
        message: 'Hubo un error al actualizar la consulta. Intenta nuevamente.',
        type: 'error',
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    }
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      rejected: 'Rechazada',
    }
    return labels[status as keyof typeof labels] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando consultas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-accent mb-2">
          Consultas de Reserva
        </h1>
        <p className="text-gray-600">
          Gestiona todas las consultas de reserva recibidas
        </p>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {inquiries && inquiries.length > 0 ? (
          inquiries.map((inquiry: any) => {
            const isExpanded = expandedIds.has(inquiry.id)

            return (
              <div
                key={inquiry.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Header de la tarjeta - Clickeable */}
                <button
                  onClick={() => toggleExpanded(inquiry.id)}
                  className={`w-full bg-white px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors ${isExpanded ? 'border-b border-gray-200' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {inquiry.full_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(inquiry.created_at).toLocaleDateString('es-UY', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(inquiry.status)}`}
                    >
                      {getStatusLabel(inquiry.status)}
                    </span>
                    {/* Icono chevron */}
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Contenido de la tarjeta - Colapsable */}
                {isExpanded && (
                  <div className="p-6 space-y-6">
                    {/* Primera fila: Propiedad - Fechas - Huéspedes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Propiedad */}
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                          Propiedad
                        </p>
                        <Link
                          href={`/propiedades/${inquiry.properties?.slug || ''}`}
                          target="_blank"
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          {inquiry.properties?.title || 'Propiedad eliminada'}
                        </Link>
                      </div>

                      {/* Fechas */}
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                          Fechas
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {new Date(inquiry.check_in).toLocaleDateString('es-UY')}
                            {' → '}
                            {new Date(inquiry.check_out).toLocaleDateString('es-UY')}
                          </span>
                        </div>
                      </div>

                      {/* Huéspedes */}
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                          Huéspedes
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{inquiry.guests} {inquiry.guests === 1 ? 'huésped' : 'huéspedes'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Segunda fila: Email - Teléfono - Estado */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Email */}
                      {inquiry.email ? (
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">
                            Email
                          </p>
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {inquiry.email}
                          </a>
                        </div>
                      ) : (
                        <div></div>
                      )}

                      {/* Teléfono */}
                      {inquiry.phone ? (
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">
                            Teléfono
                          </p>
                          <a
                            href={`https://api.whatsapp.com/send?phone=${inquiry.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            {inquiry.phone}
                          </a>
                        </div>
                      ) : (
                        <div></div>
                      )}

                      {/* Estado */}
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          Estado
                        </p>
                        <div className="flex gap-2">
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, 'pending')}
                          disabled={updatingId === inquiry.id || inquiry.status === 'pending'}
                          title="Marcar como pendiente"
                          className="p-2 rounded-lg hover:bg-yellow-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        >
                          {updatingId === inquiry.id ? (
                            <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, 'confirmed')}
                          disabled={updatingId === inquiry.id || inquiry.status === 'confirmed'}
                          title="Marcar como confirmada"
                          className="p-2 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        >
                          {updatingId === inquiry.id ? (
                            <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, 'rejected')}
                          disabled={updatingId === inquiry.id || inquiry.status === 'rejected'}
                          title="Marcar como rechazada"
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                        >
                          {updatingId === inquiry.id ? (
                            <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                    {/* Mensaje (full width si existe) */}
                    {inquiry.notes && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          Mensaje adicional
                        </p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {inquiry.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No hay consultas
            </h3>
            <p className="text-gray-600">
              Las consultas de reserva aparecerán aquí
            </p>
          </div>
        )}
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
