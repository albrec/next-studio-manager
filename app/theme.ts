'use client'
import { Roboto } from 'next/font/google'
import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

let theme = createTheme({
  typography: {
    // fontSize: 16,
    fontFamily: roboto.style.fontFamily,
    h1: { fontSize: '2.5rem' },
    h2: { fontSize: '2rem' },
    h3: { fontSize: '1.5rem' },
    h4: { fontSize: '1.25rem' },
    h5: { fontSize: '1rem' },
    h6: { fontSize: '.75rem' },
  },
})

theme = responsiveFontSizes(theme)

export default theme