import { getProperties } from "@/lib/db/properties";
import { createClient } from "@/lib/supabase/server";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | Admin Panel",
  description: "Panel administrativo de Casa de Piedra",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch stats
  const [propertiesResult, inquiriesResult, contactsResult] = await Promise.all(
    [
      getProperties(),
      supabase.from("inquiries").select("*", { count: "exact", head: true }),
      supabase.from("contacts").select("*", { count: "exact", head: true }),
    ],
  );

  const totalProperties = propertiesResult.data?.length || 0;
  const activeProperties =
    propertiesResult.data?.filter((p) => p.is_active).length || 0;
  const totalInquiries = inquiriesResult.count || 0;
  const totalContacts = contactsResult.count || 0;

  // Get recent inquiries
  const { data: recentInquiries } = await supabase
    .from("inquiries")
    .select("*, properties(title)")
    .order("created_at", { ascending: false })
    .limit(5);

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      rejected: 'Rechazada',
    }
    return labels[status as keyof typeof labels] || status
  }

  const stats = [
    {
      title: "Propiedades",
      value: totalProperties,
      subtitle: `${activeProperties} activas`,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      color: "bg-blue-500",
    },
    {
      title: "Consultas",
      value: totalInquiries,
      subtitle: "Total de consultas",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      ),
      color: "bg-green-500",
    },
    {
      title: "Contactos",
      value: totalContacts,
      subtitle: "Formularios recibidos",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      color: "bg-purple-500",
    },
    {
      title: "Ocupación",
      value: "78%",
      subtitle: "Promedio mensual",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-accent mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Bienvenido al panel administrativo de Casa de Piedra
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}
              >
                {stat.icon}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-accent mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-accent">
              Consultas recientes
            </h2>
            <a
              href="/admin/consultas"
              className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
            >
              Ver todas →
            </a>
          </div>

          {recentInquiries && recentInquiries.length > 0 ? (
            <div className="space-y-4">
              {recentInquiries.map((inquiry: any) => (
                <div
                  key={inquiry.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {inquiry.full_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {inquiry.properties?.title || "Propiedad eliminada"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        inquiry.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : inquiry.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {getStatusLabel(inquiry.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(inquiry.check_in).toLocaleDateString("es-UY")}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {inquiry.guests}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay consultas recientes</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-accent mb-6">
            Acciones rápidas
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/propiedades/nueva"
              className="flex items-center gap-3 p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-primary-700">
                  Nueva propiedad
                </p>
                <p className="text-sm text-gray-600">
                  Agregar una propiedad al sistema
                </p>
              </div>
            </a>

            <a
              href="/admin/propiedades"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Gestionar propiedades
                </p>
                <p className="text-sm text-gray-600">
                  Ver, editar y administrar propiedades
                </p>
              </div>
            </a>

            <a
              href="/admin/consultas"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ver consultas</p>
                <p className="text-sm text-gray-600">
                  Revisar consultas de reserva
                </p>
              </div>
            </a>

            <a
              href="/admin/contactos"
              className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ver contactos</p>
                <p className="text-sm text-gray-600">
                  Revisar mensajes de formularios
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
