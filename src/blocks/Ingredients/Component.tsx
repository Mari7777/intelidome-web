import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import React from 'react'

import type { Media } from '@/payload-types'

import { Media as MediaComponent } from '@/components/Media'
import RichText from '@/components/RichText'
import { DRAWINGS, type DrawingKey } from '@/components/figures/registry'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { cn } from '@/utilities/ui'

import { IngredientsTabs } from './IngredientsTabs'

export type IngredientsBlockProps = {
  heading?: string | null
  lead?: string | null
  items?:
    | {
        image?: (number | null) | Media
        name?: string | null
        text?: string | null
        note?: string | null
        title?: string | null
        detail?: DefaultTypedEditorState | null
        panelImage?: (number | null) | Media
        drawing?: string | null
        drawingAlt?: string | null
        id?: string | null
      }[]
    | null
  blockName?: string | null
  blockType?: 'ingredients'
  className?: string
}

/**
 * Karta složek (přehledový modul jako krémový pás, 8.1 p. 5).
 * Karty = fotka + jméno + role + „kam patří" (vždy viditelné, DS: holá
 * fotografie s radiusem 20, žádné boxy). Výběr karty (hover, klepnutí,
 * fokus, šipky) otevře v panelu pod kartami PLNOU sekci složky —
 * autorův text tak nezabírá tok článku. Panel může nést i technickou
 * kresbu (mykorhizní vlákna). Interakci řeší klient `IngredientsTabs`;
 * tady se panely vykreslují na serveru a předávají jako uzly.
 */
export const IngredientsBlock: React.FC<IngredientsBlockProps> = ({
  className,
  heading,
  items,
  lead,
}) => {
  if (!items?.length) return null

  const labels = items.map((item, i) => item.name ?? `Složka ${i + 1}`)

  const tabs = items.map((item) => (
    <figure className="id-ingredients__item" key={item.id ?? item.name}>
      {item.image && typeof item.image === 'object' ? (
        <MediaComponent
          className="id-ingredients__media"
          imgClassName="id-ingredients__img"
          resource={item.image}
          size="(max-width: 1129px) 50vw, 25vw"
        />
      ) : null}
      <figcaption>
        <span className="id-ingredients__namerow">
          <strong className="id-ingredients__name">{nezlomitelneMezery(item.name ?? '')}</strong>
          <span aria-hidden="true" className="id-ingredients__aff">
            <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
              <path d="M3 5.2 7 9.2 11 5.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </span>
        </span>
        <span className="id-ingredients__text">{nezlomitelneMezery(item.text ?? '')}</span>
        {item.note ? (
          <span className="id-ingredients__note">{nezlomitelneMezery(item.note)}</span>
        ) : null}
      </figcaption>
    </figure>
  ))

  const panels = items.map((item) => {
    const Kresba =
      item.drawing && item.drawing in DRAWINGS
        ? DRAWINGS[item.drawing as DrawingKey].portrait ?? DRAWINGS[item.drawing as DrawingKey].wide
        : null
    const foto = item.panelImage && typeof item.panelImage === 'object' ? item.panelImage : null
    const maObraz = Boolean(foto || Kresba)
    return (
      <div className={cn('id-ingredients__panel', maObraz && 'id-ingredients__panel--s-obrazem')} key={item.id ?? item.name}>
        <div className="id-ingredients__panel-text">
          {item.title ? <h3>{nezlomitelneMezery(item.title)}</h3> : null}
          {item.detail ? <RichText data={item.detail} enableGutter={false} enableProse={false} /> : null}
        </div>
        {foto ? (
          <figure className="id-ingredients__panel-fig">
            <MediaComponent
              imgClassName="id-ingredients__panel-img"
              resource={foto}
              size="(max-width: 1129px) 100vw, 420px"
            />
          </figure>
        ) : Kresba ? (
          <figure aria-label={item.drawingAlt ?? undefined} className="id-ingredients__panel-fig" role="img">
            <Kresba />
          </figure>
        ) : null}
      </div>
    )
  })

  return (
    <div
      className={cn('id-ingredients not-prose id-band id-band--cream id-band--self', className)}
      data-rv-group=""
    >
      {heading ? <h3 className="rv id-ingredients__h">{nezlomitelneMezery(heading)}</h3> : null}
      {lead ? <p className="rv id-ingredients__lead">{nezlomitelneMezery(lead)}</p> : null}
      <IngredientsTabs labels={labels} panels={panels} tabs={tabs} />
    </div>
  )
}
