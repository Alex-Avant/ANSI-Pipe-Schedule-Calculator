'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        duration: 2000,
        className: '!rounded-xl !border !border-border !shadow-lg',
      }}
    />
  )
}
