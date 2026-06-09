import type { Metadata } from "next";
import AnalyticsWrapper from "@/components/shared/AnalyticsWrapper";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://casadepiedrabv.com'),
  title: {
    default: "Casa de Piedra BV | Alquiler y Venta en Bella Vista, Piriápolis",
    template: "%s | Casa de Piedra BV",
  },
  description:
    "Alquiler y venta de propiedades en Bella Vista, Piriápolis. Casas y apartamentos a pasos de la playa con todas las comodidades para unas vacaciones perfectas.",
  keywords: [
    "alquiler Bella Vista",
    "alquiler Piriápolis",
    "venta Bella Vista",
    "casas playa Uruguay",
    "alquiler temporada",
    "inmobiliaria Piriápolis",
    "Casa de Piedra",
  ],
  authors: [{ name: "Casa de Piedra BV" }],
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: "/",
    siteName: "Casa de Piedra BV",
    title: "Casa de Piedra BV | Alquiler y Venta en Bella Vista, Piriápolis",
    description:
      "Alquiler y venta de propiedades en Bella Vista, Piriápolis. Casas y apartamentos a pasos de la playa.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Casa de Piedra BV",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa de Piedra BV | Alquiler y Venta en Bella Vista, Piriápolis",
    description:
      "Alquiler y venta de propiedades en Bella Vista, Piriápolis. Casas y apartamentos a pasos de la playa.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen">
        {children}
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
