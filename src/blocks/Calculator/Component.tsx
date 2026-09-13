'use client'

import React, { useId, useState } from 'react'

import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { cn } from '@/utilities/ui'

export type CalculatorBlockProps = {
  kind: 'prutok' | 'davka' | 'vsak' | 'primesi'
  /** Poloha na mřížce článku: na ose, nebo zrcadlený offset (ADR-006). */
  layout?: string | null
  light?: boolean | null
  id?: string | null
  blockName?: string | null
  blockType?: 'calculator'
  className?: string
}

/** Česky: desetinná čárka, tabulkové číslice řeší CSS. */
const fmt = (value: number, decimals = 1): string =>
  Number.isFinite(value)
    ? value.toFixed(decimals).replace(/\.0$/, '').replace('.', ',')
    : '—'

const Ok = () => (
  <span className="ic">
    <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
      <path d="M2.5 6.2 4.8 8.5 9.5 3.8" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  </span>
)

const Warn = () => (
  <span className="ic">
    <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
      <path d="M6 2.6v4" stroke="#fff" strokeLinecap="round" strokeWidth="2" />
      <circle cx="6" cy="9" fill="#fff" r="1.1" />
    </svg>
  </span>
)

/**
 * Kalkulátorový panel (DESIGN.md 7.7).
 *
 * Počítá při psaní – žádné tlačítko „spočítat". Hodnoty jsou předvyplněné
 * čísly z článku, takže panel něco ukazuje hned a čtenář jen přepíše svoje.
 * Živou oblast nese výstupní sloupec, ne verdikt — odečítač tak slyší
 * každý přepočet, ne jen závěrečnou větu.
 */
export const CalculatorBlock: React.FC<CalculatorBlockProps> = ({
  className,
  kind,
  layout,
  light,
}) => {
  const uid = useId()
  /*
    7.7 + 8.1 p. 5: kalkulátor je PANEL plovoucí ve světlé sekci, ne pás.
    Druhý v článku má variantu `--light` (krémový panel), protože dva
    obsidianové panely za sebou jsou zakázané.
  */
  const poloha = layout === 'offset-right' || layout === 'offset-left' ? `id-calc--${layout}` : 'id-edge'
  const panel = cn('rv id-calc not-prose', poloha, light && 'id-calc--light', className)

  const Panel = PANELY[kind] ?? Davka
  return <Panel className={panel} uid={uid} />
}

/** Číslo s tisícovými mezerami a desetinnou čárkou (cs-CZ). */
/** Vstup píše čárku, model počítá s tečkou — jinak stojí v jednom panelu
 *  „0.8" proti „0,8 kg/l" v próze (porota kola 08, typografie). */
const naCarku = (hodnota: number): string => String(hodnota).replace('.', ',')
const cislo = (raw: string, puvodni: number): number => {
  const normalizovane = raw.replace(',', '.').trim()
  if (normalizovane === '') return 0
  const hodnota = Number(normalizovane)
  return Number.isFinite(hodnota) && hodnota >= 0 ? hodnota : puvodni
}

const fmtN = (value: number, decimals = 0): string =>
  Number.isFinite(value)
    ? value.toLocaleString('cs-CZ', { maximumFractionDigits: decimals })
    : '—'

/** Litry do 1 000, pak metry krychlové. */
const fmtObjem = (litru: number): string =>
  !Number.isFinite(litru) ? '—' : litru < 1000 ? `${fmtN(litru)} l` : `${fmtN(litru / 1000, 1)} m³`

/** Kilogramy do tuny, pak tuny. */
const fmtHmota = (kg: number): string =>
  !Number.isFinite(kg) ? '—' : kg < 1000 ? `${fmtN(kg)} kg` : `${fmtN(kg / 1000, 2)} t`

/**
 * Zkouška vsakování (článek „Krásný trávník začíná pod zemí", kap. 3):
 * pokles hladiny za dobu měření → centimetry za hodinu. Pásma jsou
 * autorova: pod 2,5 pomalu, 2,5–7,5 ideální, nad 10 příliš rychle.
 * Mezi 7,5 a 10 článek pásmo nepojmenovává – kalkulátor to říká poctivě.
 */
const Vsak = ({ className, uid }: { className: string; uid: string }) => {
  const [pokles, setPokles] = useState(1)
  const [doba, setDoba] = useState(15)

  const platne = pokles >= 0 && doba > 0
  const rychlost = platne ? (pokles / doba) * 60 : NaN
  const pasmo = !platne
    ? 'nic'
    : rychlost < 2.5
      ? 'pomalu'
      : rychlost <= 7.5
        ? 'idealni'
        : rychlost <= 10
          ? 'nad'
          : 'rychle'

  const zprava = {
    nic: 'Doplňte, o kolik hladina klesla a za jak dlouho.',
    pomalu: `Voda odtéká pomalu: ${fmt(rychlost)} cm/h je pod 2,5. Najděte příčinu – prohlubeň, přítok z okolí, nebo utužená vrstva z profilu; tu za vhodné vlhkosti rozrušte a test zopakujte.`,
    idealni: `${fmt(rychlost)} cm/h je v pásmu 2,5 až 7,5 – ideální stav pro většinu rostlin.`,
    nad: `${fmt(rychlost)} cm/h je nad ideálním pásmem 2,5 až 7,5, ale ještě ne nad 10. Sledujte, jestli půda udrží vláhu mezi zálivkami.`,
    rychle: `Voda uniká velmi rychle: ${fmt(rychlost)} cm/h je nad 10. U písčité půdy vás čeká boj o každou kapku – dodejte jí schopnost vodu uchovat. Rychle prázdná jáma není výhra.`,
  }[pasmo]

  return (
    <div aria-labelledby={`${uid}-h`} className={className} role="group">
      <div className="id-calc__head">
        <h3 id={`${uid}-h`}>Vyhodnoťte zkoušku vsakování</h3>
        <span className="id-chip--outline-accent">Kalkulátor</span>
      </div>

      <div>
        <div className="id-calc__field">
          <label htmlFor={`${uid}-pokles`}>Pokles hladiny</label>
          <div className="id-calc__inrow">
            <input
              aria-describedby={`${uid}-pokles-u`}
              id={`${uid}-pokles`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setPokles(Number(e.target.value))}
              step="0.5"
              type="number"
              value={pokles}
            />
            <span className="unit" id={`${uid}-pokles-u`}>cm</span>
          </div>
        </div>

        <div className="id-calc__field">
          <label htmlFor={`${uid}-doba`}>Doba měření</label>
          <div className="id-calc__inrow">
            <input
              aria-describedby={`${uid}-doba-u`}
              id={`${uid}-doba`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setDoba(Number(e.target.value))}
              step="5"
              type="number"
              value={doba}
            />
            <span className="unit" id={`${uid}-doba-u`}>minut</span>
          </div>
        </div>
      </div>

      {/* Živá oblast obepíná VŠECHNY výstupy: odečítač jinak slyšel jen
          verdikt, takže čtyři z pěti vstupů neohlásily vůbec nic
          (porota kola 06, výkon — WCAG AA). */}
      <div aria-live="polite">
        <div className="id-calc__orow">
          <span className="id-calc__ol">Pokles za měřený čas</span>
          <span className="id-calc__ov">{platne ? nezlomitelneMezery(`${fmt(pokles)} cm / ${fmt(doba, 0)} min`) : '—'}</span>
        </div>
        <div className="id-calc__orow id-calc__orow--hero">
          <span className="id-calc__ol">Rychlost vsakování</span>
          <span className="id-calc__ov">{platne ? nezlomitelneMezery(`${fmt(rychlost)} cm/h`) : '—'}</span>
        </div>

        <div
          className={cn('id-verdict', pasmo === 'idealni' ? 'id-verdict--ok' : 'id-verdict--warn')}
        >
          {pasmo === 'idealni' ? <Ok /> : <Warn />}
          <span>{nezlomitelneMezery(zprava)}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Příměs do půdy (kap. 5 „Matematika trávníku"): podíl se počítá z LITRŮ,
 * kilogramy vzniknou až sypnou hustotou od výrobce. Výchozí čísla jsou
 * vzorový příklad z článku: 100 m², 20 cm, 5 % zeolitu, 0,8 kg/l, pytle 20 kg.
 */
const Primesi = ({ className, uid }: { className: string; uid: string }) => {
  const [plocha, setPlocha] = useState(100)
  const [hloubka, setHloubka] = useState(20)
  const [podil, setPodil] = useState(5)
  const [hustota, setHustota] = useState(0.8)
  const [pytel, setPytel] = useState(20)

  const platne = plocha > 0 && hloubka > 0 && podil >= 0 && podil <= 100 && hustota > 0
  const vrstvaNaM2 = hloubka * 10 // litrů pod 1 m²
  const primesNaM2 = (vrstvaNaM2 * podil) / 100
  const zakladNaM2 = vrstvaNaM2 - primesNaM2
  const litru = primesNaM2 * plocha
  const kg = litru * hustota
  const pytlu = pytel > 0 ? Math.ceil(kg / pytel) : NaN

  return (
    <div aria-labelledby={`${uid}-h`} className={className} role="group">
      <div className="id-calc__head">
        <h3 id={`${uid}-h`}>Spočítejte příměs do půdy</h3>
        <span className="id-chip--outline-accent">Kalkulátor</span>
      </div>

      <div>
        <div className="id-calc__field">
          <label htmlFor={`${uid}-plocha`}>Plocha trávníku</label>
          <div className="id-calc__inrow">
            <input
              aria-describedby={`${uid}-plocha-u`}
              id={`${uid}-plocha`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setPlocha(Number(e.target.value))}
              step="1"
              type="number"
              value={plocha}
            />
            <span className="unit" id={`${uid}-plocha-u`}>m²</span>
          </div>
        </div>

        <div className="id-calc__field">
          <label htmlFor={`${uid}-hloubka`}>Hloubka obohacené vrstvy</label>
          <div className="id-calc__inrow">
            <input
              aria-describedby={`${uid}-hloubka-u`}
              id={`${uid}-hloubka`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setHloubka(Number(e.target.value))}
              step="1"
              type="number"
              value={hloubka}
            />
            <span className="unit" id={`${uid}-hloubka-u`}>cm</span>
          </div>
        </div>

        <div className="id-calc__field">
          <label htmlFor={`${uid}-podil`}>Podíl příměsi (z&nbsp;objemu)</label>
          <div className="id-calc__inrow">
            <input
              aria-describedby={`${uid}-podil-u`}
              id={`${uid}-podil`}
              inputMode="decimal"
              max={100}
              min={0}
              onChange={(e) => setPodil(Number(e.target.value))}
              step="0.5"
              type="number"
              value={podil}
            />
            <span className="unit" id={`${uid}-podil-u`}>%</span>
          </div>
        </div>

        <div className="id-calc__field">
          <label htmlFor={`${uid}-hustota`}>Sypná hustota od výrobce</label>
          <div className="id-calc__inrow">
            <input
              aria-describedby={`${uid}-hustota-u`}
              id={`${uid}-hustota`}
              inputMode="decimal"
              onChange={(e) => setHustota(cislo(e.target.value, hustota))}
              type="text"
              value={naCarku(hustota)}
            />
            <span className="unit" id={`${uid}-hustota-u`}>kg/l</span>
          </div>
        </div>

        <div className="id-calc__field">
          <label htmlFor={`${uid}-pytel`}>Balení</label>
          <div className="id-calc__inrow">
            <input
              aria-describedby={`${uid}-pytel-u`}
              id={`${uid}-pytel`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setPytel(Number(e.target.value))}
              step="1"
              type="number"
              value={pytel}
            />
            <span className="unit" id={`${uid}-pytel-u`}>kg / pytel</span>
          </div>
        </div>
      </div>

      {/* Živá oblast obepíná VŠECHNY výstupy: odečítač jinak slyšel jen
          verdikt, takže čtyři z pěti vstupů neohlásily vůbec nic
          (porota kola 06, výkon — WCAG AA). */}
      <div aria-live="polite">
        <div className="id-calc__orow">
          <span className="id-calc__ol">Vrstva pod 1&nbsp;m²</span>
          <span className="id-calc__ov">{platne ? nezlomitelneMezery(`${fmtN(vrstvaNaM2)} l`) : '—'}</span>
        </div>
        <div className="id-calc__orow">
          <span className="id-calc__ol">Příměs na 1&nbsp;m²</span>
          <span className="id-calc__ov">{platne ? nezlomitelneMezery(`${fmtN(primesNaM2, 1)} l`) : '—'}</span>
        </div>
        <div className="id-calc__orow">
          <span className="id-calc__ol">Příměs celkem</span>
          <span className="id-calc__ov">{platne ? nezlomitelneMezery(fmtObjem(litru)) : '—'}</span>
        </div>
        <div className="id-calc__orow id-calc__orow--hero">
          <span className="id-calc__ol">K&nbsp;objednání</span>
          <span className="id-calc__ov">{platne ? nezlomitelneMezery(fmtHmota(kg)) : '—'}</span>
        </div>
        <div className="id-calc__orow">
          <span className="id-calc__ol">{nezlomitelneMezery(`Pytlů po ${fmtN(pytel)} kg`)}</span>
          <span className="id-calc__ov">{platne && Number.isFinite(pytlu) ? fmtN(pytlu) : '—'}</span>
        </div>

        <div className={cn('id-verdict', platne ? 'id-verdict--ok' : 'id-verdict--warn')}>
          {platne ? <Ok /> : <Warn />}
          <span>
            {nezlomitelneMezery(
              platne
              ? `Podíl ${fmt(podil)} % počítáme z litrů: ${fmtN(primesNaM2, 1)} l příměsi + ${fmtN(zakladNaM2, 1)} l minerálního základu = ${fmtN(vrstvaNaM2)} l na každý m². Kilogramy vzniknou až sypnou hustotou – litr zeminy váží jinak než litr příměsi.`
              : 'Doplňte plochu, hloubku vrstvy, podíl příměsi a sypnou hustotu od výrobce.',
            )}
          </span>
        </div>
      </div>
    </div>
  )
}


/** Kbelíkový test: objem a čas → průtok, mínus 20 % rezervy, verdikt proti 25 l/min. */
const Prutok = ({ className, uid }: { className: string; uid: string }) => {
  const [objem, setObjem] = useState(10)
  const [cas, setCas] = useState(24)

  const platne = objem > 0 && cas > 0
  const namereny = platne ? (objem / cas) * 60 : NaN
  const navrhovy = namereny * 0.8
  const staci = navrhovy >= 25

  return (
    <div aria-labelledby={`${uid}-h`} className={className} role="group">
      <div className="id-calc__head">
        <h3 id={`${uid}-h`}>Vyhodnoťte svůj kbelíkový test</h3>
        <span className="id-chip--outline-accent">Kalkulátor</span>
      </div>

      <div>
        <div className="id-calc__field">
          <label htmlFor={`${uid}-objem`}>Objem nádoby</label>
          <div className="id-calc__inrow">
            <input
              aria-describedby={`${uid}-objem-u`}
              id={`${uid}-objem`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setObjem(Number(e.target.value))}
              step="0.5"
              type="number"
              value={objem}
            />
            <span className="unit" id={`${uid}-objem-u`}>litrů</span>
          </div>
        </div>

        <div className="id-calc__field">
          <label htmlFor={`${uid}-cas`}>Čas naplnění</label>
          <div className="id-calc__inrow">
            <input
              aria-describedby={`${uid}-cas-u`}
              id={`${uid}-cas`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setCas(Number(e.target.value))}
              step="1"
              type="number"
              value={cas}
            />
            <span className="unit" id={`${uid}-cas-u`}>sekund</span>
          </div>
        </div>
      </div>

      {/* Živá oblast obepíná VŠECHNY výstupy: odečítač jinak slyšel jen
          verdikt, takže čtyři z pěti vstupů neohlásily vůbec nic
          (porota kola 06, výkon — WCAG AA). */}
      <div aria-live="polite">
        <div className="id-calc__orow">
          <span className="id-calc__ol">Naměřený průtok</span>
          <span className="id-calc__ov">{platne ? nezlomitelneMezery(`${fmt(namereny)} l/min`) : '—'}</span>
        </div>
        <div className="id-calc__orow id-calc__orow--hero">
          <span className="id-calc__ol">Návrhový průtok po odečtení 20 %</span>
          <span className="id-calc__ov">{platne ? nezlomitelneMezery(`${fmt(navrhovy)} l/min`) : '—'}</span>
        </div>

        <div
          className={cn('id-verdict', staci && platne ? 'id-verdict--ok' : 'id-verdict--warn')}
        >
          {staci && platne ? <Ok /> : <Warn />}
          <span>
            {nezlomitelneMezery(
              !platne
              ? 'Doplňte objem nádoby a čas, za který se naplnila.'
              : staci
                ? `Zdroj na běžný systém stačí – návrhový průtok ${fmt(navrhovy)} l/min je nad hranicí 25 l/min.`
                : `Na běžný systém to zatím nestačí: ${fmt(navrhovy)} l/min proti potřebným 25 l/min. Rozdělte zahradu na víc sektorů, nebo posilte zdroj.`,
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

/** Plocha a dávka → objem jedné zálivky a doba běhu při známém průtoku. */
const Davka = ({ className, uid }: { className: string; uid: string }) => {
  const [plocha, setPlocha] = useState(60)
  const [davka, setDavka] = useState(12)
  const [prutok, setPrutok] = useState(20)

  const platne = plocha > 0 && davka > 0 && prutok > 0
  const litry = plocha * davka
  const minuty = litry / prutok
  const dlouhe = minuty > 45

  return (
    <div aria-labelledby={`${uid}-h`} className={className} role="group">
      <div className="id-calc__head">
        <h3 id={`${uid}-h`}>Kolik vody a jak dlouho</h3>
        <span className="id-chip--outline-accent">Kalkulátor</span>
      </div>

      <div>
        <div className="id-calc__field">
          <label htmlFor={`${uid}-plocha`}>Plocha sektoru</label>
          <div className="id-calc__inrow">
            <input
              aria-describedby={`${uid}-plocha-u`}
              id={`${uid}-plocha`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setPlocha(Number(e.target.value))}
              step="10"
              type="number"
              value={plocha}
            />
            <span className="unit" id={`${uid}-plocha-u`}>m²</span>
          </div>
        </div>

        <div className="id-calc__field">
          <label htmlFor={`${uid}-davka`}>Dávka na zálivku</label>
          <div className="id-calc__inrow">
            <input
              aria-describedby={`${uid}-davka-u`}
              id={`${uid}-davka`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setDavka(Number(e.target.value))}
              step="1"
              type="number"
              value={davka}
            />
            <span className="unit" id={`${uid}-davka-u`}>l/m²</span>
          </div>
        </div>

        <div className="id-calc__field">
          <label htmlFor={`${uid}-prutok`}>Návrhový průtok</label>
          <div className="id-calc__inrow">
            <input
              aria-describedby={`${uid}-prutok-u`}
              id={`${uid}-prutok`}
              inputMode="decimal"
              min={0}
              onChange={(e) => setPrutok(Number(e.target.value))}
              step="1"
              type="number"
              value={prutok}
            />
            <span className="unit" id={`${uid}-prutok-u`}>l/min</span>
          </div>
        </div>
      </div>

      {/* Živá oblast obepíná VŠECHNY výstupy: odečítač jinak slyšel jen
          verdikt, takže čtyři z pěti vstupů neohlásily vůbec nic
          (porota kola 06, výkon — WCAG AA). */}
      <div aria-live="polite">
        <div className="id-calc__orow">
          <span className="id-calc__ol">Objem jedné zálivky</span>
          <span className="id-calc__ov">{platne ? nezlomitelneMezery(`${fmt(litry, 0)} l`) : '—'}</span>
        </div>
        <div className="id-calc__orow id-calc__orow--hero">
          <span className="id-calc__ol">Doba běhu jedním sektorem</span>
          <span className="id-calc__ov">{platne ? nezlomitelneMezery(`${fmt(minuty, 0)} min`) : '—'}</span>
        </div>

        <div
          className={cn('id-verdict', platne && !dlouhe ? 'id-verdict--ok' : 'id-verdict--warn')}
        >
          {platne && !dlouhe ? <Ok /> : <Warn />}
          <span>
            {nezlomitelneMezery(
              !platne
              ? 'Doplňte plochu, dávku a průtok.'
              : dlouhe
                ? `${fmt(minuty, 0)} minut v jednom kuse je moc – voda odteče dřív, než se stihne vsáknout. Rozdělte plochu na víc sektorů a nechte mezi nimi vsáknout.`
                : `${fmt(minuty, 0)} minut na sektor je rozumná dávka – voda stihne vsáknout, místo aby odtekla po povrchu.`,
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

/* Až za všemi panely – `const` komponenty nesmí být použité před deklarací. */
const PANELY = { prutok: Prutok, davka: Davka, vsak: Vsak, primesi: Primesi } as const
