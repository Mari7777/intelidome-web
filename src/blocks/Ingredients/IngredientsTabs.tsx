'use client'

import React, { useId, useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * Přepínač složek (WAI tabs): karty jsou taby s klouzavým tabIndexem,
 * vybírá hover, klepnutí, fokus i šipky. Panely leží všechny v téže
 * mřížkové buňce — kontejner drží výšku nejvyššího a přepínání nehýbe
 * stránkou. Neaktivní panel je `inert` + aria-hidden; text všech
 * panelů zůstává v DOM (vyhledávače, kopírování, čtečky přes taby).
 */
export const IngredientsTabs: React.FC<{
  labels: string[]
  tabs: React.ReactNode[]
  panels: React.ReactNode[]
}> = ({ labels, panels, tabs }) => {
  const uid = useId()
  const [vybrano, setVybrano] = useState(0)

  const klavesy = (e: React.KeyboardEvent) => {
    const posledni = tabs.length - 1
    let cil: number | null = null
    if (e.key === 'ArrowRight') cil = vybrano === posledni ? 0 : vybrano + 1
    else if (e.key === 'ArrowLeft') cil = vybrano === 0 ? posledni : vybrano - 1
    else if (e.key === 'Home') cil = 0
    else if (e.key === 'End') cil = posledni
    if (cil === null) return
    e.preventDefault()
    setVybrano(cil)
    document.getElementById(`${uid}-t${cil}`)?.focus()
  }

  return (
    <>
      <div aria-label="Složky směsi" className="id-ingredients__grid" role="tablist">
        {tabs.map((node, i) => (
          <div
            aria-controls={`${uid}-p${i}`}
            aria-selected={i === vybrano}
            className={cn('rv id-ingredients__tab', i === vybrano && 'is-active')}
            id={`${uid}-t${i}`}
            key={labels[i] ?? i}
            onClick={() => setVybrano(i)}
            onFocus={() => setVybrano(i)}
            onKeyDown={klavesy}
            onMouseEnter={() => {
              if (matchMedia('(hover: hover)').matches) setVybrano(i)
            }}
            role="tab"
            tabIndex={i === vybrano ? 0 : -1}
          >
            {node}
          </div>
        ))}
      </div>
      <div className="rv id-ingredients__panels">
        {panels.map((node, i) => {
          const aktivni = i === vybrano
          return (
            <div
              aria-labelledby={`${uid}-t${i}`}
              className={cn('id-ingredients__panel-slot', aktivni && 'is-active')}
              id={`${uid}-p${i}`}
              key={labels[i] ?? i}
              role="tabpanel"
              {...(aktivni ? {} : { inert: true, 'aria-hidden': true })}
            >
              {node}
            </div>
          )
        })}
      </div>
    </>
  )
}
