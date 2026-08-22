import { describe, it, expect } from 'vitest'
import {
  computeAllCalculations,
  calculateTotalCalculations,
  normalizeQuantity,
} from '@/lib/calculations'
import { findPipeData } from '@/lib/pipe-data'

const pipe2sch40 = findPipeData('2', '40')!
const pipe3sch40 = findPipeData('3', '40')!

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
