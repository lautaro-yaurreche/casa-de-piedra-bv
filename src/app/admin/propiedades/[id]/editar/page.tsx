'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PropertyForm from '@/components/admin/PropertyForm'
import ImageUploader from '@/components/admin/ImageUploader'
import Breadcrumb from '@/components/admin/Breadcrumb'
import Toast from '@/components/shared/Toast'
import type { PropertyFormData } from '@/lib/validations/property'
import type { Property, PropertyImage } from '@/types/property'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
}

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [images, setImages] = useState<PropertyImage[]>([])
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('')
  const [propertyId, setPropertyId] = useState<string>('')
  const [isImagesExpanded, setIsImagesExpanded] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const submitFormRef = React.useRef<HTMLFormElement>(null)

  useEffect(() => {
    const loadProperty = async () => {
      const resolvedParams = await params
      setPropertyId(resolvedParams.id)

      try {
        const response = await fetch(`/api/properties/${resolvedParams.id}`)
        if (!response.ok) throw new Error('Property not found')

        const data = await response.json()
        setProperty(data)
        setImages(data.images || [])
        setFeaturedImageUrl(data.featured_image_url || '')
      } catch (error) {
        console.error('Error loading property:', error)
        setToast({
          message: 'Error al cargar la propiedad. Redirigiendo...',
          type: 'error',
        })
        setTimeout(() => {
          router.push('/admin/propiedades')
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    loadProperty()
  }, [params, router])

  const handleSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `/api/properties/${propertyId}/update`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            images,
            featured_image_url: featuredImageUrl,
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar propiedad')
      }

      setToast({
        message: 'Propiedad actualizada exitosamente',
        type: 'success',
      })

      setTimeout(() => {
        router.push('/admin/propiedades')
      }, 1500)
    } catch (error: any) {
      console.error('Error updating property:', error)
      setToast({
        message: error.message || 'Error al actualizar propiedad. Intenta nuevamente.',
        type: 'error',
      })
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (
      !confirm(
        '¿Estás seguro de que quieres eliminar esta propiedad? Esta acción no se puede deshacer.'
      )
    ) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(
        `/api/properties/${propertyId}/delete`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Error al eliminar propiedad')
      }

      setToast({
        message: 'Propiedad eliminada exitosamente',
        type: 'success',
      })

      setTimeout(() => {
        router.push('/admin/propiedades')
      }, 1500)
    } catch (error) {
      console.error('Error deleting property:', error)
      setToast({
        message: 'Error al eliminar propiedad. Intenta nuevamente.',
        type: 'error',
      })
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Propiedad no encontrada</p>
      </div>
    )
  }

  const handleSaveClick = () => {
    submitFormRef.current?.requestSubmit()
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Propiedades', href: '/admin/propiedades' },
          { label: property.title },
        ]}
        backHref="/admin/propiedades"
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent mb-2">
            Editar propiedad
          </h1>
          <p className="text-gray-600">{property.title}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSaveClick}
            disabled={isSubmitting || isDeleting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Guardar</span>
              </>
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || isSubmitting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Eliminar propiedad"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Eliminar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsImagesExpanded(!isImagesExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <h3 className="text-xl font-bold text-accent">Fotos</h3>
          <svg
            className={`w-5 h-5 transition-transform ${isImagesExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className={`transition-all duration-200 ease-out overflow-hidden ${
          isImagesExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 py-6">
            <ImageUploader
              images={images}
              onChange={setImages}
              featuredImageUrl={featuredImageUrl}
              onFeaturedChange={setFeaturedImageUrl}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <PropertyForm
        ref={submitFormRef}
        property={property}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

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
