import React from 'react'

/**
 * Nabitý vs. nenabitý biochar (DESIGN.md 9.2) — dvě zrna vedle sebe.
 * Vlevo nenabité: póry prázdné a šipky dovnitř — zásobárna se teprve
 * plní a bere živiny z okolní půdy (i dusík mikroorganismům). Vpravo
 * nabité: póry drží živiny a šipky míří ke kořenu. Statická kresba —
 * pointa je směr šipek, pohyb by ji nezpřesnil.
 *
 * Portrétová sazba 520 × 640 (plán rytmu A4): obě zrna ×1,2 proti sazbě
 * 536 (póry úměrně), řádky pod zrny a poznámky dole s roztečí 24, aby
 * v mobilní sazbě 18/21 zůstala mezi rámci textů mezera ≥ 4. Kresba nese
 * jen to, co autor píše vedle ní (nákup a nabíjení) — dávky a jejich
 * meze nesou karty a tabulky, ne tahle kresba.
 *
 * Hroty šipek končí ~4,5 před obrysem hmoty na světlém podkladu: vlevo
 * před zrnem #12161b, vpravo před záhonovou plochou #6b5138 (tmavý hrot
 * na tmavé výplni nebyl vidět). Volné živiny stojí mimo textovou osu
 * x 40, aby se nečetly jako odrážka popisku.
 *
 * Značka živin je jedna (9.2 p. 10): hnědé jádro r 2,6 #54402c (vzor
 * `mykorhizni-vlakna`, `pisek-pod-koreny`) na podkladu r 3,4 barvy panelu
 * #f6f5f2 — na krému neviditelném, na zrnu drží hranici tvaru. Políčko
 * kořene v legendě je výřez záhonové plochy: ostré rohy + obrys hmoty.
 * Id prefix `nb-` (kresba žádné id nemá, prefix nesou jen klíče).
 */

type Bod = readonly [number, number]

const K = 1.2 // zvětšení zrna proti sazbě 536
const r1 = (n: number) => Math.round(n * 10) / 10
const bod = ([x, y]: Bod) => `${r1(x)} ${r1(y)}`

/** Obrys a póry [x, y, r] zrna v jednotkách před zvětšením (tvar beze změny). */
const OBRYS: Bod[] = [
  [28, 22],
  [96, 4],
  [152, 26],
  [166, 84],
  [146, 156],
  [74, 176],
  [18, 138],
  [8, 66],
]
const PORY: [number, number, number][] = [
  [62, 52, 9],
  [104, 44, 7],
  [86, 92, 10],
  [48, 116, 7],
  [118, 108, 8],
  [82, 148, 7],
]

/** Posun zrn: levé 39,6–229,2, pravé 273,6–463,2 (lícuje s popisky na
 *  40 / 274); výška 139,8–346,2. */
const TY = 135
const LEVE: Bod = [30, TY]
const PRAVE: Bod = [264, TY]

/** Vrchol `i` obrysu zrna posunutého o `z` v souřadnicích kresby. */
const vrchol = (z: Bod, i: number): Bod => [z[0] + OBRYS[i][0] * K, z[1] + OBRYS[i][1] * K]
/** Bod na hraně obrysu z vrcholu `i` do dalšího v podílu `t`. */
const naHrane = (z: Bod, i: number, t: number): Bod => {
  const a = vrchol(z, i)
  const b = vrchol(z, (i + 1) % OBRYS.length)
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

/** Značka živin: podklad barvy panelu + hnědé jádro — všude táž. */
const Zivina: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <circle cx={x} cy={y} r="3.4" fill="#f6f5f2" />
    <circle cx={x} cy={y} r="2.6" fill="#54402c" />
  </g>
)

/** Zrno biocharu s póry; `plne` = póry drží živiny. */
const Zrno: React.FC<{ z: Bod; plne: boolean; prefix: string }> = ({ z, plne, prefix }) => {
  const d = `M${OBRYS.map((_, i) => bod(vrchol(z, i))).join(' L')} Z`
  return (
    <g>
      <path d={d} fill="#12161b" opacity="0.9" />
      <path d={d} fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
      {PORY.map(([px, py, r], i) => {
        const cx = z[0] + px * K
        const cy = z[1] + py * K
        return (
          <g key={`${prefix}-${i}`}>
            <circle cx={r1(cx)} cy={r1(cy)} r={r1(r * K)} fill="none" stroke="rgba(255,255,255,.38)" strokeWidth="1.6" />
            {/* Živiny #54402c na zrnu #12161b mají 1,86:1 — světlý podklad
                značky drží hranici tvaru čitelnou (kolo 02, styl). */}
            {plne ? <Zivina x={r1(cx - 2 * K)} y={r1(cy - 1 * K)} /> : null}
            {plne && r >= 8 ? <Zivina x={r1(cx + 3 * K)} y={r1(cy + 3 * K)} /> : null}
          </g>
        )
      })}
    </g>
  )
}

/** Šipka ze `z` do hrotu `k`, prohnutá o `ohyb` kolmo k ose; hrot
 *  ramena 9 pod ±30° ve směru tečny (série: 8–9,4). */
const Sipka: React.FC<{ z: Bod; k: Bod; ohyb?: number }> = ({ z, k, ohyb = 0 }) => {
  const [dx, dy] = [k[0] - z[0], k[1] - z[1]]
  const d = Math.hypot(dx, dy)
  const c: Bod = [(z[0] + k[0]) / 2 - (dy / d) * ohyb, (z[1] + k[1]) / 2 + (dx / d) * ohyb]
  const [tx, ty] = [k[0] - c[0], k[1] - c[1]]
  const n = Math.hypot(tx, ty)
  const rameno = (a: number): Bod => [
    k[0] - 9 * ((tx / n) * Math.cos(a) - (ty / n) * Math.sin(a)),
    k[1] - 9 * ((tx / n) * Math.sin(a) + (ty / n) * Math.cos(a)),
  ]
  return (
    <g fill="none" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${bod(z)} Q${bod(c)} ${bod(k)}`} />
      <path d={`M${bod(rameno(Math.PI / 6))} L${bod(k)} L${bod(rameno(-Math.PI / 6))}`} />
    </g>
  )
}

/** Šipka od volné živiny `p` k hraně zrna v bodě `t`: začíná 7 od tečky,
 *  hrot končí 5 před hranou (na světlém podkladu, ne na zrnu). */
const Dovnitr: React.FC<{ p: Bod; t: Bod; ohyb: number }> = ({ p, t, ohyb }) => {
  const [dx, dy] = [t[0] - p[0], t[1] - p[1]]
  const d = Math.hypot(dx, dy)
  const [ux, uy] = [dx / d, dy / d]
  return <Sipka z={[p[0] + 7 * ux, p[1] + 7 * uy]} k={[t[0] - 5 * ux, t[1] - 5 * uy]} ohyb={ohyb} />
}

/** Volné živiny kolem levého zrna (mimo textovou osu x 40) a místa na
 *  obrysu, kam míří. */
const VOLNE: { p: Bod; t: Bod; ohyb: number }[] = [
  { p: [56, 122], t: naHrane(LEVE, 0, 0.12), ohyb: -4 }, // vlevo nahoře
  { p: [252, 156], t: naHrane(LEVE, 2, 0.3), ohyb: 4 }, // mezi zrny
  { p: [56, 350], t: naHrane(LEVE, 5, 0.65), ohyb: 4 }, // vlevo dole
]

/** Hrana pravého zrna, kde šipky ven začínají: 3 UVNITŘ obrysu (normála
 *  (-ey, ex) míří u tohoto obrysu dovnitř) — tmavý tah na zrnu splyne
 *  a šipka vyjde přesně z hrany. */
const ven = (i: number, t: number): Bod => {
  const a = vrchol(PRAVE, i)
  const b = vrchol(PRAVE, (i + 1) % OBRYS.length)
  const [ex, ey] = [b[0] - a[0], b[1] - a[1]]
  const e = Math.hypot(ex, ey)
  const h = naHrane(PRAVE, i, t)
  return [h[0] + (3 * -ey) / e, h[1] + (3 * ex) / e]
}

/** Záhonová plocha s kořenem vpravo: x 484–518, od zrna mezera 20,8. */
const ZX = 484
const ZW = 34

/* Řádky pod zrny, legenda a poznámka (rozteč 24 jako dřív; místo
   po vypuštěné poznámce o dávce rozdělené do mezer mezi skupinami). */
const Y_POD = 406
const Y_CARA = 478
const Y_LEG = 504
const Y_LEG_RADEK = 534
const Y_POZN = 584

export const NabityBiochar: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 640">
    {/* Pointa kresby (9.2 p. 3) je jedna: nabít předem. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Nabít předem</text>

    {/* ── vlevo: nenabitý bere ───────────────────────────────── */}
    <text className="sv-lbl" x="40" y="90">Nenabitý</text>
    <Zrno z={LEVE} plne={false} prefix="nb-l" />
    {/* volné živiny v okolí a šipky DOVNITŘ zrna */}
    {VOLNE.map(({ p }) => (
      <Zivina key={`nb-v-${p[0]}-${p[1]}`} x={p[0]} y={p[1]} />
    ))}
    {VOLNE.map((v) => (
      <Dovnitr key={`nb-s-${v.p[0]}-${v.p[1]}`} {...v} />
    ))}
    <text className="sv-lbl" x="40" y={Y_POD}>živiny si z půdy</text>
    <text className="sv-lbl" x="40" y={Y_POD + 24}>nejdřív bere</text>

    {/* ── vpravo: nabitý dává ────────────────────────────────── */}
    <text className="sv-lbl" x="274" y="90">Nabitý kompostem</text>
    <Zrno z={PRAVE} plne prefix="nb-p" />
    {/* Kořen #d8c9b4 potřebuje ornicový podklad, jinak je na krémovém
       panelu prakticky neviditelný (1,49:1 — kolo 02, styl; táž vada,
       kterou už řeší MykorhizniVlakna). Záhonová plocha s obrysem hmoty
       (9.2 p. 9); výplň bez zaoblení, aby v rozích neprosvítal panel. */}
    <rect x={ZX} y="126" width={ZW} height="238" fill="#6b5138" opacity="0.9" />
    <path d={`M${ZX} 126 H${ZX + ZW} V364 H${ZX} Z`} fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    {/* kořen vpravo a šipky VEN ke kořenu (hroty na krému, 4,5 před plochou) */}
    <path
      d="M500 148 C 498 196, 502 244, 499 292 C 497 318, 500 336, 498 350"
      fill="none"
      stroke="#d8c9b4"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.9"
    />
    <path d="M500 202 q-8.4 7.2 -10.8 14.4 M499 262 q8.4 7.2 10.8 14.4" fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
    <Sipka z={ven(2, 0.6)} k={[ZX - 4.5, 214]} ohyb={-3} />
    <Sipka z={ven(3, 0.55)} k={[ZX - 4.5, 289]} ohyb={-3} />
    <text className="sv-lbl" x="274" y={Y_POD}>živiny kořenům</text>
    <text className="sv-lbl" x="274" y={Y_POD + 24}>postupně dává</text>

    {/* ── legenda ────────────────────────────────────────────── */}
    <line x1="30" y1={Y_CARA} x2="490" y2={Y_CARA} stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y={Y_LEG}>Co je co</text>
    <Zivina x={36} y={Y_LEG_RADEK - 5} />
    <text className="sv-val" x="52" y={Y_LEG_RADEK}>živiny</text>
    {/* políčko = výřez záhonové plochy: ostré rohy + obrys hmoty */}
    <rect x="248" y={Y_LEG_RADEK - 17} width="20" height="26" fill="#6b5138" opacity="0.9" />
    <path
      d={`M248 ${Y_LEG_RADEK - 17} H268 V${Y_LEG_RADEK + 9} H248 Z`}
      fill="none"
      stroke="#232830"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d={`M258 ${Y_LEG_RADEK - 13} C 257 ${Y_LEG_RADEK - 6}, 259 ${Y_LEG_RADEK}, 258 ${Y_LEG_RADEK + 5}`}
      fill="none"
      stroke="#d8c9b4"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.9"
    />
    <text className="sv-val" x="274" y={Y_LEG_RADEK}>kořen</text>

    <text className="sv-lbl" x="30" y={Y_POZN}>Samotná voda nenabije –</text>
    <text className="sv-lbl" x="30" y={Y_POZN + 24}>biochar jen navlhčí</text>
  </svg>
)
