'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePipeStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Heart, Trash2 } from 'lucide-react'

export function Favorites() {
  const { favorites, removeFavorite, setPipeSize, setSchedule } = usePipeStore()

  if (favorites.length === 0) return null

  function handleSelect(entry: (typeof favorites)[0]) {
    setPipeSize(entry.pipeSize)
    setTimeout(() => setSchedule(entry.schedule), 50)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <CardTitle className="text-sm">Favorites</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="max-h-40">
            <div className="space-y-1">
              <AnimatePresence>
                {favorites.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="group flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                  >
                    <button
                      onClick={() => handleSelect(entry)}
                      className="flex-1 text-left"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {entry.pipeSize}"
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        Schedule {entry.schedule}
                      </span>
                    </button>
                    <button
                      onClick={() => removeFavorite(entry.id)}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
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
