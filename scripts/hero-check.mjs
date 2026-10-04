// hero-check.mjs — přejímka art direction hera článku (DESIGN.md 9.1, v2.16).
// Měří, kam na obrazovce padne temeno postavy (vršek předmětu) vůči plovoucí
// kapsli: bod z tabulky PREDMET se přepočítá přes object-fit: cover a skutečné
// object-position, takže výsledek nezávisí na odhadu ze snímku.
//   node scripts/hero-check.mjs [slug,slug…] [--vse]
// Bez slugů projde všechny články z posts-sitemap; --vse přidá informativně
// okna na šířku (1024 × 768, 1440 × 900). Dev server na :3100 musí běžet.
import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:3100'
const argSlugy = process.argv.slice(2).find((a) => !a.startsWith('--'))
const vse = process.argv.includes('--vse')

// Vršek předmětu v souřadnicích ZDROJE (x %, y % šířky/výšky souboru). Nová
// fotka hera nebo ořez na výšku sem patří hned po nahrání; `zamerne` = předmět
// z rámu vychází úmyslně (násada rýče, postava bez hlavy) a neměří se.
const PREDMET = {
  'hero-zavlaha.avif': { x: 70, y: 14, co: 'vějíř trysky' },
  'hero-sonda-ryc.avif': { x: 50, y: 0, co: 'násada rýče', zamerne: true },
  'hero-sonda-ryc-portret.avif': { x: 30, y: 0, co: 'násada rýče', zamerne: true },
  'hero-primesi-ryc-v2.avif': { x: 66, y: 7, co: 'násada rýče' },
  'hero-primesi-portret.avif': { x: 50, y: 42, co: 'hromady' },
  'fig-dodavka-materialu.avif': { x: 27, y: 32, co: 'hromada písku' },
  'fig-dodavka-materialu-portret.avif': { x: 40, y: 35, co: 'hromada' },
  'hero-priprava-ukladani.avif': { x: 67.7, y: 23.7, co: 'temeno' },
  'hero-priprava-ukladani-portret.avif': { x: 60, y: 13.6, co: 'temeno' },
  'hero-zasit-travnik.avif': { x: 72, y: 25, co: 'tryska', zamerne: true },
  'hero-zasit-travnik-portret.avif': { x: 3, y: 29, co: 'tryska', zamerne: true },
  'hero-namichat-michani.avif': { x: 71.7, y: 4.6, co: 'temeno' },
  'hero-namichat-michani-portret-v2.avif': { x: 45, y: 18.7, co: 'temeno' },
  'hero-pece-prvni-pruh.avif': { x: 71.2, y: 9.9, co: 'temeno' },
  'hero-pece-prvni-pruh-portret-v2.avif': { x: 49, y: 35.8, co: 'temeno' },
}

// Okna, kde platí pravidlo 9.1 p. 4 (na výšku), a informativní okna na šířku.
const OKNA = [
  [600, 960], [768, 1024], [820, 1180], [1024, 1366], [375, 812], [393, 852],
  ...(vse ? [[1024, 768], [1440, 900]] : []),
]
const REZERVA = 24 // px pod spodní hranou kapsle

const browser = await chromium.launch()
let slugy = argSlugy?.split(',')
if (!slugy) {
  const p = await browser.newPage()
  const xml = await (await p.request.get(`${BASE}/posts-sitemap.xml`)).text()
  slugy = [...xml.matchAll(/<loc>[^<]*\/magazin\/([^<]+)<\/loc>/g)].map((m) => m[1])
  await p.close()
}

let chyb = 0
for (const [w, h] of OKNA) {
  const naVysku = h > w
  const ctx = await browser.newContext({ viewport: { width: w, height: h } })
  const page = await ctx.newPage()
  for (const slug of slugy) {
    await page.goto(`${BASE}/magazin/${slug}`, { waitUntil: 'load' })
    await page.waitForFunction(() => {
      const i = document.querySelector('.id-hero__img')
      return !document.querySelector('.id-hero') || (i && i.complete && i.naturalWidth > 0)
    })
    await page.waitForTimeout(1900) // kapsle vjíždí 0,95 s + 0,8 s
    const m = await page.evaluate(() => {
      const img = document.querySelector('.id-hero__img')
      if (!img) return null
      const b = img.getBoundingClientRect()
      const c = document.querySelector('.id-capsule').getBoundingClientRect()
      const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100)
      const soubor = (decodeURIComponent(img.currentSrc).match(/\/([^/?&]+?\.avif)(?:\?|$|&)/) || [])[1]
      return { soubor, nw: img.naturalWidth, nh: img.naturalHeight, b: [b.left, b.top, b.width, b.height], px, py,
        kapsle: [c.left, c.right, c.bottom], nadtitulek: document.querySelector('.id-hero__eyebrow').getBoundingClientRect().top }
    })
    if (!m) continue
    const [bl, bt, bw, bh] = m.b
    const s = Math.max(bw / m.nw, bh / m.nh)
    const ox = (bw - m.nw * s) * m.px
    const oy = (bh - m.nh * s) * m.py
    const bod = PREDMET[m.soubor]
    const okno = `${w}×${h}`.padEnd(10)
    if (!bod) {
      chyb++
      console.log(`${okno} ${slug}: ✗ ${m.soubor} chybí v tabulce PREDMET`)
      continue
    }
    const x = Math.round(bl + ox + (bod.x / 100) * m.nw * s)
    const y = Math.round(bt + oy + (bod.y / 100) * m.nh * s)
    const podKapsli = x >= m.kapsle[0] - 20 && x <= m.kapsle[1] + 20
    const mez = Math.round(podKapsli ? m.kapsle[2] + REZERVA : REZERVA)
    const ok = bod.zamerne || !naVysku || y >= mez
    if (!ok) chyb++
    const znak = bod.zamerne ? '·' : !naVysku ? 'i' : ok ? '✓' : '✗'
    console.log(`${okno} ${znak} ${slug.padEnd(42)} ${m.soubor.includes('-portret') ? 'ořez ' : 'master'} ${bod.co} y=${y} (mez ${mez}${podKapsli ? ', pod kapslí' : ''}) nadtitulek ${Math.round(m.nadtitulek)}`)
  }
  await ctx.close()
}
await browser.close()
console.log(chyb ? `\n${chyb} chyb` : '\nOK')
process.exit(chyb ? 1 : 0)
