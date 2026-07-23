import type { PipeEntry } from '@/types'
import rawData from '@/app/pipe_data.json'

const data = rawData as unknown as PipeEntry[]

function parsePipeSizeValue(sizeStr: string): number {
  const parts = sizeStr.trim().split(/\s+/)
  let total = 0
  for (const part of parts) {
    if (part.includes('/')) {
      const [num, den] = part.split('/')
      if (num && den && !isNaN(Number(num)) && !isNaN(Number(den)) && Number(den) !== 0) {
        total += Number(num) / Number(den)
      }
    } else if (!isNaN(Number(part))) {
      total += Number(part)
    }
  }
  return total
}

export function getAllPipeSizes(): string[] {
  const sizes = new Set<string>()
  data.forEach((entry) => sizes.add(entry.pipeSize))
  return Array.from(sizes).sort((a, b) => {
    return parsePipeSizeValue(a) - parsePipeSizeValue(b)
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

export function getAllSchedules(): string[] {
  const schedules = new Set<string>()
  data.forEach((entry) => schedules.add(entry.schedule))
  return Array.from(schedules)
}

export function getPipeData(): PipeEntry[] {
  return data
}
