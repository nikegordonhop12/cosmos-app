// ─── Astrology domain types ───────────────────────────────────────────────────

export type Theme = 'nordicObsidian' | 'cosmicBrass' | 'ancientEmerald' | 'voidBlack' | 'solarGold'

export interface PlanetPosition {
  sign: string
  signSymbol: string
  degree: number
  house: number
  retrograde: boolean
  longitude: number
  symbol: string
  color: string
}

export interface Aspect {
  planet1: string
  planet2: string
  type: string
  symbol: string
  color: string
  aspectType: 'harmonious' | 'difficult' | 'neutral' | 'tense'
  orb: number
  angle: number
}

export interface NatalChart {
  id: string
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  lat: number
  lon: number
  planets: Record<string, PlanetPosition>
  houses: number[]
  aspects: Aspect[]
  ascendant?: PlanetPosition
  mc?: PlanetPosition
  createdAt: string
}

export interface DreamAnalysis {
  archetypes: string[]
  symbols: string[]
  astrology: string
  psychology: string
  spirituality: string
}

export interface DreamEntry {
  id: string
  date: string
  description: string
  analysis?: DreamAnalysis
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface User {
  id: string
  name: string
  email: string
}

// ─── UI types ─────────────────────────────────────────────────────────────────

export interface NavItem {
  path: string
  label: string
  icon: string
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
