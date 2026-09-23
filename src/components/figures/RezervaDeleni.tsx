import React from 'react'

import { calculateSoilProfile, INPUT_DEFAULTS, SOIL_PRESETS, type SoilProfileInput } from '@/blocks/Calculator/soilProfileMath'

/**
 * Rezerva se dělí, nepřičítá (DESIGN.md 9.2) — dva pruhy biocharu ve
 * stejném měřítku (1,4 px na litr od x = 170). Horní: objednávka podle
 * kalkulátoru, 200 ÷ 0,9 ≈ 222 l; po úbytku 10 % z dodávky zbude do
 * směsi přesně 200 l. Spodní: prosté přičtení 200 + 10 % = 220 l; po
 * témže úbytku zbude 198 l. Oba řádky nesou vlevo hodnotu a pod ní svůj
 * výpočet, takže dělení i přičtení stojí proti sobě. Pointa je jedna
 * (≈ 222 l, 24 px). Rozdíl 2 l jsou 2,8 jednotky — nese ho popisek, ne
 * kóta; čárkovaná linka na potřebě 200 l se proto kreslí jen MIMO pruhy
 * (nad, mezi, pod), aby nesplynula se šrafou a konce černé šly porovnat.
 *
 * Čísla si kresba počítá z `calculateSoilProfile` + `SOIL_PRESETS` na
 * příkladu článku (100 m², 30 cm, Udržet výšku, jílovitá předvolba,
 * biochar 2 % do 10 cm = 0,20 m³). Plná výplň = biochar do směsi (táž
 * značka jako biochar v `odecet-primesi`), šrafa tenkými konstrukčními
 * linkami = úbytek z dodávky; legenda v témž panelu má pixelově shodné
 * značky (9.2 p. 10), 28 × 14, aby šrafou prošly aspoň tři linky.
 *
 * Jednotky nikdy v `.sv-lbl`: uppercase z nich dělá „L" a „M³". Výpočty
 * pod hodnotami jsou bez jednotky; dvojice štítek + hodnota je jeden
 * `<text class="sv-val">` se štítkem v `<tspan class="sv-lbl">` — hodnota
 * tak uppercase nezdědí a přejímka čte velikost písma z `.sv-val`.
 *
 * Portrétová sazba 520 px, id s prefixem `rz-`. Levé popisky končí na
 * x = 158, takže i v mobilní sazbě 18/21 jednotek začínají za osou
 * nadpisu (x = 40); dvouřádkový vzorec má rozteč 28, ne 20, jinak se
 * hodnoty 21 jednotek na telefonu překrývají. Statická kresba.
 */

/** Příklad článku: 100 m², profil 30 cm, Udržet výšku, jílovitá předvolba. */
const PRIKLAD: SoilProfileInput = {
  ...INPUT_DEFAULTS, ...SOIL_PRESETS.jil, mode: 'keep', soil: 'jil', area: 100, depth: 30,
}
const REZERVA = 10 // %

/** Čistý biochar do směsi a objednávka podle kalkulátoru (litry). */
const CISTA = calculateSoilProfile({ ...PRIKLAD, loss: 0 }).delivery.char.litres // 200
const OBJEDNAVKA = calculateSoilProfile({ ...PRIKLAD, loss: REZERVA }).delivery.char.litres // 222,2
/** Prosté přičtení a co z něj po stejném úbytku zbude. */
const PROSTA = CISTA * (1 + REZERVA / 100) // 220
const ZBUDE = PROSTA * (1 - REZERVA / 100) // 198
const CHYBI = CISTA - ZBUDE // 2

const cislo = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',')
const l = (n: number) => `${Math.round(n)} l`
const m3 = (litry: number) => (litry / 1000).toFixed(2).replace('.', ',')

const X0 = 170
const PX_L = 1.4
const x = (litry: number) => X0 + litry * PX_L
const XL = X0 - 12 // konec levých popisků
const H = 36
const T1 = 146 // horní pruh
const T2 = 235 // spodní pruh: mezera 53 = 5 period čárkování + čárka, linka se dotkne obou hran
const XP = x(CISTA) // potřeba směsi, 450

const obrys = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
const voditko = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const
const BIOCHAR = { fill: '#12161b', opacity: 0.9 } as const

/** Pruh: plný díl do směsi + šrafa úbytku, uzavřený obrys přes oba. */
const Pruh: React.FC<{ y: number; doSmesi: number; celkem: number }> = ({ y, doSmesi, celkem }) => (
  <g>
    <rect x={X0} y={y} width={doSmesi * PX_L} height={H} {...BIOCHAR} />
    <rect x={x(doSmesi)} y={y} width={(celkem - doSmesi) * PX_L} height={H} fill="url(#rz-srafa)" />
    <rect x={X0} y={y} width={celkem * PX_L} height={H} {...obrys} />
  </g>
)

/** Úsek linky potřeby; čárkování začíná na hraně pruhu (y1), aby se ho dotklo. */
const Usek: React.FC<{ y1: number; y2: number }> = ({ y1, y2 }) => (
  <line x1={XP} y1={y1} x2={XP} y2={y2} {...voditko} />
)

export const RezervaDeleni: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 404">
    <defs>
      {/* úbytek z dodávky: šikmé tenké linky konstrukční barvy, bez výplně */}
      <pattern id="rz-srafa" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="3.5" y1="0" x2="3.5" y2="7" stroke="#d5d3cc" strokeWidth="1.6" />
      </pattern>
    </defs>

    {/* ── vzorec ──────────────────────────────────────────────── */}
    <text className="sv-lbl" x="40" y="34">Rezerva se dělí, nepřičítá</text>
    <text className="sv-val" x="40" y="62">objednávka = čisté množství</text>
    <text className="sv-val" x="40" y="90">÷ (1 − rezerva/100)</text>

    {/* ── konstrukční linka: potřeba směsi; konec „l" sedne na osu ── */}
    <text className="sv-val" x={XP + 2} y="120" textAnchor="end">
      <tspan className="sv-lbl">{'potřeba směsi '}</tspan>
      {l(CISTA)}
    </text>
    {/* Jen mimo pruhy: uvnitř by splynula se šrafou (táž barva i tah). */}
    <Usek y1={T1} y2={T1 - 13} />
    <Usek y1={T1 + H} y2={T2} />
    <Usek y1={T2 + H} y2={T2 + H + 13} />

    {/* ── horní: objednávka podle kalkulátoru ─────────────────── */}
    <Pruh y={T1} doSmesi={CISTA} celkem={OBJEDNAVKA} />
    {/* Pointa kresby (9.2 p. 3) je jedna: kolik objednat. */}
    <text className="sv-val" x={XL} y={T1 + 16} textAnchor="end" style={{ fontSize: 24 }}>{`≈ ${l(OBJEDNAVKA)}`}</text>
    <text className="sv-lbl" x={XL} y={T1 + 43} textAnchor="end">{`${Math.round(CISTA)} ÷ ${cislo(1 - REZERVA / 100)}`}</text>
    <text className="sv-val" x={X0} y={T1 + H + 26}>{`do směsi ${l(OBJEDNAVKA * (1 - REZERVA / 100))}`}</text>

    {/* ── spodní: prosté přičtení ─────────────────────────────── */}
    <Pruh y={T2} doSmesi={ZBUDE} celkem={PROSTA} />
    <text className="sv-val" x={XL} y={T2 + 16} textAnchor="end">{l(PROSTA)}</text>
    <text className="sv-lbl" x={XL} y={T2 + 43} textAnchor="end">{`${Math.round(CISTA)} + ${REZERVA} %`}</text>
    <text className="sv-val" x={X0} y={T2 + H + 26}>{`do směsi ${l(ZBUDE)} · chybí ${l(CHYBI)}`}</text>

    {/* ── legenda: tytéž výplně i obrys jako pruhy (9.2 p. 10) ── */}
    <line x1="30" y1="320" x2="490" y2="320" {...voditko} />
    <rect x="30" y="336" width="28" height="14" {...BIOCHAR} />
    <rect x="30" y="336" width="28" height="14" {...obrys} />
    <text className="sv-val" x="68" y="348">biochar do směsi</text>
    <rect x="266" y="336" width="28" height="14" fill="url(#rz-srafa)" />
    <rect x="266" y="336" width="28" height="14" {...obrys} />
    <text className="sv-val" x="304" y="348">úbytek z dodávky</text>
    <text className="sv-val" x="30" y="382">
      <tspan className="sv-lbl">{'z příkladu '}</tspan>
      {`${m3(CISTA)} m³ = ${l(CISTA)}`}
    </text>
  </svg>
)
