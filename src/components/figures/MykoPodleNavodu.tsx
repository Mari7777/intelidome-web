import React from 'react'

/**
 * Mykorhizní přípravek podle návodu (DESIGN.md 9.2) — štítek návodu
 * výrobku rozlišuje dávku podle účelu použití: běžné založení trávníku
 * (dávka A) a náročnější podmínky (dávka B); řádek „typ půdy" je
 * přeškrtnutý a dávku nemá. Tři vzorky půdy vlevo (jílovitá · hlinitá ·
 * písčitá, značky z `prednosti-a-slabiny`) jsou jen vstup: tři tahy
 * se slévají do jedné šipky k témuž řádku běžného založení. Značka
 * „nezvyšovat" (přeškrtnutá šipka nahoru) stojí u DÁVKY A, ne u vzorku:
 * „i pro písčitou" (i60 v3). U vzorku by se četla
 * jako „nepřidávat písek" (tu myšlenku nese písčitá 0/100
 * v `zaklad-tri-zahrad`), což i60 neříká.
 * Pointa je jedna: podle návodu, ne podle typu půdy. Nadpis nese
 * volitelnost („když se pro přípravek rozhodneme", i59). Žádná čísla ani
 * jednotky — písmena A/B místo dávek, 100 g/m² z FAQ kresba neopakuje.
 * Bez akcentu, bez značky výrobku, bez vláken houby.
 *
 * Štítek je jediná plocha mimo půdu (vzorky jsou tři malé hmoty půdy
 * s obrysem, viz níže) a největší hmota kresby: bílá výplň na krémovém
 * panelu, obrys #232830 1,6, rx 10. Záhlaví odděluje plná linka obrysu (etiketa),
 * řádky mezi sebou hairline --id-line rgba(0,0,0,.12) (DESIGN 3.5, na
 * bílé). Tahy od vzorků jsou plné #232830 jako šipky v `nabity-biochar`
 * — nesou hlavní vztah, konstrukční #d5d3cc 3 7 má jen dělicí linka nad
 * pointou. Vzorky jsou tytéž značky jako vzorky půd v `prednosti-a-slabiny`
 * (E1b, 9.2 p. 10): kruh r 26, výplň přes `fillOpacity`, obrys #232830 1,6
 * kreslený až nad výplní, stejné pořadí vrstev. Jílovitá = zemina #6b5138
 * op .9 plošně. Hlinitá = táž zemina s drobty: dlaždice `mpn-hlina`
 * 12 × 12 je kopie `pas-hlina` (a tedy `hpm-hlina`) s počátkem v levém
 * horním rohu vzorku jako tam, takže jíl a hlína se liší viditelnou
 * strukturou a tatáž půda má v článku jednu značku. Písčitá = původní
 * písčitá zemina, okrová #c2a052 op .45 bez zrn (op .55 má v sérii písek
 * jako materiál: přidaný písek se zrny, nová směs s tečkami zeminy;
 * hranaté zrno s obrysem je zeolit, hnědé jádro #54402c na světlém lemu
 * Actino). Legendu kresba nemá, jména stojí pod
 * vzorky. Tři různé půdy vedou k témuž řádku, a právě to nese pointu:
 * typ půdy nerozhoduje.
 *
 * Sazba řádků štítku: každý řádek je skupina ukotvená na svém středu
 * a všechny odsazení jsou v em své třídy (sv-lbl 12/15/18, sv-val
 * 15/18/21). S mobilní sazbou tak řádek roste souměrně a zůstává
 * vycentrovaný; druhý řádek popisku má dy 1,35 em (mezera rámců ≥ 4 při
 * 15 i 18; při 12 jde o proložení jednoho popisku, rámce 2,2, verzálky
 * bez dotahů ≈ 7 volně), hodnota stojí o viditelný krok níž než popisek
 * (rámce ≥ 8 při 12/15, ≥ 10 při 18/21). Značka „nezvyšovat" i přeškrtnutí „typ půdy"
 * mají souřadnice v em, takže rostou s textem. Přeškrtnutí končí 5,45 em
 * (nejužší prostrkání .06 em + přesah 0,15 em), na desktopu tak nepřečnívá.
 *
 * Portrétová sazba 520 px, id s prefixem `mpn-` (jediné: dlaždice drobtů).
 * Mobilní sazba 18/21: „běžné založení trávníku" má v 18 jednotkách 276
 * a do štítku (vnitřek 248) se nevejde, proto stojí na dvou řádcích
 * (i „náročnější podmínky", souběžná stavba A/B). Jména vzorků pod
 * vzorkem na střed (JÍLOVITÁ ≈ 89 při 18): účaří cy + 47, rámec jména
 * (s místem pro čárky nad verzálkami) tak začíná ≥ 4 pod obrysem vzorku
 * i při 18 (měřeno 4,6), další vzorek o 90 níž. Statická kresba.
 */

const R = 26 // poloměr vzorku
const SX = 88 // osa vzorků
const KROK = 90 // rozteč vzorků

// ── štítek návodu ──────────────────────────────────────────────
const SX0 = 200
const SW = 280
const ST = 60 // horní hrana
const TX = SX0 + 16 // levý okraj textů ve štítku

/** Pásy štítku shora dolů: záhlaví, řádek A, řádek B, řádek C.
 *  Výšky podle mobilní sazby 18/21 (obsah + ~12 nahoře i dole). */
const ZAHLAVI_H = 44
const RADEK_H = [136, 106, 82] as const
const HRANY = [ST + ZAHLAVI_H] as number[] // 104 = linka pod záhlavím
for (const h of RADEK_H) HRANY.push(HRANY[HRANY.length - 1] + h) // 240, 346, 428
const SB = HRANY[3]
const stred = (i: number) => (HRANY[i] + HRANY[i + 1]) / 2 // 172, 293, 387

/** Cíl šipky: střed řádku A. Tahy od vzorků se slévají v bodě J
 *  (vodorovná tečna) a dál vede jeden dřík do hrotu 4 před obrysem. */
const CIL_Y = stred(0)
const HROT = SX0 - 4 // 196
const J = SX0 - 30 // 170
const START = SX + R + 4 // 118, 4 za obrysem vzorku

/** Značky půd z `prednosti-a-slabiny`: zemina (jíl plošně, hlína navíc
 *  s drobty `mpn-hlina`), písčitá zemina okrová .45 (ne .55 = písek jako materiál). */
const ZEMINA = { fill: '#6b5138', fillOpacity: 0.9 } as const
const PISCITA = { fill: '#c2a052', fillOpacity: 0.45 } as const
const VZORKY = [
  { id: 'jil', jmeno: 'Jílovitá', cy: CIL_Y - KROK, vypln: ZEMINA, drobty: false },
  { id: 'hlina', jmeno: 'Hlinitá', cy: CIL_Y, vypln: ZEMINA, drobty: true },
  { id: 'pisek', jmeno: 'Písčitá', cy: CIL_Y + KROK, vypln: PISCITA, drobty: false },
] as const

/** S-křivka od vzorku do J: vodorovně ven ze vzorku, vodorovně do J,
 *  takže horní tah zůstane nad jménem svého vzorku. */
const tahK = (cy: number) => {
  const m = (START + J) / 2
  return `M${START} ${cy} C${m} ${cy} ${m} ${CIL_Y} ${J} ${CIL_Y}`
}

const obrys = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
const konstr = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const
const tah = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Značka „nezvyšovat" v em třídy sv-val (15 → 18 → 21). Účaří řádku
 *  značky = 2,4 em od středu řádku A; dřík 1,05 em sahá pod účaří, hrot
 *  0,26 × 0,42 em (≈ hrot série l4 6 při 15), přeškrtnutí jen přes dřík
 *  pod hrotem, aby se s hrotem nesletělo do jednoho znaku. Geometrická
 *  špička hrotu 1,47 em leží ≥ 4 pod rámcem „dávka A" ve všech třech
 *  sazbách; inkoust (půl tahu 0,8 výš) má od rámce 3,3 při 12/15, 3,4 při
 *  15/18 a 4,5 při 18/21 (měřeno). „dávka A" nemá dotahy pod účaří, takže
 *  viditelná mezera k písmu je větší. */
const ZN = { x: 0.35, spod: 2.52, vrch: 1.47, hw: 0.26, hd: 0.42 }
const em = (v: number) => `${Math.round(v * 1000) / 1000}em`

export const MykoPodleNavodu: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 560">
    {/* Volitelnost: přípravek není povinná položka (i59). */}
    <text className="sv-lbl" x="40" y="34">Když se pro přípravek rozhodneme</text>

    <defs>
      {/* Drobty hlíny — kopie dlaždice `pas-hlina` (E1b); počátek v levém
          horním rohu vzorku hlíny jako tam. */}
      <pattern id="mpn-hlina" x={SX - R} y={CIL_Y - R} width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.2" fill="#54402c" />
        <circle cx="9" cy="8" r="2.4" fill="#6b5138" />
        <circle cx="4" cy="9.5" r="1" fill="#54402c" />
      </pattern>
    </defs>

    {/* ── vzorky půdy: jen vstup, značky E1b (výplň, drobty, obrys navrch) ── */}
    {VZORKY.map((v) => (
      <g key={v.id}>
        <circle cx={SX} cy={v.cy} r={R} {...v.vypln} />
        {v.drobty ? <circle cx={SX} cy={v.cy} r={R} fill="url(#mpn-hlina)" /> : null}
        <circle cx={SX} cy={v.cy} r={R} {...obrys} />
      </g>
    ))}
    {/* jména půd pod vzorkem na střed */}
    {VZORKY.map((v) => (
      <text key={v.id} className="sv-lbl" x={SX} y={v.cy + R + 21} textAnchor="middle">
        {v.jmeno}
      </text>
    ))}

    {/* všechny tři půdy vedou k témuž řádku návodu: tahy se slévají v J,
        jeden dřík do hrotu (hrot série l8 5 −8 5) */}
    <g {...tah}>
      <path d={tahK(VZORKY[0].cy)} />
      <path d={tahK(VZORKY[2].cy)} />
      <path d={`M${START} ${CIL_Y} H${HROT}`} />
      <path d={`M${HROT - 8} ${CIL_Y - 5} l8 5 -8 5`} />
    </g>

    {/* ── štítek návodu: největší hmota kresby ────────────────── */}
    <rect x={SX0} y={ST} width={SW} height={SB - ST} rx="10" fill="#fff" />
    <g stroke="rgba(0,0,0,0.12)" strokeWidth="1">
      {HRANY.slice(1, 3).map((y) => (
        <line key={y} x1={SX0} y1={y} x2={SX0 + SW} y2={y} />
      ))}
    </g>
    {/* záhlaví etikety: plná linka obrysu ho odliší od řádků */}
    <line x1={SX0} y1={HRANY[0]} x2={SX0 + SW} y2={HRANY[0]} {...obrys} />
    <rect x={SX0} y={ST} width={SW} height={SB - ST} rx="10" {...obrys} />

    <text className="sv-lbl" x={TX} y={ST + ZAHLAVI_H / 2} dy="0.33em">Návod výrobku</text>

    {/* účel A: sem vedou všechny tři půdy; pod dávkou značka „nezvyšovat" */}
    <g transform={`translate(${TX} ${stred(0)})`}>
      <text className="sv-lbl" y="-2.13em">
        Běžné založení
        <tspan x="0" dy="1.35em">trávníku</tspan>
      </text>
      <text className="sv-val" y="1em">dávka A</text>
      <g className="sv-val" {...tah}>
        <line x1={em(ZN.x)} y1={em(ZN.spod)} x2={em(ZN.x)} y2={em(ZN.vrch)} />
        <line x1={em(ZN.x - ZN.hw)} y1={em(ZN.vrch + ZN.hd)} x2={em(ZN.x)} y2={em(ZN.vrch)} />
        <line x1={em(ZN.x)} y1={em(ZN.vrch)} x2={em(ZN.x + ZN.hw)} y2={em(ZN.vrch + ZN.hd)} />
        <line x1={em(ZN.x - 0.37)} y1={em(2.46)} x2={em(ZN.x + 0.37)} y2={em(1.98)} />
      </g>
      <text className="sv-val" x="1.15em" y="2.4em">i pro písčitou</text>
    </g>

    {/* účel B */}
    <g transform={`translate(${TX} ${stred(1)})`}>
      <text className="sv-lbl" y="-1.317em">
        Náročnější
        <tspan x="0" dy="1.35em">podmínky</tspan>
      </text>
      <text className="sv-val" y="1.7em">dávka B</text>
    </g>

    {/* typ půdy: přeškrtnuto. Linka v em roste s mobilní sazbou textu. */}
    <g transform={`translate(${TX} ${stred(2)})`}>
      <g className="sv-lbl">
        <text className="sv-lbl" y="-0.642em">Typ půdy</text>
        <line x1="-0.15em" y1="-1.002em" x2="5.45em" y2="-1.002em" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <text className="sv-val" y="1.121em">–</text>
    </g>

    {/* ── pointa (9.2 p. 3) ───────────────────────────────────── */}
    <line x1="30" y1="460" x2="490" y2="460" {...konstr} />
    <text className="sv-val" x="40" y="500" style={{ fontSize: 24 }}>Podle návodu</text>
    <text className="sv-lbl" x="40" y="526">Ne podle typu půdy</text>
  </svg>
)
