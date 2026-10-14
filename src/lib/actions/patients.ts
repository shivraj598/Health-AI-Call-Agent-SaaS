'use server'

import { revalidatePath } from 'next/cache'
import { requireBusiness } from '@/lib/dal'
import { patientSchema } from '@/validations'

export async function createPatient(form: { full_name: string; phone: string; email?: string; notes?: string }) {
  const { supabase, business } = await requireBusiness()
  const parsed = patientSchema.safeParse({
    full_name: form.full_name.trim(),
    phone: form.phone.trim(),
    email: form.email?.trim() || '',
  })
  if (!parsed.success) return { error: 'Name and phone are required.' }

  const { error } = await supabase.from('patients').insert({
    business_id: business.id,
    full_name: parsed.data.full_name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    notes: form.notes?.trim() || null,
  })
  if (error) {
    if (error.code === '23505') return { error: 'A patient with this phone already exists.' }
    return { error: error.message }
  }
  revalidatePath('/patients')
  return { ok: true }
}

export async function deletePatient(id: string) {
  const { supabase, business } = await requireBusiness()
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id)
    .eq('business_id', business.id)
  if (error) return { error: error.message }
  revalidatePath('/patients')
  return { ok: true }
}
