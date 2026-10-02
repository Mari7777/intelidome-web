/**
 * Rytmus obraz/text článku „Jak zasít trávník: od prvního zalití k pevným
 * kořenům" (2026-10-02). Každý úsek autorova textu stojí vedle vlastního
 * obrazu, strany se střídají (DESIGN.md 8.2b p. 8, ADR-006).
 *
 * Soubor je vygenerovaný z autorovy předlohy
 * `zdroje-informaci/pro-clanky/clanek pro závlahu zahrady/jak-zasit-travnik.md`:
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

export const SEEDING_SECTIONS: SeedingSection[] = [
  {
    "id": "U",
    "side": "image-right",
    "surface": "bila",
    "photo": "fig-zasit-terasa-pred.avif",
    "photoRatio": "4:5",
    "caption": "Pohled z terasy pár dnů po výsevu: plocha je pořád hnědá. To podstatné se zatím odehrává v několika milimetrech pod povrchem.",
    "body": [
      "*Semena jsme rozházeli za několik minut. To nejzajímavější se však teprve začne odehrávat v několika milimetrech půdy, které při pohledu ze zahradní terasy téměř nevidíme.*",
      "První dny po výsevu prověřují hlavně naši trpělivost. Půda je pořád hnědá a při každé obchůzce zahrady se skláníme o něco níž, jestli už přece jen něco neuvidíme. Pod povrchem přitom může být dávno rušno. Semena přijímají vodu, začínají využívat své zásoby a vysouvají první drobné kořínky.",
      "Budoucí trávník je v této chvíli závislý na několika milimetrech zeminy, které odpolední slunce a vítr dokážou rychle vysušit. O výsledku se tak začíná rozhodovat ještě dřív, než se objeví jediný zelený lístek.",
      "Výsev trávníku je zvláštní tím, jak snadná je jeho viditelná část. Otevřít pytel, rozhodit osivo a pustit vodu zvládneme rychle.",
      "Mnohem větší pozornost si zaslouží to, co následuje: semeno přijímá vodu, kořínek hledá cestu do půdy, první list se dostává ke světlu a drobná rostlina postupně přestává žít ze zásob, které si přinesla s sebou. Během této proměny se mění i její potřeby. Péče, která pomáhá první den, může být o několik týdnů později nedostatečná.",
      "Když těmto změnám porozumíme, přestanou doporučení o teplotě, dávkování a zálivce působit jako sbírka zahradnických zákazů. Za každým z nich se skrývá něco velmi konkrétního: voda, vzduch, energie a prostor pro růst."
    ]
  },
  {
    "id": "K01",
    "side": "image-left",
    "surface": "krem",
    "eyebrow": "Kapitola 01",
    "tocGroup": "Před setím",
    "title": "V malém semeni začíná velká změna",
    "titleLevel": "h2",
    "drawing": "kliceni-krok-za-krokem",
    "alt": "Čtyři řezy půdou s týmž semenem těsně pod povrchem: suché semeno, semeno nabobtnalé vodou, semeno s prvním kořínkem a nakonec delší kořínek s prvním zeleným listem nad půdou. Pod třetí a čtvrtou fází je vyznačeno, že od kořínku nesmí půda vyschnout. Dole tři potřeby klíčení: voda, vzduch a teplo.",
    "caption": "Semeno nejprve přijme vodu, potom vyroste kořínek a teprve nakonec první list. Od objevení kořínku už půda kolem něj nesmí vyschnout.",
    "body": [
      "Suché travní semeno vypadá nenápadně. Uvnitř však nese zárodek budoucí rostliny a zásoby, ze kterých může čerpat při klíčení. Jakmile začne přijímat vodu a má vhodnou teplotu, rozbíhají se procesy, které tyto zásoby zpřístupní. Nejprve se objeví kořínek. Teprve potom se nad půdou ukáže to, na co jsme celou dobu čekali: první zelený list.",
      "Právě tady se snadno spleteme. Zahrada několik dnů vypadá nehybně, ale semeno už může být uprostřed změny, při níž je na okolních podmínkách mnohem závislejší než v suchém sáčku. Zvlášť po objevení kořínku může přesušení mladou rostlinu zahubit. Opětovné zalití pak neznamená, že se všechno spustí od začátku.",
      "Stejně potřebný je kyslík. Klíčící semeno i jeho kořeny dýchají a získávají tím energii pro růst. Když póry v půdě dlouhodobě zaplní voda, přístup kyslíku se zhorší. Proto může výsev selhat v suché zemině i v zemině, která se leskne jako mokrá houba. Rozhoduje přiměřená vlhkost, při níž zůstává v půdě také prostor pro vzduch.",
      "První list navíc ještě není hotový trávník. Mezi klíčením, viditelným vzejitím, souvisle zeleným povrchem a porostem schopným snášet běžný provoz leží několik dalších etap. Rostliny musejí rozvinout kořeny, vytvářet nové listy a odnože. Odnožování znamená, že z jedné rostliny přibývají další výhony. U některých trav pomáhají vyplňovat okolní prostor také výběžky.",
      "To je první důležitá odpověď na otázku, jak vzniká hustota: **dospělý trávník nehoustne pouze počtem vysetých semen. Houstne také růstem rostlin, které dostaly šanci zesílit.**"
    ]
  },
  {
    "id": "K02",
    "side": "image-right",
    "surface": "bila",
    "eyebrow": "Kapitola 02",
    "title": "Teploměr patří do země",
    "titleLevel": "h2",
    "drawing": "pudni-teplomer",
    "alt": "Půdní teploměr zapíchnutý do řezu půdou s hrotem v hloubce 5 cm. Vedle svislá stupnice teploty půdy od 0 do 30 °C s vyznačenou hranicí 10 °C, odkud se začíná sít, a pásmem 15–25 °C příznivým pro klíčení.",
    "caption": "Teploměr patří do země, asi 5 cm hluboko. Začínáme při stabilních zhruba 10 °C; pásmo 15–25 °C bývá pro klíčení řady trav příznivé.",
    "body": [
      "První teplé jarní dny mohou klamat: vzduch už je příjemně teplý, ale půda zůstává po zimě chladná. **S výsevem se proto řídíme především teplotou půdy.** Na podzim máme výhodu – země si uchovává letní teplo, i když se vzduch už ochlazuje.",
      "U běžných zahradních směsí je rozumné začínat při **stabilní teplotě půdy přibližně nad 10 °C**. Pro klíčení řady trav bývá příznivých **15–25 °C**, podle druhu a odrůdy. Teplotu ověříme půdním teploměrem přibližně v hloubce 5 cm během několika dnů; jediný teplý odpolední údaj může být zavádějící."
    ]
  },
  {
    "id": "K03a",
    "side": "image-left",
    "surface": "krem",
    "eyebrow": "Kapitola 03",
    "title": "Semeno nemá kalendář",
    "titleLevel": "h2",
    "drawing": "okno-konce-leta",
    "alt": "Schematický průběh teploty vzduchu a půdy od jara do podzimu: půda se za vzduchem opožďuje, na jaře je chladnější, koncem léta teplejší. Na přelomu léta a podzimu je vyznačené okno pro výsev s šesti až osmi týdny růstu před zimou. Pod grafem tři řádky: jaro, léto a konec léta.",
    "caption": "Koncem léta je půda ještě prohřátá a vzduch už chladnější. Po výsevu má zbývat šest až osm týdnů počasí příznivého pro růst.",
    "body": [
      "**Pro výsev anglického trávníku bývají nejlepší podmínky na konci léta a na začátku podzimu.** V tomto období se totiž potkávají dvě výhody: půda je ještě prohřátá po létě, ale vzduch už bývá chladnější.",
      "Semena mají dostatek tepla ke klíčení, zatímco povrch zeminy vysychá pomaleji než za letních veder. Mladá tráva tak dostává příležitost zakořenit, aniž by musela od prvních dnů čelit silnému horku.",
      "Vhodným vodítkem jsou mírné dny s **denními teplotami vzduchu přibližně 15–25 °C**, bez dlouhotrvajících veder. Jde o orientaci; rozhodující zůstává naměřená teplota půdy.",
      "S výsevem počítáme tak, aby po něm zbývalo přibližně **šest až osm týdnů počasí příznivého pro růst**. Nemusí být po celou dobu stejně teplo. Důležité je, aby tráva před výrazným zimním útlumem stihla nejen vzejít, ale také rozvinout kořeny a zesílit.",
      "Pomalejší složky směsi potřebují větší časovou rezervu, takže časný podzim bývá spolehlivější volbou než čekání na poslední teplé dny před zimou.",
      "Jarní výsev je také možný, mladý trávník však čeká první léto dříve, než si vytvoří tak dobře vyvinuté kořeny. Letní výsev zase přináší rychlé vysychání povrchu a větší nároky na zálivku. Pokud si můžeme termín zvolit, konec léta a začátek podzimu obvykle nabídnou příznivější start."
    ]
  },
  {
    "id": "K03b",
    "side": "image-right",
    "surface": "bila",
    "title": "Zajímavost: semena, která čekají na jaro",
    "titleLevel": "h3",
    "photo": "fig-zasit-jinovatka.avif",
    "photoRatio": "3:2",
    "caption": "Jinovatka na připravené půdě za mrazivého rána. Při dormantním výsevu mají semena v takové půdě zůstat nevyklíčená až do jara.",
    "body": [
      "V některých chladných oblastech se používá dormantní výsev. Semena se dostanou na plochu v době, kdy už mají zůstat nevyklíčená a počkat na vhodnější jarní podmínky. Ukazuje to pozoruhodný rozdíl mezi suchým či dosud nevyklíčeným semenem a křehkou mladou rostlinou: zimní podmínky pro ně nepředstavují stejné riziko.",
      "Je to však postup silně závislý na místním klimatu. Oteplení může spustit předčasné klíčení a následný mráz poškodit mladé rostliny. Voda může semena odnést a na jaře může chybět vláha právě ve chvíli, kdy se zahradní závlaha ještě nepoužívá. Pro běžné založení zahrady proto dává větší smysl využít příznivé růstové období."
    ]
  },
  {
    "id": "K04",
    "side": "image-left",
    "surface": "bila",
    "eyebrow": "Kapitola 04",
    "title": "Jeden pytel, několik různých rychlostí",
    "titleLevel": "h2",
    "drawing": "rychlost-vzchazeni",
    "alt": "Časová osa 0 až 28 dnů od výsevu se čtyřmi pruhy doby vzejití: jílek vytrvalý 5–8 dnů, kostřava červená 15–20 dnů, lipnice luční 21–28 dnů a kostřava rákosovitá 14–21 dnů. Svislá linka v sedmém dnu protíná jen pruh jílku.",
    "caption": "Po týdnu se zelená hlavně jílek. Kostřavy a lipnice vzcházejí obvykle až ve druhém až čtvrtém týdnu; údaj u kostřavy rákosovité platí pro chladnější jaro.",
    "body": [
      "Na osivu nás přirozeně láká příslib rychlého výsledku. Jenže nejrychlejší vzejití není totéž co nejvhodnější budoucí trávník. Směs pro jemný okrasný povrch, rodinnou zahradu a často zatěžovanou plochu může mít rozdílné složení.",
      "Do výběru vstupuje světlo, půda, dostupná vláha, plánovaná výška sečení a množství péče, které chceme zahradě věnovat. Rozdíly existují i mezi odrůdami stejného druhu.",
      "Navíc nevyséváme rostliny, které by pracovaly podle společných hodinek. Jílek bývá rychlý, lipnice si obvykle dává více načas. Zelené špičky po prvním týdnu proto mohou představovat hlavně rychlejší složku směsi, zatímco další semena zůstávají skrytá.",
      "Orientační očekávání u běžného zahradního výsevu může vypadat takto:"
    ]
  },
  {
    "id": "K05a",
    "side": "image-right",
    "surface": "bila",
    "eyebrow": "Kapitola 05",
    "title": "Proč další hrst nemusí pomoci",
    "titleLevel": "h2",
    "drawing": "husty-vysev",
    "alt": "Dva řezy půdou pod stejným sluncem. Vlevo dávka podle návodu: několik silných rostlin s odnožemi a delšími kořeny. Vpravo hustý výsev: mnoho tenkých rostlinek natěsnaných vedle sebe s krátkými kořínky.",
    "caption": "Na stejném metru je stejné světlo. Rostliny z doporučené dávky mají místo zesílit; hustý výsev dá mnoho slabých rostlinek, které si stíní.",
    "body": [
      "Více semen může zpočátku vytvořit působivý „wow efekt“. Plocha rychle zezelená a hustý porost vypadá jako důkaz, že přisypat osivo byl dobrý nápad. Jenže první dojem ještě neukazuje, jak se budou jednotlivé rostliny vyvíjet dál.",
      "Na stejném metru čtverečním zůstává stejné množství světla a omezená zásoba vody i živin. Čím více semenáčků se o ně dělí, tím silnější je vzájemná konkurence. Rostoucí listy si začínají stínit a jednotlivé rostliny mohou zůstávat drobnější a pomaleji zesilovat. **Rychle zelený povrch tak může skrývat hustý porost slabých rostlinek, které teprve potřebují vytvořit odolný trávník.**"
    ]
  },
  {
    "id": "K05b",
    "side": "image-left",
    "surface": "bila",
    "continues": true,
    "drawing": "odnozovani",
    "alt": "Táž travní rostlina ve třech stavech na řezu půdou: jeden výhon s krátkým kořínkem, tři výhony z jedné báze s delšími kořeny a hustý trs s mnoha výhony a bohatými kořeny. Mezi stavy vedou šipky.",
    "caption": "Z jednoho semene nezůstane jedno stéblo. Rostlina, která dostala čas zesílit, přidává další výhony a trávník houstne i bez dalšího osiva.",
    "body": [
      "V příliš hustém porostu může navíc déle přetrvávat vlhkost mezi listy, což vytváří příznivější prostředí pro některé choroby. Mladá tráva může být také citlivější k poškození při sečení. Přidáním vody nebo hnojiva tuto situaci automaticky nenapravíme – nedostatek světla ani nadměrnou hustotu tím neodstraníme.",
      "Přehnaný výsevek může ovlivnit i složení budoucího trávníku. Rychle vzcházející jílek získá náskok a může více zastínit pomalejší trávy, například lipnici luční. Směs pak sice rychle zezelená, ale některé její složky dostanou menší příležitost se prosadit.",
      "**Proto dodržujeme dávkování doporučené výrobcem konkrétní směsi**, včetně rozlišení nového výsevu a dosevu. Trávník postupně houstne také odnožováním: jedna rostlina vytváří další výhony a zaplňuje prostor kolem sebe.",
      "Trochu delší čekání na souvislý zelený povrch za to stojí. Dáváme rostlinám příležitost zesílit a vytvořit porost, který bude dobře vypadat i po prvním sečení a při běžném používání."
    ]
  },
  {
    "id": "K06a",
    "side": "image-right",
    "surface": "krem",
    "eyebrow": "Kapitola 06",
    "tocGroup": "Setí",
    "title": "Několik milimetrů, na kterých záleží",
    "titleLevel": "h2",
    "photo": "fig-zasit-setove-luzko.avif",
    "photoRatio": "1:1",
    "caption": "Seťové lůžko před výsevem: rovné, jemně drobtovité a pevné. Bota v něm nechá jen mělký otisk.",
    "body": [
      "Samotné [seťové lůžko](/posts/jak-pripravit-a-ulozit-smes#cas-na-slehnuti-neni-prazdne-cekani) má být rovné, přiměřeně pevné a na povrchu jemně drobtovité. Přehnaně kyprá zemina se později sesedá, při chůzi vznikají hluboké stopy a semena mohou skončit v nestejné hloubce. Na opačném konci je udusaná deska, do které kořínek obtížně proniká. Mezi oběma krajnostmi potřebujeme povrch, který semeno podrží a současně mu dovolí růst.",
      "Pokud je půda suchá i v hloubce, vyplatí se ji navlhčit už před setím. U vyschlého profilu může jít o provlhčení přibližně horních 15–20 cm několik dnů předem, následované oschnutím povrchu do stavu vhodného k práci.",
      "V půdě se tím vytvoří zásoba, kterou pak nemusíme dohánět prudkou zálivkou přes právě vysetá semena. Plochu dostatečně vlhkou po dešti ovšem stejně intenzivně znovu neproléváme."
    ]
  },
  {
    "id": "K06b",
    "side": "image-left",
    "surface": "krem",
    "continues": true,
    "drawing": "hloubka-seti",
    "alt": "Zvětšený řez horní vrstvou půdy s milimetrovou stupnicí a třemi semeny: jedno leží volně na povrchu bez kontaktu s půdou, druhé je přitlačené v hloubce 2–5 mm a klíčí nad povrch, třetí leží příliš hluboko a jeho klíček končí pod povrchem. Dole lehký válec přitlačuje semena k půdě.",
    "caption": "Semeno potřebuje kontakt s půdou a jen několik milimetrů zeminy nad sebou. Volně na povrchu nemá odkud brát vodu, z hloubky se klíček ke světlu nedostane.",
    "body": [
      "Semeno potřebuje dobrý kontakt s vlhkou půdou, aby mohlo přijímat vodu a začít klíčit. **Po mělkém zapravení osiva proto plochu přejedeme lehkým zahradním válcem.** Ten semena přitlačí k zemině a pomůže odstranit větší mezery, které by je oddělovaly od vlhkého povrchu. Právě v tom spočívá hlavní účel válcování po výsevu.",
      "Prakticky hledáme tento výsledek: **válec semena přitlačí a povrch lehce zpevní, ale nezanechává hluboké koleje ani nerozmazává zeminu.** Pokud se na něj lepí půda a osivo, je povrch pro válcování příliš mokrý a je potřeba počkat. Příliš těžkým válcem nebo opakovanými přejezdy bychom mohli zeminu nadměrně zhutnit a ztížit růst mladých kořenů.",
      "S hloubkou je potřeba zacházet citlivě. U mnoha běžných směsí se pohybujeme v řádu několika milimetrů, často přibližně 2–5 mm, podle konkrétního osiva a technologie. Některé výrobky mají jiné doporučení. Drobná semena lipnice bývají k hlubokému zahrabání citlivější než větší semena jílku. Rostlinka má jen omezené zásoby pro cestu ke světlu; další vrstva zeminy tuto cestu prodlužuje.",
      "Hrábě proto nemají osivo shromáždit do řádků nebo zahrnout centimetry půdy. Smyslem je mělce je spojit s povrchem podle návodu směsi. Příliš hluboké setí nenapravíme tím, že budeme častěji zalévat."
    ]
  },
  {
    "id": "K07",
    "side": "image-right",
    "surface": "bila",
    "eyebrow": "Kapitola 07",
    "title": "Dva směry pro rovnoměrný výsev",
    "titleLevel": "h2",
    "drawing": "krizovy-vysev",
    "alt": "Pohled shora na dvě stejné plochy. Na první se první polovina osiva vysévá v rovnoběžných pruzích jedním směrem, na druhé se přes ně seje druhá polovina napříč, kolmo k prvnímu průchodu.",
    "caption": "Polovina dávky jedním směrem, druhá polovina napříč. Celkové množství osiva se nemění, jen se rovnoměrněji rozloží.",
    "body": [
      "Podle velikosti plochy odvážíme množství osiva **doporučené výrobcem konkrétní travní směsi** a rozdělíme ho na dvě stejné části. První polovinu vysejeme po celé ploše v jednom směru, druhou polovinu napříč, kolmo k prvnímu průchodu. Tím pomůžeme vyrovnat drobné nepravidelnosti a omezíme vznik hustých ostrůvků a řídkých pruhů.",
      "**Každým směrem vyséváme pouze polovinu doporučené dávky.** Celkové množství osiva tak zůstává stejné, jen ho rovnoměrněji rozložíme. Postup platí pro ruční výsev i rozmetadlo; u něj přizpůsobíme nastavení poloviční dávce. Vyséváme za klidného počasí, aby semena neodnášel vítr."
    ]
  },
  {
    "id": "K08",
    "side": "image-left",
    "surface": "krem",
    "eyebrow": "Kapitola 08",
    "tocGroup": "Péče po výsevu",
    "title": "Semena potřebují stálou vláhu",
    "titleLevel": "h2",
    "photo": "fig-zasit-vlhkost-prstem.avif",
    "photoRatio": "4:5",
    "caption": "Vlhkost se ověřuje přímo u semen: zemina má být na dotek vlhká, ne lesklá ani rozbředlá.",
    "body": [
      "Po výsevu plochu jemně zavlažíme, aby se půda kolem semen navlhčila. Voda má dopadat drobným postřikem – silný proud by mohl osivo přemístit a vytvořit holá místa i husté ostrůvky.",
      "Klíčící semena ještě nemají vyvinuté kořeny, kterými by dosáhla k vodě ve větší hloubce. Jsou proto závislá na vlhkosti těsně pod povrchem, odkud se voda rychle ztrácí. **Jakmile začne klíčení, vyschnutí může mladou rostlinku zahubit ještě dříve, než ji nad zemí vůbec uvidíme.**",
      "Horní vrstvu půdy proto udržujeme průběžně vlhkou kratšími, podle potřeby opakovanými zálivkami. Za slunce a větru může být nutné zavlažit několikrát denně, za chladnějšího a oblačného počasí méně.",
      "Při dostatečném dešti další vodu nepřidáváme. **Cílem je vlhká půda kolem semen, nikoli kaluže a trvalé přemokření, které omezuje přístup kyslíku.** Pokud voda začíná odtékat nebo přesouvat osivo, zálivku přerušíme a necháme ji vsáknout.",
      "Vlhkost kontrolujeme na několika místech – na slunci, ve stínu i na okrajích dosahu postřikovačů. Opatrně ověříme stav zeminy přímo u semen a těsně pod nimi. Slunný okraj může potřebovat další krátkou zálivku, přestože jinde je vody stále dost. Rozhoduje skutečné vysychání půdy, ne pevný počet minut nastavený na časovači."
    ]
  },
  {
    "id": "K09a",
    "side": "image-right",
    "surface": "bila",
    "eyebrow": "Kapitola 09",
    "title": "Kořeny rostou a zálivka se mění s nimi",
    "titleLevel": "h2",
    "photo": "fig-mlady-porost-ctverec.avif",
    "photoRatio": "1:1",
    "caption": "Stébla různé výšky a mezi nimi ještě holá půda: zelená se rychlejší složka směsi, pomalejší trávy teprve klíčí.",
    "body": [
      "První zeleň svádí k úlevě: podařilo se, můžeme zalévat méně. Jenže ve směsi mohou teprve klíčit pomalejší druhy. Jílek už ukazuje listy, zatímco lipnice ještě potřebuje vhodně vlhké prostředí u povrchu. Ukončit častější lehkou zálivku po prvním zezelenání může znamenat, že vlastní péčí změníme složení budoucího trávníku.",
      "U pomalejšího výsevu proto může tato počáteční péče trvat i kolem měsíce. Jinde bude přechod rychlejší. Důležitější než počet dnů je, co se právě děje v porostu a v půdě.",
      "Jakmile se rostliny vyvíjejí a kořeny pronikají hlouběji, postupně prodlužujeme intervaly mezi zálivkami a zvětšujeme jednotlivé dávky tak, aby voda zasahovala aktivní kořenovou vrstvu. Krátké orosení, které stačilo pro semeno u povrchu, už nemusí stačit rostlině s větším kořenovým systémem a rostoucí listovou plochou."
    ]
  },
  {
    "id": "K09b",
    "side": "image-left",
    "surface": "bila",
    "continues": true,
    "drawing": "koreny-a-vlaha",
    "alt": "Dva řezy půdou se stejným mladým porostem a stejně hlubokými kořeny. Vlevo je vlhká jen tenká vrstva u povrchu a kořeny pod ní jsou v suché půdě. Vpravo je povrch oschlý, ale vrstva s kořeny pod ním je vlhká a půda pod kořeny zůstává suchá.",
    "caption": "Po zálivce rozhoduje, kam došla voda. Mokrý povrch nad suchou vrstvou s kořeny znamená upravit dávku; oschlý povrch nad vlhkou vrstvou je v pořádku.",
    "body": [
      "Přechod má být pozvolný. Mladý porost nenecháváme úmyslně vadnout jako údajný trénink odolnosti. Později může povrch mezi zálivkami oschnout, zatímco níže zůstává využitelná vláha. Abychom tuto změnu správně posoudili, potřebujeme vědět, kam už kořeny dosahují. Suchý povrch s vláhou v dosahu kořenů je jiná situace než suchá celá vrstva, ve které mladé kořeny skutečně rostou.",
      "Na malém kontrolním místě u okraje můžeme opatrně odebrat úzký blok zeminy a prohlédnout jeho bok. Porovnáme hloubku drobných kořínků s tím, kam dosahuje vlhkost. Pokud je po zálivce mokrý jen povrch a vrstva s kořeny pod ním zůstává suchá, potřebujeme upravit dávku nebo její rozdělení podle vsakování.",
      "Jestliže naopak kořeny zatím využívají jen mělkou vrstvu, prodlužujeme přestávky opatrně. Taková omezená kontrola řekne více než opakované posuzování barvy listů z terasy."
    ]
  },
  {
    "id": "K09c",
    "side": "image-right",
    "surface": "bila",
    "continues": true,
    "photo": "fig-zasit-stin-stromu.avif",
    "photoRatio": "3:2",
    "caption": "Pod stromem a na slunci rostou dva různé trávníky. Stejný program zálivky nemusí vyhovovat oběma.",
    "body": [
      "Po zakořenění může dlouhodobé udržování vody pouze těsně u povrchu podporovat mělké kořenění a menší odolnost vůči suchu. Ani opačný extrém ale nepomůže: velká dávka, která odteče pod dosah kořenů nebo po svahu pryč, není rostlině k dispozici. Zálivka má sledovat rozvoj kořenové soustavy i schopnost půdy vodu zadržet.",
      "Na [lehčí písčité půdě](/posts/krasny-travnik-zacina-pod-zemi-2) se zásoba obvykle vyčerpává rychleji. Těžší nebo zhutněná půda může vodu přijímat pomalu. Pod stromem se přidává konkurence jeho kořenů a zachytávání deště korunou. Stín proto automaticky neznamená dostatek vláhy. V jiné zastíněné části naopak voda zůstává dlouho. [Jeden program pro všechny části zahrady](/posts/jak-navrhnout-automatickou-zavlahu) může být pohodlný pro ovladač, ale obtížný pro rostliny."
    ]
  },
  {
    "id": "K10",
    "side": "image-left",
    "surface": "krem",
    "eyebrow": "Kapitola 10",
    "title": "Hnojivo neumí nahradit čas",
    "titleLevel": "h2",
    "photo": "fig-zasit-hnojivo.avif",
    "photoRatio": "4:5",
    "caption": "Startovací hnojivo se odměřuje podle skutečné plochy, ne od oka. Přisypat pro jistotu se u klíčící trávy nevyplácí.",
    "body": [
      "Startovací hnojivo může mladému trávníku pomoci, ale větší dávka neznamená lepší start. **Vybíráme výrobek určený pro nový výsev a dodržujeme dávkování, termín i způsob aplikace uvedený výrobcem.** Některá hnojiva patří už do přípravy půdy; první zelené špičky proto samy o sobě nejsou pokynem k dalšímu hnojení.",
      "**Dobrou volbou je kvalitní startovací hnojivo s podílem postupně uvolňovaného dusíku.** Může spojovat rychle dostupnou část pro počáteční růst s pomalejší zásobou na další týdny. Tím pomáhá omezit prudké růstové výkyvy a snížit riziko poškození vysokou jednorázovou dávkou. Ani postupné uvolňování však nenahrazuje správné dávkování.",
      "Zohledníme také hnojivo, kompost nebo obohacený substrát, které jsme do půdy přidali při přípravě. Další výživu nepřidáváme automaticky a množství odměřujeme podle skutečné plochy.",
      "**Přisypávat „pro jistotu“ se u klíčící trávy nevyplácí.** Vysoká koncentrace rozpustných solí ztěžuje příjem vody a může poškodit mladé kořínky. Nadbytek dusíku zase podporuje příliš bujný, měkký růst, náchylnější k některým chorobám.",
      "Střídmost platí i pro organická hnojiva a kompost – přírodní původ neznamená neomezenou dávku. Kompost musí být vyzrálý a vhodný pro mladé rostliny. Mykorhiza a biostimulanty zůstávají volitelnými doplňky; vhodnou půdu, vláhu a čas na zakořenění nenahradí."
    ]
  },
  {
    "id": "MYKO",
    "side": "image-right",
    "surface": "bila",
    "title": "Mykorhizu umístit tam, kde se setká s mladými kořeny",
    "titleLevel": "h3",
    "drawing": "mykorhiza-pod-osivem",
    "alt": "Dva řezy půdou do 30 cm se stejnou dávkou mykorhizního přípravku. Vlevo leží přípravek v pásu asi 3 cm pod osivem a první kořínky do něj vrůstají. Vpravo je tatáž dávka rozptýlená do celé hloubky; kořínky dosáhnou jen k nejmělčí značce přípravku a většina dávky leží hlouběji.",
    "caption": "Stejná dávka, jiné místo. Pás zhruba 3 cm pod osivem potká první kořínky hned; rozptýlený do 30 cm leží většinou tam, kam mladé kořeny ještě nedosáhnou.",
    "body": [
      "Pokud jsme se [pro mykorhizní přípravek rozhodli](/posts/pisek-biochar-a-dalsi-primesi#mykorhizni-pripravek-ma-vlastni-pravidla-davkovani), jeho umístění se řídí návodem konkrétního výrobku. Pro přípravek TurfComp výrobce při výsevu popisuje aplikaci přibližně **3 cm pod osivo**.",
      "Při pokládce travního koberce přijde na připravený povrch pod něj. Podstatný je budoucí kontakt s kořeny; rovnoměrné rozptýlení stejné dávky do celých třiceti centimetrů by sledovalo jiný cíl.",
      "Přípravek rozprostřeme rovnoměrně v místě budoucích kořenů a dál postupujeme podle návodu k výsevu nebo pokládce koberce. Při ošetření hotového trávníku použijeme návod pro dodatečnou aplikaci; postup určený pod osivo na povrchu již založeného porostu nenapodobujeme."
    ]
  },
  {
    "id": "K11",
    "side": "image-left",
    "surface": "krem",
    "eyebrow": "Kapitola 11",
    "tocGroup": "Plevele, sečení a potíže",
    "title": "Na prázdnou plochu nečekala jen tráva",
    "titleLevel": "h2",
    "photo": "fig-zasit-plevel-nadhled.avif",
    "photoRatio": "1:1",
    "caption": "Mezi úzkými stébly mladé trávy vyrážejí širší listy plevelů. Jejich semena čekala v půdě, nepřinesl je pytel osiva.",
    "body": [
      "Čerstvě připravená zemina nabízí světlo, vláhu a volné místo. Pro zahradníka je to budoucí trávník. Pro semena plevelů v půdě je to příležitost, která nemusela přijít několik let. Když proto mezi trávou vyraší jiné rostliny, neznamená to automaticky, že je přinesl pytel osiva.",
      "Část této konkurence můžeme omezit ještě před výsevem. Pokud máme čas, necháme připravený povrch zvlhnout a první plevele vzejít. Potom je mělce odstraníme. Půdu znovu zbytečně hluboko nepřevracíme, abychom nevynesli další zásobu semen na povrch. Vytrvalé plevele s kořeny a oddenky potřebují důkladnější řešení už při přípravě plochy.",
      "Po výsevu pomáhá část jednoletých plevelů omezovat pravidelné sečení. Vytrvalé druhy mohou vyžadovat cílený zásah. Vyšší dávka travního osiva však nenahradí odstranění oddenků ani nevyřeší místo, kde tráva dlouhodobě nemá vhodné podmínky."
    ]
  },
  {
    "id": "K12",
    "side": "image-right",
    "surface": "bila",
    "eyebrow": "Kapitola 12",
    "title": "Hustý trávník bere plevelům prostor",
    "titleLevel": "h2",
    "photo": "fig-zasit-husty-travnik.avif",
    "photoRatio": "1:1",
    "caption": "Hustý porost nechává plevelům málo světla i místa. Jednotlivé odolné rostliny stačí vytáhnout ručně i s kořenem.",
    "body": [
      "**Naším cílem je vytvořit trávě tak dobré podmínky, aby pro plevel zbývalo co nejméně místa.** Dobře připravená půda, pravidelné sečení ve vhodné výšce, správná zálivka a přiměřená výživa pomáhají porostu houstnout.",
      "Plevelům pak ubývá prostor i světlo. Je to běh na dlouhou trať, klidně na dvě sezóny nebo déle. Trpělivá péče může zaplevelení výrazně omezit; odolnější jednotlivé rostliny odstraníme ručně.",
      "Postřik může odstranit současný plevel, ale nezlepší podmínky pro růst trávy. Pokud porost zůstane řídký a oslabený, další plevele dostanou příležitost. Dlouhodobý výsledek proto stavíme na hustém a zdravém trávníku, o který pravidelně pečujeme bez zbytečného používání herbicidů."
    ]
  },
  {
    "id": "K13",
    "side": "image-left",
    "surface": "krem",
    "eyebrow": "Kapitola 13",
    "title": "Co může ohrozit čerstvý výsev",
    "titleLevel": "h2",
    "drawing": "privalovy-dest",
    "alt": "Řez mírným svahem v prudkém dešti: nahoře zůstalo holé místo, semena voda odplavila dolů pod svah, kde leží na hromádce; povrch svahu po vyschnutí ztvrdne v krustu.",
    "caption": "Prudký déšť odplaví semena ze svahu dolů a naruší povrch, který po vyschnutí ztvrdne v krustu.",
    "body": [
      "**Před očekávaným přívalovým deštěm výsev raději odložíme.** Prudká voda může odplavit semena a narušit povrch půdy, na kterém po vyschnutí vznikne tvrdá krusta ztěžující vzcházení.",
      "**Přemokření, přehnojení a příliš hustý výsev mohou podporovat choroby mladé trávy.** Pokud rostlinky hnědnou nebo polehávají, nejprve zkontrolujeme vlhkost půdy. Další zálivka totiž může místo pomoci poškození zhoršit."
    ]
  },
  {
    "id": "K14",
    "side": "image-right",
    "surface": "bila",
    "eyebrow": "Kapitola 14",
    "title": "Kdy poprvé posekat nový trávník",
    "titleLevel": "h2",
    "drawing": "prvni-sec",
    "alt": "Mladý porost se stupnicí výšky: stébla sahají do 8 cm a linka řezu je v 6 cm. Pod tím příklad přerostlého porostu zkracovaného postupně z 12 na 8 a potom na 6 cm, pokaždé nejvýš o třetinu. Dole tři podmínky: rostliny drží v půdě, povrch unese sekačku, suché listy a ostrý nůž.",
    "caption": "Poprvé sekáme při výšce asi 8 cm a zkracujeme zhruba na 6 cm. Přerostlý porost snižujeme postupně, pokaždé nejvýš o třetinu.",
    "body": [
      "**U běžné zahradní směsi můžeme poprvé sekat, když tráva doroste přibližně do 8 cm. Při prvním sečení ji zkrátíme zhruba na 6 cm.** Pokud výrobce směsi doporučuje jinou výšku, řídíme se jeho pokyny. Rozhoduje stav porostu, nikoli přesný počet dnů od výsevu.",
      "Samotná výška ale nestačí. Rostliny musí v zemině držet a půda musí být dostatečně pevná, abychom v ní chůzí a sekačkou nevytvářeli hluboké stopy. Pokud se povrch pod nohama boří nebo se rostlinky při velmi lehkém tahu snadno uvolňují, ještě počkáme. Sekáme za suchých listů, ostrým nožem a ideálně lehčí sekačkou. Otáčíme se opatrně, abychom mladý porost nepoškodili.",
      "**Při jednom sečení odstraníme nejvýše třetinu výšky trávy.** Pokud nám tedy porost mezitím přerostl, nesnižujeme ho rovnou na 6 cm, ale upravíme výšku postupně během dalších sečení. Častější lehké zkrácení je šetrnější než jednorázový hluboký řez.",
      "Nemusíme čekat, až všechny trávy ve směsi dorostou stejně vysoko. První sečení může zkrátit hlavně rychlejší rostliny, které by jinak začaly pomalejším stínit. Péči o vláhu tím ale neukončujeme – některé složky směsi mohou stále klíčit nebo teprve vytvářet první kořínky."
    ]
  },
  {
    "id": "K15a",
    "side": "image-left",
    "surface": "bila",
    "eyebrow": "Kapitola 15",
    "title": "Zahrada někdy nakreslí mapu chyby",
    "titleLevel": "h2",
    "drawing": "mapa-chyby",
    "alt": "Pohled shora na trávník se třemi různými tvary problému: pravidelné rovnoběžné řídké pruhy, oválná prohlubeň s vodou a zakřivená stopa sekačky s poškozením v otočce.",
    "caption": "Tvar a poloha řídkého místa napoví příčinu: pravidelné pruhy, prohlubeň s vodou a stopa sekačky ukazují každá jinam.",
    "body": [
      "Když se výsev nedaří, první myšlenka často míří k novému balení osiva. Ještě před nákupem se vyplatí podívat na tvar a polohu problému. Pravidelný pruh, prohlubeň plná vody a poškození přesně v trase sekačky totiž vyprávějí různé příběhy."
    ]
  },
  {
    "id": "K15b",
    "side": "image-right",
    "surface": "bila",
    "continues": true,
    "photo": "fig-zasit-oprava.avif",
    "photoRatio": "3:2",
    "caption": "Oprava holého místa: nejdřív upravený povrch, potom osivo v dávce pro dané místo.",
    "body": [
      "Do poslední skupiny může patřit i moč zvířat, rozlité palivo nebo hnojivo vysypané při plnění rozmetadla. A ptáci na ploše nemusí vždy požírat osivo: pokud vytrhávají již zakořeněné části, mohou hledat půdní larvy. Jejich přítomnost sama ještě není důvodem použít insekticid.",
      "Prokazatelně smyté nebo zničené místo potřebuje jiný přístup než zdravý, pomalu vzcházející výsev. Při opravě nejprve odstraníme příčinu, upravíme povrch a zvolíme odpovídající dávku osiva. Zároveň znovu posoudíme zbývající příznivé období. U místa, které pouze čeká na pomalejší složku směsi, může být nejúčinnější péčí zachování vhodné vláhy a trochu trpělivosti."
    ]
  },
  {
    "id": "K16",
    "side": "image-left",
    "surface": "krem",
    "eyebrow": "Kapitola 16",
    "title": "Co z terasy nebylo vidět",
    "titleLevel": "h2",
    "photo": "fig-zasit-terasa-po.avif",
    "photoRatio": "1:1",
    "caption": "Tentýž pohled z terasy o několik týdnů později. Zelená už je vidět; jak pevně drží, ukážou až kořeny.",
    "body": [
      "Když se konečně objeví první zelené špičky, čekání z úvodu článku skončí. Pod povrchem se ale dál rozhoduje o tom, jak pevný trávník vznikne: zda kořeny nacházejí vodu, vzduch a prostor a zda se příliš mnoho semenáčků nemusí dělit o stejné světlo. Následky rozdílů v péči se mohou naplno projevit až při prvním suchu nebo pravidelném používání.",
      "Nejcennější součástí péče proto bývá schopnost všimnout si změny: půda začíná vysychat rychleji, pomalejší trávy právě vzcházejí, kořeny už dosahují hlouběji, povrch konečně unese sekačku. Na každou z těchto situací odpovídáme trochu jinak.",
      "Na začátku jsme do půdy vložili drobná semena. Pevný trávník z nich vznikne postupně, když jednotlivé rostliny dokážou využít vodu, vzduch, světlo a čas, který jsme jim nechali."
    ]
  }
]

/** Pořadí bloků mezi souhrnem a zdroji: dvousloupce, tabulky a předěl. */
export const SEEDING_ORDER: string[] = ["U","K01","K02","K03a","K03b","K04","TAB1","K05a","K05b","K06a","K06b","K07","PREDEL","K08","K09a","K09b","K09c","K10","MYKO","K11","K12","K13","K14","K15a","TAB2","K15b","K16"]

export const SEEDING_TABLES: Record<string, SeedingTable> = {
  "TAB1": {
    "blockName": "Doba do vzejití podle druhu trávy",
    "surface": "krem",
    "width": "prose",
    "heading": "Přibližná doba do viditelného vzejití za příznivých podmínek",
    "columns": [
      "Tráva",
      "Doba do vzejití"
    ],
    "head": [
      "Tráva",
      "Přibližná doba do viditelného vzejití za příznivých podmínek"
    ],
    "rows": [
      [
        "Jílek vytrvalý",
        "Často kolem 5–8 dnů."
      ],
      [
        "Kostřava červená",
        "Často přibližně 15–20 dnů; podle odrůdy a podmínek může být rychlejší."
      ],
      [
        "Lipnice luční",
        "Často přibližně 21–28 dnů."
      ],
      [
        "Kostřava rákosovitá",
        "Za chladnějších jarních podmínek může potřebovat zhruba 14–21 dnů; v teplejší vhodné půdě bývá rychlejší."
      ]
    ],
    "note": "Tabulka popisuje orientaci, nikoli termín dodání. Některé jemnolisté kostřavy mohou ve velmi příznivém prostředí vyklíčit už přibližně za 5–12 dnů, jiné jsou pomalejší. Chlad, vysychání nebo nevhodná hloubka mohou čekání prodloužit u celé směsi. Proto nemá smysl po týdnu automaticky přisypat další osivo do všeho, co ještě není zelené. Za další dva týdny bychom mohli zjistit, že jsme zaseli dvakrát."
  },
  "TAB2": {
    "blockName": "Co pozorujeme a co ověřit",
    "surface": "krem",
    "width": "prose",
    "heading": "Co může napovědět a co ověřit dál",
    "columns": [
      "Co pozorujeme",
      "Co ověřit"
    ],
    "head": [
      "Co pozorujeme",
      "Co může napovědět a co ověřit dál"
    ],
    "rows": [
      [
        "Po týdnu jsou vidět jen řídké zelené špičky.",
        "Porovnáme složení směsi, teplotu a vláhu. Pomalejší druhy mohou teprve vzcházet; plošný dosev by mohl původní dávku zbytečně zdvojit."
      ],
      [
        "Objevují se pravidelné řídké pruhy.",
        "Zkontrolujeme záběr rozmetadla i skutečné pokrytí závlahou. Tvar problému může odpovídat trase stroje nebo suchým okrajům postřiku."
      ],
      [
        "U spodního okraje svahu vznikají husté ostrůvky.",
        "Hledáme stopy smyvu. Nejdříve řešíme pohyb vody a ochranu povrchu, teprve potom chybějící místa opravujeme."
      ],
      [
        "Povrch je mokrý, ale mladý porost strádá.",
        "Ověříme vláhu v celé vrstvě, kam už sahají kořeny, i možné přemokření. Lesklý povrch neprozradí, co se děje pod ním."
      ],
      [
        "Rostlinky tmavnou a rychle polehají.",
        "Prověříme vláhu, hustotu, hnojení a možnost infekce. Při rychlém šíření má smysl odborně určit příčinu."
      ],
      [
        "Po sečení zůstává poškození v pruzích nebo otočkách.",
        "Kontrolujeme ostrost nože, výšku řezu, vytržení rostlin a únosnost půdy."
      ],
      [
        "Stejné místo selhává znovu a znovu.",
        "Hledáme příčinu ve stínu, zhutnění, suti, odvodnění, kořenech okolních rostlin nebo chemickém poškození."
      ]
    ]
  }
}

/** Předěl přes celou šířku: mezi výsevem a zálivkou. */
export const SEEDING_BLEED = {
  filename: 'fig-zasit-prvni-zalivka-v2.avif',
  caption: 'První zálivka po výsevu: jemný postřik, který půdu navlhčí a semena nepřemístí.',
}
