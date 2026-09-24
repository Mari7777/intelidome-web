/**
 * Rytmus obraz/text článku „Písek, biochar a další příměsi" (2026-09-24).
 *
 * Stejná přestavba jako u článků o přípravě a s kalkulátorem (DESIGN.md
 * 8.2b p. 8): každý úsek textu vedle vlastního obrazu, kapitola = eyebrow
 * + H2 uvnitř splitu, strany se střídají bez výjimky (otevřený panel karet
 * složek nese fotku vpravo). Karty složek a obě tabulky zůstávají jako
 * moduly; tip o betonářském písku stojí od kola 01 poroty jako rámeček
 * v těle oddílu o praném písku (řádek „> "), ne na ose. Plán vybrala porota tří návrhů, syntéza a nezávislá kontrola;
 * texty jsou autorovy odstavce rozdělené jen na hranicích vět (15/15
 * nadpisů), nové jsou jen popisky a alty. Vygenerováno z ověřeného plánu —
 * text needitovat ručně.
 */
import type { RhythmSection } from './preparation-rhythm-content'

export const PRIMESI_RHYTHM_SECTIONS: RhythmSection[] = [
  {
    "id": "A1",
    "side": "image-left",
    "surface": "bila",
    "eyebrow": "Kapitola 01",
    "title": "Z čeho půdu skládáme a co která složka umí",
    "titleLevel": "h2",
    "drawing": "dve-zahrady",
    "alt": "Kresba s titulkem „Stejné složky, jiný úkol“ staví vedle sebe dva stejně velké řezy, jílovitou a písčitou zahradu. Vlevo je písek hustě protkaný tečkami původní zeminy s několika kousky biocharu, Actina a zeolitu; středem vede svislá čárkovaná cesta, po níž kapka vody míří dolů k šipce pod polem, a popisek zní „písek otevře cestu vodě“. Vpravo je samotný písek bez teček zeminy, hustěji posetý biocharem, Actinem a zeolitem; kapka tu stojí mezi střípkem biocharu a zrnem zeolitu a popisek zní „biochar a zeolit podrží část vody“. Legenda dole vysvětluje značky písku, původní zeminy, biocharu, Actina, zeolitu a vody.",
    "caption": "Vlevo jíl (tečky původní zeminy) s přimíchaným pískem, příměsí málo: čárkovaná linka se šipkou ukazuje, kudy voda odchází dolů. Vpravo samotný písek, příměsí víc: kapka zůstává mezi zrny.",
    "body": [
      "V tomto článku si představíme jednotlivé složky a vysvětlíme, co mohou v půdě změnit. Podíváme se, proč o směsi rozhoduje objem, přestože dodávka přijíždí v tunách, a jak příměsi rozmístit v kořenové vrstvě. Na třech modelových zahradách ukážeme vhodné rozsahy dávek.",
      "Výpočet materiálu pro vlastní plochu najdete v článku [Kalkulátor na plánování půdního profilu](/posts/kalkulator-na-planovani-pudniho-profilu); práci s připravenou směsí popisuje návod [Jak připravit a uložit směs](/posts/jak-pripravit-a-ulozit-smes).",
      "Představme si dvě sousední zahrady po stejném dešti. Na první se zemina lepí na boty a voda dlouho neodchází. Na druhé se po chvíli dá pohodlně chodit, jenže o několik suchých dnů později už tráva začíná strádat. Oběma zahradám chceme pomoci. Kdybychom ale na obě navezli stejnou směs ve stejném poměru, řešili bychom dva různé problémy jednou odpovědí."
    ]
  },
  {
    "id": "A2",
    "side": "image-right",
    "surface": "bila",
    "continues": true,
    "photo": "fig-primesi-deska-45.avif",
    "photoRatio": "4:5",
    "alt": "Dřevěná míchací deska na udusané zemi: vlevo hromádka tmavé prosáté zeminy, vpravo světlý písek, přes který už vede pruh zeminy. Za deskou rozostřený trávník v teplém večerním světle.",
    "caption": "Písek a původní zemina na míchací desce. Co z nich vznikne, rozhodne, kolik písku přijde a do jaké půdy.",
    "body": [
      "Zajímavé je, že materiály mohou být v obou případech stejné: písek, původní zemina, biochar, Actino (dříve Biovin) a zeolit. Mění se jejich úloha i množství.",
      "Jílovité půdě potřebujeme otevřít cestu pro vzduch a přebytečnou vodu. Chudému písku naopak pomoci, aby část vody a živin u kořenů zůstala déle. A dobře fungující hlíně někdy prospějeme nejvíc tím, že do ní zbytečně nepřidáme další materiál.",
      "Cílem je porozumět tomu, co má směs dělat. Přesná čísla ve výpočtu nám mají pomoci udržet zamýšlené poměry; při práci s navážkou se z nich nestává požadavek na vážení každého kilogramu.",
      "### Písek a zemina: o výsledku rozhodují i mezery",
      "Písek působí jako nejprostší položka celé objednávky. Žádné složité jméno, žádný příslib biologického zázraku. Jen zrnka. Přesto právě jeho výběr a množství mohou rozhodnout o tom, zda směs získá vlastnosti, které od ní čekáme.",
      "Písek je důležitý pro provzdušnění půdy: ve vhodném množství a zrnitosti pomáhá kyslíku pronikat ke kořenům. Musíme ale dávat pozor, kolik ho přimícháme a do jaké půdy. U písčité půdy by další písek znamenal zbytečné plýtvání penězi. Naopak malé množství písku přidané do jílovité půdy může směs ještě více zahustit, a zdravému růstu trávy tak dokonce uškodit."
    ]
  },
  {
    "id": "A3",
    "side": "image-left",
    "surface": "bila",
    "continues": true,
    "drawing": "prany-pisek",
    "alt": "Kresba s titulkem „Rozhodují mezery“ staví vedle sebe dva stejně uložené trsy pískových zrn. Vlevo nepraný písek: mezery mezi zrny vyplňují tečky prachu a jílu, kapka vody zůstává nad trsem a popisek říká, že prach a jíl vyplní mezery, voda hůř projde a vzduchu je méně. Vpravo praný písek s volnými mezerami: čárkovaná cesta vody sestupuje shora a klikatí se mezi zrny, kapka leží v póru na ní a pod trsem cesta končí šipkou dolů; popisek říká, že voda projde a vzduch se vrátí ke kořenům. Legenda vysvětluje značky zrna písku, prachu a jílu a vody; pod ní stojí „Praním jemných částic ubývá“.",
    "caption": "Vlevo nepraný, vpravo praný písek se stejně uloženými zrny; liší se jen tím, co vězí v mezerách. Čárkovaná linka se šipkou dolů značí cestu, kudy voda odtéká.",
    "body": [
      "V následujících příkladech používáme **praný křemičitý písek s převahou zrn přibližně 0,25–1 mm**. Každá část tohoto označení má svůj důvod: praní omezuje nežádoucí jemné příměsi, křemen poskytuje odolná zrna a vhodná zrnitost pomáhá vytvářet prostředí pro pohyb vody a vzduchu.",
      "**Proč praný?** Písek může obsahovat také prachové a jílovité částice. Ty jsou mnohem menší než samotná písková zrna a mohou vyplňovat mezery mezi nimi.",
      "Vysoký podíl jemných příměsí může omezit propustnost výsledné směsi a po odtoku vody v ní ponechat méně prostoru pro vzduch. Praním se jejich obsah snižuje. Do půdy tak nepřivážíme spolu s pískem zbytečně další jíl a prach, když právě jejich nadbytek potřebujeme řešit.",
      "**Proč křemičitý? **Křemen je tvrdý a vůči běžnému půdnímu prostředí chemicky odolný minerál. Jeho zrna se snadno nerozpadají a mohou dlouhodobě tvořit stabilní minerální kostru směsi.",
      "> **Poznámka k nákupu: **U betonářského písku se často výslovně nepíše, že je praný, přestože praný bývá — při jeho přípravě se běžně odstraňují jílovité a další nežádoucí jemné příměsi kvůli použití v betonu. Pokud tedy u betonářského písku není výslovně uvedeno, že je nepraný, většinou bývá praný; pro jistotu je dobré ověřit si tuto skutečnost u dodavatele.",
      "Původní zemina mezitím dodává to, co samotnému písku chybí. Obsahuje jemnější částice, organickou hmotu a povrchy, na kterých se mohou zadržovat voda i některé živiny."
    ]
  },
  {
    "id": "A4",
    "side": "image-left",
    "surface": "bila",
    "title": "Co koupit a jak biochar připravit",
    "titleLevel": "h3",
    "drawing": "nabity-biochar",
    "alt": "Kresba s nadpisem „Nabít předem“ ukazuje dvě tmavá zrna biocharu vedle sebe. Vlevo je nenabité zrno s prázdnými póry, do kterého míří šipky od tří volných živin z okolí, s popiskem „živiny si z půdy nejdřív bere“; vpravo zrno nabité kompostem s živinami v pórech, z něhož vedou dvě šipky k hnědému pruhu půdy s kořenem, s popiskem „živiny kořenům postupně dává“. Legenda vysvětluje tečku jako živiny a hnědé políčko se světlou linkou jako kořen, poznámka dole zní „Samotná voda nenabije — biochar jen navlhčí“.",
    "caption": "Čtěte směr šipek: vlevo míří živiny z okolní půdy do nenabitého zrna s prázdnými póry, vpravo vycházejí z nabitého zrna ke kořeni.",
    "body": [
      "**Nejjednodušší je koupit biochar určený k použití v půdě, již obohacený živinami a připravený k zapravení.** V popisu nebo u dodavatele si ověříme právě tyto dvě věci: že je určený pro půdu a že už proběhlo jeho obohacení. Toto obohacení se často označuje jako „nabití“. Samotné navlhčení vodou ho nenahrazuje.",
      "Důvod je jednoduchý: **nenabitý biochar může zpočátku živiny z okolní půdy spíš odebírat, než ji o ně obohacovat.** Představme si ho jako prázdnou zásobárnu, která se teprve plní. Zachytí část živin z půdy, a tráva jich tak může mít dočasně méně k dispozici.",
      "Také mikroorganismy, které rozkládají snadno rozložitelné zbytky uhlíku v biocharu, mohou pro svou činnost dočasně spotřebovat část dostupného dusíku. Proto biochar před zapravením do půdy „nabijeme“ — tedy **předem obohatíme živinami, například přípravou s vlhkým kompostem**.",
      "Voda pomáhá živinám proniknout do jeho drobných pórů a část se zachytí na jeho povrchu. Kompost zároveň pomáhá biochar osídlit mikroorganismy. Samotná čistá voda ale nestačí: biochar navlhčí, nikoli vyživí.",
      "Ještě jedna otázka při nákupu ušetří chybu v množství: **kolik samotného biocharu dodávka obsahuje?** Naše recepty počítají s objemem biocharu, nikoli celé směsi s kompostem.",
      "Kompost dodaný spolu s ním nebo použitý při domácím nabíjení proto započítáme zvlášť, stejně jako přinesené živiny při plánování hnojení. Přesný postup najdete v navazujícím článku [Kalkulátor půdy pod trávník: kolik písku, zeminy a příměsí potřebujete](/posts/kalkulator-na-planovani-pudniho-profilu)."
    ]
  },
  {
    "id": "B1",
    "side": "image-right",
    "surface": "krem",
    "eyebrow": "Kapitola 02",
    "title": "Proč směs mícháme podle objemu, ne podle tun",
    "titleLevel": "h2",
    "drawing": "tuna-neni-kubik",
    "alt": "Vodorovné pruhy na společné stupnici 1 až 5 m³ ukazují, kolik místa zabere jedna tuna materiálu při modelové sypné hustotě (u zeolitu 0,80 a u Actina 0,60 t/m³ podle kalkulátoru): písek 0,67 m³, zemina 0,71 m³, zeolit 1,25 m³, Actino 1,67 m³ a biochar celých 5 m³ přes celou stupnici. Dole poznámka: objemem se určuje poměr směsi, hmotností objednávka a doprava.",
    "caption": "Délka pruhu je objem jedné tuny, čárkované linky značí celé kubíky. Zeolit a Actino kresba počítá s modelovými 0,80 a 0,60 t/m³ z kalkulátoru půdního profilu.",
    "body": [
      "Dodavatel pracuje s tunami, kubíky a počty balení. Kdo připravuje půdu, musí oba pohledy propojit. **Stejný objem neznamená stejnou hmotnost a stejná hmotnost neznamená stejný objem.** Proto nelze objemový recept jednoduše změnit na stejné poměry tun.",
      "Pro názorné srovnání vezměme pouze modelové hodnoty: písek o sypné hustotě 1,5 t/m³ a zeminu o sypné hustotě 1,4 t/m³. **Sypná hustota** vyjadřuje, kolik váží určitý objem volně nasypaného materiálu, včetně mezer mezi jeho částicemi.",
      "Při těchto předpokladech zabere **tuna písku přibližně 0,67 m³**, zatímco **tuna zeminy přibližně 0,71 m³**. Rozdíl není obrovský, ale při dodávce desítek tun už se projeví. U lehkého biocharu se sypnou hustotou 0,20 t/m³ je rozdíl ještě výraznější: **jedna tuna představuje asi 5 m³**. Tytéž tuny tedy mohou v připravované směsi obsadit velmi rozdílné místo."
    ]
  },
  {
    "id": "B2",
    "side": "image-left",
    "surface": "bila",
    "title": "Tuna písku není stejný kus prostoru jako tuna hlíny",
    "titleLevel": "h3",
    "drawing": "co-recept-snese",
    "alt": "Kresba s titulkem „Zaokrouhlit ano, zaměnit ne“ porovnává ve třech řádcích plán vlevo a skutečnost vpravo; jeden čtvereček je plánované množství a legenda přiřazuje okrovou barvu písku, světle šedou zeolitu a černou biocharu. Hmotnost kolísá: čtvereček písku je ve skutečnosti týž, jen v čárkovaném rámečku s popiskem „vlhkost ± pár kg“, verdikt „≈ tentýž recept“. Dvě, nebo osm procent zeolitu: jeden čtvereček u 2 % proti čtyřem u 8 %, verdikt „≠ jiný recept“. Objem, nebo tuny: jeden čtvereček biocharu u ½ m³ proti řadě u ½ t, která pokračuje za okraj kresby, verdikt „≠ jiný recept“.",
    "caption": "Vlevo plán, vpravo skutečnost. Čárkovaný rámeček kolem písku je tolerance, ve které recept platí dál; čtyři čtverečky zeolitu nebo řada biocharu až za okraj už dávají jiný recept.",
    "body": [
      "Tyto hodnoty slouží k vysvětlení principu. Skutečná zemina může mít jinou hustotu než náš model a hmotnost všech materiálů ovlivňuje i jejich vlhkost. Rozhodující údaj pro objednávku proto později převezmeme od dodavatele pro materiál v dodávaném stavu.",
      "**Objemem určujeme poměr složek. Hmotností plánujeme objednávku, dopravu a manipulaci.** Minerální základ složený ze 65 % písku a 35 % zeminy objemově tedy neznamená automaticky 65 tun písku a 35 tun zeminy. Čím rozdílnější jsou sypné hustoty, tím větší chyba by při takové záměně vznikla.",
      "### Dobrý poměr je důležitější než zdánlivě přesné kilogramy",
      "Příprava půdy pro zahradu není laboratorní vážení. Vlhkost dodávek, jejich nakypření i následné slehnutí se mění. Nemá smysl předstírat, že rozdíl několika kilogramů v mnohatunové dodávce rozhoduje o budoucím trávníku. Důležité je přiblížit se zvoleným objemovým podílům a směs rovnoměrně promíchat.",
      "To však neznamená, že lze recepturu libovolně zaměnit. Dvě a osm procent zeolitu představují jiné návrhy, stejně jako půl kubíku biocharu a půl tuny biocharu. Praktické zaokrouhlení má odpovídat rozsahu práce; nemá z několika procent udělat násobně větší podíl. U koncentrovaných přípravků a osiva navíc dál platí dávkování konkrétního výrobku.",
      "Než z těchto poměrů uděláme objednávku, potřebujeme vědět, ve které části půdy mají jednotlivé složky pracovat."
    ]
  },
  {
    "id": "C1",
    "side": "image-right",
    "surface": "krem",
    "eyebrow": "Kapitola 03",
    "title": "Třicet centimetrů půdy jako prostor pro život",
    "titleLevel": "h2",
    "photo": "fig-primesi-sonda-ctverec.avif",
    "photoRatio": "1:1",
    "alt": "Čtvercová sonda vykopaná v připravené holé ploše pro nový trávník: svislé stěny z drobivé hnědé zeminy, na dně tmavší pevnější podloží, v jámě stojí dřevěný skládací metr. V pozadí trávník a dřevěný prknový plot v nízkém večerním slunci.",
    "caption": "Stěna sondy ukazuje připravenou vrstvu od povrchu dolů; na dně začíná tmavší, pevnější podloží. Model článku počítá s 30 cm.",
    "body": [
      "Materiály i rozdíl mezi jejich hmotností a objemem už známe. Teď jim potřebujeme vyhradit místo — nejen vedle sebe ve směsi, ale také v různých hloubkách.",
      "Pro naše příklady zvolíme **30 cm hluboký profil určený pro nově zakládaný nebo kompletně rekonstruovaný trávník**. Profil zde znamená připravovanou vrstvu půdy od povrchu do této hloubky. Třicet centimetrů je model, nikoli předpis platný pro každou zahradu ani pokyn všude automaticky odvézt třicet centimetrů půdy.",
      "Proč záleží na souvislém prostoru pro kořeny, jak půda hospodaří s vodou a vzduchem a proč samotná výška navážky nestačí, podrobně vysvětluje článek [Krásný trávník začíná pod zemí](/posts/krasny-travnik-zacina-pod-zemi-2). Zde na něj navazujeme volbou složek a jejich rozmístěním v připravované vrstvě."
    ]
  },
  {
    "id": "C2",
    "side": "image-left",
    "surface": "bila",
    "title": "Horní část pomáhá začátku, hlubší umožní kořenům pokračovat",
    "titleLevel": "h3",
    "drawing": "koren-zacina-nahore",
    "alt": "Řez trávníkem od drnu s jedním trsem trávy do hloubky 30 cm, nadepsaný „Začíná nahoře, pokračuje dolů“; čárkované hranice v 10 a 15 cm ho dělí na tři zóny se závorkami vpravo. Do 10 cm leží v hnědém základu černé střípky biocharu, světlá zrna zeolitu a hustá síť jemných kořenů („Začátek: nejvíc kořenů, plná směs“), mezi 10 a 15 cm už jen zrna zeolitu („Jen zeolit“) a od 15 do 30 cm holý základ („Bez příměsí: kořeny pokračují“). Několik jemných kořenů přesahuje hranici 10 cm a pět delších prorůstá všemi zónami do základu, dva skoro ke dnu. Legenda: základ, biochar, zeolit, kořeny.",
    "caption": "Čárkované linky v 10 a 15 cm dělí řez na zóny: černé střípky biocharu jen do 10 cm, světlá zrna zeolitu do 15 cm, níž jen základ. Delší kořeny procházejí oběma hranicemi a pokračují jím dolů.",
    "body": [
      "Nejpestřejší směs připravíme pro horních deset centimetrů. Zde bude biochar, zeolit a případně Actino. Zeolit pokračuje také v zóně mezi **10 a 15 cm**. Spodních **15 cm, tedy zónu mezi 15 a 30 cm**, tvoří samotný minerální základ. Poskytuje kořenům další prostor a půdě další objem pro vodu a vzduch.",
      "Dražší příměsi soustřeďujeme do horní části proto, že u trávníků bývá velká část kořenové aktivity blízko povrchu. Neznamená to, že kořeny v deseti centimetrech končí. Znamená to, že stejné množství každé příměsi nemusíme rozmisťovat do celé připravované hloubky.",
      "Jednotlivé zóny přitom navazují jako prostředí, kterým kořen postupuje dolů. To neznamená, že dražší příměsi nemůžeme zapracovat i hlouběji. Jejich přínos tam ale bývá menší, zatímco při zachování stejného podílu ve větším objemu půdy spotřeba materiálu i celkové náklady výrazně vzrostou.",
      "Hloubky tak máme vymezené. O tom, kolik které příměsi do nich připadne, rozhodne výchozí zahrada a vlastnost, kterou potřebujeme zlepšit."
    ]
  },
  {
    "id": "E1",
    "side": "image-right",
    "surface": "krem",
    "eyebrow": "Kapitola 04",
    "title": "Tři zahrady: jaké poměry pro ně zvolit",
    "titleLevel": "h2",
    "photo": "fig-primesi-vzorky-zahon.avif",
    "photoRatio": "1:1",
    "alt": "Tři hromádky různých půd vedle sebe na připravené holé ploše u trávníku: vlevo šedohnědé hutné hroudy jílu s hladkými plochami, uprostřed tmavá drobtovitá hlína, vpravo světlá sypká písčitá zemina. Za nimi trávník v nízkém večerním slunci a dřevěný prknový plot.",
    "caption": "Zleva hutný, lepivý jíl, uprostřed drobtovitá hlína, vpravo sypká písčitá zemina: tři výchozí půdy modelových receptur.",
    "body": [
      "Tři půdní typy nám dávají dobrý začátek: **těžkou půdu potřebujeme zpřístupnit vodě a vzduchu, u hlinité zachovat vyvážený základ a písčité pomoci s uchováním vláhy**.",
      "Níže jsou **tři modelové receptury pro založení nebo výraznější obnovu trávníku**. Poskytují rozsahy podílů pro popsané situace, nikoli jeden univerzální recept. Základní postup je jednoduchý: vybereme odpovídající příklad, zkontrolujeme jeho podmínky, zvolíme konkrétní podíly v uvedených rozmezích a teprve potom spočítáme množství.",
      "Pokud si nejsme jistí, jakou půdu na zahradě máme, pomůže nám ji rozpoznat článek [Krásný trávník začíná pod zemí](/posts/krasny-travnik-zacina-pod-zemi-2). Podle toho vybereme nejbližší příklad."
    ]
  },
  {
    "id": "E1b",
    "side": "image-left",
    "surface": "krem",
    "continues": true,
    "drawing": "prednosti-a-slabiny",
    "alt": "Tři váhy pod sebou; záhlaví říká, že levá miska nese vodu a živiny a pravá vzduch a odtok, osou každé váhy je kruhový vzorek půdy. Jílovitá půda (tmavě hnědý vzorek) převažuje vlevo, pod těžší miskou je zelená fajfka se slovem zachovat, pod lehčí pravou šipka dolů a slovo napravit. Fungující hlína (hnědý vzorek s drobty) je v rovnováze a pod oběma miskami má zachovat; písčitá půda (světle okrový vzorek) převažuje vpravo, kde je zachovat, vlevo má napravit. Dole pointa: zachovat přednosti, napravit jen slabinu.",
    "caption": "Levá miska nese vodu a živiny, pravá vzduch a odtok. Těžší miska ukazuje přednost půdy, kterou zachováme, lehčí slabinu, kterou napravíme. Fungující hlína je v rovnováze.",
    "body": [
      "Dobře fungující půdu nemusíme měnit jen proto, že pro ni existuje recept v tabulce. Pokud se trávníku daří, zachovejme to, co funguje. Jestliže se naopak dlouhodobě potýkáme se zamokřením a špatným zakořeněním a příčinou je těžká, nepropustná půda, může dávat smysl důkladnější úprava a nové založení trávníku.",
      "U novostavby, nebo při zakládání nového trávníku, nám posouzení půdy pomůže rozlišit nutnou investici od zbytečných výdajů. Do vyvážené, dobře propustné hlíny ani do písčité půdy nemusíme automaticky navážet desítky tun písku.",
      "Stejně tak by byla škoda odvézt veškerou jílovitou zeminu a nahradit ji čistým pískem: zbavili bychom se i její schopnosti zadržovat vodu a živiny, které bychom pak museli častěji doplňovat zálivkou a hnojením. Ani u golfových hřišť neplatí, že se všechny plochy zakládají na čistém písku.",
      "Cílem tedy není původní půdu za každou cenu vyměnit, ale zachovat její přednosti a napravit konkrétní slabiny.",
      "Mykorhizní přípravek má vlastní dávku podle plochy. Pravidla pro její volbu shrnujeme na konci této kapitoly; spotřebu pro vlastní plochu pak spočítáte v navazujícím kalkulátoru půdního profilu.",
      "Hlinitý příklad se týká **těžší hlinité půdy při rekonstrukci**, u níž přidáváme písek. Biochar a zeolit mají v upravené směsi pomoci uchovat část vody a živin. Pokud se naše hlína dobře drobí, propouští vodu a nevysychá příliš rychle, můžeme ponechat původní půdu a tyto příměsi vynechat."
    ]
  },
  {
    "id": "E2",
    "side": "image-right",
    "surface": "bila",
    "title": "Těžká jílovitá půda: kořeny potřebují vedle vody také vzduch",
    "titleLevel": "h3",
    "drawing": "jil-jako-vana",
    "alt": "Řez půdou pod drnem s měřítkem 0 až 30 cm: nová propustná směs leží jako ve vaně v utuženém jílu, který brzdí odtok a obepíná ji zespodu i z boků. Čárkovaná cesta vody vede od kapky nad drnem směsí dolů a šipkou končí na hladině, pod níž voda stojí až ke dnu vany jako modrá mokrá vrstva se štítkem „voda se zastaví“. Kořeny prorůstají přes hladinu do mokré vrstvy a mají málo vzduchu. Nad řezem stojí pointa „Nejdřív odtok, teprve potom směs“, legenda rozlišuje novou směs, utužený jíl, stojící vodu a kořeny.",
    "caption": "Jíl obepíná novou směs zespodu i z boků jako vana. Modře je voda, která směsí prošla a stojí na jílovém dně; kořeny, které do ní sahají, mají málo vzduchu.",
    "body": [
      "Po dešti se lepí na boty, za sucha může ztvrdnout tak, že rýči pomáháme celou vahou těla. Mezi těmito dvěma stavy mají růst jemné kořeny. Jíl přitom není bezcenný materiál, kterého je potřeba se za každou cenu zbavit. Umí zadržovat vodu i živiny. Problém nastává tehdy, když uspořádání částic a zhutnění omezí vzduch a pohyb přebytečné vody.",
      "Pro tento model používáme minerální základ složený objemově z **65 % písku a 35 % původní jílovité zeminy**. Vysoký podíl písku odpovídá tomu, že zde uvažujeme o výrazné změně minerální směsi. Zachovaná zemina dál přináší jemnější částice a schopnost vázat některé živiny.",
      "V této variantě počítáme s těžkou půdou, do které se dlouho nepřidávala organická hmota. Nejdříve uvolníme utužená místa a vyřešíme odtok přebytečné vody; teprve potom připravíme směs.",
      "**Zeolit i biochar volíme v rozmezí 2–5 %; Actino v rozmezí 2,5–5 %**, vždy ve vymezených horních zónách. Jílové částice už pomáhají zachycovat živiny, proto použijeme méně zeolitu než v písčité zahradě. Actino doplní organickou složku."
    ]
  },
  {
    "id": "E3",
    "side": "image-left",
    "surface": "bila",
    "continues": true,
    "drawing": "kolik-pisku-do-jilu",
    "alt": "Svislá škála přidaného písku v minerálním základu od 0 do 100 % a vedle ní tři vzorky směsi, každý ve výšce své hodnoty; legenda rozlišuje novou směs, původní zeminu a písek. Těsně nad nulou pár lopat: hnědá původní zemina s několika osamocenými zrny písku, která vrstvu zpravidla nezmění. Zvýrazněných 65 % je výchozí návrh pro jíl, okrová nová směs s hustými tečkami zeminy; plná úsečka na ose od 75 do 100 % patří těžkým jílům podle podkladů a jejich vzorek má zeminy ještě méně. Závěr pod legendou: u těžkého jílu zkouška před velkou objednávkou.",
    "caption": "Poloha vzorku na škále udává podíl písku, plná úsečka na ose rozmezí z podkladů. U pár lopat zůstává hnědá zemina s osamělými zrny, od 65 % nese směs písek a zemina zbývá jen v tečkách.",
    "body": [
      "Současně nesmíme zapomenout, že po přidání velkého množství písku už nepracujeme s původním jílem. Proto ani nízkou dávku zeolitu neodvozujeme slepě z názvu výchozí půdy: musí odpovídat chování nové směsi.",
      "Kořen postupující do hloubky opouští nejpestřejší část směsi, ale pod ní dál pokračuje stejný minerální základ. Pod deseti centimetry je méně organických příměsí; kořen však nemá zůstat odkázaný pouze na obohacenou horní zónu. I níže potřebuje prostředí, kterým může prorůstat za vodou.",
      "Poměr 65/35 popisuje pouze minerální základ. Příměsi si z celkového objemu vezmou vlastní podíl, takže přidaný písek netvoří 65 % celé horní směsi.",
      "U těžkého jílu má smysl udělat zkoušku ještě před velkou objednávkou. Několik lopat písku totiž vlastnosti celé vrstvy zpravidla nezmění. Některé odborné podklady ukazují, jak významný musí být jeho podíl — u těžkých jílů je to až 75 % a více. Poměr 65/35 proto bereme jako výchozí návrh.",
      "Samostatný mykorhizní přípravek lze po této výrazné přestavbě zvážit. Jde o volitelnou položku, která má přijít do kontaktu s budoucími kořeny. Houby nenahradí vyřešení zamokření a utužení. Jejich dávku odvodíme od konkrétního výrobku, nikoli od typu půdy.",
      "A pod celou novou směsí musí dál existovat funkční cesta pro vodu."
    ]
  },
  {
    "id": "E4",
    "side": "image-right",
    "surface": "krem",
    "title": "Střední hlinitá půda: zachovat vyvážený základ",
    "titleLevel": "h3",
    "photo": "fig-primesi-hlina-ctverec.avif",
    "photoRatio": "1:1",
    "alt": "Zblízka čerstvě obrácená hlinitá zemina v záhonu u trávníku: tmavě hnědé drobty a malé hrudky, vlhké, ale ne mokré, s jemnými světlými kořínky trávy, v teplém bočním večerním světle.",
    "caption": "Dobře fungující hlína se drobí: rozpadá se na drobty, mezi kterými zůstávají póry, a prorůstají jí jemné kořeny.",
    "body": [
      "Dobře fungující hlinitá půda mívá nenápadnou výhodu: člověk si její práce skoro nevšimne. Voda se vsákne, zemina se drobí a za sucha ještě nějakou vláhu uchová. Teprve srovnání s těžkým jílem nebo hrubým pískem ukáže, kolik starostí za nás taková půda řeší.",
      "V našem příkladu obnovujeme trávník na **těžší hlinité půdě se zachovanou a udržovanou ornicí**. Horní úrodná vrstva tedy zůstává využitelná, ale směs chceme udělat lépe zpracovatelnou a propustnější.",
      "Minerální základ proto tvoří **30 % přidaného písku a 70 % původní hlíny objemově**. Tento poměr patří k popsané přestavbě; dobře drobtovitou a propustnou hlínu jím nemusíme nahrazovat.",
      "**Actino v tomto základním hlinitém příkladu vynecháme. Biochar i zeolit volíme v rozmezí 3–7 %** v jejich určených zónách. Tyto menší přídavky mají podpořit uchování vody a některých živin v nově promíchané půdě.",
      "Písek upravuje minerální základ, zatímco porézní příměsi pomáhají se zásobou vláhy; každá složka tedy dostává jiný úkol. Rozmezí 3–7 % je součástí tohoto modelu, nikoli důkazem, že každá hlína potřebuje více příměsí než každý jíl."
    ]
  },
  {
    "id": "E5",
    "side": "image-left",
    "surface": "krem",
    "continues": true,
    "drawing": "hlina-prace-misto-materialu",
    "alt": "Nahoře hodnota 0 % nového písku, zeolitu i biocharu a věta, že u fungující hlíny může víc pomoci práce. Pod ní tři řezy hlínou s popisky vpravo: Rozrušit vrstvu po bagru, kde je tmavá utužená vrstva uprostřed hlíny rozlámaná třemi klikatými trhlinami na čtyři kry, z nichž dvě prostřední jsou mírně pootočené; Odstranit kameny, kde jeden kámen trčí z povrchu a druhý je šipkou vyzvednutý z čárkovaně naznačeného lůžka v hlíně nad povrch; a Urovnat povrch, kde oblouková šipka přesouvá hrbol nad čárkovanou rovinou do stejně velkého dolíku pod ní. Legenda rozlišuje hlínu, kámen a utuženou vrstvu a poznámka dole zní: příměsi až u těžší nebo zanedbané hlíny.",
    "caption": "Rozrušení láme tmavou pruhovanou vrstvu trhlinami na kry. Nic se nepřidává, jen přesouvá: kámen z lůžka ven, hrbol do stejně velkého dolíku. Čárkovaně je lůžko kamene a cílová rovina.",
    "body": [
      "U hlíny se proto nejdříve zastavíme u otázky, zda popsanou přestavbu vůbec potřebujeme. Jestliže se voda vsakuje, zemina se ve vlhkém stavu snadno drobí a během běžné péče příliš rychle nevysychá, ponecháme ji.",
      "Urovnání, odstranění kamenů a uvolnění míst utužených technikou mohou být užitečnější než nová dodávka materiálu. Hlinitá půda je pro trávník dobrý výchozí stav a nemá smysl ji bez důvodu měnit.",
      "Samostatný mykorhizní přípravek v této základní variantě nenakupujeme. U zachované biologicky aktivní půdy nemáme důvod jeho přínos předpokládat automaticky. Jestliže ale rekonstrukce vytvoří převážně novou směs a rozhodneme se pro inokulaci — záměrné přidání živých hub — použijeme dávku vybraného výrobku.",
      "U dobře fungující hlinité zahrady tak může být podíl nového písku, zeolitu i biocharu **nula**. Minerálním základem zůstane původní půda. Jiná situace nastává, pokud máme sice hlinitou zeminu, ale dlouhodobě zanedbanou, bez doplňování organické hmoty.",
      "Pro tento případ lze jako variantu připravit **2,5–5 % Actina v horních 10 cm**. Potřebný prostor získá ubráním části minerálního základu; množství spočítáme později. Ani tehdy z Actina neděláme lék na každý slabý trávník: pokud pod rýčem najdeme ztvrdlou vrstvu po bagru, prvním krokem je její rozrušení."
    ]
  },
  {
    "id": "E6",
    "side": "image-right",
    "surface": "bila",
    "title": "Lehká písčitá půda: prodloužit dobu, po kterou mají kořeny z čeho čerpat",
    "titleLevel": "h3",
    "drawing": "pisek-pod-koreny",
    "alt": "Řez písčitou zeminou pod drnem, hloubka 0 až 30 cm, s nadpisem „Pod dosah kořenů odchází voda i část živin“. Mezi prázdnými kroužky vzduchu (štítek „Vzduch – dost“) rostou tři trsy kořenů a končí nad světlou čárkovanou linkou „Dosah kořenů“. Vpravo vede modrá čárkovaná cesta vody od povrchu pod tuto linku, kde je kapka, až k šipce dolů u dna; podél ní leží šest teček živin, tři nad linkou („Zásoba – rychle dojde“) a tři pod ní („Část živin – voda odnese“). Legenda vysvětluje značky: písčitá zemina, vzduch, kořeny, voda, živiny.",
    "caption": "Světlá čárkovaná linka značí dosah kořenů. Tečky živin nad ní jsou zásoba, na kterou kořeny dosáhnou; ty pod ní odnáší voda po modré cestě mimo jejich dosah.",
    "body": [
      "Do lehké písčité půdy se příjemně zaboří rýč. V červenci už však její vlastnosti nemusejí být stejně příjemné pro trávník. Voda jí snadno prochází, vzduch obvykle nechybí, ale zásoba dostupná kořenům se rychle vyčerpává. Některé rozpuštěné živiny navíc pokračují s vodou hlouběji, než kam právě dosahují kořeny.",
      "**Další písek sem nepřidáváme.** Minerální kostra je písčitá už na začátku. Chceme proto doplnit schopnost půdy hospodařit s vodou a živinami: biochar a zeolit mají posílit zásobní vlastnosti horní části, Actino přináší organickou složku a výživu.",
      "Nulové množství písku v tabulce neznamená půdu bez písku. Znamená nulový nákup dalšího písku; ten stávající zůstává součástí původní zeminy.",
      "Předpokládáme zde půdu chudou na organickou hmotu, s malou zásobou živin a rychlým vysycháním. Proto volíme **8–10 % zeolitu v horních 15 cm a po 5–10 % biocharu a Actina v horních 10 cm**. Konkrétní dávku v každém rozmezí zvolíme podle vlastností půdy a dodaných materiálů. S tímto návrhem počítáme pro chudou písčitou půdu bez pravidelného doplňování kompostu."
    ]
  },
  {
    "id": "E7",
    "side": "image-left",
    "surface": "bila",
    "continues": true,
    "drawing": "zaklad-tri-zahrad",
    "alt": "Pod nadpisem „S hloubkou se poměr nemění“ a podtitulem „Objemový poměr v minerálním základu“ stojí tři svislé sloupce, každý je profil jedné zahrady od povrchu do 30 cm se stupnicí 0, 10, 15 a 30 cm vlevo. Jílovitá má 65 % přidaného písku a 35 % původní zeminy, těžší hlína 30 % a 70 %, písčitá 0 % a 100 % — celý sloupec je původní písčitá zemina. Čárkované linky v 10 a 15 cm přetínají všechny sloupce a svislá dělicí čára mezi pískem a zeminou jimi prochází beze změny až na dno. Legenda rozlišuje přidaný písek (okrová se zrny) a původní zeminu (hnědá); poznámka dole: příměsi si z celkového objemu berou podíl zvlášť.",
    "caption": "Sloupec je minerální základ jedné zahrady do 30 cm, vlevo přidaný písek, vpravo zemina. Čárkované linky značí hranice zón v 10 a 15 cm; dělicí čára jimi prochází beze změny.",
    "body": [
      "Na tomto příkladu je dobře vidět, proč nelze příměs hodnotit odděleně od půdy. Tentýž biochar vstupuje do odlišných podmínek. U jílu musíme hlídat dostatek vzduchu a odvod přebytečné vody. U písku nás více zajímá, zda pomůže prodloužit dobu, po kterou zůstává voda dostupná. Materiál si přináší své vlastnosti, ale jeho užitek se projeví až ve směsi, do které ho vložíme.",
      "Pokud při zakládání vzniká převážně nová písčitá směs s malým podílem biologicky aktivní půdy, lze zvážit mykorhizní přípravek. Tak jako u předchozích příkladů dávkujeme dle doporučení výrobce bez souvislosti s typem půdy.",
      "### Jak na sebe navazují poměry v jednotlivých hloubkách",
      "Příměsi nahrazují část minerálního základu. V každé zóně proto zůstává součet podílů 100 %. Níže jsou rozmezí pohromadě. Nejprve zvolíme konkrétní podíl každé příměsi a minerálním základem doplníme zbytek do 100 %. Nejnižší podíl základu odpovídá nejvyšším dávkám všech příměsí a naopak; krajní hodnoty nelze libovolně sčítat.",
      "U jílovité varianty se zbylý minerální základ dělí objemově 65/35 mezi písek a zeminu, u hlinité 30/70. U písčité ho tvoří původní písčitá zemina. Tyto poměry základu se nemění s hloubkou, ale jeho podíl v celé směsi ano."
    ]
  },
  {
    "id": "E8",
    "side": "image-right",
    "surface": "bila",
    "title": "Kdy dávku upravit a kdy příměs vynechat",
    "titleLevel": "h3",
    "drawing": "jedna-zmena-naraz",
    "alt": "Kresba „Jedna změna naráz“: nahoře pohled shora na pás trávníku rozdělený čarou na plochy A a B, pod ním čárkovanými linkami promítnutý řez horní vrstvou obou ploch v hloubce 0–10 cm. Plocha A nese popisek „výchozí směs“, B „víc biocharu na úkor základu“; v hnědém minerálním základu leží v obou tytéž střípky biocharu, tečky Actina a zrna zeolitu na týchž místech, B má navíc šest střípků biocharu v čárkovaných kroužcích. Popisek „Ostatní příměsi beze změny“ ukazuje na zeolit u dna obou ploch. Legenda vysvětluje značky základu, biocharu, Actina, zeolitu a přidaného biocharu.",
    "caption": "Plocha A vlevo nese výchozí směs, B vpravo tutéž s jediným rozdílem: střípky v čárkovaných kroužcích jsou biochar navíc, který zabral místo minerálního základu.",
    "body": [
      "Pro první přípravu zvolíme podíly v rozmezích odpovídající zahrady. Pokud chceme snížit náklady nebo porovnat dvě směsi na malé ploše, můžeme začít u dolní hranice a jednotlivé dávky upravovat v uvedeném rozmezí. Není nutné zkoušet všechny kombinace. Vždy měníme jednu dávku a prostor, který jí přidáme či ubereme, vyrovnáme opačnou změnou minerálního základu.",
      "U písčité zahrady pracujeme s **8–10 % zeolitu v horních 15 cm**. Dolní hranice znamená menší spotřebu, horní je možností k ověření na velmi hrubé, rychle vysychající půdě; není to automaticky lepší recept. Biochar i Actino zůstávají v rozmezí 5–10 % horních 10 cm.",
      "U biocharu porovnáváme dávky v rozmezí 2–5 % horních 10 cm pro jílovitou zahradu, 3–7 % pro hlinitou a 5–10 % pro písčitou. Místo uvolněné biocharem zaujme minerální základ; ostatní příměsi zůstávají stejné, pokud současně neměníme i jejich návrh.",
      "Poloviční dávka nemusí znamenat poloviční účinek a více materiálu nezaručuje úměrně větší užitek. Výsledek vzniká ze souhry celé půdy.",
      "U těžké půdy nejprve odstraníme utužení a překážky odtoku vody. U lehké půdy při srovnání sledujeme, jestli směs mezi zálivkami vysychá pomaleji. Tím dostává změna dávky konkrétní měřítko: řešíme vlastnost, kterou jsme chtěli upravit. Samotné přidání dražšího materiálu ještě neznamená lepší výsledek."
    ]
  },
  {
    "id": "E9",
    "side": "image-left",
    "surface": "krem",
    "title": "Mykorhizní přípravek má vlastní pravidla dávkování",
    "titleLevel": "h3",
    "drawing": "myko-podle-navodu",
    "alt": "Nadpis „Když se pro přípravek rozhodneme“ stojí nad štítkem „Návod výrobku“ se třemi řádky: běžné založení trávníku s dávkou A, náročnější podmínky s dávkou B a přeškrtnutý typ půdy, který má místo dávky jen pomlčku. Vlevo tři kruhové vzorky půdy — jílovitá, hlinitá a písčitá — vedou tahy, které se slévají do jedné šipky k řádku běžného založení. U dávky A stojí přeškrtnutá šipka nahoru s textem „i pro písčitou“, tedy dávku nezvyšovat. Pod přerušovanou čarou pointa: podle návodu, ne podle typu půdy.",
    "caption": "Vlevo tři půdy, vpravo štítek návodu: všechny tahy vedou do téhož řádku. Přeškrtnutá šipka nahoru u dávky A značí, že písčitá půda dávku nezvyšuje; přeškrtnutý typ půdy dávku neurčuje.",
    "body": [
      "Ve fungující hlinité půdě samostatný přípravek není automatickou nákupní položkou. Nulová dávka znamená, že nic nepřikupujeme, nikoli že v půdě žádné mykorhizní houby nejsou. Po výrazné rekonstrukci nebo při vytváření převážně nové směsi lze inokulaci zvážit. Sucho samo neprokazuje nedostatek vhodných hub.",
      "**Dávku mykorhizního přípravku volíme podle návodu konkrétního výrobku a účelu použití, nikoli podle typu půdy.** Pokud návod rozlišuje běžné založení trávníku a náročnější podmínky, držíme se dávky pro odpovídající použití.",
      "Samotná písčitá půda není důvodem k jejímu zvýšení. Jestliže tentýž přípravek použijeme ve všech třech zahradách za stejným účelem a za podmínek odpovídajících návodu, jeho dávka může zůstat stejná.",
      "Tím máme rozhodnuto o složení: které materiály použít, v jakých podílech a do jaké hloubky. Potřebné množství pro vlastní zahradu a plán dodávky připravíte v článku [Kalkulátor na plánování půdního profilu](/posts/kalkulator-na-planovani-pudniho-profilu). Samotným mícháním a ukládáním směsi provede návod [Jak připravit a uložit směs](/posts/jak-pripravit-a-ulozit-smes)."
    ]
  }
]

/** Pořadí oddílů; INGREDIENTS, TAB-DAVKY a TAB-HLOUBKY jsou existující karty složek a tabulky. Tip o betonářském písku je rámeček v těle A3 (řádek „> “). */
export const PRIMESI_RHYTHM_ORDER = ["A1", "A2", "A3", "INGREDIENTS", "A4", "B1", "B2", "C1", "C2", "E1", "E1b", "TAB-DAVKY", "E2", "E3", "E4", "E5", "E6", "E7", "TAB-HLOUBKY", "E8", "E9"] as const

/** Titulky tabulek (porota kola 01: na telefonu začínaly holým řádkem). Nový text v roli popisku, ne autorova věta. */
export const PRIMESI_TABLE_HEADINGS: Record<string, string> = {
  'TAB-DAVKY': 'Dávky příměsí pro tři modelové zahrady',
  'TAB-HLOUBKY': 'Poměry složek v zónách 0–10, 10–15 a 15–30 cm',
}
