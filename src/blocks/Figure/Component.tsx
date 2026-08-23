import React from 'react'

import type { Props as MediaProps } from '@/components/Media/types'

import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { DRAWINGS, type DrawingKey } from '@/components/figures/registry'

// Local prop type — the generated `FigureBlock` interface does not exist until
// `payload generate:types` runs after this block is registered.
export type FigureBlockProps = {
  image?: MediaProps['resource']
  /** Klíč technické kresby (9.2). Když je vyplněný, `image` se ignoruje. */
  drawing?: string | null
  /** Popis kresby pro odečítač — u fotografie ho nese alt v knihovně médií. */
  alt?: string | null
  /** Written by hand in the admin — the block does not know its position on the page. */
  number?: string | null
  caption: string
  panel?: boolean | null
  id?: string | null
  blockType?: 'figure'
}

type Props = {
  className?: string
} & FigureBlockProps

/**
 * Formats the hand-written number into the DS convention "Obr. 01" (two digits).
 * Non-numeric input (e.g. "2a") is passed through untouched.
 */
const formatFigureNumber = (raw?: string | null): string | null => {
  const value = raw?.trim()
  if (!value) return null
  return /^\d+$/.test(value) ? `Obr. ${value.padStart(2, '0')}` : `Obr. ${value}`
}

// InteliDome DS 7.12 — numbered figure: image on a cream panel, hairline below,
// caption led by the "Obr. NN" label.
export const FigureBlock: React.FC<Props> = ({
  alt,
  className,
  caption,
  drawing,
  image,
  number,
  panel,
}) => {
  const label = formatFigureNumber(number)
  const withPanel = panel !== false
  const Drawing = drawing ? DRAWINGS[drawing as DrawingKey] : undefined

  /*
    Kresba je informační obraz, takže `role="img"` a popis nese ten prvek,
    který kresbu drží; samotné SVG je pro odečítač neviditelné (9.2 p. 8).

    Figura má viewBox 1080 px široký. Na telefonu (393 px) by se zmenšila
    na 36 % a popisky 12 px by klesly pod 5 px — nečitelné. Proto kresba
    drží spodní mez šířky a v užším panelu se posouvá do stran. Posuvná
    oblast musí být dosažitelná i klávesnicí, proto `tabIndex`.
  */
  const media = Drawing ? (
    <div
      aria-label={alt || caption}
      className="id-figure-svg -mx-[2px] overflow-x-auto px-[2px]"
      role="img"
      tabIndex={0}
    >
      <div className="min-w-[560px]">
        <Drawing />
      </div>
    </div>
  ) : (
    <Media
      htmlElement={null}
      resource={image}
      pictureClassName="block"
      imgClassName="block m-0 w-full h-auto rounded-[var(--id-r-card)]"
    />
  )

  return (
    <figure className={cn('mt-[54px] mb-[10px] w-full', className)}>
      {withPanel ? (
        <div className="rounded-[var(--id-r-card)] bg-[var(--id-cream,var(--id-bg-2))] p-[clamp(16px,3vw,40px)]">
          {media}
        </div>
      ) : (
        media
      )}

      <figcaption className="mt-[16px] flex max-w-[var(--id-maxw-prose)] items-baseline gap-[10px] border-t-[1px] border-[var(--id-line-soft)] pt-[14px] text-[13.5px] leading-[1.45] text-[var(--id-ink-2)]">
        {label && (
          <b className="font-[family-name:var(--id-f-display)] text-[11.5px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap text-[var(--id-ink)]">
            {label}
          </b>
        )}
        <span className="[text-wrap:pretty]">{caption}</span>
      </figcaption>
    </figure>
  )
}
