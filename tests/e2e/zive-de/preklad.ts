/**
 * Dočasný německý překlad pro živý běh (krok 5, A23): Pages `home` a jeden
 * článek dostanou publikovanou verzi `de` s „Překlad hotový“, aby šlo ověřit
 * vyjednávání, 307/404, hreflang, sitemapy, RSS a přepínač s živým jazykem.
 *
 * Spuštění (Payload loader, .env z kořene repa):
 *   npm run payload -- run tests/e2e/zive-de/preklad.ts nastavit
 *   npm run payload -- run tests/e2e/zive-de/preklad.ts uklidit
 *   npm run payload -- run tests/e2e/zive-de/preklad.ts stav
 *
 * `nastavit` je idempotentní (stav si drží v node_modules/.cache). `uklidit`
 * vrátí DB do stavu před testem: smaže verze vzniklé během testu, všechny
 * řádky `_locale = 'de'`, vrátí `updated_at` a příznak `latest`. Tvrdé
 * kontroly (zbylé de řádky, počet verzí, `prelozeno.de`, otisk cs řádků
 * lokalizovaných tabulek) končí chybou a stav zůstává; rozdílné počty řádků
 * obsahových tabulek jsou jen varování (stav se smaže, aby další `nastavit`
 * neuvázl). Tabulky `payload_*` a `users*` (zámky dokumentů, preference,
 * přihlášení otevřeného adminu) se neporovnávají. Nikdy nesahá na cs data.
 */
import config from '@payload-config'
import fs from 'node:fs'
import path from 'node:path'
import { getPayload, type Payload } from 'payload'
import type { Pool } from 'pg'

import { DE_POPIS, DE_TITUL_CLANKU, DE_TITUL_HOME, SLUG_NEPRELOZENY, SLUG_PRELOZENY } from './konstanty'

type Kolekce = 'posts' | 'pages'

type Dokument = {
  collection: Kolekce
  id: number
  slug: string
  updatedAt: string
  verzePred: number
  /** id verze s `latest = true` před testem (u starých dokumentů žádná). */
  latestPred: number | null
}

type Stav = {
  start: string
  dokumenty: Dokument[]
  radky: Record<string, number>
  /** `search.updated_at` per řádek — synchronizace indexu je při publikaci přepíše. */
  hledani?: Record<string, string>
  /** md5 obsahu cs řádků lokalizovaných tabulek — počty by shodu obsahu neprozradily. */
  otisky?: Record<string, string>
}

/** Tabulky, jejichž cs řádky se po úklidu musí shodovat i obsahem (ne jen počtem). */
const TABULKY_OTISKU = ['posts_locales', 'pages_locales', 'search_locales'] as const

const STAV = path.resolve(process.cwd(), 'node_modules/.cache/zive-de/stav.json')

const pool = (payload: Payload): Pool => {
  const p = (payload.db as unknown as { pool?: Pool }).pool
  if (!p) throw new Error('Payload DB adaptér nemá pool (očekává se @payloadcms/db-postgres)')
  return p
}

/** Tabulky nesoucí jazyk: `_locale` (kolekce, bloky, pole, verze) i `locale` (`*_rels` lokalizovaných vztahů). */
const tabulkySJazykem = async (pg: Pool): Promise<{ tabulka: string; sloupec: string }[]> => {
  const { rows } = await pg.query<{ table_name: string; column_name: string }>(
    `select table_name, column_name from information_schema.columns
     where table_schema = 'public' and column_name in ('_locale', 'locale') order by table_name`,
  )
  return rows.map((r) => ({ tabulka: r.table_name, sloupec: r.column_name }))
}

const pocetDe = async (pg: Pool): Promise<Record<string, number>> => {
  const vysledek: Record<string, number> = {}
  for (const { tabulka, sloupec } of await tabulkySJazykem(pg)) {
    const { rows } = await pg.query<{ n: string }>(`select count(*)::text as n from "${tabulka}" where "${sloupec}" = 'de'`)
    if (Number(rows[0].n) > 0) vysledek[tabulka] = Number(rows[0].n)
  }
  return vysledek
}

/**
 * Počty řádků obsahových tabulek. Bez `payload_*` (zámky dokumentů, preference,
 * kv, migrace, složky) a `users*` (relace přihlášení): ty mění otevřený admin
 * na dev serveru nezávisle na testu a úklid by na nich uvázl.
 */
const pocetRadku = async (pg: Pool): Promise<Record<string, number>> => {
  const { rows } = await pg.query<{ table_name: string }>(
    `select table_name from information_schema.tables
     where table_schema = 'public' and table_type = 'BASE TABLE'
       and table_name not like 'payload\\_%' and table_name not like 'users%' order by 1`,
  )
  const vysledek: Record<string, number> = {}
  for (const { table_name } of rows) {
    const r = await pg.query<{ n: string }>(`select count(*)::text as n from "${table_name}"`)
    vysledek[table_name] = Number(r.rows[0].n)
  }
  return vysledek
}

/**
 * md5 všech cs řádků tabulky bez sloupce `id`, seřazeno podle `_parent_id`:
 * Payload při `update` (i s `publishSpecificLocale: 'de'`) cs řádek smaže
 * a vloží znovu s novým PK — obsah je týž, `id` ne (ověřeno: bez `id` shoda).
 */
const otiskyCs = async (pg: Pool): Promise<Record<string, string>> => {
  const vysledek: Record<string, string> = {}
  for (const tabulka of TABULKY_OTISKU) {
    const { rows } = await pg.query<{ otisk: string }>(
      `select md5(coalesce(string_agg((row_to_json(t)::jsonb - 'id')::text, '|' order by t._parent_id), '')) as otisk
       from "${tabulka}" t where t._locale = 'cs'`,
    )
    vysledek[tabulka] = rows[0].otisk
  }
  return vysledek
}

const verzniTabulka = (collection: Kolekce) => (collection === 'posts' ? '_posts_v' : '_pages_v')

const popisDokumentu = async (payload: Payload, pg: Pool, collection: Kolekce, slug: string): Promise<Dokument> => {
  const { docs } = await payload.find({
    collection,
    depth: 0,
    draft: false,
    limit: 1,
    locale: 'cs',
    overrideAccess: false,
    pagination: false,
    select: { slug: true, updatedAt: true },
    where: { slug: { equals: slug } },
  })
  const doc = docs[0]
  if (!doc) throw new Error(`Dev DB nemá publikovaný dokument ${collection}/${slug}`)
  const { totalDocs } = await payload.countVersions({ collection, where: { parent: { equals: doc.id } } })
  const { rows } = await pg.query<{ id: number }>(`select id from ${verzniTabulka(collection)} where parent_id = $1 and latest = true`, [
    doc.id,
  ])
  return {
    collection,
    id: doc.id,
    slug,
    updatedAt: doc.updatedAt,
    verzePred: totalDocs,
    latestPred: rows[0]?.id ?? null,
  }
}

/** Kopie hodnot bez `id` — Payload dá řádkům bloků/polí v de nové identifikátory (PK). */
const bezId = <T>(hodnota: T): T => {
  if (Array.isArray(hodnota)) return hodnota.map(bezId) as T
  if (hodnota && typeof hodnota === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(hodnota as Record<string, unknown>)) {
      if (k === 'id') continue
      out[k] = bezId(v)
    }
    return out as T
  }
  return hodnota
}

const prelozenoDe = async (payload: Payload, collection: Kolekce, slug: string): Promise<boolean> => {
  const { docs } = await payload.find({
    collection,
    depth: 0,
    draft: false,
    fallbackLocale: false,
    limit: 1,
    locale: 'all',
    overrideAccess: false,
    pagination: false,
    select: { prelozeno: true },
    where: { slug: { equals: slug } },
  })
  const mapa = (docs[0]?.prelozeno ?? {}) as unknown as Record<string, boolean>
  return mapa.de === true
}

export async function nastavit(payload: Payload): Promise<void> {
  const pg = pool(payload)
  if (fs.existsSync(STAV)) {
    const stav = JSON.parse(fs.readFileSync(STAV, 'utf8')) as Stav
    for (const d of stav.dokumenty) {
      if (!(await prelozenoDe(payload, d.collection, d.slug))) {
        throw new Error(`Stav z ${stav.start} existuje, ale ${d.collection}/${d.slug} nemá de překlad — spusť uklidit a znovu nastavit`)
      }
    }
    console.log(`Překlad už je nastavený (od ${stav.start}); nic se nemění.`)
    return
  }

  const de = await pocetDe(pg)
  if (Object.keys(de).length) {
    throw new Error(`Dev DB už má řádky _locale='de' (${JSON.stringify(de)}) — nejdřív je vyřeš ručně, test by je smazal.`)
  }
  if (await prelozenoDe(payload, 'posts', SLUG_NEPRELOZENY)) throw new Error(`${SLUG_NEPRELOZENY} má být nepřeložený`)

  const stav: Stav = {
    start: new Date().toISOString(),
    dokumenty: [
      await popisDokumentu(payload, pg, 'posts', SLUG_PRELOZENY),
      await popisDokumentu(payload, pg, 'pages', 'home'),
    ],
    radky: await pocetRadku(pg),
    hledani: Object.fromEntries(
      (await pg.query<{ id: number; updated_at: string }>('select id, updated_at from search')).rows.map((r) => [String(r.id), r.updated_at]),
    ),
    otisky: await otiskyCs(pg),
  }
  for (const d of stav.dokumenty) {
    if (d.verzePred > 45) throw new Error(`${d.collection}/${d.slug} má ${d.verzePred} verzí — u stropu maxPerDoc by test nevratně vytlačil nejstarší`)
  }
  fs.mkdirSync(path.dirname(STAV), { recursive: true })
  fs.writeFileSync(STAV, JSON.stringify(stav, null, 2))

  const [clanek, home] = stav.dokumenty
  // Článek: titulek, meta, příznak a KOPIE českého obsahu — `content` je
  // lokalizovaný a povinný (validace publikace), fallback při zápisu neplatí.
  // Tak vzniká i skutečný překlad: kopie originálu, kterou překladatel přepisuje.
  const csClanek = await payload.findByID({ collection: 'posts', id: clanek.id, depth: 0, locale: 'cs', overrideAccess: false })
  await payload.update({
    collection: 'posts',
    id: clanek.id,
    locale: 'de',
    draft: false,
    publishSpecificLocale: 'de',
    data: {
      title: DE_TITUL_CLANKU,
      content: csClanek.content,
      meta: { title: DE_TITUL_CLANKU, description: DE_POPIS },
      prelozeno: true,
    },
    context: { disableRevalidate: true },
  })

  // Home: `layout` je lokalizovaný a povinný, bez de hodnoty by publikace
  // neprošla validací — kopie českého hera a bloků (bez id), titulek de.
  const cs = await payload.findByID({ collection: 'pages', id: home.id, depth: 0, locale: 'cs', overrideAccess: false })
  await payload.update({
    collection: 'pages',
    id: home.id,
    locale: 'de',
    draft: false,
    publishSpecificLocale: 'de',
    data: {
      title: DE_TITUL_HOME,
      hero: bezId(cs.hero),
      layout: bezId(cs.layout),
      meta: { title: DE_TITUL_HOME, description: DE_POPIS },
      prelozeno: true,
    },
    context: { disableRevalidate: true },
  })

  for (const d of stav.dokumenty) {
    if (!(await prelozenoDe(payload, d.collection, d.slug))) throw new Error(`${d.collection}/${d.slug}: de překlad se nezapsal`)
  }
  console.log(`Nastaveno: de překlad ${SLUG_PRELOZENY} + home (stav ${STAV}); de řádky: ${JSON.stringify(await pocetDe(pg))}`)
}

export async function uklidit(payload: Payload): Promise<void> {
  const pg = pool(payload)
  if (!fs.existsSync(STAV)) {
    const de = await pocetDe(pg)
    if (Object.keys(de).length) throw new Error(`Bez stavu, ale DB má de řádky: ${JSON.stringify(de)}`)
    console.log('Nic k úklidu (žádný stav, žádné de řádky).')
    return
  }
  const stav = JSON.parse(fs.readFileSync(STAV, 'utf8')) as Stav
  const chyby: string[] = []

  for (const d of stav.dokumenty) {
    // Verze vzniklé testem (publikace + snapshot) — kaskádou i jejich locale řádky.
    await payload.db.deleteVersions({
      collection: d.collection,
      where: { and: [{ parent: { equals: d.id } }, { createdAt: { greater_than: stav.start } }] },
    })
    if (d.latestPred !== null) {
      await pg.query(`update ${verzniTabulka(d.collection)} set latest = true where id = $1`, [d.latestPred])
    }
    // Publikace přepsala `updated_at` hlavního řádku (viditelné jako „Aktualizováno“).
    await pg.query(`update ${d.collection} set updated_at = $1 where id = $2`, [d.updatedAt, d.id])
    const { totalDocs } = await payload.countVersions({ collection: d.collection, where: { parent: { equals: d.id } } })
    if (totalDocs !== d.verzePred) chyby.push(`${d.collection}/${d.slug}: verzí ${totalDocs}, před testem ${d.verzePred}`)
  }

  // Všechny de řádky (kolekce, bloky, pole, verze, index hledání).
  for (const { tabulka, sloupec } of await tabulkySJazykem(pg)) {
    await pg.query(`delete from "${tabulka}" where "${sloupec}" = 'de'`)
  }
  for (const [id, updatedAt] of Object.entries(stav.hledani ?? {})) {
    await pg.query('update search set updated_at = $1 where id = $2', [updatedAt, Number(id)])
  }

  for (const d of stav.dokumenty) {
    if (await prelozenoDe(payload, d.collection, d.slug)) chyby.push(`${d.collection}/${d.slug}: prelozeno.de stále true`)
  }
  const zbytek = await pocetDe(pg)
  if (Object.keys(zbytek).length) chyby.push(`zbylé de řádky: ${JSON.stringify(zbytek)}`)

  // Obsah cs řádků: publikace de nesmí přepsat češtinu (počty by to neprozradily).
  const otiskyTed = await otiskyCs(pg)
  for (const [tabulka, otisk] of Object.entries(stav.otisky ?? {})) {
    if (otiskyTed[tabulka] !== otisk) chyby.push(`${tabulka}: obsah cs řádků se liší od stavu před testem`)
  }

  // Tvrdé chyby: de data nebo cs obsah nejsou v pořádku → stav zůstává pro ruční zásah.
  if (chyby.length) throw new Error(`Úklid neúplný:\n- ${chyby.join('\n- ')}`)

  // Počty řádků obsahových tabulek: jen varování — jinou příčinou (ruční
  // úprava v adminu během běhu) by úklid uvázl a další `nastavit` odmítl start.
  const ted = await pocetRadku(pg)
  const rozdily = Object.keys({ ...stav.radky, ...ted })
    .filter((t) => stav.radky[t] !== ted[t])
    .map((t) => `${t}: ${stav.radky[t] ?? 0} → ${ted[t] ?? 0}`)
  fs.unlinkSync(STAV)
  if (rozdily.length) {
    console.warn(`VAROVÁNÍ: de data uklizena, ale počty řádků se liší od stavu před testem (${stav.start}): ${rozdily.join(', ')}`)
    return
  }
  console.log(
    `Uklizeno: verze i de řádky pryč, cs obsah i počty řádků obsahových tabulek shodné se stavem před testem (${stav.start}).`,
  )
}

export async function stav(payload: Payload): Promise<void> {
  const pg = pool(payload)
  console.log(fs.existsSync(STAV) ? `stav: ${fs.readFileSync(STAV, 'utf8')}` : 'stav: žádný')
  console.log(`de řádky: ${JSON.stringify(await pocetDe(pg))}`)
  for (const slug of [SLUG_PRELOZENY, SLUG_NEPRELOZENY]) console.log(`${slug}: prelozeno.de = ${await prelozenoDe(payload, 'posts', slug)}`)
  console.log(`home: prelozeno.de = ${await prelozenoDe(payload, 'pages', 'home')}`)
}

const prikaz = process.argv[2]
if (prikaz === 'nastavit' || prikaz === 'uklidit' || prikaz === 'stav') {
  const payload = await getPayload({ config })
  try {
    await ({ nastavit, uklidit, stav } as const)[prikaz](payload)
  } finally {
    await payload.destroy()
  }
} else if (prikaz) {
  console.error(`Neznámý příkaz „${prikaz}“ (nastavit | uklidit | stav)`)
  process.exit(1)
}
