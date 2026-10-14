import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60) || `clinic-${Date.now()}`
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const name = String(body.name || '').trim()
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const slug = slugify(String(body.slug || name))
  const { data, error } = await supabase
    .from('businesses')
    .insert({ owner_id: user.id, name, slug, phone: body.phone ?? null })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ business: data })
}
