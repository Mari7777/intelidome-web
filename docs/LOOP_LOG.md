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
