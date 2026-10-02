import { block, cloneDocument, paragraph, type ArticleDocument, type ArticleNode } from './lawn-series-helpers'

const SOIL = 'krasny-travnik-zacina-pod-zemi-2'
const AMENDMENTS = 'pisek-biochar-a-dalsi-primesi'
const CALCULATOR = 'kalkulator-na-planovani-pudniho-profilu'
const PREPARATION = 'jak-pripravit-a-ulozit-smes'
const SEEDING = 'jak-zasit-travnik'
const MARKER = 'Zdroje a metodika – SEO'
const WSU = 'https://extension.wsu.edu/pnw-gardeners-handbook/chapter-5-urban-soil-management/'
const UMD = 'https://extension.umd.edu/resource/soil-health-drainage-and-improving-soil'
const PSU = 'https://extension.psu.edu/lawn-establishment'
const USU = 'https://extension.usu.edu/vegetableguide/management/biochar'
const BROCKHOFF = 'https://doi.org/10.2134/agronj2010.0188'

const sectionText: Record<string, string[]> = {
  [SOIL]: [
    `[Průvodce WSU](${WSU}) vysvětluje hodnocení kořenových překážek a zachování ornice. [University of Maryland](${UMD}) popisuje orientační zkoušku odtoku v předem navlhčené jámě a možné příčiny pomalého vsakování.`,
    'Domácí zkoušky pomáhají rozhodnout o dalším postupu; nenahrazují laboratorní rozbor ani návrh odvodnění. Uvedená pásma vsakování jsou orientační a 30 cm je pracovní cíl tohoto návodu, nikoli univerzální norma pro každou zahradu.',
  ],
  [AMENDMENTS]: [
    `[Penn State](${PSU}) vysvětluje, proč úprava jílovité půdy pískem vyžaduje velký podíl materiálu. [Utah State](${USU}) popisuje rozdílné účinky biocharu a jeho přípravu s živinami; konkrétní trávníkový pokus je odkázán u jeho karty.`,
    'Poměry a hloubky v tabulkách jsou modelové návrhy pro popsané zahrady, nikoli univerzitní doporučení platná pro každou půdu. Dávku přizpůsobte sondě, chování zkušební směsi a vlastnostem výrobku; u přípravků respektujte jeho návod.',
  ],
  [CALCULATOR]: [
    `[Washington State University](${WSU}) popisuje vztah plochy, hloubky a objemu při plánování půdy v zahradě. Kalkulátor tento geometrický vztah používá a jednotlivé příměsi počítá podle jejich vlastní hloubky zapravení.`,
    'Výchozí receptury, hustoty a rezerva jsou nastavitelné modelové vstupy. Výpočet nezměří skutečnou půdu ani nesleduje slehnutí. Pro objednávku použijte sypnou hustotu a balení konkrétní dodávky; zdroj nepotvrzuje hustoty zdejších výrobků ani univerzální dávky příměsí.',
  ],
  [PREPARATION]: [
    `[Penn State](${PSU}) popisuje práci s vlhkou, nikoli mokrou půdou, promíchání příměsí a ustálení povrchu deštěm či zálivkou. [Průvodce WSU](${WSU}) zdůrazňuje oddělení použitelné ornice od nevhodného podloží.`,
    'Hloubky zapravení a čas na slehnutí v tomto článku jsou pracovní předpoklady pro popsanou směs. Rozhoduje stav půdy a použitý stroj. Dávku konkrétních příměsí volte podle receptury a návodu výrobku.',
  ],
  [SEEDING]: [
    `[Penn State](${PSU}) popisuje výsev, kontakt osiva s půdou a péči při vzcházení. Podmínky prvního sečení a praktické souvislosti založení uvádí také [Agrostis](https://www.agrostis.cz/odborne-clanky/jak-zalozit-novy-travnik-zakladani-travniku).`,
    'Dávka 25–30 g/m² a výška 8–10 cm při první seči jsou obecné příklady pro běžný zahradní trávník. Volbu osiva, konkrétní dávku, hloubku zapravení a použití mykorhizního přípravku přizpůsobte výrobku a podmínkám zahrady. Schéma dosahu prvního kořínku ilustruje princip, ne přesnou rychlost růstu každé trávy.',
  ],
}

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
    `Kořeny ale potřebují vedle vody také vzduch. V [pokusu Brockhoffa a kol. (2010)](${BROCKHOFF}) s psinečkem výběžkatým v písčité kořenové zóně se při biocharu nad 10 % objemu snížila hloubka zakořenění. Výsledek platí pro testované materiály a podmínky; neurčuje univerzální dávku pro zahrady. Více biocharu proto automaticky neznamená lepší směs.`,
  ).children

  const clayFigure = nodes.find((node) => node.fields?.drawing === 'kolik-pisku-do-jilu')
    ?? nodes.find((node) => typeof node.fields?.body === 'string' && node.fields.body.includes('Poměr **65/35 popisuje pouze minerální základ**'))
  if (!clayFigure) throw new Error('Evidence: expected clay sand model explanation')
  const oldSand = 'Některé odborné podklady ukazují potřebný podíl až **75 % a více**; poměr 65/35 proto bereme jako výchozí návrh.'
  const newSand = `Potřebný podíl se liší podle původní zeminy a zvoleného písku; vyšší podíl může být nutný, ale ověřujeme jej na zkušební směsi. [Penn State](${PSU}) popisuje potřebu velkého množství písku pro výraznou změnu jílovité půdy. Poměr 65/35 zde zůstává modelovým návrhem, nikoli univerzální dávkou.`
  if (clayFigure.fields.body.includes(oldSand)) clayFigure.fields.body = clayFigure.fields.body.replace(oldSand, newSand)
  else if (!clayFigure.fields.body.includes(newSand)) throw new Error('Evidence: unexpected clay sand explanation')
  clayFigure.fields.alt = 'Schéma nízkého a vyššího podílu písku v jílovité zemině. Model minerálního základu používá 65 % písku; vhodný podíl pro konkrétní půdu je třeba ověřit na zkušební směsi. Obrázek není dávkovacím návodem.'
  clayFigure.fields.caption = 'Poloha vzorku na škále ilustruje podíl písku. Poměr 65/35 patří k našemu modelu; vhodné složení pro konkrétní jíl ověřte zkouškou před velkou objednávkou.'
}

function insertSources(doc: ArticleDocument, paragraphs: string[]): void {
  const nodes = doc.root.children
  const existing = nodes.findIndex((node) => node.fields?.blockName === MARKER)
  if (existing >= 0) {
    const nextBlock = nodes.findIndex((node, index) => index > existing && node.type === 'block')
    if (nextBlock < 0 || nodes[nextBlock].fields?.blockType !== 'faq') {
      throw new Error('Evidence: sources must immediately precede FAQ')
    }
    if (nodes.slice(existing + 1, nextBlock).some((node) => node.type !== 'paragraph')) {
      throw new Error('Evidence: unexpected content in sources section')
    }
    nodes.splice(existing, nextBlock - existing)
  }
  const faq = nodes.findIndex((node) => node.fields?.blockType === 'faq')
  if (faq < 0) throw new Error('Evidence: expected FAQ boundary')
  nodes.splice(faq, 0, block({ blockType: 'chapter', blockName: MARKER, title: 'Zdroje a metodika', eyebrow: 'Podklady' }), ...paragraphs.map(paragraph))
}

/** Add scoped sources and temper only the claims covered by this evidence pass. */
export function enrichLawnEvidence(slug: string, content: unknown): ArticleDocument {
  const doc = cloneDocument(content)
  const paragraphs = sectionText[slug]
  if (!paragraphs) return doc
  if (slug === SOIL) reviseSoilClaims(doc)
  if (slug === AMENDMENTS) reviseAmendmentClaims(doc)
  insertSources(doc, paragraphs)
  return doc
}
