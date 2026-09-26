import React from 'react'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { DRAWINGS, type Drawing, type DrawingKey } from '@/components/figures/registry'
import type { Media as MediaType } from '@/payload-types'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { slugify } from '@/utilities/slugify'
import { cn } from '@/utilities/ui'

export type SplitBlockProps = {
  /** `krem` = kapitola stojí na krémovém pásu (posun povrchu, 8.1 p. 3). */
  surface?: string | null
  side: 'image-left' | 'image-right'
  drawing?: string | null
  /** Fotka místo kresby — ořez v poměru rámu, ne 21:9 master. */
  photo?: MediaType | number | null
  photoRatio?: '4:5' | '1:1' | '2:3' | null
  eyebrow?: string | null
  title?: string | null
  titleLevel?: 'h2' | 'h3' | null
  /** Pokračuje oddíl nad sebou: modulová mezera místo pásové. */
  continues?: boolean | null
  body?: string | null
  richBody?: DefaultTypedEditorState | null
  number?: string | null
  caption: string
  alt?: string | null
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
 * pod 5 px. Pod 1130 px se skládá pod sebe: titulek → kresba → tělo —
 * teze před obrazem, obraz před rozvedením.
 */
export const SplitBlock: React.FC<SplitBlockProps> = ({
  alt,
  body,
  richBody,
  caption,
  className,
  continues,
  drawing,
  eyebrow,
  number,
  photo,
  photoRatio,
  side,
  surface,
  title,
  titleLevel,
}) => {
  const entry: Drawing | undefined = drawing ? DRAWINGS[drawing as DrawingKey] : undefined
  const Kresba = entry?.portrait ?? entry?.wide
  const fotka = !Kresba && photo && typeof photo === 'object' ? photo : null
  if (!Kresba && !fotka) return null

  const paragraphs = (body ?? '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
  const label = formatFigureNumber(number)
  const anchor = title ? slugify(title) || undefined : undefined

  const hasHead = Boolean(eyebrow || title)
  const Titulek = titleLevel === 'h3' ? 'h3' : 'h2'

  return (
    // Jedna orchestrace na kapitolu (6.1 p. 2, recept 6.3.2): skupina odhaluje
    // své přímé potomky staggerem hlava → kresba → tělo. Tři nezávislé
    // triggery nastupovaly naráz (stagger 0 ms — porota kola 07, pohyb).
    <section
      className={cn(
        'id-split not-prose',
        side === 'image-right' && 'id-split--right',
        continues && 'id-split--pokracovani',
        richBody && 'id-split--rich',
        drawing === 'hlina-prace-misto-materialu' && 'id-split--hlina-prace',
        surface === 'krem' && 'id-band id-band--cream id-band--self',
        className,
      )}
      data-rv-group
    >
      {/* Tři položky mřížky: hlava, kresba, tělo. Na desktopu hlava + tělo
          v jednom sloupci vedle kresby, na telefonu titulek → kresba → tělo. */}
      {hasHead ? (
        <header className="id-split__head rv">
          {eyebrow ? (
            <span className="mb-[14px] flex w-fit items-center gap-[10px] font-[family-name:var(--id-f-display)] text-[12px] leading-[1.2] font-semibold tracking-[0.14em] text-[var(--id-accent)] uppercase">
              <span
                aria-hidden="true"
                className="h-[1.5px] w-[22px] shrink-0 bg-[var(--id-accent)]"
              />
              {eyebrow}
            </span>
          ) : null}

          {title ? (
            Titulek === 'h3' ? (
              <h3 className="id-split__h3" id={anchor}>
                {nezlomitelneMezery(title)}
              </h3>
            ) : (
              <h2
                className="mb-[22px] font-[family-name:var(--id-f-display)] text-[length:var(--id-t-title)] leading-[1.05] font-semibold tracking-[-0.025em] text-[var(--id-ink)] [text-wrap:balance]"
                id={anchor}
              >
                {nezlomitelneMezery(title)}
              </h2>
            )
          ) : null}
        </header>
      ) : null}

      <figure className="id-split__figure rv">
        {Kresba ? (
          <div
            aria-label={alt ?? undefined}
            className="id-figure-media rounded-[var(--id-r-card)] bg-[var(--id-cream,var(--id-bg-2))] p-[clamp(16px,3vw,40px)]"
            role="img"
          >
            <div className="id-figure-svg">
              <Kresba />
            </div>
          </div>
        ) : (
          /* Fotka stojí v témž slotu jako panel kresby (652 na 1440,
             700 složeně, okraj k okraji na telefonu), bez krémového rámu. */
          <div
            className={cn(
              'id-figure-media id-split__foto',
              photoRatio === '1:1' && 'id-split__foto--ctverec',
              photoRatio === '2:3' && 'id-split__foto--vysoka',
            )}
          >
            <Media
              htmlElement={null}
              resource={fotka}
              size="(min-width: 1440px) 652px, (min-width: 1130px) calc(50vw - 68px), (min-width: 561px) min(700px, 100vw), 100vw"
              pictureClassName="block h-full w-full"
              imgClassName="block m-0 h-full w-full object-cover"
            />
          </div>
        )}
        <figcaption className="mt-[16px] flex items-baseline gap-[10px] border-t-[1px] border-[var(--id-mist)] pt-[14px] text-[13.5px] leading-[1.45] text-[var(--id-ink-2)]">
          {label && (
            <b className="font-[family-name:var(--id-f-display)] text-[11.5px] font-semibold tracking-[0.06em] whitespace-nowrap text-[var(--id-ink)] uppercase">
              {label}
            </b>
          )}
          {/* mezera drží slova oddělená i v textContent (odečítač, kopírování) */}{' '}
          <span className="[text-wrap:pretty]">{nezlomitelneMezery(caption)}</span>
        </figcaption>
      </figure>

      <div className="id-split__body rv">
        {richBody ? (
          <RichText className="id-split__richtext" data={richBody} enableGutter={false} />
        ) : (
          <div className="space-y-[18px]">
            {paragraphs.map((paragraph) =>
              paragraph.startsWith('### ') ? (
                <h3
                  className="id-split__h3 id-split__body-h3"
                  id={slugify(paragraph.slice(4)) || undefined}
                  key={paragraph.slice(0, 40)}
                >
                  {nezlomitelneMezery(paragraph.slice(4))}
                </h3>
              ) : paragraph.startsWith('> ') ? (
                /* Tip k úseku textu stojí v jeho sloupci, ne na ose prózy
                 (8.2b p. 8; porota kola 01 článku o příměsích). */
                <div
                  className="id-callout id-callout--info id-split__callout"
                  key={paragraph.slice(0, 40)}
                >
                  <span aria-hidden="true" className="id-callout__dot" />
                  <p className="m-0">{renderStrong(paragraph.slice(2))}</p>
                </div>
              ) : (
                <p className="id-split__p" key={paragraph.slice(0, 40)}>
                  {renderStrong(paragraph)}
                </p>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * `**text**` → `<strong>`, `[text](url)` → odkaz na sesterský článek
 * (kolo 02: dva odstavce s odkazem patřily tematicky do splitu, ale
 * `body` je prostý řetězec bez Lexical uzlů — minimální markdown místo
 * přepisování autorovy věty). Pevné mezery se doplní všude.
 */
function renderStrong(source: string): React.ReactNode[] {
  return source.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={index}>{nezlomitelneMezery(part.slice(2, -2))}</strong>
    }
    const odkaz = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (odkaz) {
      const interni = odkaz[2].startsWith('/')
      return (
        <a
          href={odkaz[2]}
          key={index}
          {...(interni ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {nezlomitelneMezery(odkaz[1])}
        </a>
      )
    }
    return <React.Fragment key={index}>{nezlomitelneMezery(part)}</React.Fragment>
  })
}
