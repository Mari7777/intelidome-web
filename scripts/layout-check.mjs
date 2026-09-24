// layout-check.mjs — přejímka mřížky (ADR-006).
// Kontroluje to, co porota předepsala: počet os, zrcadlení, šířky modulů,
// jednorázové osy a střídání MIMOOSOVÝCH HMOT (ne jen obrazů).
//   node scripts/layout-check.mjs <url> [sirka]
import { chromium } from '@playwright/test'

const [, , url, sirkaArg = '1440'] = process.argv
const W = Number(sirkaArg)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: W, height: 900 } })
await p.goto(url, { waitUntil: 'networkidle', timeout: 45000 })
await p.evaluate(async () => {
  const h = document.documentElement.scrollHeight
  for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 160)) }
  window.scrollTo(0, 0)
})
await p.waitForTimeout(1500)

const d = await p.evaluate((W) => {
  const snap = (n) => Math.round(n / 4) * 4
  const clanek = document.querySelector('.id-article')
  if (!clanek) return { chyba: 'zadny .id-article' }

  // Přímé děti mřížky = moduly. Ty rozhodují o kompozici.
  const moduly = [...clanek.children].map((el) => {
    const r = el.getBoundingClientRect()
    return {
      l: snap(r.left), r: snap(r.right), w: snap(r.width),
      t: Math.round(r.top + scrollY), h: Math.round(r.height),
      jmeno: (el.className || el.tagName).toString().split(' ').filter(c => c.startsWith('id-')).join('.') || el.tagName.toLowerCase(),
    }
  }).filter((m) => m.h > 20)

  const hist = (klic) => {
    const m = {}
    moduly.forEach((x) => { m[x[klic]] = (m[x[klic]] || 0) + 1 })
    return Object.entries(m).map(([v, n]) => [Number(v), n]).sort((a, b) => b[1] - a[1])
  }
  const osyL = hist('l'), osyR = hist('r'), sirky = hist('w')

  // mimoosová hmota = střed se liší od středu stránky o víc než 3 %
  const stred = W / 2
  const mimo = moduly
    .filter((m) => Math.abs((m.l + m.r) / 2 - stred) > W * 0.03)
    .sort((a, b) => a.t - b.t)
    .map((m) => ({ ...m, strana: (m.l + m.r) / 2 < stred ? 'L' : 'R' }))
  let zmen = 0
  for (let i = 1; i < mimo.length; i++) if (mimo[i].strana !== mimo[i - 1].strana) zmen++

  // zrcadlení: každá levá osa má mít pravý protějšek se součtem W
  const zrcadla = osyL.map(([v]) => ({ osa: v, protejsek: W - v, existuje: osyR.some(([x]) => Math.abs(x - (W - v)) <= 4) }))

  return {
    modulu: moduly.length,
    osyVlevo: osyL, osyVpravo: osyR, sirky,
    jednorazoveOsy: [...osyL, ...osyR].filter(([, n]) => n === 1).map(([v]) => v),
    dominantniL: osyL[0] ? Math.round(100 * osyL[0][1] / moduly.length) : 0,
    dominantniR: osyR[0] ? Math.round(100 * osyR[0][1] / moduly.length) : 0,
    zrcadla,
    mimoosove: mimo.map((m) => `${m.strana} ${m.l}..${m.r} ${m.jmeno}`),
    // Když jsou moduly souměrné, střídání nese sazba UVNITŘ nich.
    // Kresba v patce kalkulátoru je taky strana obrazu (stojí vlevo) —
    // bez ní by přejímka neviděla dvě hmoty vlevo za sebou kolem pásu.
    // Mimoosové hmoty mimo splity: kresba patky kalkulátoru a obraz otevřeného
    // panelu karet složek (≥ 1130 px stojí vedle textu panelu).
    stranyDvousloupcu: [...clanek.querySelectorAll(innerWidth >= 1130 ? '.id-split, .id-profile-calc__mode-canvas, .id-ingredients__panel-slot.is-active .id-ingredients__panel-fig' : '.id-split')]
      .filter((s) => s.getBoundingClientRect().width > 0)
      .map((s) => {
        if (!s.classList.contains('id-split')) {
          const b = s.getBoundingClientRect()
          return b.left + b.width / 2 < innerWidth / 2 ? 'L' : 'R'
        }
        return s.classList.contains('id-split--right') ? 'R' : 'L'
      })
      .join(''),
    stridavost: mimo.length > 1 ? +(zmen / (mimo.length - 1)).toFixed(2) : null,
  }
}, W)

const zeleno = (ok) => (ok ? 'OK  ' : 'CHYBA')
if (d.chyba) { console.log(d.chyba); await b.close(); process.exit(1) }
console.log(`modulů: ${d.modulu}\n`)
console.log(`${zeleno(d.osyVlevo.length <= 4)} os vlevo: ${d.osyVlevo.length} (limit 4) — ${d.osyVlevo.map(([v, n]) => `${v}×${n}`).join(', ')}`)
console.log(`${zeleno(d.osyVpravo.length <= 4)} os vpravo: ${d.osyVpravo.length} (limit 4) — ${d.osyVpravo.map(([v, n]) => `${v}×${n}`).join(', ')}`)
console.log(`${zeleno(d.sirky.length <= 4)} šířek modulů: ${d.sirky.length} (limit 4) — ${d.sirky.map(([v, n]) => `${v}×${n}`).join(', ')}`)
console.log(`${zeleno(d.jednorazoveOsy.length === 0)} jednorázových os: ${d.jednorazoveOsy.length} ${d.jednorazoveOsy.join(', ')}`)
console.log(`${zeleno(d.zrcadla.every((z) => z.existuje))} zrcadlení os: ${d.zrcadla.map((z) => `${z.osa}→${z.protejsek}${z.existuje ? '' : ' CHYBÍ'}`).join(', ')}`)
// Bez mimoosových hmot (úzké obrazovky) není co střídat — to není chyba.
console.log(
  d.stridavost === null
    ? `OK   střídavost: neměří se (0–1 mimoosová hmota, vše na ose)`
    : `${zeleno(d.stridavost === 1)} střídavost mimoosových hmot: ${d.stridavost}`,
)
const sd = d.stranyDvousloupcu
// Pod 1130 px se dvousloupec skládá pod sebe — strany nejsou vidět.
if (W < 1130 && sd.length > 1) console.log('OK   střídání dvousloupců: neměří se (pod 1130 px složeno pod sebe)')
else if (sd.length > 1) {
  let z = 0
  for (let i = 1; i < sd.length; i++) if (sd[i] !== sd[i - 1]) z++
  const stridaSe = z === sd.length - 1
  console.log(`${zeleno(stridaSe)} střídání dvousloupců: ${sd.split('').join(' ')} ${stridaSe ? '' : '← dva stejné za sebou'}`)
}
console.log(`\nmimoosové hmoty shora dolů:`)
d.mimoosove.forEach((m) => console.log('   ' + m))
await b.close()
