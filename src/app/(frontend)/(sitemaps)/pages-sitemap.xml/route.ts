import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '@/utilities/getURL'
import { sitemapVypisu, sitemapZaznamy } from '@/utilities/sitemap'
import { LIVE_LOCALES } from '@/i18n/live'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const siteUrl = getServerSideURL()

    // Jedno čtení všech jazyků (A19): `prelozeno` je mapa po jazycích.
    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      locale: 'all',
      fallbackLocale: false,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
        prelozeno: true,
      },
    })

    // Výpis `/posts` je i v cizím jazyce jen s ≥ 1 přeloženým článkem (A6);
    // s jediným živým jazykem se články nečtou (dnešní záznam `/posts`).
    const posts =
      LIVE_LOCALES.length >= 2
        ? (
            await payload.find({
              collection: 'posts',
              overrideAccess: false,
              draft: false,
              depth: 0,
              limit: 1000,
              locale: 'all',
              fallbackLocale: false,
              pagination: false,
              where: { _status: { equals: 'published' } },
              select: { slug: true, prelozeno: true },
            })
          ).docs
        : []

    const pages = (results.docs ?? []).filter((page) => page.slug !== 'search')

    return [...sitemapVypisu(posts, siteUrl, LIVE_LOCALES), ...sitemapZaznamy('pages', pages, siteUrl, LIVE_LOCALES)]
  },
  ['pages-sitemap'],
  {
    // Obsah závisí i na kolekci posts (výpis `/{l}/posts`), proto tag
    // `pages-sitemap` revalidují i hooky Posts (revalidatePost/revalidateDelete).
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
