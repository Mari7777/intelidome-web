'use client'

import React, { useEffect, useId, useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * Přepínač složek. Karty i panely žijí v JEDNÉ mřížce:
 * — desktop (hover, > 560 px): karty v řadě, všechny panely ve společné
 *   buňce pod nimi (výška nejvyššího → přepínání nehýbe stránkou);
 *   výchozí je otevřená první složka, vybírá hover, klik i fokus.
 * — dotyk / ≤ 560 px: akordeon se zavřeným výchozím stavem — čtyři
 *   karty drží pohromadě a panel se otevírá NAD mřížkou (dorolování
 *   míří nahoru), aby čtenář po přečtení pokračoval scrolem dolů;
 *   klepnutí na tutéž kartu zavírá. Do první interakce drží třída `netknuto`
 *   všechny panely zavřené (server rendruje otevřený Biovin pro
 *   desktop, mobil tak nemá skok při načtení).
 * Sémantika: rozbalovací karty (role button + aria-expanded), panely
 * role region; neaktivní panel inert + aria-hidden. Text všech panelů
 * zůstává v DOM.
 */
export const IngredientsTabs: React.FC<{
  labels: string[]
  tabs: React.ReactNode[]
  panels: React.ReactNode[]
}> = ({ labels, panels, tabs }) => {
  const uid = useId()
  const [vybrano, setVybrano] = useState<number | null>(0)
  const [netknuto, setNetknuto] = useState(true)
  const [taby, setTaby] = useState(true)
  const [dorolovat, setDorolovat] = useState<number | null>(null)

  useEffect(() => {
    const mq = matchMedia('(hover: hover) and (min-width: 561px)')
    const zmer = () => setTaby(mq.matches)
    zmer()
    mq.addEventListener('change', zmer)
    return () => mq.removeEventListener('change', zmer)
  }, [])

  const vyber = (i: number) => {
    setNetknuto(false)
    if (taby) {
      setVybrano(i)
      return
    }
    // akordeon: klepnutí na otevřenou kartu zavírá; `netknuto` znamená,
    // že serverový výchozí výběr ještě nikdo neotevřel
    const cil = vybrano === i && !netknuto ? null : i
    setVybrano(cil)
    // panel se otevírá nad mřížkou — doroluj (nahoru) k jeho
    // titulku, jinak se text objeví mimo zobrazovací plochu a tap
    // působí jako do prázdna (při zavření se neroluje)
    if (cil !== null) setDorolovat(cil)
  }

  useEffect(() => {
    if (dorolovat === null) return
    const el = document.getElementById(`${uid}-p${dorolovat}`)
    if (el) {
      el.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      })
    }
    setDorolovat(null)
  }, [dorolovat, uid])

  const otevreno = (i: number) => vybrano === i && (taby || !netknuto)

  return (
    // Vlastní reveal skupina: čtyři karty byly `.rv`, ale jejich přímý
    // rodič (tahle mřížka) neměl `data-rv-group`, takže spadly na
    // fallback pro nezařazené prvky — všechny odhalil týž trigger
    // naráz místo staggeru 80 ms (kolo 02, pohyb; 6.3.2).
    <div
      className={cn(
        'id-ingredients__grid',
        netknuto && 'netknuto',
        vybrano !== null && !netknuto && 'ma-vybrano',
      )}
      data-rv-group=""
    >
      {tabs.map((node, i) => (
        <div
          aria-controls={`${uid}-p${i}`}
          aria-expanded={otevreno(i)}
          className={cn('rv id-ingredients__tab', otevreno(i) && 'is-active')}
          id={`${uid}-t${i}`}
          key={labels[i] ?? i}
          onClick={() => vyber(i)}
          onFocus={() => {
            if (taby) {
              setNetknuto(false)
              setVybrano(i)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              vyber(i)
            }
          }}
          onMouseEnter={() => {
            if (matchMedia('(hover: hover)').matches) {
              setNetknuto(false)
              setVybrano(i)
            }
          }}
          role="button"
          tabIndex={0}
        >
          {node}
        </div>
      ))}
      {panels.map((node, i) => {
        const aktivni = otevreno(i)
        return (
          <div
            aria-labelledby={`${uid}-t${i}`}
            className={cn('id-ingredients__panel-slot', aktivni && 'is-active')}
            id={`${uid}-p${i}`}
            key={labels[i] ?? i}
            role="region"
            {...(aktivni ? {} : { inert: true, 'aria-hidden': true })}
          >
            {node}
          </div>
        )
      })}
    </div>
  )
}
