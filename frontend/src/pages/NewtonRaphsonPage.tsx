import { useNavigate } from 'react-router-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import NewtonRaphsonTemplate from '../components/algorithms/NewtonRaphsonTemplate'
import { runNewtonRaphson } from '../lib/newtonRaphson'

export default function NewtonRaphsonPage() {
  const navigate = useNavigate()

  const selector = (
    <Select
      defaultValue="Newton-Raphson Method"
      onValueChange={(val) => {
        if (val === 'Bisection Method') {
          navigate('/algorithms/bisection')
        } else if (val === 'False-Position Method') {
          navigate('/algorithms/false-position')
        } else if (val === 'Fixed-Point Iteration') {
          navigate('/algorithms/fixed-point')
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
    <NewtonRaphsonTemplate
      onRun={(params) =>
        runNewtonRaphson(
          params.funcStr,
          params.x0Str,
          params.toleranceStr,
          params.maxIterationsStr,
          params.customDerivStr
        )
      }
      selector={selector}
    />
  )
}
