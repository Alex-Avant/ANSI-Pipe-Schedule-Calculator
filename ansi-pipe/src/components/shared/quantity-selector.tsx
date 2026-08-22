'use client'

import { useEffect, useRef, useState } from 'react'
import { usePipeStore } from '@/store'
import { cn } from '@/lib/utils'
import { sanitizeQuantityInput, parseQuantity } from '@/lib/validation'

export function QuantitySelector() {
  const { quantity, setQuantity } = usePipeStore()

  const [quantityInput, setQuantityInput] = useState<string>(() =>
    String(quantity ?? 1)
  )
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFocusedRef = useRef(false)

  useEffect(() => {
    if (isFocusedRef.current) return
    setQuantityInput(String(quantity))
  }, [quantity])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  function handleChange(value: string) {
    const sanitized = sanitizeQuantityInput(value)
    setQuantityInput(sanitized)
    setError(null)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const parsed = parseQuantity(sanitized)
      if (parsed !== null) {
        setQuantity(parsed)
      }
    }, 350)
  }

  function handleBlur() {
    isFocusedRef.current = false

    if (debounceRef.current) clearTimeout(debounceRef.current)

    const trimmed = quantityInput.trim()
    const parsed = parseQuantity(trimmed)
    if (parsed === null) {
      setError('Enter a whole number greater than or equal to 1')
      setQuantityInput(String(quantity))
      return
    }
    setQuantityInput(String(parsed))
    setQuantity(parsed)
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="quantity"
        className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
      >
        Pipe Quantity
      </label>
      <div className="relative">
        <input
          id="quantity"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={quantityInput}
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
          placeholder="1"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'quantity-error' : undefined}
          className={cn(
            'flex h-12 w-full appearance-none rounded-xl border border-border bg-card py-2 pl-4 pr-10 text-sm shadow-sm transition-colors',
            'placeholder:text-muted-foreground',
            error && 'border-destructive focus-visible:ring-destructive',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
          )}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
          pcs
        </span>
      </div>
      {error && (
        <p id="quantity-error" role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
