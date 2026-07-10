import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PipeEntry, SearchState, HistoryEntry, FavoritesEntry, Theme } from '@/types'
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
  theme: Theme

  setPipeSize: (size: string | null) => void
  setSchedule: (schedule: string | null) => void
  setTotalLength: (length: number) => void
  setThicknessSearch: (value: string) => void
  compute: () => void
  addToHistory: (size: string, schedule: string) => void
  clearHistory: () => void
  toggleFavorite: (size: string, schedule: string) => void
  removeFavorite: (id: string) => void
  setTheme: (theme: Theme) => void
  clear: () => void
}

export const usePipeStore = create<PipeStore>()(
  persist(
    (set, get) => ({
      selectedSize: null,
      selectedSchedule: null,
      totalLength: 10,
      thicknessSearch: '',
      result: null,
      calculations: null,
      history: [],
      favorites: [],
      availableSizes: getAllPipeSizes(),
      availableSchedules: [],
      theme: 'system',

      setPipeSize: (size) => {
        set({
          selectedSize: size,
          availableSchedules: size ? getSchedulesForSize(size) : [],
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

      setTotalLength: (length) => {
        set({ totalLength: length })
        const state = get()
        if (state.result) {
          const calculations = computeAllCalculations(state.result, length)
          set({ calculations })
        }
      },

      setThicknessSearch: (value) => {
        set({ thicknessSearch: value })
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

      setTheme: (theme) => set({ theme }),

      clear: () =>
        set({
          selectedSize: null,
          selectedSchedule: null,
          result: null,
          calculations: null,
          totalLength: 10,
          thicknessSearch: '',
        }),
    }),
    {
      name: 'pipe-store',
      partialize: (state) => ({
        history: state.history,
        favorites: state.favorites,
        theme: state.theme,
      }),
    }
  )
)
