import Link from 'next/link'
import React from 'react'

import type { Locale } from '@/i18n/config'
import { cestaMagazinu, lokalizujCestu } from '@/i18n/routing'
import { t } from '@/i18n/ui'
import { oknoStran } from './skladba'

/**
 * Stránkování přehledu (DESIGN.md 8.5): skutečné odkazy s rel prev/next, aby
 * strany 2+ našel i robot. Na telefonu místo čísel „Strana N z M“ a krátké
 * popisky, aby trojice zůstala v jedné řadě (porota kola 01).
 */
const Popisek = ({ dlouhy, kratky }: { dlouhy: string; kratky: string }) => (
  <>
    <span className="id-mag-pager__dlouhy">{dlouhy}</span>
    <span className="id-mag-pager__kratky">{kratky}</span>
  </>
)

export function Strankovani({ locale, pocet, strana }: { locale: Locale; pocet: number; strana: number }) {
  if (pocet <= 1) return null
  const href = (n: number) => lokalizujCestu(cestaMagazinu(n), locale)
  return (
    <nav aria-label={t(locale, 'magazin.strankovaniAria')} className="id-mag-pager">
      {strana > 1 ? (
        <Link className="id-btn id-btn--secondary id-btn--sm" href={href(strana - 1)} rel="prev">
          ← <Popisek dlouhy={t(locale, 'magazin.novejsi')} kratky={t(locale, 'magazin.novejsiKratce')} />
        </Link>
      ) : (
        <span />
      )}
      <ol className="id-mag-pager__cisla">
        {oknoStran(strana, pocet).map((n, i) =>
          n === null ? (
            <li aria-hidden="true" className="id-mag-pager__mezera" key={`m${i}`}>
              …
            </li>
          ) : (
            <li key={n}>
              <Link
                aria-current={n === strana ? 'page' : undefined}
                aria-label={t(locale, 'magazin.stranaAria')(n)}
                className="id-mag-pager__n"
                href={href(n)}
              >
                {n}
              </Link>
            </li>
          ),
        )}
      </ol>
      <span className="id-mag-pager__stav">{t(locale, 'magazin.strana')(strana, pocet)}</span>
      {strana < pocet ? (
        <Link className="id-btn id-btn--secondary id-btn--sm" href={href(strana + 1)} rel="next">
          <Popisek dlouhy={t(locale, 'magazin.starsi')} kratky={t(locale, 'magazin.starsiKratce')} /> →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
