import { parse } from 'mathjs'

/**
 * Parses a mathematical string expression and formats it into clean LaTeX for KaTeX.
 * Cleans nested parenthesis artifacts produced by mathjs for fractional exponents and powers.
 */
export function formatToTex(exprStr: string): string {
  if (!exprStr || !exprStr.trim()) return ''
  try {
    const node = parse(exprStr)
    let tex = node.toTex()
    // Normalizes nested fractions in superscripts: ^{\left(\frac{a}{b}\right)} -> ^{\frac{a}{b}}
    tex = tex.replace(/\^{\\left\(\\frac\{([^}]+)\}\{([^}]+)\}\\right\)}/g, '^{\\frac{$1}{$2}}')
    // Normalizes general parenthesized exponents: ^{\left(a\right)} -> ^{a}
    tex = tex.replace(/\^{\\left\(([^)]+)\\right\)}/g, '^{$1}')
    return tex
  } catch {
    return ''
  }
}
