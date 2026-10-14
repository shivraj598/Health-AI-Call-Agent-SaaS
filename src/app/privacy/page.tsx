import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main id="main" className="bg-page min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm font-medium text-teal-700">Back to home</Link>
        <h1 className="text-3xl font-semibold mt-4 text-balance">Privacy policy</h1>
        <div className="mt-8 space-y-4 text-base text-slate-700">
          <p className="text-pretty">HealthCall stores clinic data, patient records, call transcripts, and appointment details in a dedicated database per clinic. Each clinic can only read its own rows.</p>
          <p className="text-pretty">Demo requests keep your name, clinic, email, and phone so the team can reply. Nothing is sold or shared with advertisers.</p>
          <p className="text-pretty">To request export or deletion of your data, reply to any message from the team.</p>
        </div>
      </div>
    </main>
  )
}
