import type { Metadata } from 'next/types'

import React from 'react'
import { draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import PageClient from './page.client'
import { MagazinStranka } from '@/components/Magazin/Stranka'
import { nactiMagazin } from '@/components/Magazin/data'
import { DEFAULT_LOCALE, jeLocale } from '@/i18n/config'
import { vynutZivost } from '@/i18n/zivost'
import { cestaMagazinu, lokalizujCestu, rssCesta } from '@/i18n/routing'
import { t } from '@/i18n/ui'
import { hreflangVypisu } from '@/i18n/vypis'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{ locale: string }>
}

/** Domovská stránka magazínu (ADR-009, DESIGN.md 8.5). */
export default async function Page({ params: paramsPromise }: Args) {
  const { locale } = await paramsPromise
  if (!jeLocale(locale)) notFound()
  vynutZivost(locale, cestaMagazinu(), (await draftMode()).isEnabled)

  const data = await nactiMagazin({ locale, strana: 1 })

  // Bez jediného přeloženého článku magazín v cizím jazyce neexistuje → česká verze.
  if (locale !== 'cs' && data.celkem === 0) redirect(lokalizujCestu(cestaMagazinu(), 'cs'))

  return (
    <>
      <PageClient />
      <MagazinStranka data={data} locale={locale} />
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: param } = await paramsPromise
  const locale = jeLocale(param) ? param : DEFAULT_LOCALE
  // hreflang jen při ≥ 2 jazycích výpisu (sekce 6): jinak beze změny.
  const languages = await hreflangVypisu(cestaMagazinu())
  const canonical = lokalizujCestu(cestaMagazinu(), locale)
  const title = t(locale, 'posts.metaTitle')
  const description = t(locale, 'posts.metaDescription')
  return {
    title,
    description,
    // `alternates` stránky přepíše layout celý: RSS se musí uvést znovu.
    alternates: { canonical, ...(languages ? { languages } : {}), types: { 'application/rss+xml': [{ url: rssCesta(locale), title: t(locale, 'rss.title') }] } },
    openGraph: mergeOpenGraph({ title, description, url: canonical, type: 'website' }, locale),
  }
}
