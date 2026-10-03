# SEO a dohledatelnost série o půdě pod trávníkem

Aktualizováno 2. 10. 2026. Úpravy jsou uložené v místním projektu a místním Payload CMS. Veřejné nasazení ani přijetí článků do indexu nebylo provedeno.

## Co každá stránka řeší

| Stálá adresa | Hlavní potřeba čtenáře | SEO titulek |
|---|---|---|
| /magazin/krasny-travnik-zacina-pod-zemi-2 | typ půdy, utužení, propustnost před založením trávníku | Půda pro trávník: jak poznat její typ a propustnost |
| /magazin/pisek-biochar-a-dalsi-primesi | výběr písku, biocharu, zeolitu a modelových poměrů | Směs pro trávník: písek, biochar, zeolit a jejich poměry |
| /magazin/kalkulator-na-planovani-pudniho-profilu | množství písku, zeminy a příměsí, objem, dovoz a odvoz | Kalkulátor půdy pod trávník: písek, zemina a příměsi |
| /magazin/jak-pripravit-a-ulozit-smes | příprava podloží, promíchání a uložení směsi, slehnutí a urovnání povrchu | Příprava půdy pro trávník: míchání a uložení směsi |
| /magazin/jak-zasit-travnik | klíčení, teplota půdy a termín, dávka a hloubka výsevu, zálivka podle kořenů, první sečení, příčiny neúspěchu | Jak zasít trávník: od prvního zalití k pevným kořenům |

Rozdělení vychází z obsahu a potřeby čtenáře, nikoli z naměřených objemů vyhledávání. Stávající adresy jsou zachované. Článek na adrese /posts/jak-pripravit-a-ulozit-smes se nyní jmenuje „Jak připravit půdu a uložit směs“ a končí přípravou seťového lůžka. Mykorhiza, výsev a první péče jsou od 2. 10. 2026 v samostatném článku „Jak zasít trávník“ na adrese /posts/jak-zasit-travnik. Každá stránka má vlastní description, krátký přímý souhrn, zdroje s vymezením modelových předpokladů, kontextové propojení a rozbalovací obsah se skutečnými odkazy na kapitoly. Žádný autor, kvalifikace ani odborná recenze nebyli vymyšleni; viditelně je uveden vydavatel InteliDome a datum aktualizace.

## Technické změny

- Canonical, Open Graph, RSS, JSON-LD a dynamické sitemap používají shodnou politiku originu; localhost patří pouze vývojovému prostředí nebo explicitní konfiguraci.
- Absolutní URL obrázků z externího úložiště se již neslepují s doménou. Sdílení má obrázek, rozměry a alternativní text.
- BlogPosting popisuje skutečný článek, data publikace a změny, vydavatele, jazyk cs, obrázek, dobu čtení a existující kapitoly. BreadcrumbList odpovídá zobrazené navigaci. FAQ zůstává v dostupném HTML i v odpovídajícím schema.
- Pro běžné stránky a články se typ a cesta stanovují explicitně; přítomnost publishedAt již nezaměňuje stránky za články.
- /search má noindex, follow a není v sitemap. Náhledy konceptů mají noindex, nofollow; Vercel preview prostředí má noindex. Veřejné články umožňují velké náhledy obrázků Googlu.
- Každá pojmenovaná skupina robotů má vlastní shodné zákazy administrace. OAI-SearchBot a Claude-SearchBot jsou povoleny; obrázky a frontendové prostředky zůstávají dostupné. Dosavadní volba povolit trénovací roboty není změněna.
- llms.txt obsahuje popsané odkazy na sérii. Je doplňkovým rozcestníkem; není podmínkou ani příslibem viditelnosti v AI vyhledávání.
- Metadata a obsah jsou zapojeny i do zdrojového generování všech pěti článků. Seeder a revizní skripty zachovávají samostatné setí; odkazy na přesunuté kapitoly směřují na nový článek. Samostatné uložení SEO obsahu: scripts/optimize-lawn-series.ts, nejprve bez --write pro náhled; --write zapisuje do lokální databáze po záloze v jedné transakci.

## Ověření

### Historické ověření 25. 9. 2026

Následující výsledky se týkají tehdejších čtyř článků, kdy příprava směsi zahrnovala také výsev a první péči. Nejsou potvrzením stejného počtu odkazů ani opakovaného ověření celé současné pětice.

Kontrola TypeScriptu, tři cílené regresní testy metadat/originu/schema a kontrola diffu prošly. Zdrojové generování a plán změn nad aktuálním CMS mají stejný text; transformace jsou idempotentní a tabulky i bloky kalkulátorů zůstaly zachované. Vykreslené HTML všech čtyř stránek ověřilo metadata, jedno H1, odkazy na kapitoly, schémata, dostupnost sdílecích obrázků a celkem 52 odkazů mezi články včetně 12 souvisejících karet. Sitemap, RSS, robots a noindex hledání prošly kontrolou. Mobilní obsah a odkazy na zdroje ověřeny v prohlížeči při šířce 390 px bez vodorovného přesahu.

Výchozí projektový ESLint se nespustil kvůli existující nekompatibilitě konfigurace (FlatCompat / circular structure); nešlo o nález ve změněných souborech. Celý produkční build nebyl spouštěn souběžně s vývojovým serverem.

Záloha před uložením: /var/folders/4g/b37qgsm1721g9y_1gdpjkn_40000gn/T/intelidome-lawn-seo-lD4JEf/before.json. Jde o dočasný lokální soubor, nikoli trvalou produkční zálohu.

### Rozdělení článku 2. 10. 2026

Série nově obsahuje pět samostatných článků. Příprava zachovává sedm obrázků, setí čtyři; každý článek má vlastní souhrn, metodiku, FAQ a návazné odkazy. Rozdělení zachovává praktické oddíly původního textu a jejich obrázky. Podrobnější rozšíření textů je další redakční krok.

Pro nový seed a revize prošly kontrola TypeScriptu, kontrola diffu a izolované generování celé statické předlohy bez DB operací. Ověřena je idempotence obou následných revizí i shoda seedovaného obsahu s revizí: samostatné setí se při dalším generování nevrací do přípravy. Tato kontrola nenahrazuje historické HTML, mobilní a sitemap/RSS kontroly uvedené výše.

Rozdělení bylo uloženo do místního CMS: příprava zachovává ID 8 a původní adresu, setí má ID 9 a adresu /posts/jak-zasit-travnik. Všech pět článků je dostupných bez přihlášení. Prohlížeč ověřil oba názvy, obrázky, návazný odkaz a rozbalení otázky k prvnímu sečení; aktuální zobrazení nemá vodorovný přesah ani chybu načteného obrázku. Původní texty dalších lokalizací byly porovnány se zálohou a zůstávají stejné.

Publikační helper nyní zapisuje výslovně _status: published. Samotné draft: false při částečné aktualizaci stav publikace nenastavovalo a mohlo převzít stav draft z nejnovějšího snapshotu. Publikování zůstává omezené na cs pomocí publishSpecificLocale.

Záloha před rozdělením: /var/folders/4g/b37qgsm1721g9y_1gdpjkn_40000gn/T/intelidome-preparation-seeding-IyMMy5/before-cs.json a before-all-locales.json. Plán rozdělení je planned.json ve stejném adresáři. Jde o dočasné místní soubory. Zápisy českého obsahu používají publikujCs; rozpracované překlady v dalších jazycích se nepřepisují.

### Nový text článku o setí 2. 10. 2026 (večer)

Krátký článek vzniklý rozdělením nahradil na téže adrese autorův nový text „Jak zasít trávník: od prvního zalití k pevným kořenům“ (16 kapitol, předloha `zdroje-informaci/pro-clanky/clanek pro závlahu zahrady/jak-zasit-travnik.md`, rešerše `vysev-travniku-vyzkum-2026-10-02.md`). Článek má vlastní seeder `scripts/seed-clanek-zasit.ts` a datový modul `scripts/lib/seeding-article-content.ts`, který z předlohy generuje `scripts/generate-seeding-content.mjs` (kontrola textu znak po znaku). `seed-clanek-primesi.ts` existující článek o setí už nepřepisuje, jen ho propojí se sérií. Souhrn, description a zdroje zůstávají v `lawn-seo-content.ts` a `lawn-seo-evidence.ts`; revize série je nad novým článkem beze změny obsahu.

Stavba: 24 dvousloupců obraz/text (12 nových kreseb, 12 nových fotografií série, 2 převzaté obrazy), 2 tabulky jako krémové pásy, předěl přes celou šířku, zdroje, 6 otázek FAQ a výzva vedoucí na návrh automatické závlahy. Oddíl „Mykorhizu umístit tam, kde se setká s mladými kořeny“ je převzatý ze starší verze (nová předloha ho nemá) kvůli odkazu z článku o příměsích; o jeho osudu rozhodne autor. Tři interní odkazy obalují autorovu frázi beze změny slov (příprava půdy, průvodce půdou, návrh závlahy).

Ověřeno: text shodný s předlohou (22 300 znaků), `tsc` čistý, `layout-check` na 1440 / 1920 / 1130 / 1024 bez chyby, `svg-labels` na 320 / 393 / 1440 bez kolizí a ořezů (13 kreseb). Porota design-loop zatím neproběhla. Záloha předchozího obsahu: `zdroje-informaci/zalohy/jak-zasit-travnik-pred-novym-textem-2026-10-02.json`.

Při kontrole se ukázalo, že `optimize-lawn-series.ts` a `revise-lawn-series.ts` nyní končí chybou „Evidence: expected soil infiltration results“ u průvodce půdou (ID 5). Nesouvisí to s článkem o setí; je potřeba to vyřešit před příštím použitím těchto skriptů.

### Bez oddílu Zdroje a metodika (3. 10. 2026)

Na rozhodnutí autora žádný článek série oddíl „Zdroje a metodika“ nemá. `enrichLawnEvidence` ho nevkládá a existující odstraní (`stripSources`); hranicí setí a fotky trávníku v průvodci půdou je místo něj FAQ. Ze čtyř článků v místním CMS ho odstranil jednorázový `scripts/remove-lawn-sources.ts`. Téhož dne zmizely i poslední tři odkazy jinam (článek o příměsích: biovin.at, pokus Brockhoff a kol., Penn State) – `stripExternalLinks` ponechá jen jejich text; odkazy mezi vlastními články zůstávají. Průvodce půdou má od téhož dne střídání stran dvousloupců bez výjimky (`alternateSplitSides` v `illustrateSoilGuide`). Uložené články srovnal `scripts/clean-lawn-series.ts`. Odstavce výše, které popisují zdroje s vymezením modelových předpokladů, jsou historické.

### Přesun na /magazin (3. 10. 2026, ADR-009)

Všechny články mají adresu `/magazin/<slug>` a domovskou stránku `/magazin`; stránkování je `/magazin/strana/N`. Staré adresy `/posts…` (i s prefixem `/cs` a jazykovým) vedou jedním trvalým přesměrováním 308 (`redirects.ts`). Natvrdo zapsaných 45 odkazů v obsahu (33 markdown, 9 Lexical, 3 tlačítka výzvy) přepsal `scripts/presun-magazin.ts`; seedery píšou `/magazin` samy a `publikujCs` odmítne zápis s `/posts/`. Sitemapy mají nový klíč datové cache. Odstavce výše, které uvádějí `/posts`, jsou historické.

## Co zbývá pro veřejnou návštěvnost

Při historické kontrole 25. 9. 2026 se u https://www.intelidome.com nepodařilo ověřit HTTPS: server vrací certifikát, jehož jméno neodpovídá www.intelidome.com (curl 60). Certifikát nebyl obcházen. Dokumentace projektu zatím uvádí veřejné nasazení F1 jako nedokončené.

1. Dokončit nasazení aplikace, databáze a médií na cílové prostředí, připojení domény a platné HTTPS. Produkční NEXT_PUBLIC_SERVER_URL má být https://www.intelidome.com; standardní build musí dokončit i next-sitemap postbuild.
2. Na veřejné doméně ověřit HTTP 200, obsah bez přihlášení, obrázky, canonical, robots a sitemap bez localhost/example.com. Stejný obsah musí být dostupný i crawlerům; případné ochrany hostingu nesmějí vyhledávací roboty blokovat.
3. Po zpřístupnění ověřit vlastnictví v Google Search Console a Bing Webmaster Tools, odeslat /sitemap.xml a prohlédnout všech pět URL nástrojem pro kontrolu adres. Toto není provedeno: nejsou připojené účty ani veřejně ověřený web.
4. Měřit zobrazení, prokliky, hledané dotazy a návštěvy z AI služeb; podle skutečných dat měnit titulky a doplňovat obsah. Pozice ani citace v odpovědích AI nelze zaručit.

## Před budoucími překlady

CMS již podporuje 7 jazyků (cs, en, de, hu, pl, es, it), frontend nyní poskytuje češtinu. Hreflang se doplní až pro skutečně dostupné přeložené URL, vzájemně a se samostatným canonical každé jazykové verze. Jazyk HTML, Open Graph, schema a sitemap pak musí odpovídat překladu. Nevytvářet jazykové odkazy na neexistující obsah nebo na český fallback. České URL nyní není potřeba měnit. Infrastruktura pro to je hotová, viz `adr/ADR-008-jazykove-verze.md` (hreflang jen při ≥ 2 jazycích dokumentu, `x-default` na češtinu, sitemapy a RSS po jazycích, checklist zapnutí jazyka).

## Oficiální metodická opora

- Google: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google Article schema: https://developers.google.com/search/docs/appearance/structured-data/article
- Google sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- OpenAI, OAI-SearchBot versus GPTBot: https://developers.openai.com/api/docs/bots

Odborné zahradnické podklady jsou připojeny u článků, včetně původního pokusu Brockhoff et al. (2010). Modelové poměry a obchodní hustoty nejsou vydávány za univerzitní normy.
