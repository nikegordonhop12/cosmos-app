import type { Theme } from '@/store'

export const THEMES: Record<Theme, { name: string; accent: string; bg: string; particle: string }> = {
  nordicObsidian: { name: 'Nordic Obsidian', accent: '#d4af37', bg: '#0a0a1a', particle: '#d4af37' },
  cosmicBrass:    { name: 'Cosmic Brass',    accent: '#b8860b', bg: '#0f0f1e', particle: '#b8860b' },
  ancientEmerald: { name: 'Ancient Emerald', accent: '#50c878', bg: '#0d1b2a', particle: '#50c878' },
  voidBlack:      { name: 'Void Black',      accent: '#ffffff', bg: '#000000', particle: '#ffffff' },
  solarGold:      { name: 'Solar Gold',      accent: '#ffd700', bg: '#1c1c1c', particle: '#ffd700' },
}
