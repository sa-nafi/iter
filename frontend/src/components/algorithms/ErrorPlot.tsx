import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { Iteration } from '@/lib/types'

interface Props {
  iterations: Iteration[]
}

export default function ErrorPlot({ iterations }: Props) {
  const data = useMemo(() => {
    return [
      {
        x: iterations.map(i => i.iteration),
        y: iterations.map(i => i.error),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Error',
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
