import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'
import { LOCALES } from '@/i18n/config'
import { cestaMagazinu, interniCesty } from '@/i18n/routing'

// Revaliduje se cesta ROUTE STROMU (`/cs/magazin/x`, `/en/magazin/x`, …), ne veřejná
// `/magazin/x`: po rewritu z proxy by ta cache netrefila (A14). Spolu s článkem
// domovská stránka magazínu a RSS, jinak by čekaly na ISR až 600 s (ADR-009).
const revaliduj = (slug: string) => {
  for (const cesta of interniCesty('posts', slug)) revalidatePath(cesta)
  for (const kod of LOCALES) {
    // 'layout' = celý podstrom /{l}/magazin: domovská stránka i stránkování.
    revalidatePath('/' + kod + cestaMagazinu(), 'layout')
    revalidatePath('/' + kod + '/feed.xml')
  }
  revalidatePath('/feed.xml')
}

// pages-sitemap nese i výpis `/{l}/magazin` (jen pro jazyky s ≥ 1 přeloženým
// článkem, A19), proto ho změna článku invaliduje spolu s posts-sitemap.
const revalidujSitemapy = () => {
  revalidateTag('posts-sitemap', 'max')
  revalidateTag('pages-sitemap', 'max')
}

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating post: ${doc.slug}`)

      revaliduj(doc.slug)
      revalidujSitemapy()
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      payload.logger.info(`Revalidating old post: ${previousDoc.slug}`)

      revaliduj(previousDoc.slug)
      revalidujSitemapy()
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revaliduj(String(doc?.slug))
    revalidujSitemapy()
  }

  return doc
}
