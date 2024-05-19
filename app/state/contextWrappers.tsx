"use client"

import { AlertsProvider } from "./alertContext"
import { ConnectionsProvider } from "./connectionContext"
import { DevicesProvider } from "./deviceContext"

export default function ContextWrapper ({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AlertsProvider>
      <DevicesProvider>
        <ConnectionsProvider>
          { children }
        </ConnectionsProvider>
      </DevicesProvider>
    </AlertsProvider>
  )
}