import React from 'react'

/**
 * Práce místo materiálu (DESIGN.md 9.2) — u dobře fungující hlíny MŮŽE být
 * dávka nového písku, zeolitu i biocharu nula (i41 v1); víc než nová
 * dodávka může pomoci práce (i39 v3, i41 v6). Záhlaví jako `jil-jako-vana`:
 * klíčová hodnota „0 %" (24 px, jediná) samostatně na x 40 / y 34 (levá
 * osa jako `michani-od-hloubky`), pod ní `.sv-lbl` předmět (y 59) a `.sv-val`
 * věta s podmínkou a modalitou autora („u fungující hlíny může…"). Pod ní
 * tři výřezy hlinité půdy, každý s jednou prací, seřazené od hloubky
 * k povrchu; rozrušení vrstvy po bagru je podle textu první krok (i41 v6).
 * Nejsou číslované. Vpravo sloveso `.sv-lbl` a předmět `.sv-val`, vodítko 3 7:
 * • rozrušit vrstvu po bagru — utužená vrstva (výška 40) je rozlámaná na
 *   čtyři kry nestejné šířky (nahoře 33 / 62 / 50 / 39). Dělí je tři
 *   trhliny otevřené shora, které procházejí celou tloušťkou vrstvy: vrstva
 *   není nikde spojitá a v trhlinách je vidět hlína s drobty. Osa trhliny
 *   má dva zlomy v různých výškách (klikatá jako lom, ne rovná jako řez),
 *   oba břehy mají týž tvar, takže kry do sebe pasují jako rozlomený kus.
 *   Šířka trhliny (vodorovně, před pootočením) je 22 na horní hraně a 11
 *   u dolní. Dvě prostřední kry jsou pootočené o −3° a +2°; nejmenší
 *   vzdálenost protějších obrysů u dolní hrany je pak 9,2 / 11,2 / 11,8
 *   (mezi osami tahů), takže i na telefonu zbývá mezi tahy 1,6 hlína.
 *   Kra je samostatná hmota, a má proto vlastní obrys (9.2 p. 9); hranu,
 *   kterou nese obrys výřezu (levý a pravý bok), obrys kry nekreslí.
 * • odstranit kameny — jeden kámen ještě trčí z povrchu, druhý je šipkou
 *   vyzvednutý nad povrch a jeho lůžko zůstává jako čárkovaný obrys.
 * • urovnat povrch — oblouková šipka přesouvá hrbol do dolíku stejné
 *   velikosti (amplituda 24 / 24, táž šířka): urovnání nic nepřiváží,
 *   jen přesouvá. Čárkovaná cílová rovina vede přes výřez a za ním
 *   pokračuje jako vodítko; hrot šipky sedí v dolíku pod ní.
 * Dole legenda a poznámka, kdy příměsi přijdou na řadu (těžší hlína
 * i37–i38, zanedbaná hlína s Actinem i41 v3–v4) — bez čísel, ta nesou
 * `zaklad-tri-zahrad` a tabulka. Procento nese jen „0 %".
 *
 * Značky ze série (9.2 p. 10):
 * – hlína = zemina #6b5138 op .9 a drobty `hpm-hlina`: dlaždice 12 × 12
 *   se stejnými třemi kruhy jako `pas-hlina` (`prednosti-a-slabiny`)
 *   a `hmt-hlina` (`hmatovy-test`). Počátek dlaždice je v rohu hlíny
 *   každého výřezu: výřez je skupina posunutá tak, že horní hrana hlíny
 *   (povrch) leží na lokálním y ≡ 0 mod 12. Čip legendy 28 × 14 je skupina
 *   s počátkem v rohu čipu, takže ukazuje týž levý horní výsek dlaždice
 *   jako výřezy; zemina + dlaždice + obrys 1,6, ostré rohy.
 * – utužená vrstva = #54402c fill-opacity .95 a světlé lamely 8 × 5
 *   (`hpm-lis` = `pp-lis`, `tc-lis`, `jjv-lis`). Kry leží na panelu, ne na
 *   hlíně: hlína výřezu má v místě kry otvor (evenodd), takže průsvitných
 *   5 % ukazuje krém panelu jako u čipu. Čip 28 × 14 s obrysem 1,6 stejně
 *   jako v `jil-jako-vana`; horní hrana kry i čipu ≡ 3 mod 5, lamely mají
 *   tedy v obou tutéž fázi (první 4,5 pod horní hranou). Pootočené kry nesou
 *   lamely s sebou (vzor je v souřadnicích kry).
 * Kámen není v paletě 9.2, a nemá proto barvu žádné hmoty: obrys 1,6 px
 * a výplň barvou papíru #f6f5f2 = --id-cream. Kresba stojí vždy
 * v krémovém panelu (9.2 p. 6) a E5 leží na krémovém pásu, kde se panel
 * propadne do téhož krému — kámen je tedy „prázdný" tvar, ne hmota.
 * Výplň #d5d3cc s obrysem je v sérii ZEOLIT (nepravidelný šestiúhelník
 * ~10 px); kameny jsou proto oblé (6 vrcholů, rohy zaoblené r 5)
 * a čtyřikrát větší. Kámen v legendě je táž cesta jako kámen, který trčí
 * z povrchu (37 × 26); je to předmět, ne plošná hmota, čip 28 × 14 nemá.
 * Hlína nemá obrysované hrudky, takže kámen je v kresbě jediný obrysovaný
 * předmět v hlíně (kry mají obrys jako hmota vrstvy, ne jako předmět).
 * Horní hranu výřezů nenese drn (příprava před výsevem), obrys hmoty je
 * proto uzavřený (9.2 p. 9). Žádná voda, žádný
 * akcent, žádné kořeny.
 *
 * Portrétová sazba 520 px, id s prefixem `hpm-`. Jedna levá osa x 40:
 * záhlaví, výřezy (x 40–290), linka legendy, první čip i poznámka. Popisky
 * od x 316; třetí čip legendy stojí na téže ose. Mobilní sazba 18/21
 * jednotek, změřeno v Archivu (panel 336 px): věta záhlaví končí na
 * x ≈ 406, „vrstvu po bagru" ≈ 463, „utužená vrstva" v legendě ≈ 490,
 * poznámka dole ≈ 486. Mezery mezi položkami legendy ≈ 42. Rozteč sloveso
 * → předmět 28 (mezera mezi jejich rámečky ≥ 5 i v panelu 361 px). Text
 * × tvar ≥ 4 (vodítka končí 8 před popiskem). Jednotka „%" jen v `.sv-val`.
 * Statická kresba.
 */

type Bod = readonly [number, number]

const X = 40 // jedna levá osa
const W = 250 // šířka výřezů
const X_TEXT = X + W + 26 // 316 — popisky vpravo
const VODITKO = 18 // přesah vodítka za hranu výřezu
// Lokální souřadnice výřezu: horní hrana hlíny na y ≡ 0 mod 12 (počátek
// dlaždice `hpm-hlina`), posun skupiny drží polohy na stránce.
// výřez 1 — rozrušit vrstvu (jen hlína, nejhlubší)
const T_C = 118
const HC = 112
const PAS_H = 33 // horní hrana utužené vrstvy (≡ 3 mod 5 jako čip)
const PAS_D = 73 // dolní hrana (výška 40)
const Y_PAS = (PAS_H + PAS_D) / 2
// výřez 2 — odstranit kameny (vzduch nad povrchem + hlína)
const T_B = 258
const S_B = 48 // povrch
const H_B = 120
// výřez 3 — urovnat povrch
const T_A = 394
const S = 48 // povrch = cílová rovina
const H = 120
const LEG = 545 // linka legendy
const CIP_Y = LEG + 18 // 563 ≡ 3 mod 5: fáze lamel jako v kře
const CIP = [X, 164, X_TEXT] as const // hlína · kámen · utužená vrstva

const HLINA = { fill: '#6b5138', opacity: 0.9 } as const
const UTUZENA = { fill: '#54402c', fillOpacity: 0.95 } as const
const obrys = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
const carkovane = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const
const kamenStyl = { fill: '#f6f5f2', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
const sipka = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const d1 = (n: number) => Math.round(n * 10) / 10
const cesta = (v: readonly Bod[]) => `M${v.map(([x, y]) => `${d1(x)} ${d1(y)}`).join(' L')}`

// ── 1 · rozrušit utuženou vrstvu ────────────────────────────────
/** Trhliny utuženou vrstvou: osa každé trhliny shora dolů se dvěma zlomy
 *  (klikatá jako lom, ne rovná jako řez), zlomy v různých výškách. */
const TRHLINY: readonly (readonly Bod[])[] = [
  [[44, PAS_H], [51, 45], [42, 59], [47, PAS_D]],
  [[128, PAS_H], [122, 47], [131, 60], [126, PAS_D]],
  [[200, PAS_H], [206, 42], [198, 56], [203, PAS_D]],
]
/** Šířka trhliny: klín otevřený shora, 22 na horní hraně → 11 u dolní. */
const sire = (y: number) => 22 - (11 * (y - PAS_H)) / (PAS_D - PAS_H)
/** Kraj trhliny: levý (−1) nebo pravý (+1) břeh, body shora dolů. */
const breh = (t: readonly Bod[], strana: -1 | 1): Bod[] => t.map(([x, y]) => [x + (strana * sire(y)) / 2, y] as Bod)
/** Kry utužené vrstvy po směru hodinových ručiček, lokálně ve výřezu, před
 *  pootočením: pravý bok = levý břeh trhliny vpravo, levý bok = pravý břeh
 *  trhliny vlevo; krajní kry končí na boku výřezu. Protější břehy mají
 *  týž tvar, kry do sebe pasují jako rozlomený kus. */
const KRY: readonly { v: readonly Bod[]; rot: number }[] = [0, 1, 2, 3].map((k) => ({
  v: [
    ...(k < 3 ? breh(TRHLINY[k], -1) : [[W, PAS_H], [W, PAS_D]] as Bod[]),
    ...(k > 0 ? breh(TRHLINY[k - 1], 1).reverse() : [[0, PAS_D], [0, PAS_H]] as Bod[]),
  ],
  rot: [0, -3, 2, 0][k],
}))
const stred = (v: readonly Bod[]): Bod => [v.reduce((s, p) => s + p[0], 0) / v.length, v.reduce((s, p) => s + p[1], 0) / v.length]
/** Tatáž rotace jako SVG `rotate(a cx cy)` — pro otvor v hlíně. */
const otoc = (v: readonly Bod[], a: number): Bod[] => {
  const [cx, cy] = stred(v)
  const c = Math.cos((a * Math.PI) / 180)
  const s = Math.sin((a * Math.PI) / 180)
  return v.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c] as Bod)
}
/** Obrys kry bez hrany, která leží na boku výřezu (tu nese obrys výřezu). */
const obrysKry = (v: readonly Bod[]) => {
  const n = v.length
  const naBoku = (a: Bod, b: Bod) => (a[0] === 0 && b[0] === 0) || (a[0] === W && b[0] === W)
  const za = v.findIndex((p, i) => naBoku(v[(i + n - 1) % n], p))
  if (za < 0) return `${cesta(v)} Z`
  return cesta(Array.from({ length: n }, (_, k) => v[(za + k) % n]))
}
/** Hlína výřezu 1 s otvory v místě kry (evenodd). */
const HLINA_C = `M0 0 H${W} V${HC} H0 Z ${KRY.map(({ v, rot }) => `${cesta(otoc(v, rot))} Z`).join(' ')}`

// ── 2 · odstranit kameny ────────────────────────────────────────
/** Kámen: oblý šestiúhelník (rohy zaoblené r 5) — ne hranatý šestiúhelník
 *  zeolitu. Vrcholy relativně k levému kraji. */
const KAMEN_ZEM: Bod[] = [[0, -1], [8, -14], [27, -15], [37, -3], [31, 10], [8, 11]] // 37 × 26
const KAMEN_VEN: Bod[] = [[0, -2], [9, -16], [30, -18], [44, -6], [38, 8], [12, 10]] // 44 × 28
/** Mnohoúhelník se zaoblenými rohy (kvadratický oblouk přes vrchol). */
const kamen = (v: readonly Bod[], ox: number, oy: number) => {
  const p = v.map(([x, y]) => [ox + x, oy + y] as Bod)
  const n = p.length
  const k5 = (a: Bod, b: Bod) => {
    const t = Math.min(5 / Math.hypot(b[0] - a[0], b[1] - a[1]), 0.5)
    return `${d1(a[0] + (b[0] - a[0]) * t)} ${d1(a[1] + (b[1] - a[1]) * t)}`
  }
  return p.map((v0, k) => `${k ? 'L' : 'M'}${k5(v0, p[(k + n - 1) % n])}Q${v0[0]} ${v0[1]} ${k5(v0, p[(k + 1) % n])}`).join('') + 'Z'
}
const ZEM = { x: 36, y: S_B + 5 } // kámen, který ještě trčí z povrchu
const VEN = { x: 150, y: 20 } // vyzvednutý kámen nad povrchem
const LUZKO = { x: 150, y: 90 } // jeho lůžko v hlíně
const SIPKA_X = LUZKO.x + 22
const SIPKA_OD = LUZKO.y - 22 // 68, nad lůžkem
const SIPKA_DO = VEN.y + 16 // 36, pod vyzvednutým kamenem
const Y_VEN = VEN.y - 4 // výška vodítka

// ── 3 · urovnat ─────────────────────────────────────────────────
/** Povrch: hrbol u x 62 a dolík u x 174, oba 24 od roviny a stejně široké
 *  — přesunutý hrbol dolík přesně zaplní. */
const g = (x: number, c: number) => Math.exp(-(((x - c) / 24) ** 2))
const povrch = (x: number) => S - 24 * g(x, 62) + 24 * g(x, 174)
const POVRCH: Bod[] = Array.from({ length: 51 }, (_, i) => [i * 5, d1(povrch(i * 5))])
const HLINA_A = `M${POVRCH.map(([x, y]) => `${x} ${y}`).join(' L')} V${H} H0 Z`
const OBLOUK = { od: [78, 16], ridici: [128, -18], hrot: [170, 64] } as const

// ── šipka ───────────────────────────────────────────────────────
/** Hrot na konci (x, y) ve směru (ux, uy); ramena 8 pod úhlem ±30°. */
const hrot = (x: number, y: number, ux: number, uy: number) => {
  const n = Math.hypot(ux, uy)
  const [dx, dy] = [ux / n, uy / n]
  const rameno = (a: number) => {
    const c = Math.cos(a)
    const s = Math.sin(a)
    return `${d1(x - 8 * (dx * c - dy * s))} ${d1(y - 8 * (dx * s + dy * c))}`
  }
  return `M${rameno(Math.PI / 6)} L${x} ${y} L${rameno(-Math.PI / 6)}`
}

/** Popisek vpravo, `y` = výška vodítka: nad ní sloveso `.sv-lbl`, pod ní
 *  předmět `.sv-val`. */
const Popisek: React.FC<{ y: number; sloveso: string; predmet: string }> = ({ y, sloveso, predmet }) => (
  <g>
    <text className="sv-lbl" x={X_TEXT} y={y - 7}>{sloveso}</text>
    <text className="sv-val" x={X_TEXT} y={y + 21}>{predmet}</text>
  </g>
)

export const HlinaPraceMistoMaterialu: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 640">
    <defs>
      {/* Drobty hlíny — tytéž tři kruhy jako `pas-hlina` a `hmt-hlina`;
          počátek v počátku skupiny, tj. v rohu hlíny výřezu i čipu. */}
      <pattern id="hpm-hlina" width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.2" fill="#54402c" />
        <circle cx="9" cy="8" r="2.4" fill="#6b5138" />
        <circle cx="4" cy="9.5" r="1" fill="#54402c" />
      </pattern>
      {/* Lamely utužené vrstvy — tytéž jako `pp-lis` / `tc-lis` / `jjv-lis`. */}
      <pattern id="hpm-lis" width="8" height="5" patternUnits="userSpaceOnUse">
        <path d="M0 2.5 H8" stroke="rgba(255,255,255,.16)" strokeWidth="1" />
      </pattern>
    </defs>

    {/* Pointa kresby (9.2 p. 3) je jedna: nula — s podmínkou autora. */}
    <text className="sv-val" x={X} y="34" style={{ fontSize: 24 }}>0 %</text>
    <text className="sv-lbl" x={X} y="59">nového písku, zeolitu i biocharu</text>
    <text className="sv-val" x={X} y="90">u fungující hlíny může víc pomoci práce</text>

    {/* ── 1 · rozrušit vrstvu po bagru: vrstva rozlámaná na kry ── */}
    <g transform={`translate(${X} ${T_C})`}>
      {/* hlína s otvory pod krami; v klínech mezi krami je vidět s drobty */}
      <path d={HLINA_C} fillRule="evenodd" {...HLINA} />
      <path d={HLINA_C} fillRule="evenodd" fill="url(#hpm-hlina)" />
      {KRY.map(({ v, rot }) => {
        const [cx, cy] = stred(v)
        return (
          <g key={v[0].join()} transform={rot ? `rotate(${rot} ${d1(cx)} ${d1(cy)})` : undefined}>
            <path d={`${cesta(v)} Z`} {...UTUZENA} />
            <path d={`${cesta(v)} Z`} fill="url(#hpm-lis)" />
            <path d={obrysKry(v)} {...obrys} />
          </g>
        )
      })}
      <path d={`M0 0 H${W} V${HC} H0 Z`} {...obrys} />
      <line x1={W} y1={Y_PAS} x2={W + VODITKO} y2={Y_PAS} {...carkovane} />
    </g>
    <Popisek y={T_C + Y_PAS} sloveso="Rozrušit" predmet="vrstvu po bagru" />

    {/* ── 2 · odstranit kameny ───────────────────────────────── */}
    <g transform={`translate(${X} ${T_B})`}>
      <rect x="0" y={S_B} width={W} height={H_B - S_B} {...HLINA} />
      <rect x="0" y={S_B} width={W} height={H_B - S_B} fill="url(#hpm-hlina)" />
      {/* lůžko vyzvednutého kamene — čárkovaně, kde ležel */}
      <path d={kamen(KAMEN_VEN, LUZKO.x, LUZKO.y)} fill="none" {...carkovane} strokeLinejoin="round" />
      <path d={`M0 ${S_B} H${W} V${H_B} H0 Z`} {...obrys} />
      {/* kámen trčí z povrchu — kreslí se přes obrys hlíny */}
      <path d={kamen(KAMEN_ZEM, ZEM.x, ZEM.y)} {...kamenStyl} />
      <path d={kamen(KAMEN_VEN, VEN.x, VEN.y)} {...kamenStyl} />
      <path d={`M${SIPKA_X} ${SIPKA_OD} V${SIPKA_DO}`} {...sipka} />
      <path d={hrot(SIPKA_X, SIPKA_DO, 0, -1)} {...sipka} />
      <line x1={VEN.x + 52} y1={Y_VEN} x2={W + VODITKO} y2={Y_VEN} {...carkovane} />
    </g>
    <Popisek y={T_B + Y_VEN} sloveso="Odstranit" predmet="kameny" />

    {/* ── 3 · urovnat: hrbol do dolíku ───────────────────────── */}
    <g transform={`translate(${X} ${T_A})`}>
      <path d={HLINA_A} {...HLINA} />
      <path d={HLINA_A} fill="url(#hpm-hlina)" />
      {/* cílová rovina: přes výřez, za hranou pokračuje jako vodítko */}
      <line x1="0" y1={S} x2={W + VODITKO} y2={S} {...carkovane} />
      <path d={HLINA_A} {...obrys} />
      <path d={`M${OBLOUK.od.join(' ')} Q ${OBLOUK.ridici.join(' ')} ${OBLOUK.hrot.join(' ')}`} {...sipka} />
      <path d={hrot(OBLOUK.hrot[0], OBLOUK.hrot[1], OBLOUK.hrot[0] - OBLOUK.ridici[0], OBLOUK.hrot[1] - OBLOUK.ridici[1])} {...sipka} />
    </g>
    <Popisek y={T_A + S} sloveso="Urovnat" predmet="povrch" />

    {/* ── legenda: značky pixelově shodné s kresbou (9.2 p. 10) ── */}
    <line x1={X} y1={LEG} x2="490" y2={LEG} {...carkovane} />
    {/* hlína: čip 28 × 14, roh čipu = počátek dlaždice jako roh hlíny výřezu */}
    <g transform={`translate(${CIP[0]} ${CIP_Y})`}>
      <rect x="0" y="0" width="28" height="14" {...HLINA} />
      <rect x="0" y="0" width="28" height="14" fill="url(#hpm-hlina)" />
      <rect x="0" y="0" width="28" height="14" {...obrys} />
    </g>
    <text className="sv-val" x={CIP[0] + 36} y={CIP_Y + 12}>hlína</text>
    {/* kámen: táž cesta jako kámen, který trčí z povrchu */}
    <path d={kamen(KAMEN_ZEM, CIP[1], CIP_Y + 9)} {...kamenStyl} />
    <text className="sv-val" x={CIP[1] + 45} y={CIP_Y + 12}>kámen</text>
    {/* utužená vrstva: čip 28 × 14 jako v `jil-jako-vana`, horní hrana ≡ 3 mod 5 */}
    <rect x={CIP[2]} y={CIP_Y} width="28" height="14" {...UTUZENA} />
    <rect x={CIP[2]} y={CIP_Y} width="28" height="14" fill="url(#hpm-lis)" />
    <rect x={CIP[2]} y={CIP_Y} width="28" height="14" {...obrys} />
    <text className="sv-val" x={CIP[2] + 36} y={CIP_Y + 12}>utužená vrstva</text>

    {/* kdy příměsi přijdou na řadu (i37–i38, i41 v3–v4) — bez čísel */}
    <text className="sv-lbl" x={X} y={LEG + 72}>Příměsi až u těžší nebo zanedbané hlíny</text>
  </svg>
)
