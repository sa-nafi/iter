import { useMemo, useState, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import { parse } from 'mathjs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { Iteration } from '@/lib/types'
import { Play, Pause, RotateCcw, StepForward, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  funcStr: string
  a: number
  b: number
  iterations: Iteration[]
  converged: boolean
  method?: 'bisection' | 'false-position'
}

export default function FunctionPlot({ funcStr, a, b, iterations, converged, method = 'bisection' }: Props) {
  const total = iterations.length

  const [step, setStep] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(4)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setStep(null)
    setPlaying(false)
  }, [funcStr, a, b, iterations])

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

  const data = useMemo(() => {
    let node
    try {
      node = parse(funcStr)
    } catch {
      return []
    }
    
    const margin = Math.abs(b - a) * 0.5 || 5
    const minX = a - margin
    const maxX = b + margin
    
    const xVals = []
    const yVals = []
    
    const steps = 200
    const stepSize = (maxX - minX) / steps
    
    for (let i = 0; i <= steps; i++) {
      const x = minX + i * stepSize
      xVals.push(x)
      try {
        yVals.push(node.evaluate({ x }))
      } catch {
        yVals.push(null)
      }
    }
    
    const traces: any[] = [
      {
        x: xVals,
        y: yVals,
        type: 'scatter',
        mode: 'lines',
        name: `f(x) = ${funcStr}`,
        line: { color: '#111111', width: 2 }
      }
    ]

    if (total === 0) return traces

    const it = iterations[effectiveIdx]
    const isFinal = effectiveIdx === total - 1

    const ys = yVals.filter(v => v !== null && isFinite(v)) as number[]
    const lo = Math.min(...ys)
    const hi = Math.max(...ys)
    const yRange = [lo - (hi-lo)*0.05, hi + (hi-lo)*0.05]

    // Current bracket bounds
    traces.push({
      x: [it.a, it.a],
      y: yRange,
      mode: 'lines',
      name: 'Current Bracket',
      line: { color: '#a1a1aa', width: 1, dash: 'dash' },
      hoverinfo: 'x',
      legendgroup: 'bracket'
    })
    traces.push({
      x: [it.b, it.b],
      y: yRange,
      mode: 'lines',
      showlegend: false,
      line: { color: '#a1a1aa', width: 1, dash: 'dash' },
      hoverinfo: 'x',
      legendgroup: 'bracket'
    })

    if (effectiveIdx > 0) {
      const past = iterations.slice(0, effectiveIdx)
      traces.push({
        x: past.map(i => i.c),
        y: past.map(i => i.fc),
        mode: 'markers',
        name: 'Past Estimates',
        marker: { color: 'rgba(113, 113, 122, 0.4)', size: 6 }
      })
    }

    traces.push({
      x: [it.c],
      y: [it.fc],
      mode: 'markers',
      name: isFinal && converged ? 'Root' : 'Current Estimate (c)',
      marker: { 
        color: isFinal && converged ? '#ef4444' : '#3b82f6', 
        size: isFinal && converged ? 12 : 8, 
        symbol: isFinal && converged ? 'star' : 'circle',
        line: { color: '#ffffff', width: 1.5 }
      }
    })
    
    if (method === 'false-position') {
      traces.push({
        x: [it.a, it.b],
        y: [it.fa, it.fb],
        mode: 'lines+markers',
        name: 'Secant Line',
        line: { color: '#f59e0b', width: 2, dash: 'dot' },
        marker: { color: '#f59e0b', size: 6 }
      })
    }
    
    return traces
  }, [funcStr, a, b, iterations, effectiveIdx, total, converged, method])

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Function Plot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-[400px]">
          <Plot
            divId="function-plot"
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
            config={{ responsive: true, displayModeBar: false }}
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
              <Button variant="ghost" size="sm" onClick={() => { setPlaying(false); setStep((s) => Math.min((s === null ? 0 : s) + 1, total - 1)) }} aria-label="Step forward">
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
