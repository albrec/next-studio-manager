"use client";

import { DevicesProvider } from "./state/deviceContext";

export default function ContextWrapper ({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <DevicesProvider>
            { children }
        </DevicesProvider>
    )
}