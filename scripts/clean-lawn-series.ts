import { stopLegacyMagazineWrite } from './lib/legacy-magazine-source'
stopLegacyMagazineWrite()

/**
 * Úklid českých článků v LOKÁLNÍ databázi podle rozhodnutí autora 3. 10. 2026:
 * bez oddílu „Zdroje a metodika“, bez odkazů jinam a se střídáním stran
 * dvousloupců v průvodci půdou. Totéž dělají seedery (enrichLawnEvidence,
 * illustrateSoilGuide); tento skript srovná už uložené články.
 * Mění jen obsah češtiny přes publikujCs; je idempotentní.
 * Preview: node --import tsx scripts/clean-lawn-series.ts
 * Apply:   node --import tsx scripts/clean-lawn-series.ts --write
 */
import 'dotenv/config'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { stripExternalLinks, stripSources } from './lib/lawn-seo-evidence'
import { alternateSplitSides, cloneDocument } from './lib/lawn-series-helpers'
import { publikujCs } from './lib/publikuj-cs'

const database = new URL(process.env.DATABASE_URL || '')
if (!['localhost', '127.0.0.1', '[::1]'].includes(database.hostname) || database.pathname !== '/intelidome_web') {
  throw new Error('This revision is restricted to the local intelidome_web database')
}

const payload = await getPayload({ config })
let transactionID: Awaited<ReturnType<typeof payload.db.beginTransaction>> = null
try {
  const result = await payload.find({ collection: 'posts', pagination: false, depth: 0, locale: 'cs', draft: false })
  const plan = result.docs.flatMap((post) => {
    const cleaned = stripExternalLinks(stripSources(cloneDocument(post.content)))
    const content = post.slug === 'krasny-travnik-zacina-pod-zemi-2' ? alternateSplitSides(cleaned) : cleaned
    return JSON.stringify(content) === JSON.stringify(post.content) ? [] : [{ id: post.id, slug: post.slug, content }]
  })
  const output = await mkdtemp(path.join(tmpdir(), 'intelidome-clean-lawn-series-'))
  await writeFile(path.join(output, 'before.json'), JSON.stringify(result.docs.filter((post) => plan.some((item) => item.id === post.id)), null, 2))
  console.log(JSON.stringify({ mode: process.argv.includes('--write') ? 'write' : 'preview', backup: output, articles: plan.map((item) => item.slug) }, null, 2))
  if (process.argv.includes('--write') && plan.length) {
    transactionID = await payload.db.beginTransaction()
    if (!transactionID) throw new Error('A database transaction is required')
    const req = await createLocalReq({ locale: 'cs', context: { disableRevalidate: true }, req: { transactionID } }, payload)
    for (const item of plan) await publikujCs(payload, { collection: 'posts', id: item.id, data: { content: item.content }, req })
    await payload.db.commitTransaction(transactionID)
    transactionID = null
    console.log(`Cleaned ${plan.length} articles.`)
  }
} catch (error) {
  if (transactionID) await payload.db.rollbackTransaction(transactionID)
  throw error
} finally {
  await payload.destroy()
}
process.exit(0)
