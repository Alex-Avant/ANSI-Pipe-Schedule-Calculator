'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useEffect, type ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    function handler(e: ErrorEvent) {
      if (
        e.message?.includes('releasePointerCapture') ||
        e.message?.includes('setPointerCapture')
      ) {
        e.preventDefault()
      }
    }
    window.addEventListener('error', handler)
    return () => window.removeEventListener('error', handler)
  }, [])

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
