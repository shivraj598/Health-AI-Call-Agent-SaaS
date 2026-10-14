import Link from 'next/link'

export default function WidgetDemo() {
  const demoId = process.env.NEXT_PUBLIC_DEMO_BUSINESS_ID
  return (
    <main className="bg-page min-h-screen p-6 flex items-center justify-center">
      <div className="card-raised max-w-md w-full p-8">
        <h1 className="text-xl font-bold">Widget demo</h1>
        {demoId ? (
          <Link href={`/sites/${demoId}`} className="btn-primary mt-4">Open demo clinic</Link>
        ) : (
          <p className="text-sm text-slate-500 mt-2">
            Set <code>NEXT_PUBLIC_DEMO_BUSINESS_ID</code> to a business slug to preview the live widget.
          </p>
        )}
      </div>
    </main>
  )
}
