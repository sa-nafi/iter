import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { Iteration } from '@/lib/types'

interface Props {
  iterations: Iteration[]
}

export default function ConvergencePlot({ iterations }: Props) {
  const data = useMemo(() => {
    const xVals = iterations.map(i => i.iteration)
    
    return [
      {
        x: xVals,
        y: iterations.map(i => i.a),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Lower Bound (a)',
        line: { color: '#3b82f6', width: 2 }
      },
      {
        x: xVals,
        y: iterations.map(i => i.b),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Upper Bound (b)',
        line: { color: '#10b981', width: 2 }
      },
      {
        x: xVals,
        y: iterations.map(i => i.c),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Midpoint (c)',
        line: { color: '#ef4444', width: 2, dash: 'dash' }
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
              yaxis: { title: 'x value', gridcolor: '#f4f4f5' },
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
