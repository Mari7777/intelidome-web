import React from 'react'

import { calculateSoilProfile, INPUT_DEFAULTS, SOIL_PRESETS } from '@/blocks/Calculator/soilProfileMath'

/**
 * Odečet příměsí (DESIGN.md 9.2) — tři vodorovné pruhy po 30 m³ na
 * společném měřítku (440 px = 30 m³), 100 m² × 30 cm, „Udržet výšku",
 * jílovitá předvolba: (1) celý profil, (2) příměsi si vezmou místo jako
 * první, zbytek je jen obrys = minerální základ, (3) základ se dělí 65/35
 * na písek k dovozu a ponechanou zeminu. Pointa je jedna: 29,25 m³
 * minerálního základu. Proužek příměsí má v pruhu jen 11 px, proto ho
 * zvětšuje výřez pod pruhem 2 (296 × 40, 27×): je odsazený od sloupce
 * pruhů (x 60), vodítka 3 7 se k němu rozevírají a nese popisek
 * „výřez · 27×", aby se nečetl jako čtvrtý pruh na témž měřítku. Pod díly
 * výřezu stojí jejich hodnoty (součet na jednom řádku) a jména.
 * Čísla si kresba počítá z `calculateSoilProfile` + `SOIL_PRESETS`, takže
 * sedí s tabulkou článku i s kalkulátorem.
 *
 * Objemový pruh potřebuje plné výplně, proto jsou příměsi plochy (jako
 * biochar v `rz-`), ne zrna z řezů série (šestiboký zeolit, tečky Actina).
 * Značky legendy jsou pixelově shodné s díly pruhů (9.2 p. 10, úroveň 2 —
 * legenda je v témž panelu). V hlavních pruzích za biocharem dělicí čára
 * není: hranu k písku / prázdnu nese výplň, jinak by biochar splynul s čarou.
 *
 * Portrétová sazba 520 px, id s prefixem `op-` (kresba žádné id nemá).
 * Mobilní sazba 18/21 jednotek: záhlaví na dva řádky (rozměr / nastavení),
 * hodnoty kroku 3 na jednom řádku (zemina končí nad svým dílem) a pod
 * nimi sloveso, pointa a popisek základu stojí uvnitř prázdného obrysu.
 * Legenda ve dvou řádcích. Statická kresba.
 */

const PLOCHA = 100 // m²
const HLOUBKA = 30 // cm

const R = calculateSoilProfile({
  ...INPUT_DEFAULTS, ...SOIL_PRESETS.jil, mode: 'keep', soil: 'jil', area: PLOCHA, depth: HLOUBKA, loss: 0,
})
const PRIMESI = R.clean.biovin + R.clean.zeolit + R.clean.char
const ZAKLAD = R.clean.sand + R.clean.soil

/** Desetinná čárka, `d` míst. */
const cislo = (n: number, d = 2) => n.toFixed(d).replace('.', ',')

const X0 = 40
const SIRKA = 440
const H = 36
const PX = SIRKA / R.initialVolume // px na m³
const W_PRIM = PRIMESI * PX // 11 px

/** Výplně hmot — táž výplň v pruhu, ve výřezu i v legendě (9.2 p. 10). */
const HMOTA = {
  pisek: { fill: '#c2a052', fillOpacity: 0.55 },
  zemina: { fill: '#6b5138', fillOpacity: 0.9 },
  // Actino plně jako značka Actina v sérii (`mh-plna`): s op .85 splýval se zeminou.
  actino: { fill: '#54402c', fillOpacity: 1 },
  zeolit: { fill: '#d5d3cc', fillOpacity: 1 },
  biochar: { fill: '#12161b', fillOpacity: 0.9 },
} as const
type Hmota = keyof typeof HMOTA

const obrys = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
const voditko = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const

/** Příměsi v pořadí zleva: Actino, zeolit, biochar (m³). */
const PRIMESI_DILY: [Hmota, number, string][] = [
  ['actino', R.clean.biovin, 'Actino'],
  ['zeolit', R.clean.zeolit, 'zeolit'],
  ['biochar', R.clean.char, 'biochar'],
]

/** Pruh z dílů [hmota | null = prázdno, šířka]: výplně, dělicí čáry, uzavřený obrys. */
const Pruh: React.FC<{ x: number; y: number; w: number; h: number; dily: [Hmota | null, number][]; delit?: boolean[] }> = ({
  x, y, w, h, dily, delit,
}) => {
  let pos = x
  const useky = dily.map(([hmota, sirka]) => {
    const u = { hmota, x: pos, sirka }
    pos += sirka
    return u
  })
  return (
    <g>
      {useky.map((u) =>
        u.hmota ? <rect key={u.x} x={u.x} y={y} width={u.sirka} height={h} {...HMOTA[u.hmota]} /> : null,
      )}
      {/* dělicí čára za dílem i (ne za posledním) */}
      {useky.slice(0, -1).map((u, i) =>
        delit && !delit[i] ? null : (
          <line key={u.x} x1={u.x + u.sirka} y1={y} x2={u.x + u.sirka} y2={y + h} stroke="#232830" strokeWidth="1.6" />
        ),
      )}
      <path d={`M${x} ${y} H${x + w} V${y + h} H${x} Z`} {...obrys} />
    </g>
  )
}

/** Proužek příměsí v hlavním měřítku (3,7 / 4,4 / 2,9 px) bez vnitřních čar
 *  a bez čáry za biocharem — ta by ho při 2,9 px překryla. */
const PROUZEK: [Hmota, number][] = PRIMESI_DILY.map(([h, m3]) => [h, m3 * PX])

/** Značka legendy: políčko 14 × 14, výplň i obrys jako díl pruhu. */
const Znacka: React.FC<{ hmota: Hmota; x: number; y: number }> = ({ hmota, x, y }) => (
  <rect x={x} y={y} width="14" height="14" {...HMOTA[hmota]} stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
)

// ── svislá sazba ───────────────────────────────────────────────
const Y1 = 108 // krok 1
const Y2 = 198 // krok 2
const Y3 = 410 // krok 3
const LEG = 512 // linka legendy
const VYSKA = LEG + 86 // 598

// ── výřez: odsazený od sloupce pruhů, díly zvětšené ~27× ───────
const LX = 60
const LY = Y2 + H + 28 // 262
const LW = 296
const LH = 40
const LUPA = LW / PRIMESI // px na m³ ve výřezu
const ZVETSENI = Math.round(LUPA / PX) // 27 (přesně 26,9)
const VYREZ = PRIMESI_DILY.reduce<{ x: number; w: number; m3: number; jmeno: string }[]>((acc, [, m3, jmeno]) => {
  const x = acc.length ? acc[acc.length - 1].x + acc[acc.length - 1].w : LX
  return [...acc, { x, w: m3 * LUPA, m3, jmeno }]
}, [])
const Y_HODNOTY = LY + LH + 26 // 328
const Y_JMENA = Y_HODNOTY + 26 // 354

export const OdecetPrimesi: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox={`0 0 520 ${VYSKA}`}>
    {/* záhlaví: rozměr jako hodnota (jednotky malými), nastavení jako popisek */}
    <text className="sv-val" x={X0} y="30">{`${PLOCHA} m² × ${HLOUBKA} cm`}</text>
    <text className="sv-lbl" x={X0} y="56">„Udržet výšku“ · jílovitá předvolba</text>

    {/* ── 1 · celý profil ─────────────────────────────────────── */}
    <text className="sv-lbl" x={X0} y={Y1 - 12}>1 · Celý profil</text>
    <text className="sv-val" x={X0 + SIRKA} y={Y1 - 12} textAnchor="end">{`${cislo(R.initialVolume, 0)} m³`}</text>
    <Pruh x={X0} y={Y1} w={SIRKA} h={H} dily={[['zemina', SIRKA]]} />

    {/* ── 2 · příměsi první, zbytek jen obrys ─────────────────── */}
    <text className="sv-lbl" x={X0} y={Y2 - 12}>2 · Příměsi si vezmou místo první</text>
    <Pruh x={X0} y={Y2} w={SIRKA} h={H} dily={[...PROUZEK, [null, SIRKA - W_PRIM]]} delit={[false, false, false]} />
    {/* Pointa kresby (9.2 p. 3) je jedna: zbylý minerální základ. Stojí
        v prázdném obrysu, který pojmenovává. */}
    <text className="sv-val" x={X0 + W_PRIM + 14} y={Y2 + 26} style={{ fontSize: 24 }}>{`${cislo(ZAKLAD)} m³`}</text>
    <text className="sv-lbl" x={X0 + W_PRIM + 125} y={Y2 + 26}>minerální základ</text>

    {/* výřez: vodítka se od proužku rozevírají k odsazenému výřezu */}
    <line x1={X0} y1={Y2 + H} x2={LX} y2={LY} {...voditko} />
    <line x1={X0 + W_PRIM} y1={Y2 + H} x2={LX + LW} y2={LY} {...voditko} />
    <Pruh x={LX} y={LY} w={LW} h={LH} dily={VYREZ.map((d, i) => [PRIMESI_DILY[i][0], d.w])} />
    <text className="sv-lbl" x={LX + LW + 10} y={LY + 14}>{`výřez · ${ZVETSENI}×`}</text>
    {/* hodnota pod středem dílu, „+" mezi hodnotami, součet za výřezem */}
    {VYREZ.map((d) => (
      <text key={d.jmeno} className="sv-val" x={d.x + d.w / 2} y={Y_HODNOTY} textAnchor="middle">{cislo(d.m3)}</text>
    ))}
    {VYREZ.slice(1).map((d, i) => (
      <text key={d.jmeno} className="sv-val" x={(VYREZ[i].x + VYREZ[i].w / 2 + d.x + d.w / 2) / 2} y={Y_HODNOTY} textAnchor="middle">
        +
      </text>
    ))}
    <text className="sv-val" x={LX + LW + 10} y={Y_HODNOTY}>{`= ${cislo(PRIMESI)} m³`}</text>
    {VYREZ.map((d) => (
      <text key={d.jmeno} className="sv-lbl" x={d.x + d.w / 2} y={Y_JMENA} textAnchor="middle">{d.jmeno}</text>
    ))}

    {/* ── 3 · základ dělíme 65/35 ─────────────────────────────── */}
    <text className="sv-lbl" x={X0} y={Y3 - 12}>{`3 · Základ dělíme ${SOIL_PRESETS.jil.ratio}/${100 - SOIL_PRESETS.jil.ratio}`}</text>
    <Pruh
      x={X0}
      y={Y3}
      w={SIRKA}
      h={H}
      dily={[...PROUZEK, ['pisek', R.clean.sand * PX], ['zemina', R.clean.soil * PX]]}
      delit={[false, false, false, true]}
    />
    {/* jeden řádek hodnot (písek od začátku, zemina nad svým dílem), pod ním sloveso */}
    <text className="sv-val" x={X0} y={Y3 + H + 26}>{`písek ${cislo(R.clean.sand)} m³`}</text>
    <text className="sv-val" x={X0 + SIRKA} y={Y3 + H + 26} textAnchor="end">{`zemina ${cislo(R.keepM3)} m³`}</text>
    <text className="sv-lbl" x={X0} y={Y3 + H + 52}>dovézt</text>
    <text className="sv-lbl" x={X0 + SIRKA} y={Y3 + H + 52} textAnchor="end">ponechat</text>

    {/* ── legenda: základ nahoře, příměsi dole (9.2 p. 10) ────── */}
    <line x1="30" y1={LEG} x2="490" y2={LEG} {...voditko} />
    <Znacka hmota="pisek" x={30} y={LEG + 16} />
    <text className="sv-val" x="52" y={LEG + 28}>písek</text>
    <Znacka hmota="zemina" x={176} y={LEG + 16} />
    <text className="sv-val" x="198" y={LEG + 28}>zemina</text>
    <Znacka hmota="actino" x={30} y={LEG + 46} />
    <text className="sv-val" x="52" y={LEG + 58}>Actino</text>
    <Znacka hmota="zeolit" x={176} y={LEG + 46} />
    <text className="sv-val" x="198" y={LEG + 58}>zeolit</text>
    <Znacka hmota="biochar" x={322} y={LEG + 46} />
    <text className="sv-val" x="344" y={LEG + 58}>biochar</text>
  </svg>
)
