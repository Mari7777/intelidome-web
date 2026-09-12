import React from 'react'

// Půdorys trávníku ve dvou stavech. Vlevo jsou hlavice oddálené na dvojnásobek dostřiku:
// kruhy se jen dotknou a přesně v tom místě, kde obě slábnou nejvíc, zůstane suchý pruh.
// Vpravo je rozestup roven dostřiku — voda z jedné hlavice dopadá na tělo té sousední,
// překryv je vyznačený sytější modrou. Pointa: obě šipky ukazují stejných 5 m.
export const HlavaNaHlavu: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 1080 360">
    <defs>
      <radialGradient id="hnh-voda" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#2563eb" stopOpacity="0.34" />
        <stop offset="0.55" stopColor="#2563eb" stopOpacity="0.14" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.05" />
      </radialGradient>
      <radialGradient id="hnh-sucho" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#c2a052" stopOpacity="0.95" />
        <stop offset="1" stopColor="#c2a052" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* ---------- nadpisy ---------- */}
    <text className="sv-lbl" x="276" y="28" textAnchor="middle">Oddáleno</text>
    <text className="sv-lbl" x="804" y="28" textAnchor="middle">Hlava na hlavu</text>

    {/* ---------- trávník ---------- */}
    <rect x="36" y="46" width="480" height="246" rx="14" fill="#3f7d4e" fillOpacity="0.1" stroke="#3f7d4e" strokeOpacity="0.3" strokeWidth="1.6" />
    <rect x="564" y="46" width="480" height="246" rx="14" fill="#3f7d4e" fillOpacity="0.1" stroke="#3f7d4e" strokeOpacity="0.3" strokeWidth="1.6" />

    {/* ---------- VLEVO: dostřiky se sotva dotknou ---------- */}
    <circle cx="176" cy="166" r="100" fill="url(#hnh-voda)" />
    <circle cx="376" cy="166" r="100" fill="url(#hnh-voda)" />
    {/* suchý pruh přesně v místě dotyku */}
    <ellipse cx="276" cy="166" rx="48" ry="112" fill="url(#hnh-sucho)" />
    <circle cx="176" cy="166" r="100" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <circle cx="376" cy="166" r="100" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />

    {/* vlny od hlavice 1 */}
    <g>
      <g transform="translate(176 166)">
        <circle className="id-ripple" cx="0" cy="0" r="88" fill="none" stroke="#3b82f6" strokeWidth="1.6" opacity="0.34" style={{ animationDelay: '-0.0s' }} />
      </g>
      <g transform="translate(176 166)">
        <circle cx="0" cy="0" r="88" fill="none" stroke="#60a5fa" strokeWidth="1.6" opacity="0.34" />
      </g>
      <g transform="translate(176 166)">
        <circle cx="0" cy="0" r="88" fill="none" stroke="#93c5fd" strokeWidth="1.6" opacity="0.34" />
      </g>
    </g>
    {/* vlny od hlavice 2 — fázově posunuté */}
    <g>
      <g transform="translate(376 166)">
        <circle className="id-ripple" cx="0" cy="0" r="88" fill="none" stroke="#3b82f6" strokeWidth="1.6" opacity="0.34" style={{ animationDelay: '-0.92s' }} />
      </g>
      <g transform="translate(376 166)">
        <circle cx="0" cy="0" r="88" fill="none" stroke="#60a5fa" strokeWidth="1.6" opacity="0.34" />
      </g>
      <g transform="translate(376 166)">
        <circle cx="0" cy="0" r="88" fill="none" stroke="#93c5fd" strokeWidth="1.6" opacity="0.34" />
      </g>
    </g>

    {/* kóta dostřiku — končí uprostřed suchého pruhu */}
    <line x1="176" y1="166" x2="272" y2="166" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M267 161 L274 166 L267 171" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="276" y1="150" x2="276" y2="182" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
    <text className="sv-lbl" x="220" y="150" textAnchor="end">Dostřik</text>
    <text className="sv-val" x="230" y="150" textAnchor="start">5 m</text>

    {/* štítek suchého pruhu */}
    <circle cx="216" cy="276" r="4.5" fill="#c2a052" />
    <text className="sv-lbl" x="230" y="280" textAnchor="start">Suchý pruh</text>

    {/* ---------- VPRAVO: hlava na hlavu ---------- */}
    <circle cx="704" cy="166" r="100" fill="url(#hnh-voda)" />
    <circle cx="804" cy="166" r="100" fill="url(#hnh-voda)" />
    <circle cx="904" cy="166" r="100" fill="url(#hnh-voda)" />
    {/* překryv — sytější modrá */}
    <path d="M754 79.4 A100 100 0 0 1 754 252.6 A100 100 0 0 1 754 79.4" fill="#3b82f6" fillOpacity="0.13" />
    <path d="M854 79.4 A100 100 0 0 1 854 252.6 A100 100 0 0 1 854 79.4" fill="#3b82f6" fillOpacity="0.13" />
    <circle cx="704" cy="166" r="100" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <circle cx="804" cy="166" r="100" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <circle cx="904" cy="166" r="100" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />

    <g>
      <g transform="translate(704 166)">
        <circle className="id-ripple" cx="0" cy="0" r="88" fill="none" stroke="#3b82f6" strokeWidth="1.6" opacity="0.34" style={{ animationDelay: '-1.84s' }} />
      </g>
      <g transform="translate(704 166)">
        <circle cx="0" cy="0" r="88" fill="none" stroke="#60a5fa" strokeWidth="1.6" opacity="0.34" />
      </g>
      <g transform="translate(704 166)">
        <circle cx="0" cy="0" r="88" fill="none" stroke="#93c5fd" strokeWidth="1.6" opacity="0.34" />
      </g>
    </g>
    <g>
      <g transform="translate(804 166)">
        <circle className="id-ripple" cx="0" cy="0" r="88" fill="none" stroke="#3b82f6" strokeWidth="1.6" opacity="0.34" style={{ animationDelay: '-2.76s' }} />
      </g>
      <g transform="translate(804 166)">
        <circle cx="0" cy="0" r="88" fill="none" stroke="#60a5fa" strokeWidth="1.6" opacity="0.34" />
      </g>
      <g transform="translate(804 166)">
        <circle cx="0" cy="0" r="88" fill="none" stroke="#93c5fd" strokeWidth="1.6" opacity="0.34" />
      </g>
    </g>
    <g>
      <g transform="translate(904 166)">
        <circle className="id-ripple" cx="0" cy="0" r="88" fill="none" stroke="#3b82f6" strokeWidth="1.6" opacity="0.34" style={{ animationDelay: '-3.68s' }} />
      </g>
      <g transform="translate(904 166)">
        <circle cx="0" cy="0" r="88" fill="none" stroke="#60a5fa" strokeWidth="1.6" opacity="0.34" />
      </g>
      <g transform="translate(904 166)">
        <circle cx="0" cy="0" r="88" fill="none" stroke="#93c5fd" strokeWidth="1.6" opacity="0.34" />
      </g>
    </g>

    {/* kóta dostřiku — končí na těle sousední hlavice */}
    <line x1="704" y1="166" x2="798" y2="166" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M793 161 L800 166 L793 171" fill="none" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="804" cy="166" r="18" fill="none" stroke="#2563eb" strokeWidth="1.6" opacity="0.75" />
    <text className="sv-lbl" x="748" y="150" textAnchor="end">Dostřik</text>
    <text className="sv-val" x="758" y="150" textAnchor="start">5 m</text>

    {/* štítek rovnoměrnosti */}
    <path d="M736 277 L741 283 L750 271" fill="none" stroke="#047857" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <text className="sv-lbl" x="760" y="280" textAnchor="start">Rovnoměrně</text>

    {/* ---------- hlavice ---------- */}
    <g>
      <circle cx="176" cy="166" r="13" fill="none" stroke="#232830" strokeWidth="1.6" opacity="0.5" />
      <circle cx="176" cy="166" r="7" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" />
      <circle cx="176" cy="166" r="2.4" fill="#60a5fa" />
    </g>
    <g>
      <circle cx="376" cy="166" r="13" fill="none" stroke="#232830" strokeWidth="1.6" opacity="0.5" />
      <circle cx="376" cy="166" r="7" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" />
      <circle cx="376" cy="166" r="2.4" fill="#60a5fa" />
    </g>
    <g>
      <circle cx="704" cy="166" r="13" fill="none" stroke="#232830" strokeWidth="1.6" opacity="0.5" />
      <circle cx="704" cy="166" r="7" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" />
      <circle cx="704" cy="166" r="2.4" fill="#60a5fa" />
    </g>
    <g>
      <circle cx="804" cy="166" r="13" fill="none" stroke="#232830" strokeWidth="1.6" opacity="0.5" />
      <circle cx="804" cy="166" r="7" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" />
      <circle cx="804" cy="166" r="2.4" fill="#60a5fa" />
    </g>
    <g>
      <circle cx="904" cy="166" r="13" fill="none" stroke="#232830" strokeWidth="1.6" opacity="0.5" />
      <circle cx="904" cy="166" r="7" fill="#232830" stroke="rgba(255,255,255,.2)" strokeWidth="1.2" />
      <circle cx="904" cy="166" r="2.4" fill="#60a5fa" />
    </g>

    {/* ---------- kóty rozestupu ---------- */}
    <line x1="176" y1="298" x2="176" y2="334" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <line x1="376" y1="298" x2="376" y2="334" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <line x1="704" y1="298" x2="704" y2="334" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <line x1="804" y1="298" x2="804" y2="334" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <line x1="904" y1="298" x2="904" y2="334" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />

    <line x1="176" y1="326" x2="376" y2="326" stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    <path d="M185 321 L176 326 L185 331 M367 321 L376 326 L367 331" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    <text className="sv-val" x="276" y="316" textAnchor="middle">10 m</text>
    <text className="sv-lbl" x="276" y="350" textAnchor="middle">Rozestup</text>

    <line x1="704" y1="326" x2="904" y2="326" stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    <path d="M713 321 L704 326 L713 331 M895 321 L904 326 L895 331" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    <line x1="804" y1="320" x2="804" y2="332" stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    <text className="sv-val" x="754" y="316" textAnchor="middle">5 m</text>
    <text className="sv-val" x="854" y="316" textAnchor="middle">5 m</text>
    <text className="sv-lbl" x="804" y="350" textAnchor="middle">Rozestup</text>
  </svg>
)
