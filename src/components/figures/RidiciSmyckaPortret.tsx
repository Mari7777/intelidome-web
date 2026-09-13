import React from 'react'

// Svislá sazba figury „Řídicí smyčka" do úzkého sloupce (DESIGN.md 9.2).
// Tvarosloví, barvy, značky i čísla přebírá doslova z RidiciSmycka.tsx — mění se
// jen sazba. Smyčka zůstává smyčkou: čidlo v půdě (38 %) měří → čára stoupá vzhůru
// k prahu (cíl 45 %) → při ANO doprava k mostu → dolů k ventilu → voda dolů do půdy
// → a vlhkost se půdou vrací doleva zpátky k čidlu, takže rozhodnutí končí tam, kde
// začalo. Vlevo od prahu visí nečinná větev NE („Nic se neděje"), nahoře zdroje:
// retenční nádrž (aktivní, modrá stoupačka) a vodovodní řad (záloha, šedý čárkovaný,
// napojený do téže stoupačky).
//
// Všechna id nesou prefix `rsp-`, protože širokoúhlá varianta (`rs-`) je ve stránce
// zároveň — shodné id by rozbilo odkaz na gradient v obou.
//
// Rozpočet animací: 5 SMIL uzlů. Pochodující čára je slepená do jediného path
// se čtyřmi podcestami (dash se restartuje na každé podcestě), takže celá aktivní
// smyčka pochoduje z jednoho uzlu; druhý uzel vede přívod od nádrže, třetí návrat
// v půdě. Posun je 18 = přesně jedna perioda dasharray „10 8", jinak by smyčka cukla.
// Klidový stav (po odebrání SMIL uzlů při prefers-reduced-motion) je v markupu:
// všechny trasy stojí jako čárkované čáry, vlna u hrotu sondy stojí na r 7 / opacity .45.
export const RidiciSmyckaPortret: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 600">
    <defs>
      <radialGradient id="rsp-voda" cx="50%" cy="34%" r="66%">
        <stop offset="0" stopColor="#2563eb" stopOpacity="0.34" />
        <stop offset="0.55" stopColor="#2563eb" stopOpacity="0.14" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.05" />
      </radialGradient>
    </defs>

    {/* ── půda ───────────────────────────────────────────────── */}
    <rect x="0" y="496" width="520" height="12" fill="#3f7d4e" />
    <rect x="0" y="508" width="520" height="64" fill="#6b5138" opacity="0.9" />
    <rect x="0" y="572" width="520" height="28" fill="#54402c" opacity="0.85" />
    <path d="M0 508H520" stroke="#2e6440" strokeWidth="1.6" />
    <path
      d="M0 572H520"
      stroke="rgba(255,255,255,.13)"
      strokeWidth="1.5"
      strokeDasharray="3 7"
    />

    {/* stébla trávy — mezera 176–330 patří popisce návratové větve */}
    <g stroke="#3f7d4e" strokeWidth="2" strokeLinecap="round">
      <path d="M20 496v-9" />
      <path d="M44 496v-11" />
      <path d="M66 496v-8" />
      <path d="M152 496v-10" />
      <path d="M176 496v-8" />
      <path d="M330 496v-11" />
      <path d="M352 496v-8" />
      <path d="M366 496v-10" />
      <path d="M412 496v-11" />
      <path d="M436 496v-8" />
      <path d="M460 496v-10" />
      <path d="M484 496v-9" />
      <path d="M506 496v-11" />
    </g>

    {/* vsáklá voda v kořenové zóně pod ventilem */}
    <ellipse cx="380" cy="540" rx="132" ry="32" fill="url(#rsp-voda)" />

    {/* kořeny */}
    <g
      stroke="#d8c9b4"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.8"
      fill="none"
    >
      <path d="M36 508v26m0-12 14 12m-14-2-13 14" />
      <path d="M60 508v20m0-8 11 10" />
      <path d="M170 508v34m0-16 16 14m-16-2-14 16" />
      <path d="M222 508v24m0-10 13 12" />
      <path d="M268 508v30m0-14 15 13m-15-1-13 15" />
      <path d="M320 508v26m0-12 14 12" />
      <path d="M380 508v44m0-24 20 18m-20-4-18 18" />
      <path d="M428 508v32m0-14 15 13m-15-1-13 15" />
      <path d="M470 508v26m0-12 14 12" />
      <path d="M500 508v22m0-10 12 11" />
    </g>

    {/* ── čidlo vlhkosti ─────────────────────────────────────── */}
    <g>
      <path d="M100 468v92M124 468v92" stroke="#232830" strokeWidth="3.4" strokeLinecap="round" />
      <rect
        x="80"
        y="426"
        width="64"
        height="42"
        rx="9"
        fill="#232830"
        stroke="rgba(255,255,255,.2)"
        strokeWidth="1.6"
      />
      <path
        d="M94 456h36"
        stroke="rgba(255,255,255,.22)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="112" cy="440" r="3.6" fill="#2563eb" />
      {/* měření: vlna u hrotu sondy */}
      <circle cx="112" cy="560" r="7" fill="none" stroke="#60a5fa" strokeWidth="1.8" opacity="0.45">
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
        <animate
          attributeName="opacity"
          values="0.45;0"
          calcMode="spline"
          keySplines=".16 .6 .4 1"
          dur="4.6s"
          repeatCount="indefinite"
        />
      </circle>
    </g>

    {/* ── práh (rozhodovací uzel) ────────────────────────────── */}
    <path
      d="M112 266 156 310 112 354 68 310Z"
      fill="none"
      stroke="#2563eb"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* ── most ───────────────────────────────────────────────── */}
    <g>
      <rect
        x="330"
        y="284"
        width="120"
        height="52"
        rx="11"
        fill="#232830"
        stroke="rgba(255,255,255,.2)"
        strokeWidth="1.6"
      />
      <g stroke="rgba(255,255,255,.22)" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M374 320a14 14 0 0 1 0-20" />
        <path d="M364 326a24 24 0 0 1 0-32" />
        <path d="M406 300a14 14 0 0 1 0 20" />
        <path d="M416 294a24 24 0 0 1 0 32" />
      </g>
      <circle cx="390" cy="310" r="4" fill="#2563eb" />
    </g>

    {/* ── ventil ─────────────────────────────────────────────── */}
    <g>
      <rect
        x="342"
        y="388"
        width="96"
        height="60"
        rx="11"
        fill="#232830"
        stroke="rgba(255,255,255,.2)"
        strokeWidth="1.6"
      />
      <path
        d="M374 412 374 436 406 412 406 436Z"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M390 424v-22M378 402h24"
        stroke="rgba(255,255,255,.22)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>

    {/* ── retenční nádrž ─────────────────────────────────────── */}
    <g>
      <rect
        x="44"
        y="52"
        width="116"
        height="88"
        rx="7"
        fill="none"
        stroke="#232830"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M46 94h112v44a2 2 0 0 1-2 2H48a2 2 0 0 1-2-2Z" fill="#3b82f6" opacity="0.28" />
      <path
        d="M46 94c14-7 24 7 38 0s24 7 37 0 23 5 37 0"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </g>

    {/* ── vodovodní řad: záloha, konstrukční čára ────────────── */}
    <g stroke="#d5d3cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M214 182H482" strokeDasharray="3 7" />
      <path d="M214 168v28" />
      <path d="M307 168 307 196 337 168 337 196Z" />
      <path d="M322 182v-16M312 166h20" />
    </g>

    {/* ── nečinná větev: NE ──────────────────────────────────── */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" fill="none" strokeDasharray="3 7">
      <path d="M112 264V238" />
      <rect x="24" y="190" width="176" height="46" rx="11" />
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
      {/* čidlo → práh → most → ventil → půda: jedna cesta, čtyři podcesty */}
      <path d="M112 424V360M158 310H328M390 338V384M390 450V524">
        <animate
          attributeName="stroke-dashoffset"
          from="18"
          to="0"
          dur="1.1s"
          repeatCount="indefinite"
        />
      </path>
      {/* přívod: nádrž je přednostní zdroj, řad se do stoupačky jen napojuje */}
      <path d="M162 118H468Q482 118 482 132V404Q482 418 468 418H446">
        <animate
          attributeName="stroke-dashoffset"
          from="18"
          to="0"
          dur="1.1s"
          repeatCount="indefinite"
        />
      </path>
    </g>

    {/* návrat: vlhkost se vrací k čidlu (v půdě, vodní tint) */}
    <path
      d="M352 546C296 566 190 564 138 546"
      fill="none"
      stroke="#60a5fa"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeDasharray="10 8"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="18"
        to="0"
        dur="1.1s"
        repeatCount="indefinite"
      />
    </path>

    {/* odkazová čárka k návratové větvi */}
    <path
      d="M250 496V558"
      stroke="#d5d3cc"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="3 7"
      fill="none"
    />

    {/* šipky směru */}
    <g fill="#2563eb">
      <path d="M105 374 119 374 112 360Z" />
      <path d="M322 303 336 310 322 317Z" />
      <path d="M383 376 397 376 390 390Z" />
      <path d="M446 411 446 425 432 418Z" />
    </g>
    <path d="M146 536 146 552 132 544Z" fill="#60a5fa" />

    {/* ── popisky ────────────────────────────────────────────── */}
    <text className="sv-lbl" x="102" y="40" textAnchor="middle">
      Retenční nádrž
    </text>
    <text className="sv-lbl" x="102" y="160" textAnchor="middle">
      Nejdřív dešťová
    </text>
    <text className="sv-lbl" x="352" y="222" textAnchor="middle">
      Vodovodní řad
    </text>
    <text className="sv-lbl" x="352" y="240" textAnchor="middle">
      Až po vyčerpání
    </text>
    <text className="sv-lbl" x="112" y="218" textAnchor="middle">
      Nic se neděje
    </text>
    <text className="sv-lbl" x="122" y="260">
      Ne
    </text>
    <text className="sv-lbl" x="60" y="306" textAnchor="end">
      Práh
    </text>
    <text className="sv-val" x="112" y="316" textAnchor="middle">
      cíl 45 %
    </text>
    <text className="sv-lbl" x="243" y="296" textAnchor="middle">
      Ano
    </text>
    <text className="sv-lbl" x="390" y="276" textAnchor="middle">
      Most
    </text>
    <text className="sv-lbl" x="334" y="422" textAnchor="end">
      Ventil
    </text>
    <text className="sv-val" x="124" y="402">
      38 %
    </text>
    <text className="sv-lbl" x="154" y="450">
      Čidlo vlhkosti
    </text>
    <text className="sv-lbl" x="250" y="488" textAnchor="middle">
      Vlhkost stoupá
    </text>
  </svg>
)
