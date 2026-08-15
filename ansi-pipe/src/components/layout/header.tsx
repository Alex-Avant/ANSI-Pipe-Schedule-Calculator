'use client'

import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { Logo } from '@/components/brand/logo'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          aria-label="ANSI Pipe Schedule Calculator"
          className="flex items-center rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Logo />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
