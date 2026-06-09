# 🏗️ Plan de Revamp: Casa de Piedra → Plataforma Multi-Property

**Fecha:** 2026-03-03
**Estimación:** ~50 horas
**Aproximación:** Full Refactor Moderno
**Status:** Listo para implementación

---

## 📋 Tabla de Contenidos

1. [Contexto](#contexto)
2. [Decisiones de Arquitectura](#decisiones-de-arquitectura)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Database Schema](#database-schema)
5. [Estructura de Archivos](#estructura-de-archivos)
6. [Componentes y Migración](#componentes-y-migración)
7. [Fases de Implementación](#fases-de-implementación)
8. [Estimación Detallada](#estimación-detallada)
9. [Archivos Críticos](#archivos-críticos)
10. [Verificación y Testing](#verificación-y-testing)
11. [Future Features (Post-MVP)](#future-features-post-mvp)

---

## 🎯 Contexto

### ¿Por qué este revamp?

**Estado actual:**
- Landing page **single-property** (Casa de Piedra, Bella Vista)
- Todo el contenido está **hardcodeado** en componentes
- Sin base de datos → imposible escalar
- Sin panel administrativo → cambios requieren deploy
- Google Calendar como única fuente de verdad (sin persistencia de reservas)

**Necesidad:**
- Convertir a plataforma **multi-property** escalable
- Permitir gestión dinámica de propiedades sin tocar código
- Panel admin con CRUD completo
- Modernizar stack (Chakra UI → Tailwind + shadcn/ui)
- Reducir bundle size y mejorar performance

**Resultado esperado:**
Una mini-inmobiliaria web moderna, mantenible y escalable, con costo $0 de infraestructura (Vercel Free + Supabase Free).

---

## 🏛️ Decisiones de Arquitectura

### Aproximación seleccionada: **Full Refactor Moderno**

| Aspecto | Decisión | Justificación |
|---------|----------|---------------|
| **UI Framework** | Migrar a **Tailwind + shadcn/ui** | Bundle 85% más ligero, más flexible, mejor DX |
| **Estrategia** | **Refactor in-place** | Proyecto pequeño, no requiere feature flags |
| **Calendario** | **Solo base de datos** (sin Google Calendar) | Control total, mejor performance, evita dependencias externas |
| **Autenticación** | **Single admin** (Supabase Auth) | Simplifica el modelo, solo el owner gestiona propiedades |
| **Reservas** | **Disponibilidad + WhatsApp** | Sin pagos online, admin bloquea fechas manualmente |
| **Imágenes** | **Supabase Storage** | Múltiples imágenes por propiedad, imagen destacada, escalable |
| **Filtros** | Ubicación, tipo, precio, disponibilidad | Set completo para UX profesional |

### Qué se mantiene del código actual

✅ **Lógica reutilizable:**
- `useWhatsAppThrottle` hook → copiar sin cambios
- Date utilities y cálculo de noches → adaptar de `ReservationCalendar`
- Email templates estructura → migrar a Supabase-aware
- TypeScript interfaces → expandir (no reescribir)
- Next.js config → ajustes menores
- Paleta de colores del theme → mantener identidad visual

❌ **Código a reescribir:**
- Todos los componentes Chakra UI → shadcn/ui + Tailwind
- Todas las páginas → nuevas dinámicas con data de Supabase
- APIs → agregar context de propiedades
- Navbar/Footer → flexibles para multi-property

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 15 (App Router) ✅ *mantener*
- **UI Library:** **shadcn/ui** (componentes) + **Tailwind CSS** 🆕
- **Animaciones:** Framer Motion ✅ *mantener*
- **Forms:** React Hook Form + Zod 🆕
- **Date handling:** date-fns ✅ *mantener*
- **Icons:** Lucide React 🆕
- **TypeScript:** ✅ *mantener*

### Backend / BaaS
- **Base de datos:** Supabase (PostgreSQL) 🆕
- **Autenticación:** Supabase Auth 🆕
- **Storage:** Supabase Storage 🆕
- **APIs:** Next.js API Routes ✅ *expandir*

### Hosting & Deploy
- **Hosting:** Vercel Free ✅ *mantener*
- **Analytics:** Vercel Analytics ✅ *mantener*
- **Dominio:** Cliente ya lo tiene ✅

### Integraciones
- **Comunicación:** WhatsApp Web API ✅ *mantener*
- **Email (opcional):** Nodemailer o Resend

---

## 🗄️ Database Schema

### Supabase Tables

#### **properties**
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Básico
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,

  -- Clasificación
  location VARCHAR(100) NOT NULL,  -- ej: "Bella Vista", "Piriápolis"
  property_type VARCHAR(50) NOT NULL,  -- "casa", "apartamento", "cabaña"

  -- Pricing
  price_per_night DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',

  -- Capacidad
  max_guests INTEGER NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,

  -- Media
  featured_image_url TEXT,  -- Imagen principal
  images JSONB,  -- Array de URLs: [{ url, order, alt }]

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,

  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,

  -- Servicios/Amenities (array de strings)
  amenities JSONB  -- ["wifi", "parking", "pool", "bbq", ...]
);

CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_is_active ON properties(is_active);
```

#### **blocked_dates**
```sql
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,

  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  reason VARCHAR(100),  -- "reserva", "mantenimiento", "bloqueado"
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID,  -- Admin user (Supabase Auth)

  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

CREATE INDEX idx_blocked_dates_property ON blocked_dates(property_id);
CREATE INDEX idx_blocked_dates_range ON blocked_dates(start_date, end_date);
```

#### **contacts**
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Form data
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,

  -- Context
  form_type VARCHAR(50),  -- "contact", "venta", "alquila-con-nosotros"
  property_id UUID REFERENCES properties(id),  -- nullable

  -- Tracking
  status VARCHAR(50) DEFAULT 'new',  -- "new", "contacted", "closed"
  notes TEXT
);

CREATE INDEX idx_contacts_created ON contacts(created_at DESC);
CREATE INDEX idx_contacts_status ON contacts(status);
```

#### **inquiries** (consultas de reserva)
```sql
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),

  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,

  -- Usuario
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),

  -- Fechas
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL,

  -- Status
  status VARCHAR(50) DEFAULT 'pending',  -- "pending", "confirmed", "rejected"
  notes TEXT,

  -- Tracking
  contacted_at TIMESTAMPTZ,
  whatsapp_sent BOOLEAN DEFAULT false
);

CREATE INDEX idx_inquiries_property ON inquiries(property_id);
CREATE INDEX idx_inquiries_dates ON inquiries(check_in, check_out);
CREATE INDEX idx_inquiries_status ON inquiries(status);
```

### Supabase Storage Buckets

```
properties-images/
  ├── {property-id}/
  │   ├── featured.jpg
  │   ├── 01-living.jpg
  │   ├── 02-bedroom.jpg
  │   └── ...
```

**Configuración:**
- Public bucket (URLs públicas)
- Max file size: 5MB
- Allowed types: image/jpeg, image/png, image/webp
- Transformations: Supabase Image CDN (resize on-the-fly)

### Row Level Security (RLS)

```sql
-- Properties: público puede leer activas, solo admin puede escribir
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active properties"
  ON properties FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated can manage all properties"
  ON properties FOR ALL
  USING (auth.role() = 'authenticated');

-- Similar para blocked_dates, contacts, inquiries
```

---

## 📁 Estructura de Archivos

```
casa-de-piedra-bv/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Home/landing
│   │   │
│   │   ├── propiedades/
│   │   │   ├── page.tsx                  # Listado con filtros
│   │   │   └── [slug]/
│   │   │       ├── page.tsx              # Detalle propiedad
│   │   │       ├── layout.tsx            # Layout con breadcrumbs
│   │   │       └── galeria/page.tsx      # Galería fullscreen (opcional)
│   │   │
│   │   ├── contacto/page.tsx             # Formulario contacto
│   │   ├── venta/page.tsx                # Info venta (mantener)
│   │   ├── alquila-con-nosotros/page.tsx # Info para propietarios
│   │   │
│   │   ├── admin/
│   │   │   ├── layout.tsx                # Auth guard
│   │   │   ├── page.tsx                  # Dashboard
│   │   │   ├── propiedades/
│   │   │   │   ├── page.tsx              # Lista admin
│   │   │   │   ├── nueva/page.tsx        # Crear propiedad
│   │   │   │   └── [id]/
│   │   │   │       ├── editar/page.tsx   # Editar propiedad
│   │   │   │       └── disponibilidad/page.tsx  # Gestionar fechas
│   │   │   ├── consultas/page.tsx        # Ver inquiries
│   │   │   └── contactos/page.tsx        # Ver contacts
│   │   │
│   │   └── api/
│   │       ├── properties/
│   │       │   ├── route.ts              # GET list, POST create
│   │       │   └── [id]/route.ts         # GET, PATCH, DELETE
│   │       ├── blocked-dates/
│   │       │   ├── route.ts              # GET by property, POST
│   │       │   └── [id]/route.ts         # DELETE
│   │       ├── inquiries/route.ts        # POST nueva consulta
│   │       ├── contacts/route.ts         # POST contacto
│   │       └── upload/route.ts           # Upload imagen a Supabase
│   │
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── calendar.tsx
│   │   │   └── ...
│   │   │
│   │   ├── shared/                       # Compartidos públicos
│   │   │   ├── Navbar.tsx                # Nav multi-property
│   │   │   ├── Footer.tsx                # Footer
│   │   │   ├── WhatsAppButton.tsx        # Botón flotante
│   │   │   └── AnalyticsWrapper.tsx      # Vercel Analytics
│   │   │
│   │   ├── properties/                   # Componentes de propiedades
│   │   │   ├── PropertyCard.tsx          # Card en listado
│   │   │   ├── PropertyFilters.tsx       # Filtros sidebar/top
│   │   │   ├── PropertyGallery.tsx       # Galería de imágenes
│   │   │   ├── AvailabilityCalendar.tsx  # Calendario disponibilidad
│   │   │   ├── InquiryForm.tsx           # Form consulta de reserva
│   │   │   └── AmenitiesList.tsx         # Lista de servicios
│   │   │
│   │   └── admin/                        # Componentes admin
│   │       ├── PropertyForm.tsx          # CRUD propiedad
│   │       ├── ImageUploader.tsx         # Upload múltiple
│   │       ├── DateBlocker.tsx           # UI para bloquear fechas
│   │       ├── InquiriesTable.tsx        # Tabla consultas
│   │       └── StatsCards.tsx            # Dashboard metrics
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                 # Supabase client (browser)
│   │   │   ├── server.ts                 # Supabase server client
│   │   │   └── middleware.ts             # Auth middleware
│   │   │
│   │   ├── db/                           # Database queries
│   │   │   ├── properties.ts             # CRUD propiedades
│   │   │   ├── blocked-dates.ts          # CRUD fechas
│   │   │   ├── inquiries.ts              # Consultas
│   │   │   └── contacts.ts               # Contactos
│   │   │
│   │   ├── utils/
│   │   │   ├── dates.ts                  # Helpers fecha (reutilizar date-fns)
│   │   │   ├── validation.ts             # Schemas Zod
│   │   │   ├── formatting.ts             # Format currency, etc.
│   │   │   └── whatsapp.ts               # URL builder WhatsApp
│   │   │
│   │   └── email.ts                      # Email templates (mantener)
│   │
│   ├── hooks/
│   │   ├── useWhatsAppThrottle.ts        # ✅ Copiar tal cual
│   │   ├── useProperties.ts              # Fetch propiedades
│   │   ├── useAvailability.ts            # Check disponibilidad
│   │   └── useAuth.ts                    # Admin auth state
│   │
│   ├── types/
│   │   ├── database.ts                   # Tipos Supabase (auto-gen)
│   │   ├── property.ts                   # Domain types
│   │   ├── inquiry.ts
│   │   └── api.ts                        # API responses
│   │
│   └── styles/
│       └── globals.css                   # Tailwind + custom
│
├── public/
│   ├── images/                           # Imágenes estáticas (logos, etc.)
│   └── ...
│
├── supabase/
│   ├── migrations/                       # SQL migrations
│   └── seed.sql                          # Data inicial (Casa de Piedra)
│
├── docs/
│   └── plans/
│       └── 2026-03-03-revamp-design.md   # Este documento
│
├── .env.local
├── components.json                       # shadcn/ui config
├── tailwind.config.ts                    # Tailwind config
└── ...
```

---

## 🔄 Componentes y Migración

### Matriz de Migración

| Componente actual | Acción | Nuevo componente | Framework |
|------------------|--------|------------------|-----------|
| `Navbar.tsx` | Reescribir | `components/shared/Navbar.tsx` | shadcn/ui + Tailwind |
| `Footer.tsx` | Reescribir | `components/shared/Footer.tsx` | shadcn/ui + Tailwind |
| `ReservationCalendar.tsx` | Adaptar lógica | `components/properties/AvailabilityCalendar.tsx` | shadcn/ui Calendar + lógica reutilizada |
| `WhatsAppButton.tsx` | Migrar | `components/shared/WhatsAppButton.tsx` | Tailwind (mismo concepto) |
| `AnalyticsWrapper.tsx` | Copiar | `components/shared/AnalyticsWrapper.tsx` | Sin cambios |

### Nuevos Componentes a Crear

**Públicos:**
- `PropertyCard` - Card en listado
- `PropertyFilters` - Sidebar/top con filtros
- `PropertyGallery` - Lightbox galería
- `AvailabilityCalendar` - Muestra disponibilidad
- `InquiryForm` - Form consulta de reserva
- `AmenitiesList` - Grid de servicios

**Admin:**
- `PropertyForm` - CRUD completo (Zod validation)
- `ImageUploader` - Drag & drop múltiple
- `DateBlocker` - UI para bloquear fechas
- `InquiriesTable` - Tabla con paginación
- `StatsCards` - Métricas dashboard

**shadcn/ui base (instalar):**
```bash
npx shadcn@latest init
npx shadcn@latest add button card input select dialog calendar dropdown-menu table toast form
```

---

## 🚀 Fases de Implementación

### **Fase 0: Setup (3-4h)**
- [ ] Crear proyecto Supabase
- [ ] Configurar database schema (ejecutar migrations)
- [ ] Setup Supabase client en Next.js
- [ ] Instalar y configurar Tailwind CSS
- [ ] Instalar shadcn/ui y componentes base
- [ ] Configurar Zod para validación
- [ ] Seed inicial: agregar Casa de Piedra como primera propiedad

**Entregables:**
- Supabase conectado
- DB con schema completo
- Tailwind funcionando
- shadcn/ui configurado
- Casa de Piedra en DB

---

### **Fase 1: Componentes Base (6-8h)**

#### 1.1 Migrar Navbar y Footer
- [ ] `components/shared/Navbar.tsx` con Tailwind
- [ ] `components/shared/Footer.tsx`
- [ ] Responsive (mobile menu con shadcn Sheet)
- [ ] Links dinámicos

#### 1.2 shadcn/ui Components Setup
- [ ] `components/ui/*` (button, card, input, etc.)
- [ ] Theme personalizado (colores de Casa de Piedra)

#### 1.3 Componentes Reutilizables
- [ ] `WhatsAppButton` migrado a Tailwind
- [ ] `AnalyticsWrapper` copiado
- [ ] Crear `lib/utils/whatsapp.ts` (reutilizar lógica)
- [ ] Migrar `useWhatsAppThrottle` hook

**Entregables:**
- Layout base funcional (Navbar + Footer)
- Componentes UI base listos
- WhatsApp funcionando

---

### **Fase 2: Página Home + Layout (4-5h)**

- [ ] `app/layout.tsx` → root layout con providers
- [ ] `app/page.tsx` → landing/hero dinámico
- [ ] Hero con imagen de fondo (mantener estética actual)
- [ ] Grid de features (reutilizar concepto actual)
- [ ] CTA a `/propiedades`
- [ ] SEO metadata

**Entregables:**
- Home funcional y responsive
- Hero atractivo
- CTA a listado de propiedades

---

### **Fase 3: Listado de Propiedades (6-8h)**

#### 3.1 Backend
- [ ] API `/api/properties/route.ts` (GET with filters)
- [ ] `lib/db/properties.ts` (queries Supabase)
- [ ] Tipos TypeScript desde DB

#### 3.2 Frontend
- [ ] `app/propiedades/page.tsx` → listado con grid
- [ ] `components/properties/PropertyCard.tsx` → card con imagen, precio, ubicación
- [ ] `components/properties/PropertyFilters.tsx` → filtros (ubicación, tipo, precio, fechas)
- [ ] Client-side filtering (state con useState)
- [ ] Paginación simple (opcional, si >10 propiedades)

**Entregables:**
- Listado funcional con filtros
- Cards atractivos
- Performance optimizada

---

### **Fase 4: Detalle de Propiedad (8-10h)**

#### 4.1 Backend
- [ ] API `/api/properties/[id]/route.ts` (GET by slug)
- [ ] API `/api/blocked-dates/route.ts` (GET by property)
- [ ] `lib/db/blocked-dates.ts`

#### 4.2 Frontend
- [ ] `app/propiedades/[slug]/page.tsx`
- [ ] `components/properties/PropertyGallery.tsx` → lightbox con navegación
- [ ] `components/properties/AvailabilityCalendar.tsx` → mostrar disponibilidad
  - Reutilizar lógica de `ReservationCalendar.tsx`
  - Fetch blocked dates de Supabase (no Google Calendar)
  - Mostrar fechas bloqueadas
- [ ] `components/properties/InquiryForm.tsx` → formulario consulta
  - Validación Zod
  - Submit → POST `/api/inquiries` + abrir WhatsApp
  - Toast confirmación
- [ ] `components/properties/AmenitiesList.tsx` → grid de servicios

**Entregables:**
- Página detalle completa
- Galería funcional
- Calendario de disponibilidad
- Formulario de consulta con WhatsApp

---

### **Fase 5: Panel Admin - Auth (3-4h)**

- [ ] Configurar Supabase Auth (email + password)
- [ ] `lib/supabase/middleware.ts` → auth guard
- [ ] `app/admin/layout.tsx` → protected layout
- [ ] Login page `/admin/login`
- [ ] `hooks/useAuth.ts` → session management
- [ ] Crear usuario admin en Supabase

**Entregables:**
- Login funcional
- Admin routes protegidas
- Auth state management

---

### **Fase 6: Panel Admin - CRUD Propiedades (10-12h)**

#### 6.1 Backend
- [ ] API `/api/properties/route.ts` → POST (create)
- [ ] API `/api/properties/[id]/route.ts` → PATCH, DELETE
- [ ] API `/api/upload/route.ts` → upload a Supabase Storage
- [ ] Validación Zod server-side

#### 6.2 Frontend - Lista Admin
- [ ] `app/admin/propiedades/page.tsx`
- [ ] Tabla de propiedades (shadcn Table)
- [ ] Acciones: editar, eliminar, toggle active
- [ ] Botón "Nueva propiedad"

#### 6.3 Frontend - Crear/Editar
- [ ] `app/admin/propiedades/nueva/page.tsx`
- [ ] `app/admin/propiedades/[id]/editar/page.tsx`
- [ ] `components/admin/PropertyForm.tsx`
  - Campos: título, slug, descripción, ubicación, tipo, precio, capacidad
  - Validación Zod client-side
  - Auto-generate slug
- [ ] `components/admin/ImageUploader.tsx`
  - Drag & drop múltiple
  - Preview thumbnails
  - Ordenar con drag & drop
  - Upload a Supabase Storage
  - Seleccionar imagen destacada
- [ ] Selector de amenities (checkboxes)
- [ ] Submit → guardar en DB

**Entregables:**
- CRUD completo de propiedades
- Upload de imágenes funcional
- Validación robusta
- UX profesional

---

### **Fase 7: Panel Admin - Gestión de Disponibilidad (4-5h)**

- [ ] `app/admin/propiedades/[id]/disponibilidad/page.tsx`
- [ ] `components/admin/DateBlocker.tsx`
  - Calendario con react-calendar (reutilizar)
  - Seleccionar rango de fechas
  - Razón: dropdown (reserva, mantenimiento, bloqueado)
  - Notas opcionales
- [ ] API `/api/blocked-dates/route.ts` → POST, DELETE
- [ ] Lista de fechas bloqueadas (tabla)
- [ ] Eliminar bloqueos

**Entregables:**
- Gestión de disponibilidad funcional
- Calendario admin
- CRUD fechas bloqueadas

---

### **Fase 8: Panel Admin - Consultas y Contactos (3-4h)**

#### 8.1 Inquiries
- [ ] `app/admin/consultas/page.tsx`
- [ ] `components/admin/InquiriesTable.tsx`
- [ ] Mostrar: propiedad, fechas, usuario, status
- [ ] Acciones: marcar como contactado, agregar notas
- [ ] Botón WhatsApp directo

#### 8.2 Contacts
- [ ] `app/admin/contactos/page.tsx`
- [ ] Tabla de contactos
- [ ] Filtros por tipo (contacto, venta, alquila-con-nosotros)
- [ ] Status tracking

**Entregables:**
- Admin puede ver y gestionar consultas
- Admin puede ver contactos
- WhatsApp integrado

---

### **Fase 9: Páginas Auxiliares (3-4h)**

- [ ] `app/contacto/page.tsx` → formulario general
- [ ] `app/venta/page.tsx` → migrar de Chakra a Tailwind
- [ ] `app/alquila-con-nosotros/page.tsx` → migrar
- [ ] APIs: POST `/api/contacts` (guardar en DB + WhatsApp)

**Entregables:**
- Todas las páginas migradas
- Formularios funcionales
- Data persistida en DB

---

### **Fase 10: QA, SEO y Deploy (4-5h)**

#### 10.1 Testing
- [ ] Testing manual de flujos críticos
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Cross-browser testing
- [ ] Performance audit (Lighthouse)

#### 10.2 SEO
- [ ] Metadata dinámica por propiedad
- [ ] Open Graph images
- [ ] Structured data (JSON-LD) para propiedades
- [ ] Sitemap.xml dinámico
- [ ] robots.txt

#### 10.3 Deploy
- [ ] Configurar env vars en Vercel (Supabase keys)
- [ ] Deploy a producción
- [ ] Verificar funcionamiento end-to-end
- [ ] Configurar dominio

**Entregables:**
- Sitio testeado y funcional
- SEO optimizado
- Deploy en producción

---

## ⏱️ Estimación Detallada

| Fase | Descripción | Horas | Acumulado |
|------|-------------|-------|-----------|
| 0 | Setup inicial (Supabase, Tailwind, shadcn) | 3-4h | 4h |
| 1 | Componentes base (Navbar, Footer, UI) | 6-8h | 12h |
| 2 | Home / Landing | 4-5h | 17h |
| 3 | Listado de propiedades + filtros | 6-8h | 25h |
| 4 | Detalle de propiedad + galería + calendario | 8-10h | 35h |
| 5 | Panel admin - Auth | 3-4h | 39h |
| 6 | Panel admin - CRUD propiedades + upload | 10-12h | 51h |
| 7 | Panel admin - Disponibilidad | 4-5h | 56h |
| 8 | Panel admin - Consultas y contactos | 3-4h | 60h |
| 9 | Páginas auxiliares (contacto, venta, etc.) | 3-4h | 64h |
| 10 | QA, SEO, Deploy | 4-5h | **69h** |

**Estimación conservadora:** 60-70h
**Estimación optimista:** 50-55h
**Estimación realista (con imprevistos):** **~50h** ✅

> **Nota:** La estimación original del PLAN.md era 34-46h pero no incluía:
> - Migración completa de UI (Chakra → Tailwind)
> - Panel admin completo
> - Sistema de imágenes robusto
> - Disponibilidad en DB (no solo Google Calendar)
>
> Nuestra estimación de 50h es más realista para el scope completo.

---

## 📌 Archivos Críticos

### Para eliminar (ya no se usan)
```
src/app/providers.tsx              # ChakraProvider
src/theme.ts                       # Chakra theme
src/styles/calendar.css            # Reemplazado por shadcn calendar
src/app/api/calendar-events/       # Google Calendar (ya no se usa)
src/app/servicios/page.tsx         # Hardcoded, reemplazado por detalle dinámico
src/app/galeria/page.tsx           # Galería global, ahora por propiedad
```

### Para migrar (reutilizar lógica)
```
src/components/ReservationCalendar.tsx  → components/properties/AvailabilityCalendar.tsx
src/hooks/useWhatsAppThrottle.ts        → Copiar tal cual
src/lib/email.ts                        → Adaptar para Supabase context
src/types/index.ts                      → Expandir, no reemplazar
```

### Nuevos archivos core
```
lib/supabase/client.ts              # Supabase setup
lib/db/properties.ts                # Queries propiedades
components/admin/PropertyForm.tsx   # CRUD admin
app/propiedades/[slug]/page.tsx     # Detalle dinámico
tailwind.config.ts                  # Tailwind config
components.json                     # shadcn/ui config
```

---

## ✅ Verificación y Testing

### Checklist de Funcionalidades

#### **Público (Frontend)**
- [ ] Home carga y se ve bien
- [ ] Listado de propiedades muestra todas las activas
- [ ] Filtros funcionan (ubicación, tipo, precio, fechas)
- [ ] Click en card abre detalle correcto
- [ ] Galería muestra imágenes, navegación funciona
- [ ] Calendario muestra fechas bloqueadas correctamente
- [ ] Formulario consulta valida y abre WhatsApp
- [ ] WhatsApp button funciona
- [ ] Formulario contacto general funciona
- [ ] Página venta funciona
- [ ] Página alquila-con-nosotros funciona
- [ ] Responsive en mobile, tablet, desktop
- [ ] Performance: Lighthouse score >90

#### **Admin (Panel)**
- [ ] Login funciona
- [ ] Admin puede ver lista de propiedades
- [ ] Admin puede crear nueva propiedad
- [ ] Admin puede editar propiedad existente
- [ ] Admin puede eliminar propiedad
- [ ] Upload de imágenes funciona
- [ ] Reordenar imágenes funciona
- [ ] Seleccionar imagen destacada funciona
- [ ] Admin puede bloquear fechas
- [ ] Admin puede ver/eliminar bloqueos
- [ ] Admin puede ver consultas (inquiries)
- [ ] Admin puede cambiar status de consultas
- [ ] Admin puede ver contactos
- [ ] Logout funciona

#### **Backend (APIs)**
- [ ] GET `/api/properties` devuelve todas activas
- [ ] GET `/api/properties/[id]` devuelve una propiedad
- [ ] POST `/api/properties` crea nueva (auth requerida)
- [ ] PATCH `/api/properties/[id]` actualiza (auth requerida)
- [ ] DELETE `/api/properties/[id]` elimina (auth requerida)
- [ ] GET `/api/blocked-dates?propertyId=X` devuelve fechas
- [ ] POST `/api/blocked-dates` crea bloqueo (auth requerida)
- [ ] POST `/api/inquiries` crea consulta
- [ ] POST `/api/contacts` crea contacto
- [ ] POST `/api/upload` sube imagen a Supabase Storage (auth requerida)

#### **Database**
- [ ] RLS policies funcionan (público vs auth)
- [ ] Constraints funcionan (ej: end_date >= start_date)
- [ ] Cascades funcionan (eliminar propiedad → elimina fechas)
- [ ] Indexes mejoran performance

### Testing Manual

**Flujo 1: Usuario busca y consulta propiedad**
1. Ir a `/propiedades`
2. Filtrar por "Bella Vista"
3. Click en "Casa de Piedra"
4. Ver galería, navegar imágenes
5. Seleccionar fechas en calendario
6. Llenar formulario consulta
7. Submit → verificar WhatsApp abre con mensaje correcto
8. Verificar consulta se guardó en DB (admin panel)

**Flujo 2: Admin gestiona propiedad**
1. Login en `/admin`
2. Ir a "Propiedades"
3. Click "Nueva propiedad"
4. Llenar formulario completo
5. Subir 5+ imágenes
6. Reordenar imágenes
7. Seleccionar imagen destacada
8. Submit → verificar se creó
9. Editar propiedad
10. Bloquear fechas
11. Ver en frontend que fechas están bloqueadas

**Flujo 3: SEO y Performance**
1. Abrir `/propiedades/casa-de-piedra`
2. View source → verificar meta tags
3. Lighthouse audit → score >90
4. Verificar OG image
5. Verificar structured data (JSON-LD)

---

## 🚀 Future Features (Post-MVP)

### Fase 2 (después del MVP)

#### **Sistema de Reviews/Reseñas**
- [ ] Tabla `reviews` en DB
- [ ] Usuarios pueden dejar reviews (con email verification)
- [ ] Admin puede moderar (aprobar/rechazar)
- [ ] Mostrar rating promedio en cards
- [ ] Mostrar reviews en detalle de propiedad
- [ ] Schema.org AggregateRating

**Estimación:** 8-10h

#### **Comparador de Propiedades**
- [ ] Checkbox en PropertyCard para seleccionar
- [ ] Bottom bar con "Comparar (X seleccionadas)"
- [ ] Página `/propiedades/comparar?ids=1,2,3`
- [ ] Tabla side-by-side: precio, ubicación, servicios, capacidad
- [ ] CTA individual por propiedad

**Estimación:** 6-8h

#### **Mapa Interactivo**
- [ ] Integrar Mapbox o Google Maps
- [ ] Mostrar propiedades en mapa
- [ ] Cluster markers cuando hay muchas
- [ ] Click en marker → mostrar preview de propiedad
- [ ] Vista mapa en `/propiedades` (toggle con vista grid)
- [ ] Mapa en detalle de propiedad (ubicación)

**Estimación:** 8-10h

#### **Email Automation**
- [ ] Integrar Resend o SendGrid
- [ ] Email de confirmación al enviar consulta
- [ ] Email al admin cuando hay nueva consulta
- [ ] Email al admin cuando hay nuevo contacto
- [ ] Templates HTML bonitos (React Email)

**Estimación:** 4-6h

#### **Advanced Filters**
- [ ] Rango de precio con slider
- [ ] Filtro por amenities (checkboxes)
- [ ] Filtro por número de huéspedes
- [ ] Ordenar por: precio, featured, recientes
- [ ] Guardar filtros en URL query params

**Estimación:** 5-6h

#### **Dashboard Analytics**
- [ ] Stats cards: total propiedades, consultas mes, ocupación %
- [ ] Gráfico de consultas por mes (recharts)
- [ ] Propiedad más consultada
- [ ] Ratio conversión consulta → reserva

**Estimación:** 6-8h

#### **Multi-idioma (i18n)**
- [ ] next-intl o next-i18next
- [ ] Español / Inglés
- [ ] Traducciones de UI
- [ ] Contenido de propiedades en DB multilenguaje (JSONB)

**Estimación:** 10-12h

#### **Calendarios externos (opcional)**
- [ ] Importar .ics de Airbnb/Booking
- [ ] Exportar .ics para compartir
- [ ] Cron job para sincronizar

**Estimación:** 8-10h

### Otras Ideas

- **Favoritos:** usuarios pueden guardar propiedades (localStorage o DB)
- **Share buttons:** compartir en redes sociales
- **Print view:** imprimir detalle de propiedad
- **Dark mode:** toggle tema oscuro
- **PWA:** convertir en Progressive Web App
- **Notificaciones push:** cuando hay nueva consulta
- **Chatbot:** IA para responder preguntas frecuentes
- **Virtual tour:** 360° photos o video tour
- **Pricing calendar:** mostrar precio por noche en calendario (dynamic pricing)
- **Promociones:** campo `discount` en propiedades, mostrar badges

---

## 📝 Notas Finales

### Dependencias a instalar

```bash
# Remover Chakra UI
npm uninstall @chakra-ui/react @chakra-ui/next-js @emotion/react @emotion/styled

# Instalar Tailwind + shadcn/ui
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui (instalar después)
npx shadcn@latest init
npx shadcn@latest add button card input select dialog calendar dropdown-menu table toast form sheet

# Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Form handling
npm install react-hook-form zod @hookform/resolvers

# Mantener
# - date-fns (ya instalado)
# - framer-motion (ya instalado)
# - react-calendar (ya instalado, para admin)
# - @vercel/analytics (ya instalado)
```

### Variables de entorno

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # Para admin operations

# WhatsApp (mantener)
NEXT_PUBLIC_WHATSAPP_NUMBER=59899123456

# Email (opcional, si usas Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=xxx
EMAIL_TO=destino@gmail.com
```

### Supabase Setup

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar URL y ANON KEY
4. Ir a SQL Editor → ejecutar migrations (schema del plan)
5. Crear usuario admin en Authentication
6. Configurar Storage bucket `properties-images` (public)
7. Configurar RLS policies

### Colores a mantener (identidad visual)

Del theme actual de Casa de Piedra:

```css
/* Primarios */
--gold: #D1B16D;        /* Dorado principal */
--dark-teal: #2F4E56;   /* Azul oscuro/teal */
--beige: #E8D9A8;       /* Beige claro */
--brown: #1D1202;       /* Marrón oscuro */

/* Uso en Tailwind */
// tailwind.config.ts
colors: {
  primary: {
    DEFAULT: '#D1B16D',
    dark: '#B39855',
  },
  secondary: '#2F4E56',
  accent: '#1D1202',
  beige: '#E8D9A8',
}
```

### Performance Targets

- **Lighthouse Performance:** >90
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Largest Contentful Paint:** <2.5s
- **Cumulative Layout Shift:** <0.1

### Browser Support

- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Mobile Safari (iOS 14+)
- Chrome Android (últimas 2 versiones)

---

## 🎯 Criterios de Éxito

El revamp será exitoso cuando:

✅ **Funcionalidad:**
- Todas las propiedades se gestionan desde panel admin (sin tocar código)
- Consultas y contactos se guardan en DB
- Filtros funcionan correctamente
- Calendario muestra disponibilidad real
- WhatsApp integration funciona

✅ **Performance:**
- Lighthouse score >90
- Bundle size <300KB (actualmente ~500KB con Chakra)
- FCP <1.5s

✅ **UX:**
- Responsive en todos los dispositivos
- Navegación intuitiva
- Formularios con validación clara
- Loading states apropiados

✅ **DX (Developer Experience):**
- Código limpio y mantenible
- TypeScript strict mode sin errores
- Componentes reutilizables
- Fácil agregar nuevas features

✅ **Costo:**
- $0/mes infraestructura (Vercel Free + Supabase Free)
- Escalable hasta ~10 propiedades sin costo

---

## 📞 Contacto y Soporte

Para consultas durante la implementación, documentar en:
- GitHub Issues (si aplica)
- Notas en PLAN.md
- Changelog de decisiones técnicas

---

**¡Listo para empezar cuando quieras! 🚀**

Este plan está diseñado para ser ejecutado de forma incremental. Cada fase tiene entregables claros y puede ser testeada individualmente.

Timealo, y si ves que alguna fase toma más/menos de lo estimado, ajusta las siguientes fases en consecuencia.

**¡Éxito con el revamp!** 💪
