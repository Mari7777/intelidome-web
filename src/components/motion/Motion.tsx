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

    const kotva = window.location.hash
    let kotvaCil: HTMLElement | null = null
    try {
      kotvaCil = kotva ? document.getElementById(decodeURIComponent(kotva.slice(1))) : null
    } catch {
      kotvaCil = null
    }

    /*
      Živé přepnutí prefers-reduced-motion: GSAP revertuje kontext a jeho
      refresh zapíše scroll 0 — čtenář skončil na začátku článku (porota
      kola 02). GSAP reaguje na změnu dřív než my, takže pozici neumíme
      přečíst v okamžiku změny; držíme proto poslední známou ze scrollu
      (událost scroll přijde až po přepisu) a po refreshi ji vrátíme.
    */
    const omezeny = window.matchMedia('(prefers-reduced-motion: reduce)')
    let posledniY = window.scrollY
    let drzetPozici: number | null = null
    const sleduj = () => {
      if (drzetPozici === null) posledniY = window.scrollY
    }
    const vrat = () => {
      if (drzetPozici === null) return
      window.scrollTo({ top: drzetPozici, behavior: 'instant' })
    }
    const predZmenou = () => {
      drzetPozici = posledniY
      vrat()
      requestAnimationFrame(() => requestAnimationFrame(() => {
        vrat()
        drzetPozici = null
      }))
    }
    window.addEventListener('scroll', sleduj, { passive: true })
    omezeny.addEventListener('change', predZmenou)
    ScrollTrigger.addEventListener('refresh', vrat)

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

      /*
        Sekce, na kterou míří kotva z adresy, se neodhaluje: posun o 30 px
        by prohlížeč při dojezdu ke kotvě započítal a po doběhu revealu by
        nadpis ujel nad cíl. Čtenář, který přišel odkazem, ji má vidět hned.
      */
      const cilKotvy = (el: HTMLElement) => Boolean(kotvaCil && el.contains(kotvaCil))

      // Samostatné prvky — vše, co není potomkem skupiny.
      document.querySelectorAll<HTMLElement>('.rv').forEach((el) => {
        if (el.parentElement?.hasAttribute('data-rv-group')) return
        if (cilKotvy(el)) {
          gsap.set(el, { opacity: 1 })
          return
        }
        gsap.fromTo(el, HIDDEN, {
          ...SHOWN,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      // Skupiny — stagger 80 ms, max 4 děti (6.3.2).
      document.querySelectorAll<HTMLElement>('[data-rv-group]').forEach((group) => {
        const children = group.querySelectorAll<HTMLElement>(':scope > .rv')
        if (!children.length) return
        if (cilKotvy(group)) {
          gsap.set(children, { opacity: 1 })
          return
        }
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

    /*
      Příchod přes odkaz s kotvou: prohlížeč ke kotvě jede plynule
      (html { scroll-behavior: smooth }) a refresh ScrollTriggeru tu jízdu
      uprostřed přeruší — stránka zůstala tisíce px před cílem (porota
      kola 01 článku o přípravě směsi). Po každém refreshi během načítání
      proto kotvu dorovnáme okamžitě, dokud čtenář sám nezasáhl.
    */
    let zasah = false
    let konec = document.readyState === 'complete' ? performance.now() + 1500 : Infinity
    const oznac = () => {
      zasah = true
    }
    const poNacteni = () => {
      konec = performance.now() + 1500
    }
    const ZASAHY = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    ZASAHY.forEach((typ) => window.addEventListener(typ, oznac, { passive: true }))
    window.addEventListener('load', poNacteni)
    const dorovnej = () => {
      const cil = kotvaCil
      if (!cil || zasah || performance.now() > konec) return
      // Poloha z layoutu, ne z getBoundingClientRect: odhalovaná sekce je
      // v tu chvíli ještě posunutá o 30 px (reveal), po doběhu by ujela.
      let y = 0
      for (let el: HTMLElement | null = cil; el; el = el.offsetParent as HTMLElement | null) y += el.offsetTop
      const odsazeni = parseFloat(getComputedStyle(cil).scrollMarginTop) || 0
      window.scrollTo({ top: Math.max(0, y - odsazeni), behavior: 'instant' })
    }
    ScrollTrigger.addEventListener('refresh', dorovnej)

    return () => {
      window.removeEventListener('load', refresh)
      window.removeEventListener('load', poNacteni)
      ZASAHY.forEach((typ) => window.removeEventListener(typ, oznac))
      ScrollTrigger.removeEventListener('refresh', dorovnej)
      window.removeEventListener('scroll', sleduj)
      omezeny.removeEventListener('change', predZmenou)
      ScrollTrigger.removeEventListener('refresh', vrat)
      mm.revert()
    }
  }, [])

  return <InertiaScroll enabled={inertia} />
}
