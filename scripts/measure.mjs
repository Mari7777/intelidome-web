// measure.mjs — tvrdá čísla pro design-loop (gauntlet). Doplněk k shot.mjs.
// node measure.mjs <url> [desktop|mobile] [screenshot.png]
// Vypíše JSON: povrchové pásy, akcentový rozpočet, typografii, spacing mimo 8px, obraz, kontrast.
import { chromium, devices } from '@playwright/test'
import sharp from 'sharp'

const [, , url, mode = 'desktop', shotPath = ''] = process.argv
const isMobile = mode === 'mobile'
const browser = await chromium.launch()
const ctx = await browser.newContext(
  isMobile ? { ...devices['iPhone 14 Pro'] } : { viewport: { width: 1440, height: 900 } },
)
const page = await ctx.newPage()
await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {})
await page.waitForTimeout(2000)

const data = await page.evaluate(() => {
  const px = (v) => parseFloat(v) || 0
  const rgb = (s) => (s.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number)
  const lum = (c) =>
    c
      .map((v) => v / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0)
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return +((x + 0.05) / (y + 0.05)).toFixed(2)
  }
  const bgOf = (el) => {
    let n = el
    while (n && n !== document.documentElement) {
      const b = getComputedStyle(n).backgroundColor
      if (b && !/rgba\(0, 0, 0, 0\)|transparent/.test(b)) return b
      n = n.parentElement
    }
    return getComputedStyle(document.body).backgroundColor
  }
  const hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('')

  // 1) pásy povrchů: přímí potomci main/body s výškou > 200px
  const roots = [...document.querySelectorAll('main > *, body > section, main section')]
  const bands = roots
    .filter((e) => e.getBoundingClientRect().height > 200)
    .slice(0, 40)
    .map((e) => ({
      tag: e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).split(' ')[0] : ''),
      h: Math.round(e.getBoundingClientRect().height),
      bg: hex(rgb(bgOf(e))),
      padY: getComputedStyle(e).paddingTop + '/' + getComputedStyle(e).paddingBottom,
      borderTop: getComputedStyle(e).borderTopWidth,
    }))

  // 2) typografie
  const heads = [...document.querySelectorAll('h1,h2,h3,h4')].map((e) => ({
    t: e.tagName,
    size: Math.round(px(getComputedStyle(e).fontSize)),
    w: getComputedStyle(e).fontWeight,
    lh: (px(getComputedStyle(e).lineHeight) / px(getComputedStyle(e).fontSize)).toFixed(2),
    ls: getComputedStyle(e).letterSpacing,
    f: getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, ''),
    wrap: getComputedStyle(e).textWrap || getComputedStyle(e).textWrapStyle,
  }))
  const ps = [...document.querySelectorAll('p')].filter((e) => e.textContent.trim().length > 120)
  const prose = ps.slice(0, 6).map((e) => ({
    size: +px(getComputedStyle(e).fontSize).toFixed(1),
    lh: (px(getComputedStyle(e).lineHeight) / px(getComputedStyle(e).fontSize)).toFixed(2),
    w: Math.round(e.getBoundingClientRect().width),
    f: getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, ''),
    contrast: ratio(rgb(getComputedStyle(e).color), rgb(bgOf(e))),
    align: getComputedStyle(e).textAlign,
  }))

  // 3) spacing mimo 8px mřížku (jen padding/margin bloků > 200px)
  const offGrid = []
  roots.slice(0, 40).forEach((e) => {
    const s = getComputedStyle(e)
    ;['paddingTop', 'paddingBottom', 'marginTop', 'marginBottom'].forEach((k) => {
      const v = Math.round(px(s[k]))
      if (v > 0 && v % 8 !== 0 && v % 4 !== 0)
        offGrid.push(e.tagName.toLowerCase() + ' ' + k + '=' + v)
    })
  })

  // 4) obraz
  const imgs = [...document.querySelectorAll('img')].map((i) => ({
    src: (i.currentSrc || i.src).split('/').pop().slice(0, 40),
    alt: i.alt ? i.alt.slice(0, 40) : '(PRÁZDNÝ)',
    w: i.naturalWidth,
    lazy: i.loading,
    r: getComputedStyle(i).borderRadius,
  }))
  const svgCount = document.querySelectorAll('svg').length
  const figCount = document.querySelectorAll('figure').length
  const figcap = document.querySelectorAll('figcaption').length

  // 5) radiusy a hairliny
  const radii = [...new Set([...document.querySelectorAll('*')].map((e) => getComputedStyle(e).borderRadius).filter((r) => r && r !== '0px'))].slice(0, 12)

  // 6) tokeny
  const cs = getComputedStyle(document.documentElement)
  const tokens = ['--id-accent', '--id-cream', '--id-obsidian', '--id-bg-2', '--id-f-display'].map(
    (t) => t + '=' + (cs.getPropertyValue(t).trim() || 'CHYBÍ'),
  )

  return {
    scrollH: document.documentElement.scrollHeight,
    bands,
    surfaceShare: bands.reduce((a, b) => ((a[b.bg] = (a[b.bg] || 0) + b.h), a), {}),
    heads,
    prose,
    offGrid: [...new Set(offGrid)],
    imgs,
    svgCount,
    figCount,
    figcap,
    radii,
    tokens,
    fontsUsed: [...new Set([...document.querySelectorAll('h1,h2,h3,p,a,button')].map((e) => getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, '')))],
  }
})

// 7) akcentový rozpočet z pixelů prvního viewportu
let accent = null
if (shotPath) {
  await page.screenshot({ path: shotPath })
  const { data: buf, info } = await sharp(shotPath).raw().toBuffer({ resolveWithObject: true })
  const targets = { accentV2: [0x25, 0x63, 0xeb], accentV1: [0x00, 0x71, 0xe3] }
  const counts = { accentV2: 0, accentV1: 0 }
  const tot = info.width * info.height
  for (let i = 0; i < buf.length; i += info.channels) {
    for (const [k, t] of Object.entries(targets)) {
      if (
        Math.abs(buf[i] - t[0]) < 26 &&
        Math.abs(buf[i + 1] - t[1]) < 26 &&
        Math.abs(buf[i + 2] - t[2]) < 26
      )
        counts[k]++
    }
  }
  accent = {
    accentV2Pct: +((counts.accentV2 / tot) * 100).toFixed(2),
    accentV1Pct: +((counts.accentV1 / tot) * 100).toFixed(2),
  }
}

console.log(JSON.stringify({ url, mode, accent, ...data }, null, 1))
await browser.close()
