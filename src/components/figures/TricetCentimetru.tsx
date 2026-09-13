import React from 'react'

/**
 * Třicet centimetrů svobody (DESIGN.md 9.2). Dva řezy pod metrem čtverečním
 * trávníku vedle sebe, stejné měřítko (10 cm = 60 px): vlevo půda jen 10 cm
 * hluboko nad udusanou deskou — kořeny se na ní placatí a všechno, co mají,
 * je 100 l, které slunce vysuší za odpoledne; vpravo 30 cm souvislého
 * prostoru = 300 l, kořeny jdou hluboko, v malých pórech drží voda
 * (modré tečky = jediný akcent), ve velkých je vzduch (prázdné kroužky).
 *
 * Smyčky: slunce (SMIL rotate 26 s dle 6.6.3) a dva odpary z povrchu
 * (CSS `evap`, 3,6 s). Klidový stav v markupu: paprsky, odpar viditelný,
 * kořeny ohnuté i hluboké. Portrétová sazba 520 px, id s prefixem `tc-`.
 */
export const TricetCentimetru: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 496">
    <defs>
      <radialGradient id="tc-sucho" cx="0.5" cy="0" r="0.9">
        <stop offset="0" stopColor="#c2a052" stopOpacity="0.95" />
        <stop offset="1" stopColor="#c2a052" stopOpacity="0" />
      </radialGradient>
      <pattern id="tc-lis" width="8" height="5" patternUnits="userSpaceOnUse">
        <path d="M0 2.5 H8" stroke="rgba(255,255,255,.16)" strokeWidth="1" />
      </pattern>
      <pattern id="tc-pory" width="26" height="26" patternUnits="userSpaceOnUse">
        <circle cx="6" cy="7" r="1.7" fill="#2563eb" opacity="0.9" />
        <circle cx="19" cy="19" r="1.7" fill="#2563eb" opacity="0.9" />
        <circle cx="18" cy="6" r="3.4" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.5" />
        <circle cx="7" cy="20" r="2.6" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.5" />
      </pattern>
      <clipPath id="tc-l"><rect x="40" y="124" width="180" height="60" /></clipPath>
      <clipPath id="tc-r"><rect x="300" y="124" width="180" height="180" /></clipPath>
    </defs>

    {/* ── hlavičky ────────────────────────────────────────────── */}
    <text className="sv-lbl" x="130" y="26" textAnchor="middle">Hloubka 10 cm</text>
    <text className="sv-lbl" x="390" y="26" textAnchor="middle">Hloubka 30 cm</text>

    {/* ── slunce nad oběma ─────────────────────────────────────── */}
    <g>
      <circle cx="260" cy="64" r="12" fill="none" stroke="#b76a00" strokeWidth="1.6" opacity="0.8" />
      <g stroke="#b76a00" strokeWidth="1.6" strokeLinecap="round" opacity="0.55">
        <animateTransform attributeName="transform" type="rotate" from="0 260 64" to="360 260 64" dur="26s" repeatCount="indefinite" />
        <line x1="260" y1="44" x2="260" y2="38" />
        <line x1="260" y1="84" x2="260" y2="90" />
        <line x1="240" y1="64" x2="234" y2="64" />
        <line x1="280" y1="64" x2="286" y2="64" />
        <line x1="245.9" y1="49.9" x2="241.6" y2="45.6" />
        <line x1="274.1" y1="78.1" x2="278.4" y2="82.4" />
        <line x1="245.9" y1="78.1" x2="241.6" y2="82.4" />
        <line x1="274.1" y1="49.9" x2="278.4" y2="45.6" />
      </g>
    </g>

    {/* ── levý řez: 10 cm nad deskou ──────────────────────────── */}
    <g clipPath="url(#tc-l)">
      <rect x="40" y="124" width="180" height="60" fill="#6b5138" opacity="0.9" />
      {/* povrch vysychá */}
      <rect x="40" y="124" width="180" height="34" fill="url(#tc-sucho)" />
      <g fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        <path d="M84 124 C 82 144, 86 164, 84 178 C 83 183, 72 184, 60 183 M84 178 C 85 183, 96 184, 108 183" />
        <path d="M130 124 C 132 144, 128 164, 130 178 C 131 183, 120 184, 108 183 M130 178 C 129 183, 140 184, 152 183" />
        <path d="M176 124 C 174 144, 178 164, 176 178 C 175 183, 164 184, 152 183 M176 178 C 177 183, 188 184, 200 183" />
        <path d="M84 136 C 76 142, 70 148, 66 156 M130 140 C 138 146, 144 152, 148 160 M176 134 C 168 140, 162 146, 158 154" />
      </g>
    </g>
    {/* udusaná deska */}
    <rect x="40" y="184" width="180" height="20" fill="#54402c" opacity="0.95" />
    <rect x="40" y="184" width="180" height="20" fill="url(#tc-lis)" />
    <line x1="40" y1="184" x2="220" y2="184" stroke="rgba(255,255,255,.22)" strokeWidth="1.6" />
    {/* pod deskou: prostor, kam se kořeny nedostanou */}
    <rect x="40" y="204" width="180" height="100" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <text className="sv-lbl" x="130" y="258" textAnchor="middle">nedostupné</text>
    {/* drn */}
    <rect x="40" y="110" width="180" height="14" fill="#3f7d4e" />
    <path d="M40 124 H220" stroke="#2e6440" strokeWidth="1.6" fill="none" />
    <path d="M48 111q-1 -8 -3 -13M62 111q2 -7 5 -12M76 111q0 -9 0 -14M90 111q2 -10 5 -16M104 111q2 -5 5 -8M118 111q-1 -6 -4 -10M132 111q-2 -10 -5 -17M146 111q-2 -6 -5 -11M160 111q1 -5 2 -8M174 111q1 -10 4 -16M188 111q-2 -9 -5 -15M202 111q0 -8 0 -13M214 111q2 -6 4 -9" fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" />
    {/* Uzavřená schránka jako pravý řez — udusaná deska byla jediný tvar
        kresby bez spodní hrany (porota kola 06, styl). */}
    <path d="M40 110 V184 H220 V110" stroke="#232830" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
    {/* odpar z povrchu */}
    <g fill="none" stroke="#b76a00" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
      <path className="tc-odpar" d="M96 104 q4 -6 0 -12 q-4 -6 0 -12" />
      <path className="tc-odpar" d="M164 104 q4 -6 0 -12 q-4 -6 0 -12" style={{ animationDelay: '1.6s' }} />
    </g>

    {/* ── pravý řez: 30 cm souvislého prostoru ────────────────── */}
    <g clipPath="url(#tc-r)">
      <rect x="300" y="124" width="180" height="180" fill="#6b5138" opacity="0.9" />
      <rect x="300" y="124" width="180" height="34" fill="url(#tc-sucho)" />
      <rect x="300" y="150" width="180" height="154" fill="url(#tc-pory)" />
      <g fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        <path d="M344 124 C 340 160, 348 210, 342 262 C 341 276, 344 286, 346 294" />
        <path d="M344 146 C 334 156, 328 164, 324 176 M343 190 C 352 200, 358 210, 362 224 M342 236 C 334 246, 330 254, 328 266" />
        <path d="M390 124 C 394 164, 386 216, 392 270 C 393 280, 390 288, 388 296" />
        <path d="M391 152 C 400 160, 406 168, 410 180 M389 200 C 380 210, 374 220, 370 232 M391 246 C 400 256, 406 264, 410 276" />
        <path d="M436 124 C 432 160, 440 212, 434 258 C 433 272, 436 284, 438 292" />
        <path d="M436 140 C 446 150, 452 158, 456 170 M435 186 C 426 196, 420 204, 416 216 M435 232 C 444 242, 450 250, 454 262" />
      </g>
    </g>
    <rect x="300" y="110" width="180" height="14" fill="#3f7d4e" />
    <path d="M300 124 H480" stroke="#2e6440" strokeWidth="1.6" fill="none" />
    <path d="M308 111q-1 -8 -3 -13M322 111q2 -7 5 -12M336 111q0 -9 0 -14M350 111q2 -10 5 -16M364 111q2 -5 5 -8M378 111q-1 -6 -4 -10M392 111q-2 -10 -5 -17M406 111q-2 -6 -5 -11M420 111q1 -5 2 -8M434 111q1 -10 4 -16M448 111q-2 -9 -5 -15M462 111q0 -8 0 -13M474 111q2 -6 4 -9" fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M300 110 V304 H480 V110" stroke="#232830" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
    <g fill="none" stroke="#b76a00" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
      <path className="tc-odpar" d="M356 104 q4 -6 0 -12 q-4 -6 0 -12" style={{ animationDelay: '0.8s' }} />
      <path className="tc-odpar" d="M424 104 q4 -6 0 -12 q-4 -6 0 -12" style={{ animationDelay: '2.4s' }} />
    </g>

    {/* ── společný metr ───────────────────────────────────────── */}
    <line x1="260" y1="124" x2="260" y2="304" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="254" y1="124" x2="266" y2="124" />
      <line x1="254" y1="184" x2="266" y2="184" />
      <line x1="254" y1="244" x2="266" y2="244" />
      <line x1="254" y1="304" x2="266" y2="304" />
    </g>
    {/* Hloubková osa mluví ve všech řezech stejně (9.2 p. 3): .sv-val,
        jednotka jen u nuly. Dřív tu byl .sv-lbl 12 px bez jednotky. */}
    <text className="sv-val" x="260" y="118" textAnchor="middle">0 cm</text>
    <text className="sv-val" x="260" y="178" textAnchor="middle">10</text>
    <text className="sv-val" x="260" y="238" textAnchor="middle">20</text>
    <text className="sv-val" x="260" y="298" textAnchor="middle">30</text>

    {/* ── objemy ──────────────────────────────────────────────── */}
    <text className="sv-lbl" x="130" y="340" textAnchor="middle">Objem pro kořeny</text>
    <text className="sv-val" x="130" y="376" textAnchor="middle" style={{ fontSize: 24 }}>100 l</text>
    <text className="sv-lbl" x="130" y="400" textAnchor="middle">závislé na počasí</text>

    <text className="sv-lbl" x="390" y="340" textAnchor="middle">Objem pro kořeny</text>
    <text className="sv-val" x="390" y="376" textAnchor="middle" style={{ fontSize: 24 }}>300 l</text>
    <text className="sv-lbl" x="390" y="400" textAnchor="middle">rezervoár</text>

    {/* ── pointa + legenda pórů ───────────────────────────────── */}
    <line x1="30" y1="428" x2="490" y2="428" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="452">Zdravá půda</text>
    <circle cx="36" cy="478" r="3" fill="#2563eb" />
    <text className="sv-val" x="48" y="483">malé póry drží vodu</text>
    <circle cx="270" cy="478" r="4.5" fill="none" stroke="#232830" strokeWidth="1.6" />
    <text className="sv-val" x="284" y="483">velké pouští vzduch</text>
  </svg>
)
