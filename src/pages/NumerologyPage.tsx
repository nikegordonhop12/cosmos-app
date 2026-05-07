import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '@/utils/api'

interface NumResult {
  lifePath: number
  soulNumber: number
  destinyNumber: number
  maturityNumber: number
  karmicDebt: number[]
  angelNumbers: string[]
  yearlyPersonal: number
  monthlyPersonal: number
  description: Record<string, string>
}

const NUM_MEANINGS: Record<number, string> = {
  1: 'Лидер, первопроходец, независимость',
  2: 'Дипломат, партнёрство, чувствительность',
  3: 'Творчество, общение, радость',
  4: 'Стабильность, труд, порядок',
  5: 'Свобода, перемены, авантюризм',
  6: 'Гармония, ответственность, семья',
  7: 'Мудрость, духовность, анализ',
  8: 'Власть, материальный успех, амбиции',
  9: 'Гуманизм, завершение, мудрость',
  11: 'Мастер-интуит, духовный посланник',
  22: 'Мастер-строитель, великие достижения',
  33: 'Мастер-учитель, высшая любовь',
}

function reduceToSingle(n: number): number {
  if ([11, 22, 33].includes(n)) return n
  while (n > 9) n = String(n).split('').reduce((a, d) => a + +d, 0)
  return n
}

function calcLifePath(date: string): number {
  const digits = date.replace(/\D/g, '').split('').map(Number)
  return reduceToSingle(digits.reduce((a, b) => a + b, 0))
}

function calcNameNumber(name: string): number {
  const PYTHAGOREAN: Record<string, number> = {
    а:1,б:2,в:6,г:3,д:4,е:5,ё:5,ж:2,з:7,и:1,й:1,к:2,л:3,м:4,н:5,о:7,п:8,р:9,с:1,т:2,у:3,ф:8,х:5,ц:6,ч:7,ш:8,щ:9,ъ:1,ы:1,ь:2,э:5,ю:3,я:1,
    a:1,b:2,c:3,d:4,e:5,f:8,g:3,h:5,i:1,j:1,k:2,l:3,m:4,n:5,o:7,p:8,q:1,r:9,s:1,t:2,u:3,v:6,w:6,x:5,y:1,z:7
  }
  const sum = name.toLowerCase().split('').reduce((a, c) => a + (PYTHAGOREAN[c] || 0), 0)
  return reduceToSingle(sum)
}

export default function NumerologyPage() {
  const [form, setForm] = useState({ birthDate: '', fullName: '' })
  const [result, setResult] = useState<NumResult | null>(null)
  const [loading, setLoading] = useState(false)

  const calculate = async () => {
    if (!form.birthDate || !form.fullName) return
    setLoading(true)

    // Local calculation
    const lifePath = calcLifePath(form.birthDate)
    const destinyNumber = calcNameNumber(form.fullName)
    const soulNumber = calcNameNumber(form.fullName.replace(/[^аеёиоуыэюяaeiou]/gi, ''))
    const maturityNumber = reduceToSingle(lifePath + destinyNumber)
    const year = new Date().getFullYear()
    const birthYear = new Date(form.birthDate).getFullYear()
    const yearlyPersonal = reduceToSingle(lifePath + (year - birthYear))
    const monthlyPersonal = reduceToSingle(yearlyPersonal + new Date().getMonth() + 1)

    const local: NumResult = {
      lifePath,
      soulNumber: soulNumber || destinyNumber,
      destinyNumber,
      maturityNumber,
      karmicDebt: [13, 14, 16, 19].filter(n => {
        const raw = form.birthDate.replace(/\D/g, '').split('').reduce((a, b) => a + +b, 0)
        return raw === n
      }),
      angelNumbers: ['111', '222', '333', '444', '555'].filter(() => Math.random() > 0.6),
      yearlyPersonal,
      monthlyPersonal,
      description: {},
    }

    try {
      const { data } = await api.post('/api/numerology/calculate', form)
      setResult({ ...local, description: data.descriptions || {} })
    } catch {
      setResult(local)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float" style={{ color: '#e74c3c', filter: 'drop-shadow(0 0 20px #e74c3c)' }}>
          ∞
        </div>
        <h1 className="section-title">Нумерология</h1>
        <p className="section-subtitle">Числа судьбы, кармический долг, ангельские числа</p>
      </div>

      {/* Form */}
      <div className="glass rounded-2xl p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-silver/50 font-serif text-sm mb-2">Дата рождения</label>
            <input
              type="date"
              value={form.birthDate}
              onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))}
              className="w-full glass rounded-xl px-4 py-3 text-silver/70 font-serif text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-silver/50 font-serif text-sm mb-2">Полное имя</label>
            <input
              type="text"
              value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              placeholder="Иванова Мария Сергеевна"
              className="w-full glass rounded-xl px-4 py-3 text-silver/70 placeholder-silver/20 font-serif text-sm focus:outline-none"
            />
          </div>
        </div>
        <button onClick={calculate} disabled={loading || !form.birthDate || !form.fullName} className="btn-cosmic w-full disabled:opacity-30">
          {loading ? '∞ Вычисляю...' : '∞ Рассчитать нумерологию'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Main numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Жизненный путь', value: result.lifePath, color: '#e74c3c' },
              { label: 'Число судьбы', value: result.destinyNumber, color: '#d4af37' },
              { label: 'Число души', value: result.soulNumber, color: '#a855f7' },
              { label: 'Число зрелости', value: result.maturityNumber, color: '#4a9eff' },
            ].map(n => (
              <motion.div
                key={n.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="glass rounded-2xl p-6 text-center"
                style={{ boxShadow: `0 0 20px ${n.color}22` }}
              >
                <div className="text-5xl font-serif mb-2" style={{ color: n.color, filter: `drop-shadow(0 0 10px ${n.color})` }}>
                  {n.value}
                </div>
                <div className="text-silver/40 text-xs font-serif">{n.label}</div>
                <div className="text-silver/30 text-xs mt-2 leading-tight">{NUM_MEANINGS[n.value]}</div>
              </motion.div>
            ))}
          </div>

          {/* Cycles */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-serif text-lg text-gold/80 mb-4">Текущие Циклы</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl font-serif text-gold mb-1">{result.yearlyPersonal}</div>
                <div className="text-silver/40 text-sm">Личный год</div>
                <div className="text-silver/30 text-xs mt-1">{NUM_MEANINGS[result.yearlyPersonal]}</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-3xl font-serif text-gold mb-1">{result.monthlyPersonal}</div>
                <div className="text-silver/40 text-sm">Личный месяц</div>
                <div className="text-silver/30 text-xs mt-1">{NUM_MEANINGS[result.monthlyPersonal]}</div>
              </div>
            </div>
          </div>

          {/* Karmic debt */}
          {result.karmicDebt.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-red-500/20">
              <h3 className="font-serif text-lg text-red-400/80 mb-3">Кармический Долг</h3>
              <div className="flex gap-3">
                {result.karmicDebt.map(n => (
                  <div key={n} className="px-4 py-2 glass rounded-xl text-red-400 font-serif text-lg">{n}</div>
                ))}
              </div>
            </div>
          )}

          {/* Angel numbers */}
          {result.angelNumbers.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-serif text-lg text-gold/80 mb-3">Ангельские Числа</h3>
              <div className="flex flex-wrap gap-3">
                {result.angelNumbers.map(n => (
                  <span key={n} className="px-4 py-2 glass rounded-full text-gold font-serif text-lg glow-gold">{n}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
