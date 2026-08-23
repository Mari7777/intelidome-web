import React from 'react'

import { StatTilesBlock } from '@/blocks/StatTiles/Component'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { cn } from '@/utilities/ui'

export type SummaryBandBlockProps = {
  lead: string
  tiles?: { value: string; unit?: string | null; label: string; id?: string | null }[] | null
  id?: string | null
  blockName?: string | null
  blockType?: 'summaryBand'
  className?: string
}

/**
 * Krémový pás souhrnu (DESIGN.md 8.2 ř. 2, 8.1 p. 4 „po obsidianovém hero
 * vždy krém").
 *
 * Klíčová fráze se v administraci píše mezi hvězdičky — tady se překlápí na
 * `<em>`, které je v DS bez kurzívy a nese akcent. Nic víc se nesází: pás má
 * jeden hlas, a to lead. Čísla pod ním jsou tatáž řada jako v těle článku,
 * jen bez vlastního horního odsazení, aby držela na leadu.
 */
export const SummaryBandBlock: React.FC<SummaryBandBlockProps> = ({ className, lead, tiles }) => {
  const items = (tiles ?? []).filter((tile) => Boolean(tile?.value || tile?.label))

  return (
    <section className={cn('not-prose id-band id-band--cream id-band--sm', className)}>
      <div className="id-band__inner id-band__inner--summary">
        <p className="rv id-summary-lead">{renderAccent(lead)}</p>
        {items.length > 0 && <StatTilesBlock className="mt-[clamp(34px,5vw,54px)] mb-0" tiles={items} />}
      </div>
    </section>
  )
}

/** `*fráze*` → `<em>` (v DS bez kurzívy, jen akcentem). Nepárová hvězdička zůstane textem. */
function renderAccent(source: string): React.ReactNode[] {
  return source.split(/(\*[^*]+\*)/g).map((part, index) =>
    part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
      <em key={index}>{part.slice(1, -1)}</em>
    ) : (
      <React.Fragment key={index}>{nezlomitelneMezery(part)}</React.Fragment>
    ),
  )
}
