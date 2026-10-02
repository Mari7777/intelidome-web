import { BLEED, BLEED_AFTER, RHYTHM_SECTIONS } from './preparation-rhythm-content'
import { PREPARATION_TITLE as SPLIT_PREPARATION_TITLE, PREPARATION_META } from './split-preparation-seeding'
/** Extract preparation and seeding chapters; adapt the soil-mixing method for practical work. */
// The historical layout checks compare this label before final link rewriting.
export const TITLE = 'Jak připravit a uložit směs'
export const SLUG = 'jak-pripravit-a-ulozit-smes'
export const META_DESCRIPTION = PREPARATION_META.description
export const PROFILE_META_DESCRIPTION = 'Spočítejte materiály pro půdní profil trávníku podle plochy, hloubky a poměrů směsi. Porovnejte objemy, hmotnosti a balení pro plánování dodávky.'
export const PREPARATION_TITLE = SPLIT_PREPARATION_TITLE
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


/** Replace the theoretical bottom-up layering with feasible work on site. */
export function revisePracticalSoilMixing(input: unknown): Document {
  const preparation = structuredClone(input) as Document
  const nodes = preparation?.root?.children
  if (!Array.isArray(nodes)) throw new Error('Expected preparation article content')
  const oldSplitIndex = nodes.findIndex((n) => n.fields?.blockType === 'split' && n.fields.drawing === 'ukladani-odspodu')
  if (oldSplitIndex < 0 || nodes.filter((n) => n.fields?.drawing === 'ukladani-odspodu').length !== 1) {
    throw new Error('Expected exactly one obsolete bottom-up illustration')
  }

  /* Partitura 8.1 p. 4: po obsidianovém hero přijde krémový souhrn, ne holá
     próza nalepená na hranu hera (porota kola 01 článku). */
  const intro = findParagraph(nodes, 'Směs ukládáme do předem připraveného podloží')
  nodes.splice(nodes.indexOf(intro), 1, block({ blockType: 'summaryBand', blockName: 'Od podloží po první seč', lead: 'Směs pro trávník připravujeme v navazujících pracovních krocích. Zeminu a případný písek nejprve promícháme v plánované hloubce profilu; zeolit a další příměsi zapravíme následně jen tak hluboko, jak určuje receptura. *Před výsevem necháme povrch slehnout a sledujeme, zda se jeho výška ustálila.*', tiles: [{ value: '30', unit: 'cm', label: 'hloubka modelového profilu' }, { value: '2–6', unit: 'týdnů', label: 'orientační čas na slehnutí' }, { value: '25–30', unit: 'g/m²', label: 'osiva při výsevu' }, { value: '8–10', unit: 'cm', label: 'výška trávy při první seči' }] }))
  findParagraph(nodes, 'U větší plochy pracujeme s dodávkami').children = p('Na větší zahradě přivážíme materiál v tunách a kubických metrech. Rozdělíme plochu na zvládnutelné pracovní úseky a pro každý rozprostřeme přibližný podíl zeminy a písku podle zvolené receptury. Tak udržíme podobnou směs na celé ploše. Když nemáme prostor pro všechny hromady najednou, mohou stejně navazovat i jednotlivé dodávky.' ).children
  findParagraph(nodes, 'Předem si proto ujasníme').children = p('Objednávka stále vychází z objemových poměrů a přepočtu podle sypných hustot dodavatele. V terénu stačí rozdělit plánované množství mezi pracovní úseky, vysypat jej rovnoměrně a promíchat. Nemusíme na milimetr vyznačovat hranice zón ani řešit malé odchylky v mnohatunové dodávce; důležité je nenechat všechen písek nebo zeolit jen v jednom místě. Vážní lístek pomáhá kontrolovat dodanou hmotnost, nikoli přesný objem v půdě.' ).children
  /* Postup míchání nese vlastní kresbu v krémovém splitu: kapitola bez
     figury a 6,5 tisíce px bílé na telefonu (8.1 p. 3, 9.2 p. 8). Strana
     obrazu vpravo, protože další split „První kořínek" má obraz vlevo.
     Shrnující čtvrtý odstavec stojí až za pásem: v těle splitu by text
     přerostl kresbu o 40 % a pod kresbou zůstala díra. */
  nodes.splice(oldSplitIndex, 1, block({
    blockType: 'split',
    blockName: 'Míchání od hloubky',
    surface: 'krem',
    side: 'image-right',
    drawing: 'michani-od-hloubky',
    titleLevel: 'h3',
    title: 'Nejprve promíchat minerální základ, potom příměsi mělčeji',
    number: '01',
    alt: 'Tři řezy profilem 30 cm pod sebou. Nejprve je celý profil promíchaný ze zeminy a písku, ve druhém kroku přibude zeolit v horních 15 cm, ve třetím biochar a Actino v horních 10 cm. Pod řezy upozornění, že se potom už nefrézuje do hloubky, jinak by se příměsi rozešly do celých 30 cm.',
    caption: 'Každý průchod jde mělčeji: základ promícháme v celých 30 cm, zeolit u výchozího příkladu kalkulátoru do 15 cm, biochar a Actino jen do horních 10 cm.',
    body: [
      'Nejprve postupujeme podle zvoleného režimu: při udržení výšky odebereme vypočtené množství původní zeminy, při zapravení ji ponecháme a pro novou vrstvu připravíme dováženou zeminu. Pokud receptura obsahuje písek, rozložíme jej rovnoměrně po pracovních úsecích a promícháme se zeminou v plánované hloubce profilu – u zdejšího modelu přibližně 30 cm. Rotavátor může pomoci, ale běžný zahradní stroj často nepromíchá celých 30 cm jediným průjezdem. Potřebnou hloubku ověříme podle stroje a stavu půdy; při větší hloubce použijeme odpovídající mechanizaci nebo jiný způsob promíchání. Samotné prokypření podloží neznamená, že se do něj písek skutečně dostal.',
      'Teprve po promíchání minerálního základu rozprostřeme zeolit po ploše. Zapravíme jej mělčeji, do hloubky zadané v receptuře: třeba přibližně do horních 20 cm, pokud s nimi výpočet počítá. Výchozí jílovitý příklad kalkulátoru používá 15 cm; rozhodnete-li se pro 20 cm, změňte hloubku v kalkulátoru ještě před objednávkou. Pro mělčí přejezd nastavíme pracovní hloubku rotavátoru podle stroje. Rychlejší pojezd může promíchání omezit, ale sám nezaručí, že zeolit neskončí v celých 30 cm.',
      'Nakonec rovnoměrně rozprostřeme biochar a případné Actino (dříve Biovin), pokud je receptura řadí do horních 10 cm. Hráběmi je zapravíme do povrchové části; mají-li být promíchané skutečně v celých 10 cm, pomůže mělké ruční prokypření nebo stroj nastavený na tuto hloubku. Hrábě samy deset centimetrů spolehlivě nepromíchají. Po tomto kroku se nevracíme k hlubokému frézování, které by mělčí příměsi rozneslo po celém profilu.',
    ].join('\n\n'),
  }), p('Stejný sled platí pro každou zvolenou směs: nejhlouběji promícháme složky jejího minerálního základu, další příměsi přidáváme podle jejich vlastní hloubky od hlubší k mělčí. Rozprostíráme je postupně po úsecích, nikoli v čistých patrech. Rýčem nebo malou sondou na několika místech orientačně zkontrolujeme, zda ve směsi nezůstaly hromádky a zda příměsi nejsou zbytečně rozptýlené až na dno. Přesnost na milimetry nepotřebujeme. Déšť za nás pevná zrnka do potřebné hloubky nepromíchá.'))
  const faq = nodes.find((n) => n.fields?.blockType === 'faq' && n.fields.items?.[0]?.question === 'V jakém pořadí ukládat modelový profil?')
  if (!faq) throw new Error('Expected original preparation FAQ')
  faq.fields.lead = 'Základ promíchejte v plánované hloubce a příměsi přidávejte postupně od hlubšího zapravení k mělčímu. Kontrolujte rovnoměrnost, ne milimetrové hranice.'
  faq.fields.items[0] = faqItem('Musím půdní profil stavět z přesných vrstev?', 'Ne. Zeminu a případný písek promíchejte v plánované hloubce; na modelových 30 cm může být potřeba odpovídající stroj nebo jiný postup než jeden přejezd běžným rotavátorem. Pak zapravte zeolit jen do hloubky zvolené v kalkulátoru a biochar či Actino do mělké horní části. Materiál rozprostírejte po pracovních úsecích přibližně rovnoměrně, bez odměřování po kbelících.')
  faq.fields.items[1] = faqItem('Dokončí rovnoměrné promíchání déšť?', 'Ne. Déšť může přesouvat rozpuštěné látky, ale pevná zrnka zeolitu nebo biocharu rovnoměrně nepromíchá do zadané hloubky. Po práci zkontrolujte několik míst malou sondou.')
  for (const node of nodes) for (const child of node.children ?? []) {
    if (child.type === 'link' && child.fields?.url === `/posts/${PROFILE_SLUG}` && child.children?.[0]?.text === PROFILE_TITLE) {
      child.children[0].text = 'Kalkulátor půdy pod trávník'
    }
  }
  /* Závěr série je CTA pás (8.2 ř. N+2), ne osiřelý odstavec mezi FAQ
     a Souvisejícími články. */
  const closing = findParagraph(nodes, 'Než naplánujete jednotlivé pracovní dávky')
  nodes.splice(nodes.indexOf(closing), 1, block({ blockType: 'ctaBand', blockName: 'Od postupu k vlastní ploše', title: 'Kolik materiálu objednat na vaši plochu?', sub: 'Kalkulátor půdy převede plochu, hloubku a zvolenou směs na množství zeminy, písku a příměsí. S výsledkem naplánujete dodávky i pracovní úseky.', buttonLabel: 'Otevřít kalkulátor půdy', buttonHref: `/posts/${PROFILE_SLUG}`, ask: 'A otázka na závěr: víte, jak hluboko váš stroj skutečně promíchá?' }))
  renumberFigures(nodes)
  return preparation
}


const bezZnacek = (text: string) =>
  text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '').replace(/^### /, '').replace(/[\u2013\u2014]/g, '–').replace(/\s+/g, ' ').trim()

/**
 * Rytmus obraz/text (2026-09-23): vše mezi krémovým souhrnem a FAQ se
 * nahradí dvousloupci z `preparation-rhythm-content.ts` a jedním předělem
 * přes celou šířku. Text se nesmí změnit — bloky se přestaví jen tehdy,
 * když odstraněný obsah dává znak po znaku týž text jako nový (bez značek).
 */
export function applyPreparationRhythm(input: unknown): Document {
  const doc = structuredClone(input) as Document
  const nodes = doc?.root?.children
  if (!Array.isArray(nodes)) throw new Error('Expected preparation article content')
  const start = nodes.findIndex((n) => n.fields?.blockType === 'summaryBand')
  const end = nodes.findIndex((n) => n.fields?.blockType === 'faq')
  if (start < 0 || end <= start) throw new Error('Expected the summary band before the FAQ')

  // Text a nadpisy se kontrolují zvlášť: plán smí přesunout úvodní odstavec
  // za titulek kapitoly, ale nesmí změnit slovo ani pořadí vět či nadpisů.
  const puvodniText: string[] = []
  const puvodniNadpisy: string[] = []
  const alty: Record<string, string> = {}
  for (const n of nodes.slice(start + 1, end)) {
    const f = n.fields
    if (f?.blockType === 'chapter') puvodniNadpisy.push(f.title)
    else if (f?.blockType === 'split') {
      if (f.title) puvodniNadpisy.push(f.title)
      puvodniText.push(...String(f.body).split(/\n{2,}/))
      if (f.drawing && f.alt) alty[f.drawing] = f.alt
    } else if (n.type === 'heading') puvodniNadpisy.push(textOf(n))
    else if (n.type === 'paragraph') puvodniText.push(textOf(n))
    else throw new Error(`Unexpected node between the summary and the FAQ: ${f?.blockType ?? n.type}`)
  }
  const novyText: string[] = []
  const noveNadpisy: string[] = []
  for (const s of RHYTHM_SECTIONS) {
    if (s.title) noveNadpisy.push(s.title)
    for (const odstavec of s.body) (odstavec.startsWith('### ') ? noveNadpisy : novyText).push(odstavec)
  }
  for (const [co, stare, nove] of [['text', puvodniText, novyText], ['nadpisy', puvodniNadpisy, noveNadpisy]] as const) {
    const a = stare.map(bezZnacek).join(' ')
    const b = nove.map(bezZnacek).join(' ')
    if (a !== b) {
      let i = 0
      while (i < a.length && a[i] === b[i]) i++
      throw new Error(`Rhythm ${co} differ from the article at ${i}: „${a.slice(i, i + 60)}" vs „${b.slice(i, i + 60)}"`)
    }
  }

  const bloky: Node[] = []
  for (const s of RHYTHM_SECTIONS) {
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
    if (s.id === BLEED_AFTER) {
      bloky.push(block({ blockType: 'figure', blockName: 'Obr. 01', __filename: BLEED.filename, number: '01', caption: BLEED.caption, panel: false, layout: 'bleed' }))
    }
  }
  nodes.splice(start + 1, end - start - 1, ...bloky)
  renumberFigures(nodes)
  return doc
}

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
  return { ...withSeeding, preparation: applyPreparationRhythm(revisePracticalSoilMixing(withSeeding.preparation)), original, movedNodeCount: moved.length + withSeeding.movedNodeCount }
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
