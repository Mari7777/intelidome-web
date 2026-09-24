import React from 'react'

/**
 * Jíl jako vana (DESIGN.md 9.2) — jeden řez 0–30 cm (8 px na cm jako
 * `prvni-korinek` a `pisek-pod-koreny`). Nová propustná směs 65/35 leží
 * v utuženém jílu jako v míse: jíl ji obepíná zespodu i z boků. Voda
 * (kapka nad drnem, čárkovaná cesta) směsí projde, ale na jílovém dně se
 * zastaví a stojí v míse až k hladině. Šipka dosedá hrotem na hladinu.
 * Kořeny hladinu protínají a končí v mokré vrstvě, kde je málo vzduchu
 * (text: „zhutnění omezí vzduch").
 *
 * Pointa je jedna: nejdřív odtok, teprve potom směs. Kresba je schéma.
 * Nemá žádná čísla o vsaku ani rychlosti, jen měřítko 0 / 30 cm. Hloubka
 * okraje mísy (12 cm) i výška hladiny jsou schematické, text je neuvádí.
 *
 * Značky (9.2 p. 10):
 * – nová směs = značka směsi 65/35 z `slehnuti-vstupu`: okrový podklad
 *   #c2a052 op .55 a hnědé tečky zeminy #6b5138 op .9 r 2,2 / 2,4 / 2,6.
 *   Rozsyp je pevně nasetý (mulberry32), rozteč 8, házení šipek až do
 *   zaplnění (~400 teček), každá tečka ≥ 3 od vnitřní hrany obrysu.
 *   Kreslí se jednou cestou. Není to mřížka, ta se četla jako tapeta.
 * – utužený jíl = #54402c op .95 a světlé lamely 8 × 5 (`jjv-lis`; táž
 *   výplň utužené vrstvy jako `hpm-lis`, `pp-lis`, `tc-lis`). Lamely leží
 *   v y ≡ 2,5 mod 5 v celé kresbě, čip legendy proto nese tutéž fázi
 *   jako řez (horní hrana čipu 528 ≡ 3 mod 5).
 * – kořen = značka kořene článku: jádro #d8c9b4 op .9 / 1,6 jako
 *   v `koren-zacina-nahore`, `pisek-pod-koreny` a `nabity-biochar`
 *   (paleta 9.2 uvádí op .8; odchylka je společná celé sérii, ne jen
 *   této kresbě). Na okrové leží jádro na lemu #232830 op .5 / 2,4 jako
 *   v `pisek-pod-koreny`. Holý kořen by na okrové zmizel, plně tmavý obal
 *   se četl jako kabel. Lemy všech kořenů leží pod všemi jádry, odbočky
 *   proto nemají tmavý zářez.
 * – kapka, cesta a šipka vody = `dve-zahrady` / `pisek-pod-koreny`
 *   (kapka A 7 7, čárky 3 7, šipka l8 10 8 -10 op .75).
 * – stojící voda („voda v nádobě"): hladina (tah #2563eb 1,6 op .75, týž
 *   jako šipka), pod ní tinta #93c5fd op .45 a přes ni nádech `jjv-voda`
 *   (stopy 9.2 .34 → .14 → .05, střed na dně mísy, pod hladinou ≈ .14).
 *   Boky a dno nese obrys mísy, horní hranu hladina (obdoba V…H…V
 *   u drnu, 9.2 p. 9). Samotný nádech na okrové zešedl: modrá a okrová
 *   se v průhlednosti ruší, i ve středu dna (.34) vyšla sytost jen 0,13,
 *   jinde ve vrstvě 0,01–0,08. Tinta téhož motivu (9.2 p. 1) ho drží
 *   modrý. Měřeno ve 2× renderu mimo tečky, y 330–350: (153, 176, 206),
 *   sytost 0,26; pod hladinou u stěny 0,20. Tečky zeminy leží na vodě,
 *   směs je pod hladinou táž.
 * Tečky se vyhýbají kořenům (lem 1,2 + r + 2 od osy), hladině, cestě
 * vody (i nad okrajem mísy) a vnitřním vodítkům.
 *
 * Portrétová sazba 520 px, id s prefixem `jjv-`. Pointa vlevo na x 40
 * (nadpis kresby jako v celé sérii), řez x 80–330 (drn 14), stupnice
 * visí vlevo, štítky vpravo od x 356. Každý štítek má hmotu nebo jev
 * (`.sv-lbl`) a vlastnost (`.sv-val`), ≤ 12 znaků na řádek. Na telefonu
 * (18/21 jednotek) končí nejdál na x ≈ 487. Vodítka KOŘENY a VODA vedou
 * přes stěnu mísy až k cíli (konec kořene, mokrá vrstva u dna). Uvnitř
 * řezu (x 80–330) jsou bílá op .7 (konstrukční linka na světlé zemině,
 * jako `vodSvetle` v `pisek-pod-koreny`), a to i přes posledních ~30
 * jednotek tmavé stěny jílu: konstrukční linka na tmavé zemi podle 9.2
 * (bílá .12–.14) by na jílu zmizela a vodítko by se rozpadlo na dva
 * kusy. Venku (od x 330) jsou #d5d3cc, rytmus čárek je jeden. Popisek
 * → hodnota má rozteč 27. Vodítka skupin jsou od sebe
 * ≥ 59, takže mezi skupinami zůstane v mobilní sazbě ≥ 12 jednotek
 * (uvnitř skupiny ≈ 6) a skupiny se nesmísí. Jednotka „cm" stojí jen
 * v `.sv-val`.
 * Legenda: čipy 28 × 14, ostré rohy, obrys #232830 1,6, výplň z téže
 * hmoty jako řez. 1. řádek: nová směs · utužený jíl · voda stojí. Čip
 * vody je táž směs s tintou a nádechem (tečky na týchž místech jako
 * v čipu nové směsi), horní hranu nese hladina. Kapka v legendě není,
 * vodu vysvětluje čip, který nese pointu. Třetí čip stojí na ose štítků
 * x 356, mezery mezi položkami jsou vyrovnané pro 18/21 (≈ 28).
 * 2. řádek (rozteč 32): kořeny. Kořen je světlá značka viditelná jen na
 * půdě, stojí proto (pravidlo `pisek-pod-koreny`) na čipu téže hmoty, ve
 * které v řezu roste: nová směs, okrový podklad #c2a052 op .55 s tečkou
 * zeminy. Tečka r 2,2 leží na jediném místě čipu, kam se vejde s odstupy
 * řezu: 3 od vnitřní hrany obrysu, od lemu kořene ≈ 2 (1,99). Kořen
 * v legendě kreslí táž komponenta `Koreny` (lem 2,4 + jádro) jako řez,
 * takže je s ním pixelově shodný. Tvar výseku je týž jako v legendě
 * `pisek-pod-koreny` (tam také na okrové s lemem) a `koren-zacina-nahore`
 * (tam na hnědé zemině bez lemu, jako kořeny v jejím řezu).
 * ViewBox 520 × 600 (rytmus splitu E2 je spočítaný pro 600). Vzduch
 * leží mezi pointou a řezem a mezi řezem a legendou, řez drží 8 px na
 * cm. Statická kresba.
 */

// ── geometrie řezu ───────────────────────────────────────────────
const X0 = 80 // levá hrana řezu
const X1 = 330 // pravá hrana řezu
const STENA = 30 // tloušťka stěn mísy
const CL = X0 + STENA // 110 — vnitřní líc levé stěny
const CR = X1 - STENA // 300 — vnitřní líc pravé stěny
const CM = 8
const DRN = 128 // horní hrana drnu
const TOP = DRN + 14 // 142 — 0 cm, povrch směsi pod drnem
const BOT = TOP + 30 * CM // 382 — 30 cm, dno mísy
const RIM = TOP + 12 * CM // 238 — okraj mísy (schéma)
const SB = BOT + 9 * CM // 454 — spodní hrana řezu (jíl pokračuje)
const R_OKRAJ = 14 // zaoblení okraje mísy
const R_DNO = 20 // zaoblení dna mísy

// ── voda ─────────────────────────────────────────────────────────
const WX = 228 // svislá cesta vody
const KAPKA_Y = DRN - 32 // 96 — špička kapky nad drnem
const CX = (CL + CR) / 2 // 205 — střed mísy
const HLADINA = 304 // hladina stojící vody (schéma), 12–16 nad špičkami kořenů
const SIPKA_Y = HLADINA - 10 // 294 — šipka 294–304, hrotem dosedá na hladinu

// ── štítky vpravo: výška vodítka ─────────────────────────────────
const LX = X1 + 26 // 356
const Y_SMES = 188 // nová směs nad okrajem mísy
const Y_KOREN = TOP + 176 // 318 — konec pravého kořene
const Y_VODA = BOT - 5 // 377 — mokrá vrstva těsně nad dnem
const Y_JIL = 440 // jíl pod dnem mísy
const KONEC_KOREN = 278 // vodítko končí u špičky pravého kořene (x 273)
const KONEC_VODA = 266 // vodítko končí v mokré vrstvě u dna
const LEG = 506 // linka legendy; čipy na LEG + 22 = 528

/** Štítky vpravo: [výška vodítka, popisek, hodnota]. */
const STITKY: [number, string, string][] = [
  [Y_SMES, 'nová směs', 'propustná'],
  [Y_KOREN, 'kořeny', 'málo vzduchu'],
  [Y_VODA, 'voda', 'se zastaví'],
  [Y_JIL, 'utužený jíl', 'brzdí odtok'], // text: zhutnění „omezí … pohyb přebytečné vody", ne „nepropustný"
]

/** Hranice směs × jíl (mísa) zleva doprava. Kreslí se jednou jako obrys obou hmot. */
const MISA =
  `M${X0} ${RIM} H${CL - R_OKRAJ} Q${CL} ${RIM} ${CL} ${RIM + R_OKRAJ} ` +
  `V${BOT - R_DNO} Q${CL} ${BOT} ${CL + R_DNO} ${BOT} H${CR - R_DNO} ` +
  `Q${CR} ${BOT} ${CR} ${BOT - R_DNO} V${RIM + R_OKRAJ} Q${CR} ${RIM} ${CR + R_OKRAJ} ${RIM} H${X1}`

/** Nová směs: nad okrajem přes celou šířku, pod ním jen v míse. */
const SMES =
  `M${X0} ${TOP} H${X1} V${RIM} H${CR + R_OKRAJ} Q${CR} ${RIM} ${CR} ${RIM + R_OKRAJ} ` +
  `V${BOT - R_DNO} Q${CR} ${BOT} ${CR - R_DNO} ${BOT} H${CL + R_DNO} ` +
  `Q${CL} ${BOT} ${CL} ${BOT - R_DNO} V${RIM + R_OKRAJ} Q${CL} ${RIM} ${CL - R_OKRAJ} ${RIM} H${X0} Z`

/** Utužený jíl: stěny a dno mísy až po spodní hranu řezu. */
const JIL = `${MISA} V${SB} H${X0} Z`

/** Stojící voda: v míse od hladiny ke dnu. Stěny jsou v té výšce svislé
 *  (oblouky okraje končí na y 252, dna začínají na y 362), takže boky
 *  a dno leží přesně na hranici mísy a obrys nese MISA. */
const VODA = `M${CL} ${HLADINA} H${CR} V${BOT - R_DNO} Q${CR} ${BOT} ${CR - R_DNO} ${BOT} H${CL + R_DNO} Q${CL} ${BOT} ${CL} ${BOT - R_DNO} Z`

type Bod = [number, number]
const d1 = (n: number) => Math.round(n * 10) / 10

/** Úsečkový obrys směsi (táž cesta jako SMES, oblouky po 12 krocích). */
const OBRYS_SMESI: Bod[] = (() => {
  const P: Bod[] = [[X0, TOP], [X1, TOP], [X1, RIM], [CR + R_OKRAJ, RIM]]
  const q = (a: Bod, c: Bod, b: Bod) => {
    for (let i = 1; i <= 12; i++) {
      const t = i / 12
      const u = 1 - t
      P.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]])
    }
  }
  q([CR + R_OKRAJ, RIM], [CR, RIM], [CR, RIM + R_OKRAJ])
  P.push([CR, BOT - R_DNO])
  q([CR, BOT - R_DNO], [CR, BOT], [CR - R_DNO, BOT])
  P.push([CL + R_DNO, BOT])
  q([CL + R_DNO, BOT], [CL, BOT], [CL, BOT - R_DNO])
  P.push([CL, RIM + R_OKRAJ])
  q([CL, RIM + R_OKRAJ], [CL, RIM], [CL - R_OKRAJ, RIM])
  P.push([X0, RIM])
  return P
})()

/** Vzdálenost bodu od úsečky ab. */
const kUsecce = (x: number, y: number, a: Bod, b: Bod) => {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]]
  const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1)))
  return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy)
}
/** Nejmenší vzdálenost od lomené čáry (uzavřené, je-li `zavrit`). */
const kLomene = (x: number, y: number, P: Bod[], zavrit: boolean) => {
  let m = Infinity
  for (let i = 0; i < P.length - (zavrit ? 0 : 1); i++) m = Math.min(m, kUsecce(x, y, P[i], P[(i + 1) % P.length]))
  return m
}
/** Paprskový test: leží bod uvnitř mnohoúhelníku? */
const uvnitr = (x: number, y: number, P: Bod[]) => {
  let v = false
  for (let i = 0, j = P.length - 1; i < P.length; j = i++)
    if (P[i][1] > y !== P[j][1] > y && x < ((P[j][0] - P[i][0]) * (y - P[i][1])) / (P[j][1] - P[i][1]) + P[i][0]) v = !v
  return v
}

// ── kořeny ───────────────────────────────────────────────────────
/** Tahy kořenů: [x0, y0, (c1x c1y c2x c2y x y)…], y od povrchu směsi.
 *  Hlavní kořeny končí 12–16 jednotek pod hladinou (y 316–320). */
const KORENY: number[][] = [
  [138, 0, 135, 40, 141, 90, 137, 136, 136, 152, 139, 166, 138, 178],
  [138, 26, 128, 36, 122, 44, 118, 56],
  [137, 78, 146, 88, 152, 96, 156, 108],
  [137, 126, 129, 136, 125, 144, 123, 156],
  [182, 0, 186, 44, 178, 94, 184, 142, 185, 154, 182, 164, 181, 174],
  [183, 32, 192, 40, 198, 48, 202, 60],
  [181, 86, 172, 96, 166, 106, 164, 118],
  [184, 136, 192, 146, 196, 154, 198, 166],
  [272, 0, 268, 40, 276, 92, 270, 138, 269, 152, 272, 164, 273, Y_KOREN - TOP],
  [272, 18, 282, 28, 288, 36, 292, 48],
  [271, 70, 262, 80, 256, 88, 252, 100],
  [270, 120, 278, 130, 284, 138, 288, 150],
]
/** Tah jako lomená čára: `n` kroků na každý Bézierův oblouk. */
const lomena = ([x, y, ...c]: number[], n: number): Bod[] => {
  const P: Bod[] = [[x, y]]
  for (let k = 0; k < c.length / 6; k++) {
    const [x0, y0] = P[P.length - 1]
    const [ax, ay, bx, by, px, py] = c.slice(k * 6, k * 6 + 6)
    for (let i = 1; i <= n; i++) {
      const t = i / n
      const u = 1 - t
      P.push([
        u ** 3 * x0 + 3 * u * u * t * ax + 3 * u * t * t * bx + t ** 3 * px,
        u ** 3 * y0 + 3 * u * u * t * ay + 3 * u * t * t * by + t ** 3 * py,
      ])
    }
  }
  return P
}
/** Tahy v souřadnicích kresby. Odbočka začíná přesně na ose hlavního
 *  kořene (nejbližší bod), jinak by kulatý konec jejího obrysu vyčníval
 *  na druhé straně jako uzlík. */
const KORENY_ABS: number[][] = (() => {
  const abs = KORENY.map((t) => t.map((v, i) => (i % 2 ? TOP + v : v)))
  const osy = abs.filter((t) => t[1] === TOP).map((t) => lomena(t, 64))
  return abs.map((t) => {
    if (t[1] === TOP) return t
    let [bx, by, m] = [t[0], t[1], Infinity]
    for (const P of osy)
      for (const [x, y] of P) {
        const v = Math.hypot(x - t[0], y - t[1])
        if (v < m) [bx, by, m] = [x, y, v]
      }
    return [d1(bx), d1(by), ...t.slice(2)]
  })
})()
const KORENY_D = KORENY_ABS.map(
  ([x, y, ...c]) =>
    `M${x} ${y}` + Array.from({ length: c.length / 6 }, (_, k) => `C${c.slice(k * 6, k * 6 + 6).join(' ')}`).join(''),
).join('')
/** Kořeny jako lomené čáry (po 16 krocích na oblouk) pro odstup teček. */
const KORENY_BODY: Bod[][] = KORENY_ABS.map((t) => lomena(t, 16))

// ── tečky zeminy ve směsi (značka `slehnuti-vstupu`) ─────────────
/** Pevně nasetý generátor (mulberry32), server i prohlížeč vykreslí totéž. */
const rng = (seed: number) => {
  let s = seed
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Jemné částice zeminy v okrovém písku: vrhání šipek s roztečí 8 až do
 *  nasycení (hustota jako v `slehnuti-vstupu`). Volné zůstávají pruh cesty
 *  vody s šipkou, okolí kořenů a vnitřní části vodítek. */
const JEMNE = (() => {
  const rnd = rng(0x51e7)
  const ROZTEC = 8
  const tecky: { x: number; y: number; r: number }[] = []
  const voditka: [Bod, Bod][] = [
    [[KONEC_KOREN, Y_KOREN], [CR, Y_KOREN]],
    [[KONEC_VODA, Y_VODA], [CR, Y_VODA]],
  ]
  for (let i = 0; i < 60000; i++) {
    const r = [2.2, 2.4, 2.6][Math.floor(rnd() * 3)]
    const x = d1(X0 + rnd() * (X1 - X0))
    const y = d1(TOP + rnd() * (BOT - TOP))
    if (!uvnitr(x, y, OBRYS_SMESI)) continue
    if (kLomene(x, y, OBRYS_SMESI, true) < 0.8 + 3 + r) continue // půl tahu obrysu + mezera 3
    if (Math.abs(x - WX) < r + 3.5 && y < SIPKA_Y + 10 + r + 3) continue // cesta vody
    if (Math.abs(x - WX) < 8 + r + 3 && y > SIPKA_Y - r - 3 && y < SIPKA_Y + 10 + r + 3) continue // šipka
    if (Math.abs(y - HLADINA) < 0.8 + r + 2) continue // hladina
    if (KORENY_BODY.some((P) => kLomene(x, y, P, false) < 1.2 + r + 2)) continue // lem kořene 2,4 + mezera 2
    if (voditka.some(([a, b]) => kUsecce(x, y, a, b) < r + 3)) continue
    if (tecky.every((t) => (t.x - x) ** 2 + (t.y - y) ** 2 >= ROZTEC ** 2)) tecky.push({ x, y, r })
  }
  return tecky
    .map(({ x, y, r }) => `M${d1(x - r)} ${y}a${r} ${r} 0 1 0 ${d1(2 * r)} 0a${r} ${r} 0 1 0 ${d1(-2 * r)} 0Z`)
    .join('')
})()

/** Stébla drnu (relativní q), po 18–22 px, mezera nad kapkou. */
const STEBLA = [
  [90, '-1 -7 -3 -11'], [108, '2 -6 5 -10'], [128, '0 -8 0 -12'], [148, '2 -8 4 -13'], [168, '-2 -6 -4 -9'],
  [190, '1 -7 3 -11'], [208, '-1 -6 -3 -9'], [250, '2 -7 4 -11'], [270, '0 -8 0 -12'], [290, '-2 -7 -4 -11'],
  [310, '2 -6 3 -9'], [324, '-1 -5 -2 -8'],
]
  .map(([x, q]) => `M${x} ${DRN + 1}q${q}`)
  .join('')

/** Kapka — týž tvar jako v `dve-zahrady` a `pisek-pod-koreny` (A 7 7). */
const Kapka: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <path
    d={`M${x} ${y} C ${x + 4} ${y + 6}, ${x + 7} ${y + 10}, ${x + 7} ${y + 14} A 7 7 0 0 1 ${x - 7} ${y + 14} C ${x - 7} ${y + 10}, ${x - 4} ${y + 6}, ${x} ${y} Z`}
    fill="#2563eb"
    opacity="0.9"
  />
)

const PISEK = { fill: '#c2a052', opacity: 0.55 } as const
const ZEMINA = { fill: '#6b5138', opacity: 0.9 } as const
/** Vodní tinta pod nádechem stojící vody (hlavička: proč). */
const TINTA = { fill: '#93c5fd', opacity: 0.45 } as const
const voditko = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const
const obrys = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
/** Hladina a šipka: jeden tah vody #2563eb op .75. */
const hladina = { fill: 'none', stroke: '#2563eb', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.75 } as const

/** Jádro kořene #d8c9b4 op .9 / 1,6 (hlavička), totéž jako `koren`
 *  v `koren-zacina-nahore`. */
const JADRO = { fill: 'none', stroke: '#d8c9b4', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.9 } as const
/** Kořeny na okrové směsi (řez i čip legendy): jádro na lemu #232830
 *  op .5 / 2,4, jako `Koreny` v `pisek-pod-koreny`. Lemy všech kořenů pod
 *  všemi jádry. */
const Koreny: React.FC<{ d: string }> = ({ d }) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <g stroke="#232830" strokeWidth="2.4" opacity="0.5">
      <path d={d} />
    </g>
    <path d={d} {...JADRO} />
  </g>
)

// ── legenda: čipy 28 × 14 s obrysem, výplň z řezu ────────────────
/** 528 ≡ 3 mod 5: lamely `jjv-lis` leží jako v řezu na y ≡ 2,5 mod 5, v čipu
 *  4,5 a 9,5 pod horní hranou (dvě lamely, obě 3,7 od vnitřní hrany obrysu). */
const CIP_Y = LEG + 22
const CIP = [30, 197, 356] as const // nová směs · utužený jíl · voda stojí (x štítků vpravo); mezery vyrovnané pro 18/21
const CIP_Y2 = CIP_Y + 32 // 560 — 2. řádek: kořeny pod novou směsí

export const JilJakoVana: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 600">
    <defs>
      {/* Utužená vrstva — pixelově shodná s `pp-lis` / `tc-lis` / `hpm-lis` (9.2 p. 10). */}
      <pattern id="jjv-lis" width="8" height="5" patternUnits="userSpaceOnUse">
        <path d="M0 2.5 H8" stroke="rgba(255,255,255,.16)" strokeWidth="1" />
      </pattern>
      {/* Nádech stojící vody: stopy 9.2 .34 → .14 → .05 (offsety jako
          `sd-louze` a `kt-voda`), střed na dně mísy, kde voda stojí na jílu. */}
      <radialGradient id="jjv-voda" gradientUnits="userSpaceOnUse" cx={CX} cy={BOT} r="1" gradientTransform={`translate(${CX} ${BOT}) scale(220 100) translate(${-CX} ${-BOT})`}>
        <stop offset="0" stopColor="#2563eb" stopOpacity="0.34" />
        <stop offset="0.8" stopColor="#2563eb" stopOpacity="0.14" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.05" />
      </radialGradient>
      {/* Týž nádech na čipu legendy, stažený do 14 px výšky: .34 na dolní
          hraně jako na dně mísy, ≈ .14 pod hladinou nahoře (offset .78). */}
      <radialGradient id="jjv-voda-cip" cx="0.5" cy="1" r="1.28">
        <stop offset="0" stopColor="#2563eb" stopOpacity="0.34" />
        <stop offset="0.8" stopColor="#2563eb" stopOpacity="0.14" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.05" />
      </radialGradient>
      {/* vodítka: uvnitř řezu bílá (i přes stěnu jílu, hlavička), venku
          #d5d3cc — jedna čára, jeden rytmus */}
      <clipPath id="jjv-rez">
        <rect x={X0} y="0" width={X1 - X0} height="600" />
      </clipPath>
      <clipPath id="jjv-venku">
        <rect x={X1} y="0" width={520 - X1} height="600" />
      </clipPath>
    </defs>

    {/* Pointa kresby (9.2 p. 3) je jedna: pořadí prací. */}
    <text className="sv-val" x="40" y="34" style={{ fontSize: 24 }}>Nejdřív odtok</text>
    <text className="sv-lbl" x="40" y="59">teprve potom směs</text>

    {/* ── měřítko ─────────────────────────────────────────────── */}
    <line x1="62" y1={TOP} x2="62" y2={BOT} {...voditko} />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="56" y1={TOP} x2="68" y2={TOP} />
      <line x1="56" y1={BOT} x2="68" y2={BOT} />
    </g>
    <text className="sv-val" x="50" y={TOP + 5} textAnchor="end">0 cm</text>
    <text className="sv-val" x="50" y={BOT + 5} textAnchor="end">30</text>

    {/* ── hmoty ───────────────────────────────────────────────── */}
    <path d={JIL} fill="#54402c" opacity="0.95" />
    <path d={JIL} fill="url(#jjv-lis)" />
    <path d={SMES} {...PISEK} />
    {/* voda stojí v míse od hladiny ke dnu: tinta + nádech pod tečkami zeminy, ty v ní leží */}
    <path d={VODA} {...TINTA} />
    <path d={VODA} fill="url(#jjv-voda)" />
    <path d={JEMNE} {...ZEMINA} />
    {/* hladina: od stěny ke stěně, konce kryje obrys mísy */}
    <path d={`M${CL} ${HLADINA} H${CR}`} {...hladina} strokeLinecap="butt" />

    {/* kořeny: směsí dolů, špičky protínají hladinu */}
    <Koreny d={KORENY_D} />

    {/* cesta vody: kapka nad drnem → čárkovaně směsí → šipka hrotem na hladinu */}
    <Kapka x={WX} y={KAPKA_Y} />
    <line x1={WX} y1={TOP + 6} x2={WX} y2={SIPKA_Y - 4} stroke="#2563eb" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <path d={`M${WX - 8} ${SIPKA_Y} l8 10 8 -10`} {...hladina} />

    {/* vnitřní části vodítek KOŘENY a VODA — bílé od cíle přes stěnu mísy k hraně řezu */}
    <g clipPath="url(#jjv-rez)" stroke="#fff" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" opacity="0.7">
      <line x1={KONEC_KOREN} y1={Y_KOREN} x2={LX - 8} y2={Y_KOREN} />
      <line x1={KONEC_VODA} y1={Y_VODA} x2={LX - 8} y2={Y_VODA} />
    </g>

    {/* drn — horní hranu řezu nese on, obrys proto V…H…V (9.2 p. 9) */}
    <rect x={X0} y={DRN} width={X1 - X0} height={TOP - DRN} fill="#3f7d4e" />
    <path d={`M${X0} ${TOP} H${X1}`} stroke="#2e6440" strokeWidth="1.6" fill="none" />
    <path d={STEBLA} fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" />

    {/* obrys řezu + hranice mísy (sdílená hrana obou hmot, jeden tah) */}
    <path d={`M${X0} ${DRN} V${SB} H${X1} V${DRN}`} {...obrys} />
    <path d={MISA} {...obrys} />

    {/* ── štítky vpravo ───────────────────────────────────────── */}
    {/* Každý štítek = hmota nebo jev (`.sv-lbl`) + vlastnost (`.sv-val`);
        vodítko míří na výšku prvního řádku. KOŘENY a VODA pokračují
        stejnou čarou dovnitř řezu (bílá část výše). */}
    <g clipPath="url(#jjv-venku)" {...voditko}>
      <line x1={X1} y1={Y_SMES} x2={LX - 8} y2={Y_SMES} />
      <line x1={KONEC_KOREN} y1={Y_KOREN} x2={LX - 8} y2={Y_KOREN} />
      <line x1={KONEC_VODA} y1={Y_VODA} x2={LX - 8} y2={Y_VODA} />
      <line x1={X1} y1={Y_JIL} x2={LX - 8} y2={Y_JIL} />
    </g>
    {STITKY.map(([y, co, jaka]) => (
      <g key={co}>
        <text className="sv-lbl" x={LX} y={y + 5}>{co}</text>
        <text className="sv-val" x={LX} y={y + 32}>{jaka}</text>
      </g>
    ))}

    {/* ── legenda: značky pixelově shodné s kresbou (9.2 p. 10) ── */}
    <line x1="30" y1={LEG} x2="490" y2={LEG} {...voditko} />
    {/* nová směs: okrový podklad a dvě tečky zeminy ≥ 3 od vnitřní hrany */}
    <rect x={CIP[0]} y={CIP_Y} width="28" height="14" {...PISEK} />
    <path d={`M${CIP[0] + 5.6} ${CIP_Y + 7}a2.4 2.4 0 1 0 4.8 0a2.4 2.4 0 1 0 -4.8 0ZM${CIP[0] + 17.8} ${CIP_Y + 7.5}a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0Z`} {...ZEMINA} />
    <rect x={CIP[0]} y={CIP_Y} width="28" height="14" {...obrys} />
    <text className="sv-val" x={CIP[0] + 36} y={CIP_Y + 12}>nová směs</text>
    {/* utužený jíl: táž výplň a lamely jako jíl v řezu (pattern v userSpace, fáze shodná) */}
    <rect x={CIP[1]} y={CIP_Y} width="28" height="14" fill="#54402c" fillOpacity="0.95" />
    <rect x={CIP[1]} y={CIP_Y} width="28" height="14" fill="url(#jjv-lis)" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-val" x={CIP[1] + 36} y={CIP_Y + 12}>utužený jíl</text>
    {/* voda stojí: táž směs (tečky na týchž místech jako čip nové směsi) + tinta
        + nádech; horní hranu nese hladina, obrys V…H…V */}
    <rect x={CIP[2]} y={CIP_Y} width="28" height="14" {...PISEK} />
    <rect x={CIP[2]} y={CIP_Y} width="28" height="14" {...TINTA} />
    <rect x={CIP[2]} y={CIP_Y} width="28" height="14" fill="url(#jjv-voda-cip)" />
    <path d={`M${CIP[2] + 5.6} ${CIP_Y + 7}a2.4 2.4 0 1 0 4.8 0a2.4 2.4 0 1 0 -4.8 0ZM${CIP[2] + 17.8} ${CIP_Y + 7.5}a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0Z`} {...ZEMINA} />
    <path d={`M${CIP[2]} ${CIP_Y} H${CIP[2] + 28}`} {...hladina} strokeLinecap="butt" />
    <path d={`M${CIP[2]} ${CIP_Y} V${CIP_Y + 14} H${CIP[2] + 28} V${CIP_Y}`} {...obrys} />
    <text className="sv-val" x={CIP[2] + 36} y={CIP_Y + 12}>voda stojí</text>
    {/* kořeny (2. řádek): čip nové směsi, ve které kořeny v řezu rostou
        (okrová + tečka zeminy v odstupech řezu), a výsek kořene týmž
        `Koreny` jako řez (lem 2,4 + jádro), tvar jako v `pisek-pod-koreny` */}
    <rect x={CIP[0]} y={CIP_Y2} width="28" height="14" {...PISEK} />
    <path d={`M${CIP[0] + 19.8} ${CIP_Y2 + 6}a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0Z`} {...ZEMINA} />
    <Koreny
      d={`M${CIP[0] + 10} ${CIP_Y2 + 1} C ${CIP[0] + 9} ${CIP_Y2 + 5}, ${CIP[0] + 11} ${CIP_Y2 + 9}, ${CIP[0] + 10} ${CIP_Y2 + 13}M${CIP[0] + 10} ${CIP_Y2 + 5} C ${CIP[0] + 14} ${CIP_Y2 + 6}, ${CIP[0] + 18} ${CIP_Y2 + 9}, ${CIP[0] + 20} ${CIP_Y2 + 12}`}
    />
    <path d={`M${CIP[0]} ${CIP_Y2} H${CIP[0] + 28} V${CIP_Y2 + 14} H${CIP[0]} Z`} {...obrys} />
    <text className="sv-val" x={CIP[0] + 36} y={CIP_Y2 + 12}>kořeny</text>
  </svg>
)
