'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { useLocale } from '@/i18n/LocaleProvider'
import { lokalizujCestu } from '@/i18n/routing'
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
  const locale = useLocale()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  /*
    Na poslední obrazovce stály dvě výzvy se skoro stejným textem: pilulka
    v kapsli a hlavní CTA pás (porota kola 06, hierarchie — kritické).
    Kapsle proto svou mini-CTA odloží, jakmile je pás na obrazovce; logo
    a kategorie zůstávají, takže hlavička nemizí a nic neposkakuje.
  */
  const [ctaNaObrazovce, setCtaNaObrazovce] = useState(false)
  useEffect(() => {
    const cta = document.querySelector('.id-cta')
    if (!cta || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([zaznam]) => setCtaNaObrazovce(zaznam.isIntersecting), {
      rootMargin: '-10% 0px -10% 0px',
    })
    io.observe(cta)
    return () => io.disconnect()
  }, [pathname])

  return (
    <header
      className="id-capsule-wrap pointer-events-none fixed inset-x-0 top-[18px] z-30 flex justify-center px-4"
      {...(ctaNaObrazovce ? { 'data-cta-videt': '' } : {})}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="id-capsule pointer-events-auto">
        <Link
          aria-label="InteliDome — domovská stránka"
          className="id-capsule__mark"
          href={lokalizujCestu('/', locale)}
        >
          <Logo decorative height={21} />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
