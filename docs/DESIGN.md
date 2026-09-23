# InteliDome Web — DESIGN.md

_Prověřeno 3 adversárními kontrolami: 41 nálezů, 37 zapracováno, 4 zamítnuty jako vkusové. Poté ručně překlopeno na paletu Tech Blue + Emerald (rozhodnutí 22. 8. 2026) s přepočtem všech kontrastů._

**Verze:** 2.9 · **Datum:** 2026-09-23 · **Platí pro:** www.intelidome.com / intelidome.cz (Next.js + Tailwind CSS + GSAP)
**Primární reference:** [Sonos](https://styles.refero.design/style/8d315332-6267-4dc0-a14c-e8b49c26b0e1) · **Sekundární:** [Eight Sleep](https://styles.refero.design/style/e4e8fe86-47ed-4ddd-a6c6-2c28eae9aabe), [Samara](https://styles.refero.design/style/934a61aa-50ff-4e90-852b-4ad0b8262d54)

> **Esence:** Teplý papír za dne, obsidian po setmění — a jeden modrý pulz.

Systém je syntézou tří předloh: **Sonos** dává webu editorial klid, achromatickou disciplínu a dramatickou typografii, **Eight Sleep** filmové tmavé pásy a kázeň jediného akcentu, **Samara** teplo papíru a vzdušnost blueprintu. InteliDome z nich skládá vlastní rytmus — „rytmus dne na zahradě": světlé vzdělávací sekce se střídají s tmavými produktovými pásy jako den s nocí.

## Vztah k intelidome-ds v1

Tento dokument je **evolucí v2** existující knihovny intelidome-ds (`intelidome.css`), ne jejím nahrazením ani konkurencí. Prefix `--id-*`, radiusy, stíny, podpisová křivka `--id-ease` i třídy komponent (`id-btn`, `id-card`, `id-chip`, …) zůstávají a evolvují; v2 přidává webové role a mění pouze vyjmenované hodnoty (včetně akcentu — viz changelog). Admin a aplikace dál běží na v1 — web se řídí výhradně tímto dokumentem. Každá odchylka je v těle značena „Δ v1→v2".

**Changelog v2:**

- **Teplý krém místo studené šedé:** `--id-bg-2` mění hodnotu `#f5f5f7` → `#f6f5f2` (nový alias `--id-cream`); studená v1 hodnota přežívá jen jako `--id-bg-2-legacy` pro admin. Sekundární inkoust `--id-ink-2` se posouvá `#6e6e73` → `#5b5e63` kvůli kontrastu na krému.
- **Nová rodina obsidian:** tokeny pro filmové tmavé pásy — `--id-obsidian` `#0b0d10`, `--id-obsidian-2` `#14171c`, inkousty `--id-ink-dark*`, hairliny `--id-line-dark*`. Ve v1 tmavý povrch neexistoval.
- **Archivo jako display písmo:** `--id-f-display` mění SF Pro Display stack na `'Archivo'` (Google Fonts, jediný webfont v2, wght 500–700); body zůstává systémový SF Pro.
- **Širší obsah:** `--id-maxw` 1120 px → 1200 px; nově `--id-maxw-prose` 700 px pro souvislý text.
- **Eyebrow s čárkou:** webová varianta eyebrow předsazuje před text 22px čárku místo tečky; tečka z v1 zůstává jako alias pro admin.
- **Tech Blue + Emerald (rozhodnutí majitele 22. 8. 2026):** akcent se mění `#0071e3` → **`#2563eb`** (hover `#0058b8` → `#1d4ed8`) a zelená rodina přechází na Emerald — sjednocení webu s paletou Flutter aplikace. `--id-green` = `#047857` (stavový text, AA na bílé i krému), nový `--id-emerald` = `#10b981` (výhradně výplně, grafy, ikony — na bílé má jen 2,5:1, text v něm je zakázán). `#0071e3` je od tohoto data historie v1.

## Brief a osobnost

- **Produkt jednou větou:** InteliDome je chytrá závlaha — aplikace + vlastní hardware (bridge, ventily, čidla vlhkosti), který se stará o zahradu sám; web ji vysvětluje, buduje důvěru a později prodává komponenty.
- **Pocit (3 + 1 anti):** *klidný, přesný, prémiový* — **ne křiklavý** (žádný marketingový křik, žádné vykřičníky, žádná umělá urgence).
- **Hlavní konverze (jedna):** F1–F2 „Objevit systém InteliDome" (→ produktová stránka / plánovač závlahy); od F3 nákup startovacího setu. Vše ostatní (newsletter, kalkulátory) jsou podpůrné, nikdy nesoupeří o pozornost s hlavní konverzí ve stejném viewportu.
- **Equity, na které stavíme:** logo inteliDome (střecha + kapka, maskované SVG přes currentColor), paleta aplikace Tech Blue/Emerald, Apple-light dědictví v1, hlas „ochotný odborník" (skill intellidome-content).
- **Konkurence pro srovnání:** Gardena Smart, Hunter Hydrawise, LinkTap, Netro — všechny vizuálně katalogové; prostor odlišení je právě editorial klid a vysvětlování.

*(Předpoklady doplněné bez zadání: pocitová adjektiva a pořadí konverzí — škrtněte/upravte, pokud nesedí.)*

## Co si bereme / co měníme

| Vrstva | Bereme (z reference) | Měníme (pro InteliDome) |
|---|---|---|
| Typografie | Sonos: dramatická škála, autorita velikostí; ES: těsný tracking, šeptaná autorita | Archivo 600 místo aktiv-grotesk 400 / NeueMontreal 300; tělo systémový SF Pro; latin-ext povinný |
| Barva | ES: jediný akcent ≤ 5 %; Samara: jedna živá modrá na akce | Tech Blue `#2563eb` (paleta aplikace) místo Pulse Blue/Sky Blue; Emerald jen jako stavová/datová zelená |
| Prostor | Samara: vzdušných 96–120 px mezi sekcemi; Sonos: 640–700px prose | maxw 1200 px (mezi 1280 předloh a 1120 v1) |
| Povrch | Sonos: členění posunem povrchu bez čar; ES/Samara: teplý krém místo klinické bílé | krém `#f6f5f2`; obsidian `#0b0d10` místo čisté černé |
| Pohyb | ES: rytmus tmavých a světlých pásů; Sonos: klid, žádný vizuální smog | GSAP + ScrollTrigger recepty, setrvačníkový scroll jen desktop opt-in, SVG smyčky ve figurách |
| Obraz | Sonos/ES: fotografie s teplým světlem, produkt v kontextu, žádné studio | + vlastní vrstva: animované technické SVG ilustrace (zahrada, voda, půda) — předlohy ilustrace nemají |

## Anti-vzory tohoto webu (AI slop)

Nad rámec Do/Don't (sekce 10) je **zakázané vše, co web prozradí jako generický AI výstup**: výchozí font v jedné váze (Inter/Roboto všude); gradient indigo→fialová; přesně tři feature karty s ikonkou v kolečku; jednotný radius na všem (u nás vždy odstupňované 20/14/10/pill); frosted-glass karty — frosted smí být **jedině** plovoucí kapsle headeru (7.1), nikde jinde; hero „nadpis na střed + dvě tlačítka + mockup v perspektivě"; titulky typu „Posuňte zahradu na další úroveň"; emoji místo ikon a ✅ v odrážkách; sekce „Trusted by" s vymyšlenými logy; fade-in zespodu na všem stejně (reveal patří jen vstupu sekce — figury mají vlastní, obsahové animace, viz 6).

## Filozofie & hlas

Hlas značky: klidný odborník, který nejdřív vysvětlí a teprve pak prodává — krátké věty, přesná čísla, žádný marketingový křik. Vizuální řeč se řídí pěti principy; každý je měřitelný a každé porušení je chyba, ne interpretace.

### 1. Povrch mluví, čáry mlčí
Stránka se člení změnou podkladu — bílá → krém → obsidian a zpět — nikdy oddělovací čarou, `<hr>` ani borderem mezi sekcemi RŮZNÝCH povrchů. Hairlines o síle přesně 1 px žijí uvnitř komponent (řádek tabulky, mřížka kalkulátoru, obrys karty); mezi sekcemi TÉHOŽ povrchu je 1px hairline povolený oddělovač (8.1 p. 1). Kdo pozná přechod povrchů podle čáry, našel chybu; kdo ho pozná podle změny světla, vidí systém.

### 2. Autorita velikostí, ne tučností
Hero titulek stoupá až ke 112 px při line-height 0.98, ale váha display rolí je vždy 600 — nikdy víc; 700 je vyhrazena drobným datům do 13,5 px. Hierarchii čtenář pozná podle měřítka a prostoru kolem, ne podle síly tahu. Velké písmo se sevřenou geometrií šeptá jistěji, než by bold křičel.

### 3. Jeden modrý pulz
`#2563eb` je jediný chromatický odstín UI a smí pokrýt nejvýše ~5 % plochy kteréhokoli viewportu; na obsidianu ho pro text zastupují jeho tinty `--id-accent-dark`/`--id-accent-tint` (3.4). Funguje jako pulz kontrolky: CTA, odkaz, focus, eyebrow, klíčové číslo — a právě proto, že všude jinde chybí, ho oko najde okamžitě. Sémantická zelená, oranžová a červená existují jen jako stavy, nikdy jako dekorace, a s modrou v jedné komponentě nesoupeří.

### 4. Teplý papír, ne klinická bílá
Světlé mezipásy stojí na krému `#f6f5f2` — papír s teplotou architektonického plánu, ne laboratorní deska; tmavé pásy na modročerném obsidianu `#0b0d10`, nikdy na čisté `#000000`. Stejné teplo drží obraz: přirozené světlo zahrady a domova, produkt v kontextu, žádné studiové bílé pozadí. Chytrá závlaha je příběh o živé zahradě — povrchy webu to říkají dřív než text.

### 5. Pohyb ukazuje, kam se dívat
Každá animace odpovídá na otázku „kam se dívat teď": reveal uvede sekci, kreslená křivka vysvětlí graf, smyčka rozpohybuje fyzikální děj v ilustraci — co jen zdobí, maže se. V jednom viewportu vede pozornost jediná orchestrace, nikdy dvě soupeřící. Bez JavaScriptu i při `prefers-reduced-motion` je stránka kompletní: pohyb je vylepšení, nikdy podmínka obsahu.

---

## 3. Tokeny — barvy, povrchy, akcentový rozpočet

Barvy existují **výhradně** jako tokeny `--id-*`; hex natvrdo v komponentě = chyba.

### 3.1 Delta proti v1 (intelidome-ds `intelidome.css`)

| Token | v1 | v2 | Poznámka |
|-|-|-|-|
| `--id-bg-2` | `#f5f5f7` | `#f6f5f2` (= `--id-cream`) | studená jen jako `--id-bg-2-legacy` (admin); na webu zakázána |
| `--id-ink-2` | `#6e6e73` | `#5b5e63` | vyšší kontrast na krému |
| `--id-maxw` | `1120px` | `1200px` | |
| `--id-f-display` | SF Pro Display stack | `'Archivo'` + fallback | jediný webfont v2 |
| — | neexistovalo | rodina `--id-obsidian*`, `--id-ink-dark*`, `--id-line-dark*` | tmavá rodina (filmové pásy) |
| — | neexistovalo | `--id-line-cream`, `--id-line-cream-strong`, `--id-mist`, `--id-accent-dark`, `--id-accent-tint`, `--id-shadow-cta`, `--id-*-tint`, `--id-*-bright` | nové tokeny v2 |
| `--id-bg-3` | `#fbfbfd` | beze změny, **deprecated** | jen admin/legacy; tinted povrch webu = `--id-cream` |

Dále v2 mění (rozhodnutí 22. 8. 2026, sjednocení s aplikací): `--id-accent` `#0071e3` → `#2563eb`, `--id-accent-deep` `#0058b8` → `#1d4ed8`, `--id-green` `#1d8a4e` → `#047857`, `--id-green-soft` `#f3f8f5` → `#ecfdf5`; nový token `--id-emerald` `#10b981`. Vše ostatní z v1 (`--id-ink`, radiusy, stíny, `--id-ease`, warn/danger) beze změny.

**v2.9 — doladění palety (rozhodnutí majitele 23. 9. 2026).** Kotvy (`--id-accent`, `--id-emerald`, `--id-green`, krém, obsidian, `--id-ink`, zemité tóny, linky) beze změny. Mění se 10 hodnot:

| Token | v2.0–2.8 | v2.9 | Důvod |
|-|-|-|-|
| `--id-ink-2` | `#5b5e63` | `#595650` | jediná studená šeď na teplém papíře → teplá osa krému; o stupeň tmavší, aby držel krok nad ink-3 |
| `--id-ink-3` | `#86868b` | `#716e68` | dřív 3,62 / 3,32:1 — metadata a hinty 12–13,5 px porušovaly AA; nově 5,08 / 4,66 |
| `--id-ink-dark-3` | `#6c737b` | `#7c828b` | na obsidian-2 3,74 → 4,64 |
| `--id-green-soft` | `#ecfdf5` | `rgba(16, 185, 129, 0.09)` | plná máta svítila na krému jako samolepka; průhledný tón má světlost krému |
| `--id-warn` | `#b76a00` | `#995b00` | medový bronz téhož odstínu; poprvé smí být text (5,45 bílá / 5,00 krém / 4,61 na warn-soft přes krém) |
| `--id-warn-soft` | `rgba(183, 106, 0, 0.09)` | `rgba(232, 161, 61, 0.12)` | pigment z jasného stupně = čistý medový podklad místo zakalené béžové |
| `--id-warn-tint` | `#f2b96b` | `#f6c85f` | šafrán; v noci lépe odlišený od mentolového OK |
| `--id-danger` | `#c0392b` | `#a21723` | flat-UI cihla z v1 → hluboký karmín o stupeň tmavší než warn (7,83 bílá) |
| `--id-danger-soft` | `rgba(192, 57, 43, 0.08)` | `rgba(228, 92, 90, 0.08)` | čistý korál místo zakalené cihly; chyba na podkladu přes krém 4,45 → 6,59 |
| `--id-danger-bright` | `#e6604f` | `#e45c5a` | jeden odstín chyby ve dne i v noci |

**Logika rodin (v2.9):** každá barevná rodina má tmavý textový stupeň pro papír, `-bright` pro výplně, grafy a ikony v noci, `-tint` pro text v noci a `-soft` podklad = pigment rodiny s alfou, jejíž výsledek nad bílou má světlost krému. Den (inkousty, stavové podklady) leží na teplé ose krému, noc (obsidian, akcent, tmavé šedé) na modré ose. Nová pravidla komponent: text na `--id-accent-soft` píše `--id-accent-deep` (3.4); ikona stavu se plní podle povrchu (3.4, 7.8). Porota 4 návrhů a 3 hodnotitelů; stav „pozor" × „chyba" je pro deuteranopii rozlišitelný jen o málo lépe než dřív, proto dál platí: stav nikdy nenese jen barva.

### 3.2 Světlá rodina — canvas a inkoust

| Hodnota | Token | Role |
|-|-|-|
| `#ffffff` | `--id-bg` | výchozí povrch stránky, editorial; ne CTA |
| `#f6f5f2` | `--id-cream` (alias `--id-bg-2`) | souhrny, demo bloky, tinted karty |
| `#ffffff` | `--id-surface` | karty a panely na canvasu i krému |
| `#1d1d1f` | `--id-ink` | primární text, titulky, ikony na světlém; ne CTA (akce = modrá) |
| `#595650` | `--id-ink-2` | sekundární text, leady, popisky karet (teplá osa krému, v2.9) |
| `#716e68` | `--id-ink-3` | terciární text, placeholder, metadata, hinty, figcaption; nikdy souvislé odstavce (v2.9: AA i pro malý text — 5,08 bílá / 4,66 krém) |

### 3.3 Tmavá rodina — obsidian (nová ve v2)

Filmové tmavé pásy (Eight Sleep): modročerná, **nikdy čistá `#000000`**.

| Hodnota | Token | Role |
|-|-|-|
| `#0b0d10` | `--id-obsidian` | pozadí tmavých pásů: hero, kalkulátory, produktové/automatizační sekce, patička CTA |
| `#14171c` | `--id-obsidian-2` | zvednutý panel/karta v tmavém pásu (hloubka posunem povrchu, ne stínem) |
| `#ffffff` | `--id-ink-dark` | titulky a primární text na obsidianu |
| `#9ba1a8` | `--id-ink-dark-2` | podtexty, popisky, řádky kalkulátoru |
| `#7c828b` | `--id-ink-dark-3` | metadata, disabled, funkční obrysy ovladačů; nikdy odstavce (v2.9: 5,02 obsidian / 4,64 obsidian-2) |

### 3.4 Akcent a sémantika

| Hodnota | Token | Role |
|-|-|-|
| `#2563eb` | `--id-accent` | **jediný chromatický akcent UI**: primární CTA, odkazy, focus ring, eyebrow, aktivní stavy (bílý text na akcentu 5,17:1 = AA) |
| `#1d4ed8` | `--id-accent-deep` | hover/pressed akcentu na světlém |
| `rgba(37, 99, 235, 0.10)` | `--id-accent-soft` | ghost hover, focus glow, info callout — jediná povolená „plocha" akcentu — **text na něm vždy `--id-accent-deep`** (5,36:1 přes krém; plný akcent jen 4,13, v2.9) |
| `#60a5fa` | `--id-accent-dark` | odkazy a akcentový text < 30px na tmavém (`#2563eb` na `#0b0d10` 3,8:1 — na malý text málo; tato 7,65:1); klíčová čísla ≥ 30px (hero kalkulátoru 7.7) smí plný accent (AA large, 11.1) |
| `#93c5fd` | `--id-accent-tint` | eyebrow, uppercase tagy/mikrotypografie a hover odkazů na tmavém (10,8:1) |
| `#047857` | `--id-green` | výhradně stav: verdikt OK, success badge — stavový TEXT na světlém (5,48:1 bílá / 5,03:1 krém = AA); nikdy dekorace ani CTA; od v2.9 i výplň ikony stavu na světlém (bílý glyf 5,48:1) |
| `#10b981` | `--id-emerald` | brandová Emerald z aplikace: výplně, grafy, lišty vlhkosti, ikony, checkmarky — **nikdy text** (na bílé jen 2,54:1); ikona stavu na světlém se jím neplní (bílý glyf 2,54:1) — tam --id-green |
| `rgba(16, 185, 129, 0.09)` | `--id-green-soft` | podklad success badge, callout a verdiktu — světlost krému; green text na něm 5,05 bílá / 4,66 krém (v2.9) |
| `#6ee7b7` | `--id-green-tint` | text verdiktu OK na obsidianovém panelu (7.8) |
| `#34d399` | `--id-green-bright` | grafy/glyfy na obsidianu (10,1:1); v textu se nepoužívá; od v2.9 výplň ikony OK v tmavém verdiktu (glyf #0b0d10, 10,1:1) |
| `#995b00` | `--id-warn` | stav „pozor" na světlém — od v2.9 smí být text (5,45 bílá / 5,00 krém / 4,61 na warn-soft přes krém); výplň ikony stavu na světlém |
| `rgba(232, 161, 61, 0.12)` | `--id-warn-soft` | podklad warn badge, callout a verdiktu — pigment z warn-bright, světlost krému; alfa nejvýš .12 (warn text přes krém 4,61) |
| `#f6c85f` | `--id-warn-tint` | text verdiktu „pozor" na obsidianovém panelu (7.8; 12,37:1 obsidian / 11,42:1 obsidian-2) |
| `#e8a13d` | `--id-warn-bright` | grafy a glyfy na obsidianu; od v2.9 i výplň ikony „pozor" v tmavém verdiktu (glyf #0b0d10, 8,9:1) |
| `#a21723` | `--id-danger` | chyby, destruktivní akce — hluboký karmín (7,83 bílá / 7,18 krém; bílý text na tlačítku 7,83); na obsidianu nikdy (2,49:1) — tam danger-bright |
| `rgba(228, 92, 90, 0.08)` | `--id-danger-soft` | podklad chybového stavu — pigment z danger-bright (danger text přes krém 6,59) |
| `#e45c5a` | `--id-danger-bright` | chybový stav na obsidianu (5,54:1); tmavá chybová tinta nejvýš rgba(228,92,90,.10) (4,59:1 přes obsidian-2) |

V jedné komponentě **max jedna** sémantická barva; nikdy nesoupeří s modrou v téže komponentě.

**Ikona stavu (v2.9):** na světlém výplň textovým stupněm rodiny (ok `--id-green`, warn `--id-warn`, danger `--id-danger`, info `--id-accent`) + bílý glyf; na obsidianu výplň stupněm `-bright` (ok `--id-green-bright`, warn `--id-warn-bright`, info `--id-accent-dark`) + glyf `#0b0d10`. Emerald jako výplň ikony na světlém nestačí (bílý glyf 2,54:1).

### 3.5 Hairlines

Oddělovací/dekorativní hairlines vždy přesně 1px; funkční obrysy (seg, tag, ghost-dark, kroužek čísla, scroll-cue) 1.5px; jediné silnější: input underline 2px, slider thumb 2.5px, focus ring 3px (= Don't #8).

| Hodnota | Token | Role |
|-|-|-|
| `rgba(0, 0, 0, 0.12)` | `--id-line` | oddělovače uvnitř komponent na bílé (řádky tabulek, stat-tiles, inputy) |
| `#e8e7e3` | `--id-mist` | hairline figcaption (7.12), hover secondary buttonu |
| `#d5d3cc` | `--id-line-cream-strong` | podtržení inputu a border segu ve světlém kalkulátoru (7.7), nevyplněná dráha slideru |
| `rgba(0, 0, 0, 0.07)` | `--id-line-soft` | obrysy karet, jemné dělení na bílé |
| `#dcdad4` | `--id-line-cream` | oddělovače na `--id-cream` (rgba černé na krému šedne → pevný hex) |
| `rgba(255, 255, 255, 0.14)` | `--id-line-dark` | řádky kalkulátoru, obrysy ghost buttonů, dělení na obsidianu |
| `rgba(255, 255, 255, 0.08)` | `--id-line-dark-soft` | jemné dělení uvnitř obsidianových panelů |

### 3.6 Ilustrační zemité tóny

**Výhradně** pro SVG ilustrace a diagramy (pravidla v sekci 9); v UI komponentách zakázané.

| Hodnota | Token | Role |
|-|-|-|
| `#6b5138` | `--id-soil` | řez půdou |
| `#54402c` | `--id-soil-deep` | spodní vrstva řezu |
| `#3f7d4e` | `--id-grass` | zdravá vegetace |
| `#c2a052` | `--id-grass-dry` | stresovaná/suchá vegetace |

### 3.7 Povrchy — úrovně 0–4

| Úroveň | Token (recept) | Účel |
|-|-|-|
| 0 | `--id-bg` | canvas: editorial stránky, prose |
| 1 | `--id-cream` | teplé mezipásy: souhrn + staty, demo, tinted karty na bílé |
| 2 | `--id-surface` + 1px `--id-line-soft` + `--id-shadow` | zvednuté karty/panely na úrovni 0 i 1 |
| 3 | `--id-obsidian` | filmové plnoformátové pásy (viz 3.3) |
| 4 | `--id-obsidian-2` + 1px `--id-line-dark-soft` | panel v tmavém pásu (mřížka kalkulátoru, feature karta) |

**Oddělování posunem povrchu (Sonos):** přechod mezi povrchy **nikdy** nedělá čára, `<hr>` ani border — jen změna povrchu (bílá → krém → obsidian a zpět). Hairlines patří dovnitř komponent; mezi dvě sekce **téhož** povrchu smí 1px hairline (8.1 p. 1). Hloubka: na světlém povrch + měkký stín; na tmavém **výhradně** posun `#0b0d10 → #14171c` + hairline — stíny na obsidianu zakázané.

### 3.8 Akcentový rozpočet ≤ 5 %

`#2563eb` smí pokrýt **max ~5 % viditelné plochy kteréhokoli viewportu** (Eight Sleep). Povolené role — úplný výčet: 1. primární CTA (výplň pill buttonu), 2. textové odkazy, 3. focus ring (`focus-visible`), 4. eyebrow (text + čárka), 5. klíčové výstupní číslo kalkulátoru, 6. aktivní stavy (tab, dráha slideru, checkbox, vybraná volba), 7. jeden akcentní prvek v každé SVG ilustraci.

Zakázáno: plošné výplně a pozadí sekcí, gradienty, dekorativní tvary, podbarvení celých karet, ikonografie mimo aktivní stav, akcentové rámečky. Kontrola: screenshot viewportu — víc než **dva** akcentní prvky → nejméně důležitý degradovat na neutrál (`--id-ink`/ghost). Sémantické barvy se do rozpočtu nepočítají (existují jen ve stavových komponentách).

## 4. Tokeny — typografie

Autoritu nese **velikost, ne tučnost** (Sonos); klid = disciplína vah (Eight Sleep).

### 4.1 Písma a load strategie

| Rodina | Token | Role | Váhy |
|-|-|-|-|
| **Archivo** (Google Fonts) | `--id-f-display` | display: titulky, čísla (staty, kalkulátor), labely/eyebrow, buttony, uppercase chip varianty (`--outline-accent`; základní chip = f-body, 7.4) | 500/600/700 (variabilní `wght 500..700`) |
| **SF Pro** (systémový stack) | `--id-f-body` | body: odstavce, leady, popisky, formuláře, tabulkový text | 400/600 (semibold jen inline `<strong>`) |
| **SF Mono** (systémový stack) | `--id-f-mono` | kód, technické hodnoty ve figurách | 400 |

```css
--id-f-display: var(--id-f-archivo, "Archivo"),"Archivo Fallback",-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI","Helvetica Neue",Arial,sans-serif; /* --id-f-archivo dodává jen next/font (13.3); fallback "Archivo" pokrývá statické stránky s <link> */
--id-f-body: -apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI","Helvetica Neue",Arial,sans-serif;
--id-f-mono: "SF Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
```

Load (CWV budget):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500..700&display=swap" rel="stylesheet">
```

- Subsety `latin` + `latin-ext` (auto přes `unicode-range`); česká diakritika v `latin-ext`; 2× woff2, < 80 kB.
- `display=swap` povinné; žádná kurzíva, žádná další rodina, žádné váhy mimo 500–700.
- Next.js: `next/font/google`: `Archivo({ subsets: ['latin', 'latin-ext'], display: 'swap' })` — self-host + preload řeší framework.
- Proti CLS metricky sladěný fallback:

```css
@font-face {
  font-family: "Archivo Fallback";
  src: local("Arial");
  size-adjust: 105%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

### 4.1b Záznam o volbě páru písem (skill web-design-system, fáze 4)

**ROZHODNUTO 22. 8. 2026 (majitel): pár A — Archivo.** Volba je uzavřená; display písmo se dál neotevírá bez nového rozhodnutí. Tělo textu zůstává systémový SF Pro stack (nulový přenos, brandové dědictví v1). Hodnoty škály (4.2) jsou na Archivo kalibrované — případná budoucí výměna páru znamená přepsat token `--id-f-display` **a překalibrovat 4.2**, ne jen prohodit název.

| Pár | Display | Proč sedí | Diakritika/licence |
|---|---|---|---|
| **A ✓ ZVOLENO** | **Archivo** 500–700 | nejblíž aktiv-grotesk (Sonos) i NeueMontreal (ES): těsná, technická, výborná čísla pro kalkulátory; ověřená v prototypu článku | latin-ext ✓ · OFL (Google Fonts) |
| B — zamítnuto | Hanken Grotesk 500–600 | humanistický grotesk blízký Söhne (substitut ze seznamu Eight Sleep); měkčí a přátelštější než Archivo | latin-ext ✓ · OFL (Google Fonts); blízká alternativa General Sans (Fontshare, self-host) |
| C — zamítnuto | Plus Jakarta Sans 500–700 | substitut Samary; nejoblejší a nejvzdušnější, posouvá web k „přátelské technice" | latin-ext ✓ · OFL (Google Fonts) |

Páry B a C zůstávají v dokumentu jako záznam zvažovaných alternativ (proč Archivo, ne co jiného) — nejsou to schválené varianty k použití.

### 4.2 Fluidní škála

Vše přes `clamp()` — žádné breakpointové skoky velikostí. Písmo Archivo; lead/body/body-sm/caption = SF Pro.

| Role | Velikost | l-h | tracking | weight | Token |
|-|-|-|-|-|-|
| display-xl (hero H1) | `min(clamp(48px, 8.4vw, 112px), max(40px, 12.5vw))` | 0.98 | −0.035em | 600 | `--id-t-display-xl` |

> Měkký strop `12,5vw` s podlahou 40 px je nad 384 px nečinný (12,5vw = 48 px právě při 384). Pod ním brání tomu, aby se autorský zlom H1 rozpadl na řádky po jednom slově: na 320 px měl titulek čtyři řádky. Mez 42 px nestačí (285,8 > 280 px) a tracking by musel na −0,10 em, tedy čtyřnásobek hodnoty z tabulky (v2.7).
| display (vnitřní H1) | `clamp(36px, 6vw, 76px)` | 1.02 | −0.03em | 600 | `--id-t-display` |
| title (sekční H2) | `clamp(30px, 4.2vw, 52px)` | 1.05 | −0.025em | 600 | `--id-t-title` |
| title-sm (H3, karty) | `clamp(24px, 3.2vw, 36px)` | 1.12 | −0.02em | 600 | `--id-t-title-sm` |
| subtitle (H4) | `clamp(21px, 2.6vw, 28px)` | 1.25 | −0.015em | 500 | `--id-t-subtitle` |
| lead (perex) | `clamp(18px, 2vw, 21px)` | 1.5 | −0.012em | 400 | `--id-t-lead` |
| body | `17px` | 1.65 | −0.01em | 400 | `--id-t-body` |
| body-sm | `14.5px` | 1.55 | −0.006em | 400 | `--id-t-body-sm` |
| caption (figcaption, hinty) | `13.5px` | 1.45 | 0 | 400 | `--id-t-caption` |
| label (eyebrow, uppercase) | `12px` | 1.2 | +0.14em | 600 | `--id-t-label` |
| btn | `15.5px` | 1.2 | +0.01em | 600 | `--id-t-btn` |
| btn-sm | `13.5px` | 1.2 | +0.01em | 600 | `--id-t-btn-sm` |
| stat-num (stat-tile) | `clamp(26px, 3vw, 40px)` | 1.05 | −0.02em | 600 | `--id-t-stat` |
| stat-num-xl (hero **landingu**, 8.3 — NE kalkulátor, viz §15 p. 1) | `clamp(40px, 5.4vw, 64px)` | 1.0 | −0.03em | 600 | `--id-t-stat-xl` |

> `--id-t-stat-xl` nemá v článku užití: kalkulátor stojí v panelu 652 px, kde by 64 px přeteklo na dva řádky, a sází proto vlastní stupeň ze 7.7. Token se drží pro landing page, kde má sekce šířku 1360.

> **Role, ne tag (v2.8).** `title-sm` patří titulkům karet. **Mezititulek `h3` pod titulkem kapitoly nebo bloku sází roli `subtitle`** (500, `clamp(21px, 2.6vw, 28px)`): tak to dělá `.prose.id-article > h3` i `.id-split__h3` a po kole 08 i oba mezititulky půdního kalkulátoru. Vlastní titulek komponenty, který je `h3` sám o sobě (7.7 `.id-calc__head`), si stupeň určuje ve svém receptu. Bez téhle věty si každá nová komponenta vybrala vlastní stupeň: v kalkulátoru byly pro jednu úroveň dva (24 a 32 px).

### 4.3 Pravidla sazby

1. **Váhy:** display role vždy **600 — nikdy víc** (vědomé rozhodnutí InteliDome; předlohy sázejí displaye ještě lehčí, proto je 700+ absolutní zákaz). 500 = subtitle a základní chip; buttony 600 (7.2, `--id-t-btn`). 700 výhradně do 13,5px (zvýraznění v datových tabulkách) — nikdy titulky ani body.
2. **`tabular-nums` povinné**, kde čísla stojí ve sloupcích nebo se mění: kalkulátory, stat-tiles, tabulky, odpočty, hodnoty sliderů (`font-variant-numeric: tabular-nums`, utilita `.id-tnum`; Archivo `tnum` podporuje).
3. **`text-wrap: balance`** na `display-xl`, `display`, `title`, `title-sm`, `subtitle` (nadpisy do 4 řádků); **`text-wrap: pretty`** na prose odstavce.
4. **Sloupec prózy 700px** (`--id-maxw-prose`) je šířka **sloupce v mřížce**, ne míra textu: SF Pro 17 px v něm dává ~87 znaků na řádek (naměřeno u dvou článků), ne 65. **Míra textu je `--id-measure: 33em`** (≈ 70 znaků při jakékoli velikosti písma) a uplatňuje se pravým odsazením uvnitř sloupce, ne zúžením boxu — osy mřížky se tím nehnou (ADR-007). Platí pro odstavce, seznamy, callouty, odpovědi FAQ i prózu pásů; ne pro titulky, lead souhrnu a centrované CTA. Body text se nikdy necentruje — centrují se jen display titulky.
5. **Tracking:** záporný roste s velikostí (−0.01em u 17px → −0.035em u 112px); kladný **+0.14em u všech uppercase labelů 12px** — eyebrow, label kalkulátoru (7.7) i chip (7.4). Uppercase bez rozšířeného trackingu zakázán. **Jediná výjimka (v2.5): popisky uvnitř kresby `.sv-lbl` mají +0.10em** — kresba je hustá a širší rozpal v ní působí kolize značka × text (ověřeno přejímkou `svg-labels`).
6. **Minimum 12px** — jen uppercase label; nejmenší běžný text caption 13,5px. Výjimky (v2.4): číslo figury `<b>` v popisku 11,5 px (7.12) a popisky uvnitř škálovaného SVG, které se na telefonu vykreslují 10,2–10,6 px (9.2 p. 3). **Chip (7.4) mezi výjimky nepatří — od v2.5 má 12 px**, ne 11,5.
7. **line-height body 1.65, strop 1.7** (ES); display line-height nikdy nad 1.25.
8. **Na obsidianu** `-webkit-font-smoothing: antialiased;` (jen tmavé pásy — světlé písmo jinak opticky tloustne); text `#ffffff` / `--id-ink-dark-2`.

## 5. Tokeny — spacing, radius, stíny, layout

### 5.1 Spacing — základ 8px

Násobky 8 + kroky 4 a 12 pro vnitřky komponent. Hodnoty mimo škálu zakázané (výjimky: gap gridu 14px na mobilu, pixel-hodnoty uvnitř `clamp()` tokenů).

| Hodnota | Token | Užití |
|-|-|-|
| 4px | `--id-s-4` | ikona ↔ text v badge, mikro-mezery |
| 8px | `--id-s-8` | gap v buttonu, label ↔ input |
| 12px | `--id-s-12` | vnitřky kartových hlaviček, eyebrow ↔ titulek |
| 16px | `--id-s-16` | grid gap karet, odstavcové mezery, element gap |
| 24px | `--id-s-24` | titulek ↔ obsah, gap 2sloupcových splitů |
| 32px | `--id-s-32` | vnitřní bloky panelů, mezera nad CTA |
| 40px | `--id-s-40` | padding větších panelů |
| 48px | `--id-s-48` | mezera mezi podsekcemi |
| 64px | `--id-s-64` | hero titulek ↔ obsah |
| 80px | `--id-s-80` | sekční vertikála mobil |
| 96px | `--id-s-96` | sekční vertikála desktop (dolní mez) |
| 120px | `--id-s-120` | sekční vertikála desktop (horní mez) |

Kompozitní hodnoty:

```css
--id-sect-y: clamp(72px, 10vw, 120px); /* vert. padding pásů */
--id-sect-y-sm: clamp(64px, 8vw, 96px); /* hustší sekce (staty, mezipásy) */
--id-gap-grid: 16px; /* grid gap karet; ≤768px: 14px */
--id-pad-card: clamp(20px, 2.4vw, 28px); /* karta (v1 beze změny) */
--id-pad-panel: clamp(24px, 3.4vw, 40px); /* velké panely */
--id-pad-x: clamp(24px, 4.5vw, 40px); /* gutter kontejneru */
```

### 5.2 Radius

| Prvek | Hodnota | Token |
|-|-|-|
| Karty, panely, figury, modaly | 20px | `--id-r-card` |
| Inputy, callouty, select | 14px | `--id-r-md` |
| Vnořené obrázky, thumbnaily, code bloky, quiz volby | 10px | `--id-r-sm` |
| Buttony, chipy, badge, slider thumb | 980px (pill) | `--id-r-pill` |

Vše beze změny proti v1; žádné jiné radiusy. Médium vnořené do karty (obrázek, mapa, graf) = `--id-r-sm`. Ostré hrany 0px jen full-bleed fotografie a plnoformátové pásy. Konverzní akce **vždy** pill — hranatý button neexistuje (Sonos/ES).

### 5.3 Stíny

| Hodnota | Token | Užití |
|-|-|-|
| `0 4px 24px rgba(0, 0, 0, 0.06)` | `--id-shadow` | klidový stav karet na světlém |
| `0 12px 48px rgba(0, 0, 0, 0.10)` | `--id-shadow-lg` | hover karet, modaly, plovoucí header |
| `0 12px 32px rgba(37, 99, 235, 0.35)` | `--id-shadow-cta` | výhradně hover primárního CTA |

Neutrální stíny strop alpha 0.10 (Samara/ES zákaz). Jeden prvek = max jeden stín; žádné `inset` ani vrstvené stíny. Na obsidianu stíny **zakázané** — hloubka = posun `--id-obsidian → --id-obsidian-2` + hairline (3.7). Stín se mění vždy spolu s transform hoverem (sekce 6), nikdy samostatně.

### 5.4 Layout

| Parametr | Hodnota | Token | Δ v2 |
|-|-|-|-|
| Max šířka obsahu | 1200px | `--id-maxw` | **změna z 1120px** |
| Max šířka prose | 700px | `--id-maxw-prose` | nové v2 |
| Horizontální gutter | `clamp(24px, 4.5vw, 40px)` | `--id-pad-x` | nové v2 |
| Sekční vertikála | `clamp(72px, 10vw, 120px)` | `--id-sect-y` | nové v2 (96–120px desktop, 72–80px mobil) |
| Grid gap karet | 16px, ≤768px 14px | `--id-gap-grid` | nové v2 |
| Podpisová křivka | `cubic-bezier(0.22, 0.61, 0.36, 1)` | `--id-ease` | beze změny (scroll varianta v sekci 6) |

- **Kontejner:** centrovaný `max-width: var(--id-maxw)` + `padding-inline: var(--id-pad-x)`; pásy full-bleed, obsah se vrací do kontejneru.
- **Breakpointy:** 640/768/1024/1280 (Tailwind `sm`–`xl`); obsah se zastavuje na 1200px, `xl` jen pro okolí (gutter, gridy).
- **Gridy:** karty 2–3 sloupce s `--id-gap-grid`; 2sloupcové text+obraz splity s gapem `--id-s-24` až `--id-s-48`; mřížky 4+ jen stat-tiles oddělené hairlinem, ne kartami.
- **Vertikální rytmus:** sekce = `padding-block: var(--id-sect-y)`; mezi sekcemi žádný margin — přechod = změna povrchu (3.7), paddingy pásů se potkávají beze švů.

---

## 6. Pohyb

Závazný stack: **GSAP + ScrollTrigger** (nikdy Framer Motion). CSS transitions = mikrointerakce (hover, focus); keyframes + SMIL = smyčky v SVG. Vanilla vzor `hydraulika-zahrady.html` = fallback statických stránek (6.4). Hodnoty = prototypem ověřené normy.

### 6.1 Principy pohybu

1. **Pohyb vede pozornost, nezdobí** — animace bez odpovědi „kam se dívat teď" se maže.
2. **Jedna orchestrace na sekci** (eyebrow → titulek → obsah staggerem); dvě soupeřící animace v jednom viewportu = chyba; dekorativní smyčky figur mimo.
3. **Obsah první:** bez JS i při reduced-motion stránka kompletní; animace = vylepšení, ne podmínka zobrazení (6.3.2, 6.7).
4. **Fyzika, ne efekty:** křivky decelerační — rychlý start, měkký dojezd (reveal 800 ms, ne 300 ms); zakázáno bounce, elastic, overshoot, blikání < 1,1 s.
5. **Smyčkuje jen SVG ilustrace fyzikálního děje**; UI nikdy — jediná výjimka `pulse-dot` (opacity pulz = „online").
6. **Jednou a dost:** scroll-reveal jen jednou (`once: true`), žádný re-reveal.

**Neanimovat:** psaní do inputu (přepočet okamžitě), slider (přímý DOM zápis), chybové/validační stavy; animace nesmí zdržet interakci (6.8).

### 6.2 Podpisové křivky a délky

#### Easing tokeny

| Token | Hodnota | GSAP | Použití |
|---|---|---|---|
| `--id-ease` | `cubic-bezier(.22,.61,.36,1)` | `id` | hover/focus/segmenty/chipy (v1) |
| `--id-ease-reveal` | `cubic-bezier(.22,.61,.21,1)` | `idReveal` | scroll-reveal, hero rise, hover karet (v2) |
| `--id-ease-draw` | `cubic-bezier(.3,.1,.3,1)` | `idDraw` | kreslení čar (v2) |
| `--id-ease-fill` | `cubic-bezier(.3,.1,.4,1)` | `idFill` | fillup, progress (v2) |
| `--id-ease-ripple` | `cubic-bezier(.16,.6,.4,1)` | `idRipple` | expandující vlny (v2) |
| `--id-ease-soft` | `cubic-bezier(.25,.1,.25,1)` | `idSoft` | fady (hero podtext) = CSS `ease` (v2) |
| — | `linear` | `none` | rotace, dash march, stopky |
| — | `ease-in` | `power1.in` | pád kapek (gravitace) |
| — | `ease-out` | `power1.out` | odpar, stoupání |
| — | `ease-in-out` | `power1.inOut` | pulzy, nudge scroll-cue |

#### Délky a zpoždění

| Token | Hodnota | Role |
|---|---|---|
| `--id-dur-micro` | `250ms` | background/color/border-color |
| `--id-dur-hover` | `350ms` | hover transform + stín (buttony); mikrointerakce vždy 200–400 ms (hover karet .4s dle 7.0/7.5 = strop) |
| `--id-dur-reveal` | `800ms` | scroll-reveal (opacity + translateY 30 px → 0) |
| `--id-dur-rise` | `1000ms` | hero rise |
| `--id-dur-draw` | `1600ms` | kreslení grafové křivky |
| `--id-stagger-reveal` | `80ms` | krok staggeru revealu; max 4 děti |
| `--id-stagger-rise` | `120ms` | krok řádků hero titulku |
| `--id-delay-herosub` | `550ms` | fade hero podtextu za startem rise |

### 6.3 Recepty GSAP + ScrollTrigger

#### 6.3.0 Setup — jediné místo registrace

Registrace jednou po hydrataci (Next.js: client modul v layoutu); jen užité pluginy, nikdy `gsap/all`.

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
gsap.registerPlugin(ScrollTrigger, CustomEase);
// CustomEase.create(jméno, hodnota) — 6 tokenů z tab. 6.2
export const mm = gsap.matchMedia();
```

Recepty žijí VÝHRADNĚ v `mm.add('(prefers-reduced-motion: no-preference)')`; parallax navíc `and (pointer: fine)`. `ScrollTrigger.refresh()` jednou po `document.fonts.ready` + `load`; nikdy v resize handleru.

#### 6.3.1 Reveal (jednotlivý prvek)

= prototypový `.rv` + IO (`threshold: 0.14`, `rootMargin: '0px 0px -6% 0px'`, unobserve). Pro každý `.rv:not([data-rv-group] > .rv)`:

```js
const HIDDEN = { autoAlpha: 0, y: 30 };
const SHOWN = { autoAlpha: 1, y: 0, duration: 0.8, ease: 'idReveal', clearProps: 'transform' };
gsap.fromTo(el, HIDDEN, { ...SHOWN,
  scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
```

#### 6.3.2 Stagger (skupina karet, statů, kroků)

Skupina = `data-rv-group`, animují se přímí potomci `.rv`; 80 ms, **max 4 děti** — větší grid dělit po řádcích (`d1–d4`). Pro každou skupinu `g`:

```js
gsap.fromTo(g.querySelectorAll(':scope > .rv'), HIDDEN, { ...SHOWN,
  stagger: { each: 0.08, from: 'start' },
  scrollTrigger: { trigger: g, start: 'top 88%', once: true } });
```

**Anti-FOUC (závazné):** skrytí `.rv` nesmí být v holém CSS — bez JS obsah viditelný:

```html
<script>document.documentElement.classList.add('js')</script>
```

```css
@media (prefers-reduced-motion: no-preference) { html.js .rv { opacity: 0; } }
```

#### 6.3.3 Hero nástup (maskovaný rise)

Řádek titulku = `<span class="hline"><span>…</span></span>`, vnější `overflow: hidden`.

```js
const tl = gsap.timeline({ defaults: { ease: 'idReveal' } });
tl.fromTo('.hero .hline > span', { yPercent: 110 },
    { yPercent: 0, duration: 1, stagger: 0.12 }, 0)
  .fromTo('.hero .fade-in', { autoAlpha: 0 },
    { autoAlpha: 1, duration: 1, ease: 'idSoft' }, 0.55);
```

**LCP guard (závazný):** je-li hero H1 LCP (článek, landing) → rise = CSS keyframes v kritickém inline CSS: `@keyframes rise { to { transform: none } }`, `animation: rise 1s cubic-bezier(.22,.61,.21,1) forwards`, druhý řádek `animation-delay: .12s` — nečeká na JS bundle. GSAP jen s bundlem garantovaným před FCP (app-like, kalkulátory). Rise max 1 s; paint titulku max 1 s od FCP.

#### 6.3.4 Parallax jemný

Jen dekorativní vrstvy (SVG v hero, foto v `overflow: hidden` panelu), **nikdy text**. Max ±60 px, default ±40 px; vždy `scrub: true` (1 : 1 — setrvačnost dodává 6.5). Amp z `data-parallax`, clamp 60:

```js
gsap.fromTo(el, { y: amp }, { y: -amp, ease: 'none',
  scrollTrigger: { trigger: el.closest('section') ?? el.parentElement,
    start: 'top bottom', end: 'bottom top', scrub: true } });
```

#### 6.3.5 Kreslení křivky grafu

Prototypový `.curve` (dasharray 900); GSAP délku měří z path, nehardcoduje. Pro každou figuru `fig`:

```js
const paths = fig.querySelectorAll('path.c');
paths.forEach((p) => gsap.set(p, { strokeDasharray: p.getTotalLength(),
  strokeDashoffset: p.getTotalLength() }));
gsap.to(paths, { strokeDashoffset: 0, duration: 1.6, ease: 'idDraw',
  stagger: 0.9, // součtová křivka +900 ms
  scrollTrigger: { trigger: fig, start: 'top 70%', once: true } });
```

(`stroke-dashoffset` = povolená výjimka z transform/opacity pravidla, viz 6.8.)

#### 6.3.6 Pin sekce — NEpoužívat bez měření

`pin: true` defaultně zakázán; povolí jen měření prototypu (DevTools, 4× CPU throttle, mid-range mobil): INP < 200 ms, CLS < 0,1, 60 fps po celý scrub. Pak povinně `anticipatePin: 1`, `pinSpacing: true`, max **1 pin na stránku**; bez formulářů a textu, který se za pinu přeformátovává.

### 6.4 Vanilla fallback pro statické stránky

Statické HTML bez build pipeline (Journal, embedy), bez GSAP; závazné hodnoty:

```css
@media (prefers-reduced-motion: no-preference) {
  html.js .rv { opacity: 0; transform: translateY(30px); transition: opacity .8s
    cubic-bezier(.22,.61,.21,1), transform .8s cubic-bezier(.22,.61,.21,1); }
  html.js .rv.in { opacity: 1; transform: none; } }
/* + tentýž inline <script>document.documentElement.classList.add('js')</script>
   — anti-FOUC gate 6.3.2 platí i zde: bez JS obsah viditelný */
.d1{transition-delay:.08s} .d2{transition-delay:.16s}
.d3{transition-delay:.24s} .d4{transition-delay:.32s}
```

JS: IO s hodnotami z 6.3.1 přidá `.in`, pak unobserve. Hero rise/fade = čisté CSS keyframes (6.3.3). GSAP i vanilla okem nerozlišitelné — stejné křivky, délky, staggery.

### 6.5 Politika setrvačníkového scrollu

Per-page opt-in; pro imerzivní obsah (články, landing), ne checkout/administraci/formuláře.

| Pravidlo | Hodnota |
|---|---|
| Aktivace | `<html data-inertia>` per stránka |
| Zařízení | jen `pointer: fine`; na touch **nikdy** (wheel se na touch nevyvolá, guard přesto povinný) |
| Reduced-motion | modul se vůbec nespustí |
| Lerp faktor | `0.082` (na snímek, 60 fps referenční) |
| Násobič delty | `1.15` |
| `deltaMode === 1` | delta × 16 (Firefox posílá řádky, ne px) |
| Pinch-zoom | `ctrlKey`/`metaKey` wheel → nativní (return před preventDefault) |
| Klávesnice, scrollbar, kotvy, find-in-page | nativní; resync přes `scroll` listener, když neběží rAF |
| Dojezd | stop při rozdílu < 0,5 px |
| Resize | clamp targetu na `scrollHeight − innerHeight` |
| Kombinace | **nikdy** s Lenis / ScrollSmoother — jeden zdroj vyhlazení na stránku |

Implementace = wheel `{ passive: false }` + rAF lerp nad **skutečným window** → ScrollTrigger bez scrollerProxy, `position: fixed` se nerozbíjí. Programový scroll (scroll-cue, kotvy): při aktivním modulu nastav target + rAF; jinak `scrollIntoView({ behavior: 'smooth' })`, při reduced-motion `'auto'`.

### 6.6 Pravidla SVG animací

#### 6.6.1 Dvě povolené techniky

1. **CSS keyframes** na `transform`/`opacity` — nutné `transform-box: fill-box` + explicitní `transform-origin`.
2. **SMIL `<animateTransform type="rotate">`** — výhradně rotace kolem bodu.

#### 6.6.2 Past `transform-box: fill-box` → SMIL `rotate(a cx cy)`

`fill-box` + `origin: center` točí kolem středu vlastního bboxu — správně jen když pivot = geometrický střed (rotor, sun-rays, ripple). Jiný pivot (ručička manometru/stopek, výseč postřikovače) → špatný bod, láme se mezi prohlížeči. Závazně SMIL s pivotem v user units:

```html
<g><animateTransform attributeName="transform" type="rotate"
  values="-2.5 240 168; 2.5 240 168; -2.5 240 168"
  keyTimes="0; 0.5; 1" dur="2.8s" repeatCount="indefinite"/>…ručička manometru…</g>
<animateTransform attributeName="transform" type="rotate"
  from="0 920 240" to="360 920 240" dur="6s" repeatCount="indefinite"/><!--stopky-->
```

#### 6.6.3 Normované smyčky

| Smyčka | Vlastnost | Délka | Easing | Poznámka |
|---|---|---|---|---|
| `ripple` | scale .32 → 1.12 + opacity .75 → 0 | 4,6 s | `idRipple` | 3 instance, fázový posun 1,5 s (⅓ periody) |
| `fall` (kapky figury) | translateY 0 → 88 px + opacity | 2,6 s | `ease-in` | delaye .5 / 1 / 1.6 / 2.1 s |
| `hdrop` (hero kapky) | translateY 0 → 150 px + opacity | 3,2 s | `ease-in` | |
| `evap` (odpar) | translateY 0 → −64 px + opacity | 3,6 s | `ease-out` | delaye 1.2 / 2.4 s |
| `fillup` (plnění) | scaleY .06 → .94, origin bottom | 5 s | `idFill` | uvnitř `clipPath` |
| `prog` (progress) | scaleX .1 → .92, origin left | 6 s | `idFill` | |
| `pulse-dot` | opacity .35 → 1 → .35 | 2,4 s | `ease-in-out` | jediná povolená UI smyčka |
| `march` (dashline) | stroke-dashoffset −12 | 1,1 s | `linear` | `stroke-dasharray: 3 9`; nejkratší povolená perioda |
| `spin` (rotor) | rotate 360° | 7 s | `linear` | fill-box OK — pivot = střed bboxu |
| `spin` (sun-rays) | rotate 360° | 26 s | `linear` | |
| `nudge` (scroll-cue) | translateY −2 → 4 px | 2,2 s | `ease-in-out` | |

#### 6.6.4 Klidový stav a reduced-motion u SVG

- **Markup zobrazuje informativní klidový stav i bez animací** (kbelík plný, progress ~60 %, kapky viditelné); animace stav jen rozpohybuje, nevytváří.
- SMIL ignoruje media queries i CSS → při reduced-motion uzly odstranit JS-em:

```js
if (matchMedia('(prefers-reduced-motion: reduce)').matches)
  document.querySelectorAll('animateTransform, animate, animateMotion')
    .forEach((n) => n.remove());
```

- Dynamický SMIL: kontrola reduced-motion **před vytvořením** uzlu.
- Max 1 akcentně modrý animovaný prvek na figuru (akcentový rozpočet kap. 3).

### 6.7 Reduced-motion kontrakt

Při `reduce` přesně toto — nic víc, nic méně.

**Vypíná se (skok do finálního stavu):**

| Co | Jak |
|---|---|
| Scroll-reveal + stagger | tweeny se nevytvoří (vše v `mm`); `.rv` gated (6.3.2) → hned viditelné |
| Hero rise + fade | statický finální stav (override viz blok níže) |
| Parallax | tweeny se nevytvoří |
| Setrvačníkový scroll | modul se nespustí; nativní scroll |
| Kreslení křivek | čáry plné od prvního paintu |
| CSS smyčky v SVG | `animation: none` → klidový stav z markup (6.6.4) |
| SMIL uzly | JS remove (6.6.4) |
| Scroll-cue nudge | statická šipka |
| Hover transformy (translateY karet/buttonů) | přechod 0,01 ms — stav bez pohybu |

**Zůstává:** hover/focus barvy, pozadí, border-color (okamžitě, rozlišitelné); statický focus ring; funkční hodnoty (kalkulátory, slider, verdikt chipy) okamžitě; statické stíny, blur headeru, layout.

Závazný globální blok (v2 delta: `animation: none` místo zkrácení na 0,01 ms → platí klidový stav z markup):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important;
    transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
  .rv { opacity: 1 !important; transform: none !important; }
  .hline > span { transform: none !important; }
  .fade-in { opacity: 1 !important; }
  .curve path.c { stroke-dashoffset: 0 !important; }
}
```

`gsap.matchMedia()` reaguje i na živou změnu nastavení (za běhu korektně zruší/vytvoří).

### 6.8 Výkonnostní budget

CWV nadřazené animacím: LCP < 2,5 s, CLS < 0,1, INP < 200 ms; test: DevTools, 4× CPU throttle, 60 fps při scrollu (≤ 8 ms style+paint).

| Metrika | Limit |
|---|---|
| Animované vlastnosti | jen `transform` + `opacity`; výjimky `stroke-dashoffset`/`stroke-dasharray` na SVG path |
| Layout props (`width`, `height`, `top`, `left`, `margin`, `padding`, `font-size`) | animovat zakázáno — 0 výskytů |
| `box-shadow` transition | jen hover/focus, 1 prvek, ≤ 350 ms; nikdy ve scroll animacích ani smyčkách |
| `filter` / `backdrop-filter` | animovat zakázáno (blur headeru statický) |
| Současné tweeny | ≤ 6 na viewport |
| SVG smyčky | ≤ 8 uzlů/figura; ≤ 2 animované figury ve viewportu; od 5. figury na stránce pauza mimo viewport (IO → `animation-play-state: paused`) |
| Stagger skupina | max 4 děti (6.3.2) |
| `scrub` | jen dekorativní parallax; obsahové animace vždy toggle s `once: true`; scrub na textu zakázán |
| Pin | 0 bez měření (6.3.6); po změření max 1 na stránku |
| `will-change` | ručně nenastavovat — řídí GSAP; po one-shot `clearProps: 'transform'` |
| CLS animací | 0,00 — finální layout box od prvního paintu; žádné vkládání obsahu při scrollu |
| INP | žádný handler > 50 ms; init po hydrataci (`useEffect`/`requestIdleCallback`), ne v render path; input eventy → přímý DOM zápis |
| LCP | hero bez závislosti na JS bundlu, kde je H1 LCP (6.3.3); GSAP = jeden chunk jen s použitými pluginy |
| `ScrollTrigger.refresh()` | jen po `load` + `document.fonts.ready`; nikdy v resize smyčce |

---

## 7. Komponenty

Specifikace proti tokenům kap. 3–6 (závorky = opisy). Zápis v tabulkách a textu: bez prefixu `--id-` (accent ≙ `--id-accent`); ls≙letter-spacing, lh≙line-height, mb≙margin-bottom, mt≙margin-top, nowrap≙white-space:nowrap; kód vždy plný. Třídy v1 (`id-btn`, `id-card`, `id-chip`, `id-eyebrow`, `id-badge`, `id-field`, `id-callout`) zůstávají a evolvují; změny značeny **Δ v1→v2**. Hodnoty ověřeny prototypem `hydraulika-zahrady.html`.

### 7.0 Globální kontrakt interaktivních stavů

Odchylky uvedeny u komponent.

| Stav | Specifikace | Poznámka |
|---|---|---|
| hover (plošné prvky) | translateY(-3px) karty / -4px step a feature karty + zesílený stín; přechod 0.25–0.4s ease | jen transform + box-shadow/border-color, nikdy layout |
| hover (buttony) | translateY(-2px); přechod transform .35s `--id-ease` (.22,.61,.36,1 — sjednoceno s 6.2 ve v2.4, dřív tu stálo .21 = `--id-ease-reveal`), box-shadow .35s, background .25s | primary navíc glow stín |
| focus-visible standard | outline:3px solid accent; offset:3px | buttony, seg, kalk. inputy |
| focus-visible kompaktní | outline:2.5px solid accent; offset:4px | logo, odkazy v liště |
| focus-visible slider | outline:3px solid accent; offset:6px | offset kvůli 28px palci |
| disabled | opacity:0.45; cursor:default; u `<button>` nativní atribut disabled; u `<a>` odebrat href (příp. tabindex="-1") + aria-disabled="true" — samotné pointer-events:none neblokuje klávesnici | jen průhlednost, ne barva (v1) |
| :focus bez klávesnice | žádný ring (outline:none jen kde je :focus-visible) | outline nikdy bez náhrady |

Na obsidianu focus ring zůstává accent — #2563eb je na #0b0d10 jako obrys zřetelný (nejde o text).

### 7.1 Plovoucí capsule header `.id-capsule`

**Role:** Jediná navigace obsahových stránek: frosted pilulka 18px pod horní hranou, stránka pod ní protéká; nikdy spodní hairline ani plné full-width pozadí.

| Prvek | Spec |
|---|---|
| Pozice | position:fixed; inset:18px 0 auto; z-index:50; obal flex justify-content:center pointer-events:none, pilulka pointer-events:auto |
| Povrch | rgba(255,255,255,.90) + backdrop-filter:blur(18px) (vč. -webkit-) — alpha .90 drží __cat AA i nad obsidianem (blend ≈ #e6e6e7, ink-2 ≈ 5,1:1) |
| Border / radius | 1px solid line-soft (rgba(0,0,0,.07)) / r-pill |
| Padding / gap | 10px 12px 10px 24px (vpravo těsněji — mini-CTA) / 26px |
| Stín | 0 8px 30px rgba(10,12,15,.10) |
| Logo | maskované SVG, height:21px, color:ink (currentColor) |
| __cat | f-display 600 12.5px, ls:.1em, uppercase, ink-2; pod 640px display:none |
| __go (mini-CTA) | f-display 600 13.5px, padding:9px 18px, radius pill, background:ink, color:#fff |

**Stavy:** mini-CTA hover background:accent (.25s); logo focus-visible kompaktní 2.5px/4px. Capsule sama nemá hover.

**Tmavě:** beze změny — frosted bílá funguje i nad obsidianem; tmavou variantu nikdy.

```html
<header class="id-header"><div class="id-capsule">
<a class="id-capsule__mark" href="/" aria-label="InteliDome"><svg class="id-logo" viewBox="446 2126 4870 1227" aria-hidden="true"><rect x="446" y="2126" width="4870" height="1227" fill="currentColor" mask="url(#idlogo-mask)"/></svg></a>
<span class="id-capsule__cat">Návody · Závlaha</span><a class="id-capsule__go" href="/">Objevit systém</a>
</div></header>
```

```css
.id-capsule{pointer-events:auto;display:flex;align-items:center;gap:26px;background:rgba(255,255,255,.90);backdrop-filter:blur(18px);border:1px solid var(--id-line-soft);border-radius:var(--id-r-pill)}
```

### 7.2 Buttony `.id-btn`

**Role:** Jediný tvar akce = pilulka; primary nese akcentovou modrou (počítá se do 5% rozpočtu), secondary/ghost neutrální; rektangulární button neexistuje.

**Δ v1→v2:** písmo z body stacku na f-display (Archivo) 600/15.5px (v1: 17px/body 400); padding z 13px 24px na 16px 30px; nově hover lift translateY(-2px) a glow u primary. `--primary/--secondary/--ghost` zůstávají, přibývá `--ghost-dark`.

| Prvek | Spec |
|---|---|
| Display | inline-flex; align-items:center; justify-content:center; gap:10px |
| Typografie | f-display, 600, 15.5px, lh:1.2 |
| Padding | 16px 30px; `--sm`: 10px 20px, 13.5px |
| Radius | r-pill |
| Přechod | dle 7.0 (buttony) + border-color .25s |
| Hover / focus / disabled | dle 7.0 (lift −2px vše; ring 3px/3px; opacity:.45, pointer-events:none) |
| Ikona | SVG 15–16px, stroke-width:1.8, stroke:currentColor |

**Varianty:**

| Varianta | Povrch | Text | Hover navíc |
|---|---|---|---|
| `--primary` | accent | #fff | box-shadow:0 12px 32px rgba(37,99,235,.35) (glow); pozadí se NEmění |
| `--secondary` | cream | ink | background:mist (#e8e7e3) |
| `--ghost` (světlý) | transparent | accent | background:accent-soft, color:accent-deep (plný akcent na accent-soft jen 4,49:1 — v2.9) |
| `--ghost-dark` | transparent, border:1.5px solid line-dark | #fff | border-color:#fff |

**Tmavě:** `--primary` beze změny; `--ghost-dark` = jediný sekundární button na obsidianu; `--secondary` a světlý `--ghost` tam nepatří.

```html
<a class="id-btn id-btn--primary" href="#">Objevte systém</a>
```

```css
.id-btn{display:inline-flex;align-items:center;gap:10px;font-family:var(--id-f-display);font-weight:600;border-radius:var(--id-r-pill)}
.id-btn--primary{background:var(--id-accent);color:#fff}
```

### 7.3 Eyebrow `.id-eyebrow`

**Role:** Kicker nad titulkem sekce/kapitoly („Kapitola 01"); nese akcent, vždy samostatně na řádku 14px nad titulkem.

**Δ v1→v2:** 6px tečka → **22px vodorovná čárka** (width:22px, height:1.5px); uppercase 12px, tracking .14em (v1: 13px, -0.01em, tečka). Alias `.id-eyebrow--dot` (6px kruh) zůstává pro admin/app kontexty.

| Prvek | Spec |
|---|---|
| Typografie | f-display, 600, 12px, ls:.14em, uppercase |
| Barva | accent |
| Layout | inline-flex; align-items:center; gap:10px |
| ::before | čárka 22px × 1.5px, background:accent |
| Odstup | mb:14px (titulek má mt:14px) |

**Stavy:** neinteraktivní; je-li odkazem, kompaktní ring 2.5px/4px.

**Tmavě:** text i čárka accent-tint (#93c5fd) přes `[data-surface="dark"]` — plný akcent má na obsidianu slabý kontrast; tint pro 12px text povinný.

**Na krému:** text i čárka plný accent (#2563eb) — na krému má 4,74:1 = AA i pro 12px text (11.1); accent-deep zůstává jen pro hover.

```html
<span class="id-eyebrow">Kapitola 02</span>
<h2 class="sec-title">Jak změřit tlak a průtok?</h2>
```

```css
.id-eyebrow{display:inline-flex;align-items:center;gap:10px;color:var(--id-accent)}
.id-eyebrow::before{content:'';width:22px;height:1.5px;background:var(--id-accent)}
```

### 7.4 Chip `.id-chip` a Badge `.id-badge`

**Role:** Chip = neutrální metadata pilulka (kategorie, počet, filtr); Badge = sémantická stavová pilulka s tónovaným pozadím. Nikdy nenesou akci — klikací pilulka = `.id-btn--sm`.

**Δ v1→v2:** chip pozadí z bg-2 (#f5f5f7) na cream; přibývá `--outline-accent` (tag kalkulátoru). Badge beze změny hodnot.

**Chip** (layout obou: inline-flex, align-items:center, gap:6px):

| Prvek | Spec |
|---|---|
| Typografie | f-body, 500, 12px |
| Barva / povrch | ink-2 na cream, border 1px solid line-soft |
| Padding / radius | 7px 14px / r-pill |
| `--outline-accent` (tag) | f-display 600 11.5px, ls:.14em, uppercase, color:accent, border:1.5px solid accent, transparent, padding:6px 14px, nowrap |

**Badge:** f-body 600, 12px, ls:.01em, padding:5px 12px, radius pill. Varianty: `--success` green na green-soft; `--warn` warn na warn-soft; `--danger` danger na danger-soft; `--info` accent-deep na accent-soft (v2.9: plný akcent na soft přes krém jen 4,13:1).

**Stavy:** neinteraktivní.

**Tmavě:** chip → color:ink-dark-2, border:1px solid line-dark, transparent pozadí; `--outline-accent` → text i border accent-tint (#93c5fd) — plný akcent je na obsidianu pro 11.5px text 3,8:1 = pod AA (stejné pravidlo jako eyebrow, 7.3). Badge tinty: `--success` green-tint (#6ee7b7) na rgba(16,185,129,.14), `--warn` warn-tint (#f6c85f) na rgba(232,161,61,.14).

Snippet: viz 7.2.

### 7.5 Karty `.id-card`, `.id-card--dark-outline`, `.id-step`

**Role:** Tři formy pro tři povrchy: editorial (bílá + měkký stín) na krému; feature (hairline obrys) na obsidianu; step (krémová, číslo v kroužku) na bílé — postup 1-2-3-4.

**Δ v1→v2:** `.id-card` beze změny (padding, radius, stín); `--tinted` nově míří na cream (CSS třída `.id-card--cream`; v1 #fbfbfd jen legacy). Nové: `--dark-outline` a `.id-step`.

**Editorial `.id-card`:**

| Prvek | Spec |
|---|---|
| Povrch | surface (#ffffff), border 1px solid line-soft |
| Radius / padding | r-card (20px) / clamp(20px,2.4vw,28px) |
| Stín | shadow |
| Hover (`--hover`) | translateY(-3px) + shadow-lg, přechod .25s ease |

**Feature `.id-card--dark-outline`:**

| Prvek | Spec |
|---|---|
| Povrch | transparent (obsidian prosvítá), border:1px solid line-dark, bez stínu |
| Radius / padding | r-card / 28px 26px 30px |
| Kroužek `.fic` | 44px kruh, background:accent-soft, ikona 20px outline stroke:accent 1.8px, mb:18px |
| Titulek | 17px, 600, ls:-.01em, #fff, mb:8px |
| Text | 14.5px, ink-dark-2, lh:1.55 |
| Hover | border-color:rgba(255,255,255,.4) + translateY(-4px), přechod border-color .35s, transform .4s cubic-bezier(.22,.61,.21,1) |
| Grid | 3 sloupce, gap:14px; pod 820px 1 |

**Step `.id-step`:**

| Prvek | Spec |
|---|---|
| Povrch | cream, bez borderu, bez klidového stínu |
| Radius / padding | r-card / 26px 24px 28px |
| Layout | flex; flex-direction:column; gap:14px |
| Číslo `__n` | kruh 34px, border:1.5px solid accent, f-display 600 13px, color:accent (na krému 4,74:1 = AA dle 11.1), centrovaný |
| Titulek | 16.5px, 600, ls:-.01em, lh:1.3 |
| Text | 14.5px, ink-2, lh:1.55 |
| Hover | translateY(-4px) + box-shadow:0 16px 40px rgba(10,12,15,.08), přechod .4s cubic-bezier(.22,.61,.21,1) |
| Grid `.id-steps` | 4 sloupce, gap:14px, margin:50px 0 10px; pod 900px 2, pod 560px 1 |

**Tmavě:** na obsidian patří jen `--dark-outline`; na světlý podklad `--dark-outline` nikdy.

```html
<div class="id-steps"><div class="id-step"><span class="id-step__n">1</span><h3>…</h3><p>…</p></div></div>
<div class="id-card id-card--dark-outline"><div class="fic"></div><h3>…</h3><p>…</p></div>
```

```css
.id-card{background:var(--id-surface);border:1px solid var(--id-line-soft);border-radius:var(--id-r-card);box-shadow:var(--id-shadow)}
```

### 7.6 Stat-tile `.id-stats` / `.id-stat`

**Role:** Řada čísel oddělená hairliny — žádné boxy ani stíny; tabulární číslo s jednotkou v `<small>`, pod ním popisek; typicky 4 pod leadem na krému.

| Prvek | Spec |
|---|---|
| Kontejner | grid; grid-template-columns:repeat(4,1fr); border-top:1px solid line-cream (#dcdad4); mt:70px od leadu |
| Buňka | padding:28px 26px 4px; border-left:1px solid line-cream; :first-child bez borderu, padding-left:0 |
| Číslo `.num` | f-display, 600, clamp(26px,3vw,40px), ls:-.02em, tabular-nums |
| Jednotka `.num small` | font-size:.52em, 600, ink-2, margin-left:2px, ls:0 |
| Popisek `.lbl` | 13px, ink-2, mt:6px, lh:1.45 |
| Responzivita | pod 820px 1fr 1fr; buňky border-top + border-left, padding:22px 18px 18px; 1. a 2. buňka bez border-top, liché bez border-left a s padding-left:0 |

**Stavy:** neinteraktivní; čísla se smí animovat count-upem při scroll-reveal (kap. 6), popisky nikoli.

**Tmavě:** hairliny line-dark, číslo #fff, jednotka i popisek ink-dark-2. Na bílém hairliny line-soft.

```html
<div class="id-stats"><div class="id-stat"><div class="num">10–15<small>l/m²</small></div><div class="lbl">…</div></div></div>
```

```css
.id-stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--id-line-cream)}
```

### 7.7 Kalkulátorový panel `.id-calc`

**Role:** „Tmavý přístroj" na světlé stránce: vlevo vstupy (velká čísla s podtržením, seg přepínače), vpravo výstupy s hairliny, hero výsledek v akcentu, verdikt dole. `--light` na krému pro druhý kalkulátor — dva obsidianové panely za sebou zakázané.

Mapování `--light`: ink-dark-2→ink-2 (labely, jednotka, popisky); line-dark→line-cream (hairliny) resp. line-cream-strong (#d5d3cc) (podtržení inputu, border segu).

**Panel:**

| Prvek | Spec |
|---|---|
| Povrch | obsidian, color:#fff; `--light`: cream, color:ink |
| Radius / padding | r-card / clamp(28px,4vw,52px) |
| Mřížka | grid-template-columns:1fr 1fr; gap:clamp(28px,4vw,64px); pod 820px 1 sloupec |
| Odsazení | margin:56px 0 8px |
| Hlavička `__head` | grid-column:1/-1; flex baseline space-between, gap:20px, wrap; border-bottom:1px solid line-dark; padding-bottom:22px; titulek clamp(20px,2.4vw,28px) 600 ls:-.02em; tag = `.id-chip--outline-accent` (7.4) |

**Vstupy:**

| Prvek | Spec |
|---|---|
| Label | f-display, 600, 12px, ls:.14em, uppercase, ink-dark-2, mb:10px |
| Pole `__field` | mb:26px; řádek input+jednotka flex, gap:12px, align-items:center |
| input[type=number] | transparent, jen border-bottom:2px solid line-dark; border-radius:0; f-display 600 clamp(30px,3.4vw,44px); ls:-.02em; tabular-nums; padding:2px 0 8px; max-width:220px; color:inherit; inputmode="decimal" |
| Focus inputu | outline:none; border-color:accent (podtržení = focus indikátor) |
| Jednotka `.unit` | f-display, 600, 18px, ink-dark-2 |
| Seg `.id-seg` | inline-flex; border:1.5px solid line-dark; radius pill; padding:4px; gap:4px; buttony f-display 600 14px, pill, padding:8px 20px, transparent, color:inherit; aktivní `.on`: background:accent, color:#fff; přechod background .25s, color .25s; focus-visible standard 3px/3px |

**Výstupy:**

| Prvek | Spec |
|---|---|
| Řádek `.orow` | flex space-between baseline; gap:16px; padding:16px 0; border-bottom:1px solid line-dark; pod 640px sloupec s gap:4px |
| Popisek `.ol` | 14px, ink-dark-2 |
| Hodnota `.ov` | f-display, 600, clamp(20px,2.2vw,28px), ls:-.02em, tabular-nums, nowrap |
| Hero `.orow--hero .ov` | clamp(30px,3.4vw,46px), color:accent — jediné akcentové číslo panelu |
| Verdikt | `.id-verdict` (7.8), mt:24px |

**Tmavě:** panel sám JE tmavý podklad; na obsidianový pás stránky jen `--light`.

```html
<div class="id-calc">
<div class="id-calc__head"><h3>Vyhodnoťte kbelíkový test</h3><span class="id-chip id-chip--outline-accent">Kalkulátor</span></div>
<div class="id-calc__field"><label for="vol">Objem</label><div class="inrow"><input type="number" id="vol" inputmode="decimal"><span class="unit">litrů</span></div></div>
<div class="id-calc__out"><div class="orow orow--hero"><span class="ol">Návrhový průtok</span><span class="ov">26,7 l/min</span></div><div class="id-verdict id-verdict--ok">…</div></div>
</div>
```

```css
.id-calc{background:var(--id-obsidian);color:#fff;border-radius:var(--id-r-card);display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,4vw,64px)}
```

### 7.8 Verdikt `.id-verdict` a Callout `.id-callout`

**Role:** Verdikt = dynamické vyhodnocení výsledku (kalkulátor, demo): kruhová ikona + 1–2 věty. Callout = statická redakční vsuvka (tip, upozornění) s tečkou (v1 beze změny hodnot).

**Verdikt:**

| Prvek | Spec |
|---|---|
| Layout | flex; gap:12px; align-items:flex-start; radius r-md (14px); padding:16px 20px |
| Typografie | 14.5px, 500, lh:1.5 |
| Ikona `.ic` | kruh 22px, flex:none, mt:1px; glyf (check/vykřičník) 12px, stroke 2px, barva `currentColor` z `.ic`. **Tmavý (výchozí):** výplň stupněm -bright — ok --id-green-bright, warn --id-warn-bright, info --id-accent-dark — glyf #0b0d10. **Světlý:** výplň textovým stupněm — ok --id-green, warn --id-warn, info --id-accent — glyf #fff (3.4, v2.9) |
| `--ok` tmavý | rgba(16,185,129,.14) / green-tint (#6ee7b7) |
| `--warn` tmavý | rgba(232,161,61,.14) / warn-tint (#f6c85f) |
| `--ok` světlý | --id-green-soft / text --id-green (5,05:1 přes bílou, 4,66:1 přes krém = AA); ikona `.ic` výplň --id-green |
| `--warn` světlý | --id-warn-soft / text --id-warn (5,00:1 přes bílou, 4,61:1 přes krém = AA, v2.9); ikona `.ic` výplň --id-warn |
| `--info` (oba) | accent-soft / accent-deep (tmavý: text accent-tint) |

Změna ok ↔ warn = výměna třídy; přechod background .3s, color .3s. Dynamický verdikt má aria-live="polite".

**Callout (v1):** flex, gap:12px; radius r-md; padding:16px 18px; 15px/1.5; tečka 8px kruh, mt:7px; varianty `--info` accent-soft, `--success` green-soft, `--warn` warn-soft; text vždy ink, titulek 600. Jen na světlé povrchy; na obsidianu místo něj verdikt.

```html
<div class="id-verdict id-verdict--ok" aria-live="polite"><span class="ic"></span><span>…</span></div>
```

```css
.id-verdict{display:flex;gap:12px;align-items:flex-start;border-radius:var(--id-r-md);padding:16px 20px;transition:background .3s,color .3s}
.id-verdict--ok{background:var(--id-green-soft);color:var(--id-green)} /* světlý verdikt: text #047857 = AA (11.1); ikona .ic výplň --id-green + bílý glyf (v2.9) */
```

### 7.9 Interaktivní demo blok `.id-demo`

**Role:** „Vyzkoušejte si to" — krémový panel se živou SVG scénou, sliderem a verdiktovým čipem (ok/warn/info) v reálném čase; jen ve světlé sekci, protipól tmavého kalkulátoru.

| Prvek | Spec |
|---|---|
| Panel | cream; radius r-card; padding:clamp(24px,3.4vw,44px); margin:56px 0 8px |
| Horní řádek | flex space-between center, gap:18px, wrap, mb:8px; titulek clamp(19px,2.2vw,26px), 600, ls:-.02em |
| Čip `__read` | f-display, 600, 14px, radius pill, padding:9px 20px, nowrap, přechod background .3s, color .3s, aria-live="polite"; stavy (v2.9, z tokenů): `--ok` green-soft / text --id-green (4,66:1 přes krém), `--warn` warn-soft / text --id-warn (4,61:1 přes krém), `--info` accent-soft / accent-deep (5,36:1) |
| SVG scéna | width:100%, aria-hidden="true" (význam nese čip a label), animace dle kap. 6 |
| Ovládání `__ctrl` | flex center, gap:20px, mt:22px; pod 640px flex-wrap:wrap |
| Label ovladače | f-display, 600, 12px, ls:.12em, uppercase, ink-2, nowrap |
| Odečet `<output>` | f-display, 600, 22px, min-width:74px, text-align:right, tabular-nums |

**Tmavě:** nepoužívá se — jen bílý/krémový pás.

Snippet: viz 7.7 + 7.8.

### 7.10 Slider `input[type=range]`

**Role:** Jediný „hmatový" ovladač: 2px dráha s akcentovou výplní vlevo od palce, bílý palec s akcentovým prstencem a glow. Výplň řídí proměnná --pct z JS: `slider.style.setProperty('--pct',((val-min)/(max-min)*100)+'%')`.

| Prvek | Spec |
|---|---|
| Dráha | appearance:none; flex:1; cursor:pointer; height:2px; border-radius:2px; background:linear-gradient(to right, accent 0 var(--pct,50%), line-cream-strong var(--pct,50%) 100%) |
| Palec (WebKit) | 28px kruh, background:#fff, border:2.5px solid accent, box-shadow:0 4px 14px rgba(37,99,235,.3) |
| Palec (Firefox) | 26px, stejné barvy (::-moz-range-thumb) |
| Hover palce | scale(1.12), přechod .2s |
| Focus-visible | outline:3px solid accent; offset:6px |
| Přístupnost | vždy aria-label (nebo `<label for>`), hodnotu zrcadlí `<output>` |

**Tmavě:** nevyplněná dráha line-dark místo line-cream-strong; palec beze změny.

Snippet: CSS 1:1 z tabulky (kontext 7.9).

### 7.11 Formulářové pole `.id-field`

**Role:** Boxový input mimo kalkulátor (newsletter, kontakt, checkout): label nad polem, hairline border, akcentový focus ring, hint/error pod polem; velká čísla s podtržením jen v `.id-calc` (7.7).

**Δ v1→v2:** hodnoty z v1; nově závazná i tmavá varianta.

| Prvek | Spec |
|---|---|
| Kontejner | flex; flex-direction:column; gap:7px; max-width:360px |
| Label | 13px, 600, ink, ls:-.01em |
| Input | 16px, ink na surface, border:1px solid line, radius r-md, padding:12px 14px, přechod border-color .2s, box-shadow .2s |
| Placeholder | ink-3 |
| Focus | outline:none; border-color:accent; box-shadow:0 0 0 3px accent-soft (ring nahrazuje outline) |
| Hint | 12px, ink-3 |
| Error (`--error`) | border i hint danger; hláška s role="alert" |
| Disabled | globální kontrakt (opacity .45) |

**Tmavě:** input background:transparent, border:1px solid line-dark, text #fff, placeholder ink-dark-2, label #fff; focus stejný (accent border + ring rgba(37,99,235,.25)). Chyba na tmavém (v2.9): border i hint `--id-danger-bright` (#e45c5a), případná tinta nejvýš rgba(228,92,90,.10); `--id-danger` na obsidianu nikdy (2,49:1).

Snippet: viz 7.7.

### 7.12 Figure & figcaption `.id-fig` — konvence „OBR. NN"

**Role:** Každá ilustrace = číslovaná figura: SVG na krémovém panelu, pod ním hairline a popisek s uppercase číslem; číslování dvouciferné, průběžné na stránce (Obr. 01, 02 …).

| Prvek | Spec |
|---|---|
| Figure | margin:54px 0 10px (v článku); figure{margin:0} jako reset |
| Panel | cream; radius r-card; overflow:hidden; padding:clamp(16px,3vw,40px) |
| SVG | display:block; width:100%; height:auto; text v SVG f-display; popisky `.sv-lbl`: 12px, 600, ls:.1em, uppercase, fill:ink-2 (tmavá: ink-dark-2) |
| Figcaption | 13.5px, ink-2, padding-top:14px, border-top:1px solid mist (#e8e7e3), mt:16px, flex, gap:10px, align-items:baseline |
| Číslo `<b>` | f-display, 600, 11.5px, ls:.06em, uppercase, ink, nowrap; formát vždy „Obr. 01" (dvouciferně) |
| Přístupnost | role="img" + popisný aria-label na `<figure>`; dekorativní SVG uvnitř aria-hidden="true" |
| Úzká figura | volitelně max-width (např. 520px) pro čtvercové motivy |

**Stavy:** neinteraktivní. **Tmavě:** figcaption border-color:line-dark, color:ink-dark-2, číslo `<b>` #fff; SVG panel se vynechává (kresba přímo na obsidianu).

```html
<figure class="id-fig" role="img" aria-label="Kbelíkový test">
<div class="id-fig__panel"><svg viewBox="0 0 1080 400" aria-hidden="true"></svg></div>
<figcaption><b>Obr. 02</b> Kbelíkový test…</figcaption>
</figure>
```

```css
.id-fig{margin:54px 0 10px}
.id-fig__panel{background:var(--id-cream);border-radius:var(--id-r-card);overflow:hidden}
```

### 7.13 Patička `.id-footer`

**Role:** Tichý závěr — jeden řádek: logo vlevo, meta text vpravo, hairline nahoře; žádné sloupce odkazů na obsahových stránkách; vícesloupcová jen e-shop (kap. 8).

| Prvek | Spec |
|---|---|
| Kontejner | border-top:1px solid line-soft (= 8.1 p. 7); padding:34px 0 44px; obsah v `.wrap` (max maxw) |
| Layout | flex; justify-content:space-between; align-items:center; gap:18px; flex-wrap:wrap |
| Meta text | 13.5px, ink-2, oddělovače · |
| Logo | maskované SVG, height:19px (minimální povolená výška), color:ink |

**Stavy:** odkazy — color:ink-2, hover color:accent (.25s), focus-visible kompaktní 2.5px/4px.

**Tmavě (CTA patička):** border-top:1px solid line-dark, text ink-dark-2, logo color:#fff; hover odkazů accent-tint.

Snippet: viz 7.1/7.14.

### 7.14 Logo `.id-logo`

**Role:** Wordmark „inteliDome" se střechou a kapkou — vždy maskované SVG (vnitřky písmen průhledné), barva jen přes currentColor.

**Technika (závazná):** na stránce právě jeden skrytý `<defs>` blok s `<mask id="idlogo-mask">` (obsah z `Obrázky/logo/final/intelidome-logo.svg`, ořezaný viewBox 446 2126 4870 1227, poměr 3,97:1). Každý výskyt = svg s týmž viewBoxem a rect fill:currentColor mask:url(#idlogo-mask) — přesný markup viz 7.1. CSS: `.id-logo{display:block;width:auto;height:21px}`.

| Kontext | Výška | Barva |
|---|---|---|
| Capsule header | 21px | ink |
| Patička | 19px (absolutní minimum) | ink / na tmavé #ffffff |
| CTA sekce (nad závěrečným titulkem) | clamp(30px,4.6vw,50px) | ink |
| Tmavý pás / obsidian | dle kontextu, min. 19px | #ffffff |

**Pravidla:** vždy monochromatické — ink na světlém, #ffffff na tmavém; nikdy accent, gradient ani stín. Nedeformovat (poměr 3,97:1 pevný), nepodkládat plochou, nerotovat. Dekorativní výskyt = aria-hidden="true", významový = role="img" + aria-label="InteliDome" — vždy právě jedna z anotací. Pod 19px se logo nepoužívá; samotná kapka není povolena (wordmark je nedělitelný).

---

## 8. Rytmus stránky & šablony

### 8.1 Partitura pásů

Full-bleed pásy tří povrchů; „rytmus dne na zahradě": obsidian = noc, krém = ráno/podvečer, bílá = poledne.

| Pás | Token | Hodnota |
|---|---|---|
| Bílý | --id-bg | #ffffff |
| Krémový | --id-cream | #f6f5f2 |
| Obsidianový | --id-obsidian | #0b0d10 |

**Pravidla:**

1. Oddělení = posun povrchu, nikdy border mezi povrchy. Hairline 1px (bílá: var(--id-line-soft), krém: #dcdad4) jen mezi sekcemi téhož povrchu.
2. Dva obsidiany nikdy za sebou; mezi nimi min. 2 světlé sekce.
3. **Landing a produktová stránka:** obsidian 20–35 % výšky vč. hero.
   **Článek:** podíl se neměří — na 20 000 px stránce by 20 % znamenalo
   4 000 px tmavé plochy a pravidlo by si odporovalo s p. 8. Platí
   **vzdálenost: nejdelší úsek bez posunu povrchu ≤ 6 000 px** na každé
   přejímkové šířce (393 / 1024 / 1280 / 1440). Vsazený panel posun
   povrchu NEDĚLÁ — povrch kolem něj zůstává týž (v2.7).
4. Po obsidianovém hero vždy krém; z vnitřního obsidianu do bílé povoleno.
5. Panel ≠ pás: kalkulátor/demo smí plavat v bílé sekci jako panel (--id-r-card, padding clamp(28px,4vw,52px)); full-bleed pás bez radiusu. **V dlouhém článku je ale kalkulátor jako PÁS (`surface: band`) to jediné, co udělá posun povrchu** — panel rytmus nenese (v2.7). Stejnou gramatiku smí nést **přehledový modul jako krémový pás** — datová tabulka (`table.surface: krem`) i karta složek (`ingredients`) — obsah drží sloupec podle šířky tabulky; referenční tabulka v ose prózy zůstává na bílé (v2.8, článek 3). Pás si maluje povrch přes celé okno a obsah drží na osách (`.id-band--self`), nikdy `max-width` + `auto` (na širokém okně by zbyly bílé pruhy).
6. Sekce padding-block var(--id-sect-y) (= 96–120px desktop, 72–80px mobil), hustší mezipásy var(--id-sect-y-sm); žádné pevné hodnoty mimo tokeny (5.1). CTA pás rovněž var(--id-sect-y).
7. Footer vždy bílý, border-top 1px var(--id-line-soft), padding 34px 0 44px; „Tmavě (CTA patička)" ze 7.13 platí jen uvnitř závěrečného obsidianového CTA pásu — samostatná tmavá patička neexistuje.
8. **Max 3 obsidiany na stránku do ~9 000 px** (hero + 1 vnitřní + CTA).
   **Delší článek:** 1 vnitřní obsidian na každých započatých ~7 000 px
   výšky, nejvýš 4 celkem, a vždy s p. 2 (mezi dvěma obsidiany min.
   2 světlé sekce). Článek o 19 700 px tedy unese hero + 2 vnitřní +
   produktový pás; CTA zůstává bílé. Pravidlo v původním znění bylo nad
   ~9 200 px nesplnitelné současně s p. 3 (v2.7).

### 8.2 Šablona: Blogový článek

Prototyp hydraulika-zahrady.html; kapitol 3–5.

| # | Sekce | Povrch | Obsah |
|---|---|---|---|
| 0 | Header | frosted capsule | prompt 4; kategorie uprostřed, pill-button „Objevit systém" |
| 1 | Hero | obsidian, min-height 100svh | prompt 1; meta = čas čtení · počet kalkulátorů · InteliDome Journal |
| 2 | Souhrn | krém | summary-lead Archivo na velikosti --id-t-subtitle w500 lh 1.38 (role leadu, ne titulku), na ose prózy 700 px (`--id-maxw-prose`; ADR-006 zrušil track `wide`, §15 p. 2), klíčová fráze v `<em>` akcentem --id-accent (na krému 4,74:1 = AA, 11.1); 4 stat-tiles (prompt 3) |
| 3…N | Kapitoly 01–0N | bílá | eyebrow „Kapitola NN" + sec-title (title škála); 1 SVG figura v krémovém panelu s figcaption „Obr. NN", **sázená asymetricky dle 8.2b**; volitelně kalkulátor (max 2/článek, prompt 2), krémové demo (max 1), step-karty 4× |
| N+1 | Produktový pás | obsidian | eyebrow + titulek; prose #9ba1a8, `<strong>` bílým; `.id-2col` = `1fr 1fr` (652 | 652, gap `--id-gap-col` 56, zlom v ose 720 — ADR-006); 3 feature karty **pod prózou v levém sloupci**, ne v řadě pod pásem (vyrovnávají výšku diagramu — jinak 42 % prázdna, kolo 05) |
| N+2 | CTA | bílá, centrovaná | prompt 6 (logo, H2, sub, btn-blue se šipkou, otázka čtenáři) |
| N+3 | Footer | bílá | hairline top; logo 19px + meta 13.5px --id-ink-2 |

### 8.2a Mřízka článku: tři osy, čtyři šířky, jeden zlom (v2.2, ADR-006)

**Tři levé osy a jejich přesná zrcadla** — součet každé dvojice je šířka
stránky: `0/1440`, `40/1400`, `370/1070`. Nic nezačíná ani nekončí jinde.

**Stránka má JEDNU šířku: 1440 (obsah 1360 + 2×40).** Nad tuhle mez už nic
neroste — přebytek okna se rozdělí do vnějších okrajů a stránka se jen
vycentruje. Platí to pro mřížku článku (`edge` má strop, ne `1fr`), pro
vnitřek pásů i pro utilitu `.container`, na které stojí hero, patička
a ostatní stránky. Dokud strop chyběl, měl web na širokém okně **tři levé
osy najednou** (40 pro článek, 268 pro pásy, 300 pro hero) a mezi textem
a kresbou zela díra 475 px. Osy se nesmí rozejít se šířkou okna.

**Čtyři šířky modulu.** Stránka je součet dvou sloupců a mezery
(`A = 322`, `B = 652`, `g = 56`): próza `A+g+A = 700`, mimoosová figura
`A+g+B = 1030`, pás a dvousloupec `B+g+B = 1360`, full-bleed `1440`.
**Nová šířka je chyba, ne varianta.**

**Jediný zlom stránky je 720 s mezerou 56 px** (sloupce 692 | 748).
Opakuje se ve splitu, kalkulátoru, FAQ i produktovém pásu — osa se tím
nechá vidět, ne nakreslit (8.1 p. 1 platí dál).

**Mimoosová poloha je pár:** právě dvě (+165 / −165) a v článku se
střídají bez výjimky. Tři vysunutí na tutéž stranu = chyba sazby.

**Mezera je vlastnost přechodu, ne komponenty.** Komponenty svislé marginy
nemají. Tři míry: 22 px próza · 40–72 px modul · 64–120 px pás.
Prozaická míra platí pro **všechny prozaické uzly** — odstavce, seznamy
i mezititulky h3 (`p/ul/ol + p/ul/ol` = 22 px, `h3 + próza` = 14 px,
`próza + h3` = 44 px). Kdo ji omezí na `p + p`, dostane mezi „Pátrejte po
třech věcech:" a samotným seznamem díru 72 px. Mezititulek h3 je role
subtitle (4.2), ne druhý titulek kapitoly.

Přejímka: `node scripts/layout-check.mjs <url> [šířka]` — ≤4 osy, ≤4 šířky,
0 jednorázových os, zrcadlení, střídavost 1,00. **Pouští se nejmíň na čtyřech
šířkách: 1440 (návrhová osa), ≥1920 (strop stránky), 1130 (nejužší dvousloupec,
hned nad zlomem) a 1024 (pod stropem);** `svg-labels` navíc na 320 / 393.
Kontrola jen na 1440 by strop mřížky nikdy neprověřila — právě tam se osy
rozešly. Pásmo 1130–1439 (typicky 1280 a 1366) je nejcitlivější na popisky
kreseb: sloupec je tam o 12–24 % užší a měřítko kresby padá s ním.

### 8.2b Asymetrická sazba figur (v2.1)

**Proč:** prose 700 px na střed + figura 960 px na střed dělá rozdíl jen
130 px na stranu — článek pak čte jako **jeden úzký pruh** se šedivými boxy,
ne jako editorial. Předlohy tenhle vzor nemají; 8.3 ř. 4 už zná střídavé
dvousloupcové bloky, článek je jen nedostal.

**Pravidlo:** text zůstává na 700 px (čitelnost), ale **obraz použije šířku,
kterou sazba odmítá**. Mřížka článku má proto linku `edge` přesně o okraj
od kraje stránky:

```
[full-start] minmax(gutter, 1fr) [edge-start] minmax(0, 330) … [content] … minmax(0, 330) [edge-end] minmax(gutter, 1fr) [full-end]
```

Boční sloupce mají **strop 330** (= (1360 − 700) / 2), ne `1fr`. Vnější
okraje jsou naopak pružné a spolknou celý přebytek okna.

| Sazba | `grid-column` | Kdy |
|---|---|---|
| `--offset-right` | `content-start / edge-end` | ukotveno k levé hraně textu, přetéká doprava |
| `--offset-left` | `edge-start / content-end` | ukotveno k pravé hraně textu, přetéká doleva |
| `--bleed` | `full` | **jen fotografie, max 1× za článek**; dle 9.1 padá radius |
| výchozí | `content` (osa prózy 700) | schéma, které širokou sazbu neunese |

1. **Kapitoly se ve stranách střídají** — dvě sousední figury nikdy nekotví
   ke stejné hraně.
2. **Popisek se drží ukotvené hrany**: u `--offset-left` jde doprava
   (`margin-left: auto`), u `--offset-right` zůstává vlevo. Míra 30 em
   (≈ 62 znaků; `62ch` dávalo 85 — `ch` je u SF Pro široký) — nejmenší
   text stránky nesmí mít nejdelší míru. Popisek `--bleed` figury stojí
   **na ose prózy** (levá hrana = osa prózy, 30 em), ne centrovaný —
   centrovaný box zaváděl čtvrtou levou hranu (v2.4).
3. **Pod 900 px offsety mizí** a figura se vrací do osy textu; `--bleed`
   zůstává full-bleed i na telefonu.
4. Full-bleed je **předěl, ne norma**. Schéma s popisky ho neunese
   (rozjede se měřítko), fotografie ano.

**Dvousloupcová kapitola `.id-split`** (vzor z 8.3 ř. 4, teď i pro článek):
obraz a text, které patří k sobě, drží **jeden blok** — v ploché struktuře
Lexicalu se vedle sebe postavit nedají.

| Prvek | Spec |
|---|---|
| Mřížka | `grid-column: edge`; sloupce `1fr 1fr` (652 \| 652, zlom v ose 720); `column-gap: var(--id-gap-col)`; `row-gap: 0`; **`align-items: start`** a **`grid-template-rows: auto 1fr`**; hlava `margin-bottom: 24px` (5.1) |
| Obraz | **portrétová sazba kresby** (viewBox ~520×670). Panoramatická 1080 px by ve sloupci ~590 px měla popisky pod 7 px — do dvousloupce nepatří. |
| Text | max `--id-maxw-prose`; eyebrow + H2 uvnitř bloku, ne nad ním |
| Odsazení | margin-block clamp(64px,8vw,104px) |
| Pod 1130 px | jeden sloupec v pořadí **titulek → obraz → tělo** (v2.3); panel kresby na šířce prózy, ne na `edge` — kresba 520 by v 944 px plavala |

5. **Próza kapitoly běží na dvou osách** — tělo dvousloupce ve sloupci
   652 px, zbytek kapitoly v próze 700 px. Je to vědomá cena za „půl na
   půl" sazbu; čtyři alternativy jsou změřené a horší (§15). Nehledat
   řešení znovu — kresba 520 a próza 700 se na společnou osu do 1360
   nevejdou.
6. **Střídání se počítá přes všechny obrazové bloky**, ne zvlášť pro
   dvousloupce a zvlášť pro figury. Dvě sousední hmoty nikdy na téže straně;
   full-bleed rytmus resetuje. Referenční pořadí článku:
   `vlevo → vpravo → vlevo → full-bleed → vpravo`.
7. Kresba potřebuje **portrétovou variantu**, má-li jít do dvousloupce.
   Bez ní patří do asymetrické figury, kde má šířku.

### 8.3 Šablona: Landing page

Header dle článku s CTA „Koupit systém"; footer standardní.

| # | Sekce | Povrch | Obsah |
|---|---|---|---|
| 1 | Hero | obsidian, 100svh | obdoba promptu 1 + btn-ghost (border tmavá hairline, hover bílý); SVG scéna zahrady (postřikovač, ripples, kapky) |
| 2 | Manifest | krém | summary-lead (1 fráze akcentem) + 4 stat-tiles (úspora vody, počet sektorů, doba instalace, záruka) |
| 3 | Jak to funguje | bílá | eyebrow + sec-title; 4 step-karty (krém, číslo v kroužku 34px, akcentní border 1.5px) |
| 4 | Funkce v akci | bílá (hairline od #3) | 3 střídavé 2sloupcové bloky text+obraz (foto radius 20 / SVG v panelu); gap clamp(34px,5vw,90px) |
| 5 | Systém | obsidian | síťový diagram (bridge uprostřed, ventily/čidla vlhkosti/retenční nádrž/osvětlení, dashline spoje) + 3 feature karty |
| 6 | Vyzkoušejte si to | bílá | 1 interaktivní prvek: krémové demo se sliderem (akcentní dráha) NEBO obsidianový kalkulátor — nikdy oba |
| 7 | Aplikace | krém | SVG/screenshot telefonu (min(320px,78vw), drop-shadow 0 34px 70px rgba(0,0,0,.55)) + 3–4 benefity s outline ikonami |
| 8 | Důvěra | bílá | citace zákazníků Archivo clamp(19px,2.2vw,26px) w500, hairline oddělené, jméno 13.5px uppercase |
| 9 | Závěrečné CTA | obsidian | logo bílé; H2 display; sub #9ba1a8; btn-blue + btn-ghost |

### 8.4 Šablona: Produktová stránka

Jediná začíná krémem (produktové foto potřebuje světlý pás). Header s CTA „Do košíku"; footer standardní.

| # | Sekce | Povrch | Obsah |
|---|---|---|---|
| 1 | Product hero | krém | 2 sloupce 1.1fr 1fr, gap clamp(34px,5vw,72px): vlevo foto v kontextu (4:5, radius 20); vpravo eyebrow, název (title škála), cena stat škála, jednotka „Kč", dostupnost verdikt-chip (ok/warn), btn-blue plné šířky, popis 17px ≤60ch |
| 2 | Galerie | bílá | grid 2–4 fotografií, gap 14–16px, radius 20; vše v kontextu zahrady, žádný packshot |
| 3 | Parametry | bílá (hairline od #2) | 4 stat-tiles (dosah, počet sektorů, krytí, napájení) + tabulka specifikací: řádky var(--id-line-soft), label 14px --id-ink-2, hodnota Archivo 600 |
| 4 | V systému | obsidian | co umí s bridge: SVG diagram zapojení + 3 feature karty |
| 5 | V balení | krém | řádka outline ikon 24px (stroke 1.8px), popisky 14.5px |
| 6 | Kompatibilita | bílá | prose ≤700px + badge/chips (pill, 12px 600 uppercase) |
| 7 | Příslušenství | bílá (hairline od #6) | 3sloupcový grid karet (bílá s borderem var(--id-line-soft), hover translateY(−3px) + --id-shadow) |
| 8 | CTA | obsidian | H2 + cena + btn-blue; mezi #4 a #8 3 světlé sekce |

## 9. Obraz

### 9.1 Fotografie

| Pravidlo | Hodnota |
|---|---|
| Světlo | přirozené, teplé, 3200–5000 K; zákaz blesku a studia |
| Prostředí a lidé | reálná zahrada/terasa/záhon/dům; produkt vždy v kontextu, nikdy packshot na bílém/šedém; lidé jen v akci, bez pohledu do kamery |
| Kompozice | produkt 8–30 % plochy záběru; hloubka ostrosti mělká (f/2–f/4) u detailů, plná u scén |
| Poměry stran | 3:2 editorial, 4:5 product hero/portrét, 21:9 full-bleed |
| Ořez | v obsahu radius 20px; full-bleed bez radiusu |
| Text přes foto | jen bílý při lokálním kontrastu ≥4.5:1; jinak scrim linear-gradient(rgba(11,13,16,.55), transparent) max do 62 % výšky |
| Formát | AVIF + WebP fallback; LCP/hero ≤260 kB, karty ≤120 kB; srcset+sizes povinné; LCP fetchpriority="high" + preload, ostatní loading="lazy" |
| Podíl | landing a produktová 30–40 % plochy; článek smí být bez fotografií (obraz nesou SVG figury) |
| Alt | povinný, obsahový, česky; nikdy prázdný u informačního obrazu |

### 9.2 SVG ilustrace

Technická kresba: obrys, žádné 3D ani stínování; jediné gradienty dva radiální (voda, sucho).

**Paleta (závazná):**

| Prvek | Hodnota |
|---|---|
| Půda ornice / podloží | #6b5138 op .9 / #54402c op .85 |
| Tráva / hloubka | #3f7d4e / #2e6440 |
| Suchá místa | #c2a052, rad. gradient .95→0 |
| Voda / akcent | #2563eb, rad. gradient .34→.14→.05 |
| Vodní tinty | #3b82f6, #60a5fa, #93c5fd |
| Kořeny | #d8c9b4 op .8, stroke 1.6px |
| HW světlý / tmavý | #232830 / #12161b + stroke rgba(255,255,255,.18–.22) |
| Slunce / teplo | #b76a00, op .55–.85 — ilustrační okr, od v2.9 odpojený od stavového `--id-warn` (#995b00) |
| Rovnoměrnost / OK | #047857 — nikdy přímo na plochu trávy #3f7d4e (ΔE jen 3,9); vždy s popiskem nebo na krémovém podkladu (v2.9) |
| Konstr. linky sv. / tm. | #d5d3cc (osy, kružnice) / rgba(255,255,255,.12–.14) (zem) |

**Pravidla:**

1. Jeden akcent na figuru: #2563eb = voda/aktivní bod, nikdy 2 nesouvisející modré motivy (tinty = týž motiv).
2. Stroke 1.5–2.5px, default 1.6px, linecap round; pomocné kružnice a osy dasharray 3 7 #d5d3cc.
3. Popisky .sv-lbl: Archivo 12px w600 uppercase ls .1em, fill #595650 (= --id-ink-2, v2.9) / #9ba1a8 (tmavý); hodnoty `.sv-val` 15 px w600 ink. **Klíčová hodnota (pointa kresby) 24 px w600 — jeden stupeň pro všechny kresby článku** (v2.4; porota článku 2 našla 20/22/24/26/30 px v šesti kresbách). Kresba se škáluje s viewBoxem: na ≤ 560 px se `.sv-lbl/.sv-val` zvětšují na 15/18 px (≤ 360: 18/21) a vykreslené minimum je 10 px; přejímka `scripts/svg-labels.mjs` hlídá kolize text × text i značka × text a ořez o panel.
4. Keyframes: kapky 2.6–3.2 s, ripples 4.6 s, plnění 5 s, rotace 5.5–7 s, paprsky 26 s; bodová rotace vždy SMIL animateTransform rotate „a cx cy" (fill-box = rotace kolem bboxu).
5. reduced-motion: jednotně dle kontraktu 6.7 a 6.6.4 — animation: none (platí klidový stav z markup) + JS remove všech SMIL uzlů (animateTransform, animate, animateMotion); žádné zkracování na 0,01 ms u animation.
6. ViewBox: plná šířka 1080×300–430, poloviční 480–560; figura v krémovém panelu (padding clamp(16px,3vw,40px)).
7. Figcaption: b „Obr. NN" Archivo 11.5px 600 uppercase .06em + popis s pointou 13.5px --id-ink-2; hairline nad (border-top 1px, padding-top 14px).
8. Alt povinný: informační `<figure role="img" aria-label="…">`, dekorativní (hero scéna) aria-hidden="true"; každá kapitola vlastní figuru.
9. **Obrys hmoty (v2.7):** každá souvislá hmota (půda, voda v nádobě, hardware) má uzavřený obrys `#232830` / 1,6 px, `stroke-linejoin: round`. Obrys se NEkreslí přes hranu, kterou už nese jiná barva (drn `#2e6440`) — tvar `V…H…V`, ne uzavřený `Z`, jinak se hrana ztmaví dvojitým tahem. Tohle je jediný rozdíl, který se mezi články kodifikuje; měkký radiální nádech (např. „kam došla voda") je naopak nositel pointy a plošně se na ploché výplně nepřevádí.
10. **Barevný klíč, dvě úrovně (v2.7).** *Úroveň 1:* barva z tabulky palety nesmí být výplní objektu, který tou hmotou není — `#6b5138` je ornice, `#d5d3cc` konstrukční linka, ne plocha. *Úroveň 2:* kresba smí barvu použít v jiném významu (abstraktní pásmo stupnice), jen když nese legendu v TÉMŽE panelu a značka v legendě je pixelově shodná se značkou v kresbě — táž značka nesmí mít v jedné kresbě dva obrysy.

### 9.3 Ikony

| Pravidlo | Hodnota |
|---|---|
| Styl | outline bez výplní (výjimka: akcentní tečka/kapka ≤8px uvnitř) |
| Stroke | 1.6–2px, linecap+linejoin round |
| Velikosti | 20px (karty, chipy), 24px (samostatné, „v balení"); jiné zakázány |
| Barva | currentColor; funkční akcentní ikona #2563eb v kruhu 44px, pozadí var(--id-accent-soft) |
| Zdroj | vlastní SVG viewBox 0 0 20 20 / 0 0 24 24 |

### 9.4 Logo

Wordmark „inteliDome"; zdroj Obrázky/logo/final/intelidome-logo.svg, ořez na 3.97:1 (viewBox v ukázce). Jediné povolené vkládání = maskované SVG, barvení přes currentColor: `<defs>` s `<mask id="idlogo-mask">` 1× na stránku (skryté svg); užití:

```html
<svg viewBox="446 2126 4870 1227" role="img" aria-label="InteliDome">
 <rect x="446" y="2126" width="4870" height="1227" fill="currentColor" mask="url(#idlogo-mask)"/>
</svg>
```

| Pravidlo | Hodnota |
|---|---|
| Výšky | min. 19px (footer) · header chip 21px · CTA clamp(30px,4.6vw,50px) |
| Barvy | --id-ink na světlých, #ffffff na obsidianu; akcent, gradienty, stíny, obrysy zakázány |
| Ochranná zóna | 0.5× výšky loga na všech 4 stranách |
| Na fotografii | jen bílé, jen při lokálním kontrastu ≥4.5:1 |
| Deformace | zákaz nerovnoměrného scale, rotace, průhlednosti <100 % |
| Přístupnost | dekorativní aria-hidden="true" focusable="false"; funkční odkaz domů aria-label="InteliDome — domovská stránka" |

## 10. Do / Don't

### Do

1. Sekce odděluj posunem povrchu, ne čarou (8.1 p. 1).
2. Autoritu nese velikost: display w600 na display-xl škále (12.1).
3. Buttony a chipy pill (--id-r-pill 980px); primární padding 16px 30px, Archivo 15.5px w600.
4. Akcent #2563eb pod 5 % plochy — CTA, odkazy, focus ring, eyebrow, klíčové číslo, 1 prvek v SVG.
5. Krém místo šedé pro panely, dema, step-karty, mezipásy.
6. Sloupec prózy i lead souhrnu 700 px (`--id-maxw-prose`); **míra textu** je 33 em (4.3 p. 4, ADR-007), ne šířka boxu.
7. tabular-nums na každém čísle; jednotka `<small>` 0.52em v --id-ink-2.
8. Stat řady odděluj hairline, ne kartami/stíny.
9. Scroll-reveal jednotně dle QR POHYB.
10. Hover karet translateY(−3 až −4px) + stín max 0 16px 40px rgba(10,12,15,.08); buttony translateY(−2px); 200–400 ms (6.2).
11. Produkt fotografuj dle 9.1: kontext zahrady, teplé světlo, 8–30 % plochy.
12. Informační figura dle 9.2 p. 7–8 (role="img" + aria-label + figcaption).
13. Focus-visible vždy dle 11.2; ring ≥ 3:1 všude (11.1).
14. Eyebrow: 12px w600 uppercase tracking .14em (jediná hodnota — 4.2, 7.3, 12.1; vědomá Δ proti prototypovým .16em), akcent + čárka 22×1.5px; na obsidianu #93c5fd, na světlém i krému plný akcent.

### Don't

1. Nikdy Framer Motion — jen GSAP + ScrollTrigger a CSS; jen transform/opacity (QR).
2. Nikdy w700+ na display, max 600 na `<strong>` v body (4.1 — systémový stack 650 spolehlivě neumí).
3. Žádná čistá černá #000000 — tmavý povrch vždy modročerný #0b0d10.
4. Akcent nikdy plošně — žádná modrá pozadí, gradienty, dekorativní tvary, modré ilustrace.
5. Žádné studiové packshoty na bílém, žádné pózování do kamery.
6. Žádné další chromatické barvy: #047857 / #995b00 / #a21723 jen stavové (verdikt, dostupnost, chyba).
7. Dva obsidiany za sebou a obsidian >35 % výšky zakázány (8.1).
8. Dekorativní bordery nad 1.5px zakázány (výjimky: input underline 2px, slider thumb 2.5px, focus ring 3px).
9. Stíny těžší než --id-shadow-lg a barevné zakázány — výjimka jen CTA glow (12.1).
10. Necentruj body text — centrovaná jen CTA sekce a display titulky; odstavce vlevo s max šířkou.
11. Lh dle 4.2: display-xl/display/title nikdy nad 1.05, title-sm nad 1.12, subtitle nad 1.25; body nikdy nad 1.7.
12. Bodová rotace v SVG nikdy přes CSS transform-origin — vždy SMIL rotate(a cx cy) (9.2 p. 4).
13. Setrvačníkový scroll nikdy na touch ani při prefers-reduced-motion.
14. Text v akcentu na `--id-accent-soft` nikdy — vždy `--id-accent-deep` (3.4, v2.9). Dřívější zákaz #86868b pod 24 px padl s paletou v2.9: `--id-ink-3` #716e68 má 5,08:1.
15. Žádné emoji; žádné ikonové fonty.

## 11. Přístupnost

### 11.1 Kontrastní páry

| Popředí | Podklad | Poměr | 17px/velký* | Použití |
|---|---|---|---|---|
| #1d1d1f | #ffffff | 16.83:1 | AAA/AAA | body/titulky bílá |
| #1d1d1f | #f6f5f2 | 15.44:1 | AAA/AAA | text krém |
| #595650 | #f6f5f2 | 6.71:1 | AA/AAA | sekundární, figcaption |
| #595650 | #ffffff | 7.31:1 | AAA/AAA | sekundární bílá |
| #716e68 | #ffffff | 5.08:1 | AA/AAA | metadata, hint, placeholder |
| #716e68 | #f6f5f2 | 4.66:1 | AA/AAA | metadata na krému |
| #ffffff | #0b0d10 | 19.46:1 | AAA/AAA | text tmavý |
| #9ba1a8 | #0b0d10 | 7.47:1 | AAA/AAA | sekundární tmavý |
| #7c828b | #14171c | 4.64:1 | AA/AAA | metadata v panelu obsidian-2 |
| #93c5fd | #0b0d10 | 10.79:1 | AAA/AAA | eyebrow tmavý |
| #ffffff | #2563eb | 5.17:1 | AA/AAA | primární CTA |
| #2563eb | #ffffff | 5.17:1 | AA/AAA | odkazy, eyebrow bílá |
| #2563eb | #f6f5f2 | 4.74:1 | AA/AAA | akcent na krému — eyebrow i odkazy smí plný akcent |
| #1d4ed8 | #ffffff | 6.70:1 | AA/AAA | hover odkazů |
| #60a5fa | #0b0d10 | 7.65:1 | AAA/AAA | odkazy a akcentový text tmavý |
| #047857 | #ffffff | 5.48:1 | AA/AAA | stavový text OK na světlém |
| #047857 | #f6f5f2 | 5.03:1 | AA/AAA | stavový text OK na krému |
| #10b981 | #ffffff | 2.54:1 | ✗/✗ | jen výplně/grafy/ikony — text zakázán |
| #995b00 | #ffffff | 5.45:1 | AA/AAA | stavový text „pozor" na bílé |
| #995b00 | #f6f5f2 | 5.00:1 | AA/AAA | „pozor" na krému |
| #995b00 | warn-soft přes krém | 4.61:1 | AA/AAA | badge a verdikt „pozor" |
| #a21723 | #ffffff | 7.83:1 | AAA/AAA | chybový text; bílý text na destruktivním tlačítku |
| #a21723 | danger-soft přes krém | 6.59:1 | AA/AAA | badge chyby |
| #047857 | green-soft přes krém | 4.66:1 | AA/AAA | badge a verdikt OK |
| #1d4ed8 | accent-soft přes krém | 5.36:1 | AA/AAA | text info badge a verdiktu; hover ghost (5,82 přes bílou) |
| #e45c5a | #0b0d10 | 5.54:1 | AA/AAA | chyba na tmavém |
| #6ee7b7 | #0b0d10 | 12.77:1 | AAA/AAA | verdikt ok, tmavý kalkulátor |
| #f6c85f | #0b0d10 | 12.37:1 | AAA/AAA | verdikt warn, tmavý kalkulátor |

\* Velký text: ≥24px, nebo ≥18.66px při w≥700 (Archivo 600 od 19px ber jako běžný).

Non-text (WCAG 1.4.11, min 3:1): #2563eb proti bílé 5.17, krému 4.74, obsidianu 3.76 — vyhovuje všude. #10b981 proti bílé 2.54 — jako samostatný funkční glyf na světlém nedostačuje; emerald výplně vždy párovat s ink/green textem nebo obrysem. Proto ikona stavu na světlém plní `--id-green` (bílý glyf 5,48:1) a na tmavém stupeň `-bright` s glyfem #0b0d10 (v2.9).

### 11.2 Focus

```css
:where(a, button, input, select, [tabindex="0"]):focus-visible {
 outline: 3px solid var(--id-accent);
 outline-offset: 3px;
 border-radius: inherit;
}
input[type="range"]:focus-visible { outline-offset: 6px; }
```

- :focus-visible, nikdy holé :focus, nikdy outline: none bez náhrady.
- Pořadí tabů = DOM; fixní header v DOM první, max 3 fokusovatelné prvky; setrvačník nesmí zachytávat klávesnici (jen wheel listener).

### 11.3 ARIA vzory

**Kalkulátor:**

```html
<div role="group" aria-labelledby="calc-title">
 <h3 id="calc-title">…</h3>
 <label for="area">Plocha</label>
 <div class="id-calc__inrow">
  <input type="number" id="area" inputmode="numeric" min="1" max="20000"
         aria-describedby="area-u">
  <span class="unit" id="area-u">m²</span>
 </div>
 <button aria-pressed="true">2 dny</button>
 <button aria-pressed="false">3 dny</button>
 <div aria-live="polite">… všechny výstupní řádky …</div>
</div>
```

Viditelný `<label for>` u inputů; segmented = buttony s aria-pressed v role=group, ne radio-hack; aria-live polite, nikdy assertive; přepočet mění textContent, ne DOM; verdikt textem (ikona + formulace).

**Jednotka patří do přístupného jména pole** (v2.6): `<label for>` nese jen název veličiny, takže odečítač jinak ohlásí „Plocha, 100" bez jednotky. Jednotku připojí `aria-describedby` na `<span class="unit">`. Platí **jen pro pole s jednotkou** — formulářová pole bez ní (7.11) `aria-describedby` nedostávají, tam by jen přidalo hluk.

**Živá oblast obepíná všechny výstupy, ne jen verdikt** (v2.6): s `aria-live` pouze na verdiktu neohlásí odečítač přepočet čtyř z pěti polí. Vnořovat živé oblasti do sebe se nesmí — nese ji výstupní sloupec.

**Slider:** nativní `<input type="range" min="70" max="160" step="1" value="140">` s aria-labelem; hodnota i textově v `<output for aria-live="polite">` („140 %"); verdikt-chip mění text i třídu.

**SVG figury:** aria-label popisuje sdělení, ne kresbu; dekorativní focusable="false"; .sv-lbl nenahrazuje alt — čtečky přes role="img" čtou jen aria-label.

**Pohyb:** reduced-motion vypíná animace i tranzice; .rv prvky rovnou viditelné (opacity 1, bez transformu); SMIL uzly pryč; scroll-behavior: smooth se nezapíná; anchor→scrollIntoView({behavior:'auto'}).

## 12. Agent Prompt Guide

### 12.1 Quick Reference

```
TEXT --id-ink #1d1d1f · --id-ink-2 #595650 · --id-ink-3 #716e68
NA TMAVÉM #ffffff · --id-ink-dark-2 #9ba1a8 · eyebrow #93c5fd · hairline rgba(255,255,255,.14)
AKCENT --id-accent #2563eb · hover/deep #1d4ed8 · soft rgba(37,99,235,.10)
SÉMANTIKA green (text) #047857 · emerald (výplně/grafy) #10b981 · warn #995b00 · danger #a21723 · -soft = pigment s alfou (světlost krému)
HAIRLINES --id-line rgba(0,0,0,.12) · --id-line-soft rgba(0,0,0,.07)
FONTY display 'Archivo' 500/600/700 (Google Fonts, latin-ext) · body -apple-system, BlinkMacSystemFont,
  'SF Pro Text', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif
ŠKÁLA display-xl clamp(48px,8.4vw,112px)/.98/-.035em · title clamp(30px,4.2vw,52px)/1.05/-.025em ·
  body 17px/1.65 · label 12px/600/UPPERCASE/.14em · stat clamp(26px,3vw,40px) tabular-nums
RADIUSY --id-r-card 20px · --id-r-md 14px · --id-r-sm 10px · --id-r-pill 980px
STÍNY --id-shadow 0 4px 24px rgba(0,0,0,.06) · --id-shadow-lg 0 12px 48px rgba(0,0,0,.10) ·
  CTA glow 0 12px 32px rgba(37,99,235,.35)
LAYOUT --id-maxw 1200px · prose 700px · sekce 96–120px (mobil 72–80px) · grid gap 14–16px
POHYB --id-ease cubic-bezier(.22,.61,.36,1) · reveal .8s translateY(30px)→0 + opacity,
  easing (.22,.61,.21,1), stagger 80ms max 4 · jen transform/opacity
```

### 12.2 Example Prompts

**1 — Hero článku**
Hero dle 8.2 ř. 1: obsah dole (padding 72px); eyebrow dle Do 14 (#93c5fd). H1 display-xl bílá max 12ch, řádky v overflow-hidden spanech translateY(110 %)→0 za 1 s, 2. řádek delay 120 ms; podtext ≤600px 17–19px #9ba1a8, fade-in 1 s delay .55 s; meta 12.5px uppercase .12em #9ba1a8 (--id-ink-dark-2 — tmavší šedé na obsidianu padají pod AA, 11.1). SVG postřikovač s ripples (aria-hidden); scroll-cue kruh 52px vpravo dole, border 1.5px tmavá hairline, s aria-labelem.

**2 — Kalkulátor**
Panel dle 8.1 p. 5 na #0b0d10; grid 2 sloupce gap clamp(28px,4vw,64px), pod 820px 1 sloupec; hlavička: H3 clamp(20px,2.4vw,28px) w600 bílá + pill tag (text i border #93c5fd --id-accent-tint, border 1.5px, text 11.5px uppercase .14em — tmavá varianta 7.4), pod ní tmavá hairline. Vstupy: label 12px uppercase #9ba1a8 s for; input number jen border-bottom 2px tmavá hairline, Archivo w600 clamp(30px,3.4vw,44px), focus #2563eb, jednotka 18px; výstupy aria-live=polite: label 14px / hodnota w600 clamp(20px,2.2vw,28px), hairline oddělené, hero výstup clamp(30px,3.4vw,46px) #2563eb. Verdikt: radius 14px, padding 16px 20px: ok = rgba(16,185,129,.14) + #6ee7b7 + ikona 22px --id-green-bright #34d399 s glyfem #0b0d10; warn = rgba(232,161,61,.14) + #f6c85f + ikona --id-warn-bright #e8a13d s glyfem #0b0d10 (ikona stavu 3.4, v2.9).

**3 — Stat tiles**
4 stat-tiles na krému: grid repeat(4,1fr), nad řadou border-top 1px #dcdad4, dlaždice border-left 1px #dcdad4 (první bez), padding 28px 26px 4px (dtto vlevo). Číslo stat škála w600 ls −.02em #1d1d1f; jednotka dle Do 7 (w600 #595650); popisek 13px #595650 lh 1.45. Pod 820px grid 2×2 s hairline i vodorovně; bez karet a stínů.

**4 — Frosted header**
Capsule: fixed, inset 18px 0 auto, wrapper pointer-events none / chip auto; chip rgba(255,255,255,.90), blur(18px), border 1px var(--id-line-soft), radius 980px (--id-r-pill), padding 10px 12px 10px 24px, stín 0 8px 30px rgba(10,12,15,.10), gap 26px. Logo dle 9.4 (maskované SVG, 21px, #1d1d1f, aria-label), focus ring 2.5px #2563eb offset 4px; kategorie 12.5px Archivo 600 uppercase .1em #595650 (pod 640px skrýt). Pill button #1d1d1f, bílý 13.5px Archivo 600, padding 9px 18px, hover #2563eb za 250 ms.

**5 — Feature karta na tmavé**
Karta na #0b0d10: průhledná, border 1px tmavá hairline, padding 28px 26px 30px; nahoře akcentní ikona dle 9.3 (kruh 44px, stroke 1.8px); titulek Archivo 17px w600 bílý ls −.01em; text 14.5px #9ba1a8 lh 1.55. Hover border-color rgba(255,255,255,.4) + translateY(−4px), transition .35–.4 s; tři karty grid repeat(3,1fr) gap 14px, pod 820px 1 sloupec; bez stínů a výplní.

**6 — CTA sekce**
CTA na bílé, centrovaná, padding dle 8.1 p. 6; logo dle 9.4 (#1d1d1f, výška CTA); H2 clamp(36px,6vw,76px) w600, lh 1.02, ls −.03em, max 16ch; podtext max 560px clamp(16px,1.5vw,18.5px) #595650. Primární pill 980px (--id-r-pill) dle Do 3, šipka 15px; hover translateY(−2px) + CTA glow; focus ring dle 11.2. Otázka čtenáři: border-top 1px var(--id-line-soft), padding-top 44px, max 720px, clamp(19px,2.2vw,26px) w500 #595650, tučná část #1d1d1f.

---

## 13. Quick Start

Kompletní tokenová vrstva v2.0 ke zkopírování. Hodnoty jsou 1:1 s kapitolami 3–6; při rozporu platí tabulky kapitol.

### 13.1 CSS `:root`

```css
:root {
  /* ---- surfaces ---- */
  --id-bg: #ffffff;
  --id-cream: #f6f5f2;
  --id-bg-2: var(--id-cream);          /* alias v1 */
  --id-surface: #ffffff;
  --id-mist: #e8e7e3;                  /* hover secondary, hairline figcaption */
  --id-obsidian: #0b0d10;
  --id-obsidian-2: #14171c;
  --id-bg-2-legacy: #f5f5f7;           /* jen admin; na webu zakázán */
  --id-bg-3: #fbfbfd;                  /* deprecated; jen admin/legacy */

  /* ---- ink ---- */
  --id-ink: #1d1d1f;
  --id-ink-2: #595650;
  --id-ink-3: #716e68;
  --id-ink-dark: #ffffff;
  --id-ink-dark-2: #9ba1a8;
  --id-ink-dark-3: #7c828b;

  /* ---- brand ---- */
  --id-accent: #2563eb;
  --id-accent-deep: #1d4ed8;
  --id-accent-soft: rgba(37, 99, 235, 0.10);
  --id-accent-dark: #60a5fa;           /* odkazy a akcentový text < 30px na obsidianu (3.4) */
  --id-accent-tint: #93c5fd;           /* eyebrow, uppercase tagy a hover odkazů na obsidianu (3.4) */
  --id-green: #047857;                 /* stavový text OK na světlém (AA) */
  --id-emerald: #10b981;               /* výplně, grafy, ikony — nikdy text (3.4) */
  --id-green-soft: rgba(16, 185, 129, 0.09);  /* světlost krému (v2.9) */
  --id-green-bright: #34d399;
  --id-green-tint: #6ee7b7;
  --id-warn: #995b00;
  --id-warn-soft: rgba(232, 161, 61, 0.12);
  --id-warn-bright: #e8a13d;
  --id-warn-tint: #f6c85f;
  --id-danger: #a21723;
  --id-danger-soft: rgba(228, 92, 90, 0.08);
  --id-danger-bright: #e45c5a;
  /* zemité tóny — výhradně SVG ilustrace (9.2) */
  --id-soil: #6b5138;
  --id-soil-deep: #54402c;
  --id-grass: #3f7d4e;
  --id-grass-dry: #c2a052;

  /* ---- lines ---- */
  --id-line: rgba(0, 0, 0, 0.12);
  --id-line-soft: rgba(0, 0, 0, 0.07);
  --id-line-cream: #dcdad4;
  --id-line-cream-strong: #d5d3cc;
  --id-line-dark: rgba(255, 255, 255, 0.14);
  --id-line-dark-soft: rgba(255, 255, 255, 0.08);

  /* ---- shadows ---- */
  --id-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  --id-shadow-lg: 0 12px 48px rgba(0, 0, 0, 0.10);
  --id-shadow-cta: 0 12px 32px rgba(37, 99, 235, 0.35);

  /* ---- type ---- */
  /* --id-f-archivo se v :root NEdefinuje — dodává ho výhradně next/font třída na <html> (13.3).
     Definice zde by měla stejnou specificitu (0,1,0) a podle pořadí stylesheetů by mohla
     self-host řez potichu vyřadit → Arial fallback. Statické stránky s <link> pokryje
     fallback hodnota ve var(). */
  --id-f-display: var(--id-f-archivo, "Archivo"), "Archivo Fallback", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  --id-f-body: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  --id-f-mono: "SF Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --id-t-display-xl: min(clamp(48px, 8.4vw, 112px), max(40px, 12.5vw));
  --id-t-display: clamp(36px, 6vw, 76px);
  --id-t-title: clamp(30px, 4.2vw, 52px);
  --id-t-title-sm: clamp(24px, 3.2vw, 36px);
  --id-t-subtitle: clamp(21px, 2.6vw, 28px);
  --id-t-lead: clamp(18px, 2vw, 21px);
  --id-t-body: 17px;
  --id-t-body-sm: 14.5px;
  --id-t-caption: 13.5px;
  --id-t-label: 12px;
  --id-t-btn: 15.5px;
  --id-t-btn-sm: 13.5px;
  --id-t-stat: clamp(26px, 3vw, 40px);
  --id-t-stat-xl: clamp(40px, 5.4vw, 64px);

  /* ---- geometry ---- */
  --id-maxw: 1200px;
  --id-maxw-prose: 700px;
  --id-s-4: 4px; --id-s-8: 8px; --id-s-12: 12px; --id-s-16: 16px;
  --id-s-24: 24px; --id-s-32: 32px; --id-s-40: 40px; --id-s-48: 48px;
  --id-s-64: 64px; --id-s-80: 80px; --id-s-96: 96px; --id-s-120: 120px;
  --id-sect-y: clamp(72px, 10vw, 120px);
  --id-sect-y-sm: clamp(64px, 8vw, 96px);
  --id-gap-grid: 16px;                 /* ≤768px: 14px */
  --id-pad-card: clamp(20px, 2.4vw, 28px);
  --id-pad-panel: clamp(24px, 3.4vw, 40px);
  --id-pad-x: clamp(24px, 4.5vw, 40px);
  --id-r-card: 20px;
  --id-r-md: 14px;
  --id-r-sm: 10px;
  --id-r-pill: 980px;

  /* ---- motion ---- */
  --id-ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  --id-ease-reveal: cubic-bezier(0.22, 0.61, 0.21, 1);
  --id-ease-draw: cubic-bezier(0.3, 0.1, 0.3, 1);
  --id-ease-fill: cubic-bezier(0.3, 0.1, 0.4, 1);
  --id-ease-ripple: cubic-bezier(0.16, 0.6, 0.4, 1);
  --id-ease-soft: cubic-bezier(0.25, 0.1, 0.25, 1);
  --id-dur-micro: 250ms;
  --id-dur-hover: 350ms;
  --id-dur-reveal: 800ms;
  --id-dur-rise: 1000ms;
  --id-dur-draw: 1600ms;
  --id-stagger-reveal: 80ms;
  --id-stagger-rise: 120ms;
  --id-delay-herosub: 550ms;
}
```

### 13.2 Tailwind v4 `@theme`

Blok referencuje `:root` přes `@theme inline` — jediný zdroj hodnot zůstává 13.1. Číselná 8px škála `--id-s-4`–`--id-s-120` = výchozí Tailwind spacing (`p-1` = 4px … `p-30` = 120px), breakpointy 640/768/1024/1280 = výchozí `sm`–`xl` (5.4) — nic se nepřepisuje. Délky animací: `duration-[var(--id-dur-hover)]`.

```css
@import "tailwindcss";

@theme inline {
  /* barvy → bg-*, text-*, border-* */
  --color-bg: var(--id-bg);
  --color-cream: var(--id-cream);
  --color-surface: var(--id-surface);
  --color-mist: var(--id-mist);
  --color-obsidian: var(--id-obsidian);
  --color-obsidian-2: var(--id-obsidian-2);
  --color-ink: var(--id-ink);
  --color-ink-2: var(--id-ink-2);
  --color-ink-3: var(--id-ink-3);
  --color-ink-dark: var(--id-ink-dark);
  --color-ink-dark-2: var(--id-ink-dark-2);
  --color-ink-dark-3: var(--id-ink-dark-3);
  --color-accent: var(--id-accent);
  --color-accent-deep: var(--id-accent-deep);
  --color-accent-soft: var(--id-accent-soft);
  --color-accent-dark: var(--id-accent-dark);
  --color-accent-tint: var(--id-accent-tint);
  --color-green: var(--id-green);
  --color-emerald: var(--id-emerald);
  --color-green-soft: var(--id-green-soft);
  --color-green-bright: var(--id-green-bright);
  --color-green-tint: var(--id-green-tint);
  --color-warn: var(--id-warn);
  --color-warn-soft: var(--id-warn-soft);
  --color-warn-bright: var(--id-warn-bright);
  --color-warn-tint: var(--id-warn-tint);
  --color-danger: var(--id-danger);
  --color-danger-soft: var(--id-danger-soft);
  --color-danger-bright: var(--id-danger-bright);
  --color-line: var(--id-line);
  --color-line-soft: var(--id-line-soft);
  --color-line-cream: var(--id-line-cream);
  --color-line-cream-strong: var(--id-line-cream-strong);
  --color-line-dark: var(--id-line-dark);
  --color-line-dark-soft: var(--id-line-dark-soft);
  --color-soil: var(--id-soil);
  --color-soil-deep: var(--id-soil-deep);
  --color-grass: var(--id-grass);
  --color-grass-dry: var(--id-grass-dry);
  /* fonty → font-display, font-body, font-mono */
  --font-display: var(--id-f-display);
  --font-body: var(--id-f-body);
  --font-mono: var(--id-f-mono);
  /* škála → text-display-xl …; párové suffix proměnné (konvence Tailwind v4) nastavují
     lh/tracking/weight ze 4.2 — musí být literály, ne var() na :root */
  --text-display-xl: var(--id-t-display-xl);
  --text-display-xl--line-height: 0.98; --text-display-xl--letter-spacing: -0.035em; --text-display-xl--font-weight: 600;
  --text-display--line-height: 1.02; --text-display--letter-spacing: -0.03em; --text-display--font-weight: 600;
  --text-title--line-height: 1.05; --text-title--letter-spacing: -0.025em; --text-title--font-weight: 600;
  --text-title-sm--line-height: 1.12; --text-title-sm--letter-spacing: -0.02em; --text-title-sm--font-weight: 600;
  --text-subtitle--line-height: 1.25; --text-subtitle--letter-spacing: -0.015em; --text-subtitle--font-weight: 500;
  --text-lead--line-height: 1.5; --text-lead--letter-spacing: -0.012em; --text-lead--font-weight: 400;
  --text-body--line-height: 1.65; --text-body--letter-spacing: -0.01em; --text-body--font-weight: 400;
  --text-body-sm--line-height: 1.55; --text-body-sm--letter-spacing: -0.006em; --text-body-sm--font-weight: 400;
  --text-caption--line-height: 1.45; --text-caption--letter-spacing: 0; --text-caption--font-weight: 400;
  --text-label--line-height: 1.2; --text-label--letter-spacing: 0.14em; --text-label--font-weight: 600;
  --text-btn--line-height: 1.2; --text-btn--letter-spacing: 0.01em; --text-btn--font-weight: 600;
  --text-btn-sm--line-height: 1.2; --text-btn-sm--letter-spacing: 0.01em; --text-btn-sm--font-weight: 600;
  --text-stat--line-height: 1.05; --text-stat--letter-spacing: -0.02em; --text-stat--font-weight: 600;
  --text-stat-xl--line-height: 1.0; --text-stat-xl--letter-spacing: -0.03em; --text-stat-xl--font-weight: 600;
  --text-display: var(--id-t-display);
  --text-title: var(--id-t-title);
  --text-title-sm: var(--id-t-title-sm);
  --text-subtitle: var(--id-t-subtitle);
  --text-lead: var(--id-t-lead);
  --text-body: var(--id-t-body);
  --text-body-sm: var(--id-t-body-sm);
  --text-caption: var(--id-t-caption);
  --text-label: var(--id-t-label);
  --text-btn: var(--id-t-btn);
  --text-btn-sm: var(--id-t-btn-sm);
  --text-stat: var(--id-t-stat);
  --text-stat-xl: var(--id-t-stat-xl);
  /* geometrie → rounded-card…, max-w-page/prose, p-pad-x… */
  --radius-card: var(--id-r-card);
  --radius-md: var(--id-r-md);
  --radius-sm: var(--id-r-sm);
  --radius-pill: var(--id-r-pill);
  --container-page: var(--id-maxw);
  --container-prose: var(--id-maxw-prose);
  --spacing-sect-y: var(--id-sect-y);
  --spacing-sect-y-sm: var(--id-sect-y-sm);
  --spacing-gap-grid: var(--id-gap-grid);
  --spacing-pad-card: var(--id-pad-card);
  --spacing-pad-panel: var(--id-pad-panel);
  --spacing-pad-x: var(--id-pad-x);
  /* stíny → shadow-card, shadow-card-lg, shadow-cta */
  --shadow-card: var(--id-shadow);
  --shadow-card-lg: var(--id-shadow-lg);
  --shadow-cta: var(--id-shadow-cta);
  /* pohyb → ease-id, ease-reveal … */
  --ease-id: var(--id-ease);
  --ease-reveal: var(--id-ease-reveal);
  --ease-draw: var(--id-ease-draw);
  --ease-fill: var(--id-ease-fill);
  --ease-ripple: var(--id-ease-ripple);
  --ease-soft: var(--id-ease-soft);
}
```

### 13.3 Google Fonts (Archivo) v Next.js

```tsx
// app/layout.tsx — Archivo self-hostuje next/font (preload + zero layout shift řeší framework)
import { Archivo } from 'next/font/google';
const archivo = Archivo({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--id-f-archivo' });
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="cs" className={archivo.variable}><body>{children}</body></html>;
}
```

`--id-f-display` začíná `var(--id-f-archivo)` — třída z `next/font` tak dosadí self-hostovaný řez místo výchozího `"Archivo"`. Statické stránky bez build pipeline použijí `<link>` z 4.1 beze změny tokenů.

## 14. Otevřené body systému (koš B po smyčce článku 2, 2026-09-12)

Nálezy poroty, které nejsou vadou stránky, ale systému — každý čeká na
vlastní rozhodnutí (ADR), ne na záplatu v článku:

1. ~~`display-xl` dolní mez 48 px láme H1 na 320 px na čtyři řádky~~ —
   **vyřešeno v2.7** spolu s bodem 15 (jeden balík, protože menší titulek
   se posune do světlejší části fotky): měkký strop `12,5vw` s podlahou
   40 px. Naměřeno **320 px → 40 px a 2 řádky** (dřív 4), 360 → 45 px
   a 2 řádky (dřív 3), od 384 px beze změny.
2. ~~Dvě CTA na poslední obrazovce~~ — **vyřešeno** (kolo 07): kapsle
   svou mini-CTA odloží `display: none`, jakmile je `.id-cta` ve viewportu
   (IntersectionObserver v `Header/Component.client.tsx`).
3. ~~Hero na výšku načítá `w=3840` z masteru 21:9~~ — **vyřešeno v2.7**:
   fotka si nese vlastní portrétový ořez (pole `portrait` v knihovně médií)
   a `<picture>` ho podává pod 560 px. Telefon **142 → 35 kB**, ořezaný
   zdroj dostane `object-position: center` (jinak by se ořízl podruhé).
   Past: `priority` u `next/image` preloaduje SVŮJ src, takže s `<source>`
   stáhne telefon obojí — preload se proto skládá ručně, po jednom
   pro každou větev `<picture>`, a šířky musí být z `deviceSizes`.
4. ~~Maska řádků H1 ořezává descender~~ — **vyřešeno** (kolo 09):
   `.id-hline` má `padding-bottom: .12em` + záporný margin, rezerva 8,2 px.
5. ~~Produktový pás sdílí figuru sítě s uzlem Osvětlení~~ — **vyřešeno
   v2.7**: `SitMostuPortret` má prop `uzly`, pás pole `figureVariant`
   a popis pro odečítač se skládá ze stejného seznamu jako kresba.
6. ~~Chip „Kalkulátor" s akcentovým obrysem čte jako tlačítko~~ —
   **vyřešeno**: bez pilulky i rámečku, zůstal jen hlas (3.8).
7. ~~Reveal dvousloupce má tři triggery~~ — **vyřešeno** (kolo 09):
   `data-rv-group` na `.id-split`, stagger hlava → kresba → tělo.
8. ~~Reduced-motion globální blok krátí na 0,01 ms~~ — **vyřešeno**
   (kolo 06): blok sází `animation: none !important` + pojistky
   `.rv` / `.id-hline > span` / `.id-hero__fade` podle 6.7 v2.
9. ~~LCP kandidát v heru je lead~~ — **není vada**: 6.8 i 6.3.3 jsou
   psané podmínkou („kde je H1 LCP"), LCP = FCP a fotku přes celý
   viewport Chromium z kandidátů vylučuje z principu.
10. ~~Přechod split → próza pod 1130 px a gap kalkulátoru~~ —
    **vyřešeno**: složený dvousloupec už není pás (44 px) a panel sází
    `--id-gap-col`.
11. ~~Skip-link a cíle pod 24 px~~ — **vyřešeno**: `#obsah` je
    `tabindex="-1"` bez prstence (tab po skoku pokračuje v článku),
    hit-area ikony 24 × 30 px pseudo-prvkem bez rozšíření kapsle.

Doplněno po kole 05 (2026-09-13):

12. ~~Partitura pásů dlouhého článku~~ — **vyřešeno v2.7**: oba
    kalkulátory jsou obsidianové pásy a kapitola 02 stojí na krémovém.
    Nejdelší úsek bez posunu povrchu **16 560 → 2 317 px** (1440)
    a **3 577 px** (393); obsidian 9,3 → **16,2 %**. Pravidla 8.1 p. 3,
    5 a 8 přepsána tak, aby si na dlouhém článku neodporovala.
13. ~~8.2 × ADR-006~~ — **rozhodnuto §15 p. 2** (platí ADR-006) a v2.6
    **provedeno** v 8.2 ř. 2 i N+1, v 8.2b a v 10. Do p. 6; token
    `--id-maxw-summary` smazán z 13.1 i z `tokens.css`.
14. ~~4.2 × 7.7~~ — **rozhodnuto §15 p. 1** (platí 7.7) a v2.6 **provedeno**:
    popisek tokenu ve 4.2 přeznačen na landing (8.3) s poznámkou, že
    v článku užití nemá.
15. ~~Scrim končí ve 45 % výšky~~ — **vyřešeno v2.7**: sahá do 62 %
    a má plošší průběh (čtyři zastávky), takže v horní třetině je krytí
    pod 0,1 a fotka zůstává nositelem emoce. Naměřeno pod glyfy:
    eyebrow **4,19 → 4,88** (320 px), titulek **4,19 → 5,43** (1440)
    a **4,25 → 5,89** (1990); průměrný jas horní třetiny 79/255.
16. ~~11.3 neřeší jednotku u pole~~ — **vyřešeno v2.6**: vzor
    `aria-describedby` na `<span class="unit">` zapsán do 11.3 (platí
    jen pro pole s jednotkou, ne pro formulářová pole obecně).
17. ~~9.2 gradienty~~ — **vyřešeno**: `sd-louze` sází stopy vody podle
    9.2; alfa rampa v masce a rastr jsou pojmenované v 9.2 p. 10.
18. ~~Přejímka mřížky nekryje pásmo 1130–1439~~ — **vyřešeno v2.6**:
    8.2a i ADR-006 předepisují čtyři šířky (1440 / ≥1920 / **1130** / 1024)
    a `svg-labels` navíc na 320 / 393.

## 15. Rozhodnuté spory (v2.5, po kole 08)

Porota našla čtyři místa, kde si dokument odporoval sám se sebou. Rozhodnuto:

1. **Stat-num-xl (4.2) × hero kalkulátoru (7.7).** Platí **7.7**
   (`clamp(30px, 3.4vw, 46px)`): kalkulátor stojí v panelu širokém
   652 px, kde 64 px z tokenu `--id-t-stat-xl` přeteče na dva řádky.
   Token `--id-t-stat-xl` zůstává pro landing page, kde má šířku 1360.
2. **Lead souhrnu: 960 px (8.2) × 700 px (ADR-006).** Platí **ADR-006**:
   mřížka v3 zrušila track `wide` i token `--id-maxw-summary`. Hodnota
   960 px je v 8.2 mrtvá — lead stojí na ose prózy.
3. **Tracking uppercase 12px.** Platí **4.3 p. 5** (+0,14 em) pro eyebrow,
   label kalkulátoru i chip; jediná výjimka je `.sv-lbl` v kresbě (+0,10 em),
   protože širší rozpal v husté kresbě působí kolize.
4. **Váha verdiktu (7.8) × váhy těla (4.1).** Platí **4.1**: tělo textu má
   400 nebo 600, nikdy 500. Verdikt sází token body-sm (400 / 1,55 / −0,006 em).

### Rozhodnuto: próza kapitoly smí běžet na dvou osách (v2.7)

Tělo dvousloupce stojí ve sloupci 652 px (osa 40 nebo 748), zbytek
kapitoly v próze 700 px (osa 370) — skok 330–378 px v šesti kapitolách
ze sedmi. **Zůstává tak, jak to je.** Není to opomenutí: prověřeny byly
čtyři alternativy a všechny jsou měřitelně horší.

| Varianta | Proč ne |
|---|---|
| (a) celá kapitola dvousloupcová | plochý Lexical neumí seznamy, mezititulky a tabulky uvnitř bloku; ~30 selektorů je vázaných na přímého potomka `.id-article` a tiše by přestaly platit |
| (b) split jen titulek + obraz | textový sloupec by nesl jen titulek — **prázdno 66–76 %**, ne 35 %, jak odhadovalo předání po kole 07 |
| (c) zátoky 343 \| 561 px | padl by „jediný zlom stránky 720/56" (8.2a) — zlomy by byly dva a ani jeden na 720; varianta navíc žije až od 1395 px, zatímco dvousloupec začíná na 1130. Na 1280 by popisek kresby klesl na **8 px** |
| (d) obrátit pořadí (próza první, split na konci) | prázdno v textovém sloupci 33–62 %; autorův text by se musel přepsat (dnes nese 22–30 % kapitoly jako úvodní tezi) a padlo by čtení „teze před obrazem" z 8.2b |

**Důvod je geometrický, ne vkusový:** kresba 520 px a próza 700 px se na
společnou osu do šířky 1360 nevejdou — textový sloupec by musel začínat
na 370 a na obraz by zbylo 274 px. Skok os je cena za „půl na půl" sazbu
(ADR-006), kterou článek platí vědomě.

Otevřít znovu má smysl jedině u článku se **3–5 kapitolami**, kde má
varianta (b) dost obrazové hmoty na to, aby prázdný sloupec nevadil.
