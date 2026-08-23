/**
 * Česká typografická hygiena při vykreslení (DESIGN.md 4.3).
 *
 * Jednopísmenné předložky a spojky (k, s, v, z, o, u, a, i) nesmí zůstat
 * viset na konci řádku. Řeší se tady, ne v obsahu — autor článku nemá
 * psát nezlomitelné mezery ručně a při každé změně šířky je přepočítávat.
 */
const PREDLOZKY = /(?<=^|[\s(„"\u2018\u201e\u00a0])([ksvzoutiaISVZOUKAI])[ \t]+/g

export const nezlomitelneMezery = (text: string): string =>
  text.replace(PREDLOZKY, (_m, slovo) => `${slovo}\u00a0`)

/**
 * Projde Lexical strom a doplní pevné mezery do všech textových uzlů.
 * Je to čistá transformace dat, takže formátovací uzly (tučné, odkazy)
 * zůstávají nedotčené — na rozdíl od přepisování hotového JSX.
 */
export const nezlomitelneMezeryVeStromu = <T,>(node: T, depth = 0): T => {
  if (depth > 24 || node == null) return node
  if (Array.isArray(node)) {
    return node.map((child) => nezlomitelneMezeryVeStromu(child, depth + 1)) as unknown as T
  }
  if (typeof node !== 'object') return node

  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (key === 'text' && typeof value === 'string') out[key] = nezlomitelneMezery(value)
    else if (value && typeof value === 'object') out[key] = nezlomitelneMezeryVeStromu(value, depth + 1)
    else out[key] = value
  }
  return out as T
}
