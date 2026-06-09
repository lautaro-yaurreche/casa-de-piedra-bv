'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { PropertyImage } from '@/types/property'

interface PropertyGalleryProps {
  images: PropertyImage[]
  title: string
}

export default function PropertyGallery({
  images,
  title,
}: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) =>
          prev !== null ? (prev + 1) % images.length : 0
        )
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + images.length) % images.length : 0
        )
      } else if (e.key === 'Escape') {
        setSelectedIndex(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, images.length])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedIndex])

  if (!images || images.length === 0) {
    return null
  }

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : 0
    )
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : 0
    )
  }

  // Get first 5 images for preview
  const previewImages = images.slice(0, 5)
  const remainingCount = images.length - 5

  return (
    <>
      {/* Gallery Grid - Airbnb Style */}
      <div className="grid grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden">
        {/* Main Image - Left Side (2 rows) */}
        <div
          className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => setSelectedIndex(0)}
        >
          <Image
            src={previewImages[0].url}
            alt={previewImages[0].alt || `${title} - Imagen principal`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:brightness-90 transition-all duration-300"
            priority
          />
        </div>

        {/* Right Side Grid - 4 smaller images (2x2) */}
        {previewImages.slice(1, 5).map((image, index) => {
          const actualIndex = index + 1
          const isLast = actualIndex === 4 && remainingCount > 0

          return (
            <div
              key={actualIndex}
              className="col-span-2 md:col-span-1 relative cursor-pointer group"
              onClick={() => setSelectedIndex(actualIndex)}
            >
              <Image
                src={image.url}
                alt={image.alt || `${title} - Imagen ${actualIndex + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:brightness-90 transition-all duration-300"
              />

              {/* "Ver más" overlay on last image if there are more photos */}
              {isLast && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold">
                    +{remainingCount} {remainingCount === 1 ? 'foto' : 'fotos'}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-colors z-10 flex items-center justify-center"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={handlePrevious}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-colors z-10 flex items-center justify-center"
              aria-label="Imagen anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image Container */}
          <div className="relative w-[90vw] h-[90vh] flex flex-col items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={images[selectedIndex].url}
                alt={
                  images[selectedIndex].alt ||
                  `${title} - Imagen ${selectedIndex + 1}`
                }
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white/90 text-sm font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                {selectedIndex + 1} / {images.length}
              </p>
            </div>
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-colors z-10 flex items-center justify-center"
              aria-label="Siguiente imagen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  )
}
