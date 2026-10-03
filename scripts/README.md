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
| `generate-seeding-content.mjs` | z autorovy předlohy článku „Jak zasít trávník“ vygeneruje `lib/seeding-article-content.ts` (dělení odstavců na hranicích vět, kontrola znak po znaku); po změně předlohy spustit před `seed-clanek-zasit.ts` |
| `presun-magazin.ts` | jednorázový přepis odkazů `/posts/…` → `/magazin/…` v obsahu článků (ADR-009); náhled bez argumentu, zápis s `--write`; idempotentní, po obnovení starší verze článku pustit znovu |
| `seed-clanek-*.ts`, `optimize-lawn-series.ts`, `revise-lawn-series.ts` | seedery a revize článků (`node --import tsx scripts/<soubor>`); **přepisují jen češtinu** přes `lib/publikuj-cs.ts` (`publishSpecificLocale: 'cs'`) — rozpracované překlady v adminu zůstávají; když je jiný jazyk označený „Překlad hotový“, seeder to vypíše jako varování (překlad je třeba zkontrolovat); viz ADR-008 |
