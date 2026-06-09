import type { Metadata } from "next";
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import WhatsAppButton from '@/components/shared/WhatsAppButton'

export const metadata: Metadata = {
  title: "Alquilá con Nosotros",
  description:
    "Maximizá los ingresos de tu propiedad con nuestra gestión profesional. Nos encargamos de todo: limpieza, mantenimiento, atención a huéspedes y más. Casa de Piedra BV.",
  keywords: [
    "alquilar propiedad Bella Vista",
    "gestión alquiler turístico",
    "administración propiedad Uruguay",
    "renta vacacional",
    "alquiler temporada Piriápolis",
  ],
  openGraph: {
    title: "Alquilá con Nosotros | Casa de Piedra BV",
    description:
      "Maximizá los ingresos de tu propiedad. Gestión completa, máxima rentabilidad y atención 24/7 para propietarios en Bella Vista, Piriápolis.",
  },
};

export default function AlquilaConNosotrosLayout({
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
