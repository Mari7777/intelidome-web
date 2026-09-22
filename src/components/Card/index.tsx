'use client'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
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
  /* Karta je jediný text webu mimo lexikální strom, takže si českou sazbu musí
     zajistit sama. Původní řádek dělal pravý opak: `/\s/` v JS zahrnuje U+00A0,
     takže pevné mezery MAZAL a na 320 px visely v obou kartách jednopísmenné
     spojky na konci řádku. */
  const sanitizedDescription = description ? nezlomitelneMezery(description) : description
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
          /* Kartový titulek podle DESIGN.md 7.5, kde stupeň karty stojí:
             `.id-card--dark-outline` 17 px, `.id-step` 16,5 px. `text-lg`
             (18 px / lh 1,556) byl mimo škálu 4.2 a nad stropem line-heightu
             1,25 (4.3 p. 7). Roli `title-sm` sem nebereme: je vázaná na vw,
             kdežto karta se v třísloupcové mřížce s rostoucím oknem zužuje. */
          <h3 className="font-[family-name:var(--id-f-display)] text-[17px] leading-[1.3] font-semibold tracking-[-0.01em] text-[var(--id-ink)]">
            <Link className="no-underline" href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}
        {description && (
          /* Perex karty sází token body-sm ze škály 4.2 (14,5 / 1,55 / −0,006em),
             ne volných 15px s Tailwindím `leading-normal`; táž dvojice jako
             `.id-feature__text` pod titulkem karty. */
          <div className="mt-2 text-[length:var(--id-t-body-sm)] leading-[1.55] tracking-[-0.006em] text-[var(--id-ink-2)] max-w-[var(--id-measure)]">
            {description && <p>{sanitizedDescription}</p>}
          </div>
        )}
      </div>
    </article>
  )
}
