'use client'

import { Box, ButtonGroup, Typography } from "@mui/material"
import NavButton from "./navLink"



export default function Nav() {
    return (
        <nav className="flex justify-center gap-8">
            <ButtonGroup className="flex">
                <NavButton href="/">Home</NavButton>
            </ButtonGroup>

            <Box className="flex flex-col items-center">
                <ButtonGroup className="flex">
                    <NavButton href="/devices">Devices</NavButton>
                    <NavButton href="/connections">Connections</NavButton>
                </ButtonGroup>
                <GroupName>Setup</GroupName>
            </Box>

            <Box className="flex flex-col items-center">
                <ButtonGroup className="flex">
                    <NavButton href="/labels">Labels</NavButton>
                </ButtonGroup>
                <GroupName>Utilities</GroupName>
            </Box>
        </nav>
    )
}

function GroupName({ children }: {children: React.ReactNode }) {
    return (
        <Typography className="w-full text-center pt-1 mt-2 border-t border-0 border-solid border-[var(--foreground-light)] text-[var(--foreground-light)]" variant="h4">{ children }</Typography>
    )
}