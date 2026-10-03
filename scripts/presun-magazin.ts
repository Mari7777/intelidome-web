/**
 * Přepíše natvrdo zapsané odkazy na články z `/posts/…` na `/magazin/…`
 * v obsahu článků LOKÁLNÍ databáze (ADR-009 bod 7). Mění jen češtinu přes
 * publikujCs; ostatní jazyky odkazy nemají a skript to ověří. Idempotentní:
 * po obnovení starší verze článku nebo zálohy ho stačí pustit znovu.
 * Historie verzí `_posts_v` se nepřepisuje (auditní stopa).
 * Preview: node --import tsx scripts/presun-magazin.ts
 * Apply:   node --import tsx scripts/presun-magazin.ts --write
 */
import 'dotenv/config'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { cloneDocument } from './lib/lawn-series-helpers'
import { publikujCs } from './lib/publikuj-cs'

const database = new URL(process.env.DATABASE_URL || '')
if (!['localhost', '127.0.0.1', '[::1]'].includes(database.hostname) || database.pathname !== '/intelidome_web') {
  throw new Error('This rewrite is restricted to the local intelidome_web database')
}

type Pocty = { markdown: number; url: number; tlacitko: number }

/** JSON se seřazenými klíči a bez `id` bloků: verze nese tytéž hodnoty, ale vlastní id bloků. */
const kanonicky = (value: unknown): string =>
  JSON.stringify(value, (_k, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.keys(v).filter((k) => k !== 'id').sort().map((k) => [k, v[k]]))
      : v)

/** Přepíše odkazy v jednom dokumentu a spočítá je podle druhu (akceptační kontrola). */
function presunOdkazy(input: unknown): { content: ReturnType<typeof cloneDocument>; pocty: Pocty } {
  const pocty: Pocty = { markdown: 0, url: 0, tlacitko: 0 }
  const visit = (value: any, klic?: string): any => {
    if (typeof value === 'string') {
      let s = value.replace(/\]\(\/posts(?=[\/)#?])/g, () => (pocty.markdown++, '](/magazin'))
      if ((klic === 'url' || klic === 'buttonHref') && /^\/posts(\/|$)/.test(s)) {
        if (klic === 'url') pocty.url++
        else pocty.tlacitko++
        s = s.replace(/^\/posts/, '/magazin')
      }
      return s
    }
    if (Array.isArray(value)) return value.map((item) => visit(item))
    if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) value[key] = visit(value[key], key)
    }
    return value
  }
  const content = cloneDocument(input)
  content.root.children = visit(content.root.children)
  return { content, pocty }
}

{
  // Bez dev push schématu, jako seedery: skript nesmí měnit strukturu DB.
  const localConfig = await config
  if (localConfig.db) {
    localConfig.db = { ...localConfig.db, init: ((original) => (args) => {
      const adapter = original(args)
      ;(adapter as typeof adapter & { push?: boolean }).push = false
      return adapter
    })(localConfig.db.init) }
  }
  const payload = await getPayload({ config: localConfig })
  let transactionID: Awaited<ReturnType<typeof payload.db.beginTransaction>> = null
  try {
    const cs = await payload.find({ collection: 'posts', pagination: false, depth: 0, locale: 'cs', draft: false })
    const vse = await payload.find({ collection: 'posts', pagination: false, depth: 0, locale: 'all', fallbackLocale: false, draft: false })
    // Ostatní jazyky nesmí /posts obsahovat: zápis jde jen přes češtinu.
    for (const doc of vse.docs as any[]) {
      for (const [kod, obsah] of Object.entries(doc.content ?? {})) {
        if (kod !== 'cs' && JSON.stringify(obsah).includes('/posts/')) throw new Error(`Jazyk ${kod} článku ${doc.slug} obsahuje /posts/ – řešit zvlášť`)
      }
    }
    const plan = []
    for (const post of cs.docs) {
      const { content, pocty } = presunOdkazy(post.content)
      if (JSON.stringify(content).includes('/posts/')) throw new Error(`Po přepisu zůstal v ${post.slug} odkaz /posts/ v nečekaném kontextu`)
      const celkem = pocty.markdown + pocty.url + pocty.tlacitko
      if (!celkem) continue
      // Nejnovější verze se musí rovnat publikovanému obsahu, jinak by zápis přepsal koncept.
      const verze = await payload.findVersions({ collection: 'posts', where: { parent: { equals: post.id } }, sort: '-updatedAt', limit: 1, locale: 'cs', depth: 0 })
      const posledni = verze.docs[0]?.version as any
      if (posledni && kanonicky(posledni.content) !== kanonicky(post.content)) throw new Error(`Článek ${post.slug} má novější neuložený koncept`)
      plan.push({ id: post.id, slug: post.slug, pocty, celkem, content })
    }
    const souhrn = plan.reduce((a, p) => ({ markdown: a.markdown + p.pocty.markdown, url: a.url + p.pocty.url, tlacitko: a.tlacitko + p.pocty.tlacitko }), { markdown: 0, url: 0, tlacitko: 0 })
    // Záloha jen před skutečným zápisem a pod vlastním jménem: náhled ani další
    // běh nesmí přepsat stav před přesunem.
    const zalohy = path.resolve('zdroje-informaci/zalohy/presun-magazin')
    const zapis = process.argv.includes('--write') && plan.length > 0
    const soubor = path.join(zalohy, `pred-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
    if (zapis) {
      await mkdir(zalohy, { recursive: true })
      await writeFile(soubor, JSON.stringify(vse.docs, null, 2), { flag: 'wx' })
    }
    console.log(JSON.stringify({ mode: process.argv.includes('--write') ? 'write' : 'preview', ...(zapis ? { zaloha: soubor } : {}), souhrn, clanky: plan.map((p) => ({ slug: p.slug, ...p.pocty, celkem: p.celkem })) }, null, 2))
    if (zapis) {
      transactionID = await payload.db.beginTransaction()
      if (!transactionID) throw new Error('A database transaction is required')
      const req = await createLocalReq({ locale: 'cs', context: { disableRevalidate: true }, req: { transactionID } }, payload)
      for (const item of plan) await publikujCs(payload, { collection: 'posts', id: item.id, data: { content: item.content }, req })
      await payload.db.commitTransaction(transactionID)
      transactionID = null
      console.log(`Přepsáno ${plan.length} článků.`)
    }
  } catch (error) {
    if (transactionID) await payload.db.rollbackTransaction(transactionID)
    throw error
  } finally {
    await payload.destroy()
  }
  process.exit(0)
}
