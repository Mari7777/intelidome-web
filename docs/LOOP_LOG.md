# Design loop — log

Iterační smyčka podle skillu `design-loop`. Zlatý standard je **trenér, ne
šablona** — nikdy se z něj neberou assety ani texty, jen principy.

## Nastavení smyčky

| Položka | Hodnota |
|---|---|
| **Rozsah** | Pilot: **hero** blogového článku „Jak navrhnout automatickou závlahu" |
| **URL** | `http://localhost:3100/posts/jak-navrhnout-automatickou-zavlahu` |
| **Zlatý standard** | **Sonos** — primární reference DESIGN.md v2.0. `sonos.com` headless odmítá (Akamai „Access Denied"), bot-detekci neobcházíme; pracuje se z plné DNA v `ref-sonos.md` (tokeny, komponenty, do/don't, layout) a z náhledu na refero.design. |
| **Co je na něm zlaté** | Fotografie nese veškerou emoci; autorita plyne z velikosti písma, ne z tučnosti; sekce se dělí posunem povrchu, ne čarami; pill geometrie; poster-like hero. |
| **Design systém** | `docs/DESIGN.md` v2.0 + vzorník (stránka `/design-system` zatím jako artifact) |
| **Generátor assetů** | Higgsfield přes MCP (obraz ~0,12–2 kr., video `seedance_2_5` 12,5–65 kr.) |
| **Max kol** | 5 |
| **Práh „prošel"** | Každý porotce ≥ 4/5 **a** nula kritických nálezů |
| **Porota** | 6 nezávislých lenzů: hierarchie · typografie · pohyb · grafický styl · slop · výkon a přístupnost |

## Výchozí stav (před kolem 01)

Hero je „světlá editorial hlavička": eyebrow `— BLOG`, H1 na třech řádcích,
datum, pod tím fotografie v zaobleném rámu. Fotografie i typografie jsou
z v2 systému (Archivo, `#2563eb`), obraz vznikl v bake-offu pěti modelů
(vyhrál `nano_banana_2`).

**Podezření před porotou** (ověří ji, nebo vyvrátí):
- H1 se renderuje na 48 px, přestože škála v2 má pro hero roli `display-xl`
  hodnotu `clamp(48px, 8.4vw, 112px)` — na 1440 px by měla vyjít u stropu.
- Obraz a titulek jsou dva oddělené objekty pod sebou; Sonos by je spojil
  do jednoho plakátového momentu.
- Eyebrow říká „BLOG" — kategorie systému, ne téma článku.

## Kola

### Kolo 01 — NEPROŠEL

**Skóre: 2/5 od všech šesti porotců · 8 kritických nálezů.** Jednomyslné
a tvrdé; podezření z výchozího stavu se potvrdilo a přibylo víc.

| Porotce | Skóre | Jednou větou |
|---|---|---|
| Hierarchie | 2 | „48px titulek prohrává s 880px fotkou; první obrazovka nedá slib ani další krok." |
| Typografie | 2 | „Hero titulek měří 48 px — méně než sekční H2 (52 px) a 43 % předepsaných 112 px." |
| Pohyb | 2 | „Eyebrow, titulek, meta i fotka dostávají doslova tutéž `.id-rise` — žádná orchestrace." |
| Grafický styl | 2 | „Skvělá fotka ve špatné roli: zlatá hodina zmáčknutá do letterboxové kartičky se stínem." |
| Slop | 2 | „Frosted full-width lišta a stejný fade-in na všech prvcích — dva přímé zásahy do anti-vzorů." |
| Výkon | 2 | „Hero jde do prohlížeče jako 512–682 kB WebP (fallback 1,00 MB) místo 260kB AVIF." |

**Kořenová příčina:** hero byl *světlá hlavička dokumentu*, ne filmový pás,
který šablona 8.2 předepisuje. Šest rubrik popsalo šest projevů téže věci.

#### Opraveno v tomto kole — jeden souvislý balík „hero jako filmový pás"

1. **PostHero přestavěn** na obsidiánový pás `min-height: 88svh`, fotografie
   full-bleed bez radiusu (9.1), obsah dole. Fotka přestala být kartičkou
   a stala se nositelem emoce, jak to dělá zlatý standard.
2. **H1 na token `--id-t-display-xl`** — naměřeno **48 px → 112 px** na
   desktopu (mobil 48 px), lh 0,98, tracking −0,035em. Autoritu nese
   měřítko, ne váha.
3. **Titulek rozdělen na dvojtečce:** „Jak navrhnout automatickou závlahu"
   v plné velikosti, „průvodce krok za krokem" jako tišší kvalifikátor
   (0,46em, `--id-ink-dark-2`). Titulek se čte jedním nádechem.
4. **Orchestrace nástupu — tři různé prostředky podle role** místo jednoho
   fade na všem: titulek stoupá z masky po řádcích (`.id-hline`, 1 s,
   druhý řádek +120 ms), eyebrow a meta se jen prolnou (0,55 s / 0,75 s),
   obraz se sotva znatelně usadí ze `scale(1.04)`. Vypnuto při
   `prefers-reduced-motion`.
5. **Eyebrow nese téma**, ne slovo „Blog": „Návody · Závlaha"; přibyl
   meta řádek **čas čtení · InteliDome Journal · datum** (`readingTime`
   počítá slova z Lexicalu včetně textu uvnitř bloků).
6. **Výkon:** `quality={100}` → `72` v `ImageMedia` a `qualities: [72, 100]`
   v `next.config.ts`. Hero se přestal doručovat v archivní kvalitě.
7. **Scrim ve dvou vrstvách** (spodní pod textový blok + boční zleva),
   protože titulek o třech řádcích po 112 px sahá vysoko do světlé oblohy;
   eyebrow navíc na `--id-accent-tint`, aby nezávisel na fotce.

#### Do koše B — patří do DESIGN.md, ne do stránky

Porotce typografie **změřil, že tvrzení v DESIGN.md je chybné**: kap. 4.3
uvádí, že `--id-maxw-prose` 700 px ≈ 65 znaků na řádek. Skutečnost je
**82–97 znaků** (SF Pro 17 px). To je vada systému, ne stránky — opravuje
se patchem DESIGN.md a bumpem verze, ne úpravou hera. **Neopraveno v tomto
kole záměrně** (pravidlo „jeden balík na kolo").

#### Odloženo do dalšího kola

- **Frosted full-width lišta headeru** — porušuje náš vlastní anti-vzor
  (frosted smí být jedině plovoucí kapsle 7.1). Je to jiná komponenta než
  hero, i když se v jeho viewportu objevuje.
- Chybějící mini-CTA „Objevit systém" v headeru.

### Kolo 02 — NEPROŠEL, ale velký posun

**Skóre: 4 · 4 · 3 · 2 · 4 · 3 (bylo 2× šest) · kritických 8 → 3.**
Hierarchie, typografie i slop překlopily na „prošel"; drží je grafický styl.

| Porotce | 01 → 02 | Co zbývá |
|---|---|---|
| Hierarchie | 2 → **4** | chybí lead a jediná nabídnutá akce; full-width lišta bere první fixaci |
| Typografie | 2 → **4** | kvalifikátor běžel na 51,5 px (2,7× nad specifikací 17–19 px) a lepil se na titulek |
| Pohyb | 2 → 3 | — |
| Grafický styl | 2 → **2** | scrim šel do 100 % výšky místo 45 %; na mobilu byl v záběru jen rozostřený bokeh |
| Slop | 2 → **4** | — |
| Výkon | 2 → 3 | modrý eyebrow měl na fotce 3,7–4,3:1 (pod AA) |

**Dva kritické nálezy si protiřečily:** styl chtěl slabší scrim, výkon
čitelnější eyebrow. Řešení, na kterém se oba shodli: **scrim zpět na
mez 9.1 a eyebrow bílý** místo modrého.

#### Opraveno — balík „fotografie zpět jako nositel emoce"

1. **Scrim dle 9.1**: jediná svislá vrstva `.72 → 0` do 45 % výšky;
   boční vrstva zrušena. Fotka přestala být tmavou texturou.
2. **Eyebrow bílý** (modrá zůstala jen na čárce před textem) — na fotce
   dává ~11:1 místo 4:1.
3. **Čitelnost z textu, ne z tmavení**: jemný `text-shadow` jako
   v tištěném magazínu; eyebrow má silnější, protože je nejmenší.
4. **Art direction ořezu**: `object-position` posunut dolů (desktop
   50 %/78 %, mobil 74 %/64 %), takže pod textem leží tráva ve stínu
   a na mobilu zůstává v záběru tryska s vějířem, ne bokeh stěny.
5. **Kvalifikátor ven z `<h1>`** → samostatný lead v roli `--id-t-lead`
   (18–21 px, lh 1,5, max 600 px) s vlastním odstupem. Poměr titulek :
   lead vyskočil z 2,2 : 1 na ~5,5 : 1.
6. **Lead nese slib** — použita `meta.description` článku, která už byla
   napsaná; nevymýšlel se nový text (texty patří do `copy-polish`).
7. **Meta odlišena jiným prostředkem než barvou**: bez verzálek, bez
   trackingu, `--id-t-caption`; oddělovač svázán s údajem za sebou
   (`white-space: nowrap`), aby nikdy nevisel na konci řádku.
8. **`min-height` 88svh → 100svh** dle 8.2 a přibyl **scroll-cue** —
   jediná nabídnutá akce; kotví na `#obsah`. Zmizel useknutý odstavec
   ve foldu.

#### Stále odloženo

- **Frosted full-width lišta headeru** (porotce hierarchie ji označil
  za nejjasnější prvek tmavé obrazovky, který nese nejmíň informace).
  Je to jiná komponenta než hero — na řadě po dokončení pilotu.

### Kolo 03 — NEPROŠEL (3 · 4 · 3 · 3 · 4 · 2)

Hierarchie a výkon klesly. Porota se poprvé shodla na **kořeni, který
jsem dvakrát obcházel**: pod textem je příliš světlá fotografie.

| Porotce | 02 → 03 | Klíčové měření |
|---|---|---|
| Hierarchie | 4 → 3 | hero měří 100svh **plus** 61 px lepivé hlavičky → nevejde se do foldu; scroll-cue přeříznutý, meta na mobilu pod hranou |
| Typografie | 4 → 4 | eyebrow **1,05:1** — „nejvyšší patro hierarchie fakticky chybí"; meta odchýlená na třech osách od 8.2 |
| Pohyb | 3 → 3 | — |
| Grafický styl | 2 → 3 | — |
| Slop | 4 → 4 | — |
| Výkon | 3 → 2 | H1 medián 4,17:1, nejhorší percentil **1,62:1** |

**Verdikt porotce typografie o mém řešení z kola 02:** text-shadow je
*„berlička místo řízeného kontrastu"* — DESIGN.md 9.1 zná jen dvě cesty
(bílá při ≥ 4,5:1, jinak scrim), stín mezi nimi není. Měl pravdu.

#### Opraveno — balík „fold sedí a text stojí na klidné ploše"

1. **Nový master hera, art-directovaný pro text.** Původní snímek měl
   přesvícenou oblohu přesně tam, kde začíná textový blok. Nový prompt
   žádal tmavou trávu ve stínu v levé polovině a slunce jen v pravé
   třetině. **Naměřený jas v zóně textu: 19/255** (bílý text ≈ 18:1).
   Soumrak navíc odpovídá „teplému přirozenému světlu" z 9.1 líp než
   zlatá hodina s protisvětlem.
2. **Text-shadow úplně odstraněn.** Kontrast dělá snímek, ne efekt.
3. **Hlavička → plovoucí frosted kapsle dle 7.1.** Jedním zásahem padly
   čtyři nálezy: hero má konečně přesně 100svh (stránka protéká pod
   `fixed` kapslí), scroll-cue je celý nad foldem, mobilní meta se vešla,
   a zmizel anti-vzor „frosted lišta přes celou šířku" z kola 01.
4. **Mini-CTA „Objevit systém"** v kapsli — modrá dostala funkční cíl
   místo loga.
5. **Meta dle 8.2**: 12,5 px, Archivo 600, verzálky, tracking .12em,
   `--id-ink-dark-2` (porota naměřila, že `--id-ink-dark-3` padá pod AA).
6. **Lead posílen** na bílou s krytím 0,84 — dva šedé bloky pod sebou
   splývaly v „jeden šedý ocas".
7. **Ořez přizpůsoben novému masteru**: předmět je vpravo, text vlevo;
   mobil drží v záběru trysku.

### Kolo 04 — NEPROŠEL (4 · 4 · 3 · 3 · 4 · 3), kritických 3 → **1**

Jediný kritický nález: na mobilu ležel eyebrow na prosvíceném vodním vějíři
(**2,14:1**). Tři porotci nezávisle navrhli tentýž zásah — dostat vějíř
**nad** textový blok, ne do něj.

**Opraveno:** ořez mobil `70 % 36 %` (vějíř nad text) a desktop `62 % 48 %`
(vrátil do rámu západ slunce a dům — styl vytýkal, že fotka je pod textem
„prakticky černá plocha"); meta překlopena na roli caption bez verzálek
a trackingu (obě rubriky našly, že **můj vlastní CSS komentář sliboval
pravý opak, než co kód dělal**); Ken-Burns na fotce smazán jako animace
bez úkolu (6.1.1); titulek konečně **po řádcích** s vlastními maskami
a staggerem 0,12 s (do té doby jel celý blok v jedné masce); kapsle
zapojena do orchestrace; `formats: AVIF + WebP`, `fetchPriority="high"`,
`aria-hidden` sejmut z informačního obrazu.

---

## Kolo 05 — ✅ **PROŠEL**

**Skóre: 4 · 4 · 4 · 4 · 4 · 4 · nula kritických nálezů.**
Práh z nastavení smyčky (každý ≥ 4 a 0 kritických) splněn.

| Porotce | 01 | 02 | 03 | 04 | **05** |
|---|---|---|---|---|---|
| Hierarchie | 2 | 4 | 3 | 4 | **4** |
| Typografie | 2 | 4 | 4 | 4 | **4** |
| Pohyb | 2 | 3 | 3 | 3 | **4** |
| Grafický styl | 2 | 2 | 3 | 3 | **4** |
| Slop | 2 | 4 | 4 | 4 | **4** |
| Výkon | 2 | 3 | 2 | 3 | **4** |
| **Kritických** | **8** | **3** | **3** | **1** | **0** |

Zlatý standard byl **trenér, ne šablona** — nepřevzali jsme ze Sonosu
jediný asset ani text, jen principy: fotografie nese emoci, autoritu dělá
velikost, sekce se dělí posunem povrchu.

### Co zbývá (žádný nález není kritický — backlog, ne blokátor)

**Patří do stránky:**
1. **Obrácená hierarchie výzev** — jediné plné tlačítko („Objevit systém")
   vede pryč od článku, zatímco „číst dál" je nepopsaná šipka. Na
   článkových stránkách CTA ztlumit, nebo cue povýšit na „Začít číst · 4 min".
2. **Mobilní kolize** — scroll-cue prochází přes slovo „Journal" v metě;
   klepnutí do textu spustí skok. Oddělit vertikálně nebo sloučit
   v jeden prvek „4 min čtení ↓".
3. **Nudge šipky startuje v čase 0** a soupeří s nástupem titulku —
   `animation-delay: 2s`, ať cue promluví až hero domluví (6.1.2).
4. **`sizes` je syntakticky neplatné** ve všech šesti položkách, prohlížeč
   je zahodí a spadne na `100vw` — plýtvání pásmem na LCP obrázku.
5. **Meta má `line-height: 1.5`** místo tokenových 1,45 (caption).

**Patří do DESIGN.md (koš B):**
6. **Prose 700 px ≠ 65 znaků** — změřeno 82–97. Vada tabulky 4.3
   (z kola 01, stále neopraveno — jeden balík na kolo).
7. **Globální `reduced-motion` blok je v1 vzor** (zkrácení na 0,01 ms),
   zatímco 6.7 v2 předepisuje `animation: none`.
8. **Textová náhrada loga** s obarvenou druhou slabikou — porotce slopu
   ji označil za generický startup vzor. Nasadit skutečné logo
   (maskované SVG existuje).
9. **Tonalita hera je modrá hodina**, 9.1 žádá 3200–5000 K. Buď dotáhnout
   teplotu, nebo si v systému připustit i studenou variantu.

### Předání

Hero pilot je hotový. Podle skillu následuje **`copy-polish`** na texty —
porotce slopu upozornil, že lead sklouzává do AI kadence („X, ne Y" +
„Zjistěte, proč"). Porota texty nehodnotí, jen je označila.

---

# Smyčka II — celý článek

Pilot hera prošel v kole 05. Tenhle díl smyčky bere článek
`/posts/jak-navrhnout-automatickou-zavlahu` jako celek: 7,2 obrazovky,
hero už schválené, zbytek nehodnocený.

**Nastavení:** stejné jako u pilota — 6 nezávislých porotců (hierarchie,
typografie, pohyb, grafický styl, slop, výkon a přístupnost), každý jen se
svou rubrikou, snímky desktop 1440×900 i mobil iPhone 14 Pro, závazný
`DESIGN.md`. Navíc **adversariální ověření**: každý kritický nález dostane
skeptika, jehož úkolem je ho vyvrátit; potvrdí se jen to, co ustojí.
Práh průchodu: každý porotce ≥ 4 a nula potvrzených kritických nálezů.

## Kolo 01 — výchozí stav

**Skóre: 2 · 3 · 2 · 2 · 2 · 3 — 12 potvrzených kritických nálezů.**

| Porotce | Skóre | Co lámalo dojem |
|---|---|---|
| Hierarchie | 2 | 82 % stránky jeden nepřerušený 700px sloupec; chybí 3 sekce šablony 8.2 |
| Typografie | 3 | tokeny drží, ale `.prose` přebíjí komponenty; FAQ nadpis 24 px vedle 52px kapitol |
| Pohyb | 2 | pod herem se nehýbe nic — scroll-reveal v repu neexistuje |
| Grafický styl | 2 | 3 obrázky na 7,2 obrazovky; nula SVG figur; logo je vysázený text |
| Slop | 2 | obrazová vrstva bez vlastního jazyka; rytmus povrchů z článku vypadl |
| Výkon | 3 | kontrasty a fokus výborné, ale kapsle trvale leží na textu; vadné `sizes` |

**Dva nálezy skeptici zamítli — a měli pravdu:**

1. *„Odstavce mají 83–98 znaků na řádek."* Čísla sedí, ale `DESIGN.md`
   předepisuje **700 px**, a ty jsou splněné na pixel. Dodatek „≈ 65 znaků"
   je popisný odhad, ne druhá mez. Vada je v dokumentu, ne na stránce —
   projekt to už dvakrát adjudikoval jako **koš B**.
2. *„Chybí setrvačníkový scroll, který si uživatel přál."* Modul skutečně
   chybí (0 výskytů Lenis/GSAP), ale 6.5 je výslovně **per-page opt-in** a
   pro nepřihlášené stránky sama předepisuje `scroll-behavior: smooth`,
   což repo má. Pravdivé pozorování povýšené na porušení pravidla,
   které neexistuje. → **Zůstává jako přání uživatele, ne jako vada systému.**

## Kolo 02 — jeden balík: partitura pásů

Nejhorší nález měl jeden kořen: tělo článku nemělo **žádnou architekturu
sekcí**. Všechno — souhrn, čísla, kapitoly, figury, FAQ — bydlelo v jednom
700px sloupci na bílé. Proto chyběly celé sekce šablony 8.2: nedaly se kam
postavit.

**Co se změnilo (commit `bbb7239`):**

- **Mřížka článku** `.id-article` se třemi dorazy: `content` 700 px,
  `wide` 960 px, `full` přes celou šířku. Full-bleed dělá pojmenovaný
  sloupec mřížky, **ne trik se `100vw`** — ten by na desktopu s viditelným
  posuvníkem přidal vodorovný přetok (ověřeno: `overflowX: false`).
- **`summaryBand`** — krémový pás hned po heru (8.1 p. 4) s vlastní rolí
  `summary-lead` (Archivo 500, subtitle škála, 960 px) a řadou čísel uvnitř.
- **`productBand`** — jediný vnitřní obsidian článku (8.2 ř. N+1).
- **`ctaBand`** — bílá centrovaná závěrečná výzva. Do té doby **na celé
  stránce nebyl jediný odkaz v těle článku**; teď je tam právě jedno tlačítko.
- **Logo je konečně logo** — maskované SVG dle 9.4 místo vysázeného textu
  s modrým „Dome". Hlavička 21 px, patička 19 px, CTA clamp(30,4.6vw,50).
- **Patička na bílou** (8.1 p. 7), meta 13,5 px na `--id-ink-2`.
- **FAQ dostalo `not-prose` a hodnost `title-sm`** (36 px). Do té doby ho
  ručně psané `.prose h2` z `globals.css` přebíjelo na 24 px — nadpis
  sekce byl menší než odstavcový podnadpis.
- **`.prose` nadpisy dostaly škálu 4.2 po hodnostech.** Plošné
  `line-height: 1.15` porušovalo strop 1.05 u role `title`. Výjimka
  `:not(:where(.not-prose, .not-prose *))` je táž, jakou používá
  `@tailwindcss/typography`, takže komponenty si svou sazbu uřídí samy.
- `<main>` landmark kolem článku.

**Měření po zásahu:** obsidian 13,9 % → **19,8 %** (cíl 20–35 %; zbytek
dorovná produktový pás, až v kole 03 dostane svou SVG scénu — dopadovat
metriku prázdným paddingem by bylo podvádění). Levé okraje: **dvě osy**
(pás 240, prose 370) místo tří. Vodorovný přetok nula.

**Vědomě neopraveno v tomhle kole** (patří do dalších balíků): SVG figury
a obraz v kapitolách, pohyb pod herem, kalkulátory, kapsle překrývající text.

## Kolo 03 — jeden balík: obraz

**Skóre kola 02: 3 · 3 · 2 · 2 · 3 · 3 — 10 potvrzených kritických nálezů.**
Osm z deseti mluvilo o jedné věci: článek neměl **ani jednu vysvětlující
figuru**. Obraz nesly tři fotografie na jedenáct obrazovek textu.

Nejtvrdší nález byl přitom faktický, ne estetický: popiska Obr. 01 tvrdila
„manometr ustálený na 3,5 baru", zatímco na fotografii byl ciferník 0–30
s ručičkou u nuly. **Vymyšlené číslo nalepené na stock fotku** — a pozná to
první čtenář, který kdy držel manometr.

**Co se změnilo (commit `e13e203`):**

- **Blok `Figure` umí variantu `drawing`.** Technická kresba je **kód**
  (registr komponent), ne obsah v databázi — v CMS se vybírá jen klíč,
  takže se nikde nevolá `dangerouslySetInnerHTML`.
- **Pět SVG figur** podle závazné palety 9.2. Každou kreslil jiný autor
  se stejnou kotvou stylu, pak je srovnala kontrola „jedné ruky" (4/5):
  `korenova-zona`, `kbelikovy-test`, `hlava-na-hlavu`, `ridici-smycka`,
  `sit-mostu` (tmavá, do produktového pásu).
- **Každá kapitola má svou figuru** (9.2 p. 8). Lhoucí fotka je nahrazená
  kresbou, kde je **3,5 baru nakreslené na ciferníku**, ne tvrzené v popisce.
- **`SmilGuard`** — při `prefers-reduced-motion` se SMIL uzly odstraní
  z dokumentu. CSS na ně nedosáhne: `animation: none` platí na keyframes,
  `<animateTransform>` běží mimo kaskádu. Klidový stav každé figury je
  proto zapsaný přímo v markupu.
- **Kapsle konečně rozostřuje.** Naměřeno `backdropFilter: "none"` proti
  CSS, které předepisovalo `blur(18px)`: build sloučil prefixovanou
  dvojici a nechal jen `-webkit-`, kterou Chrome nezná.
- **`sizes` byl syntakticky neplatný** — deskriptor `w` tam, kde patří
  délka. Prohlížeč atribut zahazoval a stahoval 1920px varianty do 880px
  slotu; na mobilu byl hero bitmapa 393×166 roztažená 5,13×.

### Co si kontrola „jedné ruky" našla sama na sobě

Pět autorů, pět stylů — a kontrola je chytila měřením, ne dojmem:
`KbelikovyTest` používal **12 různých tlouštěk tahu** (až 11 px) proti
dvěma v `KorenovaZona`; `SitMostu` měl **#aab1b8**, barvu, která
v žádné tabulce DESIGN.md není; `RidiciSmycka` psala **„vodovodní řád"**
místo **řad**. Všechno opraveno.

### Vědomé odchylky (raději zapsat než zamlčet)

1. **Produktový pás má diagram přes celou šířku**, ne v `minmax(0,420px)`
   sloupci dle 8.2. Důvod: viewBox 1080 px vecpaný do 420px sloupce by
   měl popisky pod 5 px. Šablona tu předpokládá dvě užší SVG; my máme
   jedno široké.
2. **Figury na mobilu se posouvají do stran** (spodní mez 560 px) místo
   aby se zmenšily. Na 393px telefonu by 1080px viewBox srazil popisky
   12 px na necelých 5. Posuvná oblast má `tabIndex` a fokusový prstenec.
3. **Do `SitMostu` jsem nedoplnil čísla**, ačkoli kontrola to navrhovala
   kvůli sjednocení žánru se čtyřmi měřicími figurami. Diagram topologie
   nemá co měřit a vymyšlené hodnoty by byly přesně ta ozdobná statistika,
   kterou tahle smyčka jinde trestá. Nesourodost žánru je menší zlo.

## Kolo 04 — jeden balík: pohyb

**Skóre kola 03: 3 · 3 · 2 · 3 · 3 · 3 — 4 potvrzené kritické nálezy.**
Dva byly pohyb: pod herem se neodhalovalo nic a všech 43 SMIL smyček
běželo lineárně, takže se všechno hýbalo stejně.

**Co se změnilo (commit `752963b`, kalkulátory `fb069d8`):**

- **GSAP + ScrollTrigger dle 6.3.0** — závazný stack systému, ne vlastní
  vymyšlenost. Jedno místo registrace, šest křivek z tabulky 6.2, recepty
  výhradně v `mm.add('(prefers-reduced-motion: no-preference)')`.
- **Nástup sekcí 6.3.1/6.3.2**: 18 prvků `.rv`, karty produktového pásu
  se staggerem 80 ms. Hero zůstává na CSS keyframes (LCP guard 6.3.3).
- **Anti-FOUC brána `html.js` + pojistka** — kdyby klientský balík
  nedoběhl, brána se po 3 s sama otevře a obsah zůstane viditelný.
- **Setrvačníkové brzdění scrollu dle 6.5** — přesně to, co si uživatel
  přál. Běží nad **oknem**, ne nad vlastním kontejnerem, takže
  ScrollTrigger nepotřebuje `scrollerProxy` a `position: fixed` kapsle
  se nerozbije.
- **Křivky na SMIL** z tabulky 6.2; `march` a stopky zůstávají `linear`,
  jak 6.6.3 předepisuje. Plnění kbelíku a vlna smyčky přepsány
  z geometrických vlastností (`y`/`height`/`r`) na `transform`.
- **Dva kalkulátory** dle 7.7 — požadavek zadání, který žádné kolo poroty
  nepokrývalo. Počítají při psaní, verdikt má `aria-live="polite"`.

## Kolo 05 — jeden balík: co bylo rozbité

**Skóre kola 04: 3 · 3 · 3 · 3 · 4 · 3 — 5 kritických.** Slop poprvé na 4.
Tři nálezy nebyly „nedotažené", ale **rozbité** — a jeden z nich jsem si
rozbil sám v kole 04.

### Zpětný krok, který porota chytila

**Nástup sekcí stavěl na GSAP `autoAlpha`, což nasazuje
`visibility: hidden`.** Dvacet bloků tím vypadlo z tab pořadí, ze stromu
přístupnosti i z hledání na stránce — klávesnice přeskočila celý článek
včetně všech šesti otázek FAQ, pěti vstupů kalkulátoru i jediného CTA.

Nepříjemná část: **`DESIGN.md` 6.3.1 `autoAlpha` jmenovitě předepisuje.**
Šel jsem podle receptu systému a vyrobil přístupnostní vadu. Stránka teď
skrývá výhradně `opacity` + `.rv:focus-within`; **oprava receptu patří do
koše B**, protože záplatovat jednu stránku a nechat systém učit tutéž
vadu dál znamená vyrobit ji znovu na další stránce.

### Další dvě rozbité věci

- **Kotva `#obsah` v dokumentu vůbec neexistovala.**
  `document.getElementById('obsah')` vracelo `null`: Payloadův
  `ConvertRichText` props nepropouští, takže `id` předané z kola 02 se
  tiše zahodilo. Jediná akce 100svh hera mířila do prázdna.
- **Setrvačník byl mrtvý kód.** Aktivaci četl z atributu, který nastavoval
  jiný efekt — a React spouští efekty potomků dřív než rodičovské, takže
  modul kontroloval atribut, který ještě neexistoval. Aktivace jde teď
  propem a modul si sám vypíná nativní `scroll-behavior: smooth`, aby se
  s ním nepral o týž pohyb. Naměřeno: kolečko odchycené, 500 px delty
  nese 569 px dojezdu.

### Rozpočet uzlů a mobil

| Figura | SMIL uzlů před | po |
|---|---|---|
| Kořenová zóna | 12 | **8** |
| Hlava na hlavu | 30 | **8** |

Zklidněné vlny zůstávají nakreslené staticky, takže z výkladu nezmizelo
nic — jen třpyt.

**Svislé mobilní varianty** dvou porovnávacích figur (viewBox 520, panely
pod sebou). Vedlejší zisk: ve svislé sazbě mají oba panely stejné krajní
hlavice, takže je vidět, že dole **přibyla jedna uprostřed** a suchý pruh
zmizel — čte se to líp než širokoúhlá varianta.
