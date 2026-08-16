import { parse } from 'mathjs'
import type { SecantIteration, SecantResult } from './types'

export function runSecant(
  funcStr: string,
  x0Str: string | number,
  x1Str: string | number,
  toleranceStr: string | number,
  maxIterationsStr: string | number
): SecantResult {
  const startTime = performance.now()

  const x0 = Number(x0Str)
  const x1 = Number(x1Str)
  const tol = Number(toleranceStr)
  const maxIters = Number(maxIterationsStr)

  const emptyResult = (msg: string): SecantResult => ({
    root: null,
    iterations: [],
    totalIterations: 0,
    finalError: 0,
    executionTimeMs: performance.now() - startTime,
    success: false,
    message: msg
  })

  if (isNaN(x0) || isNaN(x1) || isNaN(tol) || isNaN(maxIters)) {
    return emptyResult("Invalid numeric input parameters.")
  }

  if (x0 === x1) {
    return emptyResult("Initial guesses x₀ and x₁ must be distinct values.")
  }

  if (tol <= 0) {
    return emptyResult("Tolerance must be greater than 0.")
  }

  if (maxIters <= 0 || !Number.isInteger(maxIters)) {
    return emptyResult("Max iterations must be a positive integer.")
  }

  let fNode: any
  try {
    fNode = parse(funcStr)
  } catch {
    return emptyResult("Invalid function expression for f(x).")
  }

  const f = (x: number): number => {
    try {
      const val = fNode.evaluate({ x })
      return typeof val === 'number' ? val : Number(val)
    } catch {
      return NaN
    }
  }

  let xPrev = x0
  let xCurr = x1
  let fPrev = f(xPrev)
  let fCurr = f(xCurr)

  if (isNaN(fPrev) || !isFinite(fPrev) || isNaN(fCurr) || !isFinite(fCurr)) {
    return emptyResult("Could not evaluate f(x) at initial guesses x₀ and x₁.")
  }

  // Exact root check at initial points
  if (Math.abs(fPrev) < 1e-15) {
    return {
      root: xPrev,
      iterations: [],
      totalIterations: 0,
      finalError: 0,
      executionTimeMs: performance.now() - startTime,
      success: true,
      message: "Initial guess x₀ is an exact root."
    }
  }
  if (Math.abs(fCurr) < 1e-15) {
    return {
      root: xCurr,
      iterations: [],
      totalIterations: 0,
      finalError: 0,
      executionTimeMs: performance.now() - startTime,
      success: true,
      message: "Initial guess x₁ is an exact root."
    }
  }

  const iterations: SecantIteration[] = []
  let finalError = 0
  let converged = false

  for (let i = 1; i <= maxIters; i++) {
    const fDiff = fCurr - fPrev

    if (Math.abs(fDiff) < 1e-14) {
      return {
        root: null,
        iterations,
        totalIterations: iterations.length,
        finalError,
        executionTimeMs: performance.now() - startTime,
        success: false,
        message: `Zero or near-zero slope encountered: f(x_${i}) - f(x_${i - 1}) ≈ 0. Division by zero prevented.`
      }
    }

    const xNext = xCurr - (fCurr * (xCurr - xPrev)) / fDiff

    if (isNaN(xNext) || !isFinite(xNext) || Math.abs(xNext) > 1e14) {
      return {
        root: null,
        iterations,
        totalIterations: iterations.length,
        finalError,
        executionTimeMs: performance.now() - startTime,
        success: false,
        message: "The iteration diverged. Try choosing initial guesses closer to the root."
      }
    }

    const error = Math.abs(xNext - xCurr)
    finalError = error

    iterations.push({
      iteration: i,
      xPrev,
      xCurr,
      fPrev,
      fCurr,
      xNext,
      error
    })

    const fNext = f(xNext)

    if (error < tol || Math.abs(fNext) < tol) {
      xCurr = xNext
      converged = true
      break
    }

    xPrev = xCurr
    fPrev = fCurr
    xCurr = xNext
    fCurr = fNext
  }

  return {
    root: xCurr,
    iterations,
    totalIterations: iterations.length,
    finalError,
    executionTimeMs: performance.now() - startTime,
    success: converged,
    message: converged
      ? "Root found within tolerance."
      : "Maximum iterations reached. The sequence did not converge to the required tolerance."
  }
}
