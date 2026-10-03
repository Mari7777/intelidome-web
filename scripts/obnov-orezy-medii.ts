/**
 * Přegeneruje ořezané varianty fotek (square, og) podle ohniska v LOKÁLNÍ
 * databázi. Seedery dřív měnily ohnisko prostým `payload.update`, které
 * varianty nepřegeneruje (viz scripts/lib/ohnisko-medii.ts), takže čtverce
 * v magazínu zůstaly oříznuté na střed (porota magazínu kola 01).
 * Bere média s ohniskem mimo střed; `OPRAVY` k tomu mění ohnisko tam, kde
 * staré čtverec nevystihlo. Před zápisem zálohuje dotčené varianty.
 * Preview: node --import tsx scripts/obnov-orezy-medii.ts
 * Apply:   node --import tsx scripts/obnov-orezy-medii.ts --write
 */
import 'dotenv/config'
import { copyFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { nastavOhnisko, type Ohnisko } from './lib/ohnisko-medii'

const database = new URL(process.env.DATABASE_URL || '')
if (!['localhost', '127.0.0.1', '[::1]'].includes(database.hostname) || database.pathname !== '/intelidome_web') {
  throw new Error('This script is restricted to the local intelidome_web database')
}

/** Nové ohnisko tam, kde staré čtverec nevystihlo (stejná čísla nese seeder článku). */
const OPRAVY: Record<string, Ohnisko> = {
  /* 85 začínalo výřez na zádech zahradníka; 66 vejde postava i rotavátor. */
  'hero-priprava-smesi-higgsfield.avif': { focalX: 66, focalY: 50 },
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

type Doc = {
  id: number
  filename: string
  mimeType?: string | null
  focalX?: number | null
  focalY?: number | null
  sizes?: Record<string, { filename?: string | null } | undefined>
}

try {
  const vse = await payload.find({ collection: 'media', depth: 0, pagination: false })
  const plan = (vse.docs as unknown as Doc[])
    .filter((d) => d.mimeType?.startsWith('image/') && !d.mimeType.includes('svg'))
    .map((d) => {
      const oprava = OPRAVY[d.filename]
      const focalX = oprava?.focalX ?? d.focalX ?? 50
      const focalY = oprava?.focalY ?? d.focalY ?? 50
      return { d, focalX, focalY, oprava: Boolean(oprava) }
    })
    .filter((p) => p.oprava || p.focalX !== 50 || p.focalY !== 50)

  const staticDir = path.resolve('public/media')
  let zaloha: string | undefined
  if (zapis) {
    zaloha = path.resolve('zdroje-informaci/zalohy/orezy-medii', `pred-${new Date().toISOString().replace(/[:.]/g, '-')}`)
    await mkdir(zaloha, { recursive: true })
    for (const { d } of plan) {
      for (const velikost of ['square', 'og']) {
        const soubor = d.sizes?.[velikost]?.filename
        if (soubor && existsSync(path.join(staticDir, soubor))) await copyFile(path.join(staticDir, soubor), path.join(zaloha, soubor))
      }
    }
    for (const { d, focalX, focalY } of plan) {
      await nastavOhnisko(payload, d.id, { focalX, focalY }, { vynutit: true })
    }
  }
  console.log(JSON.stringify({
    mode: zapis ? 'write' : 'preview',
    ...(zaloha ? { zaloha } : {}),
    media: plan.map((p) => ({ id: p.d.id, soubor: p.d.filename, ohnisko: `${p.focalX}/${p.focalY}`, ...(p.oprava ? { bylo: `${p.d.focalX}/${p.d.focalY}` } : {}) })),
  }, null, 2))
} finally {
  await payload.destroy()
}
process.exit(0)
