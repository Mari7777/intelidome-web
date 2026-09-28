import { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import { PayloadRequest } from 'payload'

import { jeLocale, type Locale } from '@/i18n/config'
import { verejnaCesta } from '@/i18n/routing'

type Props = {
  collection: 'posts' | 'pages'
  slug: string
  /** Payload dává v `preview` řetězec, v `livePreview.url` objekt `{ code }`. */
  locale?: string | { code: string } | null
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, locale }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  const kod = typeof locale === 'object' && locale !== null ? locale.code : locale
  const jazyk: Locale = jeLocale(kod) ? kod : 'cs'

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  const encodedParams = new URLSearchParams({
    path: verejnaCesta(collection, encodedSlug, jazyk),
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
