'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useEffect, type ReactNode } from 'react'

function isIgnorablePointerError(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { name?: string }).name === 'NotFoundError'
  )
}

if (typeof window !== 'undefined') {
  const originalRelease = Element.prototype.releasePointerCapture
  const originalSet = Element.prototype.setPointerCapture

  Element.prototype.releasePointerCapture = function (pointerId: number) {
    try {
      originalRelease.call(this, pointerId)
    } catch (error) {
      if (!isIgnorablePointerError(error)) throw error
    }
  }

  Element.prototype.setPointerCapture = function (pointerId: number) {
    try {
      originalSet.call(this, pointerId)
    } catch (error) {
      if (!isIgnorablePointerError(error)) throw error
    }
  }
}

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
