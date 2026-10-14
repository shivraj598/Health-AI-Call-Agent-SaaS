import { NextResponse } from 'next/server'
import { runVoiceTool } from '@/ai/tools'

// POST /api/voice/tools { businessId, tool, args }
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const businessId = String(body.businessId || '')
  const tool = String(body.tool || '')
  if (!businessId || !tool) {
    return NextResponse.json({ error: 'businessId and tool are required.' }, { status: 400 })
  }
  try {
    const result = await runVoiceTool(businessId, tool, body.args ?? {})
    return NextResponse.json({ result })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Tool failed.' }, { status: 400 })
  }
}
