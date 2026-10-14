import { createServiceClient } from '@/lib/supabase/server'
import { generateSlots, isWithinHours } from '@/lib/slots'

// Gemini Live function declarations for the voice agent.
// Same booking tools as before, in models.functionDeclarations shape.
export const GEMINI_FUNCTION_DECLARATIONS = [
  {
    name: 'list_doctors',
    description: 'List doctors at the clinic with specialties and slot lengths.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'check_availability',
    description: 'List open booking times for a doctor on a day (YYYY-MM-DD).',
    parameters: {
      type: 'OBJECT',
      properties: {
        doctor_id: { type: 'STRING', description: 'Doctor id from list_doctors.' },
        day: { type: 'STRING', description: 'Day as YYYY-MM-DD.' },
      },
      required: ['doctor_id', 'day'],
    },
  },
  {
    name: 'find_or_create_patient',
    description: 'Find a patient by phone or create the record.',
    parameters: {
      type: 'OBJECT',
      properties: {
        full_name: { type: 'STRING' },
        phone: { type: 'STRING' },
      },
      required: ['full_name', 'phone'],
    },
  },
  {
    name: 'book_appointment',
    description: 'Book a visit at an ISO start time offered by check_availability.',
    parameters: {
      type: 'OBJECT',
      properties: {
        doctor_id: { type: 'STRING' },
        patient_id: { type: 'STRING', description: 'Patient id from find_or_create_patient.' },
        starts_at: { type: 'STRING', description: 'ISO time from check_availability.' },
      },
      required: ['doctor_id', 'patient_id', 'starts_at'],
    },
  },
  {
    name: 'cancel_appointment',
    description: 'Cancel a booked visit by its id.',
    parameters: {
      type: 'OBJECT',
      properties: { appointment_id: { type: 'STRING' } },
      required: ['appointment_id'],
    },
  },
]

export async function runVoiceTool(
  businessId: string,
  tool: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: Record<string, any>
): Promise<unknown> {
  const admin = createServiceClient()
  const { data: business } = await admin.from('businesses').select('*').eq('id', businessId).single()
  if (!business) throw new Error('Clinic not found.')

  switch (tool) {
    case 'list_doctors': {
      const { data } = await admin
        .from('doctors')
        .select('id,name,specialty,slot_minutes,work_start,work_end')
        .eq('business_id', businessId)
      return data ?? []
    }
    case 'check_availability': {
      const { data: doctor } = await admin.from('doctors').select('*').eq('id', args.doctor_id).eq('business_id', businessId).single()
      if (!doctor) throw new Error('Doctor not found.')
      const day = String(args.day || '')
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error('Day must be YYYY-MM-DD.')
      const { data: busy } = await admin
        .from('appointments')
        .select('starts_at,ends_at')
        .eq('doctor_id', doctor.id)
        .neq('status', 'cancelled')
        .gte('starts_at', new Date(new Date(`${day}T00:00:00Z`).getTime() - 86400000).toISOString())
        .lte('starts_at', new Date(new Date(`${day}T23:59:59Z`).getTime() + 86400000).toISOString())
      return generateSlots(doctor, day, business.timezone, busy ?? []).map((s) => s.toISOString())
    }
    case 'find_or_create_patient': {
      const phone = String(args.phone || '').trim()
      const full_name = String(args.full_name || '').trim()
      if (full_name.length < 2 || phone.length < 3) throw new Error('Patient name and phone are required.')
      const { data: existing } = await admin
        .from('patients')
        .select('*')
        .eq('business_id', businessId)
        .eq('phone', phone)
        .maybeSingle()
      if (existing) return existing
      const { data, error } = await admin
        .from('patients')
        .insert({ business_id: businessId, full_name, phone })
        .select('*')
        .single()
      if (error) throw new Error(error.message)
      return data
    }
    case 'book_appointment': {
      const { data: doctor } = await admin.from('doctors').select('*').eq('id', args.doctor_id).eq('business_id', businessId).single()
      if (!doctor) throw new Error('Doctor not found.')
      const starts = new Date(String(args.starts_at || ''))
      if (Number.isNaN(starts.getTime())) throw new Error('Valid start time is required.')
      const ends = new Date(starts.getTime() + doctor.slot_minutes * 60000)
      const hoursError = isWithinHours(doctor, starts, ends, business.timezone)
      if (hoursError) throw new Error(hoursError)
      const { data, error } = await admin
        .from('appointments')
        .insert({
          business_id: businessId,
          doctor_id: doctor.id,
          patient_id: args.patient_id,
          starts_at: starts.toISOString(),
          ends_at: ends.toISOString(),
          status: 'booked',
          source: 'widget',
        })
        .select('*')
        .single()
      if (error) {
        if (error.code === '23P01') throw new Error('That slot was just taken. Offer another time.')
        throw new Error(error.message)
      }
      return data
    }
    case 'cancel_appointment': {
      const { error } = await admin
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', args.appointment_id)
        .eq('business_id', businessId)
      if (error) throw new Error(error.message)
      return { ok: true }
    }
    default:
      throw new Error(`Unknown tool: ${tool}`)
  }
}
