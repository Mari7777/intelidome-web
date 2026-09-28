import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { Card } from '../../components/Card'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Locale } from '@/i18n/config'
import { zobrazitelny } from '@/i18n/zobrazitelny'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: DefaultTypedEditorState
  locale: Locale
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent, locale } = props

  // Výchozí nadpis je sekční H2, tedy role `title` ze škály 4.2 — doslova týž
  // zápis jako v blocích Chapter, Faq, Split a ProductBand. `text-2xl` stál mimo
  // škálu a jeho line-height 1,333 nad stropem 1,25 pro display role (4.3 p. 7);
  // chybělo i `text-wrap: balance` (4.3 p. 3). Větev s introContent jede přes
  // `.prose h2`, kde stupeň `title` platí už dnes — ta se nemění.
  return (
    <div className={clsx('lg:container', className)}>
      {introContent ? (
        <RichText data={introContent} enableGutter={false} locale={locale} />
      ) : (
        <h2 className="mb-6 font-[family-name:var(--id-f-display)] text-[length:var(--id-t-title)] leading-[1.05] font-semibold tracking-[-0.025em] text-[var(--id-ink)] [text-wrap:balance]">
          Související články
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
        {docs?.filter((doc) => zobrazitelny(doc, locale)).map((doc, index) => {
          if (typeof doc === 'string') return null

          return <Card key={index} doc={doc} relationTo="posts" showCategories />
        })}
      </div>
    </div>
  )
}
