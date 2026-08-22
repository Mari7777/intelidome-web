import React from 'react'

import type { Props as MediaProps } from '@/components/Media/types'

import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'

// Local prop type — the generated `FigureBlock` interface does not exist until
// `payload generate:types` runs after this block is registered.
export type FigureBlockProps = {
  image?: MediaProps['resource']
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
// caption led by the "Obr. NN" label. Static content, no motion to gate.
export const FigureBlock: React.FC<Props> = ({ className, caption, image, number, panel }) => {
  const label = formatFigureNumber(number)
  const withPanel = panel !== false

  const media = (
    <Media
      htmlElement={null}
      resource={image}
      pictureClassName="block"
      imgClassName="block m-0 w-full h-auto rounded-[var(--id-r-md)]"
    />
  )

  return (
    <figure className={cn('mt-[54px] mb-[10px] w-full', className)}>
      {withPanel ? (
        <div className="overflow-hidden rounded-[var(--id-r-card)] bg-[var(--id-cream,var(--id-bg-2))] p-[clamp(16px,3vw,40px)]">
          {media}
        </div>
      ) : (
        media
      )}

      <figcaption className="mt-[16px] flex items-baseline gap-[10px] border-t-[1px] border-[var(--id-line-soft)] pt-[14px] text-[13.5px] leading-[1.45] text-[var(--id-ink-2)]">
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
