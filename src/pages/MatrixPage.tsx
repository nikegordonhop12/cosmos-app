import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { calculateMatrix, ARCANA, type MatrixResult } from '@/engine/matrix'
import { useStore } from '@/store'

const CHAKRA_COLORS = ['#FF0000','#FF7F00','#FFFF00','#00CC44','#4488FF','#6600CC','#9900FF']

export default function MatrixPage() {
  const { saveMatrix } = useStore()
  const [form, setForm] = useState({ name: '', birthDate: '' })
  const [result, setResult] = useState<MatrixResult | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const calculate = () => {
    if (!form.birthDate || !form.name) return
    const r = calculateMatrix(form.birthDate, form.name)
    setResult(r)
    saveMatrix(r)
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <motion.div className="text-5xl mb-3" animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
          ✦
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-serif font-light bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent mb-2">
          Матрица Судьбы
        </h1>
        <p className="text-silver/50 font-serif italic">22 Аркана · Кармические линии · Предназначение</p>
      </div>

      {/* Form */}
      <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-silver/50 font-serif text-sm mb-1.5">Имя</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Мария" className="w-full glass rounded-xl px-4 py-3 text-silver/80 placeholder-silver/20 font-serif text-sm focus:outline-none"/>
          </div>
          <div>
            <label className="block text-silver/50 font-serif text-sm mb-1.5">Дата рождения</label>
            <input type="date" value={form.birthDate} onChange={e => setForm(p => ({ ...p, birthDate: e.target.value }))}
              className="w-full glass rounded-xl px-4 py-3 text-silver/80 font-serif text-sm focus:outline-none"/>
          </div>
        </div>
        <button onClick={calculate} disabled={!form.birthDate || !form.name}
          className="w-full py-4 glass rounded-xl text-gold font-serif tracking-widest uppercase text-sm border border-gold/30 hover:bg-gold/10 transition-all disabled:opacity-30">
          ✦ Рассчитать матрицу судьбы
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Core numbers */}
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="font-serif text-xl text-gold/80 mb-6 text-center">Матрица {result.name}</h2>

              {/* Matrix diamond visualization */}
              <div className="flex justify-center mb-8">
                <svg viewBox="0 0 320 320" className="w-64 h-64 sm:w-72 sm:h-72">
                  {/* Diamond lines */}
                  <line x1="160" y1="20" x2="300" y2="160" stroke="rgba(212,175,55,0.2)" strokeWidth="1"/>
                  <line x1="300" y1="160" x2="160" y2="300" stroke="rgba(212,175,55,0.2)" strokeWidth="1"/>
                  <line x1="160" y1="300" x2="20" y2="160" stroke="rgba(212,175,55,0.2)" strokeWidth="1"/>
                  <line x1="20" y1="160" x2="160" y2="20" stroke="rgba(212,175,55,0.2)" strokeWidth="1"/>
                  <line x1="160" y1="20" x2="160" y2="300" stroke="rgba(212,175,55,0.1)" strokeWidth="1"/>
                  <line x1="20" y1="160" x2="300" y2="160" stroke="rgba(212,175,55,0.1)" strokeWidth="1"/>

                  {/* Core positions */}
                  {[
                    { x: 160, y: 20,  val: result.personalEnergy, label: 'A' },
                    { x: 300, y: 160, val: result.soulEnergy,     label: 'B' },
                    { x: 160, y: 300, val: result.destinyEnergy,  label: 'C' },
                    { x: 20,  y: 160, val: result.lifeTask,       label: 'D' },
                    { x: 160, y: 160, val: result.karmicTail,     label: 'K' },
                  ].map(n => (
                    <g key={n.label}>
                      <circle cx={n.x} cy={n.y} r="22" fill="rgba(212,175,55,0.1)" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5"/>
                      <text x={n.x} y={n.y - 4} textAnchor="middle" fill="#d4af37" fontSize="16" fontFamily="serif" fontWeight="300">{n.val}</text>
                      <text x={n.x} y={n.y + 10} textAnchor="middle" fill="rgba(212,175,55,0.5)" fontSize="8">{ARCANA[n.val]?.name}</text>
                      <text x={n.x} y={n.y + 32} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7">{n.label}</text>
                    </g>
                  ))}

                  {/* Midpoints */}
                  {[
                    { x: 230, y: 90,  val: result.moneyChannel[0] },
                    { x: 230, y: 230, val: result.relationshipLine[1] },
                    { x: 90,  y: 230, val: result.talentLine[0] },
                    { x: 90,  y: 90,  val: result.karmicHead },
                  ].map((n, i) => (
                    <g key={i}>
                      <circle cx={n.x} cy={n.y} r="16" fill="rgba(168,85,247,0.1)" stroke="rgba(168,85,247,0.3)" strokeWidth="1"/>
                      <text x={n.x} y={n.y+5} textAnchor="middle" fill="#a855f7" fontSize="13" fontFamily="serif">{n.val}</text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Core numbers grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Личная энергия', val: result.personalEnergy, desc: 'День рождения', color: '#d4af37' },
                  { label: 'Энергия души',   val: result.soulEnergy,     desc: 'Месяц рождения', color: '#a855f7' },
                  { label: 'Энергия судьбы', val: result.destinyEnergy,  desc: 'Год рождения',   color: '#4a9eff' },
                  { label: 'Задача жизни',   val: result.lifeTask,       desc: 'Сумма A+B+C',    color: '#50c878' },
                ].map(n => (
                  <div key={n.label} className="glass rounded-xl p-4 text-center">
                    <div className="text-3xl font-serif mb-1" style={{ color: n.color }}>{n.val}</div>
                    <div className="text-silver/60 text-xs font-serif mb-1">{n.label}</div>
                    <div className="text-silver/30 text-xs italic">{ARCANA[n.val]?.name}</div>
                    <div className="text-silver/20 text-xs mt-1">{n.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'overview',  label: 'Обзор' },
                { key: 'chakras',   label: 'Чакры' },
                { key: 'money',     label: 'Деньги' },
                { key: 'relations', label: 'Отношения' },
                { key: 'talents',   label: 'Таланты' },
                { key: 'karma',     label: 'Карма' },
              ].map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-serif transition-all ${activeTab === t.key ? 'bg-gold/20 text-gold border border-gold/40' : 'glass text-silver/50 hover:text-gold'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6 sm:p-8">

                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-gold/80 text-lg mb-4">Общий анализ матрицы</h3>
                    {[
                      { label: 'Личная энергия (A)', val: result.personalEnergy },
                      { label: 'Задача жизни (D)',   val: result.lifeTask },
                      { label: 'Кармический хвост',  val: result.karmicTail },
                      { label: 'Кармическая голова', val: result.karmicHead },
                      { label: 'Личный год',         val: result.personalYear },
                    ].map(item => {
                      const arc = ARCANA[item.val]
                      return (
                        <div key={item.label} className="glass rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl font-serif text-gold w-8 text-center">{item.val}</span>
                            <div>
                              <div className="text-silver/60 text-xs">{item.label}</div>
                              <div className="font-serif text-gold/80">{arc?.name} — {arc?.keyword}</div>
                            </div>
                          </div>
                          <p className="text-silver/60 text-sm font-serif leading-relaxed">{arc?.description}</p>
                          <div className="mt-2 flex gap-2">
                            <span className="px-2 py-0.5 glass rounded-full text-xs text-emerald/70">{arc?.energy}</span>
                            <span className="px-2 py-0.5 glass rounded-full text-xs text-red-400/70">Тень: {arc?.shadow}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {activeTab === 'chakras' && (
                  <div>
                    <h3 className="font-serif text-gold/80 text-lg mb-6">Чакровая линия</h3>
                    <div className="space-y-3">
                      {result.chakras.map((chakra, i) => {
                        const arc = ARCANA[chakra.arcana]
                        const energyColors = { blocked: '#ff4444', weak: '#ff9944', balanced: '#50c878', strong: '#4a9eff', overactive: '#a855f7' }
                        const energyLabels = { blocked: 'Заблокирована', weak: 'Слабая', balanced: 'Сбалансирована', strong: 'Сильная', overactive: 'Гиперактивна' }
                        return (
                          <div key={i} className="glass rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: CHAKRA_COLORS[i], boxShadow: `0 0 8px ${CHAKRA_COLORS[i]}` }}/>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-serif text-silver/80">{chakra.name}</span>
                                  <span className="text-xs px-2 py-0.5 glass rounded-full" style={{ color: energyColors[chakra.energy] }}>
                                    {energyLabels[chakra.energy]}
                                  </span>
                                </div>
                                <div className="text-silver/40 text-xs">Аркан {chakra.arcana} — {arc?.name}</div>
                              </div>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                              <motion.div className="h-full rounded-full" style={{ background: CHAKRA_COLORS[i] }}
                                initial={{ width: 0 }} animate={{ width: `${(chakra.arcana / 22) * 100}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}/>
                            </div>
                            <p className="text-silver/50 text-xs font-serif">{arc?.description}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'money' && (
                  <div>
                    <h3 className="font-serif text-gold/80 text-lg mb-4">Канал денег</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {result.moneyChannel.map((arcana, i) => {
                        const arc = ARCANA[arcana]
                        return (
                          <div key={i} className="glass rounded-xl p-4">
                            <div className="text-2xl font-serif text-gold mb-1">{arcana}</div>
                            <div className="font-serif text-silver/70 mb-1">{arc?.name}</div>
                            <div className="text-silver/40 text-xs italic mb-2">{arc?.keyword}</div>
                            <p className="text-silver/50 text-xs leading-relaxed">{arc?.description}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'relations' && (
                  <div>
                    <h3 className="font-serif text-gold/80 text-lg mb-4">Линия отношений</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {result.relationshipLine.map((arcana, i) => {
                        const arc = ARCANA[arcana]
                        return (
                          <div key={i} className="glass rounded-xl p-4">
                            <div className="text-2xl font-serif text-pink-400 mb-1">{arcana}</div>
                            <div className="font-serif text-silver/70 mb-1">{arc?.name}</div>
                            <p className="text-silver/50 text-xs leading-relaxed">{arc?.description}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'talents' && (
                  <div>
                    <h3 className="font-serif text-gold/80 text-lg mb-4">Линия талантов</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {result.talentLine.map((arcana, i) => {
                        const arc = ARCANA[arcana]
                        return (
                          <div key={i} className="glass rounded-xl p-4">
                            <div className="text-2xl font-serif text-emerald mb-1">{arcana}</div>
                            <div className="font-serif text-silver/70 mb-1">{arc?.name}</div>
                            <p className="text-silver/50 text-xs leading-relaxed">{arc?.description}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'karma' && (
                  <div className="space-y-4">
                    <h3 className="font-serif text-gold/80 text-lg mb-4">Кармический анализ</h3>
                    {[
                      { label: 'Кармический хвост (прошлое)', val: result.karmicTail, color: '#ff6b35' },
                      { label: 'Кармическая голова (будущее)', val: result.karmicHead, color: '#50c878' },
                      { label: 'Личный год', val: result.personalYear, color: '#d4af37' },
                    ].map(item => {
                      const arc = ARCANA[item.val]
                      return (
                        <div key={item.label} className="glass rounded-xl p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl font-serif" style={{ color: item.color }}>{item.val}</span>
                            <div>
                              <div className="text-silver/50 text-xs">{item.label}</div>
                              <div className="font-serif text-gold/80">{arc?.name} — {arc?.keyword}</div>
                            </div>
                          </div>
                          <p className="text-silver/60 text-sm font-serif leading-relaxed">{arc?.description}</p>
                          <p className="text-silver/40 text-xs mt-2 italic">Энергия: {arc?.energy}</p>
                        </div>
                      )
                    })}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
