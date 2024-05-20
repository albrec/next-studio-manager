'use client'
import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'
import { reHydrate, reHydrateData } from '@/lib/middleware/localStorage'

export default function StoreProvider({ children, }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>()
  const hasHydrated = useRef(false)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  useEffect(() => {
    if(storeRef.current && !hasHydrated.current) {
      storeRef.current?.dispatch(reHydrate(reHydrateData()))
      hasHydrated.current = true
    }
  })

  return <Provider store={storeRef.current}>{children}</Provider>
}