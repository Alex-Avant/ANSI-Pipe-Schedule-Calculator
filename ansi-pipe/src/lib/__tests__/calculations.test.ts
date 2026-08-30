import { describe, it, expect } from 'vitest'
import {
  computeAllCalculations,
  calculateTotalCalculations,
  normalizeQuantity,
} from '@/lib/calculations'
import { findPipeData } from '@/lib/pipe-data'

const pipe2sch40 = findPipeData('2', '40')!
const pipe3sch40 = findPipeData('3', '40')!
const pipe5sch40 = findPipeData('5', '40')!

describe('computeAllCalculations (per pipe)', () => {
  const calc = computeAllCalculations(pipe2sch40, 20)

  it('computes inside diameter from OD and wall thickness', () => {
    expect(calc.insideDiameter.inch).toBe(2.067)
  })

  it('computes flow area for one pipe', () => {
    expect(calc.flowArea.squareInch).toBeCloseTo(3.356, 3)
  })

  it('computes volume per foot', () => {
    expect(calc.volumePerFoot.cubicInch).toBeCloseTo(3.356 * 12, 3)
  })

  it('weight per length uses lb/ft x length', () => {
    expect(calc.weightPerLength.lb).toBeCloseTo(3.66 * 20, 2)
    expect(calc.weightPerLength.kg).toBeCloseTo((3.66 * 20 * 0.453592), 2)
  })
})

describe('calculateTotalCalculations', () => {
  const lengthFeet = 20
  const perPipe = computeAllCalculations(pipe2sch40, lengthFeet)

  it('quantity = 1 behaves exactly like the per-pipe calculation', () => {
    const totals = calculateTotalCalculations(pipe2sch40, perPipe, 1)

    expect(totals.quantity).toBe(1)
    expect(totals.flowArea.squareInch).toBe(perPipe.flowArea.squareInch)
    expect(totals.flowArea.squareMm).toBe(perPipe.flowArea.squareMm)
    expect(totals.weight.lb).toBe(perPipe.weightPerLength.lb)
    expect(totals.weight.kg).toBe(perPipe.weightPerLength.kg)
    expect(totals.volume.cubicInch).toBeCloseTo(
      perPipe.volumePerFoot.cubicInch * lengthFeet,
      3
    )
  })

  it('quantity = 2 doubles the aggregated values', () => {
    const one = calculateTotalCalculations(pipe2sch40, perPipe, 1)
    const two = calculateTotalCalculations(pipe2sch40, perPipe, 2)

    expect(two.quantity).toBe(2)
    expect(two.flowArea.squareInch).toBeCloseTo(one.flowArea.squareInch * 2, 3)
    expect(two.weight.lb).toBeCloseTo(one.weight.lb * 2, 2)
    expect(two.volume.cubicInch).toBeCloseTo(one.volume.cubicInch * 2, 3)
  })

  it('quantity = 10 matches the reference example (2" Sch 40, 20 ft)', () => {
    const totals = calculateTotalCalculations(pipe2sch40, perPipe, 10)

    expect(totals.quantity).toBe(10)
    // Total Flow Area = flowArea per pipe x quantity (length independent)
    expect(totals.flowArea.squareInch).toBeCloseTo(3.356 * 10, 3)
    expect(totals.flowArea.squareMm).toBeCloseTo(perPipe.flowArea.squareMm * 10, 3)

    // Total Weight = lb/ft x length x quantity => 3.66 x 20 x 10 = 732 lb
    expect(totals.weight.lb).toBeCloseTo(732, 2)
    expect(totals.weight.kg).toBeCloseTo(732 * 0.453592, 2)

    // Total Volume = volume per pipe x quantity
    expect(totals.volume.cubicInch).toBeCloseTo(
      perPipe.volumePerFoot.cubicInch * lengthFeet * 10,
      3
    )
    expect(totals.volume.liters).toBeCloseTo(
      perPipe.volumePerFoot.litersPerM * lengthFeet * 0.3048 * 10,
      3
    )
  })

  it('flow area does not depend on pipe length', () => {
    const short = computeAllCalculations(pipe2sch40, 20)
    const long = computeAllCalculations(pipe2sch40, 100)
    const shortTotals = calculateTotalCalculations(pipe2sch40, short, 10)
    const longTotals = calculateTotalCalculations(pipe2sch40, long, 10)

    expect(longTotals.flowArea.squareInch).toBe(shortTotals.flowArea.squareInch)
  })

  it('scales correctly for another pipe entry', () => {
    const calc3 = computeAllCalculations(pipe3sch40, 10)
    const totals = calculateTotalCalculations(pipe3sch40, calc3, 4)

    expect(totals.flowArea.squareInch).toBeCloseTo(calc3.flowArea.squareInch * 4, 3)
    expect(totals.weight.lb).toBeCloseTo(7.58 * 10 * 4, 2)
  })

  describe('quantity normalization rejects invalid values', () => {
    const calc = computeAllCalculations(pipe2sch40, 20)

    it('clamps 0 to 1', () => {
      expect(calculateTotalCalculations(pipe2sch40, calc, 0).quantity).toBe(1)
    })

    it('clamps negatives to 1', () => {
      expect(calculateTotalCalculations(pipe2sch40, calc, -5).quantity).toBe(1)
    })

    it('floors decimals', () => {
      expect(calculateTotalCalculations(pipe2sch40, calc, 2.9).quantity).toBe(2)
      expect(normalizeQuantity(1.5)).toBe(1)
    })

    it('falls back to 1 on non-finite input', () => {
      expect(normalizeQuantity(NaN)).toBe(1)
      expect(normalizeQuantity(Infinity)).toBe(1)
    })
  })
})

describe('spec reference: 5" Schedule 40 at 40 ft', () => {
  // 5" Sch 40: 14.63 lb/ft, 20.006 in² flow area, 240.072 in³/ft
  const lengthFeet = 40
  const perPipe = computeAllCalculations(pipe5sch40, lengthFeet)

  it('quantity = 1: totals equal the per-pipe values', () => {
    const totals = calculateTotalCalculations(pipe5sch40, perPipe, 1)

    expect(perPipe.totalLength).toBe(lengthFeet)
    expect(totals.quantity).toBe(1)
    expect(totals.weight.lb).toBe(perPipe.weightPerLength.lb)
    expect(totals.flowArea.squareInch).toBe(perPipe.flowArea.squareInch)
    expect(totals.flowArea.squareMm).toBe(perPipe.flowArea.squareMm)
    expect(totals.volume.cubicInch).toBeCloseTo(240.072 * lengthFeet, 3)
  })

  it('quantity = 40 matches the reference totals (1,600 ft overall)', () => {
    const totals = calculateTotalCalculations(pipe5sch40, perPipe, 40)

    expect(totals.quantity).toBe(40)
    // Total Weight = 14.63 x 40 ft x 40 = 23,408 lb
    expect(totals.weight.lb).toBeCloseTo(23408, 2)
    expect(totals.weight.kg).toBeCloseTo(23408 * 0.453592, 2)
    // Total Flow Area = 20.006 in² x 40 (independent of length)
    expect(totals.flowArea.squareInch).toBeCloseTo(800.24, 3)
    expect(totals.flowArea.squareMm).toBeCloseTo(516282.84, 2)
    // Total Volume = 240.072 in³/ft x 1,600 ft
    expect(totals.volume.cubicInch).toBeCloseTo(384115.2, 3)
  })

  it('quantity = 50 updates every total', () => {
    const totals = calculateTotalCalculations(pipe5sch40, perPipe, 50)

    expect(totals.quantity).toBe(50)
    // 14.63 x 40 ft x 50 = 29,260 lb
    expect(totals.weight.lb).toBeCloseTo(29260, 2)
    expect(totals.flowArea.squareInch).toBeCloseTo(1000.3, 3)
    expect(totals.volume.cubicInch).toBeCloseTo(240.072 * 40 * 50, 3)
  })

  it('changing pipe length scales weight and volume but not flow area', () => {
    const at40 = calculateTotalCalculations(pipe5sch40, perPipe, 40)
    const calc60 = computeAllCalculations(pipe5sch40, 60)
    const at60 = calculateTotalCalculations(pipe5sch40, calc60, 40)

    expect(at60.weight.lb).toBeCloseTo(at40.weight.lb * 1.5, 2)
    expect(at60.volume.cubicInch).toBeCloseTo(at40.volume.cubicInch * 1.5, 3)
    expect(at60.flowArea.squareInch).toBe(at40.flowArea.squareInch)
  })

  it('changing pipe quantity scales weight, volume and flow area', () => {
    const at40 = calculateTotalCalculations(pipe5sch40, perPipe, 40)
    const at50 = calculateTotalCalculations(pipe5sch40, perPipe, 50)

    expect(at50.weight.lb).toBeCloseTo(at40.weight.lb * (50 / 40), 2)
    expect(at50.volume.cubicInch).toBeCloseTo(at40.volume.cubicInch * (50 / 40), 3)
    expect(at50.flowArea.squareInch).toBeCloseTo(at40.flowArea.squareInch * (50 / 40), 3)
  })

  it('changing pipe size updates all derived values', () => {
    const totals = calculateTotalCalculations(pipe3sch40, computeAllCalculations(pipe3sch40, lengthFeet), 40)

    expect(totals.weight.lb).toBeCloseTo(7.58 * lengthFeet * 40, 2)
    expect(totals.flowArea.squareInch).toBeCloseTo(
      computeAllCalculations(pipe3sch40, lengthFeet).flowArea.squareInch * 40,
      3
    )
  })

  it('changing schedule updates all derived values', () => {
    const pipe5sch80 = findPipeData('5', '80')!
    const calc80 = computeAllCalculations(pipe5sch80, lengthFeet)
    const totals = calculateTotalCalculations(pipe5sch80, calc80, 40)

    expect(totals.weight.lb).toBeCloseTo(pipe5sch80.weight.lbPerFt * lengthFeet * 40, 2)
    expect(totals.flowArea.squareInch).toBeCloseTo(calc80.flowArea.squareInch * 40, 3)
    expect(totals.weight.lb).not.toBeCloseTo(23408, 2)
  })
})
