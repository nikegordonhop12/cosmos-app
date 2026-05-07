import { useState } from 'react'
import { useStore, type Theme } from '@/store'
import { THEMES } from '@/utils/themes'

export default function ThemeSelector() {
  const { theme, setTheme } = useStore()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-5 h-5 rounded-full border border-gold/40 transition-all hover:border-gold"
        style={{ background: THEMES[theme].accent }}
        title="Тема"
      />
      {open && (
        <div className="absolute right-0 top-8 glass-dark rounded-xl p-3 flex flex-col gap-2 min-w-[160px] z-50">
          {(Object.entries(THEMES) as [Theme, typeof THEMES[Theme]][]).map(([key, t]) => (
            <button
              key={key}
              onClick={() => { setTheme(key); setOpen(false) }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all text-sm font-serif
                ${theme === key ? 'bg-white/10 text-gold' : 'text-silver/60 hover:text-gold hover:bg-white/5'}`}
            >
              <span className="w-3 h-3 rounded-full" style={{ background: t.accent }} />
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
