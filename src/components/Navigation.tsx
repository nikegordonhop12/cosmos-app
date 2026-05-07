import { memo, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'
import { THEMES } from '@/lib/constants'
import type { NavItem } from '@/types'

const PRIMARY_NAV: NavItem[] = [
  { path: '/',             label: 'Главная',      icon: '✦' },
  { path: '/chart',        label: 'Карта',        icon: '☽' },
  { path: '/ai',           label: 'AI Астролог',  icon: '◈' },
  { path: '/cabinet',      label: 'Кабинет',      icon: '⊕' },
  { path: '/cosmic',       label: 'Космос Live',  icon: '◉' },
  { path: '/tarot',        label: 'Таро',         icon: '⬡' },
]

const SECONDARY_NAV: NavItem[] = [
  { path: '/runes',        label: 'Руны',         icon: 'ᚱ' },
  { path: '/chakra',       label: 'Чакры',        icon: '◎' },
  { path: '/dreams',       label: 'Сны',          icon: '☁' },
  { path: '/numerology',   label: 'Нумерология',  icon: '∞' },
  { path: '/relationships',label: 'Отношения',    icon: '♡' },
  { path: '/timeline',     label: 'Линия жизни',  icon: '⟿' },
  { path: '/learn',        label: 'Обучение',     icon: '◇' },
  { path: '/research',     label: 'Лаборатория',  icon: '⚗' },
  { path: '/community',    label: 'Сообщество',   icon: '⊛' },
]

const ALL_NAV = [...PRIMARY_NAV, ...SECONDARY_NAV]

// Memoized nav link — only re-renders when active state changes
const NavLink = memo(function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active ? 'bg-gold/15 text-gold' : 'text-silver/50 hover:text-gold hover:bg-white/5'
      }`}
    >
      <span className="text-base w-6 text-center flex-shrink-0">{item.icon}</span>
      <span className="font-serif tracking-wide text-sm">{item.label}</span>
    </Link>
  )
})

const SidebarIcon = memo(function SidebarIcon({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      to={item.path}
      title={item.label}
      className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 text-lg ${
        active
          ? 'bg-gold/20 text-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
          : 'text-silver/30 hover:text-gold hover:bg-white/5'
      }`}
    >
      {item.icon}
    </Link>
  )
})

function ThemeSelector() {
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const accent = THEMES[theme].accent

  return (
    <div className="relative group">
      <button
        className="w-5 h-5 rounded-full border border-white/20 transition-all hover:scale-110"
        style={{ background: accent }}
        aria-label="Выбрать тему"
      />
      <div className="absolute right-0 top-8 glass-dark rounded-xl p-2 flex flex-col gap-1 min-w-[160px] z-50
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        {(Object.entries(THEMES) as [typeof theme, typeof THEMES[typeof theme]][]).map(([key, t]) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all text-sm font-serif ${
              theme === key ? 'bg-white/10 text-gold' : 'text-silver/60 hover:text-gold hover:bg-white/5'
            }`}
          >
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.accent }} />
            {t.name}
          </button>
        ))}
      </div>
    </div>
  )
}

function SoundToggle() {
  const soundEnabled = useStore((s) => s.soundEnabled)
  const toggleSound = useStore((s) => s.toggleSound)

  return (
    <button
      onClick={toggleSound}
      aria-label={soundEnabled ? 'Выключить звук' : 'Включить звук'}
      className="text-silver/40 hover:text-gold transition-colors"
    >
      {soundEnabled ? (
        <span className="flex items-end gap-0.5 h-5">
          {[1,2,3,4,5].map((i) => (
            <span
              key={i}
              className="w-0.5 bg-gold rounded-sm"
              style={{ height: 4 + i * 3, animation: `soundWave 1.2s ease-in-out ${i * 0.1}s infinite` }}
            />
          ))}
        </span>
      ) : (
        <span className="text-lg">♪</span>
      )}
    </button>
  )
}

export default function Navigation() {
  const location = useLocation()
  const sidebarOpen = useStore((s) => s.sidebarOpen)
  const setSidebarOpen = useStore((s) => s.setSidebarOpen)
  const mode3D = useStore((s) => s.mode3D)
  const toggle3D = useStore((s) => s.toggle3D)

  const close = useCallback(() => setSidebarOpen(false), [setSidebarOpen])

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-gold/10" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="Главная">
            <span className="text-xl text-gold" style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.6))' }}>✦</span>
            <span className="font-serif text-xl tracking-widest bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              КОСМОС
            </span>
          </Link>

          {/* Desktop primary nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Основная навигация">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-serif tracking-wide uppercase transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'text-gold bg-gold/10'
                    : 'text-silver/50 hover:text-gold hover:bg-white/5'
                }`}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={toggle3D}
              className={`hidden sm:block text-xs font-serif tracking-widest uppercase px-3 py-1.5 rounded-lg border transition-all ${
                mode3D ? 'border-gold text-gold bg-gold/10' : 'border-silver/20 text-silver/40 hover:border-gold/40'
              }`}
              aria-pressed={mode3D}
            >
              3D
            </button>
            <SoundToggle />
            <ThemeSelector />
            <button
              className="lg:hidden text-silver/60 hover:text-gold transition-colors p-1"
              onClick={() => setSidebarOpen(true)}
              aria-label="Открыть меню"
              aria-expanded={sidebarOpen}
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[90] lg:hidden"
              onClick={close}
              aria-hidden="true"
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 right-0 w-72 z-[100] glass-dark border-l border-gold/10 overflow-y-auto"
              aria-label="Мобильное меню"
            >
              <div className="p-5">
                <button
                  className="text-silver/50 hover:text-gold mb-6 text-xl transition-colors"
                  onClick={close}
                  aria-label="Закрыть меню"
                >
                  ✕
                </button>
                <div className="flex flex-col gap-0.5">
                  {ALL_NAV.map((item) => (
                    <NavLink
                      key={item.path}
                      item={item}
                      active={location.pathname === item.path}
                      onClick={close}
                    />
                  ))}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar — secondary nav */}
      <aside
        className="hidden xl:flex fixed left-0 top-16 bottom-0 w-16 z-40 flex-col items-center py-6 gap-2 glass-dark border-r border-gold/10"
        aria-label="Боковая навигация"
      >
        {SECONDARY_NAV.map((item) => (
          <SidebarIcon key={item.path} item={item} active={location.pathname === item.path} />
        ))}
      </aside>
    </>
  )
}
