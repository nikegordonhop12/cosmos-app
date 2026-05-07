import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const ARTICLES = [
  { id: '1', title: 'Сатурн в 7 доме: уроки отношений', category: 'Астрология', readTime: '8 мин', level: 'Средний' },
  { id: '2', title: 'Северный узел: ваша кармическая миссия', category: 'Астрология', readTime: '12 мин', level: 'Продвинутый' },
  { id: '3', title: 'Число жизненного пути: полное руководство', category: 'Нумерология', readTime: '10 мин', level: 'Начинающий' },
  { id: '4', title: 'Старшие Арканы: архетипы коллективного бессознательного', category: 'Таро', readTime: '15 мин', level: 'Средний' },
  { id: '5', title: 'Юнг и астрология: психологический подход', category: 'Психология', readTime: '20 мин', level: 'Продвинутый' },
  { id: '6', title: 'Руны для начинающих: Старший Футарк', category: 'Руны', readTime: '7 мин', level: 'Начинающий' },
  { id: '7', title: 'Ретроградный Меркурий: мифы и реальность', category: 'Астрология', readTime: '6 мин', level: 'Начинающий' },
  { id: '8', title: 'Чакры и планеты: энергетические соответствия', category: 'Духовность', readTime: '9 мин', level: 'Средний' },
]

const CATEGORIES = ['Все', 'Астрология', 'Нумерология', 'Таро', 'Руны', 'Психология', 'Духовность']
const LEVELS = { 'Начинающий': '#50c878', 'Средний': '#d4af37', 'Продвинутый': '#a855f7' }

const COURSES = [
  { title: 'Астрология с нуля', lessons: 24, icon: '☽', color: '#d4af37' },
  { title: 'Таро: полный курс', lessons: 18, icon: '⬡', color: '#ff6b35' },
  { title: 'Нумерология судьбы', lessons: 12, icon: '∞', color: '#e74c3c' },
  { title: 'Руническая магия', lessons: 16, icon: 'ᚱ', color: '#4a9eff' },
]

export default function LearnPage() {
  const [category, setCategory] = useState('Все')

  const filtered = category === 'Все' ? ARTICLES : ARTICLES.filter(a => a.category === category)

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float" style={{ color: '#3498db', filter: 'drop-shadow(0 0 20px #3498db)' }}>
          ◇
        </div>
        <h1 className="section-title">Обучение</h1>
        <p className="section-subtitle">Статьи, курсы, сертификаты по эзотерике</p>
      </div>

      {/* Courses */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {COURSES.map(c => (
          <motion.div
            key={c.title}
            whileHover={{ scale: 1.02 }}
            className="card-mystic cursor-pointer text-center"
          >
            <div className="text-4xl mb-3" style={{ color: c.color, filter: `drop-shadow(0 0 8px ${c.color})` }}>
              {c.icon}
            </div>
            <h3 className="font-serif text-sm text-gold/80 mb-1">{c.title}</h3>
            <p className="text-silver/30 text-xs">{c.lessons} уроков</p>
            <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-0 rounded-full" style={{ background: c.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-serif transition-all
              ${category === cat ? 'bg-gold/20 text-gold border border-gold/40' : 'glass text-silver/40 hover:text-gold'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-mystic cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs px-2 py-0.5 glass rounded-full text-silver/40">{article.category}</span>
              <span
                className="text-xs px-2 py-0.5 glass rounded-full"
                style={{ color: LEVELS[article.level as keyof typeof LEVELS] }}
              >
                {article.level}
              </span>
            </div>
            <h3 className="font-serif text-gold/80 group-hover:text-gold transition-colors mb-2 leading-snug">
              {article.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-silver/30 text-xs">⏱ {article.readTime}</span>
              <span className="text-gold/40 text-xs group-hover:text-gold transition-colors">Читать →</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
