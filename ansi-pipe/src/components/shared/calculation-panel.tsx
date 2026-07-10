'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePipeStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CalculationPanel() {
  const { result, calculations, totalLength, setTotalLength } = usePipeStore()

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
              <CardTitle>Calculations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="length">Pipe Length (feet)</Label>
                <Input
                  id="length"
                  type="number"
                  min={0}
                  step={0.5}
                  value={totalLength}
                  onChange={(e) => setTotalLength(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-xs text-muted-foreground">
                    Inside Diameter
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {calculations.insideDiameter.inch}"
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {calculations.insideDiameter.mm} mm
                  </p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-xs text-muted-foreground">
                    Flow Area
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {calculations.flowArea.squareInch} in²
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {calculations.flowArea.squareMm} mm²
                  </p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-xs text-muted-foreground">
                    Volume
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {calculations.volumePerFoot.cubicInch} in³/ft
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {calculations.volumePerFoot.litersPerM} L/m
                  </p>
                </div>
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-xs text-muted-foreground">
                    Total Weight
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {calculations.weightPerLength.lb} lb
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {calculations.weightPerLength.kg} kg
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
