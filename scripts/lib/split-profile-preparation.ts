/** Extract preparation and seeding chapters; keep their authored nodes intact. */
export const TITLE = 'Jak připravit a uložit směs'
export const SLUG = 'jak-pripravit-a-ulozit-smes'
export const META_DESCRIPTION = 'Jak připravit podloží, promíchat a uložit půdní směs pro trávník. Od kontroly slehnutí přes výsev a první zálivku až po první sečení mladého porostu.'
export const PROFILE_META_DESCRIPTION = 'Spočítejte materiály pro půdní profil trávníku podle plochy, hloubky a poměrů směsi. Porovnejte objemy, hmotnosti a balení pro plánování dodávky.'
export const PREPARATION_TITLE = TITLE
export const PREPARATION_SLUG = SLUG
export const PREPARATION_META_DESCRIPTION = META_DESCRIPTION
const PROFILE_SLUG = 'kalkulator-na-planovani-pudniho-profilu'
const PROFILE_TITLE = 'Kalkulátor na plánování půdního profilu'
const ORIGINAL_SLUG = 'pisek-biochar-a-dalsi-primesi'
const ORIGINAL_TITLE = 'Písek, biochar a další příměsi: jak namíchat půdu pro trávník'

type Node = { type: string; version: number; [key: string]: any }
type Document = { root: { type: string; children: Node[]; direction: 'ltr' | 'rtl' | null; format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''; indent: number; version: number; [key: string]: any }; [key: string]: any }
const txt = (text: string): Node => ({ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const p = (...children: (string | Node)[]): Node => ({ type: 'paragraph', children: children.map((v) => typeof v === 'string' ? txt(v) : v), format: '', indent: 0, direction: 'ltr', textFormat: 0, version: 1 })
const link = (slug: string, label: string): Node => ({ type: 'link', children: [txt(label)], direction: 'ltr', format: '', indent: 0, version: 2, fields: { linkType: 'custom', newTab: false, url: `/posts/${slug}` } })
const block = (fields: Record<string, unknown>): Node => ({ type: 'block', fields, format: '', version: 2 })
const root = (children: Node[]): Document => ({ root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } })
const textOf = (node: Node): string => node.text ?? (node.children ?? []).map(textOf).join('')
const findParagraph = (nodes: Node[], startsWith: string) => {
  const found = nodes.find((n) => n.type === 'paragraph' && textOf(n).startsWith(startsWith))
  if (!found) throw new Error(`Expected paragraph: ${startsWith}`)
  return found
}
const renumberFigures = (nodes: Node[]) => {
  let count = 0
  for (const node of nodes) {
    const fields = node.fields
    if (['split', 'figure'].includes(fields?.blockType) && fields.number) {
      fields.number = String(++count).padStart(2, '0')
      if (fields.blockType === 'figure') fields.blockName = `Obr. ${fields.number}`
    }
  }
}
const faqItem = (question: string, answer: string) => ({ question, answer: root([p(answer)]) })

export function splitProfilePreparationContent(profileContent: unknown, originalContent: unknown) {
  const profile = structuredClone(profileContent) as Document
  const original = structuredClone(originalContent) as Document
  if (!Array.isArray(profile?.root?.children) || !Array.isArray(original?.root?.children)) throw new Error('Expected both Lexical articles')
  const nodes = profile.root.children
  const from = nodes.findIndex((n) => n.fields?.blockType === 'chapter' && n.fields.eyebrow === 'Kapitola 02' && n.fields.title === 'Jak směs připravit a uložit při skutečné práci')
  const to = nodes.findIndex((n, i) => i > from && n.fields?.blockType === 'chapter' && n.fields.eyebrow === 'Kapitola 03')
  if (from < 0 || to < 0 || to - from !== 18) throw new Error('Expected exactly 18 nodes in preparation chapter 02')
  const moved = nodes.slice(from, to)
  moved[0].fields.eyebrow = 'Kapitola 01'
  moved[0].fields.blockName = 'Kapitola 01'
  renumberFigures(moved)
  nodes.splice(from, to - from, p('Samostatný postup přípravy podloží, rovnoměrného míchání, ukládání směsi a kontroly slehnutí najdete v návodu ', link(SLUG, TITLE), '. Po přípravě půdy navážeme výsevem a péčí o mladý trávník.'))
  const seeding = nodes.find((n) => n.fields?.blockType === 'chapter' && n.fields.eyebrow === 'Kapitola 03')
  if (!seeding) throw new Error('Expected seeding chapter 03')
  seeding.fields.eyebrow = 'Kapitola 02'
  seeding.fields.blockName = 'Kapitola 02'
  renumberFigures(nodes)
  const summary = nodes.find((n) => n.fields?.blockType === 'summaryBand')
  if (!summary) throw new Error('Expected profile summary')
  summary.fields.lead = 'Nejdříve zvolíme, jakou půdu chceme připravit. Kalkulátor pak převede plochu, hloubky a podíly na množství materiálů. *Výsledek slouží objednávce; hmotnosti a potřebnou rezervu ověříme podle skutečné dodávky.*'
  const settlingTile = summary.fields.tiles.find((tile: any) => tile.value === '2–6' && tile.unit === 'týdnů')
  if (!settlingTile) throw new Error('Expected settling tile in profile summary')
  Object.assign(settlingTile, { value: '50/100', unit: 'm²', label: 'modelové plochy v přehledech spotřeby' })

  const originalNodes = original.root.children
  const intro = findParagraph(originalNodes, 'V tomto článku si představíme jednotlivé složky')
  intro.children = p('V tomto článku si představíme jednotlivé složky a vysvětlíme, co mohou v půdě změnit. Podíváme se, proč o směsi rozhoduje objem, přestože dodávka přijíždí v tunách, a jak příměsi rozmístit v kořenové vrstvě. Na třech modelových zahradách ukážeme vhodné rozsahy dávek. Výpočet materiálu pro vlastní plochu najdete v článku ', link(PROFILE_SLUG, PROFILE_TITLE), '; práci s připravenou směsí popisuje návod ', link(SLUG, TITLE), '.').children
  const conclusion = findParagraph(originalNodes, 'Tím máme rozhodnuto o složení:')
  conclusion.children = p('Tím máme rozhodnuto o složení: které materiály použít, v jakých podílech a do jaké hloubky. Potřebné množství pro vlastní zahradu a plán dodávky připravíte v článku ', link(PROFILE_SLUG, PROFILE_TITLE), '. Samotným mícháním a ukládáním směsi provede návod ', link(SLUG, TITLE), '.').children
  const cta = originalNodes.find((n) => n.fields?.blockType === 'ctaBand' && n.fields.buttonHref === `/posts/${PROFILE_SLUG}`)
  if (!cta) throw new Error('Expected original article calculator link')
  cta.fields.sub = 'Převeďte zvolené složení na svou plochu a hloubku. Navazující kalkulátor připraví přehled objemů, hmotností a balení pro objednávku materiálů.'

  const preparation = root([
    p('Směs ukládáme do předem připraveného podloží a v každé zóně ji rovnoměrně promícháme. U modelového profilu postupujeme od spodního minerálního základu k horní plné směsi. Před výsevem necháme povrch slehnout a sledujeme, zda se jeho výška ustálila.'),
    p('Výběr složek a modelové hloubky od povrchu dolů popisuje článek ', link(ORIGINAL_SLUG, ORIGINAL_TITLE), '. Potřebné množství pro vlastní plochu spočítá ', link(PROFILE_SLUG, PROFILE_TITLE), '. Zde navazujeme přípravou podloží a skutečnou prací se směsí.'),
    ...moved,
    block({ blockType: 'faq', blockName: 'Časté otázky k přípravě směsi', heading: 'Časté otázky', lead: 'Pořadí ukládání, rovnoměrné promíchání a ustálení povrchu rozhodují o tom, jak připravená směs poslouží kořenům.', items: [
      faqItem('V jakém pořadí ukládat modelový profil?', 'U úplného vytvoření modelového profilu 30 cm nejprve uložíme spodních 15 cm minerálního základu, potom 5 cm směsi se zeolitem a nakonec horních 10 cm plné směsi. V každé zóně jsou příslušné suroviny promíchané. Při úpravě zachované půdy se rozsah práce řídí skutečně zvolenou hloubkou zásahu.'),
      faqItem('Dokončí rovnoměrné promíchání déšť?', 'Ne. Déšť může rozpouštět a přesouvat živiny, ale pevná zrnka zeolitu nebo biocharu rovnoměrně nepromíchá patnáct centimetrů hluboko. Skutečné promíchání ověříme malou sondou.'),
      faqItem('Jak dlouho nechat směs slehnout?', 'Orientačně počítáme s 2–6 týdny, u lehké půdy někdy kolem dvou týdnů. Rozhoduje skutečný stav, nikoli samotný kalendář. Když se výšky ustálí, doladíme nerovnosti a připravíme seťové lůžko.'),
    ] }),
    p('Než naplánujete jednotlivé pracovní dávky a dodávky, připravte si množství materiálu pro svou plochu v článku ', link(PROFILE_SLUG, PROFILE_TITLE), '.'),
  ])
  const withSeeding = moveProfileSeedingContent(profile, preparation)
  return { ...withSeeding, original, movedNodeCount: moved.length + withSeeding.movedNodeCount }
}


/** Move the entire seeding chapter from its title up to, but excluding, the FAQ. */
export function moveProfileSeedingContent(profileContent: unknown, preparationContent: unknown) {
  const profile = structuredClone(profileContent) as Document
  const preparation = structuredClone(preparationContent) as Document
  if (!Array.isArray(profile?.root?.children) || !Array.isArray(preparation?.root?.children)) throw new Error('Expected both Lexical articles')
  const title = 'Několik kilogramů semen nad desítkami tun připravené půdy'
  const profileNodes = profile.root.children
  const preparationNodes = preparation.root.children
  const matches = profileNodes.filter((n) => n.fields?.blockType === 'chapter' && n.fields.title === title)
  if (matches.length !== 1 || preparationNodes.some((n) => n.fields?.title === title)) throw new Error('Expected one seeding chapter in profile and none in preparation')
  const from = profileNodes.indexOf(matches[0])
  const to = profileNodes.findIndex((n, i) => i > from && n.fields?.blockType === 'faq')
  if (to < 0 || to - from !== 11) throw new Error('Expected exactly 11 seeding nodes before the profile FAQ')
  const moved = profileNodes.slice(from, to)
  if (moved.filter((n) => n.fields?.blockType === 'chapter').length !== 1 || moved.filter((n) => n.fields?.drawing === 'prvni-korinek').length !== 1) throw new Error('Unexpected seeding chapter structure')
  const preparationFaq = preparationNodes.findIndex((n) => n.fields?.blockType === 'faq')
  const preparationChapters = preparationNodes.filter((n) => n.fields?.blockType === 'chapter')
  if (preparationFaq < 0 || preparationChapters.length !== 1 || preparationChapters[0].fields.title !== 'Jak směs připravit a uložit při skutečné práci') throw new Error('Expected one preparation chapter followed by its FAQ')
  moved[0].fields.eyebrow = 'Kapitola 02'
  moved[0].fields.blockName = 'Kapitola 02'
  profileNodes.splice(from, moved.length)
  preparationNodes.splice(preparationFaq, 0, ...moved)
  renumberFigures(profileNodes)
  renumberFigures(preparationNodes)

  const reference = findParagraph(profileNodes, 'Samostatný postup přípravy podloží')
  reference.children = p('Samostatný postup přípravy podloží, rovnoměrného míchání, ukládání směsi a kontroly slehnutí najdete v návodu ', link(SLUG, TITLE), '. Stejný návod pokračuje výsevem, závlahou a první péčí o mladý trávník.').children
  const summary = profileNodes.find((n) => n.fields?.blockType === 'summaryBand')
  if (!summary) throw new Error('Expected profile summary')
  summary.fields.blockName = 'Plán od objemu k dodávce'

  const intro = findParagraph(preparationNodes, 'Směs ukládáme do předem připraveného podloží')
  const introText = intro.children?.[0]
  const oldIntro = 'Směs ukládáme do předem připraveného podloží a v každé zóně ji rovnoměrně promícháme. U modelového profilu postupujeme od spodního minerálního základu k horní plné směsi. Před výsevem necháme povrch slehnout a sledujeme, zda se jeho výška ustálila.'
  if (intro.children.length !== 1 || introText?.text !== oldIntro) throw new Error('Unexpected preparation introduction')
  introText.text = 'Směs ukládáme do předem připraveného podloží a v každé zóně ji rovnoměrně promícháme. U modelového profilu postupujeme od spodního minerálního základu k horní plné směsi. Před výsevem necháme povrch slehnout a sledujeme, zda se jeho výška ustálila; poté navážeme výsevem a péčí o mladý trávník.'
  const context = findParagraph(preparationNodes, 'Výběr složek a modelové hloubky od povrchu dolů')
  const contextEnd = context.children?.[context.children.length - 1]
  if (contextEnd?.text !== '. Zde navazujeme přípravou podloží a skutečnou prací se směsí.') throw new Error('Unexpected preparation context')
  contextEnd.text = '. Zde navazujeme přípravou podloží, skutečnou prací se směsí, výsevem a první péčí o trávník.'
  return { profile, preparation, movedNodeCount: moved.length }
}
