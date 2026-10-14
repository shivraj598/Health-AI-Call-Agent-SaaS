'use server'

import { revalidatePath } from 'next/cache'
import { requireBusiness, monthStartISO } from '@/lib/dal'
import { atLimit } from '@/lib/plans'
import { isWithinHours } from '@/lib/slots'

export async function bookAppointment(form: {
  doctor_id: string
  patient_id: string
  starts_at: string
  source?: 'dashboard' | 'widget' | 'phone'
}) {
  const { supabase, business } = await requireBusiness()

  const { data: doctor } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', form.doctor_id)
    .eq('business_id', business.id)
    .single()
  if (!doctor) return { error: 'Doctor not found.' }

  const starts = new Date(form.starts_at)
  if (Number.isNaN(starts.getTime())) return { error: 'Valid start time is required.' }
  const ends = new Date(starts.getTime() + doctor.slot_minutes * 60000)

  const hoursError = isWithinHours(doctor, starts, ends, business.timezone)
  if (hoursError) return { error: hoursError }

  const { count } = await supabase
    .from('appointments')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', business.id)
    .neq('status', 'cancelled')
    .gte('created_at', monthStartISO())
  if (atLimit(business.plan, 'bookings', count ?? 0)) {
    return { error: `Monthly booking limit reached on the ${business.plan} plan. See plans to raise it.` }
  }

  const { error } = await supabase.from('appointments').insert({
    business_id: business.id,
    doctor_id: doctor.id,
    patient_id: form.patient_id,
    starts_at: starts.toISOString(),
    ends_at: ends.toISOString(),
    status: 'booked',
    source: form.source ?? 'dashboard',
  })
  if (error) {
    if (error.code === '23P01') return { error: 'That slot was just taken. Pick another time.' }
    return { error: error.message }
  }
  revalidatePath('/appointments')
  return { ok: true }
}

export async function setAppointmentStatus(id: string, status: 'cancelled' | 'completed') {
  const { supabase, business } = await requireBusiness()
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .eq('business_id', business.id)
  if (error) return { error: error.message }
  revalidatePath('/appointments')
  return { ok: true }
}
