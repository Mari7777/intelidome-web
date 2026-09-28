/**
 * Dokumenty a jazyk (ADR-008, A4–A6): jeden dotaz `slug + locale (+draft)`,
 * jeden predikát existence překladu (`prelozeno[locale]`), jedno větvení
 * 404 / 307 / 200. Jen server (importuje Payload) — klientské komponenty
 * dostávají výsledek propem.
 */
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'

import type { Page, Post } from '@/payload-types'

import { DEFAULT_LOCALE, LOCALES, type Locale } from './config'
import { LIVE_LOCALES } from './live'
import { zobrazitelny, type SPriznakem } from './zobrazitelny'

type Kolekce = 'posts' | 'pages'
type Dokument<K extends Kolekce> = K extends 'posts' ? Post : Page

/* React `cache` klíčuje podle identity argumentů — objektový literál by se
   nikdy netrefil, proto interně primitiva (stránka i generateMetadata pak
   sdílejí jedno čtení). */
const najdi = cache(async (collection: Kolekce, slug: string, locale: Locale, draft: boolean) => {
  const payload = await getPayload({ config: configPromise })
  const spolecne = {
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  } as const

  const result =
    collection === 'posts'
      ? await payload.find({ collection: 'posts', ...spolecne })
      : await payload.find({ collection: 'pages', ...spolecne })

  return result.docs?.[0] ?? null
})

/**
 * Dokument v daném jazyce, BEZ `fallbackLocale: false` (A5): nepřeložené
 * části přijdou česky, o viditelnosti rozhoduje jen `prelozeno`.
 */
export async function najdiDokument<K extends Kolekce>(args: {
  collection: K
  slug: string
  locale: Locale
  draft: boolean
}): Promise<Dokument<K> | null> {
  const { collection, slug, locale, draft } = args
  return (await najdi(collection, slug, locale, draft)) as Dokument<K> | null
}

export { zobrazitelny } from './zobrazitelny'

/**
 * Větvení dokumentu pod `/{locale}/…` (A6): chybí → 404; existuje, ale není
 * přeložený a nejde o náhled → 307 na českou adresu; jinak vykreslit.
 * CMS přesměrování (PayloadRedirects) se ve stránce vyhodnocuje dřív.
 */
export function rozhodniDokument(args: {
  doc: SPriznakem
  locale: Locale
  draft: boolean
  csCesta: string
}): void {
  const { doc, locale, draft, csCesta } = args
  if (!doc) notFound()
  if (!draft && !zobrazitelny(doc, locale)) redirect(csCesta)
}

/**
 * Jazyky, ve kterých je publikovaný dokument veřejný: `['cs', …prelozeno
 * === true] ∩ LIVE_LOCALES`, z JEDNOHO čtení `locale: 'all'` bez fallbacku.
 * Pro hreflang / JSON-LD (krok 3). Neexistující dokument → `['cs']`.
 */
export const prekladyDokumentu = cache(async (collection: Kolekce, slug: string): Promise<Locale[]> => {
  const payload = await getPayload({ config: configPromise })
  const spolecne = {
    depth: 0,
    draft: false,
    fallbackLocale: false,
    limit: 1,
    locale: 'all',
    overrideAccess: false,
    pagination: false,
    select: { prelozeno: true },
    where: { slug: { equals: slug } },
  } as const

  const result =
    collection === 'posts'
      ? await payload.find({ collection: 'posts', ...spolecne })
      : await payload.find({ collection: 'pages', ...spolecne })

  // Při `locale: 'all'` je hodnota mapa `{ cs: false, en: true, … }`, ne boolean.
  const mapa = (result.docs?.[0]?.prelozeno ?? {}) as unknown as Partial<Record<Locale, boolean>>

  return LOCALES.filter(
    (kod) => (kod === DEFAULT_LOCALE || mapa[kod] === true) && LIVE_LOCALES.includes(kod),
  )
})
