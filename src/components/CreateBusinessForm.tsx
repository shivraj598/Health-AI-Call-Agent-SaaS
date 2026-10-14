'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateBusinessForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (name.trim().length < 2) return setError('Clinic name is required.')
    setLoading(true)
    const res = await fetch('/api/businesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), phone: phone.trim() || undefined }),
    })
    const body = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) return setError(body.error || 'Could not create clinic.')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="card-raised p-8 max-w-md space-y-4" aria-label="Create clinic">
      <h1 className="text-2xl font-semibold text-balance">Create your clinic</h1>
      <p className="text-base text-slate-600 text-pretty">One clinic per account for now. You can add doctors right after.</p>
      <div>
        <label htmlFor="biz-name" className="text-sm font-semibold">Clinic name</label>
        <input id="biz-name" className="input-field mt-2" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="biz-phone" className="text-sm font-semibold">Phone <span className="font-normal text-slate-500">(optional)</span></label>
        <input id="biz-phone" type="tel" className="input-field mt-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating…' : 'Create clinic'}</button>
    </form>
  )
}
