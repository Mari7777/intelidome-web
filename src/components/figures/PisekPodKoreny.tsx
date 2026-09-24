import React from 'react'

/**
 * Písek pod kořeny (DESIGN.md 9.2) — jeden řez chudou písčitou zeminou
 * 0–30 cm (8 px na cm jako `prvni-korinek` a `jil-jako-vana`). Pointa je
 * jedna (E6 odst. 1, věty 3–4): pod dosah kořenů odchází voda i část
 * rozpuštěných živin. Záhlaví říká „část živin", ne „živiny" (autor:
 * „některé rozpuštěné živiny"), a „pod dosah" ve 4. pádě je směr, ne místo.
 * V zemině je dost vzduchu, kořeny končí nad linkou dosahu, voda jde
 * čárkovanou cestou kolem nich dolů a nese tečky živin, tři z šesti už pod
 * linkou. Bez příměsí, dávek i věty o řešení: to nese `dve-zahrady`,
 * popisek a text E6 odst. 2–4.
 *
 * Hloubka dosahu (18 cm) je schéma, text ji neuvádí („hlouběji, než kam
 * právě dosahují kořeny"). Stupnice má jen 0 a 30 cm, linku nekótovat.
 * Neleží v 15 cm (zeolit v „horních 15 cm", E6 odst. 4), v 10 cm
 * (biochar, Actino) ani ve 13 cm (voda mimo dosah v `prvni-korinek`).
 * Kořeny tu končí v ≈ 17 cm, v `jil-jako-vana` v ≈ 22 cm; obě hloubky
 * jsou schéma a text je nesrovnává. Alt ani popisek podíl hloubky
 * neuvádějí.
 *
 * Značky (9.2 p. 10):
 * – písčitá zemina = plochá okrová #c2a052 op .45 bez zrn, jako
 *   `zaklad-tri-zahrad`, který stojí hned za touto kresbou. `dve-zahrady`
 *   kreslí písčitou zahradu týmž okrem na .55 (jeden čip pro obě pole).
 *   Zrna #c2a052 znamenají v sérii přidaný písek a tady nejsou: E6 odst. 2
 *   „další písek sem nepřidáváme", odst. 3 stávající písek je součást
 *   zeminy.
 * – vzduch = prázdný kroužek r 3,5 / 1,6, bílý op .7. Prázdný kroužek je
 *   vzduch i v `tricet-centimetru`, tam ale v sytě hnědé zemině bílou .22,
 *   která by na světlé okrové zmizela; velikost ani barva shodné nejsou.
 * – kořen = jedna značka celého článku: jádro #d8c9b4 op .9 / 1,6 (jako
 *   `prvni-korinek`), na okrové položené na lem #232830 op .5 / 2,4 (strop
 *   série). Holý kořen by na okrové splynul, plně tmavý obal by se četl
 *   jako kabel. Lemy všech kořenů leží pod všemi jádry; odbočky začínají
 *   na ose hlavního kořene, takže styky nemají tmavý zářez ani hrbolek.
 * – živiny = tečka r 2,6 #54402c, tatáž jako v legendě `nabity-biochar`.
 *   V `jedna-zmena-naraz` je týž bod Actino (v `dve-zahrady` totéž jádro
 *   na lemu barvy panelu), proto ho legenda v tomto panelu jmenuje
 *   „živiny" (9.2 p. 10, úroveň 2). Podklad r 3,4 barvy panelu
 *   z `nabity-biochar` tu není: na okrové by se četl jako kroužek vzduchu
 *   s tečkou uvnitř.
 * – voda = kapka A 7 7 a šipka dolů (tvar jako `dve-zahrady`), modrá
 *   čárkovaná cesta (jako `jil-jako-vana`). Jediný akcent, jeden motiv
 *   (9.2 p. 1).
 * – konstrukční linky UVNITŘ okrové zeminy (linka dosahu, vnitřní část
 *   vodítek) jsou #fff op .7, výjimka z palety 9.2: #d5d3cc
 *   i rgba(255,255,255,.12) na okrové zmizí. Venku mají vodítka #d5d3cc 3 7.
 * Legenda: čipy 28 × 14, ostré rohy, obrys #232830 / 1,6, výplň z téže
 * písčité zeminy jako řez. Vzduch i kořen jsou světlé značky viditelné jen
 * na půdě, stojí proto na čipu zeminy, ve které v řezu leží. Tady je to
 * okrová písčitá zemina, ne hnědá #6b5138: ta v řezu není a v navazující
 * `zaklad-tri-zahrad` znamená původní zeminu. Kořen v legendě kreslí táž
 * komponenta `Koreny` (lem 2,4 + jádro) na témže podkladu, takže je s řezem
 * pixelově shodný. Tvar výseku kořene je týž jako v legendě
 * `koren-zacina-nahore`; tam leží na hnědé zemině své scény bez lemu, jako
 * kořeny v jejím řezu. Kapka a tečka živin vypadají stejně na okrové
 * i na krémovém podkladu.
 *
 * Portrétová sazba 520 × 600 (výška podle plánu splitu). Kresba nemá žádné
 * id, prefix `ppk-` je rezervovaný. Nadpis a podtitul začínají na x 40
 * (osa nadpisů série), řez leží na x 80–330, drn 14, stupnice visí vlevo.
 * Štítky začínají na x 350 a každý má vodítko 3 7 ke svému cíli uvnitř
 * řezu: „Vzduch" ke kroužku, „Zásoba" k tečce živin NAD linkou, „Dosah
 * kořenů" k lince (štítek visí pod jejím koncem, jako „dosah"
 * v `prvni-korinek`) a „Část živin" k tečce POD linkou. Dvojice teček je
 * pointa: nad linkou zásoba, pod ní to, co voda odnese. Popisek → hodnota
 * má rozteč 27. V mobilní sazbě 18/21 zbývá uvnitř dvojice ≈ 6 jednotek,
 * mezi skupinami ≥ 14 (na desktopu ≥ 19). Nejdelší „Dosah kořenů" končí
 * při 18 jednotkách na x ≈ 508. Jednotka cm stojí jen v `.sv-val`.
 * Statická kresba, pointa je hloubka a pohyb by ji nezpřesnil.
 */

const X0 = 80 // levá hrana řezu
const X1 = 330 // pravá hrana řezu
const T = 150 // povrch, 0 cm
const CM = 8
const B = T + 30 * CM // 390, dno řezu
const DOSAH = T + 18 * CM // 294, konce kořenů (schéma, ne údaj)
const DRN = 14
const LX = 350 // štítky vpravo
const VX = LX - 8 // konec vodítek u štítků

/** Písčitá zemina: klíč článku op .45 (přidaný písek .55 je jiná hmota). */
const PISCITA = { fill: '#c2a052', fillOpacity: 0.45 } as const
const obrys = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
const voditko = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const
/** Konstrukční linka na světlé písčité zemině: #d5d3cc by na okrové splynul. */
const vodSvetle = { stroke: '#fff', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round', opacity: 0.7 } as const

/** Trs kořenů u x `cx` (y od povrchu): hlavní kořen do 138, poslední odbočka
 *  do 136 (≥ 3 nad linkou dosahu 144, i s hranou) a tři postranní; `s` = zrcadlení.
 *  Odbočky začínají na ose hlavního kořene (v y 24 leží na cx − 0,87 s),
 *  jinak kulatá hlavička odbočky čouhá na druhé straně jako hrbolek. */
const trs = (cx: number, s: 1 | -1, y = T) =>
  `M${cx} ${y} C ${cx - 3 * s} ${y + 37}, ${cx + 3 * s} ${y + 88}, ${cx - s} ${y + 138}` +
  `M${cx - s} ${y + 24} C ${cx - 12 * s} ${y + 34}, ${cx - 20 * s} ${y + 45}, ${cx - 25 * s} ${y + 62}` +
  `M${cx + s} ${y + 63} C ${cx + 13 * s} ${y + 75}, ${cx + 20 * s} ${y + 86}, ${cx + 25 * s} ${y + 104}` +
  `M${cx} ${y + 108} C ${cx - 11 * s} ${y + 118}, ${cx - 17 * s} ${y + 124}, ${cx - 19 * s} ${y + 136}`
const KORENY = [trs(114, 1), trs(174, -1), trs(234, 1)]

/** Cesta vody vpravo od třetího trsu: od povrchu až pod 26 cm. */
const CESTA = `M284 ${T + 4} C 292 ${T + 30}, 278 ${T + 58}, 286 ${T + 86} C 294 ${T + 114}, 280 ${T + 142}, 286 ${T + 170} C 291 ${T + 192}, 286 ${T + 206}, 286 ${T + 214}`
/** Živiny unášené vodou (8 od osy cesty) [x, y od povrchu]: tři nad linkou
 *  dosahu, tři pod ní. */
const ZIVINY: [number, number][] = [[278.5, 26], [291.9, 56], [280.2, 98], [276.5, 154], [296.2, 192], [278.8, 206]]
const CIL_ZASOBA = ZIVINY[1] // „Zásoba" míří na tečku nad linkou
const CIL_ZIVINY = ZIVINY[4] // „Část živin" míří na tečku pod linkou

/** Kroužky vzduchu [x, y od povrchu]: pevný rozsyp vrháním šipek (rozteč
 *  středů ≥ 29, žádná mřížka), ≥ 3 od kořenů, cesty vody, linky dosahu
 *  a obrysu, ≥ 6 od teček a kapky, ≥ 9 od vnitřních vodítek, aby se
 *  žádný nečetl jako cíl štítku. První kroužek je cíl štítku „Vzduch". */
const VZ: [number, number] = [306, 16]
const VZDUCH: [number, number][] = [
  VZ,
  [221.9, 13.7], [124.7, 24.7], [190.4, 25], [158.4, 28.2], [263.5, 31.3], [90.8, 34],
  [321.6, 40.5], [126.4, 55.3], [247.6, 56.1], [185.4, 58.7], [156.7, 65.4], [221.3, 70.8],
  [298.3, 72.5], [98.1, 73.6], [269.9, 81.6], [318.4, 93.5], [125.9, 94.9], [191.9, 98.5],
  [221, 103.1], [89.7, 105.5], [157.2, 108.3], [246.5, 118.6], [301.3, 119.3], [130.7, 125.4],
  [204.4, 131.7], [275.6, 133.8], [260.2, 160.1], [113.7, 162.4], [144.8, 164.5], [173.7, 172],
  [230.9, 173.5], [307.6, 177.2], [201.7, 181.2], [276.3, 189.5], [151.3, 194.9], [88.5, 197.1],
  [251, 203.8], [304.1, 206.2], [183.4, 208.4], [116.7, 209.1], [210, 220.9], [94.7, 229],
  [267.4, 229.3], [154.9, 230.8], [320.3, 231.7], [237.8, 231.8],
]

/** Tvary stébel z `tri-zony` (relativní q), opakované po 14 px. */
const STEBLA = ['-1 -8 -3 -13', '2 -7 5 -12', '0 -9 0 -14', '2 -10 5 -16', '2 -5 5 -8', '-1 -6 -4 -10', '-2 -10 -5 -17', '-2 -6 -5 -11', '1 -5 2 -8', '1 -10 4 -16', '-2 -9 -5 -15', '0 -8 0 -13', '2 -6 5 -9', '1 -5 3 -8', '-2 -6 -5 -9']
const TRAVA = Array.from({ length: 18 }, (_, k) => `M${X0 + 8 + k * 14} ${T - DRN + 1}q${STEBLA[k % STEBLA.length]}`).join('')

/** Kapka vody — týž tvar jako v `dve-zahrady` a `jil-jako-vana` (A 7 7). */
const Kapka: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <path
    d={`M${x} ${y} C ${x + 4} ${y + 6}, ${x + 7} ${y + 10}, ${x + 7} ${y + 14} A 7 7 0 0 1 ${x - 7} ${y + 14} C ${x - 7} ${y + 10}, ${x - 4} ${y + 6}, ${x} ${y} Z`}
    fill="#2563eb"
    opacity="0.9"
  />
)

/** Vzduch — prázdný kroužek (`tricet-centimetru`), na okrové zemině bílý .7. */
const Vzduch: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <circle cx={x} cy={y} r="3.5" fill="none" stroke="#fff" strokeWidth="1.6" opacity="0.7" />
)

/** Kořeny: jádro #d8c9b4 op .9 / 1,6 na lemu #232830 op .5 / 2,4 (hlavička).
 *  Lemy všech kořenů nejdřív, jádra potom: styky nemají tmavé skvrny. */
const Koreny: React.FC<{ d: string[] }> = ({ d }) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <g stroke="#232830" strokeWidth="2.4" opacity="0.5">
      {d.map((p) => <path key={p} d={p} />)}
    </g>
    <g stroke="#d8c9b4" strokeWidth="1.6" opacity="0.9">
      {d.map((p) => <path key={p} d={p} />)}
    </g>
  </g>
)

/** Vodítko štítku ve výšce `y`: uvnitř řezu (od `x`) světlé, venku #d5d3cc. */
const Ukazatel: React.FC<{ y: number; x?: number }> = ({ y, x }) => (
  <>
    {x !== undefined && <line x1={x} y1={y} x2={X1 - 3} y2={y} {...vodSvetle} />}
    <line x1={X1 + 4} y1={y} x2={VX} y2={y} {...voditko} />
  </>
)

// ── legenda ──────────────────────────────────────────────────────
const LEG = 446 // linka legendy
const R1 = 504 // první řádek (účaří)
const R2 = 542 // druhý řádek
/** Čip 28 × 14 s obrysem hmoty: výplň z téže písčité zeminy jako řez. */
const Cip: React.FC<{ x: number; children?: React.ReactNode }> = ({ x, children }) => (
  <>
    <rect x={x} y={R1 - 12} width="28" height="14" {...PISCITA} />
    {children}
    <path d={`M${x} ${R1 - 12} H${x + 28} V${R1 + 2} H${x} Z`} {...obrys} />
  </>
)

export const PisekPodKoreny: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 600">
    {/* Pointa kresby (9.2 p. 3) je jedna: voda a část živin odchází pod dosah kořenů. */}
    <text className="sv-val" x="40" y="44" style={{ fontSize: 24 }}>Pod dosah kořenů</text>
    <text className="sv-lbl" x="40" y="72">odchází voda i část živin</text>

    {/* ── stupnice: jen povrch a dno profilu ─────────────────── */}
    <line x1="62" y1={T} x2="62" y2={B} {...voditko} />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="56" y1={T} x2="68" y2={T} />
      <line x1="56" y1={B} x2="68" y2={B} />
    </g>
    <text className="sv-val" x="50" y={T + 5} textAnchor="end">0 cm</text>
    <text className="sv-val" x="50" y={B + 5} textAnchor="end">30</text>

    {/* ── řez chudou písčitou zeminou: okrová plocha nese písek sama ── */}
    <rect x={X0} y={T} width={X1 - X0} height={B - T} {...PISCITA} />
    {VZDUCH.map(([x, y]) => <Vzduch key={`${x}-${y}`} x={x} y={T + y} />)}

    {/* linka dosahu kořenů */}
    <line x1={X0 + 4} y1={DOSAH} x2={X1 - 3} y2={DOSAH} {...vodSvetle} />
    <Koreny d={KORENY} />

    {/* voda: čárkovaná cesta, kapka těsně pod dosahem, šipka dolů (jeden motiv) */}
    <path d={CESTA} fill="none" stroke="#2563eb" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <Kapka x={286} y={T + 160} />
    <path d={`M278 ${T + 218} l8 10 8 -10`} fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
    <g fill="#54402c">
      {ZIVINY.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={T + y} r="2.6" />)}
    </g>

    {/* drn a obrys V…H…V — horní hranu nese drn (9.2 p. 9) */}
    <rect x={X0} y={T - DRN} width={X1 - X0} height={DRN} fill="#3f7d4e" />
    <path d={`M${X0} ${T} H${X1}`} stroke="#2e6440" strokeWidth="1.6" fill="none" />
    <path d={TRAVA} fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" />
    <path d={`M${X0} ${T - DRN} V${B} H${X1} V${T - DRN}`} {...obrys} />

    {/* ── štítky vpravo: vodítko míří na místo v řezu ─────────── */}
    <Ukazatel y={T + VZ[1]} x={VZ[0] + 3.5 + 0.8 + 3} />
    <text className="sv-val" x={LX} y={T + VZ[1] + 5}>
      <tspan className="sv-lbl">{'Vzduch '}</tspan>
      dost
    </text>

    <Ukazatel y={T + CIL_ZASOBA[1]} x={CIL_ZASOBA[0] + 2.6 + 3} />
    <text className="sv-lbl" x={LX} y={T + CIL_ZASOBA[1] + 5}>Zásoba</text>
    <text className="sv-val" x={LX} y={T + CIL_ZASOBA[1] + 32}>rychle dojde</text>

    <Ukazatel y={DOSAH} />
    <text className="sv-lbl" x={LX} y={DOSAH + 20}>Dosah kořenů</text>

    <Ukazatel y={T + CIL_ZIVINY[1]} x={CIL_ZIVINY[0] + 2.6 + 3} />
    <text className="sv-lbl" x={LX} y={T + CIL_ZIVINY[1] + 5}>Část živin</text>
    <text className="sv-val" x={LX} y={T + CIL_ZIVINY[1] + 32}>voda odnese</text>

    {/* ── legenda: čipy 28 × 14 z písčité zeminy řezu; vzduch i kořen na
        nich pixelově shodné s řezem (9.2 p. 10) ── */}
    <line x1="30" y1={LEG} x2="490" y2={LEG} {...voditko} />
    <text className="sv-lbl" x="30" y={LEG + 24}>Co je co</text>
    <Cip x={30} />
    <text className="sv-val" x="66" y={R1}>písčitá zemina</text>
    <Cip x={240}>
      <Vzduch x={254} y={R1 - 5} />
    </Cip>
    <text className="sv-val" x="276" y={R1}>vzduch</text>
    <Cip x={362}>
      <Koreny d={[`M372 ${R1 - 11} C 371 ${R1 - 7}, 373 ${R1 - 3}, 372 ${R1 + 1}M372 ${R1 - 7} C 376 ${R1 - 6}, 380 ${R1 - 3}, 382 ${R1}`]} />
    </Cip>
    <text className="sv-val" x="398" y={R1}>kořeny</text>
    <Kapka x={44} y={R2 - 17} />
    <text className="sv-val" x="66" y={R2}>voda</text>
    <circle cx="254" cy={R2 - 5} r="2.6" fill="#54402c" />
    <text className="sv-val" x="276" y={R2}>živiny</text>
  </svg>
)
