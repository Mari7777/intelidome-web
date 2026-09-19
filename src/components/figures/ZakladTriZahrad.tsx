import React from 'react'

/**
 * Minerální základ tří zahrad (DESIGN.md 9.2) — vodorovné 100% pruhy
 * ukazují poměr přidaného písku a původní zeminy JEN v minerálním
 * základu (příměsi si z celku berou podíl zvlášť — o nich je Obr. se
 * sloupci dávek). Doplněk kresby tří zahrad: tam příměsi, tady základ.
 * Statická kresba, id s prefixem `zz-`.
 */

const RADKY: {
  nazev: string
  /** [přidaný písek %, původní zemina %]; pisek=false → původní písčitá zemina */
  pisek: number
  popis: string
}[] = [
  { nazev: 'Jíl', pisek: 65, popis: '65 % přidaného písku · 35 % zeminy' },
  { nazev: 'Hlína', pisek: 30, popis: '30 % přidaného písku · 70 % ornice' },
  { nazev: 'Písek', pisek: 0, popis: 'bez nákupu — 100 % původní zeminy' },
]

const X0 = 130
const SIRKA = 350
const VYSKA = 30

export const ZakladTriZahrad: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 530">
    <text className="sv-lbl" x="40" y="34">Poměr v minerálním základu</text>
    {/* Pointa kresby (9.2 p. 3) je jedna: u jílu je písku většina. */}
    <text className="sv-val" x="480" y="40" textAnchor="end" style={{ fontSize: 24 }}>65/35</text>

    {RADKY.map((r, i) => {
      const y = 108 + i * 88
      const deleni = X0 + (SIRKA * r.pisek) / 100
      return (
        <g key={r.nazev}>
          <text className="sv-lbl" x={X0} y={y - 12}>{r.popis}</text>
          <text className="sv-val" x={X0 - 16} y={y + VYSKA - 9} textAnchor="end">{r.nazev}</text>
          {r.pisek > 0 ? (
            <g>
              <rect x={X0} y={y} width={deleni - X0} height={VYSKA} fill="#c2a052" opacity="0.55" />
              <rect x={deleni} y={y} width={X0 + SIRKA - deleni} height={VYSKA} fill="#6b5138" opacity="0.9" />
              <line x1={deleni} y1={y} x2={deleni} y2={y + VYSKA} stroke="#232830" strokeWidth="1.6" />
            </g>
          ) : (
            <rect x={X0} y={y} width={SIRKA} height={VYSKA} fill="#c2a052" opacity="0.45" />
          )}
          <path
            d={`M${X0} ${y} H${X0 + SIRKA} V${y + VYSKA} H${X0} Z`}
            fill="none"
            stroke="#232830"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </g>
      )
    })}

    <text className="sv-lbl" x="40" y="356">Pár lopat písku poměr nezmění —</text>
    <text className="sv-lbl" x="40" y="376">u těžkých jílů podklady uvádějí i 75 %</text>

    {/* ── legenda: tytéž výplně jako pruhy ───────────────────── */}
    <line x1="30" y1="400" x2="490" y2="400" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <rect x="30" y="420" width="14" height="14" fill="#c2a052" opacity="0.55" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-val" x="54" y="432">přidaný písek</text>
    <rect x="212" y="420" width="14" height="14" fill="#6b5138" opacity="0.9" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-val" x="236" y="432">původní zemina</text>
    <rect x="30" y="450" width="14" height="14" fill="#c2a052" opacity="0.45" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <text className="sv-val" x="54" y="462">původní písčitá zemina</text>
    <text className="sv-lbl" x="30" y="496">Příměsi si z celkového objemu</text>
    <text className="sv-lbl" x="30" y="516">berou podíl zvlášť</text>
  </svg>
)
