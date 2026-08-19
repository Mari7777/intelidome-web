# InteliDome web — kontext a pravidla projektu

> Tento soubor polož do kořene nové složky webu jako `CLAUDE.md`.
> Vznikl 2026-08-18 jako předání kontextu z ERP projektu.

## Kdo a co

Marián Josefík (OSVČ, plátce DPH) staví e-shop **InteliDome** — chytrá
závlaha a automatizace zahrady. Značka se píše **InteliDome, jedno L**.
Domény: **www.intelidome.com** (tento web), intelidome.cz (v držení;
subdoména `erp.intelidome.cz` je obsazená ERP — nesahat na ni).
DNS spravuje Active24. GitHub účet: `Mari7777` (repa privátní).

## Co už existuje (a čeho se nedotýkat)

- **ERP běží ostře** na vlastním VPS (samostatné repo `intellidome-erp`).
  Zpracovává faktury, sklad, doklady, DPH. **Web s ním NIKDY nesdílí kód
  ani databázi.** Jediné budoucí propojení: Stripe webhooky z checkoutu
  na `https://erp.intelidome.cz/webhooks/stripe` — ERP je hotové a čeká.
- **Medusa experimenty** (`~/muj-eshop`, `~/my-medusa-store`) — nechat
  ležet, patří až do fáze F4.
- **Zkušební scaffold** `~/intelidome-web` (Payload website šablona,
  funkční) — může posloužit jako reference, nebo se smazat.

## Co se staví a proč (pořadí fází)

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

## Technologie fáze 1 (rozhodnuto — držet se)

- **Next.js (App Router) + Payload CMS 3** v jedné aplikaci
  (šablona `website`: stránky, blog, média, SEO, koncepty).
  Scaffold: `npx create-payload-app -t website -a claude`.
- **Hosting Vercel** (serverless, žádný vlastní server pro web).
- **Postgres pro Payload:** lokálně Docker na portu **5433**
  (⚠️ 5432 drží ERP dev!), produkčně **Neon** (free tier).

### ⚠️ Obsazené porty na tomto stroji — web musí jinam

| Port | Kdo | Pozn. |
|---|---|---|
| 3000 | Bikemax e-mailový asistent (Vite frontend, `~/dev/Playground/frontend`) | poslouchá jen na IPv4, takže se na 3000 "vejde" i druhý server a začnou si krást požadavky — **nepoužívat** |
| 8010 | backend téhož asistenta | |
| 8000 | ERP dev (uvicorn) | |
| 5432 | ERP dev Postgres | |

**Web proto vždy spouštět na portu 3100** (`next dev -p 3100`,
`NEXT_PUBLIC_SERVER_URL=http://localhost:3100`) a Postgres na 5433.
- **Média:** storage adapter (Vercel Blob nebo Cloudflare R2) —
  souborový systém Vercelu je efemérní, bez adapteru se obrázky ztratí.
- **Design:** hotový design system InteliDome v
  `~/Downloads/intelidome-web/project` — `_ds_bundle.css` s tokeny
  `--id-*` (akcent #0071e3, Apple-light vzhled, pill buttony, karty
  s rádiusem 20 px), šablony a komponenty. Jediný zdroj vzhledu;
  zkopírovat do repa a vycházet z něj.

## Konvence a proces (stejné jako v ERP, osvědčily se)

- Obsah a dokumentace **česky**; kód, identifikátory a commity
  **anglicky**; malé konvenční commity (`feat:` / `fix:` / `docs:` /
  `adr:`).
- Zásadní volba (technologie, hranice, princip) = nejdřív krátké ADR
  v `docs/adr/` (kontext / rozhodnutí / důsledky), pak kód. Přijatá ADR
  se nemění — nahrazují se novými.
- Postup: **VISION.md → ROADMAP.md → řezy.** Každý řez je produkční kus
  finálního webu, nic se nestaví na vyhození.
- Repo od prvního dne v gitu; tajemství jen v `.env` (v `.gitignore`),
  vzor v `.env.example`.

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

## První kroky nové session

1. Přečti tento soubor a `design/handoff` (až bude zkopírovaný).
2. Napiš `VISION.md`, `ROADMAP.md` a `docs/adr/ADR-001` (stack fáze 1)
   — nech si je od majitele odsouhlasit.
3. Scaffold Payload website šablony, dev DB na 5433, česká lokalizace,
   design system.
4. Cíl F1: majitel publikuje první článek v produkční administraci
   na www.intelidome.com.
