import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Locale } from '@/i18n/config'
import { lokalizujCestu, zakladniCesta } from '@/i18n/routing'
import type { Category, Media, Post } from '@/payload-types'
import { POPIS_KALKULATORU } from '@/blocks/Calculator/popis'
import { druhyKalkulatoru } from '@/utilities/kalkulatoryClanku'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { readingTime } from '@/utilities/readingTime'
import { rozdelTitulek } from '@/utilities/rozdelTitulek'
import { NA_STRANU, sestavSkupiny, vyberKalkulatory, type Dil, type LehkyClanek, type Tema } from './skladba'

/** Řádek článku jen z primitiv: obsah článku se do komponent ani RSC payloadu nedostane. */
export type RadekData = {
  id: number
  href: string
  cesta: string
  titulek: string
  celyTitulek: string
  perex: string | null
  minuty: number | null
  kalkulatory: string[]
  datum: string | null
  nahled: { src: string; width: number; height: number } | null
  tema: { titulek: string; slug: string } | null
  dil: Dil | null
}

export type SkupinaData = {
  slug: string
  titulek: string
  popis: string | null
  serie: boolean
  pocet: number
  minutCelkem: number | null
  kalkulatoru: number
  radky: RadekData[]
}

export type KalkulatorData = { druh: string; nazev: string; ucel: string; href: string; clanek: string }

export type MagazinData = {
  strana: number
  pocetStran: number
  celkem: number
  rejstrik: RadekData[]
  skupiny: SkupinaData[]
  kalkulatory: KalkulatorData[]
  novinka: RadekData | null
}

const VYBER = {
  title: true,
  slug: true,
  publishedAt: true,
  categories: true,
  heroImage: true,
  meta: { image: true, description: true },
  content: true,
} as const

const idKategorie = (c: number | Category) => (typeof c === 'object' ? c.id : c)

/** Čtvercový náhled (varianta `square` ořezaná podle fokálu), jinak thumbnail, jinak originál. */
function nahled(media: number | Media | null | undefined): RadekData['nahled'] {
  if (!media || typeof media !== 'object') return null
  const v = media.sizes?.square?.url ? media.sizes.square : media.sizes?.thumbnail?.url ? media.sizes.thumbnail : null
  const url = v?.url ?? media.url
  const width = v?.width ?? media.width
  const height = v?.height ?? media.height
  if (!url || !width || !height) return null
  return { src: getMediaUrl(url, media.updatedAt), width, height }
}

function naRadek(post: Post, locale: Locale, temaClanku: Map<number, Tema>, dily: Map<number, Dil>): RadekData {
  const [titulek, kvalifikator] = rozdelTitulek(post.title)
  const tema = temaClanku.get(post.id)
  const cesta = zakladniCesta('posts', post.slug ?? '')
  return {
    id: post.id,
    href: lokalizujCestu(cesta, locale),
    cesta,
    titulek,
    celyTitulek: post.title,
    perex: post.meta?.description?.trim() || kvalifikator,
    minuty: readingTime(post.content),
    kalkulatory: druhyKalkulatoru(post.content),
    datum: post.publishedAt ?? null,
    nahled: nahled(post.meta?.image) ?? nahled(post.heroImage),
    tema: tema ? { titulek: tema.titulek, slug: tema.slug } : null,
    dil: dily.get(post.id) ?? null,
  }
}

/**
 * Data domovské stránky magazínu (DESIGN.md 8.5). Přehled „Všechny články“
 * je jediná stránkovaná část; témata, novinka a kalkulátory jen na straně 1.
 * Obsah (kvůli době čtení a kalkulátorům) se čte jen u zobrazených článků.
 */
export async function nactiMagazin({ locale, strana }: { locale: Locale; strana: number }): Promise<MagazinData> {
  const payload = await getPayload({ config: configPromise })
  // Cizí jazyk vypisuje jen články s hotovým překladem (ADR-008 A6).
  const jazyk = locale !== 'cs' ? { where: { prelozeno: { equals: true } } } : {}

  const [prehled, kategorie, lehke] = await Promise.all([
    payload.find({
      collection: 'posts', locale, depth: 1, limit: NA_STRANU, page: strana,
      sort: ['-publishedAt', '-id'], overrideAccess: false, select: VYBER, ...jazyk,
    }),
    payload.find({
      collection: 'categories', locale, fallbackLocale: false, depth: 0, pagination: false,
      sort: 'createdAt', select: { title: true, slug: true, popis: true, serie: true },
    }),
    payload.find({
      collection: 'posts', locale, depth: 0, pagination: false, sort: ['publishedAt', 'id'],
      overrideAccess: false, select: { categories: true, publishedAt: true }, ...jazyk,
    }),
  ])

  // Kategorie bez názvu v daném jazyce se nevykreslí (A18).
  const temata: Tema[] = kategorie.docs
    .filter((k) => k.title && k.slug)
    .map((k) => ({ id: k.id, slug: k.slug!, titulek: k.title, popis: k.popis?.trim() || null, serie: Boolean(k.serie) }))
  const lehkeClanky: LehkyClanek[] = lehke.docs.map((p) => ({
    id: p.id, kategorie: (p.categories ?? []).map(idKategorie), publishedAt: p.publishedAt ?? null,
  }))
  const { skupiny: plan, dily, temaClanku } = sestavSkupiny(lehkeClanky, temata)

  const prvni = strana === 1
  const nactene = new Map<number, Post>(prehled.docs.map((p) => [p.id, p as Post]))
  if (prvni) {
    const chybejici = plan.flatMap((s) => s.clanky).filter((id) => !nactene.has(id))
    if (chybejici.length) {
      const doplnek = await payload.find({
        collection: 'posts', locale, depth: 1, pagination: false, overrideAccess: false,
        select: VYBER, where: { id: { in: chybejici } },
      })
      for (const p of doplnek.docs) nactene.set(p.id, p as Post)
    }
  }

  const radek = (id: number) => naRadek(nactene.get(id)!, locale, temaClanku, dily)
  const rejstrik = prehled.docs.map((p) => radek(p.id))
  const skupiny: SkupinaData[] = prvni
    ? plan.map((s) => {
        const radky = s.clanky.filter((id) => nactene.has(id)).map(radek)
        return {
          slug: s.tema.slug,
          titulek: s.tema.titulek,
          popis: s.tema.popis,
          serie: s.tema.serie,
          pocet: s.pocet,
          minutCelkem: s.vsechnyDily ? radky.reduce((n, r) => n + (r.minuty ?? 0), 0) : null,
          kalkulatoru: radky.reduce((n, r) => n + r.kalkulatory.length, 0),
          radky,
        }
      })
    : []
  const kalkulatory = prvni
    ? vyberKalkulatory([...skupiny.flatMap((s) => s.radky), ...rejstrik]).flatMap((k) =>
        POPIS_KALKULATORU[k.druh] ? [{ ...k, ...POPIS_KALKULATORU[k.druh] }] : [],
      )
    : []

  return {
    strana,
    pocetStran: prehled.totalPages || 1,
    celkem: prehled.totalDocs,
    rejstrik,
    skupiny,
    kalkulatory,
    novinka: prvni ? (rejstrik[0] ?? null) : null,
  }
}
