'use client'

import { ThemeToggle } from './theme-toggle'
import { Pipette } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Pipette className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight text-foreground">
              ANSI Pipe Schedule
            </h1>
            <p className="text-xs text-muted-foreground">
              Calculator
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
