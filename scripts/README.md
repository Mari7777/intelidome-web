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
