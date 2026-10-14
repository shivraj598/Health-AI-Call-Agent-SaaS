import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BusinessProvider from '@/providers/BusinessProvider'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)

  return (
    <BusinessProvider business={businesses?.[0] ?? null}>
      <div className="min-h-screen">
        <header className="card-raised m-4 p-4 flex items-center justify-between">
          <strong>Clinic Dashboard</strong>
          <span className="text-sm text-slate-500">{user.email}</span>
        </header>
        <main className="p-4">{children}</main>
      </div>
    </BusinessProvider>
  )
}
