import type { Post } from '@/payload-types'
import { absoluteSiteURL, getServerSideURL } from './getURL'
import { readingTime } from './readingTime'
import { slugify } from './slugify'

/** Only headings rendered with stable anchors by Chapter/Split enter navigation. */
export function getArticleSections(content: Post['content']) {
  const sections: { title: string; id: string }[] = []
  for (const node of content.root.children) {
    const fields = node.fields as { blockType?: string; title?: string; titleLevel?: string } | undefined
    if (!fields || !['chapter', 'split'].includes(fields.blockType || '') || fields.titleLevel === 'h3') continue
    const title = fields.title?.trim()
    if (!title) continue
    const id = slugify(title)
    if (id && !sections.some((section) => section.id === id)) sections.push({ title, id })
  }
  return sections
}

/** Schema mirrors the article, visible dates, publisher and breadcrumb navigation. */
export function articleJsonLd(post: Post) {
  const base = getServerSideURL()
  const url = absoluteSiteURL(`/posts/${post.slug}`)
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
        inLanguage: 'cs',
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
      },
      { '@type': 'Organization', '@id': `${base}/#organization`, name: 'InteliDome', url: base },
      {
        '@type': 'BreadcrumbList', '@id': `${url}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Úvod', item: `${base}/` },
          { '@type': 'ListItem', position: 2, name: 'Články', item: `${base}/posts` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  }
}
