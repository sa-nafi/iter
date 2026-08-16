import { parse, derivative } from 'mathjs'
import type { NewtonRaphsonIteration, NewtonRaphsonResult } from './types'

export function runNewtonRaphson(
  funcStr: string,
  x0Str: string | number,
  toleranceStr: string | number,
  maxIterationsStr: string | number,
  customDerivStr?: string
): NewtonRaphsonResult {
  const startTime = performance.now()

  const x0 = Number(x0Str)
  const tol = Number(toleranceStr)
  const maxIters = Number(maxIterationsStr)

  const emptyResult = (msg: string): NewtonRaphsonResult => ({
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

  let fNode: any
  try {
    fNode = parse(funcStr)
  } catch {
    return emptyResult("Invalid function expression for f(x).")
  }

  let dfNode: any
  if (customDerivStr && customDerivStr.trim()) {
    try {
      dfNode = parse(customDerivStr)
    } catch {
      return emptyResult("Invalid custom derivative expression for f'(x).")
    }
  } else {
    try {
      dfNode = derivative(funcStr, 'x')
    } catch {
      return emptyResult("Could not compute derivative automatically. Please provide f'(x).")
    }
  }

  const f = (x: number): number => {
    try {
      const val = fNode.evaluate({ x })
      return typeof val === 'number' ? val : Number(val)
    } catch {
      return NaN
    }
  }

  const df = (x: number): number => {
    try {
      const val = dfNode.evaluate({ x })
      return typeof val === 'number' ? val : Number(val)
    } catch {
      return NaN
    }
  }

  const testF0 = f(x0)
  const testDF0 = df(x0)
  if (isNaN(testF0) || !isFinite(testF0) || isNaN(testDF0) || !isFinite(testDF0)) {
    return emptyResult("Could not evaluate f(x) or f'(x) at initial guess x₀.")
  }

  let currX = x0
  const iterations: NewtonRaphsonIteration[] = []
  let finalError = 0
  let converged = false

  for (let i = 1; i <= maxIters; i++) {
    const fxi = f(currX)
    const dfxi = df(currX)

    if (isNaN(fxi) || !isFinite(fxi) || isNaN(dfxi) || !isFinite(dfxi)) {
      return {
        root: null,
        iterations,
        totalIterations: iterations.length,
        finalError,
        executionTimeMs: performance.now() - startTime,
        success: false,
        message: `Evaluation encountered an undefined or non-finite value at x = ${currX}.`
      }
    }

    if (Math.abs(dfxi) < 1e-12) {
      return {
        root: null,
        iterations,
        totalIterations: iterations.length,
        finalError,
        executionTimeMs: performance.now() - startTime,
        success: false,
        message: `Zero or near-zero derivative encountered at x = ${currX} (f'(x) ≈ 0). Division by zero prevented.`
      }
    }

    const nextXi = currX - fxi / dfxi

    if (isNaN(nextXi) || !isFinite(nextXi) || Math.abs(nextXi) > 1e14) {
      return {
        root: null,
        iterations,
        totalIterations: iterations.length,
        finalError,
        executionTimeMs: performance.now() - startTime,
        success: false,
        message: "The iteration diverged. Try choosing an initial guess closer to the root."
      }
    }

    const error = Math.abs(nextXi - currX)
    finalError = error

    iterations.push({
      iteration: i,
      xi: currX,
      fxi,
      dfxi,
      nextXi,
      error
    })

    if (error < tol || Math.abs(f(nextXi)) < tol) {
      currX = nextXi
      converged = true
      break
    }

    currX = nextXi
  }

  return {
    root: currX,
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
