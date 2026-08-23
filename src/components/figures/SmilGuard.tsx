'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Vypnutí SMIL animací při `prefers-reduced-motion` (DESIGN.md 9.2 p. 5).
 *
 * CSS na SMIL nedosáhne — `animation: none` platí jen na keyframes, kdežto
 * `<animateTransform>` běží mimo kaskádu. Jediná spolehlivá cesta je uzly
 * z dokumentu odstranit. Klidový stav každé figury je proto zapsaný přímo
 * v markupu, takže po odstranění zůstane figura čitelná, ne rozpadlá.
 *
 * Komponenta visí v kořenovém layoutu, který klientskou navigaci přežívá —
 * proto se efekt musí přehrát na každé změně routy. Bez toho platil
 * kontrakt jen při tvrdém načtení a po prokliku z výpisu točilo všech
 * 46 SMIL uzlů i při `prefers-reduced-motion`.
 */
export const SmilGuard = () => {
  const pathname = usePathname()

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

    /*
      Smyčky, které nikdo nevidí, nemají důvod běžet. Každá figura se
      pauzuje, jakmile opustí viewport — jinak by 40+ SMIL uzlů točilo
      po celou dobu čtení devítitisícové stránky.
    */
    const svgs = Array.from(document.querySelectorAll<SVGSVGElement>('.id-figure-svg svg'))
    svgs.forEach((svg) => svg.pauseAnimations())

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const svg = entry.target as SVGSVGElement
          if (entry.isIntersecting) svg.unpauseAnimations()
          else svg.pauseAnimations()
        })
      },
      { rootMargin: '10% 0px' },
    )
    svgs.forEach((svg) => io.observe(svg))

    return () => {
      query.removeEventListener('change', strip)
      io.disconnect()
    }
  }, [pathname])

  return null
}
