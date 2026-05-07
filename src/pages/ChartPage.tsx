import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'
import { calculateChart, PLANET_META, ASPECT_DEFS, type ChartData, type BirthData } from '@/engine/astro'
import { streamChartReport } from '@/engine/ai'
import { resolveLocation } from '@/utils/geo'
import { SIGN_DESCRIPTIONS, HOUSE_MEANINGS, PLANET_IN_SIGN, PLANET_IN_HOUSE } from '@/engine/interpretations'
import type { NatalChart } from '@/types'

const REPORT_SECTIONS = [
  { key: 'portrait',        label: 'Психологический портрет', icon: '✦' },
  { key: 'sun',             label: 'Солнце',                  icon: '☉' },
  { key: 'moon',            label: 'Луна',                    icon: '☽' },
  { key: 'ascendant',       label: 'Асцендент и MC',          icon: 'AC' },
  { key: 'karma',           label: 'Карма и узлы',            icon: '☊' },
  { key: 'relationships',   label: 'Любовь и отношения',      icon: '♡' },
  { key: 'career',          label: 'Карьера и деньги',        icon: '♃' },
  { key: 'aspects',         label: 'Ключевые аспекты',        icon: '△' },
  { key: 'recommendations', label: 'Рекомендации',            icon: '◈' },
]

const CX = 200, CY = 200
const R_ZODIAC_OUT = 188, R_ZODIAC_IN = 162
const R_HOUSE_OUT = 158, R_HOUSE_IN = 110
const R_PLANET = 90

function toRad(deg: number) { return (deg - 90) * Math.PI / 180 }
function px(r: number, deg: number) { return CX + r * Math.cos(toRad(deg)) }
function py(r: number, deg: number) { return CY + r * Math.sin(toRad(deg)) }

const ELEMENT_COLORS: Record<string, string> = {
  'Огонь': '#ff6b35', 'Земля': '#50c878', 'Воздух': '#4a9eff', 'Вода': '#a855f7'
}

export default function ChartPage() {
  const { saveChart, setActiveChart, activeChart } = useStore()
  const [form, setForm] = useState({ name: '', birthDate: '', birthTime: '', birthPlace: '' })
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoResolved, setGeoResolved] = useState('')
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [reportTexts, setReportTexts] = useState<Record<string, string>>({})
  const [reportLoading, setReportLoading] = useState<string | null>(null)
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  const calculate = useCallback(async () => {
    if (!form.birthDate || !form.birthPlace) return
    setLoading(true)
    setError('')
    setChartData(null)
    setReportTexts({})
    setActiveSection(null)

    try {
      setGeoLoading(true)
      const geo = await resolveLocation(form.birthPlace)
      setGeoResolved(geo.displayName)
      setGeoLoading(false)

      const birth: BirthData = {
        date: form.birthDate,
        time: form.birthTime || '12:00',
        place: geo.displayName,
        lat: geo.lat,
        lon: geo.lon,
        utcOffset: geo.utcOffset,
      }

      const data = calculateChart(birth)
      setChartData(data)

      const chart: NatalChart = {
        id: Date.now().toString(),
        name: form.name || 'Моя карта',
        birthDate: form.birthDate,
        birthTime: form.birthTime || '12:00',
        birthPlace: geo.displayName,
        lat: geo.lat,
        lon: geo.lon,
        utcOffset: geo.utcOffset,
        planets: data.planets as any,
        houses: data.houses as any,
        aspects: data.aspects as any,
        ascendant: data.ascendant,
        mc: data.mc,
        dominantElement: data.dominantElement,
        dominantModality: data.dominantModality,
        chartRuler: data.chartRuler,
        stelliums: data.stelliums,
        createdAt: new Date().toISOString(),
      }
      saveChart(chart)
      setActiveChart(chart)

      // Auto-load portrait section
      setTimeout(() => loadSection('portrait', data), 300)
    } catch (e: any) {
      setError('Ошибка расчёта. Проверьте данные и попробуйте снова.')
    } finally {
      setLoading(false)
      setGeoLoading(false)
    }
  }, [form, saveChart, setActiveChart])

  const loadSection = useCallback(async (key: string, data?: ChartData) => {
    const chart = data || chartData
    if (!chart || reportLoading) return
    if (reportTexts[key]) { setActiveSection(key); return }

    setActiveSection(key)
    setReportLoading(key)
    setReportTexts(prev => ({ ...prev, [key]: '' }))

    try {
      for await (const chunk of streamChartReport(chart, key, form.name || 'Вы', form.birthDate)) {
        setReportTexts(prev => ({ ...prev, [key]: (prev[key] || '') + chunk }))
      }
    } finally {
      setReportLoading(null)
    }

    setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }, [chartData, form, reportLoading, reportTexts])

  const planetList = chartData
    ? Object.values(chartData.planets).filter(p => !['MC'].includes(p.key))
    : []

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div className="text-5xl mb-3" animate={{ y: [0,-8,0] }} transition={{ duration: 4, repeat: Infinity }}>☽</motion.div>
        <h1 className="text-4xl md:text-5xl font-serif font-light bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent mb-2">
          Натальная Карта
        </h1>
        <p className="text-silver/50 font-serif italic">Точный расчёт · NASA/JPL точность · AI интерпретация</p>
      </div>

      {/* Form */}
      <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {[
            { key: 'name',       label: 'Имя',              type: 'text',  placeholder: 'Мария' },
            { key: 'birthDate',  label: 'Дата рождения',    type: 'date',  placeholder: '' },
            { key: 'birthTime',  label: 'Время рождения',   type: 'time',  placeholder: '' },
            { key: 'birthPlace', label: 'Место рождения',   type: 'text',  placeholder: 'Москва' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-silver/50 font-serif text-sm mb-1.5">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full glass rounded-xl px-4 py-3 text-silver/80 placeholder-silver/20 font-serif text-sm focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>
          ))}
        </div>

        {geoResolved && (
          <p className="text-emerald/70 text-xs font-serif mb-4">✓ Геолокация: {geoResolved}</p>
        )}
        {error && <p className="text-red-400 text-sm font-serif mb-4">{error}</p>}

        <button
          onClick={calculate}
          disabled={loading || !form.birthDate || !form.birthPlace}
          className="w-full py-4 glass rounded-xl text-gold font-serif tracking-widest uppercase text-sm border border-gold/30 hover:bg-gold/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? (geoLoading ? '◉ Определяю координаты...' : '☽ Вычисляю карту...') : '☽ Построить натальную карту'}
        </button>
      </div>

      {/* Chart Result */}
      <AnimatePresence>
        {chartData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Chart wheel + planet table */}
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="font-serif text-xl text-gold/80 mb-6 text-center">
                {form.name || 'Натальная карта'} · {form.birthDate}
              </h2>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* SVG Wheel */}
                <div className="flex-shrink-0 mx-auto">
                  <svg viewBox="0 0 400 400" className="w-72 h-72 sm:w-80 sm:h-80">
                    {/* Zodiac outer ring */}
                    <circle cx={CX} cy={CY} r={R_ZODIAC_OUT} fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="1"/>
                    <circle cx={CX} cy={CY} r={R_ZODIAC_IN} fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="1"/>
                    <circle cx={CX} cy={CY} r={R_HOUSE_OUT} fill="none" stroke="rgba(212,175,55,0.08)" strokeWidth="1"/>
                    <circle cx={CX} cy={CY} r={R_HOUSE_IN} fill="none" stroke="rgba(212,175,55,0.05)" strokeWidth="1"/>
                    <circle cx={CX} cy={CY} r={50}          fill="none" stroke="rgba(212,175,55,0.05)" strokeWidth="1"/>

                    {/* Zodiac sign sectors */}
                    {Array.from({ length: 12 }).map((_, i) => {
                      const startDeg = i * 30
                      const midDeg = startDeg + 15
                      const signData = Object.values(SIGN_DESCRIPTIONS)[i]
                      const elColor = ELEMENT_COLORS[signData?.element || 'Огонь'] + '22'
                      const x1 = px(R_ZODIAC_IN, startDeg), y1 = py(R_ZODIAC_IN, startDeg)
                      const x2 = px(R_ZODIAC_OUT, startDeg), y2 = py(R_ZODIAC_OUT, startDeg)
                      const mx = px(R_ZODIAC_IN + 14, midDeg), my = py(R_ZODIAC_IN + 14, midDeg)
                      const SIGN_SYMS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']
                      return (
                        <g key={i}>
                          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,175,55,0.2)" strokeWidth="1"/>
                          <text x={mx} y={my+4} textAnchor="middle" fill="rgba(212,175,55,0.6)" fontSize="11" fontFamily="serif">
                            {SIGN_SYMS[i]}
                          </text>
                        </g>
                      )
                    })}

                    {/* House cusps */}
                    {chartData.houses.map((h, i) => {
                      const deg = h.cusp
                      const x1 = px(R_HOUSE_IN, deg), y1 = py(R_HOUSE_IN, deg)
                      const x2 = px(R_HOUSE_OUT, deg), y2 = py(R_HOUSE_OUT, deg)
                      const isAngular = [0,3,6,9].includes(i)
                      const mx = px(R_HOUSE_IN - 14, deg + 15), my = py(R_HOUSE_IN - 14, deg + 15)
                      return (
                        <g key={i}>
                          <line x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke={isAngular ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.08)'}
                            strokeWidth={isAngular ? 1.5 : 1}/>
                          <text x={mx} y={my+3} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7">
                            {i+1}
                          </text>
                        </g>
                      )
                    })}

                    {/* Aspect lines */}
                    {chartData.aspects.filter(a => ['Трин','Секстиль','Квадрат','Оппозиция','Соединение'].includes(a.type)).slice(0, 20).map((asp, i) => {
                      const p1 = chartData.planets[asp.planet1]
                      const p2 = chartData.planets[asp.planet2]
                      if (!p1 || !p2) return null
                      const x1 = px(R_PLANET, p1.longitude), y1 = py(R_PLANET, p1.longitude)
                      const x2 = px(R_PLANET, p2.longitude), y2 = py(R_PLANET, p2.longitude)
                      const opacity = Math.max(0.1, 0.5 - asp.orb * 0.05)
                      return (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke={asp.color} strokeWidth="0.5" opacity={opacity}/>
                      )
                    })}

                    {/* Planets */}
                    {planetList.map((p) => {
                      const x = px(R_PLANET, p.longitude)
                      const y = py(R_PLANET, p.longitude)
                      const isHovered = hoveredPlanet === p.key
                      const isSelected = selectedPlanet === p.key
                      return (
                        <g key={p.key}
                          className="cursor-pointer"
                          onClick={() => setSelectedPlanet(s => s === p.key ? null : p.key)}
                          onMouseEnter={() => setHoveredPlanet(p.key)}
                          onMouseLeave={() => setHoveredPlanet(null)}>
                          <circle cx={x} cy={y} r={isHovered || isSelected ? 11 : 9}
                            fill={p.color + '33'} stroke={p.color}
                            strokeWidth={isSelected ? 2 : 1}
                            style={{ filter: isHovered ? `drop-shadow(0 0 6px ${p.color})` : 'none', transition: 'all 0.2s' }}/>
                          <text x={x} y={y+4} textAnchor="middle" fill={p.color} fontSize="9" fontFamily="serif">
                            {p.symbol}
                          </text>
                          {p.retrograde && (
                            <text x={x+8} y={y-6} fill="#ff9944" fontSize="6">℞</text>
                          )}
                        </g>
                      )
                    })}

                    {/* ASC line */}
                    <line x1={CX} y1={CY} x2={px(R_HOUSE_OUT, chartData.ascendant)} y2={py(R_HOUSE_OUT, chartData.ascendant)}
                      stroke="#d4af37" strokeWidth="1.5" opacity="0.6"/>

                    {/* Center */}
                    <circle cx={CX} cy={CY} r="4" fill="#d4af37" opacity="0.5"/>
                  </svg>
                </div>

                {/* Planet table */}
                <div className="flex-1 w-full overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-silver/30 text-xs uppercase tracking-widest border-b border-white/5">
                        <th className="text-left pb-2 font-normal">Планета</th>
                        <th className="text-left pb-2 font-normal">Знак</th>
                        <th className="text-left pb-2 font-normal hidden sm:table-cell">Дом</th>
                        <th className="text-left pb-2 font-normal">Градус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {planetList.map(p => (
                        <tr key={p.key}
                          className={`border-b border-white/5 cursor-pointer transition-colors ${selectedPlanet === p.key ? 'bg-white/5' : 'hover:bg-white/3'}`}
                          onClick={() => setSelectedPlanet(s => s === p.key ? null : p.key)}>
                          <td className="py-2">
                            <span className="mr-2 text-base" style={{ color: p.color }}>{p.symbol}</span>
                            <span className="font-serif text-silver/70 text-xs">{p.nameRu}</span>
                          </td>
                          <td className="py-2 text-silver/60 font-serif text-xs">{p.signSymbol} {p.sign}</td>
                          <td className="py-2 text-silver/40 text-xs hidden sm:table-cell">{p.house}</td>
                          <td className="py-2 text-silver/40 text-xs">
                            {p.degreeFormatted}
                            {p.retrograde && <span className="ml-1 text-orange-400">℞</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected planet detail */}
              <AnimatePresence>
                {selectedPlanet && chartData.planets[selectedPlanet] && (() => {
                  const p = chartData.planets[selectedPlanet]
                  const signInterp = PLANET_IN_SIGN[selectedPlanet]?.[p.sign]
                  const houseInterp = PLANET_IN_HOUSE[selectedPlanet]?.[p.house]
                  const signDesc = SIGN_DESCRIPTIONS[p.sign]
                  return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-6 glass rounded-xl p-5 border-l-2" style={{ borderColor: p.color }}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl" style={{ color: p.color, filter: `drop-shadow(0 0 8px ${p.color})` }}>{p.symbol}</span>
                        <div>
                          <h3 className="font-serif text-gold/90">{p.nameRu} в {p.sign} {p.degreeFormatted}</h3>
                          <p className="text-silver/40 text-xs">{p.house} дом · {signDesc?.element} · {signDesc?.modality}</p>
                        </div>
                        {p.retrograde && <span className="ml-auto text-orange-400 text-sm font-serif">℞ Ретроград</span>}
                      </div>
                      {signInterp && <p className="text-silver/60 text-sm font-serif leading-relaxed mb-2">{signInterp}</p>}
                      {houseInterp && <p className="text-silver/50 text-sm font-serif leading-relaxed italic">{houseInterp}</p>}
                      {signDesc && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-2 py-0.5 glass rounded-full text-xs" style={{ color: ELEMENT_COLORS[signDesc.element] }}>{signDesc.element}</span>
                          <span className="px-2 py-0.5 glass rounded-full text-xs text-silver/50">{signDesc.modality}</span>
                          <span className="px-2 py-0.5 glass rounded-full text-xs text-silver/50">Управитель: {signDesc.ruler}</span>
                          <span className="px-2 py-0.5 glass rounded-full text-xs text-gold/50 italic">«{signDesc.keyword}»</span>
                        </div>
                      )}
                    </motion.div>
                  )
                })()}
              </AnimatePresence>
            </div>

            {/* Chart stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Стихия', value: chartData.dominantElement, color: ELEMENT_COLORS[chartData.dominantElement] },
                { label: 'Модальность', value: chartData.dominantModality, color: '#d4af37' },
                { label: 'Правитель карты', value: chartData.planets[chartData.chartRuler]?.nameRu || chartData.chartRuler, color: chartData.planets[chartData.chartRuler]?.color || '#d4af37' },
                { label: 'Аспектов', value: String(chartData.aspects.length), color: '#4a9eff' },
              ].map(s => (
                <div key={s.label} className="glass rounded-xl p-4 text-center">
                  <div className="font-serif text-lg mb-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-silver/40 text-xs tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Aspects table */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-serif text-gold/70 mb-4">Аспекты</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {chartData.aspects.slice(0, 16).map((asp, i) => {
                  const p1 = chartData.planets[asp.planet1]
                  const p2 = chartData.planets[asp.planet2]
                  return (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 glass rounded-lg text-xs">
                      <span style={{ color: p1?.color }}>{p1?.symbol}</span>
                      <span style={{ color: asp.color }} className="font-bold">{asp.symbol}</span>
                      <span style={{ color: p2?.color }}>{p2?.symbol}</span>
                      <span className="text-silver/50 font-serif flex-1">{asp.type}</span>
                      <span className="text-silver/30">{asp.orb}°</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* AI Report */}
            <div ref={reportRef} className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl text-gold animate-pulse">◈</span>
                <div>
                  <h3 className="font-serif text-xl text-gold/80">AI Интерпретация</h3>
                  <p className="text-silver/40 text-xs font-serif">Персонализированный анализ на основе вашей карты</p>
                </div>
              </div>

              {/* Section tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {REPORT_SECTIONS.map(s => (
                  <button key={s.key} onClick={() => loadSection(s.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif transition-all ${
                      activeSection === s.key ? 'bg-gold/20 text-gold border border-gold/40' : 'glass text-silver/50 hover:text-gold'
                    }`}>
                    <span>{s.icon}</span>{s.label}
                    {reportLoading === s.key && <span className="animate-pulse">...</span>}
                    {reportTexts[s.key] && reportLoading !== s.key && <span className="text-gold/40">✓</span>}
                  </button>
                ))}
              </div>

              {/* Report content */}
              <AnimatePresence mode="wait">
                {activeSection && (
                  <motion.div key={activeSection} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="glass rounded-xl p-6 min-h-[120px]">
                    {reportLoading === activeSection && !reportTexts[activeSection] ? (
                      <div className="flex items-center gap-3 text-silver/40">
                        <span className="animate-spin text-gold">◈</span>
                        <span className="font-serif italic text-sm">Генерирую интерпретацию...</span>
                      </div>
                    ) : (
                      <div className="text-silver/70 font-serif text-sm leading-relaxed whitespace-pre-wrap">
                        {reportTexts[activeSection]}
                        {reportLoading === activeSection && <span className="animate-pulse text-gold">▋</span>}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
