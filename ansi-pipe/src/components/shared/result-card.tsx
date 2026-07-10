'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePipeStore } from '@/store'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Ruler,
  Weight,
  Circle,
  Maximize2,
  Droplets,
  Hash,
} from 'lucide-react'

function StatRow({
  icon: Icon,
  label,
  imperial,
  metric,
}: {
  icon: React.ElementType
  label: string
  imperial: string
  metric: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted p-3 transition-colors hover:bg-muted/80">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card shadow-sm">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {imperial}
          </span>
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs text-muted-foreground">
            {metric}
          </span>
        </div>
      </div>
    </div>
  )
}

export function ResultCard() {
  const { result, calculations } = usePipeStore()

  if (!result || !calculations) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${result.pipeSize}-${result.schedule}`}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card className="overflow-hidden">
          <div
            id="pipe-result-card"
            className="bg-gradient-to-br from-background to-card p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {result.pipeSize}"
                </h3>
                <p className="text-sm text-muted-foreground">
                  Nominal Pipe Size • Schedule {result.schedule}
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                SCH {result.schedule}
              </Badge>
            </div>

            <Separator className="mb-5" />

            <div className="grid gap-2.5 sm:grid-cols-2">
              <StatRow
                icon={Maximize2}
                label="Outside Diameter (OD)"
                imperial={`${result.outsideDiameter.inch}"`}
                metric={`${result.outsideDiameter.mm} mm`}
              />
              <StatRow
                icon={Ruler}
                label="Wall Thickness (WT)"
                imperial={`${result.wallThickness.inch}"`}
                metric={`${result.wallThickness.mm} mm`}
              />
              <StatRow
                icon={Circle}
                label="Inside Diameter (ID)"
                imperial={`${calculations.insideDiameter.inch}"`}
                metric={`${calculations.insideDiameter.mm} mm`}
              />
              <StatRow
                icon={Hash}
                label="Flow Area"
                imperial={`${calculations.flowArea.squareInch} in²`}
                metric={`${calculations.flowArea.squareMm} mm²`}
              />
              <StatRow
                icon={Weight}
                label="Weight per Foot"
                imperial={`${result.weight.lbPerFt} lb/ft`}
                metric={`${result.weight.kgPerM} kg/m`}
              />
              <StatRow
                icon={Droplets}
                label="Volume per Foot"
                imperial={`${calculations.volumePerFoot.cubicInch} in³`}
                metric={`${calculations.volumePerFoot.litersPerM} L/m`}
              />
            </div>

            <Separator className="my-5" />

            <div className="rounded-xl bg-primary p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-primary-foreground/70">Total Weight</p>
                  <p className="text-lg font-semibold text-primary-foreground">
                    {calculations.weightPerLength.lb} lb
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-primary-foreground/70">Length</p>
                  <p className="text-lg font-semibold text-primary-foreground">
                    {calculations.totalLength} ft
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-primary-foreground/70">Metric</p>
                  <p className="text-lg font-semibold text-primary-foreground">
                    {calculations.weightPerLength.kg} kg
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
