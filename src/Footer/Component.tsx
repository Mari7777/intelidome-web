import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Logo } from '@/components/Logo/Logo'
import type { Locale } from '@/i18n/config'
import { lokalizujCestu } from '@/i18n/routing'
import { t } from '@/i18n/ui'

export async function Footer({ liveLocales, locale }: { liveLocales: readonly Locale[]; locale: Locale }) {
  const footerData = await getCachedGlobal('footer', 1, locale)()

  const navItems = footerData?.navItems || []
  const rok = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-[var(--id-line-soft)] bg-[var(--id-bg)]">
      <div className="container pt-[34px] pb-[10px] gap-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <Link
          aria-label={t(locale, 'logo.aria')}
          className="flex items-center text-[var(--id-ink)]"
          href={lokalizujCestu('/', locale)}
        >
          <Logo decorative height={19} />
        </Link>

        <nav aria-label={t(locale, 'footer.nav')} className="flex flex-col md:flex-row gap-4">
          {navItems.map(({ link }, i) => {
            return (
              <CMSLink
                className="text-[var(--id-ink-2)] transition-colors hover:text-[var(--id-ink)]"
                key={i}
                {...link}
                locale={locale}
              />
            )
          })}
        </nav>
      </div>
      {/* Řádek s ©. Při jediném živém jazyce zůstává dnešní DOM beze změny (A20);
          přepínač jazyků (plný seznam) se přidá až při ≥ 2 živých jazycích. */}
      {liveLocales.length >= 2 ? (
        <div className="container flex flex-wrap items-center justify-between gap-4 pb-8 text-[13.5px] leading-[1.45] text-[var(--id-ink-2)]">
          <span>© {rok} InteliDome</span>
          <LanguageSwitcher liveLocales={liveLocales} varianta="paticka" />
        </div>
      ) : (
        <div className="container pb-8 text-[13.5px] leading-[1.45] text-[var(--id-ink-2)]">
          © {rok} InteliDome
        </div>
      )}
    </footer>
  )
}
