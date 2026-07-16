import { parse } from 'mathjs'
import type { Iteration, AlgorithmResult } from './types'

export function runFalsePosition(
  funcStr: string,
  aStr: string | number,
  bStr: string | number,
  toleranceStr: string | number,
  maxIterationsStr: string | number
): AlgorithmResult {
  const startTime = performance.now()

  const a = Number(aStr)
  const b = Number(bStr)
  const tol = Number(toleranceStr)
  const maxIters = Number(maxIterationsStr)

  const emptyResult = (msg: string): AlgorithmResult => ({
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
  let fCurrentB = fb

  let iterations: Iteration[] = []
  let c = currentA
  let oldC = currentA
  let error = Math.abs(currentB - currentA)

  for (let i = 1; i <= maxIters; i++) {
    oldC = c
    
    // Regula Falsi formula
    c = (currentA * fCurrentB - currentB * fCurrentA) / (fCurrentB - fCurrentA)
    const fc = f(c)

    error = i === 1 ? Math.abs(currentB - currentA) : Math.abs(c - oldC)

    iterations.push({
      iteration: i,
      a: currentA,
      b: currentB,
      c,
      fa: fCurrentA,
      fb: fCurrentB,
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
      fCurrentB = fc
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
