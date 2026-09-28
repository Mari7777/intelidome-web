/**
 * Vloží článek „Krásný trávník začíná pod zemí" do LOKÁLNÍ databáze.
 * Spuštění:  npm run payload -- run scripts/seed-clanek-puda.ts
 *
 * Idempotentní: když článek se stejným slugem existuje, přepíše ho.
 * Ostrý web se plní vlastním nasazením, ne tímhle skriptem – publikaci
 * dělá majitel v adminu.
 *
 * Výchozí autorský text níže prochází před zápisem schválenou redakční
 * revizí: diagnostika zůstává zde, receptury a postupy odkazují na pokračování.
 * Dvě tabulky z původního textu nesou kresby Obr. 01 a Obr. 05 – tabulka
 * v próze by byla jejich doslovným opakováním.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { getPayload } from 'payload'
import config from '@payload-config'
import { LAWN_SEO, optimizeLawnArticle } from './lib/lawn-seo-content'
import { reviseSoilGuide } from './lib/lawn-series-puda'
import { illustrateSoilGuide, SOIL_PHOTOS, type SoilPhotoIds } from './lib/lawn-series-puda-layout'
import { publikujCs } from './lib/publikuj-cs'

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
const ITALIC = 2

type Part = string | [string, number]
const parts = (items: Part[]): Node[] =>
  items.map((part) => (typeof part === 'string' ? text(part) : text(part[0], part[1])))

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
const ol = (...items: Part[][]) => list('number', items)

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

/* Kalkulátor jako PÁS, ne vsazený panel: v článku dlouhém 19 700 px je
   posun povrchu jediné, co drží rytmus (8.1 p. 3) — vsazené panely ho
   neudělají, protože povrch kolem nich zůstává týž. */
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

/* ── Média ──────────────────────────────────────────────────────── */

const SLUG = 'krasny-travnik-zacina-pod-zemi-2'

/** Soubory k nahrání do knihovny médií, když tam ještě nejsou. */
const MEDIA: {
  filename: string
  alt: string
  focal?: { focalX: number; focalY: number; focalPortraitX?: number; focalPortraitY?: number }
  /** Volitelný portrétový ořez — nahraje se zvlášť a připojí k hlavní fotce. */
  portret?: string
  /** Reprodukovatelný zdroj uložený v repozitáři (nové redakční fotografie). */
  source?: string
}[] = [
  {
    /* Rýč je na heru měřítko: článek staví na tom, že jeden list rýče ≈ 30 cm.
       Na předchozím snímku zabírala čepel jen 49 % hloubky sondy, takže
       jáma vypadala dvakrát hlubší, než jakou text popisuje (připomínka
       autora 13. 9.). Tady sedí ramena listu na drnu a špička na dně. */
    filename: 'hero-sonda-ryc.avif',
    portret: 'hero-sonda-ryc-portret.avif',
    alt: 'Sonda vykopaná v trávníku, hluboká právě jako list rýče: rýč stojí svisle v jamce, horní hrana listu je v úrovni travního drnu a špička na dně. Ve stěně sondy je vidět tmavá ornice, pod ní světlá udusaná vrstva a kořeny, které se u ní lámou do strany.',
    focal: { focalX: 48, focalY: 58, focalPortraitX: 48, focalPortraitY: 56 },
  },
  {
    /* Původní záběr rukou s rycími vidlemi měl strojové artefakty: hroty
       tvořily dva uzavřené oblouky a hlava nářadí nebyla spojená s násadou
       (porota kola 06, styl i slop — kritické, ověřeno v masteru). */
    filename: 'fig-ryc-zahon.avif',
    alt: 'Rýč zaražený do čerstvě zpracovaného záhonu pro trávník: vpředu leží hrubé hroudy tmavé ornice a rozlámaná světlá udusaná vrstva, vzadu nízké večerní slunce a pás trávy.',
    focal: { focalX: 62, focalY: 58, focalPortraitX: 70, focalPortraitY: 55 },
  },
  ...Object.values(SOIL_PHOTOS).map((item) => ({
    filename: item.filename,
    alt: item.alt,
    source: `assets/soil-guide/${item.filename}`,
  })),
]

/* ── Obsah článku ───────────────────────────────────────────────── */

const body = root([
  block({
    blockType: 'summaryBand',
    blockName: 'Souhrn',
    /* Lead je destilát, ne citace z těla: dřív opakoval třetí odstavec
       úvodu z 94 % a čtenář potkal tezi dvakrát na jedné obrazovce
       (porota kola 05, hierarchie). Autorova próza zůstává nedotčená. */
    lead: 'Tři hmatové zkoušky, jedna jamka a kbelík vody vám řeknou, co pod trávníkem doopravdy máte. Teprve z toho plyne, co kupovat – a co si ušetřit. Cílem je *souvislý, provzdušněný prostor hluboký přibližně 30 cm*.',
    tiles: [
      { value: '3', unit: 'typy', label: 'půdy: jílovitá, hlinitá, písčitá' },
      { value: '30', unit: 'cm', label: 'souvislý prostor pro kořeny' },
      { value: '2,5–7,5', unit: 'cm/h', label: 'ideální rychlost vsakování' },
      { value: '300', unit: 'l', label: 'půdy pod každým m² při 30 cm' },
    ],
  }),

  /* Úvod – autorův příběh, na obsahové ose před první kapitolou. */
  p('Představte si typický jarní scénář: nový trávník krásně vzejde, všechno je svěže zelené a vy poctivě zaléváte. Pak ale přijde vydatnější déšť a na trávníku se objeví trvalé louže. Nebo naopak udeří několik horkých dnů a tráva začne doslova před očima slábnout. Běžíme pro hnojivo, přidáváme zálivku, doséváme.'),
  p('Jenže problém často neleží na povrchu. Pod deseti centimetry úhledné zeminy totiž může stále ležet udusaná vrstva po stavebních strojích. Žádná sekačka ji neodstraní a sebelepší hnojivo přes ni kořenům cestu neprorazí.'),
  p('Nejdražší půda pod trávníkem tak překvapivě nebývá ta, kterou vám draze přiveze nákladní auto. Je to ta, kterou před výsevem zapomeneme zkontrolovat. Pokud ale nejprve zjistíme, jakou půdu na zahradě vlastně máme a jak v ní proudí voda, můžeme kořenům připravit dokonalý prostor. Až teprve potom má smysl řešit osivo. Pochopení tohoto postupu vás navíc ušetří zbytečného utrácení za práci, kterou vaše zahrada vůbec nepotřebuje. Začít přitom můžeme úplně obyčejně: vezměte rýč, trochu vody a pojďme si ušpinit ruce.'),

  /* ── Kapitola 01 ─────────────────────────────────────────────── */
  split({
    blockName: 'Kapitola 01',
    side: 'image-right',
    drawing: 'hmatovy-test',
    eyebrow: 'Kapitola 01',
    title: 'Písek, jíl, nebo hlína? Prozradí to vaše dlaň',
    number: '01',
    alt: 'Tři sloupce hmatového testu: vlevo jílovitá půda – váleček z vlhké zeminy se ohýbá bez prasknutí; uprostřed hlinitá – kulička drží, váleček při ohnutí praská; vpravo písčitá – zrnka drhnou a kulička se rozpadá. Pod každým sloupcem stojí, na co se při přípravě zaměřit.',
    caption:
      'Tři půdy, tři chování ve vlhké dlani. Ohebný váleček je jíl, praskající hlína, rozpadlá kulička písek – a každá chce od přípravy něco jiného.',
    body:
      'Slovo „hlína“ používáme v běžné řeči pro všechno, co se nám lepí na boty. Z hlediska trávníku je to ale nepřesné. Pro základní orientaci dělíme půdu do tří skupin: na těžkou jílovitou, střední hlinitou a lehkou písčitou. Ačkoliv v přírodě existuje mnoho přechodů, toto rozdělení nám prozradí to nejdůležitější – jak půda hospodaří s vodou a vzduchem.\n\nOznačení „těžká“ a „lehká“ přitom neříká, jak těžký bude kbelík, až ho naplníte. Popisuje to, jak těžko či snadno se půda zpracovává. Rozdíl tkví ve velikosti nerostných částic. Největší zrnka má písek, jemnější je prach a absolutně nejjemnější je jíl. Mezi těmito částicemi vznikají mezery, takzvané půdní póry. Právě v nich se ukrývá voda a vzduch. Zdravá půda musí umět obojí: po dešti vodu chvíli podržet, ale přebytek včas odvést, aby se ke kořenům mohl vrátit životodárný kyslík.',
  }),

  h3('Otestujte svou zahradu bez laboratoře'),
  p('Vyberte si na budoucím trávníku alespoň tři různá místa. Pokud je zahrada velká, nebo už od pohledu nestejnorodá, přidejte jich víc. Nezapomeňte otestovat místa, kde se drží voda, i pásy, po kterých jezdily bagry.'),
  p('Z každého místa odeberte z hloubky zhruba 10 centimetrů trochu zeminy (vzorky nesesypávejte dohromady). Odstraňte kamínky a kořínky. Následně hrst zeminy po troškách navlhčete a promněte v ruce. Nesmíte vytvořit blátivou kaši, ze které nepoznáte nic, ale ani suchou hroudu; zemina musí být vlhká tak akorát, bez vytékající vody.'),
  p('Nyní zkuste z hlíny uválet kuličku a z ní následně váleček zhruba o tloušťce obyčejné tužky. Sledujte, co se děje. Drhne hlína? Lepí se? A co se stane, když váleček zkusíte ohnout?'),
  ul(
    li(['Těžká jílovitá půda: ', BOLD], 'Pokud je hmota lepivá, plastická, hladká (nikoliv zrnitá) a váleček můžete ohýbat, aniž by praskl, máte v ruce jíl. Je to typ půdy, který se vám po dešti ochotně nalepí na podrážky a v létě naopak ztvrdne a popraská. Jíl má díky jemným částicím obrovský povrch, skvěle drží vodu i živiny, což je výhoda. Problém nastává, když se udusá. Ztratí totiž velké póry, voda v něm stojí a část jí navíc jíl drží tak pevně, že ji rostlina vůbec nedokáže vysát. Mokrá hlína tu tedy neznamená napité kořeny. U jílu vždy prověřujte zhutnění a odtok. Cílem je vytvořit prostředí, kterým projde voda i vzduch.'),
    li(['Střední hlinitá půda: ', BOLD], 'Kulička drží tvar, ale váleček už se tvoří hůře a při pokusu o ohnutí praská. Zemina se drobí, trochu drhne, trochu lepí, ale nic z toho není extrém. Máte štěstí, toto je ideální kompromis. Směs různých částic vodu udrží, ale přebytek pustí dál. U hlinité půdy je pravidlo jednoduché: zachovejte to, co funguje. Opravujte jen konkrétní nedostatky. Pokud se voda vsakuje, nekupujte zbytečně hory písku. Dejte si ale pozor: i skvělou hlínu můžete zničit, když po ní budete jezdit technikou za mokra.'),
    li(['Lehká písčitá půda: ', BOLD], 'Mezi prsty jasně cítíte ostrá zrnka. Kulička se rozpadá, váleček nejde vytvořit vůbec. Rýčem se tu kope s lehkostí, ale hned po teplém dni je půda na troud suchá. Písek má obrovské póry. Vzduch a voda jím projdou okamžitě, ale s vodou nenávratně odtečou i rozpuštěné živiny. Co u jílu složitě vytváříme, toho má písek nadbytek. Vaším úkolem zde bude podpořit schopnost půdy udržet vodu a živiny. Rozhodně sem nepřidávejte další písek.'),
  ),
  p('Tento domácí pokus vám ukáže směr. Pokud si nejste jistí, nebo se chystáte na masivní a drahou výměnu materiálu, nechte si udělat laboratorní rozbor zrnitosti. Ten má smysl udělat ', ['před', ITALIC], ' nákupem, abyste nekoupili něco, co vám nepomůže.'),

  /* ── Kapitola 02 ─────────────────────────────────────────────── */
  split({
    blockName: 'Kapitola 02',
    surface: 'krem',
    side: 'image-left',
    drawing: 'pudni-profil',
    eyebrow: 'Kapitola 02',
    title: 'Pohled do hlubin: co čeká kořeny o dvacet centimetrů níž?',
    number: '02',
    alt: 'Řez sondou hlubokou 30 cm s měřítkem po 10 cm: nahoře drn a tmavá ornice, v hloubce 10 až 15 cm světlá udusaná vrstva, o kterou se kořeny opírají a ohýbají do stran; dole podloží. Vedle stojí rýč.',
    caption:
      'Sonda hluboká 30 cm ukáže, co nasypaná ornice schová. Kořeny, které se v jedné rovině placatí, prozrazují udusanou vrstvu dřív než rýč.',
    body:
      'Povrch parcely může vypadat po stavbě domu lákavě – je tu krásně rozhrnutá tmavá ornice. Travní semínko do ní ochotně vyklíčí. Ale jakmile se jeho kořeny vydají hlouběji, tvrdě narazí na ztvrdlou spodinu.\n\nProto vezměte rýč a na několika místech vykopejte sondu – jamku hlubokou zhruba 30 centimetrů. Zajímat vás bude její svislá stěna, takzvaný půdní profil. Pečlivě si prohlédněte vrstvu v hloubce 10 až 15 centimetrů a pak samotné dno. Hmatový pokus s kuličkou zopakujte pro každou vrstvu, která vypadá odlišně.',
  }),

  p('Pátrejte po třech věcech:'),
  ul(
    li('Mění se v nějaké hloubce náhle typ zeminy?'),
    li('Narážíte najednou na extrémně tvrdou vrstvu?'),
    li('Vidíte zasypanou suť, stará prkna nebo jiný stavební odpad?'),
  ),
  p(['Tip: ', BOLD], 'Pokud už na místě nějaké rostliny rostou, podívejte se na jejich kořeny. Pokud se v jedné rovině placatí nebo prudce zahýbají do strany, prozrazují vám neviditelnou překážku.'),
  p('Zde je klíčové rozlišovat dva pojmy: zrnitost a struktura. Zrnitost je to, z jakých částic se půda skládá (náš pokus s válečkem). Struktura je to, jak jsou tyto částice poskládány k sobě. I ta nejlepší hlinitá půda může být po průjezdu bagru tak slisovaná, že nefunguje. Samotné udusání z ní sice neudělá jíl, ale pro vodu je stejně nepropustná. Naopak i jílovitá půda s dobrou, přirozenou strukturou může fungovat nečekaně dobře.'),
  p('Odpor a tvrdost půdy posuzujte, když je mírně vlhká. Vyschlý jíl totiž rýč nepustí dál ani tehdy, když po něm žádný bagr nikdy nejel. Důležitá je náhlá změna v jedné konkrétní hloubce a ploché, hutné kusy zeminy.'),
  p('Vaším cílem je získat jasný závěr. Například zjistíte, že máte deset centimetrů skvělé hlíny, ale pod ní je betonově tvrdá slupka. V takovém případě musíte hlubší vrstvu fyzicky rozbít. Nebo naopak zjistíte, že je půda písčitá až do hloubky třiceti centimetrů. Pak musíte vymyslet, jak v ní udržet vláhu. Pro obě tyto zahrady by nákup stejného univerzálního substrátu nedával žádný smysl.'),

  /* ── Kapitola 03 ─────────────────────────────────────────────── */
  split({
    blockName: 'Kapitola 03',
    side: 'image-right',
    drawing: 'zkouska-vsaku',
    eyebrow: 'Kapitola 03',
    title: 'Kam mizí voda? Proč i tráva může uschnout z přemokření',
    number: '03',
    alt: 'Řez zkušební jámou hlubokou 30 cm naplněnou vodou, přes okraj leží laťka a od ní se měří vzdálenost k hladině; hladina klesla o 1 cm za 15 minut, tedy 4 cm za hodinu. Pod jámou stupnice se třemi pásmy: pod 2,5 cm/h pomalé, 2,5 až 7,5 ideální, nad 10 příliš rychlé.',
    caption:
      'Zkouška vsakování. Pokles hladiny za čtvrt hodiny krát čtyři dá centimetry za hodinu – a ta hodnota rozhodne, jestli řešit odtok, nebo zadržení vody.',
    body:
      'Zní to jako paradox, ale tráva ke svému životu zoufale potřebuje kyslík. Kyslík totiž slouží k buněčnému dýchání, při kterém rostlina pod zemí získává energii z cukrů vytvořených v listech na slunci.\n\nPokud voda na dlouhou dobu zaplní půdní póry a vytlačí z nich vzduch, kořeny se začnou dusit a nevratně se poškodí. Až poté vysvitne slunce a oteplí se, tráva začne vadnout, přestože stála donedávna v kaluži. Pokud v takové chvíli zapnete zavlažování, problém jen zhoršíte.\n\nJak odtok vody prověřit? Nejprve se po zahradě projděte po opravdu vydatném dešti. Zmapujte si místa, kde stojí louže, a kudy případně přitéká voda od sousedů nebo ze svahu. Zkontrolujte zahradu i druhý den. Jedna zapomenutá louže v dolíku je úplně jiný problém než rovnoměrně nasáklý a čvachtající pozemek.',
  }),

  p('Následně proveďte zkoušku vsakování:'),
  ol(
    li('Vykopejte jámu hlubokou 30 cm a širokou 10 až 30 cm. Pokud jste stěny při kopání uhladili rýčem, trochu je zdrsněte, abyste neuzavřeli póry.'),
    li('Jámu naplňte vodou a nechte ji kompletně vsáknout. Tím se půda přirozeně zvlhčí. (Kdybyste měřili vsakování do suché, popraskané půdy, výsledek by byl nepřesný.) Pokud v jámě voda stojí i druhý den, další krok přeskočte – máte vážný problém se zamokřením.'),
    li('Pokud se první várka vsákla, naplňte jámu znovu. Přes okraj položte rovnou laťku a změřte vzdálenost od laťky k hladině.'),
    li('Počkejte 15 minut a změřte, o kolik hladina klesla. Tento úbytek vynásobte čtyřmi. (Pokud za 15 minut klesla o 1 cm, znamená to rychlost vsakování 4 cm za hodinu.)'),
  ),
  p('Výsledek vám napoví:'),
  ul(
    li(['Pokles pod 2,5 cm za hodinu: ', BOLD], 'Voda odtéká pomalu. Musíte najít příčinu, proč se drží. Jde o prohlubeň? Přítok z okolí? Nebo je dole utužená vrstva, kterou jste našli při zkoumání profilu? Tu musíte za vhodné vlhkosti rozrušit a test zopakovat. Pokud voda do jámy dokonce sama přitéká zespodu, potřebujete řešit plošné odvodnění a drenáž. Žádný pytel s pískem to nespraví.'),
    li(['Pokles 2,5 až 7,5 cm za hodinu: ', BOLD], 'Ideální stav pro většinu rostlin.'),
    li(['Pokles nad 10 cm za hodinu: ', BOLD], 'Voda uniká velmi rychle. Pokud máte písčitou půdu, čeká vás boj o každou kapku a musíte půdě dodat schopnost vodu uchovat. Rychle prázdná jáma není výhra.'),
  ),
  p('Zkoušku proveďte na více místech, voda může unikat do stran nebo najít trhlinu. Pokud zjistíte, že voda stojí v jámě i druhý den, odložte výsev. Musíte upravit terén do mírného spádu směrem od domu (zhruba 1 až 2 %, tedy o 1–2 centimetry na každý metr délky) k místu, které vodu pojme. Pamatujte, že podzemní drenáž musí někam odtékat. Pokud vykopete jámu do nepropustného jílu a zasypete ji štěrkem, nevytvořili jste drenáž, ale jen podzemní vanu, která se brzy naplní.'),

  calc('vsak'),

  /* ── Kapitola 04 ─────────────────────────────────────────────── */
  split({
    blockName: 'Kapitola 04',
    side: 'image-left',
    drawing: 'tricet-centimetru',
    eyebrow: 'Kapitola 04',
    title: 'Třicet centimetrů svobody: proč kořeny potřebují prostor',
    number: '04',
    alt: 'Dva bloky půdy pod metrem čtverečním trávníku vedle sebe: vlevo hloubka 10 cm, tedy 100 litrů, kořeny se placatí na tvrdé desce a povrch vysychá; vpravo hloubka 30 cm, tedy 300 litrů, kořeny jdou hluboko a v malých pórech drží voda, ve velkých vzduch.',
    caption:
      'Stejný metr čtvereční, třikrát větší rezervoár. Při 30 cm nejsou kořeny odkázané na pár centimetrů, které slunce vysuší za odpoledne.',
    body:
      'Když už víme, co se děje pod povrchem, můžeme si stanovit hlavní cíl. Tím je **souvislý, provzdušněný a propustný prostor pro kořeny, sahající do hloubky přibližně 30 cm**. Tuto hloubku přitom počítáme od finálního, už slehlého povrchu.\n\nProč potřebujeme třicet centimetrů, když semínko leží na povrchu a spousta travních kořínků je mělká? Je to stejné, jako s pitnou vodou doma: právě teď sice pijete z jedné sklenice, ale je dobré mít zásobu v trubkách nebo studni.\n\nHorních pár centimetrů půdy je extrémně závislých na počasí. Slunce je rychle vysuší, zálivka je hned namočí, a za chvíli jsou zase suché. Pokud kořeny narazí na bariéru a nemohou hlouběji, tráva je plně odkázána na tuto neustále se měnící povrchovou vrstvu.',
  }),

  p('Představte si 1 metr čtvereční vašeho budoucího trávníku. Pokud má půda hloubku jen 10 cm, kořeny žijí v objemu 100 litrů. Pokud jim dáte 30 cm, mají k dispozici objem 300 litrů půdy. Nejde přímo o litry zadržené vody, ale o obrovský využitelný rezervoár zdrojů. Větší hloubka drasticky snižuje závislost vašeho trávníku na tom, zda zrovna praží slunce na vrchní vrstvu. Zlepší se hospodaření s vodou mezi jednotlivými dešti či zálivkami.'),
  p('Voda a vzduch ovšem musí mít volnou cestu. Nasypat 5 centimetrů drahého substrátu na udusanou desku sice vytvoří skvělé lůžko pro vyklíčení semínka, ale desku nezruší. Voda se nad ní bude hromadit a kořeny zůstanou mělce. Zdravá půda funguje tak, že v malých pórech zůstává voda a do velkých pórů po dešti okamžitě proniká vzduch.'),
  p('Těchto 30 centimetrů je praktický cíl pro založení běžného trávníku, není to ale příkaz rostlinám, kam až musí dorůst (to závisí na druhu trávy, sečení i teplotě). A hlavně to neznamená, že musíte vybagrovat třicet čísel zeminy a koupit novou!'),
  p('Máte jen tři možnosti:'),
  ul(
    li(['Půda funguje dobře až do hloubky 30 cm. ', BOLD], 'Super, nic nevykopávejte. Jen srovnejte nerovnosti, rozbijte případná lokální utužená místa a připravte povrch.'),
    li(['Nahoře je skvělá hlína, pod ní zhutněná deska. ', BOLD], 'Zaměřte se jen na tu překážku. Svrchní hlínu si dejte stranou, ztvrdlou vrstvu zespodu nakypřete nebo rozbijte a hlínu vraťte.'),
    li(['Celý profil tvoří stavební suť nebo zcela nevhodná navážka. ', BOLD], 'Tady nezbývá než špatný materiál odvézt a navézt vhodnou směs. (Pokud se tu drží voda, řešte nejprve odtok.)'),
  ),
  p('Příprava funkčního prostředí neznamená automatický nákup třiceti centimetrů nové hlíny. Právě toto zjištění vám může ušetřit tisíce korun a hodiny těžké dřiny.'),

  /* ── Kapitola 05 ─────────────────────────────────────────────── */
  /* Kresba tří zón nestojí v čele kapitoly, ale u podkapitoly o zónování,
     o kterém mluví – jinak měla kapitola 2,2 obrazovky prózy bez obrazu
     (porota rozložení, kolo 01). Čelo kapitoly nese titulek + próza. */
  /* ── Kapitola 05 – otevírá Obr. 05 jako ostatní kapitoly. V kole 04
     stála kresba 1 350 px pod titulkem u mezititulku h3 (hierarchie
     i rozložení). Trojice jíl / hlína / písek jde do těla dvousloupce
     jako odstavce s tučným návěstím – seznam do těla splitu nejde. ─── */
  split({
    blockName: 'Kapitola 05',
    side: 'image-right',
    drawing: 'tri-zony',
    eyebrow: 'Kapitola 05',
    title: 'Půdní alchymie: biochar, Actino, zeolit a správné počty',
    number: '05',
    alt: 'Řez profilem 30 cm rozdělený do tří zón: 0 až 10 cm minerální základ s biocharem, Actinem a zeolitem, kde žije nejvíc kořenů; 10 až 15 cm minerální základ se zeolitem jako přechod; 15 až 30 cm jen minerální základ jako rezervní prostor pro vodu a vzduch. Přechody mezi zónami jsou plynulé, ne ostré.',
    caption:
      'Co kam patří. Drahé příměsi jen tam, kde žijí kořeny; spodní zóna je rezervoár vody a vzduchu – a přechody navazují, nejsou to patra dortu.',
    body:
      'Až teď přichází chvíle, kdy má smysl uvažovat o tom, co do půdy přimíchat. Už víme, co máme v ruce, víme, co je pod tím, a víme, jak odtéká voda. Každá příměs tak dostane svůj jasný úkol.\n\n**Těžký jíl:** Nejdříve fyzicky odstraňte utužení (když je půda mírně vlhká). Pokud to nestačí a musíte změnit zrnitost, použijte promyšlenou směs praného písku a původní zeminy. Pozor: pár lopat písku nevyřeší nic! Jemný jíl jen vyplní mezery mezi zrny písku. Je to jako nasypat jemný prach do sklenice s korálky – víc vzduchu tím nezískáte.\n\n**Střední hlína:** Nedělejte nic plošně, řešte jen místní utužení. Písek sem přidávejte jen tehdy, pokud je hlína spíše těžší. Drobtovitá zdravá půda písek nepotřebuje.\n\n**Lehký písek:** Na další písek zapomeňte. Veškeré úsilí věnujte tomu, jak v zemině udržet vodu a živiny.',
  }),
  p('Vždy platí, že vaše původní zemina je cenný základ. Není to odpad, který musíte vyvézt jen proto, abyste udělali místo pytlům s lákavými názvy.'),

  h3('Co umí speciální příměsi?'),
  p('Pokud potřebujete vlastnosti půdy cíleně zlepšit, nabízí se několik šikovných pomocníků:'),
  ul(
    li(['Biochar: ', BOLD], 'Je to velmi porézní uhlíkatý materiál, který se vyrábí zahříváním biomasy bez přístupu kyslíku. Jeho mikroskopické póry zadržují vodu i živiny, což oceníte hlavně na vysychavých půdách. Než ho dáte do země, musí se „nastartovat“ navlhčením a živinami – ideálně ho můžete předem promíchat s kvalitním, ověřeným kompostem, nebo koupit už aktivovaný od výrobce. (Pokud přidáváte kompost, nezapomeňte započítat i jeho objem do celkové vrstvy.)'),
    li(['Actino (dříve Biovin): ', BOLD], 'Tento materiál dodává půdě organickou hmotu a živiny. Vyrábí se z vinné matoliny (zbytků po lisování hroznů), která se za přístupu vzduchu rozkládá. Protože slouží i jako hnojivo, počítejte s ním ve svém plánu hnojení, ať trávník zbytečně nepřehnojíte.'),
    li(['Zeolit (konkrétně klinoptilolit): ', BOLD], 'Speciální minerál, který na sebe dokáže vázat určité živiny (například draslík či amonné ionty), které by se jinak z půdy vyplavily. Později je umí uvolňovat zpět kořenům.'),
  ),

  h3('Proč nesypat všechno všude? (Chytré zónování)'),
  p('Pokud půdní profil budujete nově, nemusíte (a ani byste neměli) rvát drahé příměsi do celých 30 centimetrů. Rozdělte si zeminu do tří zón (přičemž „minerální základ“ znamená vaši původní zeminu, případně její směs s pískem) – co kam patří, ukazuje Obr. 05.'),
  p('Toto uspořádání má jasný ekonomický smysl. Představte si plochu 100 m². Vrstva 10 cm představuje 10 000 litrů zeminy. Kdybyste chtěli obohatit celých 30 cm (30 000 litrů), spotřebujete všeho třikrát tolik. Pro takovou investici musíte mít sakra dobrý důvod.'),
  /* Autorovo upozornění nese callout, ne odstavec: kapitola 05 běžela na
     telefonu 3 430 px (čtyři obrazovky) bez jediné hmoty (porota kola 07).
     Text se nemění, mění se jen jeho sazba. */
  block({
    blockType: 'banner',
    blockName: 'Upozornění k zónování',
    style: 'warning',
    content: root([p(['Upozornění: ', BOLD], 'Zóny neskládejte na sebe jako patra dortu s ostrými hranami. Vše musí být v dané vrstvě rovnoměrně promíchané a přechody musí navazovat, aby kořeny nepřešly šokem. Pokud už dobrou půdu na zahradě máte, nerozebírejte ji kvůli tomuto návodu na tři umělé vrstvy! I vaše spodní vrstva přirozeně obsahuje minerály, organismy a organickou hmotu.')]),
  }),

  h3('Matematika trávníku: litry řeší poměr, kilogramy nákup'),
  p('Jak spočítat, kolik čeho koupit? Pojďme si ukázat vzorový příklad: Chcete do vrchních 20 cm půdy přidat 5 % zeolitu.'),
  ol(
    li(['Výpočet objemu: ', BOLD], 'Představte si čtverec 1 × 1 metr. Hloubka je 0,2 metru. Objem je tedy 1 × 1 × 0,2 = 0,2 m³, což je přesně ', ['200 litrů půdy', BOLD], '.'),
    li(['Podíl příměsi: ', BOLD], '5 % z 200 litrů je ', ['10 litrů zeolitu', BOLD], ' (jeden běžný kbelík) na metr čtvereční. Zbylých 190 litrů tvoří váš minerální základ (10 + 190 = požadovaných 200).'),
    li(['Převod na nákupní košík: ', BOLD], 'V obchodě se zeolit prodává na kila. Zde potřebujete znát tzv. sypnou hustotu od výrobce. Dejme tomu, že je 0,8 kg/l. Vašich 10 litrů tedy váží ', ['8 kilogramů', BOLD], '.'),
    li(['Celková objednávka: ', BOLD], 'Pokud má váš trávník 100 m², potřebujete 100 × 8 kg = ', ['800 kg zeolitu', BOLD], ', což je 40 dvacetikilových pytlů (celkem 1 000 litrů).'),
  ),
  p(['Pamatujte: ', BOLD], 'Procento podílu nikdy nepočítejte z kilogramů! Litr zeminy váží jinak než litr zeolitu. Objem surovin se odměřuje před smícháním v nádobách bez pěchování. Po zamíchání a ulehnutí se celkový objem zmenší, protože drobné částice zapadnou mezi ty větší.'),

  calc('primesi'),

  /* ── Kapitola 06 – bez kresby, obraz nese full-bleed fotografie ─────
     Pořadí titulek → obraz → próza jako u ostatních kapitol; fotka před
     tezí by obracela hierarchii (porota kola 03). */
  chapter('Těžká práce: udělejte to hned, později už to nepůjde', 'Kapitola 06'),
  figure(
    'fig-ryc-zahon.avif',
    '06',
    'Rozrušit udusanou vrstvu přesně v hloubce, kde leží – a jen tehdy, když se zemina po zmáčknutí drží pohromadě, ale dá se rozdrobit.',
    'bleed',
    false,
  ),
  p('Než se do toho pustíte, určete si finální výšku povrchu tak, aby navazovala na chodníky a terasy a udržela odtok vody.'),
  p('Pokud musíte pozemek radikálně rekonstruovat, vždy si pečlivě oddělte použitelnou vrchní ornici od spodní suti a hlušiny. Jakmile kvalitní hlínu proženete frézou společně s nevhodnou navážkou, zničíte si ji a vyrobíte si další problém.'),
  p('Nyní vyřešte podloží. Našli jste udusanou vrstvu? Rozrušte ji přesně v hloubce, kde leží. Nestačí jen načechrat vršek těsně nad ní! Na malou plochu stačí rycí vidle, na velkou udusanou pláň volejte těžkou techniku. Zároveň do této otevřené země nyní patří uložení případné drenáže a trubek pro zavlažování.'),
  p(['Zásadní pravidlo pro jíl a hlínu: ', BOLD], 'Pracujte s nimi jen tehdy, když se po zmáčknutí drží pohromadě, ale dají se snadno rozdrobit. Pokud je zemina mazlavá, lepí se na rýč a roztírá se do lesklých ploch, je příliš mokrá. Zastavte práce. Kdybyste pokračovali, sami byste půdu smrtelně utužili. Čerstvě upravenou plochu pak bedlivě chraňte před zbytečnými přejezdy aut a strojů.'),
  p('Pokud budujete profil úplně znovu od nuly, postupujte odspoda: nejprve 15 cm spodního základu, pak 5 cm střední zóny a nakonec 10 cm vrchní nabité zóny. Vše průběžně míchejte a kontrolujte malou sondou (rýčem), zda jste úpravy provedli dostatečně hluboko.'),

  /* ── Kapitola 07 ─────────────────────────────────────────────── */
  split({
    blockName: 'Kapitola 07',
    side: 'image-left',
    drawing: 'sedani',
    eyebrow: 'Kapitola 07',
    title: 'Finální zkouška trpělivosti: než vysejete, nechte půdu promluvit',
    number: '07',
    alt: 'Tři fáze téhož řezu půdou: čerstvě nakypřená zemina s velkými vzduchovými mezerami a rovným povrchem; po dešti slehlá vrstva s prohlubní a loužičkou; nakonec prohlubeň doplněná směsí a stabilní, ustálený povrch připravený k výsevu.',
    caption:
      'Čerstvě zpracovaná zemina lže. Teprve po zavlažení a několika týdnech sedání víte, kde se terén propadne – a doplníte to dřív, než to udělá déšť na hotovém trávníku.',
    body:
      'Máte hotovo, hlína je krásně nakypřená a láká k okamžitému výsevu. Zadržte. Čerstvě zpracovaná zemina lže.\n\nMezi částicemi je teď spousta umělého vzdušného prostoru. Jakmile zaprší, celá směs si začne „sedat“. Pokud byste zaseli hned, první silnější déšť vám na budoucím trávníku vymodeluje nepředvídatelné dolíky a propadliny.\n\nPlochu proto zhruba urovnejte a důkladně zavlažte, aby se promáčela celá připravená vrstva (pozor, proud vody nesmí spláchnout povrch!). Podle počasí a hloubky zásahu potrvá i několik týdnů, než si půda sedne. Sledujte, kde se tvoří louže a kde se terén propadá. Tyto prohlubně doplňte správnou směsí zeminy a znovu zvlhčete. Vaším cílem je stabilní, vyzrálý povrch, nikoliv uježděná tvrdá deska.',
  }),

  p('Teprve na samý závěr povrch jemně uhrabejte, odstraňte zbytky hroud a kamenů (zničily by vám sekačku) a můžete sít. Vyberte si travní směs, která odpovídá světlu a zátěži vaší zahrady. Pamatujte, že čerstvé osivo nemá hluboké kořeny, proto ze začátku musíte udržovat vlhké seťové lůžko na povrchu.'),
  p('Připraveni k výsevu jste až tehdy, když znáte svou půdu, rozbili jste spodní bariéry, voda má kam odtékat, povrch se ustálil a výživu jste zvolili cíleně. To je skutečná příprava, ne jen rychlé přelíznutí pozemku frézou.'),

  /* ── Závěr ───────────────────────────────────────────────────── */
  chapter('Proč se to všechno nakonec vyplatí?', 'Závěr'),
  p('Vzpomeňte si na začátek. Před výsevem můžete tu zakopanou udusanou vrstvu snadno rozbít. Srovnáte hlínu a zasejete.'),
  p('Co se ale stane, když na tu samou překážku narazíte až za dva roky, kdy vám trávník začne umírat? Budete muset strhnout drn, dávat pozor na okolní rostliny, složitě rozkopávat tvrdou zem na hotové zahradě, znovu sít a znovu trávu složitě piplat. Práce se vám zmnohonásobí. Náprava hotového trávníku je možná, ale extrémně zasáhne do toho, jak zahradu používáte.'),
  p('Když půdu připravíte správně hned na začátku, každá kapka vody a gram hnojiva se dostanou přesně tam, kde je kořeny využijí. Neochrání vás to před každou chorobou trávy a nezbaví vás to nutnosti sekat. Ale už nikdy nebudete platit za hektolitry vody a zázračné postřiky, kterými se budete snažit vyřešit něco, co ve skutečnosti vězí třicet centimetrů pod zemí.'),

  p('Až se po novém trávníku poprvé projdete bosi, všechnu tu tvrdou podzemní dřinu už neuvidíte. Její pravý smysl doceníte až tehdy, když přijde přívalový déšť nebo pekelně horký týden. Tehdy totiž nebudete zahradu zachraňovat, ale budete si ji prostě jen užívat.'),

  block({
    blockType: 'faq',
    blockName: 'Časté otázky',
    heading: 'Časté otázky',
    /* Autorovo „Shrnuto a podtrženo" jako standfirst: FAQ tím dostane
       levý sloupec s obsahem místo nadpisu v prázdnu a článek nemá
       třetí shrnutí v modrém rámečku. */
    lead: 'Shrnuto a podtrženo: Na jílu bojujte o průchodnost a vzduch. U dobré hlíny hlídejte její strukturu a neničte ji. U písku zadržujte vodu a živiny. A u všech tří chtějte to samé: třicet centimetrů souvislého, dýchajícího prostoru pro kořeny, ze kterého může plynule odtékat voda.',
    items: [
      {
        question: 'Jak poznám, jestli mám jíl, hlínu, nebo písek?',
        answer: mini(
          'Hmatovým testem. Hrst zeminy z hloubky asi 10 cm navlhčete tak, aby byla vlhká, ale nevytékala z ní voda, a zkuste uválet kuličku a z ní váleček tenký jako tužka. Jíl je lepivý a hladký a váleček se ohne bez prasknutí. Hlína kuličku udrží, ale váleček při ohnutí praská a zemina se drobí. Písek drhne mezi prsty a kulička se rozpadne. Vzorky berte alespoň ze tří míst a nesesypávejte je dohromady.',
        ),
      },
      {
        question: 'Co je zkouška vsakování a jaký výsledek je dobrý?',
        answer: mini(
          'Vykopete jámu hlubokou 30 cm, naplníte ji vodou a necháte vsáknout, aby se půda zvlhčila. Pak ji naplníte znovu, přes okraj položíte laťku a po 15 minutách změříte, o kolik hladina klesla; úbytek vynásobíte čtyřmi a máte centimetry za hodinu. Ideální je 2,5 až 7,5 cm/h. Pod 2,5 cm/h voda odtéká pomalu a je třeba najít příčinu, nad 10 cm/h uniká příliš rychle a půda potřebuje pomoc s udržením vláhy.',
        ),
      },
      {
        question: 'Proč zrovna 30 centimetrů, když má tráva mělké kořeny?',
        answer: mini(
          'Horních pár centimetrů půdy se s počasím neustále mění – slunce je vysuší, zálivka namočí. Třicet centimetrů souvislého, provzdušněného prostoru dá kořenům rezervoár: pod metrem čtverečním je to 300 litrů půdy místo 100. Trávník je pak méně závislý na tom, co se právě děje na povrchu, a lépe hospodaří s vodou mezi dešti a zálivkami.',
        ),
      },
      {
        question: 'Musím vybagrovat 30 cm zeminy a koupit novou?',
        answer: mini(
          'Většinou ne. Pokud půda funguje až do 30 cm, jen srovnejte nerovnosti a rozbijte místní utužení. Pokud je nahoře dobrá hlína a pod ní zhutněná deska, dejte hlínu stranou, desku rozrušte a hlínu vraťte. Odvézt a navézt novou směs má smysl jen tehdy, když celý profil tvoří stavební suť nebo nevhodná navážka.',
        ),
      },
      {
        question: 'Jak spočítám, kolik příměsi (třeba zeolitu) koupit?',
        answer: mini(
          'Vždy přes litry, ne kilogramy. Vrstva 20 cm pod metrem čtverečním je 200 litrů; 5 % z toho je 10 litrů příměsi. Litry převedete na kilogramy sypnou hustotou od výrobce – při 0,8 kg/l je to 8 kg na m², tedy 800 kg na 100 m². Procento podílu nikdy nepočítejte z hmotnosti, litr zeminy váží jinak než litr zeolitu.',
        ),
      },
    ],
  }),

  /* Jediný vnitřní obsidian: tady se z řeči o půdě stává řeč o systému. */
  block({
    blockType: 'productBand',
    figureVariant: 'zavlaha',
    blockName: 'Systém InteliDome',
    eyebrow: 'Systém InteliDome',
    title: 'Když závlahu řídí půda, ne kalendář',
    body:
      'Mokrá hlína neznamená napité kořeny – a do přemokřeného profilu je každá další zálivka škoda. Čidlo vlhkosti InteliDome sedí přímo v kořenové zóně, kterou jste právě připravili, a měří, **kolik vody tam skutečně je**.\n\nSystém tak zalévá tehdy, kdy mají kořeny žízeň, a mlčí, když je půda po dešti plná. Těch třicet centimetrů rezervoáru začne pracovat pro vás, ne proti vám.',
    features: [
      {
        title: 'Čidlo v kořenové zóně',
        text: 'Měří vlhkost v hloubce, kde kořeny skutečně pijí – ne na povrchu, který slunce vysuší za odpoledne.',
      },
      {
        title: 'Zálivka podle půdy',
        text: 'Sektor se spustí podle naměřené vlhkosti, ne podle hodin. Po vydatném dešti systém nezalévá.',
      },
      {
        title: 'Retenční nádrž',
        text: 'Přednostně čerpá dešťovou vodu a po vodě z řadu sáhne až tehdy, když je nádrž prázdná.',
      },
    ],
  }),

  block({
    blockType: 'ctaBand',
    blockName: 'Závěrečná výzva',
    title: 'Trávník, který začíná pod zemí',
    sub: 'Připravili jste kořenům třicet centimetrů prostoru. Chcete, aby dostávaly vodu přesně tehdy, kdy ji potřebují – a ani o zálivku víc?',
    buttonLabel: 'Objevit systém InteliDome',
    buttonHref: '/',
    ask: 'A otázka na závěr: víte, co leží pod deseti centimetry vaší ornice, nebo to zatím jen tušíte?',
  }),
])

/* ── Zápis ──────────────────────────────────────────────────────── */

const run = async () => {
  const payload = await getPayload({ config })

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
      /* Varianty se generují při nahrání. Když médium nemá og ve WebP
         (starší nahrání z doby, kdy varianta dědila AVIF ze zdroje),
         je potřeba ho nahrát znovu — update sizes nepřepočítá. */
      const doc = found.docs[0] as { id: number | string; sizes?: { og?: { mimeType?: string | null } } }
      const ogWebp = doc.sizes?.og?.mimeType === 'image/webp'
      /* Smazat smíme JEN tehdy, když zdroj leží ve `zdroje-informaci/fotky`
         a dá se nahrát zpět. Bez téhle podmínky seeder smazal médium
         jiného článku, jehož zdroj v repu není — a vrátit ho nešlo. */
      const zdroj = path.resolve(dirname, '..', item.source ?? `zdroje-informaci/fotky/${item.filename}`)
      if (ogWebp || !existsSync(zdroj)) {
        if (item.focal) {
          await payload.update({ collection: 'media', id: doc.id, data: item.focal })
        }
        continue
      }
      await payload.delete({ collection: 'media', id: doc.id })
      payload.logger.info(`médium ${item.filename} se nahrává znovu (og nebyl WebP)`)
    }
    const filePath = path.resolve(dirname, '..', item.source ?? `zdroje-informaci/fotky/${item.filename}`)
    if (!existsSync(filePath)) {
      payload.logger.warn(`fotografie ${item.filename} není v zdroje-informaci/fotky – přeskočeno`)
      continue
    }
    /* Portrétový ořez se nahraje první a hlavní fotka si ho ponese —
       art direction patří k fotografii, ne do CSS ani do postu. */
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

  const photoIds = {} as SoilPhotoIds
  for (const [key, item] of Object.entries(SOIL_PHOTOS) as [keyof SoilPhotoIds, (typeof SOIL_PHOTOS)[keyof SoilPhotoIds]][]) {
    const found = await payload.find({
      collection: 'media', where: { filename: { equals: item.filename } }, limit: 1, pagination: false,
    })
    if (!found.docs[0]) throw new Error(`Chybí fotografie ${item.filename}`)
    photoIds[key] = found.docs[0].id
  }

  const data = {
    title: 'Krásný trávník začíná pod zemí',
    slug: SLUG,
    _status: 'published' as const,
    heroImage: hero.docs[0]?.id,
    content: illustrateSoilGuide(optimizeLawnArticle(SLUG, reviseSoilGuide(body)), photoIds),
    publishedAt: '2026-09-12T08:00:00.000Z',
    meta: {
      // og:image = hero (bez toho jde ven og-default.webp – porota kola 04, výkon)
      image: hero.docs[0]?.id,
      title: LAWN_SEO[SLUG].title,
      description:
        LAWN_SEO[SLUG].description,
    },
  }

  const existing = await payload.find({
    collection: 'posts',
    where: { slug: { equals: SLUG } },
    limit: 1,
    draft: true,
    pagination: false,
  })

  if (existing.docs.length > 0) {
    const id = existing.docs[0].id
    await publikujCs(payload, { collection: 'posts', id, data })
    payload.logger.info(`Článek aktualizován (id ${id}) – /posts/${SLUG}`)
  } else {
    const created = await payload.create({
      collection: 'posts',
      data,
      draft: false,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Článek vytvořen (id ${created.id}) – /posts/${SLUG}`)
  }

  process.exit(0)
}

await run()
