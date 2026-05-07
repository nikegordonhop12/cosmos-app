import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import { CardSkeleton } from '@/components/ui/index'

const HomePage            = lazy(() => import('@/pages/HomePage'))
const ChartPage           = lazy(() => import('@/pages/ChartPage'))
const MatrixPage          = lazy(() => import('@/pages/MatrixPage'))
const AIAssistantPage     = lazy(() => import('@/pages/AIAssistantPage'))
const CabinetPage         = lazy(() => import('@/pages/CabinetPage'))
const TarotPage           = lazy(() => import('@/pages/TarotPage'))
const RunesPage           = lazy(() => import('@/pages/RunesPage'))
const ChakraPage          = lazy(() => import('@/pages/ChakraPage'))
const DreamsPage          = lazy(() => import('@/pages/DreamsPage'))
const NumerologyPage      = lazy(() => import('@/pages/NumerologyPage'))
const RelationshipsPage   = lazy(() => import('@/pages/RelationshipsPage'))
const TimelinePage        = lazy(() => import('@/pages/TimelinePage'))
const CosmicDashboardPage = lazy(() => import('@/pages/CosmicDashboardPage'))
const LearnPage           = lazy(() => import('@/pages/LearnPage'))
const ResearchPage        = lazy(() => import('@/pages/ResearchPage'))
const CommunityPage       = lazy(() => import('@/pages/CommunityPage'))
const SettingsPage        = lazy(() => import('@/pages/SettingsPage'))

function Loader() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-4">
      <CardSkeleton /><CardSkeleton /><CardSkeleton />
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/"              element={<HomePage />} />
          <Route path="/chart"         element={<ChartPage />} />
          <Route path="/matrix"        element={<MatrixPage />} />
          <Route path="/ai"            element={<AIAssistantPage />} />
          <Route path="/cabinet"       element={<CabinetPage />} />
          <Route path="/tarot"         element={<TarotPage />} />
          <Route path="/runes"         element={<RunesPage />} />
          <Route path="/chakra"        element={<ChakraPage />} />
          <Route path="/dreams"        element={<DreamsPage />} />
          <Route path="/numerology"    element={<NumerologyPage />} />
          <Route path="/relationships" element={<RelationshipsPage />} />
          <Route path="/timeline"      element={<TimelinePage />} />
          <Route path="/cosmic"        element={<CosmicDashboardPage />} />
          <Route path="/learn"         element={<LearnPage />} />
          <Route path="/research"      element={<ResearchPage />} />
          <Route path="/community"     element={<CommunityPage />} />
          <Route path="/settings"      element={<SettingsPage />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="text-7xl mb-6 text-gold/20">✦</div>
      <h1 className="font-serif text-4xl text-gold/70 mb-3">404</h1>
      <p className="text-silver/40 font-serif italic mb-8">Эта страница затерялась в космосе</p>
      <a href="/" className="px-6 py-3 glass rounded-xl text-gold font-serif text-sm hover:bg-gold/10 transition-all border border-gold/30">
        Вернуться домой
      </a>
    </div>
  )
}
