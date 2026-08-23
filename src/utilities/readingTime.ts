/**
 * Odhad doby čtení z Lexical obsahu — meta údaj v heru článku (DESIGN.md 8.2).
 * 180 slov za minutu je konzervativní tempo pro odborný text s čísly.
 */
const WORDS_PER_MINUTE = 180

/**
 * Textová pole bloků. `alt` mezi nimi schválně není — popis pro odečítač
 * se očima nečte a čas by nafukoval. Bez tohohle výčtu by se procházely i `blockType`,
 * `id` nebo `url` a čas čtení by lhal na druhou stranu.
 */
const CONTENT_KEYS = new Set([
  'ask',
  'body',
  'buttonLabel',
  'caption',
  'eyebrow',
  'heading',
  'label',
  'lead',
  'question',
  'sub',
  'text',
  'title',
  'unit',
  'value',
])

type LexicalNode = {
  text?: unknown
  children?: unknown
  root?: unknown
  [key: string]: unknown
}

const collect = (node: unknown, depth = 0, insideFields = false): string => {
  if (depth > 16 || node == null) return ''
  if (Array.isArray(node)) return node.map((child) => collect(child, depth + 1, insideFields)).join(' ')
  if (typeof node !== 'object') return ''

  const candidate = node as LexicalNode
  let out = typeof candidate.text === 'string' ? candidate.text : ''

  if (candidate.root) out += ' ' + collect(candidate.root, depth + 1, insideFields)
  if (candidate.children) out += ' ' + collect(candidate.children, depth + 1, insideFields)

  /*
    Bloky nesou text ve `fields` pod vlastními jmény (`lead`, `body`,
    `caption`, `question` …), ne v `children`. Bez procházení hodnot
    by se z nich nezapočítalo nic — a čas čtení pak hlásil 3 minuty
    tam, kde jich je sedm.
  */
  const fields = candidate.fields
  if (fields && typeof fields === 'object') out += ' ' + collect(fields, depth + 1, true)

  if (insideFields) {
    for (const [key, value] of Object.entries(candidate)) {
      if (key === 'text' || key === 'children' || key === 'root' || key === 'fields') continue
      if (typeof value === 'string') {
        if (CONTENT_KEYS.has(key)) out += ' ' + value
      } else if (value && typeof value === 'object') {
        out += ' ' + collect(value, depth + 1, true)
      }
    }
  }

  return out
}

/** Vrátí počet minut (min. 1), nebo null, když text chybí. */
export const readingTime = (content: unknown): number | null => {
  const words = collect(content).trim().split(/\s+/).filter(Boolean).length
  if (words === 0) return null
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
