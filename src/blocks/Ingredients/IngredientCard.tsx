'use client'

import React, { useEffect, useState } from 'react'

/**
 * Karta složky. Na zařízení s myší (hover-capable, > 560 px) dostane
 * `tabIndex` + jméno skupiny, aby se překryv s textem dal vyvolat
 * i klávesnicí (:focus-within) — obsah schovaný jen za hover by nebyl
 * přístupný. Na dotykovém zařízení text zůstává staticky pod fotkou,
 * takže karta žádný tab stop nepotřebuje (vzor TableWrap).
 */
export const IngredientCard: React.FC<{
  className?: string
  label: string
  children: React.ReactNode
}> = ({ children, className, label }) => {
  const [interaktivni, setInteraktivni] = useState(false)

  useEffect(() => {
    const mq = matchMedia('(hover: hover) and (min-width: 561px)')
    const zmer = () => setInteraktivni(mq.matches)
    zmer()
    mq.addEventListener('change', zmer)
    return () => mq.removeEventListener('change', zmer)
  }, [])

  return (
    <figure
      className={className}
      {...(interaktivni ? { tabIndex: 0, role: 'group', 'aria-label': label } : {})}
    >
      {children}
    </figure>
  )
}
