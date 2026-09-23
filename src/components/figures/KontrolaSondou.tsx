import React from 'react'

/**
 * Kontrola sondou (DESIGN.md 9.2) — tři vývrty 0–30 cm vedle sebe se
 * společnou stupnicí 0 / 10 / 15 / 30 cm (8 px na cm jako `prvni-korinek`
 * a `tri-zony`). Pointa je jedna: co sonda najde po promíchání.
 * (1) Ve své hloubce — biochar a Actino do 10 cm, zeolit do 15 cm, pod tím
 * čistý základ (vzory i vytrácení spodní hrany jako `michani-od-hloubky`).
 * (2) Hromádka — všechny příměsi v jednom hustém shluku ve 2–13 cm, jinde nic.
 * (3) Až na dno — po hlubokém frézování řídce a rovnoměrně v celých 30 cm.
 * Ve všech třech vývrtech je zhruba týž materiál (18–20 značek od každé
 * příměsi) — mění se jen, kde leží.
 *
 * Portrétová sazba 520 px, id s prefixem `ks-`. Popisky stojí POD vývrty,
 * centrované na sloupec: nález `.sv-val`, pod ním verdikt `.sv-lbl`
 * (hierarchie jako hodnota + popisek ve vzorech). Nejširší nález „Ve své
 * hloubce" se vejde do rozestupu os 160 i v mobilní sazbě 21 jednotek.
 * Žádná voda, žádný akcent — rozdíl nese hustota a hloubka příměsí.
 * Statická kresba.
 */

const Y0 = 70 // povrch, 0 cm
const CM = 8
const W = 88
const SLOUPCE = [80, 240, 400] as const
const yCm = (cm: number) => Y0 + cm * CM

type Druh = 'b1' | 'b2' | 'a1' | 'a2' | 'z'

/** Jedna značka příměsi — tytéž tvary jako v patternech `mh-plna` a
 *  `mh-zeolit` (9.2 p. 10); legenda i hromádka je kreslí touto funkcí. */
const Znacka: React.FC<{ d: Druh; x: number; y: number }> = ({ d, x, y }) => {
  if (d === 'b1') return <path d={`M${x} ${y} l5 -3 3 4 -4 3 z`} fill="#12161b" opacity="0.9" />
  if (d === 'b2') return <path d={`M${x} ${y} l5 -2 2 4 -4 3 z`} fill="#12161b" opacity="0.9" />
  if (d === 'a1') return <circle cx={x} cy={y} r="2.6" fill="#54402c" />
  if (d === 'a2') return <circle cx={x} cy={y} r="2.2" fill="#54402c" />
  return <path d={`M${x} ${y} l5 -2 4 3 -1 5 -5 2 -4 -3 z`} fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
}

/** Hromádka: hustý shluk ve 2–13 cm (≈ 75 × 90 jednotek), souřadnice od
 *  levého horního rohu vývrtu. Týž počet značek jako celý vývrt 1
 *  (18 / 18 / 19) stažený na jedno místo — asi 1,6× hustší než horních
 *  10 cm vývrtu 1. Rozmístěno výpočtem: druhy promíchané, mezi značkami
 *  (vč. obrysu zeolitu) nejméně 1,8 jednotky, k obrysu vývrtu ≥ 5. */
const HROMADKA: [Druh, number, number][] = [
  ['z', 30, 17], ['z', 53, 23], ['z', 37, 28], ['z', 8, 34], ['z', 66, 39], ['z', 32, 42], ['z', 16, 45],
  ['z', 45, 47], ['z', 71, 58], ['z', 56, 59], ['z', 10, 62], ['z', 36, 62], ['z', 55, 73], ['z', 22, 75],
  ['z', 68, 76], ['z', 37, 84], ['z', 19, 89], ['z', 55, 93], ['z', 41, 96],
  ['b1', 42, 21], ['b1', 13, 26], ['b1', 26, 35], ['b1', 35, 54], ['b1', 47, 68], ['b1', 63, 69],
  ['b1', 74, 70], ['b1', 45, 80], ['b1', 30, 95],
  ['b2', 19, 20], ['b2', 63, 31], ['b2', 48, 35], ['b2', 55, 43], ['b2', 7, 54], ['b2', 22, 66],
  ['b2', 9, 75], ['b2', 35, 75], ['b2', 59, 84],
  ['a1', 60, 36], ['a1', 10, 48], ['a1', 77, 50], ['a1', 30, 53], ['a1', 68, 53], ['a1', 30, 60],
  ['a1', 50, 61], ['a1', 46, 74], ['a1', 16, 84],
  ['a2', 28, 28], ['a2', 22, 32], ['a2', 24, 39], ['a2', 46, 40], ['a2', 60, 52], ['a2', 23, 60],
  ['a2', 31, 86], ['a2', 54, 86], ['a2', 70, 89],
]

const Defs: React.FC = () => (
  <defs>
    {/* Pixelově shodné s `mh-plna` a `mh-zeolit` (9.2 p. 10). */}
    {/* Počátky dlaždic posunuté tak, aby hrany vývrtu (a hranice 10 cm)
        padly do mezer mezi značkami — žádná useknutá zrna na obrysu. */}
    <pattern id="ks-plna" x="79" y="41" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M4 6 l5 -3 3 4 -4 3 z" fill="#12161b" opacity="0.9" />
      <path d="M20 22 l5 -2 2 4 -4 3 z" fill="#12161b" opacity="0.9" />
      <circle cx="21" cy="8" r="2.6" fill="#54402c" />
      <circle cx="8" cy="22" r="2.2" fill="#54402c" />
      <path d="M13 13 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
    </pattern>
    <pattern id="ks-zeolit" x="63" y="153" width="34" height="26" patternUnits="userSpaceOnUse">
      <path d="M6 8 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
      <path d="M23 18 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
    </pattern>
    {/* Po hlubokém frézování: tytéž značky ve stejném množství jako vývrt 1
        (20 / 20 / 20 proti 18 / 18 / 19), rozředěné do 30 cm. Dlaždice
        44 × 48 (dvě na šířku, pět na hloubku vývrtu), v každé 2 + 2 + 2
        značky: biochar a Actino klesnou na třetinu hustoty v 0–10 cm,
        zeolit (dřív do 15 cm) na polovinu. */}
    <pattern id="ks-ridka" x={SLOUPCE[2]} y={Y0} width="44" height="48" patternUnits="userSpaceOnUse">
      <path d="M4 8 l5 -3 3 4 -4 3 z" fill="#12161b" opacity="0.9" />
      <circle cx="33" cy="8" r="2.6" fill="#54402c" />
      <path d="M16 18 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
      <circle cx="36" cy="22" r="2.2" fill="#54402c" />
      <path d="M31 34 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
      <path d="M5 36 l5 -2 2 4 -4 3 z" fill="#12161b" opacity="0.9" />
    </pattern>
    <linearGradient id="ks-fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.75" stopColor="#fff" stopOpacity="1" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
    <mask id="ks-mask" maskContentUnits="objectBoundingBox">
      <rect width="1" height="1" fill="url(#ks-fade)" />
    </mask>
    <clipPath id="ks-vyvrt">
      {SLOUPCE.map((x) => (
        <rect key={x} x={x} y={Y0} width={W} height={30 * CM} />
      ))}
    </clipPath>
  </defs>
)

/** Popisek pod vývrtem: co sonda najde (`.sv-val`) a pod ním verdikt
 *  (`.sv-lbl`) — dvě úrovně, aby se řádky nečetly jako jedna fráze. */
const Popisek: React.FC<{ x: number; a: string; b: string }> = ({ x, a, b }) => (
  <g textAnchor="middle">
    <text className="sv-val" x={x + W / 2} y={yCm(30) + 32}>{a}</text>
    <text className="sv-lbl" x={x + W / 2} y={yCm(30) + 54}>{b}</text>
  </g>
)

export const KontrolaSondou: React.FC = () => {
  const [x1, x2, x3] = SLOUPCE
  return (
    <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 440">
      <Defs />
      {/* Pointa kresby (9.2 p. 3) je jedna: co sonda najde po promíchání.
          Nadpis sedí na levé hraně vývrtu 1 jako ve vzorech; stupnice visí vlevo. */}
      <text className="sv-val" x={x1} y="38" style={{ fontSize: 24 }}>Sonda ukáže</text>

      {/* ── metr ────────────────────────────────────────────────── */}
      <line x1="62" y1={yCm(0)} x2="62" y2={yCm(30)} stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
      <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
        {[0, 10, 15, 30].map((cm) => (
          <line key={cm} x1="56" y1={yCm(cm)} x2="68" y2={yCm(cm)} />
        ))}
      </g>
      <text className="sv-val" x="50" y={yCm(0) + 5} textAnchor="end">0 cm</text>
      <text className="sv-val" x="50" y={yCm(10) + 5} textAnchor="end">10</text>
      <text className="sv-val" x="50" y={yCm(15) + 5} textAnchor="end">15</text>
      <text className="sv-val" x="50" y={yCm(30) + 5} textAnchor="end">30</text>

      {/* ── vývrty ──────────────────────────────────────────────── */}
      {SLOUPCE.map((x) => (
        <rect key={x} x={x} y={Y0} width={W} height={30 * CM} fill="#6b5138" opacity="0.9" />
      ))}
      {/* hloubky 10 a 15 cm přes celou kresbu — pod příměsmi */}
      <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
        <line x1="68" y1={yCm(10)} x2={x3 + W} y2={yCm(10)} />
        <line x1="68" y1={yCm(15)} x2={x3 + W} y2={yCm(15)} />
      </g>

      <g clipPath="url(#ks-vyvrt)">
        {/* 1 · ve své hloubce: spodní hrany se vytrácejí jako v `michani-od-hloubky`
            (`ks-mask` = kopie `mh-mask`). Vrstva zeolitu začíná 6 jednotek pod
            10 cm, aby její první řada nesedla těsně pod vybledlou řadu
            zeolitu z `ks-plna` a nevytvořila na hranici zhuštěný pás. */}
        <rect x={x1} y={yCm(0)} width={W} height={10 * CM + 12} fill="url(#ks-plna)" mask="url(#ks-mask)" />
        <rect x={x1} y={yCm(10) + 6} width={W} height={5 * CM + 6} fill="url(#ks-zeolit)" mask="url(#ks-mask)" />

        {/* 2 · hromádka ve 2–13 cm, jinde nic */}
        <g>
          {HROMADKA.map(([d, x, y], i) => (
            <Znacka key={i} d={d} x={x2 + x} y={Y0 + y} />
          ))}
        </g>

        {/* 3 · až na dno: řídce a rovnoměrně v celých 30 cm */}
        <rect x={x3} y={yCm(0)} width={W} height={30 * CM} fill="url(#ks-ridka)" />
      </g>

      {/* Horní hranu nenese drn (vytažený vývrt) — obrys uzavřený (9.2 p. 9). */}
      <g fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round">
        {SLOUPCE.map((x) => (
          <path key={x} d={`M${x} ${Y0} H${x + W} V${yCm(30)} H${x} Z`} />
        ))}
      </g>

      {/* ── popisky pod vývrty ──────────────────────────────────── */}
      <Popisek x={x1} a="Ve své hloubce" b="v pořádku" />
      <Popisek x={x2} a="Hromádka" b="nedomícháno" />
      <Popisek x={x3} a="Až na dno" b="rozptýleno" />

      {/* ── legenda: značky pixelově shodné se vzory (9.2 p. 10) ───── */}
      <line x1="30" y1="386" x2="490" y2="386" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
      <rect x="30" y="406" width="14" height="14" rx="3" fill="#6b5138" opacity="0.9" />
      <text className="sv-val" x="52" y="418">základ</text>
      <Znacka d="b1" x={142} y={414} />
      <text className="sv-val" x="160" y="418">biochar</text>
      <Znacka d="a1" x={266} y={414} />
      <text className="sv-val" x="278" y="418">Actino</text>
      <Znacka d="z" x={372} y={412} />
      <text className="sv-val" x="392" y="418">zeolit</text>
    </svg>
  )
}
