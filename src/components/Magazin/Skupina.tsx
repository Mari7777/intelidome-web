import React from 'react'

import type { Locale } from '@/i18n/config'
import { t } from '@/i18n/ui'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { cn } from '@/utilities/ui'
import type { SkupinaData } from './data'
import { Radek } from './Radek'

/**
 * Pás tématu (DESIGN.md 8.5 ř. 2…k): vlevo hlava (od 1130 px sticky), vpravo
 * řádky 7.15 — u série v pořadí čtení s „Díl k z N“, jinak od nejnovějšího.
 */
export function Skupina({ krem, locale, prvni, skupina }: { krem: boolean; locale: Locale; prvni: boolean; skupina: SkupinaData }) {
  const id = `tema-${skupina.slug}`
  const meta = [
    skupina.minutCelkem ? t(locale, 'magazin.cteniCelkem')(skupina.minutCelkem) : null,
    skupina.kalkulatoru ? t(locale, 'hero.calculators')(skupina.kalkulatoru) : null,
  ].filter(Boolean)
  return (
    <section
      aria-labelledby={`${id}-h`}
      className={cn('id-band id-mag-sekce', krem ? 'id-band--cream id-mag-pas--krem' : 'id-mag-pas--bila')}
      id={id}
    >
      <div className="id-band__inner id-2col id-2col--narrow-left" data-rv-group>
        <div className="rv id-mag-sekce__hlava">
          <p className="id-eyebrow">
            {skupina.serie ? t(locale, 'magazin.serie')(skupina.pocet) : t(locale, 'magazin.tema')(skupina.pocet)}
          </p>
          <h2 className="id-mag-sekce__titulek" id={`${id}-h`}>
            {nezlomitelneMezery(skupina.titulek)}
          </h2>
          {skupina.popis ? <p className="id-mag-sekce__popis">{nezlomitelneMezery(skupina.popis)}</p> : null}
          {meta.length ? <p className="id-mag-sekce__meta">{nezlomitelneMezery(meta.join(' · '))}</p> : null}
        </div>
        <ol className="rv id-mag-seznam" role="list">
          {skupina.radky.map((radek, i) => (
            <Radek eager={prvni && i < 2} key={radek.id} locale={locale} radek={radek} varianta="skupina" />
          ))}
        </ol>
      </div>
    </section>
  )
}
