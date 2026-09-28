'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import type { Locale } from '@/i18n/config'
import { useLocale } from '@/i18n/LocaleProvider'
import { lokalizujCestu } from '@/i18n/routing'
import { t } from '@/i18n/ui'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

/**
 * Obsah kapsle (DESIGN.md 7.1): odkazy uprostřed, vpravo hledání
 * a jediné mini-CTA. Pod 640 px se odkazy skrývají — v kapsli zůstane
 * značka, lupa a CTA. Přepínač jazyků stojí ve skupině odkazů jako další
 * `__link` položky a vykreslí se jen při ≥ 2 živých jazycích (A20).
 */
export const HeaderNav: React.FC<{ data: HeaderType; liveLocales: readonly Locale[] }> = ({
  data,
  liveLocales,
}) => {
  const navItems = data?.navItems || []
  const locale = useLocale()

  return (
    <nav aria-label={t(locale, 'nav.aria')} className="flex items-center gap-5">
      <span className="hidden items-center gap-5 sm:flex">
        {navItems.map(({ link }, i) => (
          <CMSLink key={i} {...link} appearance="link" className="id-capsule__link" locale={locale} />
        ))}
        <LanguageSwitcher liveLocales={liveLocales} varianta="hlavicka" />
      </span>

      <Link className="id-capsule__icon" href={lokalizujCestu('/search', locale)}>
        <span className="sr-only">{t(locale, 'nav.search')}</span>
        <SearchIcon className="w-[18px]" aria-hidden="true" />
      </Link>

      <Link className="id-capsule__go" href={lokalizujCestu('/', locale)}>
        {t(locale, 'nav.cta')}
      </Link>
    </nav>
  )
}
