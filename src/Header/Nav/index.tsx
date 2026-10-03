'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import type { Locale } from '@/i18n/config'
import { useLocale } from '@/i18n/LocaleProvider'
import { CESTA_MAGAZINU, cestaMagazinu, lokalizujCestu, odstranPrefix } from '@/i18n/routing'
import { t } from '@/i18n/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SearchIcon } from 'lucide-react'

/**
 * Obsah kapsle (DESIGN.md 7.1): odkaz Magazín, odkazy z CMS, vpravo hledání
 * a jediné mini-CTA. Magazín je trvale vidět i pod 640 px (ADR-009, DESIGN 8.5) —
 * na článku je to z telefonu jediná cesta zpět. Odkazy z CMS se pod 640 px skrývají. Přepínač jazyků stojí ve skupině odkazů jako další
 * `__link` položky a vykreslí se jen při ≥ 2 živých jazycích (A20).
 */
export const HeaderNav: React.FC<{ data: HeaderType; liveLocales: readonly Locale[] }> = ({
  data,
  liveLocales,
}) => {
  const navItems = data?.navItems || []
  const locale = useLocale()
  const { path } = odstranPrefix(usePathname() ?? '/')
  // Na domovské stránce magazínu „page“, uvnitř sekce (strany, články) „true“ — stav, ne akce.
  const vMagazinu = path === CESTA_MAGAZINU ? 'page' : path.startsWith(CESTA_MAGAZINU + '/') ? 'true' : undefined

  return (
    <nav aria-label={t(locale, 'nav.aria')} className="flex items-center gap-5">
      <Link aria-current={vMagazinu} className="id-capsule__link" href={lokalizujCestu(cestaMagazinu(), locale)}>
        {t(locale, 'nav.magazin')}
      </Link>
      {/* Prázdná skupina by v kapsli zdvojila mezeru před lupou. */}
      {navItems.length > 0 || liveLocales.length >= 2 ? (
        <span className="hidden items-center gap-5 sm:flex">
          {navItems.map(({ link }, i) => (
            <CMSLink key={i} {...link} appearance="link" className="id-capsule__link" locale={locale} />
          ))}
          <LanguageSwitcher liveLocales={liveLocales} varianta="hlavicka" />
        </span>
      ) : null}

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
