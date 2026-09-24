import React from 'react'

/**
 * Kolik písku do jílu (DESIGN.md 9.2) — u jílu rozhoduje velký podíl
 * písku, pár lopat vrstvu nezmění (i32, i29, i31). Svislá škála 0–100 %
 * podílu přidaného písku v MINERÁLNÍM ZÁKLADU (příměsi si berou podíl
 * zvlášť — i31) a vpravo od ní tři vzorky směsi, každý ve výšce své
 * polohy (střed vzorku = poloha na škále, vodítko 3 7 k ní): těsně nad
 * nulou pár lopat, na 65 výchozí návrh, u úseku 75–100 těžké jíly.
 * Poloha nese hodnotu, šířka vzorku nic neznamená — kresba se tak nečte
 * jako 100% pruh z `zaklad-tri-zahrad` (E7) ani jako vodorovná škála
 * se značkami z `nejblizsi-priklad` (E1).
 *
 * Pointa je jedna: 65 % (24 px) přímo u svého vzorku. U 65 % se převrátí
 * matrice — nosnou hmotou je písek a vzorek má značku „nové směsi" z E2
 * (i29). Čísla jen z textu autora: 65 % (i28p2, i32), 75 % a víc u těžkých
 * jílů podle podkladů (i32). „Pár lopat" číslo nemá: kroužek stojí kousek
 * nad ryskou 0 (3 %) bez hodnoty. Hustota teček je schéma, ne měření.
 *
 * Značky hmot ze série (9.2 p. 10), žádná nová:
 * – nová směs = `jil-jako-vana` / `slehnuti-vstupu`: okrový podklad
 *   #c2a052 op .55 a hnědé tečky zeminy #6b5138 op .9 r 2,2 / 2,4 / 2,6,
 *   rozteč 8, ≥ 3 od vnitřní hrany obrysu, pevně nasetý rozsyp
 *   (mulberry32). Vzorek 65 % je nasycený jako tam; vzorek 75 % a víc
 *   je táž značka s úměrně méně tečkami (20/35 počtu, zeminy ubylo).
 * – pár lopat = jílovitá zemina #6b5138 op .9 se zrny písku `dz-pisek`
 *   (#c2a052 plně, r 2,4 / 2). Zrn je 5 (pokrytí ≈ 1,7 %), viditelně
 *   řidší než „přimíchaný písek" v `dve-zahrady` (4,5 %).
 * – legenda: čip „nová směs" pixelově shodný s legendou `jil-jako-vana`,
 *   čip „původní zemina" jako `zaklad-tri-zahrad`, zrno „písek" jako
 *   `dve-zahrady`.
 *
 * Značky polohy na ose: plná tečka = 65 (návrh), kroužek = pár lopat
 * (bez čísla), plná úsečka mezi ryskami 75 a 100 = rozmezí podkladů.
 * Osa se kolem značek přerušuje, aby jimi neprocházely čárky.
 *
 * Popisky vzorků mají rukopis série. Pořadí hodnota nad popiskem má jen
 * pointa („65 %" 24 px, pod ní `.sv-lbl`, vzor bloku pointy `jil-jako-vana`).
 * Ostatní dvě skupiny jsou štítky jako STITKY v `jil-jako-vana`: nahoře
 * hmota nebo jev (`.sv-lbl`), pod ním vlastnost (`.sv-val`), rozteč 27.
 * Pointa je tak jediná skupina, která začíná číslem. Vodítko míří na
 * výšku prvního řádku každé skupiny.
 *
 * Sazba: portrét 520 × 600, levá hrana textů x 30 (titulek, legenda,
 * závěr), čísla osy zarovnaná doprava na x 50. Jednotky jen v `.sv-val`
 * (a v pointě 24 px), nikdy v `.sv-lbl`. Popisky vzorků začínají na
 * x 196; nejširší „těžké jíly podle podkladů" končí v sazbě 18/21 na
 * x ≈ 490 (panel 520). Mezi rámci textů i text × tvar zůstává ve všech
 * sazbách ≥ 4 jednotky. Bez akcentu, bez id (defs nemá; prefix `kpj-`).
 * Statická kresba.
 */

// ── škála ────────────────────────────────────────────────────────
const X_OSA = 62
const Y0 = 440 // 0 %
const PX = 3.6 // jednotek na 1 %
const yPct = (p: number) => Math.round((Y0 - p * PX) * 10) / 10
const Y_PAR = yPct(3) // 429,2 — pár lopat: těsně nad nulou, bez čísla
const Y_65 = yPct(65) // 206
const Y_75 = yPct(75) // 170
const Y_100 = yPct(100) // 80
const Y_TEZKE = (Y_75 + Y_100) / 2 // 125 — střed rozmezí podkladů
const R_ZNACKA = 5

// ── vzorky ───────────────────────────────────────────────────────
const VX = 100 // levá hrana vzorků
const VW = 80
const VH = 56
const X_TEXT = 196 // popisky vzorků
const LEG = 482 // linka legendy

type Tecka = { x: number; y: number; r: number }
const d1 = (n: number) => Math.round(n * 10) / 10

/** mulberry32 — týž generátor jako `slehnuti-vstupu` a `jil-jako-vana`. */
const rng = (seed: number) => {
  let s = seed
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Tečky zeminy ve vzorku (souřadnice vzorku 0..VW × 0..VH): házení šipek
 *  s roztečí 8, okraj = půl tahu obrysu + mezera 3 + poloměr (vzor
 *  `slehnuti-vstupu`). `n` omezí počet, jinak do nasycení. */
const tecky = (seed: number, n = Infinity): Tecka[] => {
  const rnd = rng(seed)
  const ROZTEC = 8
  const out: Tecka[] = []
  for (let i = 0; i < 6000 && out.length < n; i++) {
    const r = [2.2, 2.4, 2.6][Math.floor(rnd() * 3)]
    const okraj = 0.8 + 3 + r
    const x = d1(okraj + rnd() * (VW - 2 * okraj))
    const y = d1(okraj + rnd() * (VH - 2 * okraj))
    if (out.every((t) => (t.x - x) ** 2 + (t.y - y) ** 2 >= ROZTEC ** 2)) out.push({ x, y, r })
  }
  return out
}

const SMES_65 = tecky(0x6b65)
/** 75 % a víc: zeminy zbývá 20 dílů místo 35 → úměrně méně teček. */
const SMES_80 = tecky(0x6b80, Math.round((SMES_65.length * 20) / 35))

/** Pár lopat: 5 zrn `dz-pisek` rozprostřených ve vzorku (ručně, ≥ 3 od hran). */
const PAR_LOPAT: Tecka[] = [
  { x: 15, y: 14, r: 2.4 },
  { x: 50, y: 10, r: 2 },
  { x: 67, y: 33, r: 2.4 },
  { x: 31, y: 40, r: 2 },
  { x: 55, y: 47, r: 2 },
]

/** Tečky jednou cestou (dva oblouky na kruh, vzor `slehnuti-vstupu`). */
const cesta = (t: Tecka[], y: number) =>
  t
    .map(({ x, y: ty, r }) => `M${d1(VX + x - r)} ${d1(y - VH / 2 + ty)}a${r} ${r} 0 1 0 ${d1(2 * r)} 0a${r} ${r} 0 1 0 ${d1(-2 * r)} 0Z`)
    .join('')

const PISEK = { fill: '#c2a052', opacity: 0.55 } as const
const ZEMINA = { fill: '#6b5138', opacity: 0.9 } as const
const TAH = { stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
const obrys = { fill: 'none', ...TAH } as const
const konstrukce = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const

/** Vzorek: výplň, značky, uzavřený obrys (9.2 p. 9). Střed ve výšce `y`. */
const Vzorek: React.FC<{ y: number; children: React.ReactNode }> = ({ y, children }) => (
  <g>
    {children}
    <rect x={VX} y={y - VH / 2} width={VW} height={VH} {...obrys} />
  </g>
)

export const KolikPiskuDoJilu: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 600">
    <text className="sv-lbl" x="30" y="34">Přidaný písek v minerálním základu</text>

    {/* ── škála: 0 dole, 100 nahoře; osa se přerušuje kolem značek ── */}
    <g {...konstrukce}>
      <line x1={X_OSA} y1={Y_PAR - R_ZNACKA - 4} x2={X_OSA} y2={Y_65 + R_ZNACKA + 4} />
      <line x1={X_OSA} y1={Y_65 - R_ZNACKA - 4} x2={X_OSA} y2={Y_75} />
    </g>
    {/* rozmezí podkladů 75–100 % — plná úsečka mezi ryskami */}
    <line x1={X_OSA} y1={Y_75} x2={X_OSA} y2={Y_100} stroke="#232830" strokeWidth="2.4" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      {[0, 50, 75, 100].map((p) => (
        <line key={p} x1={X_OSA - 6} y1={yPct(p)} x2={X_OSA + 6} y2={yPct(p)} />
      ))}
    </g>
    <g textAnchor="end">
      <text className="sv-val" x="50" y={yPct(100) + 5}>100</text>
      <text className="sv-val" x="50" y={yPct(75) + 5}>75</text>
      <text className="sv-val" x="50" y={yPct(50) + 5}>50</text>
      <text className="sv-val" x="50" y={yPct(0) + 5}>0 %</text>
    </g>
    <circle cx={X_OSA} cy={Y_65} r={R_ZNACKA} fill="#232830" />
    <circle cx={X_OSA} cy={Y_PAR} r={R_ZNACKA} fill="none" stroke="#232830" strokeWidth="1.6" />

    {/* vodítka: poloha na ose → střed vzorku */}
    <g {...konstrukce}>
      <line x1={X_OSA + 6} y1={Y_TEZKE} x2={VX - 5} y2={Y_TEZKE} />
      <line x1={X_OSA + R_ZNACKA + 5} y1={Y_65} x2={VX - 5} y2={Y_65} />
      <line x1={X_OSA + R_ZNACKA + 5} y1={Y_PAR} x2={VX - 5} y2={Y_PAR} />
    </g>

    {/* ── vzorky ───────────────────────────────────────────────── */}
    {/* 75 % a víc: nová směs, zeminy ještě méně */}
    <Vzorek y={Y_TEZKE}>
      <rect x={VX} y={Y_TEZKE - VH / 2} width={VW} height={VH} {...PISEK} />
      <path d={cesta(SMES_80, Y_TEZKE)} {...ZEMINA} />
    </Vzorek>
    {/* štítek: jev nahoře (výška vodítka), hodnota pod ním */}
    <text className="sv-lbl" x={X_TEXT} y={Y_TEZKE + 5}>těžké jíly podle podkladů</text>
    <text className="sv-val" x={X_TEXT} y={Y_TEZKE + 32}>75 % a víc</text>

    {/* 65 %: matrice se převrátila — nosná je okrová, zemina jen v tečkách */}
    <Vzorek y={Y_65}>
      <rect x={VX} y={Y_65 - VH / 2} width={VW} height={VH} {...PISEK} />
      <path d={cesta(SMES_65, Y_65)} {...ZEMINA} />
    </Vzorek>
    {/* Pointa kresby (9.2 p. 3) je jedna: výchozí návrh 65 %. Jen ona
        začíná číslem; střed číslic 24 px leží ve výšce vodítka. */}
    <text className="sv-val" x={X_TEXT} y={Y_65 + 8} style={{ fontSize: 24 }}>65 %</text>
    <text className="sv-lbl" x={X_TEXT} y={Y_65 + 33}>výchozí návrh pro jíl</text>

    {/* pár lopat: pořád hnědá jílovitá zemina, zrna osamocená */}
    <Vzorek y={Y_PAR}>
      <rect x={VX} y={Y_PAR - VH / 2} width={VW} height={VH} {...ZEMINA} />
      <g fill="#c2a052">
        {PAR_LOPAT.map((z) => (
          <circle key={`${z.x}-${z.y}`} cx={VX + z.x} cy={d1(Y_PAR - VH / 2 + z.y)} r={z.r} />
        ))}
      </g>
    </Vzorek>
    {/* štítek: hmota nahoře (výška vodítka), co udělá pod ní */}
    <text className="sv-lbl" x={X_TEXT} y={Y_PAR + 5}>pár lopat</text>
    <text className="sv-val" x={X_TEXT} y={Y_PAR + 32}>vrstvu zpravidla nezmění</text>

    {/* ── legenda: značky pixelově shodné se vzorky a sérií (9.2 p. 10) ── */}
    <line x1="30" y1={LEG} x2="490" y2={LEG} {...konstrukce} />
    {/* nová směs: čip = legenda `jil-jako-vana` */}
    <rect x="30" y={LEG + 22} width="14" height="14" {...PISEK} />
    <circle cx="37" cy={LEG + 29} r="2.4" {...ZEMINA} />
    <rect x="30" y={LEG + 22} width="14" height="14" {...obrys} />
    <text className="sv-val" x="52" y={LEG + 34}>nová směs</text>
    {/* původní zemina: čip = legenda `zaklad-tri-zahrad` */}
    <rect x="186" y={LEG + 22} width="14" height="14" fill="#6b5138" fillOpacity={0.9} {...TAH} />
    <text className="sv-val" x="208" y={LEG + 34}>původní zemina</text>
    {/* písek: zrno = legenda `dve-zahrady` */}
    <circle cx="384" cy={LEG + 29} r="2.4" fill="#c2a052" />
    <text className="sv-val" x="398" y={LEG + 34}>písek</text>

    {/* ── závěr pod legendou (vzor `prany-pisek`): zkouška dřív než
        objednávka (i32) ─────────────────────────────────────────── */}
    <text className="sv-lbl" x="30" y="556">U těžkého jílu</text>
    <text className="sv-val" x="30" y="582">zkouška před velkou objednávkou</text>
  </svg>
)
