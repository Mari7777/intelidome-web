import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { jeLocale } from '@/i18n/config'
import { LIVE_LOCALES } from '@/i18n/live'
import { getServerSideURL } from '@/utilities/getURL'
import { rssOdpoved, rssXml } from '@/utilities/rss'

export const revalidate = 600

/* Proxy cesty s tečkou obchází, sem se jde přímo. Čeština má kanál bez prefixu
   (`/cs/feed.xml` → 308 jako každá `/cs/…` adresa), neživý jazyk nebo jazyk bez
   jediného přeloženého článku → 307 na český kanál (A6). */
const presmeruj = (status: 307 | 308): Response =>
  new Response(null, { status, headers: { Location: '/feed.xml' } })

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }): Promise<Response> {
  const { locale } = await params
  if (!jeLocale(locale)) return new Response(null, { status: 404 })
  if (locale === 'cs') return presmeruj(308)
  if (!LIVE_LOCALES.includes(locale)) return presmeruj(307)

  const payload = await getPayload({ config: configPromise })
  const siteUrl = getServerSideURL()

  const posts = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 20,
    locale,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      and: [{ _status: { equals: 'published' } }, { prelozeno: { equals: true } }],
    },
    select: {
      title: true,
      slug: true,
      publishedAt: true,
      meta: {
        description: true,
      },
    },
  })

  if (posts.docs.length === 0) return presmeruj(307)

  return rssOdpoved(rssXml({ siteUrl, locale, posts: posts.docs }))
}
