import { z } from 'zod'

// Schema para validación en el formulario (acepta strings y transforma)
export const propertySchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(255, 'El título no puede exceder 255 caracteres'),

  slug: z
    .string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .max(255, 'El slug no puede exceder 255 caracteres')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'El slug solo puede contener letras minúsculas, números y guiones'
    ),

  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres'),

  location: z
    .string()
    .min(2, 'La ubicación debe tener al menos 2 caracteres')
    .max(100, 'La ubicación no puede exceder 100 caracteres'),

  property_type: z
    .string()
    .min(2, 'El tipo debe tener al menos 2 caracteres')
    .max(50, 'El tipo no puede exceder 50 caracteres'),

  price_per_night: z
    .string()
    .min(1, 'El precio por noche es requerido')
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), { message: 'Debe ser un número válido' })
    .refine((val) => val > 0, { message: 'El precio debe ser mayor a 0' })
    .refine((val) => val <= 999999, { message: 'El precio no puede exceder 999,999' }),

  currency: z.string(),

  max_guests: z
    .string()
    .min(1, 'El máximo de huéspedes es requerido')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: 'Debe ser un número válido' })
    .refine((val) => Number.isInteger(val), { message: 'Debe ser un número entero' })
    .refine((val) => val > 0, { message: 'Debe permitir al menos 1 huésped' })
    .refine((val) => val <= 50, { message: 'No puede exceder 50 huéspedes' }),

  bedrooms: z
    .string()
    .min(1, 'Los dormitorios son requeridos')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: 'Debe ser un número válido' })
    .refine((val) => Number.isInteger(val), { message: 'Debe ser un número entero' })
    .refine((val) => val >= 0, { message: 'No puede ser negativo' })
    .refine((val) => val <= 20, { message: 'No puede exceder 20 dormitorios' }),

  bathrooms: z
    .string()
    .min(1, 'Los baños son requeridos')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: 'Debe ser un número válido' })
    .refine((val) => Number.isInteger(val), { message: 'Debe ser un número entero' })
    .refine((val) => val >= 0, { message: 'No puede ser negativo' })
    .refine((val) => val <= 20, { message: 'No puede exceder 20 baños' }),

  is_active: z.boolean(),
  is_featured: z.boolean(),

  amenities: z.array(z.string()),

  meta_title: z.string().max(255).nullable().optional(),
  meta_description: z.string().nullable().optional(),
})

// Schema para validación en la API (acepta números directamente)
export const propertyApiSchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(255, 'El título no puede exceder 255 caracteres'),

  slug: z
    .string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .max(255, 'El slug no puede exceder 255 caracteres')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'El slug solo puede contener letras minúsculas, números y guiones'
    ),

  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres'),

  location: z
    .string()
    .min(2, 'La ubicación debe tener al menos 2 caracteres')
    .max(100, 'La ubicación no puede exceder 100 caracteres'),

  property_type: z
    .string()
    .min(2, 'El tipo debe tener al menos 2 caracteres')
    .max(50, 'El tipo no puede exceder 50 caracteres'),

  price_per_night: z
    .number()
    .positive('El precio debe ser mayor a 0')
    .max(999999, 'El precio no puede exceder 999,999'),

  currency: z.string(),

  max_guests: z
    .number()
    .int('La cantidad de huéspedes debe ser un número entero')
    .positive('Debe permitir al menos 1 huésped')
    .max(50, 'No puede exceder 50 huéspedes'),

  bedrooms: z
    .number()
    .int('Los dormitorios deben ser un número entero')
    .min(0, 'No puede ser negativo')
    .max(20, 'No puede exceder 20 dormitorios'),

  bathrooms: z
    .number()
    .int('Los baños deben ser un número entero')
    .min(0, 'No puede ser negativo')
    .max(20, 'No puede exceder 20 baños'),

  is_active: z.boolean(),
  is_featured: z.boolean(),

  amenities: z.array(z.string()),

  meta_title: z.string().max(255).nullable().optional(),
  meta_description: z.string().nullable().optional(),
})

export type PropertyFormData = z.infer<typeof propertySchema>
export type PropertyApiData = z.infer<typeof propertyApiSchema>
