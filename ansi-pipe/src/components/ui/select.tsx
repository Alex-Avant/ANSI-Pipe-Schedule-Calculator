'use client'

import { useCallback, type ChangeEvent } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  options: SelectOption[]
  placeholder?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function Select({
  options,
  placeholder = 'Select...',
  value,
  onChange,
  disabled = false,
  className,
}: SelectProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value)
    },
    [onChange]
  )

  return (
    <div className="relative">
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          'flex h-12 w-full appearance-none rounded-xl border border-border bg-card px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
