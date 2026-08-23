// layout-dna.mjs — kostra rozložení stránky v číslech.
// Kolik má stránka os zarovnání, kolik různých šířek modulů, jak se střídají.
//   node scripts/layout-dna.mjs <url> [sirka]
import { chromium } from '@playwright/test'

const [, , url, sirkaArg = '1440'] = process.argv
const W = Number(sirkaArg)
const b = await chromium.launch()
const c = await b.newContext({ viewport: { width: W, height: 900 }, deviceScaleFactor: 1 })
const p = await c.newPage()
try { await p.goto(url, { waitUntil: 'networkidle', timeout: 45000 }) } catch {}
await p.waitForTimeout(4000)
const txt = await p.evaluate(() => document.body.innerText.slice(0, 120))
if (/access denied|forbidden|captcha/i.test(txt)) { console.log(JSON.stringify({ blokovano: true })); await b.close(); process.exit(0) }
await p.evaluate(async () => {
  for (let k = 0; k < 2; k++) { const h = document.documentElement.scrollHeight
    for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 200)) } }
  window.scrollTo(0, 0)
})
await p.waitForTimeout(2000)

console.log(JSON.stringify(await p.evaluate((W) => {
  const snap = (n) => Math.round(n / 4) * 4
  const bloky = []
  const obrazy = []
  document.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.width < 120 || r.height < 40) return
    if (r.width > W + 4) return
    const cs = getComputedStyle(el)
    if (cs.display === 'inline' || cs.visibility === 'hidden' || cs.opacity === '0') return
    // jen prvky, které samy něco nesou (text nebo obraz), ne prázdné obaly
    const jeObraz = /^(img|picture|figure|video|svg|canvas)$/i.test(el.tagName) ||
      (cs.backgroundImage && cs.backgroundImage !== 'none')
    const maText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 20)
    if (!jeObraz && !maText) return
    const zaznam = { l: snap(r.left), r: snap(r.right), w: snap(r.width), t: Math.round(r.top + scrollY), el }
    bloky.push(zaznam)
    if (jeObraz && r.width > 200 && r.height > 120) obrazy.push(zaznam)
  })

  const hist = (pole, klic) => {
    const m = {}
    pole.forEach(x => { m[x[klic]] = (m[x[klic]] || 0) + 1 })
    return Object.entries(m).map(([v, n]) => [Number(v), n]).sort((a, b) => b[1] - a[1])
  }
  // osa = hodnota, na které leží aspoň 5 % bloků
  const prah = Math.max(2, Math.round(bloky.length * 0.05))
  const osyL = hist(bloky, 'l').filter(([, n]) => n >= prah)
  const osyR = hist(bloky, 'r').filter(([, n]) => n >= prah)
  const sirky = hist(bloky, 'w').filter(([, n]) => n >= prah)

  /*
    Vnořené obaly (figure > picture > img) jsou JEDEN obraz, ne tři.
    Bez téhle deduplikace vyjde střídavost nesmyslně nízká — jedna
    fotka se započítá jako „FFF“. (Chyba, kterou našla porota.)
  */
  const jedinecne = obrazy.filter((o) => !obrazy.some((j) => j !== o && j.el.contains(o.el)))
  obrazy.length = 0
  jedinecne.forEach((o) => obrazy.push(o))
  obrazy.sort((a, b) => a.t - b.t)
  const strany = obrazy.map(o => {
    const stred = (o.l + o.r) / 2
    if (o.w > W * 0.92) return 'F'
    return stred < W / 2 - W * 0.04 ? 'L' : stred > W / 2 + W * 0.04 ? 'R' : 'S'
  })
  let stridani = 0
  for (let i = 1; i < strany.length; i++) if (strany[i] !== strany[i - 1]) stridani++

  return {
    bloku: bloky.length,
    osyVlevo: osyL.slice(0, 8),
    osyVpravo: osyR.slice(0, 8),
    sirkyModulu: sirky.slice(0, 8),
    pocetOsiVlevo: osyL.length,
    pocetOsiVpravo: osyR.length,
    pocetSirek: sirky.length,
    obrazu: obrazy.length,
    obrazyPozice: obrazy.map((o) => ({ t: o.t, l: o.l, r: o.r })),
    stranyObrazu: strany.join(''),
    stridavost: strany.length > 1 ? +(stridani / (strany.length - 1)).toFixed(2) : null,
    vyska: document.documentElement.scrollHeight,
  }
}, W), null, 1))
await b.close()
