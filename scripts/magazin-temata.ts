/**
 * Témata magazínu v LOKÁLNÍ databázi (DESIGN.md 8.5, ADR-009 dodatek): založí
 * dvě kategorie, přiřadí jim články a článku o návrhu závlahy doplní chybějící
 * meta obrázek (jeho hero). Články se zapisují jen česky přes publikujCs.
 * Idempotentní: zapisuje jen rozdíly. Článek zazimovani-zavlahy-krok-za-krokem
 * se záměrně NEMĚNÍ (o jeho osudu rozhoduje majitel).
 * Preview: node --import tsx scripts/magazin-temata.ts
 * Apply:   node --import tsx scripts/magazin-temata.ts --write
 */
import 'dotenv/config'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { publikujCs } from './lib/publikuj-cs'

const database = new URL(process.env.DATABASE_URL || '')
if (!['localhost', '127.0.0.1', '[::1]'].includes(database.hostname) || database.pathname !== '/intelidome_web') {
  throw new Error('This script is restricted to the local intelidome_web database')
}

const TEMATA = [
  {
    slug: 'puda-a-zalozeni-travniku',
    title: 'Půda a založení trávníku',
    serie: true,
    popis: 'Od první sondy rýčem po první sečení. Díly jdou v pořadí, v jakém na sebe práce na zahradě navazují.',
    clanky: [
      'krasny-travnik-zacina-pod-zemi-2',
      'pisek-biochar-a-dalsi-primesi',
      'jak-namichat-pudu-pro-travnik',
      'kalkulator-na-planovani-pudniho-profilu',
      'jak-pripravit-a-ulozit-smes',
      'jak-zasit-travnik',
      'pece-o-novy-travnik',
    ],
  },
  {
    slug: 'chytra-zavlaha',
    title: 'Chytrá závlaha',
    serie: false,
    popis: 'Jak navrhnout závlahu, která se řídí vlhkostí půdy, ne kalendářem.',
    clanky: ['jak-navrhnout-automatickou-zavlahu'],
  },
] as const
const DOPLNIT_META_OBRAZEK = ['jak-navrhnout-automatickou-zavlahu']

const localConfig = await config
if (localConfig.db) {
  localConfig.db = { ...localConfig.db, init: ((original) => (args) => {
    const adapter = original(args)
    ;(adapter as typeof adapter & { push?: boolean }).push = false
    return adapter
  })(localConfig.db.init) }
}
const payload = await getPayload({ config: localConfig })
const zapis = process.argv.includes('--write')
let transactionID: Awaited<ReturnType<typeof payload.db.beginTransaction>> = null
try {
  const kategorie = await payload.find({ collection: 'categories', locale: 'cs', depth: 0, pagination: false })
  const clanky = await payload.find({ collection: 'posts', locale: 'cs', depth: 0, pagination: false, draft: false })
  const idKat = (c: unknown) => (typeof c === 'object' && c ? (c as { id: number }).id : c)
  const plan = { kategorie: [] as string[], prirazeni: [] as string[], metaObrazek: [] as string[] }
  for (const tema of TEMATA) {
    const stavajici = kategorie.docs.find((k) => k.slug === tema.slug)
    if (!stavajici || stavajici.title !== tema.title || stavajici.popis !== tema.popis || Boolean(stavajici.serie) !== tema.serie) plan.kategorie.push(tema.slug)
    for (const slug of tema.clanky) {
      const clanek = clanky.docs.find((p) => p.slug === slug)
      if (!clanek) throw new Error(`Chybí článek ${slug}`)
      const ma = (clanek.categories ?? []).map(idKat)
      if (!stavajici || ma.length !== 1 || ma[0] !== stavajici.id) plan.prirazeni.push(slug)
    }
  }
  for (const slug of DOPLNIT_META_OBRAZEK) {
    const clanek = clanky.docs.find((p) => p.slug === slug)
    if (clanek && !clanek.meta?.image && clanek.heroImage) plan.metaObrazek.push(slug)
  }
  console.log(JSON.stringify({ mode: zapis ? 'write' : 'preview', plan }, null, 2))

  if (zapis && (plan.kategorie.length || plan.prirazeni.length || plan.metaObrazek.length)) {
    const zalohy = path.resolve('zdroje-informaci/zalohy/magazin-temata')
    await mkdir(zalohy, { recursive: true })
    await writeFile(path.join(zalohy, `pred-${new Date().toISOString().replace(/[:.]/g, '-')}.json`),
      JSON.stringify({ kategorie: kategorie.docs, clanky: clanky.docs.map((p) => ({ id: p.id, slug: p.slug, categories: p.categories, meta: p.meta })) }, null, 2), { flag: 'wx' })
    transactionID = await payload.db.beginTransaction()
    if (!transactionID) throw new Error('A database transaction is required')
    const req = await createLocalReq({ locale: 'cs', context: { disableRevalidate: true }, req: { transactionID } }, payload)
    const ids = new Map<string, number>()
    for (const tema of TEMATA) {
      const stavajici = kategorie.docs.find((k) => k.slug === tema.slug)
      const data = { title: tema.title, slug: tema.slug, popis: tema.popis, serie: tema.serie }
      const doc = stavajici
        ? await payload.update({ collection: 'categories', id: stavajici.id, locale: 'cs', data, req, context: { disableRevalidate: true } })
        : await payload.create({ collection: 'categories', locale: 'cs', data, req, context: { disableRevalidate: true } })
      ids.set(tema.slug, doc.id)
    }
    for (const tema of TEMATA) {
      for (const slug of tema.clanky) {
        if (!plan.prirazeni.includes(slug)) continue
        const clanek = clanky.docs.find((p) => p.slug === slug)!
        await publikujCs(payload, { collection: 'posts', id: clanek.id, data: { categories: [ids.get(tema.slug)!] }, req })
      }
    }
    for (const slug of plan.metaObrazek) {
      const clanek = clanky.docs.find((p) => p.slug === slug)!
      const hero = typeof clanek.heroImage === 'object' && clanek.heroImage ? clanek.heroImage.id : clanek.heroImage
      await publikujCs(payload, { collection: 'posts', id: clanek.id, data: { meta: { ...clanek.meta, image: hero } }, req })
    }
    await payload.db.commitTransaction(transactionID)
    transactionID = null
    console.log(`Hotovo: ${plan.kategorie.length} témat, ${plan.prirazeni.length} přiřazení, ${plan.metaObrazek.length} meta obrázků.`)
  }
} catch (error) {
  if (transactionID) await payload.db.rollbackTransaction(transactionID)
  throw error
} finally {
  await payload.destroy()
}
process.exit(0)
