import { useState, useEffect } from 'react'
import BisectionConfig from '../components/algorithms/BisectionConfig'
import type { BisectionParams } from '../components/algorithms/BisectionConfig'
import ResultsSummary from '../components/algorithms/ResultsSummary'
import FunctionPlot from '../components/algorithms/FunctionPlot'
import ConvergencePlot from '../components/algorithms/ConvergencePlot'
import ErrorPlot from '../components/algorithms/ErrorPlot'
import IterationTable from '../components/algorithms/IterationTable'
import ExportActions from '../components/algorithms/ExportActions'
import Sidebar from '../components/Sidebar'
import type { ViewType } from '../components/Sidebar'
import { runBisection } from '../lib/bisection'
import type { BisectionResult } from '../lib/bisection'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, History as HistoryIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface HistoryItem {
  id: string
  timestamp: number
  params: BisectionParams
  result: BisectionResult
}

export default function BisectionPage() {
  const [view, setView] = useState<ViewType>('calculator')
  const [params, setParams] = useState<BisectionParams | null>(null)
  const [result, setResult] = useState<BisectionResult | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bisection_history')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse history", e)
      }
    }
  }, [])

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('bisection_history', JSON.stringify(history))
  }, [history])

  const handleRun = (newParams: BisectionParams) => {
    setParams(newParams)
    const res = runBisection(
      newParams.funcStr,
      newParams.aStr,
      newParams.bStr,
      newParams.toleranceStr,
      newParams.maxIterationsStr
    )
    setResult(res)

    // Add to history
    if (res.success) {
      setHistory(prev => [
        {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          params: newParams,
          result: res
        },
        ...prev
      ].slice(0, 50)) // Keep last 50
    }
  }

  const handleLoadHistory = (item: HistoryItem) => {
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
                      <Select defaultValue="Bisection Method">
                        <SelectTrigger className="w-full text-2xl font-bold tracking-tight text-zinc-900 border-none shadow-none bg-transparent hover:bg-zinc-100/50 focus:ring-0 px-0 h-auto py-1 transition-colors">
                          <SelectValue placeholder="Algorithm" />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false} align="start">
                          <SelectItem value="Bisection Method" className="font-medium">Bisection Method</SelectItem>
                          <SelectItem value="False-Position Method" disabled className="font-medium">False-Position Method</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <BisectionConfig
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
                        <ExportActions result={result} params={params} />
                      </div>

                      <FunctionPlot
                        funcStr={params.funcStr}
                        a={Number(params.aStr)}
                        b={Number(params.bStr)}
                        iterations={result.iterations}
                        converged={result.success}
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
                  {result && params && <ExportActions result={result} params={params} />}
                </div>

                {result && result.success && params ? (
                  <div className="space-y-8">
                    <FunctionPlot
                      funcStr={params.funcStr}
                      a={Number(params.aStr)}
                      b={Number(params.bStr)}
                      iterations={result.iterations}
                      converged={result.success}
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
                  {result && params && <ExportActions result={result} params={params} />}
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
                          <p className="font-mono text-sm font-medium text-zinc-900">f(x) = {item.params.funcStr}</p>
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
