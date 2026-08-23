import React from 'react'

// Svislá sazba figury „Síť mostu" pro sloupec ~652 px (DESIGN.md 9.2).
// Táž kresba jako SitMostu.tsx, jen přeskládaná do portrétu: most zůstává
// uprostřed, dva uzly jdou nad něj (čidlo vlhkosti, ventil) a dva pod něj
// (retenční nádrž, osvětlení). Strany si drží pořadí ze širokoúhlé varianty,
// aby se obě četly stejně: čidlo a nádrž vlevo, ventil a osvětlení vpravo.
// Značky, barvy, popisky i jediný aktivní spoj („Právě teče voda") jsou
// převzaté doslova; přibyly jen detaily v ikonách (hrabání půdy u čidla,
// hladina a výpust u nádrže, příruby u ventilu) a konektorové tečky na
// koncích spojů — v užším sloupci je kresba hustší a unese je.
// Pointa zůstává: nejsou to čtyři samostatné krabičky, ale jedna síť
// s jedním mozkem.
//
// Uzly sedí blíž u mostu než v širokoúhlé variantě (140 × 165 px místo
// 270 × 89), takže okruh je kratší a kresba hustší — cíl 9.2 pro sloupcovou
// sazbu. Okruh prochází přesně středy uzlů: 140²/198² + 165²/233² = 1.
//
// Kolize id se širokoúhlou variantou (obě jsou v DOM zároveň) je vyloučená
// tím nejtvrdším způsobem: tahle figura nemá jediné id — nepotřebuje
// gradienty ani masky. Rezervovaný prefix pro případné doplnění je `smp-`.
//
// Rozpočet animací: 5 SMIL uzlů (pochod vody po aktivním spoji + dvě kapky
// pod ventilem). Halo dosahu mostu se zvětšuje kolem vlastního středu,
// takže smí jet na CSS třídě `id-ripple` (DESIGN.md 6.6.1) a rozpočet
// nečerpá. Klidový stav drží markup: voda stojí na spoji, obě kapky visí
// pod ventilem, halo je vidět jako přerušovaná kružnice kolem mostu.
export const SitMostuPortret: React.FC = () => (
  <svg className="block h-auto w-full" viewBox="0 0 520 552">
    {/* jeden okruh — všechna zařízení visí na téže síti */}
    <ellipse
      cx="260"
      cy="273"
      rx="198"
      ry="233"
      fill="none"
      stroke="rgba(255,255,255,.12)"
      strokeWidth="1.6"
      strokeDasharray="3 7"
    />

    {/* dosah mostu — kružnice roste kolem vlastního středu (CSS, ne SMIL) */}
    <circle
      className="id-ripple"
      cx="260"
      cy="273"
      r="94"
      fill="none"
      stroke="rgba(255,255,255,.1)"
      strokeWidth="1.6"
      strokeDasharray="3 7"
    />

    {/* neaktivní spoje */}
    <g
      fill="none"
      stroke="rgba(255,255,255,.14)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeDasharray="3 7"
    >
      <path d="M223.5 230 L148.5 141.6" />
      <path d="M223.5 316 L148.5 404.4" />
      <path d="M296.5 316 L371.5 404.4" />
    </g>

    {/* konektorové tečky na koncích neaktivních spojů */}
    <g fill="#0b0d10" stroke="rgba(255,255,255,.28)" strokeWidth="1.6">
      <circle cx="223.5" cy="230" r="3" />
      <circle cx="148.5" cy="141.6" r="3" />
      <circle cx="223.5" cy="316" r="3" />
      <circle cx="148.5" cy="404.4" r="3" />
      <circle cx="296.5" cy="316" r="3" />
      <circle cx="371.5" cy="404.4" r="3" />
    </g>

    {/* aktivní spoj most → ventil */}
    <path d="M296.5 230 L371.5 141.6" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M296.5 230 L371.5 141.6"
      fill="none"
      stroke="#93c5fd"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="10 8"
      strokeDashoffset="18"
    >
      <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.1s" repeatCount="indefinite" />
    </path>
    <circle cx="296.5" cy="230" r="3" fill="#0b0d10" stroke="#2563eb" strokeWidth="1.6" />
    <path
      d="M-8 -6 L0 0 L-8 6"
      fill="none"
      stroke="#2563eb"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(369.9 143.5) rotate(-49.7)"
    />
    <text className="sv-lbl sv-lbl--aktivni" x="322" y="170" textAnchor="end">
      Právě teče voda
    </text>

    {/* MOST — schematická značka */}
    <g>
      <path d="M247.9 223 A14 14 0 0 1 272.1 223" fill="none" stroke="rgba(255,255,255,.34)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M241 219 A22 22 0 0 1 279 219" fill="none" stroke="rgba(255,255,255,.24)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M234 215 A30 30 0 0 1 286 215" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="190" y="230" width="140" height="86" rx="14" fill="#12161b" stroke="rgba(255,255,255,.22)" strokeWidth="1.6" />
      <rect x="248" y="261" width="24" height="24" rx="6" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1.6" />
      <g stroke="rgba(255,255,255,.28)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M244 273 L222 273" />
        <path d="M276 273 L298 273" />
        <path d="M260 257 L260 243" />
        <path d="M260 289 L260 303" />
      </g>
      <circle cx="207" cy="244" r="2.6" fill="rgba(255,255,255,.5)" />
      <circle cx="217" cy="244" r="2.6" fill="rgba(255,255,255,.24)" />
      <text className="sv-lbl" x="260" y="347" textAnchor="middle">Most</text>
    </g>

    {/* ČIDLO VLHKOSTI — vlevo nahoře */}
    <g>
      <circle cx="120" cy="108" r="44" fill="#12161b" stroke="rgba(255,255,255,.2)" strokeWidth="1.6" />
      <g transform="translate(120 108)" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-10" y="-22" width="20" height="19" rx="4" />
        <path d="M-5 -3 L-5 17" />
        <path d="M5 -3 L5 17" />
        <path d="M0 -22 L0 -30" />
      </g>
      <path d="M96 114 L144 114" stroke="rgba(255,255,255,.14)" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
      <g stroke="rgba(255,255,255,.14)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M98 122 L108 122" />
        <path d="M132 122 L142 122" />
        <path d="M104 129 L112 129" />
        <path d="M128 129 L136 129" />
      </g>
      <text className="sv-lbl" x="120" y="46" textAnchor="middle">Čidlo vlhkosti</text>
    </g>

    {/* VENTIL — vpravo nahoře, aktivní uzel */}
    <g>
      <circle cx="400" cy="108" r="54" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeDasharray="3 7" opacity="0.5" />
      <circle cx="400" cy="108" r="44" fill="#12161b" stroke="#2563eb" strokeWidth="2" />
      <g transform="translate(400 94)" fill="none" stroke="#93c5fd" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-15 -10 L15 8 L15 -10 L-15 8 Z" />
        <path d="M0 -1 L0 -17" />
        <path d="M-10 -18 L10 -18" />
        <path d="M-15 -13 L-15 11" />
        <path d="M15 -13 L15 11" />
      </g>
      {/* kapka na odtoku — v klidu visí pod ventilem */}
      <g transform="translate(400 94)" opacity="0.85">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 13"
          keyTimes="0; 1"
          calcMode="spline"
          keySplines="0.4 0 1 1"
          dur="2.6s"
          begin="0s"
          repeatCount="indefinite"
          additive="sum"
        />
        <animate
          attributeName="opacity"
          values="0.85; 0.85; 0"
          keyTimes="0; 0.72; 1"
          calcMode="spline"
          keySplines="0.4 0 1 1; 0.4 0 1 1"
          dur="2.6s"
          begin="0s"
          repeatCount="indefinite"
        />
        <path
          d="M0 18 C 6 26 9 30 9 34 A 9 9 0 0 1 -9 34 C -9 30 -6 26 0 18 Z"
          fill="none"
          stroke="#2563eb"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </g>
      {/* druhá kapka — o půl periody napřed, menší a níž */}
      <g transform="translate(400 106)" opacity="0.45">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 12"
          keyTimes="0; 1"
          calcMode="spline"
          keySplines="0.4 0 1 1"
          dur="2.6s"
          begin="1.3s"
          repeatCount="indefinite"
          additive="sum"
        />
        <animate
          attributeName="opacity"
          values="0.45; 0.45; 0"
          keyTimes="0; 0.72; 1"
          calcMode="spline"
          keySplines="0.4 0 1 1; 0.4 0 1 1"
          dur="2.6s"
          begin="1.3s"
          repeatCount="indefinite"
        />
        <path
          transform="scale(0.72)"
          d="M0 18 C 6 26 9 30 9 34 A 9 9 0 0 1 -9 34 C -9 30 -6 26 0 18 Z"
          fill="none"
          stroke="#2563eb"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </g>
      <text className="sv-lbl" x="400" y="46" textAnchor="middle">Ventil</text>
    </g>

    {/* RETENČNÍ NÁDRŽ — vlevo dole */}
    <g>
      <circle cx="120" cy="438" r="44" fill="#12161b" stroke="rgba(255,255,255,.2)" strokeWidth="1.6" />
      <g transform="translate(120 436)" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-17 -14 L-17 8 Q-17 18 -7 18 L7 18 Q17 18 17 8 L17 -14" />
        <path d="M-19 -14 L19 -14" />
        <path d="M0 -14 L0 -22" />
        <path d="M17 10 L27 10" />
      </g>
      <path d="M105 440 L135 440" stroke="rgba(255,255,255,.14)" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
      <path d="M108 448 L132 448" stroke="rgba(255,255,255,.14)" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
      <text className="sv-lbl" x="120" y="510" textAnchor="middle">Retenční nádrž</text>
    </g>

    {/* OSVĚTLENÍ — vpravo dole */}
    <g>
      <circle cx="400" cy="438" r="44" fill="#12161b" stroke="rgba(255,255,255,.2)" strokeWidth="1.6" />
      <g transform="translate(400 436)" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M-16 2 A16 16 0 0 1 16 2" />
        <path d="M-18 2 L18 2" />
        <path d="M0 -14 L0 -22" />
        <path d="M-7 2 A7 7 0 0 1 7 2" />
        <path d="M-9 9 L-12 17" />
        <path d="M0 9 L0 19" />
        <path d="M9 9 L12 17" />
      </g>
      <g stroke="rgba(255,255,255,.28)" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M382 443 L376 450" />
        <path d="M418 443 L424 450" />
      </g>
      <text className="sv-lbl" x="400" y="510" textAnchor="middle">Osvětlení</text>
    </g>
  </svg>
)
