import React from 'react'

/**
 * Dvě zahrady, stejné příměsi, jiný úkol (DESIGN.md 9.2) — úvodní teze
 * článku o příměsích (A1; A2: „materiály mohou být v obou případech stejné
 * … Mění se jejich úloha i množství"). Dvě stejně velká pole 200 × 230:
 * – vlevo jílovitá zahrada přestavěná převahou písku: nová směs (písek
 *   a tečky původní zeminy) a řídce příměsi — po 5 střípcích biocharu,
 *   hrudkách Actina a zrnech zeolitu. Záhlaví „Jíl s převahou písku"
 *   říká slovy, co nese plocha: A1 o první zahradě píše „voda dlouho
 *   neodchází" a A2 varuje, že „malé množství písku přidané do jílovité
 *   půdy může směs ještě více zahustit"; cestu vodě otevře až převaha
 *   (E2: 65 % písku). Pole tedy ukazuje stav po přestavbě, ne jíl sám;
 * – vpravo písčitá zahrada: původní písčitá zemina bez přidaného písku
 *   (A2: „U písčité půdy by další písek znamenal zbytečné plýtvání
 *   penězi"; E6: „ten stávající zůstává součástí původní zeminy"),
 *   příměsí zhruba dvakrát víc (11 biochar · 11 Actino · 13 zeolit,
 *   včetně střípku a zrna u kapky), zeolitu nejvíc jako v receptu E6.
 * Titulek „Stejné složky, jiný úkol" mluví o příměsích, které jsou
 * v obou polích. Počty jsou schéma poměru, ne dávky; kresba čísla
 * neuvádí (text vedle je nemá, dávky přijdou až v E2 a E6).
 *
 * Mechanika vody: vlevo modrá čárkovaná cesta středem pole a šipka pod
 * ním — voda najde cestu dolů (jediná smyčka, CSS `dz-kapka`; posun
 * −70 … +90 od klidové polohy zůstává uvnitř pole). Vpravo kapka stojí
 * mezi střípkem biocharu a zrnem zeolitu, bez cesty a bez šipky: zůstává
 * u zrna. Štítky pod poli nesou úkol podle A2 a E6: písek otevře cestu
 * vodě, biochar a zeolit podrží část vody.
 *
 * Značky (9.2 p. 10):
 * – nová směs (levé pole) = okrový podklad #c2a052 op .55 a tečky původní
 *   zeminy #6b5138 op .9 r 2,2 / 2,4 / 2,6, rozteč 8, ≥ 3 od vnitřní hrany
 *   obrysu, pevně nasetý rozsyp (mulberry32) do nasycení, jako nová směs
 *   v `jil-jako-vana` (rozsyp sám je vlastní, ne převzatý). Tečky se
 *   vyhýbají cestě vody (r + 3,5 od osy), klidové kapce a rámcům příměsí
 *   (r + 3; rámec Actina zahrnuje jeho světlý lem).
 * – písčitá zemina (pravé pole) = plochá okrová #c2a052 op .45 bez zrn
 *   a bez teček, klíč série jako v `pisek-pod-koreny`
 *   a `zaklad-tri-zahrad`. Od podkladu nové směsi (.55) ji neprůhlednost
 *   skoro neodliší (ΔE00 ≈ 3); pole i čipy legendy rozlišují tečky zeminy.
 * – biochar a zeolit = tvary `b1` / `b2` a `z` ze `Znacka`
 *   v `jedna-zmena-naraz`.
 * – Actino = hnědé jádro `a1` / `a2` (r 2,6 / 2,2 #54402c) na lemu barvy
 *   panelu #f6f5f2 o 1,2 širším, táž značka jako v `jedna-zmena-naraz`.
 *   Samotné jádro má velikost i tón teček zeminy a mezi nimi by se
 *   ztratilo; lem mu dává vlastní tvar.
 * – voda = kapka A 7 7, čárkovaná cesta #2563eb 3 7 a šipka #2563eb
 *   op .75 jako v `jil-jako-vana`. Voda je jediný akcent (9.2 p. 1).
 *
 * Legenda: dva sloupce, klíč 28 široký na x 30 / 270, text o 36 dál,
 * řádky po 34. Čipy 28 × 14, ostré rohy, obrys #232830 / 1,6.
 * Řádek 1 hmoty: „nová směs" (čip .55 se dvěma tečkami zeminy na týchž
 * místech a pod týmž jménem jako v `jil-jako-vana` a `kolik-pisku-do-jilu`)
 * · „písčitá zemina" (čip .45 jako v `pisek-pod-koreny`). Řádek 2:
 * biochar na krému · Actino na políčku zeminy #6b5138 op .9 (lem barvy
 * panelu by na krému zmizel), jádro ve středu čipu jako v
 * `jedna-zmena-naraz` (tam ale na okrovém čipu písčité zeminy). Řádek 3:
 * zeolit na témž políčku (zrno na x + 10 / y + 4 od rohu čipu jako
 * v `jedna-zmena-naraz`, tam také na okrovém čipu) · voda. Obě světlé
 * značky tak leží na témž podkladu (zeolit podle pravidla série pro
 * světlé značky, Actino kvůli lemu); hnědá plocha je v legendě podklad
 * značek, ve scéně hmotou není.
 *
 * Portrétová sazba 520 × 548, id nemá (prefix `dz-` nese jen třída
 * kapky). Nadpis 24 px na x 40 jako v sérii. Jednotky nikde. Záhlaví
 * polí mají po jednom řádku na y 82, pole začínají na y 98.
 * Rozměry v sazbě 18/21 (≤ 385 px) jsou změřené getBBox: „Jíl s převahou
 * písku" končí na x ≈ 267 (před „Písčitá zahrada" ≈ 13),
 * „otevře cestu vodě" na x ≈ 208, „nová směs" na x ≈ 168 a „písčitá
 * zemina" na x ≈ 441. Mezi rámci textů zůstává ve všech sazbách ≥ 5,
 * text × tvar ≥ 7 jednotek.
 */

// ── sazba ────────────────────────────────────────────────────────
const W = 200 // šířka pole
const H = 230 // výška pole
const XL = 40 // levé pole
const XP = 280 // pravé pole
const Y_HLAV = 82 // záhlaví polí (jeden řádek)
const Y0 = 98 // horní hrana obou polí
const Y1 = Y0 + H // 328
const WX = 100 // osa cesty vody v levém poli (rel.)
const KAPKA = 92 // špička klidové kapky (rel.); smyčka −70 … +90 zůstává v poli
const Y_LBL = Y1 + 48 // štítek pod poli
const Y_VAL = Y_LBL + 27
const LEG = Y1 + 100 // linka legendy
const L1 = LEG + 32 // 1. řádek legendy (účaří)
const L2 = LEG + 66 // 2. řádek legendy (účaří)
const L3 = LEG + 100 // 3. řádek legendy (účaří)
const K1 = 30 // klíč 1. sloupce legendy
const K2 = 270 // klíč 2. sloupce legendy
const HALO = 1.2 // lem Actina (podklad barvy panelu) navíc k poloměru jádra

type Druh = 'b1' | 'b2' | 'a1' | 'a2' | 'z'
type Kus = [Druh, number, number]

/** Příměsi vlevo (rel. k poli): po pěti, mimo cestu vody (x 88–112). */
const VLEVO: Kus[] = [
  ['z', 71, 156], ['b1', 142.5, 97], ['a1', 37, 59.5], ['b2', 157.5, 26.5], ['a2', 153.5, 184.5],
  ['z', 19.5, 108], ['b1', 34.5, 197], ['a1', 49.5, 18.5], ['b2', 124, 145.5], ['a2', 124.5, 58.5],
  ['z', 68.5, 75.5], ['b1', 180, 97], ['a1', 183.5, 139.5], ['z', 120.5, 13.5], ['z', 11.5, 17],
]
/** Kapka vpravo (rel. špička) a její zrna: střípek vlevo, zeolit pod ní. */
const KAPKA_P: [number, number] = [104, 96]
const SHLUK: Kus[] = [['b1', 87, 108], ['z', 99, 121.5]]
/** Příměsi vpravo: 11 biochar · 11 Actino · 13 zeolit, včetně shluku. */
const VPRAVO: Kus[] = [
  ...SHLUK,
  ['z', 150.5, 46], ['b1', 106, 196.5], ['a2', 46.5, 42], ['z', 28, 145.5], ['b2', 159, 152.5], ['a1', 27.5, 86],
  ['z', 92.5, 24], ['b1', 177.5, 86], ['a2', 90.5, 71], ['z', 168, 197], ['b2', 50.5, 199.5], ['a1', 13.5, 190.5],
  ['z', 83, 160.5], ['b1', 126, 151.5], ['a2', 144, 119.5], ['z', 126, 76], ['b2', 9, 117.5], ['a1', 184, 118.5],
  ['z', 71, 81.5], ['b1', 32, 178.5], ['a2', 19.5, 25], ['z', 139, 190.5], ['b2', 42, 112.5], ['a1', 46.5, 12],
  ['z', 182.5, 12.5], ['b1', 127, 14.5], ['a2', 68.5, 126.5], ['z', 182, 41.5], ['b2', 69, 50], ['a1', 69.5, 14],
  ['z', 179.5, 145.5], ['a2', 9, 220.5], ['z', 79.5, 206],
]

/** Rámce značek (rel. ke kotvě): zeolit včetně půl tahu obrysu, Actino
 *  včetně světlého lemu. */
const RA1 = 2.6 + HALO
const RA2 = 2.2 + HALO
const RAMEC: Record<Druh, [number, number, number, number]> = {
  b1: [0, -3, 8, 4],
  b2: [0, -2, 7, 5],
  a1: [-RA1, -RA1, RA1, RA1],
  a2: [-RA2, -RA2, RA2, RA2],
  z: [-1.8, -2.8, 9.8, 8.8],
}

const d1 = (n: number) => Math.round(n * 10) / 10

/** mulberry32 — týž generátor jako `jil-jako-vana` a `kolik-pisku-do-jilu`. */
const rng = (seed: number) => {
  let s = seed
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Vzdálenost bodu od obdélníku [x0, y0, x1, y1] (0 uvnitř). */
const kRamci = (x: number, y: number, [x0, y0, x1, y1]: [number, number, number, number]) =>
  Math.hypot(Math.max(x0 - x, 0, x - x1), Math.max(y0 - y, 0, y - y1))

/** Tečky zeminy v levém poli (rel.): házení šipek s roztečí 8 do nasycení,
 *  okraj = půl tahu obrysu + mezera 3 + poloměr (vzor `kolik-pisku-do-jilu`). */
const ZEMINA_D = (() => {
  const rnd = rng(0xd2e1)
  const ROZTEC = 8
  const kapka: [number, number, number, number] = [WX - 7, KAPKA, WX + 7, KAPKA + 21]
  const tecky: { x: number; y: number; r: number }[] = []
  for (let i = 0; i < 60000; i++) {
    const r = [2.2, 2.4, 2.6][Math.floor(rnd() * 3)]
    const okraj = 0.8 + 3 + r
    const x = d1(okraj + rnd() * (W - 2 * okraj))
    const y = d1(okraj + rnd() * (H - 2 * okraj))
    if (Math.abs(x - WX) < r + 3.5) continue // cesta vody
    if (kRamci(x, y, kapka) < r + 3) continue // klidová kapka
    if (
      VLEVO.some(([d, kx, ky]) => {
        const [a, b, c, e] = RAMEC[d]
        return kRamci(x, y, [kx + a, ky + b, kx + c, ky + e]) < r + 3
      })
    )
      continue
    if (tecky.every((t) => (t.x - x) ** 2 + (t.y - y) ** 2 >= ROZTEC ** 2)) tecky.push({ x, y, r })
  }
  return tecky
    .map(({ x, y, r }) => `M${d1(XL + x - r)} ${d1(Y0 + y)}a${r} ${r} 0 1 0 ${d1(2 * r)} 0a${r} ${r} 0 1 0 ${d1(-2 * r)} 0Z`)
    .join('')
})()

type Vypln = { fill: string; opacity: number }
/** Přidaný písek, podklad nové směsi. */
const PISEK: Vypln = { fill: '#c2a052', opacity: 0.55 }
/** Původní písčitá zemina: klíč série op .45, bez zrn (`pisek-pod-koreny`). */
const PISCITA: Vypln = { fill: '#c2a052', opacity: 0.45 }
const ZEMINA: Vypln = { fill: '#6b5138', opacity: 0.9 }
const PANEL = '#f6f5f2' // barva krémového panelu figury (--id-cream)
const obrys = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
const voditko = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const
/** Šipka vody: tah #2563eb op .75 jako hladina a šipka v `jil-jako-vana`. */
const sipka = { fill: 'none', stroke: '#2563eb', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.75 } as const

/** Jedna značka příměsi. Biochar, Actino i zeolit jsou tytéž tvary jako
 *  `Znacka` v `jedna-zmena-naraz`. */
const Znacka: React.FC<{ d: Druh; x: number; y: number }> = ({ d, x, y }) => {
  if (d === 'b1') return <path d={`M${x} ${y} l5 -3 3 4 -4 3 z`} fill="#12161b" opacity="0.9" />
  if (d === 'b2') return <path d={`M${x} ${y} l5 -2 2 4 -4 3 z`} fill="#12161b" opacity="0.9" />
  if (d === 'a1' || d === 'a2') {
    const r = d === 'a1' ? 2.6 : 2.2
    return (
      <g>
        <circle cx={x} cy={y} r={r + HALO} fill={PANEL} />
        <circle cx={x} cy={y} r={r} fill="#54402c" />
      </g>
    )
  }
  return <path d={`M${x} ${y} l5 -2 4 3 -1 5 -5 2 -4 -3 z`} fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
}

/** Kapka — týž tvar jako v `jil-jako-vana` a `pisek-pod-koreny` (A 7 7). */
const Kapka: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <path
    d={`M${x} ${y} C ${x + 4} ${y + 6}, ${x + 7} ${y + 10}, ${x + 7} ${y + 14} A 7 7 0 0 1 ${x - 7} ${y + 14} C ${x - 7} ${y + 10}, ${x - 4} ${y + 6}, ${x} ${y} Z`}
    fill="#2563eb"
    opacity="0.9"
  />
)

/** Pole 200 × 230: podklad hmoty, obsah, uzavřený obrys (9.2 p. 9). */
const Pole: React.FC<{ x: number; vypln: Vypln; children: React.ReactNode }> = ({ x, vypln, children }) => (
  <g>
    <rect x={x} y={Y0} width={W} height={H} {...vypln} />
    {children}
    <path d={`M${x} ${Y0} H${x + W} V${Y1} H${x} Z`} {...obrys} />
  </g>
)

/** Čip legendy 28 × 14: výplň hmoty z pole, ostré rohy, obrys hmoty;
 *  značka leží mezi výplní a obrysem. */
const Cip: React.FC<{ x: number; y: number; vypln: Vypln; children?: React.ReactNode }> = ({ x, y, vypln, children }) => (
  <>
    <rect x={x} y={y} width="28" height="14" {...vypln} />
    {children}
    <path d={`M${x} ${y} H${x + 28} V${y + 14} H${x} Z`} {...obrys} />
  </>
)

/** Dvě tečky zeminy v čipu nové směsi — tatáž místa jako čip v `jil-jako-vana`. */
const teckyCipu = (x: number, y: number) =>
  `M${x + 5.6} ${y + 7}a2.4 2.4 0 1 0 4.8 0a2.4 2.4 0 1 0 -4.8 0ZM${x + 17.8} ${y + 7.5}a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0Z`

export const DveZahrady: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 548">
    {/* Pointa kresby (9.2 p. 3) je jedna: tytéž příměsi, jiná práce. */}
    <text className="sv-val" x="40" y="40" style={{ fontSize: 24 }}>
      Stejné složky, jiný úkol
    </text>

    {/* ── vlevo: jílovitá zahrada přestavěná převahou písku — nová směs,
        příměsí málo ── */}
    <text className="sv-lbl" x={XL} y={Y_HLAV}>Jíl s převahou písku</text>
    <Pole x={XL} vypln={PISEK}>
      <path d={ZEMINA_D} {...ZEMINA} />
      {VLEVO.map(([d, x, y]) => (
        <Znacka key={`${d}-${x}-${y}`} d={d} x={XL + x} y={Y0 + y} />
      ))}
      {/* cesta dolů: čárkovaná svislice středem pole, kapka po ní padá */}
      <line x1={XL + WX} y1={Y0 + 6} x2={XL + WX} y2={Y1 - 6} stroke="#2563eb" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
      <g className="dz-kapka">
        <Kapka x={XL + WX} y={Y0 + KAPKA} />
      </g>
    </Pole>
    <path d={`M${XL + WX - 8} ${Y1 + 8} l8 10 8 -10`} {...sipka} />
    <text className="sv-lbl" x={XL} y={Y_LBL}>písek</text>
    <text className="sv-val" x={XL} y={Y_VAL}>otevře cestu vodě</text>

    {/* ── vpravo: písčitá zahrada — původní písčitá zemina, příměsí víc ── */}
    <text className="sv-lbl" x={XP} y={Y_HLAV}>Písčitá zahrada</text>
    <Pole x={XP} vypln={PISCITA}>
      {VPRAVO.map(([d, x, y]) => (
        <Znacka key={`${d}-${x}-${y}`} d={d} x={XP + x} y={Y0 + y} />
      ))}
      {/* kapka zůstává mezi střípkem biocharu a zrnem zeolitu */}
      <Kapka x={XP + KAPKA_P[0]} y={Y0 + KAPKA_P[1]} />
    </Pole>
    <text className="sv-lbl" x={XP} y={Y_LBL}>biochar a zeolit</text>
    <text className="sv-val" x={XP} y={Y_VAL}>podrží část vody</text>

    {/* ── legenda: jedna pro obě pole, dva sloupce (9.2 p. 10) ───── */}
    <line x1="30" y1={LEG} x2="490" y2={LEG} {...voditko} />
    {/* 1. řádek: hmoty obou polí — nová směs (tečky zeminy) · písčitá zemina */}
    <Cip x={K1} y={L1 - 12} vypln={PISEK}>
      <path d={teckyCipu(K1, L1 - 12)} {...ZEMINA} />
    </Cip>
    <text className="sv-val" x={K1 + 36} y={L1}>nová směs</text>
    <Cip x={K2} y={L1 - 12} vypln={PISCITA} />
    <text className="sv-val" x={K2 + 36} y={L1}>písčitá zemina</text>
    {/* 2. řádek: biochar na krému · Actino na políčku zeminy (lem barvy
        panelu by na krému zmizel), jádro ve středu čipu */}
    <Znacka d="b1" x={K1 + 10} y={L2 - 5.5} />
    <text className="sv-val" x={K1 + 36} y={L2}>biochar</text>
    <Cip x={K2} y={L2 - 12} vypln={ZEMINA}>
      <Znacka d="a1" x={K2 + 14} y={L2 - 5} />
    </Cip>
    <text className="sv-val" x={K2 + 36} y={L2}>Actino</text>
    {/* 3. řádek: zeolit na témž políčku zeminy (světlá značka série) · voda */}
    <Cip x={K1} y={L3 - 12} vypln={ZEMINA}>
      <Znacka d="z" x={K1 + 10} y={L3 - 8} />
    </Cip>
    <text className="sv-val" x={K1 + 36} y={L3}>zeolit</text>
    <Kapka x={K2 + 14} y={L3 - 17} />
    <text className="sv-val" x={K2 + 36} y={L3}>voda</text>
  </svg>
)
