'use client'

import { useState } from 'react'
import { CheckCircle, WarningCircle } from '@phosphor-icons/react'

type State = 'idle' | 'sending' | 'done' | 'error'

export default function DemoForm() {
  const [name, setName] = useState('')
  const [clinic, setClinic] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [state, setState] = useState<State>('idle')
  const [serverError, setServerError] = useState('')

  function validate() {
    const e: Record<string, string> = {}
    if (name.trim().length < 2) e.name = 'Please enter your name.'
    if (clinic.trim().length < 2) e.clinic = 'Please enter your clinic name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Please enter a valid email.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setServerError('')
    if (!validate()) return
    setState('sending')
    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), clinic: clinic.trim(), email: email.trim(), phone: phone.trim() || null }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed.')
      setState('done')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Request failed. Please try again.')
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className="card-surface p-10 text-center" role="status">
        <CheckCircle size={40} weight="fill" className="mx-auto" aria-hidden />
        <h3 className="font-serif-d text-3xl mt-6 text-balance">Request received</h3>
        <p className="text-base text-[#2F3437] mt-3 text-pretty">
          Thanks {name.split(' ')[0]}. We will reply to {email} within one business day.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card-surface p-8 md:p-10 space-y-4" aria-label="Book a demo">
      <h3 className="font-serif-d text-3xl text-balance">Book a demo</h3>
      <div>
        <label htmlFor="demo-name" className="text-sm font-semibold">Your name</label>
        <input id="demo-name" className="input-field mt-2" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        {errors.name && <p className="text-sm text-[#9F2F2D] mt-2">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="demo-clinic" className="text-sm font-semibold">Clinic name</label>
        <input id="demo-clinic" className="input-field mt-2" value={clinic} onChange={(e) => setClinic(e.target.value)} autoComplete="organization" />
        {errors.clinic && <p className="text-sm text-[#9F2F2D] mt-2">{errors.clinic}</p>}
      </div>
      <div>
        <label htmlFor="demo-email" className="text-sm font-semibold">Work email</label>
        <input id="demo-email" type="email" className="input-field mt-2" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        {errors.email && <p className="text-sm text-[#9F2F2D] mt-2">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="demo-phone" className="text-sm font-semibold">Phone <span className="font-normal text-[#787774]">(optional)</span></label>
        <input id="demo-phone" type="tel" className="input-field mt-2" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
      </div>
      {state === 'sending' ? (
        <div className="space-y-2" aria-label="Sending">
          <div className="skeleton h-10 w-full" />
        </div>
      ) : (
        <button type="submit" className="btn-primary w-full">Book a demo</button>
      )}
      {state === 'error' && (
        <p className="flex items-center gap-2 text-sm text-[#9F2F2D]" role="alert">
          <WarningCircle size={16} weight="fill" aria-hidden /> {serverError}
        </p>
      )}
      <p className="text-sm text-[#787774] text-pretty">Free plan, no credit card, cancel anytime.</p>
    </form>
  )
}
