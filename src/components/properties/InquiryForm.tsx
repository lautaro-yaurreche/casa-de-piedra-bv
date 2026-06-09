"use client";

import { useState } from "react";

interface InquiryFormProps {
  propertyTitle: string;
  propertySlug: string;
  selectedDates?: {
    checkIn: Date | null;
    checkOut: Date | null;
  };
}

export default function InquiryForm({
  propertyTitle,
  propertySlug,
  selectedDates,
}: InquiryFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    guests: 2,
    message: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedDates?.checkIn || !selectedDates?.checkOut) {
      showNotification(
        "Por favor selecciona las fechas de tu estadía en el calendario",
        "error",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // Save to database first
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertySlug,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          checkIn: selectedDates.checkIn.toISOString().split("T")[0],
          checkOut: selectedDates.checkOut.toISOString().split("T")[0],
          guests: formData.guests,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la consulta");
      }

      // WhatsApp temporarily disabled for testing
      // const checkInFormatted = format(selectedDates.checkIn, 'dd/MM/yyyy', {
      //   locale: es,
      // })
      // const checkOutFormatted = format(selectedDates.checkOut, 'dd/MM/yyyy', {
      //   locale: es,
      // })
      // const message = `CONSULTA DE RESERVA...`
      // const success = throttledOpen(whatsappUrl)

      // Clear form and show success
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        guests: 2,
        message: "",
      });
      showNotification(
        "✓ Consulta guardada exitosamente en la base de datos",
        "success",
      );
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      showNotification(
        "Hubo un error al guardar tu consulta. Intenta nuevamente.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-2xl font-bold text-accent mb-2">
          Solicitar disponibilidad
        </h3>
        <p className="text-gray-600 mb-6">
          Completa el formulario y te contactaremos vía WhatsApp
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre y Guests en la misma fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
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

            {/* Guests */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cantidad de huéspedes *
              </label>
              <div className="relative">
                <select
                  value={formData.guests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      guests: parseInt(e.target.value),
                    })
                  }
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "huésped" : "huéspedes"}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
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

            {/* Phone (required) */}
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
              placeholder="¿Alguna pregunta o pedido especial?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-beige py-4 px-6 rounded-lg font-semibold text-lg hover:bg-accent/90 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? "Enviando..." : "Consultar disponibilidad →"}
          </button>

          <p className="text-sm text-gray-600 text-center mt-3">
            Te responderemos en menos de 24 horas
          </p>
        </form>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
          <div
            className={`${
              toastType === "success" ? "bg-green-500" : "bg-red-500"
            } text-white px-6 py-4 rounded-lg shadow-2xl max-w-md`}
          >
            <p className="font-semibold">{toastMessage}</p>
          </div>
        </div>
      )}
    </>
  );
}
