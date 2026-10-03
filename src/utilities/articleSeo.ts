import type { Post } from '@/payload-types'
import { absoluteSiteURL, getServerSideURL } from './getURL'
import { readingTime } from './readingTime'
import { slugify } from './slugify'
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config'
import { cestaMagazinu, lokalizujCestu, verejnaCesta } from '@/i18n/routing'
import { t } from '@/i18n/ui'

/** Only headings rendered with stable anchors by Chapter/Split enter navigation. */
export function getArticleSections(content: Post['content']) {
  const sections: { title: string; id: string; group?: string; autoGroup?: boolean }[] = []
  for (const node of content.root.children) {
    const fields = node.fields as { blockType?: string; title?: string; titleLevel?: string; tocGroup?: string | null; eyebrow?: string | null } | undefined
    if (!fields || !['chapter', 'split'].includes(fields.blockType || '') || fields.titleLevel === 'h3') continue
    const title = fields.title?.trim()
    if (!title) continue
    const id = slugify(title)
    // `group` nese jen první kapitola skupiny (pole tocGroup dvousloupce).
    const group = fields.tocGroup?.trim()
    // Servisní kapitola (blok chapter s nadřádkem jiným než „Kapitola NN“, např.
    // „Podklady“) nepatří do poslední obsahové skupiny – dostane vlastní.
    const auto = !group && fields.blockType === 'chapter' && fields.eyebrow && !/^kapitola/i.test(fields.eyebrow) ? fields.eyebrow.trim() : undefined
    if (id && !sections.some((section) => section.id === id)) {
      sections.push({ title, id, ...(group ? { group } : auto ? { group: auto, autoGroup: true } : {}) })
    }
  }
  return sections
}

/**
 * Schema mirrors the article, visible dates, publisher and breadcrumb navigation.
 * `locale` řídí adresu (`/en/magazin/x`), `inLanguage` a lokalizovanou drobenku;
 * `preklady` (≥ 2, s aktuálním jazykem) přidá u cs `workTranslation` na překlady,
 * u překladu `translationOfWork` na český originál. Texty drobenky ze
 * slovníku UI (`t`). Organization @id je globální.
 */
export function articleJsonLd(
  post: Post,
  { locale = DEFAULT_LOCALE, preklady = [DEFAULT_LOCALE] }: { locale?: Locale; preklady?: readonly Locale[] } = {},
) {
  const base = getServerSideURL()
  const slug = post.slug ?? ''
  const url = absoluteSiteURL(verejnaCesta('posts', slug, locale))
  const ostatni = preklady.length >= 2 && preklady.includes(locale) ? preklady.filter((kod) => kod !== locale) : []
  const prekladOdkaz = (kod: Locale) => {
    const prekladUrl = absoluteSiteURL(verejnaCesta('posts', slug, kod))
    return { '@type': 'BlogPosting', '@id': `${prekladUrl}#article`, url: prekladUrl, inLanguage: kod }
  }
  const hero = post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null
  const authors = (post.populatedAuthors ?? []).map((author) => author?.name?.trim()).filter(Boolean)
  const minutes = readingTime(post.content)
  const categories = (post.categories ?? []).flatMap((category) => typeof category === 'object' && category.title ? [category.title] : [])
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        url,
        headline: post.title,
        description: post.meta?.description || undefined,
        image: hero?.url ? [{
          '@type': 'ImageObject', url: absoluteSiteURL(hero.url),
          width: hero.width || undefined, height: hero.height || undefined,
        }] : undefined,
        datePublished: post.publishedAt || undefined,
        dateModified: post.updatedAt,
        inLanguage: locale,
        author: authors.length
          ? authors.map((name) => ({ '@type': 'Person', name }))
          : { '@type': 'Organization', name: 'InteliDome', url: base },
        publisher: { '@id': `${base}/#organization` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        timeRequired: minutes ? `PT${minutes}M` : undefined,
        articleSection: categories.length ? categories : undefined,
        hasPart: getArticleSections(post.content).map((section) => ({
          '@type': 'WebPageElement', '@id': `${url}#${section.id}`,
          name: section.title, url: `${url}#${section.id}`,
        })),
        // Originál (cs) má překlady (`workTranslation`); překlad ukazuje na
        // originál (`translationOfWork`) — inverzní vztah podle schema.org.
        ...(ostatni.length
          ? locale === DEFAULT_LOCALE
            ? { workTranslation: ostatni.map(prekladOdkaz) }
            : { translationOfWork: prekladOdkaz(DEFAULT_LOCALE) }
          : {}),
      },
      { '@type': 'Organization', '@id': `${base}/#organization`, name: 'InteliDome', url: base },
      {
        '@type': 'BreadcrumbList', '@id': `${url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t(locale, 'seo.breadcrumbHome'), item: absoluteSiteURL(lokalizujCestu('/', locale)) },
          { '@type': 'ListItem', position: 2, name: t(locale, 'seo.breadcrumbPosts'), item: absoluteSiteURL(lokalizujCestu(cestaMagazinu(), locale)) },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  }
}

/** Řádek článku pro JSON-LD magazínu — jen to, co strukturovaná data potřebují. */
type MagazinPolozka = { cesta: string; celyTitulek: string }

/**
 * JSON-LD domovské stránky magazínu (DESIGN.md 8.5): CollectionPage, ItemList
 * přehledu (pozice posunuté podle strany), ItemList každé zobrazené série
 * (pořadí čtení), Organization a BreadcrumbList shodný s drobenkou článku.
 */
export function magazinJsonLd({
  locale,
  strana,
  naStranu,
  rejstrik,
  serie,
}: {
  locale: Locale
  strana: number
  naStranu: number
  rejstrik: readonly MagazinPolozka[]
  serie: readonly { slug: string; titulek: string; radky: readonly MagazinPolozka[] }[]
}) {
  const base = getServerSideURL()
  const url = absoluteSiteURL(lokalizujCestu(cestaMagazinu(strana), locale))
  const magazin = absoluteSiteURL(lokalizujCestu(cestaMagazinu(), locale))
  const nazev = strana > 1 ? t(locale, 'posts.page')(String(strana)) : t(locale, 'posts.title')
  const polozky = (radky: readonly MagazinPolozka[], posun = 0) =>
    radky.map((r, i) => ({ '@type': 'ListItem', position: posun + i + 1, url: absoluteSiteURL(lokalizujCestu(r.cesta, locale)), name: r.celyTitulek }))
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#page`,
        url,
        name: nazev,
        description: strana > 1 ? t(locale, 'posts.pageDescription')(String(strana)) : t(locale, 'posts.metaDescription'),
        inLanguage: locale,
        isPartOf: { '@type': 'WebSite', url: base, name: 'InteliDome' },
        publisher: { '@id': `${base}/#organization` },
        breadcrumb: { '@id': `${url}#breadcrumbs` },
        mainEntity: { '@id': `${url}#clanky` },
        ...(serie.length ? { hasPart: serie.map((s) => ({ '@id': `${url}#tema-${s.slug}` })) } : {}),
      },
      {
        '@type': 'ItemList',
        '@id': `${url}#clanky`,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: rejstrik.length,
        itemListElement: polozky(rejstrik, (strana - 1) * naStranu),
      },
      ...serie.map((s) => ({
        '@type': 'ItemList',
        '@id': `${url}#tema-${s.slug}`,
        name: s.titulek,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        numberOfItems: s.radky.length,
        itemListElement: polozky(s.radky),
      })),
      { '@type': 'Organization', '@id': `${base}/#organization`, name: 'InteliDome', url: base },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t(locale, 'seo.breadcrumbHome'), item: absoluteSiteURL(lokalizujCestu('/', locale)) },
          { '@type': 'ListItem', position: 2, name: t(locale, 'seo.breadcrumbPosts'), item: magazin },
          ...(strana > 1 ? [{ '@type': 'ListItem', position: 3, name: nazev, item: url }] : []),
        ],
      },
    ],
  }
}
