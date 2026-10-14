import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { VOICE_TOOLS } from '@/ai/tools'

// GET /api/voice/session?businessId= -> ephemeral client secret for WebRTC.
// Keeps OPENAI_API_KEY server side. Needs OPENAI_API_KEY set.
export async function GET(request: Request) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return NextResponse.json({ error: 'Voice is not configured yet.' }, { status: 503 })
  const businessId = new URL(request.url).searchParams.get('businessId') || ''
  if (!businessId) return NextResponse.json({ error: 'businessId is required.' }, { status: 400 })

  const admin = createServiceClient()
  const { data: business } = await admin.from('businesses').select('id,name').eq('id', businessId).single()
  if (!business) return NextResponse.json({ error: 'Clinic not found.' }, { status: 404 })
  const { data: doctors } = await admin.from('doctors').select('name,specialty').eq('business_id', businessId)

  const instructions = [
    `You are the front desk voice agent for ${business.name}, a clinic.`,
    'Speak briefly and warmly. Always confirm the patient name and phone before booking.',
    'Use list_doctors first, then check_availability, then find_or_create_patient, then book_appointment.',
    `Doctors on staff: ${(doctors ?? []).map((d: { name: string; specialty: string | null }) => `${d.name}${d.specialty ? ` (${d.specialty})` : ''}`).join(', ') || 'none listed yet'}.`,
    'Never invent times. Only offer times returned by check_availability.',
  ].join(' ')

  const res = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OPENAI_REALTIME_MODEL || 'gpt-realtime',
      modalities: ['audio', 'text'],
      instructions,
      tools: VOICE_TOOLS,
    }),
  })
  if (!res.ok) return NextResponse.json({ error: 'Could not start voice session.' }, { status: 502 })
  const session = await res.json()
  return NextResponse.json({ client_secret: session.client_secret?.value, model: session.model })
}
