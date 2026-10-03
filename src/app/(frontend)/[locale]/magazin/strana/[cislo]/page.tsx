import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { DEFAULT_LOCALE, jeLocale } from '@/i18n/config'
import { vynutZivost } from '@/i18n/zivost'
import { cestaMagazinu, lokalizujCestu } from '@/i18n/routing'
import { t } from '@/i18n/ui'

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
  const sanitizedPageNumber = Number(cislo)
  if (sanitizedPageNumber < 2) notFound()
  vynutZivost(locale, cestaMagazinu(sanitizedPageNumber), (await draftMode()).isEnabled)
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    locale,
    page: sanitizedPageNumber,
    overrideAccess: false,
    // Cizí jazyk vypisuje jen články s hotovým překladem (A6).
    ...(locale !== 'cs' ? { where: { prelozeno: { equals: true } } } : {}),
  })

  // Bez jediného přeloženého článku výpis v cizím jazyce neexistuje → česká verze.
  if (locale !== 'cs' && posts.totalDocs === 0) redirect(lokalizujCestu(cestaMagazinu(), 'cs'))
  if (sanitizedPageNumber > posts.totalPages) {
    // Cizí jazyk má méně přeložených článků: přepínač jazyků vede na stejnou
    // stranu, která v něm nemusí existovat → domovská stránka magazínu jazyka.
    if (locale !== 'cs') redirect(lokalizujCestu(cestaMagazinu(), locale))
    notFound()
  }

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{t(locale, 'posts.title')}</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          locale={locale}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive locale={locale} posts={posts.docs} />

      <div className="container">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: param, cislo } = await paramsPromise
  const locale = jeLocale(param) ? param : DEFAULT_LOCALE
  // hreflang nese jen `/magazin` (sekce 6, táž množina jako sitemapa). Stránka N
  // v cizím jazyce nemusí existovat (méně přeložených článků → prázdný výpis),
  // a jazykový odkaz na neexistující obsah nesmí vzniknout (seo-lawn-series).
  return {
    title: t(locale, 'posts.page')(String(Number(cislo) || '')),
    alternates: { canonical: lokalizujCestu(cestaMagazinu(Number(cislo)), locale) },
  }
}

// Jen `{ cislo }` od 2 — jazyk dává nadřazený `[locale]`. Dělitel = limit výpisu (12).
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 12)

  const pages: { cislo: string }[] = []

  for (let i = 2; i <= totalPages; i++) {
    pages.push({ cislo: String(i) })
  }

  return pages
}
