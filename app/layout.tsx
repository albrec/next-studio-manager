import type { Metadata } from "next"
import NextLink from "next/link"
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import classNames from "classnames"
import { ButtonGroup, CssBaseline, Typography, ThemeProvider, Box } from "@mui/material"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'


import theme from "./theme"
import "./globals.css"

import ContextWrapper from "./contextWrappers"
import FileControls from "./components/fileControls"
import Alerts from "./components/alerts"
import { usePathname } from "next/navigation"
import NavButton from "./components/navLink"
import Nav from "./components/nav"

export const metadata: Metadata = {
  title: { default: "Next Studio Manager", template: "%s | Next Studio Manager" },
  description: "Helping you define, connect and manage your studio.",
  keywords: ['Studio', 'Studio Management'],
  authors: [{ name: "David Souza" }],
  creator: "David Souza",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* <meta name="viewport" content="initial-scale=1, width=device-width" /> */}
      </head>
      <ContextWrapper>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={ theme }>
            <CssBaseline />
            <body className={ classNames('px-12') }>
              <header className="flex flex-col items-center mb-12 relative">
                <Typography className="my-4 font-thin" variant="h3">Next Studio Manager</Typography>
                <Nav />
                <Box className="absolute top-4 right-4">
                  <FileControls />
                </Box>
                <Alerts />
              </header>
              {children}
            </body>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </ContextWrapper>
    </html>
  )
}