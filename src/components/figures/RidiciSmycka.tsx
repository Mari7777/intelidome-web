import React from 'react'

// Uzavřená řídicí smyčka závlahy: čidlo v půdě změří vlhkost, práh ji porovná s cílem
// a teprve pak se otevře ventil. Pointa: rozhoduje měření, ne kalendář — a smyčka se
// vrací zpátky k půdě. Vedlejší větev ukazuje, že voda se bere nejdřív z retenční nádrže
// a vodovodní řad je jen záloha.
export const RidiciSmycka: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 1080 420">
    <defs>
      <radialGradient id="rs-voda" cx="50%" cy="34%" r="66%">
        <stop offset="0" stopColor="#2563eb" stopOpacity="0.34" />
        <stop offset="0.55" stopColor="#2563eb" stopOpacity="0.14" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.05" />
      </radialGradient>
    </defs>

    {/* ── půda ───────────────────────────────────────────────── */}
    <rect x="0" y="330" width="1080" height="12" fill="#3f7d4e" />
    <rect x="0" y="342" width="1080" height="52" fill="#6b5138" opacity="0.9" />
    <rect x="0" y="394" width="1080" height="26" fill="#54402c" opacity="0.85" />
    <path d="M0 342H1080" stroke="#2e6440" strokeWidth="1.6" />
    <path
      d="M0 394H1080"
      stroke="rgba(255,255,255,.13)"
      strokeWidth="1.5"
      strokeDasharray="3 7"
    />

    {/* stébla trávy */}
    <g stroke="#3f7d4e" strokeWidth="2" strokeLinecap="round">
      <path d="M96 330v-9" />
      <path d="M232 330v-11" />
      <path d="M300 330v-8" />
      <path d="M452 330v-10" />
      <path d="M520 330v-8" />
      <path d="M604 330v-11" />
      <path d="M676 330v-8" />
      <path d="M868 330v-10" />
      <path d="M932 330v-8" />
      <path d="M1024 330v-11" />
    </g>

    {/* vsáklá voda v kořenové zóně pod ventilem */}
    <ellipse cx="782" cy="380" rx="150" ry="38" fill="url(#rs-voda)" />

    {/* kořeny */}
    <g stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" fill="none">
      <path d="M254 342v28m0-12 14 12m-14-2-13 14" />
      <path d="M470 342v34m0-16 16 14m-16-2-14 16" />
      <path d="M640 342v26m0-10 15 13" />
      <path d="M782 342v42m0-24 20 18m-20-4-18 18" />
      <path d="M916 342v30m0-14 14 13" />
    </g>

    {/* ── čidlo vlhkosti ─────────────────────────────────────── */}
    <g>
      <path d="M138 300v84M162 300v84" stroke="#232830" strokeWidth="3.4" strokeLinecap="round" />
      <rect
        x="118"
        y="258"
        width="64"
        height="42"
        rx="9"
        fill="#232830"
        stroke="rgba(255,255,255,.2)"
        strokeWidth="1.6"
      />
      <path
        d="M132 288h36"
        stroke="rgba(255,255,255,.22)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="150" cy="272" r="3.6" fill="#2563eb" />
      {/* měření: vlna u hrotu sondy */}
      <circle cx="150" cy="384" r="7" fill="none" stroke="#60a5fa" strokeWidth="1.8" opacity="0.45">
        <animateTransform
          attributeName="transform"
          type="scale"
          additive="sum"
          values="0.32; 1.12"
          calcMode="spline"
          keySplines=".16 .6 .4 1"
          dur="4.6s"
          repeatCount="indefinite"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <animate attributeName="opacity" values="0.45;0" calcMode="spline"
          keySplines=".16 .6 .4 1"
          dur="4.6s" repeatCount="indefinite" />
      </circle>
    </g>

    {/* ── práh (rozhodovací uzel) ────────────────────────────── */}
    <path
      d="M392 72 438 118 392 164 346 118Z"
      fill="none"
      stroke="#2563eb"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* ── most ───────────────────────────────────────────────── */}
    <g>
      <rect
        x="560"
        y="92"
        width="120"
        height="52"
        rx="11"
        fill="#232830"
        stroke="rgba(255,255,255,.2)"
        strokeWidth="1.6"
      />
      <g
        stroke="rgba(255,255,255,.22)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M604 128a14 14 0 0 1 0-20" />
        <path d="M594 134a24 24 0 0 1 0-32" />
        <path d="M636 108a14 14 0 0 1 0 20" />
        <path d="M646 102a24 24 0 0 1 0 32" />
      </g>
      <circle cx="620" cy="118" r="4" fill="#2563eb" />
    </g>

    {/* ── ventil ─────────────────────────────────────────────── */}
    <g>
      <rect
        x="742"
        y="214"
        width="96"
        height="60"
        rx="11"
        fill="#232830"
        stroke="rgba(255,255,255,.2)"
        strokeWidth="1.6"
      />
      <path
        d="M774 238 774 262 806 238 806 262Z"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M790 250v-22M778 228h24" stroke="rgba(255,255,255,.22)" strokeWidth="1.6" strokeLinecap="round" />
    </g>

    {/* ── retenční nádrž ─────────────────────────────────────── */}
    <g>
      <rect
        x="905"
        y="100"
        width="116"
        height="90"
        rx="7"
        fill="none"
        stroke="#232830"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M907 142h112v46a2 2 0 0 1-2 2H909a2 2 0 0 1-2-2Z" fill="#3b82f6" opacity="0.28" />
      <path
        d="M907 142c14-7 24 7 38 0s24 7 37 0 23 5 37 0"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </g>

    {/* ── vodovodní řad: záloha, konstrukční čára ────────────── */}
    <g stroke="#d5d3cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M1044 254H870V246" strokeDasharray="3 7" />
      <path d="M1044 240v28" />
      <path d="M942 240 942 268 972 240 972 268Z" />
      <path d="M957 254v-16M947 238h20" />
    </g>

    {/* ── nečinná větev: NE ──────────────────────────────────── */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" fill="none" strokeDasharray="3 7">
      <path d="M392 166v50" />
      <rect x="300" y="216" width="184" height="46" rx="11" />
    </g>

    {/* ── aktivní smyčka: pochodující čára ───────────────────── */}
    <g
      fill="none"
      stroke="#2563eb"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="10 8"
    >
      <path d="M150 254V132Q150 118 164 118H344">
        <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.1s" repeatCount="indefinite" />
      </path>
      <path d="M440 118H558">
        <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.1s" repeatCount="indefinite" />
      </path>
      <path d="M682 118H776Q790 118 790 132V212">
        <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.1s" repeatCount="indefinite" />
      </path>
      <path d="M790 276V354">
        <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.1s" repeatCount="indefinite" />
      </path>
      <path d="M903 166H878Q870 166 870 176V234Q870 244 860 244H842">
        <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.1s" repeatCount="indefinite" />
      </path>
    </g>

    {/* návrat: vlhkost se vrací k čidlu (v půdě, vodní tint) */}
    <path
      d="M752 376C636 408 372 406 200 378"
      fill="none"
      stroke="#60a5fa"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeDasharray="10 8"
    >
      <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.1s" repeatCount="indefinite" />
    </path>

    {/* odkazová čárka k návratové větvi */}
    <path
      d="M430 326V398"
      stroke="#d5d3cc"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="3 7"
      fill="none"
    />

    {/* šipky směru */}
    <g fill="#2563eb">
      <path d="M336 111 350 118 336 125Z" />
      <path d="M550 111 564 118 550 125Z" />
      <path d="M783 202 797 202 790 216Z" />
      <path d="M850 237 850 251 836 244Z" />
    </g>
    <path d="M208 370 208 386 194 377Z" fill="#60a5fa" />

    {/* ── popisky ────────────────────────────────────────────── */}
    <text className="sv-lbl" x="196" y="286">
      Čidlo vlhkosti
    </text>
    <text className="sv-val" x="170" y="206">
      38 %
    </text>
    <text className="sv-lbl" x="392" y="56" textAnchor="middle">
      Práh
    </text>
    <text className="sv-val" x="392" y="124" textAnchor="middle">
      cíl 45 %
    </text>
    <text className="sv-lbl" x="500" y="104" textAnchor="middle">
      Ano
    </text>
    <text className="sv-lbl" x="404" y="196">
      Ne
    </text>
    <text className="sv-lbl" x="392" y="244" textAnchor="middle">
      Nic se neděje
    </text>
    <text className="sv-lbl" x="620" y="172" textAnchor="middle">
      Most
    </text>
    <text className="sv-lbl" x="730" y="250" textAnchor="end">
      Ventil
    </text>
    <text className="sv-lbl" x="963" y="88" textAnchor="middle">
      Retenční nádrž
    </text>
    <text className="sv-lbl" x="963" y="212" textAnchor="middle">
      Nejdřív dešťová
    </text>
    <text className="sv-lbl" x="963" y="292" textAnchor="middle">
      Vodovodní řad
    </text>
    <text className="sv-lbl" x="963" y="312" textAnchor="middle">
      Až po vyčerpání
    </text>
    <text className="sv-lbl" x="430" y="318" textAnchor="middle">
      Vlhkost stoupá
    </text>
  </svg>
)
