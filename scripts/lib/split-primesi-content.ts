/** Shared content split for the local seed and the one-time CMS migration. */
import { splitProfilePreparationContent, PROFILE_META_DESCRIPTION as CURRENT_PROFILE_META_DESCRIPTION } from './split-profile-preparation'
export const ORIGINAL_SLUG = 'pisek-biochar-a-dalsi-primesi'
export const PROFILE_SLUG = 'kalkulator-na-planovani-pudniho-profilu'
export const PROFILE_TITLE = 'Kalkulátor na plánování půdního profilu'
export const ORIGINAL_META_DESCRIPTION = 'Co umí písek, biochar, Actino a zeolit v půdě pro trávník. Porovnejte rozsahy podílů pro tři typy zahrad a zjistěte, do jaké hloubky příměsi patří.'
export const PROFILE_META_DESCRIPTION = CURRENT_PROFILE_META_DESCRIPTION

type Node = { type: string; version: number; [key: string]: any }
type Document = { root: { type: string; children: Node[]; direction: 'ltr' | 'rtl' | null; format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''; indent: number; version: number; [key: string]: any }; [key: string]: any }
const clone = <T>(value: T): T => structuredClone(value)
const txt = (value: string): Node => ({ type: 'text', text: value, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const p = (...children: (string | Node)[]): Node => ({ type: 'paragraph', children: children.map((v) => typeof v === 'string' ? txt(v) : v), format: '', indent: 0, direction: 'ltr', textFormat: 0, version: 1 })
const link = (url: string, label: string): Node => ({ type: 'link', children: [txt(label)], direction: 'ltr', format: '', indent: 0, version: 2, fields: { linkType: 'custom', newTab: false, url } })
const block = (fields: Record<string, unknown>): Node => ({ type: 'block', fields, format: '', version: 2 })
const root = (children: Node[]): Document => ({ root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } })
const textOf = (node: Node): string => node.text ?? (node.children ?? []).map(textOf).join('')
const replaceText = (node: Node, from: string, to: string): void => {
  let replaced = false
  function walk(value: any): void {
    if (!value || typeof value !== 'object') return
    for (const key of Object.keys(value)) {
      if (typeof value[key] === 'string' && value[key].includes(from)) {
        value[key] = value[key].replace(from, to)
        replaced = true
      } else if (typeof value[key] === 'object') walk(value[key])
    }
  }
  walk(node)
  if (!replaced) throw new Error(`Expected continuity text not found: ${from}`)
}
const paragraphStarting = (nodes: Node[], start: string): Node => {
  const node = nodes.find((v) => v.type === 'paragraph' && textOf(v).startsWith(start))
  if (!node) throw new Error(`Expected paragraph not found: ${start}`)
  return node
}
const faqItem = (question: string, answer: string) => ({ question, answer: root([p(answer)]) })

export function splitPrimesiContent(input: unknown) {
  const source = clone(input as Document)
  if (!Array.isArray(source?.root?.children)) throw new Error('Expected Lexical article content')
  const nodes = source.root.children
  const boundary = nodes.findIndex((n) => n.fields?.blockType === 'chapter' && n.fields?.eyebrow === 'Kapitola 05')
  if (boundary < 0) throw new Error('Expected unsplit chapter 05')
  const oldCalc = nodes.filter((n) => n.fields?.blockType === 'calculator')
  if (oldCalc.length !== 1 || oldCalc[0].fields.kind !== 'primesi') throw new Error('Unexpected source calculator')
  const oldFaq = nodes.find((n) => n.fields?.blockType === 'faq')
  if (!oldFaq || oldFaq.fields.items.length !== 5) throw new Error('Unexpected source FAQ')

  const original = nodes.slice(0, boundary).filter((n) => n.fields?.blockType !== 'calculator' && !textOf(n).startsWith('Abyste nemuseli potřebné množství materiálu počítat ručně'))
  const originalIntro = paragraphStarting(original, 'V tomto článku si nejprve')
  originalIntro.children = p('V tomto článku si představíme jednotlivé složky a vysvětlíme, co mohou v půdě změnit. Podíváme se, proč o směsi rozhoduje objem, přestože dodávka přijíždí v tunách, a jak příměsi rozmístit v kořenové vrstvě. Na třech modelových zahradách ukážeme vhodné rozsahy dávek. Výpočet materiálu pro vlastní plochu a navazující postup práce najdete v článku ', link(`/posts/${PROFILE_SLUG}`, PROFILE_TITLE), '.').children
  const charge = original.find((n) => n.fields?.drawing === 'nabity-biochar')!
  replaceText(charge, 'Přesný postup ukážeme až při plánování potřebného množství.', `Přesný postup najdete v navazujícím článku [${PROFILE_TITLE}](/posts/${PROFILE_SLUG}).`)
  const myco = paragraphStarting(original, 'Mykorhizní přípravek má vlastní dávku podle plochy.')
  replaceText(myco, 'Tu uvedeme na konci této kapitoly; celkovou spotřebu spočítáme v další části.', 'Pravidla pro její volbu shrnujeme na konci této kapitoly; spotřebu pro vlastní plochu pak spočítáte v navazujícím kalkulátoru půdního profilu.')
  const finalOriginal = paragraphStarting(original, 'Tím máme rozhodnuto o složení:')
  finalOriginal.children = p('Tím máme rozhodnuto o složení: které materiály použít, v jakých podílech a do jaké hloubky. Potřebné množství pro vlastní zahradu, plán dodávky i postup míchání a uložení navazuje v článku ', link(`/posts/${PROFILE_SLUG}`, PROFILE_TITLE), '.').children
  const originalFaq = clone(oldFaq)
  originalFaq.fields.items = [0, 1, 2, 4].map((i) => clone(oldFaq.fields.items[i]))
  originalFaq.fields.lead = 'Poměr volíme podle konkrétní půdy a jednotlivé příměsi rozmisťujeme podle jejich úlohy. Biochar předem obohatíme živinami; mykorhizní přípravek dávkujeme podle jeho návodu.'
  original.push(originalFaq, block({ blockType: 'ctaBand', blockName: 'Od receptury k vlastní ploše', title: 'Poměr už znáte. Kolik materiálu připravit?', sub: 'Převeďte zvolené složení na svou plochu a hloubku. Navazující kalkulátor připraví přehled materiálů a článek provede mícháním, uložením i výsevem.', buttonLabel: 'Otevřít kalkulátor půdního profilu', buttonHref: `/posts/${PROFILE_SLUG}`, ask: 'Kterou vlastnost vaší půdy má navržená směs zlepšit?' }))

  const moved = nodes.slice(boundary)
  let chapterNumber = 0
  let figureNumber = 0
  for (const n of moved) {
    if (n.fields?.blockType === 'chapter') {
      chapterNumber += 1
      n.fields.eyebrow = `Kapitola ${String(chapterNumber).padStart(2, '0')}`
      n.fields.blockName = n.fields.eyebrow
    }
    if (['split', 'figure'].includes(n.fields?.blockType) && n.fields.number) {
      figureNumber += 1
      n.fields.number = String(figureNumber).padStart(2, '0')
      if (n.fields.blockType === 'figure') n.fields.blockName = `Obr. ${n.fields.number}`
    }
  }
  if (chapterNumber !== 3 || figureNumber !== 4) throw new Error('Unexpected chapter or figure count')
  const opening = paragraphStarting(moved, 'Teprve teď má smysl počítat objednávku.')
  replaceText(opening, 'Teprve teď má smysl počítat objednávku. Už víme, kterou vlastnost půdy chceme upravit, které složky použijeme a kam mají přijít.', 'Objednávku počítáme až poté, co víme, kterou vlastnost půdy chceme upravit, které složky použijeme a kam mají přijít.')
  replaceText(paragraphStarting(moved, 'Pro převod potřebujeme sypnou hustotu,'), 'Pro převod potřebujeme sypnou hustotu, se kterou jsme se setkali při srovnání jedné tuny písku a zeminy. Do objemu zahrnuje i mezery mezi částicemi.', 'Pro převod potřebujeme sypnou hustotu: hmotnost určitého objemu volně nasypaného materiálu. Do tohoto objemu zahrnujeme i mezery mezi částicemi.')
  replaceText(paragraphStarting(moved, 'Následující tabulky převádějí uvedená rozmezí'), 'Následující tabulky převádějí uvedená rozmezí', 'Následující tabulky převádějí modelová rozmezí z navazujícího článku o příměsích')
  replaceText(paragraphStarting(moved, 'U hlíny s nedostatkem organické hmoty jsme připustili'), 'U hlíny s nedostatkem organické hmoty jsme připustili variantu', 'U hlíny s nedostatkem organické hmoty lze zvážit variantu')
  replaceText(paragraphStarting(moved, 'Mykorhizní přípravek počítáme podle plochy'), 'při použití uvedeného TurfCompu', 'při použití přípravku TurfComp')
  replaceText(paragraphStarting(moved, 'Pokud jsme se pro mykorhizní přípravek rozhodli,'), 'Pro uvedený TurfComp výrobce', 'Pro přípravek TurfComp výrobce')
  replaceText(paragraphStarting(moved, 'Vraťme se ke dvěma zahradám po dešti.'), 'Vraťme se ke dvěma zahradám po dešti. Na každé jsme potřebovali změnit něco jiného, přesto jsme pracovali se stejnými druhy surovin.', 'Po dešti se rozdíly mezi zahradami znovu ukážou. Na každé potřebujeme změnit něco jiného, i když pracujeme se stejnými druhy surovin.')
  const newFaq = moved.find((n) => n.fields?.blockType === 'faq')!
  newFaq.fields.lead = 'Výpočet převádí vybranou recepturu na konkrétní plochu. Objem příměsí ubíráme z minerálního základu, hmotnost ověřujeme u dodavatele a skutečné slehnutí kontrolujeme při práci.'
  newFaq.fields.items = [
    clone(oldFaq.fields.items[3]),
    faqItem('Je původní zemina ve výsledku materiál, který musím koupit?', 'Ne. Řádek s původní zeminou ukazuje její podíl ve směsi. Pokud je použitelná a zůstává na zahradě, jde o zachovanou zeminu. Kalkulátor rozlišuje zachování půdy, promíchání s původní zeminou a vytvoření nového profilu. Podle zvoleného režimu uvádí ponechání, dovoz nebo odvoz zeminy. Volba režimu musí odpovídat skutečnému zásahu a cílové výšce povrchu.'),
    faqItem('Proč je hmotnost materiálu jen orientační?', 'Převod z objemu na hmotnost závisí na sypné hustotě a vlhkosti dodávky. Proto používáme údaje konkrétního dodavatele. Zejména předem navlhčený nebo kompostem obohacený biochar může mít jiné vlastnosti než suchý materiál ve výpočetním příkladu.'),
    faqItem('Mám automaticky přidat rezervu na slehnutí?', 'Součet vstupních objemů nezaručuje stejný objem po promíchání a uložení. Výšku kontrolujeme při realizaci a případnou rezervu domluvíme podle konkrétních materiálů a způsobu práce. Vedeme ji odděleně od poměru složek, aby nezměnila zamýšlenou recepturu.'),
    clone(oldFaq.fields.items[4]),
  ]
  const profile = [
    block({ blockType: 'calculator', blockName: PROFILE_TITLE, kind: 'pudni-profil', surface: 'band', layout: 'axis' }),
    block({ blockType: 'summaryBand', blockName: 'Plán od objemu po výsev', lead: 'Nejdříve zvolíme, jakou půdu chceme připravit. Kalkulátor pak převede plochu, hloubky a podíly na množství materiálů. *Při práci hlídáme také skutečné promíchání, odtok vody a slehnutí povrchu.*', tiles: [{ value: 'm³', label: 'objemy surovin pro zvolený profil' }, { value: 't', label: 'hmotnosti podle sypných hustot' }, { value: '3', unit: 'zóny', label: 'navazující kořenové prostředí' }, { value: '2–6', unit: 'týdnů', label: 'orientační čas na slehnutí' }] }),
    p('Kalkulátor slouží k plánování založení nebo výraznější obnovy trávníku. Výklad níže navazuje na článek ', link(`/posts/${ORIGINAL_SLUG}`, 'Písek, biochar a další příměsi: jak namíchat půdu pro trávník'), ', kde najdete účel materiálů, modelové rozsahy dávek a podmínky pro jílovitou, hlinitou a písčitou zahradu. Nejprve vybereme vhodné složení; čísla ve výpočtu pak pomáhají naplánovat dodávku a práci.'),
    p('Příklady v článku počítají s profilem 30 cm: horních 10 cm obsahuje plnou směs, v zóně 10–15 cm zůstává zeolit a spodních 15 cm tvoří minerální základ. U jílovité varianty dělíme tento základ objemově 65/35 mezi písek a původní zeminu, u hlinité 30/70 a u písčité další písek nepřidáváme. Jde o modely k porovnání, nikoli povinnou hloubku výkopu nebo univerzální recept. Kalkulátor umožňuje přizpůsobit zvolenou hloubku a poměry skutečné zahradě.'),
    ...moved,
  ]
  const final = splitProfilePreparationContent(
    { ...source, root: { ...source.root, children: profile } },
    { ...source, root: { ...source.root, children: original } },
  )
  return { ...final, preparationMovedNodeCount: final.movedNodeCount, movedNodeCount: moved.length, profileHero: moved.find((n) => n.fields?.blockType === 'figure')?.fields?.image }
}
