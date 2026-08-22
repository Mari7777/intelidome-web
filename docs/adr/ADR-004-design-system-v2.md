# ADR-004: Design system v2 (Tech Blue + Emerald, Archivo) jako zdroj vzhledu webu

- **Stav:** přijato
- **Datum:** 2026-08-22
- **Souvisí s:** ADR-001 (stack F1), ADR-002 (média a DS doplňky)

## Kontext

Vzhled webu dosud určoval `design/handoff/_ds_bundle.css` — export
design systému v1 (akcent `#0071e3`, Apple-light, systémový SF stack).
ADR-001 i `CLAUDE.md` ho označují za jediný zdroj vzhledu.

Mezitím vznikly dvě věci, které v1 nepokrývá:

1. **Web potřebuje víc než světlý editorial.** Blog má nést tmavé
   filmové pásy, kalkulátory, figury s popisky a stat-tiles. V1 nezná
   tmavý povrch, nemá typografickou škálu pro dlouhý text ani pravidla
   pohybu — vznikal pro admin a produktové karty.
2. **Aplikace a web se rozcházely v paletě.** Flutter aplikace používá
   Tech Blue `#2563EB` a Emerald `#10B981`; web `#0071e3` a `#1d8a4e`.
   Zákazník vidí obojí (koupí hardware na webu, ovládá ho v aplikaci),
   takže dvě modré vedle sebe působí jako dvě značky.

Byl proto vytvořen **DESIGN.md v2.0** — syntéza tří referenčních webů
(primární Sonos, sekundární Eight Sleep a Samara) do závazného systému
s tokeny `--id-*`, prošlá třemi adversárními kontrolami. Vzniká rozpor:
dva dokumenty tvrdí, že jsou jediným zdrojem vzhledu.

## Rozhodnutí

- **Zdroj vzhledu webu je `docs/DESIGN.md` (v2.0).** Nahrazuje větu
  z ADR-001 o `design/handoff` **výhradně pro `src/app/(frontend)`**.
  ADR-001 se nepřepisuje; tato změna je jeho rozšířením.
- **`design/handoff/**` = archiv v1, read-only.** Nemaže se (je to
  historie a zdroj pro admin), ale už se z něj nekopíruje do frontendu.
- **Paleta v2:** akcent `#2563eb` (hover `#1d4ed8`), stavová zelená
  `#047857` pro text a `#10b981` (`--id-emerald`) výhradně pro výplně,
  grafy a ikony — **`#10b981` má na bílé kontrast 2,54:1, text v něm je
  zakázaný**. Krém `#f6f5f2`, obsidian `#0b0d10`.
- **Archivo přes `next/font/google`** je jediný povolený webfont
  (výjimka z pravidla handoffu „žádné webfonty"); tělo textu zůstává
  systémový SF stack. Fonty se self-hostují, žádný `<link>` na Google.
- **Závazné pro review:** hex natvrdo v komponentě je chyba (jen tokeny)
  a akcent nesmí pokrýt víc než ~5 % plochy viewportu.
- **Nahrazuje i § Vizuální identita ve skillu `intellidome-content`**,
  který dnes tvrdí opak (`design/handoff`, `#0071e3`, „paleta
  #2563EB/#10B981 na web nepatří"). Skill se načítá při každé tvorbě
  obsahu, takže by jinak dával protichůdnou závaznou instrukci.

## Důsledky

- Tokeny žijí v `src/app/(frontend)/intelidome-tokens.css` (generováno
  z DESIGN.md kap. 13.1, needitovat ručně); mapování na Tailwind je
  v `@theme inline` v `globals.css`; komponentní třídy `.id-*` zůstávají
  v `intelidome-ds.css` a odkazují na tokeny.
- shadcn vrstva používala `--color-accent` jako světlé pozadí. Po
  přemapování na plný akcent by `hover:bg-accent` dalo modrý text na
  modrém pozadí — opraveno v `ui/select.tsx` a `ui/button.tsx` na
  `accent-soft`. Nové komponenty už `bg-accent` jako podklad nesmí.
- Známý dluh: velikosti v `typography` v `tailwind.config.mjs` nejsou
  sladěné se škálou z DESIGN.md kap. 4.2 (`base h1 = 2.5rem` vs. fluidní
  `clamp`). Řeší se samostatným řezem, ne tímto ADR.
- Favicony a `og-default.webp` nesou starý akcent — překreslit.
- Admin Payloadu a Flutter aplikace tímto ADR dotčené nejsou.
