import React from 'react'

import { CtaBandBlock } from '@/blocks/CtaBand/Component'
import { Motion } from '@/components/motion/Motion'
import type { Locale } from '@/i18n/config'
import { t } from '@/i18n/ui'
import { magazinJsonLd } from '@/utilities/articleSeo'
import type { MagazinData } from './data'
import { Kalkulatory } from './Kalkulatory'
import { Rejstrik } from './Rejstrik'
import { NA_STRANU } from './skladba'
import { Skupina } from './Skupina'
import { Zahlavi, type Kotva } from './Zahlavi'

/**
 * Domovská stránka magazínu (DESIGN.md 8.5): záhlaví → témata → všechny
 * články → kalkulátory → výzva. Strany 2+ mají jen kompaktní záhlaví,
 * přehled a výzvu. Setrvačníkový scroll ne (6.5: výpis není imerzivní obsah).
 */
export function MagazinStranka({ data, locale }: { data: MagazinData; locale: Locale }) {
  const prvni = data.strana === 1
  const kotvy: Kotva[] = prvni
    ? [
        ...data.skupiny.map((s) => ({ href: `#tema-${s.slug}`, nazev: s.titulek, pocet: s.pocet })),
        ...(data.kalkulatory.length >= 2
          ? [{ href: '#kalkulatory', nazev: t(locale, 'magazin.kalkulatory'), pocet: data.kalkulatory.length }]
          : []),
        { href: '#vsechny-clanky', nazev: t(locale, 'magazin.vsechny'), pocet: data.celkem },
      ]
    : []
  const jsonLd = magazinJsonLd({
    locale,
    strana: data.strana,
    naStranu: NA_STRANU,
    rejstrik: data.rejstrik,
    serie: data.skupiny.filter((s) => s.serie).map((s) => ({ slug: s.slug, titulek: s.titulek, radky: s.radky })),
  })
  return (
    <main className="id-mag">
      <Motion />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        type="application/ld+json"
      />
      <Zahlavi
        kompaktni={!prvni}
        kotvy={kotvy}
        locale={locale}
        novinka={data.novinka}
        pocetStran={data.pocetStran}
        strana={data.strana}
      />
      {data.skupiny.map((skupina, i) => (
        <Skupina key={skupina.slug} krem={i % 2 === 0} locale={locale} prvni={i === 0} skupina={skupina} />
      ))}
      <Rejstrik
        celkem={data.celkem}
        locale={locale}
        pocetStran={data.pocetStran}
        rejstrik={data.rejstrik}
        strana={data.strana}
      />
      {prvni && data.kalkulatory.length >= 2 ? <Kalkulatory kalkulatory={data.kalkulatory} locale={locale} /> : null}
      <CtaBandBlock
        buttonHref="/"
        buttonLabel={t(locale, 'nav.cta')}
        className="id-mag-pas--bila"
        locale={locale}
        sub={t(locale, 'magazin.cta.sub')}
        title={t(locale, 'magazin.cta.titulek')}
      />
    </main>
  )
}
