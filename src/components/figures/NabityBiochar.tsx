import React from 'react'

/**
 * Nabitý vs. nenabitý biochar (DESIGN.md 9.2) — dvě zrna vedle sebe.
 * Vlevo nenabité: póry prázdné a šipky dovnitř — zásobárna se teprve
 * plní a bere živiny z okolní půdy (i dusík mikroorganismům). Vpravo
 * nabité: póry drží živiny z kompostu a šipky míří ke kořenu. Statická
 * kresba — pointa je směr šipek, pohyb by ji nezpřesnil.
 *
 * Portrétová sazba 520 px, id s prefixem `nb-`. Značka živin (tečka
 * ⌀2,6 #54402c) je táž volně, v pórech i v legendě (9.2 p. 10).
 */

/** Zrno biocharu s póry; `plne` = póry drží živiny. */
const Zrno: React.FC<{ x: number; y: number; plne: boolean; prefix: string }> = ({ x, y, plne, prefix }) => {
  const pory: [number, number, number][] = [
    [62, 52, 9],
    [104, 44, 7],
    [86, 92, 10],
    [48, 116, 7],
    [118, 108, 8],
    [82, 148, 7],
  ]
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M28 22 L96 4 L152 26 L166 84 L146 156 L74 176 L18 138 L8 66 Z"
        fill="#12161b"
        opacity="0.9"
      />
      <path
        d="M28 22 L96 4 L152 26 L166 84 L146 156 L74 176 L18 138 L8 66 Z"
        fill="none"
        stroke="#232830"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {pory.map(([px, py, r], i) => (
        <g key={`${prefix}-${i}`}>
          <circle cx={px} cy={py} r={r} fill="none" stroke="rgba(255,255,255,.38)" strokeWidth="1.6" />
          {plne ? (
            /* Živiny #54402c na zrnu #12161b měly 1,86:1 (kolo 02, styl);
               tenký světlý lem drží hranici tvaru čitelnou, fill zůstává
               týž token jako v legendě a na světlém podkladu jinde. */
            <g fill="#54402c" stroke="#f6f5f2" strokeWidth="0.8">
              <circle cx={px - 2} cy={py - 1} r="2.6" />
              {r >= 8 ? <circle cx={px + 3} cy={py + 3} r="2.6" /> : null}
            </g>
          ) : null}
        </g>
      ))}
    </g>
  )
}

/** Šipka s hrotem. */
const Sipka: React.FC<{ d: string; hrot: string }> = ({ d, hrot }) => (
  <g fill="none" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
    <path d={hrot} />
  </g>
)

export const NabityBiochar: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 536">
    {/* Pointa kresby (9.2 p. 3) je jedna: nabít předem. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Nabít předem</text>

    {/* ── vlevo: nenabitý bere ───────────────────────────────── */}
    <text className="sv-lbl" x="40" y="86">Nenabitý</text>
    <Zrno x={52} y={104} plne={false} prefix="nb-l" />
    {/* volné živiny v okolí a šipky DOVNITŘ zrna */}
    <g fill="#54402c">
      <circle cx="46" cy="130" r="2.6" />
      <circle cx="234" cy="160" r="2.6" />
      <circle cx="60" cy="264" r="2.6" />
    </g>
    <Sipka d="M52 136 C 68 146, 80 152, 92 158" hrot="M84 150 l8 8 -11 2" />
    <Sipka d="M228 166 C 214 172, 204 176, 194 180" hrot="M202 172 l-8 8 11 1" />
    <Sipka d="M66 258 C 82 250, 94 244, 106 238" hrot="M98 236 l8 -6 -2 11" />
    <text className="sv-lbl" x="40" y="324">živiny si z půdy</text>
    <text className="sv-lbl" x="40" y="344">nejdřív bere</text>

    {/* ── vpravo: nabitý dává ────────────────────────────────── */}
    <text className="sv-lbl" x="284" y="86">Nabitý kompostem</text>
    <Zrno x={296} y={104} plne prefix="nb-p" />
    {/* Kořen #d8c9b4 potřebuje ornicový podklad, jinak je na krémovém
       panelu prakticky neviditelný (1,49:1 — kolo 02, styl; táž vada,
       kterou už řeší MykorhizniVlakna). Malá záhonová plocha s obrysem
       hmoty (9.2 p. 9), ne holý floating blob. */}
    <rect x="452" y="98" width="66" height="228" rx="6" fill="#6b5138" opacity="0.9" />
    <path d="M452 98 H518 V326 H452 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    {/* kořen vpravo a šipky VEN ke kořenu */}
    <path
      d="M488 120 C 486 160, 490 200, 487 240 C 485 268, 488 292, 486 312"
      fill="none"
      stroke="#d8c9b4"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.9"
    />
    <path d="M487 176 q-7 6 -9 12 M487 236 q7 6 9 12" fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
    <Sipka d="M446 176 C 458 180, 466 182, 474 186" hrot="M466 180 l9 6 -11 3" />
    <Sipka d="M448 250 C 460 252, 468 252, 476 254" hrot="M468 248 l9 5 -10 4" />
    <text className="sv-lbl" x="284" y="324">živiny kořenům</text>
    <text className="sv-lbl" x="284" y="344">postupně dává</text>

    {/* ── legenda ────────────────────────────────────────────── */}
    <line x1="30" y1="376" x2="490" y2="376" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="398">Co je co</text>
    <circle cx="36" cy="420" r="2.6" fill="#54402c" />
    <text className="sv-val" x="52" y="425">živiny (kompost)</text>
    <rect x="248" y="408" width="20" height="26" rx="3" fill="#6b5138" opacity="0.9" />
    <path d="M258 412 C 257 419, 259 425, 258 430" fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
    <text className="sv-val" x="274" y="425">kořen</text>

    <text className="sv-lbl" x="30" y="462">Samotná voda nenabije —</text>
    <text className="sv-lbl" x="30" y="482">biochar jen navlhčí</text>
    <text className="sv-lbl" x="30" y="514">Nad 10 % objemu kořeny ztrácejí vzduch</text>
  </svg>
)
