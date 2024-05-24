'use client'
import { Roboto } from 'next/font/google'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const defaultTheme = createTheme()

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const typography = {
  fontSize: 16,
  fontFamily: roboto.style.fontFamily,
  h1: { fontSize: '2.5rem' },
  h2: { fontSize: '2rem' },
  h3: { fontSize: '1.5rem' },
  h4: { fontSize: '1.25rem' },
  h5: { fontSize: '1rem' },
  h6: { fontSize: '.75rem' },
}

const components = {
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: defaultTheme.palette.grey[400],
        color: defaultTheme.palette.common.white,
      }
    }
  }
}


let theme = createTheme({
  ...defaultTheme,
  typography,
  components,
})

theme = responsiveFontSizes(theme)

export default theme