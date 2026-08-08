'use client'

import { useEffect, useRef, useState } from 'react'
import { usePipeStore } from '@/store'
import { cn } from '@/lib/utils'

export function LengthSelector() {
  const { totalLength, setTotalLength } = usePipeStore()

  const [lengthInput, setLengthInput] = useState<string>(() =>
    String(totalLength ?? '')
  )
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFocusedRef = useRef(false)

  useEffect(() => {
    if (isFocusedRef.current) return
    const next = totalLength === 0 ? '' : String(totalLength)
    setLengthInput(next)
  }, [totalLength])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  function handleChange(value: string) {
    const raw = value.replace(/[^0-9.]/g, '')
    const dotIndex = raw.indexOf('.')
    const sanitized =
      dotIndex === -1
        ? raw
        : raw.slice(0, dotIndex + 1) + raw.slice(dotIndex + 1).replace(/\./g, '')

    setLengthInput(sanitized)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (sanitized.trim() === '' || sanitized === '.') {
        setTotalLength(0)
        return
      }
      const parsed = parseFloat(sanitized)
      if (!isNaN(parsed)) {
        setTotalLength(parsed)
      }
    }, 350)
  }

  function handleBlur() {
    isFocusedRef.current = false

    if (debounceRef.current) clearTimeout(debounceRef.current)

    const trimmed = lengthInput.trim()
    if (trimmed === '' || trimmed === '.') {
      setLengthInput(String(totalLength || ''))
      return
    }
    const parsed = parseFloat(trimmed)
    if (isNaN(parsed)) {
      setLengthInput(String(totalLength || ''))
      return
    }
    const clamped = Math.max(0, parsed)
    setLengthInput(String(clamped))
    setTotalLength(clamped)
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="length"
        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
      >
        Pipe Length (feet)
      </label>
      <div className="relative">
        <input
          id="length"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={lengthInput}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            isFocusedRef.current = true
          }}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              ;(e.target as HTMLInputElement).blur()
            }
          }}
          placeholder="0"
          className={cn(
            'flex h-12 w-full appearance-none rounded-xl border border-border bg-card py-2 pl-4 pr-10 text-sm shadow-sm transition-colors',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
          )}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
          ft
        </span>
      </div>
    </div>
  )
}
