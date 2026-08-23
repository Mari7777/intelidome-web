'use client'

import { useEffect } from 'react'

/**
 * Vypnutí SMIL animací při `prefers-reduced-motion` (DESIGN.md 9.2 p. 5).
 *
 * CSS na SMIL nedosáhne — `animation: none` platí jen na keyframes, kdežto
 * `<animateTransform>` běží mimo kaskádu. Jediná spolehlivá cesta je uzly
 * z dokumentu odstranit. Klidový stav každé figury je proto zapsaný přímo
 * v markupu, takže po odstranění zůstane figura čitelná, ne rozpadlá.
 */
export const SmilGuard = () => {
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')

    const strip = () => {
      if (!query.matches) return
      document
        .querySelectorAll(
          '.id-figure-svg animate, .id-figure-svg animateTransform, .id-figure-svg animateMotion',
        )
        .forEach((node) => node.remove())
    }

    strip()
    query.addEventListener('change', strip)
    return () => query.removeEventListener('change', strip)
  }, [])

  return null
}
