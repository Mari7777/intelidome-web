/**
 * Approved shortening and crosslinking of the four Czech lawn articles.
 * Preview: node --import tsx scripts/revise-lawn-series.ts
 * Apply:   node --import tsx scripts/revise-lawn-series.ts --write
 * Only content and relatedPosts change. All four updates share one transaction.
 */
import 'dotenv/config'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { LAWN_SERIES_SLUGS, reviseLawnArticle } from './lib/lawn-series-revision'
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
    limit: 4, depth: 0, locale: 'cs', draft: false,
  })
  const posts = LAWN_SERIES_SLUGS.map((slug) => {
    const found = result.docs.find((post) => post.slug === slug)
    if (!found || found._status !== 'published') throw new Error(`Missing published article ${slug}`)
    return found
  })
  const plan = posts.map((post, index) => {
    const slug = LAWN_SERIES_SLUGS[index]
    const content = reviseLawnArticle(slug, post.content)
    if (JSON.stringify(reviseLawnArticle(slug, content)) !== JSON.stringify(content)) {
      throw new Error(`Revision is not idempotent for ${slug}`)
    }
    const existingRelated = (post.relatedPosts ?? []).map((entry) => typeof entry === 'object' ? entry.id : entry)
    const relatedPosts = [...new Set([...existingRelated, ...posts.filter((other) => other.id !== post.id).map((other) => other.id)])]
    return { id: post.id, slug, content, relatedPosts }
  })
  const output = await mkdtemp(path.join(tmpdir(), 'intelidome-lawn-revision-'))
  await writeFile(path.join(output, 'before.json'), JSON.stringify(posts, null, 2))
  await writeFile(path.join(output, 'planned.json'), JSON.stringify(plan, null, 2))
  console.log(JSON.stringify({
    mode: process.argv.includes('--write') ? 'write' : 'preview', backup: output,
    articles: plan.map((item, index) => ({ slug: item.slug, beforeMinutes: readingTime(posts[index].content), afterMinutes: readingTime(item.content), relatedPosts: item.relatedPosts })),
  }, null, 2))
  if (process.argv.includes('--write')) {
    transactionID = await payload.db.beginTransaction()
    if (!transactionID) throw new Error('A database transaction is required')
    const req = await createLocalReq({ locale: 'cs', context: { disableRevalidate: true }, req: { transactionID } }, payload)
    for (const item of plan) {
      await publikujCs(payload, { collection: 'posts', id: item.id, data: { content: item.content, relatedPosts: item.relatedPosts }, req })
    }
    await payload.db.commitTransaction(transactionID)
    transactionID = null
    console.log('Updated all four articles and their related article links.')
  }
} catch (error) {
  if (transactionID) await payload.db.rollbackTransaction(transactionID)
  throw error
} finally {
  await payload.destroy()
}
process.exit(0)
