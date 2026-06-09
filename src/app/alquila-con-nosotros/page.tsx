"use client";

import { useState } from "react";
import Toast from "@/components/shared/Toast";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

export default function AlquilaConNosotrosPage() {
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
        form_type: "alquila-con-nosotros",
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
              Maximizá tu inversión
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-accent">
              Alquilá con nosotros
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Generá ingresos con tu propiedad sin complicaciones
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pricing Callout */}
          <div className="mb-8 p-6 bg-primary-50 rounded-xl border-2 border-primary-200 text-center">
            <p className="text-base md:text-lg text-primary-800 font-medium leading-relaxed">
              💰 Vos ponés el precio y recibís el 100%, sin descuentos ni
              comisiones.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Service Information */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="space-y-5">
                  <div>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                      Contamos con un equipo con +20 años de experiencia en el
                      rubro inmobiliario, dedicado a que obtengas el mejor
                      rendimiento de tu propiedad sin perder tiempo.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                      Hacemos un servicio integral y completo: publicidad,
                      negociación, reservas, atención a huéspedes, mantenimiento
                      y entrega/recibo de llaves.
                    </p>
                    <p className="text-lg font-semibold text-primary-700 leading-relaxed">
                      Vos disfrutás de las ganancias, nosotros nos encargamos
                      del resto.
                    </p>
                  </div>

                  <div className="w-full h-px bg-gray-200 my-2" />

                  <div>
                    <p className="text-sm font-bold text-accent uppercase tracking-wide mb-4">
                      Nuestros servicios incluyen:
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        🏖️ Abarcamos tanto alquileres anuales como por
                        temporada.
                      </p>
                      <p className="text-sm text-gray-700">
                        📣 Publicación profesional en las principales
                        plataformas.
                      </p>
                      <p className="text-sm text-gray-700">
                        🗓️ Gestión integral de negociación, reservas y
                        comunicación con los huéspedes.
                      </p>
                      <p className="text-sm text-gray-700">
                        🧹 Supervisión de mantenimiento.
                      </p>
                      <p className="text-sm text-gray-700">
                        📊 Reportes de ingresos y ocupación, con total
                        transparencia.
                      </p>
                      <p className="text-sm text-gray-700">
                        🧾 Cobro y control de pagos, para que recibas tus
                        ganancias sin demoras.
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
                    placeholder="Cuéntanos sobre tu propiedad y qué te gustaría saber..."
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
