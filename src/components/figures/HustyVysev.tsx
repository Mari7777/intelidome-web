import React from 'react'

/**
 * Hustý výsev (DESIGN.md 9.2) — dva stejně široké řezy půdou pod týmž
 * sluncem. Vlevo dávka podle návodu: čtyři rostliny, každá s odnožemi a
 * delšími kořeny. Vpravo výsev „hustě pro jistotu“: třináct tenkých
 * rostlinek natěsnaných vedle sebe, bez odnoží, s krátkými kořínky, listy
 * se jim překrývají. Pointa je jedna: světla je na stejné ploše stejně,
 * ať se o ně dělí čtyři rostliny, nebo třináct.
 *
 * Akcentem je okr slunce: jedno slunce mezi řezy a nad každým řezem pět
 * zrcadlově shodných paprsků. Voda v kresbě není, modrá tedy také ne.
 * Husté rostlinky zůstávají zelené, protože text mluví o rychle zeleném
 * povrchu, který slabé rostliny jen skrývá.
 *
 * Portrétová sazba 520 px, id s prefixem `hv-`. Rozvržení jako
 * `mykorhiza-pod-osivem`: záhlaví nad řezy, verdikt pod nimi, rezerva na
 * telefonní 18/21 jednotek. Statická kresba: jde o srovnání dvou stavů.
 */
export const HustyVysev: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 440">
    <defs>
      <clipPath id="hv-rez-l"><rect x="40" y="232" width="200" height="100" /></clipPath>
      <clipPath id="hv-rez-r"><rect x="280" y="232" width="200" height="100" /></clipPath>
    </defs>

    {/* Pointa kresby (9.2 p. 3) je jedna: světla je pro oba řezy stejně. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Stejné světlo</text>

    {/* ── záhlaví řezů ────────────────────────────────────────── */}
    <text className="sv-lbl" x="40" y="70">Dávka</text>
    <text className="sv-lbl" x="40" y="91">podle návodu</text>
    <text className="sv-lbl" x="280" y="70">Hustě</text>
    <text className="sv-lbl" x="280" y="91">pro jistotu</text>

    {/* ── totéž slunce, tytéž paprsky nad oběma řezy ──────────── */}
    <circle cx="260" cy="112" r="6" fill="#b76a00" opacity="0.85" />
    <g stroke="#b76a00" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
      <line x1="260" y1="102" x2="260" y2="98.5" />
      <line x1="260" y1="122" x2="260" y2="125.5" />
      <line x1="250" y1="112" x2="246.5" y2="112" />
      <line x1="270" y1="112" x2="273.5" y2="112" />
      <line x1="252.9" y1="104.9" x2="250.5" y2="102.5" />
      <line x1="267.1" y1="104.9" x2="269.5" y2="102.5" />
      <line x1="252.9" y1="119.1" x2="250.5" y2="121.5" />
      <line x1="267.1" y1="119.1" x2="269.5" y2="121.5" />
    </g>
    <g stroke="#b76a00" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
      <line x1="72" y1="124" x2="63" y2="150" />
      <line x1="108" y1="124" x2="99" y2="150" />
      <line x1="144" y1="124" x2="135" y2="150" />
      <line x1="180" y1="124" x2="171" y2="150" />
      <line x1="216" y1="124" x2="207" y2="150" />
      <line x1="304" y1="124" x2="313" y2="150" />
      <line x1="340" y1="124" x2="349" y2="150" />
      <line x1="376" y1="124" x2="385" y2="150" />
      <line x1="412" y1="124" x2="421" y2="150" />
      <line x1="448" y1="124" x2="457" y2="150" />
    </g>

    {/* ── vlevo: dávka podle návodu, čtyři silné rostliny ─────── */}
    <g clipPath="url(#hv-rez-l)">
      <rect x="40" y="232" width="200" height="100" fill="#6b5138" opacity="0.9" />
      <g fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
        <path d="M65 232 C64 254 67 278 65 304 M63 232 C58 248 55 266 50 282 M67 232 C72 248 75 264 81 280 M65 258 q5 5 6 12 M65 280 q-5 5 -6 11 M57 258 q-5 2 -8 7" />
        <path d="M115 232 C116 256 113 282 115 310 M113 232 C108 248 104 264 99 278 M117 232 C122 248 126 266 131 284 M115 262 q-5 5 -6 12 M115 286 q5 5 6 11 M124 256 q5 2 8 7" />
        <path d="M165 232 C164 254 167 276 165 300 M163 232 C158 248 155 268 149 286 M167 232 C172 248 175 264 181 278 M165 256 q5 5 6 12 M165 278 q-5 5 -6 11 M156 260 q-5 2 -8 7" />
        <path d="M215 232 C216 256 213 282 215 308 M213 232 C208 248 205 264 199 280 M217 232 C221 248 224 266 229 282 M215 264 q-5 5 -6 12 M215 288 q5 5 6 11 M222 254 q5 2 7 7" />
      </g>
    </g>
    <path d="M40 232 V332 H240 V232 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <g fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round">
      <path d="M65 232 q-1 -36 2 -64 M63 232 q-5 -30 -12 -52 M67 232 q6 -30 13 -50 M61 232 q-6 -21 -14 -36 M69 232 q7 -20 15 -34" />
      <path d="M115 232 q1 -38 -1 -68 M113 232 q-5 -28 -13 -50 M117 232 q5 -30 13 -54 M111 232 q-7 -19 -15 -34 M119 232 q7 -21 14 -38" />
      <path d="M165 232 q-1 -34 2 -62 M163 232 q-5 -30 -12 -54 M167 232 q6 -28 13 -48 M161 232 q-6 -21 -14 -38 M169 232 q7 -19 15 -32" />
      <path d="M215 232 q1 -36 -1 -66 M213 232 q-5 -28 -13 -48 M217 232 q5 -30 12 -52 M211 232 q-7 -20 -15 -36 M219 232 q6 -20 14 -35" />
    </g>

    {/* ── vpravo: hustě pro jistotu, třináct slabých rostlinek ── */}
    <g clipPath="url(#hv-rez-r)">
      <rect x="280" y="232" width="200" height="100" fill="#6b5138" opacity="0.9" />
      <g fill="none" stroke="#d8c9b4" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
        <path d="M290 232 C289 238 291 244 290 250" />
        <path d="M305 232 C306 239 304 246 305 253" />
        <path d="M320 232 C319 237 321 243 320 248" />
        <path d="M335 232 C336 239 334 245 335 252" />
        <path d="M350 232 C349 238 351 243 350 249" />
        <path d="M365 232 C366 239 364 246 365 254" />
        <path d="M380 232 C379 237 381 243 380 248" />
        <path d="M395 232 C396 238 394 245 395 251" />
        <path d="M410 232 C409 239 411 246 410 253" />
        <path d="M425 232 C426 237 424 243 425 249" />
        <path d="M440 232 C439 238 441 245 440 252" />
        <path d="M455 232 C456 238 454 243 455 248" />
        <path d="M470 232 C469 239 471 245 470 251" />
      </g>
    </g>
    <path d="M280 232 V332 H480 V232 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <g fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round">
      <path d="M290 232 q-1 -18 3 -32 M290 232 q4 -12 10 -20" />
      <path d="M305 232 q-2 -20 -6 -36 M305 232 q3 -14 9 -24" />
      <path d="M320 232 q1 -17 -2 -30 M320 232 q4 -13 10 -22" />
      <path d="M335 232 q-2 -19 2 -35 M335 232 q-4 -12 -9 -21" />
      <path d="M350 232 q1 -18 -3 -32 M350 232 q4 -14 10 -23" />
      <path d="M365 232 q-1 -20 3 -37 M365 232 q-4 -12 -9 -20" />
      <path d="M380 232 q2 -17 -1 -31 M380 232 q4 -13 10 -22" />
      <path d="M395 232 q-2 -19 2 -34 M395 232 q-4 -13 -9 -22" />
      <path d="M410 232 q1 -20 -3 -36 M410 232 q4 -12 10 -21" />
      <path d="M425 232 q-1 -17 3 -30 M425 232 q-4 -13 -9 -23" />
      <path d="M440 232 q2 -19 -2 -35 M440 232 q4 -13 10 -22" />
      <path d="M455 232 q-1 -18 3 -32 M455 232 q-4 -12 -9 -21" />
      <path d="M470 232 q1 -19 -3 -34 M470 232 q3 -13 7 -22" />
    </g>

    {/* ── verdikt pod řezy ────────────────────────────────────── */}
    <text className="sv-val" x="40" y="362">silnější rostliny</text>
    <text className="sv-lbl" x="40" y="387">mají místo</text>
    <text className="sv-lbl" x="40" y="408">houstnout</text>

    <text className="sv-val" x="280" y="362">slabé rostlinky</text>
    <text className="sv-lbl" x="280" y="387">stíní si</text>
    <text className="sv-lbl" x="280" y="408">navzájem</text>
  </svg>
)
