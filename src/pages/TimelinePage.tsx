import { useState } from 'react'
import { motion } from 'framer-motion'

interface TimelineEvent {
  age: number
  year: number
  title: string
  type: 'saturn' | 'nodal' | 'eclipse' | 'transit' | 'karmic'
  desc: string
  intensity: number
}

const TYPE_COLORS = {
  saturn: '#d4af37',
  nodal: '#a855f7',
  eclipse: '#ff6b35',
  transit: '#4a9eff',
  karmic: '#50c878',
}

const TYPE_LABELS = {
  saturn: 'Возврат Сатурна',
  nodal: 'Возврат Узлов',
  eclipse: 'Затмение',
  transit: 'Транзит',
  karmic: 'Кармическая веха',
}

function generateTimeline(birthYear: number): TimelineEvent[] {
  const events: TimelineEvent[] = [
    { age: 7, year: birthYear + 7, title: 'Первый квадрат Сатурна', type: 'saturn', desc: 'Первые серьёзные уроки ответственности', intensity: 6 },
    { age: 14, year: birthYear + 14, title: 'Оппозиция Сатурна', type: 'saturn', desc: 'Подростковый кризис идентичности', intensity: 7 },
    { age: 18, year: birthYear + 18, title: 'Возврат Узлов', type: 'nodal', desc: 'Первый кармический поворот судьбы', intensity: 8 },
    { age: 21, year: birthYear + 21, title: 'Третий квадрат Сатурна', type: 'saturn', desc: 'Взросление, первые серьёзные решения', intensity: 7 },
    { age: 29, year: birthYear + 29, title: 'Первый Возврат Сатурна', type: 'saturn', desc: 'Великий кризис взросления. Переосмысление жизни.', intensity: 10 },
    { age: 36, year: birthYear + 36, title: 'Второй Возврат Узлов', type: 'nodal', desc: 'Кармическое переосмысление пути', intensity: 8 },
    { age: 42, year: birthYear + 42, title: 'Кризис середины жизни', type: 'transit', desc: 'Уран оппозиция Урану. Глубокая трансформация.', intensity: 9 },
    { age: 58, year: birthYear + 58, title: 'Второй Возврат Сатурна', type: 'saturn', desc: 'Мудрость и подведение итогов', intensity: 9 },
    { age: 54, year: birthYear + 54, title: 'Третий Возврат Узлов', type: 'nodal', desc: 'Духовное пробуждение', intensity: 8 },
  ]
  return events.sort((a, b) => a.age - b.age)
}

export default function TimelinePage() {
  const [birthYear, setBirthYear] = useState(1990)
  const [events] = useState(() => generateTimeline(birthYear))
  const [selected, setSelected] = useState<TimelineEvent | null>(null)
  const currentAge = new Date().getFullYear() - birthYear

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float" style={{ color: '#f39c12', filter: 'drop-shadow(0 0 20px #f39c12)' }}>
          ⟿
        </div>
        <h1 className="section-title">Линия Жизни</h1>
        <p className="section-subtitle">Кармические вехи, возвраты планет, судьбоносные периоды</p>
      </div>

      {/* Year input */}
      <div className="glass rounded-2xl p-6 mb-10 flex items-center gap-6">
        <label className="text-silver/50 font-serif text-sm whitespace-nowrap">Год рождения:</label>
        <input
          type="number"
          value={birthYear}
          onChange={e => setBirthYear(+e.target.value)}
          min={1940} max={2010}
          className="glass rounded-xl px-4 py-2 text-gold font-serif text-lg w-28 focus:outline-none text-center"
        />
        <div className="text-silver/30 text-sm font-serif">
          Текущий возраст: <span className="text-gold">{currentAge}</span> лет
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <span key={type} className="flex items-center gap-2 px-3 py-1 glass rounded-full text-xs">
            <span className="w-2 h-2 rounded-full" style={{ background: TYPE_COLORS[type as keyof typeof TYPE_COLORS] }} />
            <span className="text-silver/50">{label}</span>
          </span>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

        <div className="space-y-6">
          {generateTimeline(birthYear).map((event, i) => {
            const isPast = event.age < currentAge
            const isCurrent = Math.abs(event.age - currentAge) <= 2
            const isLeft = i % 2 === 0

            return (
              <motion.div
                key={event.age}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Card */}
                <div
                  className={`flex-1 cursor-pointer glass rounded-xl p-4 transition-all
                    ${isCurrent ? 'border-gold/50 glow-gold' : 'hover:border-gold/20'}
                    ${isPast ? 'opacity-60' : ''}`}
                  onClick={() => setSelected(event)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-sm" style={{ color: TYPE_COLORS[event.type] }}>
                      {TYPE_LABELS[event.type]}
                    </span>
                    <span className="text-silver/30 text-xs">{event.year}</span>
                  </div>
                  <h3 className="font-serif text-gold/80 mb-1">{event.title}</h3>
                  <p className="text-silver/40 text-xs leading-relaxed">{event.desc}</p>
                  {/* Intensity bar */}
                  <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${event.intensity * 10}%`,
                        background: TYPE_COLORS[event.type],
                        boxShadow: `0 0 6px ${TYPE_COLORS[event.type]}`,
                      }}
                    />
                  </div>
                </div>

                {/* Node */}
                <div className="relative z-10 flex-shrink-0">
                  <motion.div
                    className="timeline-node w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm"
                    style={{
                      background: `${TYPE_COLORS[event.type]}22`,
                      border: `2px solid ${TYPE_COLORS[event.type]}`,
                      boxShadow: isCurrent ? `0 0 20px ${TYPE_COLORS[event.type]}` : 'none',
                      color: TYPE_COLORS[event.type],
                    }}
                    animate={isCurrent ? {
                      boxShadow: [`0 0 10px ${TYPE_COLORS[event.type]}44`, `0 0 30px ${TYPE_COLORS[event.type]}88`, `0 0 10px ${TYPE_COLORS[event.type]}44`]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {event.age}
                  </motion.div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Selected event detail */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50"
        >
          <div
            className="glass rounded-2xl p-6"
            style={{ boxShadow: `0 0 40px ${TYPE_COLORS[selected.type]}33` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-serif" style={{ color: TYPE_COLORS[selected.type] }}>
                  {TYPE_LABELS[selected.type]} · Возраст {selected.age}
                </span>
                <h3 className="font-serif text-xl text-gold/90 mt-1">{selected.title}</h3>
                <p className="text-silver/60 font-serif italic mt-2 text-sm">{selected.desc}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-silver/30 hover:text-gold ml-4">✕</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
