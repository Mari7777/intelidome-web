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

export const InertiaScroll = ({ enabled = false }: { enabled?: boolean }) => {
  useEffect(() => {
    // Aktivace jde propem, ne čtením atributu z DOM: atribut nastavuje
    // jiný efekt a pořadí efektů (potomci před rodičem) není zaručené —
    // modul by se spustil dřív, než by atribut vůbec existoval.
    if (!enabled) return

    const fine = window.matchMedia('(pointer: fine)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')

    let target = window.scrollY
    let raf = 0
    let running = false
    /** Poslední pozice, kterou zapsal modul — podle ní se pozná cizí scroll. */
    let zapsano = window.scrollY
    let stagnace = 0

    const max = () => document.documentElement.scrollHeight - window.innerHeight

    const tick = () => {
      const pred = window.scrollY
      const diff = target - pred

      if (Math.abs(diff) < STOP) {
        running = false
        raf = 0
        return
      }

      window.scrollTo(0, pred + diff * LERP)
      zapsano = window.scrollY

      /*
        Krok `diff * LERP` klesne pod jeden fyzický pixel dřív, než `diff`
        klesne pod práh — prohlížeč sub-pixelový zápis slije a `scrollY` se
        přestane hýbat. Bez téhle pojistky by `running` zůstalo navždy true
        a resync níž (hlídaný na `!running`) by se už nikdy nespustil:
        klávesnice, posuvník i hledání na stránce by byly natrvalo přebité.
      */
      if (Math.abs(window.scrollY - pred) < 0.5) stagnace += 1
      else stagnace = 0

      if (stagnace >= 3) {
        target = window.scrollY
        running = false
        raf = 0
        stagnace = 0
        return
      }

      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      stagnace = 0
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
      target = Math.round(Math.min(Math.max(target + delta * MULT, 0), max()))
      start()
    }

    /*
      Klávesnice, posuvník, kotvy i hledání na stránce scrollují nativně.
      Rozhoduje PŮVOD posunu, ne to, jestli zrovna běží rAF: když se
      stránka pohnula jinam, než kam ji zapsal modul, je to cizí scroll
      a cíl se mu musí podřídit — jinak by ho modul stáhl zpátky.
    */
    const onScroll = () => {
      if (Math.abs(window.scrollY - zapsano) > 2) {
        target = window.scrollY
        zapsano = window.scrollY
        stagnace = 0
      }
    }
    const onResize = () => {
      target = Math.min(target, max())
    }

    /*
      Programový scroll (šipka v heru, kotvy) musí jet týmž dojezdem —
      jinak je jediná nabízená akce hero obrazovky zároveň jediné místo,
      kde se pohyb vypne a stránka skočí (DESIGN.md 6.5, poslední odstavec).
    */
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return
      // Aktivace z klávesnice (detail 0) jde nativní kotvou: jen ta přesune
      // výchozí bod tabulátoru na cíl, jinak by další Tab vrátil čtenáře
      // k obsahu „V článku“ (11.2; kontrola článků 3. 10. 2026).
      if (event.detail === 0) return
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]')
      if (!(link instanceof HTMLAnchorElement)) return
      const id = decodeURIComponent(link.hash.slice(1))
      const cil = id ? document.getElementById(id) : null
      if (!cil) return

      event.preventDefault()
      const odsazeni = parseFloat(getComputedStyle(cil).scrollMarginTop) || 0
      target = Math.round(
        Math.min(Math.max(cil.getBoundingClientRect().top + window.scrollY - odsazeni, 0), max()),
      )
      // pushState jako nativní kotva: Zpět vrátí čtenáře k obsahu, ne pryč z článku.
      history.pushState(null, '', link.hash)
      start()
      // preventDefault ruší i přesun výchozího bodu tabulátoru na cíl: bez
      // fokusu vrátil další Tab čtenáře k obsahu „V článku“. tabindex -1
      // prstenec nevykreslí (11.2; kontrola článků 3. 10. 2026).
      if (!cil.hasAttribute('tabindex')) cil.setAttribute('tabindex', '-1')
      cil.focus({ preventScroll: true })
    }

    const root = document.documentElement
    let aktivni = false
    let puvodni = root.style.scrollBehavior

    /*
      Setrvačník vlastní `scroll-behavior`, dokud běží. ScrollTrigger si při
      prvním spouštěči zapamatuje plynulý scroll (html.plynule) a po každém
      refreshi ho inline zapíše zpátky — po živém přepnutí reduce →
      no-preference pak kolečko ujelo 270 px místo 3 444 (porota kola 02
      článku o příměsích). Cizí zápis se proto hned vrací na `auto`.
    */
    const drzAuto = new MutationObserver(() => {
      if (aktivni && root.style.scrollBehavior !== 'auto') root.style.scrollBehavior = 'auto'
    })

    const zastav = () => {
      if (!aktivni) return
      aktivni = false
      drzAuto.disconnect()
      root.style.scrollBehavior = puvodni
      root.removeAttribute('data-inertia')
      window.removeEventListener('wheel', onWheel)
      document.removeEventListener('click', onAnchorClick)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      running = false
    }

    const podlePreference = () => {
      // Nastavení se může změnit i uprostřed dojezdu. Nativní scroll musí
      // ihned převzít řízení, včetně uvolnění wheel listeneru a rAF.
      if (!fine.matches || still.matches) {
        zastav()
        return
      }
      if (aktivni) return
      aktivni = true
      target = window.scrollY
      zapsano = window.scrollY
      stagnace = 0
      window.addEventListener('wheel', onWheel, { passive: false })
      document.addEventListener('click', onAnchorClick)
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize)

      // Setrvačník si dojezd řídí sám — nativní smooth by se s ním pral.
      puvodni = root.style.scrollBehavior
      root.style.scrollBehavior = 'auto'
      root.setAttribute('data-inertia', '')
      drzAuto.observe(root, { attributes: true, attributeFilter: ['style'] })
    }

    fine.addEventListener('change', podlePreference)
    still.addEventListener('change', podlePreference)
    podlePreference()

    return () => {
      fine.removeEventListener('change', podlePreference)
      still.removeEventListener('change', podlePreference)
      zastav()
    }
  }, [enabled])

  return null
}
