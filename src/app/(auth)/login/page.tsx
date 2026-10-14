'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setErr(error.message)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input className="input-field" placeholder="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input-field" placeholder="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
      </form>
      <p className="text-sm mt-4">No account? <Link href="/signup" className="underline">Sign up</Link></p>
    </>
  )
}
