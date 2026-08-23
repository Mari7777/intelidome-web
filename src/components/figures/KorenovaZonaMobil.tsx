import React from 'react'

// Svislá sazba figury „Kořenová zóna" pro telefon — táž figura jako KorenovaZona,
// jen jsou oba řezy pod sebou, aby se do úzkého panelu vešly celé a šly porovnat
// naráz. Nahoře ČASTO A MÁLO (4 l/m² denně → voda 5 cm, kořeny 6 cm), dole
// VYDATNĚ A MÉNĚ ČASTO (12 l/m² každý 3. den → voda 25 cm, kořeny 26 cm).
// Oba řezy jsou stejně hluboké (0–30 cm) a měří týmž metrem (10 cm = 62 px),
// takže jediný rozdíl mezi nimi je, kam došla voda a za ní kořeny — pointa
// zůstává: o kořenech nerozhoduje množství vody, ale kam dojde.
// Pozor: všechna id mají prefix `kzm-`, aby se nesrazila se širokoúhlou variantou,
// která je v DOM současně.
export const KorenovaZonaMobil: React.FC = () => (
  <svg className="block h-auto w-full" viewBox="0 0 520 670">
    <defs>
      <radialGradient id="kzm-voda" cx="0.5" cy="0" r="0.9">
        <stop offset="0" stopColor="#2563eb" stopOpacity="0.34" />
        <stop offset="0.5" stopColor="#2563eb" stopOpacity="0.14" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.05" />
      </radialGradient>
      <radialGradient id="kzm-sucho" cx="0.5" cy="0.38" r="0.55">
        <stop offset="0" stopColor="#c2a052" stopOpacity="0.95" />
        <stop offset="1" stopColor="#c2a052" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* ══ HORNÍ ŘEZ — často a málo ══════════════════════════════════ */}
    <text className="sv-lbl" x="263" y="20" textAnchor="middle">
      Často a málo
    </text>
    <text className="sv-val" x="263" y="43" textAnchor="middle">
      4 l/m² každý den
    </text>

    <rect x="64" y="114" width="398" height="124" fill="#6b5138" opacity="0.9" />
    <rect x="64" y="238" width="398" height="62" fill="#54402c" opacity="0.85" />
    <path d="M64 238H462" stroke="rgba(255,255,255,.13)" strokeWidth="1.6" fill="none" />

    {/* suchý pás — začíná hned pod mělkými kořeny a jde až na dno řezu */}
    <path
      d="M64 164C132 152 196 176 262 163C322 151 400 172 462 159V300H64Z"
      fill="url(#kzm-sucho)"
    />

    {/* promáčené bulvy pod dopadem kapek — široké a mělké, splývají v jeden pás */}
    <g fill="url(#kzm-voda)">
      <path d="M64 114C67 127 88 145 140 145C192 145 213 127 216 114Z" />
      <path d="M187 114C190 127 211 145 263 145C315 145 336 127 339 114Z" />
      <path d="M310 114C313 127 334 145 386 145C438 145 459 127 462 114Z" />
    </g>

    {/* voda nemá kam dál — místo do hloubky se rozteče do stran */}
    <g fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" opacity="0.62">
      <path d="M140 114C137 123 142 132 140 139M140 139C125 142 114 140 104 135M140 139C155 142 166 140 176 135" />
      <path d="M263 114C260 123 265 132 263 139M263 139C248 142 237 140 227 135M263 139C278 142 289 140 299 135" />
      <path d="M386 114C383 123 388 132 386 139M386 139C371 142 360 140 350 135M386 139C401 142 412 140 422 135" />
    </g>

    {/* mělký hustý kořenový mat */}
    <g
      fill="none"
      stroke="#d8c9b4"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.8"
    >
      <path d="M108 114C105 123 102 130 100 140M108 114C111 123 113 131 112 143M108 115C96 121 88 126 78 130M108 115C120 121 128 126 137 131M108 116C102 126 99 138 101 151M109 117C117 128 118 140 117 149" />
      <path d="M186 114C183 123 180 130 178 140M186 114C189 123 191 131 190 143M186 115C174 121 166 126 156 130M186 115C198 121 206 126 215 131M186 116C180 126 177 138 179 149M187 117C195 128 196 140 195 147" />
      <path d="M263 114C260 123 257 130 255 140M263 114C266 123 268 131 267 143M263 115C251 121 243 126 233 130M263 115C275 121 283 126 292 131M263 116C257 126 254 138 256 151M264 117C272 128 273 140 272 149" />
      <path d="M340 114C337 123 334 130 332 140M340 114C343 123 345 131 344 143M340 115C328 121 320 126 310 130M340 115C352 121 360 126 369 131M340 116C334 126 331 138 333 149M341 117C349 128 350 140 349 147" />
      <path d="M418 114C415 123 412 130 410 140M418 114C421 123 423 131 422 143M418 115C406 121 398 126 388 130M418 115C430 121 438 126 447 131M418 116C412 126 409 138 411 151M419 117C427 128 428 140 427 149" />
    </g>

    {/* travní drn */}
    <rect x="64" y="92" width="398" height="22" fill="#3f7d4e" />
    <path d="M64 114H462" stroke="#2e6440" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path
      d="M73 93q-1 -9 -3 -15M87 93q2 -8 6 -14M100 93q0 -9 0 -15M114 93q2 -11 5 -18M128 93q2 -5 6 -9M142 93q-1 -6 -4 -10M155 93q-2 -11 -6 -19M169 93q-2 -7 -6 -12M183 93q1 -5 2 -9M196 93q1 -11 4 -18M210 93q-2 -10 -6 -16M224 93q0 -9 0 -15M237 93q2 -6 5 -10M251 93q1 -5 4 -9M265 93q-2 -6 -6 -10M278 93q-1 -9 -3 -15M292 93q2 -8 6 -14M306 93q0 -9 0 -15M320 93q2 -11 5 -18M333 93q2 -5 6 -9M347 93q-1 -6 -4 -10M361 93q-2 -11 -6 -19M374 93q-2 -7 -6 -12M388 93q1 -5 2 -9M402 93q1 -11 4 -18M415 93q-2 -10 -6 -16M429 93q0 -9 0 -15M443 93q2 -6 5 -10"
      fill="none"
      stroke="#3f7d4e"
      strokeWidth="1.6"
      strokeLinecap="round"
    />

    {/* hloubková osa horního řezu — 10 cm = 62 px, týž metr jako dole */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" fill="none">
      <path d="M50 114H64M50 176H64M50 238H64M50 300H64" />
      <path d="M57 124V166M57 186V228M57 248V290" strokeDasharray="3 7" />
    </g>
    <text className="sv-val" x="44" y="119" textAnchor="end">
      0 cm
    </text>
    <text className="sv-val" x="44" y="181" textAnchor="end">
      10 cm
    </text>
    <text className="sv-val" x="44" y="243" textAnchor="end">
      20 cm
    </text>
    <text className="sv-val" x="44" y="305" textAnchor="end">
      30 cm
    </text>

    {/* hranice promočení + kóta */}
    <path
      d="M64 145H470"
      stroke="#d5d3cc"
      strokeWidth="1.6"
      strokeDasharray="3 7"
      strokeLinecap="round"
      fill="none"
    />
    <text className="sv-lbl" x="474" y="139">
      Voda
    </text>
    <text className="sv-val" x="474" y="160">
      5 cm
    </text>

    {/* kapky — v klidu stojí nad drnem */}
    <g fill="#3b82f6" opacity="0.9">
      <g transform="translate(140 48)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 44"
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
          values="0.9; 0.9; 0"
          keyTimes="0; 0.74; 1"
          calcMode="spline"
          keySplines="0.4 0 1 1; 0.4 0 1 1"
          dur="2.6s"
          begin="0s"
          repeatCount="indefinite"
        />
        <path
          transform="scale(0.85)"
          d="M0 -8C3.8 -3.4 6 -0.6 6 2.2A6 6 0 0 1 -6 2.2C-6 -0.6 -3.8 -3.4 0 -8Z"
        />
      </g>
      <g transform="translate(386 56)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 36"
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
          values="0.9; 0.9; 0"
          keyTimes="0; 0.74; 1"
          calcMode="spline"
          keySplines="0.4 0 1 1; 0.4 0 1 1"
          dur="2.6s"
          begin="1.3s"
          repeatCount="indefinite"
        />
        <path
          transform="scale(0.85)"
          d="M0 -8C3.8 -3.4 6 -0.6 6 2.2A6 6 0 0 1 -6 2.2C-6 -0.6 -3.8 -3.4 0 -8Z"
        />
      </g>
    </g>

    <text className="sv-lbl" x="255" y="322" textAnchor="end">
      Kořeny
    </text>
    <text className="sv-val" x="267" y="322">
      6 cm
    </text>

    {/* ══ DOLNÍ ŘEZ — vydatně a méně často ══════════════════════════ */}
    <text className="sv-lbl" x="263" y="356" textAnchor="middle">
      Vydatně a méně často
    </text>
    <text className="sv-val" x="263" y="379" textAnchor="middle">
      12 l/m² každý 3. den
    </text>

    <rect x="64" y="450" width="398" height="124" fill="#6b5138" opacity="0.9" />
    <rect x="64" y="574" width="398" height="62" fill="#54402c" opacity="0.85" />
    <path d="M64 574H462" stroke="rgba(255,255,255,.13)" strokeWidth="1.6" fill="none" />

    {/* promočené těleso — sahá až ke kótě 25 cm */}
    <path
      d="M64 450H462V580C438 602 410 590 384 601C358 612 332 592 306 603C280 613 254 593 228 603C202 613 176 593 150 604C126 613 92 595 64 598Z"
      fill="url(#kzm-voda)"
    />

    {/* voda protéká pod drn až k 25 cm — kořeny jdou za ní */}
    <g fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" opacity="0.62">
      <path d="M140 450C132 487 146 531 138 575C132 597 144 601 140 606M140 606C130 609 121 607 114 602M140 606C150 609 159 607 166 602" />
      <path d="M263 450C255 487 269 531 261 575C255 597 267 601 263 606M263 606C253 609 244 607 237 602M263 606C273 609 282 607 289 602" />
      <path d="M386 450C378 487 392 531 384 575C378 597 390 601 386 606M386 606C376 609 367 607 360 602M386 606C396 609 405 607 412 602" />
    </g>

    {/* hluboké, rozvětvené kořeny jdou za vodou */}
    <g
      fill="none"
      stroke="#d8c9b4"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.8"
    >
      <path d="M122 450C117 482 114 514 116 543C118 572 123 595 124 611M118 485C106 495 96 502 84 510M123 500C134 510 142 516 151 526M116 526C130 535 142 542 156 551M117 561C106 571 96 579 87 590M122 585C132 592 140 600 148 608" />
      <path d="M216 450C221 482 224 514 222 543C220 572 215 595 214 611M220 485C232 495 242 502 254 510M215 500C204 510 196 516 187 526M222 526C208 535 196 542 182 551M221 561C232 571 242 579 251 590M216 585C206 592 198 600 190 608" />
      <path d="M310 450C305 482 302 514 304 543C306 572 311 595 312 611M306 485C294 495 284 502 272 510M311 500C322 510 330 516 339 526M304 526C318 535 330 542 344 551M305 561C294 571 284 579 275 590M310 585C320 592 328 600 336 608" />
      <path d="M404 450C409 482 412 514 410 543C408 572 403 595 402 611M408 485C420 495 430 502 442 510M403 500C392 510 384 516 375 526M410 526C396 535 384 542 370 551M409 561C420 571 430 579 439 590M404 585C394 592 386 600 378 608" />
    </g>

    {/* travní drn */}
    <rect x="64" y="428" width="398" height="22" fill="#3f7d4e" />
    <path d="M64 450H462" stroke="#2e6440" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path
      d="M73 429q-2 -7 -6 -12M87 429q1 -5 2 -9M100 429q1 -11 4 -18M114 429q-2 -10 -6 -16M128 429q0 -9 0 -15M142 429q2 -6 5 -10M155 429q1 -5 4 -9M169 429q-2 -6 -6 -10M183 429q-1 -9 -3 -15M196 429q2 -8 6 -14M210 429q0 -9 0 -15M224 429q2 -11 5 -18M237 429q2 -5 6 -9M251 429q-1 -6 -4 -10M265 429q-2 -11 -6 -19M278 429q-2 -7 -6 -12M292 429q1 -5 2 -9M306 429q1 -11 4 -18M320 429q-2 -10 -6 -16M333 429q0 -9 0 -15M347 429q2 -6 5 -10M361 429q1 -5 4 -9M374 429q-2 -6 -6 -10M388 429q-1 -9 -3 -15M402 429q2 -8 6 -14M415 429q0 -9 0 -15M429 429q2 -11 5 -18M443 429q2 -5 6 -9"
      fill="none"
      stroke="#3f7d4e"
      strokeWidth="1.6"
      strokeLinecap="round"
    />

    {/* hloubková osa dolního řezu — rozestup rysek je stejný jako nahoře */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" fill="none">
      <path d="M50 450H64M50 512H64M50 574H64M50 636H64" />
      <path d="M57 460V502M57 522V564M57 584V626" strokeDasharray="3 7" />
    </g>
    <text className="sv-val" x="44" y="455" textAnchor="end">
      0 cm
    </text>
    <text className="sv-val" x="44" y="517" textAnchor="end">
      10 cm
    </text>
    <text className="sv-val" x="44" y="579" textAnchor="end">
      20 cm
    </text>
    <text className="sv-val" x="44" y="641" textAnchor="end">
      30 cm
    </text>

    {/* hranice promočení + kóta */}
    <path
      d="M64 605H470"
      stroke="#d5d3cc"
      strokeWidth="1.6"
      strokeDasharray="3 7"
      strokeLinecap="round"
      fill="none"
    />
    <text className="sv-lbl" x="474" y="599">
      Voda
    </text>
    <text className="sv-val" x="474" y="620">
      25 cm
    </text>

    {/* kapky — větší dávka, delší perioda */}
    <g fill="#3b82f6" opacity="0.9">
      <g transform="translate(140 384)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 44"
          keyTimes="0; 1"
          calcMode="spline"
          keySplines="0.4 0 1 1"
          dur="3.2s"
          begin="0.4s"
          repeatCount="indefinite"
          additive="sum"
        />
        <animate
          attributeName="opacity"
          values="0.9; 0.9; 0"
          keyTimes="0; 0.74; 1"
          calcMode="spline"
          keySplines="0.4 0 1 1; 0.4 0 1 1"
          dur="3.2s"
          begin="0.4s"
          repeatCount="indefinite"
        />
        <path
          transform="scale(1.3)"
          d="M0 -8C3.8 -3.4 6 -0.6 6 2.2A6 6 0 0 1 -6 2.2C-6 -0.6 -3.8 -3.4 0 -8Z"
        />
      </g>
      <g transform="translate(386 392)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 36"
          keyTimes="0; 1"
          calcMode="spline"
          keySplines="0.4 0 1 1"
          dur="3.2s"
          begin="1.8s"
          repeatCount="indefinite"
          additive="sum"
        />
        <animate
          attributeName="opacity"
          values="0.9; 0.9; 0"
          keyTimes="0; 0.74; 1"
          calcMode="spline"
          keySplines="0.4 0 1 1; 0.4 0 1 1"
          dur="3.2s"
          begin="1.8s"
          repeatCount="indefinite"
        />
        <path
          transform="scale(1.3)"
          d="M0 -8C3.8 -3.4 6 -0.6 6 2.2A6 6 0 0 1 -6 2.2C-6 -0.6 -3.8 -3.4 0 -8Z"
        />
      </g>
    </g>

    <text className="sv-lbl" x="255" y="658" textAnchor="end">
      Kořeny
    </text>
    <text className="sv-val" x="267" y="658">
      26 cm
    </text>
  </svg>
)
