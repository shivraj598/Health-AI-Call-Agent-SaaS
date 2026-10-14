'use client'

import { create } from 'zustand'

interface VoiceState {
  status: 'idle' | 'connecting' | 'live'
  setStatus: (s: VoiceState['status']) => void
}

export const useVoiceStore = create<VoiceState>((set) => ({
  status: 'idle',
  setStatus: (status) => set({ status }),
}))
