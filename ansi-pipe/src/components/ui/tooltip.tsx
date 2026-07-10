'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: string
  children: ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => setShow(false), 2000)
    return () => clearTimeout(timer)
  }, [show])

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      ref={ref}
    >
      {children}
      {show && (
        <div
          className={cn(
            'absolute z-50 rounded-lg bg-foreground px-2.5 py-1.5 text-xs text-background shadow-lg',
            side === 'top' && 'bottom-full left-1/2 mb-2 -translate-x-1/2',
            side === 'bottom' && 'left-1/2 top-full mt-2 -translate-x-1/2',
            side === 'left' && 'right-full top-1/2 mr-2 -translate-y-1/2',
            side === 'right' && 'left-full top-1/2 ml-2 -translate-y-1/2'
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
