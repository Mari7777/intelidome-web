import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { jeLocale } from '@/i18n/config'
import { vynutZivost } from '@/i18n/zivost'

type Args = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { locale } = await paramsPromise
  if (!jeLocale(locale)) notFound()
  const { q: query } = await searchParamsPromise
  vynutZivost(locale, `/search${query ? `?q=${encodeURIComponent(query)}` : ''}`, (await draftMode()).isEnabled)
  const payload = await getPayload({ config: configPromise })

  const fulltext: Where | null = query
    ? {
        or: [
          {
            title: {
              like: query,
            },
          },
          {
            'meta.description': {
              like: query,
            },
          },
          {
            'meta.title': {
              like: query,
            },
          },
          {
            slug: {
              like: query,
            },
          },
        ],
      }
    : null

  // Cizí jazyk hledá jen v dokumentech s hotovým překladem (A17); čeština beze změny.
  const where: Where | undefined =
    locale === 'cs'
      ? (fulltext ?? undefined)
      : { and: [{ prelozeno: { equals: true } }, ...(fulltext ? [fulltext] : [])] }

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    locale,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      prelozeno: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(where ? { where } : {}),
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Hledání</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive locale={locale} posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container">Nic jsme nenašli.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Hledání',
    robots: { index: false, follow: true },
  }
}
