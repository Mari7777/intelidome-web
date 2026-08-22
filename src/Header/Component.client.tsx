'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

/**
 * Plovoucí frosted kapsle (DESIGN.md 7.1).
 *
 * Není to lišta přes celou šířku — ta je v anti-vzorech („frosted smí být
 * jedině plovoucí kapsle") a zároveň by ukrajovala z hera, který má mít
 * přesně 100svh. Kapsle je `fixed` 18 px pod hranou, stránka pod ní
 * protéká; obal nechytá kliky, jen samotná pilulka.
 */
export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="id-capsule-wrap pointer-events-none fixed inset-x-0 top-[18px] z-30 flex justify-center px-4"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="id-capsule pointer-events-auto">
        <Link className="id-capsule__mark" href="/">
          <Logo loading="eager" priority="high" />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
