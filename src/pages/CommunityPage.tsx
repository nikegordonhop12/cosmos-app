import { useState } from 'react'
import { motion } from 'framer-motion'

const POSTS = [
  { id: '1', author: 'Астра', avatar: '☽', text: 'Сегодня Луна в Скорпионе — чувствую невероятную глубину эмоций. Кто ещё?', likes: 24, time: '2ч назад', tags: ['Луна', 'Скорпион'] },
  { id: '2', author: 'Космос', avatar: '✦', text: 'Мой Сатурн возврат изменил всё. Поделитесь своим опытом!', likes: 41, time: '5ч назад', tags: ['Сатурн', 'Возврат'] },
  { id: '3', author: 'Мистик', avatar: '◈', text: 'Руна Феху выпала третий день подряд. Знак изобилия или предупреждение?', likes: 18, time: '1д назад', tags: ['Руны', 'Феху'] },
]

export default function CommunityPage() {
  const [newPost, setNewPost] = useState('')

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float" style={{ color: '#1abc9c', filter: 'drop-shadow(0 0 20px #1abc9c)' }}>
          ⊛
        </div>
        <h1 className="section-title">Сообщество</h1>
        <p className="section-subtitle">Делитесь картами, инсайтами и открытиями</p>
      </div>

      {/* New post */}
      <div className="glass rounded-2xl p-6 mb-8">
        <textarea
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="Поделитесь астрологическим инсайтом..."
          rows={3}
          className="w-full glass rounded-xl px-4 py-3 text-silver/70 placeholder-silver/20 font-serif text-sm
                     focus:outline-none resize-none mb-4"
        />
        <div className="flex justify-end">
          <button className="btn-cosmic text-sm px-6 py-2">Опубликовать</button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {POSTS.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-mystic"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                {post.avatar}
              </div>
              <div>
                <div className="font-serif text-sm text-gold/80">{post.author}</div>
                <div className="text-silver/30 text-xs">{post.time}</div>
              </div>
            </div>
            <p className="text-silver/60 font-serif text-sm leading-relaxed mb-3">{post.text}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 glass rounded-full text-xs text-silver/40">#{tag}</span>
                ))}
              </div>
              <button className="flex items-center gap-1.5 text-silver/30 hover:text-gold transition-colors text-sm">
                <span>♡</span>
                <span>{post.likes}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
