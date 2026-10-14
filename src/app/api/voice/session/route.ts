import { NextResponse } from 'next/server'
import { GoogleGenAI, Modality } from '@google/genai'
import { createServiceClient } from '@/lib/supabase/server'
import { GEMINI_FUNCTION_DECLARATIONS } from '@/ai/tools'

const MODEL = 'gemini-live-2.5-flash-preview'

// GET /api/voice/session?businessId= -> short lived token for browser Live connect.
// Keeps GEMINI_API_KEY server side. Needs GEMINI_API_KEY set.
export async function GET(request: Request) {
  const key = process.env.GEMINI_API_KEY
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

  try {
    const ai = new GoogleGenAI({ apiKey: key })
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 15 * 60000).toISOString(),
        liveConnectConstraints: {
          model: MODEL,
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: instructions,
            tools: [{ functionDeclarations: GEMINI_FUNCTION_DECLARATIONS }],
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
        },
      },
    })
    return NextResponse.json({ token: token.name, model: MODEL })
  } catch {
    return NextResponse.json({ error: 'Could not start voice session.' }, { status: 502 })
  }
}
