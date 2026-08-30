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

export interface TotalCalculations {
  quantity: number
  flowArea: FlowArea
  volume: { cubicInch: number; liters: number }
  weight: { lb: number; kg: number }
}

export interface HistoryEntry {
  id: string
  pipeSize: string
  schedule: string
  timestamp: number
  lengthFeet?: number
  quantity?: number
  totalWeightLb?: number
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
