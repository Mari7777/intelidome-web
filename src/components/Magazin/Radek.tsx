import Image from 'next/image'
import React from 'react'

import type { Locale } from '@/i18n/config'
import { t } from '@/i18n/ui'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { formatDateTime } from '@/utilities/formatDateTime'
import { cn } from '@/utilities/ui'
import type { RadekData } from './data'

/** Obrysová ikona kalkulátoru (9.3: stroke 1,6, currentColor) — „hlas“, ne pilulka (§14 p. 6). */
const IkonaKalkulatoru = () => (
  <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 20 20">
    <rect height="15" rx="2" width="12" x="4" y="2.5" />
    <path d="M7 6h6M7 10h.01M10 10h.01M13 10h.01M7 13.5h.01M10 13.5h.01M13 13.5h.01" />
  </svg>
)

/**
 * Řádek článku (DESIGN.md 7.15): bez rámečku a stínu, hairline uvnitř
 * komponenty. Jediný odkaz na titulku je roztažený přes řádek (jeden tab stop,
 * bez JS). Varianta `skupina` má čtvercový náhled, `rejstrik` datum.
 */
export function Radek({
  eager,
  locale,
  radek,
  varianta,
}: {
  eager?: boolean
  locale: Locale
  radek: RadekData
  varianta: 'skupina' | 'rejstrik'
}) {
  const kicker =
    varianta === 'skupina'
      ? radek.dil
        ? (
            <>
              {t(locale, 'magazin.dil')(radek.dil.k, radek.dil.z)}
              {radek.dil.k === 1 ? (
                <>
                  {' · '}
                  <strong className="id-mag-radek__start">{t(locale, 'magazin.zacnete')}</strong>
                </>
              ) : null}
            </>
          )
        : null
      : radek.tema
        ? `${radek.tema.titulek}${radek.dil ? ` · ${t(locale, 'magazin.dilKratce')(radek.dil.k)}` : ''}`
        : null

  return (
    <li className={cn('id-mag-radek', varianta === 'rejstrik' && 'id-mag-radek--rejstrik')}>
      {varianta === 'skupina' ? (
        <div aria-hidden="true" className="id-mag-radek__nahled">
          {radek.nahled ? (
            <Image
              alt=""
              height={radek.nahled.height}
              loading={eager ? 'eager' : 'lazy'}
              quality={72}
              sizes="(min-width: 640px) 120px, 80px"
              src={radek.nahled.src}
              width={radek.nahled.width}
            />
          ) : null}
        </div>
      ) : radek.datum ? (
        <time className="id-mag-radek__datum" dateTime={radek.datum}>
          {formatDateTime(radek.datum, locale)}
        </time>
      ) : (
        <span className="id-mag-radek__datum" />
      )}
      <div className="id-mag-radek__text">
        {kicker ? <p className="id-mag-radek__kicker">{kicker}</p> : null}
        <h3 className="id-mag-radek__titulek">
          <a className="id-mag-radek__a" href={radek.href}>
            {nezlomitelneMezery(radek.titulek)}
          </a>
        </h3>
        {radek.perex ? <p className="id-mag-radek__perex">{nezlomitelneMezery(radek.perex)}</p> : null}
      </div>
      <p className="id-mag-radek__meta">
        {radek.minuty ? <span>{nezlomitelneMezery(t(locale, 'hero.reading')(radek.minuty))}</span> : null}
        {radek.kalkulatory.length ? (
          <span className="id-mag-radek__kalk">
            <IkonaKalkulatoru />
            {t(locale, 'magazin.kalkulator')(radek.kalkulatory.length)}
          </span>
        ) : null}
      </p>
    </li>
  )
}
