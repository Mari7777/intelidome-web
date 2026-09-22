import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-[var(--id-line-soft)] bg-[var(--id-bg)]">
      <div className="container pt-[34px] pb-[10px] gap-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <Link
          aria-label="InteliDome — domovská stránka"
          className="flex items-center text-[var(--id-ink)]"
          href="/"
        >
          <Logo decorative height={19} />
        </Link>

        <nav aria-label="Navigace v patičce" className="flex flex-col md:flex-row gap-4">
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
      <div className="container pb-8 text-[13.5px] leading-[1.45] text-[var(--id-ink-2)]">
        © {new Date().getFullYear()} InteliDome
      </div>
    </footer>
  )
}
