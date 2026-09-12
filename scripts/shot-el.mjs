// shot-el.mjs — snímek jednoho prvku (design-loop, kontrola kresby/panelu)
//   node scripts/shot-el.mjs <url> <css-selektor> <out.png> [sirka] [dpr] [poradi]
import { chromium } from '@playwright/test'
const [, , url, sel, out, W = '1440', D = '2', nth = '0'] = process.argv
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: Number(W), height: 1000 }, deviceScaleFactor: Number(D) })
await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {})
await p.evaluate(async () => {
  const h = document.documentElement.scrollHeight
  for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)) }
})
await p.waitForTimeout(1200)
const els = await p.$$(sel)
const el = els[Number(nth)]
if (!el) { console.log('NENALEZENO', sel, nth, 'z', els.length); await b.close(); process.exit(1) }
await el.scrollIntoViewIfNeeded()
await p.waitForTimeout(600)
await el.screenshot({ path: out })
console.log('ok', out)
await b.close()
