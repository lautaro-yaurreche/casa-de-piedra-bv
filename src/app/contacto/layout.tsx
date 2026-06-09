import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "¿Tenés alguna consulta? Contactanos completando el formulario y te responderemos a la brevedad. Casa de Piedra BV - Alquiler y venta en Bella Vista, Piriápolis.",
  openGraph: {
    title: "Contacto | Casa de Piedra BV",
    description:
      "Contactanos para consultas sobre alquiler y venta de propiedades en Bella Vista, Piriápolis.",
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
