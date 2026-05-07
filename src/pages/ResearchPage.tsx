import { motion } from 'framer-motion'

const TOPICS = [
  { title: 'Землетрясения и астрология', icon: '🌍', status: 'active', color: '#ff6b35' },
  { title: 'Экономические циклы', icon: '📈', status: 'active', color: '#d4af37' },
  { title: 'Психология и планеты', icon: '🧠', status: 'active', color: '#a855f7' },
  { title: 'Поведение программистов', icon: '💻', status: 'beta', color: '#4a9eff' },
  { title: 'Циклы здоровья', icon: '❤️', status: 'planned', color: '#50c878' },
  { title: 'Социальные события', icon: '🌐', status: 'planned', color: '#e91e63' },
]

const STATUS_LABELS = { active: 'Активно', beta: 'Бета', planned: 'Планируется' }
const STATUS_COLORS = { active: '#50c878', beta: '#d4af37', planned: '#4a9eff' }

export default function ResearchPage() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float" style={{ color: '#8e44ad', filter: 'drop-shadow(0 0 20px #8e44ad)' }}>
          ⚗
        </div>
        <h1 className="section-title">Лаборатория</h1>
        <p className="section-subtitle">Астрологические исследования, корреляции, ML эксперименты</p>
      </div>

      {/* Research topics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {TOPICS.map((topic, i) => (
          <motion.div
            key={topic.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-mystic cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{topic.icon}</span>
              <span
                className="text-xs px-2 py-0.5 glass rounded-full"
                style={{ color: STATUS_COLORS[topic.status as keyof typeof STATUS_COLORS] }}
              >
                {STATUS_LABELS[topic.status as keyof typeof STATUS_LABELS]}
              </span>
            </div>
            <h3 className="font-serif text-gold/80 group-hover:text-gold transition-colors">{topic.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* ML section */}
      <div className="glass rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-serif text-gold/80 mb-6">ML Предсказания</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Предсказание личности', acc: 78, color: '#a855f7' },
            { title: 'Совместимость', acc: 82, color: '#e91e63' },
            { title: 'Паттерны событий', acc: 65, color: '#ff6b35' },
            { title: 'Влияние транзитов', acc: 71, color: '#d4af37' },
            { title: 'Эмоциональные циклы', acc: 69, color: '#4a9eff' },
          ].map(m => (
            <div key={m.title} className="glass rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-serif text-sm text-silver/70">{m.title}</span>
                <span className="text-sm" style={{ color: m.color }}>{m.acc}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: m.color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${m.acc}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2 }}
                />
              </div>
              <div className="text-silver/20 text-xs mt-1">Точность модели</div>
            </div>
          ))}
        </div>
      </div>

      {/* Correlations chart placeholder */}
      <div className="glass rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-serif text-gold/80 mb-4">Корреляции</h2>
        <p className="text-silver/30 font-serif italic mb-6">
          Интерактивные графики корреляций астрологических событий с историческими данными
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            ['Сатурн ♄', 'Экономика', '0.67'],
            ['Плутон ♇', 'Трансформации', '0.71'],
            ['Юпитер ♃', 'Рост', '0.58'],
          ].map(([p, t, c]) => (
            <div key={p} className="glass rounded-xl p-4 text-center">
              <div className="text-gold font-serif text-lg">{c}</div>
              <div className="text-silver/40 text-xs mt-1">{p}</div>
              <div className="text-silver/30 text-xs">{t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
