# InteliDome web — kontext a pravidla projektu

> Vzniklo 2026-08-18 jako předání kontextu z ERP projektu; 2026-08-19
> sloučeno do repa. Zdroj pravdy pro rozhodnutí: `VISION.md`,
> `ROADMAP.md` a `docs/adr/` — při rozporu vyhrává repo.

## Kdo a co

Marián Josefík (OSVČ, plátce DPH) staví e-shop **InteliDome** — chytrá
závlaha a automatizace zahrady. Značka se píše **InteliDome, jedno L**.
Domény: **www.intelidome.com** (tento web), intelidome.cz (v držení;
subdoména `erp.intelidome.cz` je obsazená ERP — nesahat na ni).
DNS spravuje Active24. GitHub účet: `Mari7777` (repa privátní).

## Co existuje mimo tento repozitář (a čeho se nedotýkat)

- **ERP běží ostře** na vlastním VPS (samostatné repo `intellidome-erp`).
  Zpracovává faktury, sklad, doklady, DPH. **Web s ním NIKDY nesdílí kód
  ani databázi.** Jediné budoucí propojení: Stripe webhooky z checkoutu
  na `https://erp.intelidome.cz/webhooks/stripe` — ERP je hotové a čeká.
- **Medusa experimenty** (`~/muj-eshop`, `~/my-medusa-store`) — nechat
  ležet, patří až do fáze F4.

## Co se staví a proč (pořadí fází — stav viz ROADMAP.md)

1. **F1 — Blog naživo.** Cíl: návštěvnost a důvěra domény dřív, než se
   otevře obchod; majitel se naučí publikovat v produkčním prostředí.
2. **F2 — Plánovač závlahy.** Interaktivní nástroj, vlajková loď webu,
   lead magnet.
3. **F3 — Obchod.** Katalog + Stripe Checkout. O aktivaci **Stripe live**
   se žádá až když na webu veřejně stojí: **první ~3 produkty s cenami,
   obchodní podmínky, reklamace/vracení a kontakt** (to Stripe při
   schvalování reálně kontroluje) — dřív o aktivaci nežádat, nikdy
   neuvádět vymyšlené údaje. Do té doby vývoj výhradně v test
   mode/sandboxu.
4. **F4 — Medusa** jako e-commerce backend; obsah zůstává v Payloadu.

## Technologie fáze 1 (rozhodnuto v ADR-001 — držet se)

- **Next.js (App Router) + Payload CMS 3** v jedné aplikaci
  (šablona `website`: stránky, blog, média, SEO, koncepty).
- **Hosting Vercel** (serverless, žádný vlastní server pro web).
- **Postgres pro Payload:** lokálně Docker na portu **5433**
  (⚠️ 5432 drží ERP dev!), produkčně **Neon** (free tier).
- **Dev server na portu 3100** (`npm run dev`) — 3000 drží jiná
  aplikace na tomto stroji.
- **Média:** storage adapter (viz ADR-002) — souborový systém Vercelu
  je efemérní, bez adapteru se obrázky ztratí.
- **Design (v2.0, ADR-004):** zdroj vzhledu webu je **`docs/DESIGN.md`**.
  Akcent `#2563eb` (hover `#1d4ed8`), stavová zelená `#047857` pro text
  a `#10b981` (`--id-emerald`) jen pro výplně, grafy a ikony — **text
  v emeraldu je zakázaný** (2,54:1 na bílé). Krém `#f6f5f2`, obsidian
  `#0b0d10`, display písmo **Archivo** (`next/font`, jediný webfont),
  tělo systémový SF stack; maxw 1200 px / prose 700 px, radiusy
  20/14/10/pill. Implementace: tokeny v
  `src/app/(frontend)/intelidome-tokens.css` (generováno z DESIGN.md
  kap. 13.1, **needitovat ručně**), mapování v `@theme inline`
  v `globals.css`, komponentní třídy v `intelidome-ds.css`.
  `design/handoff/**` = archiv v1, read-only.
  **Hex natvrdo v komponentě je chyba** (jen tokeny) a akcent nesmí
  pokrýt víc než ~5 % plochy viewportu. Pozor: `bg-accent` je plný
  akcent — jako světlý podklad se používá `bg-accent-soft`.

## Konvence a proces (stejné jako v ERP, osvědčily se)

- Obsah a dokumentace **česky**; kód, identifikátory a commity
  **anglicky**; malé konvenční commity (`feat:` / `fix:` / `docs:` /
  `adr:` / `chore:` / `content:`).
- Zásadní volba (technologie, hranice, princip) = nejdřív krátké ADR
  v `docs/adr/` (kontext / rozhodnutí / důsledky), pak kód. Přijatá ADR
  se nemění — nahrazují se novými.
- Postup: **VISION.md → ROADMAP.md → řezy.** Každý řez je produkční kus
  finálního webu, nic se nestaví na vyhození.
- Tajemství jen v `.env` (v `.gitignore`), vzor v `.env.example`.

## Závazné kontrakty pro F3/F4 žijí v ERP repu

Pro blog a plánovač (F1–F2) nejsou potřeba. Jakmile se začne stavět
obchod (F3) nebo přechod na Medusu (F4), PŘEČTI SI (read-only, kód se
nesdílí, dokumentace ano) tato rozhodnutí v ERP repozitáři
`~/intellidome-erp`:

- `docs/adr/ADR-006-backend-stack.md` — hranice web × ERP, webhooky
- `docs/adr/ADR-007-katalog-identifikatory-synchronizace.md` — SKU/EAN,
  varianty, sync katalogu Payload ↔ ERP, vznik karet a cen
- `docs/adr/ADR-008-rozdeleni-erp-medusa.md` — fáze 2: role Medusy,
  sdílený VPS, oddělené DB, rezervace, PII a výmaz
- `docs/events.md` — přesná schémata objednávkových eventů (OrderPlaced…)
  a co konektor webu musí produkovat
- `ROADMAP.md` § M6 — pořadí přechodu na Medusu

Tato ADR jsou přijatá a NEMĚNÍ se z webové strany — kdyby web potřeboval
jinak, řeší se to novým ADR po dohodě v obou projektech.

## Začátek nové session

1. Přečti `VISION.md`, `ROADMAP.md` (aktuální fáze a checklist),
   `docs/adr/` a `docs/DESIGN.md` (závazný vzhled webu).
2. Dev prostředí: `docker compose up -d` (Postgres 5433),
   `npm run dev` (port 3100, `NEXT_PUBLIC_SERVER_URL=http://localhost:3100`).

## Payload CMS skill

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
