// shot.mjs — srovnávací snímky pro design-loop (gauntlet)
// Použití:
//   node shot.mjs <url> <out.png> [desktop|mobile] [scrolls] [full]
// Příklady:
//   node shot.mjs http://localhost:3100/posts/hydraulika-zahrady out/nas-d-00.png desktop 0
//   node shot.mjs https://www.sonos.com out/sonos-m-02.png mobile 2
//   node shot.mjs http://localhost:3100/posts/x out/nas-full.png desktop 0 full
import { chromium, devices } from '@playwright/test'

const [, , url, out, mode = 'desktop', scrolls = '0', full = ''] = process.argv
const isMobile = mode === 'mobile'
const browser = await chromium.launch()
const ctx = await browser.newContext(
  isMobile
    ? { ...devices['iPhone 14 Pro'] } // 393x852 @3x, touch, mobilní UA
    : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
)
const page = await ctx.newPage()
await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {})
await page.waitForTimeout(2500)
// zabij cookie lišty (zlatý standard je má) — jen skryj, neklikej
await page
  .addStyleTag({
    content:
      '[id*="onetrust" i],[class*="cookie" i],[id*="cookie" i],[class*="consent" i]{display:none !important}',
  })
  .catch(() => {})
const step = isMobile ? 700 : 860
for (let i = 0; i < Number(scrolls); i++) {
  await page.mouse.wheel(0, step)
  await page.waitForTimeout(1200)
}
await page.screenshot({ path: out, fullPage: full === 'full' })
const m = await page.evaluate(() => ({
  h: document.documentElement.scrollHeight,
  imgs: document.querySelectorAll('img,picture source,video').length,
  svg: document.querySelectorAll('svg').length,
  h1: [...document.querySelectorAll('h1')].map((e) => e.textContent.trim().slice(0, 60)),
  fonts: [...new Set([...document.querySelectorAll('h1,h2,h3,p')].map((e) => getComputedStyle(e).fontFamily.split(',')[0]))],
}))
console.log(JSON.stringify({ out, mode, ...m }))
await browser.close()
