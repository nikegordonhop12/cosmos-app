import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
          <div className="text-5xl mb-4 text-gold/30">✦</div>
          <h2 className="font-serif text-2xl text-gold/70 mb-2">Что-то пошло не так</h2>
          <p className="text-silver/40 font-serif italic mb-6 text-sm max-w-sm">
            {this.state.error.message}
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            className="px-6 py-2 glass rounded-xl text-gold font-serif text-sm hover:bg-gold/10 transition-all"
          >
            Попробовать снова
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
