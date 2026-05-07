import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/utils/api'
import { useStore } from '@/store'

// 22 Major Arcana
const MAJOR_ARCANA = [
  { id: 0, name: 'Шут', symbol: '🃏', keywords: 'начало, свобода, безрассудство', element: 'Воздух' },
  { id: 1, name: 'Маг', symbol: '✦', keywords: 'воля, мастерство, манифестация', element: 'Огонь' },
  { id: 2, name: 'Верховная Жрица', symbol: '☽', keywords: 'интуиция, тайна, подсознание', element: 'Вода' },
  { id: 3, name: 'Императрица', symbol: '♀', keywords: 'плодородие, природа, изобилие', element: 'Земля' },
  { id: 4, name: 'Император', symbol: '♂', keywords: 'власть, структура, авторитет', element: 'Огонь' },
  { id: 5, name: 'Иерофант', symbol: '⊕', keywords: 'традиция, духовность, наставник', element: 'Земля' },
  { id: 6, name: 'Влюблённые', symbol: '♡', keywords: 'выбор, союз, ценности', element: 'Воздух' },
  { id: 7, name: 'Колесница', symbol: '◉', keywords: 'победа, контроль, движение', element: 'Вода' },
  { id: 8, name: 'Сила', symbol: '∞', keywords: 'мужество, терпение, внутренняя сила', element: 'Огонь' },
  { id: 9, name: 'Отшельник', symbol: '◇', keywords: 'уединение, мудрость, поиск', element: 'Земля' },
  { id: 10, name: 'Колесо Фортуны', symbol: '◎', keywords: 'судьба, циклы, удача', element: 'Огонь' },
  { id: 11, name: 'Справедливость', symbol: '⚖', keywords: 'баланс, истина, закон', element: 'Воздух' },
  { id: 12, name: 'Повешенный', symbol: '⟿', keywords: 'жертва, ожидание, новый взгляд', element: 'Вода' },
  { id: 13, name: 'Смерть', symbol: '☽', keywords: 'трансформация, конец, обновление', element: 'Вода' },
  { id: 14, name: 'Умеренность', symbol: '◈', keywords: 'баланс, терпение, синтез', element: 'Огонь' },
  { id: 15, name: 'Дьявол', symbol: '⬡', keywords: 'привязанность, материализм, тень', element: 'Земля' },
  { id: 16, name: 'Башня', symbol: '⚡', keywords: 'разрушение, откровение, хаос', element: 'Огонь' },
  { id: 17, name: 'Звезда', symbol: '✦', keywords: 'надежда, вдохновение, обновление', element: 'Воздух' },
  { id: 18, name: 'Луна', symbol: '☽', keywords: 'иллюзия, страх, подсознание', element: 'Вода' },
  { id: 19, name: 'Солнце', symbol: '☉', keywords: 'радость, успех, ясность', element: 'Огонь' },
  { id: 20, name: 'Суд', symbol: '◉', keywords: 'пробуждение, призыв, трансформация', element: 'Огонь' },
  { id: 21, name: 'Мир', symbol: '◎', keywords: 'завершение, интеграция, успех', element: 'Земля' },
]

const SPREADS = [
  { id: 'daily', name: 'Карта дня', count: 1, desc: 'Одна карта — послание дня' },
  { id: 'love', name: 'Любовный расклад', count: 3, desc: 'Прошлое · Настоящее · Будущее отношений' },
  { id: 'career', name: 'Карьерный расклад', count: 3, desc: 'Ситуация · Препятствие · Совет' },
  { id: 'celtic', name: 'Кельтский крест', count: 10, desc: 'Полный анализ ситуации' },
  { id: 'chakra', name: 'Чакровый расклад', count: 7, desc: 'Состояние каждой чакры' },
  { id: 'destiny', name: 'Расклад судьбы', count: 5, desc: 'Прошлое · Настоящее · Будущее · Совет · Итог' },
]

const CARD_COLORS = ['#d4af37', '#a855f7', '#4a9eff', '#50c878', '#ff6b35', '#e91e63', '#1abc9c']

export default function TarotPage() {
  const [spread, setSpread] = useState(SPREADS[0])
  const [drawnCards, setDrawnCards] = useState<typeof MAJOR_ARCANA>([])
  const [flipped, setFlipped] = useState<Set<number>>(new Set())
  const [interpretation, setInterpretation] = useState('')
  const [loading, setLoading] = useState(false)
  const { activeChart } = useStore()

  const drawCards = () => {
    const shuffled = [...MAJOR_ARCANA].sort(() => Math.random() - 0.5)
    setDrawnCards(shuffled.slice(0, spread.count))
    setFlipped(new Set())
    setInterpretation('')
  }

  const flipCard = (i: number) => {
    setFlipped(prev => new Set([...prev, i]))
  }

  const interpret = async () => {
    if (drawnCards.length === 0) return
    setLoading(true)
    try {
      const { data } = await api.post('/api/tarot/interpret', {
        spread: spread.id,
        cards: drawnCards.map(c => c.name),
        chart: activeChart,
      })
      setInterpretation(data.interpretation)
    } catch {
      setInterpretation('Карты хранят молчание... Попробуйте снова. ✦')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float">⬡</div>
        <h1 className="section-title">Таро</h1>
        <p className="section-subtitle">Послания Высших Арканов</p>
      </div>

      {/* Spread selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {SPREADS.map(s => (
          <button
            key={s.id}
            onClick={() => { setSpread(s); setDrawnCards([]); setFlipped(new Set()); setInterpretation('') }}
            className={`p-3 rounded-xl text-left transition-all glass
              ${spread.id === s.id ? 'border-gold/40 glow-gold' : 'hover:border-gold/20'}`}
          >
            <div className="font-serif text-sm text-gold/80 mb-1">{s.name}</div>
            <div className="text-silver/30 text-xs">{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Draw button */}
      <div className="text-center mb-10">
        <button onClick={drawCards} className="btn-cosmic text-base px-10 py-4">
          ✦ Вытянуть карты
        </button>
      </div>

      {/* Cards */}
      <AnimatePresence>
        {drawnCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-6 mb-10"
          >
            {drawnCards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30, rotateY: 180 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="tarot-card"
                style={{ width: 120, height: 200 }}
                onClick={() => flipCard(i)}
              >
                <div className={`tarot-card-inner w-full h-full ${flipped.has(i) ? 'flipped' : ''}`}>
                  {/* Card back */}
                  <div className="tarot-card-front w-full h-full glass rounded-2xl flex items-center justify-center
                                  border border-gold/20 cursor-pointer hover:border-gold/50 transition-all">
                    <div className="text-center">
                      <div className="text-4xl text-gold/30 mb-2">✦</div>
                      <div className="text-silver/20 text-xs font-serif">Нажмите</div>
                    </div>
                  </div>
                  {/* Card front */}
                  <div
                    className="tarot-card-back w-full h-full rounded-2xl flex flex-col items-center justify-center p-3 text-center"
                    style={{
                      background: `linear-gradient(135deg, ${CARD_COLORS[i % CARD_COLORS.length]}22, #0a0a1a)`,
                      border: `1px solid ${CARD_COLORS[i % CARD_COLORS.length]}44`,
                      boxShadow: `0 0 20px ${CARD_COLORS[i % CARD_COLORS.length]}33`,
                    }}
                  >
                    <div className="text-3xl mb-2" style={{ color: CARD_COLORS[i % CARD_COLORS.length] }}>
                      {card.symbol}
                    </div>
                    <div className="font-serif text-sm text-gold/90 mb-1">{card.name}</div>
                    <div className="text-silver/40 text-xs">{card.element}</div>
                    <div className="text-silver/30 text-xs mt-2 leading-tight">{card.keywords}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interpret button */}
      {drawnCards.length > 0 && flipped.size === drawnCards.length && !interpretation && (
        <div className="text-center mb-8">
          <button
            onClick={interpret}
            disabled={loading}
            className="btn-cosmic border-mystic-light/40 text-mystic-light hover:bg-mystic/10 disabled:opacity-40"
          >
            {loading ? '◈ Читаю карты...' : '◈ AI Интерпретация'}
          </button>
        </div>
      )}

      {/* Interpretation */}
      <AnimatePresence>
        {interpretation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8 glow-mystic"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl text-mystic-light">◈</span>
              <h3 className="font-serif text-xl text-gold/80">Интерпретация</h3>
            </div>
            <p className="text-silver/70 font-serif italic leading-relaxed">{interpretation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card encyclopedia */}
      <div className="mt-16">
        <h2 className="text-2xl font-serif text-gold/70 mb-6 text-center">Старшие Арканы</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {MAJOR_ARCANA.map((card, i) => (
            <div
              key={card.id}
              className="glass rounded-xl p-3 text-center hover:border-gold/30 transition-all cursor-pointer"
            >
              <div className="text-2xl mb-1" style={{ color: CARD_COLORS[i % CARD_COLORS.length] }}>
                {card.symbol}
              </div>
              <div className="font-serif text-xs text-gold/70">{card.name}</div>
              <div className="text-silver/30 text-xs mt-1">{card.element}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
