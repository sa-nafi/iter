import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { FixedPointIteration } from '@/lib/types'

interface Props {
  iterations: FixedPointIteration[]
}

export function FixedPointConvergencePlot({ iterations }: Props) {
  const data = useMemo(() => {
    const xVals = iterations.map(i => i.iteration)

    return [
      {
        x: xVals,
        y: iterations.map(i => i.xi),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Estimate (xᵢ)',
        line: { color: '#3b82f6', width: 2 }
      },
      {
        x: xVals,
        y: iterations.map(i => i.gxi),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'g(xᵢ)',
        line: { color: '#10b981', width: 2, dash: 'dot' }
      }
    ]
  }, [iterations])

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Convergence Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <Plot
            data={data as any}
            layout={{
              autosize: true,
              margin: { l: 40, r: 20, t: 20, b: 40 },
              xaxis: { title: 'Iteration', gridcolor: '#f4f4f5' },
              yaxis: { title: 'Value', gridcolor: '#f4f4f5' },
              plot_bgcolor: 'white',
              paper_bgcolor: 'white',
              showlegend: true,
              legend: { orientation: 'h', y: -0.2 }
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export function FixedPointErrorPlot({ iterations }: Props) {
  const data = useMemo(() => {
    return [
      {
        x: iterations.map(i => i.iteration),
        y: iterations.map(i => i.error),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Error |xᵢ₊₁ - xᵢ|',
        line: { color: '#f59e0b', width: 2 }
      }
    ]
  }, [iterations])

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Error Convergence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">
          <Plot
            data={data as any}
            layout={{
              autosize: true,
              margin: { l: 40, r: 20, t: 20, b: 40 },
              xaxis: { title: 'Iteration', gridcolor: '#f4f4f5' },
              yaxis: { title: 'Error', type: 'log', gridcolor: '#f4f4f5' },
              plot_bgcolor: 'white',
              paper_bgcolor: 'white',
              showlegend: false
            }}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
