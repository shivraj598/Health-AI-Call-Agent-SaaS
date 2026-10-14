import Link from 'next/link'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'

export default function WidgetDemo() {
  const demoId = process.env.NEXT_PUBLIC_DEMO_BUSINESS_ID
  return (
    <div className="bg-page min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-[#787774]">Widget demo</p>
        <h1 className="font-serif-d text-4xl md:text-5xl mt-4 text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Talk to a clinic agent
        </h1>
        {demoId ? (
          <Link href={`/sites/${demoId}`} className="btn-primary mt-8">Open demo clinic</Link>
        ) : (
          <p className="text-sm text-[#787774] mt-4">
            Set <code>NEXT_PUBLIC_DEMO_BUSINESS_ID</code> to a business slug to preview the live widget.
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
