"use client";

import { useState } from "react";
import Toast from "@/components/shared/Toast";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

export default function VentaPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Form submitted", formData);
    setIsSubmitting(true);

    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        form_type: "venta",
      };

      console.log("Sending payload:", payload);

      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Response error:", errorData);
        throw new Error(errorData.error || "Error al enviar el mensaje");
      }

      const result = await response.json();
      console.log("Success:", result);

      setToast({
        message: "¡Mensaje enviado exitosamente! Te contactaremos pronto.",
        type: "success",
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setToast({
        message: error instanceof Error ? error.message : "Error al enviar el mensaje. Intenta nuevamente.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Spacer for navbar */}
      <div className="h-20" />

      {/* Header Section */}
      <div className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">
              Oportunidad
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-accent">
              Venta
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Una propuesta única
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Section Title */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-700 mb-3">
                ¿Por qué invertir aquí?
              </h2>
              <p className="text-lg text-gray-600 mb-5">
                Una oportunidad real para quienes buscan un hogar rodeado de
                naturaleza o un negocio rentable con retorno comprobado.
              </p>
              <div className="w-full p-4 bg-primary-50 rounded-lg border border-primary-200">
                <p className="text-sm font-semibold text-primary-700 mb-0.5">
                  Consultas directas
                </p>
                <p className="text-sm text-primary-600">
                  Trato directo con la propietaria. <br /> Precio real, sin
                  sobrevaloraciones ni comisiones de inmobiliaria. <br />
                  Ya sea que busques un lugar para vivir o una inversión segura,
                  te acompañamos en todo el proceso.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left: Sale Information */}
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-bold text-accent uppercase tracking-wide mb-3">
                        Características destacadas
                      </p>
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">
                            Propiedad en venta
                          </p>
                          <p className="text-sm text-gray-600">
                            Lista para disfrutar o comenzar a generar ingresos
                            desde el primer día.
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">
                            Ideal para inversión
                          </p>
                          <p className="text-sm text-gray-600">
                            Negocio de alquiler con alta demanda turística
                            comprobada en la zona. (+100k visitas online)
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">
                            Entorno natural
                          </p>
                          <p className="text-sm text-gray-600">
                            Ubicación privilegiada, rodeada de árboles,
                            tranquilidad y a minutos del mar.
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">
                            Diseño único
                          </p>
                          <p className="text-sm text-gray-600">
                            Construcción sólida, fresca en verano y cálida en
                            invierno, con detalles en piedra y amplios espacios
                            exteriores.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-gray-200 my-2" />

                    <div>
                      <p className="text-sm font-bold text-accent uppercase tracking-wide mb-4">
                        Si estas interesado, te pasamos:
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          📄 PDF con propuesta completa y detalles de la casa
                        </p>
                        <p className="text-sm text-gray-700">
                          📊 Análisis de rentabilidad y retorno real
                        </p>
                        <p className="text-sm text-gray-700">
                          💰 Información sobre ingresos anuales y costos reales
                        </p>
                        <p className="text-sm text-gray-700">
                          💎 Nuestra propuesta "Full Service", con un equipo de
                          trabajo consolidado desde hace +20 años y una cartera
                          de clientes segura.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Contact Form */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-fit">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  Contactanos
                </h3>
                <p className="text-gray-600 mb-6">
                  Completá el formulario y te contactaremos a la brevedad
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre completo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      required
                      placeholder="Tu nombre completo"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>

                  {/* Email y Phone en la misma fila */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        placeholder="tu@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                        placeholder="+598 99 123 456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message (optional) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mensaje adicional (opcional)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={3}
                      placeholder="Cuéntanos qué te interesa saber sobre la propiedad..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-beige py-3 px-6 rounded-lg font-semibold hover:bg-accent/90 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar consulta →"}
                  </button>

                  <p className="text-sm text-gray-600 text-center mt-3">
                    Te responderemos en menos de 24 horas
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
