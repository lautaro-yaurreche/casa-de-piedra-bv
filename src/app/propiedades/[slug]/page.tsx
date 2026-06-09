import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPropertyBySlug } from "@/lib/db/properties";
import { getBlockedDatesByProperty } from "@/lib/db/blocked-dates";
import PropertyGallery from "@/components/properties/PropertyGallery";
import AmenitiesList from "@/components/properties/AmenitiesList";
import PropertyDetailClient from "./PropertyDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: property } = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Propiedad no encontrada",
    };
  }

  return {
    title: `${property.title} | Casa de Piedra`,
    description: property.meta_description || property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: property.featured_image_url ? [property.featured_image_url] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;

  // Fetch property and blocked dates
  const [propertyResult, blockedDatesResult] = await Promise.all([
    getPropertyBySlug(slug),
    getPropertyBySlug(slug).then((res) =>
      res.data
        ? getBlockedDatesByProperty(res.data.id)
        : { data: null, error: null },
    ),
  ]);

  const property = propertyResult.data;
  const blockedDates = blockedDatesResult.data || [];

  if (!property) {
    notFound();
  }

  // Parse images from JSONB
  const images = property.images || [];
  const amenities = property.amenities || [];

  // Structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    name: property.title,
    description: property.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://casadepiedrabv.com'}/propiedades/${property.slug}`,
    image: property.featured_image_url || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location,
      addressCountry: 'UY',
    },
    geo: property.location === 'Bella Vista' ? {
      '@type': 'GeoCoordinates',
      latitude: -34.8667,
      longitude: -55.3333,
    } : undefined,
    numberOfRooms: property.bedrooms || undefined,
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: property.max_guests,
    },
    amenityFeature: amenities.map((amenity: string) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
    })),
    priceRange: `${property.currency} ${property.price_per_night}`,
    offers: {
      '@type': 'Offer',
      price: property.price_per_night,
      priceCurrency: property.currency,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-gray-50 min-h-screen pt-14">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button + Breadcrumb */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/propiedades"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Volver a Propiedades"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>

          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Inicio
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/propiedades"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Propiedades
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-accent font-semibold">{property.title}</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-accent mb-2">
                {property.title}
              </h1>
              <p className="text-lg text-gray-600 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {property.location} • {property.property_type}
              </p>
            </div>
            {property.is_featured && (
              <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Destacada
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-gray-700">
            {property.bedrooms !== null && (
              <span className="flex items-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">
                  {property.bedrooms}{" "}
                  {property.bedrooms === 1 ? "dormitorio" : "dormitorios"}
                </span>
              </span>
            )}
            {property.bathrooms !== null && (
              <span className="flex items-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2 21h20M6 18V9.5C6 7 8 5 10.5 5S15 7 15 9.5V18M3 18h18v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1z"
                  />
                </svg>
                <span className="font-medium">
                  {property.bathrooms}{" "}
                  {property.bathrooms === 1 ? "baño" : "baños"}
                </span>
              </span>
            )}
            <span className="flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="font-medium">
                Hasta {property.max_guests}{" "}
                {property.max_guests === 1 ? "huésped" : "huéspedes"}
              </span>
            </span>
          </div>
        </div>

        {/* Gallery */}
        {images.length > 0 && (
          <div className="mb-12">
            <PropertyGallery images={images} title={property.title} />
          </div>
        )}

        {/* Fila 1: Descripción + Precio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Descripción */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-accent mb-4">Descripción</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Precio */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-primary-50 to-beige-50 p-8 rounded-2xl border border-primary-200 h-full">
              <h3 className="text-2xl font-bold text-accent mb-4">Precio</h3>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-5xl font-bold text-accent">
                  {property.currency === "USD" ? "$" : property.currency}{" "}
                  {property.price_per_night.toLocaleString()}
                </span>
                <span className="text-xl text-gray-600">/ noche</span>
              </div>
              <p className="text-gray-600">
                El precio final puede variar según temporada y duración de la
                estadía. Consultá para obtener una cotización exacta.
              </p>
            </div>
          </div>
        </div>

        {/* Fila 2: Amenities (full width) */}
        {amenities.length > 0 && (
          <div className="mb-12">
            <AmenitiesList amenities={amenities} />
          </div>
        )}

        {/* Fila 3: Calendario + Consulta */}
        <div>
          <PropertyDetailClient
            property={property}
            blockedDates={blockedDates}
          />
        </div>
      </div>
      </div>
    </>
  );
}
