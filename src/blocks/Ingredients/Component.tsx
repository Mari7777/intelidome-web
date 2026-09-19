import React from 'react'

import type { Media } from '@/payload-types'

import { Media as MediaComponent } from '@/components/Media'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { cn } from '@/utilities/ui'

export type IngredientsBlockProps = {
  heading?: string | null
  lead?: string | null
  items?:
    | {
        image?: (number | null) | Media
        name?: string | null
        text?: string | null
        note?: string | null
        id?: string | null
      }[]
    | null
  blockName?: string | null
  blockType?: 'ingredients'
  className?: string
}

/**
 * Karta složek (DS: žádné boxy ani stíny — holá fotografie s radiusem
 * 20 px a text pod ní; mřížka na ose edge, 4 sloupce → 2 pod 1130 px).
 * Kořen nese reveal skupinu, karty se odhalují jako děti (6.3.2).
 */
export const IngredientsBlock: React.FC<IngredientsBlockProps> = ({
  className,
  heading,
  items,
  lead,
}) => {
  if (!items?.length) return null

  /* Přehledový modul = krémový pás (8.1 p. 5, stejná gramatika jako
     přehledové tabulky): nese posun povrchu v dlouhé kapitole. */
  return (
    <div
      className={cn('id-ingredients not-prose id-band id-band--cream id-band--self', className)}
      data-rv-group=""
    >
      {heading ? <h3 className="rv id-ingredients__h">{nezlomitelneMezery(heading)}</h3> : null}
      {lead ? <p className="rv id-ingredients__lead">{nezlomitelneMezery(lead)}</p> : null}
      <div className="id-ingredients__grid">
        {items.map((item, i) => (
          <figure className="rv id-ingredients__item" key={item.id ?? i}>
            {item.image && typeof item.image === 'object' ? (
              <MediaComponent
                className="id-ingredients__media"
                imgClassName="id-ingredients__img"
                resource={item.image}
                size="(max-width: 1129px) 50vw, 25vw"
              />
            ) : null}
            <figcaption>
              <strong className="id-ingredients__name">{nezlomitelneMezery(item.name ?? '')}</strong>
              <span className="id-ingredients__text">{nezlomitelneMezery(item.text ?? '')}</span>
              {item.note ? (
                <span className="id-ingredients__note">{nezlomitelneMezery(item.note)}</span>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
