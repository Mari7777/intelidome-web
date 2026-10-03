/**
 * Kalkulátory v obsahu článku — jeden zdroj čísel pro hero článku i magazín.
 * Prochází Lexical strom do hloubky 8 a počítá uzly bloku `calculator`
 * (jen uzel bloku, ne i jeho `fields`, jinak by se každý počítal dvakrát).
 */
export function druhyKalkulatoru(node: unknown, depth = 0): string[] {
  if (depth > 8 || node == null || typeof node !== 'object') return []
  if (Array.isArray(node)) return node.flatMap((child) => druhyKalkulatoru(child, depth + 1))
  const zaznam = node as Record<string, unknown>
  const fields = zaznam.fields as Record<string, unknown> | undefined
  const vlastni = fields?.blockType === 'calculator' && typeof fields.kind === 'string' ? [fields.kind] : []
  return [
    ...vlastni,
    ...Object.values(zaznam).flatMap((value) => (value && typeof value === 'object' ? druhyKalkulatoru(value, depth + 1) : [])),
  ]
}

export const pocetKalkulatoru = (content: unknown): number => druhyKalkulatoru(content).length
