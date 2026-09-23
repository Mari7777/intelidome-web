import React from 'react'

import { calculateSoilProfile, INPUT_DEFAULTS, SOIL_PRESETS } from '@/blocks/Calculator/soilProfileMath'

/**
 * Písek podle předvolby (DESIGN.md 9.2) — s kolika m³ písku počítají
 * výchozí předvolby kalkulátoru na tutéž plochu 100 m² a profil 30 cm
 * (režim Udržet výšku). Tři svislé sloupce na společné čárkované
 * základně (13 px na m³); písčitá stojí na téže ose s nulovou výškou.
 * Pointa je jedna: hlinitá zahrada s udržovanou ornicí (8,78 m³);
 * jílovitá je nad ní, písčitá bez dalšího písku.
 * Příbuzná `zaklad-tri-zahrad` ukazuje poměr ve 100% pruzích; tady jde
 * o množství. Záhlaví mluví o předvolbách, ne o pokynu (i23: z předvolby
 * neplyne povinnost přestavovat). Hmota je jedna a pojmenovaná v záhlaví,
 * legenda barev proto není potřeba; klíč poměrů stojí pod řádkem poměrů.
 *
 * Čísla kresba počítá při vykreslení z `calculateSoilProfile` +
 * `SOIL_PRESETS`. Alt a popisek v obsahu článku ale nesou literály
 * (19,01 / 8,78 m³, 28,5 / 13,2 t, 65/35, 30/70) — při změně předvoleb
 * je nutné je přepsat ručně, jinak se kresba s altem rozejde.
 *
 * Jednotky (m², cm, m³, t) nikdy v `.sv-lbl`: verzálky by z nich udělaly
 * fyzikálně chybné „M³" / „T" (viz TunaNeniKubik). Tuny proto slovem.
 *
 * Portrétová sazba 520 px, id s prefixem `pp-` (kresba žádné id nemá).
 * Popisky centrované na sloupec (rozteč 152) se vejdou i v mobilní sazbě
 * 18/21 jednotek; nad sloupcem objem `.sv-val`, pod ním tuny `.sv-lbl`
 * (hierarchie jako hodnota + popisek ve vzorech). Statická kresba.
 */

const PLOCHA = 100 // m²
const HLOUBKA = 30 // cm
const BASE = 400 // společná základna sloupců
const PX_M3 = 13 // vršek jílovité na y ≈ 153, hodnota se tak neslije se záhlavím
const W = 96
const X_TXT = 40 // levá osa textů = začátek čárkované základny

const ZAHRADY = [
  { soil: 'jil', x: 60, nazev: 'Jílovitá' },
  { soil: 'hlina', x: 212, nazev: 'Hlinitá' },
  { soil: 'pisek', x: 364, nazev: 'Písčitá' },
] as const

/** Desetinná čárka, výchozí dvě místa. */
const cislo = (n: number, mista = 2) => n.toFixed(mista).replace('.', ',')

/** Dovoz písku pro výchozí předvolbu dané zahrady (Udržet výšku, bez rezervy). */
const SLOUPCE = ZAHRADY.map((z) => {
  const preset = SOIL_PRESETS[z.soil]
  const { delivery } = calculateSoilProfile({
    ...INPUT_DEFAULTS, ...preset, mode: 'keep', soil: z.soil, area: PLOCHA, depth: HLOUBKA,
  })
  return {
    ...z,
    m3: delivery.sand.m3,
    t: delivery.sand.tonnes,
    pomer: preset.ratio > 0 ? `${preset.ratio}/${100 - preset.ratio}` : 'bez dalšího písku',
  }
})

const CARKOVANA = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const

export const PisekPodlePredvolby: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 520">
    <text className="sv-lbl" x={X_TXT} y="34">Dovoz písku podle výchozích předvoleb</text>
    <text className="sv-val" x={X_TXT} y="62">{`${PLOCHA} m² × ${HLOUBKA} cm · Udržet výšku`}</text>

    {/* společná základna přes celou šíři; spodní obrysy sloupců ji v jejich
        šířce překryjí, takže písčitá čte jako „tatáž osa, nulová výška" */}
    <line x1={X_TXT} y1={BASE} x2={520 - X_TXT} y2={BASE} {...CARKOVANA} />

    {SLOUPCE.map((s) => {
      const stred = s.x + W / 2
      const top = BASE - s.m3 * PX_M3
      // Pointa kresby (9.2 p. 3) je jedna: hlinitá zahrada.
      const pointa = s.soil === 'hlina'
      return (
        <g key={s.soil}>
          {s.m3 > 0 ? (
            <g>
              <rect x={s.x} y={top} width={W} height={BASE - top} fill="#c2a052" opacity="0.55" />
              <path
                d={`M${s.x} ${top} H${s.x + W} V${BASE} H${s.x} Z`}
                fill="none"
                stroke="#232830"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <g textAnchor="middle">
                <text className="sv-val" x={stred} y={top - 34} style={pointa ? { fontSize: 24 } : undefined}>
                  {`${cislo(s.m3)} m³`}
                </text>
                {/* tuny na jedno místo (sedí s altem), slovem kvůli verzálkám */}
                <text className="sv-lbl" x={stred} y={top - 9}>{`≈ ${cislo(s.t, 1)} tuny`}</text>
              </g>
            </g>
          ) : (
            <text className="sv-val" x={stred} y={BASE - 14} textAnchor="middle">0 m³</text>
          )}

          {/* ── pod základnou: zahrada a poměr písek/zemina ─────────── */}
          <g textAnchor="middle">
            <text className="sv-val" x={stred} y={BASE + 27}>{s.nazev}</text>
            <text className="sv-lbl" x={stred} y={BASE + 53}>{s.pomer}</text>
          </g>
        </g>
      )
    })}

    {/* klíč k řádku poměrů a převod na tuny (jednotky v .sv-val) */}
    <text className="sv-lbl" x={X_TXT} y="480">poměr písek/zemina v minerálním základu</text>
    <text className="sv-val" x={X_TXT} y="510">{`1 m³ písku ≈ ${cislo(INPUT_DEFAULTS.rhoS, 1)} t`}</text>
  </svg>
)
