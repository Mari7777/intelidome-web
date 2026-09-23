import React from 'react'

/**
 * Součet vstupů ≠ slehlá směs (DESIGN.md 9.2) — vlevo dva zvlášť
 * odměřené materiály, vpravo jejich směs po promíchání a slehnutí:
 * jemnější částice zapadly do mezer mezi hrubšími, takže hladina
 * skončí POD čárkovanou linkou prostého součtu. Bez čísel — článek
 * žádnou pevnou přirážku neslibuje. Statická kresba, id `sv-`.
 *
 * Barevný klíč drží celý článek: okrová `#c2a052` op .55 = PÍSEK
 * (hrubší), hnědá `#6b5138` op .9 = ZEMINA (jemnější). Směs je proto
 * okrový podklad s drobnými hnědými tečkami v mezerách (tečka jako
 * „prach a jíl" v `prany-pisek`). Jména hmot stojí pod všemi třemi
 * sloupci ve vzoru tspan (vlastnost `.sv-lbl`, hmota `.sv-val`), takže
 * klíč nestojí jen na barvě a legenda není potřeba.
 *
 * Vstupy mají poměr článku 65/35 (písek 174, zemina 94 jednotek
 * výšky). Všechny tři sloupce mají stejnou šířku (stejný průřez), objem
 * je tedy úměrný výšce a linka součtu leží přesně 174 + 94 = 268 nad
 * společným dnem — počítá se z konstant, ne od oka. Pointa je kóta,
 * ne titulek: popisky linky součtu a hladiny stojí vlevo od sloupce
 * směsi (zarovnané na jeho hranu), šipka slehnutí v ose sloupce vede
 * od čárkované linky k horní hraně směsi, takže má obě opory.
 *
 * Tečky směsi nejsou dlaždice: pravidelná mřížka se na výšku 240 četla
 * jako tapeta s diagonálními pruhy. Rozsyp je pevně nasetý (mulberry32,
 * vrhání šipek s roztečí 8, souřadnice na desetiny), takže server
 * i prohlížeč vykreslí totéž. Každá tečka drží ≥ 3 jednotky od vnitřní
 * hrany obrysu; kreslí se jednou cestou, ne stovkou uzlů.
 *
 * Portrétová sazba 520 px, obsah x = 40–490. Mobilní sazba 18/21
 * jednotek: jméno pod hrubším sloupcem končí na x ≈ 189, jemnější
 * začíná na 200; jméno pod jemnějším končí na ≈ 392, před sloupcem
 * směsi (404). „Směs" stojí v ose svého sloupce (≈ 418–470), ne u jeho
 * levé hrany, jinak by se mezera 12 jednotek četla jako „zemina směs".
 * Nejmenší mezera mezi texty i text × tvar při 18/21 je ≥ 4 jednotky.
 */

const W = 80 // šířka všech tří sloupců
const PISEK_V = 174 // výška odměřeného písku (65 % součtu)
const ZEMINA_V = 94 // výška odměřené zeminy (35 % součtu)
const SLEHNUTI = 28 // o kolik je hladina směsi pod součtem (schéma, ne přirážka)

const X_HRUBSI = 40
const X_JEMNEJSI = 200
const X_SMES = 404

const Y_SOUCET = 34 // linka součtu vstupů
const Y_DNO = Y_SOUCET + PISEK_V + ZEMINA_V // 302 — společné dno: součet leží přesně 174 + 94 nad ním
const Y_PISEK = Y_DNO - PISEK_V // 128 — horní hrana písku
const Y_ZEMINA = Y_DNO - ZEMINA_V // 208 — horní hrana zeminy
const Y_HLADINA = Y_SOUCET + SLEHNUTI // 62 — hladina slehlé směsi
const H_SMES = Y_DNO - Y_HLADINA // 240
const Y_JMENA = Y_DNO + 26 // 328
const VYSKA = Y_JMENA + 22 // 350

const X_POPISKY = X_SMES - 10 // pravý okraj popisků linky a hladiny
const X_OSA = X_SMES + W / 2 // 444 — šipka slehnutí v ose sloupce směsi
const X_KONEC = X_SMES + W + 6 // 490 — konec čárkované linky, pravý okraj série

const PISEK = { fill: '#c2a052', opacity: 0.55 } as const
const ZEMINA = { fill: '#6b5138', opacity: 0.9 } as const
const obrys = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const

/** Jemné částice zeminy v mezerách písku: pevně nasetý nepravidelný
 *  rozsyp v souřadnicích sloupce směsi (0..W × 0..H_SMES). */
const JEMNE = (() => {
  let s = 0x51e4
  const rnd = () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const ROZTEC = 8 // nejmenší vzdálenost středů: mezera mezi tečkami ≥ 2,8
  const tecky: { x: number; y: number; r: number }[] = []
  for (let i = 0; i < 6000; i++) {
    const r = [2.2, 2.4, 2.6][Math.floor(rnd() * 3)]
    const okraj = 0.8 + 3 + r // půl tahu obrysu + mezera 3 + poloměr
    const x = Math.round((okraj + rnd() * (W - 2 * okraj)) * 10) / 10
    const y = Math.round((okraj + rnd() * (H_SMES - 2 * okraj)) * 10) / 10
    if (tecky.every((t) => (t.x - x) ** 2 + (t.y - y) ** 2 >= ROZTEC ** 2)) tecky.push({ x, y, r })
  }
  const d = (n: number) => Math.round(n * 10) / 10
  return tecky
    .map(({ x, y, r }) => `M${d(X_SMES + x - r)} ${d(Y_HLADINA + y)}a${r} ${r} 0 1 0 ${d(2 * r)} 0a${r} ${r} 0 1 0 ${d(-2 * r)} 0Z`)
    .join('')
})()

/** Sloupec hmoty: výplň(e) a uzavřený obrys (9.2 p. 9). */
const Sloupec: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => (
  <g>
    {children}
    <path d={`M${x} ${y} H${x + W} V${Y_DNO} H${x} Z`} {...obrys} />
  </g>
)

export const SlehnutiVstupu: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox={`0 0 520 ${VYSKA}`}>
    {/* ── vlevo: vstupy odměřené zvlášť ──────────────────────── */}
    <text className="sv-lbl" x={X_HRUBSI} y={Y_PISEK - 12}>Vstupy odměřené zvlášť</text>
    <Sloupec x={X_HRUBSI} y={Y_PISEK}>
      <rect x={X_HRUBSI} y={Y_PISEK} width={W} height={PISEK_V} {...PISEK} />
    </Sloupec>
    <Sloupec x={X_JEMNEJSI} y={Y_ZEMINA}>
      <rect x={X_JEMNEJSI} y={Y_ZEMINA} width={W} height={ZEMINA_V} {...ZEMINA} />
    </Sloupec>
    <text className="sv-val" x={X_HRUBSI} y={Y_JMENA}>
      <tspan className="sv-lbl">{'hrubší · '}</tspan>
      písek
    </text>
    <text className="sv-val" x={X_JEMNEJSI} y={Y_JMENA}>
      <tspan className="sv-lbl">{'jemnější · '}</tspan>
      zemina
    </text>

    {/* ── vpravo: směs po promíchání a slehnutí ──────────────── */}
    {/* prostý součet vstupů: 174 + 94 nad dnem (konstrukční linka) */}
    <text className="sv-lbl" x={X_POPISKY} y={Y_SOUCET + 5} textAnchor="end">součet vstupů</text>
    <line x1={X_POPISKY + 6} y1={Y_SOUCET} x2={X_KONEC} y2={Y_SOUCET} stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    {/* skutečná hladina směsi níž */}
    <text className="sv-lbl" x={X_POPISKY} y={Y_HLADINA + 5} textAnchor="end">hladina po slehnutí</text>
    <Sloupec x={X_SMES} y={Y_HLADINA}>
      <rect x={X_SMES} y={Y_HLADINA} width={W} height={H_SMES} {...PISEK} />
      <path d={JEMNE} {...ZEMINA} />
    </Sloupec>
    {/* v ose sloupce (jako šipka): zarovnané na levou hranu by se na
        telefonu četlo jako pokračování „zemina směs" */}
    <text className="sv-val" x={X_OSA} y={Y_JMENA} textAnchor="middle">směs</text>
    {/* šipka slehnutí: od linky součtu dolů, hrot dosedne na horní hranu směsi */}
    <g fill="none" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${X_OSA} ${Y_SOUCET + 6} V${Y_HLADINA - 2.6}`} />
      <path d={`M${X_OSA - 5} ${Y_HLADINA - 10.6} l5 8 5 -8`} />
    </g>
  </svg>
)
