'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePipeStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Clock, Trash2, RotateCcw } from 'lucide-react'

export function SearchHistory() {
  const { history, clearHistory, applySelection } = usePipeStore()

  function handleRestore(entry: (typeof history)[0]) {
    applySelection(entry.pipeSize, entry.schedule)
  }

  if (history.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">History</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearHistory}
              aria-label="Clear history"
              className="h-8 w-8"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="max-h-40">
            <div className="space-y-1">
              <AnimatePresence>
                {history.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="group flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                  >
                    <div>
                      <span className="text-sm font-medium text-foreground">
{entry.pipeSize}&quot;
                       
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        Schedule {entry.schedule}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRestore(entry)}
                      className="rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Restore search ${entry.pipeSize} inch Schedule ${entry.schedule}`}
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}
