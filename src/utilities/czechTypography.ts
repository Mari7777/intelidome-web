/**
 * Česká typografická hygiena při vykreslení (DESIGN.md 4.3).
 *
 * Jednopísmenné předložky a spojky (k, s, v, z, o, u, a, i) nesmí zůstat
 * viset na konci řádku. Řeší se tady, ne v obsahu — autor článku nemá
 * psát nezlomitelné mezery ručně a při každé změně šířky je přepočítávat.
 */
const PREDLOZKY = /(?<=^|[\s(„"\u2018\u201e\u00a0])([ksvzoutiaISVZOUKAI])[ \t]+/g

/* Číslo a jednotka patří k sobě: „15 cm", „4 cm/h", „0,8 kg/l", „200 litrů",
   „22 min", „28,52 t", „1 234 Kč". Slovní jednotky jen celé slovo (`\p{L}`
   — `\w` neumí „ů", takže „30 centimetrů" dřív propadlo), symbolové
   (%, °C, €, $, £) bez hranice. */
const JEDNOTKA_SLOVO =
  /(\d)[ \t]+(?=(?:cm\/h|l\/min|kg\/l|mm|cm|km|m[²³]?|kg|g|l|t|Kč|min|s|h|bar[uy]?|litr\p{L}*|sekund\p{L}*|minut\p{L}*|hodin\p{L}*|centimetr\p{L}*|milimetr\p{L}*|metr\p{L}*|kilogram\p{L}*|gram\p{L}*|tun\p{L}*|procent\p{L}*|dn[yíů]|krát|typ[yů]?|m²|m³)(?!\p{L}))/gu
const JEDNOTKA_SYMBOL = /(\d)[ \t]+(?=(?:%|°C|€|\$|£))/g
/* Tisíce: „10 000" se nesmí rozdělit. */
const TISICE = /(\d)[ \t](?=\d{3}(?!\d))/g
/* Rozsah „1–2 centimetry" se za pomlčkou nesmí zlomit (ČSN 01 6910):
   za en dash mezi číslicemi jde U+2060 (word joiner). Násobení „1 × 1"
   drží pohromadě pevnými mezerami. */
const ROZSAH = /(\d)–(?=\d)/g
/* Rovnice se nesmí zlomit za „=" a odkaz „Obr. 05" za tečkou. */
const ROVNITKO = /[ \t]+=[ \t]+/g
const OBRAZEK = /\bObr\.[ \t]+(?=\d)/g
const KRAT = /(\d)[ \t]*×[ \t]*(?=\d)/g

export const nezlomitelneMezery = (text: string): string =>
  text
    .replace(PREDLOZKY, (_m, slovo) => `${slovo}\u00a0`)
    .replace(TISICE, '$1\u00a0')
    .replace(JEDNOTKA_SLOVO, '$1\u00a0')
    .replace(JEDNOTKA_SYMBOL, '$1\u00a0')
    .replace(ROZSAH, '$1–\u2060')
    .replace(KRAT, '$1\u00a0×\u00a0')
    .replace(ROVNITKO, '\u00a0=\u00a0')
    .replace(OBRAZEK, 'Obr.\u00a0')

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
