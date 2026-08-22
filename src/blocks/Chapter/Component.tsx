import React from 'react'

import { cn } from '@/utilities/ui'
import { slugify } from '@/utilities/slugify'

export type ChapterBlockProps = {
  title: string
  eyebrow?: string | null
  blockType: 'chapter'
}

type Props = ChapterBlockProps & {
  className?: string
}

/**
 * Named chapter divider inside an article (DESIGN v2, 7.3 + 8.2 row „Kapitoly 01–0N“).
 *
 * Replaces a bare H2: accent eyebrow with a 22×1.5px rule, display title on the
 * `title` scale, section-sized breathing room above and a tighter gap below.
 * The heading carries a slug id so the chapter can be linked to directly.
 * Static by design — nothing animates, so there is no reduced-motion behaviour
 * to suppress; the entrance motion utilities (`.id-rise`) are deliberately not
 * used here, because scroll-reveal belongs to whole sections, not to running text.
 */
export const ChapterBlock: React.FC<Props> = ({ className, eyebrow, title }) => {
  const label = eyebrow?.trim()
  const anchor = slugify(title) || undefined

  return (
    <div className={cn('not-prose mt-[clamp(64px,8vw,96px)] mb-[24px] first:mt-0', className)}>
      {label ? (
        <span className="mb-[14px] flex w-fit items-center gap-[10px] font-[family-name:var(--id-f-display)] text-[12px] leading-[1.2] font-semibold tracking-[0.14em] text-[var(--id-accent)] uppercase">
          <span aria-hidden="true" className="h-[1.5px] w-[22px] shrink-0 bg-[var(--id-accent)]" />
          {label}
        </span>
      ) : null}

      <h2
        className="scroll-mt-[96px] font-[family-name:var(--id-f-display)] text-[clamp(30px,4.2vw,52px)] leading-[1.05] font-semibold tracking-[-0.025em] text-[var(--id-ink)] [text-wrap:balance]"
        id={anchor}
      >
        {title}
      </h2>
    </div>
  )
}
