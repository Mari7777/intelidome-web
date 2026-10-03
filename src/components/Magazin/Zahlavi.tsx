import React from 'react'

import type { Locale } from '@/i18n/config'
import { t } from '@/i18n/ui'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { formatDateTime } from '@/utilities/formatDateTime'
import type { RadekData } from './data'

/** `jednotka` doplní číslo pro odečítač („5 dílů“), vidět je jen číslo (11.3). */
export type Kotva = { href: string; nazev: string; pocet: number; jednotka: string }

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
                <ul className="id-mag-hlava__kotvy" role="list">
                  {kotvy.map((k) => (
                    <li key={k.href}>
                      <a className="id-btn id-btn--secondary id-btn--sm" href={k.href}>
                        {k.nazev}{' '}
                        <span className="id-tnum id-mag-hlava__pocet">
                          {k.pocet}
                          <span className="sr-only"> {k.jednotka}</span>
                        </span>
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
                {/* Téma a díl řeknou, že jde o pokračování, ne o začátek (porota kola 01). */}
                {novinka.tema || novinka.datum ? (
                  <p className="id-mag-hlava__meta">
                    {novinka.tema
                      ? nezlomitelneMezery(
                          novinka.dil
                            ? t(locale, 'magazin.dilVTematu')(novinka.tema.titulek, novinka.dil.k, novinka.dil.z)
                            : novinka.tema.titulek,
                        )
                      : null}
                    {novinka.tema && novinka.datum ? ' · ' : null}
                    {novinka.datum ? (
                      <time dateTime={novinka.datum}>{formatDateTime(novinka.datum, locale)}</time>
                    ) : null}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </header>
  )
}
