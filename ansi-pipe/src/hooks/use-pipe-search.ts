import { useMemo, useCallback } from 'react'
import { usePipeStore } from '@/store'
import { getPipeData } from '@/lib/pipe-data'

export function usePipeSearch() {
  const { selectedSize, selectedSchedule, setPipeSize, setSchedule } = usePipeStore()

  const pipeData = useMemo(() => getPipeData(), [])

  const sizes = useMemo(() => {
    const set = new Set(pipeData.map((p) => p.pipeSize))
    return Array.from(set).sort(
      (a, b) => parseFloat(a) - parseFloat(b)
    )
  }, [pipeData])

  const schedules = useMemo(() => {
    if (!selectedSize) return []
    const set = new Set(
      pipeData.filter((p) => p.pipeSize === selectedSize).map((p) => p.schedule)
    )
    return Array.from(set)
  }, [pipeData, selectedSize])

  const handleSizeChange = useCallback(
    (size: string | null) => setPipeSize(size),
    [setPipeSize]
  )

  const handleScheduleChange = useCallback(
    (schedule: string | null) => setSchedule(schedule),
    [setSchedule]
  )

  return {
    sizes,
    schedules,
    selectedSize,
    selectedSchedule,
    setPipeSize: handleSizeChange,
    setSchedule: handleScheduleChange,
  }
}
