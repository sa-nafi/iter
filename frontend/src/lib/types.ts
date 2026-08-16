export interface Iteration {
  iteration: number
  a: number
  b: number
  c: number
  fa: number
  fb: number
  fc: number
  error: number
}

export interface AlgorithmResult {
  root: number | null
  iterations: Iteration[]
  totalIterations: number
  finalError: number
  executionTimeMs: number
  success: boolean
  message: string
}

export interface FixedPointIteration {
  iteration: number
  xi: number
  gxi: number
  error: number
}

export interface FixedPointResult {
  root: number | null
  iterations: FixedPointIteration[]
  totalIterations: number
  finalError: number
  executionTimeMs: number
  success: boolean
  message: string
}

export interface NewtonRaphsonIteration {
  iteration: number
  xi: number
  fxi: number
  dfxi: number
  nextXi: number
  error: number
}

export interface NewtonRaphsonResult {
  root: number | null
  iterations: NewtonRaphsonIteration[]
  totalIterations: number
  finalError: number
  executionTimeMs: number
  success: boolean
  message: string
}

export interface SecantIteration {
  iteration: number
  xPrev: number
  xCurr: number
  fPrev: number
  fCurr: number
  xNext: number
  error: number
}

export interface SecantResult {
  root: number | null
  iterations: SecantIteration[]
  totalIterations: number
  finalError: number
  executionTimeMs: number
  success: boolean
  message: string
}
