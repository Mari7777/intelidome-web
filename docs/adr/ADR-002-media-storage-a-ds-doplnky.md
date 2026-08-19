# ADR-002: Média přes Vercel Blob; doplňky design systemu

- **Stav:** přijato
- **Datum:** 2026-08-19
- **Souvisí s:** ADR-001 (důsledek „storage adapter před F1 nasazením")

## Kontext

Souborový systém Vercelu je efemérní — uploady do Payload `media` by po
každém deployi zmizely. ADR-001 ukládá vyřešit úložiště před nasazením.
Zvažovány Vercel Blob a Cloudflare R2.

Design handoff (`design/handoff`) zároveň neobsahuje typografii pro
dlouhé texty (articles) ani čtecí šířku — blog je bez toho nepoužitelný.

## Rozhodnutí

- **Vercel Blob** (`@payloadcms/storage-vercel-blob`, verze zamčená na
  verzi Payloadu). Nejjednodušší provoz: integrované ve Vercelu, jeden
  token, free tier na blog stačí. R2 dává smysl zvážit až od F3/F4
  (objem, egress).
- Adapter je aktivní **jen když existuje `BLOB_READ_WRITE_TOKEN`**
  (produkce); lokální vývoj ukládá na disk. `clientUploads: true`
  (obchází 4,5MB limit serverless request body).
- **Doplňky DS v repu** (`src/app/(frontend)/intelidome-ds.css` —
  handoff soubor zůstává nedotčený, rozšíření jsou označena „repo
  addition"):
  - token `--id-measure: 680px` — čtecí šířka článku (`--id-maxw` je
    šířka layoutu, pro text je moc),
  - prose typografie: `@tailwindcss/typography` s `--tw-prose-*`
    přemapovanými na `--id-*` tokeny,
  - guardy `prefers-reduced-motion`.

## Důsledky

- Produkční media URL míří na `*.blob.vercel-storage.com`; dev a prod
  mají oddělené soubory (dev disk se nikam nesynchronizuje).
- Případný přechod na R2 = výměna adapteru v `src/plugins/index.ts`
  a migrace souborů; datový model se nemění.
