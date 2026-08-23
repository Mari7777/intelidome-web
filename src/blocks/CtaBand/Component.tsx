import Link from 'next/link'
import React from 'react'

import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'

export type CtaBandBlockProps = {
  title: string
  sub: string
  buttonLabel: string
  buttonHref: string
  ask?: string | null
  id?: string | null
  blockName?: string | null
  blockType?: 'ctaBand'
  className?: string
}

/**
 * Bílá centrovaná výzva na konci článku (DESIGN.md 8.2 ř. N+2).
 *
 * Až sem článek nemá jediné tlačítko — proto tady stojí právě jedno a nese
 * plný akcent. Logo je maskované SVG na CTA výšce (9.4), otázka čtenáři
 * uzavírá text a schválně nemá tvar odkazu: není to druhá výzva.
 */
export const CtaBandBlock: React.FC<CtaBandBlockProps> = ({
  ask,
  buttonHref,
  buttonLabel,
  className,
  sub,
  title,
}) => (
  <section className={cn('not-prose id-band id-cta', className)}>
    <div className="rv id-band__inner id-band__inner--summary">
      <Logo className="id-cta__logo" decorative height="clamp(30px, 4.6vw, 50px)" />

      <h2 className="id-cta__title">{title}</h2>
      <p className="id-cta__sub">{sub}</p>

      <p className="mt-[30px]">
        <Link className="id-btn id-btn--primary" href={buttonHref}>
          {buttonLabel}
          <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
            />
          </svg>
        </Link>
      </p>

      {ask ? <p className="id-cta__ask">{ask}</p> : null}
    </div>
  </section>
)
