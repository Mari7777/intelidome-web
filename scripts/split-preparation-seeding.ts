import { stopLegacyMagazineWrite } from './lib/legacy-magazine-source'
stopLegacyMagazineWrite()

/**
 * Split the current Czech article in the local CMS without rebuilding its authored text.
 * Preview: node --import tsx scripts/split-preparation-seeding.ts
 * Apply:   node --import tsx scripts/split-preparation-seeding.ts --write
 * Back up all locales and commit the two articles and incoming links in one transaction.
 */
import 'dotenv/config'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import type { Post } from '../src/payload-types'
import { readingTime } from '../src/utilities/readingTime'
import { publikujCs } from './lib/publikuj-cs'
import { optimizeLawnArticle } from './lib/lawn-seo-content'
import type { ArticleDocument } from './lib/lawn-series-helpers'
import {
  PREPARATION_SLUG, PREPARATION_TITLE, PREPARATION_META,
  SEEDING_SLUG, SEEDING_TITLE, SEEDING_META,
  splitPreparationAndSeeding, rewritePreparationLinks,
} from './lib/split-preparation-seeding'

const database = new URL(process.env.DATABASE_URL || '')
if (!['localhost', '127.0.0.1', '[::1]'].includes(database.hostname) || database.pathname !== '/intelidome_web') {
  throw new Error('This split is restricted to the local intelidome_web database')
}
const seriesSlugs = [
  'krasny-travnik-zacina-pod-zemi-2', 'pisek-biochar-a-dalsi-primesi',
  'kalkulator-na-planovani-pudniho-profilu', PREPARATION_SLUG,
]
const relationIDs = (values: Post['relatedPosts']) => (values ?? []).map((value) => typeof value === 'object' ? value.id : value)
const payload = await getPayload({ config })
let transactionID: Awaited<ReturnType<typeof payload.db.beginTransaction>> = null
try {
  const result = await payload.find({ collection: 'posts', pagination: false, depth: 0, locale: 'cs', draft: false })
  const posts = result.docs
  const source = posts.find((post) => post.slug === PREPARATION_SLUG)
  if (!source || source._status !== 'published') throw new Error('Missing published preparation article')
  if (posts.some((post) => post.slug === SEEDING_SLUG)) {
    throw new Error('The seeding article already exists; do not overwrite later editorial work with this one-time split')
  }
  const separated = splitPreparationAndSeeding(source.content)
  const preparation: ArticleDocument = optimizeLawnArticle(PREPARATION_SLUG, separated.preparation)
  const seeding: ArticleDocument = optimizeLawnArticle(SEEDING_SLUG, separated.seeding)
  const hero = preparation.root.children.find((node) => node.fields?.blockType === 'figure')?.fields.image
  if (typeof hero !== 'number') throw new Error('Expected the existing prepared seedbed photograph for the seeding hero')
  const incoming = posts.filter((post) => post.id !== source.id).map((post) => ({
    post, content: rewritePreparationLinks(post.content),
  })).filter(({ post, content }) => JSON.stringify(content) !== JSON.stringify(post.content))
  const affected = posts.filter((post) => seriesSlugs.includes(post.slug!) || incoming.some((item) => item.post.id === post.id))
  const allLocales = await payload.find({
    collection: 'posts', where: { id: { in: affected.map((post) => post.id) } },
    pagination: false, depth: 0, locale: 'all', fallbackLocale: false, draft: false,
  })
  const output = await mkdtemp(path.join(tmpdir(), 'intelidome-preparation-seeding-'))
  await writeFile(path.join(output, 'before-all-locales.json'), JSON.stringify(allLocales.docs, null, 2))
  await writeFile(path.join(output, 'before-cs.json'), JSON.stringify(affected, null, 2))
  await writeFile(path.join(output, 'planned.json'), JSON.stringify({
    preparation: { id: source.id, title: PREPARATION_TITLE, slug: PREPARATION_SLUG, content: preparation, meta: PREPARATION_META },
    seeding: { title: SEEDING_TITLE, slug: SEEDING_SLUG, heroImage: hero, content: seeding, meta: SEEDING_META },
    incoming: incoming.map(({ post, content }) => ({ id: post.id, slug: post.slug, content })),
  }, null, 2))
  console.log(JSON.stringify({ mode: process.argv.includes('--write') ? 'write' : 'preview', backup: output,
    articles: [
      { slug: PREPARATION_SLUG, title: PREPARATION_TITLE, minutes: readingTime(preparation) },
      { slug: SEEDING_SLUG, title: SEEDING_TITLE, minutes: readingTime(seeding), heroImage: hero },
    ], incomingLinks: incoming.map(({ post }) => post.slug),
  }, null, 2))
  if (process.argv.includes('--write')) {
    transactionID = await payload.db.beginTransaction()
    if (!transactionID) throw new Error('A database transaction is required')
    const req = await createLocalReq({ locale: 'cs', context: { disableRevalidate: true }, req: { transactionID } }, payload)
    const seedingPost = await payload.create({ collection: 'posts', locale: 'cs', depth: 0, draft: false, req,
      context: { disableRevalidate: true },
      data: {
        title: SEEDING_TITLE, slug: SEEDING_SLUG, generateSlug: false, _status: 'published',
        content: seeding, heroImage: hero, meta: { ...SEEDING_META, image: hero },
        publishedAt: new Date().toISOString(),
        authors: source.authors?.map((author) => typeof author === 'object' ? author.id : author),
        categories: source.categories?.map((category) => typeof category === 'object' ? category.id : category),
      },
    })
    // The self-exclusion filter requires the new document ID before relationships can be set.
    await publikujCs(payload, { collection: 'posts', id: seedingPost.id, req, data: {
      relatedPosts: [source.id, ...relationIDs(source.relatedPosts)],
    } })
    await publikujCs(payload, { collection: 'posts', id: source.id, req, data: {
      title: PREPARATION_TITLE, content: preparation, meta: { ...source.meta, ...PREPARATION_META },
      relatedPosts: [seedingPost.id, ...relationIDs(source.relatedPosts)],
    } })
    for (const post of affected.filter((post) => post.id !== source.id)) {
      const content = incoming.find((item) => item.post.id === post.id)?.content
      const relatedPosts = seriesSlugs.includes(post.slug!)
        ? [...new Set([...relationIDs(post.relatedPosts), seedingPost.id])] : undefined
      if (content || relatedPosts) await publikujCs(payload, { collection: 'posts', id: post.id, req,
        data: { ...(content ? { content } : {}), ...(relatedPosts ? { relatedPosts } : {}) },
      })
    }
    // Localized text for other languages must stay byte-identical within the transaction.
    const after = await payload.find({ collection: 'posts', where: { id: { in: affected.map((post) => post.id) } },
      pagination: false, locale: 'all', fallbackLocale: false, depth: 0, draft: false, req,
    })
    for (const before of allLocales.docs) {
      const updated = after.docs.find((post) => post.id === before.id)
      const localizedText = (doc: any) => {
        const fields = { title: doc.title, content: doc.content, metaTitle: doc.meta?.title, metaDescription: doc.meta?.description, prelozeno: doc.prelozeno }
        return Object.fromEntries(Object.entries(fields).map(([key, values]) => [key,
          Object.fromEntries(Object.entries(values ?? {}).filter(([locale]) => locale !== 'cs')),
        ]))
      }
      if (!updated || JSON.stringify(localizedText(before)) !== JSON.stringify(localizedText(updated))) {
        throw new Error(`Other localized text changed for ${before.slug}`)
      }
    }
    await payload.db.commitTransaction(transactionID)
    transactionID = null
    await writeFile(path.join(output, 'result.json'), JSON.stringify({ preparationID: source.id, seedingID: seedingPost.id, changedPosts: affected.map((post) => post.id) }, null, 2))
    console.log(`Split saved. Preparation ID ${source.id}; seeding ID ${seedingPost.id}. Other localized text unchanged.`)
  }
} catch (error) {
  if (transactionID) await payload.db.rollbackTransaction(transactionID)
  throw error
} finally {
  await payload.destroy()
}
process.exit(0)
