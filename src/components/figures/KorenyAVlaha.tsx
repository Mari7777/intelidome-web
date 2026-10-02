import React from 'react'

/**
 * Kořeny a vláha (DESIGN.md 9.2) — dva stejné řezy půdou vedle sebe, na obou
 * týž mladý porost a stejně hluboké kořeny (zhruba do poloviny řezu). Liší se
 * jen tím, kde je voda. Vlevo je po zálivce mokrá jen tenká vrstva u povrchu
 * a kořeny pod ní rostou v suchu: dávku je třeba upravit. Vpravo povrch
 * oschl, ale vrstva s kořeny je vlhká: to je v pořádku.
 *
 * Pointa je jedna: nerozhoduje, jak vypadá povrch, ale kam sahá voda vůči
 * kořenům. Jediný akcent je modrý překryv vlhké půdy (#2563eb op .28).
 * Řezy jsou záměrně bez centimetrové stupnice, text článku čísla neuvádí.
 * Horní hranu nenese drn (mladý porost), obrys řezu je proto uzavřený.
 * Kořeny na krému nejsou vidět, v legendě proto leží na políčku půdy.
 *
 * Portrétová sazba 520 px, id s prefixem `kav-`. Pravý řez je levý posunutý
 * o 250 jednotek (`use`), aby byl porost opravdu shodný. Statická kresba —
 * porovnávají se dva stavy, pohyb by srovnání nezpřesnil.
 */
export const KorenyAVlaha: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 480">
    <defs>
      {/* kořeny čtyř rostlin levého řezu: sahají 94–104 jednotek pod povrch */}
      <g id="kav-koreny" fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
        <path d="M66 124 c-2 26 3 62 0 98 M66 140 q-6 5 -9 14 M66 154 q7 6 10 16 M66 176 q-7 6 -10 16 M66 194 q6 6 8 14" />
        <path d="M112 124 c2 28 -3 66 0 104 M112 142 q6 5 9 13 M112 160 q-7 6 -10 16 M112 180 q7 6 9 16 M112 200 q-6 6 -8 14" />
        <path d="M158 124 c-2 24 2 60 0 94 M158 138 q-6 5 -9 13 M158 152 q6 6 9 15 M158 172 q-7 6 -9 16 M158 190 q6 5 8 13" />
        <path d="M204 124 c2 26 -2 64 0 101 M204 141 q7 5 10 14 M204 158 q-6 6 -9 15 M204 178 q6 6 9 16 M204 198 q-6 5 -8 13" />
      </g>
      {/* stébla týchž rostlin */}
      <g id="kav-stebla" fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round">
        <path d="M66 123 q-2 -14 -8 -22 M66 123 q0 -12 2 -27 M66 123 q3 -10 9 -17" />
        <path d="M112 123 q-3 -13 -9 -19 M112 123 q1 -14 -1 -28 M112 123 q3 -11 8 -19" />
        <path d="M158 123 q-2 -12 -7 -20 M158 123 q1 -13 3 -25 M158 123 q4 -9 10 -15" />
        <path d="M204 123 q-3 -12 -9 -18 M204 123 q0 -13 -2 -27 M204 123 q3 -12 8 -20" />
      </g>
    </defs>

    {/* Pointa kresby (9.2 p. 3) je jedna: rozhoduje, kam sahá voda. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Kam sahá voda</text>

    {/* ── záhlaví řezů ────────────────────────────────────────── */}
    <text className="sv-lbl" x="40" y="72">mokrý jen povrch</text>
    <text className="sv-lbl" x="290" y="72">povrch oschlý</text>

    {/* ── levý řez: vlhká jen tenká vrstva u povrchu ──────────── */}
    <rect x="40" y="124" width="190" height="212" fill="#6b5138" opacity="0.9" />
    <rect x="40" y="124" width="190" height="30" fill="#2563eb" opacity="0.28" />
    <use href="#kav-koreny" />
    <path d="M40 124 V336 H230 V124 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <use href="#kav-stebla" />

    {/* ── pravý řez: povrch suchý, vlhká celá vrstva s kořeny ─── */}
    <rect x="290" y="124" width="190" height="212" fill="#6b5138" opacity="0.9" />
    <rect x="290" y="154" width="190" height="182" fill="#2563eb" opacity="0.28" />
    <use href="#kav-koreny" x="250" />
    <path d="M290 124 V336 H480 V124 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <use href="#kav-stebla" x="250" />

    {/* ── verdikt pod řezy ────────────────────────────────────── */}
    <text className="sv-val" x="40" y="364">upravit dávku</text>
    <text className="sv-lbl" x="40" y="387">kořeny jsou</text>
    <text className="sv-lbl" x="40" y="408">v suchu</text>
    <text className="sv-val" x="290" y="364">v pořádku</text>
    <text className="sv-lbl" x="290" y="387">vláha je</text>
    <text className="sv-lbl" x="290" y="408">u kořenů</text>

    {/* ── legenda: značky shodné s kresbou (9.2 p. 10) ────────── */}
    <line x1="40" y1="426" x2="480" y2="426" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <rect x="40" y="442" width="28" height="14" rx="3" fill="#6b5138" opacity="0.9" />
    <rect x="40" y="442" width="28" height="14" rx="3" fill="#2563eb" opacity="0.28" />
    <text className="sv-val" x="76" y="454">vlhká půda</text>
    <rect x="200" y="442" width="28" height="14" rx="3" fill="#6b5138" opacity="0.9" />
    <text className="sv-val" x="236" y="454">suchá půda</text>
    <rect x="362" y="442" width="28" height="14" rx="3" fill="#6b5138" opacity="0.9" />
    <path d="M376 444 c-1 3 1 7 0 10 M376 447 q-3 2 -5 5" fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
    <text className="sv-val" x="398" y="454">kořeny</text>
  </svg>
)
