import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-[var(--id-bg-2)]">
      <div className="container py-10 gap-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        <nav className="flex flex-col md:flex-row gap-4">
          {navItems.map(({ link }, i) => {
            return (
              <CMSLink
                className="text-[var(--id-ink-2)] transition-colors hover:text-[var(--id-ink)]"
                key={i}
                {...link}
              />
            )
          })}
        </nav>
      </div>
      <div className="container pb-8 text-sm text-[var(--id-ink-3)]">
        © {new Date().getFullYear()} InteliDome
      </div>
    </footer>
  )
}
