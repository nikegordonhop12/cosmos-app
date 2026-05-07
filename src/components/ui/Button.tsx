import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cosmic' | 'ghost' | 'mystic' | 'rune'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const VARIANTS = {
  cosmic: 'glass glow-gold text-gold hover:bg-gold/10 border-gold/30',
  ghost:  'glass text-silver/60 hover:text-gold hover:border-gold/20',
  mystic: 'glass text-mystic-light border-mystic-light/30 hover:bg-mystic/10',
  rune:   'glass text-rune border-rune/30 hover:bg-rune/10',
}

const SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'cosmic', size = 'md', loading, disabled, children, className, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'font-serif tracking-widest uppercase rounded-xl border transition-all duration-300 cursor-pointer',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? <span className="animate-pulse">✦</span> : children}
    </button>
  )
)
Button.displayName = 'Button'
