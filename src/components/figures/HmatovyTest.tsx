import React from 'react'

/**
 * Hmatový test půdy (DESIGN.md 9.2) — tři sloupce, jíl · hlína · písek,
 * ve čtyřech řádcích: zrnka pod lupou, kulička, váleček, na co se zaměřit.
 * Kresba nese to, co v původním textu dělala tabulka: „co cítíte v dlani →
 * jaká je to půda → na co se při přípravě zaměřit". Pointa je v řádku
 * s válečkem: jíl se ohne bez prasknutí, hlína při ohnutí praská, písek se
 * uválet vůbec nedá.
 *
 * Portrétová sazba 520 px pro sloupec vedle textu. Všechna id mají prefix
 * `hmt-`. Rozpočet animací: 2 smyčky bez akcentu — jílový váleček se
 * pomalu ohýbá (SMIL rotate kolem levého konce) a z písčité kuličky se
 * sypou tři zrnka (CSS `fall` dle 6.6.3). Klidový stav je v markupu: ohnutý
 * váleček, prasklý váleček, rozpadlá kulička — bez animace zůstává vše čitelné.
 */
export const HmatovyTest: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 500">
    <defs>
      {/* jedna vzorkovnice zrnek pro lupu, tři hustoty */}
      <pattern id="hmt-jil" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.1" fill="#54402c" />
      </pattern>
      <pattern id="hmt-hlina" width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.2" fill="#54402c" />
        <circle cx="9" cy="8" r="2.4" fill="#6b5138" />
        <circle cx="4" cy="9.5" r="1" fill="#54402c" />
      </pattern>
      <clipPath id="hmt-lupa-a"><circle cx="100" cy="106" r="34" /></clipPath>
      <clipPath id="hmt-lupa-b"><circle cx="260" cy="106" r="34" /></clipPath>
      <clipPath id="hmt-lupa-c"><circle cx="420" cy="106" r="34" /></clipPath>
    </defs>

    {/* ── hlavičky sloupců ─────────────────────────────────────── */}
    <text className="sv-lbl" x="100" y="26" textAnchor="middle">Jílovitá</text>
    <text className="sv-lbl" x="260" y="26" textAnchor="middle">Hlinitá</text>
    <text className="sv-lbl" x="420" y="26" textAnchor="middle">Písčitá</text>
    <line x1="30" y1="40" x2="490" y2="40" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />

    {/* ── řádek 1: zrnka pod lupou ─────────────────────────────── */}
    <text className="sv-lbl" x="30" y="62">Zrnka pod lupou</text>

    <g clipPath="url(#hmt-lupa-a)">
      <rect x="66" y="72" width="68" height="68" fill="url(#hmt-jil)" />
    </g>
    <circle cx="100" cy="106" r="34" fill="none" stroke="#232830" strokeWidth="1.6" />

    <g clipPath="url(#hmt-lupa-b)">
      <rect x="226" y="72" width="68" height="68" fill="url(#hmt-hlina)" />
    </g>
    <circle cx="260" cy="106" r="34" fill="none" stroke="#232830" strokeWidth="1.6" />

    {/* písek: pár velkých hranatých zrn, mezi nimi vzduch */}
    <g clipPath="url(#hmt-lupa-c)" fill="#c2a052" stroke="#232830" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M404 86 l9 -4 7 6 -2 9 -9 3 -6 -6 z" />
      <path d="M428 82 l8 1 4 8 -5 6 -9 -1 -3 -8 z" />
      <path d="M396 108 l7 -6 9 3 1 9 -8 4 -8 -4 z" />
      <path d="M420 104 l10 -3 6 7 -3 8 -10 1 -5 -7 z" />
      <path d="M441 112 l7 2 2 8 -6 5 -8 -3 0 -8 z" />
      <path d="M406 128 l8 -3 7 5 -2 8 -9 2 -5 -6 z" />
      <path d="M430 126 l9 1 3 8 -6 5 -9 -2 -1 -8 z" />
    </g>
    <circle cx="420" cy="106" r="34" fill="none" stroke="#232830" strokeWidth="1.6" />

    <text className="sv-lbl" x="100" y="160" textAnchor="middle">nejjemnější</text>
    <text className="sv-lbl" x="260" y="160" textAnchor="middle">směs</text>
    <text className="sv-lbl" x="420" y="160" textAnchor="middle">největší</text>

    {/* ── řádek 2: kulička ─────────────────────────────────────── */}
    <line x1="30" y1="176" x2="490" y2="176" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="198">Kulička</text>

    {/* jíl: hladká, plastická */}
    <circle cx="100" cy="236" r="25" fill="#54402c" opacity="0.92" />

    {/* hlína: drží tvar, ale drobí se — hairline trhlinky */}
    <circle cx="260" cy="236" r="25" fill="#6b5138" opacity="0.9" />
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" fill="none">
      <path d="M248 226 l6 5 -2 6" />
      <path d="M268 244 l5 -4 4 3" />
      <path d="M256 251 l4 -3" />
    </g>
    <g fill="#6b5138" opacity="0.8">
      <circle cx="286" cy="257" r="2" />
      <circle cx="292" cy="250" r="1.5" />
    </g>

    {/* písek: kulička se rozpadá — duch tvaru + zrna, tři z nich se sypou */}
    <circle cx="420" cy="236" r="25" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <g fill="#c2a052" stroke="#232830" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M406 222 l6 -3 5 4 -1 6 -6 2 -4 -4 z" />
      <path d="M420 218 l6 0 3 5 -3 5 -6 0 -3 -5 z" />
      <path d="M432 226 l5 -2 4 4 -2 5 -5 1 -3 -4 z" />
      <path d="M410 238 l5 -3 5 3 0 6 -5 2 -5 -3 z" />
      <path d="M425 240 l6 -1 3 5 -3 4 -6 0 -2 -4 z" />
      <path d="M398 246 l5 -3 5 3 0 5 -5 2 -5 -2 z" />
      <path d="M438 250 l5 -2 4 3 -1 5 -5 2 -3 -4 z" />
      <path d="M413 256 l5 -2 4 3 0 5 -5 2 -4 -3 z" />
    </g>
    <g fill="#c2a052" stroke="#232830" strokeWidth="1.5" strokeLinejoin="round">
      <g className="hmt-zrno" style={{ animationDelay: '0s' }}>
        <path d="M404 262 l4 -2 3 3 -1 4 -4 1 -2 -3 z" />
      </g>
      <g className="hmt-zrno" style={{ animationDelay: '0.9s' }}>
        <path d="M428 264 l4 -2 3 3 -1 4 -4 1 -2 -3 z" />
      </g>
      <g className="hmt-zrno" style={{ animationDelay: '1.7s' }}>
        <path d="M416 266 l4 -2 3 3 -1 4 -4 1 -2 -3 z" />
      </g>
    </g>
    {/* hromádka pod ní — kam se zrna sypou */}
    <path d="M396 286 q24 -10 48 0" fill="none" stroke="#c2a052" strokeWidth="2.2" strokeLinecap="round" />

    {/* ── řádek 3: váleček ─────────────────────────────────────── */}
    <line x1="30" y1="300" x2="490" y2="300" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="322">Váleček</text>

    {/* jíl: ohne se bez prasknutí — celý váleček se pomalu prohýbá kolem levého konce */}
    <g>
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 52 356; -7 52 356; 0 52 356"
        keyTimes="0; 0.5; 1"
        calcMode="spline"
        keySplines=".42 0 .58 1; .42 0 .58 1"
        dur="4.4s"
        repeatCount="indefinite"
      />
      <path d="M52 356 C 84 356, 110 340, 148 332" fill="none" stroke="#54402c" strokeWidth="18" strokeLinecap="round" opacity="0.92" />
    </g>
    <text className="sv-val" x="100" y="394" textAnchor="middle" style={{ fontSize: 20 }}>Ohne se</text>

    {/* hlína: drží, ale při ohnutí praská — zlom uprostřed */}
    <path d="M212 356 C 232 354, 246 347, 256 340" fill="none" stroke="#6b5138" strokeWidth="18" strokeLinecap="round" opacity="0.9" />
    <path d="M266 338 C 278 336, 294 342, 308 350" fill="none" stroke="#6b5138" strokeWidth="18" strokeLinecap="round" opacity="0.9" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7">
      <path d="M261 328 l0 -8" />
      <path d="M257 331 l-4 -6" />
      <path d="M265 331 l4 -6" />
    </g>
    <g fill="#6b5138" opacity="0.8">
      <circle cx="259" cy="370" r="2.2" />
      <circle cx="266" cy="374" r="1.6" />
    </g>
    <text className="sv-val" x="260" y="394" textAnchor="middle" style={{ fontSize: 20 }}>Praská</text>

    {/* písek: uválet nejde — jen duch válečku a rozsypaná zrna */}
    <rect x="372" y="337" width="96" height="18" rx="9" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <g fill="#c2a052" stroke="#232830" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M382 360 l5 -2 4 3 -1 5 -5 2 -3 -4 z" />
      <path d="M398 364 l5 -3 5 3 0 5 -5 2 -5 -2 z" />
      <path d="M414 361 l5 -2 4 4 -2 5 -5 1 -3 -4 z" />
      <path d="M430 365 l5 -2 4 3 -1 5 -5 2 -3 -4 z" />
      <path d="M446 361 l5 -3 5 3 0 5 -5 2 -5 -2 z" />
      <path d="M406 372 l4 -2 3 3 -1 4 -4 1 -2 -3 z" />
      <path d="M438 372 l4 -2 3 3 -1 4 -4 1 -2 -3 z" />
    </g>
    <text className="sv-val" x="420" y="394" textAnchor="middle" style={{ fontSize: 20 }}>Rozpadá se</text>

    {/* ── řádek 4: na co se zaměřit ────────────────────────────── */}
    <line x1="30" y1="410" x2="490" y2="410" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="432">Na co se zaměřit</text>

    <text className="sv-val" x="100" y="456" textAnchor="middle">Zhutnění, odtok</text>
    <text className="sv-val" x="100" y="480" textAnchor="middle">a vzduch</text>

    <text className="sv-val" x="260" y="456" textAnchor="middle">Udržet</text>
    <text className="sv-val" x="260" y="480" textAnchor="middle">strukturu</text>

    <text className="sv-val" x="420" y="456" textAnchor="middle">Zadržet vodu</text>
    <text className="sv-val" x="420" y="480" textAnchor="middle">a živiny</text>
  </svg>
)
