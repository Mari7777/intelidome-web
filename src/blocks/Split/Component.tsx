import React from 'react'

import { DRAWINGS, type Drawing, type DrawingKey } from '@/components/figures/registry'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { slugify } from '@/utilities/slugify'
import { cn } from '@/utilities/ui'

export type SplitBlockProps = {
  side: 'image-left' | 'image-right'
  drawing: string
  eyebrow?: string | null
  title?: string | null
  body: string
  number?: string | null
  caption: string
  alt: string
  id?: string | null
  blockName?: string | null
  blockType?: 'split'
  className?: string
}

const formatFigureNumber = (raw?: string | null): string | null => {
  const value = raw?.trim()
  if (!value) return null
  return /^\d+$/.test(value) ? `Obr. ${value.padStart(2, '0')}` : `Obr. ${value}`
}

/**
 * Text vedle obrazu (DESIGN.md 8.2b).
 *
 * Obraz a text, které patří k sobě, drží jeden blok — v ploché struktuře
 * Lexicalu by se vedle sebe postavit nedaly. Do úzkého sloupce jde
 * **portrétová** sazba kresby; panoramatická 1080 px by tu měla popisky
 * pod 5 px. Pod 900 px se sloupce skládají pod sebe, obraz vždy první.
 */
export const SplitBlock: React.FC<SplitBlockProps> = ({
  alt,
  body,
  caption,
  className,
  drawing,
  eyebrow,
  number,
  side,
  title,
}) => {
  const entry: Drawing | undefined = DRAWINGS[drawing as DrawingKey]
  const Kresba = entry?.portrait ?? entry?.wide
  if (!Kresba) return null

  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const label = formatFigureNumber(number)
  const anchor = title ? slugify(title) || undefined : undefined

  return (
    <section
      className={cn('id-split not-prose', side === 'image-right' && 'id-split--right', className)}
    >
      <figure className="id-split__figure rv">
        <div
          aria-label={alt}
          className="id-figure-media rounded-[var(--id-r-card)] bg-[var(--id-cream,var(--id-bg-2))] p-[clamp(16px,3vw,32px)]"
          role="img"
        >
          <div className="id-figure-svg">
            <Kresba />
          </div>
        </div>
        <figcaption className="mt-[14px] flex items-baseline gap-[10px] border-t-[1px] border-[var(--id-line-soft)] pt-[12px] text-[13.5px] leading-[1.45] text-[var(--id-ink-2)]">
          {label && (
            <b className="font-[family-name:var(--id-f-display)] text-[11.5px] font-semibold tracking-[0.06em] whitespace-nowrap text-[var(--id-ink)] uppercase">
              {label}
            </b>
          )}
          <span className="[text-wrap:pretty]">{nezlomitelneMezery(caption)}</span>
        </figcaption>
      </figure>

      <div className="id-split__text rv">
        {eyebrow ? (
          <span className="mb-[14px] flex w-fit items-center gap-[10px] font-[family-name:var(--id-f-display)] text-[12px] leading-[1.2] font-semibold tracking-[0.14em] text-[var(--id-accent)] uppercase">
            <span aria-hidden="true" className="h-[1.5px] w-[22px] shrink-0 bg-[var(--id-accent)]" />
            {eyebrow}
          </span>
        ) : null}

        {title ? (
          <h2
            className="mb-[22px] font-[family-name:var(--id-f-display)] text-[length:var(--id-t-title)] leading-[1.05] font-semibold tracking-[-0.025em] text-[var(--id-ink)] [text-wrap:balance]"
            id={anchor}
          >
            {nezlomitelneMezery(title)}
          </h2>
        ) : null}

        <div className="space-y-[18px]">
          {paragraphs.map((paragraph) => (
            <p className="id-split__p" key={paragraph.slice(0, 40)}>
              {renderStrong(paragraph)}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

/** `**text**` → `<strong>`; pevné mezery se doplní i uvnitř zvýraznění. */
function renderStrong(source: string): React.ReactNode[] {
  return source.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      <strong key={index}>{nezlomitelneMezery(part.slice(2, -2))}</strong>
    ) : (
      <React.Fragment key={index}>{nezlomitelneMezery(part)}</React.Fragment>
    ),
  )
}
