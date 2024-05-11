"use client"

import { ConnectionsProvider } from "./state/connectionContext"
import { DevicesProvider } from "./state/deviceContext"

export default function ContextWrapper ({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <DevicesProvider>
            <ConnectionsProvider>
                { children }
            </ConnectionsProvider>
        </DevicesProvider>
    )
}