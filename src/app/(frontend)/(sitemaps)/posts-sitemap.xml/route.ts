import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '@/utilities/getURL'
import { sitemapZaznamy } from '@/utilities/sitemap'
import { LIVE_LOCALES } from '@/i18n/live'

const getPostsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const siteUrl = getServerSideURL()

    // Jedno čtení všech jazyků (A19): `prelozeno` je mapa po jazycích, z níž
    // vzniká záznam pro cs + každý živý jazyk s hotovým překladem.
    const results = await payload.find({
      collection: 'posts',
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

    return sitemapZaznamy('posts', results.docs ?? [], siteUrl, LIVE_LOCALES)
  },
  // Klíč nese segment magazínu: po přesunu z /posts (ADR-009) by se jinak
  // rok servírovala zastaralá adresa z datové cache.
  ['posts-sitemap', 'magazin'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPostsSitemap()

  return getServerSideSitemap(sitemap)
}
