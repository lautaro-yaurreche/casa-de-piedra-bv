"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { href: "/", label: "Inicio" },
    { href: "/servicios", label: "Actividades y Servicios" },
    { href: "/galeria", label: "Galería" },
    { href: "/venta", label: "Venta" },
    { href: "/alquila-con-nosotros", label: "Alquilá con nosotros" },
  ];

  return (
    <footer className="bg-accent border-t border-accent-600 text-beige py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
              Casa de piedra
            </h3>
            <p className="text-sm text-beige/80 max-w-xs text-center md:text-left">
              Tu refugio perfecto para unas vacaciones inolvidables en un
              entorno único
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h4 className="text-sm font-semibold mb-2 text-beige">
              Navegación
            </h4>
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-beige/80 hover:text-primary-400 hover:opacity-100 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h4 className="text-sm font-semibold mb-2 text-beige">
              Contacto
            </h4>
            <Link
              href="/reservas"
              className="text-sm text-beige/80 hover:text-primary-400 hover:opacity-100 transition-all duration-200"
            >
              Hacer una reserva
            </Link>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-accent-600 text-center space-y-2">
          <p className="text-sm text-beige/90">
            © {currentYear} Casa de piedra. Todos los derechos reservados.
          </p>
          <Link
            href="/admin/login"
            className="text-xs text-beige/80 hover:text-beige transition-colors inline-block"
            aria-label="Acceder al panel de administración"
          >
            Administración
          </Link>
        </div>
      </div>
    </footer>
  );
}
