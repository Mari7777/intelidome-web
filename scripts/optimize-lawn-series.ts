/**
 * Search metadata, evidence links and direct summaries for the five Czech lawn articles.
 * Preview: node --import tsx scripts/optimize-lawn-series.ts
 * Apply:   node --import tsx scripts/optimize-lawn-series.ts --write
 * Only content and meta title/description change. All five updates share one transaction.
 */
import 'dotenv/config'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { LAWN_SERIES_SLUGS } from './lib/lawn-series-revision'
import { LAWN_SEO, optimizeLawnArticle } from './lib/lawn-seo-content'
import { readingTime } from '../src/utilities/readingTime'
import { publikujCs } from './lib/publikuj-cs'

const database = new URL(process.env.DATABASE_URL || '')
if (!['localhost', '127.0.0.1', '[::1]'].includes(database.hostname) || database.pathname !== '/intelidome_web') {
  throw new Error('This revision is restricted to the local intelidome_web database')
}

const payload = await getPayload({ config })
let transactionID: Awaited<ReturnType<typeof payload.db.beginTransaction>> = null
try {
  const result = await payload.find({
    collection: 'posts', where: { slug: { in: LAWN_SERIES_SLUGS } },
    limit: LAWN_SERIES_SLUGS.length, depth: 0, locale: 'cs', draft: false,
  })
  const posts = LAWN_SERIES_SLUGS.map((slug) => {
    const found = result.docs.find((post) => post.slug === slug)
    if (!found || found._status !== 'published') throw new Error(`Missing published article ${slug}`)
    return found
  })
  const plan = posts.map((post, index) => {
    const slug = LAWN_SERIES_SLUGS[index]
    const content = optimizeLawnArticle(slug, post.content)
    if (JSON.stringify(optimizeLawnArticle(slug, content)) !== JSON.stringify(content)) {
      throw new Error(`Revision is not idempotent for ${slug}`)
    }
    const meta = { ...post.meta, ...LAWN_SEO[slug] }
    return { id: post.id, slug, content, meta }
  })
  const output = await mkdtemp(path.join(tmpdir(), 'intelidome-lawn-seo-'))
  await writeFile(path.join(output, 'before.json'), JSON.stringify(posts, null, 2))
  await writeFile(path.join(output, 'planned.json'), JSON.stringify(plan, null, 2))
  console.log(JSON.stringify({
    mode: process.argv.includes('--write') ? 'write' : 'preview', backup: output,
    articles: plan.map((item, index) => ({ slug: item.slug, beforeMinutes: readingTime(posts[index].content), afterMinutes: readingTime(item.content), meta: item.meta })),
  }, null, 2))
  if (process.argv.includes('--write')) {
    transactionID = await payload.db.beginTransaction()
    if (!transactionID) throw new Error('A database transaction is required')
    const req = await createLocalReq({ locale: 'cs', context: { disableRevalidate: true }, req: { transactionID } }, payload)
    for (const item of plan) {
      await publikujCs(payload, { collection: 'posts', id: item.id, data: { content: item.content, meta: item.meta }, req })
    }
    await payload.db.commitTransaction(transactionID)
    transactionID = null
    console.log('Updated SEO content and metadata for all five articles.')
  }
} catch (error) {
  if (transactionID) await payload.db.rollbackTransaction(transactionID)
  throw error
} finally {
  await payload.destroy()
}
process.exit(0)
