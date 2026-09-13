import React from 'react'

/**
 * Kbelíkový test: manometr na zdroji stojí na 3,5 baru, do desetilitrového
 * kbelíku teče voda a stopky měří 24 s. Pointa — 25 l/min není tvrzení,
 * je to hodnota odečtená ze dvou přístrojů, od které se ještě ubere
 * 20 % rezervy na ztráty v potrubí a stárnutí čerpadla.
 */
export const KbelikovyTest: React.FC = () => (
  <svg
    className="block h-auto w-full"
    viewBox="0 0 1080 400"
  >
    <defs>
      <radialGradient id="kt-voda" gradientUnits="userSpaceOnUse" cx="472" cy="288" r="170">
        <stop offset="0" stopColor="#2563eb" stopOpacity="0.34" />
        <stop offset="0.8" stopColor="#2563eb" stopOpacity="0.14" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.05" />
      </radialGradient>
      <clipPath id="kt-kbelik-clip">
        <path d="M401 213 L543 213 L527 349 L417 349 Z" />
      </clipPath>
    </defs>

    {/* terén — konstrukční linka, na které stojí zdroj i kbelík */}
    <line
      x1="40"
      y1="350"
      x2="600"
      y2="350"
      stroke="#d5d3cc"
      strokeWidth="1.6"
      strokeDasharray="3 7"
      strokeLinecap="round"
    />

    {/* ── 1. zdroj: stoupačka, ventil, výtok ─────────────────────── */}
    <g stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" fill="#232830">
      <rect x="64" y="92" width="28" height="258" rx="3" />
      <rect x="56" y="82" width="44" height="12" rx="3" />
      <rect x="92" y="112" width="52" height="18" rx="3" />
      <rect x="58" y="232" width="40" height="36" rx="5" />
      <rect x="92" y="292" width="44" height="26" rx="4" />
    </g>
    <path
      d="M98 250 L140 236"
      stroke="#232830"
      strokeWidth="7"
      strokeLinecap="round"
      fill="none"
    />
    <text className="sv-lbl" x="78" y="378" textAnchor="middle">
      Zdroj
    </text>

    {/* ── 2. manometr: klidová poloha ručičky = 3,5 baru ──────────── */}
    <g>
      {/* pouzdro (silný tah = tělo přístroje) */}
      <circle cx="200" cy="121" r="56.5" fill="none" stroke="#232830" strokeWidth="2.5" />
      {/* stupnice 0–6 barů */}
      <path
        d="M164.6 156.4 A50 50 0 1 1 235.4 156.4"
        fill="none"
        stroke="#d5d3cc"
        strokeWidth="1.6"
        strokeDasharray="3 7"
        strokeLinecap="round"
      />
      <g stroke="#232830" strokeWidth="1.8" strokeLinecap="round">
        <line x1="170.3" y1="150.7" x2="164.6" y2="156.4" />
        <line x1="158" y1="121" x2="150" y2="121" />
        <line x1="170.3" y1="91.3" x2="164.6" y2="85.6" />
        <line x1="200" y1="79" x2="200" y2="71" />
        <line x1="229.7" y1="91.3" x2="235.4" y2="85.6" />
        <line x1="242" y1="121" x2="250" y2="121" />
        <line x1="229.7" y1="150.7" x2="235.4" y2="156.4" />
      </g>
      {/* zvýrazněná ryska 3,5 baru — sem ručička dojede */}
      <path
        d="M216.3 73.7 A50 50 0 0 1 221.9 76.1"
        fill="none"
        stroke="#232830"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <text className="sv-val" x="149" y="172" textAnchor="middle" dominantBaseline="middle">
        0
      </text>
      <text className="sv-val" x="200" y="49" textAnchor="middle" dominantBaseline="middle">
        3
      </text>
      <text className="sv-val" x="251" y="172" textAnchor="middle" dominantBaseline="middle">
        6
      </text>
      {/* vnější otočení = klidová hodnota 3,5 baru; vnitřní = náběh z nuly */}
      <g transform="rotate(22.5 200 121)">
        <g>
          <path d="M200 121 L196.5 116 L200 74 L203.5 116 Z" fill="#232830" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-157.5 200 121; 7 200 121; -3 200 121; 0 200 121"
            keyTimes="0; 0.6; 0.8; 1"
            calcMode="spline"
          keySplines=".22 .61 .21 1; .22 .61 .21 1; .22 .61 .21 1"
          dur="6s"
            repeatCount="indefinite"
          />
        </g>
      </g>
      <circle cx="200" cy="121" r="5" fill="#232830" />
    </g>
    <text className="sv-lbl" x="200" y="210" textAnchor="middle">
      Manometr
    </text>
    <text className="sv-val" x="200" y="236" textAnchor="middle">
      3,5 baru
    </text>

    {/* ── 3. hadice a proud vody ─────────────────────────────────── */}
    <path
      d="M136 305 C 206 340, 278 338, 328 296 C 368 246, 372 146, 450 132"
      fill="none"
      stroke="#232830"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" fill="#232830">
      <rect x="448" y="121" width="44" height="23" rx="7" />
      <path d="M459 144 L481 144 L477 157 L463 157 Z" />
    </g>

    <g fill="none" strokeLinecap="round">
      <path d="M464 158 C 461.5 186, 461.5 206, 462 226" stroke="#93c5fd" strokeWidth="2" />
      <path d="M476 158 C 478.5 186, 478.5 206, 478 226" stroke="#60a5fa" strokeWidth="2" />
      <path d="M470 158 L470 226" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="10 8">
        <animate
          attributeName="stroke-dashoffset"
          values="0; -24"
          dur="1.1s"
          repeatCount="indefinite"
        />
      </path>
    </g>
    <g fill="#3b82f6" opacity="0.85">
      <g>
        <ellipse cx="470" cy="168" rx="3" ry="5" />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 34"
          calcMode="spline"
          keySplines="0.4 0 1 1"
          dur="2.9s"
          repeatCount="indefinite"
        />
      </g>
      <g>
        <ellipse cx="470" cy="202" rx="3" ry="5" />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 34"
          calcMode="spline"
          keySplines="0.4 0 1 1"
          dur="2.9s"
          begin="-1.45s"
          repeatCount="indefinite"
        />
      </g>
    </g>

    {/* ── 4. kbelík: v klidu naplněný k rysce 10 l ────────────────── */}
    <path
      d="M400 212 L544 212 L528 350 L416 350 Z"
      fill="none"
      stroke="#232830"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <g clipPath="url(#kt-kbelik-clip)">
      {/* fillup dle 6.6.3: scaleY s počátkem u dna, ne animace y/height —
          geometrické vlastnosti nutí prohlížeč přepočítávat layout SVG.
          Klidový stav je plný kbelík, animace ho jen naplní znovu. */}
      <rect x="384" y="226" width="176" height="124" fill="url(#kt-voda)" stroke="#60a5fa" strokeWidth="2" style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <animateTransform
          attributeName="transform"
          type="scale"
          additive="sum"
          values="1 0.06; 1 0.94; 1 0.94"
          keyTimes="0; 0.8; 1"
          calcMode="spline"
          keySplines=".3 .1 .4 1; 0 0 1 1"
          dur="5s"
          repeatCount="indefinite"
        />
      </rect>
    </g>
    <g stroke="#232830" strokeWidth="2.4" strokeLinecap="round">
      <line x1="403" y1="226" x2="428" y2="226" />
      <line x1="516" y1="226" x2="541" y2="226" />
    </g>
    <rect
      x="392"
      y="196"
      width="160"
      height="16"
      rx="7"
      fill="none"
      stroke="#232830"
      strokeWidth="2.2"
    />
    <line
      x1="546"
      y1="226"
      x2="572"
      y2="226"
      stroke="#d5d3cc"
      strokeWidth="1.6"
      strokeDasharray="3 7"
      strokeLinecap="round"
    />
    <text className="sv-val" x="578" y="231">
      10 l
    </text>
    <text className="sv-lbl" x="472" y="378" textAnchor="middle">
      Kbelík
    </text>

    {/* ── 5. stopky: v klidu 24 s ─────────────────────────────────── */}
    <g>
      <rect
        x="668"
        y="97"
        width="16"
        height="11"
        rx="3"
        fill="#232830"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.4"
      />
      <circle cx="676" cy="150" r="43" fill="none" stroke="#232830" strokeWidth="2.5" />
      <circle
        cx="676"
        cy="150"
        r="32"
        fill="none"
        stroke="#d5d3cc"
        strokeWidth="1.6"
        strokeDasharray="3 7"
      />
      <path
        d="M676 114 A36 36 0 0 1 697.2 179.1"
        fill="none"
        stroke="#232830"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="690.1"
        y1="169.4"
        x2="700.5"
        y2="183.4"
        stroke="#232830"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g transform="rotate(144 676 150)">
        <g>
          <path d="M676 150 L673 146 L676 120 L679 146 Z" fill="#232830" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-144 676 150; 0 676 150; 0 676 150"
            keyTimes="0; 0.78; 1"
            calcMode="spline"
          keySplines=".22 .61 .21 1; .22 .61 .21 1"
          dur="6s"
            repeatCount="indefinite"
          />
        </g>
      </g>
      <circle cx="676" cy="150" r="4" fill="#232830" />
    </g>
    <text className="sv-lbl" x="676" y="224" textAnchor="middle">
      Stopky
    </text>
    <text className="sv-val" x="676" y="250" textAnchor="middle">
      24 s
    </text>

    {/* ── 6. odečet → výpočet ────────────────────────────────────── */}
    <line
      x1="736"
      y1="112"
      x2="736"
      y2="298"
      stroke="#d5d3cc"
      strokeWidth="1.6"
      strokeDasharray="3 7"
      strokeLinecap="round"
    />
    <text className="sv-lbl" x="764" y="148">
      Naměřený průtok
    </text>
    <text className="sv-val" x="764" y="180">
      10 l / 24 s = 25 l/min
    </text>
    <line
      x1="764"
      y1="206"
      x2="1030"
      y2="206"
      stroke="#d5d3cc"
      strokeWidth="1.6"
      strokeDasharray="3 7"
      strokeLinecap="round"
    />
    <text className="sv-lbl" x="764" y="238">
      Rezerva na ztráty
    </text>
    <text className="sv-val" x="764" y="270">
      −20 % rezerva → 20 l/min
    </text>
  </svg>
)
