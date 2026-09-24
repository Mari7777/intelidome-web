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
 * poloviny řezu mají TOTÉŽ pole značek na týchž místech; B navíc polovinu
 * střípků biocharu (12 → 18) a každý přidaný střípek nese čárkovaný
 * prstenec (pomocná kružnice 9.2 p. 2, #d5d3cc; r 8, pět period
 * 3 / 7,05 = obvod). V A je na týchž místech čistý základ:
 * přidaný biochar zabral místo základu. Poměr biochar : Actino : zeolit
 * = 12 : 12 : 6 (2 : 2 : 1 jako `mh-plna`). Žádná čísla dávek, žádné
 * stoprocentní sloupce (nese je tabulka nad splitem), žádný akcent — nic
 * tu není voda.
 *
 * Minerální základ je holá zemina #6b5138 op .9 jako v celé sérii
 * (`kontrola-sondou`, `michani-od-hloubky`, `tri-zony`: „základ = vaše
 * zemina, případně její směs s pískem"). Písek je součástí základu (i52),
 * proto řez zrna písku NEMÁ: stála by v A i v B beze změny, zatímco základ
 * v B ubývá, a kresba by o písku tvrdila dvě opačné věci. Ramena „Ostatní
 * příměsi beze změny" (slova autora, i56 v2) míří jen na zeolit u dna,
 * nejkontrastnější příměs (Actino na zemině skoro nevidět, 1,7 : 1);
 * začínají 3,7 pod jeho rámcem.
 *
 * Značky jsou pixelově shodné se sérií (9.2 p. 10): biochar, Actino
 * a zeolit z `mh-plna` / `ks-` (kreslí je `Znacka`, i v legendě).
 * Rozmístění v řezu je spočtené předem (změřeno getBBox): mezi rámci
 * značek ≥ 7, k vnitřní hraně obrysu i dělicí čáry ≥ 3,7, prstenec od
 * cizích značek ≥ 2,7, přidaný střípek od nich ≥ 7.
 *
 * Legenda je mřížka tří sloupců (klíč 28 široký na x 30 / 190 / 350, text
 * o 36 dál). 1. řádek: základ jako čip 28 × 14 s ostrými rohy a obrysem
 * hmoty (tatáž výplň a obrys jako řez) · biochar · Actino na krému.
 * 2. řádek: světlé značky na zemině s obrysem, jak leží v řezu (na krému
 * by #d5d3cc zmizel, 1,37 : 1). Zeolit na čipu zeminy 28 × 14 jako
 * v `koren-zacina-nahore` (zrno na x+10 / y+4 od rohu čipu); přidaný
 * biochar s prstencem na políčku 28 × 28, protože prstenec r 8 (17,6
 * i s tahem) se do výšky 14 nevejde — v políčku má k vnitřní hraně
 * obrysu všude 4,4. Obě značky mají střed na L2 − 5.
 *
 * Měřítko řezu 12 px na cm, ne 8 jako `kontrola-sondou`: řez má jen 10 cm
 * a při 8 px/cm by v panelu 640 zůstalo ~130 jednotek prázdných pásů
 * a řez by nevážil víc než pohled shora. Stupnice 0 / 10 cm to nese.
 *
 * Portrétová sazba 520 × 640, id s prefixem `jzn-` (kresba žádné id nemá).
 * Tagy ploch stojí v ose své poloviny; tag B končí druhým řádkem 12 nad
 * řezem, tag A stojí na účaří prvního řádku B (37 nad řezem).
 * „Na úkor základu" je druhý řádek tagu B, ne popisek pod řezem
 * (tam by se s „ostatní příměsi beze změny" četl jako jedna věta). Mobilní
 * sazba 18/21 jednotek: tagy A 93–272, B 301–474, „na úkor základu"
 * 294–481, od promítacích linek ≥ 8; řádky tagu B mají rozteč 25 (mezi
 * rámci getBBox 4,8); „Ostatní příměsi beze změny" 134–436, ramena končí
 * 6,4 nad jeho rámcem; nejdelší text legendy „přidaný biochar" končí na
 * 373; nic nepřesahuje 0..520. Statická kresba.
 */

type Druh = 'b1' | 'b2' | 'a1' | 'a2' | 'z'

/** Jedna značka příměsi — tytéž tvary jako `mh-plna`, `mh-zeolit` a `Znacka`
 *  v `kontrola-sondou` (9.2 p. 10). */
const Znacka: React.FC<{ d: Druh; x: number; y: number }> = ({ d, x, y }) => {
  if (d === 'b1') return <path d={`M${x} ${y} l5 -3 3 4 -4 3 z`} fill="#12161b" opacity="0.9" />
  if (d === 'b2') return <path d={`M${x} ${y} l5 -2 2 4 -4 3 z`} fill="#12161b" opacity="0.9" />
  if (d === 'a1') return <circle cx={x} cy={y} r="2.6" fill="#54402c" />
  if (d === 'a2') return <circle cx={x} cy={y} r="2.2" fill="#54402c" />
  return <path d={`M${x} ${y} l5 -2 4 3 -1 5 -5 2 -4 -3 z`} fill="#d5d3cc" stroke="#232830" strokeWidth="1.6" />
}

/** Pole společné oběma polovinám řezu (rel. k levému hornímu rohu poloviny
 *  205 × 120). Na začátku zeolit u dna pro ramena „ostatní příměsi beze
 *  změny"; místa prstenců z B zůstávají v A čistým základem. */
const SPOLECNE: [Druh, number, number][] = [
  ['z', 92, 101], ['b1', 10.5, 11.5], ['a2', 193.5, 31], ['a1', 110, 10.5], ['b2', 4.5, 89], ['b1', 186.5, 103.5],
  ['a1', 197.5, 66], ['z', 9, 46], ['a1', 150, 106.5], ['b1', 83.5, 73], ['b1', 159, 37.5], ['z', 39, 13],
  ['a1', 123, 82], ['a2', 39, 78.5], ['b2', 32.5, 54.5], ['z', 61.5, 33.5], ['b1', 12, 70], ['b2', 67, 107.5],
  ['a2', 130, 106], ['b2', 124, 60.5], ['b2', 5, 27], ['z', 124, 8.5], ['b2', 40, 37], ['z', 163, 105],
  ['a2', 194, 85], ['b1', 141, 40.5], ['a1', 164, 57.5], ['a2', 180, 17], ['a1', 78.5, 87.5], ['a1', 165, 76],
]
/** Prstence střípků navíc v B (střed rámce střípku = střed prstence). */
const PRSTENCE: [number, number][] = [[28, 30], [86, 58], [146, 26], [180, 80], [40, 94], [136, 92]]
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
const L1 = LEG + 32 // 578 — účaří 1. řádku legendy (hmota a tmavé značky)
const L2 = LEG + 66 // 612 — účaří 2. řádku (světlé značky na zemině)
const PRST_R = 8

const car = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const
const obrys = { fill: 'none', stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const

/** Trs trávy shora: dvojice krátkých svislých čárek (mapová značka louky). */
const Trs: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <path d={`M${x} ${y} v-5 M${x + 4} ${y + 1} v-6`} />
)

/** Prstenec kolem střípku navíc: konstrukční linka #d5d3cc (pomocná
 *  kružnice 9.2 p. 2); 5 period 3 / 7,05 = obvod 2π·8. */
const Prstenec: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <circle cx={cx} cy={cy} r={PRST_R} fill="none" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7.05" strokeLinecap="round" />
)

/** Čip zeminy 28 × 14: tatáž výplň a obrys jako hmota řezu; světlá
 *  značka (zeolit) leží mezi výplní a obrysem. */
const Cip: React.FC<{ x: number; y: number; children?: React.ReactNode }> = ({ x, y, children }) => (
  <>
    <rect x={x} y={y} width="28" height="14" fill="#6b5138" opacity="0.9" />
    {children}
    <path d={`M${x} ${y} H${x + 28} V${y + 14} H${x} Z`} {...obrys} />
  </>
)

/** Políčko zeminy 28 × 28 jen pod přidaným biocharem: prstenec r 8 se do
 *  čipu 28 × 14 nevejde; tatáž půda a obrys jako v řezu. */
const Policko: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => (
  <>
    <rect x={x} y={y} width="28" height="28" fill="#6b5138" opacity="0.9" />
    {children}
    <path d={`M${x} ${y} H${x + 28} V${y + 28} H${x} Z`} {...obrys} />
  </>
)

export const JednaZmenaNaraz: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 640">
    {/* Pointa kresby (9.2 p. 3) je jedna: měníme jednu dávku naráz. */}
    <text className="sv-val" x="40" y="40" style={{ fontSize: 24 }}>Jedna změna naráz</text>

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

    {/* ── řez horní vrstvou obou ploch ────────────────────────── */}
    <rect x={X0} y={S0} width={X1 - X0} height={S1 - S0} fill="#6b5138" opacity="0.9" />
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
        (3,7 pod jeho rámcem); čárkování začíná na cíli, aby rameno končilo
        přesně u zrna */}
    <line x1={X0 + 97} y1={S1 - 6.5} x2="262" y2={R1 - 22} {...car} />
    <line x1={XD + 97} y1={S1 - 6.5} x2="308" y2={R1 - 22} {...car} />
    <text className="sv-lbl" x={XD} y={R1} textAnchor="middle">Ostatní příměsi beze změny</text>

    {/* ── legenda: mřížka klíčů x 30 / 190 / 350, text o 36 dál ───── */}
    <line x1="30" y1={LEG} x2="490" y2={LEG} {...car} />
    <Cip x={30} y={L1 - 12} />
    <text className="sv-val" x="66" y={L1}>základ</text>
    <Znacka d="b1" x={200} y={L1 - 5.5} />
    <text className="sv-val" x="226" y={L1}>biochar</text>
    <Znacka d="a1" x={364} y={L1 - 5} />
    <text className="sv-val" x="386" y={L1}>Actino</text>
    {/* 2. řádek: světlé značky na zemině, střed x+14, L2 − 5 */}
    <Cip x={30} y={L2 - 12}>
      <Znacka d="z" x={40} y={L2 - 8} />
    </Cip>
    <text className="sv-val" x="66" y={L2}>zeolit</text>
    <Policko x={190} y={L2 - 19}>
      <Znacka d="b1" x={200} y={L2 - 5.5} />
      <Prstenec cx={204} cy={L2 - 5} />
    </Policko>
    <text className="sv-val" x="226" y={L2}>přidaný biochar</text>
  </svg>
)
