/**
 * Srovná úvodní fotku (heroImage) publikovaných článků podle
 * content/magazine.cs.json v LOKÁLNÍ databázi. seed-magazine hero existujících
 * článků úmyslně nemění (sdílené pole všech jazyků) a přepíše jen meta obrázek;
 * nová úvodní fotka se proto dostane do článku až tímto skriptem.
 * Preview: node --env-file=.env --import tsx scripts/nastav-hero-magazinu.ts
 * Apply:   node --env-file=.env --import tsx scripts/nastav-hero-magazinu.ts --write
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import source from './content/magazine.cs.json'
import { publikujCs } from './lib/publikuj-cs'

const database = new URL(process.env.DATABASE_URL || '')
if (!['localhost', '127.0.0.1', '[::1]'].includes(database.hostname) || database.pathname !== '/intelidome_web') {
  throw new Error('This script is restricted to the local intelidome_web database')
}

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

try {
  const media = await payload.find({ collection: 'media', depth: 0, pagination: false })
  const idPodleSouboru = new Map(media.docs.map((m) => [m.filename, m.id]))
  const plan: { slug: string; z: unknown; na: string }[] = []
  for (const clanek of source.articles) {
    const soubor = (clanek.heroImage as { mediaFilename?: string } | undefined)?.mediaFilename
    if (!soubor) continue
    const cil = idPodleSouboru.get(soubor)
    if (!cil) throw new Error(`Chybí médium ${soubor}`)
    const post = (await payload.find({ collection: 'posts', where: { slug: { equals: clanek.slug } }, limit: 1, depth: 0, draft: false, pagination: false })).docs[0]
    if (!post) throw new Error(`Chybí článek ${clanek.slug}`)
    if (post.heroImage === cil) continue
    plan.push({ slug: clanek.slug, z: post.heroImage, na: soubor })
    if (zapis) await publikujCs(payload, { collection: 'posts', id: post.id, data: { heroImage: cil } })
  }
  console.log(JSON.stringify({ mode: zapis ? 'write' : 'preview', plan }, null, 2))
} finally {
  await payload.destroy()
}
process.exit(0)
