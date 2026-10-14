export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen gradient-mesh flex items-center justify-center p-6">
      <div className="card-raised w-full max-w-md p-8 animate-fade-up">{children}</div>
    </main>
  )
}
