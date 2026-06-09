import { Suspense } from "react";
import {
  getProperties,
  getUniqueLocations,
  getUniquePropertyTypes,
} from "@/lib/db/properties";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFiltersClient from "./PropertyFiltersClient";

export const metadata = {
  title: "Propiedades | Casa de Piedra",
  description:
    "Explora nuestras propiedades disponibles para alquiler en Bella Vista, Piriápolis y más.",
};

export default async function PropiedadesPage() {
  // Fetch data from Supabase
  const [propertiesResult, locationsResult, typesResult] = await Promise.all([
    getProperties(),
    getUniqueLocations(),
    getUniquePropertyTypes(),
  ]);

  const properties = propertiesResult.data || [];
  const locations = locationsResult.data || [];
  const propertyTypes = typesResult.data || [];

  return (
    <div className="bg-gray-50 min-h-screen">
        {/* Spacer for navbar */}
        <div className="h-20" />

        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-14">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-800 mb-3">
              Nuestras propiedades
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-accent">
              Encontrá tu lugar ideal
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Descubrí propiedades únicas con todas las comodidades para unas
              vacaciones perfectas
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
          <Suspense fallback={<LoadingSkeleton />}>
            <PropertyFiltersClient
              initialProperties={properties}
              locations={locations}
              propertyTypes={propertyTypes}
            />
          </Suspense>
        </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div>
      {/* Top Bar Skeleton */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="flex flex-wrap items-center gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded w-24 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="h-64 bg-gray-200 animate-pulse" />
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-full mb-3 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-4 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
