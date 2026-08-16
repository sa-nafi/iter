import { useMemo, useState, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import { parse } from 'mathjs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { FixedPointIteration } from '@/lib/types'
import { Play, Pause, RotateCcw, StepForward, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  gFuncStr: string
  x0: number
  iterations: FixedPointIteration[]
  converged: boolean
}

export default function FixedPointPlot({ gFuncStr, x0, iterations, converged }: Props) {
  const total = iterations.length

  const [step, setStep] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(4)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setStep(null)
    setPlaying(false)
  }, [gFuncStr, x0, iterations])

  useEffect(() => {
    if (!playing || total === 0) return
    timerRef.current = setInterval(() => {
      setStep((s) => {
        const next = (s === null ? 0 : s) + 1
        if (next >= total - 1) {
          setPlaying(false)
          return total - 1
        }
        return next
      })
    }, 1000 / speed)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [playing, speed, total])

  const effectiveIdx = step === null ? total - 1 : Math.min(step, total - 1)
  const shownStep = step === null ? total : effectiveIdx + 1

  // 1. Memoize base curves (y = g(x) and y = x) - computed only when parameters or dataset changes
  const baseTraces = useMemo(() => {
    let node
    try {
      node = parse(gFuncStr)
    } catch {
      return []
    }

    // Determine domain from full iteration bounds and x0
    const allX = [x0, ...iterations.flatMap(it => [it.xi, it.gxi])].filter(n => isFinite(n))
    const minVal = allX.length > 0 ? Math.min(...allX) : x0 - 2
    const maxVal = allX.length > 0 ? Math.max(...allX) : x0 + 2
    const span = Math.max(Math.abs(maxVal - minVal), 1.0)
    const margin = span * 0.4

    const minX = minVal - margin
    const maxX = maxVal + margin

    const steps = 250
    const stepSize = (maxX - minX) / steps

    const xVals: number[] = []
    const yVals: (number | null)[] = []

    for (let i = 0; i <= steps; i++) {
      const x = minX + i * stepSize
      xVals.push(x)
      try {
        const y = node.evaluate({ x })
        if (typeof y === 'number' && isFinite(y) && Math.abs(y) < 1e6) {
          yVals.push(y)
        } else {
          yVals.push(null)
        }
      } catch {
        yVals.push(null)
      }
    }

    return [
      // y = g(x) curve
      {
        x: xVals,
        y: yVals,
        type: 'scatter',
        mode: 'lines',
        name: `y = g(x) = ${gFuncStr}`,
        line: { color: '#18181b', width: 2.5 }
      },
      // y = x diagonal reference line (reusing xVals directly)
      {
        x: xVals,
        y: xVals,
        type: 'scatter',
        mode: 'lines',
        name: 'y = x',
        line: { color: '#71717a', width: 1.5, dash: 'dash' }
      }
    ]
  }, [gFuncStr, x0, iterations])

  // 2. Dynamic cobweb and active step markers - fast update per animation tick
  const data = useMemo(() => {
    if (baseTraces.length === 0) return []
    const traces: any[] = [...baseTraces]
    if (total === 0) return traces

    // Build Cobweb (staircase) trajectory
    const cobwebX: number[] = [x0]
    const cobwebY: number[] = [0]

    const activeIterations = iterations.slice(0, effectiveIdx + 1)
    for (let i = 0; i < activeIterations.length; i++) {
      const it = activeIterations[i]
      // Vertical step to curve (xi, g(xi))
      cobwebX.push(it.xi)
      cobwebY.push(it.gxi)
      // Horizontal step to diagonal line y = x (g(xi), g(xi))
      cobwebX.push(it.gxi)
      cobwebY.push(it.gxi)
    }

    traces.push({
      x: cobwebX,
      y: cobwebY,
      type: 'scatter',
      mode: 'lines',
      name: 'Cobweb Path',
      line: { color: '#f59e0b', width: 2 }
    })

    // Past points on g(x)
    if (effectiveIdx > 0) {
      const past = iterations.slice(0, effectiveIdx)
      traces.push({
        x: past.map(it => it.xi),
        y: past.map(it => it.gxi),
        type: 'scatter',
        mode: 'markers',
        name: 'Past Estimates',
        marker: { color: 'rgba(113, 113, 122, 0.4)', size: 6 }
      })
    }

    // Current estimate point
    const currentIt = iterations[effectiveIdx]
    const isFinal = effectiveIdx === total - 1

    traces.push({
      x: [currentIt.xi],
      y: [currentIt.gxi],
      type: 'scatter',
      mode: 'markers',
      name: isFinal && converged ? 'Fixed Point (x*)' : 'Current Step (xᵢ, g(xᵢ))',
      marker: {
        color: isFinal && converged ? '#10b981' : '#3b82f6',
        size: isFinal && converged ? 12 : 8,
        symbol: isFinal && converged ? 'star' : 'circle',
        line: { color: '#ffffff', width: 1.5 }
      }
    })

    return traces
  }, [baseTraces, x0, iterations, effectiveIdx, total, converged])

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Fixed Point Cobweb Plot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-[400px]">
          <Plot
            divId="fixed-point-plot"
            data={data}
            layout={{
              autosize: true,
              margin: { l: 40, r: 20, t: 20, b: 40 },
              xaxis: { title: 'x', zeroline: true, zerolinecolor: '#e4e4e7', gridcolor: '#f4f4f5' },
              yaxis: { title: 'y', zeroline: true, zerolinecolor: '#e4e4e7', gridcolor: '#f4f4f5' },
              plot_bgcolor: 'white',
              paper_bgcolor: 'white',
              showlegend: true,
              legend: { orientation: 'h', y: -0.2 }
            }}
            config={{ responsive: true, scrollZoom: true }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {total > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPlaying(true)} disabled={playing} aria-label="Play animation">
                <Play className="w-4 h-4 mr-1.5" /> Play
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPlaying(false)} disabled={!playing} aria-label="Pause animation">
                <Pause className="w-4 h-4 mr-1.5" /> Pause
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setPlaying(false); setStep(0) }} aria-label="Reset animation">
                <RotateCcw className="w-4 h-4 mr-1.5" /> Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setPlaying(false); setStep((s) => Math.min((s === null ? 0 : s) + 1, total - 1)) }}
                aria-label="Step forward"
              >
                <StepForward className="w-4 h-4 mr-1.5" /> Step
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setPlaying(false); setStep(null) }} aria-label="Skip to end">
                <SkipForward className="w-4 h-4 mr-1.5" /> End
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-zinc-600">
              <label className="flex items-center gap-2">
                Speed
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-24 accent-zinc-900"
                />
              </label>
              <span className="font-medium font-mono min-w-[100px] text-right text-zinc-900">
                Step {shownStep} / {total}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
