import React from 'react'

import type { Locale } from '@/i18n/config'
import { t } from '@/i18n/ui'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
import type { KalkulatorData } from './data'

/**
 * Pás kalkulátorů (DESIGN.md 8.5 ř. k+2): jediný obsidian stránky, řádky
 * `.id-feature` s roztaženým odkazem na kalkulátor přímo v článku.
 */
export function Kalkulatory({ kalkulatory, locale }: { kalkulatory: KalkulatorData[]; locale: Locale }) {
  return (
    <section
      aria-labelledby="kalkulatory-h"
      className="id-band id-band--obsidian id-mag-sekce"
      data-surface="dark"
      id="kalkulatory"
    >
      <div className="id-band__inner id-2col" data-rv-group>
        <div className="rv id-section-heading">
          <p className="id-eyebrow">{t(locale, 'magazin.kalkulatory')}</p>
          <h2 className="id-section-heading__title" id="kalkulatory-h">
            {nezlomitelneMezery(t(locale, 'magazin.kalk.titulek'))}
          </h2>
          <p className="id-section-heading__lead">{nezlomitelneMezery(t(locale, 'magazin.kalk.lead'))}</p>
        </div>
        <ul className="rv id-mag-nastroje" role="list">
          {kalkulatory.map((k) => (
            <li className="id-feature id-mag-nastroj" key={k.druh}>
              <h3 className="id-feature__title">
                <a className="id-mag-nastroj__a" href={k.href}>
                  {nezlomitelneMezery(k.nazev)}
                </a>
              </h3>
              <p className="id-feature__text">{nezlomitelneMezery(k.ucel)}</p>
              <p className="id-mag-nastroj__zdroj">{nezlomitelneMezery(t(locale, 'magazin.kalk.zdroj')(k.clanek))}</p>
              <svg aria-hidden="true" className="id-mag-nastroj__sipka" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 20 20">
                <path d="M5 10h10M11 6l4 4-4 4" />
              </svg>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
