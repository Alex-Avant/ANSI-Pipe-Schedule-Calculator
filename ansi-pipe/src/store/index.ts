import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  PipeEntry,
  SearchState,
  HistoryEntry,
  FavoritesEntry,
  PipeCalculations,
  TotalCalculations,
} from '@/types'
import { findPipeData, getAllPipeSizes, getSchedulesForSize } from '@/lib/pipe-data'
import { computeAllCalculations, calculateTotalCalculations, normalizeQuantity } from '@/lib/calculations'
import { generateId } from '@/lib/utils'

interface PipeStore extends SearchState {
  result: PipeEntry | null
  calculations: PipeCalculations | null
  totals: TotalCalculations | null
  quantity: number
  history: HistoryEntry[]
  favorites: FavoritesEntry[]
  availableSizes: string[]
  availableSchedules: string[]

  setPipeSize: (size: string | null) => void
  setSchedule: (schedule: string | null) => void
  applySelection: (size: string, schedule: string) => void
  setTotalLength: (length: number) => void
  setQuantity: (quantity: number) => void
  compute: () => void
  addToHistory: (size: string, schedule: string) => void
  clearHistory: () => void
  toggleFavorite: (size: string, schedule: string) => void
  removeFavorite: (id: string) => void
  clear: () => void
}

function buildDerivedState(pipe: PipeEntry, lengthFeet: number, quantity: number) {
  const calculations = computeAllCalculations(pipe, lengthFeet)
  return {
    result: pipe,
    calculations,
    totals: calculateTotalCalculations(pipe, calculations, quantity),
  }
}

export const usePipeStore = create<PipeStore>()(
  persist(
    (set, get) => ({
      selectedSize: null,
      selectedSchedule: null,
      totalLength: 10,
      result: null,
      calculations: null,
      totals: null,
      quantity: 1,
      history: [],
      favorites: [],
      availableSizes: getAllPipeSizes(),
      availableSchedules: [],

      setPipeSize: (size) => {
        if (!size) {
          set({
            selectedSize: null,
            availableSchedules: [],
            selectedSchedule: null,
            result: null,
            calculations: null,
            totals: null,
          })
          return
        }

        const schedules = getSchedulesForSize(size)
        const currentSchedule = get().selectedSchedule
        let targetSchedule: string | null = null

        if (currentSchedule && schedules.includes(currentSchedule)) {
          targetSchedule = currentSchedule
        } else if (schedules.includes('40')) {
          targetSchedule = '40'
        } else if (schedules.includes('STD')) {
          targetSchedule = 'STD'
        } else if (schedules.length > 0) {
          targetSchedule = schedules[0]
        }

        if (targetSchedule) {
          const pipe = findPipeData(size, targetSchedule)
          if (pipe) {
            const state = get()
            set({
              selectedSize: size,
              availableSchedules: schedules,
              selectedSchedule: targetSchedule,
              ...buildDerivedState(pipe, state.totalLength, state.quantity),
            })
            get().addToHistory(size, targetSchedule)
            return
          }
        }

        set({
          selectedSize: size,
          availableSchedules: schedules,
          selectedSchedule: null,
          result: null,
          calculations: null,
          totals: null,
        })
      },

      setSchedule: (schedule) => {
        set({ selectedSchedule: schedule })
        const state = get()
        if (state.selectedSize && schedule) {
          const pipe = findPipeData(state.selectedSize, schedule)
          if (pipe) {
            set(buildDerivedState(pipe, state.totalLength, state.quantity))
            get().addToHistory(state.selectedSize, schedule)
          }
        }
      },

      applySelection: (size, schedule) => {
        const schedules = getSchedulesForSize(size)
        const pipe = findPipeData(size, schedule)
        if (!pipe) return
        const state = get()
        set({
          selectedSize: size,
          availableSchedules: schedules,
          selectedSchedule: schedule,
          ...buildDerivedState(pipe, state.totalLength, state.quantity),
        })
        get().addToHistory(size, schedule)
      },

      setTotalLength: (length) => {
        const safeLength = isFinite(length) && length >= 0 ? length : 0
        set({ totalLength: safeLength })
        const state = get()
        if (state.result) {
          set(
            buildDerivedState(state.result, safeLength, state.quantity)
          )
        }
      },

      setQuantity: (quantity) => {
        const safeQuantity = normalizeQuantity(quantity)
        set({ quantity: safeQuantity })
        const state = get()
        if (state.result && state.calculations) {
          set({
            totals: calculateTotalCalculations(
              state.result,
              state.calculations,
              safeQuantity
            ),
          })
        }
      },

      compute: () => {
        const state = get()
        if (state.selectedSize && state.selectedSchedule) {
          const pipe = findPipeData(state.selectedSize, state.selectedSchedule)
          if (pipe) {
            set(buildDerivedState(pipe, state.totalLength, state.quantity))
          }
        }
      },

      addToHistory: (size, schedule) => {
        set((state) => {
          const filtered = state.history.filter(
            (h) => !(h.pipeSize === size && h.schedule === schedule)
          )
          return {
            history: [
              {
                id: generateId(),
                pipeSize: size,
                schedule,
                timestamp: Date.now(),
                lengthFeet: state.totalLength,
                quantity: state.quantity,
                totalWeightLb: state.totals?.weight.lb,
              },
              ...filtered,
            ].slice(0, 20),
          }
        })
      },

      clearHistory: () => set({ history: [] }),

      toggleFavorite: (size, schedule) => {
        set((state) => {
          const existing = state.favorites.find(
            (f) => f.pipeSize === size && f.schedule === schedule
          )
          if (existing) {
            return { favorites: state.favorites.filter((f) => f.id !== existing.id) }
          }
          return {
            favorites: [
              ...state.favorites,
              { id: generateId(), pipeSize: size, schedule, addedAt: Date.now() },
            ],
          }
        })
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }))
      },

      clear: () =>
        set({
          selectedSize: null,
          selectedSchedule: null,
          result: null,
          calculations: null,
          totals: null,
          totalLength: 10,
          quantity: 1,
        }),
    }),
    {
      name: 'pipe-store',
      partialize: (state) => ({
        history: state.history,
        favorites: state.favorites,
        totalLength: state.totalLength,
        quantity: state.quantity,
      }),
    }
  )
)
