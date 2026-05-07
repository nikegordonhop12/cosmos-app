import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface PlanetData {
  name: string; symbol: string; sign: string; degree: number
  retrograde: boolean; color: string; speed: number
}

const MOCK_PLANETS: PlanetData[] = [
  { name: 'Солнце', symbol: '☉', sign: 'Козерог', degree: 15.3, retrograde: false, color: '#ffd700', speed: 1 },
  { name: 'Луна', symbol: '☽', sign: 'Рак', degree: 28.7, retrograde: false, color: '#c0c0c0', speed: 13 },
  { name: 'Меркурий', symbol: '☿', sign: 'Козерог', degree: 8.2, retrograde: true, color: '#a0a0a0', speed: 1.5 },
  { name: 'Венера', symbol: '♀', sign: 'Водолей', degree: 22.1, retrograde: false, color: '#ff9999', speed: 1.2 },
  { name: 'Марс', symbol: '♂', sign: 'Стрелец', degree: 5.8, retrograde: false, color: '#ff4444', speed: 0.7 },
  { name: 'Юпитер', symbol: '♃', sign: 'Телец', degree: 12.4, retrograde: false, color: '#d4af37', speed: 0.08 },
  { name: 'Сатурн', symbol: '♄', sign: 'Рыбы', degree: 7.9, retrograde: false, color: '#b8860b', speed: 0.03 },
  { name: 'Уран', symbol: '♅', sign: 'Телец', degree: 19.6, retrograde: false, color: '#4a9eff', speed: 0.01 },
  { name: 'Нептун', symbol: '♆', sign: 'Рыбы', degree: 25.3, retrograde: false, color: '#6644ff', speed: 0.006 },
  { name: 'Плутон', symbol: '♇', sign: 'Козерог', degree: 29.1, retrograde: false, color: '#8b0000', speed: 0.004 },
]

const MOON_PHASES = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']

export default function CosmicDashboardPage() {
  const [time, setTime] = useState(new Date())
  const [moonPhase] = useState(Math.floor(Math.random() * 8))

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const retrogrades = MOCK_PLANETS.filter(p => p.retrograde)

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float" style={{ color: '#1abc9c', filter: 'drop-shadow(0 0 20px #1abc9c)' }}>
          ◉
        </div>
        <h1 className="section-title">Космос Live</h1>
        <p className="section-subtitle">Реальное положение планет · {time.toLocaleString('ru-RU')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sky map */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="font-serif text-gold/70 mb-6 text-center">Текущее Небо</h2>
          <div className="relative w-full aspect-square max-w-sm mx-auto">
            {/* Zodiac wheel */}
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Outer ring */}
              <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="1" />
              <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(212,175,55,0.05)" strokeWidth="1" />
              <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(212,175,55,0.05)" strokeWidth="1" />

              {/* 12 house lines */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180)
                return (
                  <line
                    key={i}
                    x1={200 + 100 * Math.cos(angle)}
                    y1={200 + 100 * Math.sin(angle)}
                    x2={200 + 190 * Math.cos(angle)}
                    y2={200 + 190 * Math.sin(angle)}
                    stroke="rgba(212,175,55,0.1)"
                    strokeWidth="1"
                  />
                )
              })}

              {/* Planets */}
              {MOCK_PLANETS.map((planet, i) => {
                const angle = ((planet.degree + i * 30) - 90) * (Math.PI / 180)
                const r = 130
                const x = 200 + r * Math.cos(angle)
                const y = 200 + r * Math.sin(angle)
                return (
                  <g key={planet.name}>
                    <circle cx={x} cy={y} r="12" fill={planet.color + '22'} stroke={planet.color} strokeWidth="1" />
                    <text x={x} y={y + 5} textAnchor="middle" fill={planet.color} fontSize="12" fontFamily="serif">
                      {planet.symbol}
                    </text>
                  </g>
                )
              })}

              {/* Center */}
              <circle cx="200" cy="200" r="8" fill="#d4af37" opacity="0.6" />
            </svg>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Moon phase */}
          <div className="glass rounded-2xl p-6 text-center">
            <div className="text-6xl mb-2">{MOON_PHASES[moonPhase]}</div>
            <div className="font-serif text-gold/70">Фаза Луны</div>
            <div className="text-silver/40 text-sm mt-1">
              {['Новолуние', 'Растущий серп', 'Первая четверть', 'Растущая луна',
                'Полнолуние', 'Убывающая луна', 'Последняя четверть', 'Убывающий серп'][moonPhase]}
            </div>
          </div>

          {/* Retrogrades */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-serif text-gold/70 mb-3 text-sm">Ретрограды</h3>
            {retrogrades.length === 0 ? (
              <p className="text-silver/30 text-xs font-serif italic">Нет активных ретроградов</p>
            ) : (
              retrogrades.map(p => (
                <div key={p.name} className="flex items-center gap-2 mb-2">
                  <span style={{ color: p.color }}>{p.symbol}</span>
                  <span className="text-silver/60 text-sm font-serif">{p.name}</span>
                  <span className="ml-auto text-xs px-2 py-0.5 glass rounded-full text-orange-400">℞</span>
                </div>
              ))
            )}
          </div>

          {/* Planetary hours */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-serif text-gold/70 mb-3 text-sm">Планетарный час</h3>
            <div className="text-center">
              <div className="text-3xl mb-1" style={{ color: '#ffd700' }}>☉</div>
              <div className="text-silver/50 text-sm font-serif">Час Солнца</div>
              <div className="text-silver/30 text-xs mt-1">Благоприятно для: успеха, власти, творчества</div>
            </div>
          </div>

          {/* Cosmic weather */}
          <div className="glass rounded-2xl p-5">
            <h3 className="font-serif text-gold/70 mb-3 text-sm">Астрологическая погода</h3>
            <div className="space-y-2">
              {[
                { label: 'Энергия дня', value: 'Активная', color: '#ff6b35' },
                { label: 'Эмоции', value: 'Интенсивные', color: '#a855f7' },
                { label: 'Работа', value: 'Продуктивно', color: '#50c878' },
                { label: 'Отношения', value: 'Гармонично', color: '#e91e63' },
              ].map(w => (
                <div key={w.label} className="flex justify-between items-center">
                  <span className="text-silver/40 text-xs">{w.label}</span>
                  <span className="text-xs font-serif" style={{ color: w.color }}>{w.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Planet table */}
      <div className="mt-8 glass rounded-2xl p-6 overflow-x-auto">
        <h2 className="font-serif text-gold/70 mb-4">Положение Планет</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-silver/30 text-xs uppercase tracking-widest border-b border-white/5">
              <th className="text-left pb-3 font-normal">Планета</th>
              <th className="text-left pb-3 font-normal">Знак</th>
              <th className="text-left pb-3 font-normal">Градус</th>
              <th className="text-left pb-3 font-normal">Статус</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_PLANETS.map(p => (
              <tr key={p.name} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="py-3">
                  <span className="mr-2" style={{ color: p.color }}>{p.symbol}</span>
                  <span className="font-serif text-silver/70">{p.name}</span>
                </td>
                <td className="py-3 text-silver/50 font-serif">{p.sign}</td>
                <td className="py-3 text-silver/50">{p.degree.toFixed(1)}°</td>
                <td className="py-3">
                  {p.retrograde ? (
                    <span className="px-2 py-0.5 glass rounded-full text-xs text-orange-400">℞ Ретроград</span>
                  ) : (
                    <span className="text-silver/20 text-xs">Прямой</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
