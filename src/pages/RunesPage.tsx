import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/utils/api'

const ELDER_FUTHARK = [
  { name: 'Феху', symbol: 'ᚠ', meaning: 'Богатство, изобилие, удача', element: 'Огонь' },
  { name: 'Уруз', symbol: 'ᚢ', meaning: 'Сила, здоровье, дикая энергия', element: 'Земля' },
  { name: 'Турисаз', symbol: 'ᚦ', meaning: 'Защита, сила, испытание', element: 'Огонь' },
  { name: 'Ансуз', symbol: 'ᚨ', meaning: 'Мудрость, коммуникация, Один', element: 'Воздух' },
  { name: 'Райдо', symbol: 'ᚱ', meaning: 'Путешествие, движение, ритм', element: 'Воздух' },
  { name: 'Кеназ', symbol: 'ᚲ', meaning: 'Знание, свет, творчество', element: 'Огонь' },
  { name: 'Гебо', symbol: 'ᚷ', meaning: 'Дар, партнёрство, баланс', element: 'Воздух' },
  { name: 'Вуньо', symbol: 'ᚹ', meaning: 'Радость, гармония, успех', element: 'Земля' },
  { name: 'Хагалаз', symbol: 'ᚺ', meaning: 'Разрушение, трансформация, хаос', element: 'Вода' },
  { name: 'Наутиз', symbol: 'ᚾ', meaning: 'Нужда, ограничение, терпение', element: 'Огонь' },
  { name: 'Иса', symbol: 'ᛁ', meaning: 'Лёд, остановка, концентрация', element: 'Вода' },
  { name: 'Йера', symbol: 'ᛃ', meaning: 'Урожай, циклы, награда', element: 'Земля' },
  { name: 'Эйваз', symbol: 'ᛇ', meaning: 'Тис, смерть-возрождение, связь миров', element: 'Земля' },
  { name: 'Перто', symbol: 'ᛈ', meaning: 'Тайна, судьба, лотерея', element: 'Вода' },
  { name: 'Альгиз', symbol: 'ᛉ', meaning: 'Защита, связь с богами, страж', element: 'Воздух' },
  { name: 'Совило', symbol: 'ᛊ', meaning: 'Солнце, победа, жизненная сила', element: 'Огонь' },
  { name: 'Тейваз', symbol: 'ᛏ', meaning: 'Тюр, справедливость, жертва', element: 'Воздух' },
  { name: 'Беркано', symbol: 'ᛒ', meaning: 'Берёза, рождение, рост', element: 'Земля' },
  { name: 'Эваз', symbol: 'ᛖ', meaning: 'Конь, движение, партнёрство', element: 'Земля' },
  { name: 'Манназ', symbol: 'ᛗ', meaning: 'Человек, разум, сообщество', element: 'Воздух' },
  { name: 'Лагуз', symbol: 'ᛚ', meaning: 'Вода, интуиция, подсознание', element: 'Вода' },
  { name: 'Ингваз', symbol: 'ᛜ', meaning: 'Плодородие, потенциал, завершение', element: 'Земля' },
  { name: 'Дагаз', symbol: 'ᛞ', meaning: 'День, рассвет, трансформация', element: 'Огонь' },
  { name: 'Отала', symbol: 'ᛟ', meaning: 'Наследие, дом, предки', element: 'Земля' },
]

const ELEMENT_COLORS: Record<string, string> = {
  'Огонь': '#ff6b35',
  'Земля': '#50c878',
  'Воздух': '#4a9eff',
  'Вода': '#a855f7',
}

export default function RunesPage() {
  const [castRunes, setCastRunes] = useState<typeof ELDER_FUTHARK>([])
  const [selected, setSelected] = useState<(typeof ELDER_FUTHARK)[0] | null>(null)
  const [interpretation, setInterpretation] = useState('')
  const [loading, setLoading] = useState(false)
  const [castCount, setCastCount] = useState(3)

  const castRune = () => {
    const shuffled = [...ELDER_FUTHARK].sort(() => Math.random() - 0.5)
    setCastRunes(shuffled.slice(0, castCount))
    setInterpretation('')
  }

  const interpret = async () => {
    if (castRunes.length === 0) return
    setLoading(true)
    try {
      const { data } = await api.post('/api/runes/interpret', {
        runes: castRunes.map(r => r.name),
        count: castCount,
      })
      setInterpretation(data.interpretation)
    } catch {
      setInterpretation('Руны хранят тайну... Попробуйте снова. ᚱ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float" style={{ color: '#4a9eff', filter: 'drop-shadow(0 0 20px #4a9eff)' }}>
          ᚱ
        </div>
        <h1 className="section-title">Руны</h1>
        <p className="section-subtitle">Нордическая мудрость Старшего Футарка</p>
      </div>

      {/* Cast controls */}
      <div className="glass rounded-2xl p-8 mb-10 text-center">
        <p className="text-silver/50 font-serif italic mb-6">Сколько рун бросить?</p>
        <div className="flex justify-center gap-3 mb-8">
          {[1, 3, 5, 9].map(n => (
            <button
              key={n}
              onClick={() => setCastCount(n)}
              className={`w-12 h-12 rounded-full font-serif text-lg transition-all
                ${castCount === n ? 'bg-rune/20 text-rune border border-rune/50 glow-rune' : 'glass text-silver/40 hover:text-rune'}`}
            >
              {n}
            </button>
          ))}
        </div>
        <button onClick={castRune} className="btn-cosmic border-rune/40 text-rune hover:bg-rune/10 px-10 py-4">
          ᚱ Бросить руны
        </button>
      </div>

      {/* Cast runes */}
      <AnimatePresence>
        {castRunes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-6 mb-10"
          >
            {castRunes.map((rune, i) => (
              <motion.div
                key={rune.name + i}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                onClick={() => setSelected(rune)}
                className="rune-stone cursor-pointer"
              >
                <div
                  className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center glass"
                  style={{
                    border: `1px solid ${ELEMENT_COLORS[rune.element]}44`,
                    boxShadow: `0 0 20px ${ELEMENT_COLORS[rune.element]}22`,
                  }}
                >
                  <span
                    className="text-4xl font-bold mb-1"
                    style={{ color: ELEMENT_COLORS[rune.element], filter: `drop-shadow(0 0 8px ${ELEMENT_COLORS[rune.element]})` }}
                  >
                    {rune.symbol}
                  </span>
                  <span className="text-silver/40 text-xs font-serif">{rune.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected rune detail */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-2xl p-8 mb-8 glow-rune"
          >
            <div className="flex items-center gap-6">
              <span
                className="text-7xl"
                style={{ color: ELEMENT_COLORS[selected.element], filter: `drop-shadow(0 0 20px ${ELEMENT_COLORS[selected.element]})` }}
              >
                {selected.symbol}
              </span>
              <div>
                <h3 className="font-serif text-3xl text-gold/90 mb-1">{selected.name}</h3>
                <p className="text-silver/50 font-serif italic mb-2">{selected.meaning}</p>
                <span className="px-3 py-1 glass rounded-full text-xs" style={{ color: ELEMENT_COLORS[selected.element] }}>
                  {selected.element}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interpret */}
      {castRunes.length > 0 && !interpretation && (
        <div className="text-center mb-8">
          <button
            onClick={interpret}
            disabled={loading}
            className="btn-cosmic border-rune/40 text-rune hover:bg-rune/10 disabled:opacity-40"
          >
            {loading ? 'ᚱ Читаю руны...' : '◈ AI Интерпретация'}
          </button>
        </div>
      )}

      <AnimatePresence>
        {interpretation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8 mb-12 glow-rune"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl" style={{ color: '#4a9eff' }}>ᚱ</span>
              <h3 className="font-serif text-xl text-gold/80">Послание Рун</h3>
            </div>
            <p className="text-silver/70 font-serif italic leading-relaxed">{interpretation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encyclopedia */}
      <h2 className="text-2xl font-serif text-gold/70 mb-6 text-center">Старший Футарк</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {ELDER_FUTHARK.map(rune => (
          <button
            key={rune.name}
            onClick={() => setSelected(rune)}
            className="glass rounded-xl p-3 text-center hover:border-rune/30 transition-all rune-stone"
          >
            <div
              className="text-2xl mb-1"
              style={{ color: ELEMENT_COLORS[rune.element], filter: `drop-shadow(0 0 6px ${ELEMENT_COLORS[rune.element]})` }}
            >
              {rune.symbol}
            </div>
            <div className="text-silver/40 text-xs font-serif">{rune.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
