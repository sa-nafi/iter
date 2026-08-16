import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import FixedPointConfig from './FixedPointConfig'
import type { FixedPointParams } from './FixedPointConfig'
import ResultsSummary from './ResultsSummary'
import FixedPointPlot from './FixedPointPlot'
import { FixedPointConvergencePlot, FixedPointErrorPlot } from './FixedPointConvergencePlot'
import FixedPointIterationTable from './FixedPointIterationTable'
import FixedPointExportActions from './FixedPointExportActions'
import Sidebar from '../Sidebar'
import type { ViewType } from '../Sidebar'
import type { FixedPointResult } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, History as HistoryIcon } from 'lucide-react'

export interface FixedPointHistoryItem {
  id: string
  timestamp: number
  methodId: 'fixed-point'
  params: FixedPointParams
  result: FixedPointResult
}

interface Props {
  onRun: (params: FixedPointParams) => FixedPointResult
  selector: React.ReactNode
}

const HISTORY_KEY = 'iter_fixed_point_history'
const PARAMS_KEY = 'iter_fixed_point_params'

export default function FixedPointTemplate({ onRun, selector }: Props) {
  const location = useLocation()

  const [view, setView] = useState<ViewType>('calculator')
  const [params, setParams] = useState<FixedPointParams | null>(() => {
    const saved = localStorage.getItem(PARAMS_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return null
      }
    }
    return null
  })
  const [result, setResult] = useState<FixedPointResult | null>(null)
  const [history, setHistory] = useState<FixedPointHistoryItem[]>(() => {
    const saved = localStorage.getItem(HISTORY_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }
    return []
  })

  // Check location state for a loaded history item
  useEffect(() => {
    if (location.state?.loadItem) {
      const item = location.state.loadItem as FixedPointHistoryItem
      if (item.methodId === 'fixed-point') {
        setParams(item.params)
        setResult(item.result)
        setView('calculator')
      }
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Save history and params to localStorage
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history])

  useEffect(() => {
    if (params) {
      localStorage.setItem(PARAMS_KEY, JSON.stringify(params))
    }
  }, [params])

  const handleRun = (newParams: FixedPointParams) => {
    setParams(newParams)
    const res = onRun(newParams)
    setResult(res)

    if (res.success) {
      setHistory(prev => [
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          methodId: 'fixed-point' as const,
          params: newParams,
          result: res
        },
        ...prev
      ].slice(0, 50))
    }
  }

  const handleLoadHistory = (item: FixedPointHistoryItem) => {
    setParams(item.params)
    setResult(item.result)
    setView('calculator')
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
                    <FixedPointConfig
                      onRun={handleRun}
                      error={result && !result.success ? result.message : null}
                      initialParams={params}
                    />
                  </div>
                </div>

                {/* Right side: Results & Plots */}
                <div className="flex-1 min-w-0">
                  {result && result.success && params ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between h-10">
                        <h2 className="text-xl font-semibold text-zinc-900">Analysis</h2>
                        <FixedPointExportActions result={result} params={params} />
                      </div>

                      <FixedPointPlot
                        gFuncStr={params.gFuncStr}
                        x0={Number(params.x0Str)}
                        iterations={result.iterations}
                        converged={result.success}
                      />

                      <FixedPointIterationTable iterations={result.iterations} />

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
                      <p className="text-zinc-500 text-center max-w-sm">
                        Enter the iteration function g(x) and initial guess on the left to see the fixed-point analysis.
                      </p>
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
                  {result && params && <FixedPointExportActions result={result} params={params} />}
                </div>

                {result && result.success && params ? (
                  <div className="space-y-8">
                    <FixedPointPlot
                      gFuncStr={params.gFuncStr}
                      x0={Number(params.x0Str)}
                      iterations={result.iterations}
                      converged={result.success}
                    />
                    <FixedPointConvergencePlot iterations={result.iterations} />
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
                  {result && params && <FixedPointExportActions result={result} params={params} />}
                </div>

                {result && result.success ? (
                  <div className="space-y-8">
                    <FixedPointIterationTable iterations={result.iterations} />
                    <FixedPointErrorPlot iterations={result.iterations} />
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
                      <div
                        key={item.id}
                        className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:shadow transition-shadow gap-4"
                      >
                        <div>
                          <p className="font-mono text-sm font-medium text-zinc-900">
                            g(x) = {item.params.gFuncStr}
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-600 font-sans">
                              Fixed Point
                            </span>
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            x₀: {item.params.x0Str} • Root: {item.result.root?.toPrecision(6)} • {new Date(item.timestamp).toLocaleTimeString()}
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
