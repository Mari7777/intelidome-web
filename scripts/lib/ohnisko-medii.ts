import type { Payload } from 'payload'

export type Ohnisko = { focalX: number; focalY: number; focalPortraitX?: number; focalPortraitY?: number }

type MediaDoc = { id: number | string; filename?: string | null; url?: string | null; focalX?: number | null; focalY?: number | null }

/**
 * Nastaví ohnisko média tak, aby mu odpovídaly i ořezané varianty (square,
 * og). Prosté `payload.update({ data: { focalX, focalY } })` změní jen čísla
 * v DB: Payload porovná nové ohnisko s daty, ve kterých už je, a varianty
 * nechá oříznuté podle starého (porota magazínu kola 01: čtverec média 38
 * byl na středu, ač DB hlásila 85/50). Přegeneruje je jen ohnisko poslané
 * v `req.query.uploadEdits`, jako to dělá admin; soubory se přepíší pod
 * stejnými jmény.
 *
 * `vynutit` přegeneruje varianty i beze změny čísel (oprava starých ořezů).
 */
export async function nastavOhnisko(
  payload: Payload,
  id: number | string,
  ohnisko: Ohnisko,
  { alt, vynutit = false }: { alt?: string; vynutit?: boolean } = {},
): Promise<'prerezano' | 'beze-zmeny'> {
  const doc = (await payload.findByID({ collection: 'media', id, depth: 0 })) as MediaDoc
  const { focalX, focalY, ...portret } = ohnisko
  const zmena = doc.focalX !== focalX || doc.focalY !== focalY
  const data = { ...(alt ? { alt } : {}), ...portret }
  if (!zmena && !vynutit) {
    if (Object.keys(data).length) await payload.update({ collection: 'media', id, data })
    return 'beze-zmeny'
  }
  if (!doc.filename || !doc.url) throw new Error(`médium ${id} nemá soubor, ořez nejde přegenerovat`)
  await payload.update({
    collection: 'media',
    id,
    // filename + url řeknou Payloadu, odkud vzít originál; focalX/Y v datech
    // být nesmí, jinak změnu nepozná.
    data: { ...data, filename: doc.filename, url: doc.url },
    req: { query: { uploadEdits: { focalPoint: { x: focalX, y: focalY } } } },
  })
  return 'prerezano'
}
