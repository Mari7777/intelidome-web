import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { readingTime } from '@/utilities/readingTime'

/**
 * Filmový hero článku (DESIGN.md 8.2 ř. 1 + prompt 1).
 *
 * Obsidiánový pás přes celou šířku, fotografie nese emoci (9.1: full-bleed
 * bez radiusu), obsah sedí dole. Nástup je orchestrovaný, ne jeden fade na
 * všem: titulek stoupá z masky po řádcích, eyebrow a meta se prolnou.
 * Bez fotografie zůstává čistý obsidiánový pás — nikdy prázdné místo.
 */
export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, content, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const categoryTitles = (categories ?? [])
    .filter((category): category is Exclude<typeof category, number> => typeof category === 'object')
    .map((category) => category?.title || '')
    .filter(Boolean)

  const eyebrow = categoryTitles.length ? categoryTitles.join(' · ') : 'Návody · Závlaha'

  // Titulek po řádcích: každý řádek má vlastní masku, aby mohl stoupat zvlášť.
  // Dělíme na dvojtečce — kvalifikátor za ní je vedlejší hlas, ne titulek.
  const [headline, qualifier] = splitTitle(title)

  const minutes = readingTime(content)
  const meta = [
    minutes ? `${minutes} min čtení` : null,
    hasAuthors ? formatAuthors(populatedAuthors) : null,
    'InteliDome Journal',
  ].filter(Boolean) as string[]

  return (
    <header
      className="id-hero relative flex min-h-[88svh] flex-col justify-end overflow-hidden bg-obsidian"
      data-surface="dark"
    >
      {heroImage && typeof heroImage !== 'string' && (
        <div className="absolute inset-0" aria-hidden="true">
          <Media
            fill
            imgClassName="h-full w-full object-cover"
            priority
            resource={heroImage}
            pictureClassName="h-full w-full"
          />
          {/* Scrim jen tam, kde leží text — obraz zůstane obrazem (9.1). */}
          <div className="id-hero__scrim absolute inset-0" />
        </div>
      )}

      <div className="relative container pb-[clamp(48px,7vw,72px)] pt-[clamp(96px,14vw,160px)]">
        <p className="id-eyebrow id-hero__fade">{eyebrow}</p>

        <h1 className="id-hero__title mt-5 max-w-[13ch] text-ink-dark">
          <span className="id-hline">
            <span>{headline}</span>
          </span>
          {qualifier && (
            <span className="id-hline id-hline--2">
              <span className="id-hero__qualifier">{qualifier}</span>
            </span>
          )}
        </h1>

        <p className="id-hero__fade id-hero__meta mt-7 flex flex-wrap items-center gap-x-3 gap-y-1">
          {meta.map((item, index) => (
            <React.Fragment key={item}>
              {index > 0 && <span aria-hidden="true">·</span>}
              <span>{item}</span>
            </React.Fragment>
          ))}
          {publishedAt && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
            </>
          )}
        </p>
      </div>
    </header>
  )
}

/** Rozdělí titulek na hlavní větu a kvalifikátor za dvojtečkou. */
function splitTitle(title: string): [string, string | null] {
  const at = title.indexOf(':')
  if (at === -1) return [title, null]
  return [title.slice(0, at).trim(), title.slice(at + 1).trim() || null]
}
