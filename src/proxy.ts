import { NextResponse, type NextRequest } from 'next/server'

import { COOKIE_JAZYK, ROBOT_UA, type Locale } from '@/i18n/config'
import { LIVE_LOCALES } from '@/i18n/live'
import { vyjednejJazyk } from '@/i18n/negotiate'
import { odstranPrefix } from '@/i18n/routing'

/**
 * Jazykový proxy (ADR-008, A7/A8). Umí jen přepis, 308, cookie a volbu
 * jazyka na kořeni — žádný payload, next-cache ani DB. Vše s tečkou
 * (robots.txt, sitemap*.xml, feed.xml, favicony) a interní cesty obchází.
 * Vyhrazené prefixy jsou ukotvené na hranici segmentu: `/nextgen-zavlaha`
 * nebo `/administrace` jsou běžné stránky a proxy je musí přepsat na `/cs/…`.
 */
export const config = {
  matcher: ['/((?!(?:api|admin|next|_next|_vercel)(?:/|$)|.*\\..*).*)'],
}

const ROK = 60 * 60 * 24 * 365

const nastavCookie = (res: NextResponse, locale: Locale) => {
  res.cookies.set(COOKIE_JAZYK, locale, { path: '/', maxAge: ROK, sameSite: 'lax' })
}

/** Jen plná navigace dokumentu smí měnit cookie; RSC/prefetch ji nechává. */
const jeDokument = (req: NextRequest): boolean => {
  if (req.headers.get('rsc') === '1') return false
  const dest = req.headers.get('sec-fetch-dest')
  if (dest !== null) return dest === 'document'
  return (req.headers.get('accept') ?? '').includes('text/html')
}

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone()
  const { pathname } = url
  const { locale: prefix, path } = odstranPrefix(pathname)
  const prefixovana = pathname !== path
  const dokument = jeDokument(req)
  const cookie = req.cookies.get(COOKIE_JAZYK)?.value

  // `/cs/…` zvenku: čeština je bez prefixu, žádný veřejný duplikát.
  if (prefixovana && prefix === 'cs') {
    url.pathname = path
    return NextResponse.redirect(url, 308)
  }

  if (prefixovana) {
    const res = NextResponse.next()
    // Neživý jazyk cookie nemění: stránka ho hned pošle 307 na cs a tam cookie nastaví rewrite.
    if (dokument && cookie !== prefix && LIVE_LOCALES.includes(prefix)) nastavCookie(res, prefix)
    return res
  }

  // Volba jazyka jen na kořeni, jen bez cookie, jen pro lidi, nikdy v náhledu.
  if (
    pathname === '/' &&
    LIVE_LOCALES.length > 1 &&
    dokument &&
    !cookie &&
    !req.cookies.has('__prerender_bypass') &&
    !ROBOT_UA.test(req.headers.get('user-agent') ?? '')
  ) {
    const cil = vyjednejJazyk({
      acceptLanguage: req.headers.get('accept-language'),
      country: req.headers.get('x-vercel-ip-country'),
      live: LIVE_LOCALES,
    })
    if (cil && cil !== 'cs') {
      url.pathname = '/' + cil
      const res = NextResponse.redirect(url, 302)
      nastavCookie(res, cil)
      return res
    }
  }

  // Neprefixovaná adresa je česká: interně `/cs/…` (route strom má jen `[locale]`).
  url.pathname = pathname === '/' ? '/cs' : '/cs' + pathname
  const res = NextResponse.rewrite(url)
  if (dokument && cookie !== 'cs') nastavCookie(res, 'cs')
  return res
}
