'use client'

import { useState } from 'react'
import { createPatient, deletePatient } from '@/lib/actions/patients'

export function AddPatientForm() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && email.trim() !== '') {
      return setError('Please enter a valid email or leave it empty.')
    }
    setLoading(true)
    const res = await createPatient({ full_name: fullName, phone, email })
    setLoading(false)
    if ('error' in res && res.error) return setError(res.error)
    setFullName('')
    setPhone('')
    setEmail('')
  }

  return (
    <form onSubmit={onSubmit} className="card-raised p-6 space-y-4" aria-label="Add patient">
      <h2 className="text-xl font-semibold">Add patient</h2>
      <div>
        <label htmlFor="pat-name" className="text-sm font-semibold">Full name</label>
        <input id="pat-name" className="input-field mt-2" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="pat-phone" className="text-sm font-semibold">Phone</label>
        <input id="pat-phone" type="tel" className="input-field mt-2" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="pat-email" className="text-sm font-semibold">Email <span className="font-normal text-slate-500">(optional)</span></label>
        <input id="pat-email" type="email" className="input-field mt-2" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
      </div>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button className="btn-primary w-full" disabled={loading}>{loading ? 'Adding…' : 'Add patient'}</button>
    </form>
  )
}

export function DeletePatientButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false)
  return (
    <button
      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-40"
      disabled={loading}
      onClick={async () => {
        if (!confirm(`Remove ${name}?`)) return
        setLoading(true)
        await deletePatient(id)
        setLoading(false)
      }}
    >
      Remove
    </button>
  )
}
