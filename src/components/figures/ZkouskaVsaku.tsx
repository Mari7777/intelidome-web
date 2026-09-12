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
 * hladiny z výchozí linky na odečtenou (SMIL scale od dna, 6 s). Klidový
 * stav v markupu = hladina po 15 minutách, značka na stupnici na 4 cm/h.
 * Id s prefixem `zv-`.
 */
export const ZkouskaVsaku: React.FC = () => (
  <svg className="block h-auto w-full" viewBox="0 0 520 490">
    <defs>
      <radialGradient id="zv-voda" gradientUnits="userSpaceOnUse" cx="190" cy="200" r="190">
        <stop offset="0" stopColor="#2563eb" stopOpacity="0.34" />
        <stop offset="0.8" stopColor="#2563eb" stopOpacity="0.14" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.05" />
      </radialGradient>
      <clipPath id="zv-jama">
        <path d="M120 120 L120 360 L260 360 L260 120 Z" />
      </clipPath>
    </defs>

    {/* ── terén po obou stranách jámy ─────────────────────────── */}
    <rect x="30" y="120" width="90" height="240" fill="#6b5138" opacity="0.9" />
    <rect x="260" y="120" width="72" height="240" fill="#6b5138" opacity="0.9" />
    <rect x="30" y="100" width="90" height="20" fill="#3f7d4e" />
    <rect x="260" y="100" width="72" height="20" fill="#3f7d4e" />
    <path d="M30 120 H120 M260 120 H332" stroke="#2e6440" strokeWidth="1.6" fill="none" />
    <path
      d="M38 101q-1 -8 -3 -13M52 101q2 -7 5 -12M66 101q0 -9 0 -14M80 101q2 -10 5 -16M94 101q2 -5 5 -8M108 101q-1 -6 -4 -10M268 101q-2 -10 -5 -17M282 101q-2 -6 -5 -11M296 101q1 -5 2 -8M310 101q1 -10 4 -16M324 101q-2 -9 -5 -15"
      fill="none"
      stroke="#3f7d4e"
      strokeWidth="1.6"
      strokeLinecap="round"
    />

    {/* ── voda v jámě: klidový stav = hladina po 15 minutách ───── */}
    <g clipPath="url(#zv-jama)">
      <rect
        x="110"
        y="188"
        width="160"
        height="172"
        fill="url(#zv-voda)"
        stroke="#60a5fa"
        strokeWidth="2"
        style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
      >
        <animateTransform
          attributeName="transform"
          type="scale"
          additive="sum"
          values="1 1.047; 1 1.047; 1 1; 1 1"
          keyTimes="0; 0.15; 0.8; 1"
          calcMode="spline"
          keySplines="0 0 1 1; .3 .1 .4 1; 0 0 1 1"
          dur="6s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    {/* výchozí hladina — kam sahala voda na začátku měření */}
    <line x1="120" y1="180" x2="260" y2="180" stroke="#93c5fd" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />

    {/* ── jáma: zdrsněné stěny, ne uhlazené rýčem ─────────────── */}
    <path
      d="M120 120 q3 30 -2 60 q-3 30 3 60 q2 30 -1 60 q-2 30 0 60 H260 q3 -30 -1 -60 q-2 -30 2 -60 q3 -30 -2 -60 q-2 -30 1 -60"
      fill="none"
      stroke="#232830"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M30 100 H120 V80 M260 80 V100 H332" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* laťka přes okraj */}
    <rect x="98" y="110" width="196" height="8" rx="2" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" />
    <text className="sv-lbl" x="98" y="72">Laťka</text>

    {/* kóta: hloubka jámy */}
    <g stroke="#232830" strokeWidth="1.4" strokeLinecap="round">
      <line x1="134" y1="126" x2="134" y2="354" strokeDasharray="3 7" stroke="#5b5e63" />
      <line x1="129" y1="126" x2="139" y2="126" />
      <line x1="129" y1="354" x2="139" y2="354" />
    </g>
    <text className="sv-val" x="144" y="150">30 cm</text>

    {/* kóta: od laťky k hladině — to, co se měří */}
    <g stroke="#232830" strokeWidth="1.4" strokeLinecap="round">
      <line x1="236" y1="118" x2="236" y2="188" />
      <line x1="231" y1="118" x2="241" y2="118" />
      <line x1="231" y1="188" x2="241" y2="188" />
    </g>
    {/* pokles 180 → 188 */}
    <g stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round">
      <line x1="200" y1="180" x2="200" y2="188" />
      <line x1="195" y1="180" x2="205" y2="180" />
      <line x1="195" y1="188" x2="205" y2="188" />
    </g>
    <text className="sv-val" x="192" y="178" textAnchor="end" style={{ fill: '#2563eb' }}>1 cm</text>
    <text className="sv-lbl" x="226" y="158" textAnchor="end">měřím</text>

    {/* ── odečet vpravo ───────────────────────────────────────── */}
    <text className="sv-lbl" x="360" y="118">Pokles hladiny</text>
    <text className="sv-val" x="360" y="140">1 cm za 15 min</text>

    <text className="sv-lbl" x="360" y="178">Přepočet</text>
    <text className="sv-val" x="360" y="200">1 cm × 4</text>

    <text className="sv-lbl" x="360" y="238">Rychlost vsakování</text>
    <text className="sv-val" x="360" y="268" style={{ fontSize: 26 }}>4 cm/h</text>

    <line x1="360" y1="290" x2="490" y2="290" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="360" y="314">Zdrsněte stěny,</text>
    <text className="sv-lbl" x="360" y="330">jinak zavřete póry</text>

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

    <text className="sv-val" x="78" y="466" textAnchor="middle">pod 2,5</text>
    <text className="sv-lbl" x="78" y="484" textAnchor="middle">pomalu</text>
    <text className="sv-val" x="221" y="466" textAnchor="middle">2,5–7,5</text>
    <text className="sv-lbl" x="221" y="484" textAnchor="middle">ideální</text>
    <text className="sv-val" x="451" y="466" textAnchor="middle">nad 10</text>
    <text className="sv-lbl" x="451" y="484" textAnchor="middle">rychle</text>
  </svg>
)
