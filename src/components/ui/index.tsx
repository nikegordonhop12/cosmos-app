import { type ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode
  className?: string
  glow?: 'gold' | 'mystic' | 'rune' | 'none'
  onClick?: () => void
}

const GLOW = {
  gold:   'hover:border-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]',
  mystic: 'hover:border-mystic-light/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
  rune:   'hover:border-rune/30 hover:shadow-[0_0_30px_rgba(74,158,255,0.2)]',
  none:   '',
}

export function Card({ children, className, glow = 'gold', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'glass rounded-2xl p-6 transition-all duration-500',
        GLOW[glow],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

// ─── Accordion Card ───────────────────────────────────────────────────────────
interface AccordionCardProps {
  icon: string
  title: string
  subtitle?: string
  iconColor?: string
  children: ReactNode
  defaultOpen?: boolean
}

export function AccordionCard({ icon, title, subtitle, iconColor = '#d4af37', children, defaultOpen = false }: AccordionCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:border-gold/20">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 p-6 text-left"
        aria-expanded={open}
      >
        <span className="text-2xl flex-shrink-0" style={{ color: iconColor, filter: `drop-shadow(0 0 6px ${iconColor}66)` }}>
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-gold/90 text-lg leading-tight">{title}</h3>
          {subtitle && <p className="text-silver/40 text-xs mt-0.5 truncate">{subtitle}</p>}
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-silver/30 flex-shrink-0"
        >
          ↓
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-white/5 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function PageHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-10">
      <motion.div
        className="text-5xl mb-3"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {icon}
      </motion.div>
      <h1 className="text-4xl md:text-5xl font-serif font-light bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent mb-2 tracking-wide">
        {title}
      </h1>
      {subtitle && <p className="text-silver/50 font-serif italic text-lg">{subtitle}</p>}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, text, action }: { icon: string; text: string; action?: ReactNode }) {
  return (
    <div className="glass rounded-2xl p-16 text-center">
      <div className="text-5xl mb-4 text-gold/20">{icon}</div>
      <p className="text-silver/30 font-serif italic mb-6">{text}</p>
      {action}
    </div>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('animate-pulse bg-white/5 rounded-xl', className)} />
  )
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, color = '#d4af37' }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="px-2.5 py-0.5 glass rounded-full text-xs font-serif"
      style={{ color, borderColor: color + '44' }}
    >
      {children}
    </span>
  )
}
