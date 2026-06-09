import { MetadataRoute } from 'next'
import { getProperties } from '@/lib/db/properties'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://casadepiedrabv.com'

  // Obtener todas las propiedades activas
  const { data: properties } = await getProperties()

  // URLs estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/venta`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/alquila-con-nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // URLs dinámicas de propiedades
  const propertyRoutes: MetadataRoute.Sitemap =
    properties?.map((property) => ({
      url: `${baseUrl}/propiedades/${property.slug}`,
      lastModified: new Date(property.updated_at || property.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || []

  return [...staticRoutes, ...propertyRoutes]
}
