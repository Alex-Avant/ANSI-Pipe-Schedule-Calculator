import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PipeEntry, SearchState, HistoryEntry, FavoritesEntry } from '@/types'
import { findPipeData, getAllPipeSizes, getSchedulesForSize } from '@/lib/pipe-data'
import { computeAllCalculations } from '@/lib/calculations'
import { generateId } from '@/lib/utils'

interface PipeStore extends SearchState {
  result: PipeEntry | null
  calculations: ReturnType<typeof computeAllCalculations> | null
  history: HistoryEntry[]
  favorites: FavoritesEntry[]
  availableSizes: string[]
  availableSchedules: string[]

  setPipeSize: (size: string | null) => void
  setSchedule: (schedule: string | null) => void
  applySelection: (size: string, schedule: string) => void
  setTotalLength: (length: number) => void
  compute: () => void
  addToHistory: (size: string, schedule: string) => void
  clearHistory: () => void
  toggleFavorite: (size: string, schedule: string) => void
  removeFavorite: (id: string) => void
  clear: () => void
}

export const usePipeStore = create<PipeStore>()(
  persist(
    (set, get) => ({
      selectedSize: null,
      selectedSchedule: null,
      totalLength: 10,
      result: null,
      calculations: null,
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
            const calculations = computeAllCalculations(pipe, state.totalLength)
            set({
              selectedSize: size,
              availableSchedules: schedules,
              selectedSchedule: targetSchedule,
              result: pipe,
              calculations,
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
        })
      },

      setSchedule: (schedule) => {
        set({ selectedSchedule: schedule })
        const state = get()
        if (state.selectedSize && schedule) {
          const pipe = findPipeData(state.selectedSize, schedule)
          if (pipe) {
            const calculations = computeAllCalculations(pipe, state.totalLength)
            set({ result: pipe, calculations })
            get().addToHistory(state.selectedSize, schedule)
          }
        }
      },

      applySelection: (size, schedule) => {
        const schedules = getSchedulesForSize(size)
        const pipe = findPipeData(size, schedule)
        if (!pipe) return
        const state = get()
        const calculations = computeAllCalculations(pipe, state.totalLength)
        set({
          selectedSize: size,
          availableSchedules: schedules,
          selectedSchedule: schedule,
          result: pipe,
          calculations,
        })
        get().addToHistory(size, schedule)
      },

      setTotalLength: (length) => {
        const safeLength = isFinite(length) && length >= 0 ? length : 0
        set({ totalLength: safeLength })
        const state = get()
        if (state.result) {
          const calculations = computeAllCalculations(state.result, safeLength)
          set({ calculations })
        }
      },

      compute: () => {
        const state = get()
        if (state.selectedSize && state.selectedSchedule) {
          const pipe = findPipeData(state.selectedSize, state.selectedSchedule)
          if (pipe) {
            const calculations = computeAllCalculations(pipe, state.totalLength)
            set({ result: pipe, calculations })
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
              { id: generateId(), pipeSize: size, schedule, timestamp: Date.now() },
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
          totalLength: 10,
        }),
    }),
    {
      name: 'pipe-store',
      partialize: (state) => ({
        history: state.history,
        favorites: state.favorites,
        totalLength: state.totalLength,
      }),
    }
  )
)
