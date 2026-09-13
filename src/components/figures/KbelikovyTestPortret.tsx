import React from 'react'

/**
 * Svislá sazba kbelíkového testu pro sloupec vedle textu (DESIGN.md 9.2, 6.6).
 * Tvarosloví, barvy, značky, popisky i čísla přebírá doslova z KbelikovyTest.tsx —
 * mění se jen sazba: širokoúhlá varianta jde zleva doprava, tahle shora dolů.
 * Nahoře zdroj se stoupačkou a manometr (ručička stojí na 3,5 baru), uprostřed
 * hadice stékající do kbelíku naplněného k rysce 10 l a stopky na 24 s, dole
 * odečet ve dvou řádcích. Pointa zůstává: 25 l/min není tvrzení, je to podíl
 * dvou nakreslených údajů — a po odečtu 20 % rezervy zbude 20 l/min, tedy
 * míň, než kolik článek žádá. Kresba ukazuje aritmetiku, ne verdikt.
 *
 * Pozor: všechna id nesou prefix `ktp-`, protože širokoúhlá varianta (`kt-`)
 * bývá ve stránce zároveň — shodné id by rozbilo odkazy na gradient i ořez
 * v obou kresbách naráz.
 *
 * Rozpočet animací: 6 SMIL uzlů (ručička manometru, ručička stopek, plnění
 * kbelíku, proud vody, dvě kapky). Klidový stav je zapsaný v markupu, takže
 * po odebrání SMIL uzlů při prefers-reduced-motion drží všechny tři odečty:
 * ručička na 3,5 baru, hladina přesně na rysce 10 l, stopky na 24 s.
 */
export const KbelikovyTestPortret: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 660">
    <defs>
      <radialGradient id="ktp-voda" gradientUnits="userSpaceOnUse" cx="232" cy="400" r="140">
        <stop offset="0" stopColor="#2563eb" stopOpacity="0.34" />
        <stop offset="0.8" stopColor="#2563eb" stopOpacity="0.14" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.05" />
      </radialGradient>
      <clipPath id="ktp-kbelik-clip">
        <path d="M158 340 L306 340 L290 469 L174 469 Z" />
      </clipPath>
    </defs>

    {/* terén — konstrukční linka, na které stojí stoupačka i kbelík */}
    <line
      x1="30"
      y1="470"
      x2="344"
      y2="470"
      stroke="#d5d3cc"
      strokeWidth="1.6"
      strokeDasharray="3 7"
      strokeLinecap="round"
    />

    {/* ── 1. zdroj: stoupačka, odbočka k manometru, ventil, výtok ──── */}
    <g stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" fill="#232830">
      <rect x="54" y="36" width="22" height="434" rx="3" />
      <rect x="47" y="24" width="36" height="12" rx="3" />
      <rect x="76" y="128" width="46" height="16" rx="3" />
      <rect x="50" y="236" width="30" height="34" rx="5" />
      <rect x="76" y="290" width="38" height="22" rx="4" />
      <rect x="48" y="430" width="34" height="12" rx="3" />
    </g>
    <path
      d="M80 254 L120 242"
      stroke="#232830"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    {/* přívod k manometru */}
    <path d="M122 136 L266 136" stroke="#232830" strokeWidth="6" strokeLinecap="round" fill="none" />
    <text className="sv-lbl" x="65" y="498" textAnchor="middle">
      Zdroj
    </text>

    {/* ── 2. manometr: klidová poloha ručičky = 3,5 baru ──────────── */}
    <g>
      {/* pouzdro (silný tah = tělo přístroje) */}
      <circle cx="336" cy="136" r="70" fill="none" stroke="#232830" strokeWidth="2.5" />
      {/* stupnice 0–6 barů, 45° na bar */}
      <path
        d="M292.16 179.84 A62 62 0 1 1 379.84 179.84"
        fill="none"
        stroke="#d5d3cc"
        strokeWidth="1.6"
        strokeDasharray="3 7"
        strokeLinecap="round"
      />
      {/* celé bary */}
      <g stroke="#232830" strokeWidth="1.8" strokeLinecap="round">
        <line x1="292.16" y1="179.84" x2="285.09" y2="186.91" />
        <line x1="274" y1="136" x2="264" y2="136" />
        <line x1="292.16" y1="92.16" x2="285.09" y2="85.09" />
        <line x1="336" y1="74" x2="336" y2="64" />
        <line x1="379.84" y1="92.16" x2="386.91" y2="85.09" />
        <line x1="398" y1="136" x2="408" y2="136" />
        <line x1="379.84" y1="179.84" x2="386.91" y2="186.91" />
      </g>
      {/* půlbary */}
      <g stroke="#232830" strokeWidth="1.4" strokeLinecap="round" opacity="0.75">
        <line x1="278.72" y1="159.73" x2="273.18" y2="162.02" />
        <line x1="278.72" y1="112.27" x2="273.18" y2="109.98" />
        <line x1="312.27" y1="78.72" x2="309.98" y2="73.18" />
        <line x1="359.73" y1="78.72" x2="362.02" y2="73.18" />
        <line x1="393.28" y1="112.27" x2="398.82" y2="109.98" />
        <line x1="393.28" y1="159.73" x2="398.82" y2="162.02" />
      </g>
      {/* zvýrazněná ryska 3,5 baru — sem ručička dojede */}
      <path
        d="M356.70 77.56 A62 62 0 0 1 362.69 80.04"
        fill="none"
        stroke="#232830"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <text className="sv-val" x="273.07" y="198.93" textAnchor="middle" dominantBaseline="middle">
        0
      </text>
      <text className="sv-val" x="336" y="47" textAnchor="middle" dominantBaseline="middle">
        3
      </text>
      <text className="sv-val" x="398.93" y="198.93" textAnchor="middle" dominantBaseline="middle">
        6
      </text>
      {/* vnější otočení = klidová hodnota 3,5 baru; vnitřní = náběh z nuly */}
      <g transform="rotate(22.5 336 136)">
        <g>
          <path d="M336 136 L331.7 130 L336 77.8 L340.3 130 Z" fill="#232830" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-157.5 336 136; 7 336 136; -3 336 136; 0 336 136"
            keyTimes="0; 0.6; 0.8; 1"
            calcMode="spline"
            keySplines=".22 .61 .21 1; .22 .61 .21 1; .22 .61 .21 1"
            dur="6s"
            repeatCount="indefinite"
          />
        </g>
      </g>
      <circle cx="336" cy="136" r="6.2" fill="#232830" />
    </g>
    <text className="sv-lbl" x="336" y="232" textAnchor="middle">
      Manometr
    </text>
    <text className="sv-val" x="336" y="258" textAnchor="middle">
      3,5 baru
    </text>

    {/* ── 3. hadice a proud vody ─────────────────────────────────── */}
    <path
      d="M114 301 C 150 303, 176 295, 196 277 C 212 263, 224 259, 232 258"
      fill="none"
      stroke="#232830"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" fill="#232830">
      <rect x="209" y="258" width="46" height="24" rx="7" />
      <path d="M220 282 L244 282 L240 296 L224 296 Z" />
    </g>

    <g fill="none" strokeLinecap="round">
      <path d="M226 297 C 223.5 320, 223.5 338, 224 356" stroke="#93c5fd" strokeWidth="2" />
      <path d="M238 297 C 240.5 320, 240.5 338, 240 356" stroke="#60a5fa" strokeWidth="2" />
      <path d="M232 297 L232 356" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="10 8">
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
        <ellipse cx="232" cy="310" rx="3" ry="5" />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 29"
          calcMode="spline"
          keySplines="0.4 0 1 1"
          dur="2.9s"
          repeatCount="indefinite"
        />
      </g>
      <g>
        <ellipse cx="232" cy="339" rx="3" ry="5" />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 29"
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
      d="M157 339 L307 339 L291 470 L173 470 Z"
      fill="none"
      stroke="#232830"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <g clipPath="url(#ktp-kbelik-clip)">
      {/* fillup dle 6.6.3: scaleY s počátkem u dna, ne animace y/height —
          geometrické vlastnosti nutí prohlížeč přepočítávat layout SVG.
          Klidový stav je plný kbelík po rysku, animace ho jen naplní znovu. */}
      <rect
        x="146"
        y="356"
        width="200"
        height="114"
        fill="url(#ktp-voda)"
        stroke="#60a5fa"
        strokeWidth="2"
        style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
      >
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
      <line x1="160" y1="356" x2="187" y2="356" />
      <line x1="277" y1="356" x2="304" y2="356" />
    </g>
    <rect
      x="150"
      y="322"
      width="164"
      height="16"
      rx="7"
      fill="none"
      stroke="#232830"
      strokeWidth="2.2"
    />
    {/* dílky po 2 l na vnitřní stěně — ryska 10 l je horní z nich */}
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round" opacity="0.35" fill="none">
      <line x1="162" y1="379" x2="176" y2="379" />
      <line x1="165" y1="402" x2="179" y2="402" />
      <line x1="168" y1="425" x2="182" y2="425" />
      <line x1="171" y1="448" x2="185" y2="448" />
    </g>
    <line
      x1="118"
      y1="356"
      x2="159"
      y2="356"
      stroke="#d5d3cc"
      strokeWidth="1.6"
      strokeDasharray="3 7"
      strokeLinecap="round"
    />
    <text className="sv-val" x="112" y="361" textAnchor="end">
      10 l
    </text>
    <text className="sv-lbl" x="232" y="498" textAnchor="middle">
      Kbelík
    </text>

    {/* ── 5. stopky: v klidu 24 s ─────────────────────────────────── */}
    <g>
      <rect
        x="411.58"
        y="264.98"
        width="21"
        height="14"
        rx="3"
        fill="#232830"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.4"
      />
      <circle cx="424" cy="336" r="56" fill="none" stroke="#232830" strokeWidth="2.5" />
      <circle
        cx="424"
        cy="336"
        r="41.67"
        fill="none"
        stroke="#d5d3cc"
        strokeWidth="1.6"
        strokeDasharray="3 7"
      />
      {/* rysky po 5 s */}
      <g stroke="#232830" strokeWidth="1.4" strokeLinecap="round" opacity="0.75">
        <line x1="424" y1="286" x2="424" y2="280" />
        <line x1="449" y1="292.7" x2="452" y2="287.5" />
        <line x1="467.3" y1="311" x2="472.5" y2="308" />
        <line x1="474" y1="336" x2="480" y2="336" />
        <line x1="467.3" y1="361" x2="472.5" y2="364" />
        <line x1="449" y1="379.3" x2="452" y2="384.5" />
        <line x1="424" y1="386" x2="424" y2="392" />
        <line x1="399" y1="379.3" x2="396" y2="384.5" />
        <line x1="380.7" y1="361" x2="375.5" y2="364" />
        <line x1="374" y1="336" x2="368" y2="336" />
        <line x1="380.7" y1="311" x2="375.5" y2="308" />
        <line x1="399" y1="292.7" x2="396" y2="287.5" />
      </g>
      {/* uběhlý úsek 0 → 24 s = 144° z 60 s */}
      <path
        d="M424 289.12 A46.88 46.88 0 0 1 451.56 373.93"
        fill="none"
        stroke="#232830"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <line
        x1="442.36"
        y1="361.27"
        x2="455.91"
        y2="379.5"
        stroke="#232830"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <g transform="rotate(144 424 336)">
        <g>
          <path d="M424 336 L420.09 330.8 L424 296.93 L427.91 330.8 Z" fill="#232830" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-144 424 336; 0 424 336; 0 424 336"
            keyTimes="0; 0.78; 1"
            calcMode="spline"
            keySplines=".22 .61 .21 1; .22 .61 .21 1"
            dur="6s"
            repeatCount="indefinite"
          />
        </g>
      </g>
      <circle cx="424" cy="336" r="5.21" fill="#232830" />
    </g>
    <text className="sv-lbl" x="424" y="430" textAnchor="middle">
      Stopky
    </text>
    <text className="sv-val" x="424" y="456" textAnchor="middle">
      24 s
    </text>

    {/* ── 6. odečet → výpočet ────────────────────────────────────── */}
    <line
      x1="30"
      y1="518"
      x2="492"
      y2="518"
      stroke="#d5d3cc"
      strokeWidth="1.6"
      strokeDasharray="3 7"
      strokeLinecap="round"
    />
    <text className="sv-lbl" x="30" y="544">
      Naměřený průtok
    </text>
    <text className="sv-val" x="30" y="572">
      10 l / 24 s = 25 l/min
    </text>
    <line
      x1="30"
      y1="592"
      x2="492"
      y2="592"
      stroke="#d5d3cc"
      strokeWidth="1.6"
      strokeDasharray="3 7"
      strokeLinecap="round"
    />
    <text className="sv-lbl" x="30" y="618">
      Rezerva na ztráty
    </text>
    <text className="sv-val" x="30" y="646">
      −20 % rezerva → 20 l/min
    </text>
  </svg>
)
