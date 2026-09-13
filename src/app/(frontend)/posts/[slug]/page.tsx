import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { Motion } from '@/components/motion/Motion'
import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import { getServerSideURL } from '@/utilities/getURL'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

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
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  return (
    <main>
      <article>
        <PageClient />

        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />

        {draft && <LivePreviewListener />}

        {/* Nástupy sekcí + setrvačníkové brzdění: per-page opt-in dle 6.5,
            imerzivní obsah ano, formuláře a administrace nikdy. */}
        <Motion inertia />

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
          Tělo článku je jedna mřížka (DESIGN.md 8.1): sloupec `content` drží
          prose na 700 px, `wide` pouští figury na 960 px a `full` nechá pásy
          přes celou šířku. Proto tu není žádný `container` ani `max-width` —
          šířku řídí mřížka, ne obal.
        */}
        {/*
          Kotva musí viset na skutečném elementu: `ConvertRichText`
          z Payloadu props nepropouští, takže `id` na RichText se tiše
          zahodilo a šipka v heru mířila do prázdna.
        */}
        <div className="id-anchor-target" id="obsah" tabIndex={-1}>
          <RichText className="id-article" data={post.content} enableGutter={false} />
        </div>

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="container pb-16">
            <RelatedPosts
              className="mt-12 max-w-[52rem]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          </div>
        )}
      </article>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

/** BlogPosting pro vyhledávače i AI crawlery — data jen z dokumentu, nic ručně. */
function articleJsonLd(post: Post) {
  const base = getServerSideURL()
  const hero = typeof post.heroImage === 'object' && post.heroImage?.url ? base + post.heroImage.url : undefined
  const authors = (post.populatedAuthors ?? []).map((author) => author?.name).filter(Boolean) as string[]

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta?.description ?? undefined,
    image: hero ? [hero] : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    inLanguage: 'cs',
    author: authors.length
      ? authors.map((name) => ({ '@type': 'Person', name }))
      : { '@type': 'Organization', name: 'InteliDome' },
    publisher: { '@type': 'Organization', name: 'InteliDome', url: base },
    mainEntityOfPage: `${base}/posts/${post.slug}`,
  }
}
