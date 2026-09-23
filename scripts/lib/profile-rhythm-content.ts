/**
 * Rytmus obraz/text článku „Kalkulátor půdy pod trávník" (2026-09-23).
 *
 * Stejná přestavba jako u článku o přípravě (DESIGN.md 8.2b p. 8): každý
 * úsek textu vedle vlastního obrazu, kapitola = eyebrow + H2 uvnitř splitu,
 * pás kalkulátoru hned za kapitolou „Co zadat". Plán vybrala porota tří
 * návrhů (kresba vykládá výpočet 20 b.) + roubování fotek ze série.
 * Texty jsou autorovy odstavce rozdělené jen na hranicích vět (97/97 vět,
 * 8/8 nadpisů); nové jsou jen popisky a alty. Vygenerováno z ověřeného
 * plánu — text needitovat ručně.
 */
import type { RhythmSection } from './preparation-rhythm-content'

export const PROFILE_RHYTHM_SECTIONS: RhythmSection[] = [
  {
    "id": "K01",
    "side": "image-right",
    "surface": "bila",
    "eyebrow": "Kapitola 01",
    "title": "Co zadat do kalkulátoru půdy pod trávník",
    "titleLevel": "h2",
    "photo": "fig-mereni-plochy.avif",
    "photoRatio": "2:3",
    "caption": "Do výpočtu patří jen plocha, kterou skutečně upravíte; cesta a záhon zůstávají mimo pásmo.",
    "body": [
      "Nejprve rozhodněte, co vaše půda potřebuje změnit. Výchozí předvolby slouží k porovnání možností, nejsou univerzálním doporučením pro každou zahradu. Účel surovin a rozsahy jejich podílů vysvětluje článek [Písek, biochar a další příměsi: jak namíchat půdu pro trávník](/posts/pisek-biochar-a-dalsi-primesi).",
      "Pro vlastní výpočet zadejte plochu v m², hloubku profilu v cm a způsob úpravy terénu. U každé příměsi nastavte podíl i hloubku zapravení. Výsledky níže v článku ukazují jeden konkrétní příklad bez rezervy; kalkulátor je přepočítá podle vašich vstupů.",
      "Plochu měřte jen tam, kde budete půdu skutečně upravovat. Odečtěte cesty, terasu a záhony. Má-li zahrada výrazně odlišné části, spočítejte je jednotlivě: stejná receptura nemusí dávat smysl u vlhkého jílovitého kouta a na rychle vysychajícím svahu. Objednávky pak sečtěte po materiálech.",
      "Hloubka profilu znamená tloušťku půdy, se kterou ve výpočtu pracujete. Výchozích 30 cm je model, nikoli pokyn celou zahradu tak hluboko vykopat. U Actina (dříve Biovin), zeolitu a biocharu zadáváte vlastní hloubku od povrchu: například 10 cm znamená zapravení do celé vrstvy 0–10 cm. Žádná příměs nemá sahat pod zvolený profil.",
      "Předvolba typu půdy nastaví výchozí poměry. Jakmile podíly upravíte, pracujete s vlastní recepturou. Zkontrolujte nejen procenta, ale i hloubky: stejný podíl ve dvakrát hlubší vrstvě znamená při stejné ploše dvojnásobné množství příměsi. Po změně vstupů proto znovu projděte celý výsledek."
    ]
  },
  {
    "id": "K02",
    "side": "image-right",
    "surface": "bila",
    "eyebrow": "Kapitola 02",
    "title": "Udržet výšku, zapravit, nebo vytvořit novou vrstvu?",
    "titleLevel": "h2",
    "photo": "fig-lat-u-chodniku.avif",
    "photoRatio": "4:5",
    "caption": "Lať z chodníku ukáže, o kolik nová vrstva přeroste dlažbu. Při zapravení povrch roste, při udržení výšky část zeminy odjede.",
    "body": [
      "Režim „Udržet výšku“ zvolte, pokud má povrch zůstat ve stejné úrovni. V modelu nejprve odeberete část zeminy a její objem nahradíte pískem a příměsmi. Výsledek rozlišuje zachovanou zeminu, dovážený materiál a zeminu k odvozu. Předpokládá, že ponechaná půda je pro směs použitelná.",
      "Režim „Zapravit“ počítá s ponecháním původní zeminy v celé zadané hloubce a s přidáním materiálů. Zadaná hloubka zde popisuje původní zeminu; výsledný profil bude vyšší. Hloubky příměsí se přitom měří od nového povrchu.",
      "Vyšší požadovaný podíl písku může znamenat překvapivě velký dovoz i nárůst výšky; zkontrolujte návaznost na terasu, chodníky a odtok vody. Nelze současně všechnu půdu ponechat, přivézt velký objem a očekávat stejnou výšku.",
      "Režim „Nová vrstva“ plánuje celý objem připravované vrstvy z dodaných složek, včetně zeminy. Použijte jej, když skutečně objednáváte novou směs. Samotná volba režimu nepotvrzuje vhodnost podloží ani neřeší jeho zhutnění a odvodnění. Nezapočítává automaticky případné odstranění starého terénu pod novou vrstvou."
    ]
  },
  {
    "id": "K03",
    "side": "image-left",
    "surface": "bila",
    "eyebrow": "Kapitola 03",
    "title": "Jak se počítá objem půdy a jednotlivých příměsí",
    "titleLevel": "h2",
    "drawing": "podil-z-vlastni-hloubky",
    "alt": "Dva řezy profilem 30 cm pod plochou 100 m² se stejným podílem zeolitu 2 %. Vlevo leží zeolit jen ve vrstvě 0–15 cm: jeho zóna má 15 m³ a 2 % z ní jsou 0,30 m³, tedy 300 litrů. Vpravo pro srovnání tatáž dvě procenta v celých 30 cm: z 30 m³ je to 0,60 m³, tedy 600 litrů, dvojnásobek. Dole pomůcka: vrstva vysoká 1 cm na ploše 1 m² má 10 litrů.",
    "caption": "Vlevo zóna zeolitu 0–15 cm, vpravo pro srovnání totéž procento v celém profilu. Deska dole je pomůcka pro odhad objemu.",
    "body": [
      "Základní vztah je objem = plocha × hloubka v metrech. Pro 100 m² a 30 cm tedy počítáme 100 × 0,30 = 30 m³. Jeden kubík představuje 1 000 litrů. Praktická pomůcka: vrstva vysoká 1 cm na ploše 1 m² má objem 10 litrů.",
      "Podíl příměsi se vztahuje k objemu od povrchu do její vlastní hloubky. Například zeolit při 2 % do 15 cm na ploše 100 m²: 100 × 0,15 × 0,02 = 0,30 m³, tedy 300 litrů. Nepočítáme jej ze všech 30 m³ profilu. Také Actino a biochar mají svůj výpočet podle zadané hloubky."
    ]
  },
  {
    "id": "K03b",
    "side": "image-right",
    "surface": "bila",
    "continues": true,
    "drawing": "slehnuti-vstupu",
    "caption": "Čárkovaná linka ukazuje prostý součet obou vstupů. Slehlá směs může skončit pod ní, když jemné částice zeminy zapadnou do mezer v písku. Poměr proto odměřujeme ze vstupů a výšku ověříme na zahradě.",
    "body": [
      "Příměsi zabírají část připravovaného objemu. Teprve zbývající minerální základ dělíme mezi písek a zeminu. Poměr 65/35 proto znamená 65 % písku a 35 % zeminy z tohoto zbytku, nikoli dalších 65 % písku nad celou směs. V horní části mohou být současně všechny tři příměsi, hlouběji už jen některé.",
      "### Proč 30 m³ surovin nemusí dát 30 m³ slehlé směsi",
      "Objemové podíly odměřujeme **před promícháním**. Jemnější částice mohou zapadnout mezi hrubší a při ukládání se mění póry. Součet vstupů proto nezaručuje stejný objem po slehnutí.",
      "Výpočet dává základ pro plánování dodávky. Skutečnou výšku kontrolujte při práci; rezervu zvolte podle materiálů a způsobu ukládání. V objednávce ji veďte odděleně, aby nezměnila zamýšlený poměr složek."
    ],
    "alt": "Vlevo dva zvlášť odměřené sloupce: vyšší s hrubším pískem a nižší s jemnější zeminou. Vpravo stejně široký sloupec jejich směsi po promíchání a slehnutí: písek s drobnými částicemi zeminy v mezerách. Čárkovaná linka nad ním leží ve výšce obou vstupů dohromady. Hladina směsi končí pod ní, protože jemnější částice zapadly do mezer mezi hrubšími."
  },
  {
    "id": "K04",
    "side": "image-left",
    "surface": "krem",
    "eyebrow": "Kapitola 04",
    "title": "Příklad: kolik materiálu potřebujete pro 100 m² jílovité zahrady",
    "titleLevel": "h2",
    "drawing": "odecet-primesi",
    "alt": "Tři vodorovné pruhy po 30 m³ na společném měřítku. První je celý profil 100 m² × 30 cm. Ve druhém si příměsi vezmou místo jako první; jejich tenký proužek ukazuje výřez pod pruhem zvětšený 27×: Actino 0,25, zeolit 0,30 a biochar 0,20 m³, dohromady 0,75 m³. Zbývá 29,25 m³ minerálního základu. Ve třetím se základ dělí v poměru 65/35 na 19,01 m³ písku k dovozu a 10,24 m³ zeminy, která zůstane.",
    "caption": "Tři kroky na jednom měřítku: celý profil, příměsi zvětšené ve výřezu, dělení minerálního základu na písek a zeminu.",
    "body": [
      "Uvažujme výraznou přestavbu, pro kterou jste po posouzení půdy zvolili písčitější směs. Nastavte 100 m², profil 30 cm, režim „Udržet výšku“ a nulovou rezervu. Minerální základ rozdělte 65/35 mezi písek a původní zeminu. Actino zaujímá 2,5 % do 10 cm, zeolit 2 % do 15 cm a předem živinami obohacený biochar 2 % do 10 cm. To odpovídá výchozí jílovité předvolbě.",
      "Příměsi zaberou 0,25 + 0,30 + 0,20 = 0,75 m³. Z původních 30 m³ zbývá 29,25 m³ minerálního základu. Jeho 65 % tvoří 19,0125 m³ písku a 35 % představuje 10,2375 m³ ponechané zeminy. Čísla v přehledu jsou zaokrouhlená; pro kontrolu součtu používejte nezaokrouhlené hodnoty.",
      "Celých 30 m³ tedy neobjednáváte. Přibližně 10,24 m³ vhodné původní zeminy zůstává na místě a dovoz ji doplní. Objem odvozu popisuje odebranou půdu v původním profilu; po nakypření může na korbě zabrat jiné místo. Ani jílovitá půda sama o sobě neznamená, že je tato rozsáhlá přestavba nutná."
    ]
  },
  {
    "id": "K04v",
    "side": "image-right",
    "surface": "krem",
    "title": "Těžší hlinitá zahrada: menší podíl písku",
    "titleLevel": "h3",
    "drawing": "pisek-podle-predvolby",
    "alt": "Tři sloupce písku, se kterým počítají výchozí předvolby kalkulátoru na 100 m² a profil 30 cm v režimu Udržet výšku: jílovitá zahrada 19,01 m³, asi 28,5 tuny, poměr písku a zeminy v minerálním základu 65/35; hlinitá 8,78 m³, asi 13,2 tuny, poměr 30/70; písčitá bez dalšího písku. Metr krychlový písku váží asi 1,5 tuny.",
    "caption": "Stejných 100 m² a 30 cm: výchozí předvolby počítají u jílovité zahrady s dovozem 19,01 m³ písku, u hlinité s 8,78 m³ a u písčité bez dalšího písku.",
    "body": [
      "U těžší hlinité zahrady s udržovanou ornicí vychází model z poměru písku a zeminy 30/70 v minerálním základu. Výchozí varianta Actino nepřidává; ostatní podíly přizpůsobte potřebám půdy.",
      "Pokud půda dobře přijímá vodu a kořeny jí prorůstají, nevyplývá z předvolby povinnost ji přestavovat. Než tento model použijete, ověřte, zda odpovídá vaší zahradě. Rozpoznáním půdy vás provede článek [Krásný trávník začíná pod zemí](/posts/krasny-travnik-zacina-pod-zemi-2#pisek-jil-nebo-hlina-prozradi-to-vase-dlan).",
      "### Písčitá zahrada: bez dalšího písku",
      "U chudé, rychle vysychající písčité zahrady model další písek nepřidává. Pozornost směřuje k zadržení vody a živin pomocí vhodně zvolených příměsí. Nestačí však jen zvýšit jejich procenta: zohledněte současnou organickou hmotu, hloubku úpravy i konkrétní materiál.",
      "Vyšší dávka není automaticky lepší a dvě písčité zahrady nemusí potřebovat stejnou směs. Jak písčitou půdu poznat a co sledovat, vysvětluje článek [Krásný trávník začíná pod zemí](/posts/krasny-travnik-zacina-pod-zemi-2#pisek-jil-nebo-hlina-prozradi-to-vase-dlan)."
    ]
  },
  {
    "id": "K05",
    "side": "image-left",
    "surface": "bila",
    "eyebrow": "Kapitola 05",
    "title": "Od kubíků k tunám, litrům a balením",
    "titleLevel": "h2",
    "photo": "fig-vazeni-kbeliku.avif",
    "photoRatio": "4:5",
    "caption": "Kbelík s deseti litry volně nasypaného písku: při sypné hustotě 1,5 t/m³ váží kolem 15 kg.",
    "body": [
      "Objem určuje poměr směsi, prodejní jednotka určuje objednávku. Převod na hmotnost používá sypnou hustotu, tedy hmotnost volně nasypaného materiálu včetně mezer mezi částicemi. Platí hmotnost = objem × sypná hustota. V našem příkladu tak 19,0125 m³ písku při 1,5 t/m³ představuje přibližně 28,52 t.",
      "Písek běžně plánujeme v tunách, Actino a zeolit v kilogramech, biochar v litrech. Konkrétní balení ověřte u výrobku. Pokud například zvolený zeolit koupíte v pytlích po 20 kg, potřebných 240 kg znamená 12 pytlů. Neúplný počet balení zaokrouhlete nahoru; přebytek není pokyn automaticky zvýšit dávku ve směsi.",
      "Vlhkost, zrnitost a složení výrobku mohou převod změnit. U biocharu je modelových 0,2 kg/l pouze výpočetní předpoklad; stejných 200 litrů navlhčeného nebo obohaceného výrobku může vážit jinak.",
      "Ověřte také, zda kupujete samotný biochar, nebo směs s kompostem. Kompost a jiné pevné nosiče mají vlastní objem, který je třeba do receptury započítat zvlášť. Kalkulátor složení takového výrobku sám nerozpozná."
    ]
  },
  {
    "id": "K05b",
    "side": "image-right",
    "surface": "bila",
    "continues": true,
    "drawing": "rezerva-deleni",
    "alt": "Dva pruhy biocharu ve stejném měřítku pod vzorcem objednávka = čisté množství ÷ (1 − rezerva/100); čárkovaná linka značí potřebu směsi 200 litrů. Horní: 200 ÷ 0,9, tedy objednávka přibližně 222 litrů; z ní 10 % úbytku, asi 22 litrů, a do směsi zbude 200 litrů. Spodní: 200 plus 10 % je 220 litrů; po úbytku 10 % zbude 198 litrů, o dva méně, než směs potřebuje.",
    "caption": "Šrafovaná část je úbytek z dodávky, čárkovaná linka potřeba směsi. Po úbytku ji dosáhne jen horní objednávka.",
    "body": [
      "Rezerva navyšuje jen dovážené množství a nemění čistý poměr směsi, ponechanou zeminu ani odvoz. Kalkulátor používá vztah objednávka = čisté množství ÷ (1 − rezerva/100). Při 10 % tedy 200 litrů vyžaduje přibližně 222 litrů k objednání. Tato volba není prosté přičtení 10 %; umožňuje pokrýt uvažovaný úbytek z dodaného množství.",
      "Cenu zadávejte v jednotkách uvedených u příslušného pole a podle skutečné nabídky. Orientační součet materiálů není rozpočtem celé realizace: zvlášť připočtěte dopravu, vykládku, odvoz a uložení zeminy i práci.",
      "Mykorhizní přípravek a případné startovací hnojení řešte podle výrobku a receptury. Při hnojení zohledněte také živiny dodané Actinem a kompostem; plné dávky těchto vstupů nekombinujte automaticky.",
      "Po naplánování dodávky pokračujte návodem [Jak připravit a uložit směs](/posts/jak-pripravit-a-ulozit-smes). Navazuje promícháním, kontrolou slehnutí, výsevem a první péčí o trávník."
    ]
  }
]

/** Pořadí oddílů; KALK, TAB a PREDEL jsou existující pás kalkulátoru, tabulka a nový předěl. */
export const PROFILE_RHYTHM_ORDER = ["K01", "KALK", "K02", "K03", "K03b", "K04", "TAB", "K04v", "PREDEL", "K05", "K05b"] as const

export const PROFILE_BLEED = {
  "filename": "fig-odvoz-zeminy.avif",
  "caption": "Odvoz počítáme z původního profilu; vytěžená zemina se na korbě nakypří, objem proto ověřte až při nakládce."
}

/** CTA složené doslova z posledního autorova odstavce (i35); odkaz „InteliDome" přechází na tlačítko. */
export const PROFILE_CTA = {
  "title": "Na přípravu půdy navazuje plán závlahy.",
  "sub": "Sledování vlhkosti v kořenové vrstvě pomůže přizpůsobit péči tomu, jak hotová směs vodu přijímá a zadržuje; tuto návaznost rozvíjí InteliDome.",
  "buttonLabel": "Objevit systém InteliDome",
  "buttonHref": "/"
}
