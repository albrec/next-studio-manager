"use client"

import { AlertsProvider } from "./alertContext"

export default function ContextWrapper ({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AlertsProvider>
      { children }
    </AlertsProvider>
  )
}