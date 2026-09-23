import { PROFILE_BLEED, PROFILE_CTA, PROFILE_RHYTHM_ORDER, PROFILE_RHYTHM_SECTIONS } from './profile-rhythm-content'

type Node = { type: string; version: number; [key: string]: any }
type Document = { root: { type: string; children: Node[]; direction: 'ltr' | 'rtl' | null; format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''; indent: number; version: number; [key: string]: any }; [key: string]: any }

const block = (fields: Record<string, unknown>): Node => ({ type: 'block', fields, format: '', version: 2 })
const textOf = (node: Node): string => node.text ?? (node.children ?? []).map(textOf).join('')
const bezZnacek = (text: string) =>
  text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '').replace(/^### /, '').replace(/[–—]/g, '–').replace(/\s+/g, ' ').trim()

const porovnej = (co: string, stare: string[], nove: string[]) => {
  const a = stare.map(bezZnacek).join(' ')
  const b = nove.map(bezZnacek).join(' ')
  if (a === b) return
  let i = 0
  while (i < a.length && a[i] === b[i]) i++
  throw new Error(`Profile rhythm ${co} differ from the article at ${i}: „${a.slice(i, i + 60)}" vs „${b.slice(i, i + 60)}"`)
}

/**
 * Rytmus obraz/text článku s kalkulátorem (DESIGN.md 8.2b p. 8): vše mezi
 * krémovým souhrnem a FAQ se přestaví podle `profile-rhythm-content.ts`,
 * pás kalkulátoru a tabulka zůstanou (tabulka na bílé), starý předěl se
 * zdvojenou fotkou hera zmizí a poslední odstavec se stane CTA pásem.
 * Přestavba proběhne jen tehdy, když text i pořadí nadpisů zůstaly znak
 * po znaku stejné.
 */
export function applyProfileRhythm(input: unknown): Document {
  const doc = structuredClone(input) as Document
  const nodes = doc?.root?.children
  if (!Array.isArray(nodes)) throw new Error('Expected profile article content')
  const start = nodes.findIndex((n) => n.fields?.blockType === 'summaryBand')
  const faqIndex = nodes.findIndex((n) => n.fields?.blockType === 'faq')
  if (start < 0 || faqIndex <= start) throw new Error('Expected the summary band before the FAQ')
  const zaFaq = nodes.slice(faqIndex + 1)
  if (zaFaq.length !== 1 || zaFaq[0].type !== 'paragraph') throw new Error('Expected exactly one closing paragraph after the FAQ')

  const staryText: string[] = []
  const stareNadpisy: string[] = []
  const alty: Record<string, string> = {}
  let kalkulator: Node | undefined
  let tabulka: Node | undefined
  for (const n of nodes.slice(start + 1, faqIndex)) {
    const f = n.fields
    if (f?.blockType === 'calculator') {
      if (kalkulator) throw new Error('Expected exactly one calculator')
      kalkulator = n
    } else if (f?.blockType === 'table') {
      if (tabulka) throw new Error('Expected exactly one table')
      tabulka = n
    } else if (f?.blockType === 'figure') {
      // starý předěl se zdvojenou fotkou hera — nahradí ho PROFILE_BLEED
    } else if (f?.blockType === 'chapter') stareNadpisy.push(f.title)
    else if (f?.blockType === 'split') {
      if (f.title) stareNadpisy.push(f.title)
      staryText.push(...String(f.body).split(/\n{2,}/))
      if (f.drawing && f.alt) alty[f.drawing] = f.alt
    } else if (n.type === 'heading') stareNadpisy.push(textOf(n))
    else if (n.type === 'paragraph') staryText.push(textOf(n))
    else throw new Error(`Unexpected node between the summary and the FAQ: ${f?.blockType ?? n.type}`)
  }
  if (!kalkulator || !tabulka) throw new Error('Expected the calculator and the table')
  staryText.push(textOf(zaFaq[0]))

  const novyText: string[] = []
  const noveNadpisy: string[] = []
  for (const s of PROFILE_RHYTHM_SECTIONS) {
    if (s.title) noveNadpisy.push(s.title)
    for (const odstavec of s.body) (odstavec.startsWith('### ') ? noveNadpisy : novyText).push(odstavec)
  }
  novyText.push(`${PROFILE_CTA.title} ${PROFILE_CTA.sub}`)
  porovnej('text', staryText, novyText)
  porovnej('nadpisy', stareNadpisy, noveNadpisy)

  const sekce = new Map(PROFILE_RHYTHM_SECTIONS.map((s) => [s.id, s]))
  const bloky: Node[] = []
  for (const id of PROFILE_RHYTHM_ORDER) {
    if (id === 'KALK') {
      bloky.push(kalkulator)
      continue
    }
    if (id === 'TAB') {
      bloky.push({ ...tabulka, fields: { ...tabulka.fields, surface: 'bila' } })
      continue
    }
    if (id === 'PREDEL') {
      bloky.push(block({ blockType: 'figure', blockName: 'Obr. 01', __filename: PROFILE_BLEED.filename, number: '01', caption: PROFILE_BLEED.caption, panel: false, layout: 'bleed' }))
      continue
    }
    const s = sekce.get(id)
    if (!s) throw new Error(`Missing rhythm section ${id}`)
    const obraz = s.drawing
      ? { drawing: s.drawing, alt: s.alt ?? alty[s.drawing] }
      : { __photo: s.photo, photoRatio: s.photoRatio }
    if (s.drawing && !obraz.alt) throw new Error(`Missing alt for drawing ${s.drawing}`)
    bloky.push(block({
      blockType: 'split',
      blockName: s.title ?? `${s.id} – pokračování`,
      side: s.side,
      surface: s.surface,
      ...(s.eyebrow ? { eyebrow: s.eyebrow } : {}),
      ...(s.title ? { title: s.title, titleLevel: s.titleLevel } : {}),
      ...(s.continues ? { continues: true } : {}),
      ...obraz,
      number: '01',
      caption: s.caption,
      body: s.body.join('\n\n'),
    }))
  }
  const cta = block({ blockType: 'ctaBand', blockName: 'Na přípravu navazuje závlaha', ...PROFILE_CTA })
  nodes.splice(start + 1, nodes.length - start - 1, ...bloky, nodes[faqIndex], cta)

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
