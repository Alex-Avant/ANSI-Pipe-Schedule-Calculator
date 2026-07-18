export interface Dimension {
  inch: number
  mm: number
}

export interface FlowArea {
  squareInch: number
  squareMm: number
}

export interface PipeEntry {
  pipeSize: string
  schedule: string
  outsideDiameter: Dimension
  wallThickness: Dimension
  insideDiameter: Dimension
  flowArea: FlowArea
  weight: {
    lbPerFt: number
    kgPerM: number
  }
}

export interface PipeCalculations {
  insideDiameter: Dimension
  flowArea: FlowArea
  volumePerFoot: { cubicInch: number; litersPerM: number }
  weightPerLength: { lb: number; kg: number }
  totalLength: number
}

export interface HistoryEntry {
  id: string
  pipeSize: string
  schedule: string
  timestamp: number
}

export interface FavoritesEntry {
  id: string
  pipeSize: string
  schedule: string
  addedAt: number
}

export interface SearchState {
  selectedSize: string | null
  selectedSchedule: string | null
  totalLength: number
}
