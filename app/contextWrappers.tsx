"use client"

import { AlertsProvider } from "./state/alertContext"
import { ConnectionsProvider } from "./state/connectionContext"
import { DevicesProvider } from "./state/deviceContext"

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