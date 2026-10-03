import React from 'react'

import type { Locale } from '@/i18n/config'
import { t } from '@/i18n/ui'
import { cn } from '@/utilities/ui'
import { NA_STRANU } from './skladba'
import type { RadekData } from './data'
import { Radek } from './Radek'
import { Strankovani } from './Strankovani'

/**
 * Přehled „Všechny články“ (DESIGN.md 8.5 ř. k+1): vždy bílý, textové řádky
 * od nejnovějšího, jediná stránkovaná část magazínu. Na stranách 2+ (a bez
 * témat) je prvním pásem stránky, proto `staticky` jako první téma.
 */
export function Rejstrik({
  celkem,
  locale,
  pocetStran,
  rejstrik,
  staticky,
  strana,
}: {
  celkem: number
  locale: Locale
  pocetStran: number
  rejstrik: RadekData[]
  staticky: boolean
  strana: number
}) {
  const od = (strana - 1) * NA_STRANU + 1
  const popis =
    pocetStran > 1
      ? t(locale, 'magazin.vsechnyRozsah')(od, od + rejstrik.length - 1, celkem)
      : t(locale, 'magazin.vsechnyPopis')(celkem)
  return (
    <section aria-labelledby="vsechny-clanky-h" className="id-band id-mag-pas--bila id-mag-sekce" id="vsechny-clanky">
      <div className="id-band__inner id-2col id-2col--narrow-left" data-rv-group={staticky ? undefined : ''}>
        <div className={cn(!staticky && 'rv', 'id-mag-sekce__hlava')}>
          <h2 className="id-mag-sekce__titulek" id="vsechny-clanky-h">
            {t(locale, 'magazin.vsechny')}
          </h2>
          <p className="id-mag-sekce__meta">{celkem ? popis : t(locale, 'magazin.prazdno')}</p>
        </div>
        <div className={cn(!staticky && 'rv')}>
          <ol className="id-mag-seznam" role="list">
            {rejstrik.map((radek) => (
              <Radek key={radek.id} locale={locale} radek={radek} varianta="rejstrik" />
            ))}
          </ol>
          <Strankovani locale={locale} pocet={pocetStran} strana={strana} />
        </div>
      </div>
    </section>
  )
}
