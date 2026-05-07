import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '@/utils/api'
import { useStore, type NatalChart } from '@/store'

const PLANETS_LIST = ['Солнце', 'Луна', 'Меркурий', 'Венера', 'Марс', 'Юпитер', 'Сатурн', 'Уран', 'Нептун', 'Плутон']
const SIGNS = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы']
const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

export default function ChartPage() {
  const { saveChart, setActiveChart } = useStore()
  const [form, setForm] = useState({ name: '', birthDate: '', birthTime: '', birthPlace: '' })
  const [chart, setChart] = useState<NatalChart | null>(null)
  const [loading, setLoading] = useState(false)

  const calculate = async () => {
    if (!form.birthDate || !form.birthPlace) return
    setLoading(true)
    try {
      const { data } = await api.post('/api/chart/calculate', form)
      const c: NatalChart = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), ...form }
      setChart(c)
      saveChart(c)
      setActiveChart(c)
    } catch {
      // Demo chart
      const demo: NatalChart = {
        id: Date.now().toString(),
        ...form,
        lat: 55.75, lon: 37.62,
        planets: Object.fromEntries(PLANETS_LIST.map((p, i) => [
          p, { sign: SIGNS[i % 12], degree: Math.random() * 30, house: (i % 12) + 1, retrograde: Math.random() > 0.8 }
        ])),
        houses: Array.from({ length: 12 }, (_, i) => i * 30),
        aspects: [],
        createdAt: new Date().toISOString(),
      }
      setChart(demo)
      saveChart(demo)
      setActiveChart(demo)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float">☽</div>
        <h1 className="section-title">Натальная Карта</h1>
        <p className="section-subtitle">Точный расчёт планет, домов и аспектов</p>
      </div>

      {/* Form */}
      <div className="glass rounded-2xl p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {[
            { key: 'name', label: 'Имя', placeholder: 'Мария', type: 'text' },
            { key: 'birthDate', label: 'Дата рождения', placeholder: '', type: 'date' },
            { key: 'birthTime', label: 'Время рождения', placeholder: '', type: 'time' },
            { key: 'birthPlace', label: 'Место рождения', placeholder: 'Москва, Россия', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-silver/50 font-serif text-sm mb-2">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full glass rounded-xl px-4 py-3 text-silver/70 placeholder-silver/20 font-serif text-sm focus:outline-none"
              />
            </div>
          ))}
        </div>
        <button onClick={calculate} disabled={loading || !form.birthDate || !form.birthPlace} className="btn-cosmic w-full disabled:opacity-30">
          {loading ? '☽ Вычисляю...' : '☽ Построить карту'}
        </button>
      </div>

      {/* Chart result */}
      {chart && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Wheel */}
          <div className="glass rounded-2xl p-8">
            <h2 className="font-serif text-xl text-gold/80 mb-6 text-center">{chart.name || 'Натальная карта'}</h2>
            <div className="flex justify-center mb-8">
              <svg viewBox="0 0 400 400" className="w-72 h-72">
                {/* Outer zodiac ring */}
                <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="1" />
                <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(212,175,55,0.08)" strokeWidth="1" />
                <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(212,175,55,0.05)" strokeWidth="1" />
                <circle cx="200" cy="200" r="60" fill="none" stroke="rgba(212,175,55,0.05)" strokeWidth="1" />

                {/* 12 sign divisions */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i * 30 - 90) * (Math.PI / 180)
                  const x1 = 200 + 160 * Math.cos(a), y1 = 200 + 160 * Math.sin(a)
                  const x2 = 200 + 190 * Math.cos(a), y2 = 200 + 190 * Math.sin(a)
                  const mx = 200 + 175 * Math.cos((i * 30 + 15 - 90) * Math.PI / 180)
                  const my = 200 + 175 * Math.sin((i * 30 + 15 - 90) * Math.PI / 180)
                  return (
                    <g key={i}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,175,55,0.2)" strokeWidth="1" />
                      <text x={mx} y={my + 4} textAnchor="middle" fill="rgba(212,175,55,0.5)" fontSize="10">
                        {SIGN_SYMBOLS[i]}
                      </text>
                    </g>
                  )
                })}

                {/* House lines */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i * 30 - 90) * (Math.PI / 180)
                  return (
                    <line key={i}
                      x1={200 + 60 * Math.cos(a)} y1={200 + 60 * Math.sin(a)}
                      x2={200 + 160 * Math.cos(a)} y2={200 + 160 * Math.sin(a)}
                      stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                    />
                  )
                })}

                {/* Planets */}
                {Object.entries(chart.planets).map(([name, pos]: [string, any], i) => {
                  const signIdx = SIGNS.indexOf(pos.sign)
                  const totalDeg = signIdx * 30 + pos.degree
                  const a = (totalDeg - 90) * (Math.PI / 180)
                  const r = 100 + (i % 3) * 15
                  const x = 200 + r * Math.cos(a)
                  const y = 200 + r * Math.sin(a)
                  const colors = ['#ffd700','#c0c0c0','#a0a0a0','#ff9999','#ff4444','#d4af37','#b8860b','#4a9eff','#6644ff','#8b0000']
                  return (
                    <g key={name}>
                      <circle cx={x} cy={y} r="8" fill={colors[i] + '33'} stroke={colors[i]} strokeWidth="1" />
                      <text x={x} y={y + 4} textAnchor="middle" fill={colors[i]} fontSize="9">
                        {['☉','☽','☿','♀','♂','♃','♄','♅','♆','♇'][i]}
                      </text>
                    </g>
                  )
                })}

                {/* Center */}
                <circle cx="200" cy="200" r="6" fill="#d4af37" opacity="0.4" />
              </svg>
            </div>

            {/* Planet table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-silver/30 text-xs uppercase tracking-widest border-b border-white/5">
                    <th className="text-left pb-2 font-normal">Планета</th>
                    <th className="text-left pb-2 font-normal">Знак</th>
                    <th className="text-left pb-2 font-normal">Дом</th>
                    <th className="text-left pb-2 font-normal">Градус</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(chart.planets).map(([name, pos]: [string, any], i) => (
                    <tr key={name} className="border-b border-white/5">
                      <td className="py-2 font-serif text-silver/70">{name}</td>
                      <td className="py-2 text-silver/50">{SIGN_SYMBOLS[SIGNS.indexOf(pos.sign)]} {pos.sign}</td>
                      <td className="py-2 text-silver/40">{pos.house}</td>
                      <td className="py-2 text-silver/40">
                        {pos.degree.toFixed(1)}°
                        {pos.retrograde && <span className="ml-1 text-orange-400 text-xs">℞</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
