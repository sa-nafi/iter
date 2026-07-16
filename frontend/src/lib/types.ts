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
