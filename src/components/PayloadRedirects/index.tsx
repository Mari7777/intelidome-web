import type React from 'react'
import type { Page, Post } from '@/payload-types'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'
import type { Locale } from '@/i18n/config'
import { lokalizujCestu, zakladniCesta } from '@/i18n/routing'

interface Props {
  disableNotFound?: boolean
  locale: Locale
  /** Cesta BEZ jazykového prefixu — tak se `from` zapisuje v CMS (články `/magazin/x`, ADR-009). */
  url: string
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, locale, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(lokalizujCestu(redirectItem.to.url, locale))
    }

    let redirectUrl: string

    if (typeof redirectItem.to?.reference?.value === 'string') {
      const collection = redirectItem.to?.reference?.relationTo
      const id = redirectItem.to?.reference?.value

      const document = (await getCachedDocument(collection, id, locale)()) as Page | Post
      redirectUrl = document?.slug ? zakladniCesta(collection, document.slug) : ''
    } else {
      const reference = redirectItem.to?.reference
      const slug = typeof reference?.value === 'object' ? reference.value?.slug : null
      redirectUrl = reference && slug ? zakladniCesta(reference.relationTo, slug) : ''
    }

    if (redirectUrl) redirect(lokalizujCestu(redirectUrl, locale))
  }

  if (disableNotFound) return null

  notFound()
}
