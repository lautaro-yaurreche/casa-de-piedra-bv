'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import type { PropertyImage } from '@/types/property'

interface ImageUploaderProps {
  images: PropertyImage[]
  onChange: (images: PropertyImage[]) => void
  featuredImageUrl?: string | null
  onFeaturedChange: (url: string) => void
}

export default function ImageUploader({
  images,
  onChange,
  featuredImageUrl,
  onFeaturedChange,
}: ImageUploaderProps) {
  const [isDraggingUpload, setIsDraggingUpload] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const newImages: PropertyImage[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Create a data URL for preview
        const reader = new FileReader()
        const dataUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })

        newImages.push({
          url: dataUrl,
          order: images.length + i,
          alt: file.name.replace(/\.[^/.]+$/, ''),
        })
      }

      const updatedImages = [...images, ...newImages].map((img, idx) => ({
        ...img,
        order: idx,
      }))

      onChange(updatedImages)

      // Always set first image as featured
      if (updatedImages.length > 0) {
        onFeaturedChange(updatedImages[0].url)
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      // El error se maneja silenciosamente ya que es muy raro
      // Si se necesita notificación, el componente padre puede verificar el estado
    } finally {
      setUploading(false)
    }
  }

  const handleUploadDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingUpload(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleUploadDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingUpload(true)
  }

  const handleUploadDragLeave = () => {
    setIsDraggingUpload(false)
  }

  const removeImage = (index: number) => {
    const updatedImages = images
      .filter((_, i) => i !== index)
      .map((img, idx) => ({ ...img, order: idx }))

    onChange(updatedImages)

    // Always set first image as featured
    if (updatedImages.length > 0) {
      onFeaturedChange(updatedImages[0].url)
    } else {
      onFeaturedChange('')
    }
  }

  // Drag and drop para reordenar
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDragOverIndex(null)
      return
    }

    const newImages = [...images]
    const [draggedImage] = newImages.splice(draggedIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)

    const reordered = newImages.map((img, idx) => ({ ...img, order: idx }))
    onChange(reordered)

    // Always set first image as featured
    if (reordered.length > 0) {
      onFeaturedChange(reordered[0].url)
    }

    setDragOverIndex(null)
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDrop={handleUploadDrop}
        onDragOver={handleUploadDragOver}
        onDragLeave={handleUploadDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDraggingUpload
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-semibold text-gray-900 mb-2">
          {uploading ? 'Subiendo imágenes...' : 'Arrastra imágenes aquí'}
        </p>
        <p className="text-sm text-gray-600">
          o haz click para seleccionar archivos
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Soporta múltiples imágenes (JPG, PNG, WebP)
        </p>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">
              Imágenes ({images.length})
            </h4>
            <p className="text-sm text-gray-600">
              Arrastra para reordenar · La primera es la destacada
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleImageDrop(e, index)}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-move ${
                  draggedIndex === index
                    ? 'opacity-50 scale-95'
                    : dragOverIndex === index
                    ? 'border-primary-500 scale-105'
                    : 'border-gray-200 hover:border-primary-400'
                }`}
              >
                <div className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Delete Button - Top Right */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(index)
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 z-10"
                  title="Eliminar imagen"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                {/* Order Number & Featured Badge */}
                <div className="absolute top-2 left-2 flex gap-2">
                  <div className="bg-black/70 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>
                  {index === 0 && (
                    <div className="bg-primary text-white p-1.5 rounded-full">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
