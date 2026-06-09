# Guía de Desarrollo - Casa de Piedra BV

Este documento contiene las convenciones, mejores prácticas y lineamientos para el desarrollo del proyecto Casa de Piedra.

---

## 🎨 UI/UX - Convenciones de Diseño

### Iconografía
- **NUNCA usar emojis** en la interfaz de usuario
- **SIEMPRE usar iconos SVG** personalizados o de libraries profesionales
- Los iconos deben ser consistentes en tamaño: `w-5 h-5` (20px) para iconos en botones y headers

```tsx
// ❌ MAL
<button>🗑️ Eliminar</button>

// ✅ BIEN
<button>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
</button>
```

### Secciones Collapsables
- Todas las secciones de formularios deben ser collapsables
- Estado inicial: **cerradas/colapsadas** por defecto
- Header con borde inferior para separación visual: `border-b border-gray-100`
- Padding consistente: `px-6 py-6` para contenido, `px-6 py-4` para header
- Icono chevron que rota 180° al expandir

```tsx
<div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
  <button
    type="button"
    onClick={() => toggleSection('sectionName')}
    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-100"
  >
    <h3 className="text-xl font-bold text-accent">Título de Sección</h3>
    <svg
      className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
  {expanded && (
    <div className="px-6 py-6">
      {/* Contenido */}
    </div>
  )}
</div>
```

### Botones y Acciones
- Botones principales arriba a la derecha en el header
- Botones de acción destructiva (eliminar) solo con icono, sin texto
- Botones de guardar/crear con icono + texto
- Estados disabled con `opacity-50` y `cursor-not-allowed`
- Efectos hover: `hover:-translate-y-0.5 hover:shadow-lg`

### Paleta de Colores

```css
/* Colores principales del proyecto */
--primary: #D1B16D;        /* Dorado - color principal */
--secondary: #2F4E56;      /* Teal oscuro */
--accent: #1D1202;         /* Marrón oscuro - textos importantes */
--beige: #E8D9A8;          /* Beige claro - backgrounds */
```

**Uso en Tailwind:**
- `text-accent` - Títulos y textos importantes
- `bg-primary` - Botones principales, badges destacados
- `text-beige` - Texto sobre fondos oscuros
- `bg-accent` - Fondos de botones principales

---

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico
- **Framework:** Next.js 15 (App Router)
- **UI:** Tailwind CSS + shadcn/ui
- **Base de datos:** Supabase (PostgreSQL + Storage)
- **Validación:** Zod + React Hook Form
- **Lenguaje:** TypeScript (strict mode)
- **Animaciones:** Framer Motion (cuando sea necesario)

### Estructura de Carpetas

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (minimal)
│   ├── page.tsx                  # Home/landing
│   ├── admin/                    # Panel admin (protegido)
│   │   ├── layout.tsx            # AdminLayout con sidebar
│   │   ├── page.tsx              # Dashboard
│   │   └── propiedades/          # CRUD propiedades
│   └── propiedades/              # Listado y detalle público
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── shared/                   # Componentes públicos (Navbar, Footer, WhatsApp)
│   ├── properties/               # Componentes de propiedades (públicos)
│   ├── admin/                    # Componentes del panel admin
│   └── layouts/                  # Layout wrappers
│
├── lib/
│   ├── supabase/                 # Configuración Supabase
│   ├── db/                       # Database queries
│   ├── utils/                    # Utilidades (dates, formatting, etc.)
│   └── validations/              # Schemas Zod
│
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript types & interfaces
└── styles/                       # CSS global
```

### Separación Admin vs Público

**Layouts separados:**
- `app/layout.tsx` → Root layout mínimo (solo providers, analytics)
- `components/layouts/PublicLayout.tsx` → Navbar + Footer + WhatsApp
- `app/admin/layout.tsx` → Sidebar de admin (sin navbar/footer público)

**Protección de rutas:**
- Admin protegido con Supabase Auth
- Middleware para verificar sesión

---

## 💻 Convenciones de Código

### React & TypeScript

#### Hooks - Orden y Ubicación
```tsx
// ✅ BIEN - Hooks al principio, antes de cualquier return condicional
function MyComponent() {
  const [state, setState] = useState(initialValue)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    // ...
  }, [])

  // Returns condicionales DESPUÉS de todos los hooks
  if (loading) return <Spinner />
  if (error) return <Error />

  return <div>...</div>
}

// ❌ MAL - Hooks después de returns condicionales
function MyComponent() {
  if (loading) return <Spinner />

  const [state, setState] = useState(initialValue) // ❌ Error de hooks
  return <div>...</div>
}
```

#### Componentes con Referencias (forwardRef)
```tsx
import { forwardRef } from 'react'

interface Props {
  // props...
}

const MyComponent = forwardRef<HTMLFormElement, Props>(
  function MyComponent({ prop1, prop2 }, ref) {
    return <form ref={ref}>...</form>
  }
)

export default MyComponent
```

#### Client vs Server Components
```tsx
// Client components (interactividad, hooks, estado)
'use client'

import { useState } from 'react'

export default function InteractiveComponent() {
  const [count, setCount] = useState(0)
  // ...
}

// Server components (por defecto en App Router)
// No necesitan 'use client'
export default async function ServerComponent() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

### Validación de Formularios

**Siempre usar Zod + React Hook Form:**

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres'),
  price: z.number().min(0, 'Debe ser mayor a 0'),
})

type FormData = z.infer<typeof schema>

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    // ...
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <p className="text-red-600">{errors.title.message}</p>}
    </form>
  )
}
```

### Estilos con Tailwind

**Clases inline, no archivos CSS separados (excepto globals.css):**

```tsx
// ✅ BIEN
<button className="bg-accent text-beige px-6 py-2 rounded-lg hover:bg-accent/90 transition-all">
  Click me
</button>

// ❌ MAL - No crear archivos CSS separados para componentes
// button.module.css
```

**Responsive con mobile-first:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Móvil: 1 columna, Tablet: 2, Desktop: 3 */}
</div>
```

### Nomenclatura

- **Componentes:** PascalCase (`PropertyCard.tsx`)
- **Archivos utils:** camelCase (`formatCurrency.ts`)
- **Constantes:** UPPER_SNAKE_CASE (`const MAX_IMAGES = 10`)
- **Variables/funciones:** camelCase (`const handleSubmit = () => {}`)

### Comentarios

- Comentarios en **español**
- Solo cuando sea necesario explicar lógica compleja
- No comentar código obvio

```tsx
// ✅ BIEN
// Auto-generar slug desde título solo para propiedades nuevas
const slug = title.toLowerCase().normalize('NFD')...

// ❌ MAL
// Esta función suma dos números
const add = (a, b) => a + b
```

---

## 🗄️ Base de Datos (Supabase)

### Convenciones de Tablas

- Nombres en **singular** en inglés: `properties`, `blocked_dates`, `inquiries`
- Siempre incluir: `id` (UUID), `created_at`, `updated_at`
- Foreign keys con `ON DELETE CASCADE` cuando corresponda
- Indexes en columnas filtradas frecuentemente

### Row Level Security (RLS)

- **SIEMPRE activar RLS** en tablas sensibles
- Público puede leer datos activos: `is_active = true`
- Solo usuarios autenticados pueden escribir

```sql
-- Ejemplo: Properties
CREATE POLICY "Public can view active properties"
  ON properties FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated can manage all"
  ON properties FOR ALL
  USING (auth.role() = 'authenticated');
```

### Supabase Storage

- Bucket público: `properties-images`
- Estructura: `{property-id}/{filename}.webp`
- Max file size: 5MB
- Tipos permitidos: `image/jpeg`, `image/png`, `image/webp`

---

## 🔒 Autenticación y Seguridad

### Supabase Auth

- Single admin user (email + password)
- Sesión persistente con cookies
- No exponer `SUPABASE_SERVICE_ROLE_KEY` en frontend

### Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # Solo backend
```

---

## 📝 Git & Commits

### Commits

- Mensajes descriptivos en español
- Formato: `tipo: descripción breve`
- Ejemplos:
  - `feat: agregar secciones collapsables al formulario`
  - `fix: resolver error de hooks en EditPropertyPage`
  - `refactor: migrar emojis a iconos SVG`
  - `style: mejorar separación visual en headers`

### Co-authored

```bash
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### NO hacer:
- ❌ Commits automáticos sin permiso del usuario
- ❌ Force push a main/master
- ❌ Modificar .gitignore sin consultar

---

## 🚀 Performance

### Next.js Image

- **SIEMPRE usar** `next/image` para imágenes
- Configurar `remotePatterns` en `next.config.ts`
- Usar `fill` + `object-cover` para aspectos dinámicos

```tsx
<Image
  src={imageUrl}
  alt={description}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Dynamic Imports

- Solo usar cuando sea absolutamente necesario
- Preferir imports estáticos para mejor performance

---

## 🧪 Testing & QA

### Antes de hacer commit:

1. Verificar que no hay errores de TypeScript
2. Probar en Chrome y Safari
3. Verificar responsive (móvil, tablet, desktop)
4. Probar formularios y validaciones
5. Verificar que no se rompió funcionalidad existente

---

## 📋 Checklist de Nuevas Features

Antes de considerar una feature completa:

- [ ] Funciona en mobile, tablet y desktop
- [ ] No hay errores en consola
- [ ] TypeScript compila sin errores
- [ ] Iconos SVG (no emojis)
- [ ] Validación con Zod (si es formulario)
- [ ] Estados de loading y error manejados
- [ ] Accesibilidad básica (labels, alt texts)
- [ ] Colores según paleta del proyecto
- [ ] Código comentado donde sea necesario (en español)

---

## 🎯 Principios de Diseño

1. **Mobile-first:** Diseñar primero para móvil, luego adaptar a desktop
2. **Consistencia:** Mismos patrones, colores y espaciados en todo el proyecto
3. **Simplicidad:** Interfaces limpias sin elementos innecesarios
4. **Feedback:** Siempre mostrar estados (loading, success, error)
5. **Accesibilidad:** Textos legibles, contraste adecuado, navegación clara

---

## 📚 Recursos

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase Docs](https://supabase.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

**Última actualización:** 2026-03-09
