'use client'

import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import { useEffect } from 'react'

import { InertiaScroll } from './InertiaScroll'

/**
 * Jediné místo registrace pohybu (DESIGN.md 6.3.0).
 *
 * Recepty žijí výhradně v `mm.add('(prefers-reduced-motion: no-preference)')`,
 * takže při omezeném pohybu se nespustí vůbec — ne že by se jen zkrátily.
 * Hero nástup tu není: je to LCP prvek, takže podle 6.3.3 běží na CSS
 * keyframes a nečeká na tenhle bundle.
 */

const EASES: [string, string][] = [
  ['idReveal', '.22,.61,.21,1'],
  ['idDraw', '.3,.1,.3,1'],
  ['idFill', '.3,.1,.4,1'],
  ['idRipple', '.16,.6,.4,1'],
  ['idSoft', '.25,.1,.25,1'],
  ['id', '.22,.61,.36,1'],
]

let registered = false

export const Motion = ({ inertia = false }: { inertia?: boolean }) => {
  useEffect(() => {
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger, CustomEase)
      EASES.forEach(([name, value]) => CustomEase.create(name, value))
      registered = true
    }

    // Přihlásí se bráně z layoutu, aby ta neodkryla obsah pod rukama.
    document.documentElement.dataset.motion = 'ready'

    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      /*
        Zásadně NE `autoAlpha` — GSAP jím nasazuje `visibility: hidden`,
        takže dokud čtenář neodroluje, je obsah mimo tab pořadí, mimo
        strom přístupnosti a nenajde ho ani hledání na stránce. Recept
        6.3.1 v DESIGN.md `autoAlpha` předepisuje; je to vada systému
        a patří do koše B (viz LOOP_LOG). Tady skrýváme jen opacity,
        stejně jako to dělá CSS brána.
      */
      const HIDDEN = { opacity: 0, y: 30 }
      const SHOWN = {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'idReveal',
        clearProps: 'transform',
      }

      // Samostatné prvky — vše, co není potomkem skupiny.
      document.querySelectorAll<HTMLElement>('.rv').forEach((el) => {
        if (el.parentElement?.hasAttribute('data-rv-group')) return
        gsap.fromTo(el, HIDDEN, {
          ...SHOWN,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      // Skupiny — stagger 80 ms, max 4 děti (6.3.2).
      document.querySelectorAll<HTMLElement>('[data-rv-group]').forEach((group) => {
        const children = group.querySelectorAll<HTMLElement>(':scope > .rv')
        if (!children.length) return
        gsap.fromTo(children, HIDDEN, {
          ...SHOWN,
          stagger: { each: 0.08, from: 'start' },
          scrollTrigger: { trigger: group, start: 'top 88%', once: true },
        })
      })

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill())
        gsap.set('.rv', { clearProps: 'all' })
      }
    })

    // Přepočet až po písmech — jinak ScrollTrigger počítá s jinou výškou,
    // než jakou stránka bude mít (6.3.0). Nikdy v resize handleru.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)

    return () => {
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, [])

  return <InertiaScroll enabled={inertia} />
}
