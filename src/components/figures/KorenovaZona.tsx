import React from 'react'

// Řez půdou ve dvou sloupcích: oba dostanou za tři dny stejných 12 l/m².
// Vlevo se dávka rozdrobí na denní kapky — voda promočí jen 5 cm, kořeny zůstanou
// v tom pásu a pod nimi leží suché podloží. Vpravo jedna vydatná dávka protáhne
// vodu do 25 cm a kořeny jdou za ní až k 26 cm. Osa uprostřed měří obě hloubky
// týmž metrem; pointa je, že o kořenech nerozhoduje množství vody, ale kam dojde.
export const KorenovaZona: React.FC = () => (
  <svg className="block h-auto w-full" viewBox="0 0 1080 418">
    <defs>
      <radialGradient id="kz-voda" cx="0.5" cy="0" r="0.9">
        <stop offset="0" stopColor="#2563eb" stopOpacity="0.34" />
        <stop offset="0.5" stopColor="#2563eb" stopOpacity="0.14" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0.05" />
      </radialGradient>
      <radialGradient id="kz-sucho" cx="0.5" cy="0.38" r="0.55">
        <stop offset="0" stopColor="#c2a052" stopOpacity="0.95" />
        <stop offset="1" stopColor="#c2a052" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* ── LEVÝ SLOUPEC — často a málo ─────────────────────────────── */}
    <text className="sv-lbl" x="287" y="26" textAnchor="middle">
      Často a málo
    </text>
    <text className="sv-val" x="287" y="50" textAnchor="middle">
      4 l/m² každý den
    </text>

    <rect x="78" y="138" width="418" height="165" fill="#6b5138" opacity="0.9" />
    <rect x="78" y="303" width="418" height="83" fill="#54402c" opacity="0.85" />
    <path d="M78 303H496" stroke="rgba(255,255,255,.13)" strokeWidth="1.6" fill="none" />

    {/* suchý pás — začíná hned pod kořeny a jde až na dno řezu */}
    <path
      d="M78 214C150 200 226 226 300 212C368 199 440 220 496 206V386H78Z"
      fill="url(#kz-sucho)"
    />

    {/* promáčené bulvy pod dopadem kapek — široké a mělké */}
    <g fill="url(#kz-voda)">
      <path d="M80 138C83 158 112 180 170 180C228 180 257 158 260 138Z" />
      <path d="M197 138C200 158 229 180 287 180C345 180 374 158 377 138Z" />
      <path d="M314 138C317 158 346 180 404 180C462 180 491 158 494 138Z" />
    </g>

    {/* voda nemá kam dál — místo do hloubky se rozteče do stran */}
    <g fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" opacity="0.62">
      <path d="M170 138C167 152 172 164 170 175M170 175C155 178 144 176 134 171M170 175C185 178 196 176 206 171" />
      <path d="M287 138C284 152 289 164 287 175M287 175C272 178 261 176 251 171M287 175C302 178 313 176 323 171" />
      <path d="M404 138C401 152 406 164 404 175M404 175C389 178 378 176 368 171M404 175C419 178 430 176 440 171" />
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
      <path d="M128 138C125 150 122 158 120 170M128 138C131 150 133 160 132 174M128 139C116 145 108 150 98 156M128 139C140 145 148 150 157 157M128 140C122 152 119 166 121 184M129 141C137 154 138 168 137 181" />
      <path d="M200 138C197 150 194 158 192 170M200 138C203 150 205 160 204 174M200 139C188 145 180 150 170 156M200 139C212 145 220 150 229 157M200 140C194 152 191 166 193 184M201 141C209 154 210 168 209 181" />
      <path d="M272 138C269 150 266 158 264 170M272 138C275 150 277 160 276 174M272 139C260 145 252 150 242 156M272 139C284 145 292 150 301 157M272 140C266 152 263 166 265 184M273 141C281 154 282 168 281 181" />
      <path d="M344 138C341 150 338 158 336 170M344 138C347 150 349 160 348 174M344 139C332 145 324 150 314 156M344 139C356 145 364 150 373 157M344 140C338 152 335 166 337 184M345 141C353 154 354 168 353 181" />
      <path d="M416 138C413 150 410 158 408 170M416 138C419 150 421 160 420 174M416 139C404 145 396 150 386 156M416 139C428 145 436 150 445 157M416 140C410 152 407 166 409 184M417 141C425 154 426 168 425 181" />
    </g>

    {/* travní drn */}
    <rect x="78" y="116" width="418" height="22" fill="#3f7d4e" />
    <path d="M78 138H496" stroke="#2e6440" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path
      d="M87 117q-1 -9 -3 -15M101 117q2 -8 6 -14M114 117q0 -9 0 -15M128 117q2 -11 5 -18M141 117q2 -5 6 -9M155 117q-1 -6 -4 -10M168 117q-2 -11 -6 -19M182 117q-2 -7 -6 -12M195 117q1 -5 2 -9M209 117q1 -11 4 -18M222 117q-2 -10 -6 -16M236 117q0 -9 0 -15M249 117q2 -6 5 -10M263 117q1 -5 4 -9M276 117q-2 -6 -6 -10M290 117q1 -10 3 -16M303 117q1 -10 4 -17M317 117q1 -10 3 -17M330 117q-1 -5 -2 -8M344 117q1 -6 2 -10M357 117q-1 -7 -3 -12M371 117q-1 -10 -2 -17M384 117q0 -11 1 -18M398 117q0 -6 0 -10M411 117q0 -8 -1 -14M425 117q1 -7 4 -11M438 117q-1 -9 -2 -15M452 117q0 -10 1 -16M465 117q0 -7 1 -12M479 117q-2 -7 -5 -11"
      fill="none"
      stroke="#3f7d4e"
      strokeWidth="1.6"
      strokeLinecap="round"
    />

    {/* hranice promočení + kóta */}
    <path
      d="M70 179H496"
      stroke="#d5d3cc"
      strokeWidth="1.6"
      strokeDasharray="3 7"
      strokeLinecap="round"
      fill="none"
    />
    <text className="sv-lbl" x="62" y="172" textAnchor="end">
      Voda
    </text>
    <text className="sv-val" x="62" y="192" textAnchor="end">
      5 cm
    </text>

    {/* kapky — v klidu stojí nad drnem */}
    <g fill="#3b82f6" opacity="0.9">
      <g transform="translate(170 66)">
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 46"
            keyTimes="0; 1"
            dur="2.6s"
            begin="0s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.9; 0.9; 0"
            keyTimes="0; 0.74; 1"
            dur="2.6s"
            begin="0s"
            repeatCount="indefinite"
          />
          <path
            transform="scale(0.85)"
            d="M0 -8C3.8 -3.4 6 -0.6 6 2.2A6 6 0 0 1 -6 2.2C-6 -0.6 -3.8 -3.4 0 -8Z"
          />
        </g>
      </g>
      <g transform="translate(287 58)">
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 54"
            keyTimes="0; 1"
            dur="2.6s"
            begin="0.85s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.9; 0.9; 0"
            keyTimes="0; 0.74; 1"
            dur="2.6s"
            begin="0.85s"
            repeatCount="indefinite"
          />
          <path
            transform="scale(0.85)"
            d="M0 -8C3.8 -3.4 6 -0.6 6 2.2A6 6 0 0 1 -6 2.2C-6 -0.6 -3.8 -3.4 0 -8Z"
          />
        </g>
      </g>
      <g transform="translate(404 72)">
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 40"
            keyTimes="0; 1"
            dur="2.6s"
            begin="1.7s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.9; 0.9; 0"
            keyTimes="0; 0.74; 1"
            dur="2.6s"
            begin="1.7s"
            repeatCount="indefinite"
          />
          <path
            transform="scale(0.85)"
            d="M0 -8C3.8 -3.4 6 -0.6 6 2.2A6 6 0 0 1 -6 2.2C-6 -0.6 -3.8 -3.4 0 -8Z"
          />
        </g>
      </g>
    </g>

    <text className="sv-lbl" x="281" y="406" textAnchor="end">
      Kořeny
    </text>
    <text className="sv-val" x="293" y="406">
      6 cm
    </text>

    {/* ── HLOUBKOVÁ OSA ───────────────────────────────────────────── */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeLinecap="round" fill="none">
      <path d="M496 138H508M572 138H584" />
      <path d="M496 221H508M572 221H584" />
      <path d="M496 303H508M572 303H584" />
      <path d="M496 386H508M572 386H584" />
      <path d="M540 148V213M540 231V295M540 313V378" strokeDasharray="3 7" />
    </g>
    <text className="sv-val" x="540" y="143" textAnchor="middle">
      0 cm
    </text>
    <text className="sv-val" x="540" y="226" textAnchor="middle">
      10 cm
    </text>
    <text className="sv-val" x="540" y="308" textAnchor="middle">
      20 cm
    </text>
    <text className="sv-val" x="540" y="391" textAnchor="middle">
      30 cm
    </text>

    {/* ── PRAVÝ SLOUPEC — vydatně a méně často ────────────────────── */}
    <text className="sv-lbl" x="793" y="26" textAnchor="middle">
      Vydatně a méně často
    </text>
    <text className="sv-val" x="793" y="50" textAnchor="middle">
      12 l/m² každý 3. den
    </text>

    <rect x="584" y="138" width="418" height="165" fill="#6b5138" opacity="0.9" />
    <rect x="584" y="303" width="418" height="83" fill="#54402c" opacity="0.85" />
    <path d="M584 303H1002" stroke="rgba(255,255,255,.13)" strokeWidth="1.6" fill="none" />

    {/* promočené těleso — sahá až ke kótě 25 cm */}
    <path
      d="M584 138H1002V318C976 342 946 328 918 340C890 352 862 330 834 342C806 352 778 330 750 340C722 350 694 330 666 342C640 352 612 332 584 336Z"
      fill="url(#kz-voda)"
    />

    {/* voda protéká pod drn až k 25 cm — kořeny jdou za ní */}
    <g fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" opacity="0.62">
      <path d="M676 138C668 178 682 226 674 272C668 306 680 330 676 343" />
      <path d="M793 138C801 178 787 226 795 272C801 306 789 330 793 343" />
      <path d="M910 138C902 178 916 226 908 272C902 306 914 330 910 343" />
      <path d="M676 343C666 346 657 344 650 339M676 343C686 346 695 344 702 339" />
      <path d="M793 343C783 346 774 344 767 339M793 343C803 346 812 344 819 339" />
      <path d="M910 343C900 346 891 344 884 339M910 343C920 346 929 344 936 339" />
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
      <path d="M634 138C629 180 626 222 628 262C630 300 635 332 636 354M630 186C618 198 608 206 596 216M635 204C646 216 654 226 663 238M628 236C642 248 654 258 668 270M630 284C619 296 609 308 600 322M634 318C644 328 652 338 660 349" />
      <path d="M734 138C739 180 742 222 740 262C738 300 733 332 732 354M738 186C750 198 760 206 772 216M733 204C722 216 714 226 705 238M740 236C726 248 714 258 700 270M738 284C749 296 759 308 768 322M734 318C724 328 716 338 708 349" />
      <path d="M851 138C846 180 843 222 845 262C847 300 852 332 853 354M847 186C835 198 825 206 813 216M852 204C863 216 871 226 880 238M845 236C859 248 871 258 885 270M847 284C836 296 826 308 817 322M851 318C861 328 869 338 877 349" />
      <path d="M951 138C956 180 959 222 957 262C955 300 950 332 949 354M955 186C967 198 977 206 989 216M950 204C939 216 931 226 922 238M957 236C943 248 931 258 917 270M955 284C966 296 976 308 985 322M951 318C941 328 933 338 925 349" />
    </g>

    {/* travní drn */}
    <rect x="584" y="116" width="418" height="22" fill="#3f7d4e" />
    <path d="M584 138H1002" stroke="#2e6440" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    <path
      d="M593 117q0 -9 0 -15M607 117q-1 -8 -3 -13M620 117q-2 -8 -5 -13M634 117q-1 -10 -4 -16M647 117q2 -5 5 -9M661 117q1 -9 2 -15M674 117q-1 -11 -3 -18M688 117q0 -8 -1 -13M701 117q1 -9 2 -15M715 117q-1 -7 -4 -11M728 117q-2 -9 -6 -15M742 117q1 -7 4 -11M755 117q0 -10 -1 -16M769 117q0 -7 0 -12M782 117q-1 -7 -3 -11M796 117q-1 -10 -3 -17M809 117q-2 -9 -6 -15M823 117q1 -11 2 -18M836 117q-1 -8 -4 -13M850 117q-1 -10 -3 -17M863 117q0 -6 -1 -10M877 117q-1 -10 -2 -17M890 117q0 -5 -1 -8M904 117q2 -5 6 -9M917 117q0 -7 1 -11M931 117q2 -9 5 -15M944 117q2 -10 6 -16M958 117q-1 -7 -4 -11M971 117q0 -8 -1 -13M985 117q0 -10 0 -17"
      fill="none"
      stroke="#3f7d4e"
      strokeWidth="1.6"
      strokeLinecap="round"
    />

    {/* hranice promočení + kóta */}
    <path
      d="M584 345H1010"
      stroke="#d5d3cc"
      strokeWidth="1.6"
      strokeDasharray="3 7"
      strokeLinecap="round"
      fill="none"
    />
    <text className="sv-lbl" x="1018" y="338">
      Voda
    </text>
    <text className="sv-val" x="1018" y="358">
      25 cm
    </text>

    {/* kapky — větší dávka, delší perioda */}
    <g fill="#3b82f6" opacity="0.9">
      <g transform="translate(676 66)">
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 46"
            keyTimes="0; 1"
            dur="3.2s"
            begin="0s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.9; 0.9; 0"
            keyTimes="0; 0.74; 1"
            dur="3.2s"
            begin="0s"
            repeatCount="indefinite"
          />
          <path
            transform="scale(1.3)"
            d="M0 -8C3.8 -3.4 6 -0.6 6 2.2A6 6 0 0 1 -6 2.2C-6 -0.6 -3.8 -3.4 0 -8Z"
          />
        </g>
      </g>
      <g transform="translate(793 58)">
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 54"
            keyTimes="0; 1"
            dur="3.2s"
            begin="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.9; 0.9; 0"
            keyTimes="0; 0.74; 1"
            dur="3.2s"
            begin="1s"
            repeatCount="indefinite"
          />
          <path
            transform="scale(1.3)"
            d="M0 -8C3.8 -3.4 6 -0.6 6 2.2A6 6 0 0 1 -6 2.2C-6 -0.6 -3.8 -3.4 0 -8Z"
          />
        </g>
      </g>
      <g transform="translate(910 72)">
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 40"
            keyTimes="0; 1"
            dur="3.2s"
            begin="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.9; 0.9; 0"
            keyTimes="0; 0.74; 1"
            dur="3.2s"
            begin="2s"
            repeatCount="indefinite"
          />
          <path
            transform="scale(1.3)"
            d="M0 -8C3.8 -3.4 6 -0.6 6 2.2A6 6 0 0 1 -6 2.2C-6 -0.6 -3.8 -3.4 0 -8Z"
          />
        </g>
      </g>
    </g>

    <text className="sv-lbl" x="787" y="406" textAnchor="end">
      Kořeny
    </text>
    <text className="sv-val" x="799" y="406">
      26 cm
    </text>
  </svg>
)
