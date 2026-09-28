import { DEFAULT_LOCALE, type Locale } from '@/i18n/config'
import { lokalizujCestu, rssCesta, verejnaCesta } from '@/i18n/routing'
import { t } from '@/i18n/ui'

/**
 * RSS kanál (A19), sdílený českým `/feed.xml` i jazykovým `/{locale}/feed.xml`.
 * Čistý modul: položky přicházejí z route handleru. Pro cs je výstup
 * byte-identický s původním generátorem (zlatý snímek). Texty kanálu jdou
 * ze slovníku UI (`t`).
 */

export type RssPolozka = {
  title: string
  slug?: string | null
  publishedAt?: string | null
  meta?: { description?: string | null } | null
}

export const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export function rssXml({
  siteUrl,
  locale = DEFAULT_LOCALE,
  posts,
}: {
  siteUrl: string
  locale?: Locale
  posts: readonly RssPolozka[]
}): string {
  // Kořen kanálu: cs bez lomítka (původní podoba), jinak `/{locale}`.
  const kanal = locale === DEFAULT_LOCALE ? siteUrl : siteUrl + lokalizujCestu('/', locale)
  const items = posts
    .map((post) => {
      const url = siteUrl + verejnaCesta('posts', post.slug ?? '', locale)
      const description = post.meta?.description
        ? `<description>${escapeXml(post.meta.description)}</description>`
        : ''
      const pubDate = post.publishedAt
        ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`
        : ''

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${description}
      ${pubDate}
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(t(locale, 'rss.title'))}</title>
    <link>${kanal}</link>
    <atom:link href="${siteUrl}${rssCesta(locale)}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(t(locale, 'rss.description'))}</description>
    <language>${locale}</language>
${items}
  </channel>
</rss>`
}

export const rssOdpoved = (xml: string): Response =>
  new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
