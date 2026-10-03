import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { MagazinStranka } from '@/components/Magazin/Stranka'
import { nactiMagazin } from '@/components/Magazin/data'
import { NA_STRANU } from '@/components/Magazin/skladba'
import { DEFAULT_LOCALE, jeLocale } from '@/i18n/config'
import { vynutZivost } from '@/i18n/zivost'
import { cestaMagazinu, lokalizujCestu, rssCesta } from '@/i18n/routing'
import { t } from '@/i18n/ui'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export const revalidate = 600

type Args = {
  params: Promise<{
    locale: string
    cislo: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { locale, cislo } = await paramsPromise
  if (!jeLocale(locale)) notFound()
  // Strana 1 je `/magazin` (vede na ni trvalé přesměrování v redirects.ts);
  // tady jen strany 2+ v kanonickém tvaru (ne 02, 2.0, 1e1) a s rozumnou délkou —
  // obří číslo by Postgres odmítl jako OFFSET (500). Mimo rozsah 404 (ADR-009 bod 3).
  if (!/^[1-9]\d{0,5}$/.test(cislo)) notFound()
  const strana = Number(cislo)
  if (strana < 2) notFound()
  vynutZivost(locale, cestaMagazinu(strana), (await draftMode()).isEnabled)

  const data = await nactiMagazin({ locale, strana })

  // Bez jediného přeloženého článku magazín v cizím jazyce neexistuje → česká verze.
  if (locale !== 'cs' && data.celkem === 0) redirect(lokalizujCestu(cestaMagazinu(), 'cs'))
  if (strana > data.pocetStran) {
    // Cizí jazyk má méně přeložených článků: přepínač jazyků vede na stejnou
    // stranu, která v něm nemusí existovat → domovská stránka magazínu jazyka.
    if (locale !== 'cs') redirect(lokalizujCestu(cestaMagazinu(), locale))
    notFound()
  }

  return (
    <>
      <PageClient />
      <MagazinStranka data={data} locale={locale} />
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: param, cislo } = await paramsPromise
  const locale = jeLocale(param) ? param : DEFAULT_LOCALE
  const n = String(Number(cislo) || '')
  // hreflang nese jen `/magazin` (sekce 6, táž množina jako sitemapa). Stránka N
  // v cizím jazyce nemusí existovat (méně přeložených článků → prázdný výpis),
  // a jazykový odkaz na neexistující obsah nesmí vzniknout (seo-lawn-series).
  const canonical = lokalizujCestu(cestaMagazinu(Number(cislo)), locale)
  const title = t(locale, 'posts.page')(n)
  const description = t(locale, 'posts.pageDescription')(n)
  return {
    title,
    description,
    alternates: { canonical, types: { 'application/rss+xml': rssCesta(locale) } },
    openGraph: mergeOpenGraph({ title, description, url: canonical, type: 'website' }, locale),
  }
}

// Jen `{ cislo }` od 2 — jazyk dává nadřazený `[locale]`. Dělitel = počet článků na stranu.
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / NA_STRANU)

  const pages: { cislo: string }[] = []

  for (let i = 2; i <= totalPages; i++) {
    pages.push({ cislo: String(i) })
  }

  return pages
}
