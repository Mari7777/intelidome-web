// svg-labels.mjs — přejímka popisků v kresbách: kolize a ořez na dané šířce
//   node scripts/svg-labels.mjs <url> [sirka=393] [dpr=3]
// Pro každý `.id-figure-svg svg` vypíše nejmenší vykreslený popisek,
// dvojice textů, jejichž rámce se protínají, a texty přesahující panel.
import { chromium } from '@playwright/test'
const [, , url, W = '393', D = '3'] = process.argv
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: Number(W), height: 852 }, deviceScaleFactor: Number(D) })
await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {})
await p.evaluate(async () => { const h = document.documentElement.scrollHeight
  for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)) } })
await p.waitForTimeout(800)
const out = await p.evaluate(() => {
  const res = []
  document.querySelectorAll('.id-figure-svg svg').forEach((svg, i) => {
    const panel = svg.closest('.id-figure-media')?.getBoundingClientRect() ?? svg.getBoundingClientRect()
    const cs = getComputedStyle(svg.closest('.id-figure-media') ?? svg)
    const padL = parseFloat(cs.paddingLeft) || 0, padR = parseFloat(cs.paddingRight) || 0
    const inner = { left: panel.left + padL, right: panel.right - padR }
    const texts = [...svg.querySelectorAll('text')].map((t) => {
      const r = t.getBoundingClientRect()
      const px = parseFloat(getComputedStyle(t).fontSize) * (r.height / Math.max(1, t.getBBox().height))
      return { s: t.textContent.trim(), l: r.left, r: r.right, t: r.top, b: r.bottom, px: Math.round(px * 10) / 10 }
    }).filter((t) => t.s)
    const min = Math.min(...texts.map((t) => t.px))
    const kolize = []
    for (let a = 0; a < texts.length; a++) for (let c = a + 1; c < texts.length; c++) {
      const A = texts[a], B = texts[c]
      const ox = Math.min(A.r, B.r) - Math.max(A.l, B.l), oy = Math.min(A.b, B.b) - Math.max(A.t, B.t)
      if (ox > 1 && oy > 1) kolize.push(`${A.s} × ${B.s} (${Math.round(ox)}×${Math.round(oy)} px)`)
    }
    const orez = texts.filter((t) => t.l < inner.left - 1 || t.r > inner.right + 1).map((t) => `${t.s} (${Math.round(t.l - inner.left)}..${Math.round(t.r - inner.right)})`)
    res.push({ kresba: i + 1, textu: texts.length, minPx: min, kolize, orez })
  })
  return res
})
for (const r of out) {
  const stav = r.kolize.length || r.orez.length ? 'CHYBA' : 'OK   '
  console.log(`${stav} kresba ${r.kresba}: ${r.textu} textů, min ${r.minPx} px, kolizí ${r.kolize.length}, ořezů ${r.orez.length}`)
  r.kolize.forEach((k) => console.log('      kolize: ' + k))
  r.orez.forEach((k) => console.log('      ořez:   ' + k))
}
await b.close()
