import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { Motion } from '@/components/motion/Motion'
import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import { articleJsonLd } from '@/utilities/articleSeo'
import { ArticleNavigation } from '@/components/ArticleNavigation'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { jeLocale } from '@/i18n/config'
import { verejnaCesta } from '@/i18n/routing'
import { vynutZivost } from '@/i18n/zivost'
import { najdiDokument, rozhodniDokument } from '@/i18n/dokumenty'

// Jen `{ slug }` — jazyk dává nadřazený `[locale]` (jen cs, ostatní na vyžádání).
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
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

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale, slug = '' } = await paramsPromise
  if (!jeLocale(locale)) notFound()
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const csCesta = verejnaCesta('posts', encodeURIComponent(decodedSlug), 'cs')
  vynutZivost(locale, csCesta, draft)
  // Cesta bez jazykového prefixu: CMS přesměrování (`from`) se zapisují česky.
  const url = '/posts/' + decodedSlug
  const post = await najdiDokument({ collection: 'posts', slug: decodedSlug, locale, draft })

  // Chybí → CMS přesměrování má přednost, jinak 404 (A6).
  if (!post) return <PayloadRedirects locale={locale} url={url} />
  // Existuje, ale bez hotového překladu → 307 na českou verzi; náhled prochází.
  rozhodniDokument({ doc: post, locale, draft, csCesta })

  // A form-heavy planning tool keeps native scrolling (DESIGN.md 6.5).
  const hasProfileCalculator = post.content.root.children.some((node) => {
    const fields = node.fields as { blockType?: string; kind?: string } | undefined
    return fields?.blockType === 'calculator' && fields.kind === 'pudni-profil'
  })

  return (
    <main>
      <article>
        <PageClient />

        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound locale={locale} url={url} />

        {draft && <LivePreviewListener />}

        {/* Nástupy sekcí + setrvačníkové brzdění: per-page opt-in dle 6.5,
            imerzivní obsah ano, formuláře a administrace nikdy. */}
        <Motion inertia={!hasProfileCalculator} />

        <PostHero post={post} />

        {/* Article JSON-LD (skill intellidome-web: JSON-LD dle typu stránky);
            FAQPage si přidává blok FAQ sám. `<` se escapuje kvůli </script>. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd(post)).replace(/</g, '\\u003c'),
          }}
        />

        {/*
          Tělo článku je jedna mřížka (DESIGN.md 8.1): `content` drží běžnou
          prózu, `edge` figury a dvousloupce, `full` celé pásy. Průvodce půdou
          má vlastní širší osu pro samostatné textové úseky.
        */}
        {/*
          Kotva musí viset na skutečném elementu: `ConvertRichText`
          z Payloadu props nepropouští, takže `id` na RichText se tiše
          zahodilo a šipka v heru mířila do prázdna. Kotva je prázdná
          značka PŘED tělem, ne obal kolem něj: fokusovatelný obal přebíral
          fokus po každém kliknutí do textu a další Tab pak odskočil na
          začátek článku, u kalkulátoru o 0,7–2,7 tisíce px (porota 12).
        */}
        <div className="id-anchor-target" id="obsah" tabIndex={-1} />
        <ArticleNavigation locale={locale} post={post} />
        <RichText
          className="id-article"
          data={post.content}
          enableGutter={false}
          locale={locale}
        />

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="container pb-16">
            <RelatedPosts
              className="mt-12 max-w-[52rem]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
              locale={locale}
            />
          </div>
        )}
      </article>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale, slug = '' } = await paramsPromise
  if (!jeLocale(locale)) return {}
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const { isEnabled: draft } = await draftMode()
  const post = await najdiDokument({ collection: 'posts', slug: decodedSlug, locale, draft })

  return {
    ...await generateMeta({ doc: post, collection: 'posts', locale }),
    ...(draft ? { robots: { index: false, follow: false } } : {}),
  }
}
