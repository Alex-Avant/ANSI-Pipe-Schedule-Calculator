import type { PipeEntry } from '@/types'
import rawData from '@/app/pipe_data.json'

const data = rawData as unknown as PipeEntry[]

export function getAllPipeSizes(): string[] {
  const sizes = new Set<string>()
  data.forEach((entry) => sizes.add(entry.pipeSize))
  return Array.from(sizes).sort((a, b) => {
    const aNum = parseFloat(a)
    const bNum = parseFloat(b)
    return aNum - bNum
  })
}

export function getSchedulesForSize(size: string): string[] {
  const schedules = new Set<string>()
  data.forEach((entry) => {
    if (entry.pipeSize === size) schedules.add(entry.schedule)
  })
  return Array.from(schedules)
}

export function findPipeData(size: string, schedule: string): PipeEntry | undefined {
  return data.find(
    (entry) => entry.pipeSize === size && entry.schedule === schedule
  )
}

export function searchPipesByThickness(mm: number): PipeEntry[] {
  return data.filter((entry) => {
    const diff = Math.abs(entry.wallThickness.mm - mm)
    return diff <= 0.5
  })
}

export function getAllSchedules(): string[] {
  const schedules = new Set<string>()
  data.forEach((entry) => schedules.add(entry.schedule))
  return Array.from(schedules)
}

export function getPipeData(): PipeEntry[] {
  return data
}
