'use client'

import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@mui/material"

export default function NavButton({ href, children }: { href: string, children: React.ReactNode }) {
    const pathName = usePathname()
  
    return (
      <Button className="h-8" component={ NextLink } href={ href } variant={ pathName === href ? 'contained' : 'outlined'}>
        { children }
      </Button>
    )
  }