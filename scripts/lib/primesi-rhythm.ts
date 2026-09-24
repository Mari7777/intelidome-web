import { PRIMESI_RHYTHM_ORDER, PRIMESI_RHYTHM_SECTIONS } from './primesi-rhythm-content'

type Node = { type: string; version: number; [key: string]: any }
type Document = { root: { type: string; children: Node[]; direction: 'ltr' | 'rtl' | null; format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''; indent: number; version: number; [key: string]: any }; [key: string]: any }

const block = (fields: Record<string, unknown>): Node => ({ type: 'block', fields, format: '', version: 2 })
/** Text uzlu se značkami, které nese i obsah splitu: **tučně** a [odkaz](url). */
const markdownOf = (node: Node): string => {
  if (node.type === 'text') return node.format & 1 ? `**${node.text}**` : node.text
  if (node.type === 'link') return `[${(node.children ?? []).map(markdownOf).join('')}](${node.fields?.url ?? ''})`
  return (node.children ?? []).map(markdownOf).join('')
}
const bezZnacek = (text: string) =>
  text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '').replace(/^### /, '').replace(/[–—]/g, '–').replace(/\s+/g, ' ').trim()

const porovnej = (co: string, stare: string[], nove: string[]) => {
  const a = stare.map(bezZnacek).join(' ')
  const b = nove.map(bezZnacek).join(' ')
  if (a === b) return
  let i = 0
  while (i < a.length && a[i] === b[i]) i++
  throw new Error(`Primesi rhythm ${co} differ from the article at ${i}: „${a.slice(i, i + 60)}" vs „${b.slice(i, i + 60)}"`)
}

/**
 * Rytmus obraz/text článku „Písek, biochar a další příměsi" (DESIGN.md 8.2b
 * p. 8): vše mezi krémovým souhrnem a FAQ se přestaví podle
 * `primesi-rhythm-content.ts`. Tip o betonářském písku, karty složek a obě
 * tabulky zůstanou jako moduly (povrch tabulek beze změny), jen je přestavba
 * posune o nejvýš jeden odstavec za split, ke kterému patří. Přestavba
 * proběhne jen tehdy, když text i pořadí nadpisů zůstaly znak po znaku
 * stejné.
 */
export function applyPrimesiRhythm(input: unknown): Document {
  const doc = structuredClone(input) as Document
  const nodes = doc?.root?.children
  if (!Array.isArray(nodes)) throw new Error('Expected primesi article content')
  const start = nodes.findIndex((n) => n.fields?.blockType === 'summaryBand')
  const faqIndex = nodes.findIndex((n) => n.fields?.blockType === 'faq')
  if (start !== 0 || faqIndex <= start) throw new Error('Expected the summary band first and the FAQ after it')

  const staryText: string[] = []
  const stareNadpisy: string[] = []
  const moduly: Record<string, Node> = {}
  const tabulky: Node[] = []
  const pridej = (klic: string, n: Node) => {
    if (moduly[klic]) throw new Error(`Expected exactly one ${klic}`)
    moduly[klic] = n
  }
  for (const n of nodes.slice(start + 1, faqIndex)) {
    const f = n.fields
    if (f?.blockType === 'banner') pridej('BANNER', n)
    else if (f?.blockType === 'ingredients') pridej('INGREDIENTS', n)
    else if (f?.blockType === 'table') tabulky.push(n)
    else if (f?.blockType === 'split') {
      if (f.title) stareNadpisy.push(f.title)
      staryText.push(...String(f.body).split(/\n{2,}/))
    } else if (n.type === 'heading') stareNadpisy.push(markdownOf(n))
    else if (n.type === 'paragraph') staryText.push(markdownOf(n))
    else throw new Error(`Unexpected node between the summary and the FAQ: ${f?.blockType ?? n.type}`)
  }
  // Tabulky podle obsahu, ne podle pořadí: dávky tří zahrad a poměry v hloubkách.
  const prvniBunka = (n: Node) => String(n.fields?.rows?.[0]?.cells?.[0]?.value ?? '')
  const davky = tabulky.filter((n) => prvniBunka(n) === 'Zeolit, 0–15 cm')
  const hloubky = tabulky.filter((n) => prvniBunka(n) === '0–10 cm')
  if (tabulky.length !== 2 || davky.length !== 1 || hloubky.length !== 1) throw new Error('Expected the dose table and the depth table')
  moduly['TAB-DAVKY'] = davky[0]
  moduly['TAB-HLOUBKY'] = hloubky[0]
  for (const klic of ['BANNER', 'INGREDIENTS']) if (!moduly[klic]) throw new Error(`Expected ${klic}`)

  const novyText: string[] = []
  const noveNadpisy: string[] = []
  for (const s of PRIMESI_RHYTHM_SECTIONS) {
    if (s.title) noveNadpisy.push(s.title)
    for (const odstavec of s.body) (odstavec.startsWith('### ') ? noveNadpisy : novyText).push(odstavec)
  }
  porovnej('text', staryText, novyText)
  porovnej('nadpisy', stareNadpisy, noveNadpisy)

  const sekce = new Map(PRIMESI_RHYTHM_SECTIONS.map((s) => [s.id, s]))
  const bloky: Node[] = []
  for (const id of PRIMESI_RHYTHM_ORDER) {
    if (moduly[id]) {
      bloky.push(moduly[id])
      continue
    }
    const s = sekce.get(id)
    if (!s) throw new Error(`Missing rhythm section ${id}`)
    if (s.drawing && !s.alt) throw new Error(`Missing alt for drawing ${s.drawing}`)
    bloky.push(block({
      blockType: 'split',
      blockName: s.title ?? `${s.id} – pokračování`,
      side: s.side,
      surface: s.surface,
      ...(s.eyebrow ? { eyebrow: s.eyebrow } : {}),
      ...(s.title ? { title: s.title, titleLevel: s.titleLevel } : {}),
      ...(s.continues ? { continues: true } : {}),
      ...(s.drawing ? { drawing: s.drawing, alt: s.alt } : { __photo: s.photo, photoRatio: s.photoRatio }),
      number: '01',
      caption: s.caption,
      body: s.body.join('\n\n'),
    }))
  }
  if (bloky.filter((n) => n.fields?.blockType !== 'split').length !== 4) throw new Error('Expected all four modules in the rhythm order')
  nodes.splice(start + 1, faqIndex - start - 1, ...bloky)

  let cislo = 0
  for (const n of nodes) {
    const f = n.fields
    if (['split', 'figure'].includes(f?.blockType) && f.number) {
      f.number = String(++cislo).padStart(2, '0')
      if (f.blockType === 'figure') f.blockName = `Obr. ${f.number}`
    }
  }
  return doc
}
