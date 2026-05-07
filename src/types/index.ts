// ─── Complete type system ─────────────────────────────────────────────────────

export type Theme = 'nordicObsidian' | 'cosmicBrass' | 'ancientEmerald' | 'voidBlack' | 'solarGold'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  isPremium: boolean
  provider: 'email' | 'vk' | 'google'
  createdAt: string
}

export interface AuthState {
  user: User | null
  session: string | null
  loading: boolean
}

// ─── Astrology ────────────────────────────────────────────────────────────────

export interface PlanetPosition {
  key: string
  nameRu: string
  symbol: string
  color: string
  longitude: number
  sign: string
  signSymbol: string
  signIndex: number
  degree: number
  degreeFormatted: string
  house: number
  retrograde: boolean
  speed: number
}

export interface AspectData {
  planet1: string
  planet2: string
  type: string
  symbol: string
  color: string
  aspectType: string
  angle: number
  orb: number
  applying: boolean
}

export interface HouseData {
  number: number
  cusp: number
  sign: string
  signSymbol: string
  degree: number
}

export interface NatalChart {
  id: string
  userId?: string
  name: string
  birthDate: string
  birthTime: string
  birthPlace: string
  lat: number
  lon: number
  utcOffset: number
  planets: Record<string, PlanetPosition>
  houses: HouseData[]
  aspects: AspectData[]
  ascendant: number
  mc: number
  dominantElement: string
  dominantModality: string
  chartRuler: string
  stelliums: string[][]
  createdAt: string
  report?: ChartReport
}

export interface ChartReport {
  portrait: string
  sun: string
  moon: string
  ascendant: string
  karma: string
  relationships: string
  career: string
  spiritual: string
  aspects: string
  recommendations: string
  generatedAt: string
}

// ─── Matrix of Destiny ────────────────────────────────────────────────────────

export interface MatrixCell {
  position: string
  arcana: number
  name: string
  description: string
  energy: string
}

export interface MatrixOfDestiny {
  id: string
  userId?: string
  name: string
  birthDate: string
  cells: Record<string, MatrixCell>
  personalYear: number
  lifeTask: number
  karmicTail: number
  karmicHead: number
  moneyChannel: number[]
  chakras: ChakraEnergy[]
  compatibility?: MatrixCompatibility
  createdAt: string
}

export interface ChakraEnergy {
  name: string
  arcana: number
  energy: 'blocked' | 'weak' | 'balanced' | 'strong' | 'overactive'
  description: string
}

export interface MatrixCompatibility {
  person1: string
  person2: string
  score: number
  description: string
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// ─── Dreams ───────────────────────────────────────────────────────────────────

export interface DreamEntry {
  id: string
  date: string
  description: string
  analysis?: {
    archetypes: string[]
    symbols: string[]
    astrology: string
    psychology: string
    spirituality: string
  }
}

// ─── UI ───────────────────────────────────────────────────────────────────────

export interface NavItem {
  path: string
  label: string
  icon: string
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface GeoLocation {
  lat: number
  lon: number
  utcOffset: number
  displayName: string
}
