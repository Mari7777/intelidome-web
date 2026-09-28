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
| `seed-clanek-*.ts`, `optimize-lawn-series.ts`, `revise-lawn-series.ts` | seedery a revize článků (`node --import tsx scripts/<soubor>`); **přepisují jen češtinu** přes `lib/publikuj-cs.ts` (`publishSpecificLocale: 'cs'`) — rozpracované překlady v adminu zůstávají; když je jiný jazyk označený „Překlad hotový“, seeder to vypíše jako varování (překlad je třeba zkontrolovat); viz ADR-008 |
