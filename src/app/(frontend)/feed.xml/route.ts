import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'
import { rssOdpoved, rssXml } from '@/utilities/rss'

export const revalidate = 600

export async function GET(): Promise<Response> {
  const payload = await getPayload({ config: configPromise })
  const siteUrl = getServerSideURL()

  const posts = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 20,
    locale: 'cs',
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      _status: {
        equals: 'published',
      },
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

  return rssOdpoved(rssXml({ siteUrl, locale: 'cs', posts: posts.docs }))
}
