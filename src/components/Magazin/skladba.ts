/**
 * Skladba domovské stránky magazínu (DESIGN.md 8.5) — čisté funkce bez
 * Payloadu, aby šly testovat. Téma článku je jeho PRVNÍ kategorie platná
 * v daném jazyce; vlastní pás dostane téma s aspoň MIN_CLANKU_TEMATU články,
 * nejvýš MAX_TEMAT témat v pořadí založení kategorie. Série řadí díly od
 * nejstaršího, nečíslované téma ukáže MAX_TEMA nejnovějších.
 */
export const NA_STRANU = 12
export const MIN_CLANKU_TEMATU = 2
export const MAX_TEMAT = 3
export const MAX_DILU = 12
export const MAX_TEMA = 6
export const MAX_KALKULATORU = 6

export type LehkyClanek = { id: number; kategorie: number[]; publishedAt: string | null }
export type Tema = { id: number; slug: string; titulek: string; popis: string | null; serie: boolean }
export type Dil = { k: number; z: number }
export type SkupinaPlan = { tema: Tema; clanky: number[]; pocet: number; vsechnyDily: boolean }

const cas = (c: LehkyClanek) => (c.publishedAt ? Date.parse(c.publishedAt) : 0)
const vzestupne = (a: LehkyClanek, b: LehkyClanek) => cas(a) - cas(b) || a.id - b.id

/** Témata, díly a téma každého článku z lehkého seznamu (bez obsahu) celého jazyka. */
export function sestavSkupiny(
  lehke: readonly LehkyClanek[],
  temata: readonly Tema[],
  { min = MIN_CLANKU_TEMATU, max = MAX_TEMAT, dilu = MAX_DILU, tema = MAX_TEMA } = {},
): { skupiny: SkupinaPlan[]; dily: Map<number, Dil>; temaClanku: Map<number, Tema> } {
  const platna = new Map(temata.map((t) => [t.id, t]))
  const temaClanku = new Map<number, Tema>()
  const podleTematu = new Map<number, LehkyClanek[]>()
  for (const clanek of lehke) {
    const prvni = clanek.kategorie.find((id) => platna.has(id))
    if (prvni === undefined) continue
    temaClanku.set(clanek.id, platna.get(prvni)!)
    podleTematu.set(prvni, [...(podleTematu.get(prvni) ?? []), clanek])
  }
  const dily = new Map<number, Dil>()
  for (const [id, clanky] of podleTematu) {
    if (!platna.get(id)!.serie) continue
    const serazene = [...clanky].sort(vzestupne)
    serazene.forEach((c, i) => dily.set(c.id, { k: i + 1, z: serazene.length }))
  }
  const skupiny: SkupinaPlan[] = []
  for (const t of temata) {
    const clanky = podleTematu.get(t.id) ?? []
    if (clanky.length < min || skupiny.length >= max) continue
    const serazene = t.serie ? [...clanky].sort(vzestupne).slice(0, dilu) : [...clanky].sort(vzestupne).reverse().slice(0, tema)
    skupiny.push({ tema: t, clanky: serazene.map((c) => c.id), pocet: clanky.length, vsechnyDily: t.serie && clanky.length <= dilu })
  }
  return { skupiny, dily, temaClanku }
}

/** Okno čísel stránkování: do 7 stran všechny, jinak 1 … n−1 n n+1 … N (`null` = mezera). */
export function oknoStran(strana: number, pocet: number): (number | null)[] {
  if (pocet <= 7) return Array.from({ length: pocet }, (_, i) => i + 1)
  const okno = new Set([1, strana - 1, strana, strana + 1, pocet].filter((n) => n >= 1 && n <= pocet))
  const cisla = [...okno].sort((a, b) => a - b)
  return cisla.flatMap((n, i) => (i > 0 && n - cisla[i - 1] > 1 ? [null, n] : [n]))
}

/** Kalkulátory v pořadí stránky, každý druh jednou (první výskyt), nejvýš `max`. */
export function vyberKalkulatory<R extends { kalkulatory: string[]; href: string; titulek: string }>(
  radky: readonly R[],
  max = MAX_KALKULATORU,
): { druh: string; href: string; clanek: string }[] {
  const videne = new Set<string>()
  const vysledek: { druh: string; href: string; clanek: string }[] = []
  for (const radek of radky) {
    for (const druh of radek.kalkulatory) {
      if (videne.has(druh) || vysledek.length >= max) continue
      videne.add(druh)
      vysledek.push({ druh, href: `${radek.href}#kalkulator-${druh}`, clanek: radek.titulek })
    }
  }
  return vysledek
}
