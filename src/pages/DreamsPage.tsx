import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, type DreamEntry } from '@/store'
import api from '@/utils/api'

export default function DreamsPage() {
  const { dreams, saveDream, activeChart } = useStore()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DreamEntry | null>(null)

  const analyze = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const { data } = await api.post('/api/dreams/analyze', {
        dream: text,
        chart: activeChart,
      })
      const entry: DreamEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('ru-RU'),
        description: text,
        analysis: data.analysis,
      }
      saveDream(entry)
      setResult(entry)
      setText('')
    } catch {
      const entry: DreamEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('ru-RU'),
        description: text,
      }
      saveDream(entry)
      setResult(entry)
      setText('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float" style={{ color: '#9b59b6', filter: 'drop-shadow(0 0 20px #9b59b6)' }}>
          ☁
        </div>
        <h1 className="section-title">Толкование Снов</h1>
        <p className="section-subtitle">AI анализ архетипов, символов и астрологических связей</p>
      </div>

      {/* Input */}
      <div className="glass rounded-2xl p-8 mb-8">
        <label className="block text-silver/50 font-serif text-sm mb-3">Опишите ваш сон...</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={6}
          placeholder="Я видел огромный океан, и в нём отражались звёзды. Появилась белая птица..."
          className="w-full glass rounded-xl px-5 py-4 text-silver/70 placeholder-silver/20 font-serif
                     text-sm leading-relaxed focus:outline-none focus:border-gold/30 resize-none"
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-silver/20 text-xs">{text.length} символов</span>
          <button
            onClick={analyze}
            disabled={loading || !text.trim()}
            className="btn-cosmic disabled:opacity-30"
          >
            {loading ? '☁ Анализирую...' : '◈ Истолковать сон'}
          </button>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result?.analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8 mb-8"
            style={{ boxShadow: '0 0 40px rgba(155,89,182,0.2)' }}
          >
            <h3 className="font-serif text-xl text-gold/80 mb-6">Анализ сна</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Section title="Архетипы" color="#9b59b6" items={result.analysis.archetypes} />
              <Section title="Символы" color="#d4af37" items={result.analysis.symbols} />
            </div>
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <TextSection title="Астрология" color="#4a9eff" text={result.analysis.astrology} />
              <TextSection title="Психология" color="#50c878" text={result.analysis.psychology} />
              <TextSection title="Духовность" color="#a855f7" text={result.analysis.spirituality} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dream journal */}
      {dreams.length > 0 && (
        <div>
          <h2 className="text-2xl font-serif text-gold/70 mb-6">Журнал Снов</h2>
          <div className="flex flex-col gap-4">
            {[...dreams].reverse().map(d => (
              <div key={d.id} className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gold/50 text-sm font-serif">{d.date}</span>
                  {d.analysis && (
                    <div className="flex gap-1">
                      {d.analysis.archetypes.slice(0, 3).map(a => (
                        <span key={a} className="px-2 py-0.5 glass rounded-full text-xs text-mystic-light">{a}</span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-silver/50 text-sm font-serif italic leading-relaxed line-clamp-2">
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Section({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-serif text-sm mb-3" style={{ color }}>{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span key={item} className="px-3 py-1 glass rounded-full text-xs text-silver/60">{item}</span>
        ))}
      </div>
    </div>
  )
}

function TextSection({ title, color, text }: { title: string; color: string; text: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <h4 className="font-serif text-sm mb-2" style={{ color }}>{title}</h4>
      <p className="text-silver/50 text-xs leading-relaxed font-serif italic">{text}</p>
    </div>
  )
}
