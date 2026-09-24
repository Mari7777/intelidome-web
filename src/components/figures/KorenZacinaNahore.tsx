import React from 'react'

/**
 * Kořen začíná nahoře (DESIGN.md 9.2) — jeden řez trávníkem 0–30 cm s jedním
 * trsem trávy. Pointa je jedna (24 px): kořen začíná v obohacené horní části,
 * ale pokračuje dolů do základu. Jemných kořenů ubývá s hloubkou plynule:
 * konce leží mezi 4,6 a 8,8 cm, pět jich překročí hranici 10 cm a končí
 * v 11,5–13,7 cm, žádný konec neleží v pásu 9,4–10,6 ani 14,4–15,6 cm
 * (nečte se jako „kořeny končí na hranici"); platí to i pro odbočky.
 * Pět delších kořenů projde všemi zónami, dva končí v 28,5 a 29 cm, skoro
 * u dna profilu.
 *
 * Zóny jsou přesně ty z textu C2 a mají ostré hranice (model článku):
 * – 0–10 cm plná směs: střípky biocharu a zrna zeolitu,
 * – 10–15 cm jen zrna zeolitu,
 * – 15–30 cm samotný základ, holá hnědá plocha #6b5138 op .9.
 * Zeolit leží v obou horních zónách, protože autor ho dává do plné směsi
 * a říká, že v 10–15 cm „pokračuje". Actino je v textu „případně", proto
 * v řezu není. Značky jsou tvary série (`jedna-zmena-naraz`, `dve-zahrady`,
 * `mh-plna`): střípek `b1` / `b2` #12161b op .9 (střídají se podle pořadí)
 * a zrno #d5d3cc s obrysem #232830 1,6. Zrna leží ≥ 8,1 od os kořenů
 * a ≥ 9,5 od hranic zón, střípky ≥ 6 od os kořenů, ≥ 11,5 od středů zrn,
 * rozteč ≥ 10, hroty ≥ 3,7 nad čárkou 10 cm. Rozsypy jsou pevné seznamy
 * (změřeno getPointAtLength ve vykreslené kresbě).
 *
 * Kořen = jádro #d8c9b4 op .9 / 1,6 bez lemu: na hnědé zemině je vidět
 * sám, lem potřebuje jen světlý nebo okrový podklad. Kořeny rostou z celé
 * šířky krčku (x 188–222), část jemných vyrůstá z jiných kořenů v 1–3 cm,
 * pod trsem proto nevzniká uzel.
 *
 * Rám série (8 px na cm): řez x 80–330, povrch y 136, dno y 376, stupnice
 * 0 / 10 / 15 / 30 visí vlevo jako v `zaklad-tri-zahrad`, hranice 10 a 15 cm
 * jsou čárkované #d5d3cc 3 7 přes celou šířku. Vpravo tři závorky podle
 * zón, štítky x 350. Žádná čísla o objemu ani nákladech a žádný akcent.
 *
 * Portrétová sazba 520 × 460. Kresba nemá žádné id, prefix `kzn-` je
 * rezervovaný. Jednotky jen v `.sv-val` (stupnice). Legenda v jednom
 * řádku: základ, zeolit a kořeny jako čip zeminy 28 × 14 s ostrými rohy
 * a obrysem (vzor `pisek-pod-koreny`, zrno a kořen leží na zemině jako
 * v řezu), střípek biocharu holý na panelu jako v `dve-zahrady`
 * a `jedna-zmena-naraz`. Změřeno
 * (getBBox): mezery mezi položkami legendy při 15 px 31 / 34 / 30,
 * při 18/21 jednotkách 13,5 / 13 / 15,5; nejdelší štítek vpravo
 * „kořeny pokračují" končí při 21 jednotkách na x ≈ 507, nejmenší svislá
 * mezera mezi štítky je 4,4. Statická kresba.
 */

const X0 = 80 // levá hrana řezu
const X1 = 330 // pravá hrana řezu
const T = 136 // povrch, 0 cm
const CM = 8
const B = T + 30 * CM // dno profilu, 376
const DRN = 14
const yCm = (cm: number) => T + cm * CM
const ZONY = [10, 15] // hranice zón z textu C2
const XZ = X1 + 6 // zobáčky závorek, 336
const XT = 350 // štítky vpravo (jako `pisek-pod-koreny`)

const PUDA = { fill: '#6b5138', opacity: 0.9 } as const
const BIOCHAR = { fill: '#12161b', opacity: 0.9 } as const
const ZEOLIT = { fill: '#d5d3cc', stroke: '#232830', strokeWidth: 1.6 } as const
const obrys = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
const voditko = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const
const koren = { fill: 'none', stroke: '#d8c9b4', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.9 } as const

/** Zrno zeolitu se středem v `x`, `y` (tvar `z` série, 10 × 10 bez tahu). */
const zrno = (x: number, y: number) => `M${x - 4} ${y - 3}l5 -2 4 3 -1 5 -5 2 -4 -3z`

/** Střípek biocharu se středem v `x`, `y`: sudé pořadí = `b1`, liché = `b2`. */
const stripek = (x: number, y: number, i: number) =>
  i % 2 ? `M${x - 3.5} ${y - 1.5}l5 -2 2 4 -4 3z` : `M${x - 4} ${y - 0.5}l5 -3 3 4 -4 3z`

/** Středy zrn zeolitu, pevný rozsyp. 0–10 cm: y 146–206,5, rozteč ≥ 22,
 *  dvě zrna uvnitř vějíře kořenů (x 157,5 a 178). 10–15 cm: rozteč ≥ 30,
 *  rozházená po celé výšce zóny (y 226–246). Okraj zrna od boků řezu ≥ 4. */
const ZRNA: [number, number][] = [
  [125.5, 146], [294, 147], [103.5, 147.5], [317.5, 155], [91.5, 166], [300, 172], [112, 174], [157.5, 176],
  [258.5, 180], [317, 188], [295, 195.5], [92.5, 198.5], [114.5, 201.5], [228, 202.5], [269.5, 203], [178, 206.5],
  [92, 239], [122, 244.5], [147, 226], [169.5, 246], [192.5, 226.5], [227.5, 244], [257, 226.5], [289, 237.5],
  [319, 242.5],
]

/** Středy střípků biocharu jen v 0–10 cm: y 143,5–208, hroty y 140–211,5. */
const STRIPKY: [number, number][] = [
  [88.5, 143.5], [320, 143.5], [277.5, 144], [137.5, 144.5], [309.5, 146.5], [115, 151.5], [88.5, 153.5], [306, 156],
  [106.5, 159.5], [244.5, 160], [167.5, 160.5], [288, 164], [322, 166], [122, 167.5], [252.5, 169.5], [138.5, 171.5],
  [276, 171.5], [174.5, 176], [314, 176], [100.5, 179], [284, 179], [306, 182], [129, 182.5], [92, 184.5],
  [150, 185.5], [169.5, 185.5], [267.5, 189], [100.5, 190], [225, 190.5], [307, 197.5], [164.5, 199.5], [322, 199.5],
  [245.5, 201.5], [141, 202], [314, 205.5], [155.5, 206.5], [300.5, 206.5], [282.5, 207], [103, 207.5], [209, 207.5],
  [196, 208], [253.5, 208],
]

/** Jemné kořeny: 12 z krčku (x 188–222), 5 vyrůstá z jiných kořenů
 *  v 1–3 cm; odbočky šikmo dolů. Dvanáct končí v 4,6–8,8 cm, pět
 *  (3., 9., 13., 14., 16.) přejde hranici 10 cm a končí v 11,5–13,7 cm. */
const JEMNE = [
  'M188 137.5 C 144.5 143.5, 108.5 163, 93 177.5 M131 154 q-2.5 3 -4 8 M109.5 165.5 q-3 1.5 -6.5 4',
  'M190 137.5 C 151 146, 121.5 177, 106 197 M142 160.5 q-3 1.5 -7 4 M119 182 q-0.5 5 0.5 12',
  'M191.5 137.5 C 162.5 148, 142 179.5, 131 209.5 C 128 218.5, 120.5 226, 119 235 M155.5 164.5 q-3 1.5 -7.5 4.5 M141 187 q-0.5 3.5 1 8.5',
  'M194.5 137.5 C 179.5 147.5, 167 172.5, 158.5 197 M172 165 q-3 1.5 -7.5 4.5',
  'M197.5 137.5 C 189.5 145.5, 183.5 164.5, 178.5 185 M185 161 q1 3.5 4 8.5',
  'M200.5 137.5 C 196 147, 193 177.5, 190.5 203 M194.5 164 q2 3.5 5 8.5',
  'M210 137.5 C 214.5 146, 218 179.5, 219.5 205 M215.5 163 q-1.5 3 -4.5 8',
  'M212.5 137.5 C 223.5 147.5, 232.5 180, 237.5 206.5 M227.5 165.5 q3.5 2.5 8 7',
  'M215.5 137.5 C 235 151, 253 184, 260 208 C 262 215, 265.5 221.5, 266.5 229 M242.5 169 q0 4 -1.5 9.5 M252 187 q2.5 1.5 6.5 4.5',
  'M218.5 137.5 C 251.5 146, 273.5 174.5, 285 201.5 M254.5 157.5 q4 1.5 9 5 M275.5 183 q-0.5 4 -2.5 10',
  'M220 137.5 C 262 148, 287.5 170, 305.5 190.5 M267 157.5 q4.5 2 10.5 5.5 M293 177 q1 4 0 10',
  'M222 137.5 C 267 144, 303.5 158.5, 321 173 M277.5 150.5 q4 4 5.5 10 M303.5 161.5 q3.5 1.5 7.5 4.5',
  'M159.5 149 C 149 171.5, 130 195, 117.5 213 C 111 222.5, 107 234.5, 103.5 245.5 M137 186 q-2.5 1.5 -6.5 4',
  'M183 148.5 C 172.5 171.5, 153 196, 140.5 214.5 C 138 218.5, 137.5 223.5, 136 228 M160.5 186.5 q-3 1.5 -7 4',
  'M227 148 C 231 164.5, 239.5 182, 245 195 M236.5 175 q2.5 1.5 6.5 4.5',
  'M248.5 147.5 C 260 170, 280.5 194, 294.5 212 C 300.5 220, 308.5 227, 312 237 M273 184.5 q3.5 1.5 8 4.5',
  'M195.5 157 C 193 169.5, 189.5 182.5, 186 194.5',
]

/** Delší kořeny: projdou všemi zónami a pokračují základem, dva ke 28–29 cm.
 *  Odbočky mimo pásy hranic zón. */
const DLOUHE = [
  'M195.5 137.5 C 190.5 168, 170 198, 161.5 224 C 154 245, 135 265.5, 134.5 288 M140 266 q1 4 4 9.5',
  'M199.5 137.5 C 197 170.5, 186.5 203.5, 182 232 C 177 266.5, 169.5 297, 167 332 M178 258 q-4 2.5 -8.5 7 M173 285 q1.5 4 4.5 10',
  'M204 137.5 C 203.5 173.5, 202 209.5, 201 240 C 200.5 285, 197.5 323, 195.5 368 M201.5 232 q-3 3.5 -7.5 8.5 M200 285 q2 3.5 5.5 9 M197.5 331.5 q-3 2.5 -6.5 6.5',
  'M209 137.5 C 210 173.5, 216 209.5, 218.5 240 C 221.5 283.5, 227 320.5, 229.5 364 M217 224 q3.5 3 8.5 7.5 M222.5 284 q-2 3.5 -5 9.5 M227 328.5 q2.5 3 6 7.5',
  'M213.5 137.5 C 219 168, 238.5 198, 247 224 C 255.5 250.5, 276 276, 273.5 304 M265.5 266 q0 4.5 -2 11',
]

/** Stébla drnu: vlastní nepravidelný rozestup, mimo trs. */
const STEBLA =
  'M88 123q0.5 -8 3 -13.5M102 123q-1 -7 -4.5 -11.5M113 123q-0.5 -7 -3.5 -11.5M128 123q1 -4.5 4.5 -7.5' +
  'M140 123q0.5 -8 1.5 -13.5M155 123q0 -5 -1 -8.5M167 123q0.5 -6.5 3.5 -11M179 123q-0.5 -8.5 -2 -14M232 123q-0.5 -9 -2 -15' +
  'M245 123q0 -6.5 -1 -10.5M258 123q0 -7.5 0.5 -13M271 123q-1 -4.5 -4.5 -7.5M285 123q0 -4 -1 -7M298 123q-1 -5 -4 -8.5' +
  'M312 123q0.5 -5 2.5 -8M325 123q0 -6 0 -9.5'

/** Trs: vyšší stébla z krčku x 198–212 uprostřed řezu. */
const TRS =
  'M198 123 q-3.5 -20.5 -22 -34 M200 123 q-2 -26.5 -14 -44 M202 123 q-1 -30 -6 -50 M205 123 q0 -32.5 1 -54' +
  ' M208 123 q1 -29 8 -48 M210 123 q2.5 -24 16 -40 M212 123 q4 -18 26 -30'

/** Závorka zóny od `od` do `do_` cm, zobáčky k řezu. */
const Zavorka: React.FC<{ od: number; do_: number }> = ({ od, do_ }) => (
  <path d={`M${XZ} ${yCm(od) + 2} H${XZ + 6} V${yCm(do_) - 2} H${XZ}`} fill="none" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
)

// ── legenda ────────────────────────────────────────────────────
const LEG = B + 34 // linka legendy, 410
const R1 = LEG + 30 // účaří legendy, 440
const VYSKA = 460
const CY = R1 - 12 // horní hrana čipů

/** Čip 28 × 14: výřez zeminy řezu s ostrými rohy a obrysem hmoty. */
const Cip: React.FC<{ x: number; children?: React.ReactNode }> = ({ x, children }) => (
  <>
    <rect x={x} y={CY} width="28" height="14" {...PUDA} />
    {children}
    <path d={`M${x} ${CY} H${x + 28} V${CY + 14} H${x} Z`} {...obrys} />
  </>
)

// sloupce legendy (klíč na x, střípek na x + 10, text na x + 36)
const L_BIO = 131
const L_ZEOLIT = 252
const L_KOREN = 354

export const KorenZacinaNahore: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox={`0 0 520 ${VYSKA}`}>
    {/* Pointa kresby (9.2 p. 3) je jedna, klíčová hodnota 24 px. */}
    <text className="sv-val" x="40" y="40" style={{ fontSize: 24 }}>Začíná nahoře, pokračuje dolů</text>

    {/* ── stupnice: povrch, hranice zón, dno (vzor `zaklad-tri-zahrad`) ── */}
    <line x1="62" y1={T} x2="62" y2={B} {...voditko} />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      {[0, ...ZONY, 30].map((cm) => (
        <line key={cm} x1="56" y1={yCm(cm)} x2="68" y2={yCm(cm)} />
      ))}
    </g>
    <g textAnchor="end">
      <text className="sv-val" x="50" y={T + 5}>0 cm</text>
      {ZONY.map((cm) => (
        <text key={cm} className="sv-val" x="50" y={yCm(cm) + 5}>{cm}</text>
      ))}
      <text className="sv-val" x="50" y={B + 5}>30</text>
    </g>

    {/* ── řez: plná směs do 10 cm, zeolit do 15 cm, pod ním samotný základ ── */}
    <rect x={X0} y={T} width={X1 - X0} height={B - T} {...PUDA} />
    <path d={STRIPKY.map(([x, y], i) => stripek(x, y, i)).join('')} {...BIOCHAR} />
    <path d={ZRNA.map(([x, y]) => zrno(x, y)).join('')} {...ZEOLIT} />
    {ZONY.map((cm) => (
      <line key={cm} x1={X0 + 4} y1={yCm(cm)} x2={X1 - 4} y2={yCm(cm)} {...voditko} />
    ))}
    <g {...koren}>
      {JEMNE.map((d) => <path key={d} d={d} />)}
      {DLOUHE.map((d) => <path key={d} d={d} />)}
    </g>

    {/* drn + trs; horní hranu nese drn, obrys je proto otevřený (9.2 p. 9) */}
    <rect x={X0} y={T - DRN} width={X1 - X0} height={DRN} fill="#3f7d4e" />
    <path d={`M${X0} ${T} H${X1}`} stroke="#2e6440" strokeWidth="1.6" fill="none" />
    <path d={STEBLA} fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" />
    <path d={TRS} fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" />
    <path d={`M${X0} ${T - DRN} V${B} H${X1} V${T - DRN}`} {...obrys} />

    {/* ── závorky zón vpravo a jejich štítky ────────────────────── */}
    <Zavorka od={0} do_={10} />
    <Zavorka od={10} do_={15} />
    <Zavorka od={15} do_={30} />

    <text className="sv-lbl" x={XT} y={T + 17}>Začátek</text>
    <text className="sv-val" x={XT} y={T + 44}>nejvíc kořenů,</text>
    <text className="sv-val" x={XT} y={T + 71}>plná směs</text>

    <text className="sv-lbl" x={XT} y={yCm(10) + 26}>Jen zeolit</text>

    <text className="sv-lbl" x={XT} y={yCm(15) + 52}>Bez příměsí</text>
    <text className="sv-val" x={XT} y={yCm(15) + 79}>kořeny pokračují</text>

    {/* ── legenda: značky pixelově shodné s řezem (9.2 p. 10) ───── */}
    <line x1="30" y1={LEG} x2="490" y2={LEG} {...voditko} />
    <Cip x={30} />
    <text className="sv-val" x="66" y={R1}>základ</text>
    <path d={`M${L_BIO + 10} ${R1 - 5.5}l5 -3 3 4 -4 3z`} {...BIOCHAR} />
    <text className="sv-val" x={L_BIO + 36} y={R1}>biochar</text>
    <Cip x={L_ZEOLIT}>
      <path d={zrno(L_ZEOLIT + 14, CY + 7)} {...ZEOLIT} />
    </Cip>
    <text className="sv-val" x={L_ZEOLIT + 36} y={R1}>zeolit</text>
    <Cip x={L_KOREN}>
      <path
        d={`M${L_KOREN + 10} ${CY + 1} C ${L_KOREN + 9} ${CY + 5}, ${L_KOREN + 11} ${CY + 9}, ${L_KOREN + 10} ${CY + 13}M${L_KOREN + 10} ${CY + 5} C ${L_KOREN + 14} ${CY + 6}, ${L_KOREN + 18} ${CY + 9}, ${L_KOREN + 20} ${CY + 12}`}
        {...koren}
      />
    </Cip>
    <text className="sv-val" x={L_KOREN + 36} y={R1}>kořeny</text>
  </svg>
)
