'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

/**
 * Obsah kapsle (DESIGN.md 7.1): odkazy uprostřed, vpravo hledání
 * a jediné mini-CTA. Pod 640 px se odkazy skrývají — v kapsli zůstane
 * značka, lupa a CTA.
 */
export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-5">
      <span className="hidden items-center gap-5 sm:flex">
        {navItems.map(({ link }, i) => (
          <CMSLink key={i} {...link} appearance="link" className="id-capsule__link" />
        ))}
      </span>

      <Link className="id-capsule__icon" href="/search">
        <span className="sr-only">Hledat</span>
        <SearchIcon className="w-[18px]" aria-hidden="true" />
      </Link>

      <Link className="id-capsule__go" href="/">
        Objevit systém
      </Link>
    </nav>
  )
}
