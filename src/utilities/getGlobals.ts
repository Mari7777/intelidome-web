import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import type { Locale } from '@/i18n/config'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth = 0, locale: Locale = 'cs'): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    locale,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug.
 * Jazyk je v klíči: hlavička pro `en` nesmí vracet českou cache (A14).
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0, locale: Locale = 'cs') =>
  unstable_cache(async () => getGlobal<T>(slug, depth, locale), [slug, locale], {
    tags: [`global_${slug}`],
  })
