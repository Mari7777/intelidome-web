import React from 'react'

import type { Props as MediaProps } from '@/components/Media/types'

import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { cn } from '@/utilities/ui'
import { Media } from '@/components/Media'
import { DRAWINGS, type Drawing, type DrawingKey } from '@/components/figures/registry'

// Local prop type — the generated `FigureBlock` interface does not exist until
// `payload generate:types` runs after this block is registered.
export type FigureBlockProps = {
  image?: MediaProps['resource']
  /** Klíč technické kresby (9.2). Když je vyplněný, `image` se ignoruje. */
  drawing?: string | null
  /** Popis kresby pro odečítač — u fotografie ho nese alt v knihovně médií. */
  alt?: string | null
  /** Asymetrická sazba: ukotvení k jedné hraně textu, nebo přes celou šířku. */
  layout?: string | null
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
  layout,
  number,
  panel,
}) => {
  const label = formatFigureNumber(number)
  const withPanel = panel !== false
  const sazba = layout ? `id-figure--${layout}` : null
  const entry: Drawing | undefined = drawing ? DRAWINGS[drawing as DrawingKey] : undefined

  /*
    Kresba je informační obraz, takže `role="img"` a popis nese ten prvek,
    který kresbu drží; samotné SVG je pro odečítač neviditelné (9.2 p. 8).

    Figura má viewBox 1080 px široký. Na telefonu (393 px) by se zmenšila
    na 36 % a popisky 12 px by klesly pod 5 px — nečitelné. Proto kresba
    drží spodní mez šířky a v užším panelu se posouvá do stran. Posuvná
    oblast musí být dosažitelná i klávesnicí, proto `tabIndex`.
  */
  const media = entry ? (
    <div
      aria-label={alt || caption}
      className="id-figure-svg -mx-[2px] overflow-x-auto px-[2px]"
      role="img"
      tabIndex={0}
    >
      {renderDrawing(entry)}
    </div>
  ) : (
    <Media
      htmlElement={null}
      resource={image}
      size={slotSizes(layout)}
      pictureClassName="block"
      imgClassName="block m-0 w-full h-auto rounded-[var(--id-r-card)]"
    />
  )

  return (
    <figure className={cn('rv w-full', sazba, className)}>
      {withPanel ? (
        <div className="id-figure-media rounded-[var(--id-r-card)] bg-[var(--id-cream,var(--id-bg-2))] p-[clamp(16px,3vw,40px)]">
          {media}
        </div>
      ) : (
        <div className="id-figure-media overflow-hidden rounded-[var(--id-r-card)]">{media}</div>
      )}

      <figcaption className="mt-[16px] flex max-w-[62ch] items-baseline gap-[10px] border-t-[1px] border-[var(--id-mist)] pt-[14px] text-[13.5px] leading-[1.45] text-[var(--id-ink-2)]">
        {label && (
          <b className="font-[family-name:var(--id-f-display)] text-[11.5px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap text-[var(--id-ink)]">
            {label}
          </b>
        )}
        {/* mezera drží slova oddělená i v textContent (odečítač, kopírování) */}
        {' '}
        <span className="[text-wrap:pretty]">{nezlomitelneMezery(caption)}</span>
      </figcaption>
    </figure>
  )
}

/*
  `sizes` musí popsat slot, který figura SKUTEČNĚ vyplní — jinak si
  prohlížeč vezme výchozí popis obsahového sloupce (960 px) i pro obraz
  přes celou šířku. Full-bleed fotka pak na 1990px okně dostala variantu
  960 px a roztáhla se na dvojnásobek; při dpr 2 dokonce 900 px na
  3 980 obrazových bodů. Vypadalo to jako rozmazaná kopie hero fotky.

  Šířky odpovídají modulům mřížky (8.2a): obsah 700, mimoosová figura
  1030, full-bleed = celé okno. Pod zlomem stránky jde figura přes
  šířku okna zmenšenou o okraje.
*/
function slotSizes(layout?: string | null): string {
  // Pod 560 px má full-bleed fotka ořez 4:5 s `object-fit: cover`, takže
  // obraz se vnitřně škáluje na ~2,95× šířky slotu (21:9 do 4:5). Se `100vw`
  // dodal prohlížeč variantu w=1200 do slotu, který potřebuje ~1160 CSS px,
  // a fotka měkla (porota kola 06, výkon + styl).
  if (layout === 'bleed') return '(max-width: 560px) 295vw, 100vw'
  if (layout === 'offset-left' || layout === 'offset-right') {
    return '(min-width: 1130px) 1030px, (min-width: 768px) 92vw, 100vw'
  }
  return '(min-width: 1130px) 700px, (min-width: 768px) 92vw, 100vw'
}

/** Širokoúhlá sazba všude, svislá jen tam, kde bez ní zanikne srovnání. */
function renderDrawing(entry: Drawing): React.ReactNode {
  const Wide = entry.wide
  const Portrait = entry.portrait

  if (!Portrait) {
    return (
      <div className="min-w-[560px]">
        <Wide />
      </div>
    )
  }

  return (
    <>
      <div className="sm:hidden">
        <Portrait />
      </div>
      <div className="hidden min-w-[560px] sm:block">
        <Wide />
      </div>
    </>
  )
}
