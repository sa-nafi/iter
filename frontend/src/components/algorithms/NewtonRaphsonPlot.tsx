import { useMemo, useState, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import { parse } from 'mathjs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { NewtonRaphsonIteration } from '@/lib/types'
import { Play, Pause, RotateCcw, StepForward, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  funcStr: string
  x0: number
  iterations: NewtonRaphsonIteration[]
  converged: boolean
}

export default function NewtonRaphsonPlot({ funcStr, x0, iterations, converged }: Props) {
  const total = iterations.length

  const [step, setStep] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(4)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setStep(null)
    setPlaying(false)
  }, [funcStr, x0, iterations])

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

  // 1. Memoize base curve y = f(x) and x-axis bounds
  const baseCurve = useMemo(() => {
    let node
    try {
      node = parse(funcStr)
    } catch {
      return { traces: [], yRange: [-10, 10] }
    }

    const allX = [x0, ...iterations.flatMap(it => [it.xi, it.nextXi])].filter(n => isFinite(n))
    const minVal = allX.length > 0 ? Math.min(...allX) : x0 - 2
    const maxVal = allX.length > 0 ? Math.max(...allX) : x0 + 2
    const span = Math.max(Math.abs(maxVal - minVal), 1.0)
    const margin = span * 0.5

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

    const validYs = yVals.filter(v => v !== null && isFinite(v)) as number[]
    const lo = validYs.length > 0 ? Math.min(...validYs) : -10
    const hi = validYs.length > 0 ? Math.max(...validYs) : 10
    const yRange = [lo - (hi - lo) * 0.05, hi + (hi - lo) * 0.05]

    return {
      traces: [
        // y = f(x) function curve
        {
          x: xVals,
          y: yVals,
          type: 'scatter',
          mode: 'lines',
          name: `f(x) = ${funcStr}`,
          line: { color: '#18181b', width: 2.5 }
        }
      ],
      yRange
    }
  }, [funcStr, x0, iterations])

  // 2. Dynamic tangent lines and active step markers
  const data = useMemo(() => {
    if (baseCurve.traces.length === 0) return []
    const traces: any[] = [...baseCurve.traces]
    if (total === 0) return traces

    const it = iterations[effectiveIdx]
    const isFinal = effectiveIdx === total - 1

    // Tangent line connecting (xi, f(xi)) to (x_{i+1}, 0)
    traces.push({
      x: [it.xi, it.nextXi],
      y: [it.fxi, 0],
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Tangent Line',
      line: { color: '#f59e0b', width: 2 },
      marker: { color: '#f59e0b', size: 6 }
    })

    // Vertical projection line from x-intercept (x_{i+1}, 0) to next curve point (x_{i+1}, f(x_{i+1}))
    const nextFxi = effectiveIdx < total - 1 ? iterations[effectiveIdx + 1].fxi : 0
    traces.push({
      x: [it.nextXi, it.nextXi],
      y: [0, nextFxi],
      type: 'scatter',
      mode: 'lines',
      name: 'Next Step Projection',
      line: { color: '#a1a1aa', width: 1.5, dash: 'dash' },
      hoverinfo: 'x'
    })

    // Past estimate markers
    if (effectiveIdx > 0) {
      const past = iterations.slice(0, effectiveIdx)
      traces.push({
        x: past.map(i => i.xi),
        y: past.map(i => i.fxi),
        type: 'scatter',
        mode: 'markers',
        name: 'Past Estimates',
        marker: { color: 'rgba(113, 113, 122, 0.4)', size: 6 }
      })
    }

    // Current estimate or converged root marker
    traces.push({
      x: [it.xi],
      y: [it.fxi],
      type: 'scatter',
      mode: 'markers',
      name: isFinal && converged ? 'Root' : 'Current Step (xᵢ, f(xᵢ))',
      marker: {
        color: isFinal && converged ? '#10b981' : '#3b82f6',
        size: isFinal && converged ? 12 : 8,
        symbol: isFinal && converged ? 'star' : 'circle',
        line: { color: '#ffffff', width: 1.5 }
      }
    })

    return traces
  }, [baseCurve, iterations, effectiveIdx, total, converged])

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Newton-Raphson Tangent Plot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-[400px]">
          <Plot
            divId="newton-raphson-plot"
            data={data}
            layout={{
              autosize: true,
              margin: { l: 40, r: 20, t: 20, b: 40 },
              xaxis: { title: 'x', zeroline: true, zerolinecolor: '#e4e4e7', gridcolor: '#f4f4f5' },
              yaxis: { title: 'f(x)', zeroline: true, zerolinecolor: '#e4e4e7', gridcolor: '#f4f4f5' },
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
