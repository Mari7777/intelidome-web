import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { DEFAULT_LOCALE, OG_LOCALE, type Locale } from '@/i18n/config'
import { t } from '@/i18n/ui'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  locale: 'cs_CZ',
  description: t(DEFAULT_LOCALE, 'seo.ogDescription'),
  images: [
    {
      url: `${getServerSideURL()}/og-default.webp`,
    },
  ],
  siteName: 'InteliDome',
  title: 'InteliDome',
}

/** `locale` (jazyk webu) přepíše `og:locale` z mapy OG kódů a výchozí popis; bez něj zůstává cs_CZ. */
export const mergeOpenGraph = (og?: Metadata['openGraph'], locale?: Locale): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...(locale ? { locale: OG_LOCALE[locale], description: t(locale, 'seo.ogDescription') } : {}),
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
