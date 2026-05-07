import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store'
import { askAI } from '@/engine/ai'
import type { AIMessage } from '@/types'

const QUICK = [
  'Почему мне сложно строить отношения?',
  'Что означает Сатурн в моей карте?',
  'Какая профессия мне подходит?',
  'Что означает мой кармический хвост?',
  'Расскажи о моих сильных сторонах',
  'Когда важный период в моей жизни?',
]

export default function AIAssistantPage() {
  const { aiMessages, addAIMessage, clearAIHistory, activeChart, user } = useStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: AIMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date().toISOString() }
    addAIMessage(userMsg)
    setInput('')
    setLoading(true)
    try {
      const response = await askAI(
        text,
        activeChart as any,
        aiMessages.slice(-8).map(m => ({ role: m.role, content: m.content })),
        activeChart?.name || user?.name || 'Вы',
        activeChart?.birthDate || ''
      )
      addAIMessage({ id: (Date.now()+1).toString(), role: 'assistant', content: response, timestamp: new Date().toISOString() })
    } catch {
      addAIMessage({ id: (Date.now()+1).toString(), role: 'assistant', content: 'Звёзды молчат... Попробуйте позже. ✦', timestamp: new Date().toISOString() })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-6">
        <motion.div className="text-5xl mb-3" animate={{ y: [0,-8,0] }} transition={{ duration: 4, repeat: Infinity }}>◈</motion.div>
        <h1 className="text-4xl font-serif font-light bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent mb-1">AI Астролог</h1>
        <p className="text-silver/40 font-serif italic text-sm">Мудрый советник, знающий ваши звёзды</p>
        {activeChart && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 glass rounded-full text-xs text-gold/60">
            <span>☽</span> Карта: {activeChart.name} · {activeChart.birthDate}
          </div>
        )}
      </div>

      <div className="flex-1 glass rounded-2xl p-4 sm:p-6 mb-4 overflow-y-auto min-h-[400px] max-h-[55vh]">
        {aiMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4 text-gold/20">✦</div>
            <p className="text-silver/30 font-serif italic mb-6 text-sm">Задайте вопрос о своей судьбе...</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {QUICK.map(q => (
                <button key={q} onClick={() => send(q)}
                  className="text-left px-3 py-2 glass rounded-xl text-silver/40 text-xs font-serif italic hover:text-gold hover:border-gold/20 transition-all">
                  «{q}»
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {aiMessages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${msg.role === 'assistant' ? 'bg-gold/20 text-gold' : 'bg-mystic/30 text-mystic-light'}`}>
                    {msg.role === 'assistant' ? '◈' : '✦'}
                  </div>
                  <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm font-serif leading-relaxed whitespace-pre-wrap ${msg.role === 'assistant' ? 'glass text-silver/75 rounded-tl-sm' : 'bg-mystic/20 text-silver/65 rounded-tr-sm'}`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs">◈</div>
                <div className="glass px-4 py-2.5 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                  {[0,1,2].map(i => (
                    <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-gold/50"
                      animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i*0.2 }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
          placeholder="Задайте вопрос астрологу..."
          className="flex-1 glass rounded-xl px-4 py-3 text-silver/80 placeholder-silver/20 font-serif text-sm focus:outline-none focus:border-gold/30"/>
        <button onClick={() => send(input)} disabled={loading || !input.trim()}
          className="px-5 py-3 glass rounded-xl text-gold border border-gold/30 hover:bg-gold/10 transition-all disabled:opacity-30 font-serif">✦</button>
        {aiMessages.length > 0 && (
          <button onClick={clearAIHistory} className="px-3 py-3 glass rounded-xl text-silver/30 hover:text-gold transition-colors text-sm">✕</button>
        )}
      </div>
    </div>
  )
}
