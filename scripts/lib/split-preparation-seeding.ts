import {
  block, cloneDocument, paragraph, renumberFigures,
  type ArticleDocument, type ArticleNode,
} from './lawn-series-helpers'

export const PREPARATION_SLUG = 'jak-pripravit-a-ulozit-smes'
export const PREPARATION_TITLE = 'Jak připravit půdu a uložit směs'
export const SEEDING_SLUG = 'jak-zasit-travnik'
export const SEEDING_TITLE = 'Jak zasít trávník'
export const PREPARATION_META = {
  title: 'Příprava půdy pro trávník: míchání a uložení směsi',
  description: 'Jak připravit podloží, promíchat zeminu s pískem a zapravit příměsi do správné hloubky. Od plánování práce přes uložení směsi až po slehnutí a urovnání povrchu.',
}
export const SEEDING_META = {
  title: 'Setí trávníku: výsev, první zálivka a sečení',
  description: 'Jak zasít trávník do připravené půdy: volba osiva, dávka, mělké zapravení, mykorhiza a jemná zálivka. Kdy začít s prvním sečením mladého porostu.',
}
const preparationPath = `/posts/${PREPARATION_SLUG}`
const seedingPath = `/posts/${SEEDING_SLUG}`
const mycorrhizaTitle = 'Mykorhizu umístit tam, kde se setká s mladými kořeny'
const seedTitle = 'Několik kilogramů semen nad desítkami tun připravené půdy'
const movedAnchors = [
  'mykorhizu-umistit-tam-kde-se-setka-s-mladymi-koreny',
  'nekolik-kilogramu-semen-nad-desitkami-tun-pripravene-pudy',
  'vysev-potrebuje-vhodne-podminky-a-melke-ulozeni',
  'prvni-korinek-jeste-nedosahne-do-pripravene-zasoby',
  'prvni-zelene-carky-jeste-nejsou-hotovy-porost',
]

/** Update references in existing articles, including nested Lexical and Markdown links. */
export function rewritePreparationLinks(input: unknown): ArticleDocument {
  const doc = cloneDocument(input)
  const visit = (value: any): any => {
    if (typeof value === 'string') {
      for (const anchor of movedAnchors) {
        value = value.replaceAll(`${preparationPath}#${anchor}`, `${seedingPath}#${anchor}`)
      }
      return value
        .replaceAll('Jak připravit a uložit směs', PREPARATION_TITLE)
        .replaceAll(
          'Navazuje promícháním, kontrolou slehnutí, výsevem a první péčí o trávník.',
          `Navazuje promícháním a kontrolou slehnutí. Výsev a první péči o trávník popisuje samostatný návod [${SEEDING_TITLE}](${seedingPath}).`,
        )
    }
    if (Array.isArray(value)) return value.map(visit)
    if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) value[key] = visit(value[key])
    }
    return value
  }
  return visit(doc)
}

function documentFrom(template: ArticleDocument, children: ArticleNode[]): ArticleDocument {
  return { ...template, root: { ...template.root, children } }
}
function sourceSection(paragraphs: string[]): ArticleNode[] {
  return [block({ blockType: 'chapter', blockName: 'Zdroje a metodika – SEO', title: 'Zdroje a metodika', eyebrow: 'Podklady' }), ...paragraphs.map(paragraph)]
}

/** Split the final combined article; retain every practical paragraph and its original visual. */
export function splitPreparationAndSeeding(input: unknown): { preparation: ArticleDocument; seeding: ArticleDocument } {
  const doc = cloneDocument(input)
  const nodes = doc.root.children
  const mycorrhiza = nodes.findIndex((node) => node.fields?.title === mycorrhizaTitle)
  const seeds = nodes.findIndex((node) => node.fields?.title === seedTitle)
  // Konec setí: oddíl zdrojů, a když už není (od 3. 10. 2026), FAQ.
  const sources = nodes.findIndex((node) => node.fields?.blockName === 'Zdroje a metodika – SEO' || node.fields?.blockType === 'faq')
  const faq = nodes.find((node) => node.fields?.blockType === 'faq')
  const summary = nodes.find((node) => node.fields?.blockType === 'summaryBand')
  if (mycorrhiza < 1 || seeds <= mycorrhiza || sources <= seeds || !faq || !summary) {
    throw new Error('Expected the combined preparation and seeding article with sources and FAQ')
  }
  const bleed = nodes.slice(mycorrhiza + 1, seeds)
  if (bleed.length !== 1 || bleed[0].fields?.blockType !== 'figure') {
    throw new Error('Expected the prepared seedbed photograph between the two chapters')
  }
  const preparationNodes = nodes.slice(0, mycorrhiza)
  const preparationSummary = preparationNodes.find((node) => node.fields?.blockType === 'summaryBand')!.fields
  preparationSummary.lead = 'Zeminu s případným pískem nejprve promíchejte v celé plánované hloubce. Potom zapravujte příměsi postupně mělčeji podle receptury; samostatná patra nevytvářejte. *Před výsevem nechte povrch slehnout a ověřte, že se jeho výška ustálila.* Nakonec doladíme nerovnosti a připravíme seťové lůžko.'
  preparationSummary.tiles = preparationSummary.tiles.slice(0, 2)
  preparationSummary.blockName = 'Od podloží po připravené seťové lůžko'
  const intro = preparationNodes.find((node) => node.fields?.title === 'Jak směs připravit a uložit při skutečné práci')
  if (!intro) throw new Error('Expected the practical preparation introduction')
  intro.fields.body = intro.fields.body.replace('přípravou podloží, promícháním, slehnutím, výsevem a první péčí o trávník.', 'přípravou podloží, promícháním, uložením směsi a kontrolou slehnutí.')
  preparationNodes.push(...bleed, ...sourceSection([
    '[Penn State](https://extension.psu.edu/lawn-establishment) popisuje práci s vlhkou, nikoli mokrou půdou, promíchání příměsí a ustálení povrchu deštěm či zálivkou. [Průvodce WSU](https://extension.wsu.edu/pnw-gardeners-handbook/chapter-5-urban-soil-management/) zdůrazňuje oddělení použitelné ornice od nevhodného podloží.',
    'Hloubky zapravení a čas na slehnutí v tomto článku jsou pracovní předpoklady pro popsanou směs. Rozhoduje stav půdy a použitý stroj. Dávku konkrétních přípravků volte podle výrobku, ne podle obecného příkladu.',
  ]), faq, block({
    blockType: 'ctaBand', blockName: 'Od připravené půdy k výsevu',
    title: 'Půda je připravená. Co přijde při setí?',
    sub: 'Navazující článek provede umístěním mykorhizy, výsevem osiva, první zálivkou a první sečí mladého trávníku.',
    buttonLabel: 'Pokračovat k setí trávníku', buttonHref: seedingPath,
    ask: 'K výsevu přistupte až po ustálení výšek a doladění nerovností.',
  }))
  const seedingSummary = structuredClone(summary)
  delete seedingSummary.fields.id
  seedingSummary.fields.lead = 'Na připravené a slehlé půdě zvolíme osivo podle podmínek zahrady, rovnoměrně je vysejeme a mělce zapravíme. *Čerstvý výsev potřebuje jemnou zálivku, která udrží vlhké seťové lůžko.* První sečení přijde, až porost drží v půdě a povrch unese sekačku.'
  // The original summary has already been shortened for preparation; reuse the two source values explicitly.
  seedingSummary.fields.tiles = [
    { value: '25–30', unit: 'g/m²', label: 'osiva u uvedených rekreačních směsí' },
    { value: '8–10', unit: 'cm', label: 'orientační výška pro první seč' },
  ]
  seedingSummary.fields.blockName = 'Od výsevu po první seč'
  const mycorrhizaNode = nodes[mycorrhiza]
  mycorrhizaNode.fields.titleLevel = 'h2'
  mycorrhizaNode.fields.eyebrow = 'Kapitola 01'
  mycorrhizaNode.fields.body = `Navazujeme na článek [${PREPARATION_TITLE}](${preparationPath}#cas-na-slehnuti-neni-prazdne-cekani). Povrch už má být slehlý, urovnaný a připravený jako seťové lůžko.\n\n${mycorrhizaNode.fields.body}`
  const seedingNodes = [seedingSummary, mycorrhizaNode, ...nodes.slice(seeds, sources), ...sourceSection([
    '[Penn State](https://extension.psu.edu/lawn-establishment) popisuje výsev a péči při vzcházení. Dávky osiva a praktické souvislosti zakládání odkazuje text na [Agrostis](https://www.agrostis.cz/odborne-clanky/jak-zalozit-novy-travnik-zakladani-travniku); závlahu na [principy zavlažování trávníků](https://extension.psu.edu/principles-of-turfgrass-irrigation).',
    'Dávku osiva a mykorhizního přípravku volte podle konkrétního výrobku. Uvedené množství semen, hloubka aplikace TurfComp a výška první seče jsou příklady s podmínkami popsanými v textu; nenahrazují návod výrobce ani posouzení stavu porostu.',
  ]), block({
    blockType: 'faq', blockName: 'Časté otázky k setí trávníku', heading: 'Časté otázky',
    lead: 'Při výsevu hlídejte dávku konkrétní směsi, vláhu seťového lůžka a stav mladého porostu.',
    items: [
      { question: 'Kolik osiva potřebuji na 100 m²?', answer: documentFrom(doc, [paragraph('U uvedených rekreačních směsí s dávkou 25–30 g/m² je to 2,5–3 kg. Přesnou dávku volte podle konkrétní směsi a návodu výrobce.')]) },
      { question: 'Jak zalévat čerstvě vysetý trávník?', answer: documentFrom(doc, [paragraph('Jemnou zálivkou udržujte vlhké seťové lůžko. Podle počasí zálivku opakujte v krátkých dávkách; interval měňte s růstem kořenů do hloubky.')]) },
      { question: 'Kdy mladý trávník poprvé posekat?', answer: documentFrom(doc, [paragraph('Orientačně při výšce 8–10 cm, pokud rostliny drží v půdě a povrch unese sekačku. Ostrým nožem odeberte nejvýše třetinu výšky.')]) },
    ],
  }), block({
    blockType: 'ctaBand', blockName: 'Příprava půdy před výsevem',
    title: 'Je povrch připravený k výsevu?',
    sub: 'Přípravu podloží, promíchání směsi a kontrolu slehnutí najdete v předchozím článku.',
    buttonLabel: 'Přejít na přípravu půdy', buttonHref: preparationPath,
    ask: 'Sejte až do slehlého a urovnaného seťového lůžka.',
  })]
  const preparation = rewritePreparationLinks(documentFrom(doc, preparationNodes))
  const seeding = rewritePreparationLinks(documentFrom(doc, seedingNodes))
  renumberFigures(preparation)
  renumberFigures(seeding)
  // Detect lost practical sections before any database write; changed introductions keep all original guidance.
  const preserved = [...preparation.root.children, ...seeding.root.children]
  for (const original of cloneDocument(input).root.children) {
    if (original.fields?.blockType !== 'split' || original.fields.title === intro.fields.title) continue
    if (!preserved.some((node) => node.fields?.body?.includes(original.fields.body))) {
      throw new Error(`Lost practical text: ${original.fields.title ?? original.fields.blockName}`)
    }
  }
  return { preparation, seeding }
}
