import type { Business, Doctor } from '@/types/database'

export interface WidgetData {
  business: Pick<Business, 'id' | 'name' | 'slug' | 'phone' | 'plan'>
  doctors: Pick<Doctor, 'id' | 'name' | 'specialty' | 'slot_minutes'>[]
}

// Phase 2: client fetch helper. Server pages query Supabase directly.
export async function fetchWidgetData(): Promise<WidgetData | null> {
  return null
}
