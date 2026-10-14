'use client'

import { useRef, useState } from 'react'
import { GoogleGenAI, type LiveServerMessage } from '@google/genai'

export type VoiceStatus = 'idle' | 'connecting' | 'live' | 'unavailable' | 'error'

function floatToPcm16(input: Float32Array): ArrayBuffer {
  const out = new Int16Array(input.length)
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]))
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return out.buffer
}

function bytesToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

export function useRealtimeVoice(businessId: string) {
  const [status, setStatus] = useState<VoiceStatus>('idle')
  const [lines, setLines] = useState<string[]>([])
  const sessionRef = useRef<{ close: () => void } | null>(null)
  const audioRef = useRef<{ ctx: AudioContext; next: number; stream: MediaStream } | null>(null)

  function push(line: string) {
    setLines((prev) => [...prev.slice(-7), line])
  }

  function cleanup() {
    try {
      sessionRef.current?.close()
    } catch {
      // already closed
    }
    if (audioRef.current) {
      audioRef.current.stream.getTracks().forEach((t) => t.stop())
      audioRef.current.ctx.close().catch(() => {})
      audioRef.current = null
    }
    sessionRef.current = null
  }

  async function runTool(name: string, args: Record<string, unknown>, id: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = sessionRef.current as any
    const res = await fetch('/api/voice/tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId, tool: name, args }),
    })
    const body = await res.json().catch(() => ({}))
    const response = res.ok ? body.result : { error: body.error || 'tool failed' }
    session?.sendToolResponse({ functionResponses: { id, name, response } })
  }

  async function connect() {
    if (process.env.NEXT_PUBLIC_ENABLE_VOICE === 'false') return setStatus('unavailable')
    setStatus('connecting')
    try {
      const sess = await fetch(`/api/voice/session?businessId=${businessId}`).then((r) => r.json())
      if (!sess.token) {
        setStatus(sess.error ? 'unavailable' : 'error')
        if (sess.error) push(sess.error)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const Ctx = window.AudioContext
      const ctx = new Ctx({ sampleRate: 16000 })
      const src = ctx.createMediaStreamSource(stream)
      await ctx.audioWorklet.addModule(
        URL.createObjectURL(
          new Blob(
            [
              `class Cap extends AudioWorkletProcessor{process(i){this.port.postMessage(i[0][0].slice(0));return true}}registerProcessor('cap',Cap)`,
            ],
            { type: 'application/javascript' }
          )
        )
      )
      const node = new AudioWorkletNode(ctx, 'cap')
      src.connect(node)
      audioRef.current = { ctx, next: ctx.currentTime, stream }

      const playCtx = new Ctx({ sampleRate: 24000 })
      let playAt = playCtx.currentTime
      function playPcm(base64: string) {
        const bin = atob(base64)
        const data = new Int16Array(bin.length / 2)
        for (let i = 0; i < data.length; i++) {
          data[i] = (bin.charCodeAt(i * 2) | (bin.charCodeAt(i * 2 + 1) << 8)) << 16 >> 16
        }
        const buf = playCtx.createBuffer(1, data.length, 24000)
        buf.getChannelData(0).set(Array.from(data, (v) => v / 0x8000))
        const out = playCtx.createBufferSource()
        out.buffer = buf
        out.connect(playCtx.destination)
        playAt = Math.max(playAt, playCtx.currentTime)
        out.start(playAt)
        playAt += buf.duration
      }

      const ai = new GoogleGenAI({ apiKey: sess.token })
      const session = await ai.live.connect({
        model: sess.model,
        callbacks: {
          onopen: () => {
            setStatus('live')
            push('Connected. Speak to book a visit.')
          },
          onmessage: (msg: LiveServerMessage) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const m = msg as any
            if (m.toolCall?.functionCalls) {
              for (const fc of m.toolCall.functionCalls) {
                push(`Booking step: ${fc.name}`)
                runTool(fc.name, fc.args ?? {}, fc.id)
              }
            }
            const audio = m.serverContent?.modelTurn?.parts?.find(
              (p: { inlineData?: { data?: string } }) => p.inlineData?.data
            )?.inlineData?.data
            if (audio) playPcm(audio)
            const inText = m.serverContent?.inputTranscription?.text
            if (inText) push(`You: ${inText}`)
            const outText = m.serverContent?.outputTranscription?.text
            if (outText) push(`Agent: ${outText}`)
          },
          onerror: () => {
            setStatus('error')
            push('Connection failed. Check permission and try again.')
          },
          onclose: () => {
            if (sessionRef.current) setStatus('idle')
          },
        },
      })
      sessionRef.current = session

      node.port.onmessage = (e: MessageEvent<Float32Array>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session as any).sendRealtimeInput({
          media: { data: bytesToBase64(floatToPcm16(e.data)), mimeType: 'audio/pcm;rate=16000' },
        })
      }
      node.connect(ctx.destination)
    } catch {
      cleanup()
      setStatus('error')
      push('Microphone or connection failed. Check permission and try again.')
    }
  }

  function disconnect() {
    cleanup()
    setStatus('idle')
  }

  return { status, lines, connect, disconnect }
}
