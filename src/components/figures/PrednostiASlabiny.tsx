import React from 'react'

/**
 * Přednosti a slabiny (DESIGN.md 9.2) — tři váhy, jedna pro každou půdu.
 * Pointa je jedna (i25): zachovat přednosti, napravit jen slabinu. Nese ji
 * tvar, ne tabulka: vahadlo každé půdy převažuje na straně její přednosti.
 * Levá miska = voda a živiny, pravá = vzduch a odtok (záhlaví sloupců).
 * Jíl převažuje vlevo (drží vodu a živiny, i24 v3), vzduch a odtok mu
 * chybí (i22p1, i28p1); písčitá půda převažuje vpravo (propustnost
 * a vzduch, i43 v3), chybí jí zásoba vody a živin (i22p1, i43 v3–v4).
 * Fungující hlína je v rovnováze, autor jí říká „vyvážený základ" (i22p1,
 * i24 v2) a nenapravuje se nic (i23 v2, i27 v5); podmínka stojí ve jméně,
 * protože hlinitý příklad tabulky dávek je těžší hlína k úpravě (i27 v3).
 * Pod těžší miskou fajfka „zachovat" (nic z ní neubírat, jíl neodvážet,
 * i24 v3), pod lehčí šipka dolů „napravit" (tu stranu doplnit, i44).
 * Náklon je schéma, ne měření: u jílu i písku stejný (±20 na konci
 * vahadla 160), bez čísel a stupnice. Krátká čárkovaná vodorovná u osy
 * je konstrukční linka rovnováhy (u hlíny ji kryje vahadlo). Žádné kapky,
 * zrna v řezu ani akcent: kresba nevysvětluje mechanismus (`dve-zahrady`).
 *
 * Značky půd (9.2 p. 10), žádná nová: vzorek = kruh r 26, výplň přes
 * `fillOpacity`, obrys #232830 1,6, tedy vzorky `myko-podle-navodu` (E9)
 * v barevném klíči E7. Jílovitá půda = zemina #6b5138 op .9 plošně
 * (E9 „jílovitá", v E7 „původní zemina"). Fungující hlína = táž zemina
 * s drobty: dlaždice 12 × 12 pixelově shodná s `hpm-hlina`
 * (`hlina-prace-misto-materialu`, E5 — tam právě fungující hlína),
 * počátek v rohu vzorku. Jíl a hlína se tak liší viditelnou strukturou
 * a hlína z E1b se nespojuje s plochou zeminou sloupce „Těžší hlína"
 * v E7 (hlína k úpravě, i27 v3). Písčitá půda = okrová #c2a052 op .45
 * (E9 „písčitá", v E7 sloupec „původní písčitá zemina"); čip 28 × 14
 * z legendy E7 („přidaný písek", op .55 se zrny) kresba nemá. Vzorek je
 * osou vahadla, ramena začínají na jeho obrysu. Fajfka #047857 (tah 2,4,
 * `hlava-na-hlavu`) vždy se slovem, na krémovém panelu (9.2). Vahadlo
 * (tah 2), závěsy, misky a stojan jsou obrysové #232830 bez výplně.
 *
 * Portrétová sazba 520 × 640, id s prefixem `pas-`. Horní hrany řádků
 * 52 / 214 / 356: nakloněná váha je o 20 vyšší než vodorovná, protože
 * těžší miska visí níž. V řádku: jméno (sv-lbl) na středu +20, osa +58,
 * popisky 26 pod dnem těžší misky (v rovnováze pod oběma), lehčí strana
 * na témž účaří. Sloupce misek x 100 / 420. Sazba 18/21 (měřeno,
 * ≤ 385 px): „Vzduch a odtok" končí na x ≈ 507, „zachovat" vpravo na
 * ≈ 482, jména půd leží v 174–346 mimo sloupce popisků (61–162
 * a 382–482). Popisek → jméno dalšího řádku ≥ 16, dno misky → popisek
 * ≥ 7, hrot šipky → „napravit" ≈ 8, fajfka → slovo 6.
 * Pointa dole za čárkovanou linkou jako v `myko-podle-navodu`. Statická
 * kresba.
 */

// ── sloupce misek a vahadlo ──────────────────────────────────
const OSA_X = 260
const SLOUPEC = [100, 420] as const // levá miska: voda a živiny · pravá: vzduch a odtok
const L = 160 // polovina vahadla
const NAKLON = 20 // svislý posun konce vahadla (schéma)
const R = 26 // vzorek = osa vah (jako `myko-podle-navodu`)
const ZAVES = 34 // závěs misky
const MISKA = 28 // polovina šířky misky (okraj)
const ZAVES_X = 18 // úchyt závěsu na okraji misky

// ── řádky ────────────────────────────────────────────────────
const Y_ZAHLAVI = 28
const Y_LINKA = 42
// horní hrany řádků: nakloněné váhy potřebují o 20 víc než vodorovná (těžší miska visí níž)
const Y_RADKY = [52, 214, 356] as const
const JMENO = 20 // účaří jména pod horní hranou řádku
const OSA = 58 // střed vzorku (osa vah)
const HLOUBKA = 6 // prohnutí misky
const POD_MISKOU = 26 // dno těžší (v rovnováze obou) misky → účaří popisků
const ZAVER = 528 // čárkovaná linka nad pointou

type Puda = {
  id: 'jil' | 'hlina' | 'pisek'
  jmeno: string
  /** +1 převažuje vlevo (voda a živiny), −1 vpravo (vzduch a odtok), 0 rovnováha */
  naklon: 1 | 0 | -1
}

const PUDY: Puda[] = [
  { id: 'jil', jmeno: 'Jílovitá půda', naklon: 1 },
  { id: 'hlina', jmeno: 'Fungující hlína', naklon: 0 },
  { id: 'pisek', jmeno: 'Písčitá půda', naklon: -1 },
]

// barevný klíč série (E7 `zaklad-tri-zahrad`, E9 `myko-podle-navodu`)
const ZEMINA = { fill: '#6b5138', fillOpacity: 0.9 } as const
const PISCITA = { fill: '#c2a052', fillOpacity: 0.45 } as const

const TAH = { stroke: '#232830', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const
const konstr = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const

const r1 = (n: number) => Math.round(n * 10) / 10
const yRadku = (i: number) => Y_RADKY[i]

/** Fajfka „zachovat" (`hlava-na-hlavu`) vlevo od slova; x = levý okraj. */
const Fajfka: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <path d={`M${x} ${y - 6} l5 6 9 -12`} fill="none" stroke="#047857" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
)

/** Váha jedné půdy: vzorek jako osa, ramena, závěsy, misky, stojan, popisky. */
const Vaha: React.FC<{ p: Puda; y0: number }> = ({ p, y0 }) => {
  const cy = y0 + OSA
  const a = p.naklon === 0 ? 0 : Math.asin(NAKLON / L)
  const cos = Math.cos(a)
  const sin = Math.sin(a) * p.naklon // + = levý konec níž
  // konce vahadla: levý (voda a živiny), pravý (vzduch a odtok)
  const konce = [
    { x: r1(OSA_X - L * cos), y: r1(cy + L * sin) },
    { x: r1(OSA_X + L * cos), y: r1(cy - L * sin) },
  ]
  const zacatky = [
    { x: r1(OSA_X - R * cos), y: r1(cy + R * sin) },
    { x: r1(OSA_X + R * cos), y: r1(cy - R * sin) },
  ]
  // popisky visí pod těžší miskou (v rovnováze pod oběma), lehčí strana na témž účaří
  const yP = r1(cy + L * Math.sin(a) + ZAVES + HLOUBKA + POD_MISKOU)
  // strana 0/1: těžší = zachovat, lehčí = napravit; v rovnováze obě zachovat
  const tezsi = p.naklon === 1 ? 0 : p.naklon === -1 ? 1 : null

  return (
    <g>
      {/* jméno půdy nad vahou */}
      <text className="sv-lbl" x={OSA_X} y={y0 + JMENO} textAnchor="middle">{p.jmeno}</text>

      {/* konstrukční vodorovná = rovnováha; přerušená kolem vzorku */}
      <line x1="150" y1={cy} x2={OSA_X - R - 6} y2={cy} {...konstr} />
      <line x1={OSA_X + R + 6} y1={cy} x2="370" y2={cy} {...konstr} />

      {/* stojan pod osou */}
      <path d={`M${OSA_X} ${cy + R} V${cy + 46} M${OSA_X - 20} ${cy + 46} H${OSA_X + 20}`} {...TAH} />

      {/* ramena vahadla od obrysu vzorku ke koncům, závěsy a misky */}
      {konce.map((k, s) => (
        <g key={s}>
          <line x1={zacatky[s].x} y1={zacatky[s].y} x2={k.x} y2={k.y} {...TAH} strokeWidth="2" />
          <path d={`M${k.x - ZAVES_X} ${k.y + ZAVES} L${k.x} ${k.y} L${k.x + ZAVES_X} ${k.y + ZAVES}`} {...TAH} />
          <path d={`M${k.x - MISKA} ${k.y + ZAVES} H${k.x + MISKA} Q${k.x} ${k.y + ZAVES + 2 * HLOUBKA} ${k.x - MISKA} ${k.y + ZAVES} Z`} {...TAH} />
        </g>
      ))}

      {/* vzorek půdy = osa vah: kruh jako vzorky `myko-podle-navodu`,
          fungující hlína navíc s drobty jako `hpm-hlina` */}
      <circle cx={OSA_X} cy={cy} r={R} {...(p.id === 'pisek' ? PISCITA : ZEMINA)} />
      {p.id === 'hlina' ? <circle cx={OSA_X} cy={cy} r={R} fill="url(#pas-hlina)" /> : null}
      <circle cx={OSA_X} cy={cy} r={R} {...TAH} />

      {/* popisky misek: těžší strana zachovat, lehčí napravit */}
      {SLOUPEC.map((x, s) => {
        const miskaDno = konce[s].y + ZAVES + HLOUBKA
        if (tezsi === null || tezsi === s) {
          return (
            <g key={s}>
              <Fajfka x={x - 44} y={yP - 1} />
              <text className="sv-val" x={x - 24} y={yP}>zachovat</text>
            </g>
          )
        }
        const y1 = miskaDno + 8
        const y2 = yP - 26
        return (
          <g key={s}>
            <path d={`M${x} ${y1} V${y2} M${x - 5} ${y2 - 8} l5 8 5 -8`} {...TAH} />
            <text className="sv-val" x={x} y={yP} textAnchor="middle">napravit</text>
          </g>
        )
      })}
    </g>
  )
}

export const PrednostiASlabiny: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 640">
    <defs>
      {/* Drobty hlíny — dlaždice pixelově shodná s `hpm-hlina` (E5);
          počátek v levém horním rohu vzorku jako tam v rohu výřezu. */}
      <pattern id="pas-hlina" x={OSA_X - R} y={yRadku(1) + OSA - R} width="12" height="12" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.2" fill="#54402c" />
        <circle cx="9" cy="8" r="2.4" fill="#6b5138" />
        <circle cx="4" cy="9.5" r="1" fill="#54402c" />
      </pattern>
    </defs>

    {/* ── záhlaví: co leží na které misce ─────────────────────── */}
    <text className="sv-lbl" x={SLOUPEC[0]} y={Y_ZAHLAVI} textAnchor="middle">Voda a živiny</text>
    <text className="sv-lbl" x={SLOUPEC[1]} y={Y_ZAHLAVI} textAnchor="middle">Vzduch a odtok</text>
    <line x1="30" y1={Y_LINKA} x2="490" y2={Y_LINKA} {...konstr} />

    {/* ── tři váhy: převažuje přednost, lehčí strana se napraví ── */}
    {PUDY.map((p, i) => (
      <Vaha key={p.id} p={p} y0={yRadku(i)} />
    ))}

    {/* ── pointa (9.2 p. 3) za čárkovanou linkou jako závěr ───── */}
    <line x1="30" y1={ZAVER} x2="490" y2={ZAVER} {...konstr} />
    <text className="sv-val" x="30" y={ZAVER + 52} style={{ fontSize: 24 }}>Zachovat přednosti</text>
    <text className="sv-lbl" x="30" y={ZAVER + 80}>Napravit jen slabinu</text>
  </svg>
)
