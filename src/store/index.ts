import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme, NatalChart, AIMessage, DreamEntry, User } from '@/types'

// ─── UI slice ─────────────────────────────────────────────────────────────────
interface UISlice {
  theme: Theme
  soundEnabled: boolean
  soundVolume: number
  mode3D: boolean
  sidebarOpen: boolean
  setTheme: (t: Theme) => void
  toggleSound: () => void
  setVolume: (v: number) => void
  toggle3D: () => void
  setSidebarOpen: (v: boolean) => void
}

// ─── User slice ───────────────────────────────────────────────────────────────
interface UserSlice {
  user: User | null
  setUser: (u: User | null) => void
}

// ─── Charts slice ─────────────────────────────────────────────────────────────
interface ChartsSlice {
  charts: NatalChart[]
  activeChart: NatalChart | null
  saveChart: (c: NatalChart) => void
  setActiveChart: (c: NatalChart | null) => void
  deleteChart: (id: string) => void
}

// ─── AI slice ─────────────────────────────────────────────────────────────────
interface AISlice {
  aiMessages: AIMessage[]
  addAIMessage: (m: AIMessage) => void
  clearAIHistory: () => void
}

// ─── Dreams slice ─────────────────────────────────────────────────────────────
interface DreamsSlice {
  dreams: DreamEntry[]
  saveDream: (d: DreamEntry) => void
  deleteDream: (id: string) => void
}

// ─── Favorites slice ──────────────────────────────────────────────────────────
interface FavoritesSlice {
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

type AppState = UISlice & UserSlice & ChartsSlice & AISlice & DreamsSlice & FavoritesSlice

export const useStore = create<AppState>()(
  persist(
      (set, get) => ({
        // UI
        theme: 'nordicObsidian',
        soundEnabled: false,
        soundVolume: 0.3,
        mode3D: false,
        sidebarOpen: false,
        setTheme: (theme) => set({ theme }),
        toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
        setVolume: (soundVolume) => set({ soundVolume }),
        toggle3D: () => set((s) => ({ mode3D: !s.mode3D })),
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

        // User
        user: null,
        setUser: (user) => set({ user }),

        // Charts
        charts: [],
        activeChart: null,
        saveChart: (chart) =>
          set((s) => ({
            charts: s.charts.some((c) => c.id === chart.id)
              ? s.charts.map((c) => (c.id === chart.id ? chart : c))
              : [...s.charts, chart],
          })),
        setActiveChart: (activeChart) => set({ activeChart }),
        deleteChart: (id) =>
          set((s) => ({
            charts: s.charts.filter((c) => c.id !== id),
            activeChart: s.activeChart?.id === id ? null : s.activeChart,
          })),

        // AI — not persisted (see partialize below)
        aiMessages: [],
        addAIMessage: (m) =>
          set((s) => ({
            aiMessages: [...s.aiMessages.slice(-49), m], // cap at 50
          })),
        clearAIHistory: () => set({ aiMessages: [] }),

        // Dreams
        dreams: [],
        saveDream: (dream) =>
          set((s) => ({
            dreams: s.dreams.some((d) => d.id === dream.id)
              ? s.dreams.map((d) => (d.id === dream.id ? dream : d))
              : [dream, ...s.dreams],
          })),
        deleteDream: (id) => set((s) => ({ dreams: s.dreams.filter((d) => d.id !== id) })),

        // Favorites
        favorites: [],
        toggleFavorite: (id) =>
          set((s) => ({
            favorites: s.favorites.includes(id)
              ? s.favorites.filter((f) => f !== id)
              : [...s.favorites, id],
          })),
        isFavorite: (id) => get().favorites.includes(id),
      }),
      {
        name: 'cosmos-v2',
        // Don't persist transient UI state
        partialize: (s) => ({
          theme: s.theme,
          soundEnabled: s.soundEnabled,
          soundVolume: s.soundVolume,
          mode3D: s.mode3D,
          user: s.user,
          charts: s.charts,
          activeChart: s.activeChart,
          dreams: s.dreams,
          favorites: s.favorites,
          // aiMessages intentionally excluded — session only
        }),
      }
  )
)

// ─── Typed selectors (prevent full re-renders) ────────────────────────────────
export const useTheme = () => useStore((s) => s.theme)
export const useActiveChart = () => useStore((s) => s.activeChart)
export const useCharts = () => useStore((s) => s.charts)
export const useAIMessages = () => useStore((s) => s.aiMessages)
export const useDreams = () => useStore((s) => s.dreams)
export const useUser = () => useStore((s) => s.user)
