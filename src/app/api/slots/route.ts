import { NextResponse } from 'next/server'
import { requireBusiness } from '@/lib/dal'
import { generateSlots } from '@/lib/slots'

// GET /api/slots?doctor=<id>&day=YYYY-MM-DD -> { slots: ISO[] }
export async function GET(request: Request) {
  const { supabase, business } = await requireBusiness()
  const { searchParams } = new URL(request.url)
  const doctorId = searchParams.get('doctor') || ''
  const day = searchParams.get('day') || ''
  if (!doctorId || !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return NextResponse.json({ error: 'doctor and day are required.' }, { status: 400 })
  }

  const { data: doctor } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', doctorId)
    .eq('business_id', business.id)
    .single()
  if (!doctor) return NextResponse.json({ error: 'Doctor not found.' }, { status: 404 })

  const dayStart = new Date(`${day}T00:00:00Z`).toISOString()
  const dayEnd = new Date(`${day}T23:59:59Z`).toISOString()
  // Day window in business tz is wider than UTC day; pad by 1 day each side.
  const padStart = new Date(new Date(dayStart).getTime() - 86400000).toISOString()
  const padEnd = new Date(new Date(dayEnd).getTime() + 86400000).toISOString()
  const { data: busy } = await supabase
    .from('appointments')
    .select('starts_at,ends_at')
    .eq('doctor_id', doctor.id)
    .neq('status', 'cancelled')
    .gte('starts_at', padStart)
    .lte('starts_at', padEnd)

  const slots = generateSlots(doctor, day, business.timezone, busy ?? [])
  return NextResponse.json({ slots: slots.map((s) => s.toISOString()) })
}
