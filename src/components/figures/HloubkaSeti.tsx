import React from 'react'

/**
 * Hloubka setí (DESIGN.md 9.2) — zvětšený řez horními 25 mm půdy, 10 jednotek
 * na milimetr, stupnice vlevo. Tři stejná semena ve třech polohách: volně na
 * hrudkách (pod semenem zůstává vzduch, neklíčí), mělce v pásmu 2–5 mm
 * v přitlačené půdě (kořínek dolů, list nad povrchem) a u dna řezu kolem
 * 20 mm (klíček vyrazí vzhůru, ale skončí pod povrchem). Jediná pointa je
 * pásmo 2–5 mm, vyznačené dvěma konstrukčními linkami přes všechny tři řezy.
 *
 * Kresba nemá akcent: o vodě nemluví, modrá v ní proto není. Klíček pod zemí
 * je světlý jako kořínek (zelený tah by na zemině nebyl vidět), zelená začíná
 * až nad povrchem. Dole malý motiv lehkého válce, který semena přitlačí
 * k půdě. Portrétová sazba 520 px, id s prefixem `hs-`. Statická kresba —
 * pointa je poloha, pohyb by ji nezpřesnil.
 */
export const HloubkaSeti: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 640">
    {/* Pointa kresby (9.2 p. 3) je jedna: osivo patří 2–5 mm pod povrch. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>2–5 mm pod povrch</text>

    {/* ── stupnice v milimetrech (10 jednotek = 1 mm) ─────────── */}
    <line x1="102" y1="112" x2="102" y2="362" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="96" y1="112" x2="108" y2="112" />
      <line x1="96" y1="132" x2="108" y2="132" />
      <line x1="96" y1="162" x2="108" y2="162" />
      <line x1="96" y1="362" x2="108" y2="362" />
    </g>
    <text className="sv-val" x="90" y="114" textAnchor="end">0 mm</text>
    <text className="sv-val" x="90" y="139" textAnchor="end">2</text>
    <text className="sv-val" x="90" y="168" textAnchor="end">5</text>
    <text className="sv-val" x="90" y="367" textAnchor="end">25</text>

    {/* ── zemina tří řezů ─────────────────────────────────────── */}
    {/* A: hrubý, nepřitlačený povrch — hrudky a mezi nimi vzduch */}
    <path d="M118 362 V112 C 119 104, 128 99, 138 100 C 148 101, 154 106, 157 113 C 159 120, 161 126, 163 126 C 165 126, 167 120, 170 111 C 174 103, 181 99, 190 100 C 198 101, 203 107, 205 114 C 206 117, 208 117, 209 113 C 211 107, 221 105, 226 111 V362 Z" fill="#6b5138" opacity="0.9" />
    {/* B, C: přitlačený, rovný povrch */}
    <rect x="245" y="112" width="108" height="250" fill="#6b5138" opacity="0.9" />
    <rect x="372" y="112" width="108" height="250" fill="#6b5138" opacity="0.9" />

    {/* pásmo 2–5 mm přes všechny tři řezy */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
      <line x1="118" y1="132" x2="480" y2="132" />
      <line x1="118" y1="162" x2="480" y2="162" />
    </g>

    {/* ── B: mělce a přitlačené — kořínek dolů, klíček k povrchu ── */}
    <g fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
      <path d="M299 153 C 298 168, 301 186, 299 206 M299 172 q-7 4 -9 12 M300 186 q7 4 9 11" />
      <path d="M299 140 C 300 131, 298 121, 299 112" />
    </g>
    {/* ── C: příliš hluboko — klíček skončí pod povrchem ───────── */}
    <g fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
      <path d="M426 324 C 425 332, 427 340, 426 348" />
      <path d="M426 310 C 423 292, 430 272, 425 252 C 423 242, 427 233, 432 229" />
    </g>

    {/* obrysy řezů: horní hranu nenese drn, proto uzavřené (9.2 p. 9) */}
    <g fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M118 362 V112 C 119 104, 128 99, 138 100 C 148 101, 154 106, 157 113 C 159 120, 161 126, 163 126 C 165 126, 167 120, 170 111 C 174 103, 181 99, 190 100 C 198 101, 203 107, 205 114 C 206 117, 208 117, 209 113 C 211 107, 221 105, 226 111 V362 Z" />
      <path d="M245 112 V362 H353 V112 Z" />
      <path d="M372 112 V362 H480 V112 Z" />
    </g>

    {/* list nad povrchem jen v B */}
    <path d="M299 111 q-2 -22 -10 -38 M299 111 q4 -17 12 -27" fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" />

    {/* ── zvětšená semena (týž styl jako značka osiva) ─────────── */}
    <ellipse cx="163" cy="98" rx="15" ry="8.5" transform="rotate(-4 163 98)" fill="#f6f5f2" stroke="#232830" strokeWidth="1.6" />
    <ellipse cx="299" cy="147" rx="15" ry="8.5" transform="rotate(-10 299 147)" fill="#f6f5f2" stroke="#232830" strokeWidth="1.6" />
    <ellipse cx="426" cy="317" rx="15" ry="8.5" transform="rotate(12 426 317)" fill="#f6f5f2" stroke="#232830" strokeWidth="1.6" />

    {/* ── názvy sloupců pod řezy, na krému ─────────────────────── */}
    <text className="sv-val" x="118" y="392">na povrchu</text>
    <text className="sv-lbl" x="118" y="420">bez</text>
    <text className="sv-lbl" x="118" y="441">kontaktu</text>
    <text className="sv-lbl" x="118" y="462">s půdou</text>

    <text className="sv-val" x="245" y="392">mělce a</text>
    <text className="sv-val" x="245" y="416">přitlačené</text>
    <text className="sv-lbl" x="245" y="444">klíček</text>
    <text className="sv-lbl" x="245" y="465">dosáhne</text>
    <text className="sv-lbl" x="245" y="486">světla</text>

    <text className="sv-val" x="372" y="392">příliš</text>
    <text className="sv-val" x="372" y="416">hluboko</text>
    <text className="sv-lbl" x="372" y="444">zásoby</text>
    <text className="sv-lbl" x="372" y="465">nestačí</text>

    {/* ── lehký válec: přitlačí semena k půdě ──────────────────── */}
    <line x1="40" y1="510" x2="480" y2="510" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <rect x="40" y="602" width="210" height="22" fill="#6b5138" opacity="0.9" />
    <path d="M40 602 V624 H250 V602 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <ellipse cx="98" cy="606.6" rx="5.5" ry="3.4" transform="rotate(-6 98 606.6)" fill="#f6f5f2" stroke="#232830" strokeWidth="1.6" />
    <ellipse cx="142" cy="606.6" rx="5.5" ry="3.4" transform="rotate(8 142 606.6)" fill="#f6f5f2" stroke="#232830" strokeWidth="1.6" />
    <g fill="none" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="120" cy="568" r="33" />
      <circle cx="120" cy="568" r="3.4" />
      <path d="M123 567 L204 540 M199 533 L209 547" />
    </g>
    <text className="sv-val" x="280" y="566">lehký válec</text>
    <text className="sv-lbl" x="280" y="594">přitlačí semena</text>
    <text className="sv-lbl" x="280" y="615">k půdě</text>
  </svg>
)
