// shot-series.mjs — série snímků celé stránky po obrazovkách (design-loop)
// node scripts/shot-series.mjs <url> <outdir> <prefix> [desktop|mobile] [sirka]
// Šířka platí jen pro desktop; bez ní se snímá na 1440 (ose mřížky).
// Široká okna (1990, 2560) mají vlastní pasti — snímej i je.
import { chromium, devices } from '@playwright/test'
import { mkdirSync } from 'fs'

const [, , url, outdir, prefix, mode = 'desktop', sirka = '1440'] = process.argv
const isMobile = mode === 'mobile'
mkdirSync(outdir, { recursive: true })
const browser = await chromium.launch()
const ctx = await browser.newContext(
  isMobile
    ? { ...devices['iPhone 14 Pro'] }
    : { viewport: { width: Number(sirka), height: 900 }, deviceScaleFactor: 1 },
)
const page = await ctx.newPage()
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
await page.waitForTimeout(2000)
// probuď lazy obsah a scroll-triggery, pak zpět nahoru
await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight
  for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)) }
  window.scrollTo(0, 0)
})
await page.waitForTimeout(1500)
const { vh, docH } = await page.evaluate(() => ({ vh: innerHeight, docH: document.documentElement.scrollHeight }))
const step = Math.round(vh * 0.9)
const n = Math.ceil((docH - vh) / step) + 1
const files = []
for (let i = 0; i < n; i++) {
  const y = Math.min(i * step, docH - vh)
  await page.evaluate((yy) => window.scrollTo(0, yy), y)
  await page.waitForTimeout(900)
  const f = `${outdir}/${prefix}-${String(i).padStart(2, '0')}.png`
  await page.screenshot({ path: f })
  files.push({ f, y })
}
console.log(JSON.stringify({ vh, docH, screens: n, files }, null, 1))
await browser.close()
