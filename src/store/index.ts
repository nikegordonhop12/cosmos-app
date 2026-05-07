import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme, NatalChart, AIMessage, DreamEntry, User } from '@/types'
import type { MatrixResult } from '@/engine/matrix'

interface AppState {
  // UI
  theme: Theme
  soundEnabled: boolean
  sidebarOpen: boolean
  setTheme: (t: Theme) => void
  toggleSound: () => void
  setSidebarOpen: (v: boolean) => void

  // Auth
  user: User | null
  setUser: (u: User | null) => void
  isAuthenticated: () => boolean

  // Charts
  charts: NatalChart[]
  activeChart: NatalChart | null
  saveChart: (c: NatalChart) => void
  setActiveChart: (c: NatalChart | null) => void
  deleteChart: (id: string) => void

  // Matrix
  matrices: MatrixResult[]
  activeMatrix: MatrixResult | null
  saveMatrix: (m: MatrixResult) => void
  setActiveMatrix: (m: MatrixResult | null) => void
  deleteMatrix: (id: string) => void

  // AI
  aiMessages: AIMessage[]
  addAIMessage: (m: AIMessage) => void
  clearAIHistory: () => void

  // Dreams
  dreams: DreamEntry[]
  saveDream: (d: DreamEntry) => void
  deleteDream: (id: string) => void

  // Favorites
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // UI
      theme: 'nordicObsidian',
      soundEnabled: false,
      sidebarOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      // Auth
      user: null,
      setUser: (user) => set({ user }),
      isAuthenticated: () => !!get().user,

      // Charts
      charts: [],
      activeChart: null,
      saveChart: (chart) => set((s) => ({
        charts: s.charts.some(c => c.id === chart.id)
          ? s.charts.map(c => c.id === chart.id ? chart : c)
          : [...s.charts, chart],
      })),
      setActiveChart: (activeChart) => set({ activeChart }),
      deleteChart: (id) => set((s) => ({
        charts: s.charts.filter(c => c.id !== id),
        activeChart: s.activeChart?.id === id ? null : s.activeChart,
      })),

      // Matrix
      matrices: [],
      activeMatrix: null,
      saveMatrix: (matrix) => set((s) => ({
        matrices: s.matrices.some(m => m.birthDate === matrix.birthDate && m.name === matrix.name)
          ? s.matrices.map(m => m.birthDate === matrix.birthDate ? matrix : m)
          : [...s.matrices, matrix],
      })),
      setActiveMatrix: (activeMatrix) => set({ activeMatrix }),
      deleteMatrix: (id) => set((s) => ({
        matrices: s.matrices.filter(m => `${m.name}-${m.birthDate}` !== id),
      })),

      // AI
      aiMessages: [],
      addAIMessage: (m) => set((s) => ({ aiMessages: [...s.aiMessages.slice(-49), m] })),
      clearAIHistory: () => set({ aiMessages: [] }),

      // Dreams
      dreams: [],
      saveDream: (dream) => set((s) => ({
        dreams: s.dreams.some(d => d.id === dream.id)
          ? s.dreams.map(d => d.id === dream.id ? dream : d)
          : [dream, ...s.dreams],
      })),
      deleteDream: (id) => set((s) => ({ dreams: s.dreams.filter(d => d.id !== id) })),

      // Favorites
      favorites: [],
      toggleFavorite: (id) => set((s) => ({
        favorites: s.favorites.includes(id) ? s.favorites.filter(f => f !== id) : [...s.favorites, id],
      })),
      isFavorite: (id) => get().favorites.includes(id),
    }),
    {
      name: 'cosmos-v3',
      partialize: (s) => ({
        theme: s.theme,
        soundEnabled: s.soundEnabled,
        user: s.user,
        charts: s.charts,
        activeChart: s.activeChart,
        matrices: s.matrices,
        dreams: s.dreams,
        favorites: s.favorites,
      }),
    }
  )
)

export const useTheme = () => useStore(s => s.theme)
export const useActiveChart = () => useStore(s => s.activeChart)
export const useUser = () => useStore(s => s.user)
export const useIsAuth = () => useStore(s => !!s.user)
