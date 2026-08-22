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
