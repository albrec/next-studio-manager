import type { Metadata } from "next"
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline, Typography, ThemeProvider, Box, Divider } from "@mui/material"
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'

import {
  Experimental_CssVarsProvider as CssVarsProvider,
} from '@mui/material/styles'
import theme from "./theme"
import "./globals.css"

import { Provider } from "react-redux"
import ContextWrapper from "./state/contextWrappers"
import FileControls from "./components/fileControls"
import Alerts from "./components/alerts"
import Nav from "./components/nav"
import StoreProvider from "./storeProvider"


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
      <StoreProvider>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <CssVarsProvider>
            <ThemeProvider theme={ theme }>
              <CssBaseline />
              <body>
                <Alerts />
                <header className="flex flex-col items-center">
                  <Typography className="my-4 font-thin" variant="h3">Next Studio Manager</Typography>
                  <Nav />
                  <Box className="absolute top-4 right-4">
                    <FileControls />
                  </Box>
                </header>
                <main>
                  {children}
                </main>
                <footer className="flex justify-around bg-zinc-500 text-white mt-4 p-4">
                  <Box>Next Studio Manager™</Box>
                  <Box>© David Souza | AinaTek</Box>
                </footer>
              </body>
            </ThemeProvider>
          </CssVarsProvider>
        </AppRouterCacheProvider>
      </StoreProvider>
    </html>
  )
}