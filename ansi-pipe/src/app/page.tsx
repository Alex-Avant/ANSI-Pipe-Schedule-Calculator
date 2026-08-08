'use client'

import { PipeSelector } from '@/components/shared/pipe-selector'
import { ScheduleSelector } from '@/components/shared/schedule-selector'
import { LengthSelector } from '@/components/shared/length-selector'
import { ResultCard } from '@/components/shared/result-card'
import { CalculationPanel } from '@/components/shared/calculation-panel'
import { ExportActions } from '@/components/shared/export-actions'
import { SearchHistory } from '@/components/shared/search-history'
import { Favorites } from '@/components/shared/favorites'
import { Footer } from '@/components/layout/footer'
import { ServiceWorkerRegister } from '@/components/shared/service-worker-register'

export default function Home() {
  return (
    <>
      <ServiceWorkerRegister />
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Pipe Schedule Calculator
          </h2>
          <p className="text-sm text-muted-foreground">
            Select a pipe size and schedule to view detailed specifications and calculations.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PipeSelector />
          <ScheduleSelector />
          <LengthSelector />
        </div>

        <ExportActions />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <ResultCard />
            <CalculationPanel />
          </div>
          <div className="space-y-6">
            <SearchHistory />
            <Favorites />
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
