import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/utils/api'

interface RelResult {
  score: number
  type: string
  karmicType: string
  twinFlame: boolean
  soulmate: boolean
  emotional: string
  conflict: string
  communication: string
  summary: string
}

export default function RelationshipsPage() {
  const [person1, setPerson1] = useState({ name: '', birthDate: '' })
  const [person2, setPerson2] = useState({ name: '', birthDate: '' })
  const [result, setResult] = useState<RelResult | null>(null)
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!person1.birthDate || !person2.birthDate) return
    setLoading(true)
    try {
      const { data } = await api.post('/api/relationships/analyze', { person1, person2 })
      setResult(data)
    } catch {
      // Demo result
      setResult({
        score: Math.floor(Math.random() * 40) + 60,
        type: 'Кармические отношения',
        karmicType: 'Урок взаимного роста',
        twinFlame: Math.random() > 0.8,
        soulmate: Math.random() > 0.5,
        emotional: 'Глубокая эмоциональная связь с периодами интенсивности',
        conflict: 'Различные подходы к свободе и ответственности',
        communication: 'Интуитивное понимание, иногда недосказанность',
        summary: 'Эти отношения несут важные кармические уроки. Вы встретились не случайно.',
      })
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = (s: number) => s >= 80 ? '#50c878' : s >= 60 ? '#d4af37' : '#ff6b35'

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float" style={{ color: '#e91e63', filter: 'drop-shadow(0 0 20px #e91e63)' }}>
          ♡
        </div>
        <h1 className="section-title">Совместимость</h1>
        <p className="section-subtitle">Кармические связи, близнецовые пламена, анализ отношений</p>
      </div>

      {/* Input */}
      <div className="glass rounded-2xl p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { label: 'Первый человек', state: person1, set: setPerson1 },
            { label: 'Второй человек', state: person2, set: setPerson2 },
          ].map(({ label, state, set }) => (
            <div key={label}>
              <h3 className="font-serif text-gold/70 mb-4">{label}</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={state.name}
                  onChange={e => set(s => ({ ...s, name: e.target.value }))}
                  placeholder="Имя"
                  className="w-full glass rounded-xl px-4 py-3 text-silver/70 placeholder-silver/20 font-serif text-sm focus:outline-none"
                />
                <input
                  type="date"
                  value={state.birthDate}
                  onChange={e => set(s => ({ ...s, birthDate: e.target.value }))}
                  className="w-full glass rounded-xl px-4 py-3 text-silver/70 font-serif text-sm focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Hearts connector */}
        <div className="flex items-center justify-center my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-pink-500/30" />
          <span className="mx-4 text-2xl text-pink-400/60">♡</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-pink-500/30" />
        </div>

        <button
          onClick={analyze}
          disabled={loading || !person1.birthDate || !person2.birthDate}
          className="btn-cosmic w-full border-pink-500/30 text-pink-300 hover:bg-pink-500/10 disabled:opacity-30"
        >
          {loading ? '♡ Анализирую...' : '♡ Анализировать совместимость'}
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Score */}
            <div className="glass rounded-2xl p-8 text-center">
              <div className="relative inline-flex items-center justify-center w-40 h-40 mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <motion.circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={scoreColor(result.score)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - result.score / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    style={{ filter: `drop-shadow(0 0 8px ${scoreColor(result.score)})` }}
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-4xl font-serif" style={{ color: scoreColor(result.score) }}>{result.score}</div>
                  <div className="text-silver/30 text-xs">%</div>
                </div>
              </div>
              <h3 className="font-serif text-2xl text-gold/80 mb-2">{result.type}</h3>
              <p className="text-silver/50 font-serif italic">{result.karmicType}</p>

              <div className="flex justify-center gap-4 mt-4">
                {result.twinFlame && (
                  <span className="px-4 py-1.5 glass rounded-full text-sm text-pink-300 border border-pink-500/30">
                    🔥 Близнецовое пламя
                  </span>
                )}
                {result.soulmate && (
                  <span className="px-4 py-1.5 glass rounded-full text-sm text-gold border border-gold/30">
                    ✦ Родственная душа
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: 'Эмоциональная динамика', text: result.emotional, color: '#e91e63' },
                { title: 'Зоны конфликта', text: result.conflict, color: '#ff6b35' },
                { title: 'Коммуникация', text: result.communication, color: '#4a9eff' },
              ].map(d => (
                <div key={d.title} className="glass rounded-xl p-5">
                  <h4 className="font-serif text-sm mb-3" style={{ color: d.color }}>{d.title}</h4>
                  <p className="text-silver/50 text-sm font-serif italic leading-relaxed">{d.text}</p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="glass rounded-2xl p-8 text-center" style={{ boxShadow: '0 0 40px rgba(233,30,99,0.15)' }}>
              <p className="text-silver/70 font-serif italic text-lg leading-relaxed">{result.summary}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
