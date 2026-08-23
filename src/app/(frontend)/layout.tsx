import type { Metadata } from 'next'

import React from 'react'

import { Analytics } from '@vercel/analytics/next'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { LogoMaskDefs } from '@/components/Logo/LogoMaskDefs'
import { SmilGuard } from '@/components/figures/SmilGuard'
import { InertiaScroll } from '@/components/motion/InertiaScroll'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { Archivo } from 'next/font/google'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

// Display písmo DS v2 (ADR-004, DESIGN.md 4.1) — jediný webfont webu.
// Self-hostuje ho next/font; --id-f-archivo pak plní --id-f-display.
const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  weight: 'variable',
  display: 'swap',
  variable: '--id-f-archivo',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={archivo.variable} data-theme="light" lang="cs" suppressHydrationWarning>
      <head>
        {/*
          Anti-FOUC brána (6.3.2): skrytí `.rv` visí na `html.js`, takže bez
          JS zůstane obsah viditelný. Musí běžet před prvním paintem.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              // Brána nese skrytí `.rv`, takže kdyby klientský balík nedoběhl,
              // zůstal by obsah navždy neviditelný. Po 3 s se proto brána sama
              // otevře, pokud se pohyb nepřihlásil.
              "document.documentElement.classList.add('js');" +
              "setTimeout(function(){var d=document.documentElement;" +
              "if(d.dataset.motion!=='ready')d.classList.remove('js')},3000)",
          }}
        />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicon.png" rel="icon" type="image/png" sizes="32x32" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
      </head>
      <body>
        {/* Kresba wordmarku leží na stránce jednou; logo v hlavičce, patičce
            i závěrečné výzvě je jen obdélník maskovaný touto kresbou (9.4). */}
        <LogoMaskDefs />
        <SmilGuard />
        <InertiaScroll />
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'InteliDome — chytrá závlaha a automatizace zahrady',
    template: '%s | InteliDome',
  },
  description:
    'Návody a praxe kolem chytré závlahy: návrh systému, kapková závlaha, zazimování a automatizace zahrady. Blog značky InteliDome.',
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
