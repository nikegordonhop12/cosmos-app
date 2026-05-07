import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/store'
import { Link } from 'react-router-dom'

const SECTIONS = [
  { id: 'charts', icon: '☽', label: 'Мои карты' },
  { id: 'forecasts', icon: '◉', label: 'Мои прогнозы' },
  { id: 'compatibility', icon: '♡', label: 'Совместимости' },
  { id: 'ai', icon: '◈', label: 'История AI' },
  { id: 'favorites', icon: '◇', label: 'Избранное' },
  { id: 'dreams', icon: '☁', label: 'Журнал снов' },
  { id: 'settings', icon: '⊕', label: 'Настройки' },
]

export default function CabinetPage() {
  const { charts, activeChart, setActiveChart, deleteChart, aiMessages, dreams, favorites } = useStore()
  const [section, setSection] = useState('charts')

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <h1 className="section-title">Личный Кабинет</h1>
        <p className="section-subtitle">Ваша персональная астрологическая вселенная</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          <nav className="glass rounded-2xl p-3 flex flex-row lg:flex-col gap-1 overflow-x-auto">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all whitespace-nowrap
                  ${section === s.id ? 'bg-gold/15 text-gold' : 'text-silver/50 hover:text-gold hover:bg-white/5'}`}
              >
                <span>{s.icon}</span>
                <span className="font-serif text-sm tracking-wide">{s.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1">
          {section === 'charts' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-gold/80">Мои Карты</h2>
                <Link to="/chart" className="btn-cosmic text-xs px-4 py-2">+ Новая карта</Link>
              </div>
              {charts.length === 0 ? (
                <EmptyState icon="☽" text="Нет сохранённых карт" action={{ label: 'Построить карту', path: '/chart' }} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {charts.map(chart => (
                    <motion.div
                      key={chart.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`card-mystic cursor-pointer ${activeChart?.id === chart.id ? 'border-gold/40 glow-gold' : ''}`}
                      onClick={() => setActiveChart(chart)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-serif text-lg text-gold/90">{chart.name}</h3>
                          <p className="text-silver/40 text-sm mt-1">{chart.birthDate} · {chart.birthPlace}</p>
                          {activeChart?.id === chart.id && (
                            <span className="text-xs text-gold/60 mt-2 inline-block">✦ Активная карта</span>
                          )}
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); deleteChart(chart.id) }}
                          className="text-silver/20 hover:text-red-400 transition-colors text-sm"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {Object.entries(chart.planets || {}).slice(0, 4).map(([planet, pos]) => (
                          <span key={planet} className="px-2 py-0.5 glass rounded-full text-xs text-silver/50">
                            {planet} в {(pos as any).sign}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === 'ai' && (
            <div>
              <h2 className="text-2xl font-serif text-gold/80 mb-6">История AI Диалогов</h2>
              {aiMessages.length === 0 ? (
                <EmptyState icon="◈" text="Нет истории диалогов" action={{ label: 'Спросить AI', path: '/ai' }} />
              ) : (
                <div className="glass rounded-2xl p-6 max-h-[60vh] overflow-y-auto flex flex-col gap-3">
                  {aiMessages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0
                        ${msg.role === 'assistant' ? 'bg-gold/20 text-gold' : 'bg-mystic/30 text-mystic-light'}`}>
                        {msg.role === 'assistant' ? '◈' : '✦'}
                      </div>
                      <div className={`max-w-[80%] px-4 py-2 rounded-xl text-sm font-serif text-silver/70
                        ${msg.role === 'assistant' ? 'glass' : 'bg-mystic/20'}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === 'dreams' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-gold/80">Журнал Снов</h2>
                <Link to="/dreams" className="btn-cosmic text-xs px-4 py-2">+ Записать сон</Link>
              </div>
              {dreams.length === 0 ? (
                <EmptyState icon="☁" text="Журнал снов пуст" action={{ label: 'Записать сон', path: '/dreams' }} />
              ) : (
                <div className="flex flex-col gap-4">
                  {dreams.map(d => (
                    <div key={d.id} className="card-mystic">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gold/60 text-sm font-serif">{d.date}</span>
                      </div>
                      <p className="text-silver/60 text-sm font-serif italic leading-relaxed line-clamp-3">
                        {d.description}
                      </p>
                      {d.analysis && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {d.analysis.archetypes.map(a => (
                            <span key={a} className="px-2 py-0.5 glass rounded-full text-xs text-mystic-light">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === 'settings' && (
            <div>
              <h2 className="text-2xl font-serif text-gold/80 mb-6">Настройки</h2>
              <Link to="/settings" className="btn-cosmic">Открыть настройки</Link>
            </div>
          )}

          {(section === 'forecasts' || section === 'compatibility' || section === 'favorites') && (
            <EmptyState
              icon={SECTIONS.find(s => s.id === section)?.icon || '✦'}
              text={`Раздел «${SECTIONS.find(s => s.id === section)?.label}» в разработке`}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon, text, action }: { icon: string; text: string; action?: { label: string; path: string } }) {
  return (
    <div className="glass rounded-2xl p-16 text-center">
      <div className="text-5xl mb-4 text-gold/20">{icon}</div>
      <p className="text-silver/30 font-serif italic mb-6">{text}</p>
      {action && <Link to={action.path} className="btn-cosmic">{action.label}</Link>}
    </div>
  )
}
