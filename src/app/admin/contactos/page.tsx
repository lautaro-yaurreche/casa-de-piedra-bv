'use client'

import { useEffect, useState } from 'react'
import type { Contact } from '@/lib/db/contacts'
import Toast from '@/components/shared/Toast'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
}

const FORM_TYPE_LABELS: Record<string, string> = {
  contact: 'Contacto General',
  venta: 'Venta de Propiedad',
  'alquila-con-nosotros': 'Alquila con Nosotros',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Nueva',
  contacted: 'Contactada',
  closed: 'Cerrada',
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
      const result = await response.json()

      if (result.data) {
        setContacts(result.data)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setToast({
        message: 'Error al cargar contactos',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (id: string, status: 'new' | 'contacted' | 'closed') => {
    setUpdatingId(id)

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar estado')
      }

      const result = await response.json()

      // Actualizar estado local
      setContacts(contacts.map(c => c.id === id ? { ...c, status } : c))

      setToast({
        message: 'Estado actualizado correctamente',
        type: 'success',
      })
    } catch (error) {
      console.error('Error updating contact status:', error)
      setToast({
        message: 'Error al actualizar estado',
        type: 'error',
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700'
      case 'contacted':
        return 'bg-green-100 text-green-700'
      case 'closed':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getFormTypeColor = (formType: string | null) => {
    switch (formType) {
      case 'venta':
        return 'bg-purple-100 text-purple-700'
      case 'alquila-con-nosotros':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando contactos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-accent mb-2">Contactos</h1>
        <p className="text-gray-600">
          Gestiona todos los mensajes recibidos desde los formularios
        </p>
      </div>

      {/* Stats */}
      {contacts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-accent">{contacts.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Nuevas</p>
            <p className="text-2xl font-bold text-blue-600">
              {contacts.filter(c => c.status === 'new').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Contactadas</p>
            <p className="text-2xl font-bold text-green-600">
              {contacts.filter(c => c.status === 'contacted').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Cerradas</p>
            <p className="text-2xl font-bold text-gray-600">
              {contacts.filter(c => c.status === 'closed').length}
            </p>
          </div>
        </div>
      )}

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No hay contactos</h3>
          <p className="text-gray-600">
            Los mensajes de los formularios aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => {
            const isExpanded = expandedId === contact.id
            const isUpdating = updatingId === contact.id

            return (
              <div
                key={contact.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all border border-gray-100"
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : contact.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {contact.full_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(contact.created_at).toLocaleDateString('es-UY', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(contact.status)}`}>
                      {STATUS_LABELS[contact.status] || contact.status}
                    </span>
                    {contact.form_type && (
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getFormTypeColor(contact.form_type)}`}>
                        {FORM_TYPE_LABELS[contact.form_type] || contact.form_type}
                      </span>
                    )}
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Content */}
                {isExpanded && (
                  <div className="px-6 py-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Email */}
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                          Email
                        </p>
                        <a
                          href={`mailto:${contact.email}`}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {contact.email}
                        </a>
                      </div>

                      {/* Teléfono */}
                      {contact.phone ? (
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">
                            Teléfono
                          </p>
                          <a
                            href={`https://api.whatsapp.com/send?phone=${contact.phone.replace(/\D/g, '')}`}
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
                            {contact.phone}
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
                          onClick={() => updateContactStatus(contact.id, 'new')}
                          disabled={isUpdating || contact.status === 'new'}
                          className="p-2 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title="Marcar como nueva"
                        >
                          {isUpdating ? (
                            <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => updateContactStatus(contact.id, 'contacted')}
                          disabled={isUpdating || contact.status === 'contacted'}
                          className="p-2 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title="Marcar como contactada"
                        >
                          {isUpdating ? (
                            <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => updateContactStatus(contact.id, 'closed')}
                          disabled={isUpdating || contact.status === 'closed'}
                          className="p-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title="Marcar como cerrada"
                        >
                          {isUpdating ? (
                            <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                    {/* Mensaje (full width si existe) */}
                    {contact.message && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          Mensaje
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-900 whitespace-pre-wrap">{contact.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Notas internas (full width si existe) */}
                    {contact.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          Notas Internas
                        </p>
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <p className="text-gray-900 whitespace-pre-wrap">{contact.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

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
