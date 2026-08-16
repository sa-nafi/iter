import { useNavigate } from 'react-router-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import FixedPointTemplate from '../components/algorithms/FixedPointTemplate'
import { runFixedPoint } from '../lib/fixedPoint'

export default function FixedPointPage() {
  const navigate = useNavigate()

  const selector = (
    <Select
      defaultValue="Fixed-Point Iteration"
      onValueChange={(val) => {
        if (val === 'Bisection Method') {
          navigate('/algorithms/bisection')
        } else if (val === 'False-Position Method') {
          navigate('/algorithms/false-position')
        } else if (val === 'Newton-Raphson Method') {
          navigate('/algorithms/newton-raphson')
        } else if (val === 'Secant Method') {
          navigate('/algorithms/secant')
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
        <SelectItem value="Secant Method" className="font-medium">Secant Method</SelectItem>
      </SelectContent>
    </Select>
  )

  return (
    <FixedPointTemplate
      onRun={(params) => runFixedPoint(params.gFuncStr, params.x0Str, params.toleranceStr, params.maxIterationsStr)}
      selector={selector}
    />
  )
}
