import { parse } from 'mathjs'
import type { FixedPointIteration, FixedPointResult } from './types'

export function runFixedPoint(
  gFuncStr: string,
  x0Str: string | number,
  toleranceStr: string | number,
  maxIterationsStr: string | number
): FixedPointResult {
  const startTime = performance.now()

  const x0 = Number(x0Str)
  const tol = Number(toleranceStr)
  const maxIters = Number(maxIterationsStr)

  const emptyResult = (msg: string): FixedPointResult => ({
    root: null,
    iterations: [],
    totalIterations: 0,
    finalError: 0,
    executionTimeMs: performance.now() - startTime,
    success: false,
    message: msg
  })

  if (isNaN(x0) || isNaN(tol) || isNaN(maxIters)) {
    return emptyResult("Invalid numeric input parameters.")
  }

  if (tol <= 0) {
    return emptyResult("Tolerance must be greater than 0.")
  }

  if (maxIters <= 0 || !Number.isInteger(maxIters)) {
    return emptyResult("Max iterations must be a positive integer.")
  }

  let node
  try {
    node = parse(gFuncStr)
  } catch {
    return emptyResult("Invalid function expression for g(x).")
  }

  const g = (x: number): number => {
    try {
      const val = node.evaluate({ x })
      return typeof val === 'number' ? val : Number(val)
    } catch {
      return NaN
    }
  }

  const testVal = g(x0)
  if (isNaN(testVal) || !isFinite(testVal)) {
    return emptyResult("Could not evaluate g(x) at initial guess x₀.")
  }

  let currX = x0
  const iterations: FixedPointIteration[] = []
  let finalError = 0
  let converged = false

  for (let i = 1; i <= maxIters; i++) {
    const nextX = g(currX)

    if (isNaN(nextX) || !isFinite(nextX) || Math.abs(nextX) > 1e14) {
      return {
        root: null,
        iterations,
        totalIterations: iterations.length,
        finalError,
        executionTimeMs: performance.now() - startTime,
        success: false,
        message: "The iteration diverged or encountered an undefined value. Ensure |g'(x)| < 1 near the root."
      }
    }

    const error = Math.abs(nextX - currX)
    finalError = error

    iterations.push({
      iteration: i,
      xi: currX,
      gxi: nextX,
      error
    })

    if (error < tol) {
      currX = nextX
      converged = true
      break
    }

    currX = nextX
  }

  return {
    root: currX,
    iterations,
    totalIterations: iterations.length,
    finalError,
    executionTimeMs: performance.now() - startTime,
    success: converged,
    message: converged 
      ? "Fixed point found within tolerance." 
      : "Maximum iterations reached. The sequence did not converge to the required tolerance."
  }
}
