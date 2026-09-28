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
  'logo.aria': 'InteliDome — domovská stránka',

  // Patička (7.13)
  'footer.nav': 'Navigace v patičce',

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

  // Stránkování a rozsah výpisu
  'pagination.prev': 'Předchozí',
  'pagination.prevAria': 'Přejít na předchozí stranu',
  'pagination.next': 'Další',
  'pagination.nextAria': 'Přejít na další stranu',
  'pagination.more': 'Další strany',
  'pageRange.shown': (start: number, end: number, total: number, noun: string) =>
    `Zobrazeno ${start}${start > 0 ? `–${end}` : ''} z ${total} ${noun}`,
  'pageRange.posts': (n: number) => tvar(n, 'článek', 'články', 'článků'),
  'pageRange.items': (n: number) => tvar(n, 'záznam', 'záznamy', 'záznamů'),

  // Hledání
  'search.heading': 'Hledání',
  'search.field': 'Hledat',
  'search.empty': 'Nic jsme nenašli.',

  // Výpis článků
  'posts.title': 'Blog',
  'posts.page': (n: string) => `Články — strana ${n}`,
  'posts.metaTitle': 'Články o půdě, trávníku a chytré závlaze',
  'posts.metaDescription':
    'Praktické návody pro přípravu půdy, založení trávníku a chytrou závlahu. Výběr příměsí, kalkulátor množství a postup práce na zahradě.',

  // 404
  'notFound.text': 'Tahle stránka neexistuje.',
  'notFound.back': 'Zpět na úvod',

  // Formulář (plugin form-builder) — dnešní anglické hlášky, hodnoty NEMĚNIT (DOM)
  'form.loading': 'Loading, please wait...',
  'form.error': 'Something went wrong.',

  // SEO / metadata / RSS
  'seo.siteTitle': 'InteliDome — chytrá závlaha a automatizace zahrady',
  'seo.siteDescription':
    'Návody a praxe kolem chytré závlahy: návrh systému, kapková závlaha, zazimování a automatizace zahrady. Blog značky InteliDome.',
  'seo.ogDescription': 'Chytrá závlaha a automatizace zahrady — návody, plánování a praxe.',
  'seo.breadcrumbHome': 'Úvod',
  'seo.breadcrumbPosts': 'Články',
  'rss.title': 'InteliDome — blog',
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
