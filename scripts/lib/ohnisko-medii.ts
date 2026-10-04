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
 *
 * Past: s `uploadEdits` Payload zakóduje znovu i ORIGINÁL — z už jednou
 * zakódovaného souboru v public/media, takže každá změna ohniska fotku
 * o generaci zhorší (4. 10. 2026: ořezy na výšku Jak připravit a Péče,
 * průměrná odchylka 3–5 úrovní). S `zdroj` (cesta k fotce v
 * zdroje-informaci/fotky) se originál i varianty kódují jednou ze zdroje.
 */
export async function nastavOhnisko(
  payload: Payload,
  id: number | string,
  ohnisko: Ohnisko,
  { alt, vynutit = false, zdroj }: { alt?: string; vynutit?: boolean; zdroj?: string } = {},
): Promise<'prerezano' | 'beze-zmeny'> {
  const doc = (await payload.findByID({ collection: 'media', id, depth: 0 })) as MediaDoc
  const { focalX, focalY, ...portret } = ohnisko
  const zmena = doc.focalX !== focalX || doc.focalY !== focalY
  const data = { ...(alt ? { alt } : {}), ...portret }
  if (!zmena && !vynutit) {
    if (Object.keys(data).length) await payload.update({ collection: 'media', id, data })
    return 'beze-zmeny'
  }
  if (zdroj) {
    await payload.update({
      collection: 'media',
      id,
      data,
      filePath: zdroj,
      overwriteExistingFiles: true,
      req: { query: { uploadEdits: { focalPoint: { x: focalX, y: focalY } } } },
    })
    return 'prerezano'
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
