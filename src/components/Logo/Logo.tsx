import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  /** Výška loga v px — 19 patička, 21 hlavička, CTA clamp(30px,4.6vw,50px). */
  height?: number | string
  /** Dekorativní logo vedle textového odkazu domů; jinak nese aria-label. */
  decorative?: boolean
}

/**
 * Wordmark „inteliDome" (DESIGN.md 9.4).
 *
 * Jediné povolené vkládání je maskované SVG obarvené přes `currentColor` —
 * proto tu není žádná vlastní barva, gradient, stín ani obrys. Kresba masky
 * leží jednou na stránku v `LogoMaskDefs`; tohle je jen obarvený obdélník,
 * který skrz ni prosvítá, takže vnitřky písmen zůstávají průhledné.
 */
export const Logo = ({ className, decorative = false, height = 21 }: Props) => (
  <svg
    aria-hidden={decorative ? 'true' : undefined}
    aria-label={decorative ? undefined : 'InteliDome'}
    className={clsx('block w-auto', className)}
    focusable="false"
    role={decorative ? undefined : 'img'}
    style={{ height: typeof height === 'number' ? `${height}px` : height }}
    viewBox="446 2126 4870 1227"
  >
    <rect fill="currentColor" height="1227" mask="url(#idlogo-mask)" width="4870" x="446" y="2126" />
  </svg>
)
