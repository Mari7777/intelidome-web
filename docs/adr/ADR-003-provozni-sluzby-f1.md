# ADR-003: Provozní služby fáze 1 — analytika, e-mail, cron, seed

- **Stav:** přijato
- **Datum:** 2026-08-19
- **Souvisí s:** ADR-001, ADR-002

## Kontext

F1 potřebuje jednoduchou analytiku bez cookies lišty (ROADMAP), řešení
pro e-maily z Payloadu (obnova hesla) a rozhodnutí o šablonových
zbytcích (plánované publikování, demo seed). Majitel provozuje web sám
po večerech — kritérium je nulová údržba.

## Rozhodnutí

- **Analytika: Vercel Web Analytics** (`@vercel/analytics`). Bez cookies
  (žádná lišta), v ceně hobby tieru, nulová údržba. Alternativy: Plausible
  (placené), Umami (vlastní hosting) — zamítnuty kvůli provozní zátěži.
- **Produkční e-mail: odloženo.** Dev-console adaptér zůstává i v
  produkci — jediný e-mail ve F1 je obnova hesla jediného účtu a odkaz
  lze přečíst ve Vercel function lozích. Resend (+ SPF/DKIM u Active24)
  se zavede, až vznikne kontaktní formulář — nové malé ADR.
- **Plánované publikování (`schedulePublish`) vypnuto** a žádný Vercel
  cron. Hobby cron běží max. 1× denně, takže „publikovat v 9:00" stejně
  nefunguje — UI by tiše lhalo. `CRON_SECRET` zůstává nastavený (zamyká
  jobs endpoint).
- **Demo seed odstraněn** (routa `/next/seed`, `src/endpoints/seed`,
  `BeforeLogin`/`BeforeDashboard`). Produkce startuje načisto; fallback
  úvodní stránky je český (`src/fallbacks/home-static.ts`).

## Důsledky

- Kdyby majitel zapomněl heslo a nechtěl číst logy: lokální instance
  s `DATABASE_URL` na Neon a odkaz z konzole.
- Návrat plánovaného publikování vyžaduje Vercel Pro (častější cron)
  nebo externí scheduler — řešit až bude reálná potřeba.
