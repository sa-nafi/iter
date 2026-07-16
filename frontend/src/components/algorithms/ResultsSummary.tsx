
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Copy, Check } from 'lucide-react'

interface Props {
  root: number | null
  totalIterations: number
  finalError: number
  executionTimeMs: number
}

export default function ResultsSummary({ root, totalIterations, finalError, executionTimeMs }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (root !== null) {
      navigator.clipboard.writeText(root.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="relative group">
        {root !== null && (
          <button 
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Copy root value"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
        <CardContent className="text-center">
          <p className="text-sm text-zinc-500 font-medium mb-1">Estimated Root</p>
          <p className="text-2xl font-bold text-zinc-900">{root !== null ? root.toPrecision(8) : '-'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="text-center">
          <p className="text-sm text-zinc-500 font-medium mb-1">Total Iterations</p>
          <p className="text-2xl font-bold text-zinc-900">{totalIterations}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="text-center">
          <p className="text-sm text-zinc-500 font-medium mb-1">Final Error</p>
          <p className="text-2xl font-bold text-zinc-900">{finalError.toExponential(3)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="text-center">
          <p className="text-sm text-zinc-500 font-medium mb-1">Execution Time</p>
          <p className="text-2xl font-bold text-zinc-900">{executionTimeMs.toFixed(2)} ms</p>
        </CardContent>
      </Card>
    </div>
  )
}
