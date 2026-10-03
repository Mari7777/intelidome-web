/** Approved concise Czech article. Shared by the seed and the targeted local update. */
export const PROFILE_TITLE = 'Kalkulátor půdy pod trávník: kolik písku, zeminy a příměsí potřebujete'
export const PROFILE_META_TITLE = 'Kalkulátor půdy pod trávník: písek, zemina a příměsi'
export const PROFILE_META_DESCRIPTION = 'Spočítejte množství písku, zeminy, zeolitu, biocharu a Actina pro trávník. Podle plochy a hloubky zjistíte objemy, hmotnosti i materiál k objednání.'

type Node = { type: string; version: number; [key: string]: any }
type Document = { root: { type: string; children: Node[]; direction: 'ltr' | 'rtl' | null; format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''; indent: number; version: number; [key: string]: any }; [key: string]: any }
const txt = (text: string): Node => ({ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const p = (...parts: (string | Node)[]): Node => ({ type: 'paragraph', children: parts.map(v => typeof v === 'string' ? txt(v) : v), direction: 'ltr', format: '', indent: 0, textFormat: 0, version: 1 })
const h3 = (text: string): Node => ({ type: 'heading', tag: 'h3', children: [txt(text)], direction: 'ltr', format: '', indent: 0, version: 1 })
const link = (url: string, label: string): Node => ({ type: 'link', children: [txt(label)], direction: 'ltr', format: '', indent: 0, version: 2, fields: { linkType: 'custom', newTab: false, url } })
const block = (fields: Record<string, unknown>): Node => ({ type: 'block', fields, format: '', version: 2 })
const root = (children: Node[]): Document => ({ root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } })
const chapter = (number: number, title: string) => block({ blockType: 'chapter', blockName: `Kapitola ${number}`, eyebrow: `Kapitola ${String(number).padStart(2, '0')}`, title })
const faq = (question: string, answer: string) => ({ question, answer: root([p(answer)]) })
const soilGuide = '/magazin/krasny-travnik-zacina-pod-zemi-2#pisek-jil-nebo-hlina-prozradi-to-vase-dlan'

export function buildProfilePlanningContent(input: unknown): Document {
  const source = structuredClone(input) as Document
  const nodes = source?.root?.children
  if (!Array.isArray(nodes)) throw new Error('Expected existing profile article')
  const calculators = nodes.filter(n => n.fields?.blockType === 'calculator')
  if (calculators.length !== 1 || calculators[0].fields.kind !== 'pudni-profil') throw new Error('Expected exactly one soil profile calculator')
  const figure = nodes.find(n => n.fields?.blockType === 'figure')
  const settling = nodes.find(n => n.fields?.drawing === 'slehnuti-vstupu')
  if (!figure || !settling) throw new Error('Expected existing delivery photo and settling illustration')
  figure.fields.number = '02'
  figure.fields.blockName = 'Obr. 02'
  settling.fields.number = '01'
  figure.fields.caption = 'Objem vychází z plochy a hloubky. Hmotnost dodávky ověřte podle sypné hustoty materiálu u dodavatele.'
  settling.fields.title = 'Proč 30 m³ surovin nemusí dát 30 m³ slehlé směsi'
  settling.fields.body = 'Objemové podíly odměřujeme **před promícháním**. Jemnější částice mohou zapadnout mezi hrubší a při ukládání se mění póry. Součet vstupů proto nezaručuje stejný objem po slehnutí.\n\nVýpočet dává základ pro plánování dodávky. Skutečnou výšku kontrolujte při práci; rezervu zvolte podle materiálů a způsobu ukládání. V objednávce ji veďte odděleně, aby nezměnila zamýšlený poměr složek.'
  settling.fields.caption = 'Poměr stanovujeme z odměřených vstupů. Výšku po promíchání a slehnutí ověříme na zahradě.'

  return { ...source, root: { ...source.root, children: [
    block({ blockType: 'summaryBand', blockName: 'Od plochy k objednávce', lead: 'Kalkulátor půdy pod trávník převede plochu, hloubku a zvolené složení na množství písku, zeminy a příměsí. Ukáže, *co dovézt, co ponechat a co odvézt*. Pro objednávku přepočítá objemy na litry, kilogramy a tuny; hmotnosti závisí na hustotě skutečné dodávky.', tiles: [
      { value: '100', unit: 'm²', label: 'plocha hlavního příkladu' },
      { value: '30', unit: 'cm', label: 'modelová hloubka, kterou můžete změnit' },
      { value: '30', unit: 'm³', label: 'celý modelový profil včetně ponechané zeminy' },
      { value: '3', unit: 'režimy', label: 'podle práce s původní půdou a výškou' },
    ] }),
    p('Nejprve rozhodněte, co vaše půda potřebuje změnit. Výchozí předvolby slouží k porovnání možností, nejsou univerzálním doporučením pro každou zahradu. Účel surovin a rozsahy jejich podílů vysvětluje článek ', link('/magazin/pisek-biochar-a-dalsi-primesi', 'Písek, biochar a další příměsi: jak namíchat půdu pro trávník'), '.'),
    p('Pro vlastní výpočet zadejte plochu v m², hloubku profilu v cm a způsob úpravy terénu. U každé příměsi nastavte podíl i hloubku zapravení. Výsledky níže v článku ukazují jeden konkrétní příklad bez rezervy; kalkulátor je přepočítá podle vašich vstupů.'),
    calculators[0],
    chapter(1, 'Co zadat do kalkulátoru půdy pod trávník'),
    p('Plochu měřte jen tam, kde budete půdu skutečně upravovat. Odečtěte cesty, terasu a záhony. Má-li zahrada výrazně odlišné části, spočítejte je jednotlivě: stejná receptura nemusí dávat smysl u vlhkého jílovitého kouta a na rychle vysychajícím svahu. Objednávky pak sečtěte po materiálech.'),
    p('Hloubka profilu znamená tloušťku půdy, se kterou ve výpočtu pracujete. Výchozích 30 cm je model, nikoli pokyn celou zahradu tak hluboko vykopat. U Actina (dříve Biovin), zeolitu a biocharu zadáváte vlastní hloubku od povrchu: například 10 cm znamená zapravení do celé vrstvy 0–10 cm. Žádná příměs nemá sahat pod zvolený profil.'),
    p('Předvolba typu půdy nastaví výchozí poměry. Jakmile podíly upravíte, pracujete s vlastní recepturou. Zkontrolujte nejen procenta, ale i hloubky: stejný podíl ve dvakrát hlubší vrstvě znamená při stejné ploše dvojnásobné množství příměsi. Po změně vstupů proto znovu projděte celý výsledek.'),
    chapter(2, 'Udržet výšku, zapravit, nebo vytvořit novou vrstvu?'),
    p('Režim „Udržet výšku“ zvolte, pokud má povrch zůstat ve stejné úrovni. V modelu nejprve odeberete část zeminy a její objem nahradíte pískem a příměsmi. Výsledek rozlišuje zachovanou zeminu, dovážený materiál a zeminu k odvozu. Předpokládá, že ponechaná půda je pro směs použitelná.'),
    p('Režim „Zapravit“ počítá s ponecháním původní zeminy v celé zadané hloubce a s přidáním materiálů. Zadaná hloubka zde popisuje původní zeminu; výsledný profil bude vyšší. Hloubky příměsí se přitom měří od nového povrchu. Vyšší požadovaný podíl písku může znamenat překvapivě velký dovoz i nárůst výšky; zkontrolujte návaznost na terasu, chodníky a odtok vody. Nelze současně všechnu půdu ponechat, přivézt velký objem a očekávat stejnou výšku.'),
    p('Režim „Nová vrstva“ plánuje celý objem připravované vrstvy z dodaných složek, včetně zeminy. Použijte jej, když skutečně objednáváte novou směs. Samotná volba režimu nepotvrzuje vhodnost podloží ani neřeší jeho zhutnění a odvodnění. Nezapočítává automaticky případné odstranění starého terénu pod novou vrstvou.'),
    chapter(3, 'Jak se počítá objem půdy a jednotlivých příměsí'),
    p('Základní vztah je objem = plocha × hloubka v metrech. Pro 100 m² a 30 cm tedy počítáme 100 × 0,30 = 30 m³. Jeden kubík představuje 1 000 litrů. Praktická pomůcka: vrstva vysoká 1 cm na ploše 1 m² má objem 10 litrů.'),
    p('Podíl příměsi se vztahuje k objemu od povrchu do její vlastní hloubky. Například zeolit při 2 % do 15 cm na ploše 100 m²: 100 × 0,15 × 0,02 = 0,30 m³, tedy 300 litrů. Nepočítáme jej ze všech 30 m³ profilu. Také Actino a biochar mají svůj výpočet podle zadané hloubky.'),
    p('Příměsi zabírají část připravovaného objemu. Teprve zbývající minerální základ dělíme mezi písek a zeminu. Poměr 65/35 proto znamená 65 % písku a 35 % zeminy z tohoto zbytku, nikoli dalších 65 % písku nad celou směs. V horní části mohou být současně všechny tři příměsi, hlouběji už jen některé.'),
    settling,
    chapter(4, 'Příklad: kolik materiálu potřebujete pro 100 m² jílovité zahrady'),
    p('Uvažujme výraznou přestavbu, pro kterou jste po posouzení půdy zvolili písčitější směs. Nastavte 100 m², profil 30 cm, režim „Udržet výšku“ a nulovou rezervu. Minerální základ rozdělte 65/35 mezi písek a původní zeminu. Actino zaujímá 2,5 % do 10 cm, zeolit 2 % do 15 cm a předem živinami obohacený biochar 2 % do 10 cm. To odpovídá výchozí jílovité předvolbě.'),
    p('Příměsi zaberou 0,25 + 0,30 + 0,20 = 0,75 m³. Z původních 30 m³ zbývá 29,25 m³ minerálního základu. Jeho 65 % tvoří 19,0125 m³ písku a 35 % představuje 10,2375 m³ ponechané zeminy. Čísla v přehledu jsou zaokrouhlená; pro kontrolu součtu používejte nezaokrouhlené hodnoty.'),
    block({ blockType: 'table', blockName: 'Modelová objednávka pro 100 m²', heading: 'Jedna směs, tři různé úkoly: dovézt, ponechat, odvézt', surface: 'krem', width: 'edge', columns: [{ label: 'Materiál a jeho použití', align: 'left' }, { label: 'Čistý objem', align: 'right' }, { label: 'Množství pro plánování', align: 'right' }], rows: [
      ['Písek — dovézt', '19,0125 m³', '≈ 28,52 t'],
      ['Actino — dovézt', '0,25 m³ = 250 l', '150 kg'],
      ['Zeolit — dovézt', '0,30 m³ = 300 l', '240 kg'],
      ['Biochar — dovézt', '0,20 m³', '200 l'],
      ['Původní zemina — ponechat', '≈ 10,24 m³', 'Nekupovat'],
      ['Původní zemina — odvézt', '≈ 19,76 m³ v původním profilu', 'Ověřit objem po vytěžení'],
    ].map(cells => ({ cells: cells.map(value => ({ value })) })), note: 'Model bez rezervy. Použité sypné hustoty: písek 1,5 t/m³, Actino 0,6 kg/l a zeolit 0,8 kg/l. Hmotnosti ověřte u dodavatele. Odvoz není další složkou výsledné směsi.' }),
    p('Celých 30 m³ tedy neobjednáváte. Přibližně 10,24 m³ vhodné původní zeminy zůstává na místě a dovoz ji doplní. Objem odvozu popisuje odebranou půdu v původním profilu; po nakypření může na korbě zabrat jiné místo. Ani jílovitá půda sama o sobě neznamená, že je tato rozsáhlá přestavba nutná.'),
    h3('Těžší hlinitá zahrada: menší podíl písku'),
    p('U těžší hlinité zahrady s udržovanou ornicí vychází model z poměru písku a zeminy 30/70 v minerálním základu. Výchozí varianta Actino nepřidává; ostatní podíly přizpůsobte potřebám půdy. Pokud půda dobře přijímá vodu a kořeny jí prorůstají, nevyplývá z předvolby povinnost ji přestavovat. Než tento model použijete, ověřte, zda odpovídá vaší zahradě. Rozpoznáním půdy vás provede článek ', link(soilGuide, 'Krásný trávník začíná pod zemí'), '.'),
    h3('Písčitá zahrada: bez dalšího písku'),
    p('U chudé, rychle vysychající písčité zahrady model další písek nepřidává. Pozornost směřuje k zadržení vody a živin pomocí vhodně zvolených příměsí. Nestačí však jen zvýšit jejich procenta: zohledněte současnou organickou hmotu, hloubku úpravy i konkrétní materiál. Vyšší dávka není automaticky lepší a dvě písčité zahrady nemusí potřebovat stejnou směs. Jak písčitou půdu poznat a co sledovat, vysvětluje článek ', link(soilGuide, 'Krásný trávník začíná pod zemí'), '.'),
    chapter(5, 'Od kubíků k tunám, litrům a balením'),
    figure,
    p('Objem určuje poměr směsi, prodejní jednotka určuje objednávku. Převod na hmotnost používá sypnou hustotu, tedy hmotnost volně nasypaného materiálu včetně mezer mezi částicemi. Platí hmotnost = objem × sypná hustota. V našem příkladu tak 19,0125 m³ písku při 1,5 t/m³ představuje přibližně 28,52 t.'),
    p('Písek běžně plánujeme v tunách, Actino a zeolit v kilogramech, biochar v litrech. Konkrétní balení ověřte u výrobku. Pokud například zvolený zeolit koupíte v pytlích po 20 kg, potřebných 240 kg znamená 12 pytlů. Neúplný počet balení zaokrouhlete nahoru; přebytek není pokyn automaticky zvýšit dávku ve směsi.'),
    p('Vlhkost, zrnitost a složení výrobku mohou převod změnit. U biocharu je modelových 0,2 kg/l pouze výpočetní předpoklad; stejných 200 litrů navlhčeného nebo obohaceného výrobku může vážit jinak. Ověřte také, zda kupujete samotný biochar, nebo směs s kompostem. Kompost a jiné pevné nosiče mají vlastní objem, který je třeba do receptury započítat zvlášť. Kalkulátor složení takového výrobku sám nerozpozná.'),
    p('Rezerva navyšuje jen dovážené množství a nemění čistý poměr směsi, ponechanou zeminu ani odvoz. Kalkulátor používá vztah objednávka = čisté množství ÷ (1 − rezerva/100). Při 10 % tedy 200 litrů vyžaduje přibližně 222 litrů k objednání. Tato volba není prosté přičtení 10 %; umožňuje pokrýt uvažovaný úbytek z dodaného množství.'),
    p('Cenu zadávejte v jednotkách uvedených u příslušného pole a podle skutečné nabídky. Orientační součet materiálů není rozpočtem celé realizace: zvlášť připočtěte dopravu, vykládku, odvoz a uložení zeminy i práci. Mykorhizní přípravek a případné startovací hnojení řešte podle výrobku a receptury. Při hnojení zohledněte také živiny dodané Actinem a kompostem; plné dávky těchto vstupů nekombinujte automaticky.'),
    p('Po naplánování dodávky pokračujte návodem ', link('/magazin/jak-pripravit-a-ulozit-smes', 'Jak připravit a uložit směs'), '. Navazuje promícháním, kontrolou slehnutí, výsevem a první péčí o trávník.'),
    block({ blockType: 'faq', blockName: 'Časté otázky k výpočtu půdy', heading: 'Časté otázky k výpočtu půdy pod trávník', lead: 'Před objednávkou zkontrolujte režim, jednotky a předpoklady, které mají na množství největší vliv.', items: [
      faq('Musím koupit zeminu uvedenou ve výsledku?', 'Záleží na režimu. Při udržení výšky a zapravení jde o využitou původní zeminu, pokud je vhodná. V režimu nové vrstvy kalkulátor počítá s jejím dovozem. Rozlišujte proto ponechání, dovoz a odvoz, ne jen celkový objem profilu.'),
      faq('Musí být půda pod trávníkem hluboká právě 30 cm?', 'Ne. Třicet centimetrů je hloubka zdejšího modelu. Do kalkulátoru zadejte skutečně navrženou hloubku úpravy podle stavu zahrady a podloží. Výchozí číslo nenahrazuje posouzení půdy ani automaticky neurčuje hloubku výkopu.'),
      faq('Proč se vypočtené kilogramy mohou lišit od dodávky?', 'Hmotnost závisí na zadané sypné hustotě a skutečné vlhkosti i složení materiálu. Čísla v článku jsou modelová. Před objednávkou potvrďte údaje u dodavatele a upravte je v kalkulátoru; objemový poměr směsi přitom zůstává výchozím zadáním.'),
      faq('Mám vždy přidat deset procent na slehnutí?', 'Ne. Univerzální rezerva pro všechny směsi neexistuje. Zvolte ji podle konkrétních materiálů a práce, oddělte ji od čisté receptury a ověřujte skutečnou výšku. Kalkulátor rezervou nezjišťuje, o kolik právě vaše směs slehne.'),
    ] }),
    p('Na přípravu půdy navazuje plán závlahy. Sledování vlhkosti v kořenové vrstvě pomůže přizpůsobit péči tomu, jak hotová směs vodu přijímá a zadržuje; tuto návaznost rozvíjí ', link('/', 'InteliDome'), '.'),
  ] } }
}
