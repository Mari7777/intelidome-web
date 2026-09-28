import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'
import { interniCesty } from '@/i18n/routing'

// Revaliduje se cesta ROUTE STROMU (`/cs`, `/cs/x`, `/en/x`, …), ne veřejná
// `/` či `/x`: po rewritu z proxy by ta cache netrefila (A14).
const revaliduj = (slug: string) => {
  for (const cesta of interniCesty('pages', slug)) revalidatePath(cesta)
}

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating page: ${doc.slug}`)

      revaliduj(doc.slug)
      revalidateTag('pages-sitemap', 'max')
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      payload.logger.info(`Revalidating old page: ${previousDoc.slug}`)

      revaliduj(previousDoc.slug)
      revalidateTag('pages-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revaliduj(String(doc?.slug))
    revalidateTag('pages-sitemap', 'max')
  }

  return doc
}
