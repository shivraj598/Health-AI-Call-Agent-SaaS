import { z } from 'zod'

export const businessSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).optional(),
  phone: z.string().optional(),
})

export const patientSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email().optional().or(z.literal('')),
})

export const appointmentSchema = z.object({
  doctor_id: z.string().uuid(),
  patient_id: z.string().uuid(),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
})
