import React from 'react'

/**
 * První kořínek (DESIGN.md 9.2) — čerstvě vzešlá tráva má kořínek jen
 * ~3 cm hluboko: voda o deset centimetrů níž je pro ni teď stejně
 * nedosažitelná jako voda na druhé straně zahrady. Připravený profil
 * 30 cm začne pracovat, až k němu kořeny dorostou. Řez 8 px na cm jako
 * `tri-zony`; jediný akcent je kapka vody mimo dosah.
 *
 * Portrétová sazba 520 px, id s prefixem `pk-`. Statická kresba — pointa
 * je vzdálenost, pohyb by ji nezpřesnil.
 */
export const PrvniKorinek: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 40 520 452">
    <defs>
      <clipPath id="pk-rez"><rect x="80" y="110" width="210" height="240" /></clipPath>
    </defs>

    {/* ── metr ────────────────────────────────────────────────── */}
    <line x1="62" y1="110" x2="62" y2="350" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="56" y1="110" x2="68" y2="110" />
      <line x1="56" y1="134" x2="68" y2="134" />
      <line x1="56" y1="214" x2="68" y2="214" />
      <line x1="56" y1="350" x2="68" y2="350" />
    </g>
    <text className="sv-val" x="50" y="115" textAnchor="end">0 cm</text>
    <text className="sv-val" x="50" y="139" textAnchor="end">3</text>
    <text className="sv-val" x="50" y="219" textAnchor="end">13</text>
    <text className="sv-val" x="50" y="355" textAnchor="end">30</text>

    {/* ── řez ─────────────────────────────────────────────────── */}
    <g clipPath="url(#pk-rez)">
      <rect x="80" y="110" width="210" height="240" fill="#6b5138" opacity="0.9" />
      {/* kapka ve 13 cm, deset centimetrů pod kořínkem — mimo jeho dosah */}
      <path d="M185 202 C 189 208, 192 212, 192 216 A 7 7 0 0 1 178 216 C 178 212, 181 208, 185 202 Z" fill="#2563eb" opacity="0.9" />
      <circle cx="185" cy="210" r="22" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    </g>

    {/* mladé rostlinky na povrchu */}
    <g fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round">
      <path d="M120 108 q-2 -12 -7 -18 M120 108 q3 -10 8 -15" />
      <path d="M185 108 q-3 -13 -8 -19 M185 108 q2 -11 7 -17" />
      <path d="M250 108 q-2 -11 -6 -16 M250 108 q3 -9 7 -14" />
    </g>
    {/* kořínky: jen ~3 cm */}
    <g fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
      <path d="M120 110 C 119 118, 121 126, 120 133 M120 118 q-5 4 -7 9 M120 124 q5 4 7 8" />
      <path d="M185 110 C 186 118, 184 127, 185 134 M185 120 q-5 4 -7 8" />
      <path d="M250 110 C 249 117, 251 124, 250 131 M250 119 q5 4 6 8" />
    </g>
    {/* hranice dosahu kořínků */}
    <line x1="80" y1="134" x2="290" y2="134" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />

    {/* Horní hranu tu nenese drn (čerstvý výsev, žádná travní vrstva) —
        obrys se proto MUSÍ uzavřít, ne nechat otevřený (9.2 p. 9, kolo 02). */}
    <path d="M80 110 V350 H290 V110 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* ── popisky vpravo ──────────────────────────────────────── */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
      <line x1="290" y1="128" x2="308" y2="128" />
      <line x1="290" y1="210" x2="308" y2="210" />
      <line x1="290" y1="320" x2="308" y2="320" />
    </g>
    {/* Pointa kresby (9.2 p. 3) je jedna: kořínek má zatím jen ~3 cm. */}
    <text className="sv-val" x="316" y="120" style={{ fontSize: 24 }}>≈ 3 cm</text>
    <text className="sv-lbl" x="316" y="142">dosah čerstvého</text>
    <text className="sv-lbl" x="316" y="162">kořínku</text>

    <text className="sv-val" x="316" y="206">voda ve 13 cm</text>
    <text className="sv-lbl" x="316" y="228">teď mimo dosah,</text>
    <text className="sv-lbl" x="316" y="248">zalévá se mělce</text>
    <text className="sv-lbl" x="316" y="268">a často</text>

    <text className="sv-val" x="316" y="316">profil 30 cm</text>
    <text className="sv-lbl" x="316" y="338">začne pracovat,</text>
    <text className="sv-lbl" x="316" y="358">až k němu kořeny</text>
    <text className="sv-lbl" x="316" y="378">dorostou</text>

    {/* ── legenda ─────────────────────────────────────────────── */}
    <line x1="30" y1="404" x2="490" y2="404" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <rect x="30" y="424" width="14" height="14" rx="3" fill="#6b5138" opacity="0.9" />
    <text className="sv-val" x="52" y="435">připravená směs</text>
    <path d="M228 422 C 232 428, 235 432, 235 436 A 7 7 0 0 1 221 436 C 221 432, 224 428, 228 422 Z" fill="#2563eb" opacity="0.9" />
    <text className="sv-val" x="242" y="435">voda</text>
    <path d="M330 434 q3 -10 8 -15" fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" />
    <text className="sv-val" x="350" y="435">výsev</text>
  </svg>
)
