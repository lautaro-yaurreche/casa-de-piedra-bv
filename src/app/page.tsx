import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/layouts/PublicLayout";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Alquiler y venta de propiedades en Bella Vista, Piriápolis. Encuentra tu casa ideal a pasos de la playa con todas las comodidades para unas vacaciones perfectas.",
  openGraph: {
    title: "Casa de Piedra BV | Alquiler y Venta en Bella Vista",
    description:
      "Alquiler y venta de propiedades en Bella Vista, Piriápolis. Encuentra tu casa ideal a pasos de la playa.",
  },
};

export default function Home() {
  const features = [
    {
      title: "Ubicación privilegiada",
      description:
        "A pasos de la playa, ideal para baño y pesca. Almacén, rotisería y leñería a menos de 1 cuadra. A solo 10 minutos de Piriápolis y 30 minutos de Punta del Este. \n\nEl equilibrio perfecto entre tranquilidad y conexión.",
      icon: "📍",
    },
    {
      title: "Entorno natural y \ntranquilidad total",
      description:
        "Despertá con el sonido de los pájaros, el aire del bosque y el murmullo del mar. \n \nLa casa está rodeada de árboles, cerros y espacios verdes, ideal para reconectar y descansar.",
      icon: "🌿",
    },
    {
      title: "Atención personalizada y \ntrato directo",
      description:
        "Siempre disponible ante cualquier duda o necesidad durante la estadía. \n\nBrindamos un servicio cálido, confiable y con +20 años de experiencia familiar en el rubro.",
      icon: "✨",
    },
    {
      title: "Ideal para inversión",
      description:
        "Rentabilidad comprobada, tenemos +100.000 visitas anuales online y una alta tasa de ocupación. \n\nUna propiedad que combina placer y rentabilidad, con la posibilidad de que la gestionemos por vos",
      icon: "💰",
    },
  ];

  return (
    <PublicLayout>
    <div>
      {/* Hero Section - Full Height with Image Background */}
      <div className="relative h-[70vh] md:h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/hero-background.jpg"
          alt="Casa de Piedra Bella Vista"
          fill
          priority
          quality={90}
          className="object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-[1]" />

        {/* Content */}
        <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 text-center text-white">
            <div>
              <p className="text-lg font-semibold uppercase tracking-wider text-primary-500 mb-2">
                Venta y alquiler
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-shadow-md mb-2">
                Casa de piedra, Bella Vista
              </h1>
              <p className="text-xl md:text-3xl font-medium text-shadow-sm">
                Piriápolis, Maldonado
              </p>
            </div>
            <Link href="/propiedades/casa-de-piedra">
              <Button
                size="lg"
                className="bg-primary text-accent hover:bg-primary/90 px-8 py-6 text-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Reservar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col gap-16">
          {/* Header */}
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-800 mb-3">
              Nuestros Beneficios
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una experiencia única con todas las comodidades.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl shadow-lg text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 whitespace-pre-line">
                  {feature.title}
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
    </PublicLayout>
  );
}
