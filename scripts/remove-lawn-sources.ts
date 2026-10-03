/**
 * Odstraní oddíl „Zdroje a metodika“ ze všech českých článků v LOKÁLNÍ databázi
 * (rozhodnutí autora 3. 10. 2026). Mění jen obsah češtiny přes publikujCs.
 * Preview: node --import tsx scripts/remove-lawn-sources.ts
 * Apply:   node --import tsx scripts/remove-lawn-sources.ts --write
 */
import 'dotenv/config'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { stripSources } from './lib/lawn-seo-evidence'
import { cloneDocument } from './lib/lawn-series-helpers'
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
    const content = stripSources(cloneDocument(post.content))
    return JSON.stringify(content) === JSON.stringify(post.content) ? [] : [{ id: post.id, slug: post.slug, content }]
  })
  const output = await mkdtemp(path.join(tmpdir(), 'intelidome-remove-sources-'))
  await writeFile(path.join(output, 'before.json'), JSON.stringify(result.docs.filter((post) => plan.some((item) => item.id === post.id)), null, 2))
  console.log(JSON.stringify({ mode: process.argv.includes('--write') ? 'write' : 'preview', backup: output, articles: plan.map((item) => item.slug) }, null, 2))
  if (process.argv.includes('--write') && plan.length) {
    transactionID = await payload.db.beginTransaction()
    if (!transactionID) throw new Error('A database transaction is required')
    const req = await createLocalReq({ locale: 'cs', context: { disableRevalidate: true }, req: { transactionID } }, payload)
    for (const item of plan) await publikujCs(payload, { collection: 'posts', id: item.id, data: { content: item.content }, req })
    await payload.db.commitTransaction(transactionID)
    transactionID = null
    console.log(`Removed the sources section from ${plan.length} articles.`)
  }
} catch (error) {
  if (transactionID) await payload.db.rollbackTransaction(transactionID)
  throw error
} finally {
  await payload.destroy()
}
process.exit(0)
