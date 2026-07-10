'use client'

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
} from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from './scroll-area'

export interface CommandOption {
  label: string
  value: string
}

interface CommandInputProps {
  options: CommandOption[]
  onSelect: (option: CommandOption) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  value?: string
}

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
  (
    {
      options,
      onSelect,
      placeholder = 'Search...',
      emptyMessage = 'No results found.',
      className,
      value,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState(value || '')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      setSearch(value || '')
    }, [value])

    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    )

    useEffect(() => {
      setSelectedIndex(0)
    }, [search])

    useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex])
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    function handleSelect(option: CommandOption) {
      setSearch(option.label)
      setOpen(false)
      onSelect(option)
    }

    return (
      <div ref={containerRef} className="relative">
        <input
          ref={ref}
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            'flex h-12 w-full rounded-xl border border-border bg-card px-4 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            className
          )}
        />
        {open && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1.5 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            <ScrollArea className="max-h-60">
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">{emptyMessage}</div>
              ) : (
                filtered.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      'flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors',
                      index === selectedIndex
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </ScrollArea>
          </div>
        )}
      </div>
    )
  }
)
CommandInput.displayName = 'CommandInput'
