'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePipeStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Droplets, Gauge, Hash, Layers, Ruler, Weight } from 'lucide-react'

function formatNumber(value: number, maxFractionDigits = 2): string {
  if (!isFinite(value)) return '0'
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFractionDigits,
  }).format(value)
}

interface TotalRowProps {
  icon: React.ElementType
  label: string
  imperial: string
  metric?: string
}

function TotalRow({ icon: Icon, label, imperial, metric }: TotalRowProps) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg bg-totals-foreground/10 px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2">
        <Icon
          className="h-3.5 w-3.5 shrink-0 text-totals-foreground/90"
          aria-hidden="true"
        />
        <p className="text-xs text-totals-foreground/90">{label}</p>
      </div>
      <div className="text-right tabular-nums">
        <p className="text-base font-semibold leading-tight">{imperial}</p>
        {metric && (
          <p className="text-xs leading-tight text-totals-foreground/85">
            {metric}
          </p>
        )}
      </div>
    </li>
  )
}

export function CalculationPanel() {
  const { result, calculations, totals } = usePipeStore()

  const overallLength =
    calculations && totals ? calculations.totalLength * totals.quantity : 0

  return (
    <AnimatePresence>
      {result && calculations && totals && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-accent" />
                  <CardTitle>Calculations</CardTitle>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>
                    <span className="font-semibold text-foreground">
                      {formatNumber(totals.quantity)}
                    </span>{' '}
                    {totals.quantity === 1 ? 'pipe' : 'pipes'} ×{' '}
                    <span className="font-semibold text-foreground">
                      {formatNumber(calculations.totalLength)}
                    </span>{' '}
                    ft each
                  </p>
                  <p>{formatNumber(overallLength)} ft overall</p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div
                className="rounded-xl bg-totals p-4 text-totals-foreground sm:p-5"
                role="region"
                aria-label="Total calculations"
                aria-live="polite"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-totals-foreground/90" />
                  <p className="text-[11px] font-semibold uppercase tracking-wider">
                    Total — {formatNumber(totals.quantity)}{' '}
                    {totals.quantity === 1 ? 'Pipe' : 'Pipes'}
                  </p>
                </div>

                <ul className="space-y-2">
                  <TotalRow
                    icon={Ruler}
                    label="Total Length"
                    imperial={`${formatNumber(overallLength)} ft`}
                  />
                  <TotalRow
                    icon={Weight}
                    label="Total Weight"
                    imperial={`${formatNumber(totals.weight.lb)} lb`}
                    metric={`${formatNumber(totals.weight.kg)} kg`}
                  />
                  <TotalRow
                    icon={Hash}
                    label="Total Flow Area"
                    imperial={`${formatNumber(totals.flowArea.squareInch, 3)} in²`}
                    metric={`${formatNumber(totals.flowArea.squareMm, 3)} mm²`}
                  />
                  <TotalRow
                    icon={Droplets}
                    label="Total Volume"
                    imperial={`${formatNumber(totals.volume.cubicInch, 3)} in³`}
                    metric={`${formatNumber(totals.volume.liters, 3)} L`}
                  />
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
