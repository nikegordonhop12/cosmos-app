import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '☽', title: 'Натальная Карта', desc: 'Точный расчёт планет, домов и аспектов', path: '/chart', color: '#d4af37' },
  { icon: '◈', title: 'AI Астролог', desc: 'Разговорный ИИ с памятью вашей карты', path: '/ai', color: '#a855f7' },
  { icon: '⬡', title: 'Таро', desc: 'Расклады с AI интерпретацией', path: '/tarot', color: '#ff6b35' },
  { icon: 'ᚱ', title: 'Руны', desc: 'Нордическое гадание и биндруны', path: '/runes', color: '#4a9eff' },
  { icon: '◎', title: 'Чакры', desc: 'Энергетическая диагностика и баланс', path: '/chakra', color: '#50c878' },
  { icon: '☁', title: 'Сны', desc: 'AI анализ архетипов и символов', path: '/dreams', color: '#9b59b6' },
  { icon: '∞', title: 'Нумерология', desc: 'Числа судьбы, кармический долг', path: '/numerology', color: '#e74c3c' },
  { icon: '♡', title: 'Отношения', desc: 'Совместимость, близнецовые пламена', path: '/relationships', color: '#e91e63' },
  { icon: '⟿', title: 'Линия Жизни', desc: 'Интерактивная временная шкала судьбы', path: '/timeline', color: '#f39c12' },
  { icon: '◉', title: 'Космос Live', desc: 'Реальное небо, ретрограды, затмения', path: '/cosmic', color: '#1abc9c' },
  { icon: '◇', title: 'Обучение', desc: 'Статьи, курсы, сертификаты', path: '/learn', color: '#3498db' },
  { icon: '⚗', title: 'Лаборатория', desc: 'Астрологические исследования и ML', path: '/research', color: '#8e44ad' },
]

const PLANETS = [
  { name: '☉', size: 40, orbit: 0, speed: 30, color: '#ffd700' },
  { name: '☽', size: 20, orbit: 80, speed: 8, color: '#c0c0c0' },
  { name: '♂', size: 18, orbit: 130, speed: 22, color: '#ff4444' },
  { name: '♃', size: 30, orbit: 190, speed: 45, color: '#d4af37' },
  { name: '♄', size: 26, orbit: 250, speed: 60, color: '#b8860b' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Orbit system */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {PLANETS.map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-gold/5"
              style={{ width: p.orbit * 2, height: p.orbit * 2 }}
            >
              <motion.div
                className="absolute flex items-center justify-center"
                style={{
                  width: p.size, height: p.size,
                  top: '50%', left: '50%',
                  marginTop: -p.size / 2, marginLeft: -p.size / 2,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: p.speed, repeat: Infinity, ease: 'linear' }}
              >
                <motion.span
                  className="text-2xl"
                  style={{ color: p.color, filter: `drop-shadow(0 0 8px ${p.color})` }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: p.speed, repeat: Infinity, ease: 'linear' }}
                >
                  {p.name}
                </motion.span>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <p className="text-gold/60 font-serif tracking-[0.4em] uppercase text-sm mb-6">
              AI-Powered Мистическая Экосистема
            </p>
            <h1 className="text-6xl md:text-8xl font-serif font-light text-shimmer mb-6 leading-none">
              КОСМОС
            </h1>
            <p className="text-silver/50 font-serif italic text-xl md:text-2xl mb-12 leading-relaxed">
              Астрологическая операционная система нового поколения.<br />
              Живая. Разумная. Мистическая.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/chart" className="btn-cosmic">
                Построить карту
              </Link>
              <Link to="/ai" className="btn-cosmic border-mystic-light/30 text-mystic-light hover:bg-mystic/10">
                Спросить AI
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/40"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ↓
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Экосистема Модулей</h2>
          <p className="section-subtitle">Полная вселенная эзотерических инструментов</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.path}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={f.path} className="card-mystic block group">
                <div
                  className="text-3xl mb-3 transition-all duration-300 group-hover:scale-110"
                  style={{ filter: `drop-shadow(0 0 8px ${f.color})`, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="font-serif text-lg text-gold/90 mb-1">{f.title}</h3>
                <p className="text-silver/40 text-xs leading-relaxed">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="glass rounded-3xl p-12 text-center glow-mystic">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-6 animate-float">◈</div>
            <h2 className="text-4xl font-serif text-shimmer mb-4">AI Астролог</h2>
            <p className="text-silver/50 font-serif italic text-lg mb-8 max-w-2xl mx-auto">
              Разговорный ИИ, который знает вашу карту, помнит историю диалогов
              и отвечает как мудрый астролог — глубоко, точно, мистически.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {[
                'Почему мне сложно строить отношения?',
                'Что означает Сатурн в 7 доме?',
                'Какая профессия мне подходит?',
                'Что означает мой кармический хвост?',
              ].map(q => (
                <span key={q} className="px-4 py-2 glass rounded-full text-silver/60 text-sm font-serif italic">
                  «{q}»
                </span>
              ))}
            </div>
            <Link to="/ai" className="btn-cosmic border-mystic-light/40 text-mystic-light hover:bg-mystic/10">
              Начать диалог
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-t border-gold/10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '12', label: 'Модулей' },
            { n: 'AI', label: 'Ассистент' },
            { n: '78', label: 'Карт Таро' },
            { n: '24', label: 'Руны Футарка' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-4xl font-serif text-shimmer mb-1">{s.n}</div>
              <div className="text-silver/40 text-sm tracking-widest uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
