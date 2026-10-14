import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Business } from '@/types/database'

export async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return { supabase, user }
}

export async function getActiveBusiness() {
  const { supabase, user } = await requireUser()
  const { data } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  return { supabase, user, business: (data ?? null) as Business | null }
}

export async function requireBusiness() {
  const ctx = await getActiveBusiness()
  if (!ctx.business) redirect('/dashboard')
  return ctx as typeof ctx & { business: Business }
}

export function monthStartISO() {
  const d = new Date()
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString()
}
