'use client'

import { create } from 'zustand'
import type { Business } from '@/types/database'

interface BusinessState {
  business: Business | null
  setBusiness: (b: Business | null) => void
}

export const useBusinessStore = create<BusinessState>((set) => ({
  business: null,
  setBusiness: (business) => set({ business }),
}))
