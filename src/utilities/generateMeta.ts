import type { Metadata } from 'next'
import type { Media, Page, Post, Config } from '../payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { absoluteSiteURL } from './getURL'
import type { Locale } from '@/i18n/config'

export const getSocialImage = (image?: Media | Config['db']['defaultIDType'] | null) => {
  if (image && typeof image === 'object') {
    const variant = image.sizes?.og
    const url = variant?.url || image.url
    if (url) return {
      url: absoluteSiteURL(url),
      width: (variant?.url ? variant.width : image.width) || undefined,
      height: (variant?.url ? variant.height : image.height) || undefined,
      alt: image.alt || undefined,
    }
  }
  return { url: absoluteSiteURL('/og-default.webp'), alt: 'InteliDome' }
}

export const generateMeta = async ({ doc, collection }: {
  doc: Partial<Page> | Partial<Post> | null
  collection: 'pages' | 'posts'
  /** Krok 1 jen přijímá; canonical/hreflang per jazyk řeší krok 3 (A19). */
  locale?: Locale
}): Promise<Metadata> => {
  const isPost = collection === 'posts'
  const post = isPost ? doc as Partial<Post> | null : null
  const ogImage = getSocialImage(doc?.meta?.image || post?.heroImage)
  const slug = Array.isArray(doc?.slug) ? doc.slug.join('/') : doc?.slug
  const path = slug && slug !== 'home' ? `${isPost ? '/posts/' : '/'}${slug}` : '/'
  const docTitle = doc?.meta?.title?.replace(/\s*\|\s*InteliDome\s*$/, '').trim() || doc?.title?.trim()
  const siteTitle = 'InteliDome — chytrá závlaha a automatizace zahrady'
  const description = doc?.meta?.description?.trim()

  return {
    description,
    title: docTitle ?? { absolute: siteTitle },
    alternates: {
      canonical: path,
      types: { 'application/rss+xml': '/feed.xml' },
    },
    openGraph: mergeOpenGraph({
      ...(description ? { description } : {}),
      images: [ogImage],
      title: docTitle || siteTitle,
      type: isPost ? 'article' : 'website',
      url: path,
      ...(post ? { publishedTime: post.publishedAt || undefined, modifiedTime: post.updatedAt || undefined } : {}),
    }),
    twitter: {
      card: 'summary_large_image',
      title: docTitle || siteTitle,
      description,
      images: [{ url: ogImage.url, alt: ogImage.alt }],
    },
  }
}
