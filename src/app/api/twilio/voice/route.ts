import { NextResponse } from 'next/server'

// Phase 1 stub: Twilio hits this on inbound calls. Phase 2 adds real TwiML + AI bridge.
// Configure in Twilio console: Voice webhook -> POST /api/twilio/voice
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const sid = (form?.get('CallSid') as string) || new URL(request.url).searchParams.get('CallSid')
  const from = (form?.get('From') as string) || ''

  // Best-effort log; never fail the call because logging failed.
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && sid) {
      const { createServiceClient } = await import('@/lib/supabase/server')
      const admin = createServiceClient()
      const businessId =
        new URL(request.url).searchParams.get('businessId') ||
        process.env.NEXT_PUBLIC_DEMO_BUSINESS_ID ||
        null
      if (businessId) {
        await admin.from('calls').upsert(
          { business_id: businessId, channel: 'twilio', twilio_sid: sid, transcript: `Inbound from ${from}` },
          { onConflict: 'twilio_sid' }
        )
      }
    }
  } catch {
    // swallow — TwiML below must still return
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thanks for calling. Our AI receptionist is coming online. Please hold.</Say>
  <Pause length="1"/>
  <Say>Goodbye.</Say>
</Response>`
  return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } })
}

export async function GET() {
  return NextResponse.json({ ok: true, stub: true })
}
