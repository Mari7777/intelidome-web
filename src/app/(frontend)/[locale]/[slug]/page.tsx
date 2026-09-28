import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import React from 'react'
import { homeStatic } from '@/fallbacks/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { jeLocale } from '@/i18n/config'
import { verejnaCesta } from '@/i18n/routing'
import { vynutZivost } from '@/i18n/zivost'
import { najdiDokument, rozhodniDokument } from '@/i18n/dokumenty'

// Jen `{ slug }` — jazyk dává nadřazený `[locale]` (jen cs, ostatní na vyžádání).
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    locale: string
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale, slug = 'home' } = await paramsPromise
  if (!jeLocale(locale)) notFound()
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const csCesta = verejnaCesta('pages', encodeURIComponent(decodedSlug), 'cs')
  vynutZivost(locale, csCesta, draft)
  // Cesta bez jazykového prefixu: CMS přesměrování (`from`) se zapisují česky.
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await najdiDokument({ collection: 'pages', slug: decodedSlug, locale, draft })

  // Placeholder until the real 'home' page is created in the CMS (jen cs;
  // cizí jazyk bez home jde na českou úvodní stránku).
  if (!page && slug === 'home') {
    if (locale !== 'cs') redirect('/')
    page = homeStatic
  }

  // Chybí → CMS přesměrování má přednost, jinak 404 (A6).
  if (!page) {
    return <PayloadRedirects locale={locale} url={url} />
  }
  // Existuje, ale bez hotového překladu → 307 na českou verzi; náhled prochází.
  rozhodniDokument({ doc: page, locale, draft, csCesta })

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound locale={locale} url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} locale={locale} />
      <RenderBlocks blocks={layout} locale={locale} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale, slug = 'home' } = await paramsPromise
  if (!jeLocale(locale)) return {}
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const { isEnabled: draft } = await draftMode()
  const page = await najdiDokument({ collection: 'pages', slug: decodedSlug, locale, draft })

  return {
    ...await generateMeta({ doc: page, collection: 'pages', locale }),
    ...(draft ? { robots: { index: false, follow: false } } : {}),
  }
}
