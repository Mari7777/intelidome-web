'use client'

import React, { useEffect, useRef, useState } from 'react'

/**
 * Posuvný kontejner tabulky. `tabIndex` a jméno regionu dostane JEN
 * tehdy, když obsah skutečně přetéká (kolo 01 článku 3: bez podmínky
 * měl desktop 8 zbytečných tab stopů a odečítač hlásil bezejmennou
 * fokusovatelnou skupinu). Server vykreslí bez tabIndexu; po hydrataci
 * ho přidá měření a hlídá ho ResizeObserver na kontejneru i tabulce.
 */
export const TableWrap: React.FC<{ label: string; className?: string; children: React.ReactNode }> = ({
  children,
  className,
  label,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [roluje, setRoluje] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const zmer = () => setRoluje(el.scrollWidth > el.clientWidth + 1)
    zmer()
    const ro = new ResizeObserver(zmer)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      className={className ? `id-table-wrap ${className}` : 'id-table-wrap'}
      ref={ref}
      {...(roluje ? { tabIndex: 0, role: 'region', 'aria-label': label } : {})}
    >
      {children}
    </div>
  )
}
