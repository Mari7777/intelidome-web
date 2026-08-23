# ADR-006 — Mřížka článku v3: tři osy, čtyři šířky, jeden zlom

**Stav:** přijato · **Datum:** 2026-08-23 · **Mění:** DESIGN.md 8.1, 8.2b (v2.1 → v2.2)

## Kontext

Majitel po dvou kolech úprav sazby řekl: *„Je to jako by někdo šel a rozesel
náhodně obsah jak ho zrovna napadlo. Není tam žádná souměrnost."*

Design-loop zaměřený výhradně na rozložení dal **2 · 2 · 2 · 2 · 2** a 17
kritických nálezů. Zlatým standardem byla **Samara** (samara.com) — podle
majitelova vlastního popisu „vizuální dvojče" systému. Sonos změřit nešlo:
sonos.com vrací 403 (Akamai) a bot detection neobcházíme.

### Co měření ukázalo

| | Samara článek | **náš článek (před)** |
|---|---|---|
| Levých os | 4 | **16** (7 z nich neslo jediný blok) |
| Šířek modulů | 5 | **16** |
| Dominantní levá osa | 50 % bloků | **32 %** |
| Dominantní pravá osa | **72 %** | **13 %** |
| Svislých mezer / různých hodnot | 18 / 3 | **18 / 17** |

Rozdíl 13 % vs. 72 % vpravo je zabijácký: u Samary skoro všechno končí na
téže svislici, u nás nekončilo nic.

### Dvě opravy vlastní diagnózy

1. **Číslo „střídavost 0,46" bylo špatně.** `layout-dna.mjs` počítal vnořené
   obaly (`figure > picture > img`) jako tři samostatné obrazy, takže jedna
   fotka se započítala jako „FFF". Po deduplikaci vyšlo 1,00.
2. **Stránka nebyla rozesetá, ale přísně středová** — 17 z 19 modulů na ose
   720. Vadu dělalo něco jiného: jediné dva mimoosové moduly mířily **oba
   doprava** (+165), takže mimoosová střídavost byla **0,00**. A stránka
   neměla žádnou organizující osu.

## Rozhodnutí

**Tři levé osy a jejich přesná zrcadla.** Součet každé dvojice je šířka
stránky: `0/1440`, `40/1400`, `370/1070`. Track `wide` (240/1200, šířka 960)
se ruší, token `--id-maxw-summary` zaniká.

**Čtyři šířky modulu, nic mezi tím.** Celá stránka je součet dvou sloupců
a jedné mezery — `A = 322`, `B = 652`, `g = 56`:

| Šířka | Skladba | Použití |
|---|---|---|
| 700 | A + g + A | próza, obsahová osa |
| 1030 | A + g + B | mimoosová figura (±165 od středu) |
| 1360 | B + g + B | dvousloupcová kapitola, pás, FAQ |
| 1440 | edge + 2× gutter | full-bleed |

Co se takhle nesečte, na stránku nepatří.

**Jediný zlom stránky je 720 s mezerou 56 px** → sloupce končí na 692
a začínají na 748. Táž mezera se opakuje ve splitu, kalkulátoru, FAQ
i produktovém pásu. Osa se tím **nechá vidět, ne nakreslit** — 8.1 p. 1
platí dál: povrch mluví, čáry mlčí.

**Mimoosová poloha je pár, ne návyk.** Existují právě dvě (+165 a −165)
a v článku se střídají bez výjimky. Tři vysunutí na tutéž stranu = chyba sazby.

**Mezera je vlastnost přechodu, ne komponenty.** Komponenty svislé marginy
nemají; rytmus má tři míry: 22 px (próza), 40–72 px (modul), 64–120 px (pás).

## Přejímka

`scripts/layout-check.mjs <url> [šířka]` — pustit před merge.
Musí projít: ≤4 osy vlevo i vpravo, ≤4 šířky, 0 jednorázových os,
všechny osy zrcadlené, střídavost mimoosových hmot 1,00.

**Naměřeno po zásahu (1440 px):**

| | před | po |
|---|---|---|
| Levých os | 16 | **3** (372×9, 40×6, 0×4) |
| Pravých os | 20 | **3** (1072×10, 1400×5, 1440×4) |
| Šířek modulů | 16 | **4** (700, 1360, 1440, 1032) |
| Jednorázových os | 7 | **0** |
| Mimoosová střídavost | 0,00 | **1,00** |
| Různých svislých mezer | 17 | **5** (72×6, 115×6, 22×3, 24×2, 116×1) |

Drží na 1440, 1200 i 900 px. Pod 900 px vše padá na osu textu (2 osy,
2 šířky) a mimoosové polohy zanikají. Vodorovný přetok nula na všech
šesti měřených šířkách.

## Co ze Samary NEPŘEBÍRÁME

- **Nakreslenou svislou páteř** (7 segmentů na x=720, 32 % výšky stránky).
  U Samary je to chronologie stavby domu; náš článek je výklad ve čtyřech
  kapitolách, ne timeline. Linka by byla dekorace a porušila by 8.1 p. 1.
- **Plovoucí pilulky na ose** („You're ready for installation") — zase
  chronologie.
- **Hustotu 1 obraz / 814 px.** Samařiny obrazy jsou fotky na jedno kouknutí;
  naše kresby se **čtou** (popisky, hodnoty, jednotky) a potřebují mezi sebou
  text. Cíl ~1 hmota / 1 300–1 600 px.
- **Čtyři magnitudy vysunutí** (+406 / −396 / +351 / +180). Bereme princip
  zrcadleného střídání, ne slovník: u nás existuje **jedna** magnituda ±165.
- **Modrý plnobarevný CTA pás** — rozstřelil by akcentový rozpočet ≤ 5 %.
- **Míru sazby 656 px.** Próza zůstává na 700 (dvakrát adjudikováno).
  Ze Samary si bereme jen to, že se míra **nemění** — ne její konkrétní číslo.
