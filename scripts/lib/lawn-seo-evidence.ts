import { cloneDocument, paragraph, type ArticleDocument, type ArticleNode } from './lawn-series-helpers'

const SOIL = 'krasny-travnik-zacina-pod-zemi-2'
const AMENDMENTS = 'pisek-biochar-a-dalsi-primesi'
const MARKER = 'Zdroje a metodika – SEO'
const PSU = 'https://extension.psu.edu/lawn-establishment'


function nodeText(node: any): string {
  if (!node || typeof node !== 'object') return ''
  if (typeof node.text === 'string') return node.text
  return Array.isArray(node.children) ? node.children.map(nodeText).join('') : ''
}

function replaceInTextNodes(value: any, from: string, to: string): number {
  if (!value || typeof value !== 'object') return 0
  let count = 0
  if (value.type === 'text' && typeof value.text === 'string' && value.text.includes(from)) {
    value.text = value.text.replace(from, to)
    count += 1
  }
  if (Array.isArray(value.children)) {
    for (const child of value.children) count += replaceInTextNodes(child, from, to)
  }
  return count
}

function reviseSoilClaims(doc: ArticleDocument): void {
  const nodes = doc.root.children
  const tile = nodes.flatMap((node) => node.fields?.tiles ?? []).find((item: any) => item.value === '2,5–7,5')
  if (!tile) throw new Error('Evidence: expected soil infiltration summary tile')
  tile.label = 'orientačně vyhovující vsakování'

  const resultList = nodes.find((node) => node.type === 'list' && nodeText(node).includes('Pokles 2,5 až 7,5 cm za hodinu:'))
  if (!resultList) throw new Error('Evidence: expected soil infiltration results')
  replaceInTextNodes(resultList, 'Ideální stav pro většinu rostlin.', 'Orientačně vyhovující výsledek této zkoušky.')
  if (!nodeText(resultList).includes('Orientačně vyhovující výsledek této zkoušky.')) {
    throw new Error('Evidence: unexpected infiltration result wording')
  }

  const drainageFigure = nodes.find((node) => node.fields?.drawing === 'vsak')
    ?? nodes.find((node) => typeof node.fields?.alt === 'string' && node.fields.alt.startsWith('Řez zkušební jámou'))
  if (!drainageFigure) throw new Error('Evidence: expected soil drainage figure')
  drainageFigure.fields.alt = drainageFigure.fields.alt.replace('2,5 až 7,5 ideální', '2,5 až 7,5 orientačně vyhovující')

  const drainageNote = nodes.find((node) => node.type === 'paragraph' && nodeText(node).startsWith('Zkoušku proveďte na více místech'))
  if (!drainageNote) throw new Error('Evidence: expected soil drainage note')
  replaceInTextNodes(
    drainageNote,
    'Zkoušku proveďte na více místech, voda může unikat do stran nebo najít trhlinu.',
    'Zkoušku proveďte na více místech. Výsledek ovlivňuje i boční odtok a trhliny; je orientační a sám nepotvrzuje úrodnost půdy.',
  )

  const conclusion = nodes.find((node) => node.type === 'paragraph' && nodeText(node).startsWith('Když půdu připravíte správně hned na začátku,'))
  if (!conclusion) throw new Error('Evidence: expected soil conclusion')
  conclusion.children = paragraph('Když půdu připravíte správně hned na začátku, snížíte riziko, že budete zálivkou nebo hnojivem řešit problém ukrytý pod povrchem. Voda, vzduch a živiny se mohou snáze dostat ke kořenům. Péče o půdu vás nezbaví nutnosti sekat ani nevyloučí choroby, ale vytvoří lepší podmínky pro další péči o trávník.').children
}

function reviseAmendmentClaims(doc: ArticleDocument): void {
  const nodes = doc.root.children
  const biochar = nodes.flatMap((node) => node.fields?.items ?? []).find((item: any) => item.name === 'Biochar' && item.detail?.root)
  if (!biochar) throw new Error('Evidence: expected biochar ingredient detail')
  const biocharParagraph = biochar.detail.root.children.find((node: ArticleNode) => node.type === 'paragraph' && nodeText(node).startsWith('Kořeny ale potřebují vedle vody také vzduch.'))
  if (!biocharParagraph) throw new Error('Evidence: expected biochar research paragraph')
  biocharParagraph.children = paragraph(
    'Kořeny ale potřebují vedle vody také vzduch. V pokusu Brockhoffa a kol. (2010) s psinečkem výběžkatým v písčité kořenové zóně se při biocharu nad 10 % objemu snížila hloubka zakořenění. Výsledek platí pro testované materiály a podmínky; neurčuje univerzální dávku pro zahrady. Více biocharu proto automaticky neznamená lepší směs.',
  ).children

  const clayFigure = nodes.find((node) => node.fields?.drawing === 'kolik-pisku-do-jilu')
    ?? nodes.find((node) => typeof node.fields?.body === 'string' && node.fields.body.includes('Poměr **65/35 popisuje pouze minerální základ**'))
  if (!clayFigure) throw new Error('Evidence: expected clay sand model explanation')
  const oldSand = 'Některé odborné podklady ukazují potřebný podíl až **75 % a více**; poměr 65/35 proto bereme jako výchozí návrh.'
  // Dříve s odkazem na Penn State; od 3. 10. 2026 bez odkazů jinam.
  const linkedSand = `Potřebný podíl se liší podle původní zeminy a zvoleného písku; vyšší podíl může být nutný, ale ověřujeme jej na zkušební směsi. [Penn State](${PSU}) popisuje potřebu velkého množství písku pro výraznou změnu jílovité půdy. Poměr 65/35 zde zůstává modelovým návrhem, nikoli univerzální dávkou.`
  const newSand = 'Potřebný podíl se liší podle původní zeminy a zvoleného písku; vyšší podíl může být nutný, ale ověřujeme jej na zkušební směsi. Penn State popisuje potřebu velkého množství písku pro výraznou změnu jílovité půdy. Poměr 65/35 zde zůstává modelovým návrhem, nikoli univerzální dávkou.'
  if (clayFigure.fields.body.includes(oldSand)) clayFigure.fields.body = clayFigure.fields.body.replace(oldSand, newSand)
  else if (clayFigure.fields.body.includes(linkedSand)) clayFigure.fields.body = clayFigure.fields.body.replace(linkedSand, newSand)
  else if (!clayFigure.fields.body.includes(newSand)) throw new Error('Evidence: unexpected clay sand explanation')
  clayFigure.fields.alt = 'Schéma nízkého a vyššího podílu písku v jílovité zemině. Model minerálního základu používá 65 % písku; vhodný podíl pro konkrétní půdu je třeba ověřit na zkušební směsi. Obrázek není dávkovacím návodem.'
  clayFigure.fields.caption = 'Poloha vzorku na škále ilustruje podíl písku. Poměr 65/35 patří k našemu modelu; vhodné složení pro konkrétní jíl ověřte zkouškou před velkou objednávkou.'
}

/**
 * Oddíl „Zdroje a metodika“ články nemají (rozhodnutí autora 3. 10. 2026).
 * Odstraní blok kapitoly se značkou MARKER a odstavce za ním až po další blok.
 */
export function stripSources(doc: ArticleDocument): ArticleDocument {
  const nodes = doc.root.children
  const start = nodes.findIndex((node) => node.fields?.blockName === MARKER)
  if (start < 0) return doc
  let end = start + 1
  while (end < nodes.length && nodes[end].type === 'paragraph') end++
  nodes.splice(start, end - start)
  return doc
}

const isExternal = (url: unknown) => typeof url === 'string' && /^https?:\/\//.test(url) && !/intelidome\.(com|cz)/.test(url)

/**
 * Články nemají odkazy jinam (rozhodnutí autora 3. 10. 2026): z Lexical uzlu
 * `link` s vnější adresou zůstane jen jeho text, z markdownu `[text](url)`
 * v tělech dvousloupců jen `text`. Odkazy mezi vlastními články zůstávají.
 */
export function stripExternalLinks(doc: ArticleDocument): ArticleDocument {
  const visit = (value: any): any => {
    if (typeof value === 'string') {
      return value.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (all, text, url) => (isExternal(url) ? text : all))
    }
    if (Array.isArray(value)) {
      return value.flatMap((item) =>
        item && typeof item === 'object' && item.type === 'link' && isExternal(item.fields?.url)
          ? visit(item.children ?? [])
          : [visit(item)],
      )
    }
    if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) value[key] = visit(value[key])
    }
    return value
  }
  doc.root.children = visit(doc.root.children)
  return doc
}

/** Temper only the claims covered by this evidence pass; no sources section, no external links. */
export function enrichLawnEvidence(slug: string, content: unknown): ArticleDocument {
  const doc = cloneDocument(content)
  if (slug === SOIL) reviseSoilClaims(doc)
  if (slug === AMENDMENTS) reviseAmendmentClaims(doc)
  return stripExternalLinks(stripSources(doc))
}
