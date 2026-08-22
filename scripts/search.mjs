import { chromium } from '@playwright/test'
const [,, query, out] = process.argv
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 2000 } })
await page.goto('https://styles.refero.design', { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {})
await page.waitForTimeout(1500)
const input = await page.$('input[type="search"], input[placeholder*="earch"], input[type="text"]')
if (!input) { console.log('NO_SEARCH_INPUT'); await page.screenshot({ path: out }); await browser.close(); process.exit(0) }
await input.fill(query)
await page.keyboard.press('Enter')
await page.waitForTimeout(3000)
await page.screenshot({ path: out })
const links = await page.$$eval('a[href*="/style/"]', as => [...new Set(as.map(a => (a.textContent||'').trim().slice(0,90) + ' :: ' + a.href))])
console.log(links.slice(0, 30).join('\n') || 'NO_RESULTS')
await browser.close()
