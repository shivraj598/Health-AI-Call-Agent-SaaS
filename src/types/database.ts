export type Plan = 'free' | 'pro' | 'business'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  created_at: string
}

export interface Business {
  id: string
  owner_id: string
  name: string
  slug: string
  phone: string | null
  timezone: string
  plan: Plan
  twilio_number: string | null
  created_at: string
}

export interface Doctor {
  id: string
  business_id: string
  name: string
  specialty: string | null
  slot_minutes: number
  work_start: string
  work_end: string
  work_days: number[]
  created_at: string
}

export interface Patient {
  id: string
  business_id: string
  full_name: string
  phone: string
  email: string | null
  notes: string | null
  created_at: string
}

export type AppointmentStatus = 'booked' | 'cancelled' | 'completed' | 'no_show'
export type AppointmentSource = 'dashboard' | 'widget' | 'phone'

export interface Appointment {
  id: string
  business_id: string
  doctor_id: string
  patient_id: string
  starts_at: string
  ends_at: string
  status: AppointmentStatus
  source: AppointmentSource
  created_at: string
}

export interface Call {
  id: string
  business_id: string
  patient_id: string | null
  doctor_id: string | null
  direction: string
  channel: 'widget' | 'twilio'
  twilio_sid: string | null
  transcript: string | null
  summary: string | null
  duration_sec: number
  created_at: string
}

export interface Subscription {
  id: string
  business_id: string
  stripe_customer_id: string | null
  stripe_sub_id: string | null
  plan: string
  status: string
  current_period_end: string | null
  created_at: string
}
