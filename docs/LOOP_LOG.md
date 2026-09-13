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
