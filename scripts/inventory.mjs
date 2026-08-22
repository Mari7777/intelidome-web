// inventory.mjs — soupis sekcí článku pro design-loop (svislé hranice, výška, obsah)
// node scripts/inventory.mjs <url> [desktop|mobile]
import { chromium, devices } from '@playwright/test'

const [, , url, mode = 'desktop'] = process.argv
const isMobile = mode === 'mobile'
const browser = await chromium.launch()
const ctx = await browser.newContext(
  isMobile ? { ...devices['iPhone 14 Pro'] } : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
)
const page = await ctx.newPage()
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
await page.waitForTimeout(2000)
// odscrolluj celou stránku, ať se spustí lazy/scroll-trigger obsah
await page.evaluate(async () => {
  const h = document.documentElement.scrollHeight
  for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)) }
  window.scrollTo(0, 0)
})
await page.waitForTimeout(1200)

const data = await page.evaluate(() => {
  const vh = window.innerHeight
  const docH = document.documentElement.scrollHeight
  const sel = 'header.id-hero, article > *, .id-chapter, .id-figure, .id-stats, .id-faq, section, [data-block]'
  const seen = new Set()
  const rows = []
  document.querySelectorAll(sel).forEach((el) => {
    const r = el.getBoundingClientRect()
    const top = Math.round(r.top + window.scrollY)
    const h = Math.round(r.height)
    if (h < 40) return
    const key = `${top}:${h}`
    if (seen.has(key)) return
    seen.add(key)
    const heading = el.querySelector('h1,h2,h3')
    rows.push({
      tag: el.tagName.toLowerCase(),
      cls: (el.className || '').toString().slice(0, 70),
      top, h,
      bg: getComputedStyle(el).backgroundColor,
      head: heading ? heading.textContent.trim().slice(0, 60) : null,
      imgs: el.querySelectorAll('img,video').length,
    })
  })
  rows.sort((a, b) => a.top - b.top)
  const heads = [...document.querySelectorAll('h1,h2,h3')].map((e) => {
    const cs = getComputedStyle(e)
    return { t: e.tagName, txt: e.textContent.trim().slice(0, 48), size: cs.fontSize, w: cs.fontWeight, lh: cs.lineHeight, font: cs.fontFamily.split(',')[0] }
  })
  return { vh, docH, screens: (docH / vh).toFixed(1), rows, heads,
    imgs: document.querySelectorAll('img').length,
    videos: document.querySelectorAll('video').length,
    svg: document.querySelectorAll('svg').length,
    figs: document.querySelectorAll('figure').length,
    details: document.querySelectorAll('details').length,
    inputs: document.querySelectorAll('input,select,button').length,
  }
})
console.log(JSON.stringify(data, null, 1))
await browser.close()
