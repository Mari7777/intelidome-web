import { block, cloneDocument, paragraph, renumberFigures, setFaq } from './lawn-series-helpers'

const HANDOFF_TITLE = 'Od poznání půdy k přípravě směsi'
const OLD_CHAPTER = 'Půdní alchymie: biochar, Actino, zeolit a správné počty'
const CONCLUSION_TITLE = 'Proč se to všechno nakonec vyplatí?'
const AMENDMENTS = '/magazin/pisek-biochar-a-dalsi-primesi'
const CALCULATOR = '/magazin/kalkulator-na-planovani-pudniho-profilu'
const PREPARATION = '/magazin/jak-pripravit-a-ulozit-smes'

const checklist = (items: string[]) => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr',
  children: items.map((markdown, index) => ({
    type: 'listitem',
    value: index + 1,
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: paragraph(markdown).children,
  })),
})

/** Keep this article about diagnosis; hand detailed recipes and execution to the series. */
export function reviseSoilGuide(input: unknown): any {
  const doc = cloneDocument(input)
  const nodes = doc.root.children
  const oldStart = nodes.findIndex((node: any) => node.fields?.title === OLD_CHAPTER)
  const revisedStart = nodes.findIndex((node: any) => node.fields?.title === HANDOFF_TITLE)

  if (oldStart >= 0) {
    if (revisedStart >= 0) throw new Error('Soil guide contains both old and revised handoff chapters')
    const conclusion = nodes.findIndex((node: any) => node.fields?.title === CONCLUSION_TITLE)
    if (conclusion <= oldStart) throw new Error('Soil guide conclusion boundary not found')
    const removed = nodes.slice(oldStart, conclusion)
    if (!removed.some((node: any) => node.fields?.blockType === 'calculator' && node.fields?.kind === 'primesi')) {
      throw new Error('Expected duplicate amendment calculator in the soil guide')
    }
    nodes.splice(
      oldStart,
      conclusion - oldStart,
      block({
        blockType: 'chapter',
        blockName: 'Kapitola 05',
        eyebrow: 'Kapitola 05',
        title: HANDOFF_TITLE,
      }),
      paragraph(
        `Teď už můžete rozhodnout, co zahrada potřebuje. Při pomalém vsakování nejprve odstraňte příčinu a zkoušku zopakujte. Teprve potom vybírejte [poměry písku a příměsí pro svůj typ půdy](${AMENDMENTS}#tri-zahrady-jake-pomery-pro-ne-zvolit). Dobrou ornici zachovejte; samotný nákup substrátu překážku pod ní neodstraní.`,
      ),
      paragraph(
        `Plochu, plánovanou hloubku a zvolené podíly zadejte do [kalkulátoru půdního profilu](${CALCULATOR}). Ukáže množství materiálů i rozdíl mezi zachováním výšky, zapravením a novou vrstvou. Převod objemu na kilogramy a balení vysvětluje [průvodce objednávkou](${CALCULATOR}#od-kubiku-k-tunam-litrum-a-balenim).`,
      ),
      paragraph('Před prací si zkontrolujte těchto pět bodů:'),
      checklist([
        '**Výška a ornice.** Určete návaznost na chodníky a terasy i odtok vody. Při rekonstrukci oddělte použitelnou ornici od suti a nevhodné navážky.',
        '**Vlhkost a zhutnění.** Pracujte, když se zemina po zmáčknutí drží, ale jde rozdrobit. Mazlavou půdu nechte oschnout. Překážku rozrušte v její skutečné hloubce a upravenou plochu chraňte před přejezdy.',
        '**Potrubí včas.** Případnou drenáž s funkčním odtokem a potrubí závlahy uložte ještě do otevřené země, před dokončením profilu.',
        `**Míchejte postupně mělčeji.** Nejprve promíchejte zeminu s potřebným pískem v celé plánované hloubce, potom zapravujte příměsi do jejich mělčích zón. Nevytvářejte samostatná patra. Praktické hloubky a nářadí najdete v [postupu přípravy směsi](${PREPARATION}#nejprve-promichat-mineralni-zaklad-potom-primesi-melceji).`,
        `**Dejte půdě čas.** Před výsevem ji zavlažte, nechte ustálit a opravte propadliny. Podrobnosti popisuje [slehnutí a finální příprava povrchu](${PREPARATION}#cas-na-slehnuti-neni-prazdne-cekani).`,
      ]),
    )
  } else if (revisedStart < 0) {
    throw new Error('Soil guide chapter to revise not found')
  }

  setFaq(
    doc,
    'Jak poznám, jestli mám jíl, hlínu, nebo písek?',
    'Navlhčete oddělené vzorky alespoň ze tří míst a zkuste uválet kuličku a váleček. Jíl je hladký, lepí a váleček se ohne. Hlína se drobí a váleček praská. Písek drhne a kulička se rozpadá. Zemina má být vlhká, bez vytékající vody.',
  )
  setFaq(
    doc,
    'Co je zkouška vsakování a jaký výsledek je dobrý?',
    'V jámě hluboké 30 cm nechte první náplň vody vsáknout. Po druhém naplnění změřte pokles za 15 minut a vynásobte jej čtyřmi. Orientačně vyhovuje 2,5–7,5 cm/h. Pod 2,5 cm/h hledejte příčinu pomalého odtoku; nad 10 cm/h prověřte schopnost půdy udržet vláhu. Stojí-li voda i druhý den, nejprve řešte zamokření.',
  )
  setFaq(
    doc,
    'Proč zrovna 30 centimetrů, když má tráva mělké kořeny?',
    'Souvislý, provzdušněný prostor dává kořenům přístup k zásobě vláhy i pod rychle vysychajícím povrchem. Pod 1 m² znamená 30 cm hloubky 300 litrů půdy. Je to praktický cíl přípravy, nikoli zaručená hloubka všech kořenů.',
  )
  setFaq(
    doc,
    'Musím vybagrovat 30 cm zeminy a koupit novou?',
    'Většinou ne. Fungující půdu zachovejte a opravte místní nedostatky. Pod dobrou ornicí rozrušte zhutněnou překážku; nevhodnou navážku nebo stavební suť odstraňte. Rozsah zásahu určete podle sondy a vsakování, ne pouze podle požadované hloubky.',
  )
  setFaq(
    doc,
    'Jak spočítám, kolik příměsi (třeba zeolitu) koupit?',
    `Podíl určujte z objemu půdy do zvolené hloubky. Potřebné litry potom převeďte na hmotnost podle sypné hustoty dodávky. [Kalkulátor půdního profilu](${CALCULATOR}) vypočítá obojí pro vaši plochu a nabídne i převod na balení.`,
  )
  renumberFigures(doc)
  return doc
}
