'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePipeStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import {
  Copy,
  Share2,
  FileDown,
  FileSpreadsheet,
  Heart,
  Bookmark,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  copyResultsToClipboard,
  exportToPdf,
  exportToExcel,
  shareResults,
} from '@/lib/export'
import type { PipeEntry, PipeCalculations } from '@/types'

export function ExportActions() {
  const store = usePipeStore()

  if (!store.result || !store.calculations) return null

  const pipe: PipeEntry = store.result
  const calculations: PipeCalculations = store.calculations
  const isFavorite = store.favorites.some(
    (f) => f.pipeSize === pipe.pipeSize && f.schedule === pipe.schedule
  )

  async function handleCopy() {
    try {
      await copyResultsToClipboard(pipe, calculations)
      toast.success('Copied to clipboard')
    } catch {
      toast.error('Failed to copy')
    }
  }

  function handlePdf() {
    toast.promise(exportToPdf(pipe, calculations), {
      loading: 'Generating PDF...',
      success: 'PDF downloaded',
      error: 'Failed to generate PDF',
    })
  }

  function handleExcel() {
    toast.promise(exportToExcel(pipe, calculations), {
      loading: 'Generating Excel...',
      success: 'Excel downloaded',
      error: 'Failed to generate Excel',
    })
  }

  async function handleShare() {
    try {
      const shared = await shareResults(pipe, calculations)
      toast.success(shared ? 'Shared!' : 'Copied to clipboard')
    } catch {
      toast.error('Failed to share')
    }
  }

  function handleFavorite() {
    store.toggleFavorite(pipe.pipeSize, pipe.schedule)
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-5 gap-2"
      >
        <Tooltip content="Copy to clipboard">
          <Button variant="secondary" size="sm" onClick={handleCopy} className="w-full">
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
        </Tooltip>

        <Tooltip content="Share result">
          <Button variant="secondary" size="sm" onClick={handleShare} className="w-full">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </Tooltip>

        <Tooltip content="Export as PDF">
          <Button variant="secondary" size="sm" onClick={handlePdf} className="w-full">
            <FileDown className="h-4 w-4" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
        </Tooltip>

        <Tooltip content="Export as Excel">
          <Button variant="secondary" size="sm" onClick={handleExcel} className="w-full">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Excel</span>
          </Button>
        </Tooltip>

        <Tooltip content={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFavorite}
            aria-pressed={isFavorite}
            className={
              isFavorite
                ? 'w-full border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-400'
                : 'w-full border-dashed'
            }
          >
            {isFavorite ? (
              <Heart className="h-4 w-4 fill-current" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
          </Button>
        </Tooltip>
      </motion.div>
    </AnimatePresence>
  )
}
