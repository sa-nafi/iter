import { parse } from 'mathjs'

export interface BisectionIteration {
  iteration: number
  a: number
  b: number
  c: number
  fc: number
  error: number
}

export interface BisectionResult {
  root: number | null
  iterations: BisectionIteration[]
  totalIterations: number
  finalError: number
  executionTimeMs: number
  success: boolean
  message: string
}

export function runBisection(
  funcStr: string,
  aStr: string | number,
  bStr: string | number,
  toleranceStr: string | number,
  maxIterationsStr: string | number
): BisectionResult {
  const startTime = performance.now()

  const a = Number(aStr)
  const b = Number(bStr)
  const tol = Number(toleranceStr)
  const maxIters = Number(maxIterationsStr)

  const emptyResult = (msg: string): BisectionResult => ({
    root: null,
    iterations: [],
    totalIterations: 0,
    finalError: 0,
    executionTimeMs: performance.now() - startTime,
    success: false,
    message: msg
  })

  if (isNaN(a) || isNaN(b) || isNaN(tol) || isNaN(maxIters)) {
    return emptyResult("Invalid numeric input parameters.")
  }

  if (a >= b) {
    return emptyResult("Lower bound 'a' must be less than upper bound 'b'.")
  }

  let node
  try {
    node = parse(funcStr)
  } catch (e) {
    return emptyResult("Invalid function expression.")
  }

  const f = (x: number): number => {
    try {
      return node.evaluate({ x })
    } catch {
      return NaN
    }
  }

  const fa = f(a)
  const fb = f(b)

  if (isNaN(fa) || isNaN(fb)) {
    return emptyResult("Could not evaluate function at bounds.")
  }

  if (Math.sign(fa) === Math.sign(fb)) {
    return emptyResult("f(a) and f(b) must have opposite signs (f(a) * f(b) < 0).")
  }

  if (fa === 0) {
    return {
      root: a,
      iterations: [],
      totalIterations: 0,
      finalError: 0,
      executionTimeMs: performance.now() - startTime,
      success: true,
      message: "Root found exactly at bound a."
    }
  }

  if (fb === 0) {
    return {
      root: b,
      iterations: [],
      totalIterations: 0,
      finalError: 0,
      executionTimeMs: performance.now() - startTime,
      success: true,
      message: "Root found exactly at bound b."
    }
  }

  let currentA = a
  let currentB = b
  let fCurrentA = fa

  let iterations: BisectionIteration[] = []
  let c = currentA
  let error = (currentB - currentA) / 2

  for (let i = 1; i <= maxIters; i++) {
    c = (currentA + currentB) / 2
    const fc = f(c)

    error = (currentB - currentA) / 2

    iterations.push({
      iteration: i,
      a: currentA,
      b: currentB,
      c,
      fc,
      error
    })

    if (fc === 0 || error < tol) {
      break
    }

    if (Math.sign(fCurrentA) === Math.sign(fc)) {
      currentA = c
      fCurrentA = fc
    } else {
      currentB = c
    }
  }

  return {
    root: c,
    iterations,
    totalIterations: iterations.length,
    finalError: error,
    executionTimeMs: performance.now() - startTime,
    success: true,
    message: error < tol || f(c) === 0 ? "Root found within tolerance." : "Maximum iterations reached."
  }
}
