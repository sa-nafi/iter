import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Check, X, Info } from 'lucide-react'
import { parse } from 'mathjs'
import 'katex/dist/katex.min.css'
import katex from 'katex'
import { formatToTex } from '@/lib/mathUtils'

export interface SecantParams {
  funcStr: string
  x0Str: string
  x1Str: string
  toleranceStr: string
  maxIterationsStr: string
}

export interface SecantConfigProps {
  onRun: (params: SecantParams) => void
  error?: string | null
  initialParams?: SecantParams | null
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

export default function SecantConfig({ onRun, error, initialParams }: SecantConfigProps) {
  const initialFuncStr = initialParams?.funcStr ?? 'x^3 - x - 2'
  const [funcStr, setFuncStr] = useState(initialFuncStr)
  const [x0Str, setX0Str] = useState(initialParams?.x0Str ?? '1')
  const [x1Str, setX1Str] = useState(initialParams?.x1Str ?? '2')
  const [toleranceStr, setToleranceStr] = useState(initialParams?.toleranceStr ?? '0.0001')
  const [maxIterationsStr, setMaxIterationsStr] = useState(initialParams?.maxIterationsStr ?? '50')

  const [isValid, setIsValid] = useState<boolean | null>(() => {
    try {
      parse(initialFuncStr)
      return true
    } catch {
      return null
    }
  })

  const [texStr, setTexStr] = useState<string>(() => formatToTex(initialFuncStr))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialParams) {
      setFuncStr(initialParams.funcStr)
      setX0Str(initialParams.x0Str)
      setX1Str(initialParams.x1Str)
      setToleranceStr(initialParams.toleranceStr)
      setMaxIterationsStr(initialParams.maxIterationsStr)

      const formatted = formatToTex(initialParams.funcStr)
      if (formatted) {
        setTexStr(formatted)
        setIsValid(true)
      }
    }
  }, [initialParams])

  useEffect(() => {
    const t = setTimeout(() => {
      if (!funcStr.trim()) {
        setIsValid(null)
        setTexStr('')
        return
      }
      try {
        parse(funcStr)
        const formatted = formatToTex(funcStr)
        setTexStr(formatted)
        setIsValid(true)
      } catch {
        setIsValid(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [funcStr])

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
    onRun({ funcStr, x0Str, x1Str, toleranceStr, maxIterationsStr })
  }

  return (
    <Card className="w-full shadow-sm border-zinc-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Input Parameters</CardTitle>
        <CardDescription>Configure the function f(x) and initial approximations.</CardDescription>
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
            className={`bg-zinc-50 border border-zinc-200/70 rounded-lg p-3 my-2 flex justify-center items-center overflow-x-auto shadow-inner min-h-[64px] transition-opacity duration-200 ${
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="x0Str" className="text-sm font-medium">Initial Guess 1 (x₀)</Label>
            <Input
              id="x0Str"
              type="number"
              step="any"
              value={x0Str}
              onChange={(e) => setX0Str(e.target.value)}
              placeholder="e.g. 1"
              className="font-mono h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="x1Str" className="text-sm font-medium">Initial Guess 2 (x₁)</Label>
            <Input
              id="x1Str"
              type="number"
              step="any"
              value={x1Str}
              onChange={(e) => setX1Str(e.target.value)}
              placeholder="e.g. 2"
              className="font-mono h-10"
            />
          </div>
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
            Secant Method Guidelines
          </div>
          <ul className="list-disc list-inside space-y-1 text-blue-800/90 pl-1">
            <li>Open method (does not require bracketed signs)</li>
            <li>Superlinear rate of convergence (order ≈ 1.618)</li>
            <li>Secant line connects consecutive points <code className="font-mono bg-blue-100/70 px-1 py-0.5 rounded">(x_{'{i-1}'}, f(x_{'{i-1}'}))</code> and <code className="font-mono bg-blue-100/70 px-1 py-0.5 rounded">(x_i, f(x_i))</code></li>
            <li>Requires <code className="font-mono bg-blue-100/70 px-1 py-0.5 rounded">x₀ ≠ x₁</code> and <code className="font-mono bg-blue-100/70 px-1 py-0.5 rounded">f(x_i) ≠ f(x_{'{i-1}'})</code></li>
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
