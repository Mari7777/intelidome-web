# ADR-001: Stack fáze 1 — Next.js + Payload na Vercelu, Neon Postgres

- **Stav:** přijato
- **Datum:** 2026-08-18
- **Souvisí s:** ERP ADR-006/007/008 (tam bylo rozhodnuto rozdělení web × ERP)

## Kontext

Rozdělení systémů je dané ERP ADR-006–008: web fáze 1 je záměrně
serverless (žádný vlastní server), obchodní logika žije v ERP, hranicí
jsou Stripe webhooky. Potřebujeme redakci pro blog a stránky, později
katalog s checkoutem — bez vlastní infrastruktury.

## Rozhodnutí

- **Next.js (App Router) + Payload CMS 3** v jedné aplikaci — šablona
  `website` (stránky, příspěvky, média, SEO, náhledy).
- **Hosting Vercel**, produkce na www.intelidome.com.
- **Databáze Payloadu: Neon Postgres** (serverless, free tier).
  Pozn.: ERP zásada „žádný managed Postgres" platí pro ERP VPS;
  serverless web managed databázi potřebuje z principu.
- **Lokální vývoj:** docker Postgres na portu 5433 (5432 drží ERP dev).
- **Design system InteliDome** z `design/handoff` (tokeny `--id-*`,
  akcent #0071e3) — jediný zdroj vzhledu pro web i ERP admin.
- Obsah česky; kód, identifikátory a commity anglicky (konvence jako ERP).

## Důsledky

- Nulová infrastruktura do F3; platí se až provoz obchodu.
- Media úložiště na Vercelu je efemérní — před F1 nasazením přidat
  storage adapter (Vercel Blob / R2) pro Payload media (malé ADR).
- Medusa (F4) nahradí checkout vrstvu, Payload a obsah zůstávají.
