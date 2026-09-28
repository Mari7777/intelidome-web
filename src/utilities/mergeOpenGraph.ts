import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'
import { OG_LOCALE, type Locale } from '@/i18n/config'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  locale: 'cs_CZ',
  description: 'Chytrá závlaha a automatizace zahrady — návody, plánování a praxe.',
  images: [
    {
      url: `${getServerSideURL()}/og-default.webp`,
    },
  ],
  siteName: 'InteliDome',
  title: 'InteliDome',
}

/** `locale` (jazyk webu) přepíše `og:locale` z mapy OG kódů; bez něj zůstává cs_CZ. */
export const mergeOpenGraph = (og?: Metadata['openGraph'], locale?: Locale): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...(locale ? { locale: OG_LOCALE[locale] } : {}),
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
