import React from 'react'

/**
 * Klíčení krok za krokem (DESIGN.md 9.2) — totéž semeno těsně pod povrchem
 * ve čtyřech úzkých řezech se společnou linií povrchu: suché, nabobtnalé
 * vodou, s prvním kořínkem a teprve nakonec s prvním listem nad půdou.
 * Pointa je jedna: nejdřív kořínek, list až po něm. Proto je nad třetím
 * řezem ještě prázdno a zelená se objeví jen ve čtvrtém.
 *
 * Semeno je značka osiva z ostatních kreseb ve trojnásobném měřítku (týž
 * obrys 1,6 px), po příjmu vody o něco větší. Jediný akcent je voda: kapky
 * přicházejí ve druhé fázi a od kořínku už v řezu zůstávají. Svorka pod
 * třetí a čtvrtou fází říká, že od té chvíle půda nesmí vyschnout. Pruh
 * dole shrnuje tři potřeby klíčení: vodu, vzduch a teplo.
 *
 * Portrétová sazba 520 px, id s prefixem `kk-`. Popisky mají rezervu na
 * telefonní 18/21 jednotek. Statická kresba: pointa je pořadí, čtyři
 * snímky vedle sebe ho ukážou naráz.
 */
export const KliceniKrokZaKrokem: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 600">
    <defs>
      <clipPath id="kk-rez-1"><rect x="40" y="200" width="98" height="200" /></clipPath>
      <clipPath id="kk-rez-2"><rect x="154" y="200" width="98" height="200" /></clipPath>
      <clipPath id="kk-rez-3"><rect x="268" y="200" width="98" height="200" /></clipPath>
      <clipPath id="kk-rez-4"><rect x="382" y="200" width="98" height="200" /></clipPath>
    </defs>

    {/* Pointa kresby (9.2 p. 3) je jedna: kořínek přichází dřív než list. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Nejdřív kořínek</text>

    {/* ── čísla a názvy fází ──────────────────────────────────── */}
    <text className="sv-val" x="40" y="78">1</text>
    <text className="sv-lbl" x="40" y="101">Suché</text>
    <text className="sv-lbl" x="40" y="122">semeno</text>

    <text className="sv-val" x="154" y="78">2</text>
    <text className="sv-lbl" x="154" y="101">Přijímá</text>
    <text className="sv-lbl" x="154" y="122">vodu</text>

    <text className="sv-val" x="268" y="78">3</text>
    <text className="sv-lbl" x="268" y="101">První</text>
    <text className="sv-lbl" x="268" y="122">kořínek</text>

    <text className="sv-val" x="382" y="78">4</text>
    <text className="sv-lbl" x="382" y="101">První</text>
    <text className="sv-lbl" x="382" y="122">list</text>

    {/* ── 1: suché semeno, nic se neděje ──────────────────────── */}
    <g clipPath="url(#kk-rez-1)">
      <rect x="40" y="200" width="98" height="200" fill="#6b5138" opacity="0.9" />
    </g>
    <path d="M40 200 V400 H138 V200 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <ellipse cx="95" cy="232" rx="16.5" ry="10.2" transform="rotate(-15 95 232)" fill="#f6f5f2" stroke="#232830" strokeWidth="1.6" />

    {/* ── 2: semeno přijímá vodu a bobtná ─────────────────────── */}
    <g clipPath="url(#kk-rez-2)">
      <rect x="154" y="200" width="98" height="200" fill="#6b5138" opacity="0.9" />
      <path d="M173 222 C 177 228, 180 232, 180 236 A 7 7 0 0 1 166 236 C 166 232, 169 228, 173 222 Z" fill="#2563eb" opacity="0.9" />
      <path d="M239 240 C 243 246, 246 250, 246 254 A 7 7 0 0 1 232 254 C 232 250, 235 246, 239 240 Z" fill="#2563eb" opacity="0.9" />
      <path d="M200 256 C 204 262, 207 266, 207 270 A 7 7 0 0 1 193 270 C 193 266, 196 262, 200 256 Z" fill="#2563eb" opacity="0.9" />
    </g>
    <path d="M154 200 V400 H252 V200 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <ellipse cx="209" cy="232" rx="19.5" ry="12.6" transform="rotate(-15 209 232)" fill="#f6f5f2" stroke="#232830" strokeWidth="1.6" />

    {/* ── 3: první kořínek, nad půdou ještě nic ───────────────── */}
    <g clipPath="url(#kk-rez-3)">
      <rect x="268" y="200" width="98" height="200" fill="#6b5138" opacity="0.9" />
      <path d="M346 258 C 350 264, 353 268, 353 272 A 7 7 0 0 1 339 272 C 339 268, 342 264, 346 258 Z" fill="#2563eb" opacity="0.9" />
      <path d="M287 296 C 291 302, 294 306, 294 310 A 7 7 0 0 1 280 310 C 280 306, 283 302, 287 296 Z" fill="#2563eb" opacity="0.9" />
      <path d="M305 238 C 302 256, 309 276, 305 298" fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
    </g>
    <path d="M268 200 V400 H366 V200 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <ellipse cx="323" cy="232" rx="19.5" ry="12.6" transform="rotate(-15 323 232)" fill="#f6f5f2" stroke="#232830" strokeWidth="1.6" />

    {/* ── 4: kořínek delší, nad povrchem první list ───────────── */}
    <g clipPath="url(#kk-rez-4)">
      <rect x="382" y="200" width="98" height="200" fill="#6b5138" opacity="0.9" />
      <path d="M458 262 C 462 268, 465 272, 465 276 A 7 7 0 0 1 451 276 C 451 272, 454 268, 458 262 Z" fill="#2563eb" opacity="0.9" />
      <path d="M399 318 C 403 324, 406 328, 406 332 A 7 7 0 0 1 392 332 C 392 328, 395 324, 399 318 Z" fill="#2563eb" opacity="0.9" />
      <path d="M419 238 C 415 270, 424 318, 419 374 M418.4 272 q-10 6 -13 18 M420.6 304 q11 6 14 17 M420.4 338 q-8 5 -10 14" fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
    </g>
    <path d="M382 200 V400 H480 V200 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    {/* první list: z konce semene vzhůru, nad povrch */}
    <path d="M420 236 C 419 224, 421 212, 420 200" fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M418.4 200 C 417 178, 420 158, 431 142 C 426 160, 423.4 180, 421.8 200 Z" fill="#3f7d4e" stroke="#3f7d4e" strokeWidth="1.6" strokeLinejoin="round" />
    <ellipse cx="437" cy="232" rx="19.5" ry="12.6" transform="rotate(-15 437 232)" fill="#f6f5f2" stroke="#232830" strokeWidth="1.6" />

    {/* ── svorka pod fázemi 3–4 ───────────────────────────────── */}
    <line x1="268" y1="420" x2="480" y2="420" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="268" y1="414" x2="268" y2="426" />
      <line x1="480" y1="414" x2="480" y2="426" />
    </g>
    <text className="sv-val" x="268" y="450">od kořínku</text>
    <text className="sv-val" x="268" y="474">nesmí vyschnout</text>

    {/* ── co k tomu potřebuje ─────────────────────────────────── */}
    <line x1="40" y1="500" x2="480" y2="500" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="40" y="530">Co k tomu potřebuje</text>

    <path d="M47 548 C 51 554, 54 558, 54 562 A 7 7 0 0 1 40 562 C 40 558, 43 554, 47 548 Z" fill="#2563eb" opacity="0.9" />
    <text className="sv-val" x="64" y="566">voda</text>

    <circle cx="198" cy="559" r="7" fill="none" stroke="#232830" strokeWidth="1.6" />
    <text className="sv-val" x="215" y="566">vzduch</text>

    <circle cx="364" cy="559" r="5" fill="#b76a00" opacity="0.85" />
    <g stroke="#b76a00" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
      <line x1="364" y1="550.5" x2="364" y2="547.5" />
      <line x1="364" y1="567.5" x2="364" y2="570.5" />
      <line x1="355.5" y1="559" x2="352.5" y2="559" />
      <line x1="372.5" y1="559" x2="375.5" y2="559" />
      <line x1="358" y1="553" x2="355.9" y2="550.9" />
      <line x1="370" y1="553" x2="372.1" y2="550.9" />
      <line x1="358" y1="565" x2="355.9" y2="567.1" />
      <line x1="370" y1="565" x2="372.1" y2="567.1" />
    </g>
    <text className="sv-val" x="386" y="566">teplo</text>
  </svg>
)
