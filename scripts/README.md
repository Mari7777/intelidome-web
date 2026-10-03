# Aktuální články magazínu

Od 3. 10. 2026 je českým redakčním zdrojem `content/magazine.cs.json`. Obsahuje osm samostatných článků, média podle názvů souborů a navazující odkazy. Upravujte tento zdroj; staré `seed-clanek-*`, `revise-lawn-series`, `optimize-lawn-series`, `clean-lawn-series` a `split-preparation-seeding` jsou historické podklady a před zápisem skončí s vysvětlením. Generátor původní předlohy o setí nový redakční zdroj nemění.

Náhled: `node --env-file=.env --import tsx scripts/seed-magazine.ts`

Lokální zápis: `node --env-file=.env --import tsx scripts/seed-magazine.ts --write`

Skript vyžaduje lokální databázi na portu 5433, nepouští synchronizaci schématu, ověřuje média a odlišné rozpracované koncepty. Před zápisem uloží úplnou zálohu všech jazyků a konceptů do vypsané dočasné složky. Zápis článků, souvisejících odkazů, ověření vyhledávacího indexu a archivace duplicitní závlahy proběhne v jedné transakci; ostatní jazyky následně porovná. Shodné články se správným vyhledávacím záznamem při opakování nezapisuje. Produkční nasazení ani publikaci skript neprovádí. Protože samostatný proces nemá Next cache, po lokálním zápisu ověřte výsledek v běžícím vývojovém serveru; případnou cache obnovte restartem tohoto serveru.

Mapa původních bloků a FAQ: `content/magazine-restructure-map.json`. Přesunuté kotvy jsou v `../src/utilities/magazineMovedAnchors.json`; existující články si ponechávají slugs. Starý krátký článek o závlaze zůstává jako koncept a jeho české adresy přesměrovává `../redirects.ts`.

Rozsah přibližně 8–12 minut je redakční volba podle úlohy čtenáře. [Nielsen Norman Group: Long vs. Short Articles as Content Strategy](https://www.nngroup.com/articles/content-strategy-long-vs-short/) doporučuje kombinovat přehled a podrobné informace podle potřeb čtenářů; neurčuje univerzální desetiminutovou délku. Web počítá orientační dobu tempem 180 slov/min, včetně FAQ a textů karet; interakce s kalkulátorem se do ní nepřičítá.

---

# scripts/

Pomocné nástroje mimo build — spouštějí se ručně přes `node scripts/<soubor>`.
**Musí zůstat uvnitř repa**: ESM hledá `@playwright/test` a `sharp` podle
umístění souboru, ne podle `cwd`.

| Soubor | K čemu |
|---|---|
| `shot.mjs` | snímek stránky pro design-loop — `node scripts/shot.mjs <url> <out.png> [desktop\|mobile] [scrolls]` |
| `measure.mjs` | tvrdá čísla pro porotu (akcent %, povrchy, typografie, kontrast, spacing) — `node scripts/measure.mjs <url> [desktop\|mobile] [out.png]` |
| `browse.mjs` | snímek libovolné stránky s odscrollováním (průzkum referencí) |
| `search.mjs` | hledání v galerii refero.design |
| `svg-preview.mjs` | náhled jedné kresby bez spuštění aplikace — `node scripts/svg-preview.mjs <soubor.tsx> <out.png> [light\|dark\|mobil]`; `mobil` = nejtěsnější telefonní sazba popisků (18/21 jednotek) |
| `generate-seeding-content.mjs` | z autorovy předlohy článku „Jak zasít trávník“ vygeneruje `lib/seeding-article-content.ts` (dělení odstavců na hranicích vět, kontrola znak po znaku); historický podklad, aktuální redakční zdroj tímto generátorem neměnit |
| `presun-magazin.ts` | jednorázový přepis odkazů `/posts/…` → `/magazin/…` v obsahu článků (ADR-009); náhled bez argumentu, zápis s `--write`; idempotentní, po obnovení starší verze článku pustit znovu |
| `seed-clanek-*.ts`, `optimize-lawn-series.ts`, `revise-lawn-series.ts` | historické podklady; zápis je zablokovaný. Použijte aktuální `seed-magazine.ts` popsaný výše. |
