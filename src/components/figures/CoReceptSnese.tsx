import React from 'react'

/**
 * Co recept snese (DESIGN.md 9.2) — tři řádky plán × skutečnost, jeden
 * čtvereček = plánované množství. (a) Hmotnost dodávky kolísá s vlhkostí
 * o pár kilogramů: skutečnost je týž čtvereček písku, jen s čárkovanou
 * tolerancí kolem — recept stejný (≈). (b) Dvě, nebo osm procent zeolitu:
 * jeden čtvereček proti čtyřem — jiný recept (≠). (c) Půl kubíku, nebo půl
 * tuny biocharu (autorův příklad, i15): jeden čtvereček proti řadě, která
 * pokračuje za okraj — násobně víc, jiný recept (≠). Pointa je jedna
 * (24 px): zaokrouhlit ano, zaměnit ne; znaménka ≈ / ≠ ve verdiktech ji
 * zrcadlí. Kryje obě půlky splitu (hmotnost vs. poměr, i11–i15).
 *
 * Řádek (c) nemá číslo přepočtu (5×, 2,5 m³ ani t/m³) — to nese
 * `tuna-neni-kubik` o split výš. Řadu utíná ostrý řez `crs-rez` (vzor
 * `kzn-rez`) na pravé hraně obsahu x 490: čtyři plné čtverečky s uzavřeným
 * obrysem a z pátého 14 jednotek bez pravé hrany, tedy „řada pokračuje";
 * žádná maska ani přechod (plochá hmota se nestínuje, 9.2), takže nevzniká
 * šedý tón podobný zeolitu. Konec řady není vidět, takže „násobně víc"
 * nejde dopočítat; vidět je víc než čtyřnásobek, což modelové hustotě
 * v `tuna-neni-kubik` (5×) neodporuje. Čtverce, ne pruhy, aby se kresba
 * nečetla jako pokračování jejího pruhového grafu. Vlhkost nemá značku (hnědé
 * tečky v písku jsou v sérii „prach a jíl" / směs, 9.2 p. 10): nese ji
 * jen text „vlhkost ± pár kg"; čárkovaná tolerance #d5d3cc 3 7 odsazená
 * o 5 je konstrukční linka, ne hmota. Kresba nemá akcent (není voda).
 *
 * Výplně čtverců jsou objemové plochy série jako v `odecet-primesi`
 * (písek #c2a052 op .55, zeolit #d5d3cc, biochar #12161b op .9, vše
 * s obrysem #232830 1,6); legenda je má v témž panelu pixelově shodné.
 *
 * Jednotky nikdy v `.sv-lbl` (uppercase z nich dělá „KG", „M³"): hodnoty
 * pod čtverečky jsou `.sv-val`, slovní část ve vzoru tspan (`.sv-lbl`,
 * vzor `podil-z-vlastni-hloubky`). Verdikt řádku = znaménko `.sv-val`
 * + slova `.sv-lbl`, takže pointa zůstane jediný velký tučný řádek; nad
 * verdiktem čárkovaná linka přes celý řádek (40–490) jako „součtová čára".
 * Pravá hrana kresby je jedna (XE = 490): linky záhlaví a verdiktů, řez
 * řady (c) i linka legendy končí na ní.
 *
 * Portrétová sazba 520 px, viewBox 0 0 520 720, id s prefixem `crs-`.
 * Sloupce PLÁN (x 40) a SKUTEČNOST (x 220) zůstávají vedle sebe i na
 * telefonu (pevný viewBox se přeskládat nedá). Řádek: titulek, čtverečky
 * (+15), hodnoty (+100), linka (+112), verdikt (+136); rozteč řádků 188,
 * takže verdikt má ke své lince blíž (~6) než k titulku dalšího řádku
 * (~31). V sazbě 18/21 končí nejširší text („Jeden čtvereček = …") na
 * x ≈ 481, mezery mezi rámci textů i text × tvar ≥ 4. Statická kresba.
 */

const XP = 40 // sloupec PLÁN
const XS = 220 // sloupec SKUTEČNOST
const XE = 490 // pravý okraj obsahu = řez řady (c) = konec linky legendy
const S = 56 // čtvereček = plánované množství
const MEZERA = 8
const TOLERANCE = 5 // odsazení čárkovaného obrysu v řádku (a)

const TA = 142 // titulek řádku (a)
const TB = TA + 188 // 330
const TC = TB + 188 // 518
const ctverce = (t: number) => t + 15 // horní hrana čtverečků řádku
const hodnoty = (t: number) => t + 100 // účaří hodnot pod čtverečky
const linka = (t: number) => t + 112 // čárkovaná linka nad verdiktem
const verdikt = (t: number) => t + 136 // účaří verdiktu

const LEG = 678 // linka legendy

/** Objemové plochy hmot — táž výplň ve čtverečku i v legendě (9.2 p. 10). */
const HMOTA = {
  pisek: { fill: '#c2a052', fillOpacity: 0.55 },
  zeolit: { fill: '#d5d3cc', fillOpacity: 1 },
  biochar: { fill: '#12161b', fillOpacity: 0.9 },
} as const
type Hmota = keyof typeof HMOTA

const obrys = { stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
const voditko = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const

const Ctverec: React.FC<{ x: number; y: number; hmota: Hmota }> = ({ x, y, hmota }) => (
  <rect x={x} y={y} width={S} height={S} {...HMOTA[hmota]} {...obrys} />
)

/** Značka legendy: políčko 14 × 14 jako `odecet-primesi`. */
const Znacka: React.FC<{ x: number; hmota: Hmota }> = ({ x, hmota }) => (
  <rect x={x} y={LEG + 16} width="14" height="14" {...HMOTA[hmota]} {...obrys} />
)

/** Verdikt řádku: čárkovaná „součtová" linka, znaménko `.sv-val`, slova `.sv-lbl`. */
const Verdikt: React.FC<{ t: number; znak: string; slova: string }> = ({ t, znak, slova }) => (
  <g>
    <line x1={XP} y1={linka(t)} x2={XE} y2={linka(t)} {...voditko} />
    <text className="sv-val" x={XP} y={verdikt(t)}>
      {znak}
      <tspan className="sv-lbl">{` ${slova}`}</tspan>
    </text>
  </g>
)

const RADA = [0, 1, 2, 3, 4] // čtverečky řady v řádku (c), pátý přeříznutý řezem na XE

export const CoReceptSnese: React.FC = () => {
  const ya = ctverce(TA)
  const yb = ctverce(TB)
  const yc = ctverce(TC)
  return (
    <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 720">
      <defs>
        {/* Ostrý řez řady (c) na pravé hraně obsahu (vzor `kzn-rez`): plné
            krytí, žádný přechod; z pátého čtverečku zbude 14 jednotek. */}
        <clipPath id="crs-rez">
          <rect x={XS - 4} y={yc - 4} width={XE - XS + 4} height={S + 8} />
        </clipPath>
      </defs>

      {/* Pointa kresby (9.2 p. 3) je jedna: zaokrouhlit ano, zaměnit ne. */}
      <text className="sv-val" x={XP} y="38" style={{ fontSize: 24 }}>Zaokrouhlit ano, zaměnit ne</text>
      <text className="sv-lbl" x={XP} y="64">Jeden čtvereček = plánované množství</text>

      {/* ── záhlaví sloupců ─────────────────────────────────────── */}
      <text className="sv-lbl" x={XP} y="98">Plán</text>
      <text className="sv-lbl" x={XS} y="98">Skutečnost</text>
      <line x1={XP} y1="110" x2={XS - 40} y2="110" {...voditko} />
      <line x1={XS} y1="110" x2={XE} y2="110" {...voditko} />

      {/* ── (a) hmotnost kolísá: týž čtvereček v toleranci ────────── */}
      <text className="sv-lbl" x={XP} y={TA}>Hmotnost kolísá</text>
      <Ctverec x={XP} y={ya} hmota="pisek" />
      <Ctverec x={XS} y={ya} hmota="pisek" />
      {/* tolerance: konstrukční linka, ne hmota */}
      <rect
        x={XS - TOLERANCE}
        y={ya - TOLERANCE}
        width={S + 2 * TOLERANCE}
        height={S + 2 * TOLERANCE}
        fill="none"
        {...voditko}
      />
      <text className="sv-val" x={XS} y={hodnoty(TA)}>
        <tspan className="sv-lbl">{'vlhkost '}</tspan>
        ± pár kg
      </text>
      <Verdikt t={TA} znak="≈" slova="tentýž recept" />

      {/* ── (b) dvě, nebo osm procent: jeden čtvereček proti čtyřem ── */}
      <text className="sv-lbl" x={XP} y={TB}>Dvě, nebo osm procent zeolitu</text>
      <Ctverec x={XP} y={yb} hmota="zeolit" />
      {[0, 1, 2, 3].map((i) => (
        <Ctverec key={i} x={XS + i * (S + MEZERA)} y={yb} hmota="zeolit" />
      ))}
      <text className="sv-val" x={XP} y={hodnoty(TB)}>2 %</text>
      <text className="sv-val" x={XS} y={hodnoty(TB)}>8 %</text>
      <Verdikt t={TB} znak="≠" slova="jiný recept" />

      {/* ── (c) půl kubíku, nebo půl tuny biocharu: bez přepočtu ──── */}
      <text className="sv-lbl" x={XP} y={TC}>Objem, nebo tuny</text>
      <Ctverec x={XP} y={yc} hmota="biochar" />
      <g clipPath="url(#crs-rez)">
        {RADA.map((i) => (
          <Ctverec key={i} x={XS + i * (S + MEZERA)} y={yc} hmota="biochar" />
        ))}
      </g>
      <text className="sv-val" x={XP} y={hodnoty(TC)}>½ m³</text>
      <text className="sv-val" x={XS} y={hodnoty(TC)}>½ t</text>
      <Verdikt t={TC} znak="≠" slova="jiný recept" />

      {/* ── legenda: značky pixelově shodné s kresbou (9.2 p. 10) ── */}
      <line x1="30" y1={LEG} x2="490" y2={LEG} {...voditko} />
      <Znacka x={30} hmota="pisek" />
      <text className="sv-val" x="52" y={LEG + 28}>písek</text>
      <Znacka x={176} hmota="zeolit" />
      <text className="sv-val" x="198" y={LEG + 28}>zeolit</text>
      <Znacka x={322} hmota="biochar" />
      <text className="sv-val" x="344" y={LEG + 28}>biochar</text>
    </svg>
  )
}
