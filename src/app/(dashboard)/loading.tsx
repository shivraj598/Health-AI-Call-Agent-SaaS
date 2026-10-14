export default function DashboardLoading() {
  return (
    <div className="space-y-4" aria-label="Loading dashboard">
      <div className="skeleton h-10 w-64" />
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-32" />
        ))}
      </div>
      <div className="skeleton h-64" />
    </div>
  )
}
