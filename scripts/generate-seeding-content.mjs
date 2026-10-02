// generate-seeding-content.mjs — datový modul článku „Jak zasít trávník"
// z autorovy předlohy. Text se jen dělí na hranicích vět; generátor ověří,
// že složený modul dává znak po znaku týž text jako předloha, a teprve pak
// přepíše scripts/lib/seeding-article-content.ts.
//   node scripts/generate-seeding-content.mjs
// Po změně předlohy: spustit generátor, potom seed-clanek-zasit.ts.
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const MD = path.resolve(dirname, '../zdroje-informaci/pro-clanky/clanek pro závlahu zahrady/jak-zasit-travnik.md')
const OUT = path.resolve(dirname, 'lib/seeding-article-content.ts')

const raw = readFileSync(MD, 'utf8').replace(/^---[\s\S]*?---\n/, '')
// Mechanická typografie: dlouhá pomlčka s mezerami → půlčtverčíková (česká sazba).
const typo = (s) => s.replace(/ — /g, ' – ')

/* ── rozbor předlohy ─────────────────────────────────────────────── */
const sections = [{ title: '__intro', level: 0, blocks: [] }]
for (const chunk of raw.split(/\n{2,}/).map((c) => c.trim()).filter(Boolean)) {
  if (chunk.startsWith('# ')) continue
  const h = chunk.match(/^(##|###) (.+)$/)
  if (h) { sections.push({ title: h[2], level: h[1].length, blocks: [] }); continue }
  const cur = sections[sections.length - 1]
  if (chunk.startsWith('|')) {
    const rows = chunk.split('\n').map((r) => r.replace(/^\||\|$/g, '').split('|').map((c) => typo(c.trim())))
    cur.blocks.push({ type: 'table', head: rows[0], rows: rows.slice(2) })
  } else cur.blocks.push({ type: 'p', text: typo(chunk.replace(/\n/g, ' ')) })
}
const sec = (title) => {
  const s = sections.find((x) => x.title === title)
  if (!s) throw new Error(`Chybí oddíl: ${title}`)
  return s
}
const paras = (title) => sec(title).blocks.filter((b) => b.type === 'p').map((b) => b.text)

/* ── dělení dlouhých odstavců na hranicích vět ───────────────────── */
const LIMIT = 390
function sentences(text) {
  const out = []
  let start = 0
  for (let i = 1; i < text.length - 1; i++) {
    if (text[i] !== ' ') continue
    const before = text.slice(0, i)
    if ((before.match(/\*\*/g) ?? []).length % 2 === 1) continue // uvnitř tučného řezu
    if (!/[.!?](\*\*|“)?$/.test(before)) continue
    if (!/^(\*\*)?[„A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/.test(text.slice(i + 1))) continue
    out.push(text.slice(start, i))
    start = i + 1
  }
  out.push(text.slice(start))
  return out
}
function splitParagraph(text) {
  if (text.length <= LIMIT) return [text]
  const s = sentences(text)
  const n = Math.ceil(text.length / 380)
  if (s.length < 2) return [text]
  // rozdělit věty do n souvislých skupin s co nejmenší nejdelší skupinou
  let best = null
  const groups = Math.min(n, s.length)
  const rec = (idx, left, acc) => {
    if (left === 1) {
      const g = [...acc, s.slice(idx).join(' ')]
      const max = Math.max(...g.map((x) => x.length))
      if (!best || max < best.max) best = { max, g }
      return
    }
    for (let j = idx + 1; j <= s.length - (left - 1); j++) rec(j, left - 1, [...acc, s.slice(idx, j).join(' ')])
  }
  rec(0, groups, [])
  return best.g
}

/* ── odkazy na sesterské články: jen obalení autorovy fráze ───────── */
const LINKS = [
  ['Samotné seťové lůžko', '/posts/jak-pripravit-a-ulozit-smes#cas-na-slehnuti-neni-prazdne-cekani', 'seťové lůžko', 'Samotné [seťové lůžko]'],
  ['Na lehčí písčité půdě', '/posts/krasny-travnik-zacina-pod-zemi-2', 'lehčí písčité půdě', 'Na [lehčí písčité půdě]'],
  ['Jeden program pro všechny části zahrady', '/posts/jak-navrhnout-automatickou-zavlahu', 'Jeden program pro všechny části zahrady', '[Jeden program pro všechny části zahrady]'],
]
const linkify = (text) => {
  for (const [phrase, url, , wrapped] of LINKS) {
    if (text.includes(phrase)) text = text.replace(phrase, `${wrapped}(${url})`)
  }
  return text
}

/* ── plán rytmu ──────────────────────────────────────────────────── */
const T = {
  K01: 'V malém semeni začíná velká změna',
  K02: 'Teploměr patří do země',
  K03: 'Semeno nemá kalendář',
  K03b: 'Zajímavost: semena, která čekají na jaro',
  K04: 'Jeden pytel, několik různých rychlostí',
  K05: 'Proč další hrst nemusí pomoci',
  K06: 'Několik milimetrů, na kterých záleží',
  K07: 'Dva směry pro rovnoměrný výsev',
  K08: 'Semena potřebují stálou vláhu',
  K09: 'Kořeny rostou a zálivka se mění s nimi',
  K10: 'Hnojivo neumí nahradit čas',
  K11: 'Na prázdnou plochu nečekala jen tráva',
  K12: 'Hustý trávník bere plevelům prostor',
  K13: 'Co může ohrozit čerstvý výsev',
  K14: 'Kdy poprvé posekat nový trávník',
  K15: 'Zahrada někdy nakreslí mapu chyby',
  K16: 'Co z terasy nebylo vidět',
}
const kap = (n) => `Kapitola ${String(n).padStart(2, '0')}`

const MYKO_TITLE = 'Mykorhizu umístit tam, kde se setká s mladými kořeny'
const MYKO_BODY = [
  'Pokud jsme se [pro mykorhizní přípravek rozhodli](/posts/pisek-biochar-a-dalsi-primesi#mykorhizni-pripravek-ma-vlastni-pravidla-davkovani), jeho umístění se řídí návodem konkrétního výrobku. Pro přípravek TurfComp výrobce při výsevu popisuje aplikaci přibližně **3 cm pod osivo**.',
  'Při pokládce travního koberce přijde na připravený povrch pod něj. Podstatný je budoucí kontakt s kořeny; rovnoměrné rozptýlení stejné dávky do celých třiceti centimetrů by sledovalo jiný cíl.',
  'Přípravek rozprostřeme rovnoměrně v místě budoucích kořenů a dál postupujeme podle návodu k výsevu nebo pokládce koberce. Při ošetření hotového trávníku použijeme návod pro dodatečnou aplikaci; postup určený pod osivo na povrchu již založeného porostu nenapodobujeme.',
]

// from: [oddíl, indexy odstavců]; obraz: drawing | photo(+ratio)
const PLAN = [
  { id: 'U', from: ['__intro', [0, 1, 2, 3]], surface: 'bila',
    photo: 'fig-zasit-terasa-pred.avif', photoRatio: '4:5',
    caption: 'Pohled z terasy pár dnů po výsevu: plocha je pořád hnědá. To podstatné se zatím odehrává v několika milimetrech pod povrchem.' },
  { tocGroup: 'Před setím', id: 'K01', from: [T.K01, [0, 1, 2, 3, 4]], eyebrow: kap(1), title: T.K01, surface: 'krem',
    drawing: 'kliceni-krok-za-krokem',
    alt: 'Čtyři řezy půdou s týmž semenem těsně pod povrchem: suché semeno, semeno nabobtnalé vodou, semeno s prvním kořínkem a nakonec delší kořínek s prvním zeleným listem nad půdou. Pod třetí a čtvrtou fází je vyznačeno, že od kořínku nesmí půda vyschnout. Dole tři potřeby klíčení: voda, vzduch a teplo.',
    caption: 'Semeno nejprve přijme vodu, potom vyroste kořínek a teprve nakonec první list. Od objevení kořínku už půda kolem něj nesmí vyschnout.' },
  { id: 'K02', from: [T.K02, [0, 1]], eyebrow: kap(2), title: T.K02, surface: 'bila',
    drawing: 'pudni-teplomer',
    alt: 'Půdní teploměr zapíchnutý do řezu půdou s hrotem v hloubce 5 cm. Vedle svislá stupnice teploty půdy od 0 do 30 °C s vyznačenou hranicí 10 °C, odkud se začíná sít, a pásmem 15–25 °C příznivým pro klíčení.',
    caption: 'Teploměr patří do země, asi 5 cm hluboko. Začínáme při stabilních zhruba 10 °C; pásmo 15–25 °C bývá pro klíčení řady trav příznivé.' },
  { id: 'K03a', from: [T.K03, [0, 1, 2, 3]], eyebrow: kap(3), title: T.K03, surface: 'krem',
    drawing: 'okno-konce-leta',
    alt: 'Schematický průběh teploty vzduchu a půdy od jara do podzimu: půda se za vzduchem opožďuje, na jaře je chladnější, koncem léta teplejší. Na přelomu léta a podzimu je vyznačené okno pro výsev s šesti až osmi týdny růstu před zimou. Pod grafem tři řádky: jaro, léto a konec léta.',
    caption: 'Koncem léta je půda ještě prohřátá a vzduch už chladnější. Po výsevu má zbývat šest až osm týdnů počasí příznivého pro růst.' },
  { id: 'K03b', from: [T.K03b, [0, 1]], title: T.K03b, titleLevel: 'h3', surface: 'bila',
    photo: 'fig-zasit-jinovatka.avif', photoRatio: '3:2',
    caption: 'Jinovatka na připravené půdě za mrazivého rána. Při dormantním výsevu mají semena v takové půdě zůstat nevyklíčená až do jara.' },
  { id: 'K04', from: [T.K04, [0, 1, 2]], eyebrow: kap(4), title: T.K04, surface: 'bila',
    drawing: 'rychlost-vzchazeni',
    alt: 'Časová osa 0 až 28 dnů od výsevu se čtyřmi pruhy doby vzejití: jílek vytrvalý 5–8 dnů, kostřava rákosovitá 14–21 dnů, kostřava červená 15–20 dnů a lipnice luční 21–28 dnů. Svislá linka v sedmém dnu protíná jen pruh jílku.',
    caption: 'Po týdnu se zelená hlavně jílek. Kostřavy a lipnice potřebují i za příznivých podmínek dva až čtyři týdny; u kostřavy rákosovité platí údaj pro chladnější jaro.' },
  { id: 'TAB1' },
  { id: 'K05a', from: [T.K05, [0, 1]], eyebrow: kap(5), title: T.K05, surface: 'bila',
    drawing: 'husty-vysev',
    alt: 'Dva řezy půdou pod stejným sluncem. Vlevo dávka podle návodu: několik silných rostlin s odnožemi a delšími kořeny. Vpravo hustý výsev: mnoho tenkých rostlinek natěsnaných vedle sebe s krátkými kořínky.',
    caption: 'Na stejném metru je stejné světlo. Rostliny z doporučené dávky mají místo zesílit; hustý výsev dá mnoho slabých rostlinek, které si stíní.' },
  { id: 'K05b', from: [T.K05, [2, 3, 4]], continues: true, surface: 'bila',
    drawing: 'odnozovani',
    alt: 'Táž travní rostlina ve třech stavech na řezu půdou: jeden výhon s krátkým kořínkem, tři výhony z jedné báze s delšími kořeny a hustý trs s mnoha výhony a bohatými kořeny. Mezi stavy vedou šipky.',
    caption: 'Z jednoho semene nezůstane jedno stéblo. Rostlina, která dostala čas zesílit, přidává další výhony a trávník houstne i bez dalšího osiva.' },
  { tocGroup: 'Setí', id: 'K06a', from: [T.K06, [0, 1]], eyebrow: kap(6), title: T.K06, surface: 'krem',
    photo: 'fig-zasit-setove-luzko.avif', photoRatio: '1:1',
    caption: 'Seťové lůžko před výsevem: rovné, jemně drobtovité a pevné. Bota v něm nechá jen mělký otisk.' },
  { id: 'K06b', from: [T.K06, [2, 3, 4, 5]], continues: true, surface: 'krem',
    drawing: 'hloubka-seti',
    alt: 'Zvětšený řez horní vrstvou půdy s milimetrovou stupnicí a třemi semeny: jedno leží volně na povrchu bez kontaktu s půdou, druhé je přitlačené v hloubce 2–5 mm a klíčí nad povrch, třetí leží příliš hluboko a jeho klíček končí pod povrchem. Dole lehký válec přitlačuje semena k půdě.',
    caption: 'Semeno potřebuje kontakt s půdou a jen několik milimetrů zeminy nad sebou. Volně na povrchu nemá odkud brát vodu, z hloubky se klíček ke světlu nedostane.' },
  { id: 'K07', from: [T.K07, [0, 1]], eyebrow: kap(7), title: T.K07, surface: 'bila',
    drawing: 'krizovy-vysev',
    alt: 'Pohled shora na dvě stejné plochy. Na první se první polovina osiva vysévá v rovnoběžných pruzích jedním směrem, na druhé se přes ně seje druhá polovina napříč, kolmo k prvnímu průchodu.',
    caption: 'Polovina dávky jedním směrem, druhá polovina napříč. Celkové množství osiva se nemění, jen se rovnoměrněji rozloží.' },
  { id: 'PREDEL' },
  { tocGroup: 'Péče po výsevu', id: 'K08', from: [T.K08, [0, 1, 2, 3]], eyebrow: kap(8), title: T.K08, surface: 'krem',
    photo: 'fig-zasit-vlhkost-prstem.avif', photoRatio: '4:5',
    caption: 'Vlhkost se ověřuje přímo u semen: zemina má být na dotek vlhká, ne lesklá ani rozbředlá.' },
  { id: 'K09a', from: [T.K09, [0, 1, 2]], eyebrow: kap(9), title: T.K09, surface: 'bila',
    photo: 'fig-mlady-porost-ctverec.avif', photoRatio: '1:1',
    caption: 'Stébla různé výšky a mezi nimi ještě holá půda: zelená se rychlejší složka směsi, pomalejší trávy teprve klíčí.' },
  { id: 'K09b', from: [T.K09, [3, 4]], continues: true, surface: 'bila',
    drawing: 'koreny-a-vlaha',
    alt: 'Dva řezy půdou se stejným mladým porostem a stejně hlubokými kořeny. Vlevo je vlhká jen tenká vrstva u povrchu a kořeny pod ní jsou v suché půdě. Vpravo je povrch oschlý, ale vrstva s kořeny pod ním je vlhká a půda pod kořeny zůstává suchá.',
    caption: 'Po zálivce rozhoduje, kam došla voda. Mokrý povrch nad suchou vrstvou s kořeny znamená upravit dávku; oschlý povrch nad vlhkou vrstvou je v pořádku.' },
  { id: 'K09c', from: [T.K09, [5, 6]], continues: true, surface: 'bila',
    photo: 'fig-zasit-stin-stromu.avif', photoRatio: '3:2',
    caption: 'Pod stromem a na slunci rostou dva různé trávníky. Stejný program zálivky nemusí vyhovovat oběma.' },
  { id: 'K10', from: [T.K10, [0, 1, 2, 3]], eyebrow: kap(10), title: T.K10, surface: 'krem',
    photo: 'fig-zasit-hnojivo.avif', photoRatio: '4:5',
    caption: 'Startovací hnojivo se odměřuje podle skutečné plochy, ne od oka. Přisypat pro jistotu se u klíčící trávy nevyplácí.' },
  { id: 'MYKO', body: MYKO_BODY, title: MYKO_TITLE, titleLevel: 'h3', surface: 'bila',
    drawing: 'mykorhiza-pod-osivem',
    alt: 'Dva řezy půdou do 30 cm se stejnou dávkou mykorhizního přípravku. Vlevo leží přípravek v pásu asi 3 cm pod osivem a první kořínky do něj vrůstají. Vpravo je tatáž dávka rozptýlená do celé hloubky; kořínky dosáhnou jen k nejmělčí značce přípravku a většina dávky leží hlouběji.',
    caption: 'Stejná dávka, jiné místo. Pás zhruba 3 cm pod osivem potká první kořínky hned; rozptýlený do 30 cm leží většinou tam, kam mladé kořeny ještě nedosáhnou.' },
  { tocGroup: 'Plevele, sečení a potíže', id: 'K11', from: [T.K11, [0, 1, 2]], eyebrow: kap(11), title: T.K11, surface: 'krem',
    photo: 'fig-zasit-plevel-nadhled.avif', photoRatio: '1:1',
    caption: 'Mezi úzkými stébly mladé trávy vyrážejí širší listy plevelů. Jejich semena čekala v půdě, nepřinesl je pytel osiva.' },
  { id: 'K12', from: [T.K12, [0, 1]], eyebrow: kap(12), title: T.K12, surface: 'bila',
    photo: 'fig-zasit-husty-travnik.avif', photoRatio: '1:1',
    caption: 'Hustý porost nechává plevelům málo světla i místa. Jednotlivé odolné rostliny stačí vytáhnout ručně i s kořenem.' },
  { id: 'K13', from: [T.K13, [0, 1]], eyebrow: kap(13), title: T.K13, surface: 'krem',
    drawing: 'privalovy-dest',
    alt: 'Řez mírným svahem v prudkém dešti: nahoře zůstalo holé místo, semena voda odplavila dolů pod svah, kde leží na hromádce; povrch svahu po vyschnutí ztvrdne v krustu.',
    caption: 'Prudký déšť odplaví semena ze svahu dolů a naruší povrch, který po vyschnutí ztvrdne v krustu.' },
  { id: 'K14', from: [T.K14, [0, 1, 2, 3]], eyebrow: kap(14), title: T.K14, surface: 'bila',
    drawing: 'prvni-sec',
    alt: 'Mladý porost se stupnicí výšky: stébla sahají do 8 cm a linka řezu je v 6 cm. Pod tím příklad přerostlého porostu zkracovaného postupně z 12 na 8 a potom na 6 cm, pokaždé nejvýš o třetinu. Dole tři podmínky: rostliny drží v půdě, povrch unese sekačku, suché listy a ostrý nůž.',
    caption: 'Poprvé sekáme při výšce asi 8 cm a zkracujeme zhruba na 6 cm. Přerostlý porost snižujeme postupně, pokaždé nejvýš o třetinu.' },
  { id: 'K15a', from: [T.K15, [0]], eyebrow: kap(15), title: T.K15, surface: 'bila',
    drawing: 'mapa-chyby',
    alt: 'Pohled shora na trávník se třemi různými tvary problému: pravidelné rovnoběžné řídké pruhy, oválná prohlubeň s vodou a zakřivená stopa sekačky s poškozením v otočce.',
    caption: 'Tvar a poloha řídkého místa napoví příčinu: pravidelné pruhy, prohlubeň s vodou a stopa sekačky ukazují každá jinam.' },
  { id: 'TAB2' },
  { id: 'K15b', from: [T.K15, [1, 2]], continues: true, surface: 'bila',
    photo: 'fig-zasit-oprava.avif', photoRatio: '3:2',
    caption: 'Oprava holého místa: nejdřív upravený povrch, potom osivo v dávce pro dané místo.' },
  { id: 'K16', from: [T.K16, [0, 1, 2]], eyebrow: kap(16), title: T.K16, surface: 'krem',
    photo: 'fig-zasit-terasa-po.avif', photoRatio: '1:1',
    caption: 'Tentýž pohled z terasy o několik týdnů později. Zelená už je vidět; jak pevně drží, ukážou až kořeny.' },
]

/* ── sestavení ───────────────────────────────────────────────────── */
let side = 'image-right'
const used = new Map()
const out = []
const order = []
for (const item of PLAN) {
  order.push(item.id)
  if (['TAB1', 'TAB2'].includes(item.id)) continue
  if (item.id === 'PREDEL') continue // střídání běží přes předěl dál (přejímka layout-check)
  let body
  if (item.body) body = item.body
  else {
    const [title, idx] = item.from
    const all = paras(title)
    body = idx.flatMap((i) => {
      const key = `${title}#${i}`
      if (used.has(key)) throw new Error(`Odstavec použit dvakrát: ${key}`)
      used.set(key, item.id)
      if (all[i] === undefined) throw new Error(`Chybí odstavec ${key}`)
      return splitParagraph(all[i]).map(linkify)
    })
  }
  const { from, body: _b, ...rest } = item
  out.push({
    id: item.id, side, surface: item.surface,
    ...(item.eyebrow ? { eyebrow: item.eyebrow } : {}),
    ...(item.tocGroup ? { tocGroup: item.tocGroup } : {}),
    ...(item.title ? { title: item.title, titleLevel: item.titleLevel ?? 'h2' } : {}),
    ...(item.continues ? { continues: true } : {}),
    ...(item.drawing ? { drawing: item.drawing, alt: item.alt } : { photo: item.photo, photoRatio: item.photoRatio }),
    caption: item.caption,
    body,
  })
  side = side === 'image-right' ? 'image-left' : 'image-right'
}

/* Tabulky: K04 nese poznámku = odstavec za tabulkou (začíná „Tabulka popisuje…"). */
const t1 = sec(T.K04).blocks.find((b) => b.type === 'table')
const t1note = paras(T.K04)[3]
used.set(`${T.K04}#3`, 'TAB1')
const t2 = sec(T.K15).blocks.find((b) => b.type === 'table')
const tables = {
  // Dlouhá hlavička sloupce (60 znaků) se na telefonu opakovala u každého řádku
  // dvouřádkovým štítkem; autorovo znění nese titulek tabulky, sloupec krátký
  // štítek (porota kola 01). Kontrola textu dál porovnává původní hlavičku.
  TAB1: { blockName: 'Doba do vzejití podle druhu trávy', surface: 'krem', width: 'prose', heading: t1.head[1], columns: [t1.head[0], 'Doba do vzejití'], head: t1.head, rows: t1.rows, note: t1note },
  // Věty v buňkách drží míru: osa prózy 700, ne 1360 (porota kola 01: 103–133 znaků na řádek).
  TAB2: { blockName: 'Co pozorujeme a co ověřit', surface: 'krem', width: 'prose', head: t2.head, rows: t2.rows },
}

/* ── kontrola: každý odstavec předlohy právě jednou, text znak po znaku ── */
for (const s of sections) {
  s.blocks.filter((b) => b.type === 'p').forEach((_, i) => {
    if (!used.has(`${s.title}#${i}`)) throw new Error(`Nepoužitý odstavec: ${s.title}#${i}`)
  })
}
const strip = (t) => t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ').trim()
const original = sections.flatMap((s) => [
  ...(s.level ? [s.title] : []),
  ...s.blocks.map((b) => (b.type === 'p' ? b.text : [b.head, ...b.rows].flat().join(' '))),
]).map(strip).join(' ')
const rebuilt = []
for (const id of order) {
  if (id === 'PREDEL') continue
  if (tables[id]) {
    rebuilt.push([tables[id].head, ...tables[id].rows].flat().join(' '))
    if (tables[id].note) rebuilt.push(tables[id].note)
    continue
  }
  const s = out.find((x) => x.id === id)
  if (id === 'MYKO') continue
  if (s.title) rebuilt.push(s.title)
  rebuilt.push(...s.body)
}
const a = original, b = rebuilt.map(strip).join(' ')
if (a !== b) {
  let i = 0
  while (i < a.length && a[i] === b[i]) i++
  throw new Error(`Text se liší na pozici ${i}: „${a.slice(i - 30, i + 60)}" vs „${b.slice(i - 30, i + 60)}"`)
}

const stats = out.map((s) => `${s.id.padEnd(5)} ${s.side.padEnd(11)} ${s.surface.padEnd(4)} odst. ${String(s.body.length).padStart(2)}  znaků ${String(s.body.join('').length).padStart(4)}  max ${Math.max(...s.body.map((p) => p.length))}  ${s.drawing ?? s.photo}`)
console.log(stats.join('\n'))
console.log(`OK: ${a.length} znaků předlohy beze změny, ${out.length} dvousloupců`)

const header = `/**
 * Rytmus obraz/text článku „Jak zasít trávník: od prvního zalití k pevným
 * kořenům" (2026-10-02). Každý úsek autorova textu stojí vedle vlastního
 * obrazu, strany se střídají (DESIGN.md 8.2b p. 8, ADR-006).
 *
 * Soubor je vygenerovaný z autorovy předlohy
 * \`zdroje-informaci/pro-clanky/clanek pro závlahu zahrady/jak-zasit-travnik.md\`:
 * odstavce jsou jen rozdělené na hranicích vět (≤ ~380 znaků) a dlouhá
 * pomlčka je nahrazená půlčtverčíkovou; generátor ověřil shodu znak po znaku.
 * Nové jsou popisky, alty a tři odkazy na sesterské články (obalují
 * autorovu frázi beze změny slov). Oddíl MYKO je převzatý ze starší verze
 * článku (rozdělení přípravy a setí, 2026-10-02) – v nové předloze není.
 * Text needitovat ručně.
 */
export type SeedingSection = {
  id: string
  side: 'image-left' | 'image-right'
  surface: 'bila' | 'krem'
  eyebrow?: string
  /** První kapitola skupiny v obsahu „V článku“ (dlouhý článek). */
  tocGroup?: string
  title?: string
  titleLevel?: 'h2' | 'h3'
  continues?: boolean
  drawing?: string
  photo?: string
  photoRatio?: '4:5' | '1:1' | '2:3' | '3:2'
  alt?: string
  caption: string
  body: string[]
}

export type SeedingTable = {
  blockName: string
  surface: 'bila' | 'krem'
  width: 'prose' | 'edge'
  /** Titulek nad tabulkou (když se liší od hlavičky sloupce). */
  heading?: string
  /** Krátké štítky sloupců; bez nich platí hlavička z předlohy. */
  columns?: string[]
  head: string[]
  rows: string[][]
  note?: string
}
`
const ts = `${header}
export const SEEDING_SECTIONS: SeedingSection[] = ${JSON.stringify(out, null, 2)}

/** Pořadí bloků mezi souhrnem a zdroji: dvousloupce, tabulky a předěl. */
export const SEEDING_ORDER: string[] = ${JSON.stringify(order)}

export const SEEDING_TABLES: Record<string, SeedingTable> = ${JSON.stringify(tables, null, 2)}

/** Předěl přes celou šířku: mezi výsevem a zálivkou. */
export const SEEDING_BLEED = {
  filename: 'fig-zasit-prvni-zalivka-v2.avif',
  caption: 'První zálivka po výsevu: jemný postřik, který půdu navlhčí a semena nepřemístí.',
}
`
writeFileSync(OUT, ts)
