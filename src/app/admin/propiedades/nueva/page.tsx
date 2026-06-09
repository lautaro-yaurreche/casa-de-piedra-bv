'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PropertyForm from '@/components/admin/PropertyForm'
import ImageUploader from '@/components/admin/ImageUploader'
import Breadcrumb from '@/components/admin/Breadcrumb'
import Toast from '@/components/shared/Toast'
import type { PropertyFormData } from '@/lib/validations/property'
import type { PropertyImage } from '@/types/property'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
}

export default function NewPropertyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<PropertyImage[]>([])
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('')
  const [isImagesExpanded, setIsImagesExpanded] = useState(false)
  const [imageError, setImageError] = useState<string>('')
  const [toast, setToast] = useState<ToastState | null>(null)
  const submitFormRef = React.useRef<HTMLFormElement>(null)

  // Limpiar error cuando cambia el número de imágenes
  useEffect(() => {
    if (images.length >= 5 && imageError) {
      setImageError('')
    }
  }, [images.length, imageError])

  const handleSaveClick = () => {
    submitFormRef.current?.requestSubmit()
  }

  const handleSubmit = async (data: PropertyFormData) => {
    // Validar que haya al menos 5 fotos
    if (images.length < 5) {
      setImageError('Debes agregar al menos 5 fotos')
      setIsImagesExpanded(true)
      setToast({
        message: 'Debes agregar al menos 5 fotos para crear la propiedad',
        type: 'error',
      })
      // Scroll a la sección de fotos
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setImageError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/properties/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          images,
          featured_image_url: featuredImageUrl,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear propiedad')
      }

      setToast({
        message: 'Propiedad creada exitosamente',
        type: 'success',
      })

      // Redirect after showing success toast
      setTimeout(() => {
        router.push('/admin/propiedades')
      }, 1500)
    } catch (error: any) {
      console.error('Error creating property:', error)
      setToast({
        message: error.message || 'Error al crear propiedad. Intenta nuevamente.',
        type: 'error',
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Propiedades', href: '/admin/propiedades' },
          { label: 'Nueva propiedad' },
        ]}
        backHref="/admin/propiedades"
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-accent mb-2">Nueva propiedad</h1>
          <p className="text-gray-600">
            Completa la información para agregar una nueva propiedad
          </p>
        </div>
        <button
          onClick={handleSaveClick}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              <span>Creando...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Crear</span>
            </>
          )}
        </button>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsImagesExpanded(!isImagesExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-accent">Fotos *</h3>
            <span className="text-sm text-gray-600">
              ({images.length}/5 mínimo)
            </span>
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${isImagesExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {imageError && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-100">
            <p className="text-red-600 text-sm font-semibold">{imageError}</p>
          </div>
        )}
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
      <PropertyForm ref={submitFormRef} onSubmit={handleSubmit} isSubmitting={isSubmitting} />

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
