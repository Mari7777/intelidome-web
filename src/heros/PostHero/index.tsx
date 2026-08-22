import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { readingTime } from '@/utilities/readingTime'

/**
 * Filmový hero článku (DESIGN.md 8.2 ř. 1 + prompt 1).
 *
 * Obsidiánový pás přes celou obrazovku, fotografie nese emoci (9.1:
 * full-bleed bez radiusu, scrim nejvýš do 45 % výšky), obsah sedí dole.
 * Nástup je orchestrovaný, ne jeden fade na všem: titulek stoupá z masky
 * po řádcích, ostatní se prolne. Bez fotografie zůstává čistý pás.
 */
export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, content, heroImage, meta, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const categoryTitles = (categories ?? [])
    .filter((category): category is Exclude<typeof category, number> => typeof category === 'object')
    .map((category) => category?.title || '')
    .filter(Boolean)

  const eyebrow = categoryTitles.length ? categoryTitles.join(' · ') : 'Návody · Závlaha'

  // Titulek po řádcích: každý má vlastní masku, aby mohl stoupat zvlášť.
  // Kvalifikátor za dvojtečkou není součást titulku — je to druhý hlas.
  const [headline, qualifier] = splitTitle(title)

  // Lead nese slib. Použijeme meta description (už je napsaná a je to
  // přesně slib článku); kvalifikátor je nouzová varianta.
  const lead = meta?.description?.trim() || qualifier

  const minutes = readingTime(content)
  const metaItems = [
    minutes ? `${minutes} min čtení` : null,
    hasAuthors ? formatAuthors(populatedAuthors) : null,
    'InteliDome Journal',
    publishedAt ? formatDateTime(publishedAt) : null,
  ].filter(Boolean) as string[]

  return (
    <header
      className="id-hero relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-obsidian"
      data-surface="dark"
    >
      {heroImage && typeof heroImage !== 'string' && (
        <div className="absolute inset-0" aria-hidden="true">
          <Media
            fill
            imgClassName="id-hero__img h-full w-full object-cover"
            priority
            resource={heroImage}
            pictureClassName="h-full w-full"
          />
          <div className="id-hero__scrim absolute inset-0" />
        </div>
      )}

      <div className="relative container pt-[clamp(96px,14vw,160px)] pb-[clamp(40px,6vw,64px)]">
        <p className="id-hero__eyebrow id-hero__fade">{eyebrow}</p>

        <h1 className="id-hero__title mt-5 max-w-[13ch] text-ink-dark">
          <span className="id-hline">
            <span>{headline}</span>
          </span>
        </h1>

        {lead && <p className="id-hero__lead id-hero__fade">{lead}</p>}

        <p className="id-hero__fade id-hero__meta">
          {metaItems.map((item, index) => (
            <span className="id-hero__meta-item" key={item}>
              {index > 0 && <span aria-hidden="true">·&nbsp;</span>}
              {item}
            </span>
          ))}
        </p>
      </div>

      <a className="id-hero__cue" href="#obsah" aria-label="Přejít na článek">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 2v11M3.5 9 8 13.5 12.5 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </header>
  )
}

/** Rozdělí titulek na hlavní větu a kvalifikátor za dvojtečkou. */
function splitTitle(title: string): [string, string | null] {
  const at = title.indexOf(':')
  if (at === -1) return [title, null]
  return [title.slice(0, at).trim(), title.slice(at + 1).trim() || null]
}
