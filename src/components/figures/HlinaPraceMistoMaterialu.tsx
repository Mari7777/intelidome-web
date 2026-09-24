import React from 'react'

/**
 * Práce místo materiálu (DESIGN.md 9.2) — u dobře fungující hlíny MŮŽE být
 * dávka nového písku, zeolitu i biocharu nula (i41 v1); víc než nová
 * dodávka může pomoci práce (i39 v3, i41 v6). Záhlaví jako v řadě
 * (`kolik-pisku-do-jilu`, `jil-jako-vana`): klíčová hodnota „0 %" (24 px,
 * jediná) samostatně na y 34, pod ní `.sv-lbl` předmět (y 59) a `.sv-val` věta
 * s podmínkou a modalitou autora („u fungující hlíny může…"). Pod ní tři
 * výřezy hlinité půdy, každý s jednou prací, seřazené od hloubky
 * k povrchu, jak práce jde po sobě (rozrušení vrstvy po bagru je podle
 * i41 v6 první krok, urovnává se nakonec). Nejsou číslované, pořadí nese
 * hloubka. Vpravo sloveso `.sv-lbl` a předmět `.sv-val`, vodítko 3 7:
 * • rozrušit vrstvu po bagru — utužená vrstva je JEDNA souvislá hmota přes
 *   celou šířku výřezu (výška 40, horní i dolní hrana obrysem). Rozrušení
 *   nesou dva klíny otevřené shora, v nich je vidět hlína s drobty; dolní
 *   hrana vrstvy zůstává spojitá, nic se nenatáčí, kry nemají vlastní obrys.
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
 * Značky převzaté ze série (9.2 p. 10):
 * – hlína = zemina #6b5138 op .9 a drobty `hpm-hlina`: dlaždice 12 × 12
 *   pixelově shodná s `hmt-hlina` / `mpn-hlina` / `htz-hlina` (tytéž tři
 *   kruhy). Počátek dlaždice je v rohu hlíny každého výřezu: výřez je
 *   skupina posunutá tak, že horní hrana hlíny (povrch) leží na lokálním
 *   y ≡ 0 mod 12. Na utuženou vrstvu se dlaždice nedává. Čip legendy
 *   14 × 14 = `Cip` z `hlina-tri-znaky`: zemina + dlaždice + obrys 1,6,
 *   roh čipu = počátek dlaždice.
 * – utužená vrstva = #54402c op .95 + světlé lamely 8 × 5 (`pp-lis`,
 *   `tc-lis`, `jjv-lis`); čip 14 × 14 jako v `jil-jako-vana`. Horní hrana
 *   vrstvy i čipu ≡ 3 mod 5, takže lamely mají v čipu i ve výřezu tutéž
 *   fázi jako v `jil-jako-vana`.
 * Kámen není v paletě 9.2, a nemá proto barvu žádné hmoty: obrys 1,6 px
 * a výplň barvou papíru #f6f5f2 = --id-cream. Kresba stojí vždy
 * v krémovém panelu (9.2 p. 6) a E5 leží na krémovém pásu, kde se panel
 * propadne do téhož krému — kámen je tedy „prázdný" tvar, ne hmota.
 * Výplň #d5d3cc s obrysem je v sérii ZEOLIT (nepravidelný šestiúhelník
 * ~10 px); kameny jsou proto oblé (6 vrcholů, rohy zaoblené r 5)
 * a čtyřikrát větší. Čip „kámen" je 1:1 táž cesta jako kámen, který trčí
 * z povrchu (37 × 26). Hlína nemá obrysované hrudky, takže kámen je
 * v kresbě jediný obrysovaný předmět uvnitř hmoty. Horní hranu výřezů
 * nenese drn (příprava před výsevem), obrys hmoty je proto uzavřený
 * (9.2 p. 9). Žádná voda, žádný akcent.
 *
 * Portrétová sazba 520 px, id s prefixem `hpm-`. Jedna levá osa x 30:
 * záhlaví, výřezy (x 30–280), linka legendy, čipy i poznámka. Popisky od
 * x 306. Mobilní sazba 18/21 jednotek, odhad 0,62 / 0,56 em: věta
 * záhlaví končí na x ≈ 489, „utužená vrstva" v legendě ≈ 487, „vrstvu
 * po bagru" ≈ 482, poznámka dole ≈ 465; změřeno v Archivu (panel 344 px)
 * nejdál poznámka 476, ostatní ≤ 460. Rozteč sloveso → předmět 27 drží
 * mezi rámci textů ≥ 5,9, „0 %" → předmět 4,9.
 * Text × tvar ≥ 4 (vodítka končí 8 před popiskem). Jednotka „%" jen
 * v `.sv-val`. Statická kresba.
 */

type Bod = readonly [number, number]

const X = 30 // jedna levá osa
const W = 250 // šířka výřezů
const X_TEXT = X + W + 26 // 306 — popisky vpravo
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
const LEG = 545 // linka legendy; čipy na LEG + 18 = 563 ≡ 3 mod 5
const CIP_Y = LEG + 18

const HLINA = { fill: '#6b5138', opacity: 0.9 } as const
const obrys = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
const carkovane = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const
const kamenStyl = { fill: '#f6f5f2', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
const sipka = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const d1 = (n: number) => Math.round(n * 10) / 10

// ── 1 · rozrušit utuženou vrstvu ────────────────────────────────
/** Dva klíny otevřené shora: [levý kraj ústí, hrot x, hrot y, pravý kraj
 *  ústí]. Hroty končí 13–15 nad dolní hranou — ta zůstává spojitá. */
const KLINY = [
  [66, 82, 60, 100],
  [150, 169, 58, 186],
] as const
const VRSTVA: Bod[] = [
  [0, PAS_H],
  ...KLINY.flatMap(([l, hx, hy, p]) => [[l, PAS_H], [hx, hy], [p, PAS_H]] as Bod[]),
  [W, PAS_H], [W, PAS_D], [0, PAS_D],
]
const VRSTVA_D = `M${VRSTVA.map(([x, y]) => `${x} ${y}`).join(' L')} Z`
const HRANA_HORNI = `M${VRSTVA.slice(0, -2).map(([x, y]) => `${x} ${y}`).join(' L')}`

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
    <text className="sv-val" x={X_TEXT} y={y + 20}>{predmet}</text>
  </g>
)

export const HlinaPraceMistoMaterialu: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 640">
    <defs>
      {/* Drobty hlíny — pixelově shodné s `hmt-hlina` / `mpn-hlina` / `htz-hlina`;
          počátek v počátku skupiny, tj. v rohu hlíny výřezu i čipu. */}
      <pattern id="hpm-hlina" width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.2" fill="#54402c" />
        <circle cx="9" cy="8" r="2.4" fill="#6b5138" />
        <circle cx="4" cy="9.5" r="1" fill="#54402c" />
      </pattern>
      {/* Utužená vrstva — pixelově shodná s `pp-lis` / `tc-lis` / `jjv-lis`. */}
      <pattern id="hpm-lis" width="8" height="5" patternUnits="userSpaceOnUse">
        <path d="M0 2.5 H8" stroke="rgba(255,255,255,.16)" strokeWidth="1" />
      </pattern>
    </defs>

    {/* Pointa kresby (9.2 p. 3) je jedna: nula — s podmínkou autora. */}
    <text className="sv-val" x={X} y="34" style={{ fontSize: 24 }}>0 %</text>
    <text className="sv-lbl" x={X} y="59">nového písku, zeolitu i biocharu</text>
    <text className="sv-val" x={X} y="90">u fungující hlíny může víc pomoci práce</text>

    {/* ── 1 · rozrušit vrstvu po bagru: jedna vrstva, dva klíny ── */}
    <g transform={`translate(${X} ${T_C})`}>
      <rect x="0" y="0" width={W} height={HC} {...HLINA} />
      <rect x="0" y="0" width={W} height={HC} fill="url(#hpm-hlina)" />
      {/* vrstva kryje dlaždici; v klínech je vidět hlína s drobty */}
      <path d={VRSTVA_D} fill="#54402c" opacity="0.95" />
      <path d={VRSTVA_D} fill="url(#hpm-lis)" />
      {/* horní hrana i s klíny a spojitá dolní hrana; boky nese obrys výřezu */}
      <path d={HRANA_HORNI} {...obrys} />
      <path d={`M0 ${PAS_D} H${W}`} {...obrys} />
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

    {/* ── legenda: čipy pixelově shodné s kresbou (9.2 p. 10) ── */}
    <line x1={X} y1={LEG} x2="490" y2={LEG} {...carkovane} />
    {/* hlína: `Cip` z `hlina-tri-znaky` — roh čipu = počátek dlaždice */}
    <g transform={`translate(${X} ${CIP_Y})`}>
      <rect x="0" y="0" width="14" height="14" {...HLINA} />
      <rect x="0" y="0" width="14" height="14" fill="url(#hpm-hlina)" />
      <rect x="0" y="0" width="14" height="14" {...obrys} />
    </g>
    <text className="sv-val" x={X + 22} y={CIP_Y + 12}>hlína</text>
    {/* kámen: táž cesta jako kámen, který trčí z povrchu */}
    <path d={kamen(KAMEN_ZEM, 150, CIP_Y + 9)} {...kamenStyl} />
    <text className="sv-val" x="195" y={CIP_Y + 12}>kámen</text>
    {/* utužená vrstva: čip jako v `jil-jako-vana`, horní hrana ≡ 3 mod 5 */}
    <rect x="300" y={CIP_Y} width="14" height="14" fill="#54402c" fillOpacity="0.95" />
    <rect x="300" y={CIP_Y} width="14" height="14" fill="url(#hpm-lis)" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-val" x="322" y={CIP_Y + 12}>utužená vrstva</text>

    {/* kdy příměsi přijdou na řadu (i37–i38, i41 v3–v4) — bez čísel */}
    <text className="sv-lbl" x={X} y={LEG + 72}>Příměsi až u těžší nebo zanedbané hlíny</text>
  </svg>
)
