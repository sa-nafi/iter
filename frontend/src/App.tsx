import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

const BisectionPage = lazy(() => import('./pages/BisectionPage'))
const FalsePositionPage = lazy(() => import('./pages/FalsePositionPage'))

// A simple loading spinner to show while the heavy algorithm page loads
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/50">
      <div className="flex flex-col items-center gap-3 text-zinc-500">
        <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
        <p className="text-sm font-medium">Loading algorithm...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-200">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/algorithms/bisection"
            element={
              <Suspense fallback={<PageLoader />}>
                <BisectionPage />
              </Suspense>
            }
          />
          <Route
            path="/algorithms/false-position"
            element={
              <Suspense fallback={<PageLoader />}>
                <FalsePositionPage />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
