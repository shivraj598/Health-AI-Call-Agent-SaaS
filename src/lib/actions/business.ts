'use server'

import { revalidatePath } from 'next/cache'
import { requireBusiness } from '@/lib/dal'

export async function updateBusiness(form: {
  name: string
  phone?: string
  timezone?: string
  twilio_number?: string
}) {
  const { supabase, business } = await requireBusiness()
  const name = form.name.trim()
  if (name.length < 2) return { error: 'Clinic name is required.' }
  const { error } = await supabase
    .from('businesses')
    .update({
      name,
      phone: form.phone?.trim() || null,
      timezone: form.timezone?.trim() || business.timezone,
      twilio_number: form.twilio_number?.trim() || null,
    })
    .eq('id', business.id)
  if (error) return { error: error.message }
  revalidatePath('/settings')
  return { ok: true }
}
