import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

// Light editorial article header (InteliDome DS): eyebrow with categories,
// display title, meta line, then the hero image as a rounded card — never
// text over a dark image overlay. Works with and without a hero image.
export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const categoryTitles = (categories ?? [])
    .filter((category): category is Exclude<typeof category, number> => typeof category === 'object')
    .map((category) => category?.title || 'Bez kategorie')

  return (
    <header className="container pt-12 pb-4 md:pt-16">
      <div className="mx-auto max-w-[var(--id-measure)]">
        <p className="id-eyebrow mb-4">{categoryTitles.length ? categoryTitles.join(' · ') : 'Blog'}</p>

        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-[1.07] font-semibold tracking-[-0.025em] text-[var(--id-ink)] text-balance">
          {title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-2 text-[15px] text-[var(--id-ink-2)]">
          {hasAuthors && <span>{formatAuthors(populatedAuthors)}</span>}
          {hasAuthors && publishedAt && <span aria-hidden="true">·</span>}
          {publishedAt && <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>}
        </div>
      </div>

      {heroImage && typeof heroImage !== 'string' && (
        <div className="mx-auto mt-10 max-w-[880px]">
          <Media
            imgClassName="w-full rounded-[var(--id-r-card)] shadow-[var(--id-shadow)]"
            priority
            resource={heroImage}
          />
        </div>
      )}
    </header>
  )
}
