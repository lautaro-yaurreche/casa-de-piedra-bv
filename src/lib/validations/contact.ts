import { z } from 'zod'

export const contactSchema = z.object({
  first_name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  last_name: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido no puede exceder 100 caracteres'),

  email: z
    .string()
    .email('Email inválido')
    .max(255, 'El email no puede exceder 255 caracteres'),

  phone: z
    .string()
    .min(8, 'El teléfono debe tener al menos 8 dígitos')
    .max(50, 'El teléfono no puede exceder 50 caracteres')
    .optional()
    .or(z.literal('')),

  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres'),

  form_type: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
