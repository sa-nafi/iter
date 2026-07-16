import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BracketMethodConfig from './BracketMethodConfig'
import type { BracketMethodParams } from './BracketMethodConfig'
import ResultsSummary from './ResultsSummary'
import FunctionPlot from './FunctionPlot'
import ConvergencePlot from './ConvergencePlot'
import ErrorPlot from './ErrorPlot'
import IterationTable from './IterationTable'
import ExportActions from './ExportActions'
import Sidebar from '../Sidebar'
import type { ViewType } from '../Sidebar'
import type { AlgorithmResult } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, History as HistoryIcon } from 'lucide-react'

export interface HistoryItem {
  id: string
  timestamp: number
  methodId: string
  params: BracketMethodParams
  result: AlgorithmResult
}

interface Props {
  methodId: 'bisection' | 'false-position'
  onRun: (params: BracketMethodParams) => AlgorithmResult
  selector: React.ReactNode
}

const HISTORY_KEY = 'itera_shared_history'
const PARAMS_KEY = 'itera_shared_params'

export default function AlgorithmPageTemplate({ methodId, onRun, selector }: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  const [view, setView] = useState<ViewType>('calculator')
  const [params, setParams] = useState<BracketMethodParams | null>(() => {
    const saved = localStorage.getItem(PARAMS_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return null
      }
    }
    return null
  })
  const [result, setResult] = useState<AlgorithmResult | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return []
      }
    }
    return []
  })

  // Check location state for a loaded history item
  useEffect(() => {
    if (location.state?.loadItem) {
      const item = location.state.loadItem as HistoryItem
      setParams(item.params)
      setResult(item.result)
      setView('calculator')
      
      // Clear location state so it doesn't reload on subsequent renders
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Save history and params to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history])

  useEffect(() => {
    if (params) {
      localStorage.setItem(PARAMS_KEY, JSON.stringify(params))
    }
  }, [params])

  const handleRun = (newParams: BracketMethodParams) => {
    setParams(newParams)
    const res = onRun(newParams)
    setResult(res)

    // Add to history
    if (res.success) {
      setHistory(prev => [
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          methodId,
          params: newParams,
          result: res
        },
        ...prev
      ].slice(0, 50)) // Keep last 50
    }
  }

  const handleLoadHistory = (item: HistoryItem) => {
    if (item.methodId === methodId) {
      setParams(item.params)
      setResult(item.result)
      setView('calculator')
    } else {
      navigate(`/algorithms/${item.methodId}`, { state: { loadItem: item } })
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50/50 text-zinc-900 font-sans">
      <Sidebar view={view} onNavigate={setView} />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">

          <AnimatePresence mode="wait">
            {view === 'calculator' && (
              <motion.div
                key="calculator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mx-auto flex flex-col xl:flex-row gap-8 pb-12"
              >
                {/* Left side: Config */}
                <div className="w-full xl:w-[400px] flex-shrink-0">
                  <div className="sticky top-0 space-y-6">
                    <div className="flex items-center justify-between h-10">
                      {selector}
                    </div>
                    <BracketMethodConfig
                      onRun={handleRun}
                      error={result && !result.success ? result.message : null}
                      initialParams={params}
                    />
                  </div>
                </div>

                {/* Right side: Everything else */}
                <div className="flex-1 min-w-0">
                  {result && result.success && params ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between h-10">
                        <h2 className="text-xl font-semibold text-zinc-900">Analysis</h2>
                        <ExportActions result={result} params={params} methodId={methodId} />
                      </div>

                      <FunctionPlot
                        funcStr={params.funcStr}
                        a={Number(params.aStr)}
                        b={Number(params.bStr)}
                        iterations={result.iterations}
                        converged={result.success}
                        method={methodId}
                      />

                      <IterationTable iterations={result.iterations} />

                      <ResultsSummary
                        root={result.root}
                        totalIterations={result.totalIterations}
                        finalError={result.finalError}
                        executionTimeMs={result.executionTimeMs}
                      />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-200 rounded-xl bg-white/50 min-h-[400px]">
                      <h2 className="text-xl font-semibold text-zinc-700 mb-2">Ready to Calculate</h2>
                      <p className="text-zinc-500 text-center max-w-sm">Enter the function, bounds, and parameters on the left to see the root finding analysis.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {view === 'graph' && (
              <motion.div
                key="graph"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Graph Analysis</h1>
                  {result && params && <ExportActions result={result} params={params} methodId={methodId} />}
                </div>

                {result && result.success && params ? (
                  <div className="space-y-8">
                    <FunctionPlot
                      funcStr={params.funcStr}
                      a={Number(params.aStr)}
                      b={Number(params.bStr)}
                      iterations={result.iterations}
                      converged={result.success}
                      method={methodId}
                    />
                    <ConvergencePlot iterations={result.iterations} />
                  </div>
                ) : (
                  <div className="p-8 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-white/50">
                    <p className="text-zinc-500">Run a calculation from the Calculator tab first.</p>
                  </div>
                )}
              </motion.div>
            )}

            {view === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Iteration Results</h1>
                  {result && params && <ExportActions result={result} params={params} methodId={methodId} />}
                </div>

                {result && result.success ? (
                  <div className="space-y-8">
                    <IterationTable iterations={result.iterations} />
                    <ErrorPlot iterations={result.iterations} />
                  </div>
                ) : (
                  <div className="p-8 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-white/50">
                    <p className="text-zinc-500">Run a calculation from the Calculator tab first.</p>
                  </div>
                )}
              </motion.div>
            )}

            {view === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-3xl mx-auto"
              >
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Session History</h1>
                  {history.length > 0 && (
                    <button
                      onClick={() => setHistory([])}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear History
                    </button>
                  )}
                </div>

                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div key={item.id} className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:shadow transition-shadow gap-4">
                        <div>
                          <p className="font-mono text-sm font-medium text-zinc-900">
                            f(x) = {item.params.funcStr}
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600 font-sans">
                              {item.methodId === 'bisection' ? 'Bisection' : 'False Position'}
                            </span>
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            [{item.params.aStr}, {item.params.bStr}] • Root: {item.result.root?.toPrecision(6)} • {new Date(item.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleLoadHistory(item)}
                          className="flex items-center justify-center px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                        >
                          <RotateCcw size={14} className="mr-2" />
                          Load
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-white/50">
                    <HistoryIcon size={32} className="mx-auto text-zinc-400 mb-3" />
                    <p className="text-zinc-500">No calculation history yet.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  )
}
