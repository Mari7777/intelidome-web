import { chromium } from '@playwright/test'
const [,, url, out, scrolls = '0'] = process.argv
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 2400 } })
await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {})
await page.waitForTimeout(2500)
for (let i = 0; i < Number(scrolls); i++) {
  await page.mouse.wheel(0, 2200)
  await page.waitForTimeout(1200)
}
await page.screenshot({ path: out })
// vypiš odkazy na karty
const links = await page.$$eval('a[href]', as => as.map(a => a.href + ' | ' + (a.textContent||'').trim().slice(0,80)).filter(x => !x.startsWith('javascript')))
console.log(links.slice(0, 80).join('\n'))
await browser.close()
