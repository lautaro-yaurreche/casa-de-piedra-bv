import Link from 'next/link'
import { getPropertyById } from '@/lib/db/properties'
import { getBlockedDatesByProperty } from '@/lib/db/blocked-dates'
import Breadcrumb from '@/components/admin/Breadcrumb'
import DateBlockerClient from './DateBlockerClient'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function PropertyAvailabilityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [propertyResult, blockedDatesResult] = await Promise.all([
    getPropertyById(id),
    getBlockedDatesByProperty(id),
  ])

  const property = propertyResult.data
  const blockedDates = blockedDatesResult.data || []

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Propiedad no encontrada</p>
        <Link
          href="/admin/propiedades"
          className="text-primary-600 hover:text-primary-700"
        >
          Volver a propiedades
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Propiedades', href: '/admin/propiedades' },
          { label: property.title, href: `/admin/propiedades/${property.id}/editar` },
          { label: 'Disponibilidad' },
        ]}
        backHref="/admin/propiedades"
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-accent mb-2">
          Gestión de disponibilidad
        </h1>
        <p className="text-gray-600">
          Bloquea o desbloquea fechas para esta propiedad
        </p>
      </div>

      {/* DateBlocker */}
      <DateBlockerClient
        propertyId={property.id}
        initialBlockedDates={blockedDates}
      />
    </div>
  )
}
