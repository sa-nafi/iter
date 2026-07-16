import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Check, X, Info } from 'lucide-react'
import { parse } from 'mathjs'
import 'katex/dist/katex.min.css'
import { BlockMath } from 'react-katex'

export interface BracketMethodParams {
  funcStr: string
  aStr: string
  bStr: string
  toleranceStr: string
  maxIterationsStr: string
}

export interface BracketMethodConfigProps {
  onRun: (params: BracketMethodParams) => void
  error?: string | null
  initialParams?: BracketMethodParams | null
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

export default function BracketMethodConfig({ onRun, error, initialParams }: BracketMethodConfigProps) {
  const initialFuncStr = initialParams?.funcStr ?? 'x^2 - 4'
  const [funcStr, setFuncStr] = useState(initialFuncStr)
  const [aStr, setAStr] = useState(initialParams?.aStr ?? '0')
  const [bStr, setBStr] = useState(initialParams?.bStr ?? '3')
  const [toleranceStr, setToleranceStr] = useState(initialParams?.toleranceStr ?? '0.0001')
  const [maxIterationsStr, setMaxIterationsStr] = useState(initialParams?.maxIterationsStr ?? '100')
  
  const [isValid, setIsValid] = useState<boolean | null>(() => {
    try {
      parse(initialFuncStr)
      return true
    } catch {
      return null
    }
  })
  
  const [texStr, setTexStr] = useState<string>(() => {
    try {
      return parse(initialFuncStr).toTex()
    } catch {
      return ''
    }
  })
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialParams) {
      setFuncStr(initialParams.funcStr)
      setAStr(initialParams.aStr)
      setBStr(initialParams.bStr)
      setToleranceStr(initialParams.toleranceStr)
      setMaxIterationsStr(initialParams.maxIterationsStr)

      try {
        const node = parse(initialParams.funcStr)
        setTexStr(node.toTex())
        setIsValid(true)
      } catch {
        // Fallback to let the debounce handle it if there's an error
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
        const node = parse(funcStr)
        setTexStr(node.toTex())
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
    
    // Focus and move cursor
    requestAnimationFrame(() => {
      el.focus()
      const pos = start + text.length - caretBack
      el.setSelectionRange(pos, pos)
    })
  }

  const handleRun = () => {
    onRun({ funcStr, aStr, bStr, toleranceStr, maxIterationsStr })
  }

  return (
    <Card className="w-full shadow-sm border-zinc-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Input Parameters</CardTitle>
        <CardDescription>Enter the parameters to find the root.</CardDescription>
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
              className={`font-mono h-11 text-base pr-10 ${isValid === false ? 'border-red-500 focus-visible:ring-red-500' : isValid === true ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
              autoComplete="off"
              spellCheck="false"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              {isValid === true && <Check className="w-4 h-4 text-green-500" />}
              {isValid === false && <X className="w-4 h-4 text-red-500" />}
            </div>
          </div>
          
          <div className={`bg-zinc-50 border border-zinc-200/70 rounded-lg p-3 my-2 flex justify-center overflow-x-auto shadow-inner min-h-[84px] items-center transition-opacity duration-200 ${isValid === false ? 'opacity-40 grayscale' : 'text-zinc-800'}`}>
            {texStr ? <BlockMath math={`f(x) = ${texStr}`} /> : <span className="text-zinc-400 text-sm">...</span>}
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
            <Label htmlFor="aStr" className="text-sm font-medium">Lower Bound (xl)</Label>
            <Input 
              id="aStr" 
              type="number"
              value={aStr} 
              onChange={(e) => setAStr(e.target.value)} 
              className="h-11 text-base font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bStr" className="text-sm font-medium">Upper Bound (xu)</Label>
            <Input 
              id="bStr" 
              type="number"
              value={bStr} 
              onChange={(e) => setBStr(e.target.value)} 
              className="h-11 text-base font-mono"
            />
          </div>
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
            <Info className="w-4 h-4" /> Requirements
          </div>
          <ul className="list-disc list-inside space-y-1 ml-1 text-blue-800">
            <li>xl must be less than xu</li>
            <li>f(xl) and f(xu) must have opposite signs</li>
            <li>Tolerance must be {'>'} 0</li>
            <li>Max iterations must be {'>'} 0</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button onClick={handleRun} className="w-full h-11 text-base" disabled={isValid === false}>
          Calculate Root
        </Button>
      </CardFooter>
    </Card>
  )
}
