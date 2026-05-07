import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'

const BASE = 'w-full glass rounded-xl px-4 py-3 text-silver/80 placeholder-silver/20 font-serif text-sm focus:outline-none focus:border-gold/40 transition-colors bg-transparent'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-silver/50 font-serif text-sm mb-2">{label}</label>}
      <input ref={ref} className={clsx(BASE, error && 'border-red-500/50', className)} {...props} />
      {error && <p className="text-red-400 text-xs mt-1 font-serif">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-silver/50 font-serif text-sm mb-2">{label}</label>}
      <textarea ref={ref} className={clsx(BASE, 'resize-none', error && 'border-red-500/50', className)} {...props} />
      {error && <p className="text-red-400 text-xs mt-1 font-serif">{error}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'
