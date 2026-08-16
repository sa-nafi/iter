import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Check, X, Info } from 'lucide-react'
import { parse } from 'mathjs'
import 'katex/dist/katex.min.css'
import katex from 'katex'
import { formatToTex } from '@/lib/mathUtils'

export interface FixedPointParams {
  gFuncStr: string
  x0Str: string
  toleranceStr: string
  maxIterationsStr: string
}

export interface FixedPointConfigProps {
  onRun: (params: FixedPointParams) => void
  error?: string | null
  initialParams?: FixedPointParams | null
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

export default function FixedPointConfig({ onRun, error, initialParams }: FixedPointConfigProps) {
  const initialGFuncStr = initialParams?.gFuncStr ?? '(2*x + 3)^(1/3)'
  const [gFuncStr, setGFuncStr] = useState(initialGFuncStr)
  const [x0Str, setX0Str] = useState(initialParams?.x0Str ?? '1.5')
  const [toleranceStr, setToleranceStr] = useState(initialParams?.toleranceStr ?? '0.0001')
  const [maxIterationsStr, setMaxIterationsStr] = useState(initialParams?.maxIterationsStr ?? '50')

  const [isValid, setIsValid] = useState<boolean | null>(() => {
    try {
      parse(initialGFuncStr)
      return true
    } catch {
      return null
    }
  })

  const [texStr, setTexStr] = useState<string>(() => formatToTex(initialGFuncStr))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialParams) {
      setGFuncStr(initialParams.gFuncStr)
      setX0Str(initialParams.x0Str)
      setToleranceStr(initialParams.toleranceStr)
      setMaxIterationsStr(initialParams.maxIterationsStr)

      const formatted = formatToTex(initialParams.gFuncStr)
      if (formatted) {
        setTexStr(formatted)
        setIsValid(true)
      }
    }
  }, [initialParams])

  useEffect(() => {
    const t = setTimeout(() => {
      if (!gFuncStr.trim()) {
        setIsValid(null)
        setTexStr('')
        return
      }
      try {
        parse(gFuncStr)
        const formatted = formatToTex(gFuncStr)
        setTexStr(formatted)
        setIsValid(true)
      } catch {
        setIsValid(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [gFuncStr])

  const insertSymbol = (text: string, caretBack: number) => {
    const el = inputRef.current
    if (!el) return
    const start = el.selectionStart ?? gFuncStr.length
    const end = el.selectionEnd ?? start
    const newText = gFuncStr.slice(0, start) + text + gFuncStr.slice(end)
    setGFuncStr(newText)

    requestAnimationFrame(() => {
      el.focus()
      const pos = start + text.length - caretBack
      el.setSelectionRange(pos, pos)
    })
  }

  const handleRun = () => {
    onRun({ gFuncStr, x0Str, toleranceStr, maxIterationsStr })
  }

  return (
    <Card className="w-full shadow-sm border-zinc-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Input Parameters</CardTitle>
        <CardDescription>Configure the iteration function g(x) and initial guess.</CardDescription>
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
          <Label htmlFor="gFuncStr" className="text-sm font-medium">Iteration Function g(x)</Label>
          <div className="relative">
            <Input
              id="gFuncStr"
              ref={inputRef}
              value={gFuncStr}
              onChange={(e) => setGFuncStr(e.target.value)}
              placeholder="e.g. (2*x + 3)^(1/3) or sqrt(x + 2)"
              className={`font-mono h-11 text-base pr-10 ${
                isValid === false
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : isValid === true
                  ? 'border-green-500 focus-visible:ring-green-500'
                  : ''
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
            className={`bg-zinc-50 border border-zinc-200/70 rounded-lg p-3 my-2 flex justify-center overflow-x-auto shadow-inner min-h-[84px] items-center transition-opacity duration-200 ${
              isValid === false ? 'opacity-40 grayscale' : 'text-zinc-800'
            }`}
          >
            {texStr ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: katex.renderToString(`g(x) = ${texStr}`, {
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

        <div className="space-y-2">
          <Label htmlFor="x0Str" className="text-sm font-medium">Initial Guess (x₀)</Label>
          <Input
            id="x0Str"
            type="number"
            value={x0Str}
            onChange={(e) => setX0Str(e.target.value)}
            step="any"
            className="h-11 text-base font-mono"
            placeholder="1.5"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="toleranceStr" className="text-sm font-medium">Tolerance (ε)</Label>
            <Input
              id="toleranceStr"
              type="number"
              value={toleranceStr}
              onChange={(e) => setToleranceStr(e.target.value)}
              step="0.0001"
              className="h-11 text-base font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxIterationsStr" className="text-sm font-medium">Max Iterations</Label>
            <Input
              id="maxIterationsStr"
              type="number"
              value={maxIterationsStr}
              onChange={(e) => setMaxIterationsStr(e.target.value)}
              className="h-11 text-base font-mono"
            />
          </div>
        </div>

        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-sm text-blue-900 space-y-2">
          <div className="flex items-center gap-2 font-medium">
            <Info className="w-4 h-4" /> Fixed-Point Guidelines
          </div>
          <ul className="list-disc list-inside space-y-1 ml-1 text-blue-800 text-xs leading-relaxed">
            <li>Formulate equation as <span className="font-mono">x = g(x)</span></li>
            <li>Convergence requires <span className="font-mono">|g'(x)| &lt; 1</span> near the root</li>
            <li>Iteration rule: <span className="font-mono">x_{'{i+1}'} = g(x_i)</span></li>
            <li>Tolerance & Max Iterations must be &gt; 0</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button onClick={handleRun} className="w-full h-11 text-base" disabled={isValid === false}>
          Calculate Fixed Point
        </Button>
      </CardFooter>
    </Card>
  )
}
