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

type Node = Record<string, unknown>

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

/* ── Obsah článku ───────────────────────────────────────────────── */

const SLUG = 'jak-navrhnout-automatickou-zavlahu'

const body = root([
  p(
    'Základem spolehlivé automatické závlahy je pochopení toho, co váš trávník skutečně potřebuje, a přesné změření dynamického tlaku zdroje. Jakmile znáte kapacitu vody, musíte dodržet stoprocentní překrytí trysek — pravidlo „hlava na hlavu". Protože samotné sčítání vylitých litrů na povrch nestačí, chytré řízení propojí závlahu přímo s čidly vlhkosti a retenční nádrží. Tento přístup dodá rostlinám vláhu přesně tehdy, kdy to jejich kořeny opravdu potřebují, čímž maximalizuje úsporu vody i kondici celé zahrady.',
  ),

  block({
    blockType: 'statTiles',
    blockName: 'Čísla návrhu',
    tiles: [
      { value: '10–15', unit: 'l/m²', label: 'orientační dávka na jednu zálivku' },
      { value: '3', unit: 'dny', label: 'obvyklý interval v teplém období' },
      { value: '25', unit: 'l/min', label: 'průtok potřebný pro běžný systém' },
      { value: '2,8', unit: 'baru', label: 'tlak přímo na hlavici rotační trysky' },
    ],
  }),

  block({
    blockType: 'chapter',
    blockName: 'Kapitola 01',
    eyebrow: 'Kapitola 01',
    title: 'Jak funguje krevní oběh vaší zahrady?',
  }),
  p(
    'Zahrada je fascinující živý organismus a voda představuje její krevní oběh. Obecně se doporučuje dodat trávníku ',
    ['10 až 15 litrů vody na metr čtvereční každé tři dny', BOLD],
    ', ale reálná potřeba vždy závisí na aktuálních podmínkách. Roli hraje teplota vzduchu, konkrétní druh trávy i celková kondice vašeho zeleného koberce. Zdravý trávník s hlubokými kořeny totiž s přehledem přežije i ta největší vedra s překvapivě malým množstvím vláhy.',
  ),
  p(
    'Mladý trávník bez vyspělých kořenů naopak potřebuje první roky mnohem pečlivější přístup a opečovávaná tráva je z dlouhodobého hlediska daleko odolnější. Množství vody, které na trávník jednoduše vylijeme, nám ale bohužel neřekne vůbec nic o tom, jaká je skutečná vlhkost uvnitř půdy. Proto dává mnohem větší smysl ',
    ['měřit přímo půdní vlhkost, než jen slepě počítat objem dopadající vody', BOLD],
    '. Pokud tento základní přírodní princip nerespektujeme a závlahu nenavrhneme správně, nepomohou nám k dokonalé zahradě ani ty nejdražší komponenty.',
  ),

  block({
    blockType: 'chapter',
    blockName: 'Kapitola 02',
    eyebrow: 'Kapitola 02',
    title: 'Jak změřit skutečnou sílu vašeho vodního zdroje?',
  }),
  p(
    'Nejčastější a bohužel nejfatálnější chybou je pouhý odhad síly vašeho vodního zdroje. Závlahové systémy totiž zajímá pouze to, jak se voda chová ve chvíli, kdy skutečně proudí potrubím. Pro běžné systémy potřebujete zajistit ',
    ['průtok alespoň 25 litrů za minutu při tlaku 3 bary', BOLD],
    '. Tyto přesné hodnoty zjistíte pomocí takzvaného kbelíkového testu, který zvládne každý zručný majitel zahrady.',
  ),
  p(
    'Pro přesné měření budete potřebovat tlakoměr (manometr), stopky a objemnou nádobu, ideálně desetilitrový kbelík. Tlakoměr připojte přímo k vašemu zdroji vody a velmi pomalu otevírejte ventil. Otevírání zastavte v přesný moment, kdy ručička tlaku klesne a ustálí se na hodnotě 3,5 baru. Tím nasimulujete ideální podmínky pro budoucí zavlažovací systém.',
  ),
  p(
    'Následně vložte pod vytékající proud vody kbelík a pečlivě stopněte čas, za který se naplní po okraj. Z naměřených vteřin a objemu snadno vypočítáte váš reálný minutový průtok. Nezapomeňte ale z tohoto výsledku vždy odečíst 20 %. Tato nezbytná bezpečnostní rezerva pokryje přirozené ztráty na potrubí i nevyhnutelné stárnutí čerpadla.',
  ),

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

  block({
    blockType: 'chapter',
    blockName: 'Kapitola 03',
    eyebrow: 'Kapitola 03',
    title: 'Proč se postřikovače musí vzájemně překrývat?',
  }),
  p(
    'Základní vlastností každého postřikovače je, že vodu nerozstřikuje rovnoměrně po celé ploše svého dostřiku. Největší množství kapek dopadá do jeho bezprostředního okolí a s rostoucí vzdáleností intenzita zálivky klesá. Abychom dosáhli naprosto rovnoměrného pokrytí trávníku, musí voda z jednoho postřikovače ',
    ['dostříknout přesně na tělo toho sousedního', BOLD],
    '.',
  ),
  p(
    'Tomuto nekompromisnímu pravidlu se v inženýrské praxi říká „hlava na hlavu". Jakmile se pokusíte ušetřit a postřikovače od sebe oddálíte, vytvoříte hluchá místa s nedostatkem vláhy. V horkých letních měsících se pak na trávníku velmi rychle objeví suché a nažloutlé pruhy. Ke správnému vsakování do hlubších vrstev půdy doporučujeme používat moderní paprskové trysky, které vodu dávkují pomalu a šetrně.',
  ),

  block({
    blockType: 'chapter',
    blockName: 'Kapitola 04',
    eyebrow: 'Kapitola 04',
    title: 'Jak závlahu chytře řídit a neplýtvat?',
  }),
  p(
    'Když už máte postřikovače rozmístěné a propojené hadicemi pod povrchem, přichází na řadu elektronický mozek celé zahrady. Obyčejné časovače spustí vodu klidně i během vydatného deště nebo ve chvíli, kdy má půda vody stále dostatek. Zde vstupuje do hry systém ',
    ['InteliDome', BOLD],
    ', který obyčejnou síť trubek promění ve vnímavý a ohleduplný organismus. Náš systém ovládá sektory primárně na základě aktuální vlhkosti a dokáže zohlednit, zda na trávník zrovna svítí slunce, nebo leží ve stínu.',
  ),
  p(
    'Využíváme přesná čidla vlhkosti (senzory půdní vlhkosti), díky kterým systém pozná, kdy mají kořeny rostlin opravdu žízeň. InteliDome navíc dokáže logicky řídit spínače, takže přednostně odčerpává dešťovou vodu z vaší retenční nádrže dříve, než sáhnete po placené vodě z řadu. Spolu se závlahou pak snadno zautomatizujete i večerní zahradní osvětlení, takže získáte plnou kontrolu nad celou zahradou pohodlně z jednoho místa.',
  ),

  block({
    blockType: 'chapter',
    blockName: 'Závěr',
    eyebrow: 'Co dál',
    title: 'Zahrada, která si sama řekne o vodu',
  }),
  p(
    'Chcete mít jistotu, že vaše zahrada dostane přesně to, co potřebuje, a zároveň nebudete plýtvat vodou ani energií? Objevte, jak dokáže systém InteliDome propojit chytrou závlahu závislou na skutečné vlhkosti půdy, vaši retenční nádrž i venkovní osvětlení do jednoho spolehlivě fungujícího celku.',
  ),
  p(
    'A otázka na závěr: máte už představu, jak hluboké kořeny má váš trávník, nebo zálivku zatím řídíte jen odhadem?',
  ),

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
])

/* ── Zápis ──────────────────────────────────────────────────────── */

const run = async () => {
  const payload = await getPayload({ config })

  const data = {
    title: 'Jak navrhnout automatickou závlahu: průvodce krok za krokem',
    slug: SLUG,
    _status: 'draft' as const,
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
    await payload.update({ collection: 'posts', id, data, draft: true })
    payload.logger.info(`Článek aktualizován jako koncept (id ${id}) — /posts/${SLUG}`)
  } else {
    const created = await payload.create({ collection: 'posts', data, draft: true })
    payload.logger.info(`Článek vytvořen jako koncept (id ${created.id}) — /posts/${SLUG}`)
  }

  process.exit(0)
}

await run()
