import React from 'react'

import type { Locale } from '@/i18n/config'
import { t } from '@/i18n/ui'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { formatDateTime } from '@/utilities/formatDateTime'
import type { RadekData } from './data'

export type Kotva = { href: string; nazev: string; pocet: number }

/**
 * Typografická hlava magazínu (DESIGN.md 8.5 ř. 1): bílá, bez fotky a eyebrow.
 * Jediný pohyb první obrazovky je rise H1 z masky (CSS keyframes, 6.3.3);
 * lead, kotvy a novinka stojí od prvního snímku (LCP).
 */
export function Zahlavi({
  kompaktni,
  kotvy,
  locale,
  novinka,
  strana,
  pocetStran,
}: {
  kompaktni?: boolean
  kotvy: Kotva[]
  locale: Locale
  novinka: RadekData | null
  strana: number
  pocetStran: number
}) {
  return (
    <header className="id-mag-hlava id-mag-pas--bila">
      <div className="container id-2col">
        <div>
          <h1 className="id-mag-hlava__titulek">
            <span className="id-hline">
              <span>{t(locale, 'posts.title')}</span>
            </span>
          </h1>
          {kompaktni ? (
            <p className="id-mag-hlava__stav">{t(locale, 'magazin.strana')(strana, pocetStran)}</p>
          ) : (
            <p className="id-mag-hlava__lead">{nezlomitelneMezery(t(locale, 'magazin.lead'))}</p>
          )}
        </div>
        {kompaktni ? null : (
          <div className="id-mag-hlava__vpravo">
            {kotvy.length >= 2 ? (
              <nav aria-label={t(locale, 'magazin.mapaAria')}>
                <p className="id-mag-label">{t(locale, 'magazin.mapaLabel')}</p>
                <ul className="id-mag-hlava__kotvy" role="list">
                  {kotvy.map((k) => (
                    <li key={k.href}>
                      <a className="id-btn id-btn--secondary id-btn--sm" href={k.href}>
                        {k.nazev}
                        <span className="id-tnum id-mag-hlava__pocet">{k.pocet}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
            {novinka ? (
              <div className="id-mag-hlava__novinka">
                <p className="id-mag-label">{t(locale, 'magazin.novinkaLabel')}</p>
                <a className="id-mag-odkaz" href={novinka.href}>
                  {nezlomitelneMezery(novinka.titulek)}
                </a>
                {novinka.datum ? (
                  <time className="id-mag-hlava__datum" dateTime={novinka.datum}>
                    {formatDateTime(novinka.datum, locale)}
                  </time>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </header>
  )
}
