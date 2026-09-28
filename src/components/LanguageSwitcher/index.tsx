'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import type { Locale } from '@/i18n/config'
import { useLocale } from '@/i18n/LocaleProvider'
import { lokalizujCestu, odstranPrefix } from '@/i18n/routing'
import { t } from '@/i18n/ui'
import { cn } from '@/utilities/ui'

type Props = {
  /** Živé jazyky z layoutu (`LIVE_LOCALES` je jen serverová; A20). */
  liveLocales: readonly Locale[]
  varianta: 'hlavicka' | 'paticka'
}

/**
 * Přepínač jazyků (ADR-008, A20). Nezná dokument: odkaz je táž cesta
 * s jiným prefixem (`lokalizujCestu(odstranPrefix(pathname).path, kod)`),
 * nepřeložený cíl obslouží 307 na češtinu. Jen cesta, bez query.
 *
 * Při jediném živém jazyce se nevykreslí vůbec — dnešní DOM zůstává
 * beze změny (zlatý snímek). Text = kód jazyka (uppercase přes CSS),
 * `lang` na odkazu, aktivní jazyk `aria-current="true"`; žádný hreflang,
 * vlajky ani chip (7.4: chip nenese akci).
 *
 * Hlavička: položky `.id-capsule__link` uvnitř skupiny odkazů (7.1).
 * Patička: prosté odkazy v řádku s © (7.13: ink-2, hover accent).
 */
export const LanguageSwitcher: React.FC<Props> = ({ liveLocales, varianta }) => {
  const pathname = usePathname()
  const aktualni = useLocale()
  if (liveLocales.length < 2) return null

  const { path } = odstranPrefix(pathname ?? '/')

  const odkazy = liveLocales.map((kod) => {
    const aktivni = kod === aktualni
    return (
      <Link
        aria-current={aktivni ? 'true' : undefined}
        className={cn(
          'uppercase',
          // Kapsle: `.id-capsule__link` řeší barvu i aktivní stav (DS 7.1).
          varianta === 'hlavicka' && 'id-capsule__link',
          varianta === 'paticka' &&
            (aktivni
              ? 'text-[var(--id-ink)]'
              : 'text-[var(--id-ink-2)] transition-colors hover:text-[var(--id-accent)]'),
        )}
        href={lokalizujCestu(path, kod)}
        key={kod}
        lang={kod}
        // Nepřeložený cíl je 307 na češtinu (A20) — prefetch by byl zbytečný požadavek.
        prefetch={false}
      >
        {kod}
      </Link>
    )
  })

  if (varianta === 'hlavicka') return <>{odkazy}</>

  return (
    <nav aria-label={t(aktualni, 'lang.aria')} className="flex items-center gap-4">
      {odkazy}
    </nav>
  )
}
