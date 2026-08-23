import React from 'react'

import { SitMostuPortret } from '@/components/figures/SitMostuPortret'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { cn } from '@/utilities/ui'

export type ProductBandBlockProps = {
  eyebrow?: string | null
  title: string
  body: string
  features?: { title: string; text: string; id?: string | null }[] | null
  id?: string | null
  blockName?: string | null
  blockType?: 'productBand'
  className?: string
}

/**
 * Obsidianový produktový pás (DESIGN.md 8.2 ř. N+1).
 *
 * Jediný tmavý pás uvnitř článku — proto nese celou váhu předělu mezi
 * „jak to funguje" a „čím to vyřešíme". Text jde na `--id-ink-dark-2`
 * (7,47:1) s bílým `<strong>`; tři vlastnosti stojí na hairlinu, ne
 * v kartách se stínem (8.1 Do p. 8).
 */
export const ProductBandBlock: React.FC<ProductBandBlockProps> = ({
  body,
  className,
  eyebrow,
  features,
  title,
}) => {
  const paragraphs = body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)
  const items = (features ?? []).filter((feature) => Boolean(feature?.title))

  return (
    <section className={cn('not-prose id-band id-band--obsidian', className)} data-surface="dark">
      <div className="id-band__inner">
        <div className="id-2col">
        <div className="rv">
          {eyebrow ? (
            <span className="mb-[14px] flex w-fit items-center gap-[10px] font-[family-name:var(--id-f-display)] text-[12px] leading-[1.2] font-semibold tracking-[0.14em] text-[var(--id-accent-tint)] uppercase">
              <span aria-hidden="true" className="h-[1.5px] w-[22px] shrink-0 bg-[var(--id-accent-tint)]" />
              {eyebrow}
            </span>
          ) : null}

          <h2 className="font-[family-name:var(--id-f-display)] text-[length:var(--id-t-title)] leading-[1.05] font-semibold tracking-[-0.025em] text-[var(--id-ink-dark)] [text-wrap:balance]">
            {nezlomitelneMezery(title)}
          </h2>

          <div className="mt-[22px] space-y-[18px]">
            {paragraphs.map((paragraph) => (
              <p className="id-productband__prose" key={paragraph.slice(0, 40)}>
                {renderStrong(paragraph)}
              </p>
            ))}
          </div>
        </div>

          <div
            aria-label="Schéma sítě: most uprostřed, kolem něj ventil, čidlo vlhkosti, retenční nádrž a venkovní osvětlení; aktivní spoj vede k ventilu."
            className="rv id-figure-svg"
            role="img"
          >
            <SitMostuPortret />
          </div>
        </div>

        {items.length > 0 && (
          <div
            className="mt-[clamp(40px,6vw,64px)] grid gap-[clamp(22px,3vw,34px)] sm:grid-cols-3"
            data-rv-group
          >
            {items.map((feature) => (
              <div className="rv id-feature" key={feature.id ?? feature.title}>
                <h3 className="id-feature__title">{feature.title}</h3>
                <p className="id-feature__text">{nezlomitelneMezery(feature.text)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/** `**text**` → `<strong>`; v tmavém pásu je to jediné zvýraznění. */
function renderStrong(source: string): React.ReactNode[] {
  return source.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={index}>{nezlomitelneMezery(part)}</React.Fragment>
    ),
  )
}
