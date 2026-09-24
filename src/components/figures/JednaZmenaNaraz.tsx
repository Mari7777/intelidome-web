import React from 'react'

/**
 * Jedna změna naráz (DESIGN.md 9.2) — dvě zkušební plochy vedle sebe a mezi
 * nimi jediný rozdíl. Nahoře pohled shora: pás trávníku rozdělený na plochy
 * A | B (bez kolíků a provázku, nesmí připomínat fotku vytyčených úseků
 * z přípravy). Pod ním promítnutý řez horní vrstvou 0–10 cm přes celý pás:
 * tytéž hrany x 80 / 285 / 490, čárkované promítací linky, takže vládne
 * konstrukce „půdorys → řez", ne dvojice bloků jako v `dve-zahrady`.
 * Dělicí čára ploch je plná #232830 v pásu i v řezu (dělení jedné hmoty
 * jako `zaklad-tri-zahrad`), čárkování 3 7 zůstává konstrukci.
 *
 * Pointa je jedna: měníme jednu dávku naráz (i54 v3–v4, i56 v2). Obě
 * poloviny řezu mají TOTÉŽ pole značek na týchž místech; B má navíc
 * polovinu střípků biocharu (10 → 15) a každý přidaný střípek nese
 * čárkovaný prstenec. V A je na týchž místech čistý základ: přidaný
 * biochar zabral místo základu. Žádná čísla dávek, žádné stoprocentní
 * sloupce (nese je tabulka nad splitem), žádný akcent — nic tu není voda.
 *
 * Zahrada je písčitá (podtitul pod nadpisem). Celou trojici příměsí
 * v horních 10 cm má v textu vedle jen písčitá zahrada (E8 odst. 2:
 * zeolit 8–10 % v horních 15 cm, biochar i Actino 5–10 % v horních 10 cm;
 * odst. 3: biochar 5–10 % pro písčitou) a její minerální základ tvoří
 * podle E7 „původní písčitá zemina". Řez je proto tatáž hmota jako pravé
 * pole `dve-zahrady`: plochá okrová #c2a052 op .45 bez zrn (klíč článku
 * jako `pisek-pod-koreny` a `zaklad-tri-zahrad`). Zrna přidaného písku řez
 * nemá, u písčité zahrady se písek nepřidává (E6). Počty biochar : Actino
 * : zeolit = 10 : 10 : 12 jsou schéma poměru, ne dávky; zeolitu je o něco
 * víc jako v receptu E6 a v pravém poli `dve-zahrady` (11 : 11 : 13).
 *
 * Značky (9.2 p. 10):
 * – biochar `b1` / `b2` a zeolit `z` = tytéž tvary jako `Znacka`
 *   v `dve-zahrady`;
 * – Actino = značka z `dve-zahrady`: hnědé jádro r 2,6 / 2,2 #54402c na
 *   lemu barvy panelu #f6f5f2 o 1,2 širším, na téže okrové jako tam.
 *   Na okrové má jádro 6,3 : 1 a lem jen 1,4 : 1, takže se čte jako hnědá
 *   tečka. Na hnědé zemině by se četla obráceně, jako bílý kroužek (lem
 *   5,3 : 1, jádro 1,7 : 1), tedy jako vzduch z `pisek-pod-koreny`;
 *   proto řez na hnědé zemině nestojí.
 * – prstenec = vyznačení přidaného střípku: čárkovaná kružnice r 8,
 *   #232830 / 1,6, pět period 3 / 7,05 = obvod 2π·8. Konstrukční barvy
 *   by na okrové zmizely (#d5d3cc 1,03 : 1, bílá .7 z `pisek-pod-koreny`
 *   1,36 : 1); prstenec nese pointu, potřebuje tedy ≥ 3 : 1 (DESIGN 11,
 *   WCAG 1.4.11) a inkoust má 9,6 : 1. Čárkování ho odlišuje od plných
 *   obrysů hmoty i zrn a je to jediný kroužek v řezu.
 * Všechny značky kreslí `Znacka`, i v legendě.
 *
 * Rozmístění v řezu: polovina 205 × 120 dělená na buňky 3 × 2 (68,3 × 60).
 * V každé buňce leží 2 zrna zeolitu a po 1–2 střípcích a hrudkách Actina,
 * takže po třetinách poloviny je biochar 3 / 4 / 3, Actino 3 / 3 / 4
 * a zeolit 4 / 4 / 4; žádná příměs netvoří vlastní pás. Prstence stojí
 * po jednom v pěti buňkách, střídavě výš a níž (netvoří řadu ani
 * sloupec); buňka vpravo dole prstenec nemá. Zeolit u dna (92, 101), na
 * který míří ramena, má k nejbližšímu prstenci ≥ 21. Odstupy (rámec
 * Actina včetně lemu, zeolitu včetně půl tahu), změřeno: mezi rámci značek
 * ≥ 7,1, k vnitřní hraně obrysu a dělicí čáry ≥ 5,4, prstenec (r 8 + půl
 * tahu) od cizích značek ≥ 3,7, od obrysu a dělicí čáry ≥ 12.
 *
 * Ramena „Ostatní příměsi beze změny" (slova autora, i56 v2) míří na
 * zeolit u dna, největší značku, a začínají 3,7 pod jeho rámcem. Uvnitř
 * okrové je první čárka bílá op .7 (`vodSvetle` z `pisek-pod-koreny`),
 * venku #d5d3cc 3 7; fáze čárek přes obrys navazuje.
 *
 * Legenda je mřížka tří sloupců (klíč 28 široký na x 30 / 190 / 350, text
 * o 36 dál). Čipy mají výplň okrové řezu, ostré rohy a obrys hmoty; značky
 * nesené okrovou leží na čipu, jako v řezu (pravidlo `pisek-pod-koreny`:
 * čip té zeminy, ve které značka v řezu leží; hnědá v kresbě není).
 * 1. řádek: základ · biochar na krému · Actino na čipu, jádro ve středu
 * čipu jako v legendě `dve-zahrady`. 2. řádek: zeolit na čipu, zrno na
 * x+10 / y+4 od rohu čipu jako v `dve-zahrady`; přidaný biochar
 * s prstencem na políčku 28 × 28, protože prstenec r 8 (17,6 i s tahem)
 * se do výšky 14 nevejde — v políčku má k vnitřní hraně obrysu všude 4,4.
 * Obě značky 2. řádku mají střed na L2 − 5.
 *
 * Měřítko řezu 12 px na cm, ne 8 jako řezy 0–30 cm: řez má jen 10 cm
 * a při 8 px/cm by v panelu 640 zůstalo ~130 jednotek prázdných pásů
 * a řez by nevážil víc než pohled shora. Stupnice 0 / 10 cm to nese.
 *
 * Portrétová sazba 520 × 640, kresba nemá žádné id (prefix `jzn-` je
 * rezervovaný). Nadpis 24 px a podtitul na x 40 (osa nadpisů série).
 * Tagy ploch stojí v ose své poloviny; tag B končí druhým řádkem 12 nad
 * řezem, tag A stojí na účaří prvního řádku B (37 nad řezem).
 * „Na úkor základu" je druhý řádek tagu B, ne popisek pod řezem
 * (tam by se s „ostatní příměsi beze změny" četl jako jedna věta).
 * Mobilní sazba 18/21 jednotek, změřeno (getBBox): podtitul 40–218,
 * 7,8 pod nadpisem a 14,8 nad „Pohled shora"; tagy A 93–272, B 301–474,
 * „na úkor základu" 294–481, od promítacích linek ≥ 9; řádky tagu B mají
 * rozteč 25 (mezi rámci 4,8); „Ostatní příměsi beze změny" 134–436,
 * ramena končí i s kulatou hlavičkou ≥ 5,3 nad jeho rámcem; nejdelší text
 * legendy „přidaný biochar" končí na 373; nic nepřesahuje 0..520.
 * Statická kresba.
 */

type Druh = 'b1' | 'b2' | 'a1' | 'a2' | 'z'

const PANEL = '#f6f5f2' // barva krémového panelu figury (--id-cream), lem Actina
const HALO = 1.2 // lem Actina navíc k poloměru jádra

/** Jedna značka příměsi — tytéž tvary jako `Znacka` v `dve-zahrady`
 *  (Actino = jádro na světlém lemu, 9.2 p. 10). */
const Znacka: React.FC<{ d: Druh; x: number; y: number }> = ({ d, x, y }) => {
  if (d === 'b1') return <path d={`M${x} ${y} l5 -3 3 4 -4 3 z`} fill="#12161b" opacity="0.9" />
  if (d === 'b2') return <path d={`M${x} ${y} l5 -2 2 4 -4 3 z`} fill="#12161b" opacity="0.9" />
  if (d === 'a1' || d === 'a2') {
    const r = d === 'a1' ? 2.6 : 2.2
    return (
      <g>
        <circle cx={x} cy={y} r={r + HALO} fill={PANEL} />
        <circle cx={x} cy={y} r={r} fill="#54402c" />
      </g>
    )
  }
  return <path d={`M${x} ${y} l5 -2 4 3 -1 5 -5 2 -4 -3 z`} fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
}

/** Pole společné oběma polovinám řezu (rel. k levému hornímu rohu poloviny
 *  205 × 120), buňky 3 × 2. Na začátku zeolit u dna pro ramena „ostatní
 *  příměsi beze změny"; místa prstenců z B zůstávají v A čistým základem. */
const SPOLECNE: [Druh, number, number][] = [
  ['z', 92, 101], ['a1', 28.5, 72], ['b1', 64, 55], ['b2', 53.5, 28], ['z', 94, 59.5], ['z', 17, 15],
  ['b1', 20.5, 96], ['z', 45.5, 66], ['a2', 134.5, 33], ['a1', 168.5, 85.5], ['z', 8, 57.5], ['a2', 49.5, 46.5],
  ['a1', 142.5, 57.5], ['b2', 73, 76.5], ['z', 117.5, 50], ['a2', 143, 97.5], ['a1', 178, 22], ['b1', 181.5, 66],
  ['z', 152.5, 23], ['b2', 80, 30], ['a2', 75, 16], ['z', 144, 74.5], ['z', 113.5, 17.5], ['b1', 135.5, 14.5],
  ['b2', 114, 98.5], ['a1', 45.5, 106], ['a2', 100.5, 83], ['b1', 96, 42.5], ['b2', 158.5, 103.5], ['z', 187, 46],
  ['z', 40.5, 9], ['z', 181, 97],
]
/** Prstence střípků navíc v B (střed rámce střípku = střed prstence). */
const PRSTENCE: [number, number][] = [[30, 40], [98, 22], [168, 48], [58, 92], [126, 80]]
const NAVIC: [Druh, number, number][] = PRSTENCE.map(([cx, cy], i) =>
  i % 2 ? ['b2', cx - 3.5, cy - 1.5] : ['b1', cx - 4, cy - 0.5],
)

/** Trsy trávy v pohledu shora (rel. k ploše 205 × 88), v A i B tytéž. */
const TRSY: [number, number][] = [
  [47, 49], [149, 49], [93, 68], [108, 25], [182, 41], [22, 68], [76, 23], [183, 72], [19, 33], [152, 23], [122, 62],
]

// ── sazba ──────────────────────────────────────────────────────
const X0 = 80 // levá hrana pásu i řezu
const X1 = 490 // pravá hrana pásu i řezu
const XD = 285 // hranice ploch A | B, v pásu i v řezu
const HW = XD - X0 // 205, polovina
const PY0 = 115 // pás trávníku shora
const PY1 = PY0 + 88 // 203
const CM = 12
const S0 = 312 // povrch řezu, 0 cm
const S1 = S0 + 10 * CM // 432, 10 cm
const Y_H1 = S0 - 37 // tag plochy
const Y_H2 = S0 - 12 // druhý řádek u B
const R1 = S1 + 77 // 509 — „ostatní beze změny"
const LEG = R1 + 37 // 546 — linka legendy
const L1 = LEG + 32 // 578 — účaří 1. řádku legendy
const L2 = LEG + 66 // 612 — účaří 2. řádku
const PRST_R = 8

/** Písčitá zemina: klíč článku op .45 (přidaný písek .55 je jiná hmota). */
const PISCITA = { fill: '#c2a052', fillOpacity: 0.45 } as const
const car = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const
/** Konstrukční linka na okrové zemině (`pisek-pod-koreny`): #d5d3cc by splynul. */
const vodSvetle = { stroke: '#fff', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round', opacity: 0.7 } as const
const obrys = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const

/** Trs trávy shora: dvojice krátkých svislých čárek (mapová značka louky). */
const Trs: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <path d={`M${x} ${y} v-5 M${x + 4} ${y + 1} v-6`} />
)

/** Prstenec kolem střípku navíc: čárkovaná kružnice #232830 (na okrové
 *  by konstrukční #d5d3cc zmizel); 5 period 3 / 7,05 = obvod 2π·8. */
const Prstenec: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <circle cx={cx} cy={cy} r={PRST_R} fill="none" stroke="#232830" strokeWidth="1.6" strokeDasharray="3 7.05" strokeLinecap="round" />
)

/** Čip písčité zeminy 28 × h (14, políčko 28): tatáž výplň a obrys jako
 *  hmota řezu; značka leží mezi výplní a obrysem. */
const Cip: React.FC<{ x: number; y: number; h?: number; children?: React.ReactNode }> = ({ x, y, h = 14, children }) => (
  <>
    <rect x={x} y={y} width="28" height={h} {...PISCITA} />
    {children}
    <path d={`M${x} ${y} H${x + 28} V${y + h} H${x} Z`} {...obrys} />
  </>
)

/** Rameno od zrna u dna ke štítku: uvnitř okrové bílá .7, venku #d5d3cc;
 *  čárky začínají na cíli a fáze navazuje přes obrys (vnitřek končí 3 nad
 *  osou obrysu, vnějšek začíná 4 pod ní, jako vodítka `pisek-pod-koreny`). */
const Rameno: React.FC<{ x0: number; y0: number; x1: number; y1: number }> = ({ x0, y0, x1, y1 }) => {
  const len = Math.hypot(x1 - x0, y1 - y0)
  const at = (y: number) => (y - y0) / (y1 - y0) // podíl délky ve výšce y
  const p = (t: number) => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t] as const
  const [ix, iy] = p(at(S1 - 3))
  const tv = at(S1 + 4)
  const [ox, oy] = p(tv)
  return (
    <>
      <line x1={x0} y1={y0} x2={ix} y2={iy} {...vodSvetle} />
      <line x1={ox} y1={oy} x2={x1} y2={y1} {...car} strokeDashoffset={(tv * len) % 10} />
    </>
  )
}

export const JednaZmenaNaraz: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 640">
    {/* Pointa kresby (9.2 p. 3) je jedna: měníme jednu dávku naráz. */}
    <text className="sv-val" x="40" y="40" style={{ fontSize: 24 }}>Jedna změna naráz</text>
    <text className="sv-lbl" x="40" y="68">Písčitá zahrada</text>

    {/* ── pohled shora: jeden pás, dvě plochy ──────────────────── */}
    <text className="sv-lbl" x={X0} y={PY0 - 12}>Pohled shora</text>
    <rect x={X0} y={PY0} width={X1 - X0} height={PY1 - PY0} fill="#3f7d4e" fillOpacity="0.35" />
    <g fill="none" stroke="#3f7d4e" strokeWidth="1.6" strokeLinecap="round" opacity="0.8">
      {[X0, XD].map((px) => TRSY.map(([tx, ty]) => <Trs key={`${px}-${tx}-${ty}`} x={px + tx} y={PY0 + ty} />))}
    </g>
    <line x1={XD} y1={PY0} x2={XD} y2={PY1} stroke="#232830" strokeWidth="1.6" />
    <path d={`M${X0} ${PY0} H${X1} V${PY1} H${X0} Z`} {...obrys} />
    <text className="sv-val" x={X0 + HW / 2} y={(PY0 + PY1) / 2 + 7} textAnchor="middle">A</text>
    <text className="sv-val" x={XD + HW / 2} y={(PY0 + PY1) / 2 + 7} textAnchor="middle">B</text>

    {/* ── promítnutí půdorysu do řezu ─────────────────────────── */}
    <g {...car}>
      {[X0, XD, X1].map((x) => <line key={x} x1={x} y1={PY1 + 8} x2={x} y2={S0 - 8} />)}
    </g>

    {/* tagy ploch v ose své poloviny: tag B končí 2. řádkem 12 nad řezem,
        tag A stojí na účaří 1. řádku B (37 nad řezem) */}
    <g textAnchor="middle">
      <text className="sv-lbl" x={X0 + HW / 2} y={Y_H1}>A · Výchozí směs</text>
      <text className="sv-lbl" x={XD + HW / 2} y={Y_H1}>B · Víc biocharu</text>
      <text className="sv-lbl" x={XD + HW / 2} y={Y_H2}>na úkor základu</text>
    </g>

    {/* ── stupnice řezu ───────────────────────────────────────── */}
    <line x1="62" y1={S0} x2="62" y2={S1} {...car} />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="56" y1={S0} x2="68" y2={S0} />
      <line x1="56" y1={S1} x2="68" y2={S1} />
    </g>
    <text className="sv-val" x="50" y={S0 + 5} textAnchor="end">0 cm</text>
    <text className="sv-val" x="50" y={S1 + 5} textAnchor="end">10</text>

    {/* ── řez horní vrstvou obou ploch: písčitá zemina ─────────── */}
    <rect x={X0} y={S0} width={X1 - X0} height={S1 - S0} {...PISCITA} />
    {[X0, XD].map((px) =>
      SPOLECNE.map(([d, rx, ry], i) => <Znacka key={`${px}-${i}`} d={d} x={px + rx} y={S0 + ry} />),
    )}
    {NAVIC.map(([d, rx, ry], i) => (
      <Znacka key={`n${i}`} d={d} x={XD + rx} y={S0 + ry} />
    ))}
    {PRSTENCE.map(([cx, cy]) => (
      <Prstenec key={`${cx}-${cy}`} cx={XD + cx} cy={S0 + cy} />
    ))}
    <line x1={XD} y1={S0} x2={XD} y2={S1} stroke="#232830" strokeWidth="1.6" />
    <path d={`M${X0} ${S0} H${X1} V${S1} H${X0} Z`} {...obrys} />

    {/* ostatní příměsi beze změny: rameno do A i do B k témuž zeolitu u dna
        (3,7 pod jeho rámcem) */}
    <Rameno x0={X0 + 97} y0={S1 - 6.5} x1={262} y1={R1 - 22} />
    <Rameno x0={XD + 97} y0={S1 - 6.5} x1={308} y1={R1 - 22} />
    <text className="sv-lbl" x={XD} y={R1} textAnchor="middle">Ostatní příměsi beze změny</text>

    {/* ── legenda: mřížka klíčů x 30 / 190 / 350, text o 36 dál ───── */}
    <line x1="30" y1={LEG} x2="490" y2={LEG} {...car} />
    <Cip x={30} y={L1 - 12} />
    <text className="sv-val" x="66" y={L1}>základ</text>
    <Znacka d="b1" x={200} y={L1 - 5.5} />
    <text className="sv-val" x="226" y={L1}>biochar</text>
    <Cip x={350} y={L1 - 12}>
      <Znacka d="a1" x={364} y={L1 - 5} />
    </Cip>
    <text className="sv-val" x="386" y={L1}>Actino</text>
    {/* 2. řádek: zeolit na čipu a přidaný biochar na políčku 28 × 28,
        střed značky x+14, L2 − 5 */}
    <Cip x={30} y={L2 - 12}>
      <Znacka d="z" x={40} y={L2 - 8} />
    </Cip>
    <text className="sv-val" x="66" y={L2}>zeolit</text>
    <Cip x={190} y={L2 - 19} h={28}>
      <Znacka d="b1" x={200} y={L2 - 5.5} />
      <Prstenec cx={204} cy={L2 - 5} />
    </Cip>
    <text className="sv-val" x="226" y={L2}>přidaný biochar</text>
  </svg>
)
