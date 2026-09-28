import React from 'react'

import type { Locale } from '@/i18n/config'
import { t } from '@/i18n/ui'

/**
 * „Zobrazeno 1–12 z 30 článků“: rozsah výpisu s českými tvary podstatného
 * jména ze slovníku UI (`pageRange.posts` / `pageRange.items`, A11).
 */
export const PageRange: React.FC<{
  className?: string
  collection?: 'posts'
  currentPage?: number
  limit?: number
  locale: Locale
  totalDocs?: number
}> = (props) => {
  const { className, collection, currentPage, limit, locale, totalDocs } = props

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  const tvar = collection === 'posts' ? t(locale, 'pageRange.posts') : t(locale, 'pageRange.items')

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {(typeof totalDocs === 'undefined' || totalDocs === 0) && t(locale, 'search.empty')}
      {typeof totalDocs !== 'undefined' &&
        totalDocs > 0 &&
        t(locale, 'pageRange.shown')(indexStart, indexEnd, totalDocs, tvar(totalDocs))}
    </div>
  )
}
