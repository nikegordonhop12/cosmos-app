import { motion } from 'framer-motion'

const CHAKRAS = [
  { name: 'Муладхара', sanskrit: 'Mūlādhāra', color: '#FF0000', planet: 'Марс', element: 'Земля', desc: 'Корень, безопасность, выживание', level: 75 },
  { name: 'Свадхистана', sanskrit: 'Svādhiṣṭhāna', color: '#FF7F00', planet: 'Венера', element: 'Вода', desc: 'Творчество, сексуальность, эмоции', level: 60 },
  { name: 'Манипура', sanskrit: 'Maṇipūra', color: '#FFFF00', planet: 'Солнце', element: 'Огонь', desc: 'Сила воли, уверенность, действие', level: 85 },
  { name: 'Анахата', sanskrit: 'Anāhata', color: '#00CC44', planet: 'Венера', element: 'Воздух', desc: 'Любовь, сострадание, связь', level: 50 },
  { name: 'Вишудха', sanskrit: 'Viśuddha', color: '#4488FF', planet: 'Меркурий', element: 'Эфир', desc: 'Коммуникация, самовыражение, истина', level: 70 },
  { name: 'Аджна', sanskrit: 'Ājñā', color: '#6600CC', planet: 'Юпитер', element: 'Свет', desc: 'Интуиция, ясновидение, мудрость', level: 65 },
  { name: 'Сахасрара', sanskrit: 'Sahasrāra', color: '#9900FF', planet: 'Нептун', element: 'Мысль', desc: 'Единство, просветление, связь с Вселенной', level: 45 },
]

export default function ChakraPage() {
  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float" style={{ color: '#9900FF', filter: 'drop-shadow(0 0 20px #9900FF)' }}>
          ◎
        </div>
        <h1 className="section-title">Чакры</h1>
        <p className="section-subtitle">Энергетическая диагностика и баланс</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Chakra wheel */}
        <div className="flex justify-center">
          <div className="relative w-72 h-72">
            {/* Rings */}
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="chakra-ring absolute rounded-full border border-white/5"
                style={{
                  width: 60 + i * 60, height: 60 + i * 60,
                  top: '50%', left: '50%',
                  transform: `translate(-50%, -50%)`,
                }}
              />
            ))}

            {/* Chakra dots on wheel */}
            {CHAKRAS.map((chakra, i) => {
              const angle = (i / CHAKRAS.length) * 360 - 90
              const rad = (angle * Math.PI) / 180
              const r = 110
              const x = 50 + (r / 2.88) * Math.cos(rad)
              const y = 50 + (r / 2.88) * Math.sin(rad)
              return (
                <motion.div
                  key={chakra.name}
                  className="absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                  style={{
                    left: `${x}%`, top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    background: chakra.color + '33',
                    border: `2px solid ${chakra.color}`,
                    boxShadow: `0 0 15px ${chakra.color}66`,
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 10px ${chakra.color}44`,
                      `0 0 25px ${chakra.color}88`,
                      `0 0 10px ${chakra.color}44`,
                    ]
                  }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                  title={chakra.name}
                />
              )
            })}

            {/* Center */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full
                         flex items-center justify-center text-2xl"
              style={{ background: 'radial-gradient(circle, #9900FF44, #FF000022)', border: '1px solid #ffffff22' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              ◎
            </motion.div>
          </div>
        </div>

        {/* Chakra list */}
        <div className="flex flex-col gap-4">
          {CHAKRAS.map((chakra, i) => (
            <motion.div
              key={chakra.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: chakra.color, boxShadow: `0 0 8px ${chakra.color}` }}
                  />
                  <div>
                    <span className="font-serif text-sm" style={{ color: chakra.color }}>{chakra.name}</span>
                    <span className="text-silver/30 text-xs ml-2 italic">{chakra.sanskrit}</span>
                  </div>
                </div>
                <span className="text-silver/40 text-xs">{chakra.planet}</span>
              </div>
              <p className="text-silver/40 text-xs mb-3">{chakra.desc}</p>
              {/* Energy bar */}
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${chakra.color}88, ${chakra.color})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${chakra.level}%` }}
                  transition={{ delay: i * 0.1 + 0.5, duration: 1 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-silver/20 text-xs">Энергия</span>
                <span className="text-xs" style={{ color: chakra.color }}>{chakra.level}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Meditation recommendations */}
      <div className="mt-12 glass rounded-2xl p-8">
        <h2 className="text-2xl font-serif text-gold/80 mb-6 text-center">Рекомендации по медитации</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { chakra: 'Анахата', rec: 'Медитация любящей доброты (Метта). 15 минут утром.', color: '#00CC44' },
            { chakra: 'Сахасрара', rec: 'Медитация на тишину. Наблюдение за мыслями без вовлечения.', color: '#9900FF' },
            { chakra: 'Свадхистана', rec: 'Творческое самовыражение. Рисование, танец, пение.', color: '#FF7F00' },
          ].map(r => (
            <div key={r.chakra} className="glass rounded-xl p-4">
              <div className="font-serif text-sm mb-2" style={{ color: r.color }}>{r.chakra}</div>
              <p className="text-silver/50 text-xs leading-relaxed">{r.rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
