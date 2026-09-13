import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/og-default.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const slug = Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug
  const isPost = Boolean(doc && 'publishedAt' in doc)
  const path = slug ? `${isPost ? '/posts/' : '/'}${slug}`.replace('//', '/') : '/'

  // The layout's title template appends "| InteliDome"; strip it from stored
  // values (older docs were saved with the suffix baked in) so it appears once.
  const docTitle =
    doc?.meta?.title?.replace(/\s*\|\s*InteliDome\s*$/, '').trim() || doc?.title?.trim()

  const siteTitle = 'InteliDome — chytrá závlaha a automatizace zahrady'
  const description = doc?.meta?.description?.trim()

  return {
    description,
    openGraph: mergeOpenGraph({
      // omit when empty so the site-wide default description applies
      ...(description ? { description } : {}),
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: docTitle || siteTitle,
      // Příspěvek má slug jako řetězec, ne pole — dřívější větev proto vždy
      // spadla na '/' a sdílený článek hlásil crawlerům domovskou stránku.
      type: isPost ? 'article' : 'website',
      url: path,
    }),
    alternates: { canonical: path },
    // `absolute` skips the template — the fallback already carries the brand
    title: docTitle ?? { absolute: siteTitle },
  }
}
