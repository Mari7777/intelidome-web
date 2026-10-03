import type { Locale } from './config'

/**
 * Slovník UI řetězců webu (ADR-008, A11). Čistý modul bez env a bez
 * Payloadu — smí ho importovat server i klient. Čeština je úplná a její
 * hodnoty jsou byte-identické s dnešním výstupem (zlatý snímek); ostatní
 * jazyky jsou `Partial` a padají na češtinu, dokud překlad nevznikne.
 *
 * Hodnota smí být funkce (české tvary podle čísla): `t(locale, 'hero.reading')(min)`.
 * Obsah (Kapitola, kalkulátory, SVG figury, texty z CMS) sem NEPATŘÍ.
 */

/** 1 kalkulátor · 2–4 kalkulátory · 5+ kalkulátorů */
const kalkulatorySlovo = (pocet: number): string => {
  if (pocet === 1) return 'kalkulátor'
  if (pocet < 5) return 'kalkulátory'
  return 'kalkulátorů'
}

/** České tři tvary: 1 článek / 2–4 články / 5+ článků. */
const tvar = (pocet: number, jeden: string, malo: string, hodne: string): string =>
  pocet === 1 ? jeden : pocet >= 2 && pocet <= 4 ? malo : hodne

/** Hodnota slotu: řetězec, nebo funkce vracející řetězec (tvary podle čísla). */
type Hodnota = string | ((...args: never[]) => string)

const cs = {
  // Hlavička (7.1)
  'nav.aria': 'Hlavní navigace',
  'nav.search': 'Hledat',
  'nav.cta': 'Objevit systém',
  // Odkaz sekce v kapsli (7.1) a v patičce (7.13), ADR-009
  'nav.magazin': 'Magazín',
  'logo.aria': 'InteliDome — domovská stránka',

  // Patička (7.13)
  'footer.nav': 'Navigace v patičce',
  'footer.rss': 'RSS',

  // Přepínač jazyků (A20)
  'lang.aria': 'Přepínač jazyků',

  // Hero článku (8.2 ř. 1)
  'hero.eyebrow': 'Návody · Závlaha',
  'hero.reading': (min: number) => `${min} min čtení`,
  'hero.calculators': (n: number) => `${n} ${kalkulatorySlovo(n)}`,
  'hero.skip': 'Přejít na článek',

  // Navigace článku (drobenka, meta, obsah)
  'article.breadcrumb': 'Drobečková navigace',
  'article.publisher': 'Vydává InteliDome',
  'article.updated': 'Aktualizováno',
  'article.toc': 'V článku',
  'article.tocAria': 'Obsah článku',

  // Figury (7.12), FAQ, související, složky
  'figure.label': 'Obr.',
  'faq.heading': 'Časté otázky',
  'faq.eyebrow': 'Otázky a\u00a0odpovědi', // pevná mezera = HEAD `a&nbsp;odpovědi`
  'related.heading': 'Související články',
  'ingredients.item': (i: number) => `Složka ${i}`,

  // Produktový pás — popis schématu pro odečítač
  'productBand.node.cidlo': 'čidlo vlhkosti',
  'productBand.node.ventil': 'ventil',
  'productBand.node.nadrz': 'retenční nádrž',
  'productBand.node.svetlo': 'venkovní osvětlení',
  'productBand.figureAlt': (vycet: string) =>
    `Schéma sítě: most uprostřed, kolem něj ${vycet}; aktivní spoj vede k ventilu.`,

  // Hledání
  'search.heading': 'Hledání',
  'search.field': 'Hledat',
  'search.empty': 'Nic jsme nenašli.',

  // Domovská stránka článků — ADR-009 bod 6: sekce se jmenuje „Magazín“
  'posts.title': 'Magazín',
  'posts.page': (n: string) => `Magazín — strana ${n}`,
  'posts.metaTitle': 'Magazín o půdě, trávníku a chytré závlaze',
  'posts.metaDescription':
    'Návody k půdě, trávníku a závlaze: rozbor půdy, míchání směsi, setí i automatická závlaha. S kalkulátory, které si přepočítáte na vlastní zahradu.',
  'posts.pageDescription': (n: string) =>
    `Všechny články magazínu InteliDome o půdě, trávníku a chytré závlaze, od nejnovějšího. Strana ${n}.`,
  'magazin.nazev': 'Magazín InteliDome',
  // Domovská stránka magazínu (DESIGN.md 8.5)
  'magazin.lead':
    'Půda, trávník a závlaha vysvětlené do hloubky: postupy s čísly, kresbami a kalkulátory, které si přepočítáte pro svou zahradu.',
  'magazin.mapaAria': 'Obsah magazínu',
  'magazin.mapaLabel': 'V magazínu',
  'magazin.novinkaLabel': 'Naposledy přidáno',
  'magazin.serie': (n: number) => `Série · ${n} ${tvar(n, 'díl', 'díly', 'dílů')}`,
  'magazin.tema': (n: number) => `Téma · ${n} ${tvar(n, 'článek', 'články', 'článků')}`,
  'magazin.cteniCelkem': (min: number) =>
    min < 60 ? `${min} min čtení` : `${Math.floor(min / 60)} h${min % 60 ? ` ${min % 60} min` : ''} čtení`,
  'magazin.dil': (k: number, z: number) => `Díl ${k} z ${z}`,
  'magazin.dilKratce': (k: number) => `díl ${k}`,
  'magazin.zacnete': 'Začněte tady',
  'magazin.kalkulator': (n: number) => (n === 1 ? 'Kalkulátor' : `${n} ${kalkulatorySlovo(n)}`),
  'magazin.vsechny': 'Všechny články',
  'magazin.vsechnyOdkaz': 'Všechny články v magazínu',
  'magazin.vsechnyPopis': (n: number) => `${n} ${tvar(n, 'článek', 'články', 'článků')}, od nejnovějšího`,
  'magazin.vsechnyRozsah': (od: number, doN: number, celkem: number) => `Články ${od}–${doN} z ${celkem}, od nejnovějšího`,
  'magazin.prazdno': 'Zatím tu nejsou žádné články.',
  'magazin.strana': (n: number, z: number) => `Strana ${n} z ${z}`,
  'magazin.strankovaniAria': 'Stránkování magazínu',
  'magazin.novejsi': 'Novější články',
  'magazin.starsi': 'Starší články',
  'magazin.stranaAria': (n: number) => `Strana ${n}`,
  'magazin.kalkulatory': 'Kalkulátory',
  'magazin.kalk.titulek': 'Spočítejte si to pro svou zahradu',
  'magazin.kalk.lead': 'Každý kalkulátor se otevře přímo v článku, vedle textu, který vysvětluje, co výsledek znamená.',
  'magazin.kalk.zdroj': (titulek: string) => `V článku ${titulek}`,
  'magazin.cta.titulek': 'Trávník založíte jednou. Zalévat ho budete roky.',
  'magazin.cta.sub':
    'InteliDome zalévá podle vlhkosti půdy, ne podle hodin: čidla měří u kořenů a ventil pustí vodu jen do zóny, která ji potřebuje.',

  // 404
  'notFound.text': 'Tahle stránka neexistuje.',
  'notFound.back': 'Zpět na úvod',

  // Formulář (plugin form-builder) — dnešní anglické hlášky, hodnoty NEMĚNIT (DOM)
  'form.loading': 'Loading, please wait...',
  'form.error': 'Something went wrong.',

  // SEO / metadata / RSS
  'seo.siteTitle': 'InteliDome — chytrá závlaha a automatizace zahrady',
  'seo.siteDescription':
    'Návody a praxe kolem chytré závlahy: návrh systému, kapková závlaha, zazimování a automatizace zahrady. Magazín značky InteliDome.',
  'seo.ogDescription': 'Chytrá závlaha a automatizace zahrady — návody, plánování a praxe.',
  'seo.breadcrumbHome': 'Úvod',
  'seo.breadcrumbPosts': 'Magazín',
  'rss.title': 'InteliDome — Magazín',
  'rss.description': 'Návody a praxe kolem chytré závlahy a automatizace zahrady.',
} satisfies Record<string, Hodnota>
// `satisfies` místo `as const`: klíče zůstanou přesné, řetězce se rozšíří na
// `string` (jinak by `Partial<Slovnik>` ostatních jazyků přijal jen český literál)
// a signatury funkcí zůstanou zachované.

/** Tvar slovníku — překlad jazyka je `Partial<Slovnik>`. */
export type Slovnik = typeof cs
export type UiKlic = keyof Slovnik

/** Ostatní jazyky: prázdné, dokud překlad nevznikne (fallback na cs). */
const jazyky: Partial<Record<Locale, Partial<Slovnik>>> = {
  en: {},
  de: {},
  hu: {},
  pl: {},
  es: {},
  it: {},
}

/** Řetězec (nebo funkce) UI pro jazyk; chybějící překlad padá na češtinu. */
export const t = <K extends UiKlic>(locale: Locale, key: K): Slovnik[K] =>
  (jazyky[locale]?.[key] ?? cs[key]) as Slovnik[K]
