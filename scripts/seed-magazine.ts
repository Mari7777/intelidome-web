/**
 * Aktuální český redakční zdroj magazínu: content/magazine.cs.json.
 * Náhled: node --env-file=.env --import tsx scripts/seed-magazine.ts
 * Zápis:  node --env-file=.env --import tsx scripts/seed-magazine.ts --write
 * Pouze lokální DB; úplná záloha, kontrola konceptů a transakce všech článků.
 */
import { isDeepStrictEqual } from 'node:util'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import source from './content/magazine.cs.json'
import { publikujCs } from './lib/publikuj-cs'
import { readingTime } from '../src/utilities/readingTime'
import { LOCALES } from '../src/i18n/config'
import type { Post } from '../src/payload-types'

type RecordValue = Record<string, any>
const local = new URL(process.env.DATABASE_URL || '')
if (!['localhost', '127.0.0.1'].includes(local.hostname) || local.port !== '5433' || local.pathname !== '/intelidome_web' || process.env.BLOB_READ_WRITE_TOKEN) throw new Error('Pouze lokální intelidome_web na portu 5433 bez cloudového úložiště.')
// Obsahová změna nikdy nesmí spustit automatickou změnu DB schématu.
const cfg = await config
const init = cfg.db.init
cfg.db = { ...cfg.db, init: args => { const adapter = init(args); (adapter as typeof adapter & { push: boolean }).push = false; return adapter } }
const payload = await getPayload({ config: cfg })
let transactionID: Awaited<ReturnType<typeof payload.db.beginTransaction>> = null
const stripIDs = (value: any): any => Array.isArray(value) ? value.map(stripIDs) : value && typeof value === 'object'
  ? Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'id').map(([key, child]) => [key, stripIDs(child)])) : value
const substantive = (doc: RecordValue) => Object.fromEntries(Object.entries(doc).filter(([key]) => !['updatedAt', '_status'].includes(key)).map(([key, value]) => [key, key === 'content' ? stripIDs(value) : value]))
const stableRecords = (docs: RecordValue[]) => docs.map(doc => ({ ...doc, content: stripIDs(doc.content) }))
const localized = (doc: RecordValue, locale: string) => ({ title: doc.title?.[locale], content: doc.content?.[locale], prelozeno: doc.prelozeno?.[locale], meta: { title: doc.meta?.title?.[locale], description: doc.meta?.description?.[locale], image: doc.meta?.image?.[locale] } })
try {
  const [current, all, drafts, media, search] = await Promise.all([
    payload.find({ collection: 'posts', locale: 'cs', depth: 0, draft: false, pagination: false }),
    payload.find({ collection: 'posts', locale: 'all', fallbackLocale: false, depth: 0, draft: false, pagination: false }),
    payload.find({ collection: 'posts', locale: 'all', fallbackLocale: false, depth: 0, draft: true, pagination: false }),
    payload.find({ collection: 'media', depth: 0, pagination: false }),
    payload.find({ collection: 'search', locale: 'cs', fallbackLocale: false, depth: 0, pagination: false }),
  ])
  const mediaByName = new Map(media.docs.map(m => [m.filename, m.id]))
  const resolveMedia = (value: any): any => {
    if (Array.isArray(value)) return value.map(resolveMedia)
    if (value && typeof value === 'object') {
      if (typeof value.mediaFilename === 'string') {
        const id = mediaByName.get(value.mediaFilename)
        if (!id) throw new Error(`Chybí existující médium ${value.mediaFilename}`)
        return id
      }
      return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, resolveMedia(child)]))
    }
    return value
  }
  const managed = new Set([...source.articles.map(a => a.slug), source.archiveSlug])
  for (const doc of all.docs.filter(p => managed.has(p.slug))) {
    const draft = drafts.docs.find(p => p.id === doc.id)
    if (draft && !isDeepStrictEqual(substantive(doc), substantive(draft))) throw new Error(`Článek ${doc.slug} má odlišný rozpracovaný koncept. Nebyl změněn; nejprve jej redakčně slučte.`)
  }
  const plan = source.articles.map(article => {
    const existing = current.docs.find(p => p.slug === article.slug)
    const original = current.docs.find(p => p.slug === article.sourceSlug)
    if (!original) throw new Error(`Chybí zdrojový článek ${article.sourceSlug}`)
    return { ...article, content: resolveMedia(article.content) as Post['content'], heroImage: resolveMedia(article.heroImage) as number, existing, original }
  })
  const backup = await mkdtemp(path.join(tmpdir(), 'intelidome-magazine-'))
  await writeFile(path.join(backup, 'before.json'), JSON.stringify({ posts: all.docs, drafts: drafts.docs, search: search.docs }, null, 2))
  const report = { mode: process.argv.includes('--write') ? 'write' : 'preview', backup, articles: plan.map(a => ({ slug: a.slug, title: a.title, minutes: readingTime(a.content), action: a.existing ? 'update' : 'create' })), archive: source.archiveSlug }
  await writeFile(path.join(backup, 'plan.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
  if (process.argv.includes('--write')) {
    transactionID = await payload.db.beginTransaction({ isolationLevel: 'serializable' })
    if (!transactionID) throw new Error('Je vyžadována databázová transakce.')
    const req = await createLocalReq({ locale: 'cs', context: { disableRevalidate: true }, req: { transactionID } }, payload)
    // Detect edits since the read; do not publish an outdated plan over them.
    const latest = await payload.find({ collection: 'posts', locale: 'all', fallbackLocale: false, depth: 0, draft: false, pagination: false, req })
    const latestDrafts = await payload.find({ collection: 'posts', locale: 'all', fallbackLocale: false, depth: 0, draft: true, pagination: false, req })
    if (!isDeepStrictEqual(stableRecords(latest.docs), stableRecords(all.docs)) || !isDeepStrictEqual(stableRecords(latestDrafts.docs), stableRecords(drafts.docs))) throw new Error('Obsah se během přípravy změnil; spusťte nový náhled.')
    const ids = new Map(current.docs.map(p => [p.slug, p.id]))
    for (const item of plan.filter(a => !a.existing)) {
      const created = await payload.create({ collection: 'posts', locale: 'cs', depth: 0, draft: true, req,
        data: { slug: item.slug, generateSlug: false, title: item.title, content: item.content, heroImage: item.heroImage,
          meta: { ...item.meta, image: item.heroImage }, authors: item.original.authors, categories: item.original.categories,
          publishedAt: new Date().toISOString(), _status: 'draft' } })
      ids.set(item.slug, created.id)
    }
    for (const item of plan) {
      const relatedPosts = item.relatedSlugs.map(slug => { const id = ids.get(slug); if (!id) throw new Error(`Chybí navazující článek ${slug}`); return id })
      const old = item.existing
      const indexed = search.docs.find(row => row.doc.relationTo === 'posts' && row.doc.value === old?.id)
      const searchCurrent = indexed?.title === item.title && indexed?.slug === item.slug && indexed?.meta?.title === item.meta.title && indexed?.meta?.description === item.meta.description
      if (searchCurrent && old?._status === 'published' && old.title === item.title &&
          isDeepStrictEqual(stripIDs(old.content), stripIDs(item.content)) &&
          isDeepStrictEqual(old.relatedPosts, relatedPosts) && old.meta?.title === item.meta.title &&
          old.meta?.description === item.meta.description && old.meta?.image === item.heroImage) continue
      // A draft creation and its publication share this transaction request.
      // Reset only this document's deduplication key so the plugin indexes the published version.
      ;(req.context.syncedDocsSet as Set<string> | undefined)?.delete(`posts:${ids.get(item.slug)}:cs`)
      await publikujCs(payload, { collection: 'posts', id: ids.get(item.slug)!, req, data: {
        title: item.title, content: item.content, relatedPosts, meta: { ...item.meta, image: item.heroImage },
        // Existing shared fields (hero, categories, authors, slug) stay untouched.
      } })
    }
    const archived = current.docs.find(p => p.slug === source.archiveSlug)
    if (archived?._status === 'published') {
      const localizedBefore = all.docs.find(p => p.id === archived.id) as unknown as RecordValue
      if (LOCALES.some(l => l !== 'cs' && localizedBefore.prelozeno?.[l])) throw new Error('Starý článek má veřejný překlad; nelze jej celý archivovat.')
      await payload.update({ collection: 'posts', id: archived.id, locale: 'cs', depth: 0, draft: false, req, data: { _status: 'draft' }, context: { disableRevalidate: true } })
    }
    const after = await payload.find({ collection: 'posts', locale: 'all', fallbackLocale: false, depth: 0, draft: false, pagination: false, req })
    for (const before of all.docs) {
      const saved = after.docs.find(p => p.id === before.id) as unknown as RecordValue
      if (!saved) throw new Error(`Původní článek ${before.id} zmizel`)
      for (const locale of LOCALES.filter(l => l !== 'cs')) if (!isDeepStrictEqual(localized(before, locale), localized(saved, locale))) throw new Error(`Nečekaná změna jazyka ${locale} u článku ${before.id}`)
      if (before.slug === source.archiveSlug && !isDeepStrictEqual(substantive(before), substantive(saved))) throw new Error('Archivace změnila původní obsah')
    }
    for (const item of plan) {
      const saved = after.docs.find(p => p.slug === item.slug) as unknown as RecordValue
      if (!saved || saved._status !== 'published' || saved.title.cs !== item.title || !isDeepStrictEqual(stripIDs(saved.content.cs), stripIDs(item.content))) throw new Error(`Kontrola publikovaného obsahu selhala: ${item.slug}`)
    }
    const active = after.docs.filter(p => managed.has(p.slug) && p._status === 'published')
    if (active.length !== source.articles.length) throw new Error('Nesouhlasí počet publikovaných článků.')
    // The search plugin logs errors instead of throwing; verify its actual result before commit.
    const indexedAfter = await payload.find({ collection: 'search', locale: 'cs', fallbackLocale: false, depth: 0, pagination: false, req })
    for (const item of plan) {
      const rows = indexedAfter.docs.filter(row => row.doc.relationTo === 'posts' && row.doc.value === ids.get(item.slug))
      if (rows.length !== 1 || rows[0].slug !== item.slug || rows[0].title !== item.title || rows[0].meta?.title !== item.meta.title || rows[0].meta?.description !== item.meta.description) throw new Error(`Vyhledávání neodpovídá článku ${item.slug}`)
    }
    if (indexedAfter.docs.some(row => row.slug === source.archiveSlug)) throw new Error('Archivovaný článek zůstal ve vyhledávání.')
    await payload.db.commitTransaction(transactionID); transactionID = null
    const committed = await payload.find({ collection: 'posts', locale: 'all', fallbackLocale: false, depth: 0, draft: false, pagination: false })
    if (!isDeepStrictEqual(stableRecords(committed.docs), stableRecords(after.docs))) throw new Error(`Stav po commitu neodpovídá ověřené transakci. Zkontrolujte zálohu ${backup}; automatický opakovaný zápis neproběhl.`)
    await writeFile(path.join(backup, 'after.json'), JSON.stringify(committed.docs, null, 2))
    console.log(`Hotovo: ${active.length} českých článků; původní krátký článek uchován jako koncept. Záloha: ${backup}`)
  }
} catch (error) {
  if (transactionID) await payload.db.rollbackTransaction(transactionID)
  throw error
} finally { await payload.destroy() }
process.exit(0)
