import React from 'react'

/**
 * Půdní profil — sonda 30 cm (DESIGN.md 9.2). Řez stěnou jamky s metrem
 * po 10 cm: nahoře drn, pod ním ornice 0–10 cm, v hloubce 10–15 cm
 * slisovaná vrstva po stavební technice (hustý šrafovaný pás), pod ní
 * podloží. Kořeny jdou ornicí dolů a na udusané vrstvě se placatí a ohýbají
 * do stran — to je znamení, které kresba ukazuje dřív, než ho najde rýč.
 * Rýč stojí v jamce; jediná smyčka je jeho krátký pokus zajet hlouběji,
 * který se o tvrdou vrstvu zastaví (CSS translateY, 3,6 s).
 *
 * Portrétová sazba 520 px. Id s prefixem `pp-`. Klidový stav v markupu:
 * rýč opřený o desku, kořeny ohnuté — bez animace se nic neztratí.
 */
export const PudniProfil: React.FC = () => (
  <svg className="block h-auto w-full" viewBox="0 0 520 470">
    <defs>
      {/* slisovaná vrstva: husté vodorovné lamely = žádné velké póry */}
      <pattern id="pp-lis" width="8" height="5" patternUnits="userSpaceOnUse">
        <path d="M0 2.5 H8" stroke="rgba(255,255,255,.16)" strokeWidth="1" />
      </pattern>
      <clipPath id="pp-rez">
        <rect x="98" y="100" width="270" height="300" />
      </clipPath>
    </defs>

    {/* ── metr hloubky ─────────────────────────────────────────── */}
    <line x1="76" y1="100" x2="76" y2="400" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="70" y1="100" x2="82" y2="100" />
      <line x1="70" y1="200" x2="82" y2="200" />
      <line x1="70" y1="300" x2="82" y2="300" />
      <line x1="70" y1="400" x2="82" y2="400" />
    </g>
    <text className="sv-val" x="64" y="105" textAnchor="end">0 cm</text>
    <text className="sv-val" x="64" y="205" textAnchor="end">10 cm</text>
    <text className="sv-val" x="64" y="305" textAnchor="end">20 cm</text>
    <text className="sv-val" x="64" y="405" textAnchor="end">30 cm</text>

    {/* ── stěna sondy ──────────────────────────────────────────── */}
    <g clipPath="url(#pp-rez)">
      {/* ornice 0–10 */}
      <rect x="98" y="100" width="270" height="100" fill="#6b5138" opacity="0.9" />
      {/* slisovaná vrstva 10–15: tmavší, hustá, lamelová */}
      <rect x="98" y="200" width="270" height="50" fill="#54402c" opacity="0.95" />
      <rect x="98" y="200" width="270" height="50" fill="url(#pp-lis)" />
      {/* podloží 15–30 */}
      <rect x="98" y="250" width="270" height="150" fill="#54402c" opacity="0.7" />

      {/* kořeny: ornicí dolů, na desce se placatí a zahýbají do stran */}
      <g fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        <path d="M146 100 C 144 130, 148 160, 145 190 C 144 197, 132 198, 106 198 M145 190 C 146 197, 158 198, 184 198" />
        <path d="M146 112 C 136 122, 128 130, 120 134 M146 124 C 156 134, 164 140, 172 146 M146 150 C 138 160, 134 170, 132 180" />
        <path d="M212 100 C 216 130, 210 160, 213 191 C 214 197, 226 198, 254 198 M213 191 C 212 197, 200 198, 172 198" />
        <path d="M212 116 C 222 124, 230 130, 236 138 M212 140 C 202 150, 198 158, 196 168 M213 160 C 222 170, 226 178, 228 186" />
        <path d="M276 100 C 274 128, 278 158, 275 191 C 274 197, 262 198, 236 198 M275 191 C 276 197, 288 198, 312 198" />
        <path d="M276 118 C 266 128, 260 136, 256 144 M276 136 C 286 146, 292 152, 296 160 M275 158 C 268 168, 264 176, 262 184" />
      </g>
    </g>

    {/* hrana slisované vrstvy — jediná pevná linka v řezu, protože je to ta „deska" */}
    <line x1="98" y1="200" x2="368" y2="200" stroke="rgba(255,255,255,.34)" strokeWidth="1.6" />
    <line x1="98" y1="250" x2="368" y2="250" stroke="rgba(255,255,255,.14)" strokeWidth="1.6" />

    {/* drn */}
    <rect x="98" y="80" width="270" height="20" fill="#3f7d4e" />
    <path d="M98 100 H368" stroke="#2e6440" strokeWidth="1.6" fill="none" />
    <path
      d="M106 81q-1 -8 -3 -13M120 81q2 -7 5 -12M134 81q0 -9 0 -14M148 81q2 -10 5 -16M162 81q2 -5 5 -8M176 81q-1 -6 -4 -10M190 81q-2 -10 -5 -17M204 81q-2 -6 -5 -11M218 81q1 -5 2 -8M232 81q1 -10 4 -16M246 81q-2 -9 -5 -15M260 81q0 -8 0 -13M274 81q2 -6 5 -9M288 81q1 -5 3 -8M302 81q-2 -6 -5 -9M316 81q-1 -8 -3 -13M330 81q2 -7 5 -12M344 81q0 -9 0 -14M358 81q2 -10 5 -16M372 81q2 -5 4 -8"
      fill="none"
      stroke="#3f7d4e"
      strokeWidth="1.6"
      strokeLinecap="round"
    />

    {/* dno a obrys sondy */}
    <path d="M98 80 V400 H368 V80" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* ── rýč: opřený o desku, zkouší hlouběji a zastaví se ────── */}
    <g className="pp-ryc">
      <rect x="326" y="20" width="10" height="150" rx="3" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.4" />
      <rect x="316" y="10" width="30" height="12" rx="4" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.4" />
      <path d="M312 168 H350 L346 214 Q331 222 316 214 Z" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.4" strokeLinejoin="round" />
      <line x1="331" y1="168" x2="331" y2="206" stroke="rgba(255,255,255,.14)" strokeWidth="1.4" />
    </g>

    {/* ── popisky vrstev vpravo ────────────────────────────────── */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
      <line x1="368" y1="150" x2="388" y2="150" />
      <line x1="368" y1="225" x2="388" y2="225" />
      <line x1="368" y1="325" x2="388" y2="325" />
    </g>
    <text className="sv-lbl" x="396" y="146">Ornice</text>
    <text className="sv-val" x="396" y="166">0–10 cm</text>

    <text className="sv-lbl" x="396" y="213">Udusaná</text>
    <text className="sv-lbl" x="396" y="229">vrstva</text>
    <text className="sv-val" x="396" y="249">10–15 cm</text>

    <text className="sv-lbl" x="396" y="321">Podloží</text>
    <text className="sv-val" x="396" y="341">15–30 cm</text>

    {/* ── pointa ───────────────────────────────────────────────── */}
    <line x1="30" y1="424" x2="490" y2="424" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="448">Kořeny se na desce placatí</text>
    <text className="sv-val" x="490" y="449" textAnchor="end">= překážka, i když ji nevidíte</text>
  </svg>
)
