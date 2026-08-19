'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-6">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="text-[15px] text-[var(--id-ink-2)] no-underline transition-colors hover:text-[var(--id-ink)]"
          />
        )
      })}
      <Link href="/search">
        <span className="sr-only">Hledat</span>
        <SearchIcon className="w-5 text-[var(--id-ink-2)] transition-colors hover:text-[var(--id-ink)]" />
      </Link>
    </nav>
  )
}
