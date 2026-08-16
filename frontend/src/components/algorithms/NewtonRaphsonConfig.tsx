import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Check, X, Info } from 'lucide-react'
import { parse, derivative } from 'mathjs'
import 'katex/dist/katex.min.css'
import katex from 'katex'
import { formatToTex } from '@/lib/mathUtils'

export interface NewtonRaphsonParams {
  funcStr: string
  x0Str: string
  toleranceStr: string
  maxIterationsStr: string
  customDerivStr?: string
}

export interface NewtonRaphsonConfigProps {
  onRun: (params: NewtonRaphsonParams) => void
  error?: string | null
  initialParams?: NewtonRaphsonParams | null
}

const SYMBOLS = [
  ['x', 'x', 0],
  ['xⁿ', '^', 0],
  ['√', 'sqrt()', 1],
  ['π', 'pi', 0],
  ['e', 'e', 0],
  ['sin', 'sin()', 1],
  ['cos', 'cos()', 1],
  ['tan', 'tan()', 1],
  ['log', 'log()', 1],
  ['eˣ', 'exp()', 1],
  ['|x|', 'abs()', 1],
] as const

export default function NewtonRaphsonConfig({ onRun, error, initialParams }: NewtonRaphsonConfigProps) {
  const initialFuncStr = initialParams?.funcStr ?? 'x^3 - x - 2'
  const [funcStr, setFuncStr] = useState(initialFuncStr)
  const [x0Str, setX0Str] = useState(initialParams?.x0Str ?? '1.5')
  const [toleranceStr, setToleranceStr] = useState(initialParams?.toleranceStr ?? '0.0001')
  const [maxIterationsStr, setMaxIterationsStr] = useState(initialParams?.maxIterationsStr ?? '50')
  const [customDerivStr, setCustomDerivStr] = useState(initialParams?.customDerivStr ?? '')

  const [isValid, setIsValid] = useState<boolean | null>(() => {
    try {
      parse(initialFuncStr)
      return true
    } catch {
      return null
    }
  })

  const [texStr, setTexStr] = useState<string>(() => formatToTex(initialFuncStr))
  const [derivTexStr, setDerivTexStr] = useState<string>(() => {
    try {
      const d = derivative(initialFuncStr, 'x')
      return formatToTex(d.toString())
    } catch {
      return ''
    }
  })

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialParams) {
      setFuncStr(initialParams.funcStr)
      setX0Str(initialParams.x0Str)
      setToleranceStr(initialParams.toleranceStr)
      setMaxIterationsStr(initialParams.maxIterationsStr)
      setCustomDerivStr(initialParams.customDerivStr ?? '')

      const formatted = formatToTex(initialParams.funcStr)
      if (formatted) {
        setTexStr(formatted)
        setIsValid(true)
        try {
          const d = initialParams.customDerivStr?.trim() 
            ? parse(initialParams.customDerivStr) 
            : derivative(initialParams.funcStr, 'x')
          setDerivTexStr(formatToTex(d.toString()))
        } catch {
          setDerivTexStr('')
        }
      }
    }
  }, [initialParams])

  useEffect(() => {
    const t = setTimeout(() => {
      if (!funcStr.trim()) {
        setIsValid(null)
        setTexStr('')
        setDerivTexStr('')
        return
      }
      try {
        parse(funcStr)
        const formatted = formatToTex(funcStr)
        setTexStr(formatted)
        setIsValid(true)

        if (customDerivStr.trim()) {
          try {
            parse(customDerivStr)
            setDerivTexStr(formatToTex(customDerivStr))
          } catch {
            setDerivTexStr('')
          }
        } else {
          try {
            const d = derivative(funcStr, 'x')
            setDerivTexStr(formatToTex(d.toString()))
          } catch {
            setDerivTexStr('')
          }
        }
      } catch {
        setIsValid(false)
        setDerivTexStr('')
      }
    }, 300)
    return () => clearTimeout(t)
  }, [funcStr, customDerivStr])

  const insertSymbol = (text: string, caretBack: number) => {
    const el = inputRef.current
    if (!el) return
    const start = el.selectionStart ?? funcStr.length
    const end = el.selectionEnd ?? start
    const newText = funcStr.slice(0, start) + text + funcStr.slice(end)
    setFuncStr(newText)

    requestAnimationFrame(() => {
      el.focus()
      const pos = start + text.length - caretBack
      el.setSelectionRange(pos, pos)
    })
  }

  const handleRun = () => {
    onRun({ funcStr, x0Str, toleranceStr, maxIterationsStr, customDerivStr })
  }

  return (
    <Card className="w-full shadow-sm border-zinc-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Input Parameters</CardTitle>
        <CardDescription>Configure the function f(x) and initial guess.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm font-semibold">Error</AlertTitle>
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Label htmlFor="funcStr" className="text-sm font-medium">Function f(x)</Label>
          <div className="relative">
            <Input
              id="funcStr"
              ref={inputRef}
              value={funcStr}
              onChange={(e) => setFuncStr(e.target.value)}
              placeholder="e.g. x^3 - x - 2"
              className={`font-mono h-11 text-base pr-10 ${
                isValid === false ? 'border-red-500 focus-visible:ring-red-500' : isValid === true ? 'border-green-500 focus-visible:ring-green-500' : ''
              }`}
              autoComplete="off"
              spellCheck="false"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              {isValid === true && <Check className="w-4 h-4 text-green-500" />}
              {isValid === false && <X className="w-4 h-4 text-red-500" />}
            </div>
          </div>

          <div
            className={`bg-zinc-50 border border-zinc-200/70 rounded-lg p-3 my-2 flex flex-col justify-center items-center gap-1 overflow-x-auto shadow-inner min-h-[84px] transition-opacity duration-200 ${
              isValid === false ? 'opacity-40 grayscale' : 'text-zinc-800'
            }`}
          >
            {texStr ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: katex.renderToString(`f(x) = ${texStr}`, {
                    displayMode: true,
                    throwOnError: false
                  })
                }}
              />
            ) : (
              <span className="text-zinc-400 text-sm">...</span>
            )}

            {derivTexStr && (
              <div
                className="text-xs text-zinc-500 mt-1"
                dangerouslySetInnerHTML={{
                  __html: katex.renderToString(`f'(x) = ${derivTexStr}`, {
                    displayMode: false,
                    throwOnError: false
                  })
                }}
              />
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {SYMBOLS.map(([label, text, back]) => (
              <button
                key={label}
                type="button"
                onClick={() => insertSymbol(text, back)}
                className="px-2 py-1 text-xs font-mono font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded transition-colors"
                title={`Insert ${text}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="x0Str" className="text-sm font-medium">Initial Guess (x₀)</Label>
          <Input
            id="x0Str"
            type="number"
            step="any"
            value={x0Str}
            onChange={(e) => setX0Str(e.target.value)}
            placeholder="e.g. 1.5"
            className="font-mono h-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tolerance" className="text-sm font-medium">Tolerance (ε)</Label>
            <Input
              id="tolerance"
              type="number"
              step="any"
              value={toleranceStr}
              onChange={(e) => setToleranceStr(e.target.value)}
              placeholder="0.0001"
              className="font-mono h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxIterations" className="text-sm font-medium">Max Iterations</Label>
            <Input
              id="maxIterations"
              type="number"
              value={maxIterationsStr}
              onChange={(e) => setMaxIterationsStr(e.target.value)}
              placeholder="50"
              className="font-mono h-10"
            />
          </div>
        </div>

        <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-xs text-blue-900 space-y-1.5">
          <div className="font-semibold flex items-center gap-1.5 text-blue-950">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            Newton-Raphson Guidelines
          </div>
          <ul className="list-disc list-inside space-y-1 text-blue-800/90 pl-1">
            <li>Quadratic rate of convergence near simple roots</li>
            <li>Requires <code className="font-mono bg-blue-100/70 px-1 py-0.5 rounded">f'(x) ≠ 0</code> at each step</li>
            <li>Iteration rule: <code className="font-mono bg-blue-100/70 px-1 py-0.5 rounded">x_{'{i+1}'} = x_i - f(x_i)/f'(x_i)</code></li>
            <li>Tolerance & Max Iterations must be &gt; 0</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={handleRun}
          className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          Calculate Root
        </button>
      </CardContent>
    </Card>
  )
}
