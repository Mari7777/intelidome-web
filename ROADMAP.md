# Roadmapa webu

> Pořadí, ne termíny. Každý řez je produkční, nic na vyhození.

| Fáze | Cíl | Stav |
|---|---|---|
| F0 | Základy: scaffold (Payload website), lokální DB, dokumenty, design handoff | ✅ |
| F1 | Blog naživo: design system, čeština, Vercel + doména, první článek | ⬜ |
| F2 | Plánovač závlahy | ⬜ |
| F3 | Obchod: katalog + Stripe Checkout → napojení na ERP | ⬜ |
| F4 | Medusa (fáze 2, řídí se ERP ADR-008) | ⬜ |

## F1 — Blog naživo

- [ ] Design system z `design/handoff` (tokeny `--id-*`) do Tailwind/CSS webu
- [ ] Šablona webu v češtině (navigace, patička, metadata, sitemap)
- [ ] Nasazení: Vercel projekt + Neon Postgres + env proměnné
- [ ] DNS: www.intelidome.com → Vercel (Active24)
- [ ] Payload admin: účet majitele, první skutečný článek publikovaný
- [ ] Základ SEO: OG obrázky, RSS, analytika (jednoduchá, bez cookies lišty)

**Hotovo znamená:** majitel napíše a publikuje článek v produkční
administraci a článek je veřejně na doméně.
