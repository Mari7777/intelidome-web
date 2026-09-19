import React from 'react'

/**
 * Dvě zahrady, stejné složky, jiný úkol (DESIGN.md 9.2) — úvodní teze
 * článku o příměsích. Vlevo jílovitá zemina s přimíchaným pískem: kapka
 * má kudy projít dolů (jediná smyčka, CSS `dz-kapka`). Vpravo písčitá
 * zemina s biocharem, Biovinem a zeolitem: kapka zůstává držet u zrna
 * (klidová, s čárkovaným prstencem „zůstává").
 *
 * Portrétová sazba 520 px, id s prefixem `dz-`. Klidový stav v markupu:
 * levá kapka uprostřed sloupce, pravá u zrna biocharu.
 */
export const DveZahrady: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 500">
    <defs>
      {/* písek = drobná okrová zrnka; značka v legendě je táž */}
      <pattern id="dz-pisek" width="26" height="26" patternUnits="userSpaceOnUse">
        <circle cx="6" cy="7" r="2.4" fill="#c2a052" />
        <circle cx="19" cy="19" r="2" fill="#c2a052" />
      </pattern>
      {/* plná výbava písčité zahrady: biochar, Biovin, zeolit */}
      <pattern id="dz-vybava" width="34" height="32" patternUnits="userSpaceOnUse">
        <path d="M5 7 l5 -3 3 4 -4 3 z" fill="#12161b" opacity="0.9" />
        <circle cx="24" cy="10" r="2.6" fill="#54402c" />
        <path d="M12 20 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
      </pattern>
      <clipPath id="dz-l"><rect x="40" y="96" width="200" height="230" /></clipPath>
      <clipPath id="dz-p"><rect x="280" y="96" width="200" height="230" /></clipPath>
    </defs>

    {/* Pointa kresby (9.2 p. 3) je jedna: tytéž pytle, opačná práce. */}
    <text className="sv-val" x="260" y="36" textAnchor="middle" style={{ fontSize: 24 }}>
      Stejné složky, jiný úkol
    </text>

    {/* ── vlevo: jílovitá, otevřít cestu ─────────────────────── */}
    <text className="sv-lbl" x="40" y="76">Jílovitá zahrada</text>
    <g clipPath="url(#dz-l)">
      <rect x="40" y="96" width="200" height="230" fill="#6b5138" opacity="0.9" />
      <rect x="40" y="96" width="200" height="230" fill="url(#dz-pisek)" />
    </g>
    <path d="M40 96 V326 H240 V96 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    {/* cesta dolů: čárkovaná svislice + kapka, která po ní padá */}
    <line x1="140" y1="104" x2="140" y2="318" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <g className="dz-kapka">
      <path d="M140 190 C 144 196, 147 200, 147 204 A 7 7 0 0 1 133 204 C 133 200, 136 196, 140 190 Z" fill="#2563eb" opacity="0.9" />
    </g>
    <path d="M132 334 l8 10 8 -10" fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.75" />
    <text className="sv-lbl" x="40" y="372">písek otevírá cestu</text>
    <text className="sv-lbl" x="40" y="392">vodě a vzduchu</text>

    {/* ── vpravo: písčitá, podržet vodu ──────────────────────── */}
    <text className="sv-lbl" x="280" y="76">Písčitá zahrada</text>
    <g clipPath="url(#dz-p)">
      <rect x="280" y="96" width="200" height="230" fill="#c2a052" opacity="0.45" />
      <rect x="280" y="96" width="200" height="230" fill="url(#dz-vybava)" />
    </g>
    <path d="M280 96 V326 H480 V96 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    {/* kapka drží u zrna biocharu; prstenec říká „zůstává" */}
    <path d="M380 176 l6 -4 4 5 -5 4 z" fill="#12161b" opacity="0.9" />
    <path d="M395 190 C 399 196, 402 200, 402 204 A 7 7 0 0 1 388 204 C 388 200, 391 196, 395 190 Z" fill="#2563eb" opacity="0.9" />
    <circle cx="391" cy="192" r="24" fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" />
    <text className="sv-lbl" x="280" y="372">biochar a zeolit</text>
    <text className="sv-lbl" x="280" y="392">vodu a živiny podrží</text>

    {/* ── legenda (dvě úrovně barevného klíče, 9.2 p. 10) ────── */}
    <line x1="30" y1="416" x2="490" y2="416" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="30" y="438">Co je co</text>

    <circle cx="36" cy="458" r="2.4" fill="#c2a052" />
    <text className="sv-val" x="52" y="463">písek</text>
    <path d="M148 454 l5 -3 3 4 -4 3 z" fill="#12161b" opacity="0.9" />
    <text className="sv-val" x="168" y="463">biochar</text>
    <circle cx="286" cy="458" r="2.6" fill="#54402c" />
    <text className="sv-val" x="300" y="463">Biovin</text>
    <path d="M398 454 l5 -2 4 3 -1 5 -5 2 -4 -3 z" fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
    <text className="sv-val" x="420" y="463">zeolit</text>

    <path d="M33 480 C 36 484, 38 487, 38 489.5 A 5 5 0 0 1 28 489.5 C 28 487, 30 484, 33 480 Z" fill="#2563eb" opacity="0.9" />
    <text className="sv-val" x="52" y="492">voda</text>
  </svg>
)
