import React from 'react'

// Síťový diagram na obsidianu: most uprostřed, kolem něj ventil, čidlo vlhkosti,
// retenční nádrž a osvětlení na jednom kruhu. Spoje jsou stejné konstrukční
// dashline, jen jeden je právě aktivní — po něm pochoduje voda k ventilu.
// Pointa: nejsou to čtyři samostatné krabičky, ale jedna síť s jedním mozkem.
export const SitMostu: React.FC = () => (
  <svg className="block h-auto w-full" viewBox="0 0 1080 400">
    {/* jeden okruh — všechna zařízení visí na téže síti */}
    <ellipse cx="540" cy="196" rx="380" ry="126" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1.6" strokeDasharray="3 7" />

    {/* neaktivní spoje */}
    <g fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 7">
      <path d="M470 172.9 L322.3 124" />
      <path d="M470 219.1 L322.3 268" />
      <path d="M610 219.1 L757.7 268" />
    </g>

    {/* aktivní spoj most → ventil */}
    <path d="M610 172.9 L757.7 124" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
    <path d="M610 172.9 L757.7 124" fill="none" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="10 8" strokeDashoffset="28">
      <animate attributeName="stroke-dashoffset" from="28" to="0" dur="1.1s" repeatCount="indefinite" />
    </path>
    <path d="M-8 -6 L0 0 L-8 6" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(755 125.2) rotate(-18.3)" />
    <text className="sv-lbl sv-lbl--aktivni" x="700" y="180" textAnchor="middle">Právě teče voda</text>

    {/* MOST — schematická značka */}
    <g>
      <path d="M527.9 146 A14 14 0 0 1 552.1 146" fill="none" stroke="rgba(255,255,255,.34)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M521 142 A22 22 0 0 1 559 142" fill="none" stroke="rgba(255,255,255,.24)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M514 138 A30 30 0 0 1 566 138" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="470" y="153" width="140" height="86" rx="14" fill="#12161b" stroke="rgba(255,255,255,.22)" strokeWidth="1.6" />
      <rect x="528" y="184" width="24" height="24" rx="6" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.6" />
      <g stroke="rgba(255,255,255,.28)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M524 196 L502 196" />
        <path d="M556 196 L578 196" />
        <path d="M540 180 L540 166" />
        <path d="M540 212 L540 226" />
      </g>
      <circle cx="487" cy="167" r="2.6" fill="rgba(255,255,255,.5)" />
      <circle cx="497" cy="167" r="2.6" fill="rgba(255,255,255,.24)" />
      <text className="sv-lbl" x="540" y="270" textAnchor="middle">Most</text>
    </g>

    {/* ČIDLO VLHKOSTI — vlevo nahoře */}
    <g>
      <circle cx="271" cy="107" r="48" fill="#12161b" stroke="rgba(255,255,255,.2)" strokeWidth="1.6" />
      <g transform="translate(271 107)" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-10" y="-22" width="20" height="19" rx="4" />
        <path d="M-5 -3 L-5 17" />
        <path d="M5 -3 L5 17" />
      </g>
      <path d="M247 113 L295 113" stroke="rgba(255,255,255,.14)" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
      <text className="sv-lbl" x="271" y="46" textAnchor="middle">Čidlo vlhkosti</text>
    </g>

    {/* VENTIL — vpravo nahoře, aktivní uzel */}
    <g>
      <circle cx="809" cy="107" r="48" fill="#12161b" stroke="#2563eb" strokeWidth="2" />
      <g transform="translate(809 103)" fill="none" stroke="#93c5fd" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-15 -10 L15 8 L15 -10 L-15 8 Z" />
        <path d="M0 -1 L0 -17" />
        <path d="M-10 -18 L10 -18" />
      </g>
      <path d="M809 121 C 815 129 818 133 818 137 A 9 9 0 0 1 800 137 C 800 133 803 129 809 121 Z" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinejoin="round" />
      <text className="sv-lbl" x="809" y="46" textAnchor="middle">Ventil</text>
    </g>

    {/* RETENČNÍ NÁDRŽ — vlevo dole */}
    <g>
      <circle cx="271" cy="285" r="48" fill="#12161b" stroke="rgba(255,255,255,.2)" strokeWidth="1.6" />
      <g transform="translate(271 283)" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-17 -14 L-17 8 Q-17 18 -7 18 L7 18 Q17 18 17 8 L17 -14" />
        <path d="M-19 -14 L19 -14" />
        <path d="M0 -14 L0 -22" />
      </g>
      <path d="M256 287 L286 287" stroke="rgba(255,255,255,.14)" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
      <text className="sv-lbl" x="271" y="357" textAnchor="middle">Retenční nádrž</text>
    </g>

    {/* OSVĚTLENÍ — vpravo dole */}
    <g>
      <circle cx="809" cy="285" r="48" fill="#12161b" stroke="rgba(255,255,255,.2)" strokeWidth="1.6" />
      <g transform="translate(809 283)" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-16 2 A16 16 0 0 1 16 2" />
        <path d="M-18 2 L18 2" />
        <path d="M0 -14 L0 -22" />
        <path d="M-9 9 L-12 17" />
        <path d="M0 9 L0 19" />
        <path d="M9 9 L12 17" />
      </g>
      <text className="sv-lbl" x="809" y="357" textAnchor="middle">Osvětlení</text>
    </g>
  </svg>
)
