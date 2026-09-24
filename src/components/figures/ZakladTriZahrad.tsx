import React from 'react'

/**
 * Minerální základ tří zahrad (DESIGN.md 9.2) — tři svislé 100% sloupce
 * vedle sebe. Každý sloupec je minerální základ jedné zahrady od povrchu
 * do 30 cm (model profilu, i17p1); šířka sloupce je celý základ v dané
 * hloubce, dělicí čára vede svisle od povrchu až na dno. Pointa je jedna
 * (i52, 24 px): s hloubkou se poměr nemění. Kontrast, na kterém je stálost
 * vidět, dávají hranice zón v 10 a 15 cm (i19, řádky tabulky i51 hned pod
 * splitem): čárkované linky přetínají všechny sloupce a dělicí čára jimi
 * projde beze změny — zóny se mění, poměr ne. Příměsi si z celkového
 * objemu berou podíl zvlášť (i31, i50) a v kresbě nejsou; nese je tabulka.
 *
 * Čísla jen z textu autora: jílovitá 65/35 (i28p2, i52), těžší hlína při
 * přestavbě 30/70 (i37 v1, v3–4; jméno sloupce nese podmínku, protože
 * fungující hlína dostává 0 % — `hlina-prace-misto-materialu`, i41), písčitá
 * 0/100, tedy bez nákupu písku, jen původní písčitá zemina (i44, i45, i52).
 * Hodnotu 65 % jako pointu nese `kolik-pisku-do-jilu`, tady stojí jen pod
 * sloupcem.
 *
 * Barevný klíč článku (9.2 p. 10): plochá okrová #c2a052 op .45 = písčitá
 * zemina (`dve-zahrady`, `nejblizsi-priklad`, `prednosti-a-slabiny`),
 * hnědá #6b5138 op .9 = původní zemina. Přidaný písek se od písčité zeminy
 * liší TEXTUROU, ne neprůhledností (.45 × .55 má ΔE00 ≈ 3): plocha .55 se
 * zrny `zz-pisek`, dlaždice pixelově shodná s `dz-pisek` (zrno je přidaný
 * písek i v `kolik-pisku-do-jilu`). Dlaždice je posunutá (x 3, y 23;
 * u hlíny o dalších 8), aby žádné zrno nepřeťal ani se tečně nedotkl
 * obrys, dělicí čára nebo linka zóny.
 * Legenda má dvě hmoty, čipy 28 × 14 jako `pisek-pod-koreny`: písek se
 * dvěma zrny téže velikosti (r 2,4 / 2), zemina plná; písčitou zeminu
 * pojmenovává popisek ve sloupci. Linky zón: na hnědé #d5d3cc 3 7, na
 * okrové bílá op .7 (`vodSvetle` z `pisek-pod-koreny`), fáze čárek
 * navazuje přes dělicí čáru.
 *
 * Hodnoty stojí pod sloupcem u jeho hran: vlevo přidaný písek, vpravo
 * zemina, u všech tří sloupců souběžně. Jména sloupců jsou zahrady
 * (sv-lbl), ne materiály, aby se „Písek" nepletl s přidaným pískem.
 *
 * Portrétová sazba 520 × 600, id s prefixem `zz-` (jediné id `zz-pisek`).
 * 8 px na cm jako řezy série: povrch y 150 a dno y 390 jako
 * `pisek-pod-koreny`. Sloupce 120 × 240 s mezerou 20 (x 80–480), stupnice
 * 0 / 10 / 15 / 30 visí vlevo (vzor `tri-zony`). Jednotky nikdy
 * v `.sv-lbl`. V sazbě 18/21 jednotek (≤ 385 px, změřeno) končí nejširší
 * „Objemový poměr v minerálním základu" na x ≈ 473, „Těžší hlína" na
 * x ≈ 342 (před „Písčitá" 18), „10" a „15" na stupnici mají mezi rámci
 * ≈ 17 a popisek ve sloupci stojí v zóně 15–30 cm ≈ 20 pod linkou 15 cm.
 * Statická kresba.
 */

type Sloupec = {
  jmeno: string
  /** přidaný písek v % minerálního základu; 0 = jen původní písčitá zemina */
  pisek: number
  /** posun dlaždice zrn, aby žádné zrno nepřeťala hrana ani dělicí čára */
  posunZrn: number
}

const SLOUPCE: Sloupec[] = [
  { jmeno: 'Jílovitá', pisek: 65, posunZrn: 0 },
  { jmeno: 'Těžší hlína', pisek: 30, posunZrn: 8 },
  { jmeno: 'Písčitá', pisek: 0, posunZrn: 0 },
]

const X0 = 80 // levá hrana prvního sloupce
const W = 120 // šířka sloupce = 100 % základu
const G = 20 // mezera mezi sloupci
const CM = 8
const T = 150 // povrch, 0 cm
const B = T + 30 * CM // 390, dno profilu
const ZONY = [10, 15] // hranice zón příměsí (i19, i51)
const yCm = (cm: number) => T + cm * CM
const Y_JMENO = T - 16
const Y_HODNOTY = B + 28
const LEG = 452 // linka legendy
const R1 = LEG + 32 // účaří legendy

const xSloupce = (i: number) => X0 + i * (W + G)

const PISEK = { fill: '#c2a052', fillOpacity: 0.55 } as const
const ZEMINA = { fill: '#6b5138', fillOpacity: 0.9 } as const
const PISCITA = { fill: '#c2a052', fillOpacity: 0.45 } as const
const TAH = { stroke: '#232830', strokeWidth: 1.6, strokeLinejoin: 'round' } as const
const obrys = { fill: 'none', ...TAH } as const
const voditko = { stroke: '#d5d3cc', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round' } as const
/** Konstrukční linka na okrové: #d5d3cc by na ní splynul (`pisek-pod-koreny`). */
const vodSvetle = { stroke: '#fff', strokeWidth: 1.6, strokeDasharray: '3 7', strokeLinecap: 'round', opacity: 0.7 } as const

/** Úsek linky zóny; fáze čárek se počítá od levé hrany sloupce, takže
 *  čárkování navazuje přes dělicí čáru. */
const Linka: React.FC<{ x1: number; x2: number; y: number; od: number; svetla: boolean }> = ({ x1, x2, y, od, svetla }) =>
  x2 - x1 < 4 ? null : (
    <line x1={x1} y1={y} x2={x2} y2={y} strokeDashoffset={x1 - od} {...(svetla ? vodSvetle : voditko)} />
  )

export const ZakladTriZahrad: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 600">
    <defs>
      {/* přidaný písek = zrna série; dlaždice pixelově shodná s `dz-pisek` */}
      <pattern id="zz-pisek" x="3" y="23" width="26" height="26" patternUnits="userSpaceOnUse">
        <circle cx="6" cy="7" r="2.4" fill="#c2a052" />
        <circle cx="19" cy="19" r="2" fill="#c2a052" />
      </pattern>
    </defs>

    {/* Pointa kresby (9.2 p. 3) je jedna: poměr základu se s hloubkou nemění. */}
    <text className="sv-val" x="40" y="44" style={{ fontSize: 24 }}>S hloubkou se poměr nemění</text>
    <text className="sv-lbl" x="40" y="72">Objemový poměr v minerálním základu</text>

    {/* ── stupnice: povrch, hranice zón, dno (vzor `tri-zony`) ─── */}
    <line x1="62" y1={T} x2="62" y2={B} {...voditko} />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      {[0, ...ZONY, 30].map((cm) => (
        <line key={cm} x1="56" y1={yCm(cm)} x2="68" y2={yCm(cm)} />
      ))}
    </g>
    <g textAnchor="end">
      <text className="sv-val" x="50" y={T + 5}>0 cm</text>
      {ZONY.map((cm) => (
        <text key={cm} className="sv-val" x="50" y={yCm(cm) + 5}>{cm}</text>
      ))}
      <text className="sv-val" x="50" y={B + 5}>30</text>
    </g>

    {/* ── tři sloupce: zóny se mění, dělicí čára jde od povrchu na dno ── */}
    {SLOUPCE.map((s, i) => {
      const x = xSloupce(i)
      const deleni = x + (W * s.pisek) / 100
      return (
        <g key={s.jmeno}>
          <text className="sv-lbl" x={x} y={Y_JMENO}>{s.jmeno}</text>
          {s.pisek > 0 ? (
            <g>
              <rect x={x} y={T} width={deleni - x} height={B - T} {...PISEK} />
              <g transform={`translate(${s.posunZrn} 0)`}>
                <rect x={x - s.posunZrn} y={T} width={deleni - x} height={B - T} fill="url(#zz-pisek)" />
              </g>
              <rect x={deleni} y={T} width={x + W - deleni} height={B - T} {...ZEMINA} />
            </g>
          ) : (
            <g>
              <rect x={x} y={T} width={W} height={B - T} {...PISCITA} />
              {/* písčitá zemina nemá značku v legendě — jméno nese sloupec, v zóně 15–30 cm */}
              <g textAnchor="middle">
                <text className="sv-val" x={x + W / 2} y={yCm(15) + 39}>původní</text>
                <text className="sv-val" x={x + W / 2} y={yCm(15) + 67}>písčitá</text>
                <text className="sv-val" x={x + W / 2} y={yCm(15) + 95}>zemina</text>
              </g>
            </g>
          )}
          {/* hranice zón: na okrové světlá, na hnědé #d5d3cc */}
          {ZONY.map((cm) =>
            s.pisek > 0 ? (
              <g key={cm}>
                <Linka x1={x + 4} x2={deleni - 4} y={yCm(cm)} od={x + 4} svetla />
                <Linka x1={deleni + 4} x2={x + W - 4} y={yCm(cm)} od={x + 4} svetla={false} />
              </g>
            ) : (
              <Linka key={cm} x1={x + 4} x2={x + W - 4} y={yCm(cm)} od={x + 4} svetla />
            ),
          )}
          {s.pisek > 0 && <line x1={deleni} y1={T} x2={deleni} y2={B} stroke="#232830" strokeWidth="1.6" />}
          <rect x={x} y={T} width={W} height={B - T} {...obrys} />
          {/* vlevo přidaný písek, vpravo zemina — souběžně u všech sloupců */}
          <text className="sv-val" x={x} y={Y_HODNOTY}>{`${s.pisek} %`}</text>
          <text className="sv-val" x={x + W} y={Y_HODNOTY} textAnchor="end">{`${100 - s.pisek} %`}</text>
        </g>
      )
    })}

    {/* ── legenda: čipy z týchž výplní a zrn jako sloupce (9.2 p. 10) ── */}
    <line x1="30" y1={LEG} x2="490" y2={LEG} {...voditko} />
    <rect x="30" y={R1 - 12} width="28" height="14" {...PISEK} />
    <g fill="#c2a052">
      <circle cx="38" cy={R1 - 7} r="2.4" />
      <circle cx="50" cy={R1 - 3} r="2" />
    </g>
    <rect x="30" y={R1 - 12} width="28" height="14" {...obrys} />
    <text className="sv-val" x="66" y={R1}>přidaný písek</text>
    <rect x="240" y={R1 - 12} width="28" height="14" {...ZEMINA} {...TAH} />
    <text className="sv-val" x="276" y={R1}>původní zemina</text>

    <text className="sv-lbl" x="30" y={LEG + 84}>Příměsi si z celkového objemu</text>
    <text className="sv-lbl" x="30" y={LEG + 108}>berou podíl zvlášť</text>
  </svg>
)
