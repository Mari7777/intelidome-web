'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'overflow-hidden rounded-[var(--id-r-card)] border border-[var(--id-line-soft)] bg-card shadow-[var(--id-shadow)]',
        'transition-[transform,box-shadow] duration-250 ease-[var(--id-ease)] hover:-translate-y-[3px] hover:cursor-pointer hover:shadow-[var(--id-shadow-lg)] motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full">
        {!metaImage && <div className="aspect-video w-full bg-[var(--id-bg-2)]" />}
        {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
      </div>
      <div className="p-5">
        {showCategories && hasCategories && (
          <div className="mb-3 flex flex-wrap gap-2">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category

                const categoryTitle = titleFromCategory || 'Bez kategorie'

                return (
                  <span className="id-chip" key={index}>
                    {categoryTitle}
                  </span>
                )
              }

              return null
            })}
          </div>
        )}
        {titleToUse && (
          <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--id-ink)]">
            <Link className="no-underline" href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}
        {description && (
          <div className="mt-2 text-[15px] leading-normal text-[var(--id-ink-2)]">
            {description && <p>{sanitizedDescription}</p>}
          </div>
        )}
      </div>
    </article>
  )
}
