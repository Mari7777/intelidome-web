import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import PageClient from './page.client'
import { DEFAULT_LOCALE, jeLocale } from '@/i18n/config'
import { vynutZivost } from '@/i18n/zivost'
import { lokalizujCestu } from '@/i18n/routing'
import { t } from '@/i18n/ui'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{ locale: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { locale } = await paramsPromise
  if (!jeLocale(locale)) notFound()
  vynutZivost(locale, '/posts', (await draftMode()).isEnabled)
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    locale,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      prelozeno: true,
    },
    // Cizí jazyk vypisuje jen články s hotovým překladem (A6).
    ...(locale !== 'cs' ? { where: { prelozeno: { equals: true } } } : {}),
  })

  // Bez jediného přeloženého článku výpis v cizím jazyce neexistuje → česká verze.
  if (locale !== 'cs' && posts.totalDocs === 0) redirect(lokalizujCestu('/posts', 'cs'))

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
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: param } = await paramsPromise
  const locale = jeLocale(param) ? param : DEFAULT_LOCALE
  return {
    title: t(locale, 'posts.metaTitle'),
    description: t(locale, 'posts.metaDescription'),
    alternates: { canonical: lokalizujCestu('/posts', locale) },
  }
}
