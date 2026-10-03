import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { Card } from '../../components/Card'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Locale } from '@/i18n/config'
import { zobrazitelny } from '@/i18n/zobrazitelny'
import { t } from '@/i18n/ui'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: DefaultTypedEditorState
  locale: Locale
}

/*
  `sizes` karty: slot je půlka (od lg třetina) kontejneru 1 360 px a master
  21:9 se do rámu 3:2 ořezává přes object-fit cover, takže potřebuje
  ~2,36 / 1,5 ≈ 1,57× širší zdroj než slot. S `34vw` pro dvě karty se
  stahovala o polovinu menší varianta a obraz byl měkký (kontrola článků
  3. 10. 2026).
*/
// 1020 px: na retině 2 040 px, tedy varianta 2048, ne skok na celý originál 3840.
const SIZES_DVE = '(min-width: 1440px) 1020px, (min-width: 768px) 79vw, 157vw'
const SIZES_TRI = '(min-width: 1440px) 680px, (min-width: 1024px) 52vw, (min-width: 768px) 79vw, 157vw'

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent, locale } = props
  const karty = (docs ?? []).filter((doc) => typeof doc !== 'string' && zobrazitelny(doc, locale))

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
          {t(locale, 'related.heading')}
        </h2>
      )}

      {/* Tři karty od lg v jedné řadě: ve dvou sloupcích stála třetí sama
          vedle prázdné buňky (kontrola článků 3. 10. 2026). */}
      <div className={clsx('grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch', karty.length === 3 && 'lg:grid-cols-3')}>
        {karty.map((doc, index) => (
          <Card key={index} doc={doc} relationTo="posts" showCategories sizes={karty.length === 3 ? SIZES_TRI : SIZES_DVE} />
        ))}
      </div>
    </div>
  )
}
