/**
 * Vloží článek „Jak navrhnout automatickou závlahu" jako KONCEPT.
 * Spuštění:  npm run payload -- run scripts/seed-clanek-zavlaha.ts
 *
 * Idempotentní: když článek se stejným slugem existuje, přepíše ho.
 * Nikdy nepublikuje — publikaci dělá majitel v adminu.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

/* ── Lexical stavebnice ─────────────────────────────────────────── */

/** Lexical uzel — Payload vyžaduje aspoň `type` a `version`. */
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

/** Odstavec; části mohou být řetězce nebo [text, formát]. */
const p = (...parts: (string | [string, number])[]): Node => ({
  type: 'paragraph',
  children: parts.map((part) =>
    typeof part === 'string' ? text(part) : text(part[0], part[1]),
  ),
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

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

/** Krátký richText do pole uvnitř bloku (Banner, FAQ odpověď). */
const mini = (...paragraphs: string[]) => root(paragraphs.map((t) => p(t)))

/** Text vedle obrazu (8.2b) — obraz a text, které patří k sobě, drží jeden blok. */
const split = (fields: Record<string, unknown>): Node =>
  block({ blockType: 'split', ...fields })

/** Kalkulátor (8.2: max 2 na článek; druhý musí být světlý — 7.7). */
const calc = (kind: string, light = false, layout = 'axis'): Node =>
  block({ blockType: 'calculator', blockName: `Kalkulátor ${kind}`, kind, light, layout })

/** Technická kresba (DESIGN.md 9.2) — obraz je kód, v obsahu jen klíč. */
const drawing = (
  key: string,
  number: string,
  alt: string,
  caption: string,
  layout = '',
): Node =>
  block({
    blockType: 'figure',
    blockName: `Obr. ${number}`,
    drawing: key,
    alt,
    number,
    caption,
    panel: true,
    layout,
  })

/** Figura; `image` se doplní až za běhu podle názvu souboru v Media. */
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
    __filename: filename, // dočasné, nahradí se ID média
    number,
    caption,
    panel,
    layout,
  })

/* ── Obsah článku ───────────────────────────────────────────────── */

const SLUG = 'jak-navrhnout-automatickou-zavlahu'

const body = root([
  /* Šablona 8.2 ř. 2: po obsidianovém hero vždy krém. Souhrn i čísla
     bydlí uvnitř pásu, aby druhá obrazovka měla vlastní povrch i hlas. */
  block({
    blockType: 'summaryBand',
    blockName: 'Souhrn',
    lead: 'Základem spolehlivé automatické závlahy je pochopení toho, co váš trávník skutečně potřebuje, a *přesné změření dynamického tlaku zdroje*. Jakmile znáte kapacitu vody, musíte dodržet stoprocentní překrytí trysek — pravidlo „hlava na hlavu“. Protože samotné sčítání vylitých litrů na povrch nestačí, chytré řízení propojí závlahu přímo s čidly vlhkosti a retenční nádrží.',
    tiles: [
      { value: '10–15', unit: 'l/m²', label: 'orientační dávka na jednu zálivku' },
      { value: '3', unit: 'dny', label: 'obvyklý interval v teplém období' },
      { value: '25', unit: 'l/min', label: 'průtok potřebný pro běžný systém' },
      { value: '2,8', unit: 'baru', label: 'tlak přímo na hlavici rotační trysky' },
    ],
  }),

  /* 8.2b: kapitola jako dvousloupec, sloupce 652 | 652 se zlomem v ose 720.
     Kresba jde v portrétové sazbě, panoramatická by se do sloupce nevešla.
     Strana R — první mimoosová hmota článku. */
  split({
    blockName: 'Kapitola 01',
    side: 'image-right',
    drawing: 'korenova-zona',
    eyebrow: 'Kapitola 01',
    title: 'Jak funguje krevní oběh vaší zahrady?',
    number: '01',
    alt: 'Řez půdou ve dvou sloupcích: nahoře častá malá zálivka, která smočí jen horní vrstvu a vychová mělké kořeny; dole vydatná zálivka méně často, po které voda dojde do hloubky a kořeny jdou za ní.',
    caption:
      'Stejné množství vody, jiný výsledek. Rozhoduje hloubka, do které voda dojde — kořeny rostou tam, kam se dostane.',
    body:
      'Zahrada je fascinující živý organismus a voda představuje její krevní oběh. Obecně se doporučuje dodat trávníku **10 až 15 litrů vody na metr čtvereční každé tři dny**, ale reálná potřeba vždy závisí na aktuálních podmínkách. Roli hraje teplota vzduchu, konkrétní druh trávy i celková kondice vašeho zeleného koberce. Zdravý trávník s hlubokými kořeny totiž s přehledem přežije i ta největší vedra s překvapivě malým množstvím vláhy.\n\nMladý trávník bez vyspělých kořenů naopak potřebuje první roky mnohem pečlivější přístup a opečovávaná tráva je z dlouhodobého hlediska daleko odolnější. Množství vody, které na trávník jednoduše vylijeme, nám ale bohužel neřekne vůbec nic o tom, jaká je skutečná vlhkost uvnitř půdy. Proto dává mnohem větší smysl **měřit přímo půdní vlhkost, než jen slepě počítat objem dopadající vody**. Pokud tento základní přírodní princip nerespektujeme a závlahu nenavrhneme správně, nepomohou nám k dokonalé zahradě ani ty nejdražší komponenty.',
  }),

  /* Kapitola 02 jako dvousloupec — kresba vlevo, text vpravo.
     Portrétová sazba: panoramatická měla při 1360 px hustotu 12,3,
     tahle má ve sloupci 652 px hustotu 20,6. */
  split({
    blockName: 'Kapitola 02',
    side: 'image-left',
    drawing: 'kbelikovy-test',
    eyebrow: 'Kapitola 02',
    title: 'Jak změřit skutečnou sílu vašeho vodního zdroje?',
    number: '02',
    alt: 'Schéma kbelíkového testu: zdroj se stoupačkou, manometr s ručičkou na 3,5 baru, proud vody plnící desetilitrový kbelík k rysce, stopky na 24 sekundách a pod tím výpočet průtoku se srážkou 20 %.',
    caption:
      'Kbelíkový test krok za krokem. Tlak se odečítá až ve chvíli, kdy voda proudí — a od výsledného průtoku se vždy odečte 20 % rezervy.',
    body:
      'Nejčastější a bohužel nejfatálnější chybou je pouhý odhad síly vašeho vodního zdroje. Závlahové systémy totiž zajímá pouze to, jak se voda chová ve chvíli, kdy skutečně proudí potrubím. Pro běžné systémy potřebujete zajistit **průtok alespoň 25 litrů za minutu při tlaku 3 bary**. Tyto přesné hodnoty zjistíte pomocí takzvaného kbelíkového testu, který zvládne každý zručný majitel zahrady.\n\nPro přesné měření budete potřebovat tlakoměr (manometr), stopky a objemnou nádobu, ideálně desetilitrový kbelík. Tlakoměr připojte přímo k vašemu zdroji vody a velmi pomalu otevírejte ventil. Otevírání zastavte v přesný moment, kdy ručička tlaku klesne a ustálí se na hodnotě 3,5 baru.\n\nNásledně vložte pod vytékající proud vody kbelík a pečlivě stopněte čas, za který se naplní po okraj. Z naměřených vteřin a objemu snadno vypočítáte váš reálný minutový průtok. Nezapomeňte ale z tohoto výsledku vždy odečíst 20 % — tahle rezerva pokryje ztráty na potrubí i stárnutí čerpadla.',
  }),

  calc('prutok', false, 'axis'),

  block({
    blockType: 'banner',
    blockName: 'Pro zvídavé',
    style: 'info',
    content: mini(
      'Pro zvídavé: proč tlak vody klesá, když otevřete kohoutek? (Pokud spěcháte na rýsování plánku, můžete tento fyzikální exkurz přeskočit.)',
      'Voda v uzavřeném potrubí vytváří tlak, který se rovnoměrně rozprostírá po stěnách trubky. Tomu říkáme statický tlak — představte si napjatou pružinu čekající na uvolnění. Jakmile ale otevřete ventil a voda se dá do pohybu, začne se třít o stěny plastových trubek, naráží na ohyby a filtry. Toto neustálé tření z ní doslova vysává energii, což se projevuje prudkým úbytkem tlaku.',
      'Čím více vody se snažíte trubkou protlačit, tím větší mechanický odpor uvnitř vzniká. Zbývajícímu tlaku pak říkáme hydrodynamický, a právě ten nás při návrhu zajímá. Moderní rotační trysky vyžadují ke správnému fungování tlak přesně 2,8 baru přímo na své hlavici. Pokud voda cestou ztratí energii a trysky tento tlak nedostanou, jednoduše se nevysunou a systém selže.',
    ),
  }),

  /* Druhý dvousloupec, překlopený: obraz vlevo. Strana L.
     Střídání se počítá přes VŠECHNY mimoosové hmoty (ADR-006). */
  split({
    blockName: 'Kapitola 03',
    side: 'image-right',
    drawing: 'hlava-na-hlavu',
    eyebrow: 'Kapitola 03',
    title: 'Proč se postřikovače musí vzájemně překrývat?',
    number: '03',
    alt: 'Půdorys trávníku ve dvou stavech: nahoře oddálené postřikovače se suchým pruhem mezi dostřiky, dole rozestup rovný dostřiku, kde se kruhy protínají ve středech sousedních hlavic.',
    caption:
      'Proč se rozestup rovná dostřiku. Jakmile je větší, zůstane mezi hlavicemi pruh, kam nedosáhne ani jedna z nich.',
    body:
      'Základní vlastností každého postřikovače je, že vodu nerozstřikuje rovnoměrně po celé ploše svého dostřiku. Největší množství kapek dopadá do jeho bezprostředního okolí a s rostoucí vzdáleností intenzita zálivky klesá. Abychom dosáhli naprosto rovnoměrného pokrytí trávníku, musí voda z jednoho postřikovače **dostříknout přesně na tělo toho sousedního**.\n\nTomuto nekompromisnímu pravidlu se v inženýrské praxi říká „hlava na hlavu“. Jakmile se pokusíte ušetřit a postřikovače od sebe oddálíte, vytvoříte hluchá místa s nedostatkem vláhy. V horkých letních měsících se pak na trávníku velmi rychle objeví suché a nažloutlé pruhy. Ke správnému vsakování do hlubších vrstev půdy doporučujeme používat moderní paprskové trysky, které vodu dávkují pomalu a šetrně.',
  }),

  /* Jediný obraz přes celou šířku — fotografie unese předěl, schéma ne.
     Podle 9.1 tady padá radius: full-bleed obraz rám nemá. */
  figure(
    'fig-hlava-na-hlavu.avif',
    '04',
    'Totéž pravidlo na skutečném trávníku: vějíře dvou sousedních postřikovačů se protínají, takže mezi nimi nezůstane pruh bez vody.',
    'bleed',
    false,
  ),

  /* Kapitola 04 jako dvousloupec — kresba vpravo, ať se strany střídají.
     Řídicí smyčka měla širokoúhle hustotu 6,7; portrétově 19,8. */
  split({
    blockName: 'Kapitola 04',
    side: 'image-left',
    drawing: 'ridici-smycka',
    eyebrow: 'Kapitola 04',
    title: 'Jak závlahu chytře řídit a neplýtvat?',
    number: '05',
    alt: 'Uzavřená rozhodovací smyčka: čidlo vlhkosti v půdě naměří 38 %, hodnota se porovná s cílem 45 %, při nedostatku se přes most otevře ventil a voda se vrací zpět k čidlu; zdrojem je přednostně retenční nádrž, vodovodní řad až jako záloha.',
    caption:
      'Smyčka, kterou obyčejný časovač nemá. Rozhodnutí zalévat vzniká z měření půdy a vrací se zpátky k němu — a voda se bere nejdřív z nádrže.',
    body:
      'Když už máte postřikovače rozmístěné a propojené hadicemi pod povrchem, přichází na řadu elektronický mozek celé zahrady. Obyčejné časovače spustí vodu klidně i během vydatného deště nebo ve chvíli, kdy má půda vody stále dostatek. Zde vstupuje do hry systém **InteliDome**, který obyčejnou síť trubek promění ve vnímavý a ohleduplný organismus.\n\nVyužíváme přesná čidla vlhkosti, díky kterým systém pozná, kdy mají kořeny rostlin opravdu žízeň. InteliDome navíc dokáže logicky řídit spínače, takže přednostně odčerpává dešťovou vodu z vaší retenční nádrže dříve, než sáhnete po placené vodě z řadu. Spolu se závlahou pak snadno zautomatizujete i večerní zahradní osvětlení.',
  }),

  /* Šablona 8.2 ř. N+1: jediný vnitřní obsidian článku. Tady se z výkladu
     o zahradě stává řeč o systému — proto je to jediný předěl povrchem. */
  block({
    blockType: 'productBand',
    blockName: 'Systém InteliDome',
    eyebrow: 'Systém InteliDome',
    title: 'Když závlahu neřídí kalendář, ale půda',
    body:
      'Objevte, jak dokáže systém InteliDome propojit chytrou závlahu závislou na **skutečné vlhkosti půdy**, vaši retenční nádrž i venkovní osvětlení do jednoho spolehlivě fungujícího celku.\n\nRozdíl proti obyčejnému časovači je jediný, ale zásadní: **systém se ptá půdy, ne hodin.** Voda teče tehdy, kdy mají kořeny žízeň — a tehdy, kdy je v nádrži dešťová voda zadarmo.',
    features: [
      {
        title: 'Čidla vlhkosti',
        text: 'Měří stav půdy v kořenové zóně, takže sektor se spustí podle skutečné potřeby, ne podle kalendáře.',
      },
      {
        title: 'Retenční nádrž',
        text: 'Systém čerpá přednostně dešťovou vodu a po vodě z řadu sáhne až tehdy, když je nádrž prázdná.',
      },
      {
        title: 'Zahradní osvětlení',
        text: 'Stejné spínače, stejná aplikace — večerní osvětlení se automatizuje ze stejného místa jako závlaha.',
      },
    ],
  }),

  block({
    blockType: 'faq',
    blockName: 'Časté otázky',
    heading: 'Časté otázky',
    items: [
      {
        question: 'Kolik vody potřebuje trávník za jednu zálivku?',
        answer: mini(
          'Orientačně 10 až 15 litrů na metr čtvereční každé tři dny. Je to ale jen výchozí číslo — skutečná potřeba závisí na teplotě, druhu trávy, hloubce kořenů i stáří trávníku. Zdravý trávník s hlubokými kořeny vydrží vedro s výrazně menší dávkou než čerstvý výsev.',
        ),
      },
      {
        question: 'Proč nestačí počítat vylité litry a je lepší měřit vlhkost půdy?',
        answer: mini(
          'Objem vody dopadlé na povrch neříká nic o tom, kolik jí zůstalo v kořenové zóně. Část se odpaří, část steče, část projde hlouběji, než kořeny dosáhnou. Čidlo vlhkosti měří přímo stav půdy, takže závlaha běží tehdy, kdy mají rostliny skutečně žízeň — ne podle kalendáře.',
        ),
      },
      {
        question: 'Jak si doma změřím tlak a průtok vody?',
        answer: mini(
          'Takzvaným kbelíkovým testem. Připojte ke zdroji manometr, pomalu otevírejte ventil a zastavte se na 3,5 baru. Pak pod proud vložte desetilitrový kbelík a stopněte, za jak dlouho se naplní. Z objemu a času vypočítáte průtok za minutu — a od výsledku odečtěte 20 % jako rezervu na ztráty v potrubí a stárnutí čerpadla.',
        ),
      },
      {
        question: 'Co znamená pravidlo „hlava na hlavu"?',
        answer: mini(
          'Že voda z jednoho postřikovače musí dostříknout přesně na tělo postřikovače sousedního. Postřikovač totiž zavlažuje nejsilněji ve svém okolí a se vzdáleností slábne; teprve překrytí dvou dostřiků dá rovnoměrnou dávku. Když postřikovače oddálíte, objeví se v létě suché nažloutlé pruhy.',
        ),
      },
      {
        question: 'Můžu automatickou závlahu napojit na retenční nádrž s dešťovou vodou?',
        answer: mini(
          'Ano, a je to jedna z největších úspor. InteliDome řídí spínače tak, aby se přednostně čerpala dešťová voda z nádrže a teprve po jejím vyčerpání se sáhlo po vodě z řadu. Ze stejného místa se dá zautomatizovat i zahradní osvětlení.',
        ),
      },
      {
        question: 'Jaký tlak potřebují rotační paprskové trysky?',
        answer: mini(
          'Přibližně 2,8 baru přímo na hlavici trysky — ne u zdroje. Cestou potrubím totiž tlak klesá třením o stěny, ohyby a filtry. Pokud tryska tento tlak nedostane, nevysune se a sektor nezavlaží. Právě proto se při návrhu počítá s dynamickým tlakem, ne s tím v klidu.',
        ),
      },
    ],
  }),

  /* Šablona 8.2 ř. N+2: jediné tlačítko článku a jediná centrovaná sekce.
     Otázka na závěr schválně nemá tvar odkazu — není to druhá výzva. */
  block({
    blockType: 'ctaBand',
    blockName: 'Závěrečná výzva',
    title: 'Zahrada, která si sama řekne o vodu',
    sub: 'Chcete mít jistotu, že vaše zahrada dostane přesně to, co potřebuje, a zároveň nebudete plýtvat vodou ani energií?',
    buttonLabel: 'Objevit systém InteliDome',
    buttonHref: '/',
    ask: 'A otázka na závěr: máte už představu, jak hluboké kořeny má váš trávník, nebo zálivku zatím řídíte jen odhadem?',
  }),
])

/* ── Zápis ──────────────────────────────────────────────────────── */

const run = async () => {
  const payload = await getPayload({ config })

  /* Figury odkazují na média názvem souboru — přeložíme na ID.
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
      payload.logger.warn(`médium "${filename}" nenalezeno — figura vynechána`)
      continue
    }
    delete fields!.__filename
    fields!.image = found.docs[0].id
    resolved.push(node)
  }
  body.root.children = resolved

  const data = {
    title: 'Jak navrhnout automatickou závlahu: průvodce krok za krokem',
    slug: SLUG,
    // Lokální databáze — článek publikujeme, aby ho šlo prohlédnout na dev
    // serveru. Ostrý web se plní vlastním nasazením, ne tímhle skriptem.
    _status: 'published' as const,
    content: body,
    meta: {
      title: 'Jak navrhnout automatickou závlahu: průvodce krok za krokem',
      description:
        'Zelený trávník vyžaduje přesnost, ne náhodu. Zjistěte, proč je lepší měřit půdní vlhkost než počítat litry vody, jak rozmístit trysky a vše zautomatizovat.',
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
    await payload.update({
      collection: 'posts',
      id,
      data,
      draft: false,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Článek aktualizován a publikován (id ${id}) — /posts/${SLUG}`)
  } else {
    const created = await payload.create({
      collection: 'posts',
      data,
      draft: false,
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Článek vytvořen a publikován (id ${created.id}) — /posts/${SLUG}`)
  }

  process.exit(0)
}

await run()
