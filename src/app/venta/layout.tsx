import type { Metadata } from "next";
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'

export const metadata: Metadata = {
  title: "Venta de Propiedades",
  description:
    "Vendé tu propiedad con Casa de Piedra BV. Te ayudamos a vender de forma rápida, segura y al mejor precio. Asesoramiento profesional y gestión completa en Bella Vista, Piriápolis.",
  keywords: [
    "venta propiedad Bella Vista",
    "venta casa Piriápolis",
    "inmobiliaria venta Uruguay",
    "tasación propiedad",
    "vender casa playa",
  ],
  openGraph: {
    title: "Venta de Propiedades | Casa de Piedra BV",
    description:
      "Vendé tu propiedad con nosotros. Asesoramiento profesional, mejor precio de mercado y venta rápida en Bella Vista, Piriápolis.",
  },
};

export default function VentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton phoneNumber="59897105450" />
    </>
  )
}
