import { useNavigate } from 'react-router-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AlgorithmPageTemplate from '../components/algorithms/AlgorithmPageTemplate'
import { runFalsePosition } from '../lib/falsePosition'

export default function FalsePositionPage() {
  const navigate = useNavigate()

  const selector = (
    <Select 
      defaultValue="False-Position Method"
      onValueChange={(val) => {
        if (val === 'Bisection Method') {
          navigate('/algorithms/bisection')
        } else if (val === 'Fixed-Point Iteration') {
          navigate('/algorithms/fixed-point')
        } else if (val === 'Newton-Raphson Method') {
          navigate('/algorithms/newton-raphson')
        }
      }}
    >
      <SelectTrigger className="w-full text-2xl font-bold tracking-tight text-zinc-900 border-none shadow-none bg-transparent hover:bg-zinc-100/50 focus:ring-0 px-0 h-auto py-1 transition-colors">
        <SelectValue placeholder="Algorithm" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        <SelectItem value="Bisection Method" className="font-medium">Bisection Method</SelectItem>
        <SelectItem value="False-Position Method" className="font-medium">False-Position Method</SelectItem>
        <SelectItem value="Fixed-Point Iteration" className="font-medium">Fixed-Point Iteration</SelectItem>
        <SelectItem value="Newton-Raphson Method" className="font-medium">Newton-Raphson Method</SelectItem>
      </SelectContent>
    </Select>
  )

  return (
    <AlgorithmPageTemplate
      methodId="false-position"
      onRun={(params) => runFalsePosition(params.funcStr, params.aStr, params.bStr, params.toleranceStr, params.maxIterationsStr)}
      selector={selector}
    />
  )
}
