import React from 'react'

/**
 * Kořen začíná nahoře (DESIGN.md 9.2) — jeden řez trávníkem 0–30 cm
 * (8 px na cm jako `kontrola-sondou` a `podil-z-vlastni-hloubky`) s jedním
 * trsem trávy. Pointa je jedna: kořen začíná v obohacené horní části, ale
 * pokračuje dolů do základu. Nahoře hustá síť jemných kořenů, pod 10 cm
 * jen několik delších, dva sahají k 29 cm, skoro ke dnu profilu.
 *
 * Základ je v celém řezu týž: holá zemina #6b5138 op .9, v legendě
 * „základ" s holým políčkem půdy, stejně jako v `michani-od-hloubky`,
 * `kontrola-sondou`, `tri-zony` a `vedle-sebe-a-v-hloubce` (C1 kapitoly
 * 03). Směs s příměsmi je JEN tmavá tečka #12161b (biochar má v sérii
 * střípek, zeolit světlé zrno s obrysem; světlá tečka by splývala se
 * světlými kořeny, na kterých tu pointa stojí). Není to nová značka
 * příměsi, ale jedna značka „směsi", legenda ji nese v témž panelu
 * pixelově shodnou (9.2 p. 10, úroveň 2). Tečky leží plně do 10 cm
 * a vytrácejí se mezi 10 a 15 cm (maska): autor (i19) nechává zeolit
 * i v 10–15 cm, pod 15 cm je čistý základ. Třetí zónu kresba nekreslí,
 * vytracení je plynulé. Hranice 10 cm je čárkovaná a k levé hraně řezu
 * mizí, části na sebe navazují, nejsou to patra dortu.
 *
 * Rám se záměrně liší od `tri-zony` (řez 80–290, metr vlevo): řez je
 * širší (x 60–332) a nemá metr. Povrch (0 cm) nese drn, hloubky 10
 * a 30 cm stojí u konců závorek vpravo: 10 cm na styku obou závorek, kam
 * míří i čárkovaná hranice. Kořeny rostou z celé šířky krčku (x 178–214)
 * a část jemných vyrůstá z jiných kořenů v 1–3 cm, pod trsem proto
 * nevzniká uzel. Stébla drnu mají vlastní nepravidelný rozestup.
 *
 * Žádná čísla o objemu ani nákladech (dvojnásobek spotřeby nese
 * `podil-z-vlastni-hloubky`), žádná kapka ani akcent (kapka pod kořínkem je
 * motiv `prvni-korinek`). Tečky směsi jsou pevně nasetý rozsyp (mulberry32
 * jako `slehnuti-vstupu`), server i prohlížeč vykreslí totéž.
 *
 * Portrétová sazba 520 px, viewBox 0 0 520 480, id s prefixem `kzn-`.
 * Pravý sloupec (x 358) má 158 jednotek: v sazbě 18/21 končí nejdelší
 * „Pokračování" na x ≈ 504. Horní závorka má jen 80 jednotek, nese proto
 * štítek a jeden řádek `.sv-val`; mezi rámci textů zůstává při 18/21
 * ≥ 4,4 jednotky. Jednotky jen v `.sv-val`. Legenda v jednom řádku,
 * políčko kořenů stojí pod zobáčky závorek (x 340). Statická kresba.
 */

const X = 60 // levá hrana řezu
const W = 272 // šířka řezu (x 60–332)
const T = 156 // povrch, 0 cm
const CM = 8
const B = T + 30 * CM // dno profilu, 396
const DRN = 14
const yCm = (cm: number) => T + cm * CM
const XZ = X + W + 8 // zobáčky závorek, 340
const XT = 358 // text vpravo

const PUDA = { fill: '#6b5138', opacity: 0.9 } as const
const TECKA = { fill: '#12161b', opacity: 0.9 } as const // tečka směsi
const R_TECKY = 1.5
const voditko = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const
const koren = { fill: 'none', stroke: '#d8c9b4', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.8 } as const

/** Tečky směsi v horních 15 cm: pevně nasetý rozsyp s roztečí ≥ 7,5;
 *  středy 4 jednotky od boků řezu. */
const SMES = (() => {
  let s = 0x6b51
  const rnd = () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const ROZTEC = 7.5
  const tecky: [number, number][] = []
  for (let i = 0; i < 8000; i++) {
    const x = Math.round((X + 4 + rnd() * (W - 8)) * 10) / 10
    const y = Math.round((T + 3 + rnd() * (15 * CM - 3)) * 10) / 10
    if (tecky.every(([tx, ty]) => (tx - x) ** 2 + (ty - y) ** 2 >= ROZTEC ** 2)) tecky.push([x, y])
  }
  const r = R_TECKY
  return tecky.map(([x, y]) => `M${Math.round((x - r) * 10) / 10} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`).join('')
})()

/** Jemné kořeny horní části: 12 z krčku (x 178–214), 5 vyrůstá z jiných
 *  kořenů v 1–3 cm; konce ≤ 10 cm, odbočky šikmo dolů. */
const JEMNE = [
  'M178 157.5 C 132.5 163.5, 94.5 183, 78 197.5 M118 174 q-2.5 3 -4 8 M95.5 185.5 q-3 1.5 -7 4',
  'M180 157.5 C 139 166, 108 197, 92 217 M129.5 180.5 q-3 1.5 -7.5 4 M105.5 202 q-0.5 5 0.5 12',
  'M182 157.5 C 151.5 168, 129.5 199.5, 118 229.5 M144 184.5 q-3 1.5 -8 4 M128.5 207 q-0.5 3.5 1 8.5',
  'M185 157.5 C 166 169.5, 150.5 203.5, 142 231 M161.5 185 q-3 1.5 -8 4.5 M150.5 207 q1 4 4 9.5',
  'M188 157.5 C 176.5 168.5, 169 198.5, 164 225 M175 181 q1 3.5 4 8.5',
  'M191 157.5 C 186 168, 182.5 205, 180 232 M185 184 q2 3.5 5 8.5',
  'M201 157.5 C 206.5 166.5, 210 205, 212 230.5 M207 183 q-1.5 3 -5 8',
  'M204 157.5 C 216.5 168.5, 226.5 206, 232 233 M219.5 185.5 q3.5 2.5 8.5 7',
  'M207 157.5 C 227.5 171, 246.5 204, 254 228 M235.5 189 q0 4 -1.5 9.5 M245.5 207 q2.5 1.5 7 4.5',
  'M210 157.5 C 245 166, 268 194.5, 280 221.5 M248 177.5 q4 1.5 9.5 5 M270 203 q-0.5 4 -2.5 10',
  'M212 157.5 C 256 168, 283 190, 302 210.5 M261.5 177.5 q4.5 2 11 5.5 M288.5 197 q1 4 0 10',
  'M214 157.5 C 261.5 164, 299.5 178.5, 318 193 M272.5 170.5 q4 4 6 10 M299.5 181.5 q3.5 1.5 8 4.5',
  'M148 169 C 137 191.5, 117 215, 104 233 M124.5 206 q-2.5 1.5 -7 4',
  'M173 168.5 C 162 191.5, 141.5 216, 128 234.5 M149 206.5 q-3 1.5 -7.5 4',
  'M219 168 C 223.5 184.5, 232.5 202, 238 215 M229 195 q2.5 1.5 7 4.5',
  'M242 167.5 C 254 190, 275.5 214, 290 232 M267.5 204.5 q3.5 1.5 8.5 4.5',
  'M186 177 C 182 197, 175 218.5, 170 234.5 M177.5 210 q-2.5 1.5 -7 4.5',
]

/** Delší kořeny: projdou horní částí a pokračují základem, dva k 29 cm. */
const DLOUHE = [
  'M186 157.5 C 180.5 188, 159 218, 150 244 C 142.5 265, 122.5 285.5, 122 308 M157.5 226.5 q-4.5 1.5 -10.5 4.5 M139 266 q0 4.5 1.5 11',
  'M190 157.5 C 187.5 190.5, 176.5 223.5, 172 252 C 166.5 286.5, 158.5 317, 156 352 M175.5 232.5 q-4 2.5 -9 7 M165.5 287 q1.5 4 4.5 10',
  'M195 157.5 C 194.5 193.5, 193 229.5, 192 260 C 191 305, 188 343, 186 388 M192.5 239 q-3 3.5 -8 8.5 M190.5 305 q2 3.5 6 9 M188 351.5 q-3 2.5 -7 6.5',
  'M200 157.5 C 201.5 193.5, 207.5 229.5, 210 260 C 213.5 303.5, 219 340.5, 222 384 M208 239 q3.5 3 9 7.5 M214.5 304 q-2 3.5 -5.5 9.5 M219 348.5 q2.5 3 6.5 7.5',
  'M205 157.5 C 210.5 188, 231.5 218, 240 244 C 249 270.5, 270.5 296, 268 324 M232.5 226.5 q4 2 10 5.5 M252.5 271.5 q0 4.5 -2 11',
]

/** Stébla drnu: vlastní nepravidelný rozestup, mimo trs. */
const STEBLA =
  'M67 143q1 -4.5 4.5 -8M79 143q0.5 -8 3 -13.5M93 143q-1 -7 -4.5 -11.5M104 143q-0.5 -7 -3.5 -11.5M119 143q1 -4.5 4.5 -7.5' +
  'M131 143q0.5 -8 1.5 -13.5M146 143q0 -5 -1 -8.5M158 143q0.5 -6.5 3.5 -11M170 143q-0.5 -8.5 -2 -14M223 143q-0.5 -9 -2 -15' +
  'M236 143q0 -6.5 -1 -10.5M249 143q0 -7.5 0.5 -13M262 143q-1 -4.5 -4.5 -7.5M276 143q0 -4 -1 -7M289 143q-1 -5 -4 -8.5' +
  'M303 143q0.5 -5 2.5 -8M316 143q0 -6 0 -9.5M326 143q0.5 -4 3 -7'

/** Trs: vyšší stébla z krčku x 189–203 uprostřed řezu. */
const TRS =
  'M189 143 q-3.5 -20.5 -22 -34 M191 143 q-2 -26.5 -14 -44 M193 143 q-1 -30 -6 -50 M196 143 q0 -32.5 1 -54' +
  ' M199 143 q1 -29 8 -48 M201 143 q2.5 -24 16 -40 M203 143 q4 -18 26 -30'

/** Závorka rozsahu od `y1` do `y2`, zobáčky k řezu. */
const Zavorka: React.FC<{ y1: number; y2: number }> = ({ y1, y2 }) => (
  <path d={`M${XZ} ${y1} H${XZ + 6} V${y2} H${XZ}`} fill="none" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
)

// ── legenda ────────────────────────────────────────────────────
const LEG = B + 34 // linka legendy, 430
const R1 = LEG + 30 // řádek legendy (účaří), 460
const VYSKA = 480

/** Políčko základu: holá půda jako „základ" v `michani-od-hloubky`,
 *  `kontrola-sondou` a `tri-zony`. */
const PolickoZakladu: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <rect x={x} y={y} width="14" height="14" rx="3" {...PUDA} />
)

/** Políčko směsi: tatáž půda a tytéž tmavé tečky jako v řezu, tři
 *  v nepravidelném trojúhelníku s roztečí ≥ 7,5 (hustota řezu). */
const PolickoSmesi: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x} y={y} width="14" height="14" rx="3" {...PUDA} />
    <circle cx={x + 3} cy={y + 3.8} r={R_TECKY} {...TECKA} />
    <circle cx={x + 10.8} cy={y + 5} r={R_TECKY} {...TECKA} />
    <circle cx={x + 6.4} cy={y + 11.4} r={R_TECKY} {...TECKA} />
  </g>
)

/** Políčko kořene: kořen #d8c9b4 je vidět jen na půdě (jako v řezu),
 *  na krémovém podkladu by zmizel — proto leží na políčku půdy. */
const PolickoKorene: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <rect x={x} y={y} width="14" height="14" rx="3" {...PUDA} />
    <path d={`M${x + 6} ${y + 1.5} C ${x + 5} ${y + 5}, ${x + 8} ${y + 8}, ${x + 7} ${y + 12.5} M${x + 6.5} ${y + 6} q2.5 1 3.5 4`} {...koren} />
  </g>
)

export const KorenZacinaNahore: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox={`0 0 520 ${VYSKA}`}>
    <defs>
      <clipPath id="kzn-rez"><rect x={X} y={T} width={W} height={B - T} /></clipPath>
      {/* Směs plně do 10 cm (2/3 výšky), pak se k 15 cm vytratí. */}
      <linearGradient id="kzn-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset={10 / 15} stopColor="#fff" stopOpacity="1" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask id="kzn-mask" maskUnits="userSpaceOnUse" x={X} y={T} width={W} height={15 * CM}>
        <rect x={X} y={T} width={W} height={15 * CM} fill="url(#kzn-fade)" />
      </mask>
      {/* hranice 10 cm: od styku závorek plně, k levé hraně řezu se vytratí */}
      <linearGradient id="kzn-fade-h" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0.2" stopColor="#fff" stopOpacity="1" />
        <stop offset="0.85" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask id="kzn-mask-h" maskUnits="userSpaceOnUse" x={X} y={yCm(10) - 6} width={W} height="12">
        <rect x={X} y={yCm(10) - 6} width={W} height="12" fill="url(#kzn-fade-h)" />
      </mask>
    </defs>

    {/* Pointa kresby (9.2 p. 3) je jedna, ve dvou řádcích jako horní a dolní část řezu. */}
    <text className="sv-val" x={X} y="40" style={{ fontSize: 24 }}>Začíná nahoře,</text>
    <text className="sv-val" x={X} y="72" style={{ fontSize: 24 }}>pokračuje dolů</text>

    {/* ── řez: týž základ celou hloubkou, směs nahoře ─────────── */}
    <rect x={X} y={T} width={W} height={B - T} {...PUDA} />
    <path d={SMES} {...TECKA} mask="url(#kzn-mask)" />
    {/* hranice 10 cm: čárkovaná, vytrácí se — žádný řez nožem */}
    <line x1={X + 4} y1={yCm(10)} x2={X + W - 4} y2={yCm(10)} {...voditko} mask="url(#kzn-mask-h)" />
    <g clipPath="url(#kzn-rez)">
      <g {...koren}>
        {JEMNE.map((d) => <path key={d} d={d} />)}
        {DLOUHE.map((d) => <path key={d} d={d} />)}
      </g>
    </g>

    {/* drn + trs; horní hranu nese drn, obrys je proto otevřený (9.2 p. 9) */}
    <rect x={X} y={T - DRN} width={W} height={DRN} fill="#3f7d4e" />
    <path d={`M${X} ${T} H${X + W}`} stroke="#2e6440" strokeWidth="1.6" fill="none" />
    <path d={STEBLA} fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" />
    <path d={TRS} fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" />
    <path d={`M${X} ${T - DRN} V${B} H${X + W} V${T - DRN}`} fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* ── závorky vpravo, hloubky u jejich konců ──────────────── */}
    <Zavorka y1={yCm(0) + 2} y2={yCm(10) - 2} />
    <Zavorka y1={yCm(10) + 2} y2={yCm(30) - 2} />

    {/* povrch (0 cm) nese drn; hloubky 10 a 30 cm stojí u konců závorek */}
    <text className="sv-lbl" x={XT} y={yCm(0) + 17}>Začátek</text>
    <text className="sv-val" x={XT} y={yCm(0) + 44}>kořen startuje</text>
    <text className="sv-val" x={XT} y={yCm(10) + 6}>10 cm</text>

    {/* blok pokračování na středu mezi 10 a 30 cm */}
    <text className="sv-lbl" x={XT} y={yCm(20) - 18}>Pokračování</text>
    <text className="sv-val" x={XT} y={yCm(20) + 9}>méně příměsí,</text>
    <text className="sv-val" x={XT} y={yCm(20) + 36}>týž základ</text>
    <text className="sv-val" x={XT} y={yCm(30) + 6}>30 cm</text>

    {/* ── legenda: značky pixelově shodné s řezem (9.2 p. 10) ──── */}
    <line x1="30" y1={LEG} x2="490" y2={LEG} {...voditko} />
    <PolickoZakladu x={30} y={R1 - 12} />
    <text className="sv-val" x="52" y={R1}>základ</text>
    <PolickoSmesi x={140} y={R1 - 12} />
    <text className="sv-val" x="162" y={R1}>směs s příměsmi</text>
    <PolickoKorene x={340} y={R1 - 12} />
    <text className="sv-val" x="362" y={R1}>kořeny</text>
  </svg>
)
