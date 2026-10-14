'use client'

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="card-raised p-8 text-center" role="alert">
      <h1 className="text-xl font-semibold">Dashboard failed to load</h1>
      <p className="text-sm text-[#787774] mt-2 text-pretty">Check your connection and sign in state, then try again.</p>
      <button onClick={reset} className="btn-primary mt-4">Try again</button>
    </div>
  )
}
