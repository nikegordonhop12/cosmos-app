import { useEffect, useRef, memo } from 'react'
import { useStore } from '@/store'
import { THEMES } from '@/lib/constants'

interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; alpha: number; color: string; life: number; maxLife: number
}

// Singleton canvas — only one instance ever runs
let instanceCount = 0

const ParticleCanvas = memo(function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useStore((s) => s.theme)
  const accentColor = THEMES[theme].particle

  useEffect(() => {
    instanceCount++
    if (instanceCount > 1) return // guard against double-mount in StrictMode

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d', { alpha: true })!
    let animId: number
    let particles: Particle[] = []
    let visible = true

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const handleVisibility = () => { visible = !document.hidden }
    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('resize', resize, { passive: true })

    const COLORS = [accentColor, '#ffffff', '#a855f7']

    const spawn = () => {
      if (particles.length >= 60) return
      const maxLife = 150 + Math.random() * 150
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.6 + 0.2),
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: maxLife,
        maxLife,
      })
    }

    let frame = 0
    const draw = () => {
      animId = requestAnimationFrame(draw)
      if (!visible) return

      frame++
      if (frame % 3 === 0) spawn() // throttle spawning

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles = particles.filter((p) => p.life > 0)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.life--
        const a = p.alpha * (p.life / p.maxLife)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.round(a * 255).toString(16).padStart(2, '0')
        ctx.fill()
      }
    }
    draw()

    return () => {
      instanceCount--
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [accentColor])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  )
})

export default ParticleCanvas
