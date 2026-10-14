'use client'

import { useState } from 'react'
import { updateBusiness } from '@/lib/actions/business'
import type { Business } from '@/types/database'

const TIMEZONES = ['Asia/Kathmandu', 'Asia/Kolkata', 'UTC', 'America/New_York', 'Europe/London']

export default function SettingsForm({ business }: { business: Business }) {
  const [name, setName] = useState(business.name)
  const [phone, setPhone] = useState(business.phone ?? '')
  const [timezone, setTimezone] = useState(business.timezone)
  const [twilio, setTwilio] = useState(business.twilio_number ?? '')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaved(false)
    setLoading(true)
    const res = await updateBusiness({ name, phone, timezone, twilio_number: twilio })
    setLoading(false)
    if ('error' in res && res.error) return setError(res.error)
    setSaved(true)
  }

  return (
    <form onSubmit={onSubmit} className="card-raised p-6 space-y-4 max-w-xl" aria-label="Clinic settings">
      <div>
        <label htmlFor="set-name" className="text-sm font-semibold">Clinic name</label>
        <input id="set-name" className="input-field mt-2" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="set-phone" className="text-sm font-semibold">Phone</label>
        <input id="set-phone" type="tel" className="input-field mt-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div>
        <label htmlFor="set-tz" className="text-sm font-semibold">Timezone</label>
        <select id="set-tz" className="input-field mt-2" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          {TIMEZONES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="set-twilio" className="text-sm font-semibold">Twilio number <span className="font-normal text-[#787774]">(optional)</span></label>
        <input id="set-twilio" type="tel" className="input-field mt-2" value={twilio} onChange={(e) => setTwilio(e.target.value)} placeholder="+1 ..." />
      </div>
      {error && <p className="text-sm text-[#9F2F2D]" role="alert">{error}</p>}
      {saved && <p className="text-sm text-[#111111]" role="status">Settings saved.</p>}
      <button className="btn-primary" disabled={loading}>{loading ? 'Saving…' : 'Save changes'}</button>
    </form>
  )
}
