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
  Camera,
  Heart,
  Bookmark,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  copyResultsToClipboard,
  exportToPdf,
  exportToExcel,
  shareAsImage,
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

  function handleImage() {
    toast.promise(shareAsImage('pipe-result-card'), {
      loading: 'Generating image...',
      success: 'Image downloaded',
      error: 'Failed to generate image',
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
        className="flex flex-wrap items-center gap-2"
      >
        <Tooltip content="Copy to clipboard">
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </Tooltip>

        <Tooltip content="Share result">
          <Button variant="secondary" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </Tooltip>

        <Tooltip content="Export as PDF">
          <Button variant="secondary" size="sm" onClick={handlePdf}>
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
        </Tooltip>

        <Tooltip content="Export as Excel">
          <Button variant="secondary" size="sm" onClick={handleExcel}>
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
        </Tooltip>

        <Tooltip content="Save as image">
          <Button variant="secondary" size="sm" onClick={handleImage}>
            <Camera className="h-4 w-4" />
            Image
          </Button>
        </Tooltip>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <Tooltip content={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFavorite}
            aria-pressed={isFavorite}
            className={
              isFavorite
                ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-400'
                : 'border-dashed'
            }
          >
            {isFavorite ? (
              <Heart className="h-4 w-4 fill-current" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {isFavorite ? 'Saved' : 'Save'}
          </Button>
        </Tooltip>
      </motion.div>
    </AnimatePresence>
  )
}
