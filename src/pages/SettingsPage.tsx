import { useStore } from '@/store'
import { THEMES } from '@/utils/themes'
import type { Theme } from '@/store'

export default function SettingsPage() {
  const { theme, setTheme, soundEnabled, soundVolume, toggleSound, setVolume, mode3D, toggle3D } = useStore()

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float">⊕</div>
        <h1 className="section-title">Настройки</h1>
        <p className="section-subtitle">Персонализация вашей вселенной</p>
      </div>

      <div className="space-y-6">
        {/* Theme */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-serif text-gold/80 mb-4">Визуальная тема</h2>
          <div className="grid grid-cols-1 gap-3">
            {(Object.entries(THEMES) as [Theme, typeof THEMES[Theme]][]).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all glass
                  ${theme === key ? 'border-gold/40 glow-gold' : 'hover:border-gold/20'}`}
              >
                <span className="w-6 h-6 rounded-full border-2 border-white/20" style={{ background: t.accent }} />
                <div>
                  <div className="font-serif text-sm text-gold/80">{t.name}</div>
                  <div className="text-silver/30 text-xs">{t.bg}</div>
                </div>
                {theme === key && <span className="ml-auto text-gold text-sm">✦</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Sound */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-serif text-gold/80 mb-4">Звук</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-silver/60 font-serif text-sm">Ambient звук</span>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full transition-all relative ${soundEnabled ? 'bg-gold/40' : 'bg-white/10'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${soundEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          {soundEnabled && (
            <div className="flex items-center gap-4">
              <span className="text-silver/40 text-xs">Громкость</span>
              <input
                type="range" min={0} max={1} step={0.1}
                value={soundVolume}
                onChange={e => setVolume(+e.target.value)}
                className="flex-1 accent-gold"
              />
              <span className="text-silver/40 text-xs w-8">{Math.round(soundVolume * 100)}%</span>
            </div>
          )}
        </div>

        {/* 3D Mode */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-gold/80">3D Режим</h2>
              <p className="text-silver/30 text-xs mt-1">Three.js визуализации (требует мощного GPU)</p>
            </div>
            <button
              onClick={toggle3D}
              className={`w-12 h-6 rounded-full transition-all relative ${mode3D ? 'bg-gold/40' : 'bg-white/10'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${mode3D ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
