'use client'

import { useEffect } from 'react'
import { useBusinessStore } from '@/store/business'
import type { Business } from '@/types/database'

export default function BusinessProvider({
  business,
  children,
}: {
  business: Business | null
  children: React.ReactNode
}) {
  const setBusiness = useBusinessStore((s) => s.setBusiness)
  useEffect(() => {
    setBusiness(business)
  }, [business, setBusiness])
  return <>{children}</>
}
