import type { Metadata } from 'next'
import type { Media, Page, Post, Config } from '../payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { absoluteSiteURL } from './getURL'
import { DEFAULT_LOCALE, OG_LOCALE, type Locale } from '@/i18n/config'
import { lokalizujCestu, rssCesta, zakladniCesta } from '@/i18n/routing'

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

/**
 * Metadata dokumentu (A19): všechno z jediné `url = lokalizujCestu(path, locale)`.
 * `preklady` = jazyky, ve kterých je dokument veřejný (`prekladyDokumentu`);
 * hreflang a `og:locale:alternate` se emitují JEN při ≥ 2 jazycích — dnešní
 * český výstup (jediný jazyk) zůstává beze změny.
 */
export const generateMeta = async ({ doc, collection, locale = DEFAULT_LOCALE, preklady = [DEFAULT_LOCALE] }: {
  doc: Partial<Page> | Partial<Post> | null
  collection: 'pages' | 'posts'
  locale?: Locale
  preklady?: readonly Locale[]
}): Promise<Metadata> => {
  const isPost = collection === 'posts'
  const post = isPost ? doc as Partial<Post> | null : null
  const ogImage = getSocialImage(doc?.meta?.image || post?.heroImage)
  const slug = Array.isArray(doc?.slug) ? doc.slug.join('/') : doc?.slug
  const path = slug ? zakladniCesta(collection, slug) : '/'
  const url = lokalizujCestu(path, locale)
  // hreflang jen z reciproční množiny, která obsahuje aktuální jazyk (náhled
  // nepřeloženého jazyka pod /{l}/… by jinak inzeroval cizí množinu).
  const jazyky = preklady.length >= 2 && preklady.includes(locale) ? preklady : null
  const docTitle = doc?.meta?.title?.replace(/\s*\|\s*InteliDome\s*$/, '').trim() || doc?.title?.trim()
  const siteTitle = 'InteliDome — chytrá závlaha a automatizace zahrady'
  const description = doc?.meta?.description?.trim()

  return {
    description,
    title: docTitle ?? { absolute: siteTitle },
    alternates: {
      canonical: url,
      ...(jazyky
        ? {
            languages: {
              ...Object.fromEntries(jazyky.map((kod) => [kod, lokalizujCestu(path, kod)])),
              'x-default': lokalizujCestu(path, DEFAULT_LOCALE),
            },
          }
        : {}),
      types: { 'application/rss+xml': rssCesta(locale) },
    },
    openGraph: mergeOpenGraph({
      ...(description ? { description } : {}),
      images: [ogImage],
      title: docTitle || siteTitle,
      type: isPost ? 'article' : 'website',
      url,
      ...(jazyky ? { alternateLocale: jazyky.filter((kod) => kod !== locale).map((kod) => OG_LOCALE[kod]) } : {}),
      ...(post ? { publishedTime: post.publishedAt || undefined, modifiedTime: post.updatedAt || undefined } : {}),
    }, locale),
    twitter: {
      card: 'summary_large_image',
      title: docTitle || siteTitle,
      description,
      images: [{ url: ogImage.url, alt: ogImage.alt }],
    },
  }
}
