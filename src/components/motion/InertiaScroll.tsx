'use client'

import { useEffect } from 'react'

/**
 * Setrvačníkové brzdění scrollu (DESIGN.md 6.5).
 *
 * Kolečko se odchytí a skutečné okno se k cíli dotahuje lerpem, takže
 * stránka se rozjede a pak plynule dobrzdí. Běží nad **oknem**, ne nad
 * vlastním kontejnerem — díky tomu nepotřebuje ScrollTrigger scrollerProxy
 * a `position: fixed` (kapsle hlavičky) se nerozbije.
 *
 * Nikdy na dotyku, nikdy při omezeném pohybu, nikdy spolu s Lenisem.
 * Klávesnice, posuvník, kotvy i hledání na stránce zůstávají nativní —
 * proto se cíl resynchronizuje z každého scrollu, který nevyvolal modul.
 */

const LERP = 0.082
const MULT = 1.15
const STOP = 0.5

export const InertiaScroll = () => {
  useEffect(() => {
    const root = document.documentElement
    if (!root.hasAttribute('data-inertia')) return

    const fine = window.matchMedia('(pointer: fine)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || still.matches) return

    let target = window.scrollY
    let raf = 0
    let running = false

    const max = () => document.documentElement.scrollHeight - window.innerHeight

    const tick = () => {
      const diff = target - window.scrollY
      if (Math.abs(diff) < STOP) {
        running = false
        raf = 0
        return
      }
      window.scrollTo(0, window.scrollY + diff * LERP)
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(tick)
    }

    const onWheel = (event: WheelEvent) => {
      // Pinch-zoom patří prohlížeči, ne nám.
      if (event.ctrlKey || event.metaKey) return
      event.preventDefault()
      // Firefox posílá řádky (deltaMode 1), ne pixely.
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY
      target = Math.min(Math.max(target + delta * MULT, 0), max())
      start()
    }

    // Klávesnice, posuvník i kotvy scrollují nativně — když neběží rAF,
    // musí se cíl srovnat, jinak by další kolečko skočilo zpět.
    const onScroll = () => {
      if (!running) target = window.scrollY
    }
    const onResize = () => {
      target = Math.min(target, max())
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
