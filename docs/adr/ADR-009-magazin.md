# ADR-009 — Magazín: adresa článků `/magazin`

**Stav:** přijato · **Datum:** 2026-10-03 · **Mění:** ADR-008 body 1, 14, 15, 24, 26 a checklist bod 5 (adresy článků a výpisu) · **Souvisí:** ADR-008, DESIGN.md 8.2

## Kontext

Majitel 3. 10. 2026: *„Uprav umístění všech článků, budou na adrese
intelidome.com/magazin/název-článku. Na této stránce budou články přehledně
umístěny a bude to jejich domovská stránka.“*

Do té doby měly články adresu `/posts/<slug>` (název kolekce Payloadu,
převzatý ze šablony `website`) a výpis `/posts` s titulkem „Blog“. Sekce
neměla jednotné jméno (Blog, Články, Journal, Návody) a na výpis vedla
jen drobečková navigace článku.

Průzkum (7 nezávislých map, 3. 10. 2026) ukázal:

- Adresu dokumentu skládá jediná funkce `zakladniCesta` v `src/i18n/routing.ts`,
  ale dalších asi 13 míst ji obcházelo (`/${relationTo}/…` v kartě, odkazu
  CMS, Lexicalu a přesměrování CMS; natvrdo `/posts` ve výpisu, stránkování,
  drobence, sitemapě a SEO pluginu).
- V obsahu databáze bylo 45 natvrdo zapsaných odkazů `/posts/…` v 5 článcích
  (33 markdown v tělech dvousloupců, 9 Lexical odkazů, 3 tlačítka výzvy)
  a seedery je při každém běhu zapisují znovu.
- Web ještě není veřejně nasazený (doména vede na parkovací stránku), takže
  změna adres nic nestojí: žádný index, zpětné odkazy ani odběratelé RSS.

## Rozhodnutí

1. **Veřejná adresa článku je `/magazin/<slug>`**, domovská stránka článků
   `/magazin`. Jediný zdroj je `src/i18n/routing.ts`: konstanta
   `CESTA_MAGAZINU`, `zakladniCesta('posts', slug)` a `cestaMagazinu(strana)`.
   Žádné jiné místo v kódu ani ve skriptech cestu neskládá samo.
2. **Segment se nepřekládá:** `/en/magazin/<slug>`, `/de/magazin/<slug>`.
   Navazuje na ADR-008 bod 2 (sdílený slug) a bod 13 (`lokalizujCestu` jen
   přidává prefix). Lokalizovaný segment (`/en/magazine`) by s českými slugy
   dal napůl přeloženou adresu; patří k pozdějším lokalizovaným slugům.
3. **Stránkování je `/magazin/strana/<n>`** (od 2; strana 1 je `/magazin`
   a `/magazin/strana/1` na ni vede trvale). Mimo rozsah 404, ne prázdná 200.
4. **Staré adresy vedou trvalým přesměrováním (308)** v `redirects.ts`
   (redirects v next.config, vyhodnocují se před proxy i před routami):
   `/posts` → `/magazin`, `/posts/page/1` → `/magazin`,
   `/posts/page/<n>` → `/magazin/strana/<n>`, `/posts/<slug>` →
   `/magazin/<slug>`; totéž pro `/cs/posts…` přímo na adresu bez prefixu
   (jeden skok) a pro `/{jazyk}/posts…` na `/{jazyk}/magazin…`. Ne proxy
   (ADR-008 ji vymezuje na jazyk), ne kolekce Redirects (umí jen přesnou
   shodu a běží jen uvnitř existující routy). Přesměrování zůstává trvale.
   Adresa s koncovým lomítkem má skok navíc (Next ho ořízne dřív, než přijdou
   na řadu vlastní pravidla) a vzory nerozlišují velikost písmen.
5. **Interní jména se nemění:** kolekce Payloadu `posts` (tabulky, `/api/posts`,
   admin), soubor `posts-sitemap.xml`, cache tag `posts-sitemap`, klíče slovníku
   `posts.*`. Mění se jen veřejná adresa a jméno sekce.
6. **Jméno sekce je „Magazín“** ve všech viditelných textech: titulek domovské
   stránky, drobečková navigace (HTML i JSON-LD), titulek RSS, popis webu,
   meta hero článku. Slovo „Blog“ z webu mizí.
7. **Obsah databáze se přepisuje skriptem**, ne Payload migrací
   (`scripts/presun-magazin.ts`: náhled, `--write`, záloha, jedna transakce,
   jen čeština přes `publikujCs`, akceptační počty). Historie verzí `_posts_v`
   se nepřepisuje; po obnovení starší verze stačí skript pustit znovu.
   `publikujCs` odmítne zapsat obsah s odkazem `/posts/`.
8. Slugy `magazin`, `posts` a `search` jsou **vyhrazené** pro stránky i články
   (statická routa by stránku zastínila, přesměrování by ji pohltilo).

## Důsledky

- ADR-008 platí dál, jen v příkladech adres čti `/magazin` místo `/posts`:
  bod 1 (`/magazin/x`, `/en/magazin/x`), bod 14 (`/cs/magazin/x`), bod 15
  (AdminBar mapuje segment `magazin` na kolekci `posts`), body 24 a 26 (výpis
  `/{l}/magazin`, stránkování `/magazin/strana/N` bez hreflang) a checklist
  bod 5 (`/{jazyk}/magazin`, `curl -I …/{jazyk}/magazin/<nepřeložený>`).
- Zlatý snímek se aktualizuje vědomě ve dvou krocích: nejdřív čistě
  mechanický přepis `/posts` → `/magazin` (přesné počty náhrad), potom
  zvlášť nová domovská stránka magazínu s kontrolou, která pole se smí změnit.
- Publikace článku revaliduje celý podstrom `/{l}/magazin` (domovská stránka
  i stránkování) a RSS, dřív až ISR po 600 s.
- Stránkování v cizím jazyce mimo rozsah (méně přeložených článků) vede na
  domovskou stránku magazínu daného jazyka; v češtině je to 404.
- Domovská stránka magazínu potřebuje vlastní šablonu v DESIGN.md (kap. 8)
  a odkaz z hlavičky; řeší navazující krok.
- Po prvním veřejném nasazení se adresy už nemění bez nového ADR.

## Dodatek 1 — domovská stránka a témata (3. 10. 2026)

- **Témata magazínu jsou kategorie** (kolekce Categories, nová pole `popis`
  a `serie`, migrace `20261003_151145_magazin_temata`). Téma článku je jeho
  **první** kategorie, takže článek nikdy nestojí ve dvou tématech. Vlastní
  pás dostane téma s ≥ 2 články, nejvýš 3 témata, v pořadí založení kategorie.
- **Série** řadí díly podle `publishedAt` vzestupně („Díl k z N“, díl 1
  „Začněte tady“). Pole „díl“ se zavede až ve chvíli, kdy se poprvé vloží díl
  doprostřed série nebo se přepíše datum.
- **Stránkuje se jen přehled „Všechny články“** (12 na stranu); témata se
  přes strany nedělí. Stránky témat `/magazin/tema/<slug>` přijdou až
  s novým ADR a vyhrazeným slugem `tema` (kolem 50 článků nebo se čtvrtým
  tématem).
- Šablona je v DESIGN.md 8.5, řádek článku 7.15. Témata založil a články
  přiřadil `scripts/magazin-temata.ts`.
