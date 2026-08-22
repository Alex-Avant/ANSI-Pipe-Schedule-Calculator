import type {
  PipeEntry,
  PipeCalculations,
  TotalCalculations,
  Dimension,
  FlowArea,
} from '@/types'

const FEET_TO_METERS = 0.3048

export function calculateInsideDiameter(
  outsideDiameterInch: number,
  wallThicknessInch: number
): Dimension {
  const inch = +(outsideDiameterInch - 2 * wallThicknessInch).toFixed(3)
  const mm = +(inch * 25.4).toFixed(2)
  return { inch, mm }
}

export function calculateFlowArea(insideDiameterInch: number): FlowArea {
  const radius = insideDiameterInch / 2
  const squareInch = +(Math.PI * radius * radius).toFixed(3)
  const squareMm = +(squareInch * 25.4 * 25.4).toFixed(3)
  return { squareInch, squareMm }
}

export function calculateVolumePerFoot(flowAreaSquareInch: number): { cubicInch: number; litersPerM: number } {
  const cubicInch = +(flowAreaSquareInch * 12).toFixed(3)
  const litersPerM = +((flowAreaSquareInch * 12 * 0.0163871) / 0.3048).toFixed(3)
  return { cubicInch, litersPerM }
}

export function calculateWeightForLength(
  weightLbPerFt: number,
  lengthFeet: number
): { lb: number; kg: number } {
  const lb = +(weightLbPerFt * lengthFeet).toFixed(2)
  const kg = +(lb * 0.453592).toFixed(2)
  return { lb, kg }
}

export function computeAllCalculations(
  pipe: PipeEntry,
  lengthFeet: number
): PipeCalculations {
  const insideDiameter = calculateInsideDiameter(
    pipe.outsideDiameter.inch,
    pipe.wallThickness.inch
  )
  const flowArea = calculateFlowArea(insideDiameter.inch)
  const volumePerFoot = calculateVolumePerFoot(flowArea.squareInch)
  const weightPerLength = calculateWeightForLength(pipe.weight.lbPerFt, lengthFeet)

  return {
    insideDiameter,
    flowArea,
    volumePerFoot,
    weightPerLength,
    totalLength: lengthFeet,
  }
}

export function normalizeQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1
  return Math.max(1, Math.floor(quantity))
}

export function calculateTotalCalculations(
  pipe: PipeEntry,
  calculations: PipeCalculations,
  quantity: number
): TotalCalculations {
  const qty = normalizeQuantity(quantity)
  const totalFeet = calculations.totalLength * qty

  const flowArea: FlowArea = {
    squareInch: +(calculations.flowArea.squareInch * qty).toFixed(3),
    squareMm: +(calculations.flowArea.squareMm * qty).toFixed(3),
  }

  const volume = {
    cubicInch: +(calculations.volumePerFoot.cubicInch * totalFeet).toFixed(3),
    liters: +(
      calculations.volumePerFoot.litersPerM *
      totalFeet *
      FEET_TO_METERS
    ).toFixed(3),
  }

  const weight = calculateWeightForLength(pipe.weight.lbPerFt, totalFeet)

  return {
    quantity: qty,
    flowArea,
    volume,
    weight,
  }
}
