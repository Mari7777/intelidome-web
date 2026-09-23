// svg-preview.mjs — rasterizuje SVG figuru z .tsx souboru, aby ji šlo vidět
// bez spuštění celé aplikace.
//   node scripts/svg-preview.mjs src/components/figures/Neco.tsx out.png [light|dark]
import { chromium } from '@playwright/test'
import { readFileSync, writeFileSync } from 'fs'

const [, , src, out, mode = 'light'] = process.argv
const code = readFileSync(src, 'utf8')

const start = code.indexOf('<svg')
const end = code.lastIndexOf('</svg>')
if (start === -1 || end === -1) throw new Error('V souboru není <svg> … </svg>')
let svg = code.slice(start, end + 6)

// JSX → SVG: camelCase atributy na pomlčkové, className na class,
// {' '} a JSX komentáře pryč, {"..."} na "...".
svg = svg
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  .replace(/\{'\s*'\}/g, ' ')
  .replace(/=\{"([^"]*)"\}/g, '="$1"')
  .replace(/=\{'([^']*)'\}/g, '="$1"')
  .replace(/\bclassName=/g, 'class=')
  .replace(/\b(strokeWidth|strokeLinecap|strokeLinejoin|strokeDasharray|strokeDashoffset|strokeOpacity|strokeMiterlimit|fillOpacity|fillRule|clipPath|clipRule|stopColor|stopOpacity|textAnchor|dominantBaseline|letterSpacing|fontFamily|fontSize|fontWeight|markerEnd|markerStart|gradientUnits|gradientTransform|patternUnits|maskUnits|repeatCount|keyTimes|keySplines|calcMode|attributeName|xlinkHref|preserveAspectRatio|shapeRendering|vectorEffect|paintOrder|transformOrigin)=/g,
    (m, a) => a.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()) + '=')
  .replace(/\bxlink-href=/g, 'xlink:href=')

const bg = mode === 'dark' ? '#0b0d10' : '#f6f5f2'
const html = `<!doctype html><meta charset="utf-8"><style>
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@500..700&display=swap');
  :root{--id-ink:#1d1d1f;--id-ink-2:#595650;--id-ink-3:#716e68;--id-cream:#f6f5f2;
        --id-bg:#fff;--id-obsidian:#0b0d10;--id-accent:#2563eb;--id-accent-tint:#93c5fd}
  body{margin:0;background:${bg};padding:40px;font-family:Archivo,sans-serif}
  svg{display:block;width:100%;height:auto}
  .sv-lbl{font-family:Archivo,sans-serif;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;fill:${mode === 'dark' ? '#9ba1a8' : '#595650'}}
  .sv-val{font-family:Archivo,sans-serif;font-size:15px;font-weight:600;letter-spacing:-.01em;font-variant-numeric:tabular-nums;fill:${mode === 'dark' ? '#ffffff' : '#1d1d1f'}}
</style>${svg}`

writeFileSync(out.replace(/\.png$/, '.html'), html)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1160, height: 560 }, deviceScaleFactor: 2 })
const errs = []
p.on('pageerror', (e) => errs.push(String(e)))
await p.setContent(html, { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
const box = await p.evaluate(() => {
  const s = document.querySelector('svg')
  if (!s) return null
  const r = s.getBoundingClientRect()
  return { w: Math.round(r.width), h: Math.round(r.height), viewBox: s.getAttribute('viewBox'), nodes: s.querySelectorAll('*').length, smil: s.querySelectorAll('animate,animateTransform,animateMotion').length }
})
await p.screenshot({ path: out, fullPage: true })
console.log(JSON.stringify({ out, box, errs }, null, 1))
await b.close()
