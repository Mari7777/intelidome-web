import React from 'react'

/**
 * Odnožování (DESIGN.md 9.2) — táž rostlina ve třech stavech na jednom
 * nízkém řezu půdou: jeden výhon s krátkým kořínkem, tři výhony z jedné
 * báze a nakonec trs s mnoha výhony a bohatými kořeny. Pointa je jedna:
 * trávník nehoustne jen počtem semen, ale růstem jedné rostliny. Proto
 * všechny výhony každého stavu vycházejí z jednoho místa na povrchu a
 * semeno je vidět jen u prvního.
 *
 * Kresba nemá akcent: voda v ní není, modrá tedy také ne. Šipky mezi stavy
 * jsou konstrukční linky, jen vedou oko zleva doprava. Stébla a kořínky
 * mají rukopis `prvni-korinek` (tahy 1,6 px, křivky q).
 *
 * Portrétová sazba 520 px, id s prefixem `od-`. Popisky pod řezem mají
 * rezervu na telefonní 18/21 jednotek. Statická kresba: tři stavy vedle
 * sebe se dají porovnat naráz, pohyb by srovnání rozbil.
 */
export const Odnozovani: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 300">
    <defs>
      <clipPath id="od-rez"><rect x="40" y="140" width="440" height="60" /></clipPath>
    </defs>

    {/* Pointa kresby (9.2 p. 3) je jedna: všechno vyrostlo z jedné rostliny. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Jedna rostlina</text>

    {/* ── řez půdou s kořeny ──────────────────────────────────── */}
    <g clipPath="url(#od-rez)">
      <rect x="40" y="140" width="440" height="60" fill="#6b5138" opacity="0.9" />
      <g fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
        {/* (a) krátký kořínek */}
        <path d="M72 151 C 71 157, 73 163, 72 170" />
        {/* (b) delší kořeny */}
        <path d="M208 140 C 207 153, 210 166, 208 180 M206 140 C 201 150, 198 160, 193 169 M210 140 C 215 150, 218 159, 223 167 M208 158 q5 4 6 10" />
        {/* (c) bohaté kořeny trsu */}
        <path d="M384 140 C 383 156, 386 174, 384 194 M381 140 C 376 154, 374 170, 367 186 M387 140 C 392 154, 395 171, 401 188 M378 140 C 370 150, 360 161, 351 173 M390 140 C 398 150, 408 160, 417 171 M376 140 C 366 146, 352 152, 340 158 M392 140 C 402 146, 415 151, 427 156" />
        <path d="M384 162 q-5 5 -6 12 M385 176 q6 5 7 11 M372 168 q-7 3 -10 9 M397 170 q7 3 9 10" />
      </g>
    </g>
    <path d="M40 140 V200 H480 V140 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* ── výhony ──────────────────────────────────────────────── */}
    <g fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round">
      {/* (a) jeden výhon, první list */}
      <path d="M72 146 V140 q-1 -20 5 -38" />
      {/* (b) tři výhony z jedné báze */}
      <path d="M208 140 q-1 -28 3 -52 M206 140 q-5 -19 -16 -36 M210 140 q5 -20 16 -38" />
      {/* (c) trs: mnoho výhonů z téže báze */}
      <path d="M384 140 q0 -36 2 -66 M382 140 q-3 -32 -9 -60 M386 140 q4 -32 11 -58 M380 140 q-7 -28 -19 -52 M388 140 q8 -28 21 -50 M378 140 q-10 -22 -29 -40 M390 140 q11 -22 31 -38 M376 140 q-12 -15 -38 -25 M392 140 q13 -14 40 -23" />
    </g>

    {/* semeno, ze kterého rostlina vzešla: leží těsně pod povrchem */}
    <ellipse cx="72" cy="148" rx="5.5" ry="3.4" transform="rotate(-12 72 148)" fill="#f6f5f2" stroke="#232830" strokeWidth="1.6" />

    {/* ── šipky mezi stavy (konstrukční linky) ────────────────── */}
    <g fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="104" y1="118" x2="160" y2="118" strokeDasharray="3 7" />
      <path d="M155.1 114 L162 118 L155.1 122" />
      <line x1="248" y1="118" x2="304" y2="118" strokeDasharray="3 7" />
      <path d="M299.1 114 L306 118 L299.1 122" />
    </g>

    {/* ── popisky pod řezem ───────────────────────────────────── */}
    <text className="sv-lbl" x="40" y="228">První</text>
    <text className="sv-lbl" x="40" y="249">list</text>

    <text className="sv-lbl" x="168" y="228">První</text>
    <text className="sv-lbl" x="168" y="249">odnože</text>

    <text className="sv-lbl" x="296" y="228">Trs</text>
    <text className="sv-val" x="296" y="255">víc výhonů</text>
    <text className="sv-val" x="296" y="279">z jednoho semene</text>
  </svg>
)
