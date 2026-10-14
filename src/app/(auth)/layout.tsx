import SiteNav from '@/components/SiteNav'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-page min-h-screen">
      <SiteNav />
      <main className="flex items-center justify-center p-6 py-16">
        <div className="card-surface w-full max-w-md p-8 md:p-10 animate-fade-up">{children}</div>
      </main>
    </div>
  )
}
