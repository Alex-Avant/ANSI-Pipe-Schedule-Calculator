import { describe, it, expect, beforeEach } from 'vitest'
import { usePipeStore } from '@/store'

function resetStore() {
  usePipeStore.setState({
    selectedSize: null,
    selectedSchedule: null,
    totalLength: 10,
    result: null,
    calculations: null,
    totals: null,
    quantity: 1,
    availableSchedules: [],
    history: [],
    favorites: [],
  })
}

describe('usePipeStore', () => {
  beforeEach(resetStore)

  it('starts with quantity = 1 and no totals', () => {
    const state = usePipeStore.getState()
    expect(state.quantity).toBe(1)
    expect(state.totals).toBeNull()
  })

  it('selecting a size computes per-pipe and totals for quantity 1', () => {
    usePipeStore.getState().setPipeSize('2')

    const state = usePipeStore.getState()
    expect(state.result?.schedule).toBe('40')
    expect(state.calculations).not.toBeNull()
    expect(state.totals?.quantity).toBe(1)
    expect(state.totals?.weight.lb).toBe(state.calculations!.weightPerLength.lb)
  })

  it('quantity = 1 reproduces legacy total weight (backward compatible)', () => {
    const store = usePipeStore.getState()
    store.applySelection('2', '40')
    usePipeStore.getState().setTotalLength(20)

    const state = usePipeStore.getState()
    // 3.66 lb/ft x 20 ft x 1
    expect(state.totals!.weight.lb).toBeCloseTo(73.2, 2)
    expect(state.totals!.weight.lb).toBe(state.calculations!.weightPerLength.lb)
  })

  it('changing quantity updates totals but leaves per-pipe results untouched', () => {
    usePipeStore.getState().applySelection('2', '40')
    usePipeStore.getState().setTotalLength(20)

    const before = usePipeStore.getState()
    const perPipeSnapshot = JSON.stringify(before.calculations)

    usePipeStore.getState().setQuantity(10)

    const after = usePipeStore.getState()
    expect(JSON.stringify(after.calculations)).toBe(perPipeSnapshot)
    expect(after.quantity).toBe(10)
    // 3.66 x 20 x 10 = 732 lb
    expect(after.totals!.weight.lb).toBeCloseTo(732, 2)
    expect(after.totals!.flowArea.squareInch).toBeCloseTo(
      before.calculations!.flowArea.squareInch * 10,
      3
    )
    expect(after.totals!.volume.cubicInch).toBeCloseTo(
      before.calculations!.volumePerFoot.cubicInch * 20 * 10,
      3
    )
  })

  it.each([
    [0, 1],
    [-1, 1],
    [1.5, 1],
    [2.9, 2],
    [Number.NaN, 1],
  ])('setQuantity(%s) normalizes to %s', (input, expected) => {
    usePipeStore.getState().applySelection('2', '40')
    usePipeStore.getState().setQuantity(input)

    const state = usePipeStore.getState()
    expect(state.quantity).toBe(expected)
    expect(state.totals!.quantity).toBe(expected)
  })

  it('changing pipe size keeps the current quantity and recomputes totals', () => {
    usePipeStore.getState().applySelection('2', '40')
    usePipeStore.getState().setQuantity(10)
    usePipeStore.getState().setPipeSize('3')

    const state = usePipeStore.getState()
    expect(state.selectedSize).toBe('3')
    expect(state.result?.pipeSize).toBe('3')
    expect(state.quantity).toBe(10)
    // default length is 10 ft: 7.58 x 10 x 10
    expect(state.totals!.weight.lb).toBeCloseTo(7.58 * 10 * 10, 2)
  })

  it('changing schedule updates per-pipe results and totals', () => {
    usePipeStore.getState().applySelection('2', '40')
    usePipeStore.getState().setSchedule('80')

    const state = usePipeStore.getState()
    expect(state.selectedSchedule).toBe('80')
    expect(state.totals!.weight.lb).toBe(state.calculations!.weightPerLength.lb)
    expect(state.totals!.flowArea.squareInch).toBeCloseTo(
      state.calculations!.flowArea.squareInch,
      3
    )
  })

  it('changing pipe length scales weight and volume linearly, not flow area', () => {
    usePipeStore.getState().applySelection('2', '40')

    const at10 = usePipeStore.getState().totals!
    usePipeStore.getState().setTotalLength(30)
    const at30 = usePipeStore.getState().totals!

    expect(at30.flowArea.squareInch).toBe(at10.flowArea.squareInch)
    expect(at30.weight.lb).toBeCloseTo(at10.weight.lb * 3, 2)
    expect(at30.volume.cubicInch).toBeCloseTo(at10.volume.cubicInch * 3, 3)
    expect(at30.quantity).toBe(1)
  })
})
