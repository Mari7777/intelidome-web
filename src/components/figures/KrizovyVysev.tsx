import React from 'react'

/**
 * Křížový výsev (DESIGN.md 9.2) — pohled shora na tutéž plochu ve dvou
 * krocích. Vlevo první průchod: polovina dávky v rovnoběžných pruzích jedním
 * směrem. Vpravo druhý průchod: první pruhy zůstávají jako konstrukční linky,
 * přes ně jde druhá polovina napříč, kolmo. Semena z prvního průchodu na ploše
 * zůstávají, takže pravá plocha nese obě poloviny a je pokrytá rovnoměrněji.
 *
 * Jediná pointa je ½ + ½ dávky: dvakrát se seje, ale celkem stále doporučená
 * dávka. Kresba nemá akcent — o vodě nemluví, modrá v ní není. Plochy jsou
 * jen obrysem na krému, aby tahy průchodů a tečky semen zůstaly čitelné.
 * Portrétová sazba 520 px, id s prefixem `kv-` (žádná nejsou potřeba).
 * Statická kresba — pointa je směr tahů, ne pohyb.
 */
export const KrizovyVysev: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 420">
    {/* Pointa kresby (9.2 p. 3) je jedna: dávka se dělí na dvě poloviny. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>½ + ½ dávky</text>

    <text className="sv-lbl" x="40" y="72">1. průchod</text>
    <text className="sv-lbl" x="280" y="72">2. průchod</text>

    {/* ── 1. průchod: pruhy jedním směrem ─────────────────────── */}
    <g fill="#232830">
      <circle cx="71" cy="112" r="1.6" /> <circle cx="51" cy="138" r="1.6" /> <circle cx="66" cy="158" r="1.6" /> <circle cx="46" cy="180" r="1.6" /> <circle cx="50" cy="204" r="1.6" />
      <circle cx="71" cy="228" r="1.6" /> <circle cx="52" cy="240" r="1.6" /> <circle cx="114" cy="112" r="1.6" /> <circle cx="89" cy="126" r="1.6" /> <circle cx="91" cy="162" r="1.6" />
      <circle cx="114" cy="175" r="1.6" /> <circle cx="111" cy="205" r="1.6" /> <circle cx="112" cy="221" r="1.6" /> <circle cx="88" cy="250" r="1.6" /> <circle cx="127" cy="117" r="1.6" />
      <circle cx="133" cy="126" r="1.6" /> <circle cx="147" cy="148" r="1.6" /> <circle cx="130" cy="179" r="1.6" /> <circle cx="154" cy="205" r="1.6" /> <circle cx="148" cy="228" r="1.6" />
      <circle cx="134" cy="235" r="1.6" /> <circle cx="168" cy="115" r="1.6" /> <circle cx="187" cy="129" r="1.6" /> <circle cx="165" cy="161" r="1.6" /> <circle cx="188" cy="178" r="1.6" />
      <circle cx="192" cy="192" r="1.6" /> <circle cx="175" cy="224" r="1.6" /> <circle cx="186" cy="237" r="1.6" /> <circle cx="225" cy="122" r="1.6" /> <circle cx="235" cy="139" r="1.6" />
      <circle cx="229" cy="162" r="1.6" /> <circle cx="234" cy="173" r="1.6" /> <circle cx="231" cy="211" r="1.6" /> <circle cx="228" cy="223" r="1.6" /> <circle cx="235" cy="240" r="1.6" />
    </g>
    <g fill="none" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 96 V256 M55 249 L60 256 L65 249" />
      <path d="M100 96 V256 M95 249 L100 256 L105 249" />
      <path d="M140 96 V256 M135 249 L140 256 L145 249" />
      <path d="M180 96 V256 M175 249 L180 256 L185 249" />
      <path d="M220 96 V256 M215 249 L220 256 L225 249" />
    </g>
    <path d="M40 84 V268 H240 V84 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* ── 2. průchod: první pruhy zesvětlené, druhé napříč ────── */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
      <line x1="300" y1="96" x2="300" y2="256" />
      <line x1="340" y1="96" x2="340" y2="256" />
      <line x1="380" y1="96" x2="380" y2="256" />
      <line x1="420" y1="96" x2="420" y2="256" />
      <line x1="460" y1="96" x2="460" y2="256" />
    </g>
    {/* semena z 1. průchodu zůstávají na ploše (tytéž polohy jako vlevo) */}
    <g fill="#232830">
      <circle cx="311" cy="112" r="1.6" /> <circle cx="291" cy="138" r="1.6" /> <circle cx="306" cy="158" r="1.6" /> <circle cx="286" cy="180" r="1.6" /> <circle cx="290" cy="204" r="1.6" />
      <circle cx="311" cy="228" r="1.6" /> <circle cx="292" cy="240" r="1.6" /> <circle cx="354" cy="112" r="1.6" /> <circle cx="329" cy="126" r="1.6" /> <circle cx="331" cy="162" r="1.6" />
      <circle cx="354" cy="175" r="1.6" /> <circle cx="351" cy="205" r="1.6" /> <circle cx="352" cy="221" r="1.6" /> <circle cx="328" cy="250" r="1.6" /> <circle cx="367" cy="117" r="1.6" />
      <circle cx="373" cy="126" r="1.6" /> <circle cx="387" cy="148" r="1.6" /> <circle cx="370" cy="179" r="1.6" /> <circle cx="394" cy="205" r="1.6" /> <circle cx="388" cy="228" r="1.6" />
      <circle cx="374" cy="235" r="1.6" /> <circle cx="408" cy="115" r="1.6" /> <circle cx="427" cy="129" r="1.6" /> <circle cx="405" cy="161" r="1.6" /> <circle cx="428" cy="178" r="1.6" />
      <circle cx="432" cy="192" r="1.6" /> <circle cx="415" cy="224" r="1.6" /> <circle cx="426" cy="237" r="1.6" /> <circle cx="465" cy="122" r="1.6" /> <circle cx="475" cy="139" r="1.6" />
      <circle cx="469" cy="162" r="1.6" /> <circle cx="474" cy="173" r="1.6" /> <circle cx="471" cy="211" r="1.6" /> <circle cx="468" cy="223" r="1.6" /> <circle cx="475" cy="240" r="1.6" />
    </g>
    {/* semena z 2. průchodu, v pruzích napříč */}
    <g fill="#232830">
      <circle cx="308" cy="100" r="1.6" /> <circle cx="320" cy="95" r="1.6" /> <circle cx="333" cy="97" r="1.6" /> <circle cx="354" cy="120" r="1.6" /> <circle cx="386" cy="119" r="1.6" />
      <circle cx="406" cy="94" r="1.6" /> <circle cx="412" cy="101" r="1.6" /> <circle cx="432" cy="102" r="1.6" /> <circle cx="452" cy="95" r="1.6" /> <circle cx="309" cy="144" r="1.6" />
      <circle cx="318" cy="148" r="1.6" /> <circle cx="347" cy="166" r="1.6" /> <circle cx="359" cy="168" r="1.6" /> <circle cx="385" cy="168" r="1.6" /> <circle cx="398" cy="138" r="1.6" />
      <circle cx="426" cy="147" r="1.6" /> <circle cx="436" cy="165" r="1.6" /> <circle cx="453" cy="140" r="1.6" /> <circle cx="307" cy="187" r="1.6" /> <circle cx="320" cy="192" r="1.6" />
      <circle cx="345" cy="187" r="1.6" /> <circle cx="366" cy="191" r="1.6" /> <circle cx="386" cy="193" r="1.6" /> <circle cx="397" cy="187" r="1.6" /> <circle cx="425" cy="206" r="1.6" />
      <circle cx="432" cy="204" r="1.6" /> <circle cx="452" cy="187" r="1.6" /> <circle cx="308" cy="256" r="1.6" /> <circle cx="325" cy="257" r="1.6" /> <circle cx="347" cy="233" r="1.6" />
      <circle cx="359" cy="257" r="1.6" /> <circle cx="385" cy="257" r="1.6" /> <circle cx="405" cy="252" r="1.6" /> <circle cx="425" cy="251" r="1.6" /> <circle cx="432" cy="231" r="1.6" />
      <circle cx="453" cy="235" r="1.6" />
    </g>
    <g fill="none" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M292 107 H468 M461 102 L468 107 L461 112" />
      <path d="M292 153 H468 M461 148 L468 153 L461 158" />
      <path d="M292 199 H468 M461 194 L468 199 L461 204" />
      <path d="M292 245 H468 M461 240 L468 245 L461 250" />
    </g>
    <path d="M280 84 V268 H480 V84 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* ── popisky pod plochami ────────────────────────────────── */}
    <text className="sv-val" x="40" y="298">1. polovina</text>
    <text className="sv-lbl" x="40" y="326">jedním směrem</text>
    <text className="sv-val" x="280" y="298">2. polovina</text>
    <text className="sv-lbl" x="280" y="326">napříč, kolmo</text>

    <line x1="40" y1="350" x2="480" y2="350" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <text className="sv-lbl" x="40" y="384">celkem stále doporučená dávka</text>
  </svg>
)
