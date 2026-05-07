import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, type AIMessage } from '@/store'
import api from '@/utils/api'

const QUICK_QUESTIONS = [
  'Почему мне сложно строить отношения?',
  'Что означает Сатурн в 7 доме?',
  'Почему у меня сложный период?',
  'Какая профессия мне подходит?',
  'Что означает мой кармический хвост?',
  'Расскажи о моих сильных сторонах',
]

export default function AIAssistantPage() {
  const { aiMessages, addAIMessage, clearAIHistory, activeChart } = useStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    addAIMessage(userMsg)
    setInput('')
    setLoading(true)

    try {
      const { data } = await api.post('/api/ai/chat', {
        message: text,
        chart: activeChart,
        history: aiMessages.slice(-10),
      })
      addAIMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      })
    } catch {
      addAIMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Звёзды молчат... Попробуйте позже. ✦',
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3 animate-float">◈</div>
        <h1 className="section-title">AI Астролог</h1>
        <p className="section-subtitle">Мудрый советник, знающий ваши звёзды</p>
        {activeChart && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-sm text-gold/70">
            <span>☽</span> Карта: {activeChart.name}
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 glass rounded-2xl p-6 mb-4 overflow-y-auto min-h-[400px] max-h-[60vh]">
        {aiMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4 text-gold/30">✦</div>
            <p className="text-silver/30 font-serif italic text-lg mb-8">
              Задайте вопрос о своей судьбе, картах или звёздах...
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-left px-4 py-3 glass rounded-xl text-silver/50 text-sm font-serif italic
                             hover:text-gold hover:border-gold/30 transition-all"
                >
                  «{q}»
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {aiMessages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`ai-message flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm
                    ${msg.role === 'assistant' ? 'bg-gold/20 text-gold' : 'bg-mystic/30 text-mystic-light'}`}>
                    {msg.role === 'assistant' ? '◈' : '✦'}
                  </div>
                  <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed font-serif
                    ${msg.role === 'assistant'
                      ? 'glass text-silver/80 rounded-tl-sm'
                      : 'bg-mystic/20 text-silver/70 rounded-tr-sm'
                    }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm">◈</div>
                <div className="glass px-5 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gold/60"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
          placeholder="Задайте вопрос астрологу..."
          className="flex-1 glass rounded-xl px-5 py-3 text-silver/80 placeholder-silver/20
                     font-serif focus:outline-none focus:border-gold/40 text-sm"
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="btn-cosmic px-5 disabled:opacity-30"
        >
          ✦
        </button>
        {aiMessages.length > 0 && (
          <button
            onClick={clearAIHistory}
            className="px-4 py-3 glass rounded-xl text-silver/30 hover:text-gold transition-colors text-sm"
            title="Очистить историю"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
