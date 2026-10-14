import Link from 'next/link'
import { requireBusiness } from '@/lib/dal'
import SettingsForm from '@/components/SettingsForm'

export default async function SettingsPage() {
  const { business } = await requireBusiness()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return (
    <div className="space-y-8">
      <h1 className="font-serif-d text-4xl md:text-5xl text-balance" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>Settings</h1>
      <SettingsForm business={business} />

      <section className="card-raised p-6 max-w-xl space-y-3" aria-label="Connections">
        <h2 className="text-xl font-semibold">Connections</h2>
        <div>
          <p className="text-sm font-semibold">Public booking page</p>
          <Link href={`/sites/${business.slug}`} className="text-sm text-[#111111] underline-offset-4 hover:underline">
            {appUrl}/sites/{business.slug}
          </Link>
        </div>
        <div>
          <p className="text-sm font-semibold">Twilio voice webhook</p>
          <p className="text-sm text-[#2F3437] text-pretty">Paste this into the Twilio number voice webhook (POST).</p>
          <code className="block text-sm bg-[#F7F6F3] border divider rounded-lg px-3 py-2 mt-2 break-all">
            {appUrl}/api/twilio/voice?businessId={business.id}
          </code>
        </div>
      </section>
    </div>
  )
}
