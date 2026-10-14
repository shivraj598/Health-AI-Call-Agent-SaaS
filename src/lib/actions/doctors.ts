'use server'

import { revalidatePath } from 'next/cache'
import { requireBusiness } from '@/lib/dal'
import { atLimit } from '@/lib/plans'

export async function createDoctor(form: {
  name: string
  specialty?: string
  slot_minutes?: number
  work_start?: string
  work_end?: string
  work_days?: number[]
}) {
  const { supabase, business } = await requireBusiness()
  const name = form.name.trim()
  if (name.length < 2) return { error: 'Doctor name is required.' }

  const { count } = await supabase
    .from('doctors')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', business.id)
  if (atLimit(business.plan, 'agents', count ?? 0)) {
    return { error: `Doctor limit reached on the ${business.plan} plan. See plans to raise it.` }
  }

  const { error } = await supabase.from('doctors').insert({
    business_id: business.id,
    name,
    specialty: form.specialty?.trim() || null,
    slot_minutes: form.slot_minutes || 30,
    work_start: form.work_start || '09:00',
    work_end: form.work_end || '17:00',
    work_days: form.work_days ?? [1, 2, 3, 4, 5],
  })
  if (error) return { error: error.message }
  revalidatePath('/doctors')
  return { ok: true }
}

export async function deleteDoctor(id: string) {
  const { supabase, business } = await requireBusiness()
  const { error } = await supabase
    .from('doctors')
    .delete()
    .eq('id', id)
    .eq('business_id', business.id)
  if (error) return { error: error.message }
  revalidatePath('/doctors')
  return { ok: true }
}
