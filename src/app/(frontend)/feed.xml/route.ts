import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 600

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

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

  const items = posts.docs
    .map((post) => {
      const url = `${siteUrl}/posts/${post.slug}`
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

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>InteliDome — blog</title>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Návody a praxe kolem chytré závlahy a automatizace zahrady.</description>
    <language>cs</language>
${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
