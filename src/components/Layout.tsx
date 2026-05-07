import { type ReactNode, useEffect } from 'react'
import Navigation from './Navigation'
import ParticleCanvas from './ParticleCanvas'
import { ErrorBoundary } from './ui/ErrorBoundary'
import { useStore } from '@/store'
import { THEMES } from '@/lib/constants'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const theme = useStore((s) => s.theme)
  const t = THEMES[theme]

  // Apply theme CSS variables to root
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', t.accent)
    root.style.setProperty('--accent-rgb', t.accentRgb)
    root.style.setProperty('--bg', t.bg)
  }, [t])

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(ellipse at 20% 50%, rgba(26,10,46,0.8) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(10,26,46,0.6) 0%, transparent 50%), ${t.bg}` }}>
      <ParticleCanvas />
      <Navigation />
      <main
        id="main-content"
        className="relative z-10 pt-16 xl:pl-16 min-h-screen"
        role="main"
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  )
}
