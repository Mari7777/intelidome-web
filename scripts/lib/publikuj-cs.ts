import type { Payload, PayloadRequest, RequiredDataFromCollectionSlug } from 'payload'

import { LOCALES, type Locale } from '../../src/i18n/config'

type Kolekce = 'posts' | 'pages'

type Args<K extends Kolekce> = {
  collection: K
  id: number | string
  /** Data k zápisu (podmnožina polí kolekce) — typ hlídá seedery stejně jako přímý `payload.update`. */
  data: Partial<RequiredDataFromCollectionSlug<K>>
  req?: PayloadRequest
  depth?: number
}

/**
 * Seedery přepisují jen češtinu (ADR-008, A16): `publishSpecificLocale: 'cs'`
 * publikuje výhradně české hodnoty, rozpracované překlady v ostatních jazycích
 * zůstávají netknuté. Po zápisu se podívá, které jazyky jsou označené jako
 * hotové — český obsah se změnil, překlad už mu nemusí odpovídat.
 */
export async function publikujCs<K extends Kolekce>(payload: Payload, args: Args<K>) {
  const { collection, id, data, req, depth = 0 } = args

  const doc = await payload.update({
    collection,
    id,
    // Vstup je zkontrolovaný proti kolekci (typ `Args`); Payload chce DeepPartial
    // nad generickým K, což TS neumí odvodit — přetypování je jen uvnitř helperu.
    // draft: false alone does not set publication status on a partial update.
    data: { ...data, _status: 'published' } as never,
    depth,
    locale: 'cs',
    draft: false,
    publishSpecificLocale: 'cs',
    req,
    context: { disableRevalidate: true },
  })

  const vsechny = await payload.findByID({
    collection,
    id,
    locale: 'all',
    depth: 0,
    select: { prelozeno: true },
    req,
  })
  // Při `locale: 'all'` je hodnota mapa `{ cs: false, en: true, … }`, ne boolean.
  const mapa = ((vsechny as { prelozeno?: unknown } | null)?.prelozeno ?? {}) as Partial<Record<Locale, boolean>>
  const hotove = LOCALES.filter((kod) => kod !== 'cs' && mapa[kod] === true)

  if (hotove.length > 0) {
    payload.logger.warn(
      `cs změněno (${collection} ${id}); překlad označen jako hotový: ${hotove.join(', ')} — zkontroluj v adminu`,
    )
  }

  return doc
}
