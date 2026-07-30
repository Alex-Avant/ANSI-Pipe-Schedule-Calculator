'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePipeStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Circle,
  Droplets,
  Weight,
  Hash,
  Gauge,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PipeEntry } from '@/types'

function formatNumber(value: number, maxFractionDigits = 2): string {
  if (!isFinite(value)) return '0'
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFractionDigits,
  }).format(value)
}

interface StatItem {
  icon: React.ElementType
  label: string
  imperial: string
  metric: string
}

const statsConfig = (result: PipeEntry, calc: NonNullable<ReturnType<typeof usePipeStore.getState>['calculations']>): StatItem[] => [
  {
    icon: Circle,
    label: 'Inside Diameter (ID)',
    imperial: `${formatNumber(calc.insideDiameter.inch, 3)}"`,
    metric: `${formatNumber(calc.insideDiameter.mm)} mm`,
  },
  {
    icon: Hash,
    label: 'Flow Area',
    imperial: `${formatNumber(calc.flowArea.squareInch, 3)} in²`,
    metric: `${formatNumber(calc.flowArea.squareMm, 3)} mm²`,
  },
  {
    icon: Droplets,
    label: 'Volume per Foot',
    imperial: `${formatNumber(calc.volumePerFoot.cubicInch, 3)} in³/ft`,
    metric: `${formatNumber(calc.volumePerFoot.litersPerM)} L/m`,
  },
  {
    icon: Weight,
    label: 'Weight per Foot',
    imperial: `${formatNumber(result.weight.lbPerFt)} lb/ft`,
    metric: `${formatNumber(result.weight.kgPerM)} kg/m`,
  },
]

export function CalculationPanel() {
  const { result, calculations, totalLength, setTotalLength } = usePipeStore()

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
    <AnimatePresence>
      {result && calculations && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-accent" />
                  <CardTitle>Calculations</CardTitle>
                </div>
                <span className="text-xs text-muted-foreground">
                  For {formatNumber(totalLength)} ft length
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="length">Pipe Length (feet)</Label>
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
                        (e.target as HTMLInputElement).blur()
                      }
                    }}
                    placeholder="0"
                    className={cn(
                      'flex h-12 w-full appearance-none rounded-xl border border-border bg-card pl-4 pr-10 py-2 text-sm shadow-sm transition-colors',
                      'placeholder:text-muted-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
                    )}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    ft
                  </span>
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {statsConfig(result!, calculations).map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div
                      key={stat.label}
                      className="flex items-center gap-3 rounded-xl bg-muted/60 p-3 transition-colors hover:bg-muted"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card shadow-sm ring-1 ring-border">
                        <Icon className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          {stat.label}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {stat.imperial}
                          </span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">
                            {stat.metric}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="rounded-xl bg-primary p-4 text-primary-foreground">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-primary-foreground/70">
                      Total Weight
                    </p>
                    <p className="text-lg font-semibold">
                      {formatNumber(calculations.weightPerLength.lb)} lb
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-primary-foreground/70">Metric</p>
                    <p className="text-lg font-semibold">
                      {formatNumber(calculations.weightPerLength.kg)} kg
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
