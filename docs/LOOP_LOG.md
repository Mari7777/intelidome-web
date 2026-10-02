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

### Kolo 12 — široké okno (2026-08-23, po záznamu obrazovky)

Majitel poslal záznam z 1990px okna: „je toho tam víc, co je třeba
opravit na širokém zobrazovacím okně". Porota tam nikdy neběžela —
snímky i `layout-check` se pouštěly výhradně na 1440.

**Kořenová příčina jedna, projevů pět.** Boční sloupce mřížky byly
`minmax(0, 1fr)`, takže osa `edge` rostla s oknem místo aby držela
1360. Na 1440 to vychází přesně na 330 a nikdo si toho nevšiml.

Naměřeno na 1990 px:

| | před | po |
|---|---|---|
| Levých os na stránce | **3** (40 / 268 / 300) | **1** (308) |
| Šířek modulů | 4 | **2** |
| Sloupce splitu | 919 \| 919 | **652 \| 652** |
| Díra mezi textem a kresbou | **475 px** | 122 px |
| `layout-check` @1990 | neběžel | **0 chyb** |
| Přetok 320–2560 px | 0 | **0** |

Opraveno: strop bočních sloupců, `--id-gutter` a `--id-maxw-edge` do
`:root`, `.container` sundán ze žebříku breakpointů na tutéž trať.
Nad 1440 se stránka od té chvíle **jen centruje** — rozložení na 1990
i 2560 je identické s návrhovým 1440. Detail viz ADR-006, dodatek 2.

Navíc: vstupní řádek kalkulátoru dostal nad zlomem panelu totéž rozpětí
jako řádky výstupu vedle (levá polovina byla ze 60 % prázdná). Pod
zlomem zůstává pevná šířka — `flex-basis: auto` u `input[type=number]`
zvedá min-content stopu sloupce a přetekl by reflow na 320 px o 58 px.

**Fotografie na širokém okně.** Full-bleed fotka neměla `sizes` pro svůj
skutečný slot — brala výchozí popis obsahového sloupce (960 px), takže na
1990px okně dostala variantu **960 px a roztáhla se na dvojnásobek**;
při dpr 2 dokonce 900 px na 3 980 obrazových bodů. Vypadala jako rozmazaná
kopie hero fotky. Figura teď hlásí slot podle sazby (bleed 100vw, mimoosová
1030, obsahová 700). Po opravě žádá 2048 / 3840 místo 1080 / 1920; váha
obrázků 103 kB na mobilu, 238 kB na širokém okně.

**Zbývá jako věc assetu, ne kódu:** master hero má 2400 px, full-bleed
fotka 1800 px. Na 1990px okně s dpr 2 potřebuje slot **3 980 bodů** —
fotky tedy pokryjí 60 % a 45 %. Na běžném monitoru (dpr 1) jsou obě
v pořádku; na Retina širokoúhlé obrazovce jsou měkké. Řešení je nový
master ≥ 3840 px, což je rozhodnutí majitele (a hardware InteliDome se
zásadně negeneruje — viz bod 16).

**Poučení do dalších kol:** *přejímka na jediné šířce neprověří strop.*
`layout-check` se teď pouští nejmíň na 1440, ≥1920 a 1024. Vada tohohle
druhu se z 1440 nedá vidět ani okem, ani měřením — musí se otevřít okno.

## Předání

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

## Kolo 06 — doladění

**Skóre kola 05: 3 · 3 · 4 · 4 · 4 · 4 — 2 kritické.** Oba byly moje,
z posledních dvou kol, a oba měly přesnou adresu. Proto ještě kolo nad
rámec výchozích pěti: zbytek už nejsou dojmy.

- **Kalkulátorový panel dědil `line-height: 1.65` na display rolích.**
  `not-prose` dědičnost nezastaví a Tailwind preflight vhání do inputu
  `font: inherit` — takže 44px input jel na 72,6px řádku a jednotka
  „litrů" seděla **9 px nad účařím čísla** vedle sebe. 4.2 dává roli
  `stat-num-xl` `line-height: 1.0`.
- **Setrvačník polykal kotvy.** Modul si sám vypíná nativní
  `scroll-behavior: smooth`, ale programový scroll neřešil — takže
  jediná akce hera skočila o 804 px v jednom snímku. 6.5 to předepisuje
  výslovně; kotvy teď jedou týmž dojezdem jako kolečko.
- **FAQ má konečně hodnost pásu** (H2 52 px), otázka 28 px stupeň nad
  odpovědí. Zvedala to každá porota od kola 01.
- **Česká sazba:** jednopísmenné předložky už neviseji na konci řádku.
  Řeší se nad daty při vykreslení (formátovací uzly zůstanou celé), ne
  ručně v obsahu. Naměřeno **0 vlků, 94 pevných mezer**.
- **Čas čtení hlásil 3 min u 1273 slov**, protože sběrač procházel jen
  `children` — z bloků (souhrn, kapitoly, popisky, FAQ) nezapočítal nic.
- **Světlý kalkulátor stojí v krémovém mezipásu** (7.7 + 8.1 p. 5–6).
  Nejdelší běh jednoho povrchu klesl ze 7343 na 6056 px.

## Kolo 07 — poslední kritický nález

**Skóre kola 06: 4 · 4 · 4 · 4 · 4 · 4 — 1 kritický.** Zase můj, z kola 04.

**Fokusový prstenec primárního CTA byl natvrdo tinta `#93c5fd`** bez
ohledu na povrch. Jenže prstenec při `outline-offset: 3px` leží na
**stránce**, ne na tlačítku — takže na bílém pásu měl **1,41:1** proti
non-text minimu 3:1, a to na jediném konverzním prvku článku. Rozhoduje
povrch pod ním, ne varianta tlačítka: teď 5,17:1 na světlém, tinta jen
na obsidianu.

Ke stejné třídě vad, kterou kolo 06 opravilo jen uvnitř kalkulátoru:
`.id-feature__title` (17/1.65) a `.id-capsule__go` (13.5/1.5) dědily
tělové řádkování → 1.25 a 1.2. Antialiasing šel z `body` na
`[data-surface='dark']` (4.3 p. 8). Figcaption ze 700 px na 62ch —
nejmenší text stránky měl nejdelší míru (97–99 znaků, víc než próza).
Řada statů dostala stagger dle 6.3.2, kde ji DESIGN.md jmenovitě uvádí;
do té doby běžel stagger na celé stránce **jedinkrát**, takže 19 z 20
nástupů bylo totéž gesto.

---

# ✅ Kolo 11 — **PROŠEL**

**Skóre: 4 · 4 · 4 · 4 · 4 · 4 — nula potvrzených kritických nálezů.**
Práh z nastavení smyčky (každý porotce ≥ 4 a 0 kritických) splněn.

| Porotce | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | **11** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Hierarchie | 2 | 3 | 3 | 3 | 3 | 4 | 4 | 4 | 4 | 4 | **4** |
| Typografie | 3 | 3 | 3 | 3 | 3 | 4 | 4 | 4 | 4 | 4 | **4** |
| Pohyb | 2 | 2 | 2 | 3 | 4 | 4 | 4 | 4 | 4 | 3 | **4** |
| Grafický styl | 2 | 2 | 3 | 3 | 4 | 4 | 4 | 4 | 4 | 4 | **4** |
| Slop | 2 | 2 | 3 | 4 | 4 | 4 | 4 | 4 | 4 | 4 | **4** |
| Výkon | 3 | 3 | 3 | 3 | 4 | 4 | 4 | 4 | 4 | 4 | **4** |
| **Kritických** | **12** | **10** | **4** | **5** | **2** | **1** | **1** | **1** | **1** | **1** | **0** |

## Co se v téhle smyčce doopravdy naučilo

**Porotce musí měřit, ne dojmovat — a měřit správně.** Nejcennější nálezy
byly čísla: `backdropFilter: "none"` proti CSS, které rozostření
předepisovalo; `sizes` se syntakticky neplatným deskriptorem `w`;
`getElementById('obsah') === null`; ring 1,41:1; 16 běžících animací při
`y = 0`. Nic z toho oko nenajde.

**Pět z posledních šesti kritických nálezů byly zpětné kroky z předchozího
kola.** `autoAlpha` vyhodil obsah z tab pořadí. Přidaný fokusový prstenec
byl na bílé neviditelný. Setrvačník polykal kotvy. Kalkulátor zdědil
řádkování. Převod vlny na CSS vypnul pauzování mimo viewport. **Porota,
která čte jen diff, by nenašla ani jeden** — všechny vyplavaly z toho, že
se každé kolo přeměřila celá stránka.

**Nejhorší vada byla živá devět kol.** Setrvačníkový rAF se neukončil a po
prvním otočení kolečka natrvalo přebil klávesnici. Nikdo ji nenašel dřív,
protože se projeví jen v posloupnosti „kolečko, pak klávesnice" — a testy
chodily buď jedno, nebo druhé.

**Skeptik je stejně důležitý jako porotce.** Zamítl: délku řádku prózy
(vada dokumentu, ne stránky — dvakrát), setrvačník jako porušení systému
(6.5 je per-page opt-in), podíl obsidianu, „6 037 px jednoho povrchu"
(chyba měření 3×). Bez něj by smyčka honila fantomy.

**A pozor i na vlastní měření.** Můj audit dashe hlásil druhého viníka —
byl to artefakt regulárního výrazu přes sousední elementy. `element.focus()`
nevyvolá `:focus-visible`. Prstenec při `outline-offset` leží **vně** prvku,
takže jeho podklad je stránka, ne výplň tlačítka. Každá z těch tří chyb
vyrobila falešné čtení, jednou v každém směru.

**Dva porotci si mohou protiřečit — a jeden se může mýlit.** Typograf
tvrdil, že žádná kapitola nemá eyebrow „Kapitola NN". Přeměřeno: má je
všechny čtyři (`Kapitola 01`–`04`). Verdikt poroty není důkaz.

## Zbývající backlog (19 důležitých, nic kritického)

**Patří do stránky:**
1. CTA titulek 52 px → `--id-t-display` (76 px); otázka na závěr je
   nejmenší text stránky, prompt 6 žádá 19–26 px + hairline.
2. Šev FAQ → CTA bez posunu povrchu i bez hairline.
3. Prázdný prostřední slot kapsle — na 11 obrazovkách chybí orientace.
4. Fotografie má radius 14 px (`.prose img` přebíjí vlastní třídu bloku).
5. Síťový diagram není číslovaná figura — řada Obr. 01–05 končí a jediný
   obraz produktu zůstane anonymní.
6. `StatTiles` jako jediný blok neprochází přes `nezlomitelneMezery`.
7. Primární tlačítko nemá přechod na hover (skok v 0 ms).
8. Dotykové cíle ikon v kapsli pod 24×24 px (WCAG 2.2 SC 2.5.8).
9. Číselné vstupy ruší prstenec a nahrazují ho podtržením (2,60:1).
10. Jediná ikona z `lucide-react` v zakázané velikosti.

**Patří do DESIGN.md (koš B) — nikdy potichu při opravě stránky:**
11. **Recept 6.3.1 předepisuje `autoAlpha`**, který nasazuje
    `visibility: hidden` a vyhazuje obsah z tab pořadí i z hledání
    na stránce. Systém učí přístupnostní vadu.
12. **8.1 p. 3 (obsidian 20–35 %) nejde splnit současně s 8.1 p. 8
    (článek = 1 vnitřní obsidian) a 8.2 (CTA bílé)** — u dlouhého článku
    jsou ta tři pravidla ve sporu. Naměřeno 17,9 %.
13. Prose 700 px ≠ 65 znaků (85–94) — dvakrát adjudikováno.
14. Kapsle 7.1 překrývá běžící text („stránka pod ní protéká") — třikrát
    zamítnuto jako neporušení, ale zvedla to každá porota.

**Rozhodnutí majitele, ne smyčky:**
15. Jediná konverze vede na `/` — produktová stránka ještě neexistuje.
16. Fotografie (teplota 8 960 K vs. 3 200–5 000 K, poměr stran, chybějící
    telefon s UI aplikace). **Hardware InteliDome se zásadně negeneruje
    AI — musí se vyfotit fyzicky.**
17. **Obsahový rozpor:** článek tučně tvrdí „průtok alespoň 25 l/min"
    a hned dá příklad 10 l / 24 s = 25 l/min, ze kterého se má odečíst
    20 % rezervy → 20 l/min, tedy **pod vlastní vyhlášenou hranicí**.
    Kalkulátor i Obr. 02 to poctivě ukážou.

## Předání

Zlatý standard byl **trenér, ne šablona** — ze Sonosu jsme nepřevzali
jediný asset ani řádek textu, jen principy: fotografie nese emoci,
autoritu dělá velikost, sekce se dělí posunem povrchu.

Podle skillu následuje **`copy-polish`** na texty. Porota texty nehodnotí,
jen označila místa: callout „Pro zvídavé" nese tři odstavce v komponentě
pro jednu větu, FAQ odpovědi převyprávějí už napsané, patička zůstala
šablonou a Obr. 04 svým vlastním popiskem přiznává, že opakuje Obr. 03.

---

# Článek 2 — „Krásný trávník začíná pod zemí"

## Nastavení smyčky

| Položka | Hodnota |
|---|---|
| **Rozsah** | celý článek (`/posts/krasny-travnik-zacina-pod-zemi-2`), 7 kapitol + závěr, ~3 700 slov |
| **Zlatý standard** | týž jako u článku 1: Sonos (editorial klid, autorita velikostí, sekce dělené posunem povrchu) + Samara (vzdušnost) — z DNA v DESIGN.md v2.2, ne z živého webu |
| **Design systém** | `docs/DESIGN.md` v2.2 vč. mřížky v3 (ADR-006) a stropu stránky (dodatek 2) |
| **Generátor assetů** | Higgsfield přes MCP, model `nano_banana_pro` 4K 21:9 (6336×2688 → master 3840 px AVIF) |
| **Max kol** | 5 |
| **Práh „prošel"** | každý porotce ≥ 4/5 **a** nula kritických nálezů |
| **Porota** | 6 lenzů jako u článku 1: hierarchie · typografie · pohyb · grafický styl · slop · výkon a přístupnost |

## Výchozí stav (před kolem 01)

Postaveno rovnou na šabloně 8.2 a mřížce v3, tj. na tom, co u článku 1
prošlo v kole 11 — pilot se tentokrát netýkal hera (ten je hotový vzor),
ale **první kresby**: Obr. 01 hmatový test byl schválen vizuálně dřív, než
vznikly zbylé.

- Hero: fotografie sondy v trávníku (rýč, ornice, udusaná vrstva), 4 varianty,
  vybrána ta s nejtmavší zónou textu (jas 64/255) a nejsilnějším příběhem
  vrstev. Master 3840 px — poučení z článku 1 (2400 px na dpr 2 nestačilo).
- Souhrn: lead složený z autorových vět + 4 dlaždice (3 typy · 30 cm ·
  2,5–7,5 cm/h · 300 l).
- Kapitoly 01–05 a 07 jako dvousloupce text + kresba, střídání R L R L R (L);
  kapitola 06 bez kresby — obraz jí dělá full-bleed fotografie rycích vidlí
  těsně nad ní. Zbytek textu každé kapitoly (seznamy, h3) teče pod
  dvousloupcem na obsahové ose.
- Šest kreseb jen v portrétové sazbě (520 px) — všechny stojí ve sloupci
  vedle textu, kde má portrét vyšší hustotu než panorama (ADR-006 dodatek).
  Dvě tabulky z autorova textu (hmat → půda → zaměření; hloubka → co →
  proč) nesou kresby 01 a 05.
- Dva kalkulátory: `vsak` (obsidian, na ose) a `primesi` (světlý, na ose).
- Rytmus prózy rozšířen na h3/ul/ol (DESIGN 8.2a) — dřív jen `p + p`.
- Přejímka mřížky: 0 chyb na 1024 / 1440 / 1990; osy 372/40/0, šířky
  700/1360/full, střídání R L R L R L.

**Podezření před porotou:** délka (docH 19 250 px na 1440, 22 min čtení);
FAQ a produktový pás jsou převzaté vzory a text produktového pásu je můj,
ne autorův; kresby 05 a 07 mají hodně textu v popiscích; hodnota 7,5–10 cm/h
není v článku pojmenovaná.

## Kolo 01 — NEPROŠEL

| Porotce | Skóre | Kritické |
|---|---|---|
| Hierarchie | 3/5 | popisky kreseb na mobilu (Obr. 01/02/03/05: 11 + 1 + 5 + 7 kolizí či ořezů) |
| Typografie | 2/5 | próza 87,4 zn./řádek (max 94; `li` 83,7; split 81,1; callout 112); H1 natvrdo „Krásný trávník / začíná pod / zemí" (sirotek + předložka); popisky kreseb na mobilu (5 ze 6) |
| Pohyb | 3/5 | Obr. 03: hladina na hranici smyčky skočí o 9 px (diff 0,51 % vs. 0,00 % u ostatních 20 hranic); SMIL `scale` mimo 6.6.1 |
| Grafický styl | 3/5 | `#8a6b4a` v Obr. 07 — jediná barva mimo paletu 9.2 |
| Slop | 4/5 | žádné |
| Výkon a přístupnost | 3/5 | 9 popisků s `opacity` .75/.8 → 3,45–3,83:1 (Obr. 01/04/05) |
| Rozložení | 3/5 | pod 1200 px text kapitoly na dvou osách (split na 40, próza na 162); prázdno 42 % (produktový pás) a 83 % (FAQ) vedle kratšího sloupce |

**Důležité, co porota zvedla shodně:** h3 mezititulky v roli title-sm
(36 px) místo subtitle — moje pravidlo `.id-article > h3` prohrálo kaskádu
s `.prose :where(h3):not(:where(.not-prose *))` (0,2,0 > 0,1,1); figcaption
splitů 76–86 zn. a full-bleed 92 zn. (max-width 700 přebíjí 62ch); stat
„2,5–7,5 cm/h" zlomený za pomlčkou; tracking těla 0 místo −0,01 em;
full-bleed fotka má radius 14 px; barvy-tokeny mimo tabulku 9.2 (#e8e7e3,
#f6f5f2, bílé linky .34–.36); tahy pod 1,5 px; hero: perex viditelný
dřív než titulek; reduced-motion: kapsle „lupne" po 1 s
(`id-capsule-in 1e-05s 0.95s` přežije `animation:none`); Obr. 07 popisky
na vzorku pórů p05 2,79:1; mobil: scroll-cue leží přes metu.

**Zamítnuto s důvodem:**
- „Hero podvzorkované 1440×611" (styl) — `naturalWidth` u srcset s `w`
  deskriptory vrací hodnotu dělenou hustotou; na disku je master
  3840×1629 a prohlížeč žádá w=1920 (1×) / w=3840 (2×). Změřeno, ne
  odhadnuto — táž past jako u článku 1.
- „Hero podtext má nabíhat autoAlpha 0→1" (pohyb, dle 6.3.3) — vědomě ne:
  lead je LCP kandidát (744 ms, LCP = FCP); opacity 0 by LCP posunulo za
  fade. Spor 6.3.3 × 6.8 → koš B.
- Chip KALKULÁTOR (slop) — předepisuje 7.7; FAQ jako „třetí shrnutí"
  (slop) — vyžaduje šablona obsahu (GEO); obojí koš B / textový krok.

**Souhrn kola 01: 3 · 2 · 3 · 3 · 4 · 3 · 3, 9 kritických nálezů.**

#### Opraveno — balík „mobil, míra sazby, osy" (2026-09-12)

1. **Popisky kreseb na mobilu.** Mobilní zvětšení 17/21 (a 21/25 pod
   400 px) zděděné z článku 1 dávalo 13 px — víc, než je třeba — a
   v hustých kresbách se řádky překrývaly a ořezávaly. Panel kresby jde
   na telefonu k okrajům obrazovky (369 px místo 321, měřítko 0,71),
   zvětšení kleslo na 15/18 (→ 10,6 / 12,8 px) a pod 360 px na 18/21.
   Pět kreseb přeskládáno pro tuto sazbu: kratší hlavičky a verdikty
   (Obr. 01), pointa Obr. 02, užší jáma + širší odečet 204 px (Obr. 03),
   užší profil + popisky 204 px a `viewBox` od y=60 (Obr. 05), popisky
   vzduchu z hlíny na krém a rozteč hlaviček (Obr. 07). Nový přejímkový
   skript `scripts/svg-labels.mjs` (kolize + ořez + min. px): 393 px
   **0 kolizí, 0 ořezů, min 10,6 px** u všech sedmi kreseb; 1440 čisté.
2. **Míra sazby (ADR-007).** Token `--id-measure: 33em`, pravé odsazení
   uvnitř sloupce: próza **87,4 → 72,1** znaku (max 94 → 79), `li` 83,7
   → 71,1, split 81,1 → 71,7, callout 112 → 73, FAQ → 73, produktový pás
   → 71,8. Nad 80: **0 řádků** (dřív 32 z 37 odstavců). Tracking těla
   −0,01 em. Osy mřížky beze změny (layout-check 1024/1440/1990 čisté).
3. **H1** na dva řádky („Krásný trávník / začíná pod zemí"), splitLines
   14 → 16 znaků; bez sirotka i předložky na konci řádku.
4. **Paleta a kontrast kreseb.** `#8a6b4a` → `#d8c9b4`@.55; zeolit
   `#e8e7e3` → `#d5d3cc`; praskliny `#f6f5f2` → `#d5d3cc`; bílé linky
   .34–.36 → .22; tahy 0,7–1,4 → 1,5–1,6; devět popisků bez `opacity`
   (3,45–3,83:1 → 5,97:1); popisky Obr. 07 pryč ze vzorku pórů.
5. **Obr. 03 hladina** — SMIL `scale` (skok 9 px na hranici smyčky) → CSS
   `alternate` 6 s: druhá půlka je „naplňte jámu znovu", žádný střih.
6. **Osy pod 1200 px:** po složení dvousloupce sedí text kapitoly na
   obsahové ose (`margin-inline: auto`, 1024: 162 = 162), ne na hraně 40.
7. **Prázdno vedle sloupců:** produktový pás — tři vlastnosti pod prózou
   v levém sloupci místo řady pod pásem (sloupce vyrovnané); FAQ —
   nadpisový sloupec lepivý (cestuje se seznamem). Panel kresby vyplní
   sloupec (652 = B), takže hrany sedí na 40/1400 jako text a kalkulátor.
8. **Kapitola 05** — kresba tří zón přesunuta k podkapitole o zónování
   (2,2 obrazovky prózy bez obrazu → obraz uprostřed), čelo kapitoly
   nese `chapter` + próza; `h3 + split` 28 px.
9. Drobné: h3 v roli subtitle (`.prose.id-article > h3` — kaskáda),
   figcaption full-bleed 62ch, obraz full-bleed bez radiusu, stat „2,5–7,5"
   `nowrap`, kalkulátory `role=group` + `aria-labelledby`, kapsle při
   reduced-motion bez „lupnutí" (`animation: none !important`), hero na
   mobilu 96 px pod metou (cue už neleží přes „Journal"), full-bleed
   fotka: 115 px před, 44 px za (patří ke kapitole 06), Obr. 04 stébla.

**Ponecháno vědomě (koš B / text):** chip KALKULÁTOR (7.7), FAQ jako
GEO šablona, dvojí „Objevit systém" (kapsle 7.1 + CTA), hero podtext bez
fade (LCP), fokus vstupů kalkulátoru podtržením (výjimka v CSS vs. 11.2),
skip-link a `aria-label` navigací (mimo článek), délka 21 obrazovek.

## Kolo 02 — NEPROŠEL

| Porotce | 01 → 02 | Kritické 02 |
|---|---|---|
| Hierarchie | 3 → 3 | žádné |
| Typografie | 2 → 3 | `.id-feature__text` 85 zn./řádek — jediný prozaický uzel, který míře unikl |
| Pohyb | 3 → 3 | žádné |
| Grafický styl | 3 → 3 | full-bleed stále s radiusem 14 px — `.prose img` v globals.css má stejnou specificitu a stojí později |
| Slop | 4 → 4 | žádné |
| Výkon a přístupnost | 3 → 4 | žádné |
| Rozložení | 3 → 3 | zónovací dvousloupec 64 % prázdna (text 242 vs. panel 673); FAQ 83 % (lepivý štítek se v bloku kratším než viewport nikdy nerozjede) |

**Souhrn: 3 · 3 · 3 · 3 · 4 · 4 · 3, 4 kritické** (z 9). Shodně zvednuto
napříč porotci: dlaždice „2,5–7,5 cm/h" přetéká do „300 l" (moje `nowrap`
z kola 01 — regrese), na mobilu jde kresba před titulek kapitoly (šablona,
ne rozhodnutí), callout „Shrnuto a podtrženo" jako poloprázdný modrý panel
na páté šířce, FAQ vklíněné mezi produkt a výzvu (8.2: N+1 → N+2), hero
titulek přes list rýče (`object-position: 62 %` zůstal po fotce článku 1),
kresba 05 bez stropu 520 v pásmu 900–1129 (`viewBox^="0 0 520"` nechytne
viewBox od y=60), diagram v pásu se SMIL translate/opacity (6.6.1),
kapky Obr. 07 startující uvnitř bloku 1, čtyři kresby bez dominantního
prvku, h3 w600 místo w500, NBSP ve verdiktech kalkulátorů, CTA sub 78 zn.

**Zamítnuto s důvodem:** hero podtext bez fade (LCP, koš B — podruhé);
fokus vstupů podtržením (výjimka v CSS, spor s 11.2 — koš B); popisky
kreseb 10,6 px na telefonu pod 12px minimem 4.3 p. 6 (9.2 p. 3 počítá
s měřítkem, 10 px je mez z článku 1 — spor uvnitř DS, koš B); kapka
Obr. 05 5,2 s (dráha 212 px, rychlost odpovídá normě `fall`).

#### Opraveno — balík „kapitola 05, FAQ, regrese" (2026-09-12)

1. **Zónovací dvousloupec** nese mezititulek uvnitř (nový `titleLevel: h3`
   ve Split, sazba subtitle) a tři odstavce vč. „Upozornění"; kresba 05
   zhutněna (bez řádku „přechody navazují" — nese ho popisek; „cm" nad
   metr; viewBox 430). Prázdno **64 → 19 %**.
2. **FAQ** dostalo standfirst: autorovo „Shrnuto a podtrženo" v levém
   sloupci v roli leadu (nové pole `lead`), modrý callout z prózy pryč;
   FAQ stojí před produktovým pásem, takže produkt → výzva sousedí
   a přechod FAQ → produkt je posunem povrchu. Lepivý sloupec zrušen.
3. **Split = hlava · kresba · tělo** (tři položky mřížky): na desktopu
   hlava k dolní hraně 1. řádky, tělo k horní hraně 2., kresba přes obě
   → centrované jako dřív; na telefonu titulek → kresba → tělo.
4. **Míra** i pro `.id-feature__text` (85 → ~66 zn.); h3 w500 / lh 1,25;
   CTA sub 30 em; NBSP ve všech čtyřech verdiktech.
5. **Dlaždice:** `nowrap` jen na hodnotě + `<wbr>` před jednotkou —
   „2,5–7,5" drží, „cm/h" smí spadnout.
6. **Full-bleed bez radiusu** přes `.prose .id-figure--bleed img`.
7. **Hero art direction patří fotce:** `ImageMedia` čte `focalX/focalY`
   z knihovny médií → `object-position`; sonda 30/50 (rýč na 71 %, titulek
   volný), hero článku 1 dostalo 62/48 do dat. `sizes` hera
   `(orientation: portrait) 236vh, 100vw` — na výšku se z 21:9 zobrazí
   jen 22 % šířky, mobil teď žádá 3840 místo 1200.
8. **Kresby:** strop 520 podle `viewBox*=" 520 "`; dominantní prvek
   v 01 (chování válečku 20 px), 02 (10–15 cm 24 px), 05 (hloubky 22 px),
   07 (pointa 22 px); kapky Obr. 07 startují pod blokem 1.
9. **Diagram pásu:** kapky a pochod linky jako CSS (fade-in, bez skoku),
   ripple 3 instance s tahem .34 (dřív .1 = neviditelný); scroll-cue se
   pauzuje mimo viewport; `aria-hidden` na SVG uvnitř `role="img"`.

Přejímka po balíku: layout-check 1024/1440/1990 čisté; svg-labels
320/360/393/1440 0 kolizí, 0 ořezů; dvousloupce 5–24 % prázdna, produkt
20 %; próza max 79 zn.

Dodatek k bodu 2 (FAQ): standfirst v roli leadu (21/1,5) s vlastní mírou
20 em (≈ 41 znaků) — v obecném seznamu míry 33 em by ho pozdější pravidlo
přebilo na plnou šířku (kaskáda, změřeno: padding 0 → 232 px). Levý
sloupec 83 → 294 px vedle seznamu 492 px = **40 %** (dřív 83 %); je to na
hraně kritéria, další rezerva by byla pět otázek místo šesti.

## Kolo 03 — NEPROŠEL (těsně)

| Porotce | 02 → 03 | Kritické 03 |
|---|---|---|
| Hierarchie | 3 → 4 | žádné |
| Typografie | 3 → 3 | žádné (důležité: NBSP číslo–jednotka chybí systémově; dlaždice „2,5–7,5" přesahuje box o 9 px; figcaption 62ch = 85 zn.) |
| Pohyb | 3 → 4 | žádné |
| Grafický styl | 3 → 4 | žádné (důležité: hero na výšku zobrazí jen 20 % šířky → rýč mimo záběr) |
| Slop | 4 → 4 | žádné |
| Výkon a přístupnost | 4 → 4 | žádné |
| Rozložení | 3 → 3 | FAQ 40 % prázdna (na hraně); pásmo 900–1129: panel kresby 944 px s kresbou 520 = kresba plave v krému |

**Souhrn: 4 · 3 · 4 · 4 · 4 · 4 · 3, 2 kritické** (z 4). Pět ze sedmi lenzů
na 4, nula kritických mimo rozložení.

**Zamítnuto s důvodem:** „šest ze sedmi kapitol otevírá stejný modul —
chybí střídání šířek" (slop) × „souměrné, pravidelné střídání" (rozložení,
kritérium majitele) — držíme pravidelnost; tučné návěstí a vykřičníky
v próze (slop) = autorův text → `copy-polish`; „obraz vždy první" 8.2b ×
rubrika hierarchie — DESIGN.md opraven na titulek → obraz → tělo; dvojí
„Objevit systém" (kapsle 7.1 + CTA) — koš B; hero podtext bez fade — koš B
(potřetí, LCP).

#### Opraveno — balík „NBSP, portrét, pásmo 900–1129, FAQ" (2026-09-12)

1. **`nezlomitelneMezery` váže číslo k jednotce** (cm, cm/h, l, l/min,
   kg, kg/l, m², m³, min, s, h, bar, litry, sekundy, minuty, dny, %, °C)
   a tisíce („10 000") — platí pro Lexical prózu, dvousloupce, popisky,
   FAQ i verdikty kalkulátorů najednou. Past: `\w` neumí „ů", takže
   „30 centimetrů" propadalo — regex je teď `\p{L}` s vlajkou `u`.
   Dobráno ručně: výstupy a popisky kalkulátorů (`.id-calc__ov/ol`),
   zvýrazněný `<em>` v souhrnu, titulky rysů produktového pásu, chip FAQ.
   Sonda po opravě: 0 zbytků na 1440 i 1024.
2. **Hero na výšku:** knihovna médií dostala `focalPortraitX/Y`;
   `ImageMedia` vypisuje `--id-focal` a `--id-focal-portrait`, CSS je bere
   podle orientace (sonda 30/50 na šířku, 62/45 na výšku — rýč v záběru;
   článek 1: 62/48 a 70/36 — dřív natvrdo v CSS).
3. **Pásmo 900–1129:** po složení dvousloupce má panel kresby šířku prózy
   (700, osa 162 @1024) místo `edge` (944) — kresba už neplave; popisek
   pod ním totéž. Past: procentní `padding-right` popisku se počítá
   z rodiče (944), ne z vlastních 700 → sloupec 161 px a devět řádků;
   popisek proto po složení drží `max-width: 30em` a levou hranu panelu
   dopočítává z rodiče. Naměřeno @1024: panel 700 @162, popisek 405 @162.
4. **FAQ:** pět otázek místo šesti (šestá byla nejméně nosná, text můj)
   → 294 vs. ~410 px.
5. **Dlaždice:** má-li některá hodnota přes 5 znaků, jde o stupeň níž
   **celá řada** (26 px; 32 i 28 px „2,5–7,5" ještě zalamovaly a jedna
   menší dlaždice vedle tří velkých by četla jako chyba, ne záměr) —
   čtyři dlaždice 30 px vysoké, hodnota `white-space: nowrap`, jednotka
   smí za `<wbr>` spadnout níž.
6. **Figcaption** dvousloupce sedí na hraně panelu (40/1400), míra 30 em
   ≈ 62 znaků (62ch dávalo 85 — `ch` je u SF Pro široký); full-bleed
   totéž.
7. **Kapitola 06:** titulek → full-bleed fotka → próza (fotka už
   nepředchází tezi); mezery 32 / 44.
8. **Pohyb:** `.id-btn` má přechod (transform .35 s, barvy .25 s, `--id-ease`);
   past: `.prose a` (0,1,1) v globals.css ho přepisoval na pouhý
   `text-decoration-color .2s` → `.prose a:not(.id-btn)`. Hladina
   v Obr. 03 klesá jednosměrně a reset schová opacity 0.
9. Drobné: kalkulátor h3 `balance`; světlý verdikt na `--id-green-soft`
   (4,61 → ≥ 5:1); legenda Obr. 05 má „voda"; Obr. 04 bez prázdného spodku
   (viewBox 496); DESIGN.md 8.2b: pořadí a panel po složení.

**Přejímka před porotou 04** (commit `4b6d77e`): `layout-check` 1024 / 1100 /
1440 / 1990 bez chyby (osy 3+3, šířky 700/1360/full, R L R L R L);
`svg-labels` 393 (min 10,2 px) i 1440 (min 12 px): 0 kolizí, 0 ořezů;
hero na šířku `30% 50%` + `w=1920` @1440; `tsc` čistý. Mezi přejímkou
a porotou se kód neměnil.

Pozn. k provozu: přesun bloku 561–1129 v `intelidome-ds.css` nechal
osamocenou `}` → Turbopack držel chybu „Missing opening {" i po opravě
souboru a restartu; pomohlo až smazat `.next/dev`.

## Kolo 04 — NEPROŠEL (těsně): 3 · 4 · 4 · 4 · 4 · 4 · 4, 1 kritický

Porota běžela jako workflow: 7 lenzů paralelně se strukturovaným verdiktem
a ke každému kritickému nálezu skeptik, který ho zkouší vyvrátit měřením
(první pokus se sedmi samostatnými subagenty spadl na limit relace).

| Porotce | 03 → 04 | Kritické 04 |
|---|---|---|
| Hierarchie | 4 → 3 | **kapka legendy Obr. 05 přes „základ"**: 393 překryv 4 px, 360/320 6 px; na 1440 kapka 3 px od „základ" vs. 7 px od „voda" → čte se jako značka špatného slova. Skeptik potvrdil třemi cestami (DOM, pixely snímků, offline render). |
| Typografie | 3 → 4 | žádné (důležité: dlaždice mimo token 26/20 px — můj zpětný krok z kola 04; maska H1 ořezává descender 1,5 px; rozsah „1–2" lomený za pomlčkou) |
| Pohyb | 4 → 4 | žádné (důležité: primary hover mění pozadí místo glow — 7.2; vstupy kalkulátorů bez prstence — 7.0) |
| Grafický styl | 4 → 4 | žádné (důležité: táž kolize legendy; klíčové hodnoty v pěti velikostech 20–30 px) |
| Slop | 4 → 4 | žádné (důležité: sdílená figura produktového pásu s uzlem Osvětlení — koš B; CTA i kapsle vedou na „/" — fáze F1) |
| Výkon a přístupnost | 4 → 4 | žádné (důležité: vstupy bez prstence; chybí Article JSON-LD, `<time>`, og:image = hero; hero na telefonu w=3840) |
| Rozložení | 3 → 4 | žádné (důležité: kapitola 05 bez obrazu — 2 499 px prózy mezi Obr. 04 a 05; FAQ levý sloupec 36 % prázdný) |

**Souhrn: 3 · 4 · 4 · 4 · 4 · 4 · 4, 1 kritický** (ze 2). Naměřeno beze sporu:
36/36 `.rv` odhaleno jednou, 10/10 smyček bez skoku, CLS 0,000, 100 % párů
≥ 4,5:1, próza Ø 70,5 zn. (0 z 382 řádků nad 80), 254 nbsp po předložkách,
78 číslo–jednotka, akcent ≤ 0,99 % plochy.

**Zamítnuto s důvodem:** FAQ „přidat 6. otázku" (rozložení) × kolo 03
„FAQ 40 % prázdna" — šestá otázka by levý sloupec vyprázdnila víc, ne
míň; CTA na domovskou stránku (slop) = fáze F1, produktová stránka
neexistuje — koš B; hero w=3840 na telefonu (výkon) = potřebuje portrétový
ořez jako nový asset — koš B; H1 na 320 px 4 řádky = dolní mez tokenu
`display-xl` — koš B (DESIGN.md 14).

#### Opraveno — balík „Obr. 05, kapitola 05, sladění se spec" (kolo 05, commit `4875f6f`)

1. **Legenda Obr. 05 na dva řádky (3 + 2)**, viewBox 452; kapka 158 px od
   „základ". `svg-labels.mjs` nově hlídá i **kolize značka × text** —
   při 24px pointách hned chytila drobky v Obr. 01 (drobky 4 px výš,
   pointy na 397).
2. **Kapitola 05 otevírá Obr. 05** ve dvousloupci s eyebrow + H2 jako
   ostatní kapitoly; trojice jíl / hlína / písek jde do těla splitu jako
   odstavce s tučným návěstím (seznam do těla splitu nejde), zónování je
   h3 + tři odstavce prózy. Pořadí autorova textu beze změny; R L R L R L
   drží; nejdelší úsek bez hmoty spadl z 2 499 px.
3. **Klíčová hodnota kreseb 24 px jednotně** (DESIGN 9.2 p. 3, v2.4).
4. **DS podle spec:** `.id-btn--primary:hover` glow místo ztmavení
   (+ box-shadow v přechodu); vstupy kalkulátorů `:focus-visible` prstenec
   3/3 a přechod podtržení; `.id-calc` antialiased (světlý panel auto);
   figcaption 16/14/mist (7.12); popisek full-bleed figury na ose prózy
   (370 @1440, 162 @1024).
5. **Dlaždice zpět na `--id-t-stat`** (40 px @1440, 26 px na telefonu);
   souhrn sází 2×2 — dlouhý rozsah řeší sazba, ne menší písmo.
6. **Mikrotypografie:** rozsahy „1–⁠2" (U+2060), „×" místo „x" s pevnými
   mezerami, `text-wrap: balance` na otázkách FAQ, popisek dlaždice nbsp,
   hero meta láme po položkách (oddělovač u předchozí), mezera mezi
   řádky H1 (textContent „trávník začíná").
7. **Strojová čitelnost:** Article/BlogPosting JSON-LD, `<time datetime>`,
   og:image = hero.

**Přejímka před porotou 05:** `layout-check` 1024 / 1100 / 1440 / 1990 OK
(R L R L R L, 64 modulů); `svg-labels` 320 / 360 / 393 / 1440 vč. značek:
0 kolizí, 0 ořezů; dlaždice 40 px 2×2 @1440; K05 split @10 288 → h3
zónování @11 737; popisek bleed l=370; JSON-LD BlogPosting + FAQPage;
hover glow rgba(37,99,235,.35), pozadí beze změny; prstenec 3 px / 3 px;
`tsc` čistý.

## Kolo 05 — NEPROŠEL: 4 · 4 · 4 · 3 · 4 · 4 · 3, 0 kritických

Porota poprvé doběhla bez jediného kritického nálezu. Jediný, který
vznikl (rozložení: CTA pás 40,3 % prázdna), skeptik překlasifikoval —
240 px prázdna je přesně 2 × `--id-sect-y` (120 nahoře, 120 dole), tedy
to, co 8.1 p. 6 předepisuje; pod práh 35 % se při 356 px inkoustu
nedostane ani pás sázený zcela podle normy. Zůstala ale druhá noha
nálezu: 116 px mezi obsidianem a CTA — dva pásy, které se mají potkat švem.

| Porotce | 04 → 05 | Co drží podprahové lenzy |
|---|---|---|
| Hierarchie | 3 → 4 | — (důležité: lead souhrnu = 94 % třetího odstavce úvodu; dvě CTA na poslední obrazovce) |
| Typografie | 4 → 4 | — (důležité: dvě pomlčky v jednom článku — próza „–", komponenty „—") |
| Pohyb | 4 → 4 | — (důležité: `.rv` v `.rv` v produktovém pásu = posun 56 px místo 30; ripple startuje na krytí 0,75) |
| **Grafický styl** | 4 → **3** | hloubková osa má ve třech sousedních řezech tři hlasy (15 px s jednotkou 4× / 12 px bez nuly / 15 px + hlavička „cm"); full-bleed fotka je na telefonu pruh 393×167 px (19,6 % výšky) bez art direction, kterou hero má |
| Slop | 4 → 4 | — (důležité, koš B: 16 250 px bez posunu povrchu = 83 % stránky, obsidian 11,4 % proti 20–35 % dle 8.1) |
| Výkon a přístupnost | 4 → 4 | — (důležité: kotva nadpisu končí 30 px nad viewportem a kapsle překryje dalších 56; og:url a canonical míří na domovskou stránku; hero na telefonu w=3840) |
| **Rozložení** | 4 → **3** | 116px mezera mezi dvěma pásy; pět vstupních polí kalkulátoru má pět pravých hran (rozptyl 56 px); FAQ na 1280 má vlevo 47 % prázdna; úsek 1 978 px prózy bez obrazové hmoty |

Naměřeno beze sporu: 35/35 revealů doběhne a jen jednou, 10/10 smyček
bez skoku (kromě ripple), CLS 0,0000, LCP = FCP i při 4× brzdě CPU,
0 textů pod 4,5:1 (pixelově i pod fotkou), 0 přetoku na 320 px, focus
na všech 18 cílech, próza 69–72 znaků, 339 nezlomitelných mezer,
0 sirotků v titulcích, akcent ≤ 1,02 %.

#### Opraveno — balík „osa řezů, předěl na telefonu, švy a sazba" (kolo 06, commit `a4b5e14`)

1. **Hloubková osa jedním hlasem** ve všech třech řezech: `.sv-val`,
   jednotka jen u nuly („0 cm / 10 / 20 / 30"). Zapsáno do 9.2 p. 3.
2. **Full-bleed fotka má na telefonu ořez 4:5** kolem `--id-focal-portrait`
   (fotka dostala fokální bod jako hero); nad 560 px zůstává 21:9.
3. **Šev mezi pásy**: `.id-article > .id-band + .id-band { margin-top: 0 }`
   — pás nese vlastní `--id-sect-y`, mezera mezi nimi byla třetí, cizí prázdno.
4. **Linku vstupu nese řádek, ne pole.** Dokud ji nesl input, končila tam,
   kde začínala jednotka („cm" vs. „kg / pytel"), takže pět polí mělo pět
   hran. Teď 5 × 691 px @1440, 5 × 353 px @393.
5. **FAQ drží dvousloupec až od 1440** — níž jde titulek nad seznam.
6. **Jedna pomlčka** (česká „–") ve všech komponentových textech; nbsp
   kolem „=" a za „Obr."; verdikt na míru 33 em; chip 11,5 px/+0,14em
   a CTA tracking na tokeny; dlaždice 2 sloupce už pod 640 px (7.6).
7. **Kotvy nadpisů** `scroll-margin-top: 124px` (dolní hrana kapsle 74 px
   + odstup + 30 px revealu) — ověřeno skokem na fragment: top = 124 px.
8. **Přístupnost a stroje:** jednotky kalkulátoru v přístupném jméně pole
   (`aria-describedby`), reduced-motion podle 6.7 v2 (`animation: none`
   + pojistky `.rv` / `.id-hline > span` / `.id-hero__fade`),
   og:url + og:type=article + canonical na článek.
9. **Pohyb:** produktový pás má jednu reveal skupinu místo `.rv` v `.rv`;
   ripple náběh z krytí 0 (12 % periody) místo skoku z 0,75.
10. **Souhrn:** lead je destilát, ne doslovný třetí odstavec úvodu.
    Autorova próza zůstala nedotčená — přepsán byl můj text.

**Přejímka před porotou 06:** `layout-check` 1024 / **1280** / 1440 / 1990
bez chyby (1280 je nově kryté pásmo, které porota označila za nehlídané);
`svg-labels` 320 / 360 / 393 / 1440 vč. značek: 0 kolizí, 0 ořezů;
šev mezi pásy 0 px; linky kalkulátoru jednotné; em dash v článku 0;
kotva 124 px; og + canonical na článek; `tsc` čistý.

**Pozn. k limitu:** vstupní nastavení mělo max 5 kol. Kolo 06 běží proto,
že balík po kole 05 je hotový a ověřený přejímkami, ale bez verdikt
poroty ho nelze prohlásit za průchod (u článku 1 smyčka doběhla v 11 kolech).

## Kolo 06 — NEPROŠEL a ZHORŠIL SE: 3 · 4 · 4 · 2 · 2 · 3 · 4

První kolo, které kleslo (05: 4·4·4·3·4·4·3). Rozbor ukázal dvě různé
příčiny — a jen jedna z nich je „nový nález".

**a) Zpětné kroky, které způsobil balík kola 06 (čtyři):**

1. Sjednocení klíčové hodnoty kreseb na 24 px **ořízlo pointu Obr. 07**
   („sedá týdny, ne dny" na baseline 497 ve viewBoxu 500 → bbox 502,6).
2. Totéž sjednocení dalo **Obr. 05 tři klíčové hodnoty místo jedné** —
   9.2 p. 3 mluví o pointě v jednotném čísle, kresba tím pointu ztratila.
3. Ořez full-bleed fotky 4:5 na telefonu **neměl odpovídající `sizes`**
   (zůstalo `100vw`), takže prohlížeč bral variantu w=1200 do slotu, který
   potřebuje ~1160 CSS px při dpr 3 → fotka změkla (2,9× upscale).
4. `meta.image = hero` poslalo do **og:image AVIF**, který náhledové
   crawlery neumí — předtím tam byl funkční `og-default.webp`.

Poučení je totéž jako u článku 1: **sjednocování je zásah do kompozice,
ne kosmetika.** Jeden token aplikovaný plošně (24 px) rozbil dvě kresby
a jeden atribut (`aspect-ratio`) zneplatnil jiný (`sizes`).

**b) Nový nález, který předchozí kola minula — fotografie:**

| Porotce | 05 → 06 | Kritické |
|---|---|---|
| Hierarchie | 4 → 3 | dvě CTA na poslední obrazovce (kapsle + pás, týž cíl) |
| Typografie | 4 → 4 | — |
| Pohyb | 4 → 4 | — |
| Grafický styl | 3 → **2** | **Obr. 06: AI artefakty na nářadí** (hroty = dva uzavřené oblouky, hlava vidlí nespojená s násadou, kov mizí v rukavici) |
| Slop | 4 → **2** | **totéž** + obvinění hera z téže signatury |
| Výkon | 4 → 3 | — (důležité: výsledky kalkulátorů mimo aria-live = WCAG AA) |
| Rozložení | 3 → **4** | — (šev, linky kalkulátoru i FAQ z kola 05 uzavřeny) |

Fotky jsem prověřil sám v masteru 3840 px: **u vidlí nález platí**
(nářadí nemůže existovat), **u hera neplatí** — rýč má tulejku i souměrný
list, porotcova „nesouměrná ramena" jsou perspektiva. Zamítnuto s důkazem.

#### Opraveno — balík „zpětné kroky, fotografie a jedna výzva" (kolo 07)

1. **Nová fotografie kapitoly 06** (`fig-ryc-zahon.avif`, 3168×1344):
   rýč zaražený do zpracovaného záhonu, bez rukou a bez druhého nářadí —
   motiv, kde model nemá kde vyrobit nemožný spoj. Ověřeno výřezem
   v plném rozlišení: násada → tulejka s nýtem → žebro po listu.
2. **Zpětné kroky 1–4 vráceny**: Obr. 07 viewBox 512 (pointa se vejde),
   Obr. 05 má jedinou pointu („0–10 cm"), `sizes` full-bleed figury zná
   mobilní ořez (`(max-width: 560px) 295vw`), og varianta se generuje
   ve WebP (`formatOptions` v Media).
3. **Jedna výzva na obrazovku**: mini-CTA v kapsli ustoupí, jakmile je
   závěrečný CTA pás ve viewportu (IntersectionObserver + `visibility`,
   takže nezůstane neviditelný tab stop).
4. **Výsledky kalkulátorů v živé oblasti** — `aria-live` nese výstupní
   sloupec, ne jen verdikt (4 z 5 vstupů dřív neohlásily nic).
5. **Kresby**: uzavřená kontura levého řezu Obr. 04, legendové značky na
   paletě (#232830, 1,6 px) místo textového tokenu, konstrukční linka
   Obr. 03 na #d5d3cc, cílová rovina Obr. 07 jen tam, kde se od ní povrch
   liší; panel figury 40 px dle 7.12.

**Incident při přenahrání médií.** Logika „médium bez WebP og nahraj
znovu" smazala médium dřív, než ověřila, že jeho zdroj v repu existuje —
a `hero-soumrak.avif`, hero **článku 1**, v `zdroje-informaci/fotky`
není. Článek 1 tím na lokální DB přišel o hero. Napraveno: seeder teď
maže jen tehdy, když soubor pro nahrání zpět skutečně leží na disku,
a článku 1 bylo přiřazeno `hero-zavlaha.avif` (2400 px, zůstalo
v knihovně) i s fokálními body. Produkce dotčená není — pracuje se na
lokální DB.

### Připomínka autora k heru (13. 9.) — rýč nefunguje jako měřítko

> „Rýč na prvním obrázku je malý. Díra je hluboká správně, ale čepel rýče
> má být tak vysoká jako je díra."

Věcná vada, ne vkus: článek staví na tom, že **jeden list rýče ≈ 30 cm**,
a hero to má ukázat na první pohled. Naměřeno na `hero-sonda.avif`
(výřez masteru 3840 px): drn v y≈130, dno sondy v y≈1000, čepel od y≈550
do y≈975 → **čepel = 49 % hloubky**. Sonda tedy vypadá dvakrát hlubší,
než jakou článek popisuje, a rýč měřítko nenese.

Řešení: nová hero fotografie, kde horní hrana listu leží na drnu a špička
na dně jamky (poměr 0,9–1,1). Vygenerováno 8 kandidátů ve dvou kompozicích
(celková scéna / detail u země), vybíráno třemi nezávislými lenzy:
měřítko · anatomie nářadí · použitelnost pod titulkem.

#### Nové hero (13. 9.) — rýč konečně měří

Vygenerováno 8 kandidátů, vybíráno třemi nezávislými lenzy (měřítko ·
anatomie nářadí · použitelnost pod titulkem). Lenzy se rozešly přesně
tam, kde to bylo čekat: nejlepší měřítko (varianta 2, poměr 0,89
a bezvadná anatomie — tulejka s nýtem, souměrná ramena, souvislé ostří)
mělo nejhorší podklad pro bílý titulek, protože celý záběr je osvětlená
tráva. Vybrána varianta 2 — připomínka autora míří na měřítko, ne na
náladu — a světlost se vyřešila art direction, ne výměnou snímku:

1. **Stín v samotné fotografii** (sharp, gradient vlevo + shora + levý
   dolní roh). Pravá polovina a dno jámy zůstaly nedotčené, aby špička
   rýče a půdní profil zůstaly čitelné.
2. **Metařádek hera na `rgba(255,255,255,.78)`** místo `--id-ink-dark-2`
   (#9ba1a8): jeho jas leží blízko osvětlené hlíně, takže nad fotografií
   nevyšel ani s plným scrimem (naměřeno 1,0–3,5:1, i na původním heru).

Naměřeno pod skutečnými glyfy (ne přes celý rámec odstavce):

| prvek | desktop min / průměr | mobil min / průměr |
|---|---|---|
| eyebrow | 17,05 / 19,11 | 4,46 / 9,85 |
| H1 | 4,19 / 14,90 | 4,60 / 10,09 |
| lead | 13,08 / 18,75 | 7,68 / 14,30 |
| metařádek | 2,09 / **19,38** (dřív 7,17) | 16,65 / 19,12 |

Zbývá jediný kosmetický bod: eyebrow na mobilu 4,46 proti prahu 4,5
(rozdíl 0,9 %, průměr 9,85) a několik jednotlivých pixelů metařádku na
desktopu — obojí na hranici měřicí nejistoty AVIF komprese.

**Pozn. k repu:** `git add -A` v předchozím kroku vtáhl do commitu složku
`zdroje-informaci/` (podklady autora a fotografické mastery), která do
repa nepatří. Vráceno (`git rm --cached`) a doplněno do `.gitignore`;
commit `01de0bc` byl amendován ještě před pushem.

## Kolo 07 — ZÁVĚREČNÉ: 3 · 4 · 3 · 3 · 4 · 4 · 4, **0 kritických**

Poslední kolo na žádost autora. Práh („každý ≥ 4 a nula kritických")
splněn zpola: **kritický nález nezůstal žádný** — jediný vznesený
(styl: deformovaný rýč na Obr. 06) skeptik vyvrátil měřením. Rozdíl
výšky ramen 59 px je z ~80 % důsledkem toho, že rýč je v rovině obrazu
natočený o ~8°; kontrolní otočení výřezu srovná obě ramena i boční hrany
do svislice. Zbytek (12 px masteru = 5,5 CSS px @1440) je v pásmu
nejistoty odečtu na měkkém protisvětelném makru.

| Porotce | 06 → 07 | Co drží skóre |
|---|---|---|
| Hierarchie | 3 → 3 | kapitola 05 = 4 mobilní obrazovky bez hmoty (3 430 px); dva kalkulátory na dvou různých površích; hero meta bez počtu kalkulátorů; 7 kapitol proti šabloně 3–5 bez orientačního prvku |
| Typografie | 4 → 4 | kalkulátor odděluje hodnotu od jednotky (520–585 px mezi číslicí a jednotkou @1440) |
| Pohyb | 4 → **3** | split odhaluje hlavu, figuru i tělo naráz (stagger 0 ms, 18 z 35 revealů); Obr. 02 a 03 hýbou dekorací místo principu |
| Grafický styl | 2 → **3** | hero se na dpr 3 převzorkovává 1,90× (zdroj 3 168 px); podloží Obr. 02 je o 13 % SVĚTLEJŠÍ než ornice → obrácený hloubkový klíč; Obr. 03 má 4 segmenty a 3 popisky; legenda Obr. 05 se rozešla s rastrem uvnitř kresby |
| Slop | 2 → **4** | uzel „osvětlení" v produktovém pásu bez obsahu; partitura pásů (obsidian 9,4 % proti 20–35 %) |
| Výkon a přístupnost | 3 → **4** | telefon stahuje 2,09× víc bajtů než desktop; scrim končí ve 45 % výšky, takže H1 má 3,27:1 na 1990; kapsle přes 88 % míry sazby na mobilu |
| Rozložení | 4 → 4 | popisek Obr. 06 na telefonu zavádí čtvrtou pravou hranu; dvě jednorázové mezery (32 px, 24 px); nejdelší úsek bez hmoty 2 006 px |

**Naměřeno beze sporu:** CLS 0,000 na 19 554px stránce, 0 přetečení na
320–1990, **331 textových běhů bez jediného podkroku 4,5:1**, alt u obou
fotek, `role="img"` + aria-label u všech 7 kreseb, reduced-motion beze
zbytku, 0 animací layout vlastností, 0 nedoodhalených prvků, smyčky bez
skoku, próza pod 80 znaků na osmi šířkách, 327 nezlomitelných mezer,
0 sirotků v titulcích, akcent ≤ 1,02 % plochy, 0 kolizí popisků kreseb.

### Dva zpětné kroky, které kolo 07 odhalilo v balíku 06/07

1. **Linka vstupu na řádku** (oprava „pěti pravých hran") dala řádku
   `justify-content: space-between` plnou šířku, takže hodnota zůstala
   vlevo a jednotka odplula doprava — 520–585 px mezi nimi. 7.7 přitom
   předepisuje `max-width: 220px`.
2. **Legenda Obr. 05 na paletě** (#232830 / 1,6 px) se rozešla se
   značkou uvnitř kresby, která zůstala #5b5e63 / 1,5 px. Táž značka má
   teď v jedné kresbě dva obrysy.

Vzorec je po třech kolech stejný a stojí za zapsání: **oprava mířená na
jeden lenz rozbije jiný, když se nesáhne na obě strany vztahu.**

## Předání (po kole 07)

Smyčka se zastavuje bez průchodu, ale s nulou kritických nálezů
(vstup: 9 kritických v kole 01). Zbývající práce, seřazená:

**Koš A — stránka (opravitelné bez rozhodnutí o systému):**
1. Kalkulátor: hodnotu a jednotku k sobě (`max-width: 220px`, zarovnání
   doleva místo `space-between`) — vrací zpětný krok z balíku 06.
2. Obr. 05: srovnat obrys značky zeolitu uvnitř kresby s legendou.
3. Obr. 02: podloží na opacity 0,85 (teď je světlejší než ornice).
4. Obr. 03: popsat čtvrtý segment stupnice (7,5–10 cm/h).
5. Split: jedna staggerovaná orchestrace (`data-rv-group`, krok 80 ms)
   místo tří současných triggerů — v produktovém pásu už opraveno.
6. Obr. 02 a 03: přepnout smyčku z dekorace na princip.
7. Hero meta: doplnit počet kalkulátorů (8.2 ř. 1).
8. Kapitola 05: rozbít 3 430px úsek bez hmoty (mobil) — chce novou
   kresbu nebo přesun kalkulátoru.
9. Popisek Obr. 06 na telefonu: pravý okraj na osu sazby.

**Koš B — systém (patří do ADR, ne do článku):** partitura pásů dlouhého
článku (obsidian 9,4 % proti 20–35 %), dva kalkulátorové povrchy pro
tutéž roli, scrim končící ve 45 % výšky, kapsle přes 88 % míry sazby na
mobilu, `sizes` hera pro portrét, chip KALKULÁTOR s akcentovým obrysem,
sdílená figura produktového pásu s uzlem „osvětlení", dva jazyky kresby
napříč články. Vše je v `DESIGN.md` §14.

**Doporučení:** článek předat do `copy-polish` (produktový pás, FAQ a CTA
jsou můj text, ne autorův) a koš B řešit jedním ADR o partituře dlouhého
článku — tři lenzy na trojce ukazují na tentýž kořen: **19 554 px textu
se šesti stejně stavěnými kapitolami nemá dost obrazového a povrchového
rytmu.** To není vada článku, ale mezera šablony 8.2, která počítá
s 3–5 kapitolami.

Zlatý standard byl trenér, ne šablona.

## Balík „koš A" (po předání, na žádost autora)

Devět bodů z předávacího seznamu. Nic z toho neprošlo porotou — smyčka
skončila kolem 07 — takže čísla níž jsou z vlastní přejímky, ne verdikt.

| # | Bod | Stav | Naměřeno |
|---|---|---|---|
| 1 | kalkulátor: hodnota u jednotky | ✅ | mezera 12 px, vstup 220 px (7.7) **a zároveň** jeden pravý doraz 691 / 353 px — dřív 520–585 px mezi číslem a jednotkou |
| 2 | Obr. 05: značka zeolitu | ✅ | 0 výskytů `#5b5e63` v kresbách; rastr i legenda mají `#232830` / 1,6 px |
| 3 | Obr. 02: podloží | ✅ | opacity 0,70 → **0,88**; hloubkový klíč se přestal obracet |
| 4 | Obr. 03: čtvrtý segment | ✅ | přibylo „7,5–10 / na hraně"; 4 segmenty = 4 popisky |
| 5 | split: jedna orchestrace | ✅ | `data-rv-group` na 6 kapitolách; v 90 ms hlava 0,375 · kresba 0,071 · tělo 0 (dřív 0,371/0,371/0,371) |
| 6 | Obr. 02 a 03: pohyb = princip | ✅ | rýč stojí, kreslí se **kořen**, který se na desce láme do stran (`pathLength="1"`, dashoffset 1→0); hladina už nemizí — klesne, drží na odečet a rychle se doplní |
| 7 | hero meta | ✅ | „22 min čtení · **2 kalkulátory** · InteliDome Journal · 12. 9. 2026" |
| 8 | kapitola 05 bez hmoty | ⚠️ částečně | autorovo „Upozornění" sází callout místo odstavce → mobil **3 430 → 2 825 px** (4,0 → 3,3 obrazovky). Cíl 1 300–1 600 px to nesplňuje: bez nové kresby se úsek nerozpůlí |
| 9 | popisek Obr. 06 na telefonu | ✅ | glyfová hrana 393 → **373 px**, tedy na ose sazby. Past: `padding-right` musí stát **za** `padding-inline`, jinak ho zkratka přepíše |

Přejímka po balíku: `layout-check` 1024 / 1280 / 1440 / 1990 bez chyby,
`svg-labels` 320 / 393 / 1440 bez kolizí a ořezů, `tsc` čistý.

Bod 8 zůstává otevřený a patří k tomu, co předání pojmenovalo jako kořen
tří trojek: **sedm kapitol na 19 554 px nemá dost obrazového rytmu.**
Callout je náplast, ne řešení — to je nová kresba nebo ADR o partituře.

## Kolo 08 — 3 · 3 · 4 · 4 · 4 · 4 · 4, 0 kritických

Pět lenzů na čtyřce, dva na trojce, podruhé za sebou nula kritických.
Balík koše A zvedl **pohyb 3 → 4** a **grafický styl 3 → 4**; hierarchie
zůstala na 3 a **typografie spadla 4 → 3**.

**Čtyři z devíti oprav koše A vyrobily nový nález.** Tohle je potřetí
tentýž vzorec a stojí za doslovné zapsání:

| Oprava (koš A) | Co vyrobila | Naměřeno |
|---|---|---|
| kalkulátor: pevných 220 px na vstup | jednotka 156–215 px za číslem (číslo je v poli vlevo) | 207 px @1440 |
| Obr. 03: rychlé doplnění místo fade | **návrat** je teď dominantní pohyb, tedy opak děje kapitoly | 17,6 vs. 3,45 px/s = 5,1× |
| kapitola 05: callout | pátá šířka modulu, jediný box mimo osy | 330/1110 proti próze 370/1070 |
| kapsle ustoupí CTA pásu | skryté tlačítko si drželo místo → díra v kapsli | 128 z 332 px (39 %) |

Poučení: **u každé opravy se ptát, co je druhá strana vztahu.** Pole má
vztah k jednotce i k lince; smyčka má dvě půlky a dominantní je ta
rychlejší; nový modul dědí šířku po wrapperu, ne po sousedech; skrytí
`visibility` nechává box v toku, `display` ne.

#### Opraveno hned (regrese z balíku koše A)

1. **Vstup vyplní sloupec a číslo v něm stojí vpravo** — jednotka je
   12 px za posledním glyfem a linka má dál jeden doraz (691 / 353 px).
   Levá část linky vede oko k hodnotě, stejně jako u výstupních řádků.
2. **Hladina Obr. 03**: pokles 60 % periody, odečet 10 %, doplnění 30 %.
   Poměr rychlostí **5,1× → 1,9×**; dominantní je zase pokles.
3. **Callout na osu prózy** (`max-width` z `prose + 2 gutter` na `prose`)
   — 370/1070, tedy přesně próza.
4. **Mini-CTA `display: none`** místo `visibility: hidden` — kapsle se
   zúží ze 332 na 183 px, žádná díra.

Přejímka po opravě: `layout-check` 1024/1280/1440/1990 a `svg-labels`
320/393/1440 bez nálezu, `tsc` čistý.

### Co po kole 08 drží dvě trojky

**Hierarchie (koš A):** próza jedné kapitoly běží na dvou osách — začne
ve sloupci splitu (652 px, x 40 nebo 748) a bez signálu pokračuje
v centrální próze (700 px, x 370); skok 330 / 378 px v šesti kapitolách
ze sedmi. Dál: sedm kapitol na 19 696 px bez jakéhokoli orientačního
prvku a chybějící kategorijní čip v kapsli (7.1 ho předepisuje).

**Typografie (koš B):** maska hero H1 ořezává descendery o 1,5–2,5 px
(`.id-hline`, 6.3.3 nepočítá s obsahovou výškou 1,089 em); desetinná
tečka „0.8" v number inputu; 12px label má na stránce tři trackingy.

Obojí je architektonické, ne kosmetické: první chce rozhodnout, kde
kapitola končí jako dvousloupec, druhé sáhnout na masku v 6.3.3.

## Balík „dvě trojky" (hierarchie + typografie, po kole 08)

### Typografie — devět zásahů

| Nález | Řešení | Naměřeno |
|---|---|---|
| maska H1 ořezává descendery | `.id-hline` padding-bottom 0,12 em + záporný margin | ořez 2,5 px → **rezerva 8,2 px** |
| tři trackingy u uppercase 12 px | eyebrow, label kalkulátoru i chip na +0,14 em | 1,68 px u všech tří (dřív 1,68 / 1,44 / 1,20) |
| chip pod minimem 12 px | 11,5 → 12 px (4.3 p. 6) | 12 px |
| verdikt s váhou 500 | token body-sm: 400 / 1,55 / −0,006 em | 400 / 22,475 px |
| centrované CTA 68 a 75 znaků | vlastní míra 28 em místo 30 em a 52ch | pod 62 znaků |
| „0.8" s desetinnou tečkou | pole je `text` + `inputMode`, model počítá s tečkou, vstup píše čárku | „0,8" |
| „·" visící na konci řádku (mobil) | nezlomitelná mezera před oddělovač, zlom až za něj (`&#8203;`) | 0 visících |
| 17× obyčejná mezera číslo–jednotka v kresbách | NBSP ve všech figurách | **0 výskytů** |
| „(10 + 190 = …)" se lámalo za plus | NBSP kolem operátoru | drží pohromadě |

### Hierarchie — dva zásahy a jedno rozhodnutí

1. **Kresba už nevstupuje do čtení před kapitolovým titulkem.**
   `align-items: center` posouval panel o 39–92 px nad hlavičku; teď má
   hlava, kresba i tělo společnou horní hranu (`start`). Předstih
   naměřen **0 px** ve všech šesti kapitolách (dřív 39 / 58 / 92 px).
2. **Titulek rysu v produktovém pásu 17 → 19 px** — měl přesně velikost
   prózy téhož pásu, takže hierarchii nesla jen váha (Filozofie 2:
   autorita velikostí, ne tučností).
3. **Skok osy mezi tělem splitu a prózou zůstává** — viz níž.

### Proč skok osy neopravuji

Tělo dvousloupce stojí ve sloupci 652 px (osa 40 nebo 748), zbytek
kapitoly v próze 700 px (osa 370). **Geometricky to uvnitř 8.2b nemá
řešení:** kresba 520 px plus próza 700 px se na společnou osu do šířky
1360 nevejdou — textový sloupec by musel začínat na 370 a obraz by pak
měl 274 px. Obě varianty, které porota navrhla, mají horší vedlejší
efekt: (a) celá kapitola dvousloupcová vyžaduje seznamy a mezititulky
uvnitř bloku, což plochý Lexical neumí; (b) split jen s titulkem
a obrazem nechá textový sloupec s > 35 % prázdna. Zapsáno do
`DESIGN.md` §15 jako otevřené architektonické rozhodnutí s doporučením
ponechat do článku o 3–5 kapitolách.

### DESIGN.md v2.5 — čtyři spory rozhodnuty

Porota našla čtyři místa, kde si dokument odporoval: stat-num-xl (4.2)
× hero kalkulátoru (7.7), lead souhrnu 960 px (8.2) × 700 px (ADR-006),
tracking uppercase 12 px, váha verdiktu (7.8) × váhy těla (4.1). Všechny
rozhodnuty v nové sekci 15 — vždy ve prospěch toho, co stránka měřitelně
dělá, s důvodem. Výjimka `.sv-lbl` (+0,10 em) je nově pojmenovaná:
v husté kresbě působí širší rozpal kolize značka × text.

Přejímka: `layout-check` 1024/1280/1440/1990 a `svg-labels` 320/393/1440
bez nálezu, `tsc` čistý.

## Kolo 09 — 4 · 3 · 4 · 3 · 4 · 4 · 3, 1 kritický

**Hierarchie poprvé na čtyřce** (3 → 4): společná horní hrana titulku
a kresby zabrala, předstih obrazu 39–92 px → 0 px. Pohyb, slop a výkon
drží čtyřku potřetí.

**Oba kritické nálezy stylu skeptici vyvrátili měřením** — tvrzení
o AI artefaktech na obou fotografiích („nesouměrná ramena listu, chybějící
objímka") neobstálo: robustní fit dává mezi vnějšími rohy 7,8 px (0,25 %
šířky snímku), sklony +5,1° a +16,9° jsou zrcadlově symetrické vůči
naklonění nástroje a ramena mají v projekci stejnou délku. Rýč je
v pořádku; „30px krok" v měření porotce není reprodukovatelný.

**Kritický nález ale zůstal — a byl můj.** Česká desetinná čárka
v poli sypné hustoty si vyžádala `type="text"`, jenže sazbu panelu nesl
selektor `.id-calc input[type='number']`. Pole z ní vypadlo a sázelo se
systémovým 17 px proti 44 px u sousedů; jednotka „kg/l" (18 px) byla
větší než hodnota. **Pátá regrese z mých vlastních oprav.**

A šestá hned vedle: `align-items: start` sice srovnal horní hranu, ale
s `grid-template-rows: auto auto` si řádky rozdělily zbytek výšky kresby,
takže mezera titulek → tělo měla v šesti kapitolách šest hodnot
(22–113,6 px).

#### Opraveno

| Regrese | Příčina | Řešení | Naměřeno |
|---|---|---|---|
| pole hustoty bez sazby | selektor podle **typu pole** | sazbu nese **řádek**: `.id-calc__inrow input` | 5 z 5 polí 44 px / 600 / vpravo |
| mezera titulek → tělo 22–113,6 px | `grid-template-rows: auto auto` | `auto 1fr` + `margin-bottom: 24px` (5.1) | **24 px ve všech šesti** |

Plus dva nálezy zvenčí: Obr. 03 dostal obvodový obrys (jediná z šesti
kreseb, které hmota půdy „tekla" bez kontury) a `.id-feature__title`
sedí na tokenu `--id-t-lead` místo volných 19 px.

**Poučení k selektorům:** vazba na `[type='number']` je vazba na
implementaci pole, ne na jeho roli. Jakmile se typ změní kvůli něčemu
úplně jinému (lokalizace!), sazba tiše zmizí. Role patří na kontejner.

Přejímka: `layout-check` 1024/1440/1990 a `svg-labels` 320/393/1440 bez
nálezu, `tsc` čistý.

## Koš B — vyřešeno (2026-09-13)

Osm oblastí prověřil workflow (32 agentů: průzkum + oponentura ke každému
netriviálnímu návrhu). Z **62 bodů 57 platilo, 1 byl mezitím vyřešen,
4 se ukázaly jako mylné.** Zavřeno všech 33 triviálních plus dva nálezy,
které průzkum objevil navíc — jeden z nich funkční.

### Nález, který průzkum našel navíc a byl vážný

**Do pole sypné hustoty nešlo napsat desetinné číslo.** Moje oprava
české čárky (kolo 09) držela ve stavu *číslo*, takže se hodnota při
každém stisku normalizovala: „1,05" se vyťukalo jako **„10,85"**,
protože mezistav „1," číslo neunese. Pole teď drží **rozepsaný řetězec**
a model počítá z `Number(raw.replace(',', '.'))`. Ověřeno psaním:
„1,05" → 1,05 t · „0,75" → 750 kg · tečka „1.2" → „1,2" · prázdné pole
→ „—", ne nula. Sedmá regrese z mých vlastních oprav a jediná, která
byla vidět uživateli.

### Dokument (13 zásahů) — v2.6

Sekce 15 sice spory rozhodla, ale hodnoty zůstaly v textu:
lead souhrnu 960 px v 8.2 i v 10. Do p. 6, produktový pás
`minmax(0,420px) 1fr`, výchozí sazba figury na zrušeném tracku `wide`,
spec dvousloupce se třemi neplatnými hodnotami (`0.82fr 1fr`, gap 72,
`align-items: center`). Vše přepsáno na měřený stav; token
`--id-maxw-summary` smazán z 13.1 i z `tokens.css` (nula spotřebitelů);
popisek `--id-t-stat-xl` přeznačen na landing. V sekci 14 proškrtnuty
body 2, 4, 7, 13, 14, 16 a 18. ADR-006 i 8.2a nově předepisují přejímku
na **čtyřech** šířkách (1440 / ≥1920 / **1130** / 1024). ADR-007 má
u leadu skutečné číslo. 11.3 dostala vzor „jednotka přes
`aria-describedby`" a „živá oblast obepíná všechny výstupy".

### Kód

| Oblast | Zásah | Naměřeno |
|---|---|---|
| kalkulátor | desetinné pole drží řetězec | „1,05" jde napsat |
| kalkulátor | `gap` na `--id-gap-col` | 64 → **56 px**, zlom panelu sedí na stránkový |
| kalkulátor | chip bez pilulky a akcentového rámečku (3.8) | border 0, radius 0, zůstal hlas |
| kapsle | mini-CTA pod 640 px `display: none` | překryv sazby **88 % → 46 %** |
| kapsle | hit-area ikony pseudo-prvkem | 24 × 30 px bez rozšíření kapsle |
| kotvy | token `--id-anchor-offset: 124px` | jedna páka pro nadpisy i fokus |
| kotvy | `#obsah` je `tabindex="-1"` + bez prstence; globální ring vyjímá `[tabindex='-1']` | tab po skoku pokračuje v článku |
| rytmus | hlavička + první obsah = jeden uzel | **24 px** po obou hlavičkách (dřív 24 a 32) |
| rytmus | předěl kapitoly pásový vždy | jedna míra bez ohledu na předchůdce |
| rytmus | složený dvousloupec už není pás | 44 px místo pásové díry v toku |
| Obr. 07 | gradient louže na stopy 9.2 | .34 → .14 → .05 jako `zv-voda` |

**Past, na kterou se přišlo při ověřování:** pravidlo „hlavička + její
obsah = 24 px" musí v souboru stát **za** pásovým rytmem — `* + .id-split`
i `* + .id-figure--bleed` mají stejnou specificitu a rozhoduje pořadí.
Napoprvé zůstalo 115 px.

Přejímka: `layout-check` 1024 / **1130** / **1280** / 1440 / 1990 a
`svg-labels` 320 / 393 / 1440 bez nálezu, `tsc` čistý.

### Co z koše B zůstává otevřené (a proč)

Sedm bodů s nákladem „velký" — každý je nový asset nebo zásah do
struktury článku, ne hodnota v CSS:

1. **Partitura pásů** — obsidian 9,3 % proti 20–35 % z 8.1 p. 3.
   Oponent upozornil, že převod kalkulátorů na plné pásy by dal článku
   čtyři tmavé hmoty a padlo by 8.1 p. 8 („článek má jeden vnitřní
   obsidian"). Chce vlastní rozhodnutí o partituře dlouhého článku.
2. **Portrétový ořez hera** — telefon stahuje w=3840 a 80 % pixelů
   zahodí; řešením je samostatné médium 620×1344 a `<picture media>`
   (odhad 145 → ~71 kB). Pozor: ořezaný zdroj už nesmí dostat portrétový
   `object-position`, jinak se ořízne podruhé.
3. **Dva povrchy kalkulátoru** (obsidian × krém) pro tutéž roli.
4. **Sdílená figura produktového pásu** s uzlem „Osvětlení" bez opory
   v textu — řešením je prop na uzly, ale sahá i na výšku sloupců pásu.
5. **Dva jazyky kresby napříč články** — obrys hmoty ano, gradient
   v Kořenové zóně je nositel pointy a plošně převádět se nesmí.
6. **Barevný klíč kreseb** — `#54402c` nese čtyři různé významy;
   oponent doporučil dvouúrovňový klíč, ne „jeden hex = jeden význam".
7. **Skok osy prózy** uvnitř kapitoly (§15) — adversární přezkoušení
   potvrdilo, že kresba nemá v pásmu 1130–1440 ani pixel rezervy, ale
   vyvrátilo číslo u varianty (b): prázdno by nebylo > 35 %, ale **66–76 %**.

## Koš B — dokončeno všech sedm otevřených bodů (2026-09-14)

| # | Bod | Řešení | Naměřeno |
|---|---|---|---|
| 1 | partitura pásů | oba kalkulátory jako obsidianové pásy + kapitola 02 na krémovém; `.id-band--self` maluje povrch přes okno a drží obsah na osách | úsek bez posunu povrchu **16 560 → 2 317 px** (1440), **3 577 px** (393); obsidian 9,3 → **16,2 %** |
| 2 | portrétový hero | fotka si nese vlastní ořez (`portrait` v knihovně médií), `<picture>` ho podává pod 560 px | telefon **142 → 35 kB** |
| 3 | dva povrchy kalkulátoru | vyřešeno bodem 1 — oba jsou pás, role má jeden vzhled | — |
| 4 | figura produktového pásu | prop `uzly` + pole `figureVariant`; popis pro odečítač ze stejného seznamu | uzel „osvětlení" bez opory v textu pryč |
| 5 | dva jazyky kresby | kodifikován jen **obrys hmoty** (9.2 p. 9); měkký nádech jako nositel pointy se nepřevádí | kresby článku 1 uzavřeny tvarem `V…H…V` |
| 6 | barevný klíč | dvouúrovňový klíč (9.2 p. 10); pásmo „na hraně" z plné `#d5d3cc` na `#c2a052` s opacitou | — |
| 7 | skok osy prózy | **rozhodnuto ponechat** — čtyři alternativy změřeny a horší | viz níž |

### Bod 7: proč skok os zůstává

Adversární přezkoušení mého vlastního závěru našlo dvě varianty, které
předání po kole 07 vůbec nezvažovalo — a obě propadly měřením:

- **zátoky 343 | 561 px:** padl by „jediný zlom stránky 720/56" (zlomy by
  byly dva a ani jeden na 720), varianta žije až od 1395 px, zatímco
  dvousloupec začíná na 1130 — a na 1280 by popisek kresby klesl na **8 px**;
- **obrátit pořadí kapitoly:** prázdno v textovém sloupci 33–62 %, autorův
  text by se musel přepsat a padlo by čtení „teze před obrazem".

Opraveno i číslo z předání: varianta „split jen titulek + obraz" nemá
prázdno 35 %, ale **66–76 %**. Rozhodnutí i s tabulkou je v DESIGN.md §15,
poznámka u spec dvousloupce v 8.2b p. 5 — aby to příště nikdo nehledal znovu.

### Co v koši B zbývá (2 body, oba u hera a patří k sobě)

1. **`display-xl` na 320 px** láme H1 na čtyři řádky. Měřením padly obě
   cesty z §14: mez 42 px nestačí (285,8 > 280 px) a tracking by musel na
   −0,10 em. Kandidát je měkký strop 12,5vw s podlahou 40 px.
2. **Scrim končí ve 45 % výšky**, takže eyebrow a první řádek H1 leží na
   holé fotce (3,27:1 na 1990 proti limitu 3,0:1, rezerva 9 %).

Musí jít **jedním balíkem**: menší H1 se posune do světlejší části fotky
a kontrast klesne — oprava jednoho bodu bez druhého by vyrobila nález,
přesně podle vzorce, který tahle smyčka zapsala sedmkrát.

## Koš B — hotovo celý (2026-09-14)

Poslední dva body, záměrně v jednom balíku: menší titulek se posune do
světlejší části fotky, takže oprava jednoho bez druhého by vyrobila nález.

| Šířka | H1 před | H1 po | eyebrow před → po | titulek před → po |
|---|---|---|---|---|
| 320 | 48 px / **4 řádky** | 40 px / **2 řádky** | 4,19 → **4,88** | 3,86 → **5,60** |
| 360 | 48 px / 3 řádky | 45 px / 2 řádky | 4,22 → **4,87** | 3,62 → **5,48** |
| 393 | 48 px / 2 řádky | beze změny | 4,16 → **5,24** | 4,24 → 5,81 |
| 1440 | 112 px / 2 řádky | beze změny | 17,05 → 17,27 | 4,19 → **5,43** |
| 1990 | 112 px / 2 řádky | beze změny | 16,70 → 16,93 | 4,25 → **5,89** |

**Titulek:** měkký strop `12,5vw` s podlahou 40 px. Nad 384 px je nečinný
(12,5vw = 48 px právě při 384), takže desktop se nehnul. Obě cesty, které
§14 navrhovala, padly měřením: mez 42 px nestačí (285,8 > 280 px)
a tracking by musel na −0,10 em, tedy čtyřnásobek hodnoty ze 4.2.

**Scrim:** 45 → 62 % výšky s plošším průběhem (čtyři zastávky místo tří).
Eyebrow leží na ~53 % výšky, tedy nad původním koncem přechodu — proto
na holé fotce. Kontrola, že fotka nezčernala plošně: průměrný jas horní
třetiny **79/255** na 320 px a 65/255 na 1440; v horní třetině je krytí
scrimu pod 0,1.

**Tím je koš B celý zavřený** — v `DESIGN.md` §14 nezůstal ani jeden
otevřený bod. Přejímka: `layout-check` 1024/1130/1280/1440/1990,
`svg-labels` 320/393/1440, oba články HTTP 200, `tsc` čistý.

---

# Článek 3 — „Písek, biochar a další příměsi" (design-loop)

## Kolo 01 — 3 · 3 · 3 · 3 · 4 · 3 · 3, 5 kritických (2026-09-19)

Stránka: `/posts/pisek-biochar-a-dalsi-primesi` (commit `e2513ff`).
Porota = workflow 7 lenzů + skeptik ke každému kritickému nálezu;
snímky `porota-c3-01` (48×1440, 88×393, 49×1990). **Vnitřek kalkulátoru
mimo kolo** (dodělává se samostatně) — porota ho jen zaznamenala.

| Lenz | Skóre | Kritické (před → po skeptikovi) |
|---|---|---|
| hierarchie | 3/5 | 1 → 1 |
| typografie | 3/5 | 2 → 2 |
| pohyb | 3/5 | 0 |
| grafický styl | 3/5 | 0 |
| slop | **4/5** | 0 |
| výkon a přístupnost | 3/5 | 0 |
| rozložení | 3/5 | 2 → 2 |

**NEPROŠEL** — 5 kritických, skeptici žádný nevyvrátili (0 vyvráceno,
0 překlasifikováno).

### Kritické nálezy (vše potvrzeno měřením skeptika)

1. **Tabulka dávek na mobilu nečitelná** (hierarchie, koš A): 4 sloupce
   s nowrap hodnotami → min. šířka 1188 px; na 393 px je 70 % obsahu
   mimo viewport (na 320 px 76 %) a `.id-table-wrap` nemá žádnou
   afordanci rolování. Souvisí důležitý koš B: afordance přetečení
   chybí všem 8 tabulkám (na 320 px klipuje 22–27 % u všech).
2. **Hero H1 končí řádek spojkou „a"** (typografie, koš B): PostHero
   `splitLines(headline, 16)` láme bez ohledu na jednopísmenné
   předložky/spojky — na 393, 1440 i 1990.
3. **Poznámka pod tabulkou 105 znaků/řádek** (typografie, koš B):
   `.id-table__note` běží na plných 700 px při 13,5 px — chybí míra
   33 em dle ADR-007 §3.
4. **Partitura povrchů mlčí 27 043 px** (rozložení, koš A): mezi koncem
   kalkulátorového pásu a produktovým pásem není jediný posun povrchu
   (limit 8.1 p. 3 = 6 000 px; na 393 px úsek 37 068 px). Full-bleed
   fotka posun povrchu nedělá.
5. **Split kap. 07 ze 70 % prázdný** (rozložení, koš A): 189 px textu
   vedle 641 px kresby — do splitu patří další odstavce podkapitoly,
   nebo jiná sazba.

### Důležité (výběr)

- hustota obrazové hmoty: díry 4 667 px (kap. 01), 4 011 px (kap. 04),
  3 481 px (kap. 05→06) proti cíli ADR-006 ~1/1 300–1 600 px (koš A)
- textové sloupce splitů kap. 02/03/04 z 36–42 % prázdné (koš A)
- `dz-kapka` v Obr. 01 nemá keyframes — jediná zamýšlená smyčka kresby
  se nikdy nespustí (pohyb, koš A; chyba autora kresby)
- Obr. 02: pointa „5 m³" hexem `#f4f1ea` mimo tokeny; popisky kresby ve
  splitu na 393 px 9,5 px < floor 10 px (koš B: práh `svg-labels.mjs`
  je pod normou 9.2 p. 3 a vadu nechytí)
- TriZony: značky legendy o 20–54 % větší než v kresbě (9.2 p. 10)
- hero fotka: generativní artefakt na koncovce rukojeti kolečka
  (2 lenzy nezávisle; viditelný až od ~3× zvětšení → retuš)
- full-bleed `sizes="295vw"` → telefon stahuje w=3840 (358 kB) místo
  ~w=1920; hero `<img>` má `loading="lazy"` + `fetchpriority="high"`
  (drží ho jen ruční preload)
- kresby: 0/7 `<figure>` s `role="img"` + `aria-label` (DESIGN §9, 11.3)
- czechTypography nezná jednotky „t" / „t/m³" → 47 z 298 párů
  číslo–jednotka bez NBSP (koš B)
- 2× ASCII uvozovka v FAQ; en vs. em pomlčka (CTA/feature vs. próza)

### Koš B nasbíraný v kole 01

afordance přetečení tabulek (DS), splitLines bez předložek (PostHero),
míra `.id-table__note`, jednotky t/t/m³ v czechTypography, mobilní
škálování popisků kreseb ve splitu + práh svg-labels pod normou,
DESIGN 6.3.1 stále předepisuje autoAlpha (stránky se správně odchylují),
6.6.3 march (10 8/18 vs. norma 3 9/−12), krémový pás-split = druhá osa
ve složeném jednosloupci (i u sourozence), skip-link nekodifikován,
šablona 8.2 pořád říká 3–5 kapitol, mobilní interpretace akcentového
rozpočtu (CTA obrazovka 5,04 %).

### Mimo kolo (kalkulátor — k samostatnému dodělání)

mrtvá `data-rv-group` bez `.rv` dětí (pás nastupuje bez revealu);
verdikt uvnitř pásu weight 400 vs. 500 (7.8).

## Balík „tabulky" (po kole 01) — kritické č. 1 a č. 3 + koš B afordance

Jeden celek v bloku `table` (2026-09-19):

1. **Řádkový zápis pod 560 px** (kritický č. 1): sloupcové srovnání se
   pod 560 px nevešlo ani u tří sloupců, tabulka dávek měla 70 % obsahu
   mimo viewport. Buňky nesou hlavičku svého sloupce v `data-label`,
   CSS pod 560 px skládá řádek pod sebe (položka = titulek skupiny,
   hodnoty s uppercase návěstím z `::before`); `thead` mizí i pro
   odečítač, jinak by hlavičky zněly dvakrát. Dlouhé hodnoty běží zleva
   (prapor zprava vypadal rozsypaně), krátké drží vpravo space-between.
   **Po opravě: 0/8 tabulek roluje na 393 i 320, stránka nepřetéká.**
2. **Afordance přetečení** (koš B): měkký stín na hraně, za kterou obsah
   pokračuje (radial 20 px / 0,20, krytý pruhy povrchu přes
   `background-attachment: local` — na kraji rolování mizí). Platí pro
   560–1129 px, kde edge tabulka ještě přetéká.
3. **Míra poznámky** (kritický č. 3): `.id-table__note` max-width
   `var(--id-measure)` (33 em = 446 px při 13,5 px).
   **105 → max 71 znaků na řádek.**
4. **Podmíněný tabindex** (koš B, výkon): wrap je nový klientský
   `TableWrap` — `tabIndex` + `role="region"` + `aria-label` dostane
   jen když skutečně přetéká. **1440: 0 tab stopů (bylo 8); 800: přesně
   1 s pojmenovaným regionem.**

Přejímka po balíku: layout-check 1024/1130/1280/1440/1990 OK,
svg-labels 320/393/1440 = 7/7 kreseb OK, přetečení stránky 320/393
false, tsc čistý.

## Balík „dlouhé sloupce" (po kole 01) — kritický č. 4 + hustota hmot

Partitura povrchů a obrazová hmota druhé půlky článku (2026-09-19):

**Povrchy (kritický č. 4).** Nejdelší úsek bez posunu povrchu:
**27 165 → 4 452 px na 1440** a **37 862 → 5 456 px na 393** (limit
8.1 p. 3 = 6 000; sourozenec má na 393 dnes 6 863). Gramatika: krémové
splity (nabíjení biocharu, kap. 04, jíl, slehnutí, kap. 06, kap. 07)
+ **přehledové tabulky jako krémové pásy** (zóny, tři modely, obě
varianty — `table.surface: krem`, nové v DS, zapsáno do 8.1 p. 5 jako
v2.8); dávková a referenční hustotní tabulka zůstávají bílé v próze.
Obsidiany beze změny (kalkulátor + produktový pás). Pásová tabulka
nese data-rv-group s .rv dětmi (žádná mrtvá skupina) a stínová
afordance kryje krém přes --id-table-surface.

**Hmoty (důležité nálezy hierarchie + rozložení).** Čtyři nové kresby
ve splitech s h3 (16 → 20 hmot):
- Obr. 02 „Nabitý vs. nenabitý biochar" (nabity-biochar) — díra
  4 667 px v kap. 01 → 2 658 px
- Obr. 03 „Mykorhizní vlákna" (mykorhizni-vlakna, řez půdou
  s oříznutými kružnicemi dosahu) — táž díra, druhá půlka kap. 01
- Obr. 07 „Minerální základ tří zahrad" (zaklad-tri-zahrad, 65/35 ·
  30/70 · bez nákupu) — díra 4 011 px v próze zahrad → pryč
- Obr. 08 „Slehnutí: méně než součet" (slehnuti-vstupu) — poslední
  úsek 7 481→4 452 na 1440 a hmota do výkladu kap. 05
Autorův text beze změny — splity nesou existující odstavce podkapitol
(vzor kap. 06/07). Přečíslování Obr. 01–11 (foto 09). Strany splitů
R L R L R L R L R L (sudý počet nových → kap. 06/07 na původních
stranách).

**Zbytková rezidua (vědomě):** díra 3 644 px na 1440 (balení + hnojivo
+ otevření kap. 06 — bez vynálezu dalšího obsahu nejde zaplnit)
a mobilní díra 5 445 px (próza hlinité a písčité zahrady); průměr hmot
1/2 153 px proti cíli ADR-006 1/1 300–1 600.

Přejímka po balíku: layout-check 5 šířek (10 splitů R L…), svg-labels
320/393/1440 vč. 4 nových kreseb (0 kolizí, 0 ořezů — po opravě kolize
„dosah kořene" a ořezu popisku slehnutí), přetečení stránky false,
tsc čistý. Mykorhiza překreslena do řezu půdou — #d8c9b4 kořen na
krémovém panelu nebyl vidět (tentýž vztah barva ↔ podklad jako
metařádek hera u článku 2).

## Dodatek balíku „dlouhé sloupce" — sekce písku (připomínka autora)

Autor: pasáž písek → Biovin → biochar je pořád moc dlouhý sloupec.
Sekce „Písek a zemina: o výsledku rozhodují i mezery" dostala split
s novou kresbou **Obr. 02 „Praný vs. nepraný písek"** (prany-pisek) —
kresba nese přímo tezi titulku: prach a jíl ucpou mezery (kapka stojí),
praný je nechá volné (kapka projde, vzduch se vrátí). Tělo splitu =
první čtyři odstavce sekce; „Proč křemičitý?", poznámka k nákupu
a odstavec o zemině pokračují prózou.

Jeden vložený split překlopil paritu stran: všech 9 splitů za pískem
se zrcadlově otočilo (R L × 11 drží na všech šířkách). Obr.
přečíslovány na 01–12 (foto 10). Mobilní díra kap. 01 4 074 → 3 563 px,
hmot 21. Tři nové ořezy popisků na 320 opraveny lámáním řádků
(pravý sloupec kreseb unese ~14 znaků, ne 20 — potřetí totéž poučení);
kolize šipky s popiskem vyřešena posunem šipky, ne textu k legendě.
Přejímka: svg-labels 12/12 na 320/393/1440, layout-check 3 šířky,
partitura beze změny (max 4 452 / 5 851 px), přetečení false, tsc.

## Karta složek (návrh autora, 2026-09-19)

Autor: „Biovin, biochar, zeolit a mykorhiza patří k sobě — mohl by to
být blok s textem a obrázky těch složek." Nový blok **`ingredients`**
(Karta složek): krémový pás se čtyřmi kartami — fotka materiálu
(macro na stejném prkně, jednotná série z nano_banana_pro, čtverce
1200 px AVIF) + jméno + role 1–2 věty + „kam patří" (zóna · podíl,
čísla z receptur článku). Stojí za sekcí písku jako vizuální
rozcestník; autorovy podrobné sekce zůstávají pod ním beze změny.
Texty karet jsou redakční zkratky (kandidát na copy-polish).

Pás nese posun povrchu — první verze na bílé natáhla úsek kapitoly 01
na 393 px na 6 769 px (přes limit); jako krémový pás úsek srovnal
zpět (**4 453 px @1440, 5 456 px @393**). DESIGN 8.1 p. 5 rozšířeno:
přehledový modul jako krémový pás = tabulka i karta složek (v2.8).
Fotky: hairline žádný, radius 20 px (9.1), lazy + sizes 25vw/50vw.
Přejímka: layout-check 3 šířky, svg-labels 12/12 @393, přetečení
false, tsc čistý.


## Karta složek v2 — vlastnosti po najetí (návrh autora)

Autor: text nemá stát pod obrázkovým pásmem, ale zobrazit se po najetí
myší nad fotku. Karta = fotka + jméno (stále viditelné); vlastnosti
a „kam patří" se vysunou přes fotku scrimem (9.1) po :hover
**i :focus-within** — obsah schovaný jen za hover by nebyl přístupný
z klávesnice (kritérium rubriky výkon). `IngredientCard` (klient) dává
kartám tabIndex + role="group" + jméno JEN na zařízení s myší
(matchMedia hover, vzor TableWrap). Na dotykovém zařízení a ≤ 560 px
zůstává text staticky: pořadí fotka → jméno → text → poznámka drží
`display: contents` na rámu. Přechod jen opacity 0,28 s; pod
prefers-reduced-motion vypnutý. Text je v DOM vždy — odečítač ho čte
bez interakce. Ověřeno: hover ✓, fokus s prstencem ✓ (4 tab stopy
na 1440, 0 na dotyku), mobil statický ✓, přetečení false, tsc.


## Karta složek v3 — plné sekce po najetí (upřesnění autora)

Autor upřesnil: krátký text pod fotkou zůstává, po najetí se má otevřít
PLNÁ sekce složky (dlouhý úzký sloupec zmizí z toku článku). Karta
složek je teď přepínač (WAI tabs): karty = fotka + jméno + role +
„kam patří" (beze změny); výběr — hover, klepnutí, fokus, šipky
←→/Home/End — otevře pod kartami panel s celou autorovou sekcí
(items[].detail = richText, Biovin vč. odkazu na výrobce; mykorhiza
nese v panelu i kresbu mykorhizni-vlakna). Z toku článku odešly čtyři
sekce (Biovin 3¶, biochar 3¶, zeolit 4¶, mykorhiza split) — článek
41 887 px na 1440 (bylo 43 182). Split nabíjení biocharu zůstal v toku
(praktická podkapitola nákupu) a vrátil se na bílou — krém hned za
krémovou kartou by slil dva pásy.

Technika: panely všechny v téže mřížkové buňce (výška = nejvyšší,
přepínání nehýbe stránkou), neaktivní inert + aria-hidden, text vždy
v DOM (vyhledávače, kopírování); klouzavý tabIndex; přechod jen
opacity, reduced-motion bez přechodu. Ukazatel výběru = akcentová
čárka 22×2 pod jménem (jazyk eyebrow). Odebrání mykorhiza splitu
překlopilo paritu: 7 splitů zrcadlově, R L ×10; Obr. přečíslovány
01–11. Přejímky: svg-labels 11/11 ×3 šířky, layout-check ×3,
partitura 4 452/5 456 px, přetečení false, tsc.


## Karta složek v3.1 — fotky v panelech + závoj neaktivních (autor)

1. Vedle textu každého panelu obraz: Biovin/biochar/zeolit dostaly
   nové fotky „materiál v půdě" (panel-*.avif, táž série světla;
   jiný záběr než karty — na prkně vs. v půdě), mykorhiza si drží
   kresbu dosahu. Panel mřížka text + 420 px obraz.
2. Znevýraznění ostatních karet při hoveru/fokusu: bílý závoj
   rgba(255,255,255,.58) + blur(4px) + saturate(.85) + popisky na
   0.48, přechod 0.32 s (filter/opacity; scale 1.03 schová průsvitný
   okraj rozmazání pod ořez). Přes :has() na mřížce, jen
   (hover: hover); fokus z klávesnice znevýrazňuje stejně;
   reduced-motion bez přechodů. Na dotyku „kde jsem" dál nese
   akcentová čárka + panel.
Přejímka: layout-check 1440 OK, svg-labels 393 11/11, přetečení
320/393 false, tsc čistý.


## Karta složek v3.2 — mobilní akordeon se zavřeným výchozím stavem

Podle slovního návrhu schváleného autorem: na dotyku / ≤ 560 px se
panel otevírá HNED POD ŘÁDKEM klepnuté karty (karty i sloty panelů
v jedné mřížce, akordeonový režim je řadí CSS pořadím; zavřené sloty
display:none — Google indexuje obsah akordeonů plnohodnotně).
Výchozí stav ZAVŘENO (mobilní kapitola −1,1 k px, 393: 54 993 px);
klepnutí na otevřenou kartu zavírá, afordance = šipka u jména
(rotace 180° po otevření, na desktopu skrytá). „Kde jsem" na dotyku:
akcentová čárka + ztlumené popisky ostatních (žádný blur — závoj
zůstává hoverovým jazykem). Výška bez animace (vzor FAQ), obsah
panelu fade-in 0,22 s, reduced-motion nic.

Desktop beze změny (Biovin otevřený, hover přepíná, závoj+blur,
společná buňka panelů). Bez skoku při načtení na obou: server rendruje
otevřený Biovin + třídu `netknuto`, kterou mobilní CSS drží zavřeno
do první interakce. Sémantika sjednocena na rozbalovací karty
(role button + aria-expanded + region; tablist s vloženými panely
by nebyl validní) — Enter/mezerník, fokus otevírá jen v hover režimu.
Přejímka: layout-check 1440, svg-labels 320/393 bez chyb, partitura
4 452 / 5 456 px, přetečení false, tsc.


## Karta složek v3.3 — mobil: karty pohromadě, text pod mřížkou

Autor po zhlédnutí v3.2: lepší, když čtyři obrázky drží pohromadě
a text se objevuje pod nimi. Odebráno řazení panelů pod řádky (CSS
order pryč — sloty jedou v DOM pořadí za kartami, tedy pod celou
mřížkou 2×2). Zbytek akordeonu beze změny: zavřený výchozí stav,
toggle, šipky, ztlumení popisků, fade-in, bez CLS. Ověřeno: panel
pod poslední kartou, přetečení false, layout-check 1440 OK, tsc.


## Karta složek v3.4 — dorolování k otevřenému panelu (autor)

Autor: po tapnutí se text zobrazil mimo zobrazovací plochu — uživateli
musí být celou dobu jasné, co se děje. Po otevření na dotyku stránka
plynule doroluje k panelu (scrollIntoView smooth, cíl = titulek sekce
pod plovoucí hlavičkou přes scroll-margin-top = anchor-offset + 4);
pohyb sám nese kauzalitu „klepnutí → tohle se otevřelo". Při zavření
a přepínání na desktopu se neroluje; prefers-reduced-motion = skok
bez animace. Ověřeno: panel top 128 px po tapu, zavření bez posunu.


## Karta složek v3.5 — panel NAD mřížkou, dorolování nahoru (autor)

Autor: text se má objevit nad čtyřmi obrázky a autoscroll jet nahoru,
aby měl čtenář při scrolování dolů vždy pokračování. Na dotyku slot
panelu order: -1 (nad mřížku, hairline i pod panelem před kartami);
scrollIntoView beze změny kódu jede přirozeně nahoru. Tok čtení:
tap na kartu → nahoru k titulku sekce → čtení dolů → karty (vybraná
s čárkou a otočenou šipkou) → zbytek článku. Ověřeno: scrollY 5852→5593
(nahoru), titulek pod hlavičkou, panel nad kartami, přetečení false.
Desktop beze změny.


## Karta složek v3.6 — vybraná složka první v čtveřici (autor)

Na dotyku se aktuálně vybraná karta řadí v mřížce 2×2 na první pozici
(vlevo nahoře): CSS order 0 vs. 1 pro ostatní — čistě vizuální pořadí,
DOM, fokus i čtecí pořadí beze změny. Po dočtení sekce nad mřížkou tak
čtenář scrolluje dolů a první karta potvrzuje, kde je; zbylé tři
následují jako nabídka „kam dál". Po zavření se pořadí vrací. Desktop
záměrně bez řazení — vybírá hover a karty by uskakovaly zpod kurzoru.
Ověřeno: tap na Mykorhizu → vlevo nahoře, panel Mykorhiza.


## Karta složek v3.7 — závoj na vybrané kartě (autor)

Na dotyku dostává fotka AKTUÁLNĚ VYBRANÉ karty jemný bílý závoj
(0,75 × 0,58 ≈ 43 % bílé) a lehké rozmazání blur(2px) saturate(.9)
— její obsah už čtenář má otevřený nad mřížkou, karta je „spotřebovaná";
ostatní tři zůstávají ostré jako další volby. Popisek vybrané s čárkou
a šipkou drží plný kontrast (kotva). Ztlumení popisků ostatních
odebráno — dva protichůdné signály najednou by mátly. Přechody 0,32 s
(transition obrázku přesunut z hover media do základu), reduced-motion
beze změny animací. Srovnání s desktopem: tam hover znevýrazňuje
OSTATNÍ (výběr letmý), na dotyku ustupuje VYBRANÁ (výběr trvá) —
dva režimy, jedna logika „ukaž, co je teď důležité".


## Kolo 02 — 3 · 3 · 3 · 3 · 3 · 4 · 3, 3 kritické (2026-09-19)

Stránka po balících „tabulky", „dlouhé sloupce" a kartě složek v3.7
(commit 64b8ced). Snímky porota-c3-02 (52/93/53). Kalkulátor mimo kolo.

| Lenz | Kolo 01 | Kolo 02 | Kritické |
|---|---|---|---|
| hierarchie | 3 (1 krit) | 3 (0) | — |
| typografie | 3 (2 krit) | 3 (1) | hero H1 „a" (trvá z k. 01) |
| pohyb | 3 | 3 (0) | — |
| styl | 3 | 3 (0) | — |
| slop | 4 | **3 (1)** | hero fotka = AI artefakt |
| výkon | 3 | **4 (0)** | — |
| rozložení | 3 (2 krit) | 3 (1) | prázdné sloupce splitů |

**NEPROŠEL** — 3 kritické (bylo 5), skeptici všechny potvrdili.

### Kritické
1. **Hero H1 láme na spojce „a"** (typografie, A) — trvá z kola 01,
   PostHero splitLines; zlom patří „Písek, biochar / a další příměsi".
2. **Hero fotografie s AI artefaktem** (slop, A) — kolečko má 3 úchopy
   na jedné viditelné rukojeti + rozteklou etiketu; kolo 01 to mělo
   jako důležité (retuš), skeptik kola 02 potvrdil v masteru
   i renderu. Souvisí: full-bleed dodávka (paleta se dvěma výškami
   desky, pytle bez potisku) = důležitý.
3. **Prázdné textové sloupce dvousloupců** (rozložení, A) — 5 z 10
   splitů s pokrytím 35–68 % (nejhůř kap. 07: 224 px textu vs 641 px
   kresby, 417 px prázdna > spouštěcí případ ADR-006).

### Důležité (výběr, seskupeno)
- **Kresby — mobil a kontrast:** popisky 6 kreseb 9,5 px @393 /
  8,9 px @320 (pod mezí 10,2; svg-labels práh pod normou — koš B);
  kresba mykorhizy v panelu složek 8,1 px @393; kořen #d8c9b4
  v NabityBiochar na krému 1,49:1 (TÁŽ vada, kterou jsem u mykorhizy
  už opravil podkladem ornice — nepřenesl jsem poučení do sesterské
  kresby); legendy 4 kreseb nejsou pixelově shodné se vzory;
  Obr. 10 bez legendy v panelu.
- **Uppercase deformuje SI jednotky:** „0,67 M³" v Obr. 04 a „NA 50 M²"
  v tabulkách (M = mega!); pravidlo uppercase labelů potřebuje výjimku
  pro jednotky (koš B).
- **Číslování figur:** Obr. 09 (foto) stojí v toku PŘED Obr. 08 — moje
  chyba při přečíslování (foto mělo být 08, slehnutí 09).
- **Pohyb — mrtvé skupiny:** dz-kapka stále bez keyframes (trvá);
  kalkulátorový pás bez jediného vstupu; tabulkové pásy mají .rv
  o úroveň hlouběji než skupinu (stagger se nevytvoří — má oprava
  z balíku tabulek byla neúčinná!); mřížka karet složek bez staggeru.
- **Výkon:** fig-dodavka 358 kB na mobilu (sizes 295vw → chybí
  portrétová source varianta po vzoru hera); skip-link (koš B);
  hero loading=lazy křehké.
- **Typografie:** 43 párů číslo+„t"/„t/m³" bez NBSP (czechTypography
  nezná — koš B, trvá); 2× ASCII uvozovka (trvá); h3 tři stupně
  28/22/17 px v jedné úrovni; typografie nových bloků (ingredients,
  table) není v DESIGN (koš B); en vs. em pomlčka (trvá).
- **Rozložení:** tabulka dávek roluje i 561–1267 px (přeskládat dřív);
  próza 3 860 px (ocas kap. 5 + otvírák kap. 6) a 3 555 px (hlína +
  písek) bez hmoty — známá rezidua; pásy dvou šířek na 1990
  (split-pásy w1360 vs. tabulkové w1990 — koš B, i sourozenec);
  gap mřížky složek 36 px mimo tokeny (koš B).
- **Slop:** 5 tabulkových pásů na mobilu = ~9 000 px stohovaných
  řádků NA 50/100 M²; FAQ eyebrow pleonasmus; desktopový výchozí
  stav karty složek bez závoje na nevybraných do prvního hoveru;
  hint „najetím či klepnutím" i na dotyku.

### Pokrok proti kolu 01
Zavřeno: mobilní tabulky (0 rolujících), partitura (27 165→4 452 px),
poznámky tabulek (105→71 zn.), hustota hmot v kap. 01/04, výkon 3→4
(CLS 0,000, kontrasty AA+, karta složek a11y vzorná). Nově otevřeno:
AI artefakty fotek povýšeny na kritické, kresby pod mobilní mezí,
mrtvé reveal skupiny.


## Balík „hero splitLines" (po kole 02) — kritický č. 1

`splitLines` v PostHero dělila titulek jen podle znakového limitu bez
ohledu na jednopísmenné předložky/spojky — hero H1 „Písek, biochar a"
/ „další příměsi" nechával „a" osamocené na konci prvního řádku na
všech šířkách (potvrzeno skeptikem kola 01 i 02, DESIGN 4.3 + stejná
sada jako czechTypography.ts PREDLOZKY). Zlom mezi řádky je tu pevný
(každý řádek = vlastní maska a stagger animace), takže NBSP jako
v běžném textu nepomůže — po greedy rozdělení běží druhý průchod:
jednopísmenné slovo na konci řádku (kromě posledního) se přesune na
začátek dalšího řádku. Výsledek: **„Písek, biochar" / „a další
příměsi"**. Ověřeno na 393/1440/1990 (článek 3) i na sourozeneckém
článku 2 („Krásný trávník" / „začíná pod zemí" — beze změny, žádná
předložka na konci řádku).


## Balík „fotky" (po kole 02) — kritický č. 2 + důležité výkonu

Hero (`hero-primesi.avif`) a full-bleed dodávka (`fig-dodavka-materialu.avif`)
nahrazeny novou generací u obou zdrojů zjednodušená kompozice, ať má
generátor menší šanci na fyzikální chybu: hero jen tři hromady +
JEDEN rýč s D-rukojetí (žádné kolečko — přesně ten kus, který nesl
AI artefakt), dodávka = dvě hromady na plachtě + stoh papírových
pytlů na trávě (žádná paleta — nesla druhou vadu). Obě fotky prověřeny
v masteru 6336 px před nasazením (rukojeť rýče, sešití pytlů) — bez
nálezu. Portrétový ořez hera přepočítán na novou kompozici (x=2100,
zabírá písek+zeminu i konec rýče).

**Full-bleed dodávka dostala portrétový ořez poprvé** (dosud ho měl
jen hero) — týž mechanismus `resource.portrait` + `<source media>`
v `ImageMedia`, teď zapojený i do `FigureBlock` (žádná změna kódu,
jen nový `portret` v MEDIA a `focalPortraitX/Y`). Řeší důležitý nález
výkonu: **358 → 67 kB na mobilu** (dpr 3, box 393×491) — místo
21:9 masteru s `sizes 295vw` (fetch w=3840, i neviditelné okraje
v plném rozlišení) se stahuje předem oříznutý 4:5 zdroj.

Staré médium smazáno až po ověření, že nový soubor leží na disku pod
týmž jménem (pravidlo z incidentu s hero článku 1). Alt texty
aktualizovány (bez kolečka/palety). Přejímka: layout-check 1440,
svg-labels 393 11/11, přetečení 320/393 false, tsc čistý, hero H1
zlom „Písek, biochar / a další příměsi" beze změny.


## Balík „splity + hmoty" (po kole 02) — kritický č. 3

Dorovnány textové sloupce nejhorších dvousloupců přesunem PŘÍMO
NAVAZUJÍCÍHO odstavce z prózy do těla splitu — beze změny pořadí
čtení (odstavec stál hned pod splitem, teď je jeho druhým odstavcem)
a beze změny jediného slova autora.

| Split | Pokrytí před | Po | Prázdno před → po |
|---|---|---|---|
| „První kořínek" (Obr. 11) | **35 %** | 55 % | 417 → 287 px |
| „Třicet centimetrů půdy" (Obr. 05) | 61 % | **82 %** | 242 → 112 px |
| „Tři zahrady" (Obr. 06) | 58 % | **73 %** | 284 → 182 px |

Dva ze dvou odstavců, které bylo potřeba vtáhnout, nesly odkaz na
sesterský článek — `SplitBlock.body` je ale prostý řetězec bez
Lexical uzlů (žádné odkazy). Přepsat autorovu větu bez odkazu by
změnilo obsah; místo toho `renderStrong` v `SplitBlock` rozšířen
o minimální markdown `[text](url)` (vedle stávajícího `**tučně**"),
interní cesty (začínají „/") bez `target="_blank"`, externí s ním.
Odkazy ověřeny živě (2× „Krásný trávník začíná pod zemí", správné
href, interní bez blank).

**Kap. 01 (68 %) a kap. 02 „Proč směs mícháme" (64 %) ponechány beze
změny** — jediný navazující text stojí buď za h3 mezititulkem (přesun
by odtrhl nadpis od jeho vlastního úvodu), nebo je to úvod celého
článku (přesun by rozbil pořadí autorova vyprávění 1-2-3-4, viz
komentář v seederu). Obě zůstávají pod 250 px prázdna — pod
historickým spouštěcím případem ADR-006 (350 px) — a nejsou to
kritické nálezy samy o sobě, jen součást souhrnného nálezu.

Přejímka: layout-check 1440, svg-labels 393 11/11, přetečení 320/393
false, partitura beze změny (4 452 / 5 456 px), tsc čistý.


## Balík „sběrný kreseb" (po kole 02) — devět nálezů grafického stylu a pohybu

Devět dílčích oprav z kola 02, seskupených do jednoho balíku podle
společné kategorie (kresby, tabulky, karty).

**Kořenová příčina mobilní mezery (klíčový nález):** krémové splity
(`surface: krem`) měly DVOJITÉ zúžení — vlastní pravidlo `.id-split`
je drží na `grid-column: edge` (1360 px), ale `.id-band--self` NA TOP
toho přidávalo vlastní `padding-inline` počítaný, jako by span
`grid-column: full` (celý viewport) — takže se odečetlo dalších 80 px,
kresba dostala jen 329 px místo 369, a popisky spadly na 9,5 px @393.
STEJNÁ vada bránila krémovým splitům malovat pozadí přes celý viewport
na širokém okně (kolo 02, styl: „315 px bílé po stranách na 1990").
Oprava: `.id-article > .id-split.id-band--self { grid-column: full; }`
(specificita 3 tříd vyhraje nad `.id-split`ovým `edge` bez ohledu na
pořadí v souboru) — padding-inline teď počítá ze SKUTEČNÉHO viewportu,
takže vnitřní obsah vychází na stejných 1360 px jako nekrémové splity
a pozadí sahá od hrany k hraně. Opravilo najednou DVA nálezy různých
lenzů: popisky kreseb 9,5→10,6 px @393 na všech šesti postižených
kresbách a krémový bleed na širokém okně.

**Chybějící `id-figure-svg` v panelu karty složek:** kresba mykorhizy
v panelu neměla obalovou třídu, která nese mobilní škálování (9.2 p. 3)
— spadla na základní 12px bez ohledu na šířku. Doplněno; reálně
otevřený panel teď měří 11 px na 320 i 393 (svg-labels.mjs měří
zavřený/display:none stav skriptem bez interakce a hlásí zavádějící
degenerované číslo — známé omezení nástroje pro interaktivní obsah,
ne skutečná vada; ověřeno ručně v otevřeném stavu).

**Mrtvé reveal skupiny (6.3.2):** `.rv` děti musí být PŘÍMÉ (`:scope
> .rv`), ne o úroveň hlouběji.
- Tabulkové pásy: `data-rv-group` byl na vnějším `.id-band` kořeni,
  ale h3/wrap/poznámka byly vnořené v `.id-table-band__inner` —
  skupina měla 0 přímých `.rv`. Přesunuto na vnitřní wrapper.
- Karta složek: `.id-ingredients__grid` (přímý rodič 4 karet) neměla
  `data-rv-group` vůbec — karty spadly na fallback jednotlivého
  odhalení se stejným triggerem (unisono místo staggeru). Doplněno.

**Ostatní:**
- Obr. 08/09 prohozené pořadí (moje chyba z přečíslování) — foto
  dodávky je teď 08 (nastupuje první), split slehnutí 09.
- `M³`/`M²` z uppercase sazby: `.sv-lbl` i `.id-table thead th` verzálkují
  fyzikálně (M = mega). TunaNeniKubik: popisky pruhů → `sv-val` (bez
  uppercase, jak má hodnota s jednotkou být). Tabulky: nový
  `bezVelkychJednotek()` v `TableBlock` obalí `m²`/`m³` spanem
  `text-transform: none` uvnitř jinak uppercase hlavičky.
- `#f4f1ea` (hex mimo tokeny) → `var(--id-ink-dark)` na pointě Obr. 04.
- Kořen `#d8c9b4` v NabityBiochar byl na krému 1,49:1 — TÁŽ vada, kterou
  MykorhizniVlakna už řešila podkladem; přidána malá záhonová plocha
  s obrysem hmoty (9.2 p. 9) v hlavní scéně i legendě → 4,52:1. Živiny
  `#54402c` v pórech na `#12161b` (1,86:1) dostaly tenký světlý lem
  (fill beze změny, jen hranice čitelná).
- Legendy pixelově sjednoceny se vzory (9.2 p. 10): TriZony biochar/
  Biovin/zeolit, PranyPisek zrno (r 10→16, uvnitř rozsahu scény 14–17),
  kapka vody v DveZahrady/TriZony/PrvniKorinek (A5→A7, shodně se
  scénou ve všech třech).
- Obr. 10 (UkladaniOdspodu) dostala legendu se stejnými značkami jako
  vzory v patternech — dřív žádnou neměla.
- Obr. 11 (PrvniKorinek): otevřený obrys hmoty uzavřen (`Z` — u tohoto
  řezu horní hranu nenese drn, takže obrys nesmí chybět, na rozdíl od
  kreseb s drnem, kde otevřený obrys je záměr).
- `dz-kapka` (Obr. 01): deklarovaná třída konečně dostala keyframes
  (padající kapka jílovitou zahradou, vzor `tz-kapka`, 5 s).

Přejímka: layout-check 5 šířek (R L ×10 drží), svg-labels 320/393/1440
(0 kolizí, 0 ořezů na všech viditelných kresbách), partitura beze
změny, přetečení 320/393 false, tsc čistý.


## Kolo 03 — 4 · 3 · 4 · 4 · 4 · 4 · 2, jeden kritický (2026-09-19)

Zadání výslovně žádalo neověřovat moje tvrzení o kole 02, ale měřit
živě znovu jako první kolo. Snímky porota-c3-03 (52/91/51).

| Lenz | Kolo 02 → 03 | Kritické |
|---|---|---|
| hierarchie | 3 → **4** | 0 |
| typografie | 3 → 3 | 0 |
| pohyb | 3 → **4** | 0 |
| styl | 3 → **4** | 0 |
| slop | 3 → **4** | 0 |
| výkon | 4 → 4 | 0 |
| rozložení | 3 → **2** | 6 → **1** (skeptik: 3 vyvráceno, 2 překlas.) |

**NEPROŠEL** — rozložení jediné táhne skóre dolů. Šest „kritických"
nálezů prošlo skeptikem s different výsledkem u každého:

- **3 vyvráceno** (porotce měřil špatnou metodikou — tělo BEZ hlavičky
  proti CELÉMU panelu): tvrzení o „composed pásmu 561–1129" (panel na
  ose prózy je DESIGN.md 8.2b výslovně žádaný stav, ne vada), a moje
  balík-3 opravy „Třicet centimetrů" (73 %) a „Tři zahrady" (82 %) —
  OBĚ potvrzeny jako v pořádku, číslo 46 %/53 % bylo chybně spočítané.
- **2 překlasifikováno** kritický → důležitý: „První kořínek" (skutečné
  pokrytí 50 % ne 62 %, ale i tak HŮŘ než LOOP_LOG tvrdil — 322 px
  prázdna, ne 287) a „Z čeho půdu skládáme" (68 %/216 px, beze změny
  od kola 01 — vědomé reziduum z balíku 3).
- **1 zůstal kritický**: „Proč směs mícháme podle objemu" (64 %,
  244 px) — přesně ten split, který jsem v balíku 3 vědomě nechal
  být kvůli h3 za ním.

### Oprava (stejná relace, hned po kole)

Všechny tři splity dorovnány — u dvou šlo o obsah, který jsem v balíku
3 záměrně nechal kvůli h3/pořadí odstavců, teď vyřešeno beze změny
pořadí čtení:

| Split | Před kolem 03 | Po opravě |
|---|---|---|
| „Z čeho půdu skládáme" (i=0) | 68 % / 216 px | **91 % / 58 px** |
| „Proč směs mícháme" (i=3, KRITICKÝ) | 64 % / 244 px | **87 % / 86 px** |
| „První kořínek" (i=9) | 50 % / 322 px | **66 % / 219 px** |

- **i=0**: první odstavec úvodu („Představme si dvě sousední
  zahrady…") se přesunul DO splitu jako jeho nový první odstavec —
  scénu ze sousedních zahrad teď otevírá přímo u kresby, kterou
  ilustruje. Samostatný úvod před Kapitolou 01 zůstává jediný odstavec
  (plán článku).
- **i=3**: první odstavec za h3 („Při těchto předpokladech zabere
  tuna písku…", bez odkazu) se přesunul DO splitu; h3 teď uvádí zbylé
  odstavce („Tyto hodnoty slouží k vysvětlení principu…").
- **i=9**: poslední zbylý odstavec (s odkazem na Principy závlahy
  trávníků) se vtáhl pomocí markdown syntaxe z balíku 3.

**Poučení o vedlejším efektu:** balík-4 oprava `grid-column: full` pro
krémové splity (spravila mobilní mez popisků a krémový bleed) VEDLEJŠÍ
efektem rozšířila textový sloupec z ~1280 na 1360 px — u „Prvního
kořínku" to zkrátilo počet řádků, takže pokrytí kleslo z 55 % (balík 3)
na 50 % (živě v kole 03), aniž bych se textu dotkl. Přejímka po
opravě: layout-check 5 šířek (R L ×10), svg-labels 320/393/1440
(12/12 OK), přetečení false, partitura beze změny.


## Kolo 04 — 4 · 4 · 4 · 3 · 5 · 3 · 4, dva kritické (2026-09-20)

Zadání znovu žádalo neověřovat kolo 03, měřit živě od nuly. Snímky
porota-c3-04 (51/92/52). Slop dosáhl 5/5 — poprvé u tohoto článku.

| Lenz | Kolo 03 → 04 | Kritické |
|---|---|---|
| hierarchie | 3 → **4** | 0 |
| typografie | 3 → **4** | 0 |
| pohyb | 3 → **4** | 0 |
| styl | 4 → 3 | 0 → **1** |
| slop | 4 → **5** | 0 |
| výkon | 4 → 3 | 0 → 2 (skeptik: 1 vyvráceno → **1** zůstal) |
| rozložení | 2 → **4** | 1 → **0** ✓ |

**Rozložení se konečně zavřelo** — oprava z kola 03 obstála (0 kritických,
žádný split pod 96,7 % pokrytí). Skeptici zase odvedli práci: nález
o chybějícím `tabindex` na `.id-table-wrap` byl **vyvrácen** — je to
záměrný podmíněný mechanismus z kola 01 (tabindex jen když tabulka
skutečně přetéká), porotce nenašel komentář v kódu, skeptik ho dohledal
a nález zamítl jako neplatný.

### Dva kritické (oba opraveny ve stejné relaci)

1. **Kresba Mykorhiza v panelu karty složek zmenšená o 19 %** (styl):
   kontejner byl `minmax(300px, 420px)` proti nominální šířce viewBoxu
   520 px — pointa 19,4 px místo 24, popisky pod 10px floor i na
   desktopu ≥1130 px (jiná příčina než mobilní floor z balíku 4 —
   tam šlo o chybějící `.id-figure-svg` třídu, tady o samotný strop
   kontejneru). Oprava: `minmax(300px, 420px)` → `minmax(300px, 520px)`
   v `.id-ingredients__panel--s-obrazem`. Ověřeno: 520 px šířka,
   popisek 14 px (bbox).

2. **Hero titulek nečitelný nad světlým pískem** (výkon, skeptik
   potvrdil nezávislým měřením 1,43–1,98:1 vs. cíl ≥3:1): nová hero
   fotka (balík fotek po kole 02) má hřeben pískové hromady přesně
   v pásmu, kde stojí první řádek H1 (51–77 % výšky). Scrim kalibrovaný
   pro STAROU kompozici tam měl jen ~15% krytí. Přeměřeno přímo na
   živé stránce (text skrytý přes opacity:0, pixelový sken pozadí,
   sRGB→lineární luminance, WCAG kontrastní poměr) — nejjasnější bod
   masky L=0,80 při y=455 (těsně pod horní hranou H1). Nová křivka
   scrimu (v2.9): strmější mezi 18–54 % odspodu, strop 62 % beze změny
   (horní třetina fotky zůstává čistá). Po opravě: **1,43:1 → 5,01:1**
   na 1440 px (nejhorší bod), 8,28:1 na 393, 8,42:1 na 1990 — všechny
   tři šířky s rezervou nad cílem. Fotka vizuálně nepůsobí plošně
   ztmavlá (viz snímek).

Přejímka: layout-check 1440, svg-labels 320/393/1440 (12/12), žádné
přetečení, tsc čistý.

### Zbývá (nekritické, žádné nebrání průchodu)

- **Přestřel opačným směrem**: 3 splity opravené v kole 03 teď mají
  TEXT delší než kresbu (91→109 %, 87→115 %, 66→152 % u „Prvního
  kořínku") — nevzniká kritická vada (rozložení dalo 0 kritických),
  ale hierarchie to zapsala jako důležitý nedodělek: nerovnováha jen
  změnila stranu. Řešit až v samostatném průchodu, ne narychlo.
- Mobilní ořez fotky dodávky ztrácí pytle z kompozice (styl, důležitý)
- Hero `loading="lazy"` + `fetchPriority="high"` rozpor (trvá, koš B)
- Skip-link (trvá, koš B)
- NBSP chybí v `**tučném**` textu produktového pásu (ProductBand
  renderStrong nevolá nezlomitelneMezery na tučné části) — nový nález
- 2× ASCII uvozovka (trvá), h3 čtyři velikosti napříč bloky (trvá)
- FAQ dvousloupec 44% prázdno pod leadem (kosmetický, i sourozenecký
  článek), FAQ otevření bez přechodu (kosmetický)
- Obr. 08 popisek — porota si sama všimla, že „09 je fotografie" ze
  zadání už neplatí (přečíslováno v balíku 4); poznamenáno pro příště
  v zadání dalšího kola.

## Kolo 05 — PROŠEL v ověřeném rozsahu (2026-09-20)

Článek `/posts/pisek-biochar-a-dalsi-primesi`, nový průchod po změně
pevných dávek na rozsahy. Samostatný skill `design-loop` nebyl v prostředí
dostupný; použit zde uložený postup, aktuální DESIGN.md a ADR. Sedm oblastí
posoudili tři nezávislí recenzenti v oddělených zadáních, s kontrolou zdrojů
a nových snímků/měření. Nebyl potvrzen žádný kritický nález, proto nebylo
potřeba samostatné skeptické kolo. Staré otevřené poznámky nejsou tímto
zápisem automaticky uzavřeny.

| Oblast | Před opravou → po opravě |
|---|---|
| Hierarchie | 4 → 4 |
| Typografie | 3 → 4 |
| Pohyb | 3 → 5 (v testovaném rozsahu) |
| Grafický styl | 4 → 4 |
| Slop | 5 → 5 |
| Výkonové předpoklady a přístupnost | 3 → 4 |
| Rozložení | 4 → 4 |

### Opravy

- Mobilní hlavičky tabulek jsou skutečný text místo `::before`: Archivo
  12 px / 600, tracking 0,14 em. Stejně jako desktop zachovávají malé m²/m³.
- Graf rozsahů má tabulární číslice a obnovenou výraznou hodnotu 8–10 se
  spojnicí; žádný podíl se touto úpravou nezměnil.
- Popisek Obr. 06 nyní přesně uvádí nulový Biovin v modelu udržované hlíny,
  místo tvrzení, že hlína nepotřebuje skoro nic. Jedna hodnota aktualizována
  v místním CMS (post 6, cs), se zálohou a kontrolou souběžné změny, i v seedu.
- Fokus další karty již nepřepíná vybranou příměs. Enter/mezerník, klik a
  hover fungují dál; Tab se dostane také k odkazům vybraného panelu.
- SSR příměsí obsahuje všechny přístupné panely. Skládání, skrytí,
  `inert` a tlačítková sémantika nastanou až po hydrataci přes `data-enhanced`.
- Setrvačný scroll reaguje na změnu reduced-motion i pointeru během návštěvy:
  uvolní listenery, zruší rAF a obnoví nativní scroll; návrat znovu aktivuje
  chování od aktuální pozice. Fotografie příměsí již neanimují filtr.

### Ověření

- Živý lokální náhled přes CUA: 320, 393, 1024, 1130, 1280, 1440 a 1990 px.
  Na všech nulový horizontální přesah stránky a žádný ořez viditelných SVG.
  Upravený graf vizuálně ověřen na 320/393/1440; na 1440 také geometricky
  bez překrytí jeho textových popisků. Mobilní tabulky ověřeny na 393.
- Desktop klávesnice: Biovin → Enter → čtyřikrát Tab → odkaz výrobce,
  přičemž Biovin zůstane otevřený. Mobil začíná po hydrataci s nulou
  otevřených panelů, kliknutí na Biovin zobrazí právě jeden.
- NoJS: skutečný ReactDOM SSR komponenty a skutečné CSS v izolované
  statické fixture bez scriptů, desktop 1440 i mobil 393. Všechny čtyři
  panely jsou v běžném toku, viditelné a bez inert/aria-hidden.
- Test změn media queries: opravený scroll PASS; původní implementace
  tentýž test nesplní při přepnutí na reduced-motion. Testuje také zrušení
  rAF, opětovnou aktivaci, pointer, výchozí preference a cleanup.
- `tsc --noEmit --incremental false` PASS, `git diff --check` PASS.
- Plné povrchy: nejdelší mezera i bez započtení fotografie je 5746 px
  (393), 4137 px (1024), 4424 px (1280), 4530 px (1440), tedy pod 6000 px.

### Hranice a drobné rezervy

Nejde o měření produkčních CWV/FPS ani kompletní audit odečítačem.
Živá změna nastavení OS byla ověřena mock testem, nikoli přepnutím OS.
NoJS ověření se týká komponenty s reálným CSS, nikoli celé Next stránky.
Malé SVG labely na některých šířkách se scrollbarem zůstávají těsně pod
10 px (nejmenší produktový label 9,17 px); dávkovací tabulka má povolený
vnitřní horizontální posun. Ruční preload hero vynechává kandidáty
750/1080 px, ale duplicitní přenos nebyl prokázán a tato část se neměnila.
Předchozí známá chyba konfigurace ESLintu (circular JSON) nebyla tímto
kolem řešena; TypeScript prošel.

Dočasné důkazy, snímky, JSON měření, SSR fixture, test a záloha lokálního
článku: `/tmp/design-loop-primesi-2026-09-20/`.

## Kolo 06 — PROŠEL v ověřeném rozsahu (2026-09-20)

Článek `/posts/pisek-biochar-a-dalsi-primesi`, další průchod po výměně
hero fotografie za variantu s opraveným rýčem. Použit postup projektu,
DESIGN.md a ADR; sedm oblastí rozděleno mezi tři nezávislé recenzenty.
Potvrzené nálezy kontrastu a ovládání úzkého akordeonu byly posouzeny
ještě nezávislým skeptikem. Po opravách nezůstal v testovaném rozsahu
otevřený kritický nález. Starší poznámky mimo tento rozsah zůstávají platné.

| Oblast | Před opravou → po opravě |
|---|---|
| Hierarchie | 4 → 4 |
| Typografie | 3 → 4 |
| Pohyb | 4 → 4 |
| Grafický styl | 4 → 5 |
| Slop | 5 → 5 |
| Výkonové předpoklady a přístupnost | 3 → 4 |
| Rozložení | 4 → 4 |

### Opravy

- Hero se při `priority` načítá `eager`; zachována explicitní volba
  `loading` od volajícího. Ruční preload hlavního obrazu nyní přebírá
  `srcSet` z `getImageProps` se stejnými vstupy jako výsledný NextImage.
  Preload hlavního i portrétového zdroje odpovídá skutečnému obrázku.
- Kontrast malého bílého textu nad H1 byl nedostatečný zejména na 320
  a 1024 px. Pouze tento článek dostal silnější přechod nad světlým pískem:
  54 % / 0,60; 59 % / 0,52; horní hranice zůstává 62 % odspodu.
  Fotografie a mobilní portrét se v tomto kole neměnily.
- SVG popisky mají skutečnou velikost nejméně 10 px v testovaných šířkách
  včetně 15px scrollbaru. Upraveny úzké breakpointy a prostor kresby,
  zvlášť produktová kresba a otevřený panel mykorhizy. Změna prostoru
  příměsí míří pouze na SVG, fotografie zachovávají svůj ořez.
- Dva řádky „dosah se / sítí houby“ dostaly větší odstup posunem prvního
  o 4 jednotky SVG, aby se při některých měřítkách nedotýkaly jejich bbox.
- Hover vybírá příměs pouze v režimu tabů. V úzkém okně s myší předtím
  mouseenter panel otevřel a následný klik jej hned zavřel; nyní klik
  akordeon spolehlivě otevírá a zavírá.

### Ověření

- Živá geometrie při 320, 360, 361, 375, 385, 386, 393, 560, 561, 1024,
  1129, 1130, 1149, 1150, 1280, 1440 a 1990 px, také s otevřenou
  mykorhizou: nulový horizontální přesah stránky, nulové vodorovné ořezy textů SVG,
  žádné dvojice textových bbox s překryvem větším než 1 px v obou osách.
  Nejmenší skutečná velikost popisku 10,004 px.
- Hero ořezy a kontrast při 320/393/1024/1130/1280/1440/1990 px. Výpočet
  ze zdrojového obrazu, aktuálního object-fit, polohy, rozměrů, gradientu
  a barvy textu, doplněný odhadem pod tahy ze screenshotů. Konzervativní
  minimum přes celé textové obdélníky po opravě 5,02 : 1.
  Eyebrow: 320 px 2,73 → 6,38 : 1; 1024 px 2,42 → 5,02 : 1.
  Vizuální recenzent potvrdil přirozený rýč i nerušivý přechod ztmavení.
- 320 px s myší: první klik na Mykorhizu `aria-expanded=true`, druhý
  `false`; Enter zavře a mezerník otevře. Na 1440 px klik na Biovin
  zobrazí správný panel. Desktopový hover posouzen ve zdroji; samostatný
  fyzický hover nebyl nástrojem simulován.
- Nejdelší mezera mezi plnými barevnými plochami, i bez započtení fotek:
  5746 px (393), 4137 px (1024), 4424 px (1280), 4530 px (1440).
- `tsc --noEmit --incremental false` PASS, `git diff --check` PASS.
  Obsah receptur, dávkování a CMS se tímto kolem neměnil.

### Hranice ověření

Kontrastní výpočet má omezení resamplingu a komprese; nejde o formální
WCAG audit, audit odečítačem ani produkční CWV/FPS měření. NoJS a živé
přepínání reduced-motion nebyly znovu testovány, relevantní implementace
z kola 05 zůstala zachována. Známá chyba konfigurace ESLintu se neřešila.
Opravy sdílených komponent byly živě ověřeny na tomto článku; ostatní
články nebyly kompletně znovu auditovány.

Dočasné důkazy, snímky, měření, výpočty kontrastu a patche:
`/tmp/design-loop-primesi-round06/`; zejména `svg-open-final.json`,
`hero-after-contrast-source.json`, `hero-after-contrast-glyph-estimate.json`,
`loading-after.json` a `surfaces-after.json`.

# Článek s kalkulátorem půdního profilu

## Kolo 01 — PROŠEL v ověřeném rozsahu (2026-09-21)

URL: `/posts/kalkulator-na-planovani-pudniho-profilu`. Nový průchod po
oddělení přípravy směsi a výsevu do samostatného článku. Použit postup
projektu z tohoto logu, DESIGN.md a ADR-006; samostatný skill `design-loop`
není v dostupné sadě. Dva nezávislí recenzenti posoudili sazbu a grafický
styl, respektive přístupnost, pohyb a výkonové předpoklady. Root ověřil
nálezy a opravy v živém lokálním náhledu. V tomto rozsahu nezůstal
potvrzený blokující nález.

| Oblast | Po opravách |
|---|---|
| Hierarchie | 4/5 |
| Typografie | 4/5 |
| Rozložení | 4/5 |
| Grafický styl | 4/5 |
| Slop | 4/5 |
| Pohyb | 4/5 |
| Přístupnost, ovládání a výkonové předpoklady | 4/5 |

### Opravy

- Kalkulátor nyní respektuje CMS nastavení `surface=band`. Tmavé zadání
  a světlý řez používají osy článku místo dalšího vsazeného panelu.
  Na šířce 393 px narostla výsledková tabulka z 256 na 296 px.
- Výsledky zůstávají pod vstupy, jemně oddělené jiným tmavým povrchem.
  Zachován sloupec „K objednání“ u každé příměsi i zarovnání podtržení
  Actina s hloubkou profilu.
- Tělo výsledkové tabulky používá 14,5 px, záhlaví uppercase 12 px.
  Tag „Kalkulátor“ má neutrální textový vzhled bez tlačítkové pilulky.
- Cenový sloupec se zobrazí po otevření cen nebo při zadaném ceníku;
  výchozí mobilní výsledek neopakuje pět prázdných řádků „Cena —“.
  Během editace zůstává sloupec viditelný i při nulových cenách.
- Parser přijímá rozepsané `12,` a `12.` jako 12, přitom zachovává text
  vstupu. Před opravou zmizela tabulka a cenové pole odskočilo z y=409
  na y=-780; po opravě zůstává tabulka i pole ve viewportu. Neplatné
  vícenásobné oddělovače zůstávají chybou.
- Jediné explicitní polite shrnutí nově zahrnuje varování při platném
  výsledku a dováženou zeminu v režimu Nová vrstva. Graf má textový popis
  složení zón přes `aria-describedby`; vizuální receptura se nevrací.

### Ověření

- Šířky 320 / 393 / 1024 / 1130 / 1440 / 1990 px: nulový vodorovný
  přesah. Nejmenší přepočtená velikost SVG textu celé stránky v tomto
  vzorku přibližně 10 px. Desktopová podtržení mají rozdíl 0 px ve všech
  třech režimech na 1130 i 1440 px.
- Živě: otevření cen přes tlačítko a fokus prvního pole; `12,` a `12,5`
  bez zániku výsledků; zachování cenového sloupce po zavření ceníku
  s cenou; skrytí při zavřeném nulovém ceníku. Klávesa Tab z plochy
  pokračuje na hloubku profilu.
- Plocha 50 m² při výchozí receptuře dává 75 kg Actina, 120 kg zeolitu
  a 100 l biocharu. Hlášení Zapravit obsahuje upozornění na zvýšení
  terénu, Nová vrstva dováženou zeminu a profil 5 cm informaci o omezení
  hloubek zapravení.
- 11 případů parseru a SSR propojení popisu grafu PASS; stávajících
  25 testů výpočtu PASS. `tsc --noEmit --incremental false` PASS,
  `git diff --check` PASS. CMS obsah a matematické vztahy se neměnily.

### Hranice ověření

Jde o lokální vizuální a funkční kontrolu, nikoli produkční CWV/FPS
měření nebo úplný audit čtečkou obrazovky. Reduced-motion byl v tomto
kole zkontrolován ve zdroji, nastavení OS se neměnilo. ESLint nebyl
spouštěn kvůli dříve známé chybě konfigurace. Starší poznámky mimo tento
rozsah zůstávají platné.

Důkazy, snímky, měření a staged změny:
`/tmp/design-loop-profile-2026-09-21/`.

## Kolo 02 — PROŠEL v ověřeném rozsahu (2026-09-21)

Druhý průchod článkem `/posts/kalkulator-na-planovani-pudniho-profilu`.
Dva nezávislí recenzenti znovu posoudili výsledkové stavy a čitelnost
kresby. Potvrzené nálezy byly opraveny a ověřeny v lokálním prohlížeči.
Přechod ze světlé kresby do úvodu výkladu má přiměřený odstup; neměnil se.

| Oblast | Po opravách |
|---|---|
| Hierarchie | 4/5 |
| Typografie | 4/5 |
| Rozložení | 4/5 |
| Grafický styl | 4/5 |
| Slop | 4/5 |
| Pohyb | 4/5 |
| Přístupnost a ovládání | 4/5 |
| Výkonové předpoklady | 4/5 |

### Opravy

- Při neplatné ceně nebo hustotě zůstává výsledková tabulka, součty
  i tlačítko ceníku vykreslené. Neplatná množství ukazují pomlčky,
  nikoli poslední platná čísla nebo nuly. Před opravou neplatná cena
  odstranila všech pět řádků a posunula aktivní pole z y=415 na y=-710;
  vymazaná hustota z y=471 na y=-202.
- Hlavní pokyn rozlišuje prázdné zadání od neplatného. Chyba ceny
  pojmenuje konkrétní materiál; validační popisky Actina odpovídají
  názvu ve formuláři. Poměrový output má aria-live=off; slider si
  zachoval aria-valuetext a souhrn jedinou explicitní polite oblast.
- Jednotka hloubky pod oběma SVG se posunula mimo hnědé podloží,
  viewBox získal prostor pro celý popisek. Před opravou se text
  překrýval s podložím o přibližně 14 px na desktopu.
- Šrafování objemu k odvozu má krémovou čáru tloušťky 1,6 místo
  nevýrazné šedé. Hustota šrafování a význam kresby zůstávají stejné.

### Ověření

- Šířky viewportu 320 / 393 / 700 / 1130 / 1440 px: nulový vodorovný
  přesah. Popisky pod kresbou mají skutečnou mezeru od podloží
  6,875 až 12 px. Na desktopu zůstává Actino zarovnané s hloubkou;
  rozdíl podtržení 0 px i při přepnutí všech tří režimů na 1440 px.
- Živě na 393 px: neplatná cena drží 5 řádků a 15 pomlček, oprava
  vrátí množství i cenu; stejné aktivní pole je viditelné (y=370/534).
  Vymazaná hustota a její oprava drží 5 řádků, aktivní pole y=347/596.
  Souhrn čte konkrétní chybu „Cena písku…“. Prázdná plocha zachovává
  tabulku s pomlčkami a výzvu doplnit plochu a hloubku.
- Platná plocha 50 m²: Actino 75 kg, zeolit 120 kg, biochar 100 l.
  Ověřeny Udržet výšku, Zapravit a Nová vrstva; písčitá předvolba
  správně nepřidává písek.
- Nezávislý SSR check: invalid price/density/empty má vždy 5 řádků
  bez falešných nul, validační hlášení identifikují všech 5 cen.
  Porovnání 27 platných scénářů s výchozím zdrojem nezměnilo výsledky.
  Stávajících 25 testů výpočtu PASS, TypeScript PASS, diff whitespace
  check PASS. CMS obsah a matematické vztahy se neměnily.

### Hranice ověření

Poznámky a zalomení řádků při změně stavu stále způsobují menší posuny;
ve zkoušených případech upravované pole zůstalo ve viewportu. Nejde
o úplný audit čtečkou ani produkční CWV/FPS měření. Reduced-motion
a nativní scroll ověřeny ve zdroji, nastavení OS se neměnilo. Známá
chyba konfigurace ESLintu nebyla předmětem tohoto kola.

Důkazy, snímky, staged soubory a přesný diff druhého kola:
`/tmp/design-loop-profile-round02/`.

## Kolo 03 — porota + sladění s `.id-calc` (2026-09-21)

URL: `/posts/kalkulator-na-planovani-pudniho-profilu`. Nezávislý běh
sedmi lenzů (Workflow, schema verdiktu + skeptik na každý kritický
nález) proti právě dokončenému kalkulátoru `SoilProfileCalculator`
(vlastní `.id-profile-calc` vrstva — CSS komentář ji výslovně
prohlašuje za výjimku z 7.7). Cílem bylo posoudit, zda se nová
komponenta i po kolech 01–02 (funkční/validační opravy, viz výše)
drží sdíleného vizuálního jazyka `.id-calc`.

| Oblast | Skóre poroty | Po opravách |
|---|---|---|
| Hierarchie | 2/5 (oba kritické nálezy skeptik vyvrátil — DOM/tab pořadí sedí, výsledek má strukturní kotvu) | neřešeno, viz níže |
| Typografie | 4/5 | — |
| Pohyb | 3/5 | částečně |
| Grafický styl | 3/5 | opraveno |
| Slop | 2/5 | opraveno |
| Výkon a přístupnost | 4/5 | opraveno |
| Rozložení | 4/5 | — |

**0 potvrzených kritických nálezů** — 3 tvrzené kritické (dvousloupcové
rozvržení obchází pořadí vstup→výstup; čtyři podobná modrá čísla bez
kotvy; Biovin/Actino) skeptik zamítl: dvousloupec je zdokumentovaný
vzor (7.7, §18) se zachovaným DOM/tab pořadím; výsledek má strukturní
kotvu (posun povrchu + rámeček + nadpis „Výsledek", 3.7); pojmenování
řeší DESIGN.md vůbec, je to obsahová otázka.

### Opravy

- **Biovin → Actino, sjednoceno napříč všemi třemi navazujícími
  články** (rozhodnutí autora: skutečný rebrand, ne omyl). 46 výskytů
  přejmenováno se správnou českou deklinací (Actino/Actina/Actinem);
  zachovány oba odkazy na skutečného výrobce `biovin.at`. Gloska
  „Actino (dříve Biovin)" doplněna při prvním výskytu v běžícím textu
  článku 1 (kap. 1) a článku 3 (kap. 2) — kalkulátor už glosu nesl.
  `ORIGINAL_META_DESCRIPTION` v `split-primesi-content.ts` opravena.
- Aktivní segment (režim, typ půdy) je `background:accent, color:#fff`
  místo krémové výplně — jediná plocha panelu, která nebyla modrá.
- Zvýrazněná čísla (`__primary`, `__cost`, `__purchasevalue`) přešla
  z `--id-accent-tint` na `--id-accent-dark`: tint je podle 3.4 vyhrazen
  eyebrow/tagům/mikrotypografii, ne číselným hodnotám ≥ 20 px.
- Štítek „Kalkulátor" změněn z neutrální šedé (`--id-ink-dark-2`) na
  `--id-accent-tint` beze pilulky. DESIGN.md koš A bod 6 dokumentuje
  přesně tento tvar jako už vyřešený: „bez pilulky i rámečku, **zůstal
  jen hlas**" (3.8) — barva zůstat měla; kolo 01 ji spolu s pilulkou
  omylem odstranilo, tímto vráceno.
- Focus-visible prstenec sjednocen na 3px/3px (segmenty, textbutton,
  summary) a 3px/6px (slider) v plném `--id-accent` místo 2px/4px
  v `--id-accent-tint`; číselná pole dřív neměla žádný prstenec, teď mají.
- Posuvník poměru implementuje 7.10 od nuly (vlastní stopa a palec
  přes `::-webkit-slider-thumb`/`::-moz-range-thumb`, `--pct` gradient
  vyplňovaný z Reactu, nevyplněná dráha `--id-line-dark` pro tmavý
  kontext) — dřív běžel jako nativní OS prvek bez jakéhokoli stylu.
- Podtržení vstupních řádků nahrazeno tokenem `--id-line-dark` místo
  natvrdo `rgba(255,255,255,.24)`; rámeček upozornění `--id-r-md`
  místo `--id-r-sm` (shodně s Calloutem, 7.8).
- Doplněn souhrnný `.id-verdict--ok` řádek po dokončeném a bezchybném
  výpočtu („Zadání je konzistentní. Materiály jsou připravené
  k objednání.") — dřív žádný ze čtyř kalkulátorů webu tuto komponentu
  nepostrádal, tenhle ano.

### Neopravené (mimo rozsah tohoto kola)

- Kalkulátor jako jediná velká sekce nedostává scroll-reveal (0/30 `.rv`).
- Tažení slideru pod 4× CPU throttlem dělá 50–60ms long-tasky (přepočet
  a překreslení SVG bez debounce/rAF gatingu).
- Mobilní ořez jednotky „l" u „K objednání" (Biochar) na úzkých šířkách.
- 4 měny (CZK/EUR/USD/GBP) bez přepočtu — UI přítěž bez doloženého účelu.
- Legenda „Zemina"/„Actino" v řezu skoro nerozeznatelná (ΔRGB ≈ 31).
- `.id-profile-calc` nemá v DESIGN.md žádnou zmínku, přestože se sama
  v kódu prohlašuje za výjimku ze 7.7 — hrozí budoucí rozjetí.

### Ověření

- `tsc --noEmit --incremental false` PASS. 25/25 testů výpočtu PASS
  (matematika se neměnila). `layout-check.mjs` beze změny proti stavu
  před opravou (stejná známá chyba měřicího skriptu na jednomodulové
  ose, ověřená už v kole poroty proti sourozeneckému článku).
- Živě v lokálním náhledu na 1440 a 375 px: aktivní segmenty, štítek,
  slider (stopa + palec + prstenec), zvýrazněná čísla a zelený verdikt
  vizuálně potvrzeny na snímcích obrazovky.
- Souběžná relace prováděla ve stejném okně nezávisle kola 01–02 (funkční
  a validační opravy, viz výše) — funkčně se nepřekrývají s tímto kolem
  kromě štítku (viz výše); kombinovaný stav ověřen společně.

### Hranice ověření

Neproběhl audit čtečkou obrazovky ani produkční CWV/FPS měření.
Neopravené nálezy (výše) čekají na další kolo. Porota i oprava proběhly
jako Workflow (7 agentů + skeptik), ne jako samostatný skill `design-loop`
(v prostředí nedostupný).

## Kolo 04 — ověření oprav kola 03 + dva nové nálezy (2026-09-21)

URL: `/posts/kalkulator-na-planovani-pudniho-profilu`. Sedm lenzů znovu
(Workflow + skeptik), tentokrát s úkolem ověřit ŽIVĚ, že se opravy kola 03
skutečně projevily na běžící stránce (ne jen v diffu), a přehodnotit dřív
vědomě neopravené body. Explicitně upozorněno na riziko souběžné relace.

| Oblast | Skóre |
|---|---|
| Hierarchie | 2/5 (jediný tvrzený kritický nález skeptik vyvrátil — viz níže) |
| Typografie | 4/5 |
| Pohyb | 5/5 |
| Grafický styl | 5/5 |
| Slop | 4/5 |
| Výkon a přístupnost | 5/5 |
| Rozložení | 5/5 |

**0 potvrzených kritických.** Jediné tvrzení („čtyři vizuálně stejně
důležitá modrá čísla na jedné obrazovce") skeptik zamítl: sestavil ho
z uměle vynucené scroll pozice, která při běžném čtení nenastává (hero
výsledek je při přirozeném scrollu 175 px mimo viewport, když jsou
vidět tři dílčí „K objednání"); navíc `--id-accent-dark` je podle
DESIGN.md 3.4 obecný token pro „akcentový text < 30 px", ne barva
vyhrazená jednomu hero číslu.

Kolo 03 živě potvrzeno beze zbytku (accent na segmentech, accent-dark
na číslech, accent-tint bez pilulky na štítku — **nevrátilo se ani po
souběžné relaci**, custom slider dle 7.10, focus-ring 3px/3px a 3px/6px,
verdikt používá sdílenou `.id-verdict--ok` třídu). Grafický styl 5/5
navíc porovnal `.id-profile-calc` živě s nezávislým `.id-calc` panelem
na jiné stránce — identické barvy potvrzují skutečnou rodinovou shodu,
ne jen podobnost.

### Opravy

- Vedlejší efekt kola 03: `.id-profile-calc__cost dd` (součet cen)
  barvil `--id-accent-dark` i stav „Ceny nezadané" (placeholder, ne
  výsledek) — stejně silně jako skutečná čísla nad ním. Přidán modifier
  `--set`, který se připojí jen když je `calculation.hasPrices` true;
  bez něj řádek zůstává `--id-ink-dark-2`, shodně se sourozeneckým
  stavovým textem „zatím nezadané".
- `nezlomitelneMezery` (sdílená utilita, DESIGN.md 4.3) chránila
  pevnou mezerou cm/kg/l/m²/m³/min/%, ale ne jednotku „t" (tuny) ani
  měnové symboly Kč/€/$/£, které tento kalkulátor jako první na webu
  používá. Doplněno do `JEDNOTKA_SLOVO` (t, Kč, tun\p{L}*) a
  `JEDNOTKA_SYMBOL` (€, $, £), se stejnou `(?!\p{L})` hranicí jako
  ostatní zkratky — ověřeno, že nepohltí slova jako „typy" nebo
  „trávníky". Dosud latentní vada (nezjištěno skutečné zalomení
  v testovaných šířkách), teď stejně ošetřená jako ostatní jednotky.

### Neopravené (přehodnoceno, beze změny závažnosti)

- Legenda „Zemina"/„Actino" skoro nerozeznatelná (ΔRGB 31,02) — kód
  barev se v kole 03 i 04 nedotkl.
- Mobilní ořez jednotky „l" u „K objednání" (Biochar).
- Tažení slideru pod 4× CPU throttlem: 21 z 30 kroků nad 50 ms,
  medián ~65 ms (přepočet + překreslení SVG bez debounce/rAF).
- Zápis „Přibližně" vs. „≈" pro touž přibližnou hodnotu v jednom
  panelu (2× slovo, 4× symbol) — kosmetické, nesjednoceno.
- **Nově pojmenované, ne nově vzniklé:** segmentovaný přepínač měn
  teď vizuálně vypadá stejně „plnohodnotně" jako přepínač režimu/typu
  půdy, ale mezi měnami nic nepřepočítává (hint v kódu na to
  upozorňuje, přepínač samotný ne). Mimo rozsah tohoto kola — jde
  o produktové rozhodnutí (dopočítat kurz, nebo přepínač vizuálně
  odlišit), ne o rychlou opravu tokenu.
- Poznámka mimo rozsah opravy: DESIGN.md 7.7/3.4 textově předepisuje
  pro hero číslo `.id-calc` plný `--id-accent` (#2563eb), ale živá
  implementace (`.id-calc` i `.id-profile-calc`) shodně používá
  `--id-accent-dark` — dokumentace zaostává za ověřenou praxí, ne
  chyba úpravy. Navrženo opravit prózu DESIGN.md, ne kód.

### Ověření

- `tsc --noEmit --incremental false` PASS. Celá sada 26/26 testů PASS
  (matematika a nová regex utilita se testují nepřímo, chování ověřeno
  ručním skriptem s 9 případy včetně negativních — „typy", „trávníky",
  „tucty" správně BEZ pevné mezery).
- Živě: zadání ceny písku (5000 Kč/t) přepnulo „Ceny nezadané" (šedá)
  na „142 594 Kč" (modrá) — obě větve modifier třídy potvrzeny na
  běžící stránce, ne jen v CSS.
- `layout-check.mjs` beze změny proti stavu před opravou (stejná známá
  chyba měřicího skriptu na jednomodulové ose).

### Hranice ověření

Neproběhl audit čtečkou obrazovky ani produkční CWV/FPS měření. Slider
pod CPU throttlem a 4 měny zůstávají vědomě neopravené (viz výše).

## Kolo 05 — ✅ PROŠEL (2026-09-21)

URL: `/posts/kalkulator-na-planovani-pudniho-profilu`. Sedm lenzů
(Workflow), tentokrát s výslovným upozorněním na vzorec z kol 03–04:
lenz Hierarchie dvakrát dal 2/5 na nálezu, který skeptik pak vyvrátil.
Porota byla požádána, ať skóre neopírá o nálezy, co u skeptika stejně
nemají šanci obstát.

| Oblast | Skóre |
|---|---|
| Hierarchie | 4/5 |
| Typografie | 4/5 |
| Pohyb | 5/5 |
| Grafický styl | 5/5 |
| Slop | 4/5 |
| Výkon a přístupnost | 5/5 |
| Rozložení | 5/5 |

**Žádný kritický nález vůbec nebyl vznesen** — poprvé v tomto kalkulátoru
nebylo potřeba ani kolo skeptika. Kola 03–04 živě reovařena a drží beze
zbytku (i po opakovaném varování na souběžnou relaci).

### Opravy

- Hero číslo výsledku (`.id-profile-calc__primary > strong`) bylo pod
  ~1120 px šířky vizuálně nerozeznatelné od tří dílčích „K objednání"
  hodnot (28px = 28px). DESIGN.md 7.7 pro hero předepisuje viditelně
  větší řez; sjednoceno na `clamp(30px, 3.4vw, 46px)`, přesně jako
  sesterský `.id-calc__orow--hero .id-calc__ov`.
- Viditelný zápis přibližné hmotnosti sjednocen na „≈" (byl „Přibližně
  28,52 t" vedle „≈ 27,67 t" a „Hmotnost ≈" v témže panelu — zmiňováno
  potřetí od kola 03). Slovní tvar „přibližně" zůstal beze změny
  v souvislé větě screen-reader shrnutí, kde symbol nesedí.

### Neopravené (beze změny závažnosti, zaznamenáno potřetí)

Mobilní jednotka „l" u Biocharu bez rezervy od okraje; segmentovaný
přepínač měny vizuálně slibuje paritu s funkčními přepínači, ale
nepřepočítává; legenda Zemina/Actino skoro nerozeznatelná; slider pod
4× CPU throttlem dělá long-tasky. Dva nové, čistě dokumentační nálezy
(DESIGN.md 7.10/11.3 popisuje jiný vzor pro slider output/aria-live,
než jaký je živě ověřen jako funkčně správný) — navrženo opravit prózu
DESIGN.md, ne kód; mimo rozsah tohoto kola.

### Ověření

`tsc --noEmit --incremental false` PASS, 26/26 testů PASS. Živě:
hero číslo viditelně větší než vedlejší hodnoty na 1440 i 375 px;
zápis „≈ 28,52 t" vedle hero, „přibližně" beze změny v aria-live
shrnutí. `layout-check.mjs` beze změny proti stavu před opravou.

**Design-loop na tomto kalkulátoru uzavřen — 3 kola po sobě 0 kritických,
kolo 05 prošlo bez jediného vzneseného kritického nálezu.**

## Kolo 06 — 0 kritických, INP fix a výkonová hygiena (2026-09-21)

URL: `/posts/kalkulator-na-planovani-pudniho-profilu`. Mezi kolem 05
a tímto kolem přibyly tři vlastní úpravy (mimo porotu): řádek Písek
ve stejném formátu Podíl/Do hloubky/K objednání jako příměsi s obousměrnou
vazbou na Poměr a Hloubku profilu, a kompaktnější výsledková sekce.
Porota některé snímky/skripty z předchozího kola cituje ze stavu PŘED
těmito úpravami — dvě tvrzené kritické proto skeptik zamítl mj. i na
základě chybějících/neplatných důkazů, ne jen věcně.

| Oblast | Skóre |
|---|---|
| Hierarchie | 2/5 (jediný nález skeptik vyvrátil — chybná premisa počtu hodnot, neexistující snímek) |
| Typografie | 5/5 |
| Pohyb | 4/5 |
| Grafický styl | 5/5 |
| Slop | 2/5 (jeden nález skeptik vyvrátil, jeden potvrzen jako důležitý) |
| Výkon a přístupnost | 4/5 |
| Rozložení | 5/5 |

**0 potvrzených kritických.** Zamítnuto: (1) hero vs. tři „K objednání"
na mobilu — skeptik ukázal 4, ne 3, hodnoty v citovaném důkazu a
citovaný screenshot na disku neexistuje; strukturní kontext (karta
Výsledek s vlastním nadpisem) navíc hierarchii nese i bez rozdílu
velikosti. (2) Přepínač měny „tiše maže zadanou cenu" — je uvnitř
vlastního sbaleného `<details>`, který uživatel musí otevřít sám, se
sousedícím vysvětlujícím textem; DESIGN.md sdílení komponenty mezi
sémanticky odlišnými přepínači nezakazuje.

### Opravy

- **INP: tažení posuvníku poměru pod 4× CPU throttlem porušovalo
  DESIGN.md 6.8 (žádný handler > 50 ms) — 21/21 událostí nad limitem,
  medián 58 ms.** Přepočet zón a SVG řezu (`calculateSoilProfile`)
  teď běží nad `useDeferredValue(input)` místo přímo nad `input`;
  vizuální pozice palce (`--pct`) čte `input` beze změny, takže zůstává
  okamžitá. Živě přeměřeno stejnou metodikou (Playwright + CDP
  throttle 4×): medián 58→32 ms, událostí nad 50 ms 21/21→9/21 —
  reálné zlepšení, ne úplné odstranění (zbytek by vyžadoval hlubší
  restrukturalizaci komponenty, mimo rozsah tohoto kola).
- Reduced-motion blok cílí univerzální selektor `*`, který podle
  specifikace CSS nezasáhne vendor pseudo-elementy palce
  (`::-webkit-slider-thumb`/`::-moz-range-thumb`) — doplněn explicitní
  řádek, aby hover-scale 1→1,12 skutečně zmizel pod
  `prefers-reduced-motion: reduce`.
- Jednotka za hodnotou „K objednání" (např. „200 l") dřív dosedala na
  hranu vlastního kontejneru bez rezervy (0 px) — přidáno 2 px
  `padding-right`, hygiena proti budoucímu posunu, ne oprava aktuálně
  viditelné vady (živě neprokázána, viz níže).
- DESIGN.md §7.7 řádek „Label" psal `ls:.12em`, zatímco §4.3 bod 5
  (kanonické pravidlo, potvrzené i živou implementací obou kalkulátorů)
  žádá `.14em` — opravena stará hodnota v próze, kód se neměnil.

### Přehodnoceno, ne opraveno (produktové/designové rozhodnutí)

**Legenda „Zemina"/„Actino" — počtvrté potvrzeno beze změny (ΔRGB 31,
poměr jasu 1,33:1 vs. 12,12:1 u Biochar/Zeolit ve stejné legendě),
oba nezávislé lenzy (grafický styl i slop) letos povýšily na
důležitý.** Hlubší příčina: barvy pocházejí z tokenů `--id-soil`/
`--id-soil-deep` (DESIGN.md 3.6), které jsou dokumentované **výhradně
pro vrstvy jednoho řezu půdou** (ornice/podloží), ne pro odlišení dvou
nesouvisejících materiálů — Actino zde nese barvu, která sémanticky
znamená „hlubší vrstva téže zeminy", ne „jiná surovina". Oprava
vyžaduje buď nový token v DESIGN.md 3.6/9.2 (design-systémové
rozhodnutí, ne kód), nebo texturní/obrysové odlišení místo barvy —
obojí přesahuje rozsah tohoto kola, ponecháno na rozhodnutí uživatele.

### Ověření

`tsc --noEmit --incremental false` PASS, 26/26 testů PASS (matematika
beze změny). Živě: přepnutí Podílu písku na 50 % nejdřív okamžitě
posune slider a přepínač půdy na „Vlastní", K objednání dokreslí
o zlomek sekundy později (deferred, ne bug — zachyceno mezi dvěma
snímky). `layout-check.mjs` beze změny proti stavu před opravou.

### Hranice ověření

INP oprava snižuje, neodstraňuje problém pod silnou zátěží CPU —
zbytek by vyžadoval hlubší refaktor (izolace SVG podstromu, debounce
raw stavu). Barevná legenda zůstává nevyřešená, čeká na rozhodnutí.

## Kolo 07 — propad po přepsání figury: 5 kritických (2026-09-22)

URL: `/posts/kalkulator-na-planovani-pudniho-profilu`. Mezi kolem 06
a tímto kolem přibylo 8 vlastních úprav bez poroty: sbalovací menu
(Výsledek / Ceny / Podrobnosti / Nápověda) s nejvýš jednou otevřenou
sekcí, řádek Písek ve formátu příměsí a hlavně **úplné přepsání figury
„Jak se profil změní"** — z kresby složení směsi po zónách na srovnání
tří způsobů přípravy s přepínačem, který zrcadlí „Co dělám" v zadání.
Porota: 7 nezávislých lenzů, každý nález se závažností kritický nebo
důležitý pak prošel adversariálním skeptikem (33 agentů celkem).

| Oblast | Skóre |
|---|---|
| Hierarchie | 2/5 (jediný kritický skeptik vyvrátil, čtyři důležité snížil na kosmetické) |
| Typografie | 2/5 |
| Pohyb | 2/5 |
| Grafický styl | 2/5 |
| Slop | 2/5 |
| Výkon a přístupnost | 3/5 |
| Rozložení | 2/5 |

**25 nálezů prošlo skeptikem, z toho 5 kritických a 10 důležitých.**
Tři z pěti kritických seděly přímo v nové figuře, dva v pravdivosti
čísel. Zamítnuto mimo jiné: „panel nemá ve výchozím stavu výsledek" —
skeptik ukázal, že čtyři hodnoty „K objednání" (28 px, accent-dark) na
otázku panelu odpovídají živě a že sbalený Výsledek je čtyřikrát
vyžádané rozhodnutí autora z téhož dne; tentýž nález padl už v kole 04
a 06.

### Opravy — balík „figura mluví pravdu, drží osu a sazbu"

- **Figura zhasínala kvůli cizímu způsobu** (kritický, slop + pohyb).
  `ProfileDrawing` se vypínal, když kterýkoli ze tří způsobů nebyl
  `ready`. Při 100 % písku tak platný „Udržet výšku" zmizel kvůli
  neplatnému „Zapravit" a panel o kus výš přitom hlásil zelené „Zadání
  je konzistentní"; posuvník tažený do krajní polohy zkracoval stránku
  o 653 px. Podmínka teď váže jen na zvolený způsob a navýšení terénu
  se z neplatného „Zapravit" nebere jako měřítko.
- **Legenda nebyla shodná se značkami v kresbě** (kritický, styl).
  HTML vzorky se lišily roztečí (2,25×), tloušťkou obrysu (2,4×)
  i odstínem — vzorek „stávající zemina" byl barevně blíž nepopsanému
  podloží než zemině, kterou pojmenovával. Legenda se přesunula
  **dovnitř SVG** (vzor `TriZony`), takže sdílí tytéž patterny, obrysy
  i měřítko z definice. Navíc je dynamická: vypisuje jen značky, které
  se pro zvolený způsob opravdu vykreslily (9.2 p. 10, úroveň 2).
- **Kresba byla vysázená v 1,5× měřítku článku** (důležitý, styl
  + typografie). Popisky vycházely 19,5 px proti 12 px a klíčová
  hodnota 27 px proti 24 px ve zbytku článku. Stupně jsou teď
  deklarované tak, aby po vynásobení měřítkem daly **12 px a 24 px**;
  pod 560 px se deklarace zvedá, aby vykreslený stupeň zůstal nad 10 px
  (naměřeno 12,0 px na 1440 a 12,1 px na 393). Obrysy dostaly
  `vector-effect: non-scaling-stroke`, takže drží 1,6 px jako ostatní
  kresby místo aby se škálovaly na 2,4 px.
- **Kresba byla 480px ostrůvek s plovoucí osou** (kritický, rozložení).
  Levá hrana putovala 272 / 325 / 480 / 720 px podle šířky okna, zatímco
  nadpis, lead i popiska držely osu 40. Kresba teď stojí na ose 40,
  přepínač nad ní lícuje s její šířkou (dřív byl v pásu 1360 px dvakrát
  větší než jeho dvojče v zadání) a komentář i číselný závěr jsou vlevo
  místo na střed (4.3 p. 4: body text se necentruje).
- **Míra řádku 88–107 znaků** (kritický, typografie). Hinty panelu
  neměly `max-width` vůbec, figcaption měl 76ch a nejmenší text stránky
  tak měl nejdelší míru. Všechny textové odstavce kalkulátoru dostaly
  jedinou míru `var(--id-measure)`; popiska figury 30em stejně jako
  popiska fotografie na téže stránce. Naměřeno 47–66 znaků, dřív až 107.
- **Komentář sliboval šrafu a kótu, které se nevykreslily** (důležitý,
  slop). Při nulovém odvozu a nulovém navýšení texty mluvily o prvcích,
  které v kresbě nebyly. Komentáře, popis pro odečítač i vzorek směsi
  se teď řídí příznaky `removes` / `lifts` / `blended`, tedy tím, co se
  opravdu nakreslilo.
- **Přepnutí způsobu posouvalo obsah o 127–150 px** (důležitý, pohyb).
  Rám je konstantní ve všech třech způsobech (naměřeno 504 px u všech).
  Prázdno nad terénem, které rám drží kvůli „Zapravit", není prázdné:
  v ostatních dvou způsobech nese **neutrální kótu „+56,5 cm / při
  zapravení"**, takže srovnání funguje i bez přepnutí a akcent zůstává
  jen u zvoleného způsobu (9.2 p. 1).
- **„Do hloubky" u písku: 30 cm v zadání proti 86,46 cm ve výsledku**
  (kritický, slop). Týž popisek, týž materiál, 2,9× jiné číslo. Pole
  v řádku Písek se v režimu Zapravit jmenuje „Původní hloubka" jako
  hlavní pole hloubky; v tabulce navíc materiál s nulovým dovozem
  (Zemina) už nehlásí hloubku dovozu, ale pomlčku.

### Neopravené (zbývá do dalšího kola)

Panel „Jak výpočet číst" zůstává osamělým sloupcem v pásu 1360 px
(míru dostal, mřížku ne). Kosmetické po skeptikovi: menu bez hover
odezvy, figura bez čísla „Obr. NN", dva sourozenecké H3 různé
velikosti, duplicita písku (28,52 t v zadání vs. 19,01 m³ v hintu),
plurály v řádku „Dovoz písku", závěr „Vše dovezete" bez objednávkové
rezervy, obrys nevybraných dlaždic přepínače pod mezí non-text 3:1.

### Ověření

`tsc --noEmit --incremental false` PASS, 26/26 testů PASS. Živě
(Playwright, 1440 a iPhone 14 Pro): figura při 100 % písku v režimu
Udržet výšku zůstává vykreslená; popisky 12,0 / 12,1 px; výšky SVG
504 px ve všech třech způsobech; osy h3/lead/přepínač/kresba/komentář
/závěr/popiska všechny začínají na 40; míry 47–66 znaků; řádek Písek
hlásí „Původní hloubka = 30" a tabulka u Zeminy pomlčku; mobil bez
vodorovného přetečení. `layout-check.mjs` na 1440 beze změny.

### Hranice ověření

Porota měřila stav před opravami; kolo 08 musí ověřit, že opravy
nezavedly nové vady — zvlášť neutrální kótu v prázdném prostoru
(nový prvek, který porota neviděla) a dynamickou legendu v krajních
zadáních. Skóre 2/5 u šesti lenzů je hluboký propad proti kolu 06
(0 kritických); poučení je v tom, že osm úprav bez poroty za sebou
znamenalo osm úprav bez měření.

## Kolo 08 — 14 regresí po kole 07, kóta cizího způsobu zrušena (2026-09-22)

URL: `/posts/kalkulator-na-planovani-pudniho-profilu`. Porota dostala
v zadání výslovný úkol ověřit šest prvků, které zavedlo kolo 07, a
u každého nálezu rozhodnout, jestli jde o **regresi**, nebo o starší
vadu; skeptik to pak prověřoval i proti tomuto logu a proti `git show`.

| Oblast | Skóre |
|---|---|
| Hierarchie | 2/5 |
| Typografie | 2/5 |
| Pohyb | 2/5 |
| Grafický styl | 3/5 |
| Slop | 2/5 |
| Výkon a přístupnost | 3/5 |
| Rozložení | 2/5 |

**24 nálezů prošlo skeptikem, z toho 3 kritické a 14 REGRESÍ.** Tohle
je hlavní výsledek kola: většinu vad zavedla oprava předchozího kola.
Kolo 07 si přitom samo do „Hranic ověření" napsalo, že novou kótu
v prázdném prostoru musí prověřit kolo 08 — předpověď vyšla.

### Zrušeno: šedá kóta „+X cm / při zapravení"

Nápad vyplnit prostor nad terénem kótou nezvoleného způsobu odmítlo
**pět nezávislých lenzů** a skeptik ho potvrdil jako kritický:

- **Kolize popisků ve dvou ze tří předvoleb půdy.** Hlinitá vykreslila
  „odvoz" a „při zapravení" přes sebe jako jeden řetězec (10,1 × 13,4 px
  na 1440, 43,6 × 13,5 px na mobilu); Písčitá položila popisek na hnědý
  blok v kontrastu 1,1:1 (78–84 % délky popisku). DESIGN.md 9.2 p. 3
  kolize text × text jmenovitě zakazuje.
- **Nejhlasitější číslo v kresbě patřilo způsobu, který uživatel
  nezvolil**, zatímco číslo zvoleného způsobu v kresbě nebylo vůbec.
- Kóta srážela kresbu zvoleného způsobu na 9,5 px, zaváděla čtvrtý
  typografický stupeň, měla linky v kontrastu 1,37:1 a v přístupném
  jméně chyběla úplně.

Kóta je pryč i s konstantním rámem, který existoval jen kvůli ní. Rám
se vrátil k ořezu podle zvoleného způsobu; zbylý posun okolí při
přepnutí (22,5 px) skeptik snížil na kosmetický.

### Další opravy

- **Komentář lhal, když se odváží celý profil** (kritický, slop). Při
  100 % písku a nulových příměsích tvrdil „horní část" a „zbylou
  zeminu", ačkoli šrafa pokrývala celý blok a `keepM3` bylo 0. Texty
  i legenda teď jmenují jen materiály s kladným dovozem
  (`Odvezete celou stávající zeminu … a nahradíte ji … — písek, biochar,
  actino a zeolit`), závorka legendy se skládá ze skutečných složek.
- **Klik na „Zapravit" zhasnul i ovládání** (důležitý, slop). Prázdný
  stav si teď nechá přepínač způsobů a místo obecné výzvy vypíše
  konkrétní hlášku z `calculation.issues` („Při podílu písku 98 % a více
  použijte režim Nová vrstva.").
- **Stupně písma v kresbě se vázaly na šířku okna, ne na měřítko
  kresby** (důležitý ×2). Na zlomu 560 px skákal popisek na 16,5 px,
  tedy výš než odstavec figury, a na 320 px padal na 9,6 px. Kresba má
  teď vlastní `container-type: inline-size` a tři prahy odvozené od
  měřítka viewBoxu. Naměřeno napříč 320–1920 px: **10,5 až 12,7 px**
  (dřív 9,6 až 16,5).
- **Legenda uvnitř kresby sázela tělovým písmem** (důležitý) — jediný
  text v kresbách článku mimo display rodinu. Teď Archivo 600.
- **Pás figury byl vysoký 1214 px a obsah držel levých 36 % šířky**
  (důležitý ×2, 865 px prázdna = 63,6 % pásu). Kresba a text jsou teď
  dva sloupce: kresba 40..520, komentář a závěr 560..1055. Výška figury
  1214 → 950 px.
- **Živá oblast vyhlásila 221 znaků souhrnu hned po načtení stránky**
  (důležitý, přístupnost), zatímco čtenář byl 1 855 px nad kalkulátorem.
  Ohlašuje se až po skutečném zásahu uživatele (příznak se zapíná
  v obsluze polí, přepínačů a ceníku, ne přepočtem odvozeného stavu).

### Neopravené (do kola 09)

Starší, neregresní: blok „Související články" mimo škálu 4.2; stránka
otevírá dvěma obsidiány za sebou; první dotek posuvníku posune sám
posuvník o 20,2 px na mobilu; reveal nechává po zkrácení stránky
sekce v `opacity: 0`; týž mechanismus vysvětlený třikrát; panel „Jak
výpočet číst" bez mřížky. Kosmetické: zelená linka terénu chybí
v legendě, drn bez hrany #2e6440, popiska bez „Obr. NN", vztahové znaky
se lámou na konec řádku, visící `output[for]` na pole ve sbalené sekci.

### Ověření

`tsc` PASS, 26/26 testů PASS. Živě (Playwright): 0 kolizí popisků přes
3 předvolby půdy × 3 způsoby; živá oblast po načtení prázdná a po změně
plochy naplněná; prázdný stav drží přepínač a konkrétní důvod; komentář
i legenda při 100 % písku jmenují skutečné materiály; kresba 40..520
a text 560..1055; popisky 10,5–12,7 px na 320/360/393/500/560/768/1024/
1130/1440/1920 px, přetok 0 na všech. `layout-check.mjs` beze změny.

### Hranice ověření

Dvousloupcová sazba figury a container query jsou nové prvky, které
tahle porota neviděla — kolo 09 je musí prověřit stejně, jako kolo 08
prověřilo kótu. Poučení dvou kol po sobě: **oprava prázdného místa
přidáním obsahu je dražší než oprava přeskupením** — kóta vyplnila
díru a stála pět lenzů, dvousloupec díru zmenšil beze slova navíc.

## Starší nálezy z kol 07 a 08 — vyřešeny mimo kolo (2026-09-22)

Autor si vyžádal, ať se doberou všechny nálezy, které zůstaly ležet po kolech
07 a 08. Postup: devět skupin nálezů dostalo vlastního agenta (diagnóza proti
skutečnému kódu + přesný patch) a každý patch pak oponenta, který ověřoval
aplikovatelnost kotev, dopad mimo stránku a soulad s DESIGN.md. Z 42 navržených
změn se aplikovalo 37 plus čtyři ruční úpravy; **pět změn oponent zamítl**.

### Zamítnuto oponentem (a proč to stojí za zápis)

- **ScrollTrigger.refresh() při změně výšky dokumentu.** Nález „po zkrácení
  stránky zůstávají sekce v opacity 0" byl **měřicí artefakt**: oponent naměřil
  0 z 30 neodkrytých `.rv` ve dvanácti bězích (1440 i 393 px, s gestem i bez,
  plynulé rolování i skok na konec), zatímco původní měření vidělo 6 z 30.
  Rezerva mezi posledním spouštěčem a koncem rolování je 1026 px, takže po
  zkrácení o 861 px nemá co uváznout. Patch by navíc porušil DESIGN.md 6.3.0
  („refresh jen po fonts.ready + load; nikdy v resize handleru").
- **Čtyři zápisy do DESIGN.md o kontrastu obrysů.** Patch chtěl zapsat, že
  `--id-line-dark` má 2,09:1; oponent spočítal **1,45:1** (token je
  `rgba(255,255,255,0.14)`, 2,09:1 patří natvrdo psané `.24`). Do závazného
  dokumentu nepíšeme čísla, která neprošla druhou rukou.
- **Rezerva ve výřezu kresby** (neúčinná: `Math.max(0, …)` ji u „Zapravit"
  stejně srazí na nulu, naměřeno bitově stejných 503,6 px se změnou i bez ní).

### Opraveno

**Pohyb a layout.** Nápověda typu půdy i nápověda způsobu přípravy jsou teď
mřížkový stoh všech variant, takže blok měří nejdelší větu při AKTUÁLNÍ šířce.
Posuvník poměru se na mobilu při první změně posouval o 20,2 px (nápověda nad
ním narostla z 2 na 3 řádky), přepnutí způsobu posouvalo pole zadání o 22,5 px.
Naměřeno po opravě: **0,0 px v obou případech**. `min-height` by díru udělal
i tam, kde dnes žádná není; stoh rezervuje jen to, co je při dané šířce potřeba.

**Mikrointerakce.** Segmenty přepínače měly přechod 0,18 s (pod pásmem 200-400 ms
z 6.2) a nevybrané dlaždice nad kresbou obrys 1,28:1 proti krému (11.1 žádá 3:1).
Teď tokeny pohybu a `--id-ink-3` s 3,32:1; hover míří jen na nevybrané dlaždice,
aby nepřebíjel stav `:checked`. Menu kalkulátoru dostalo hover odezvu beze změny
layoutu.

**Kresba.** Drn byl 4px čára bez hrany, jediný tah mimo rozsah 1,5-2,5 px z 9.2
p. 2. Teď je to pás s hranou `#2e6440` jako ve všech ostatních řezech článku;
po opravě má kresba **jen tahy 1,6 px**. Legenda drn vypisuje („travní drn"),
takže se přestala tvářit úplně.

**Popiska a nadpisy.** Popiska kresby měla jiný hairline (rgba čerň) než obě
číslované popisky na téže stránce (`--id-mist`); sjednoceno. Dva sourozenecké
h3 měly 24 a 32 px — oba teď sázejí roli `subtitle`, a DESIGN.md 4.2 dostal
větu, která tuhle roli pojmenovává (bez ní si každá komponenta vybrala vlastní
stupeň). Číslo „Obr. NN" kresba nedostala: čísluje se ručně v Payloadu a
kalkulátor není blok `figure`, takže nemá odkud číslo vzít.

**Texty.** Souhrn „Vše dovezete: 30 m³" ignoroval objednávkovou rezervu, zatímco
tabulka hlásila 42,85 m³. Popiska figury potřetí opakovala výklad tří způsobů;
teď nese jen to, co nikde jinde není. Řádek dovozu písku dostal české číslovky
(1 pytel / 2 pytle / 5 pytlů) přes novou sdílenou utilitu `plural` a nabízí jen
balení, která pro dané množství dávají smysl (big bag 1-10 t, ne 29 kusů).

**Sdílené komponenty.** „Související články" sázely H2 24 px / lh 1,333, tedy
mimo škálu 4.2 a nad strop line-heightu z 4.3 p. 7; teď 52 px / 1,05 / balance
jako ostatní sekční nadpisy. Titulek karty 18 px / 1,556 → **17 px / 1,3** podle
7.5, perex na token `body-sm`. Dopad je na všech stránkách, kde se karty
používají, a je to v obou případech návrat do škály.

**Česká sazba.** Vztahové znaky mezi slovy (`:`, `×`, `÷`) se lámaly na konec
řádku. Nové pravidlo `OPERATORY` je drží pevnou mezerou a podmínkou je mezera
PŘED znakem, takže běžná dvojtečka („Pozor: voda"), čas („14:30") ani
„https://…" pravidlem neprojdou. Ověřeno sedmi případy včetně negativních.

**Partitura stránky.** Stránka otevírala 2099 px obsidianu v kuse (hero + panel
kalkulátoru) proti 8.1 p. 2 („dva obsidiany nikdy za sebou") a p. 4 („po
obsidianovém hero vždy krém"). Krémový souhrn se přesunul mezi hero a kalkulátor,
tedy na místo, které mu dává šablona 8.2. Změna je v seederu, ne v DB; projeví
se příkazem `npm run payload -- run scripts/seed-clanek-primesi.ts`, který ale
přepíše ruční úpravy všech tří článků v adminu.

**Přístupnost.** Osm `output[for]` mířilo na pole, která existují jen v rozbalené
sekci Podrobnosti; teď se seznam skládá z právě namontovaných polí (naměřeno 0
visících odkazů). Panel „Jak výpočet číst" byl osamělý sloupec 586 px v pásu
1360 px; teď drží pravou osu 1400 a míru řádku uvnitř sloupců.

### Ověření

`tsc` PASS, 26/26 testů PASS. Živě na 1440 i 393 px: pořadí povrchů
hero(obsidian) → souhrn(krém) → kalkulátor(obsidian); skok při přepnutí způsobu
0 px; skok posuvníku na mobilu 0 px; 0 visících `output[for]`; panel nápovědy
40..1400; H2 52/1,05, karta 17/1,3, perex 14,5/1,55; v kresbě jen tahy 1,6 px;
legenda pět položek včetně drnu; přetok 0.

### Zbývá

Nezasaženo zůstává to, co si oponenti vyžádali nechat autorovi: číslo „Obr. NN"
u kresby kalkulátoru (chce zásah do dat a rozhodnutí, jestli se má kresba
komponenty vůbec číslovat), blok Souvisejících článků stojící na ose 1376 px,
kterou ADR-006 zrušil, a chybějící krémová sekce po hero u třetího článku
trojice `jak-pripravit-a-ulozit-smes`.

## Kolo 09 — legenda uvnitř SVG se ukázala jako past (2026-09-22)

URL: `/posts/kalkulator-na-planovani-pudniho-profilu`. Porota dostala v zadání
devět prvků, které se od kola 08 změnily, a u každého nálezu rozhodovala, jestli
jde o regresi. Podklady poprvé obsahovaly i **snímky jiných stránek** (výpis
článků a dva sousední články), protože poslední dávka sáhla do sdílených
komponent.

| Oblast | Skóre |
|---|---|
| Hierarchie | 2/5 |
| Typografie | 2/5 |
| Pohyb | 3/5 |
| Grafický styl | 2/5 |
| Slop | 2/5 |
| Výkon a přístupnost | 2/5 |
| Rozložení | 2/5 |

**18 nálezů prošlo skeptikem, z toho 4 kritické a 7 regresí.** Tři ze čtyř
kritických mířily na jedno místo: legendu uvnitř SVG.

### Poučení kola: text uvnitř SVG neumí zalomit řádek

Legenda se do kresby stěhovala v kole 07, aby byla pixelově shodná se značkami
(9.2 p. 10). Dobrání starších nálezů jí pak dalo dynamickou závorku se složkami
směsi. Spojení obojího vyrobilo řádek „směs (zbylá zemina + písek + biochar +
actino + zeolit)", který **v SVG nemá jak zalomit**: na 360 px vybíhal 32 px za
okraj okna a končil uprostřed slova, na 371 px a užších ho prahová změna stupně
prodloužila ještě o 50 px. `overflow: visible` znamená, že text neuteče pod ořez,
ale z okna.

Oprava nepřidává mechaniku, ubírá tvrzení: **legenda je klíč barev, ne
receptura.** Řádek zní „promíchaná směs" a výčet složek nese komentář pod
kresbou a popis pro odečítač, tedy místa, kde se text smí zalomit. Naměřeno po
opravě na devíti šířkách 320-1440 px: rezerva do pravé hrany viewBoxu 171 až
217 jednotek, stupeň legendy 10,5 až 12,7 px (podlaha 9.2 p. 3 je 10 px).

Tím padl i třetí kritický nález: v režimu „Zapravit" závorka **zamlčovala
stávající zeminu**, která tvoří 34,7 % nakresleného bloku. Podmínka počítala jen
s režimem „Udržet výšku". Popis pro odečítač teď v obou režimech jmenuje
i zeminu.

### Další opravy

- **Perex karty byl nejmenší text stránky s nejdelší mírou** (98 znaků na řádek
  proti 81 u prózy) — kritický nález ve sdílené komponentě, který zavedla
  minulá dávka tím, že kartu zúžila na 17/1,3, ale perexu míru nedala. Teď
  `max-w-[var(--id-measure)]`, naměřeno 479 px = 33 em.
- **Pásový titulek kalkulátoru byl jediný pod stupněm title**: 40 px proti 52 px
  u kapitoly, FAQ, produktového pásu, CTA i Souvisejících článků. Stupeň 40 px
  ve škále 4.2 vůbec není. Teď `--id-t-title`; naměřeno šest H2 po 52 px.
- **Figura stála na vlastních osách** 480|561 s mezerou 40 px, zatímco zadání
  i nápověda v témže panelu mají 652|652 a mezeru 56 px. Teď sdílí mřížku:
  kresba 40..520, text 748..1400, tedy na ose, kterou panel už používá.
- **Na 1024 px se dvousloupec rozpadal** a pás zůstával ze 43 % prázdný, protože
  zlom byl na 1129 px. Posunut na 1023 px; naměřeno 451|451 bez přetoku.
- **Podtržení vstupních polí mělo kontrast 1,45:1**, přitom je to jediný znak,
  že jde o pole. Token `--id-line-dark` je hairline, ne obrys ovladače; teď
  `--id-ink-dark-3` (4,05:1), shodně s obrysem segmentu opraveným minule.
- Legenda sázela třetí stupeň (13,5 px) vedle popisků 12 px; sjednoceno.

### Neopravené (do kola 10)

Strukturální: tělo článku nese 13 366 px bez jediného nadpisu v title škále
(devět mezititulků 28 px proti šabloně 8.2, která žádá 3-5 kapitol s eyebrow).
Karty jako jediný text webu obcházejí českou sazbu (komponenta si pevné mezery
sama maže). Mezititulky tří tabulek sázejí 17 px s řádkováním 1,65. Dvě ze čtyř
dlaždic souhrnu nenesou číslo, jen jednotku ve stupni čísla. Fokus na poli
„Podíl — Písek" končí ze 70 % pod plovoucí lištou (scroll-margin-top nepomůže,
prohlížeč prvek uvnitř viewportu neposouvá). Kosmetické: vzorek „travní drn"
není pixelově shodný s drnem v řezu, aria-label kresby popisuje jiný stav,
pod nápovědou způsobu zbývá 22 px prázdna, pás kalkulátoru je jediný blok
stránky bez nástupu.

### Ověření

`tsc` PASS, 26/26 testů PASS, `layout-check.mjs` na 1440 beze změny. Živě:
legenda se vejde do viewBoxu na 320/360/371/375/393/430/768/1024/1440 px;
v režimu Zapravit jmenuje popis značek i stávající zeminu; šest H2 po 52 px;
mřížka figury 652|652 shodná se zadáním; na 1024 px dvousloupec bez přetoku;
podtržení pole rgb(108,115,123).

### Hranice ověření

Zkrácení legendy je ústupek: kdo čte jen kresbu, se složení směsi z ní už
nedozví. Je to vědomá volba ve prospěch toho, aby text nevybíhal z okna;
kolo 10 ať posoudí, jestli „promíchaná směs" jako klíč stačí.

## Kolo 10 — první kolo bez kaskády regresí (2026-09-22)

URL: `/posts/kalkulator-na-planovani-pudniho-profilu`. Kolo proběhlo dvoufázově:
nejdřív se dobralo jedenáct nálezů, které kolo 09 nechalo ležet (všechny už
změřené a potvrzené skeptikem, commit `f5862bb`), a teprve nad opraveným stavem
se pustila porota.

| Oblast | Skóre |
|---|---|
| Hierarchie | 2/5 |
| Typografie | 2/5 |
| Pohyb | 3/5 |
| Grafický styl | 3/5 |
| Slop | 2/5 |
| Výkon a přístupnost | 3/5 |
| Rozložení | **4/5** |

**11 nálezů prošlo skeptikem, z toho 1 kritický a 1 regrese** (proti kolu 09:
18 nálezů, 4 kritické, 7 regresí). Rozložení dosáhlo na průchozí známku poprvé
za celou smyčku. Dva nálezy hierarchie skeptik vyvrátil.

Odpověď na otázku, kterou si kolo 09 samo položilo: **zkrácená legenda jako klíč
barev STAČÍ.** Lenz hierarchie to ověřil bodově („každá výplň v řezu má svůj
řádek, řádky jdou v pořadí vrstev, výčet složek nese komentář a popis pro
odečítač a figcaption sám říká, že řez složení záměrně neukazuje") a naměřil,
že popisky se na devíti šířkách 320 až 1440 px vykreslují 10,5 až 12,7 px
a nikde nepřetékají.

### Opravy

- **KRITICKÝ: nápověda nad seznamem příměsí platila pro tři složky ze čtyř.**
  Nad fieldsetem stálo „Podíl počítáme z objemu půdy od povrchu do zadané
  hloubky. Každou příměs můžete zapravit jinak hluboko", ale první položkou
  seznamu je Písek, který příměs není: jeho podíl se počítá z minerálního
  základu (naměřeno 19,01 m³ = 63,4 % z 30 m³, ne 65 %) a jeho hloubka je
  hloubka celého profilu. Nápověda teď obě pravidla rozlišuje.
- **Dvě editovatelná pole pro jednu veličinu.** Řádek Písek měl vlastní pole
  „Hloubka profilu" (28 px) svázané obousměrně s hlavním polem (40 px): zápis
  do malého pole tiše přepsal celý model a dovoz písku spadl z 28,52 t na
  13,89 t, aniž by uživatel sáhl na zadání. Teď je v řádku Písek odečet
  s poznámkou, které pole hodnotu řídí.
- **U předvolby Písčitá bylo největší číslo panelu „0 l" písku**, ačkoli
  nápověda té předvolby sama říká „Další písek se nepřidává". Hero teď ukazuje
  materiál s největším dovozem (naměřeno: Zeolit 1,2 m³).
- **Výstražný seznam běžel 106 znaků na řádek** jako jediný text panelu bez
  míry; doplněna `var(--id-measure)`.
- **Dorovnání fokusu pod plovoucí lištou pokrývalo jen panel**, ne přepínač nad
  kresbou (zakryto 29 px). Posluchač se přesunul na kořen bloku.
- **Ve vynucených barvách zmizel stav vybrané pilulky** u všech přepínačů
  (rozdíl 1,00:1, nativní radio je 1×1 px s opacity 0). Doplněna větev
  `@media (forced-colors: active)` se systémovými barvami.

### Přehodnoceno, neopraveno

**„Panel má pět akcentových čísel, systém povoluje jediné"** — lenz grafického
stylu potvrzen skeptikem, ale tentýž nález **zamítla kola 04, 06 i 07**
s odůvodněním, že čtyři hodnoty „K objednání" nejsou zadání, ale výstupy, na
které se panel ptá, a že `--id-accent-dark` je podle 3.4 obecný token pro
akcentový text pod 30 px, ne barva vyhrazená jedinému číslu. Kolo 10 přichází
s jiným argumentem (počet akcentových ROLÍ, ne odstín), takže spor je otevřený.
Odebrat akcent hlavnímu výstupu panelu je produktové rozhodnutí; **čeká na
autora**, ať smyčka nezačne čtvrtý nález přehazovat sem a tam.

### Neopravené (do kola 11)

Starší: tělo článku bez kapitol v title škále; pravý sloupec figury z 72 až 81 %
prázdný; přepnutí způsobu posouvá obsah o 150 px. Nové kosmetické: hmota
„k odvozu" nemá v řezu obrys, ačkoli vzorek v legendě ho má; legenda sází třetím
stylem popisku; obrys segmentu 1 px místo 1,5 px; značka směsi má dvě hustoty
rastru; číselný závěr figury je nejmenší text bloku; zlom 1023 px rozešel osy
v pásmu 1024 až 1129 px; dorovnávací kód sloupců zadání je mrtvý; článek jede
na gutteru 20 px.

### Ověření

`tsc` PASS, 26/26 testů PASS, `layout-check.mjs` 5 kontrol OK. Živě: jediné pole
hloubky v celém kalkulátoru; nápověda rozlišuje příměsi a písek; míra výstrah
33 em; u Písčité hero „Zeolit k objednání 1,2 m³"; fokus nad kresbou bez
překryvu; ve vynucených barvách má vybraná pilulka Highlight pozadí proti
průhledné nevybrané.

### Rozhodnutí autora po kole 10 (2026-09-22)

- **Čtyři hodnoty „K objednání" zůstávají v akcentu.** Tím je uzavřen spor
  „panel má pět akcentových čísel", který kola 04, 06 a 07 zamítla a kolo 10
  potvrdilo. **Příští porota ho nemá hlásit** — je to vědomé produktové
  rozhodnutí: hodnoty jsou výstupy, na které se panel ptá („kolik navézt").
- Odečet hloubky v řádku Písek sází týž recept jako „K objednání" (číslo
  v akcentu 28 px, jednotka menší), takže řádek čte jako jeden celek.
  Poznámka „Řídí ji pole „Hloubka profilu" v zadání" je pryč: dědila 28px
  písmo hodnoty (selektor `__readout > p` chytil oba odstavce) a autor ji
  shledal zbytečnou.

## Kolo 11 — nejlepší kolo od kola 07 (2026-09-22)

URL: `/posts/kalkulator-na-planovani-pudniho-profilu`. Porota dostala rozhodnutí
autora (akcent „K objednání") mezi uzavřené věci a instrukci neopírat skóre
o odložené nálezy ani o nálezy, které skeptik pravděpodobně vyvrátí.

| Oblast | Skóre |
|---|---|
| Hierarchie | 3/5 |
| Typografie | **4/5** |
| Pohyb | 3/5 |
| Grafický styl | 3/5 |
| Slop | 2/5 |
| Výkon a přístupnost | 2/5 |
| Rozložení | **4/5** |

**8 nálezů prošlo skeptikem, z toho 1 kritický** (kolo 10: 11 / 1). Dva lenzy
na průchozí známce. Jediný nález hierarchie (odečet hloubky v režimu Zapravit)
skeptik vyvrátil.

### Opravy

- **KRITICKÝ: ve vynucených barvách byl text vybrané volby neviditelný (1:1).**
  Regrese po opravě z kola 10: `color: HighlightText` — Chromium ve vynucených
  barvách kreslí za text čitelnostní podklad v barvě Canvas a HighlightText na
  něm splyne. Barva textu se už nenastavuje; stav nese pozadí Highlight a obrys
  3 px. Ověřeno snímkem v tmavém i světlém kontrastním motivu, ne jen
  getComputedStyle.
- **Dorovnání fokusu posouvalo stránku i po kliknutí** (regrese z kola 10):
  pilulka ujela zpod kurzoru. Fokus z ukazatele se teď přeskočí (příznak
  z `pointerdown`, `:focus-visible` nestačí, textová pole ho mají i po
  kliknutí) a zakrytá zóna se bere ze skutečného obdélníku kapsle, jen kde se
  s ní prvek kryje i vodorovně. Naměřeno: klik 0 px, Tab na pole pod lištou
  končí 12 px pod ní.
- **Kóta „+2,2 cm" (pointa kresby v akcentu) ležela přes drn a zeminu bloku
  „před"** při malém navýšení (předvolba Písčitá, průnik 65 × 23 px). Kóta se
  drží nejníž nad drnem bloku „před"; naměřen průnik 0.
- **Řez nazýval jediný materiál „promíchanou směsí"** (čistá zemina v Nové
  vrstvě, čistý písek po úplném odvozu). Směs je teď až od dvou složek bloku
  „po" (ponechaná zemina se počítá); jediný materiál má vlastní značku
  a jméno („dovezená zemina", „písek" v barvě #c2a052, s legendou v témže
  panelu podle 9.2 p. 10, úroveň 2) a texty ho skloňují („navezete zeminu",
  „30 m³ zeminy").
- Kosmetické, levné: nulový dovoz — hero „K objednání: nic", verdikt „nic se
  neobjednává", bez věty o rezervě; souhrn pro odečítač začíná tímtéž
  materiálem jako hero a nulové dovozy vynechá; Actino s velkým A i uvnitř
  věty; lead kresby zavírá uvozovky českou „; dráha posuvníku je vidět
  i ve vynucených barvách.

### Poučení z ověřování

Dvakrát jsem naměřil „skok" 152 a 1 968 px po kliknutí — v obou případech
artefakt: měřil jsem uprostřed setrvačníkového dojezdu po vlastním `scrollTo`
a klik netrefil pilulku (`pointerdown` na `HTML`). Záznam volání `scrollBy`/
`scrollTo` ukázal, že kalkulátor sám nescrolluje. **Před měřením posunu vždy
počkat na ustálení scrollY a klikat lokátorem, ne souřadnicí.**

### Zbývá

Kosmetické z kola 11: hero a „K objednání" v jiné primární jednotce (m³ proti
t/kg/l), pořadí materiálů se mezi zadáním a výsledkem liší, panel „Jak výpočet
číst" a titulek menu obcházejí českou sazbu, perexy karet končí jediným slovem,
odkazy v těle ve váze 500, hmota „k odvozu" bez obrysu, obrys segmentu 1 px,
dvě hustoty rastru směsi, odečet v řádku Písek se na 320 px zalomí, mrtvý kód
AlignedInputColumns. Plus tři odložené (kapitoly, pravý sloupec figury, posun
při přepnutí).

## Kolo 12 — kritický nález v textu, ne v kresbě (2026-09-23)

| Oblast | Skóre |
|---|---|
| Hierarchie | **4/5** |
| Typografie | **4/5** |
| Pohyb | 3/5 |
| Grafický styl | 3/5 |
| Slop | 2/5 |
| Výkon a přístupnost | 3/5 |
| Rozložení | **4/5** |

**9 nálezů prošlo skeptikem, z toho 1 kritický** (kolo 11: 8 / 1); čtyři
z devíti skeptik snížil na kosmetické. Tři lenzy na průchozí známce,
hierarchie poprvé od kola 06 bez jediného důležitého nálezu. Dvě potvrzené
regrese, obě z dorovnání fokusu v kole 11.

### Opravy

- **KRITICKÝ: komentář u kresby tvrdil, že se příměsi zapraví „do celé
  stávající zeminy“** (Zapravit) a že Nová vrstva je „hotová směs až po
  úroveň terénu“. Výpočet je dává jen do svých zón (Actino a biochar 10 cm,
  zeolit 15 cm); čtenář podle komentáře by je rozmíchal do celého profilu,
  2–3× zředěné. Nápověda režimu přitom mluvila o zónách — dva texty jedné
  komponenty si protiřečily. Starší vada (kolo 08), ne regrese. Komentář se
  teď skládá z `incorporationDepths`: „Písek zapravíte do celé stávající
  zeminy, příměsi jen do své zóny: biochar a Actino 10 cm hluboko, zeolit
  15 cm.“ Zóna oříznutá hloubkou profilu se jmenuje „po celé hloubce“.
- **Regrese: příznak z `pointerdown` zůstal nabitý**, když klik fokus
  nepřenesl (dvojklik, druhý klik do pole, druhé tažení), a spolkl příští
  fokus z klávesnice — pole skončilo pod kapslí. Příznak teď shodí i
  dokončený klik (`setTimeout` po `click`, aby fokus z labelu stihl přijít)
  a jakákoli klávesa. Naměřeno: dvojklik + Shift+Tab → pole na 86 px.
- **Regrese: dorovnání měřilo skryté rádio 1 × 1 px**, ne viditelnou
  pilulku; pilulky zasahující do kapsle jen pravou částí (Nová vrstva,
  Vlastní, €) zůstaly až z 88 % pod ní. Měří se sourozenecký `span`.
  Naměřeno: šipka na Novou vrstvu → pilulka na 86 px.
- **Klik do textu přesunul fokus na obal `#obsah`** (tabindex −1 kolem celého
  těla článku, od a47ee02) a další Tab odskočil o 0,7–2,7 tisíce px na
  začátek článku. Kotva je teď prázdný prvek PŘED tělem; platí pro všechny
  články. Naměřeno: klik na „Zadání“ + Tab → další ovladač, posun 0; šipka
  v heru dál vede do článku.
- **Titulek menu „Podrobnosti o směsi“ nechával „o“ na konci řádku** na
  360–414 px. Titulky i nápovědy menu, panel „Jak výpočet číst“, verdikt
  a nápověda cen prochází `nezlomitelneMezery`.
- Kosmetické, levné: kóta malého navýšení stojí nad drnem bloku „po“, ne
  nad blokem „před“; „+0 cm“ při drobném zapravení zmizelo (příznak navýšení
  se bere ze zaokrouhlené hodnoty, řádek „Zvýšení terénu“ má touž přesnost
  a zápis jako kóta); nulový dovoz ukazuje jen hero, výšku a verdikt „Zadání
  je konzistentní.“ (bez tabulky nul, odvozu 0 l, cen a věty o rezervě
  i v zadání); verdikt nemá vlastní živou oblast (ohlašuje souhrn); souhrn
  vynechá nulový odvoz; prázdný stav kresby posílá k přepínači jen u chyby
  poměru; směs bez zeminy má pískový podklad s tmavými zrny; písek plošně
  s krytím 0,55 jako okrová hmota Obr. 02; pilulky 14 px / 600 podle Seg;
  kresba ve vynucených barvách nese svůj krém (tmavý motiv: popisky 3,23:1).

### Neopraveno

- **Rámec skupiny `.id-seg` (7.7)** — vybraná pilulka má siluetu primárního
  tlačítka. Recept je `inline-flex` bez zalomení; čtyři typy půdy se na
  320 px do jednoho rámce nevejdou. Potřebuje rozhodnutí, jak skupina
  zalamuje.
- Pás kalkulátoru bez nástupu (kolo 09, kosmetické) — nástroj má být vidět
  hned.
- Zlom figury 1024–1129 px — záměrný posun z kola 09, čeká na autora.
- Kosmetické z kola 11: hero v m³ proti „K objednání“ v t/kg/l, pořadí
  materiálů mezi zadáním a výsledkem, perexy karet s jedním slovem, odkazy
  v těle 500, „k odvozu“ bez obrysu, odečet v řádku Písek na 320 px, mrtvý
  kód AlignedInputColumns.

### Ověření

`tsc` čistý, 26 testů, `svg-labels` 0 kolizí a 0 ořezů na 320/393/1440,
`layout-check` beze změny (známý falešný poplach jednorázových os).
Komentáře prošly všechny tři předvolby × tři způsoby a krajní zadání
(100 % písku + zeolit, drobné zapravení 0,02 cm, nulový dovoz).

---

# Článek „Jak připravit a uložit směs“ (/posts/jak-pripravit-a-ulozit-smes)

Třetí článek série o půdě pod trávník, vzniklý rozdělením 21. 9. Porota ho
v kole 01 viděla poprvé.

## Hero: menší stroj (2026-09-23, před kolem 01)

Autor: rotavátor na hero fotce vypadal, jako by kopal metr do hloubky, přitom
bere nejvýš 30 cm. První pokus (rozšíření scény na 4:3, postava na 32 %
výšky) autor odmítl: **zahradník má zůstat stejně velký, menší má být jen
stroj.** Druhý pokus: úprava původní fotky (nano_banana_pro, reference =
master), dvě varianty; vybrána A (motor u kolen, rotor ≈ 30 cm mělce v kypré
půdě; varianta B měla rotor nad zemí, jako by stroj nepracoval). Master
3840 × 1629, portrét 1080 × 1920 z plné výšky se středem na postavě se
strojem. Fokál 85/50, portrétový fokál 72/50 (85 na šířkách 561+ na výšku
vyřízl celého člověka). Zálohy a varianty:
`zdroje-informaci/fotky/kandidati-priprava/`.

## Kolo 01 — rám série a kotvy (2026-09-23)

| Oblast | Skóre |
|---|---|
| Hierarchie | 2/5 |
| Typografie | **4/5** |
| Pohyb | 2/5 |
| Grafický styl | 2/5 |
| Slop | 2/5 |
| Výkon a přístupnost | 2/5 |
| Rozložení | 2/5 |

**17 nálezů prošlo skeptikem, z toho 4 kritické.** Porota hodnotila hero
ještě s rozšířenou fotkou (první pokus), nálezy k fotce jsou přeměřené na
živé.

### Opravy

- **KRITICKÉ (Rozložení): próza nalepená na hero (0 px) a 6 574 px bílé na
  393 px** (strop 8.1 p. 3 je 6 000). Obojí z dnešního přepisu kapitoly 01,
  který odebral krémový split „ukládání odspodu“, a z chybějícího rámu
  série. Nový **krémový souhrn** za hero (lead z úvodního odstavce, dlaždice
  30 cm / 2–6 týdnů / 25–30 g/m² / 8–10 cm), **nová kresba
  `michani-od-hloubky`** (tři průchody: základ do 30 cm → zeolit do 15 cm →
  biochar a Actino do 10 cm; „Potom už nefrézovat do hloubky“) v krémovém
  splitu místo h3 a próza, **CTA pás** místo osiřelého odstavce mezi FAQ
  a Souvisejícími. Nejdelší bílá: 393 px 6 574 → 2 619, 1440 px 4 779 → 2 080.
  Shrnující čtvrtý odstavec je za pásem (v těle splitu přerůstal kresbu
  o 40 %).
- **KRITICKÝ (Pohyb): přímý odkaz s kotvou končil 60 až 4 800 px od cíle.**
  Dvě příčiny za sebou: (1) prohlížeč jel ke kotvě plynule (`html {
  scroll-behavior: smooth }`) k cíli spočítanému před dokončením layoutu
  a refresh ScrollTriggeru jízdu přerušil; (2) cílová sekce měla v tu chvíli
  posun revealu 30 px, se kterým prohlížeč počítal. Plynulé posouvání se
  zapíná až 1,5 s po `load` (třída `plynule` z layoutu), sekce s cílem
  kotvy se při načtení neodhaluje a po každém refreshi během načítání se
  kotva dorovná z polohy v layoutu (`offsetTop`, ne `getBoundingClientRect`),
  dokud čtenář nezasáhne. Naměřeno 8 z 8: nadpis přesně na 124 px. Platí pro
  všechny stránky.
- **KRITICKÝ (Výkon): eyebrow na telefonu 2,6:1** (393 × 660; 1280 × 720:
  3,1). Na nízkých oknech stál v 58–60 % odspodu, kde scrim 9.1 mizí. Scrim
  ukotvený k textovému bloku jako u kalkulátoru. Naměřeno maskou glyfů
  (nejsvětlejší bod): eyebrow 8,8 až 11,4:1 na 360 × 640 až 1440 × 900.
- **Telefon stahoval hero dvakrát** (portrét + nepoužitý master w=3840,
  264 kB): preloady byly dětmi `<picture>`; stojí teď před ním. iPhone 14
  Pro i Pixel 7 stahují jen portrét (80 kB).
- **Obr. 02 (dřív 01): text „deset centimetrů pod kořínkem“, kresba 12 cm.**
  Kapka posunutá na 13 cm (3 + 10), štítek i alt sjednocené.
- Opakování „ne patra, ne kbelíky“: z úvodu (teď lead souhrnu) a z odstavce
  o dodávkách vypuštěno, v těle zůstává pod míchacím splitem a ve FAQ.
  Dlouhá pomlčka v těle splitu nahrazena půlčtverčíkem.

### Neopraveno, čeká na autora

- **Kapsle hlavičky na telefonu zakrývá temeno zahradníka** (důležitý).
  Portrét má postavu přes celou výšku; řešení je přidat nebe nad hlavu, ale
  postava by na telefonu byla asi o 15 % menší — v rozporu s „stejně veliký“.
- **Studené zatažené světlo hera proti teplému nízkému slunci sester**
  (důležitý, ~7 000 K proti ~4 200 K). Přegradování změní náladu fotky,
  kterou autor právě schválil.
- Kosmetické: dvě kapitoly místo tří (první péče bez vlastní kapitoly),
  titulek kapitoly 01 parafrázuje H1, pětkrát ohlášený obsah, pozůstatky
  po rozdělení („mezi zahradami“, „u zdejšího modelu“), FAQ opisuje tělo,
  zeolit „20 cm“ bez opory v modelu, split pod 1130 px má titulek 66 px od
  kresby, odkazy v těle 500, tracking popisků 0,08 em na telefonu.

### Ověření

`tsc` čistý, 26 testů, `svg-labels` 0 kolizí a 0 ořezů na 320/393/1440
(obě kresby, min 10,5 px), `layout-check` 393/1024/1440/1920 beze změny
(známý falešný poplach jednorázových os), střídání splitů R L.

## Přestavba na rytmus obraz/text (2026-09-23, po kole 01)

Majitel: *„jsou tam příliš dlouhé odstavce textu, klidně obrázek text, text
obrázek, ale inspiruj se zlatými standardy. Sloupeček textu ve středu
monitoru je špatně."* Plán vybrala porota tří návrhů (fotografie nese
rytmus 22 b. / rytmus čtení 18 / kresba vykládá 15) + syntéza s roubováním.
Zapsáno do DESIGN.md 8.2b p. 8 (v2.10) a ADR-006 dodatek 2.

- Deset dvousloupců R L R L R L R | předěl (fotka) | L R L; 23 uzlů prózy
  ze středového sloupce → 0; kapitoly = eyebrow + H2 uvnitř splitu.
- Odstavce autora jen rozdělené na hranicích vět (98/98 vět, 10/10
  nadpisů, 6/6 tučných, 5/5 odkazů); nejdelší 655 → 378 znaků. Obsah je
  datový modul `scripts/lib/preparation-rhythm-content.ts` vygenerovaný
  z ověřeného plánu; `applyPreparationRhythm` přestavbu odmítne, když se
  text nebo pořadí nadpisů liší (pomlčky – a — bere jako týž glyf).
- Blok split: fotka místo kresby (`photo`, `photoRatio` 4:5/1:1, slot 652),
  pokračování bez titulku (`continues`, modulová mezera), mezititulek
  „### " v těle.
- Obrazy: 6 fotek ve splitech (ořezy fig-dodavka-materialu-ctverec,
  fig-ryc-zahon-ctverec + nové fig-useky, fig-louze, fig-osivo-luzko,
  fig-mlady-porost), předěl fig-pripravena-plocha (+ portrét 4:5), 4 kresby
  (michani-od-hloubky, nové **kontrola-sondou** a **mykorhiza-pod-osivem**,
  prvni-korinek). Fotka vidlí vyřazena (známý AI artefakt). Nové kresby
  prošly oponentem: zeolit ve vývrtu „až na dno" na polovinu, ne čtvrtinu;
  kořínky mykorhizy 3,5 cm jako v prvni-korinek; legenda „kontakt" pro
  jediný akcent.
- Hero: menší stroj (edit původní fotky) + teplé podvečerní světlo
  (nové nasvícení, 6 000 → 4 180 K), obojí na přání majitele.

## Kolo 02 — první kolo bez kritického nálezu (2026-09-23)

| Oblast | Skóre |
|---|---|
| Hierarchie | **4/5** |
| Typografie | **4/5** |
| Pohyb | 3/5 |
| Grafický styl | 3/5 |
| Slop | 2/5 |
| Výkon a přístupnost | 3/5 |
| Rozložení | 3/5 |

**0 kritických**, skeptikem prošlo 6 nálezů (4 důležité, 2 snížené).

### Opravy

- **Osivo ve dvou podobách a AI zrna** (styl): Obr. 09 přegenerováno —
  štíhlá travní semena naplocho na přiváleném lůžku se stopou válce;
  z předělu Obr. 08 vymazána semena velikosti 2–3 cm i světlý hrudovitý pás.
- **Popisek Obr. 09 tvrdil opak fotky** (slop): přepsán podle fotky i těla.
  Popisky Obr. 01, 02, 03, 06 a předělu už neopakují tělo ani titulek
  kapitoly 02; pointa kresby Obr. 04 je „30 → 15 → 10 cm" místo věty,
  která zdvojovala H3.
- **Hero 274 kB na retina desktopu** (výkon, limit 260): master hera
  i předělu 2 880 px s lehkým potlačením šumu → 191 kB / 203 kB (w=3840
  vrací 2 880, Next nezvětšuje). Světlo, stroj ani postava beze změny.
- **Živé přepnutí prefers-reduced-motion házelo na začátek článku**
  (pohyb; i na vzorovém článku): GSAP po revertu zapíše scroll 0 a reaguje
  dřív než jakýkoli náš posluchač — Motion.tsx drží poslední známou pozici
  ze scrollu a po refreshi ji vrátí. Naměřeno: 6 343 → 6 343 oběma směry.
- Složený split (≤ 1129): titulek k obrazu jen row-gap; pokračování bez
  prázdného řádku hlavy (modulová mezera, ne pásová). Titulek h3 v hlavě
  splitu bez vlastní marže (24 px podle 5.1, dřív 42). `sizes` fotek ve
  splitu popisují plynulý slot 1130–1439.

### Neopraveno

- Hero je jiná zahrada (kovový plot) než série (prknový plot) — rozhodnutí
  majitele. Kosmetické: tón půdy Obr. 03 světlejší než zbytek série, odraz
  v louži sytější než plot, Obr. 10 prázdno ve viewBoxu, pointa 24 px
  se na telefonu neškáluje (koš B), mezera odstavců 18 vs 22 px (koš B),
  zeolit v plné směsi kreseb řidší než v samostatné vrstvě.

### Ověření

`tsc`, seed s kontrolou textu, na 393/1024/1440: volná próza 0, R L R L R
L R L R L, text : obraz 0,64–0,84 (1440), nejdelší bílá ≤ 3 521 px, kotvy
11/11 na 124 px, `svg-labels` 0 kolizí (min 10,6 px), `layout-check`
0 jednorázových os.

---

# Článek s kalkulátorem — rytmus obraz/text (/posts/kalkulator-na-planovani-pudniho-profilu)

## Přestavba na rytmus obraz/text (2026-09-23)

Majitel: „uprav stejným způsobem i tento článek" (DESIGN.md 8.2b p. 8).
Vše mezi krémovým souhrnem a FAQ přestaví `applyProfileRhythm`
(scripts/lib/profile-rhythm.ts) podle `profile-rhythm-content.ts`:
dvousloupce, pás kalkulátoru hned za kapitolou „Co zadat", tabulka
příkladu na bílé, předěl přes celou šířku (přívěs se zeminou místo
zdvojené fotky hera) a CTA složené doslova z posledního odstavce. Text
autora jen rozdělený na hranicích vět; přestavba spadne, když se text
nebo nadpisy liší znak po znaku. 4 nové kresby výpočtů (podíl z vlastní
hloubky, odečet příměsí, písek podle předvolby, rezerva dělením) prošly
oponentem. Commit af67bdb.

## Kolo 01 (2026-09-23)

| Oblast | Skóre |
|---|---|
| Hierarchie | **4/5** |
| Typografie | 3/5 |
| Pohyb | 3/5 |
| Grafický styl | 3/5 |
| Slop | 3/5 |
| Výkon a přístupnost | 3/5 |
| Rozložení | 2/5 |

**0 kritických**, skeptikem prošlo 7 nálezů (6 důležitých, 1 snížený).

### Opravy

- **Reveal pod kalkulátorem mimo obrazovku** (pohyb): rozbalené panely
  kalkulátoru mění výšku o +300 až +1 350 px, spouštěče drží staré
  pozice. Motion.tsx hlídá výšku `.id-article` přes ResizeObserver
  a přepočítá ScrollTrigger nejvýš jednou za snímek.
- **Obr. 04 obracel barevný klíč** (styl, slop; dva nálezy): hrubší =
  písek (okrová), jemnější = zemina (hnědá), směs = písek s hnědými
  tečkami v mezerách (nasetý rozsyp, ne tapeta). Jména hmot pod sloupci,
  stejná šířka sloupců, linka součtu leží přesně na 174 + 94, pata
  s větou ve verzálkách zrušena, pointa je kóta „hladina po slehnutí".
- **„PLOCHA 100 M²", „DO 15 CM"** (typografie): Obr. 03 sází jednotky
  v tspan `.sv-val` bez verzálek, jen štítek zůstává `.sv-lbl`.
- **Hero 320 kB na retina** (výkon): master fig-dodavka-materialu
  přeexportován na 2 880 px (jako ostatní 21:9 mastery), portrétová
  varianta 1304 × 1630.
- **K01 na 1130–1205 px: text 136 % fotky** (rozložení): pokus
  rozdělit K01 na dva splity s novou kresbou dal poměr 0,49 (prázdná
  kresba), vrácen. Místo toho rám 2:3 (`photoRatio: '2:3'`,
  `.id-split__foto--vysoka`) a nová vysoká fotka měření plochy.
  Poměr text : obraz 0,90–1,15 na 1130, 0,65–0,91 na 1440.
- **Dvě obrazové hmoty vlevo za sebou** (rozložení, sníženo): K01 přepnut
  na image-right → R | patka L | R L R L [tab] R | předěl | L R.
  `layout-check` nově počítá do střídání i kresbu patky kalkulátoru
  (jen ≥ 1130 px, pod tím se dvousloupec skládá pod sebe).
- Kosmetické: bílý proužek mezi krémovým pásem a předělem zrušen švem;
  popisky Obr. 03, 04, 05, 08, 09 a předělu přepsány jako klíč ke
  čtení obrazu (neopakují tělo, předěl nesahá na tabulku o 2 275 px výš).

### Neopraveno (kosmetické)

Odkaz „↑ Do kalkulátoru" z pozdějších kapitol, pojistka `.rv:focus-within`
proti inline stylu GSAP, `sizes="33vw"` karet Souvisejících článků,
re-reveal po návratu z reduce, trigger krémových splitů od paddingu pásu,
tuny v Obr. 06 dvojím zápisem, mezery h3 v hlavě 24 vs 14 px a odstavců
18 vs 22 px (koš B), prázdný displej váhy na fotce Obr. 08, kapitola 04
krém | bílá | krém kvůli tabulce.

### Ověření

`tsc`, seed s kontrolou textu (97/97 vět, 8/8 nadpisů), na 393/1024/1130/
1440/1920: volná próza 0, střídání R L R L R L R L R (≥ 1130), kotvy
11/11 na 124 px, `svg-labels` 0 kolizí (min 10,5 px), `layout-check`
0 jednorázových os.

---

# Článek o příměsích — rytmus obraz/text (/posts/pisek-biochar-a-dalsi-primesi)

## Přestavba na rytmus obraz/text (2026-09-24)

Majitel: „to stejné s tímto článkem" (DESIGN.md 8.2b p. 8). Plán vybrala
porota tří návrhů (fotka · kresba · rytmus čtení, 20 : 15 : 20), syntéza
a nezávislá kontrola (23 vad, opraveno nebo doloženě vyvráceno). Vše mezi
souhrnem a FAQ přestaví `applyPrimesiRhythm` (scripts/lib/primesi-rhythm.ts)
podle `primesi-rhythm-content.ts`: 18 dvousloupců, karty složek a obě
tabulky jako moduly, text autora jen rozdělený na hranicích vět (15/15
nadpisů). Otevřený panel karet nese fotku vpravo, proto se počítá do
střídání stran (layout-check to nově umí). Kresby: 9 nových (kreslíř →
oponent → oprava → ověření → oprava), 4 upravené; `tri-zony-biovin`
a `tri-zahrady` vyřazeny (zdvojení s tri-zony v článku o půdě a s tabulkou
dávek). Fotky: jediný nepoužitý master série (míchací deska) + tři nové
čtverce z generátoru (sonda s metrem, číslice retušované do neostrosti;
vzorky půd; drobtovitá hlína) místo tří nejslabších kreseb. CSS: pokračování
oddílu na krémovém pásu bez bílého švu. Commit 7187ef8.

## Kolo 01 (2026-09-24)

| Oblast | Skóre |
|---|---|
| Hierarchie | 2/5 |
| Typografie | **4/5** |
| Pohyb | 3/5 |
| Grafický styl | 3/5 |
| Slop | 2/5 |
| Výkon a přístupnost | 3/5 |
| Rozložení | **4/5** |

**0 kritických**, skeptikem prošlo 7 nálezů (4 důležité, 3 snížené).

### Opravy

- **Obr. 01 lhal titulkem „Stejné složky, jiný úkol"** (hierarchie i slop):
  vlevo byl jen písek, vpravo jen příměsi, a hnědá hmota s řídkými zrny
  znamenala v Obr. 12 „pár lopat, vrstvu nezmění". Překresleno: obě pole
  z týchž značek, mění se jen množství; jíl přestavěný převahou písku má
  značku nové směsi série.
- **Tip o betonářském písku jako sloupeček na ose** (hierarchie): Split umí
  řádek „> " = modrý rámeček v těle; tip stojí v A3 na původním místě toku
  textu (přestavba ho vkládá do kontroly textu). PranyPisek zvětšena na
  viewBox 520 × 680, cesta vody vede mezerami, ne přes zrna.
- **Obr. 02 a Obr. 09 byly jeden záběr** (styl): vzorky půd přegenerovány
  jako nový záběr na záhonu u trávníku s plotem a nízkým sluncem
  (reference = sonda), míchací deska zůstala jen jednou.
- Snížené na kosmetické, opraveno: složené pokračování za pokračováním
  mělo třetí prázdný řádek mřížky (specificita 0,3,0); Obr. 05 uvádí
  hustoty zeolitu a Actina z kalkulátoru v popisku i altu; alt hera platí
  i pro ořez na telefonu (tam rýč ani biochar nejsou).
- Kosmetické, opraveno: titulky obou tabulek; Obr. 08 má tři ostré zóny
  0–10 / 10–15 / 15–30 cm; ≈ a ≠ v Obr. 06 jako cesty (Archivo je nemá);
  prstenec přidaného biocharu v legendě na políčku zeminy; klíny v Obr. 14
  rozlámou utuženou vrstvu na kry; fotky ve splitu bez radiusu na telefonu
  (`.prose img`); sjednocení série: nadpis kresby x 40, čip plochy 28 × 14
  s obrysem, kořen s lemem ≤ 2,4 px; komentáře v kódu kreseb bez odkazů na
  vyřazené kresby.

### Neopraveno

Hero master 1926 px (na retině zvětšený, rozhodnutí majitele o záběru);
mezera odstavců 18 vs 22 px a titulek → tělo 46 vs 24 px (koš B); re-reveal
po návratu z reduce, trigger krémových splitů od paddingu pásu, šipka hera
o 6 px (celý web); alty kreseb delší než ve vzorech; na telefonu tenký
bílý pruh s nadpisem mezi krémem a krémovým panelem kresby; tečka „živiny"
v nabity-biochar a pisek-pod-koreny je táž jako Actino (rozhodnutí série).

## Kolo 02 (2026-09-24)

| Oblast | Skóre |
|---|---|
| Hierarchie | 3/5 |
| Typografie | 3/5 |
| Pohyb | **4/5** |
| Grafický styl | 3/5 |
| Slop | 3/5 |
| Výkon a přístupnost | 3/5 |
| Rozložení | 3/5 |

**0 kritických**, skeptikem prošlo 7 nálezů (3 důležité, 4 snížené).
Opravy kola 01 držely; jedna z nich (nulový okraj rámečku tipu) zanesla
novou vadu.

### Opravy

- **Rámeček tipu se lepil na další odstavec** (typografie; vada z kola 01):
  pravidlo `margin-block: 0` přebilo mezeru `space-y` těla. Pravidlo pryč,
  mezery v těle A3 měří 18 · 18 · 18 · 18 · 18 px.
- **Tabulka dávek přetékala na 561–1267 px** (rozložení; hierarchie snížil
  skeptik): slovní buňka v číselném sloupci (mykorhiza) držela `nowrap`
  a vynutila 1 188 px. Table dává buňce bez číslic delší než 16 znaků
  třídu `ta-proza` (zalomit smí); skryto 0 px na 768/1024/1130/1180/1440
  i v článku s kalkulátorem.
- **Po živém přepnutí reduce → no-preference kolečko ujelo 270 px místo
  3 444** (pohyb, celoplošné): ScrollTrigger si zapamatoval plynulý scroll
  z `html.plynule` a po každém refreshi ho zapsal inline přes `auto`
  setrvačníku. InertiaScroll teď `scroll-behavior` drží MutationObserverem,
  dokud běží; `html.plynule` platí jen bez omezeného pohybu (dřív svou
  specificitou přebilo pojistku reduce). Změřeno: 3 444 / 3 000 / 3 444 /
  3 444 / 3 000 px pro no-pref / reduce / reduce→no-pref / tam a zpět /
  no-pref→reduce; kotvy všech tří článků dál 124 px.
- Snížené, opraveno: Actino v Obr. 17 má značku z Obr. 01 a řez stojí na
  písčité zemině (holá hnědá tečka zůstala zemině); pravé pole Obr. 01 je
  písčitá zemina, ne „písek"; alty všech 14 kreseb začínají sdělením
  a mají ≤ 300 znaků (medián dřív 579).
- Kosmetické, opraveno: pointa Obr. 10 na x 40; tři vzorky půd v Obr. 18
  mají textury z Obr. 10; legenda kořenů Obr. 11 shodná s řezem.

### Neopraveno

Obr. 16 na telefonu předbíhá svůj mezititulek (oprava by přelila tělo E6
nad 120 % na 1130); na dotykovém tabletu na šířku (panel karet zavřený)
stojí dva obrazy vlevo za sebou; Obr. 08 kreslí zóny ostře, FAQ říká „ne
ostrá patra" (opačný požadavek kola 01); drobné rozdíly v řádkování
víceřádkových popisků kreseb; Actino × živiny v nabity-biochar jsou si
značkou blízko (rozhodnutí série).

## Kolo 03 (2026-09-24)

| Oblast | Skóre |
|---|---|
| Hierarchie | **4/5** |
| Typografie | 3/5 |
| Pohyb | **5/5** |
| Grafický styl | **4/5** |
| Slop | **4/5** |
| Výkon a přístupnost | 3/5 |
| Rozložení | **5/5** |

**0 kritických**, skeptikem prošly 2 nálezy (1 důležitý, 1 snížený).
Nejlepší kolo článku; opravy kola 02 držely.

### Opravy

- **Řádky začínaly pomlčkou** (typografie; lead souhrnu, tělo splitu):
  `nezlomitelneMezery` připíná pomlčku ve větě k předchozímu slovu (pravidlo
  POMLCKA, celý web); dlouhá pomlčka sjednocena na „–" v řetězcích článku
  (seeder, obsahový modul, popisky Obr. 03 a 04) a v titulku kalkulátoru.
  Změřeno: 0 řádků začínajících pomlčkou na 320/393/1130/1440 ve všech
  třech článcích.
- **Karty složek: po Enteru fokus mimo obrazovku, Tab proti vizuálnímu
  pořadí** (přístupnost; skeptik snížil, lenz zůstal na 3): v akordeonu
  jsou panely v DOM před kartami (vizuálně stojí nad mřížkou už dřív) a po
  aktivaci klávesnicí jde fokus na nadpis panelu. Vzhled beze změny.
  Změřeno na 393 s dotykem, 480 a 768: Enter → nadpis panelu (top 155 px),
  Tab → odkaz v panelu → karty shora dolů; desktop beze změny.
- Kosmetické, opraveno: rovné uvozovky v FAQ („nabitý“, „jedna ku
  jedné“); čísla osy Obr. 05 jako hodnoty (.sv-val); legenda Obr. 01 bez
  hnědého čipu, který ve scéně není; alt Obr. 03 „shluk zrn“ místo „trs“;
  popisky Obr. 02 a 07 už neopakují tělo.

### Neopraveno

Pointa Obr. 10 a Obr. 18 dole (rozhodovací schémata, rozhodnout pro sérii);
nadpis kresby 24/600 vedle h3 28/500 (koš B); přidaný písek plochý v Obr.
05/06 proti zrnům v Obr. 16; bílá karta štítku v Obr. 18; tři kresby
kapitoly 01 na stejné šabloně; HTML 742 kB kvůli zrnitým texturám kreseb
(DveZahrady, JilJakoVana); `sizes` karet Souvisejících článků (celý web).

## Kolo 04 (2026-09-24)

| Oblast | Skóre |
|---|---|
| Hierarchie | **5/5** |
| Typografie | **4/5** |
| Pohyb | 2/5 |
| Grafický styl | 3/5 |
| Slop | **4/5** |
| Výkon a přístupnost | **4/5** |
| Rozložení | **5/5** |

**0 kritických**, skeptikem prošly 3 důležité nálezy. Pohyb padl na dvou
nových testech (dorolování karet bez omezení pohybu, obnova pozice po
reloadu), které předchozí kola neměřila.

### Opravy

- **Karty složek měly před hydratací všechny panely v toku** (pohyb): po
  hydrataci se modul srazil o 1 839 px (1440) / 4 225 px (393) a obnova
  pozice po reloadu či Zpět ujela o tisíce px s CLS ≈ 1. Pod branou
  `html.js` teď drží mřížka týž tvar jako po hydrataci (bez JS brána
  spadne a zůstane přehled všech panelů). Výška modulu před/po hydrataci
  1080/1080 (1440), 1043/1043 (1130), 791/791 (iPhone); CLS 0.
- **Dorolování k otevřenému panelu se zaseklo** (pohyb): ResizeObserver
  v Motion.tsx zavolal ScrollTrigger.refresh uprostřed plynulého scrollu.
  Refresh teď počká, až scroll 160 ms mlčí. iPhone bez omezení pohybu:
  klepnutí 1 → 3 → 0 a Enter na 2 → nadpis panelu vždy 155 px, fokus
  na obrazovce.
- **Obnova pozice po reloadu ujížděla o 50–560 px i ve vzorových článcích**
  (celý web; skeptik vzory měřil jen na jedné pozici): prohlížeč vracel
  stránku vedle, nezávisle na `overflow-anchor`. Inline skript layoutu
  při plném reloadu a návratu z historie vrátí offset uložený při
  `pagehide` (výška stránky je při DOMContentLoaded konečná) a hned vrátí
  `scrollRestoration` na `auto`. Změřeno: reload 2 000–18 000 px ±2 px ve
  všech třech článcích, Zpět po odkazu v textu přesně.
- **Sonda s metrem: díly metru ukazovaly jámu hlubokou asi 18 cm** (styl):
  metr z fotky odstraněn (úprava generátorem, zbytek záběru beze změny),
  fotka už netvrdí měřítko; alt bez metru.
- Kosmetické, opraveno: poslední „—" v Obr. 18; věta popisku Obr. 05.

### Neopraveno

Víceřádkové štítky kreseb mají čtyři řádkování a legendy dvě levé osy
(x 30 / 40); Obr. 08 „plná směs" bez Actina; šipka hera s aktivním
setrvačníkem nepřesune fokus na cíl; přístupné jméno panelu karet
254 znaků (míří na celou kartu); alt fotek Obr. 02 a 09 opakuje výčet
z popisku; plocha s kořenem v Obr. 04 přesahuje pravý okraj série.

## Průvodce půdou — fotografie místo rozšířené prózy (2026-09-25)

URL: `/posts/krasny-travnik-zacina-pod-zemi-2`. Kontrola sedmi čočkami
provedená nad živou stránkou ve dvou kolech; nejde o paralelní porotu.

| Čočka | Kolo 1 | Kolo 2 |
|---|---:|---:|
| Hierarchie | 3/5 | 4/5 |
| Typografie | 4/5 | 4/5 |
| Pohyb | 4/5 | 4/5 |
| Grafický styl | 4/5 | 4/5 |
| Slop | 4/5 | 4/5 |
| Výkon a přístupnost | 4/5 | 4/5 |
| Rozložení | 3/5 | 4/5 |

V prvním kole zůstával mezititulek hmatové zkoušky samostatně uprostřed
stránky a kratší texty doprovázely zbytečně vysoké výřezy. V druhém kole
je mezititulek v textové polovině modulu a tři kratší úseky používají
čtvercový ořez. Sedm účelových fotografií z Higgsfieldu střídá stávající
kresby; původní odstavce, seznamy a odkazy zůstaly beze změny.
Kontrola stylů odhalila, že v bloku `not-prose` mizely odrážky a barva
odkazů; obojí má nyní výslovná pravidla pro vnořenou prózu.

Živě ověřeno na 1440, 1024, 390 a 320 px: všech sedm fotografií se načte
s alt textem, vodorovné přetékání je 0 px a všech pět odkazů v přesunutém
textu funguje. Fotografie se načítají odloženě ve velikosti slotu. Jediné
samostatné krátké odstavce v ose prózy jsou dvě zdrojové poznámky.
**0 kritických nálezů.** Typová kontrola a kontrola diffu prošly;
cílené tři testy SEO také prošly.
ESLint se zastaví na konfiguraci projektu (`Converting circular structure
to JSON`) před analýzou souborů.

## Jazykové verze — infrastruktura (2026-09-28)

Nejde o design-loop, ale o infrastrukturní práci se stejnou disciplínou:
zlatý snímek veřejného webu (`tests/e2e/zlaty-snimek.e2e.spec.ts`,
commit 53b0060) je porota, která musí po každém kroku projít beze změny.
Rozhodnutí jsou v `docs/adr/ADR-008-jazykove-verze.md`.

Plán prošel adversární prověrkou proti kódu: **30 nálezů, 0 zamítnuto,
všechny zapracovány** do plánu v2 (mimo jiné: cookie jako brána místo
vstupu, vyjednávání jen na kořeni, revalidace interních cest s `/cs`,
fallback zapnutý a brána `prelozeno`, vlastní slovník místo next-intl,
proxy bez I/O, statický matcher).

Pořadí kroků a commitů:

| Krok | Commit | Obsah |
|---|---|---|
| 0 | 53b0060 | zlatý snímek místo šablonových e2e testů |
| 1 | 00baf38 | segment `[locale]`, proxy, zdroj jazyka, helper odkazů |
| 2 | 2e44cb1 | příznak „Překlad hotový“, dotazy s jazykem, migrace, náhled, seedery |
| 3 | 4aee624 | SEO po jazycích: canonical, hreflang, JSON-LD, sitemapy, RSS |
| 4 | 49b0263 | slovník UI, formátování, přepínač jazyků |
| 5 | (tento) | ověření s dočasně živou němčinou, dokumentace |

Každý krok prošel bránou tsc, `npm run test:int`, zlatý snímek beze změny
a `next build`. HTML pro češtinu je beze změny až na `inLanguage` ve FAQ
JSON-LD; sitemapy, RSS a textové soubory jsou byte-identické.

Odložená fáze: kalkulátory (~190 řetězců) a SVG kresby (~350 popisků)
zůstávají česky i pod cizí adresou, překlady obsahu dělá majitel v adminu
podle checklistu v ADR-008. Jazyk ožívá až přidáním do `LIVE_LOCALES`
spolu se slovníkem UI v jednom commitu.

## Článek „Jak zasít trávník“ — stavba a přejímky (2026-10-02)

Nový autorův text (16 kapitol, 22 300 znaků) nahradil krátký článek na
`/posts/jak-zasit-travnik`. Stavěno rovnou v rytmu obraz/text (8.2b p. 8):
24 dvousloupců, střídání R L bez výjimky i přes předěl, 2 tabulky jako
krémové pásy, předěl 21:9 mezi výsevem a zálivkou.

- **Kresby (12 nových):** klíčení, odnožování, hustý výsev, půdní teploměr,
  okno konce léta, rychlost vzcházení, hloubka setí, křížový výsev,
  přívalový déšť, kořeny a vláha, první seč, mapa chyby. Jednotné značky
  (semeno krémové s obrysem, kořen, kapka), titulek 24 px na x 40, jediný
  akcent voda. Převzatá `mykorhiza-pod-osivem`.
- **Fotky (12 nových, série téže zahrady):** hero se zálivkou, pohled
  z terasy před a po (závěr článku je úprava úvodní fotky), jinovatka,
  seťové lůžko, předěl s postřikovačem, vlhkost prstem, stín stromu,
  hnojivo, plevel, hustý trávník, oprava holého místa. Mastery
  v `zdroje-informaci/fotky/kandidati-zasit`.
- **Nové v systému:** poměr rámu fotky **3:2** pro krátký úsek textu
  (DESIGN 8.2b p. 8, v2.11), kurziva `*…*` v těle dvousloupce (autorův
  perex), režim `mobil` v `svg-preview.mjs`.
- **Poměr tělo/obraz na 1440:** 58–114 %; nejníž K15 „mapa chyby“ (58 %)
  a oprava holého místa (60 %) — krátké úseky kolem tabulky, které se
  spojit nedají.
- **Přejímky:** `layout-check` 1440 / 1920 / 1130 / 1024 OK, `svg-labels`
  320 / 393 / 1440 OK (13 kreseb, min. 10,5 px), `tsc` čistý.

Porota zatím neproběhla. Vědomě otevřené: poznámka pod tabulkou vzcházení
nese autorův odstavec „Tabulka popisuje orientaci…“ drobnou sazbou; oddíl
o mykorhize je převzatý ze starší verze a čeká na rozhodnutí autora;
souhrn, FAQ, výzva a popisky jsou redakční text (kandidát na copy-polish).
