import type { NextConfig } from 'next'

import { DEFAULT_LOCALE, LOCALES } from './src/i18n/config'

type Pravidlo = { source: string; destination: string; permanent: true }

/**
 * Trvalá přesměrování starých adres článků na magazín (ADR-009 bod 4).
 * Redirects z next.config běží před proxy i před routami a query předávají
 * samy; kotvu nese prohlížeč. Pořadí je závazné: specifická před obecnými.
 * `/cs/posts…` vede rovnou na adresu bez prefixu (jeden skok místo 308 + 308),
 * ostatní jazyky na `/{jazyk}/magazin…`. Vzory nechytají `/posts-sitemap.xml`
 * ani `/api/posts` (začínají jinak). Strana 1 stránkování je `/magazin`.
 * Adresa s koncovým lomítkem má skok navíc: Next ho ořízne (308) dřív, než
 * přijdou na řadu tato pravidla. Vzory nerozlišují velikost písmen.
 */
export function presmerovaniMagazinu(): Pravidlo[] {
  const cizi = LOCALES.filter((kod) => kod !== DEFAULT_LOCALE).join('|')
  const sada = (zdroj: string, cil: string): Pravidlo[] => [
    { source: `${zdroj}/posts/page/1`, destination: `${cil}/magazin`, permanent: true },
    { source: `${zdroj}/posts/page/:n(\\d{1,6})`, destination: `${cil}/magazin/strana/:n`, permanent: true },
    { source: `${zdroj}/posts`, destination: `${cil}/magazin`, permanent: true },
    { source: `${zdroj}/posts/:path+`, destination: `${cil}/magazin/:path+`, permanent: true },
    { source: `${zdroj}/magazin/strana/1`, destination: `${cil}/magazin`, permanent: true },
  ]
  const sloucenyClanek: Pravidlo[] = ['', '/cs'].flatMap((prefix) =>
    ['posts', 'magazin'].map((sekce) => ({
      source: `${prefix}/${sekce}/zazimovani-zavlahy-krok-za-krokem`,
      destination: '/magazin/jak-navrhnout-automatickou-zavlahu',
      permanent: true as const,
    })),
  )
  return [...sloucenyClanek, ...sada('', ''), ...sada('/cs', ''), ...sada(`/:locale(${cizi})`, '/:locale')]
}

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  return [internetExplorerRedirect, ...presmerovaniMagazinu()]
}
