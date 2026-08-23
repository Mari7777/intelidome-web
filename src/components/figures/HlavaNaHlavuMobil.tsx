import React from 'react'

// Svislá sazba figury „hlava na hlavu" pro úzké displeje (DESIGN.md 9.2).
// Tvarosloví, barvy, značky i čísla přebírá doslova z HlavaNaHlavu.tsx — mění se
// jen sazba: panely jdou pod sebe, aby se oba stavy vešly do jednoho pohledu.
// Nahoře ODDÁLENO (rozestup 10 m = dvojnásobek dostřiku), dole HLAVA NA HLAVU
// (rozestup 5 m = dostřik). Měřítko je v obou panelech stejné: 88 px = 5 m,
// takže poměr rozestup : dostřik drží 2:1 nahoře a 1:1 dole.
//
// Všechna id nesou prefix `hnhm-`, protože širokoúhlá varianta (`hnh-`) je
// ve stránce zároveň — shodné id by rozbilo odkazy na gradienty v obou.
//
// Rozpočet animací: 7 SMIL uzlů. Vlny nepulzují po hlavicích zvlášť jako
// v širokoúhlé variantě — celý panel dýchá naráz, takže tři kružnice sdílejí
// jedno prolnutí skupiny a samy animují jen poloměr. Klidový stav (po odebrání
// SMIL uzlů při prefers-reduced-motion) je zapsaný v markupu: vlna stojí těsně
// pod okrajem dostřiku (r 77 z 88, opacity 0.4) — stejný poměr jako širokoúhlá
// varianta, aby v klidu nevznikl falešný druhý okraj.
export const HlavaNaHlavuMobil: React.FC = () => (
  <svg className="block h-auto w-full" viewBox="0 0 520 672">
    <defs>
      <radialGradient id="hnhm-voda" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#2563eb" stopOpacity="0.34" />
        <stop offset="0.55" stopColor="#2563eb" stopOpacity="0.14" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.05" />
      </radialGradient>
      <radialGradient id="hnhm-sucho" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#c2a052" stopOpacity="0.95" />
        <stop offset="1" stopColor="#c2a052" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* ---------- nadpisy panelů ---------- */}
    <text className="sv-lbl" x="260" y="22" textAnchor="middle">Oddáleno</text>
    <text className="sv-lbl" x="260" y="358" textAnchor="middle">Hlava na hlavu</text>

    {/* ---------- trávník ---------- */}
    <rect x="44" y="40" width="432" height="224" rx="14" fill="#3f7d4e" fillOpacity="0.1" stroke="#3f7d4e" strokeOpacity="0.3" strokeWidth="1.6" />
    <rect x="44" y="376" width="432" height="224" rx="14" fill="#3f7d4e" fillOpacity="0.1" stroke="#3f7d4e" strokeOpacity="0.3" strokeWidth="1.6" />

    {/* ---------- NAHOŘE: dostřiky se sotva dotknou ---------- */}
    <circle cx="172" cy="152" r="88" fill="url(#hnhm-voda)" />
    <circle cx="348" cy="152" r="88" fill="url(#hnhm-voda)" />
    {/* suchý pruh přesně v místě dotyku */}
    <ellipse cx="260" cy="152" rx="42" ry="99" fill="url(#hnhm-sucho)" />
    <circle cx="172" cy="152" r="88" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <circle cx="348" cy="152" r="88" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />

    {/* vlny — obě hlavice v jedné smyčce (2 uzly r + 1 uzel prolnutí) */}
    <g opacity="0.4">
      <animate attributeName="opacity" values="0.7;0" calcMode="spline" keySplines=".16 .6 .4 1" dur="4.6s" begin="0s" repeatCount="indefinite" />
      <circle cx="172" cy="152" r="77" fill="none" stroke="#3b82f6" strokeWidth="1.6">
        <animate attributeName="r" values="25;87" calcMode="spline" keySplines=".16 .6 .4 1" dur="4.6s" begin="0s" repeatCount="indefinite" />
      </circle>
      <circle cx="348" cy="152" r="77" fill="none" stroke="#3b82f6" strokeWidth="1.6">
        <animate attributeName="r" values="25;87" calcMode="spline" keySplines=".16 .6 .4 1" dur="4.6s" begin="0s" repeatCount="indefinite" />
      </circle>
    </g>

    {/* kóta dostřiku — končí uprostřed suchého pruhu */}
    <line x1="172" y1="152" x2="256" y2="152" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M251 147 L258 152 L251 157" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="260" y1="136" x2="260" y2="168" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
    <text className="sv-lbl" x="212" y="136" textAnchor="end">Dostřik</text>
    <text className="sv-val" x="222" y="136" textAnchor="start">5 m</text>

    {/* štítek suchého pruhu */}
    <circle cx="212" cy="250" r="4.5" fill="#c2a052" />
    <text className="sv-lbl" x="226" y="254" textAnchor="start">Suchý pruh</text>

    {/* ---------- DOLE: hlava na hlavu ---------- */}
    <circle cx="172" cy="488" r="88" fill="url(#hnhm-voda)" />
    <circle cx="260" cy="488" r="88" fill="url(#hnhm-voda)" />
    <circle cx="348" cy="488" r="88" fill="url(#hnhm-voda)" />
    {/* čočky překryvu — sytější modrá */}
    <path d="M216 411.8 A88 88 0 0 1 216 564.2 A88 88 0 0 1 216 411.8" fill="#3b82f6" fillOpacity="0.13" />
    <path d="M304 411.8 A88 88 0 0 1 304 564.2 A88 88 0 0 1 304 411.8" fill="#3b82f6" fillOpacity="0.13" />
    <circle cx="172" cy="488" r="88" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <circle cx="260" cy="488" r="88" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <circle cx="348" cy="488" r="88" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />

    {/* vlny — tři hlavice v jedné smyčce, fázově za horním panelem */}
    <g opacity="0.4">
      <animate attributeName="opacity" values="0.7;0" calcMode="spline" keySplines=".16 .6 .4 1" dur="4.6s" begin="2.3s" repeatCount="indefinite" />
      <circle cx="172" cy="488" r="77" fill="none" stroke="#3b82f6" strokeWidth="1.6">
        <animate attributeName="r" values="25;87" calcMode="spline" keySplines=".16 .6 .4 1" dur="4.6s" begin="2.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="260" cy="488" r="77" fill="none" stroke="#3b82f6" strokeWidth="1.6">
        <animate attributeName="r" values="25;87" calcMode="spline" keySplines=".16 .6 .4 1" dur="4.6s" begin="2.3s" repeatCount="indefinite" />
      </circle>
      <circle cx="348" cy="488" r="77" fill="none" stroke="#3b82f6" strokeWidth="1.6">
        <animate attributeName="r" values="25;87" calcMode="spline" keySplines=".16 .6 .4 1" dur="4.6s" begin="2.3s" repeatCount="indefinite" />
      </circle>
    </g>

    {/* kóta dostřiku — končí na těle sousední hlavice */}
    <line x1="172" y1="488" x2="254" y2="488" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M249 483 L256 488 L249 493" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="260" cy="488" r="18" fill="none" stroke="#2563eb" strokeWidth="1.6" opacity="0.75" />
    <text className="sv-lbl" x="212" y="472" textAnchor="end">Dostřik</text>
    <text className="sv-val" x="222" y="472" textAnchor="start">5 m</text>

    {/* štítek rovnoměrnosti */}
    <path d="M198 585 L203 591 L212 579" fill="none" stroke="#047857" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <text className="sv-lbl" x="222" y="589" textAnchor="start">Rovnoměrně</text>

    {/* ---------- hlavice ---------- */}
    <g>
      <circle cx="172" cy="152" r="13" fill="none" stroke="#232830" strokeWidth="1.6" opacity="0.5" />
      <circle cx="172" cy="152" r="7" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" />
      <circle cx="172" cy="152" r="2.4" fill="#60a5fa" />
    </g>
    <g>
      <circle cx="348" cy="152" r="13" fill="none" stroke="#232830" strokeWidth="1.6" opacity="0.5" />
      <circle cx="348" cy="152" r="7" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" />
      <circle cx="348" cy="152" r="2.4" fill="#60a5fa" />
    </g>
    <g>
      <circle cx="172" cy="488" r="13" fill="none" stroke="#232830" strokeWidth="1.6" opacity="0.5" />
      <circle cx="172" cy="488" r="7" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" />
      <circle cx="172" cy="488" r="2.4" fill="#60a5fa" />
    </g>
    <g>
      <circle cx="260" cy="488" r="13" fill="none" stroke="#232830" strokeWidth="1.6" opacity="0.5" />
      <circle cx="260" cy="488" r="7" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" />
      <circle cx="260" cy="488" r="2.4" fill="#60a5fa" />
    </g>
    <g>
      <circle cx="348" cy="488" r="13" fill="none" stroke="#232830" strokeWidth="1.6" opacity="0.5" />
      <circle cx="348" cy="488" r="7" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" />
      <circle cx="348" cy="488" r="2.4" fill="#60a5fa" />
    </g>

    {/* ---------- kóty rozestupu ---------- */}
    <line x1="172" y1="270" x2="172" y2="306" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <line x1="348" y1="270" x2="348" y2="306" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <line x1="172" y1="298" x2="348" y2="298" stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    <path d="M181 293 L172 298 L181 303 M339 293 L348 298 L339 303" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    <text className="sv-val" x="260" y="288" textAnchor="middle">10 m</text>
    <text className="sv-lbl" x="260" y="322" textAnchor="middle">Rozestup</text>

    <line x1="172" y1="606" x2="172" y2="642" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <line x1="260" y1="606" x2="260" y2="642" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <line x1="348" y1="606" x2="348" y2="642" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <line x1="172" y1="634" x2="348" y2="634" stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    <path d="M181 629 L172 634 L181 639 M339 629 L348 634 L339 639" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    <line x1="260" y1="628" x2="260" y2="640" stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    <text className="sv-val" x="216" y="624" textAnchor="middle">5 m</text>
    <text className="sv-val" x="304" y="624" textAnchor="middle">5 m</text>
    <text className="sv-lbl" x="260" y="658" textAnchor="middle">Rozestup</text>
  </svg>
)
