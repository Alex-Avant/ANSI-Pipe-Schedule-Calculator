import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/theme-provider'
import { Header } from '@/components/layout/header'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ANSI Pipe Schedule Calculator',
  description:
    'Professional pipe schedule calculator for engineers, technicians, and industrial professionals. Instant ANSI pipe data with imperial and metric units.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pipe Calculator',
  },
  applicationName: 'ANSI Pipe Schedule Calculator',
  keywords: [
    'pipe schedule',
    'ANSI pipe',
    'pipe calculator',
    'industrial',
    'engineering',
    'NPS',
    'schedule 40',
    'pipe dimensions',
  ],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground">
        <ThemeProvider>
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
