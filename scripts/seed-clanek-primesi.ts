import { stopLegacyMagazineWrite } from './lib/legacy-magazine-source'
stopLegacyMagazineWrite()

import { LAWN_SEO } from './lib/lawn-seo-content'
/**
 * Vloží čtyři navazující články o příměsích, plánování, přípravě půdní směsi a setí
 * do LOKÁLNÍ databáze. Původní autorský podklad níže se před zápisem
 * vždy rozdělí sdílenou transformací; kapitoly 5–7 se do prvního nevracejí.
 * Spuštění:  npm run payload -- run scripts/seed-clanek-primesi.ts
 *
 * Idempotentní: aktualizuje všechny čtyři články podle jejich stabilních slugů.
 * Ostrý web se plní vlastním nasazením, ne tímhle skriptem – publikaci
 * dělá majitel v adminu.
 *
 * Text je autorův, převzatý doslova. Drobné mechanické opravy předlohy
 * (utržená věta u Biovinu, osamocené „P", překlep „dborné", dvojtečka
 * bez konce tučného řezu, zdvojená tečka u „kořen. .", čárkový spoj
 * u „...bývá praný, pro jistotu..." změněný na středník) jsou vypsané
 * v předávacím shrnutí. Číselné tabulky předlohy nese nový blok `table`
 * – nejsou kresbou, jsou daty.
 *
 * Finální obsah: první článek obsahuje kapitoly 1–4 bez kalkulátoru.
 * Druhý začíná krémovým souhrnem a úvodem; teprve za nimi stojí
 * kalkulátor `pudni-profil` (8.1 p. 2 a p. 4: po obsidianovém hero
 * nesmí hned následovat další obsidian) a stručný průvodce výpočtem se společným zdrojem
 * v lib/profile-planning-content.ts. Původní kapitoly 6 a 7 o práci
 * se směsí patří třetímu článku. Mykorhiza, výsev a první péče patří
 * samostatnému čtvrtému článku o setí.
 * Topdressing se nevkládá.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { createLocalReq, getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import config from '@payload-config'
import { nastavOhnisko } from './lib/ohnisko-medii'
import { publikujCs } from './lib/publikuj-cs'
import { PREPARATION_TITLE, PREPARATION_SLUG } from './lib/split-profile-preparation'
import { SEEDING_TITLE, SEEDING_SLUG } from './lib/split-preparation-seeding'
import { splitPrimesiContent, PROFILE_SLUG, PROFILE_TITLE, PROFILE_META_TITLE, ORIGINAL_META_DESCRIPTION, PROFILE_META_DESCRIPTION } from './lib/split-primesi-content'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/* ── Lexical stavebnice ─────────────────────────────────────────── */

type Node = { type: string; version: number; [k: string]: unknown }

const text = (value: string, format = 0): Node => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
})

const BOLD = 1

type Part = string | [string, number] | Node
const parts = (items: Part[]): Node[] =>
  items.map((part) =>
    typeof part === 'string' ? text(part) : Array.isArray(part) ? text(part[0], part[1]) : part,
  )

/** Odkaz (externí URL nebo interní cesta) — jediný uzel, který Part unese navíc. */
const link = (url: string, label: string): Node => ({
  type: 'link',
  children: [text(label)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 2,
  fields: { linkType: 'custom', newTab: true, url },
})

const p = (...items: Part[]): Node => ({
  type: 'paragraph',
  children: parts(items),
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

const h3 = (value: string): Node => ({
  type: 'heading',
  tag: 'h3',
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

/** Položka seznamu = části odstavce. */
const li = (...items: Part[]): Part[] => items

const list = (kind: 'bullet' | 'number', items: Part[][]): Node => ({
  type: 'list',
  listType: kind,
  tag: kind === 'bullet' ? 'ul' : 'ol',
  start: 1,
  children: items.map((item, index) => ({
    type: 'listitem',
    value: index + 1,
    children: parts(item),
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  })),
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})
const ul = (...items: Part[][]) => list('bullet', items)

const block = (fields: Record<string, unknown>): Node => ({
  type: 'block',
  fields,
  format: '',
  version: 2,
})

const root = (children: Node[]) => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const mini = (...paragraphs: string[]) => root(paragraphs.map((t) => p(t)))

const split = (fields: Record<string, unknown>): Node =>
  block({ blockType: 'split', ...fields })

const chapter = (title: string, eyebrow?: string): Node =>
  block({ blockType: 'chapter', blockName: eyebrow ?? title, title, eyebrow })

/* Kalkulátor jako PÁS (8.1 p. 3) — stejně jako v prvním článku o půdě. */
const calc = (kind: string, surface = 'band', layout = 'axis'): Node =>
  block({ blockType: 'calculator', blockName: `Kalkulátor ${kind}`, kind, surface, layout })

const figure = (
  filename: string,
  number: string,
  caption: string,
  layout = '',
  panel = true,
): Node =>
  block({
    blockType: 'figure',
    blockName: `Obr. ${number}`,
    __filename: filename,
    number,
    caption,
    panel,
    layout,
  })

/** Datová tabulka: sloupce [hlavička, zarovnání?], řádky jako pole buněk. */
const table = (opts: {
  heading?: string
  width?: 'prose' | 'edge'
  /** Přehledová tabulka smí nést posun povrchu jako krémový pás (8.1 p. 5). */
  surface?: 'bila' | 'krem'
  note?: string
  cols: (string | [string, 'left' | 'right'])[]
  rows: string[][]
}): Node =>
  block({
    blockType: 'table',
    blockName: opts.heading ?? 'Tabulka',
    heading: opts.heading,
    width: opts.width ?? 'prose',
    surface: opts.surface ?? 'bila',
    note: opts.note,
    columns: opts.cols.map((col) =>
      typeof col === 'string' ? { label: col, align: 'left' } : { label: col[0], align: col[1] },
    ),
    rows: opts.rows.map((cells) => ({ cells: cells.map((value) => ({ value })) })),
  })

/* ── Média ──────────────────────────────────────────────────────── */

const SLUG = 'pisek-biochar-a-dalsi-primesi'

/** Soubory k nahrání do knihovny médií, když tam ještě nejsou. */
const MEDIA: {
  filename: string
  alt: string
  focal?: { focalX: number; focalY: number; focalPortraitX?: number; focalPortraitY?: number }
  /** Volitelný portrétový ořez — nahraje se zvlášť a připojí k hlavní fotce. */
  portret?: string
}[] = [
  {
    filename: 'hero-primesi-ryc-v2.avif',
    portret: 'hero-primesi-portret.avif',
    /* Alt platí pro široký záběr i pro ořez na výšku (telefon), kde rýč
       ani biochar nejsou (porota kola 01 článku o příměsích). */
    alt: 'Připravené hromady materiálů na holé ploše zahrady před mícháním směsi pro trávník: světlý praný písek a tmavá prosátá zemina, za nimi živý plot, dřevěný plot a trávník v nízkém večerním slunci.',
    focal: { focalX: 50, focalY: 55, focalPortraitX: 50, focalPortraitY: 55 },
  },
  {
    filename: 'hero-priprava-smesi-higgsfield.avif',
    portret: 'hero-priprava-smesi-higgsfield-portret.avif',
    alt: 'Zahradník v teplém světle podvečerního slunce promíchává písek s ornicí malým rotavátorem na připravované ploše pro nový trávník.',
    /* 66: čtverec v magazínu vejde zahradníka i rotavátor (85 začínalo na zádech). */
    focal: { focalX: 66, focalY: 50, focalPortraitX: 72, focalPortraitY: 50 },
  },
  /* Rytmus obraz/text článku o přípravě (2026-09-23): ořezy v poměru rámu
     splitu (1:1 / 4:5), zdroje a varianty v kandidati-priprava/rytmus. */
  {
    filename: 'fig-dodavka-materialu-ctverec.avif',
    alt: 'Vysypaná dodávka materiálů na plachtě na okraji trávníku: hromada písku, hromada tmavé zeminy a stoh papírových pytlů s příměsemi, v pozadí dřevěný plot.',
  },
  {
    filename: 'fig-ryc-zahon-ctverec.avif',
    alt: 'Rýč zaražený do zpracovávané půdy v nízkém teplém slunci; vpředu leží světlá udusaná vrstva rozlámaná na hroudy.',
  },
  {
    filename: 'fig-useky.avif',
    alt: 'Rozkypřená plocha zahrady vyznačená provázkem na nízkých kolících; v pruhu stojí v pravidelných rozestupech tři stejné hromádky světlého písku.',
  },
  {
    filename: 'fig-louze.avif',
    alt: 'Urovnaná, čerstvě zalitá zemina; v mělké prohlubni stojí louže a odráží teplé večerní světlo.',
  },
  {
    filename: 'fig-osivo-luzko.avif',
    alt: 'Travní osivo zblízka na jemném, lehce přiváleném seťovém lůžku se stopou válce: štíhlá světlá zrna leží naplocho na tmavé půdě, v pozadí rozostřený trávník a dřevěný plot.',
  },
  {
    filename: 'fig-mlady-porost.avif',
    alt: 'Mladý trávník krátce po vzejití: tenká světle zelená stébla různé výšky, mezi nimi ještě prosvítá tmavá půda.',
  },
  /* Rytmus obraz/text článku s kalkulátorem (2026-09-23): ořezy 4:5 v poměru
     rámu splitu + předěl 21:9 s portrétem; zdroje v kandidati-kalkulator. */
  {
    filename: 'fig-mereni-plochy.avif',
    alt: 'Žluté měřicí pásmo natažené od dřevěného kolíku přes uhrabanou plochu budoucího trávníku; vlevo štěrková cesta, vpravo záhon s trvalkami, oba mimo měřenou plochu, vzadu dřevěný plot v teplém světle.',
  },
  {
    filename: 'fig-lat-u-chodniku.avif',
    alt: 'Hliníková lať položená z dlážděného chodníku přes obrubník na čerstvě nakypřenou zeminu, která leží výš než dlažba; pod latí nad chodníkem zůstává mezera, v pozadí dřevěný plot a keře.',
  },
  {
    filename: 'fig-vazeni-kbeliku.avif',
    alt: 'Černý kbelík zarovnaný světlým pískem stojí na plošinové váze na prknech dřevěné terasy; v pozadí rozostřený trávník a dřevěný prknový plot v teplém světle.',
  },
  {
    filename: 'fig-odvoz-zeminy.avif',
    portret: 'fig-odvoz-zeminy-portret.avif',
    alt: 'Malý přívěs s pozinkovanými bočnicemi stojí u otevřené branky v dřevěném prknovém plotě, naložený hroudami vytěžené šedohnědé jílovité zeminy; v popředí schod mezi trávníkem a odkrytým jílem.',
    focal: { focalX: 66, focalY: 50 },
  },
  {
    filename: 'fig-pripravena-plocha.avif',
    portret: 'fig-pripravena-plocha-portret.avif',
    alt: 'Urovnané, slehlé seťové lůžko mezi trávníkem a dřevěným plotem v nízkém večerním světle; na jeho okraji stojí papírový pytel osiva.',
    focal: { focalX: 36, focalY: 60 },
  },
  /* Rytmus obraz/text článku o příměsích (2026-09-24): ořez 4:5 z nepoužitého
     masteru kandidati-primesi/bleed-3 a tři čtverce ze série téže zahrady
     (kandidati-primesi-3; ze sondy odstraněn metr — jeho díly ukazovaly jámu
     hlubokou asi 18 cm, porota kola 04). */
  {
    filename: 'fig-primesi-deska-45.avif',
    alt: 'Dřevěná míchací deska na udusané zemi: vlevo hromádka tmavé prosáté zeminy, vpravo světlý písek, přes který už vede pruh zeminy. Za deskou rozostřený trávník v teplém večerním světle.',
  },
  {
    filename: 'fig-primesi-sonda-zahon.avif',
    alt: 'Čtvercová sonda vykopaná v připravené holé ploše pro nový trávník: svislé stěny z drobivé hnědé zeminy, na dně tmavší pevnější podloží. V pozadí trávník a dřevěný prknový plot v nízkém večerním slunci.',
  },
  {
    filename: 'fig-primesi-vzorky-zahon.avif',
    alt: 'Tři hromádky různých půd vedle sebe na připravené holé ploše u trávníku: vlevo šedohnědé hutné hroudy jílu s hladkými plochami, uprostřed tmavá drobtovitá hlína, vpravo světlá sypká písčitá zemina. Za nimi trávník v nízkém večerním slunci a dřevěný prknový plot.',
  },
  {
    filename: 'fig-primesi-hlina-ctverec.avif',
    alt: 'Zblízka čerstvě obrácená hlinitá zemina v záhonu u trávníku: tmavě hnědé drobty a malé hrudky, vlhké, ale ne mokré, s jemnými světlými kořínky trávy, v teplém bočním večerním světle.',
  },
  {
    filename: 'slozka-biovin.avif',
    alt: 'Detail hroznového kompostu Actino: drobné tmavě hnědé pelety z matoliny na starém dřevěném prkně v teplém bočním světle.',
  },
  {
    filename: 'slozka-biochar.avif',
    alt: 'Detail biocharu: matně černá porézní zrna dřevěného uhlí velikosti dva až osm milimetrů na starém dřevěném prkně.',
  },
  {
    filename: 'slozka-zeolit.avif',
    alt: 'Detail zeolitu klinoptilolitu: světle šedozelená ostrá zrnka půl až jeden milimetr na starém dřevěném prkně.',
  },
  {
    filename: 'slozka-mykorhiza.avif',
    alt: 'Detail mykorhizního přípravku: jemná béžová zrnka nosiče s drobnými úlomky kořínků na starém dřevěném prkně.',
  },
  {
    filename: 'panel-biovin.avif',
    alt: 'Pelety hroznového kompostu Actino rozsypané na tmavé zahradní ornici, některé napůl zapravené a rozpadající se do půdy.',
  },
  {
    filename: 'panel-biochar.avif',
    alt: 'Černá porézní zrna biocharu promíchaná s hnědou drobtovitou zeminou – kontrast matné černi a hrud půdy.',
  },
  {
    filename: 'panel-zeolit.avif',
    alt: 'Světle šedozelená zrnka zeolitu rozptýlená mezi tmavými drobty zahradní půdy.',
  },
  {
    filename: 'fig-dodavka-materialu.avif',
    portret: 'fig-dodavka-materialu-portret.avif',
    alt: 'Vysypaná dodávka materiálů na plachtě na okraji zahrady: velká hromada písku, vedle menší hromada tmavé zeminy, opodál stoh papírových pytlů s příměsemi na trávě, kolem plot a nízké ranní slunce.',
    focal: { focalX: 55, focalY: 55, focalPortraitX: 50, focalPortraitY: 50 },
  },
]

/* ── Obsah článku ───────────────────────────────────────────────── */

const body = root([
  block({
    blockType: 'summaryBand',
    blockName: 'Souhrn',
    /* Lead je autorův perex (kurzívní odstavec pod titulkem předlohy). */
    lead: 'Jedna zahrada zůstává po dešti mokrá, druhá brzy vysychá. Stejné příměsi v nich mohou odvést jinou práci – *a stejná tuna materiálu může zabrat překvapivě rozdílný prostor*.',
    tiles: [
      { value: '3', unit: 'receptury', label: 'jílovitá, hlinitá a písčitá zahrada' },
      { value: '0–10', unit: 'cm', label: 'kam patří nejdražší příměsi' },
      { value: '5', unit: 'm³', label: 'kolik místa zabere tuna biocharu' },
      { value: '65/35', label: 'objemový poměr písku a zeminy u jílu' },
    ],
  }),

  /* Úvod – autorův příběh dvou zahrad. První, druhý a čtvrtý odstavec
     úvodu nesou tezi kresby Obr. 01, proto stojí v jejím splitu (kolo 03:
     samotný druhý+čtvrtý nechávaly split na 68 % pokrytí — první odstavec
     navíc scénu přímo otevírá, patří tam obsahově stejně jako layoutově).
     Třetí (plán článku) zůstává jediným samostatným odstavcem úvodu. */
  p('V tomto článku si nejprve představíme jednotlivé složky a vysvětlíme, co mohou v půdě změnit. Potom se podíváme, proč o směsi rozhoduje objem, přestože dodávka přijíždí v tunách, a jak příměsi rozmístit v kořenové vrstvě. Na třech modelových zahradách ukážeme vhodné rozdíly v dávkách. Teprve poté převedeme zvolený poměr na potřebné kubíky, tuny a balení pro vlastní plochu a projdeme míchání, uložení i založení trávníku.'),

  /* ── Kapitola 01 ─────────────────────────────────────────────── */
  split({
    blockName: 'Kapitola 01',
    side: 'image-right',
    drawing: 'dve-zahrady',
    eyebrow: 'Kapitola 01',
    title: 'Z čeho půdu skládáme a co která složka umí',
    number: '01',
    alt: 'Dva řezy zeminou vedle sebe: v jílovité zahradě přimíchaný písek otevírá kapce vody cestu dolů, v písčité zahradě kapku drží zrna biocharu a zeolitu u kořenů. Dole legenda značek: písek, biochar, Actino, zeolit a voda.',
    caption:
      'Stejné pytle, opačná práce. Jílu příměsi otevírají cestu pro vodu a vzduch, písku pomáhají vodu a živiny podržet.',
    body:
      'Představme si dvě sousední zahrady po stejném dešti. Na první se zemina lepí na boty a voda dlouho neodchází. Na druhé se po chvíli dá pohodlně chodit, jenže o několik suchých dnů později už tráva začíná strádat. Oběma zahradám chceme pomoci. Kdybychom ale na obě navezli stejnou směs ve stejném poměru, řešili bychom dva různé problémy jednou odpovědí.\n\nZajímavé je, že materiály mohou být v obou případech stejné: písek, původní zemina, biochar, Actino (dříve Biovin) a zeolit. Mění se jejich úloha i množství. Jílovité půdě potřebujeme otevřít cestu pro vzduch a přebytečnou vodu. Chudému písku naopak pomoci, aby část vody a živin u kořenů zůstala déle. A dobře fungující hlíně někdy prospějeme nejvíc tím, že do ní zbytečně nepřidáme další materiál.\n\nCílem je porozumět tomu, co má směs dělat. Přesná čísla ve výpočtu nám mají pomoci udržet zamýšlené poměry; při práci s navážkou se z nich nestává požadavek na vážení každého kilogramu.',
  }),

  /* Sekce písku jako split (připomínka autora po balíku „dlouhé
     sloupce": pasáž písek → biochar byla pořád stěna) — kresba mezer
     nese přesně tezi titulku sekce. */
  split({
    blockName: 'Písek a zemina',
    side: 'image-left',
    drawing: 'prany-pisek',
    titleLevel: 'h3',
    title: 'Písek a zemina: o výsledku rozhodují i mezery',
    number: '02',
    alt: 'Dva trsy pískových zrn vedle sebe: v nepraném písku vyplňují mezery mezi zrny drobné částice prachu a jílu a kapka vody stojí na povrchu; v praném písku zůstaly mezery volné a kapka po čárkované cestě prochází dolů, takže se ke kořenům vrátí i vzduch.',
    caption:
      'Tytéž mezery, dva osudy. Prach a jíl v nepraném písku je ucpou; praný je nechá volné pro vodu a vzduch – proto se praní vyplatí.',
    body:
      'Písek působí jako nejprostší položka celé objednávky. Žádné složité jméno, žádný příslib biologického zázraku. Jen zrnka. Přesto právě jeho výběr a množství mohou rozhodnout o tom, zda směs získá vlastnosti, které od ní čekáme.\n\nPísek je důležitý pro provzdušnění půdy: ve vhodném množství a zrnitosti pomáhá kyslíku pronikat ke kořenům. Musíme ale dávat pozor, kolik ho přimícháme a do jaké půdy. U písčité půdy by další písek znamenal zbytečné plýtvání penězi. Naopak malé množství písku přidané do jílovité půdy může směs ještě více zahustit, a zdravému růstu trávy tak dokonce uškodit.\n\nV následujících příkladech používáme **praný křemičitý písek s převahou zrn přibližně 0,25–1 mm**. Každá část tohoto označení má svůj důvod: praní omezuje nežádoucí jemné příměsi, křemen poskytuje odolná zrna a vhodná zrnitost pomáhá vytvářet prostředí pro pohyb vody a vzduchu.\n\n**Proč praný?** Písek může obsahovat také prachové a jílovité částice. Ty jsou mnohem menší než samotná písková zrna a mohou vyplňovat mezery mezi nimi. Vysoký podíl jemných příměsí může omezit propustnost výsledné směsi a po odtoku vody v ní ponechat méně prostoru pro vzduch. Praním se jejich obsah snižuje. Do půdy tak nepřivážíme spolu s pískem zbytečně další jíl a prach, když právě jejich nadbytek potřebujeme řešit.',
  }),
  p(['Proč křemičitý? ', BOLD], 'Křemen je tvrdý a vůči běžnému půdnímu prostředí chemicky odolný minerál. Jeho zrna se snadno nerozpadají a mohou dlouhodobě tvořit stabilní minerální kostru směsi.'),
  block({
    blockType: 'banner',
    blockName: 'Poznámka k nákupu',
    style: 'info',
    content: root([p(['Poznámka k nákupu: ', BOLD], 'U betonářského písku se často výslovně nepíše, že je praný, přestože praný bývá – při jeho přípravě se běžně odstraňují jílovité a další nežádoucí jemné příměsi kvůli použití v betonu. Pokud tedy u betonářského písku není výslovně uvedeno, že je nepraný, většinou bývá praný; pro jistotu je dobré ověřit si tuto skutečnost u dodavatele.')]),
  }),
  p('Původní zemina mezitím dodává to, co samotnému písku chybí. Obsahuje jemnější částice, organickou hmotu a povrchy, na kterých se mohou zadržovat voda i některé živiny.'),

  /* Karta složek (návrh autora): čtyři speciální příměsi patří k sobě —
     fotka materiálu + role + kam v profilu patří. Texty karet jsou
     redakční zkratky; podrobnosti nesou autorovy sekce pod blokem. */
  block({
    blockType: 'ingredients',
    blockName: 'Karta složek',
    heading: 'Čtyři pomocníci pohromadě',
    lead: 'Najetím či klepnutím na kartu se otevře, co která složka umí a odkud pochází.',
    items: [
      {
        __filename: 'slozka-biovin.avif',
        name: 'Actino',
        text: 'Organická hmota a postupně uvolňované živiny pro dobrý start trávníku. Pomůže doplnit to, co chudé půdě chybí.',
        note: '0–10 cm · 0 nebo 2,5–10 % objemu',
        title: 'Actino: organická výživa pro dobrý start trávníku',
        __panelFilename: 'panel-biovin.avif',
        detail: root([
          p('Při zakládání trávníku máme příležitost připravit kořenům dobré podmínky hned od začátku. ', ['Actino doplní do půdy organickou hmotu a živiny, které se postupně uvolňují.', BOLD], ' Největší smysl má tam, kde je zemina chudá a organickou hmotu jsme jí dlouho nedoplňovali. Vedle písku a zeminy tak do směsi přidáme i materiál, se kterým mohou dál pracovat půdní organismy.'),
          p('Actino je hroznový kompost vyráběný z matoliny, která zůstává po zpracování hroznů. Řízenou přeměnou za přístupu vzduchu, označovanou jako aerobní humifikace, z ní vzniká příměs pro zlepšení půdy. Původ a způsob výroby popisuje ', link('https://www.biovin.at/', 'výrobce'), '. Zatímco písek upravuje uspořádání půdních částic, Actino přináší organickou složku a výživu. Využijeme ho při přípravě půdy i později při hnojení trávníku podle návodu výrobku.'),
          p('V našich příkladech mu vyhradíme nejvíce prostoru v chudém, rychle vysychajícím písku. V těžké půdě s nedostatkem organické hmoty použijeme menší podíl; v dobře udržované hlinité zahradě ho do základní směsi nepřidáváme. Konkrétní dávky najdeme u jednotlivých zahrad. ', ['Pokud půdě organická hmota chybí, zařaďme Actino už do přípravy před výsevem', BOLD], ', kdy ho snadno promícháme s budoucí kořenovou vrstvou. Přinesené živiny přitom započítáme do plánu hnojení.'),
        ]),
      },
      {
        __filename: 'slozka-biochar.avif',
        name: 'Biochar',
        text: 'Pomáhá uchovat část vláhy a živin v dosahu kořenů. Zvlášť zajímavý pro lehkou půdu, která po zálivce rychle vysychá.',
        note: '0–10 cm · 2–10 % objemu',
        title: 'Biochar: zásoba vláhy a živin přímo u kořenů',
        __panelFilename: 'panel-biochar.avif',
        detail: root([
          p('Zaléváme, ale lehká půda brzy znovu vysychá. Právě v takové zahradě stojí biochar za pozornost. ', ['Jeho drobné póry mohou zadržet část vody a povrchy pomáhat s uchováním některých živin.', BOLD], ' Část zásoby tak může zůstat v kořenové vrstvě déle. Pro trávník na chudém písku je to dobrý důvod věnovat pozornost i tomu, co do půdy přimícháme při zakládání.'),
          p('Biochar vzniká zahříváním organické suroviny za omezeného přístupu kyslíku. Část uhlíku zůstává v pevném porézním materiálu s množstvím drobných prostorů. Po rovnoměrném promíchání si ho můžeme představit jako malé zásobárny rozptýlené mezi zrnky zeminy. Jak dobře budou fungovat, závisí na půdě, vlastnostech konkrétního biocharu i zvolené dávce.'),
          p(['Pro snadnou přípravu vyberme biochar určený do půdy, už obohacený živinami a připravený k zapravení.', BOLD], ' Nenabitý biochar může část živin z půdy zpočátku zachytávat; před použitím ho proto připravíme například s vlhkým kompostem. Samotná voda toto obohacení nenahradí. Co ověřit při nákupu a jak započítat kompost obsažený ve výrobku, ukazuje následující část článku.'),
        ]),
      },
      {
        __filename: 'slozka-zeolit.avif',
        name: 'Zeolit',
        text: 'Klinoptilolit 0,5–1 mm. Podrží draslík a formy dusíku, které by se vyplavily, a postupně je vrací kořenům.',
        note: '0–15 cm · 2–10 % objemu',
        title: 'Zeolit: některé živiny se mohou na chvíli zdržet',
        __panelFilename: 'panel-zeolit.avif',
        detail: root([
          p('Zeolit umí zachytit část živin, podržet je a postupně je zase uvolňovat do půdy, kde je mohou využít kořeny trávy. Pomáhá tak například s uchováním draslíku a některých forem dusíku, které by se jinak mohly s vodou vyplavit.'),
          p('Můžeme si ho představit jako malou zásobárnu živin. Její kapacita není neomezená a neuchová všechny živiny stejně dobře, ale část výživy díky ní může zůstat v dosahu kořenů déle.'),
          p('Pro zdejší příklady používáme ', ['klinoptilolitový zeolit o zrnitosti 0,5–1 mm', BOLD], '. Jeho potřebný podíl se mezi zahradami liší.'),
          p('Důvod najdeme i v samotné zemině. Jílové částice a organická hmota už dokážou některé živiny zachycovat na svých površích. Odborně se tato schopnost označuje jako ', ['kationtová výměnná kapacita', BOLD], '. Chudý písek má takových míst méně, a proto v něm zeolitu vyhradíme větší podíl. Pro praktickou práci stačí tento důsledek: v těžké půdě začneme menší dávkou, v lehkém písku větší. Zeolit však nenahradí uvolnění utužené zeminy ani odvod přebytečné vody.'),
        ]),
      },
      {
        __filename: 'slozka-mykorhiza.avif',
        name: 'Mykorhiza',
        text: 'Jemná houbová vlákna mohou rozšířit dosah kořenů za živinami. Cílená podpora při zakládání trávníku do převážně nové směsi.',
        note: 'pod osivo · dávka dle návodu',
        title: 'Mykorhiza: více půdy v dosahu kořenů',
        drawing: 'mykorhizni-vlakna',
        drawingAlt: 'Kořen rostliny v řezu půdou s malou čárkovanou kružnicí vlastního dosahu; z kořene vybíhá jemná síť mykorhizních vláken k větší kružnici. Živiny na okraji velké kružnice jsou pro samotný kořen nedosažitelné – dosáhne na ně jen síť houby.',
        detail: root([
          p('Mladý trávník má zpočátku drobné kořeny a jen omezený dosah. ', ['Mykorhizní houby s nimi mohou vytvořit soužití, při kterém jejich jemná vlákna rozšíří prostor pro získávání živin.', BOLD], ' Rostlina tak může využít i část zásoby, ke které by samotné kořeny ještě nedosáhly. Právě v této spolupráci spočívá přínos mykorhizy.'),
          p('Pro trávník vybíráme vhodný přípravek s arbuskulárními mykorhizními houbami. Houba pomáhá rostlině s příjmem živin a na oplátku od ní získává uhlík. O přidání přípravku uvažujeme především po výrazné rekonstrukci nebo při zakládání do převážně nové směsi s malým podílem biologicky aktivní půdy. V zavedené zahradní půdě už mohou vhodné houby žít, takže další přípravek nemusí přinést stejný užitek. Výsledek závisí na konkrétní půdě, výrobku a podmínkách pro soužití.'),
          p(['Při zakládání do nové směsi si vhodný přípravek připravme už před výsevem', BOLD], ', abychom ho podle návodu dostali tam, kde se s ním setkají mladé kořeny. Mykorhizu nedávkujeme procentem objemu jako zeolit: přidáváme živé houby, nikoli další podíl minerální směsi. Rozhoduje složení výrobku, jeho doporučená dávka a správné umístění, ne samotný podíl písku nebo jílu. Tak má nákup jasný účel: podpořit vznik spolupráce právě v nové kořenové vrstvě.'),
        ]),
      },
    ],
  }),


  /* Podkapitola se sazbou splitu (kolo 01: kapitola 01 měla 4 667 px
     prózy bez obrazové hmoty) — kresba nabíjení nese přesně tuhle
     trojici odstavců; krémový pás dělí úsek povrchů před kalkulátorem. */
  split({
    blockName: 'Nabíjení biocharu',
    side: 'image-right',
    drawing: 'nabity-biochar',
    titleLevel: 'h3',
    title: 'Co koupit a jak biochar připravit',
    number: '03',
    alt: 'Dvě zrna biocharu vedle sebe: nenabité má prázdné póry a šipky míří dovnitř – živiny si zpočátku bere z okolní půdy; nabité má póry naplněné živinami z kompostu a šipky míří ven ke kořenu. Dole připomínka, že samotná voda biochar jen navlhčí a že nad 10 % objemu kořeny ztrácejí vzduch.',
    caption:
      'Prázdná zásobárna se nejdřív plní – na účet trávy. Proto se biochar nabíjí kompostem předem; voda ho jen navlhčí.',
    body:
      '**Nejjednodušší je koupit biochar určený k použití v půdě, již obohacený živinami a připravený k zapravení.** V popisu nebo u dodavatele si ověříme právě tyto dvě věci: že je určený pro půdu a že už proběhlo jeho obohacení. Toto obohacení se často označuje jako „nabití“. Samotné navlhčení vodou ho nenahrazuje.\n\nDůvod je jednoduchý: **nenabitý biochar může zpočátku živiny z okolní půdy spíš odebírat, než ji o ně obohacovat.** Představme si ho jako prázdnou zásobárnu, která se teprve plní. Zachytí část živin z půdy, a tráva jich tak může mít dočasně méně k dispozici. Také mikroorganismy, které rozkládají snadno rozložitelné zbytky uhlíku v biocharu, mohou pro svou činnost dočasně spotřebovat část dostupného dusíku. Proto biochar před zapravením do půdy „nabijeme“ – tedy **předem obohatíme živinami, například přípravou s vlhkým kompostem**. Voda pomáhá živinám proniknout do jeho drobných pórů a část se zachytí na jeho povrchu. Kompost zároveň pomáhá biochar osídlit mikroorganismy. Samotná čistá voda ale nestačí: biochar navlhčí, nikoli vyživí.\n\nJeště jedna otázka při nákupu ušetří chybu v množství: **kolik samotného biocharu dodávka obsahuje?** Naše recepty počítají s objemem biocharu, nikoli celé směsi s kompostem. Kompost dodaný spolu s ním nebo použitý při domácím nabíjení proto započítáme zvlášť, stejně jako přinesené živiny při plánování hnojení. Přesný postup ukážeme až při plánování potřebného množství.',
  }),

  /* ── Kapitola 02 ─────────────────────────────────────────────── */
  split({
    blockName: 'Kapitola 02',
    surface: 'krem',
    side: 'image-left',
    drawing: 'tuna-neni-kubik',
    eyebrow: 'Kapitola 02',
    title: 'Proč směs mícháme podle objemu, ne podle tun',
    number: '04',
    alt: 'Vodorovné pruhy na společné ose ukazují, kolik místa zabere jedna tuna materiálu při modelové sypné hustotě: písek 0,67 m³, zemina 0,71 m³, zeolit 1,25 m³, Actino 1,67 m³ a biochar celých 5 m³.',
    caption:
      'Jedna tuna, pětkrát jiný kus prostoru. Objemem se určuje poměr směsi, hmotností jen objednávka a doprava.',
    body:
      'Dodavatel pracuje s tunami, kubíky a počty balení. Kdo připravuje půdu, musí oba pohledy propojit. **Stejný objem neznamená stejnou hmotnost a stejná hmotnost neznamená stejný objem.** Proto nelze objemový recept jednoduše změnit na stejné poměry tun.\n\nPro názorné srovnání vezměme pouze modelové hodnoty: písek o sypné hustotě 1,5 t/m³ a zeminu o sypné hustotě 1,4 t/m³. **Sypná hustota** vyjadřuje, kolik váží určitý objem volně nasypaného materiálu, včetně mezer mezi jeho částicemi.\n\nPři těchto předpokladech zabere **tuna písku přibližně 0,67 m³**, zatímco **tuna zeminy přibližně 0,71 m³**. Rozdíl není obrovský, ale při dodávce desítek tun už se projeví. U lehkého biocharu se sypnou hustotou 0,20 t/m³ je rozdíl ještě výraznější: **jedna tuna představuje asi 5 m³**. Tytéž tuny tedy mohou v připravované směsi obsadit velmi rozdílné místo.',
  }),

  h3('Tuna písku není stejný kus prostoru jako tuna hlíny'),
  p('Tyto hodnoty slouží k vysvětlení principu. Skutečná zemina může mít jinou hustotu než náš model a hmotnost všech materiálů ovlivňuje i jejich vlhkost. Rozhodující údaj pro objednávku proto později převezmeme od dodavatele pro materiál v dodávaném stavu.'),
  p(['Objemem určujeme poměr složek. Hmotností plánujeme objednávku, dopravu a manipulaci.', BOLD], ' Minerální základ složený ze 65 % písku a 35 % zeminy objemově tedy neznamená automaticky 65 tun písku a 35 tun zeminy. Čím rozdílnější jsou sypné hustoty, tím větší chyba by při takové záměně vznikla.'),
  p('Abyste nemuseli potřebné množství materiálu počítat ručně, připravili jsme pro vás kalkulátor. Stačí zadat plochu v metrech čtverečních, hloubku zapravení a objemový podíl jednotlivých materiálů v procentech. Získáte přehled potřebného objemu i orientační hmotnosti – tedy podklad pro objednávku a plánování dopravy. Hmotnost závisí na použité sypné hustotě, proto ji před nákupem ověřte u dodavatele.'),

  calc('primesi'),

  h3('Dobrý poměr je důležitější než zdánlivě přesné kilogramy'),
  p('Příprava půdy pro zahradu není laboratorní vážení. Vlhkost dodávek, jejich nakypření i následné slehnutí se mění. Nemá smysl předstírat, že rozdíl několika kilogramů v mnohatunové dodávce rozhoduje o budoucím trávníku. Důležité je přiblížit se zvoleným objemovým podílům a směs rovnoměrně promíchat.'),
  p('To však neznamená, že lze recepturu libovolně zaměnit. Dvě a osm procent zeolitu představují jiné návrhy, stejně jako půl kubíku biocharu a půl tuny biocharu. Praktické zaokrouhlení má odpovídat rozsahu práce; nemá z několika procent udělat násobně větší podíl. U koncentrovaných přípravků a osiva navíc dál platí dávkování konkrétního výrobku.'),
  p('Než z těchto poměrů uděláme objednávku, potřebujeme vědět, ve které části půdy mají jednotlivé složky pracovat.'),

  /* ── Kapitola 03 ─────────────────────────────────────────────── */
  split({
    blockName: 'Kapitola 03',
    side: 'image-right',
    drawing: 'tri-zony-biovin',
    eyebrow: 'Kapitola 03',
    title: 'Třicet centimetrů půdy jako prostor pro život',
    number: '05',
    alt: 'Řez profilem 30 cm rozdělený do tří zón: 0 až 10 cm minerální základ s biocharem, Actinem a zeolitem, kde žije nejvíc kořenů; 10 až 15 cm základ se zeolitem jako přechod; 15 až 30 cm jen minerální základ jako rezervoár vody a vzduchu. Přechody mezi zónami jsou plynulé, ne ostré.',
    caption:
      'Co kam patří. Drahé příměsi jen tam, kde žijí kořeny; spodní zóna je rezervoár vody a vzduchu – a přechody navazují, nejsou to patra dortu.',
    body:
      'Materiály i rozdíl mezi jejich hmotností a objemem už známe. Teď jim potřebujeme vyhradit místo – nejen vedle sebe ve směsi, ale také v různých hloubkách. Pro naše příklady zvolíme **30 cm hluboký profil určený pro nově zakládaný nebo kompletně rekonstruovaný trávník**. Profil zde znamená připravovanou vrstvu půdy od povrchu do této hloubky. Třicet centimetrů je model, nikoli předpis platný pro každou zahradu ani pokyn všude automaticky odvézt třicet centimetrů půdy.\n\nProč záleží na souvislém prostoru pro kořeny, jak půda hospodaří s vodou a vzduchem a proč samotná výška navážky nestačí, podrobně vysvětluje článek [Krásný trávník začíná pod zemí](/magazin/krasny-travnik-zacina-pod-zemi-2). Zde na něj navazujeme volbou složek a jejich rozmístěním v připravované vrstvě.',
  }),

  h3('Horní část pomáhá začátku, hlubší umožní kořenům pokračovat'),
  p('Nejpestřejší směs připravíme pro horních deset centimetrů. Zde bude biochar, zeolit a případně Actino. Zeolit pokračuje také v zóně mezi ', ['10 a 15 cm', BOLD], '. Spodních ', ['15 cm, tedy zónu mezi 15 a 30 cm', BOLD], ', tvoří samotný minerální základ. Poskytuje kořenům další prostor a půdě další objem pro vodu a vzduch.'),
  p('Dražší příměsi soustřeďujeme do horní části proto, že u trávníků bývá velká část kořenové aktivity blízko povrchu. Neznamená to, že kořeny v deseti centimetrech končí. Znamená to, že stejné množství každé příměsi nemusíme rozmisťovat do celé připravované hloubky. Jednotlivé zóny přitom navazují jako prostředí, kterým kořen postupuje dolů. To neznamená, že dražší příměsi nemůžeme zapracovat i hlouběji. Jejich přínos tam ale bývá menší, zatímco při zachování stejného podílu ve větším objemu půdy spotřeba materiálu i celkové náklady výrazně vzrostou.'),
  p('Hloubky tak máme vymezené. O tom, kolik které příměsi do nich připadne, rozhodne výchozí zahrada a vlastnost, kterou potřebujeme zlepšit.'),

  /* ── Kapitola 04 ─────────────────────────────────────────────── */
  split({
    blockName: 'Kapitola 04',
    surface: 'krem',
    side: 'image-left',
    drawing: 'tri-zahrady',
    eyebrow: 'Kapitola 04',
    title: 'Tři zahrady: jaké poměry pro ně zvolit',
    number: '06',
    alt: 'Graf rozsahů příměsí pro tři zahrady: u jílovité zeolit a biochar po 2–5 % a Actino 2,5–5 %, u hlinité zeolit a biochar po 3–7 % a Actino 0 %, u písčité zeolit 8–10 % a biochar s Actinem po 5–10 %. Zvýrazněné části sloupců ukazují rozmezí mezi dolní a horní hranicí; zbytek objemu vždy doplní minerální základ.',
    caption:
      'Tři zahrady, tři rozmezí dávek. Nejvíc příměsí dostane chudý písek; u udržované hlíny zůstává Actino na 0 % – a zbytek objemu vždy doplní minerální základ.',
    body:
      'Tři půdní typy nám dávají dobrý začátek: **těžkou půdu potřebujeme zpřístupnit vodě a vzduchu, u hlinité zachovat vyvážený základ a písčité pomoci s uchováním vláhy**.\n\nNíže jsou **tři modelové receptury pro založení nebo výraznější obnovu trávníku**. Poskytují rozsahy podílů pro popsané situace, nikoli jeden univerzální recept. Základní postup je jednoduchý: vybereme odpovídající příklad, zkontrolujeme jeho podmínky, zvolíme konkrétní podíly v uvedených rozmezích a teprve potom spočítáme množství.\n\nPokud si nejsme jistí, jakou půdu na zahradě máme, pomůže nám ji rozpoznat článek [Krásný trávník začíná pod zemí](/magazin/krasny-travnik-zacina-pod-zemi-2). Podle toho vybereme nejbližší příklad.',
  }),

  p('Dobře fungující půdu nemusíme měnit jen proto, že pro ni existuje recept v tabulce. Pokud se trávníku daří, zachovejme to, co funguje. Jestliže se naopak dlouhodobě potýkáme se zamokřením a špatným zakořeněním a příčinou je těžká, nepropustná půda, může dávat smysl důkladnější úprava a nové založení trávníku.'),
  p('U novostavby, nebo při zakládání nového trávníku, nám posouzení půdy pomůže rozlišit nutnou investici od zbytečných výdajů. Do vyvážené, dobře propustné hlíny ani do písčité půdy nemusíme automaticky navážet desítky tun písku. Stejně tak by byla škoda odvézt veškerou jílovitou zeminu a nahradit ji čistým pískem: zbavili bychom se i její schopnosti zadržovat vodu a živiny, které bychom pak museli častěji doplňovat zálivkou a hnojením. Ani u golfových hřišť neplatí, že se všechny plochy zakládají na čistém písku.'),
  p('Cílem tedy není původní půdu za každou cenu vyměnit, ale zachovat její přednosti a napravit konkrétní slabiny.'),

  table({
    width: 'edge',
    cols: [
      'Příměs a hloubka zapravení',
      ['Jílovitá zahrada přestavovaná pískem', 'right'],
      ['Těžší hlinitá zahrada s udržovanou ornicí', 'right'],
      ['Chudá, rychle vysychající písčitá zahrada', 'right'],
    ],
    rows: [
      ['Zeolit, 0–15 cm', '2–5 % objemu', '3–7 % objemu', '8–10 % objemu'],
      ['Biochar, 0–10 cm', '2–5 % objemu', '3–7 % objemu', '5–10 % objemu'],
      ['Actino, 0–10 cm', '2,5–5 % objemu', '0 %', '5–10 % objemu'],
      [
        'Samostatný mykorhizní přípravek',
        'Zvážit po přestavbě; dávka konkrétního výrobku',
        'Výchozí varianta bez přídavku',
        'Zvážit, pokud vzniká nová směs s malým podílem biologicky aktivní půdy',
      ],
    ],
  }),

  p('Mykorhizní přípravek má vlastní dávku podle plochy. Tu uvedeme na konci této kapitoly; celkovou spotřebu spočítáme v další části. Hlinitý příklad se týká ', ['těžší hlinité půdy při rekonstrukci', BOLD], ', u níž přidáváme písek. Biochar a zeolit mají v upravené směsi pomoci uchovat část vody a živin. Pokud se naše hlína dobře drobí, propouští vodu a nevysychá příliš rychle, můžeme ponechat původní půdu a tyto příměsi vynechat.'),

  /* Sekce jílu otevírá split s kresbou minerálního základu (kolo 01:
     mezi tabulkou dávek a zónovou tabulkou bylo 4 011 px prózy bez
     obrazové hmoty) — kresba nese poměry základů všech tří zahrad,
     doplněk ke sloupcům dávek v čele kapitoly. */
  split({
    blockName: 'Jílovitá zahrada',
    surface: 'krem',
    side: 'image-right',
    drawing: 'zaklad-tri-zahrad',
    titleLevel: 'h3',
    title: 'Těžká jílovitá půda: kořeny potřebují vedle vody také vzduch',
    number: '07',
    alt: 'Tři vodorovné pruhy ukazují poměr přidaného písku a původní zeminy v minerálním základu: jílovitá zahrada 65 % písku a 35 % zeminy, hlinitá 30 % písku a 70 % ornice, písčitá bez nákupu písku – 100 % původní zeminy. Poznámka připomíná, že pár lopat písku poměr nezmění a u těžkých jílů podklady uvádějí i 75 %.',
    caption:
      'Minerální základ tří zahrad. U jílu je přidaného písku většina, u dobré hlíny menšina a do písku se žádný nekupuje – příměsi si berou podíl zvlášť.',
    body:
      'Po dešti se lepí na boty, za sucha může ztvrdnout tak, že rýči pomáháme celou vahou těla. Mezi těmito dvěma stavy mají růst jemné kořeny. Jíl přitom není bezcenný materiál, kterého je potřeba se za každou cenu zbavit. Umí zadržovat vodu i živiny. Problém nastává tehdy, když uspořádání částic a zhutnění omezí vzduch a pohyb přebytečné vody.\n\nPro tento model používáme minerální základ složený objemově z **65 % písku a 35 % původní jílovité zeminy**. Vysoký podíl písku odpovídá tomu, že zde uvažujeme o výrazné změně minerální směsi. Zachovaná zemina dál přináší jemnější částice a schopnost vázat některé živiny.\n\nV této variantě počítáme s těžkou půdou, do které se dlouho nepřidávala organická hmota. Nejdříve uvolníme utužená místa a vyřešíme odtok přebytečné vody; teprve potom připravíme směs. **Zeolit i biochar volíme v rozmezí 2–5 %; Actino v rozmezí 2,5–5 %**, vždy ve vymezených horních zónách. Jílové částice už pomáhají zachycovat živiny, proto použijeme méně zeolitu než v písčité zahradě. Actino doplní organickou složku.',
  }),
  p('Současně nesmíme zapomenout, že po přidání velkého množství písku už nepracujeme s původním jílem. Proto ani nízkou dávku zeolitu neodvozujeme slepě z názvu výchozí půdy: musí odpovídat chování nové směsi.'),
  p('Kořen postupující do hloubky opouští nejpestřejší část směsi, ale pod ní dál pokračuje stejný minerální základ. Pod deseti centimetry je méně organických příměsí; kořen však nemá zůstat odkázaný pouze na obohacenou horní zónu. I níže potřebuje prostředí, kterým může prorůstat za vodou.'),
  p('Poměr 65/35 popisuje pouze minerální základ. Příměsi si z celkového objemu vezmou vlastní podíl, takže přidaný písek netvoří 65 % celé horní směsi.'),
  p('U těžkého jílu má smysl udělat zkoušku ještě před velkou objednávkou. Několik lopat písku totiž vlastnosti celé vrstvy zpravidla nezmění. Některé odborné podklady ukazují, jak významný musí být jeho podíl – u těžkých jílů je to až 75 % a více. Poměr 65/35 proto bereme jako výchozí návrh.'),
  p('Samostatný mykorhizní přípravek lze po této výrazné přestavbě zvážit. Jde o volitelnou položku, která má přijít do kontaktu s budoucími kořeny. Houby nenahradí vyřešení zamokření a utužení. Jejich dávku odvodíme od konkrétního výrobku, nikoli od typu půdy.'),
  p('A pod celou novou směsí musí dál existovat funkční cesta pro vodu.'),

  h3('Střední hlinitá půda: zachovat vyvážený základ'),
  p('Dobře fungující hlinitá půda mívá nenápadnou výhodu: člověk si její práce skoro nevšimne. Voda se vsákne, zemina se drobí a za sucha ještě nějakou vláhu uchová. Teprve srovnání s těžkým jílem nebo hrubým pískem ukáže, kolik starostí za nás taková půda řeší.'),
  p('V našem příkladu obnovujeme trávník na ', ['těžší hlinité půdě se zachovanou a udržovanou ornicí', BOLD], '. Horní úrodná vrstva tedy zůstává využitelná, ale směs chceme udělat lépe zpracovatelnou a propustnější. Minerální základ proto tvoří ', ['30 % přidaného písku a 70 % původní hlíny objemově', BOLD], '. Tento poměr patří k popsané přestavbě; dobře drobtovitou a propustnou hlínu jím nemusíme nahrazovat.'),
  p(['Actino v tomto základním hlinitém příkladu vynecháme. Biochar i zeolit volíme v rozmezí 3–7 %', BOLD], ' v jejich určených zónách. Tyto menší přídavky mají podpořit uchování vody a některých živin v nově promíchané půdě. Písek upravuje minerální základ, zatímco porézní příměsi pomáhají se zásobou vláhy; každá složka tedy dostává jiný úkol. Rozmezí 3–7 % je součástí tohoto modelu, nikoli důkazem, že každá hlína potřebuje více příměsí než každý jíl.'),
  p('U hlíny se proto nejdříve zastavíme u otázky, zda popsanou přestavbu vůbec potřebujeme. Jestliže se voda vsakuje, zemina se ve vlhkém stavu snadno drobí a během běžné péče příliš rychle nevysychá, ponecháme ji. Urovnání, odstranění kamenů a uvolnění míst utužených technikou mohou být užitečnější než nová dodávka materiálu. Hlinitá půda je pro trávník dobrý výchozí stav a nemá smysl ji bez důvodu měnit.'),
  p('Samostatný mykorhizní přípravek v této základní variantě nenakupujeme. U zachované biologicky aktivní půdy nemáme důvod jeho přínos předpokládat automaticky. Jestliže ale rekonstrukce vytvoří převážně novou směs a rozhodneme se pro inokulaci – záměrné přidání živých hub – použijeme dávku vybraného výrobku.'),
  p('U dobře fungující hlinité zahrady tak může být podíl nového písku, zeolitu i biocharu ', ['nula', BOLD], '. Minerálním základem zůstane původní půda. Jiná situace nastává, pokud máme sice hlinitou zeminu, ale dlouhodobě zanedbanou, bez doplňování organické hmoty. Pro tento případ lze jako variantu připravit ', ['2,5–5 % Actina v horních 10 cm', BOLD], '. Potřebný prostor získá ubráním části minerálního základu; množství spočítáme později. Ani tehdy z Actina neděláme lék na každý slabý trávník: pokud pod rýčem najdeme ztvrdlou vrstvu po bagru, prvním krokem je její rozrušení.'),

  h3('Lehká písčitá půda: prodloužit dobu, po kterou mají kořeny z čeho čerpat'),
  p('Do lehké písčité půdy se příjemně zaboří rýč. V červenci už však její vlastnosti nemusejí být stejně příjemné pro trávník. Voda jí snadno prochází, vzduch obvykle nechybí, ale zásoba dostupná kořenům se rychle vyčerpává. Některé rozpuštěné živiny navíc pokračují s vodou hlouběji, než kam právě dosahují kořeny.'),
  p(['Další písek sem nepřidáváme.', BOLD], ' Minerální kostra je písčitá už na začátku. Chceme proto doplnit schopnost půdy hospodařit s vodou a živinami: biochar a zeolit mají posílit zásobní vlastnosti horní části, Actino přináší organickou složku a výživu.'),
  p('Nulové množství písku v tabulce neznamená půdu bez písku. Znamená nulový nákup dalšího písku; ten stávající zůstává součástí původní zeminy.'),
  p('Předpokládáme zde půdu chudou na organickou hmotu, s malou zásobou živin a rychlým vysycháním. Proto volíme ', ['8–10 % zeolitu v horních 15 cm a po 5–10 % biocharu a Actina v horních 10 cm', BOLD], '. Konkrétní dávku v každém rozmezí zvolíme podle vlastností půdy a dodaných materiálů. S tímto návrhem počítáme pro chudou písčitou půdu bez pravidelného doplňování kompostu.'),
  p('Na tomto příkladu je dobře vidět, proč nelze příměs hodnotit odděleně od půdy. Tentýž biochar vstupuje do odlišných podmínek. U jílu musíme hlídat dostatek vzduchu a odvod přebytečné vody. U písku nás více zajímá, zda pomůže prodloužit dobu, po kterou zůstává voda dostupná. Materiál si přináší své vlastnosti, ale jeho užitek se projeví až ve směsi, do které ho vložíme.'),
  p('Pokud při zakládání vzniká převážně nová písčitá směs s malým podílem biologicky aktivní půdy, lze zvážit mykorhizní přípravek. Tak jako u předchozích příkladů dávkujeme dle doporučení výrobce bez souvislosti s typem půdy.'),

  h3('Jak na sebe navazují poměry v jednotlivých hloubkách'),
  p('Příměsi nahrazují část minerálního základu. V každé zóně proto zůstává součet podílů 100 %. Níže jsou rozmezí pohromadě. Nejprve zvolíme konkrétní podíl každé příměsi a minerálním základem doplníme zbytek do 100 %. Nejnižší podíl základu odpovídá nejvyšším dávkám všech příměsí a naopak; krajní hodnoty nelze libovolně sčítat.'),
  table({
    width: 'edge',
    surface: 'krem',
    cols: ['Zóna', 'Jílovitý příklad', 'Hlinitý příklad', 'Písčitý příklad'],
    rows: [
      [
        '0–10 cm',
        '85–93,5 % základu + 2–5 % biocharu + 2,5–5 % Actina + 2–5 % zeolitu',
        '86–94 % základu + 3–7 % biocharu + 3–7 % zeolitu',
        '70–82 % základu + 5–10 % biocharu + 5–10 % Actina + 8–10 % zeolitu',
      ],
      ['10–15 cm', '95–98 % základu + 2–5 % zeolitu', '93–97 % základu + 3–7 % zeolitu', '90–92 % základu + 8–10 % zeolitu'],
      ['15–30 cm', '100 % základu', '100 % základu', '100 % základu'],
    ],
  }),
  p('U jílovité varianty se zbylý minerální základ dělí objemově 65/35 mezi písek a zeminu, u hlinité 30/70. U písčité ho tvoří původní písčitá zemina. Tyto poměry základu se nemění s hloubkou, ale jeho podíl v celé směsi ano.'),

  h3('Kdy dávku upravit a kdy příměs vynechat'),
  p('Pro první přípravu zvolíme podíly v rozmezích odpovídající zahrady. Pokud chceme snížit náklady nebo porovnat dvě směsi na malé ploše, můžeme začít u dolní hranice a jednotlivé dávky upravovat v uvedeném rozmezí. Není nutné zkoušet všechny kombinace. Vždy měníme jednu dávku a prostor, který jí přidáme či ubereme, vyrovnáme opačnou změnou minerálního základu.'),
  p('U písčité zahrady pracujeme s ', ['8–10 % zeolitu v horních 15 cm', BOLD], '. Dolní hranice znamená menší spotřebu, horní je možností k ověření na velmi hrubé, rychle vysychající půdě; není to automaticky lepší recept. Biochar i Actino zůstávají v rozmezí 5–10 % horních 10 cm.'),
  p('U biocharu porovnáváme dávky v rozmezí 2–5 % horních 10 cm pro jílovitou zahradu, 3–7 % pro hlinitou a 5–10 % pro písčitou. Místo uvolněné biocharem zaujme minerální základ; ostatní příměsi zůstávají stejné, pokud současně neměníme i jejich návrh. Poloviční dávka nemusí znamenat poloviční účinek a více materiálu nezaručuje úměrně větší užitek. Výsledek vzniká ze souhry celé půdy.'),
  p('U těžké půdy nejprve odstraníme utužení a překážky odtoku vody. U lehké půdy při srovnání sledujeme, jestli směs mezi zálivkami vysychá pomaleji. Tím dostává změna dávky konkrétní měřítko: řešíme vlastnost, kterou jsme chtěli upravit. Samotné přidání dražšího materiálu ještě neznamená lepší výsledek.'),

  h3('Mykorhizní přípravek má vlastní pravidla dávkování'),
  p('Ve fungující hlinité půdě samostatný přípravek není automatickou nákupní položkou. Nulová dávka znamená, že nic nepřikupujeme, nikoli že v půdě žádné mykorhizní houby nejsou. Po výrazné rekonstrukci nebo při vytváření převážně nové směsi lze inokulaci zvážit. Sucho samo neprokazuje nedostatek vhodných hub.'),
  p(['Dávku mykorhizního přípravku volíme podle návodu konkrétního výrobku a účelu použití, nikoli podle typu půdy.', BOLD], ' Pokud návod rozlišuje běžné založení trávníku a náročnější podmínky, držíme se dávky pro odpovídající použití. Samotná písčitá půda není důvodem k jejímu zvýšení. Jestliže tentýž přípravek použijeme ve všech třech zahradách za stejným účelem a za podmínek odpovídajících návodu, jeho dávka může zůstat stejná.'),
  p('Tím máme rozhodnuto o složení: které materiály použít, v jakých podílech a do jaké hloubky. Nyní lze přejít k otázce, kolik jich potřebuje vlastní zahrada.'),

  /* ── Kapitola 05 – bez kresby, obraz nese full-bleed fotografie ──
     Pořadí titulek → obraz → próza jako u ostatních kapitol. Kapitola
     je tabulková; kresba by tu soupeřila se čtyřmi tabulkami dat. */
  chapter('Od zvoleného poměru k dodávce: kolik materiálu zahrada potřebuje', 'Kapitola 05'),
  figure(
    'fig-dodavka-materialu.avif',
    '08',
    'Objem spočítáme doma, hmotnost potvrdí dodavatel. Dodávka pak na zahradě zabere přesně tolik místa, kolik jí návrh vyhradil.',
    'bleed',
    false,
  ),
  p('Teprve teď má smysl počítat objednávku. Už víme, kterou vlastnost půdy chceme upravit, které složky použijeme a kam mají přijít. Výpočet tento návrh převádí na vlastní plochu: nejdříve zjistíme objem upravovaných zón, z něj podíly příměsí a nakonec hmotnost pro dopravu. Výsledkem má být srozumitelný plán dodávky a práce.'),

  /* REDAKČNÍ POZNÁMKA PŘEDLOHY: velký receptový kalkulátor (vstupy tří
     receptur, hustoty dodávek, balení…) do této verze NEPATŘÍ a nesmí
     na něj vzniknout odkaz. Výklad níže je použitelný i samostatně. */

  h3('Začneme plochou a hloubkou, kterou skutečně upravujeme'),
  p('Plocha sama ještě neříká, jak velkou dodávku potřebujeme. Sto metrů čtverečních může být čtverec deset na deset metrů – na pohled žádný park. Pokud ale připravujeme celý třiceticentimetrový profil, jde o ', ['30 m³ půdy, tedy 30 000 litrů', BOLD], '. Právě hloubka mění několik procent příměsi ve stovky kilogramů a úpravu minerálního základu v desítky tun.'),
  p('Základní vztah je jednoduchý:'),
  p(['Objem v m³ = plocha v m² × tloušťka vrstvy v metrech.', BOLD]),
  p('Deset centimetrů je 0,10 m, pět centimetrů 0,05 m a patnáct centimetrů 0,15 m. Na ploše 100 m² proto horní zóna 0–10 cm představuje ', ['10 m³', BOLD], ', zóna 10–15 cm ', ['5 m³', BOLD], ' a spodní zóna 15–30 cm ', ['15 m³', BOLD], '. Jejich součet dává zmíněných 30 m³. Na ploše 50 m² jsou všechny tyto objemy poloviční.'),
  p('Počítáme pouze s částí, kterou opravdu upravujeme. Pokud spodní půda vyhovuje a pracujeme jen nahoře, není důvod objednávat materiál, jako bychom přestavovali celý profil. Stejně tak při různých hloubkách zásahu rozdělíme plochu na odpovídající části. Třiceticentimetrový příklad slouží k pochopení souvislostí a porovnání variant, ne jako povinný výkop.'),

  h3('Příměsi nejprve získají svůj podíl, minerální základ tvoří zbytek'),
  p('Potřebný objem příměsi vypočteme z objemu zóny, do které přijde:'),
  p(['Objem příměsi = objem příslušné zóny × její objemový podíl.', BOLD]),
  p('U písčitého příkladu na 100 m² má horních 15 cm objem 15 m³. Rozmezí 8–10 % zeolitu tedy znamená ', ['1,2–1,5 m³', BOLD], ', modelově přibližně ', ['0,96–1,20 t', BOLD], '. Biochar i Actino patří pouze do horních 10 cm, tedy do 10 m³. Rozmezí 5–10 % znamená pro každý z nich ', ['0,5–1,0 m³', BOLD], '. Hmotnost těchto stejně velkých podílů se však bude lišit: s našimi výpočetními hustotami asi ', ['0,10–0,20 t biocharu a 0,30–0,60 t Actina', BOLD], '.'),
  p('V celém písčitém profilu na 100 m² příměsi zaujmou ', ['2,2–3,5 m³', BOLD], ' a původní zemina ', ['26,5–27,8 m³', BOLD], '. V jílovitém a hlinitém modelu zaujmou příměsi shodně ', ['0,75–1,75 m³', BOLD], ', ale s jiným složením. Pro minerální základ v obou případech zbývá ', ['28,25–29,25 m³', BOLD], '. Vyšší objem příměsí vždy spojíme s nižším objemem základu, aby celkem zůstalo 30 m³.'),
  p('Teprve tento zbytek rozdělíme mezi písek a zeminu. U jílovitého příkladu použijeme poměr 65/35, u hlinitého 30/70. Kdybychom nejprve objednali písek a zeminu pro celý profil a příměsi přidali navrch, změnili bychom celkové množství i poměry. Přidat například dalších 12,5 % původního objemu ke kompletnímu základu neznamená vytvořit směs s původně zamýšlenými podíly.'),
  p('Rozdíl mezi základem a celou směsí je patrný i nahoře v jílovité variantě: minerální základ zaujímá 85–93,5 % objemu a písek tvoří 65 % tohoto základu. V celé horní směsi tak přidaný písek představuje přibližně ', ['55,3–60,8 %', BOLD], '. Zbytek prostoru patří zemině a ostatním složkám. Přesné krajní výsledky násobení jsou 55,25 % a 60,775 %, ale pro skutečné míchání nemá smysl usilovat o přesnost na tisíciny procenta. Podstatné je nezaměnit podíl v základu za podíl v celé směsi.'),

  /* Podkapitola se sazbou splitu (kolo 01: mezi koncem kapitoly 04
     a přehledy kapitoly 05 zůstával nejdelší úsek bez posunu povrchu
     i díra bez obrazové hmoty) — kresba slehnutí nese přesně tuhle
     trojici odstavců. */
  split({
    blockName: 'Slehnutí vstupů',
    surface: 'krem',
    side: 'image-left',
    drawing: 'slehnuti-vstupu',
    titleLevel: 'h3',
    title: 'Receptura popisuje vstupy, povrch ukáže výsledek po slehnutí',
    number: '09',
    alt: 'Vlevo dva zvlášť odměřené sloupce: vyšší s hrubším pískem a nižší s jemnější zeminou. Vpravo stejně široký sloupec jejich směsi po promíchání a slehnutí: písek s drobnými částicemi zeminy v mezerách. Čárkovaná linka nad ním leží ve výšce obou vstupů dohromady. Hladina směsi končí pod ní, protože jemnější částice zapadly do mezer mezi hrubšími.',
    caption:
      'Součet vstupů není výsledná výška. Jemné částice zapadnou do mezer mezi hrubšími – proto se poměr odměřuje před promícháním a rezerva vede zvlášť.',
    body:
      'Objemové podíly se vztahují k jednotlivým materiálům **před promícháním**. Po spojení se jemnější částice mohou usadit mezi hrubšími a změní se uspořádání pórů. Ze součtu vstupních objemů proto nevznikne zaručeně stejný objem uložené a slehlé směsi.\n\nPro plánování používáme vypočtené množství jako společný základ. Při realizaci pak ověříme výšku a stav skutečně uloženého materiálu. Automatická přirážka bez znalosti konkrétní směsi by mohla být stejně zavádějící jako předpoklad, že neslehne vůbec. Případnou rezervu domluvíme podle materiálů a způsobu ukládání a vedeme ji odděleně od samotného poměru složek.\n\nStejné pravidlo platí pro pevné nosiče. **Tabulky počítají s objemem samotného biocharu.** Půl kubíku biocharu není totéž jako půl kubíku připraveného výrobku obsahujícího 0,4 m³ biocharu a 0,1 m³ kompostu. Pokud má recept obsahovat požadovaný objem samotného biocharu, musíme znát složení dodávky. Kompost přivezený spolu s ním se započítá zvlášť a nahradí odpovídající část minerálního základu. Podobně započítáme známý objem nosiče mykorhizního přípravku v místě aplikace.',
  }),

  h3('Jak z kubíků získat tuny pro objednávku'),
  p('Pro převod potřebujeme sypnou hustotu, se kterou jsme se setkali při srovnání jedné tuny písku a zeminy. Do objemu zahrnuje i mezery mezi částicemi. Hustota samotného křemenného zrna by pro tento účel nebyla správným údajem: nasypaný písek není jednolitý kámen.'),
  p(['Hmotnost v tunách = objem v m³ × sypná hustota v t/m³.', BOLD]),
  p('Pro menší balení lze použít stejný vztah v litrech a kilogramech:'),
  p(['Hmotnost v kg = objem v litrech × sypná hustota v kg/l.', BOLD]),
  p('Kubický metr je 1 000 litrů a tuna 1 000 kilogramů. Sypná hustota má proto číselně stejnou hodnotu v t/m³ a v kg/l. V následujících přepočtech používáme společné orientační hodnoty:'),
  table({
    cols: ['Materiál', ['Modelová sypná hustota', 'right'], ['Přibližný objem jedné tuny', 'right']],
    rows: [
      ['Praný písek', '1,50 t/m³ = 1,50 kg/l', '0,67 m³'],
      ['Původní zemina', '1,40 t/m³ = 1,40 kg/l', '0,71 m³'],
      ['Zeolit', '0,80 t/m³ = 0,80 kg/l', '1,25 m³'],
      ['Actino', '0,60 t/m³ = 0,60 kg/l', '1,67 m³'],
      ['Biochar', '0,20 t/m³ = 0,20 kg/l *', '5 m³ *'],
    ],
    note: '* Pouze počtový předpoklad. U zeminy používáme ve všech třech zahradách stejnou orientační hodnotu pro srovnání; skutečná jílovitá, hlinitá i písčitá zemina se mohou lišit. U Actina podklady uvádějí přibližně 0,60–0,65 t/m³. Hustota 0,20 t/m³ u biocharu není deklarací každého výrobku ani potvrzenou hustotou již obohaceného materiálu.',
  }),
  p('Pro představu, jak velkou chybu může způsobit záměna jednotek: jeden kubík písku v tomto modelu váží 1,5 t, jeden kubík biocharu 0,2 t. Pokud namísto stejných objemů přivezeme po jedné tuně, získáme asi 0,67 m³ písku a 5 m³ biocharu. Z objemového poměru jedna ku jedné se stane směs, v níž biochar zabírá přibližně ', ['88 % součtu vstupních objemů', BOLD], '. Stejná hmotnost tedy vůbec nezajistila stejný podíl v půdě.'),
  p('A obráceně: vyhradíme-li biocharu pět procent z 10 m³ vstupních surovin, vždy jde o 0,5 m³. Tento objem může podle skutečné sypné hustoty a vlhkosti dodávky vážit například 0,10 nebo 0,20 t. Požadovaný objemový podíl zůstává stejný, přestože se změní hmotnost na dodacím listu.'),

  h3('Před objednávkou si necháme potvrdit objem a hmotnost dodávky'),
  p('Předem navlhčený biochar může být podstatně těžší než suchý, aniž by odpovídajícím způsobem přibylo samotného uhlíkatého materiálu. Vodu převážíme také. Stejný problém potkáme u zeminy a písku: hmotnost závisí na stavu, ve kterém materiál přijede.'),
  p('Pro objednávku tedy dodavateli sdělíme vypočtený objem a necháme si potvrdit, jaké hmotnosti jeho dodávky odpovídá. Můžeme to říct jednoduše: ', ['„Potřebuji připravený materiál obsahující půl kubíku samotného biocharu. Jaký bude celkový objem a hmotnost dodávky a kolik kompostu s ní případně přijede?“', BOLD], ' Podobně si necháme převést kubíky písku či zeminy na tuny.'),
  p('Pokud dodavatel uvádí sypnou hustotu, použijeme předchozí vzorec. Pokud prodává biochar po litrech a objem je jasně uvedený, objednáme potřebné litry přímo; hmotnost pak slouží hlavně dopravě. Samostatné měření doma k tomuto kroku nepotřebujeme.'),
  p('Číselný přepočet má odpovídat materiálu v dodávaném stavu. Volně nasypaný objem a objem po uložení a slehnutí nejsou zaměnitelné. Proto během práce kontrolujeme také výslednou výšku a případnou rezervu plánujeme zvlášť. Tím spojíme jednoduchou objednávku se skutečností na zahradě.'),

  h3('Tři přehledy spotřeby pro celý třiceticentimetrový profil'),
  p('Následující tabulky převádějí uvedená rozmezí na spotřebu pro 50 a 100 m². Spodní hodnoty příměsí patří k horním hodnotám minerálního základu a naopak. Před objednávkou zvolíme konkrétní podíly; nelze sečíst všechna minima nebo všechna maxima tabulky. U objemných minerálních složek používáme prakticky zaokrouhlené kubíky a tuny, u menších příměsí také litry a kilogramy. ', ['Zaokrouhlení slouží plánování; neznamená jiný recept.', BOLD], ' Součty zaokrouhlených čísel se mohou mírně lišit od přesného výpočtu.'),
  p('Řádek s původní zeminou ukazuje, kolik jí ve směsi ponecháváme. Není to automaticky materiál, který máme kupovat. Hvězdička u biocharu připomíná výpočetní předpoklad 0,20 t/m³. Volitelná mykorhiza a případný další pevný nosič nejsou zahrnuté do základních objemových součtů.'),

  table({
    heading: 'Jílovitý model: hlavní dodávkou je písek',
    surface: 'krem',
    cols: ['Materiál v celém profilu', ['Na 50 m²', 'right'], ['Na 100 m²', 'right']],
    rows: [
      ['Přidaný písek', '≈ 9,2–9,5 m³ / 13,8–14,3 t', '≈ 18,4–19,0 m³ / 27,5–28,5 t'],
      ['Původní jílovitá zemina k ponechání', '≈ 4,9–5,1 m³ / 6,9–7,2 t', '≈ 9,9–10,2 m³ / 13,8–14,3 t'],
      ['Biochar v horních 10 cm, 2–5 %', '100–250 l / ≈ 20–50 kg *', '200–500 l / ≈ 40–100 kg *'],
      ['Actino v horních 10 cm, 2,5–5 %', '125–250 l / ≈ 75–150 kg', '250–500 l / ≈ 150–300 kg'],
      ['Zeolit v horních 15 cm, 2–5 %', '150–375 l / ≈ 120–300 kg', '300–750 l / ≈ 240–600 kg'],
    ],
    note: '* Výpočetní předpoklad 0,20 t/m³. Sloupce uvádějí objem a orientační hmotnost.',
  }),
  p('Přibližně 27,5–28,5 tuny písku na sto metrů čtverečních představuje skutečnou přestavbu kořenového prostředí. Základní nové složky v tomto modelu teoreticky nahrazují přibližně ', ['19,8–20,1 m³ původní zeminy', BOLD], '. Musíme vyřešit, kam ustupující zemina přijde: zda ji odvezeme, využijeme jinde, nebo promyslíme změnu výšky terénu. Jde o bilanci vstupních objemů, nikoli o přesný objem odvozu po nakypření.'),

  table({
    heading: 'Hlinitý model: více původní půdy a menší zásah',
    surface: 'krem',
    cols: ['Materiál v celém profilu', ['Na 50 m²', 'right'], ['Na 100 m²', 'right']],
    rows: [
      ['Přidaný písek', '≈ 4,2–4,4 m³ / 6,4–6,6 t', '≈ 8,5–8,8 m³ / 12,7–13,2 t'],
      ['Původní hlinitá zemina k ponechání', '≈ 9,9–10,2 m³ / 13,8–14,3 t', '≈ 19,8–20,5 m³ / 27,7–28,7 t'],
      ['Biochar v horních 10 cm, 3–7 %', '150–350 l / ≈ 30–70 kg *', '300–700 l / ≈ 60–140 kg *'],
      ['Actino v horních 10 cm', '0 l / 0 kg', '0 l / 0 kg'],
      ['Zeolit v horních 15 cm, 3–7 %', '225–525 l / ≈ 180–420 kg', '450–1 050 l / ≈ 360–840 kg'],
    ],
    note: '* Výpočetní předpoklad 0,20 t/m³. Sloupce uvádějí objem a orientační hmotnost.',
  }),
  p('Na sto metrech čtverečních nové složky teoreticky nahrazují přibližně ', ['9,5–10,2 m³ původní zeminy', BOLD], '. Ani třicetiprocentní podíl písku v minerálním základu proto není malá dodávka, když ho rozpočítáme na celou plochu a hloubku. Pokud písek není potřeba, jeho prostor zaujme původní půda a tuto položku neobjednáváme.'),
  p('U hlíny s nedostatkem organické hmoty jsme připustili variantu s 2,5–5 % Actina v horních 10 cm. Pro 100 m² jde o ', ['0,25–0,50 m³, tedy 250–500 litrů a modelově 0,15–0,30 t Actina', BOLD], '. O tento objem se zmenší minerální základ: u poměru 30/70 ubude 0,075–0,150 m³ písku a 0,175–0,350 m³ hlíny, tedy 75–150 a 175–350 litrů. Tento doplňkový přepočet neplatí současně s nulovou položkou Actina v základní tabulce; popisuje alternativu pro jiný výchozí stav půdy.'),

  table({
    heading: 'Písčitý model: bez dalšího písku, s větším podílem příměsí',
    surface: 'krem',
    cols: ['Materiál v celém profilu', ['Na 50 m²', 'right'], ['Na 100 m²', 'right']],
    rows: [
      ['Další písek', '0 m³ / 0 t', '0 m³ / 0 t'],
      ['Původní písčitá zemina k ponechání', '13,25–13,9 m³ / ≈ 18,6–19,5 t', '26,5–27,8 m³ / ≈ 37,1–38,9 t'],
      ['Biochar v horních 10 cm, 5–10 %', '250–500 l / ≈ 50–100 kg *', '500–1 000 l / ≈ 100–200 kg *'],
      ['Actino v horních 10 cm, 5–10 %', '250–500 l / ≈ 150–300 kg', '500–1 000 l / ≈ 300–600 kg'],
      ['Zeolit v horních 15 cm, 8–10 %', '600–750 l / ≈ 480–600 kg', '1 200–1 500 l / ≈ 960–1 200 kg'],
    ],
    note: '* Výpočetní předpoklad 0,20 t/m³. Sloupce uvádějí objem a orientační hmotnost.',
  }),
  p('I bez nákupu písku přinášíme na 100 m² ', ['2,2–3,5 m³ nových základních materiálů', BOLD], '. Při zachování výšky povrchu jim musí odpovídající část původní zeminy ustoupit. Skutečnost, že největší položku z jílovité varianty vůbec nepotřebujeme, neznamená, že další příměsi nezabírají místo. Také hmotnost písčité zeminy v tabulce je pouze přepočet ze společné modelové hustoty.'),

  h3('Co udělá s objednávkou jiná dávka příměsi'),
  p('Rozmezí zeolitu můžeme přepočítat pro každou ze tří zahrad. Tabulka uvádí pouze zeolit; jeho podíl volíme v příslušném rozmezí a stejný objem odečteme od minerálního základu.'),
  table({
    surface: 'krem',
    cols: ['Zeolit v horních 15 cm', ['Na 50 m²', 'right'], ['Na 100 m²', 'right']],
    rows: [
      ['2–5 % – jílovitá zahrada', '150–375 l / ≈ 0,12–0,30 t', '300–750 l / ≈ 0,24–0,60 t'],
      ['3–7 % – hlinitá zahrada', '225–525 l / ≈ 0,18–0,42 t', '450–1 050 l / ≈ 0,36–0,84 t'],
      ['8–10 % – písčitá zahrada', '600–750 l / ≈ 0,48–0,60 t', '1 200–1 500 l / ≈ 0,96–1,20 t'],
    ],
  }),
  p('U písčité zahrady při 8–10 % zeolitu a po 5–10 % biocharu a Actina zbývá v horních 10 cm 70–82 % minerálního základu a mezi 10 a 15 cm 90–92 %. V celém profilu na 100 m² použijeme ', ['26,5–27,8 m³ původní zeminy', BOLD], '. Horní hranice množství zeminy odpovídá dolním hranicím všech tří příměsí a naopak. Pokud měníme pouze zeolit, dávky biocharu a Actina ponecháme na zvolených hodnotách. Hmotnosti zeolitu v tabulce vycházejí z 0,80 t/m³.'),
  p('Také změnu biocharu lze přepočítat bez změny dávky ostatních příměsí. Místo, které biocharu přidáme nebo ubereme, se opačně promítne do minerálního základu.'),
  table({
    surface: 'krem',
    cols: ['Biochar v horních 10 cm', ['Na 50 m²', 'right'], ['Na 100 m²', 'right']],
    rows: [
      ['2–5 % – jílovitá zahrada', '100–250 l / ≈ 20–50 kg *', '200–500 l / ≈ 40–100 kg *'],
      ['3–7 % – hlinitá zahrada', '150–350 l / ≈ 30–70 kg *', '300–700 l / ≈ 60–140 kg *'],
      ['5–10 % – písčitá zahrada', '250–500 l / ≈ 50–100 kg *', '500–1 000 l / ≈ 100–200 kg *'],
    ],
    note: '* Hmotnosti biocharu vycházejí pouze z počtového předpokladu 0,20 t/m³. Po zvlhčení, přípravě nebo při použití jiného výrobku se změní. Tabulka vyjadřuje spotřebu materiálu, nikoli přímo úměrnou změnu růstu trávníku.',
  }),

  h3('Menší balení a mykorhiza: jiná jednotka, stejná potřeba správného podkladu'),
  p('Velké minerální dodávky plánujeme v kubících a tunách. U výrobků prodávaných v pytlích potřebujeme i počet balení. Například zeolit pro jílovitou variantu na 100 m² představuje ', ['0,30–0,75 m³ a při 0,8 t/m³ přibližně 0,24–0,60 t', BOLD], ', tedy 12–30 dvacetikilových pytlů podle zvoleného podílu 2–5 %. Biochar prodávaný po litrech lze objednat přímo podle objemu; hmotnost stále potřebujeme pro dopravu.'),
  p('U Actina pro jílovitou variantu na 100 m² vychází ', ['250–500 litrů a orientačně 150–300 kg', BOLD], '. Pokud skutečná hmotnost dodávky odpovídá tomuto přepočtu, potřebujeme 8–15 dvacetikilových pytlů. Písčitá varianta potřebuje ', ['500–1 000 litrů a orientačně 300–600 kg', BOLD], ', tedy 15–30 takových pytlů. Konkrétní počet vychází ze zvoleného podílu v rozmezí. Při jiné hmotnosti litru se změní i počet balení; potřebné litry pro zvolený podíl zůstávají stejné. Počet pytlů proto před nákupem ověříme podle údajů dodavatele a zaokrouhlíme nahoru.'),
  p('Nakoupená rezerva slouží k dokončení práce, nemusíme ji automaticky celou zapracovat. Hlavním vodítkem zůstává zvolený poměr. U mnohatunové směsi se soustředíme na přiměřené množství a rovnoměrné promíchání, nikoli na jednotlivé kilogramy.'),
  p('Mykorhizní přípravek počítáme podle plochy a skutečného návodu. Dávka ', ['100 g/m²', BOLD], ' pro běžné založení při použití uvedeného TurfCompu znamená ', ['5 kg na 50 m² a 10 kg na 100 m²', BOLD], ', ať jej v dané situaci použijeme u jílu, hlíny nebo písku. Pokud ho u hlinitého modelu nezařadíme, nákup zůstává nulový. Pro jiný výrobek s dávkou například ', ['150 g/m²', BOLD], ' by výpočet činil ', ['7,5 a 15 kg', BOLD], '. Jde pouze o přepočet jiného návodu, nikoli o mezistupeň určený určitému půdnímu typu.'),
  p('Tyto hmotnosti patří celému přípravku. Litry jeho nosiče nelze doplnit bez sypné hustoty nebo údaje o objemu balení. Je-li objem známý, nahradí odpovídající část minerálního základu v mělké zóně aplikace. Proto ho základní tabulky bez těchto údajů automaticky nezahrnují.'),

  h3('Actino započítáme také při výběru hnojiva'),
  p('Actino spolu s organickou hmotou přináší živiny. Ty se uvolňují postupně, takže hmotnost přidaného Actina nelze zaměnit za okamžitou dávku hnojiva pro mladé rostliny. Pro zakládání trávníku je ale důležité, že už jsme část výživy do půdy vložili. Obsah živin uvádí ', link('https://www.biovin.at/files/opensauce/downloads/Greenkeeperinfo.pdf', 'produktový list výrobce'), '.'),
  p('Praktický postup je jednoduchý: ', ['startovací hnojivo vybíráme současně s Actinem a dodavateli sdělíme, kolik Actina do půdy zapracujeme a na jak velkou plochu', BOLD], '. U jílovitého příkladu je to podle zvoleného podílu orientačně 150–300 kg na 100 m², u písčitého 300–600 kg na 100 m². Dodavateli sdělíme konkrétní plánované množství v tomto rozmezí. Pokud s biocharem přidáváme kompost, uvedeme také jeho množství. Požádáme o doporučení startovacího hnojiva a dávky pro tuto kombinaci, kterou potom dodržíme.'),
  p('Tento krok předejde jednoduché chybě: nespojíme bez rozmyslu několik plných hnojivých dávek, jako by každá byla jediným zdrojem výživy. Zároveň nepředpokládáme, že Actino automaticky zajistí vše, co bude trávník po celou sezonu potřebovat. Další péči přizpůsobíme zvolenému hnojivému programu a vývoji porostu.'),
  p('Objednávka tak má dva důležité podklady: kolik prostoru jednotlivé suroviny ve směsi zaujmou a co do ní kromě svého objemu přinesou. Jakmile je máme, můžeme plánovat dodávky a práci podle velikosti zahrady, přístupové cesty a místa pro manipulaci.'),

  /* ── Kapitola 06 ─────────────────────────────────────────────── */
  chapter('Jak směs připravit a uložit při skutečné práci', 'Kapitola 06'),
  p('Správně vybrané materiály a vhodné poměry ještě nejsou hotovým prostředím pro kořeny. Rozhoduje i zacházení se zeminou a způsob uložení směsi. Průjezd po mokrém jílu může zanechat utuženou vrstvu, kterou několik centimetrů pěkné navážky před vodou ani kořeny neschová.'),

  h3('Nejdříve poznat a připravit podloží'),
  p('Při rekonstrukci se už po odkrytí ukáže, zda pod povrchem leží zhutnění, stavební suť nebo kusy pohřbeného dřeva. Použitelnou zeminu má smysl uchovat odděleně od nevhodné spodiny. Budeme-li ji vracet do směsi, potřebujeme vědět, s jakým materiálem skutečně pracujeme.'),
  p('Důležitý je také okamžik, kdy se do práce pustíme. Vlhká hrouda, kterou lze rozdrobit, se chová jinak než mazlavý jíl, který nástroj roztáhne do hladké plochy. Někdy je proto nejúčinnější zásah prosté vyčkání, až půda oschne do zpracovatelného stavu. Další práce pak nebude jen napravovat škody vzniklé při předchozím kroku.'),
  p('Po odkrytí odstraníme stavební suť a pohřbené dřevo. Utuženou vrstvu rozrušíme ještě před uložením nové směsi, až bude půda dostatečně oschlá, aby se při práci drobila. Na malé ploše lze použít rycí vidle, na velké se vyplatí domluvit odpovídající mechanizaci s realizátorem. Cílem je uvolnit souvislou tvrdou překážku, nikoli ji jen překrýt nakypřenou zeminou. Pokud se v odkryté půdě trvale drží voda, vyřešíme s realizátorem její odtok před další navážkou. Samotná propustnější směs nahoře tento problém neodstraní.'),

  h3('Dodávky a míchání přizpůsobit rozsahu zahrady'),
  p('U větší plochy pracujeme s dodávkami v tunách a s objemy v kubických metrech. Organizaci tomu přizpůsobíme: podle dostupnosti lze domluvit přípravu směsi u dodavatele nebo mechanizované promíchání na místě. Nemáme-li prostor pro všechny hromady současně, rozdělíme práci i dodávky na části. Pro každou však zachováme stejný návrh příslušné zóny, aby jeden konec zahrady nedostal většinu příměsí a druhý jen zbytek zeminy.'),
  p('Předem si proto ujasníme, kolik směsi připravujeme v jedné pracovní dávce a pro kterou hloubku je určena. Objemové poměry převedeme na dodávané množství podle známých sypných hustot. Vážní lístek pomůže sledovat hmotnost dodávky; sám o sobě ještě neříká, kolik kubíků materiál ve směsi zastoupí. Při změně dodavatele nebo výrazně jiné vlhkosti se může tento převod změnit.'),
  p('Smyslem je udržet přibližné podíly v celém zpracovávaném objemu a materiály rovnoměrně rozptýlit. U mnohatunové minerální směsi nepomůže složitě dohánět rozdíl několika kilogramů, pokud zůstane biochar v jednom pruhu a zeolit v jiném. Menší příměsi, osivo a přípravky s konkrétním návodem přesto dávkujeme podle jejich účelu a doporučené spotřeby.'),

  /* Podkapitola se sazbou splitu (titleLevel h3): kresba ukládání patří
     přesně k této čtveřici odstavců, ne do čela kapitoly. */
  split({
    blockName: 'Ukládání odspodu',
    surface: 'krem',
    side: 'image-right',
    drawing: 'ukladani-odspodu',
    titleLevel: 'h3',
    title: 'Ukládat odspodu, míchat v každé zóně',
    number: '10',
    alt: 'Tři kroky stavby profilu 30 cm pod sebou: nejprve spodních 15 cm minerálního základu, nad nimi čárkovaný obrys budoucích zón; pak přibude 5 cm se zeolitem; nakonec horních 10 cm plné směsi s biocharem, Actinem a zeolitem. V každém kroku je nová zóna rovnoměrně promíchaná.',
    caption:
      'Vysvětlovali jsme odshora, ukládá se obráceně: základ, zóna se zeolitem, nahoře plná směs – a v každé zóně promíchané, žádná čistá patra.',
    body:
      'Při vysvětlování profilu jsme postupovali od povrchu dolů. Při ukládání postupujeme obráceně: **nejprve spodních 15 cm minerálního základu, potom pěticentimetrovou zónu se zeolitem a nakonec horních 10 cm plné směsi**. Tento postup popisuje úplné vytvoření modelového profilu; při úpravě zachované půdy se rozsah práce řídí skutečně zvolenou hloubkou zásahu.\n\nV každé zóně jsou příslušné suroviny promíchané. Nevytváříme střídající se čisté vrstvy písku, černého biocharu a organického materiálu. Kořeny mají postupovat navazujícím půdním prostředím. Rozdělení na zóny nám pouze umožňuje dostat jednotlivé příměsi do hloubky, ve které s nimi návrh počítá.\n\nPři míchání na hromadě můžeme lépe sledovat složení jednotlivých pracovních dávek. Při práci přímo na místě je snazší ponechat část příměsi u povrchu a přitom se domnívat, že ji fréza dostala do celé požadované hloubky. Malá sonda řekne o skutečném promíchání víc než barevně sjednocený povrch.\n\nDéšť tuto práci nedokončí za nás. Může rozpouštět a přesouvat živiny, ale pevná zrnka zeolitu nebo biocharu rovnoměrně nepromíchá patnáct centimetrů hluboko. Rozpuštěná látka a pevná příměs se v půdě nepohybují stejným způsobem.',
  }),

  h3('Čas na slehnutí není prázdné čekání'),
  p('Po urovnání a zavlažení začne čerstvě nakypřená směs sedat. Částice a póry se nově uspořádávají, takže se může měnit i výška povrchu. Samotné sedání proto není závada; patří k tomu, že jsme materiál nejprve nakypřili, promíchali a znovu uložili.'),
  p('V návrhu počítáme orientačně s několika týdny, přibližně ', ['2–6', BOLD], ', u lehké půdy někdy kolem ', ['dvou týdnů', BOLD], '. Kalendář ovšem nerozhodne, zda už povrch přestal klesat. Sledujeme skutečný stav. Teprve když se výšky ustálí, doladíme nerovnosti a připravíme jemnější seťové lůžko – povrchovou vrstvu, do které přijde osivo.'),
  p('Čekání může přinést i praktickou výhodu: plevele, které mezitím vzejdou, lze ještě před výsevem trávy mělce odstranit. Do konečné přípravy tak vstupujeme s ustálenějším povrchem a bez těchto čerstvě vzešlých rostlin.'),

  h3('Mykorhizu umístit tam, kde se setká s mladými kořeny'),
  p('Pokud jsme se pro mykorhizní přípravek rozhodli, jeho umístění se řídí návodem konkrétního výrobku. Pro uvedený TurfComp výrobce při výsevu popisuje aplikaci přibližně ', ['3 cm pod osivo', BOLD], '. Při pokládce travního koberce přijde na připravený povrch pod něj. Podstatný je budoucí kontakt s kořeny; rovnoměrné rozptýlení stejné dávky do celých třiceti centimetrů by sledovalo jiný cíl.'),
  p('Přípravek rozprostřeme rovnoměrně v místě budoucích kořenů a dál postupujeme podle návodu k výsevu nebo pokládce koberce. Při ošetření hotového trávníku použijeme návod pro dodatečnou aplikaci; postup určený pod osivo na povrchu již založeného porostu nenapodobujeme.'),

  /* ── Kapitola 07 ─────────────────────────────────────────────── */
  chapter('Několik kilogramů semen nad desítkami tun připravené půdy', 'Kapitola 07'),
  p('Po úvahách o tunách písku, objemu biocharu a hloubce kořenového prostředí přichází na řadu něco překvapivě lehkého: travní semeno. Pro řadu rekreačních směsí se uvádí ', link('https://www.agrostis.cz/katalog/travni-smesi/rekreacni-smesi', '25–30 g osiva na metr čtvereční'), '. Na sto metrů čtverečních tak připadá přibližně ', ['2,5–3 kg semen', BOLD], '. Desítky tun připraveného prostředí budou sloužit rostlinám, které se na začátku vejdou do několika kilogramů osiva.'),

  h3('Výsev potřebuje vhodné podmínky a mělké uložení'),
  p('Travní směs vybíráme podle světla, očekávané zátěže a dostupné závlahy. V běžných českých podmínkách přichází v úvahu jaro nebo konec léta; konkrétní termín závisí na teplotě a vláze.'),
  p('Rovnoměrnosti pomáhá křížový výsev: dávku rozdělíme na dvě poloviny a druhou rozsejeme napříč směru první. Mělké zapravení a lehké přiválení zlepší kontakt semen s půdou. Podrobnosti se řídí konkrétní směsí. Drobné semeno má omezenou zásobu energie, a pokud ho zahrabeme hluboko, může obtížně vzcházet.'),

  split({
    blockName: 'První kořínek',
    surface: 'krem',
    side: 'image-left',
    drawing: 'prvni-korinek',
    titleLevel: 'h3',
    title: 'První kořínek ještě nedosáhne do připravené zásoby',
    number: '11',
    alt: 'Řez připraveným profilem 30 cm s měřítkem: čerstvě vzešlá tráva má kořínek jen asi 3 cm hluboko, kapka vody ve 13 cm, deset centimetrů pod kořínkem, je označená čárkovaným prstencem jako nedosažitelná. Popisky připomínají, že se čerstvý výsev zalévá mělce a často a profil začne pracovat, až k němu kořeny dorostou.',
    caption:
      'Voda deset centimetrů pod prvním kořínkem je teď stejně nedosažitelná jako voda na druhé straně zahrady. Proto se čerstvý výsev zalévá jinak než zakořeněný trávník.',
    body:
      'Třiceticentimetrový profil je připravený, ale právě klíčící rostlina z něj zatím dokáže využívat jen malou část. Voda deset centimetrů pod prvním kořínkem může být v této chvíli stejně nedosažitelná jako voda na druhé straně zahrady.\n\nProto se režim čerstvého výsevu liší od režimu zakořeněného trávníku. Jemnou zálivkou udržujeme vlhké seťové lůžko; podle počasí ji můžeme opakovat v krátkých dávkách. S postupným růstem kořenů do hloubky se rostlinám otevírá další prostor a mění se i vhodný interval zavlažování.\n\n[Principy závlahy trávníků](https://extension.psu.edu/principles-of-turfgrass-irrigation) proto spojují dávku vody s vlastnostmi půdy i dosahem kořenů. Připravená zásoba má význam teprve tam, kde k ní rostlina získá přístup.',
  }),

  h3('První zelené čárky ještě nejsou hotový porost'),
  p('Ani jednotlivé trávy nevzcházejí současně. Jílek bývá rychlejší, zatímco lipnice může potřebovat několik týdnů. To, co se zazelená jako první, proto ještě nepředstavuje konečnou podobu porostu. Další rostliny mohou teprve přicházet na řadu.'),
  p('U běžného zahradního trávníku připadá první sečení přibližně na výšku ', ['8–10 cm', BOLD], ', pokud už rostliny drží v půdě a povrch unese sekačku. Samotná výška tedy není jedinou podmínkou. Ostrým nožem odebereme ', ['nejvýše třetinu výšky', BOLD], '. Praktické souvislosti zakládání popisuje také ', link('https://www.agrostis.cz/odborne-clanky/jak-zalozit-novy-travnik-zakladani-travniku', 'Agrostis'), '.'),
  p('Navenek může být výsledek docela obyčejný: zelená plocha, po které se dá přejít naboso. Pod ní však zůstává výsledek mnoha rozhodnutí. Kolik prostoru dostala jednotlivá zrna. Zda jemné částice nezaplnily příliš mnoho mezer. Kde se drží voda, kudy odchází její přebytek a kam mohou dosáhnout živé kořeny.'),
  p('Vraťme se ke dvěma zahradám po dešti. Na každé jsme potřebovali změnit něco jiného, přesto jsme pracovali se stejnými druhy surovin. O výsledku rozhodlo jejich množství, rozmístění a to, jak spolu fungují v konkrétní půdě. Dobře připravená směs se tak nejlépe pozná v běžném životě trávníku: po vydatném dešti, během suchého týdne i podle toho, kam až mohou pokračovat jeho kořeny.'),

  block({
    blockType: 'faq',
    blockName: 'Časté otázky',
    heading: 'Časté otázky',
    lead: 'Shrnuto a podtrženo: Poměry směsi se určují v litrech, nákup v kilogramech. Drahé příměsi patří do horních deseti centimetrů, zeolit o kousek hlouběji – a pod tím stačí minerální základ. Žádná příměs přitom nenahradí rozrušené utužení a fungující odtok vody.',
    items: [
      {
        question: 'Proč se směs míchá podle objemu, a ne podle kilogramů?',
        answer: mini(
          'Protože stejná hmotnost zabírá u různých materiálů úplně jiný prostor. Tuna písku představuje asi 0,67 m³, tuna biocharu kolem 5 m³ – kdybychom „jedna ku jedné“ míchali podle tun, biochar by zabral zhruba 88 % objemu směsi. Objemem se určuje poměr složek; hmotnost slouží objednávce a dopravě a přebírá se od dodavatele pro materiál v dodávaném stavu.',
        ),
      },
      {
        question: 'Co znamená „nabitý“ biochar a proč nekupovat nenabitý?',
        answer: mini(
          'Nabití je předchozí obohacení biocharu živinami, například přípravou s vlhkým kompostem. Nenabitý biochar funguje zpočátku jako prázdná zásobárna: živiny z okolní půdy spíš odebírá, než aby ji o ně obohacoval, a tráva jich může mít dočasně méně. Samotné navlhčení vodou nabití nenahradí – biochar navlhčí, nikoli vyživí.',
        ),
      },
      {
        question: 'Do jaké hloubky patří jednotlivé příměsi?',
        answer: mini(
          'V modelovém profilu 30 cm dostane horních 10 cm plnou směs s biocharem, zeolitem a případně Actinem (dříve Biovin), zóna 10 až 15 cm už jen zeolit a spodních 15 cm tvoří samotný minerální základ. Dražší příměsi se soustřeďují nahoru, kde bývá nejvíc kořenové aktivity; zóny přitom mají navazovat, ne se skládat jako ostrá patra.',
        ),
      },
      {
        question: 'Jak spočítám, kolik materiálu objednat pro svou plochu?',
        answer: mini(
          'Nejdřív objem zóny: plocha v m² krát tloušťka vrstvy v metrech. Z něj podíl příměsi: objem zóny krát objemové procento. A nakonec hmotnost: objem krát sypná hustota od dodavatele. Na 100 m² má horní zóna 0–10 cm objem 10 m³, takže rozmezí 2–5 % biocharu pro jílovitou zahradu znamená 0,2–0,5 m³, 3–7 % pro hlinitou 0,3–0,7 m³ a 5–10 % pro písčitou 0,5–1,0 m³. Před objednávkou zvolíme konkrétní podíl v daném rozmezí. Zbytek objemu vždy doplní minerální základ.',
        ),
      },
      {
        question: 'Řídí se dávka mykorhizního přípravku typem půdy?',
        answer: mini(
          'Ne. Dávkuje se podle návodu konkrétního výrobku a účelu použití – písčitá půda sama o sobě není důvodem k vyšší dávce. U dávky 100 g/m² vychází 5 kg na 50 m² a 10 kg na 100 m², ať jde o jíl, hlínu, nebo písek. Ve fungující hlinité půdě není přípravek automatická nákupní položka; zvážit ho lze po výrazné přestavbě nebo u převážně nové směsi.',
        ),
      },
    ],
  }),

  /* Jediný vnitřní obsidian vedle kalkulátoru: od směsi k systému. */
  block({
    blockType: 'productBand',
    figureVariant: 'zavlaha',
    blockName: 'Systém InteliDome',
    eyebrow: 'Systém InteliDome',
    title: 'Směs vodu podrží. Kdo ohlídá, kolik jí tam je?',
    body:
      'Biochar a zeolit prodlouží dobu, po kterou mají kořeny z čeho pít – ale nevidí do země ani vy, ani kalendář zálivky. Čidlo vlhkosti InteliDome sedí přímo v namíchané kořenové vrstvě a měří, **kolik vody v ní skutečně zbývá**.\n\nZálivka se pak spouští podle půdy: písčitý sektor dostane vodu dřív a po menších dávkách, těžší směs později a vydatněji. Přesně tak, jak jste půdu namíchali.',
    features: [
      {
        title: 'Čidlo v namíchané vrstvě',
        text: 'Měří vlhkost v hloubce, pro kterou jste směs navrhli – ne na povrchu, který vysychá první.',
      },
      {
        title: 'Dávky podle směsi',
        text: 'Písčitá půda chce menší dávky častěji, těžší směs vydatnější a řidčeji. Sektor se řídí měřením, ne odhadem.',
      },
      {
        title: 'Bez zálivky do plna',
        text: 'Po vydatném dešti systém mlčí. Do profilu plného vody nepřidá ani litr navíc.',
      },
    ],
  }),

  block({
    blockType: 'ctaBand',
    blockName: 'Závěrečná výzva',
    title: 'Směs se pozná po dešti',
    sub: 'Namíchali jste půdu, která umí vodu podržet i pustit dál. Chcete, aby se podle ní řídila i zálivka – každý sektor podle své směsi?',
    buttonLabel: 'Objevit systém InteliDome',
    buttonHref: '/',
    ask: 'A otázka na závěr: víte, kolik místa zabere tuna materiálu, který se chystáte objednat?',
  }),
])

/* ── Zápis ──────────────────────────────────────────────────────── */

const run = async () => {
  const databaseURL = new URL(process.env.DATABASE_URL || '')
  if (!['localhost', '127.0.0.1'].includes(databaseURL.hostname) || databaseURL.port !== '5433' || databaseURL.pathname !== '/intelidome_web') {
    throw new Error('Tento seed smí běžet pouze nad lokální databází webu na portu 5433.')
  }
  if (process.env.BLOB_READ_WRITE_TOKEN) throw new Error('Tento seed vyžaduje lokální úložiště médií.')
  const localConfig = await config
  if (localConfig.db) {
    localConfig.db = { ...localConfig.db, init: ((original) => (args) => {
      const adapter = original(args)
      ;(adapter as typeof adapter & { push?: boolean }).push = false
      return adapter
    })(localConfig.db.init) }
  }
  const payload = await getPayload({ config: localConfig })

  /* Fotografie: nahrát, když v knihovně nejsou. Zdroj je složka
     `zdroje-informaci/fotky/`, která není v gitu (stejně jako public/media). */
  for (const item of MEDIA) {
    const found = await payload.find({
      collection: 'media',
      where: { filename: { equals: item.filename } },
      limit: 1,
      pagination: false,
    })
    if (found.docs.length > 0) {
      const doc = found.docs[0] as { id: number | string; sizes?: { og?: { mimeType?: string | null } } }
      const ogWebp = doc.sizes?.og?.mimeType === 'image/webp'
      /* Smazat smíme JEN tehdy, když zdroj leží ve `zdroje-informaci/fotky`
         a dá se nahrát zpět (poučení z incidentu se smazaným hero
         prvního článku). */
      const zdroj = path.resolve(dirname, '../zdroje-informaci/fotky', item.filename)
      if (ogWebp || !existsSync(zdroj)) {
        /* Alt a ohnisko jsou zdrojem pravdy tady, ne v knihovně médií. */
        if (item.focal) await nastavOhnisko(payload, doc.id, item.focal, { alt: item.alt })
        else await payload.update({ collection: 'media', id: doc.id, data: { alt: item.alt } })
        continue
      }
      await payload.delete({ collection: 'media', id: doc.id })
      payload.logger.info(`médium ${item.filename} se nahrává znovu (og nebyl WebP)`)
    }
    const filePath = path.resolve(dirname, '../zdroje-informaci/fotky', item.filename)
    if (!existsSync(filePath)) {
      payload.logger.warn(`fotografie ${item.filename} není v zdroje-informaci/fotky – přeskočeno`)
      continue
    }
    /* Portrétový ořez se nahraje první a hlavní fotka si ho ponese. */
    let portretId: number | undefined
    if (item.portret) {
      const portretPath = path.resolve(dirname, '../zdroje-informaci/fotky', item.portret)
      if (existsSync(portretPath)) {
        const naleze = await payload.find({
          collection: 'media',
          where: { filename: { equals: item.portret } },
          limit: 1,
          pagination: false,
        })
        portretId = Number(
          naleze.docs[0]?.id ??
          (
            await payload.create({
              collection: 'media',
              data: { alt: `${item.alt} — svislý ořez pro telefon` },
              filePath: portretPath,
            })
          ).id,
        )
      } else {
        payload.logger.warn(`portrétový ořez ${item.portret} chybí – přeskočeno`)
      }
    }
    await payload.create({
      collection: 'media',
      data: { alt: item.alt, ...item.focal, ...(portretId ? { portrait: portretId } : {}) },
      filePath,
    })
    payload.logger.info(`nahráno médium ${item.filename}`)
  }

  /* Figury odkazují na média názvem souboru – přeložíme na ID.
     Chybějící soubor blok vypustí, aby článek nikdy nespadl na null. */
  const nodes = body.root.children as Node[]
  const resolved: Node[] = []
  for (const node of nodes) {
    const fields = (node as { fields?: Record<string, unknown> }).fields
    /* Karta složek: obrázky se řeší per položka. */
    if (fields?.blockType === 'ingredients' && Array.isArray(fields.items)) {
      const polozky: Record<string, unknown>[] = []
      for (const item of fields.items as Record<string, unknown>[]) {
        const soubor = item.__filename as string | undefined
        if (!soubor) {
          polozky.push(item)
          continue
        }
        const nalezeno = await payload.find({
          collection: 'media',
          where: { filename: { equals: soubor } },
          limit: 1,
          pagination: false,
        })
        if (nalezeno.docs.length === 0) {
          payload.logger.warn(`médium "${soubor}" nenalezeno – složka vynechána`)
          continue
        }
        delete item.__filename
        item.image = nalezeno.docs[0].id
        polozky.push(item)
      }
      for (const item of polozky) {
        const panelSoubor = item.__panelFilename as string | undefined
        if (!panelSoubor) continue
        const nalezeno = await payload.find({
          collection: 'media',
          where: { filename: { equals: panelSoubor } },
          limit: 1,
          pagination: false,
        })
        delete item.__panelFilename
        if (nalezeno.docs.length === 0) {
          payload.logger.warn(`médium "${panelSoubor}" nenalezeno – panel bez fotky`)
          continue
        }
        item.panelImage = nalezeno.docs[0].id
      }
      fields.items = polozky
      resolved.push(node)
      continue
    }
    const filename = fields?.__filename as string | undefined
    if (!filename) {
      resolved.push(node)
      continue
    }
    const found = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      pagination: false,
    })
    if (found.docs.length === 0) {
      payload.logger.warn(`médium "${filename}" nenalezeno – figura vynechána`)
      continue
    }
    delete fields!.__filename
    fields!.image = found.docs[0].id
    resolved.push(node)
  }
  body.root.children = resolved

  const hero = await payload.find({
    collection: 'media',
    where: { filename: { equals: MEDIA[0].filename } },
    limit: 1,
    pagination: false,
  })

  const splitContent = splitPrimesiContent(body)
  /* Obrazy nového rytmu vznikají až při rozdělení, tedy po převodu názvů
     souborů výš. Chybějící fotka je chyba, ne tichý výpadek oddílu. */
  for (const node of [...splitContent.original.root.children, ...splitContent.preparation.root.children, ...splitContent.seeding.root.children, ...splitContent.profile.root.children] as Node[]) {
    const fields = (node as { fields?: Record<string, unknown> }).fields
    const soubor = (fields?.__photo ?? (fields?.blockType === 'figure' ? fields?.__filename : undefined)) as string | undefined
    if (!fields || !soubor) continue
    const nalezeno = await payload.find({ collection: 'media', where: { filename: { equals: soubor } }, limit: 1, pagination: false })
    if (!nalezeno.docs[0]) throw new Error(`Chybí médium ${soubor} pro rozdělené články.`)
    if (fields.__photo) {
      delete fields.__photo
      fields.photo = nalezeno.docs[0].id
    } else {
      delete fields.__filename
      fields.image = nalezeno.docs[0].id
    }
  }
  const preparationHero = await payload.find({ collection: 'media', where: { filename: { equals: 'hero-priprava-smesi-higgsfield.avif' } }, limit: 1, depth: 0 })
  if (!preparationHero.docs[0]) throw new Error('Chybí existující médium hero-priprava-smesi-higgsfield.avif pro článek o přípravě směsi.')
  const seedingHero = await payload.find({ collection: 'media', where: { filename: { equals: 'fig-pripravena-plocha.avif' } }, limit: 1, depth: 0 })
  if (!seedingHero.docs[0]) throw new Error('Chybí existující médium fig-pripravena-plocha.avif pro článek o setí.')
  const transactionID = await payload.db.beginTransaction()
  if (!transactionID) throw new Error('Zápis všech čtyř článků vyžaduje transakci.')
  const req = await createLocalReq({ locale: 'cs', context: { disableRevalidate: true }, req: { transactionID } }, payload)
  const savePost = async (data: RequiredDataFromCollectionSlug<'posts'>) => {
    const found = await payload.find({ collection: 'posts', where: { slug: { equals: data.slug } }, limit: 1, depth: 0, locale: 'cs', draft: false, req })
    return found.docs[0]
      ? publikujCs(payload, { collection: 'posts', id: found.docs[0].id, data, req })
      : payload.create({ collection: 'posts', data, depth: 0, locale: 'cs', draft: false, req, context: { disableRevalidate: true } })
  }
  try {
    const original = await savePost({
      title: 'Písek, biochar a další příměsi: jak namíchat půdu pro trávník',
      slug: SLUG,
      generateSlug: false,
      _status: 'published',
      heroImage: hero.docs[0]?.id,
      content: splitContent.original,
      publishedAt: '2026-09-19T08:00:00.000Z',
      meta: { image: hero.docs[0]?.id, ...LAWN_SEO[SLUG] },
    })
    const existingProfile = await payload.find({ collection: 'posts', where: { slug: { equals: PROFILE_SLUG } }, limit: 1, depth: 0, locale: 'cs', req })
    const profile = await savePost({
      title: PROFILE_TITLE,
      slug: PROFILE_SLUG,
      generateSlug: false,
      _status: 'published',
      heroImage: splitContent.profileHero,
      content: splitContent.profile,
      publishedAt: existingProfile.docs[0]?.publishedAt ?? new Date().toISOString(),
      authors: original.authors?.map((author) => typeof author === 'object' ? author.id : author),
      categories: original.categories?.map((category) => typeof category === 'object' ? category.id : category),
      meta: { ...LAWN_SEO[PROFILE_SLUG], image: splitContent.profileHero },
    })
    const existingPreparation = await payload.find({ collection: 'posts', where: { slug: { equals: PREPARATION_SLUG } }, limit: 1, depth: 0, locale: 'cs', req })
    const preparation = await savePost({
      title: PREPARATION_TITLE,
      slug: PREPARATION_SLUG,
      generateSlug: false,
      _status: 'published',
      heroImage: preparationHero.docs[0].id,
      content: splitContent.preparation,
      publishedAt: existingPreparation.docs[0]?.publishedAt ?? new Date().toISOString(),
      authors: original.authors?.map((author) => typeof author === 'object' ? author.id : author),
      categories: original.categories?.map((category) => typeof category === 'object' ? category.id : category),
      meta: { ...LAWN_SEO[PREPARATION_SLUG], image: preparationHero.docs[0].id },
    })
    const existingSeeding = await payload.find({ collection: 'posts', where: { slug: { equals: SEEDING_SLUG } }, limit: 1, depth: 0, locale: 'cs', req })
    /* Článek o setí má od 2. 10. 2026 vlastní předlohu a seeder
       (seed-clanek-zasit.ts). Tady se zakládá jen tehdy, když ještě
       neexistuje – existující se nepřepisuje, jen propojí se sérií. */
    const seeding = existingSeeding.docs[0] ?? await savePost({
      title: SEEDING_TITLE,
      slug: SEEDING_SLUG,
      generateSlug: false,
      _status: 'published',
      heroImage: seedingHero.docs[0].id,
      content: splitContent.seeding,
      publishedAt: new Date().toISOString(),
      authors: preparation.authors?.map((author) => typeof author === 'object' ? author.id : author),
      categories: preparation.categories?.map((category) => typeof category === 'object' ? category.id : category),
      meta: { ...LAWN_SEO[SEEDING_SLUG], image: seedingHero.docs[0].id },
    })
    // Link after creation: the collection's self-exclusion filter requires a post ID.
    const soilGuide = await payload.find({ collection: 'posts', where: { slug: { equals: 'krasny-travnik-zacina-pod-zemi-2' } }, limit: 1, depth: 0, locale: 'cs', req })
    const articles = [...soilGuide.docs, original, profile, preparation, seeding]
    for (const article of articles) {
      const existingRelated = (article.relatedPosts ?? []).map((post) => typeof post === 'object' ? post.id : post)
      const otherArticles = articles.filter((other) => other.id !== article.id).map((other) => other.id)
      await publikujCs(payload, { collection: 'posts', id: article.id, data: { relatedPosts: [...new Set([...existingRelated, ...otherArticles])] }, req })
    }
    await payload.db.commitTransaction(transactionID)
    payload.logger.info(`Články aktualizovány: /magazin/${SLUG}, /magazin/${PROFILE_SLUG}, /magazin/${PREPARATION_SLUG} a /magazin/${SEEDING_SLUG}`)
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID)
    throw error
  } finally {
    await payload.destroy()
  }

  process.exit(0)
}

await run()
