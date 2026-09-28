import type { Metadata } from 'next'

import React from 'react'

import { Analytics } from '@vercel/analytics/next'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { LogoMaskDefs } from '@/components/Logo/LogoMaskDefs'
import { SmilGuard } from '@/components/figures/SmilGuard'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { Archivo } from 'next/font/google'

import '../globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { DEFAULT_LOCALE, jeLocale } from '@/i18n/config'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { rssCesta } from '@/i18n/routing'

// Display písmo DS v2 (ADR-004, DESIGN.md 4.1) — jediný webfont webu.
// Self-hostuje ho next/font; --id-f-archivo pak plní --id-f-display.
const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  weight: 'variable',
  display: 'swap',
  variable: '--id-f-archivo',
})

type Args = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// Root layout frontendu (ADR-008): čeština sem přichází přepisem `/` → `/cs`
// z proxy, ostatní jazyky vlastní adresou. Ostatní jazyky se pečou na vyžádání.
export function generateStaticParams() {
  return [{ locale: 'cs' }]
}

export default async function RootLayout({ children, params }: Args) {
  const { locale } = await params
  if (!jeLocale(locale)) notFound()
  const { isEnabled } = await draftMode()

  return (
    <html className={archivo.variable} data-theme="light" lang={locale} suppressHydrationWarning>
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
              "addEventListener('load',function(){setTimeout(function(){" +
              "document.documentElement.classList.add('plynule')},1500)});" +
              "setTimeout(function(){var d=document.documentElement;" +
              "if(d.dataset.motion!=='ready')d.classList.remove('js')},3000);" +
              // Obnova pozice po reloadu a návratu Zpět: prohlížeč vracel
              // stránku o 50–560 px vedle (i ve vzorových článcích; porota
              // kola 04 článku o příměsích). Výška stránky je při
              // DOMContentLoaded už konečná, proto se vrací přesný offset
              // uložený při odchodu. Kotvu z adresy řeší Motion, bfcache
              // si pozici drží sama.
              // Ruční režim jen pro toto plné načtení, pak zpět na `auto`:
              // navigaci uvnitř aplikace (router Next.js) obnovuje prohlížeč.
              "try{var k='pozice:'+location.pathname;" +
              "var n=performance.getEntriesByType('navigation')[0],t=n&&n.type;" +
              "if((t==='reload'||t==='back_forward')&&!location.hash){var y=+sessionStorage.getItem(k);" +
              "if(y>0){history.scrollRestoration='manual';document.addEventListener('DOMContentLoaded',function(){" +
              "scrollTo(0,y);history.scrollRestoration='auto'})}}" +
              "addEventListener('pagehide',function(){sessionStorage.setItem(k,String(Math.round(scrollY)))})}catch(e){}",
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
        <LocaleProvider locale={locale}>
          <Providers>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />

            <Header locale={locale} />
            {children}
            <Footer locale={locale} />
          </Providers>
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  )
}

export async function generateMetadata({ params }: Pick<Args, 'params'>): Promise<Metadata> {
  const { locale: param } = await params
  const locale = jeLocale(param) ? param : DEFAULT_LOCALE

  return {
    metadataBase: new URL(getServerSideURL()),
    robots: {
      index: process.env.VERCEL_ENV !== 'preview',
      follow: true,
      googleBot: { index: process.env.VERCEL_ENV !== 'preview', follow: true, 'max-image-preview': 'large' },
    },
    title: {
      default: 'InteliDome — chytrá závlaha a automatizace zahrady',
      template: '%s | InteliDome',
    },
    description:
      'Návody a praxe kolem chytré závlahy: návrh systému, kapková závlaha, zazimování a automatizace zahrady. Blog značky InteliDome.',
    alternates: {
      types: {
        'application/rss+xml': rssCesta(locale),
      },
    },
    openGraph: mergeOpenGraph(undefined, locale),
    twitter: {
      card: 'summary_large_image',
    },
  }
}
