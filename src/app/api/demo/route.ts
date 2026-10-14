import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const name = String(body.name || '').trim()
  const clinic = String(body.clinic || '').trim()
  const email = String(body.email || '').trim()
  const phone = body.phone ? String(body.phone).trim() : null

  if (name.length < 2 || clinic.length < 2) {
    return NextResponse.json({ error: 'Name and clinic are required.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('demo_requests').insert({ name, clinic, email, phone })
  if (error) return NextResponse.json({ error: 'Could not save request. Please try again.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
