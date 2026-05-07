import { useStore } from '@/store'

export default function SoundToggle() {
  const { soundEnabled, toggleSound } = useStore()

  return (
    <button
      onClick={toggleSound}
      title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
      className="flex items-center gap-1 text-silver/40 hover:text-gold transition-colors"
    >
      {soundEnabled ? (
        <span className="sound-wave flex items-end gap-0.5 h-5">
          {[1,2,3,4,5].map(i => <span key={i} />)}
        </span>
      ) : (
        <span className="text-lg">♪</span>
      )}
    </button>
  )
}
