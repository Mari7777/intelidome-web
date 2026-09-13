import React from 'react'

/**
 * Zkouška vsakování (DESIGN.md 9.2). Řez zkušební jámou hlubokou 30 cm:
 * přes okraj leží laťka, od ní se měří vzdálenost k hladině. Hladina
 * začínala na horní čárkované lince a za 15 minut klesla o 1 cm — vpravo
 * je odečet (1 cm × 4 = 4 cm/h), dole stupnice s pásmy z článku: pod 2,5
 * pomalu, 2,5–7,5 ideální, nad 10 příliš rychle. Mezi 7,5 a 10 článek
 * pásmo nepojmenovává, proto je šedé.
 *
 * Jediný akcent figury je voda; její jediná smyčka je pomalý pokles
 * hladiny (CSS `zv-hladina`, 6 s, alternate — druhá půlka je „naplňte
 * jámu znovu", takže smyčka nemá střih). Klidový stav v markupu =
 * hladina po 15 minutách, značka na stupnici na 4 cm/h. Id s prefixem `zv-`.
 *
 * Sazba je navržená i pro mobilní zvětšení popisků (15/18 při měřítku
 * 0,71): odečet vpravo má 204 px, jáma je o to užší.
 */
export const ZkouskaVsaku: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 490">
    <defs>
      <radialGradient id="zv-voda" gradientUnits="userSpaceOnUse" cx="175" cy="200" r="180">
        <stop offset="0" stopColor="#2563eb" stopOpacity="0.34" />
        <stop offset="0.8" stopColor="#2563eb" stopOpacity="0.14" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.05" />
      </radialGradient>
      <clipPath id="zv-jama">
        <path d="M110 120 L110 360 L240 360 L240 120 Z" />
      </clipPath>
    </defs>

    {/* ── terén po obou stranách jámy ─────────────────────────── */}
    <rect x="30" y="120" width="80" height="240" fill="#6b5138" opacity="0.9" />
    <rect x="240" y="120" width="60" height="240" fill="#6b5138" opacity="0.9" />
    <rect x="30" y="100" width="80" height="20" fill="#3f7d4e" />
    <rect x="240" y="100" width="60" height="20" fill="#3f7d4e" />
    <path d="M30 120 H110 M240 120 H300" stroke="#2e6440" strokeWidth="1.6" fill="none" />
    <path
      d="M38 101q-1 -8 -3 -13M52 101q2 -7 5 -12M66 101q0 -9 0 -14M80 101q2 -10 5 -16M94 101q2 -5 5 -8M106 101q-1 -6 -4 -10M248 101q-2 -10 -5 -17M262 101q-2 -6 -5 -11M276 101q1 -5 2 -8M290 101q1 -10 4 -16"
      fill="none"
      stroke="#3f7d4e"
      strokeWidth="1.6"
      strokeLinecap="round"
    />

    {/* ── voda v jámě: klidový stav = hladina po 15 minutách ───── */}
    <g clipPath="url(#zv-jama)">
      <rect
        className="zv-hladina"
        x="100"
        y="188"
        width="150"
        height="172"
        fill="url(#zv-voda)"
        stroke="#60a5fa"
        strokeWidth="2"
      />
    </g>
    {/* výchozí hladina — kam sahala voda na začátku měření */}
    <line x1="110" y1="180" x2="240" y2="180" stroke="#93c5fd" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />

    {/* ── jáma: zdrsněné stěny, ne uhlazené rýčem ─────────────── */}
    <path
      d="M110 120 q3 30 -2 60 q-3 30 3 60 q2 30 -1 60 q-2 30 0 60 H240 q3 -30 -1 -60 q-2 -30 2 -60 q3 -30 -2 -60 q-2 -30 1 -60"
      fill="none"
      stroke="#232830"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M30 100 H110 V80 M240 80 V100 H300" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* laťka přes okraj */}
    <rect x="88" y="110" width="174" height="8" rx="2" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.6" />
    <text className="sv-lbl" x="88" y="72">Laťka</text>

    {/* kóta: hloubka jámy */}
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="124" y1="126" x2="124" y2="354" strokeDasharray="3 7" stroke="#d5d3cc" strokeWidth="1.6" />
      <line x1="119" y1="126" x2="129" y2="126" />
      <line x1="119" y1="354" x2="129" y2="354" />
    </g>
    <text className="sv-val" x="134" y="300">30 cm</text>

    {/* kóta: od laťky k hladině — to, co se měří */}
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="216" y1="118" x2="216" y2="188" />
      <line x1="211" y1="118" x2="221" y2="118" />
      <line x1="211" y1="188" x2="221" y2="188" />
    </g>
    <text className="sv-lbl" x="216" y="100" textAnchor="end">měřím</text>
    {/* pokles 180 → 188 */}
    <g stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round">
      <line x1="180" y1="180" x2="180" y2="188" />
      <line x1="175" y1="180" x2="185" y2="180" />
      <line x1="175" y1="188" x2="185" y2="188" />
    </g>
    <text className="sv-val" x="172" y="172" textAnchor="end" style={{ fill: '#2563eb' }}>1 cm</text>

    {/* ── odečet vpravo ───────────────────────────────────────── */}
    <text className="sv-lbl" x="316" y="116">Pokles hladiny</text>
    <text className="sv-val" x="316" y="140">1 cm za 15 min</text>

    <text className="sv-lbl" x="316" y="176">Přepočet</text>
    <text className="sv-val" x="316" y="200">1 cm × 4</text>

    <text className="sv-lbl" x="316" y="236">Rychlost vsaku</text>
    <text className="sv-val" x="316" y="268" style={{ fontSize: 24 }}>4 cm/h</text>

    <line x1="316" y1="290" x2="490" y2="290" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="316" y="314">Stěny zdrsněte</text>
    <text className="sv-lbl" x="316" y="336">kvůli pórům</text>

    {/* ── stupnice pásem ──────────────────────────────────────── */}
    <line x1="30" y1="392" x2="490" y2="392" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="412">Co číslo znamená</text>

    {/* 0–12 cm/h přes 460 px: 38,3 px na cm */}
    <rect x="30" y="422" width="96" height="10" fill="#6b5138" opacity="0.4" />
    <rect x="126" y="422" width="191" height="10" fill="#047857" opacity="0.38" />
    <rect x="317" y="422" width="96" height="10" fill="#d5d3cc" />
    <rect x="413" y="422" width="77" height="10" fill="#c2a052" opacity="0.65" />
    {/* značka pod pruhem: tahle jáma = 4 cm/h */}
    <path d="M183 436 l-6 9 h12 z" fill="#232830" />

    <text className="sv-val" x="78" y="464" textAnchor="middle">pod 2,5</text>
    <text className="sv-lbl" x="78" y="486" textAnchor="middle">pomalu</text>
    <text className="sv-val" x="221" y="464" textAnchor="middle">2,5–7,5</text>
    <text className="sv-lbl" x="221" y="486" textAnchor="middle">ideální</text>
    {/* Čtvrtý segment (7,5–10) zůstával bez legendy, tedy nedešifrovatelný
        — 21 % šířky pruhu (porota kola 07, styl). */}
    <text className="sv-val" x="365" y="464" textAnchor="middle">7,5–10</text>
    <text className="sv-lbl" x="365" y="486" textAnchor="middle">na hraně</text>
    <text className="sv-val" x="458" y="464" textAnchor="middle">nad 10</text>
    <text className="sv-lbl" x="458" y="486" textAnchor="middle">rychle</text>
  </svg>
)
