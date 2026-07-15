
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  root: number | null
  totalIterations: number
  finalError: number
  executionTimeMs: number
}

export default function ResultsSummary({ root, totalIterations, finalError, executionTimeMs }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-zinc-500 font-medium mb-1">Estimated Root</p>
          <p className="text-2xl font-bold text-zinc-900">{root !== null ? root.toPrecision(8) : '-'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-zinc-500 font-medium mb-1">Total Iterations</p>
          <p className="text-2xl font-bold text-zinc-900">{totalIterations}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-zinc-500 font-medium mb-1">Final Error</p>
          <p className="text-2xl font-bold text-zinc-900">{finalError.toExponential(3)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-zinc-500 font-medium mb-1">Execution Time</p>
          <p className="text-2xl font-bold text-zinc-900">{executionTimeMs.toFixed(2)} ms</p>
        </CardContent>
      </Card>
    </div>
  )
}
