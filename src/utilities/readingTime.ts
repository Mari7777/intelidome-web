/**
 * Odhad doby čtení z Lexical obsahu — meta údaj v heru článku (DESIGN.md 8.2).
 * 180 slov za minutu je konzervativní tempo pro odborný text s čísly.
 */
const WORDS_PER_MINUTE = 180

type LexicalNode = {
  text?: unknown
  children?: unknown
  root?: unknown
  [key: string]: unknown
}

const collect = (node: unknown, depth = 0): string => {
  if (depth > 12 || node == null) return ''
  if (Array.isArray(node)) return node.map((child) => collect(child, depth + 1)).join(' ')
  if (typeof node !== 'object') return ''

  const candidate = node as LexicalNode
  let out = typeof candidate.text === 'string' ? candidate.text : ''

  if (candidate.root) out += ' ' + collect(candidate.root, depth + 1)
  if (candidate.children) out += ' ' + collect(candidate.children, depth + 1)

  // Bloky nesou text i mimo children (nadpis kapitoly, popisek figury, FAQ).
  const fields = candidate.fields
  if (fields && typeof fields === 'object') out += ' ' + collect(fields, depth + 1)

  return out
}

/** Vrátí počet minut (min. 1), nebo null, když text chybí. */
export const readingTime = (content: unknown): number | null => {
  const words = collect(content).trim().split(/\s+/).filter(Boolean).length
  if (words === 0) return null
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
