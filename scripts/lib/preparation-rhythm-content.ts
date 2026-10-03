/**
 * Rytmus obraz/text článku „Jak připravit a uložit směs" (2026-09-23).
 *
 * Majitel: „Sloupeček textu ve středu monitoru je špatně" – každý úsek
 * autorova textu stojí vedle vlastního obrazu, strany se střídají
 * R L R L R L R, předěl přes celou šířku, L R L (DESIGN.md 8.2b, ADR-006).
 * Plán vybrala porota tří návrhů; texty jsou autorovy odstavce rozdělené
 * jen na hranicích vět (98/98 vět ve stejném pořadí), nové jsou jen popisky.
 * Soubor je vygenerovaný z ověřeného plánu – text needitovat ručně.
 */
export type RhythmSection = {
  id: string
  side: 'image-left' | 'image-right'
  surface: 'bila' | 'krem'
  eyebrow?: string
  title?: string
  titleLevel?: 'h2' | 'h3'
  continues?: boolean
  drawing?: string
  photo?: string
  photoRatio?: '4:5' | '1:1' | '2:3'
  alt?: string
  caption: string
  body: string[]
}

export const RHYTHM_SECTIONS: RhythmSection[] = [
  {
    "id": "S1",
    "side": "image-right",
    "surface": "bila",
    "eyebrow": "Kapitola 01",
    "title": "Jak směs připravit a uložit při skutečné práci",
    "titleLevel": "h2",
    "photo": "fig-dodavka-materialu-ctverec.avif",
    "photoRatio": "1:1",
    "caption": "Dodávka na plachtě: písek, zemina a pytle s příměsemi. Každá surovina má ve směsi jiné místo a jinou hloubku.",
    "body": [
      "Výběr složek a modelové hloubky od povrchu dolů popisuje článek [Písek, biochar a další příměsi: jak namíchat půdu pro trávník](/magazin/pisek-biochar-a-dalsi-primesi). Potřebné množství pro vlastní plochu spočítá [Kalkulátor půdy pod trávník](/magazin/kalkulator-na-planovani-pudniho-profilu). Zde navazujeme přípravou podloží, skutečnou prací se směsí, výsevem a první péčí o trávník.",
      "Správně vybrané materiály a vhodné poměry ještě nejsou hotovým prostředím pro kořeny. Rozhoduje i zacházení se zeminou a způsob uložení směsi.",
      "Průjezd po mokrém jílu může zanechat utuženou vrstvu, kterou několik centimetrů pěkné navážky před vodou ani kořeny neschová."
    ]
  },
  {
    "id": "S2",
    "side": "image-left",
    "surface": "bila",
    "title": "Nejdříve poznat a připravit podloží",
    "titleLevel": "h3",
    "photo": "fig-ryc-zahon-ctverec.avif",
    "photoRatio": "1:1",
    "caption": "Světlé hroudy jsou vyschlá udusaná vrstva. Oschlá se pod rýčem láme, mokrá by se jen roztírala.",
    "body": [
      "Při rekonstrukci se už po odkrytí ukáže, zda pod povrchem leží zhutnění, stavební suť nebo kusy pohřbeného dřeva. Použitelnou zeminu má smysl uchovat odděleně od nevhodné spodiny. Budeme-li ji vracet do směsi, potřebujeme vědět, s jakým materiálem skutečně pracujeme.",
      "Důležitý je také okamžik, kdy se do práce pustíme. Vlhká hrouda, kterou lze rozdrobit, se chová jinak než mazlavý jíl, který nástroj roztáhne do hladké plochy. Někdy je proto nejúčinnější zásah prosté vyčkání, až půda oschne do zpracovatelného stavu. Další práce pak nebude jen napravovat škody vzniklé při předchozím kroku.",
      "Po odkrytí odstraníme stavební suť a pohřbené dřevo. Utuženou vrstvu rozrušíme ještě před uložením nové směsi, až bude půda dostatečně oschlá, aby se při práci drobila. Na malé ploše lze použít rycí vidle, na velké se vyplatí domluvit odpovídající mechanizaci s realizátorem. Cílem je uvolnit souvislou tvrdou překážku, nikoli ji jen překrýt nakypřenou zeminou.",
      "Pokud se v odkryté půdě trvale drží voda, vyřešíme s realizátorem její odtok před další navážkou. Samotná propustnější směs nahoře tento problém neodstraní."
    ]
  },
  {
    "id": "S3",
    "side": "image-right",
    "surface": "krem",
    "title": "Dodávky a míchání přizpůsobit rozsahu zahrady",
    "titleLevel": "h3",
    "photo": "fig-useky.avif",
    "photoRatio": "4:5",
    "caption": "Jeden vyznačený úsek a jeho podíl písku v několika hromádkách. Sousední úseky dostanou svůj.",
    "body": [
      "Na větší zahradě přivážíme materiál v tunách a kubických metrech. Rozdělíme plochu na zvládnutelné pracovní úseky a pro každý rozprostřeme přibližný podíl zeminy a písku podle zvolené receptury. Tak udržíme podobnou směs na celé ploše. Když nemáme prostor pro všechny hromady najednou, mohou stejně navazovat i jednotlivé dodávky.",
      "Objednávka stále vychází z objemových poměrů a přepočtu podle sypných hustot dodavatele. V terénu stačí rozdělit plánované množství mezi pracovní úseky, vysypat jej rovnoměrně a promíchat.",
      "Nemusíme na milimetr vyznačovat hranice zón ani řešit malé odchylky v mnohatunové dodávce; důležité je nenechat všechen písek nebo zeolit jen v jednom místě. Vážní lístek pomáhá kontrolovat dodanou hmotnost, nikoli přesný objem v půdě.",
      "Smyslem je udržet přibližné podíly v celém zpracovávaném objemu a materiály rovnoměrně rozptýlit. U mnohatunové minerální směsi nepomůže složitě dohánět rozdíl několika kilogramů, pokud zůstane biochar v jednom pruhu a zeolit v jiném. Menší příměsi, osivo a přípravky s konkrétním návodem přesto dávkujeme podle jejich účelu a doporučené spotřeby."
    ]
  },
  {
    "id": "S4a",
    "side": "image-left",
    "surface": "bila",
    "title": "Nejprve promíchat minerální základ, potom příměsi mělčeji",
    "titleLevel": "h3",
    "drawing": "michani-od-hloubky",
    "caption": "Každý průchod jde mělčeji: základ promícháme v celých 30 cm, zeolit u výchozího příkladu kalkulátoru do 15 cm, biochar a Actino jen do horních 10 cm.",
    "body": [
      "Nejprve postupujeme podle zvoleného režimu: při udržení výšky odebereme vypočtené množství původní zeminy, při zapravení ji ponecháme a pro novou vrstvu připravíme dováženou zeminu. Pokud receptura obsahuje písek, rozložíme jej rovnoměrně po pracovních úsecích a promícháme se zeminou v plánované hloubce profilu – u zdejšího modelu přibližně 30 cm.",
      "Rotavátor může pomoci, ale běžný zahradní stroj často nepromíchá celých 30 cm jediným průjezdem. Potřebnou hloubku ověříme podle stroje a stavu půdy; při větší hloubce použijeme odpovídající mechanizaci nebo jiný způsob promíchání. Samotné prokypření podloží neznamená, že se do něj písek skutečně dostal.",
      "Teprve po promíchání minerálního základu rozprostřeme zeolit po ploše. Zapravíme jej mělčeji, do hloubky zadané v receptuře: třeba přibližně do horních 20 cm, pokud s nimi výpočet počítá. Výchozí jílovitý příklad kalkulátoru používá 15 cm; rozhodnete-li se pro 20 cm, změňte hloubku v kalkulátoru ještě před objednávkou.",
      "Pro mělčí přejezd nastavíme pracovní hloubku rotavátoru podle stroje. Rychlejší pojezd může promíchání omezit, ale sám nezaručí, že zeolit neskončí v celých 30 cm."
    ]
  },
  {
    "id": "S4b",
    "side": "image-right",
    "surface": "bila",
    "continues": true,
    "drawing": "kontrola-sondou",
    "alt": "Tři vývrty sondou do 30 cm z téže plochy. V prvním leží biochar a Actino v horních 10 cm a zeolit do 15 cm. Ve druhém zůstala příměs nahromaděná na jednom místě. Ve třetím jsou příměsi po hlubokém frézování rozptýlené až na dno.",
    "caption": "Sonda na třech místech téže plochy: příměsi ve své hloubce, hromádka, která zůstala na jednom místě, a příměsi roznesené hlubokým frézováním až na dno.",
    "body": [
      "Nakonec rovnoměrně rozprostřeme biochar a případné Actino (dříve Biovin), pokud je receptura řadí do horních 10 cm. Hráběmi je zapravíme do povrchové části; mají-li být promíchané skutečně v celých 10 cm, pomůže mělké ruční prokypření nebo stroj nastavený na tuto hloubku.",
      "Hrábě samy deset centimetrů spolehlivě nepromíchají. Po tomto kroku se nevracíme k hlubokému frézování, které by mělčí příměsi rozneslo po celém profilu.",
      "Stejný sled platí pro každou zvolenou směs: nejhlouběji promícháme složky jejího minerálního základu, další příměsi přidáváme podle jejich vlastní hloubky od hlubší k mělčí. Rozprostíráme je postupně po úsecích, nikoli v čistých patrech.",
      "Rýčem nebo malou sondou na několika místech orientačně zkontrolujeme, zda ve směsi nezůstaly hromádky a zda příměsi nejsou zbytečně rozptýlené až na dno. Přesnost na milimetry nepotřebujeme. Déšť za nás pevná zrnka do potřebné hloubky nepromíchá."
    ]
  },
  {
    "id": "S5",
    "side": "image-left",
    "surface": "krem",
    "title": "Čas na slehnutí není prázdné čekání",
    "titleLevel": "h3",
    "photo": "fig-louze.avif",
    "photoRatio": "1:1",
    "caption": "Louže po zálivce prozradí místo, kde povrch ještě klesá. Tam se po ustálení doplní směs.",
    "body": [
      "Po urovnání a zavlažení začne čerstvě nakypřená směs sedat. Částice a póry se nově uspořádávají, takže se může měnit i výška povrchu. Samotné sedání proto není závada; patří k tomu, že jsme materiál nejprve nakypřili, promíchali a znovu uložili.",
      "V návrhu počítáme orientačně s několika týdny, přibližně **2–6**, u lehké půdy někdy kolem **dvou týdnů**. Kalendář ovšem nerozhodne, zda už povrch přestal klesat.",
      "Sledujeme skutečný stav. Teprve když se výšky ustálí, doladíme nerovnosti a připravíme jemnější seťové lůžko – povrchovou vrstvu, do které přijde osivo.",
      "Čekání může přinést i praktickou výhodu: plevele, které mezitím vzejdou, lze ještě před výsevem trávy mělce odstranit. Do konečné přípravy tak vstupujeme s ustálenějším povrchem a bez těchto čerstvě vzešlých rostlin."
    ]
  },
  {
    "id": "S6",
    "side": "image-right",
    "surface": "bila",
    "title": "Mykorhizu umístit tam, kde se setká s mladými kořeny",
    "titleLevel": "h3",
    "drawing": "mykorhiza-pod-osivem",
    "alt": "Dva řezy půdou do 30 cm se stejnou dávkou mykorhizního přípravku. Vlevo leží přípravek v pásu asi 3 cm pod osivem a první kořínky do něj vrůstají. Vpravo je tatáž dávka rozptýlená do celé hloubky; kořínky dosáhnou jen k nejmělčí značce přípravku a většina dávky leží hlouběji.",
    "caption": "Stejná dávka, jiné místo. Pás zhruba 3 cm pod osivem potká první kořínky hned; rozptýlený do 30 cm leží většinou tam, kam mladé kořeny ještě nedosáhnou.",
    "body": [
      "Pokud jsme se pro mykorhizní přípravek rozhodli, jeho umístění se řídí návodem konkrétního výrobku. Pro přípravek TurfComp výrobce při výsevu popisuje aplikaci přibližně **3 cm pod osivo**.",
      "Při pokládce travního koberce přijde na připravený povrch pod něj. Podstatný je budoucí kontakt s kořeny; rovnoměrné rozptýlení stejné dávky do celých třiceti centimetrů by sledovalo jiný cíl.",
      "Přípravek rozprostřeme rovnoměrně v místě budoucích kořenů a dál postupujeme podle návodu k výsevu nebo pokládce koberce. Při ošetření hotového trávníku použijeme návod pro dodatečnou aplikaci; postup určený pod osivo na povrchu již založeného porostu nenapodobujeme."
    ]
  },
  {
    "id": "K2",
    "side": "image-left",
    "surface": "bila",
    "eyebrow": "Kapitola 02",
    "title": "Několik kilogramů semen nad desítkami tun připravené půdy",
    "titleLevel": "h2",
    "photo": "fig-osivo-luzko.avif",
    "photoRatio": "4:5",
    "caption": "Po lehkém přiválení leží zrna naplocho přitlačená k půdě; zapravují se jen mělce, ne hluboko.",
    "body": [
      "Po úvahách o tunách písku, objemu biocharu a hloubce kořenového prostředí přichází na řadu něco překvapivě lehkého: travní semeno. Pro řadu rekreačních směsí se uvádí [25–30 g osiva na metr čtvereční](https://www.agrostis.cz/katalog/travni-smesi/rekreacni-smesi). Na sto metrů čtverečních tak připadá přibližně **2,5–3 kg semen**. Desítky tun připraveného prostředí budou sloužit rostlinám, které se na začátku vejdou do několika kilogramů osiva.",
      "### Výsev potřebuje vhodné podmínky a mělké uložení",
      "Travní směs vybíráme podle světla, očekávané zátěže a dostupné závlahy. V běžných českých podmínkách přichází v úvahu jaro nebo konec léta; konkrétní termín závisí na teplotě a vláze.",
      "Rovnoměrnosti pomáhá křížový výsev: dávku rozdělíme na dvě poloviny a druhou rozsejeme napříč směru první. Mělké zapravení a lehké přiválení zlepší kontakt semen s půdou. Podrobnosti se řídí konkrétní směsí. Drobné semeno má omezenou zásobu energie, a pokud ho zahrabeme hluboko, může obtížně vzcházet."
    ]
  },
  {
    "id": "S9",
    "side": "image-right",
    "surface": "krem",
    "title": "První kořínek ještě nedosáhne do připravené zásoby",
    "titleLevel": "h3",
    "drawing": "prvni-korinek",
    "caption": "Kořínek zatím sahá asi 3 cm, voda leží ve 13 cm. Dokud k ní nedoroste, zalévá se jen horní vrstva, jemně a v krátkých dávkách.",
    "body": [
      "Třiceticentimetrový profil je připravený, ale právě klíčící rostlina z něj zatím dokáže využívat jen malou část. Voda deset centimetrů pod prvním kořínkem může být v této chvíli stejně nedosažitelná jako voda na druhé straně zahrady.",
      "Proto se režim čerstvého výsevu liší od režimu zakořeněného trávníku. Jemnou zálivkou udržujeme vlhké seťové lůžko; podle počasí ji můžeme opakovat v krátkých dávkách. S postupným růstem kořenů do hloubky se rostlinám otevírá další prostor a mění se i vhodný interval zavlažování.",
      "[Principy závlahy trávníků](https://extension.psu.edu/principles-of-turfgrass-irrigation) proto spojují dávku vody s vlastnostmi půdy i dosahem kořenů. Připravená zásoba má význam teprve tam, kde k ní rostlina získá přístup."
    ]
  },
  {
    "id": "S10",
    "side": "image-left",
    "surface": "bila",
    "title": "První zelené čárky ještě nejsou hotový porost",
    "titleLevel": "h3",
    "photo": "fig-mlady-porost.avif",
    "photoRatio": "4:5",
    "caption": "Stébla různé výšky a mezi nimi ještě holá půda: porost teprve přichází. Jak bude vypadat za pár let, už rozhodlo to, co leží pod povrchem.",
    "body": [
      "Ani jednotlivé trávy nevzcházejí současně. Jílek bývá rychlejší, zatímco lipnice může potřebovat několik týdnů. To, co se zazelená jako první, proto ještě nepředstavuje konečnou podobu porostu. Další rostliny mohou teprve přicházet na řadu.",
      "U běžného zahradního trávníku připadá první sečení přibližně na výšku **8–10 cm**, pokud už rostliny drží v půdě a povrch unese sekačku. Samotná výška tedy není jedinou podmínkou. Ostrým nožem odebereme **nejvýše třetinu výšky**. Praktické souvislosti zakládání popisuje také [Agrostis](https://www.agrostis.cz/odborne-clanky/jak-zalozit-novy-travnik-zakladani-travniku).",
      "Navenek může být výsledek docela obyčejný: zelená plocha, po které se dá přejít naboso. Pod ní však zůstává výsledek mnoha rozhodnutí. Kolik prostoru dostala jednotlivá zrna. Zda jemné částice nezaplnily příliš mnoho mezer. Kde se drží voda, kudy odchází její přebytek a kam mohou dosáhnout živé kořeny.",
      "Po dešti se rozdíly mezi zahradami znovu ukážou. Na každé potřebujeme změnit něco jiného, i když pracujeme se stejnými druhy surovin. O výsledku rozhodlo jejich množství, rozmístění a to, jak spolu fungují v konkrétní půdě.",
      "Dobře připravená směs se tak nejlépe pozná v běžném životě trávníku: po vydatném dešti, během suchého týdne i podle toho, kam až mohou pokračovat jeho kořeny."
    ]
  }
]

/** Předěl přes celou šířku stojí za tímto oddílem (před kapitolou 02). */
export const BLEED_AFTER = 'S6'
export const BLEED = {
  filename: 'fig-pripravena-plocha.avif',
  caption: "Urovnané a slehlé lůžko před výsevem, na jeho okraji pytel osiva.",
}
