'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { searchPipesByThickness } from '@/lib/pipe-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Ruler } from 'lucide-react'
import { inchToMm } from '@/lib/utils'

export function ThicknessSearch() {
  const [value, setValue] = useState('')
  const inches = parseFloat(value)

  const results = useMemo(() => {
    if (isNaN(inches) || inches <= 0) return []
    const mm = inchToMm(inches)
    return searchPipesByThickness(mm)
  }, [inches])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm">Search by Wall Thickness</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="number"
            step={0.001}
            min={0}
            placeholder="Thickness in inches..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pl-9"
          />
        </div>

        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ScrollArea className="max-h-48">
                <div className="space-y-1">
                  {results.slice(0, 20).map((pipe, i) => (
                    <motion.div
                      key={`${pipe.pipeSize}-${pipe.schedule}-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <span className="font-medium text-foreground">
                        {pipe.pipeSize}"
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Sch {pipe.schedule} • {pipe.wallThickness.inch.toFixed(3)}"
                      </span>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
          {!isNaN(inches) && results.length === 0 && value && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-muted-foreground"
            >
              No pipes found with {inches}" wall thickness
            </motion.p>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
