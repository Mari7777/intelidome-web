import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import { jazykyVypisu } from '@/utilities/sitemap'

import { DEFAULT_LOCALE } from './config'
import { LIVE_LOCALES } from './live'
import { lokalizujCestu } from './routing'

type Hreflang = NonNullable<NonNullable<Metadata['alternates']>['languages']>

/* Táž množina jako u záznamu výpisu v pages-sitemap (`sitemapVypisu`): cs +
   živé jazyky s ≥ 1 přeloženým článkem, z jednoho čtení `locale: 'all'`.
   Tag `posts-sitemap` invalidují hooky Posts spolu se sitemapou. */
const ctiJazykyVypisu = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'posts',
      depth: 0,
      draft: false,
      fallbackLocale: false,
      limit: 1000,
      locale: 'all',
      overrideAccess: false,
      pagination: false,
      select: { slug: true, prelozeno: true },
      where: { _status: { equals: 'published' } },
    })
    return jazykyVypisu(docs, LIVE_LOCALES)
  },
  ['jazyky-vypisu'],
  { tags: ['posts-sitemap'] },
)

/**
 * hreflang výpisu článků (`/magazin`; A19): HTML musí souhlasit se sitemapou,
 * která reciproční `xhtml:link` emituje už dnes. Při jediném živém jazyce
 * nic — a bez čtení DB, takže dnešní český výstup zůstává. Stránkování
 * (`/magazin/strana/N`) hreflang nenese: stránka N v cizím jazyce nemusí
 * existovat a sitemapa stránkování neobsahuje.
 */
export async function hreflangVypisu(cesta: string): Promise<Hreflang | undefined> {
  if (LIVE_LOCALES.length < 2) return undefined
  const jazyky = await ctiJazykyVypisu()
  if (jazyky.length < 2) return undefined
  return {
    ...Object.fromEntries(jazyky.map((kod) => [kod, lokalizujCestu(cesta, kod)])),
    'x-default': lokalizujCestu(cesta, DEFAULT_LOCALE),
  }
}
