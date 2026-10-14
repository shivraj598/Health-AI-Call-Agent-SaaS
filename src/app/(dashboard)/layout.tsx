import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BusinessProvider from '@/providers/BusinessProvider'
import DashboardNav from '@/components/DashboardNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)

  return (
    <BusinessProvider business={businesses?.[0] ?? null}>
      <div className="min-h-screen bg-page flex flex-col md:flex-row">
        <DashboardNav email={user.email ?? ''} />
        <main id="main" className="flex-1 p-4 md:p-8 max-w-5xl w-full">
          {children}
        </main>
      </div>
    </BusinessProvider>
  )
}
