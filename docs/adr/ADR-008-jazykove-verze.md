# ADR-008: Jazykové verze webu (adresy, brána překladu, SEO, přepínač)

- **Stav:** přijato
- **Datum:** 2026-09-28
- **Souvisí s:** ADR-001 (stack F1), ADR-004 (DESIGN.md 7.1 a 7.13), `docs/seo-lawn-series.md` §„Před budoucími překlady“, ROADMAP F1
- **Pozor:** ERP má vlastní ADR-008 v jiném repozitáři (ROADMAP F4 „řídí se ERP ADR-008“). Tento dokument se týká jen webu.

## Kontext

Majitel chce, aby web sám zobrazil jazyk podle návštěvníka: jazyk prohlížeče
první, země (IP) jen jako záloha. Překlady obsahu ale vzniknou až později
v adminu, takže infrastruktura musí být hotová a ověřená dřív, než ožije
první cizí jazyk, a dnešní český web se přitom nesmí vizuálně ani chováním
změnit. Důkazem je zlatý snímek (`tests/e2e/zlaty-snimek.e2e.spec.ts`,
commit 53b0060): normalizovaný záznam stránek, sitemap, RSS a statiky, který
musí projít po každém kroku beze změny.

Výchozí stav: Payload měl `localization` pro cs/en/de/hu/pl/es/it
s `fallback: true`, frontend jazyk nikam nepředával, nebyly jazykové adresy,
hreflang ani přepínač. Závazné okraje: `docs/seo-lawn-series.md` (hreflang jen
na skutečně přeložené adresy, nikdy na český fallback, české adresy se
nemění), DESIGN.md (kapsle 7.1, patička 7.13) a zásada skillu intellidome-web
(jednoduchost provozu před funkcemi navíc).

Plán prošel adversární prověrkou proti kódu (30 nálezů, všechny zapracovány,
žádný zamítnut) a byl proveden v pěti krocích, každý s vlastní bránou
(tsc, `npm run test:int`, zlatý snímek, `next build`): 00baf38 (segment
`[locale]`, proxy, zdroj jazyka), 2e44cb1 (příznak překladu, dotazy
s jazykem, migrace, náhled, seedery), 4aee624 (SEO po jazycích), 49b0263
(slovník UI, formátování, přepínač), krok 5 (ověření s dočasně živou
němčinou, dokumentace).

## Rozhodnutí

### Adresy a směrování (A1, A2, A8, A9)

1. **Čeština bez prefixu, ostatní jazyky s prefixem:** `/`, `/posts/x`,
   `/search` zůstávají; cizí jazyk má `/en`, `/en/posts/x`. Proxy
   (`src/proxy.ts`) neprefixované adresy interně přepisuje na `/cs/…`
   a `/cs/…` zvenku posílá 308 na neprefixovanou adresu, takže veřejný
   duplikát neexistuje. Přepis i přesměrování jdou přes `req.nextUrl.clone()`,
   query přežije.
2. **Slug je sdílený napříč jazyky** (lokalizované slugy jsou pozdější
   volitelný krok). Slug nesmí být kódem jazyka ani vyhrazeným segmentem
   (`api`, `admin`, `next`, `_next`, `_vercel`): validace
   `src/fields/slugBezKoduJazyka.ts` na Pages i Posts.
3. **Matcher proxy je statický literál**
   `'/((?!(?:api|admin|next|_next|_vercel)(?:/|$)|.*\\..*).*)'`: vše
   s tečkou (robots.txt, sitemapy, feed.xml, llms.txt, favicony) a interní
   cesty proxy obchází; vyhrazené prefixy jsou ukotvené na hranici segmentu,
   takže `/nextgen-zavlaha` je běžná stránka.
4. **Strom:** `src/app/(frontend)/[locale]/layout.tsx` je root layout
   frontendu (`<html lang={locale}>`, LocaleProvider, Header, Footer).
   `generateStaticParams` peče jen `cs`; ostatní jazyky se vykreslují na
   vyžádání, takže se nikdy nepeče 307. Chybějící trasa pod jazykem končí
   v `[locale]/[...rest]/page.tsx` (404). Route handlery sitemap, `feed.xml`
   (cs) a `next/*` zůstávají mimo `[locale]`; jazykový kanál je
   `[locale]/feed.xml/route.ts`.

### Živý jazyk a brána překladu (A3, A4, A5, A6)

5. **Živý jazyk je konstanta v kódu:** `LIVE_LOCALES` v `src/i18n/live.ts`
   (dnes `['cs']`), mění se v jednom commitu s překladem UI. Proxy nečte
   Payload ani cache (žádné I/O). Env `LIVE_LOCALES="cs,de"` je override jen
   pro testy, validovaný proti `LOCALES`; na Vercelu (`VERCEL` nastavené) se
   ignoruje, aby jazyk nemohl ožít mimo commit; čeština je živá vždy.
6. **Jediný predikát existence překladu dokumentu** je lokalizovaný checkbox
   `prelozeno` („Překlad hotový“, `src/fields/prelozeno.ts`) na Posts
   a Pages; pro cs se nekontroluje. Množina jazyků dokumentu vzniká z jednoho
   čtení `locale: 'all'` (`prekladyDokumentu` v `src/i18n/dokumenty.ts`,
   `jazykyDokumentu` v `src/utilities/sitemap.ts`) jako
   `['cs', …true] ∩ LIVE_LOCALES`. Categories a Media checkbox nemají.
7. **Fallback zůstává zapnutý** (`fallback: true`, v renderu nikde
   `fallbackLocale: false`): hlavička, patička, alt médií, kategorie a meta
   bez překladu přijdou česky, ne jako prázdný `<a>`. Brána „žádný český text
   pod cizí adresou“ je `prelozeno` + 307, ne fallbackLocale. Výjimka:
   všechna čtení `locale: 'all'` mimo render (sitemapy, `prekladyDokumentu`,
   `hreflangVypisu`) a synchronizace indexu hledání čtou bez fallbacku.
8. **Dokument pod `/{ne-cs}/…`** (`rozhodniDokument`): dotaz jen
   `slug + locale (+draft)`; neexistuje → 404 přímo; existuje, není
   v draftu a `prelozeno` není true → 307 na českou adresu; draftMode
   vykreslí vždy (náhled překladu před zaškrtnutím). CMS přesměrování
   (PayloadRedirects) se vyhodnotí před 307. Výpisy `/x/posts`
   a stránkování, `/x/search` i `/x/feed.xml` jdou 307 na českou verzi,
   když jazyk není živý nebo nemá jediný přeložený článek; stránkování se
   peče jen pro cs, dělitel stránek je 12 (limit výpisu).

### Volba jazyka a cookie (A7)

9. **Vyjednává se jen na kořeni** `/`, jen bez cookie `NEXT_LOCALE`, jen při
   dokumentové navigaci (`Sec-Fetch-Dest: document`, bez té hlavičky
   `Accept` obsahující `text/html`; `RSC: 1` nikdy), nikdy pro roboty
   (`ROBOT_UA` v `src/i18n/config.ts`) a nikdy v náhledu (cookie
   `__prerender_bypass`). Vstupy (`src/i18n/negotiate.ts`): `Accept-Language`
   s q-hodnotami (`de-AT` → `de`); země z `x-vercel-ip-country` jen jako
   záloha, když Accept-Language existuje, ale nemapuje na živý jazyk
   (`ZEME_NA_JAZYK`: DE/AT/CH → de, HU, PL, ES, IT, CZ/SK → cs). Bez
   Accept-Language se nepřesměrovává. Výsledek se ořízne na `LIVE_LOCALES`;
   jiný než cs → 302 na `/{locale}` + cookie.
10. **Hluboké odkazy se nikdy nepřesměrovávají** (hreflang a přepínač
    stačí).
11. **Cookie je brána, ne vstup:** proxy ji při každé dokumentové navigaci
    nastaví na jazyk adresy (cs pro neprefixované, cizí jazyk jen když je
    živý), jen když se liší; `path=/`, rok, `SameSite=Lax`. Platí i pro
    roboty (dostanou nanejvýš jazyk adresy, nikdy vyjednaný). RSC a prefetch
    cookie nemění. Na rewrite ani pass-through se nikdy nepřidává `Vary`.

### Zdroj jazyka v kódu (A10, A13, A14, A21)

12. **Server:** `params.locale`, nikdy `headers()`/`cookies()`; uvnitř
    `unstable_cache` a route handlerů jde locale parametrem. **Klient:**
    `useLocale()` z `src/i18n/LocaleProvider.tsx`. Sdílené moduly (RichText,
    CMSLink, Split, Card) dostávají `locale` propem.
13. **Odkazy** přes jediný helper `lokalizujCestu(href, locale)`
    (`src/i18n/routing.ts`): externí, `mailto:`, `#`, `//`, `/api`, `/admin`,
    `/next`, `/_next` a cesty s příponou nechává být, je idempotentní, pro cs
    vrací vstup beze změny. `odstranPrefix`, `verejnaCesta`, `rssCesta`
    (RSS je výslovná výjimka pro příponu) a `interniCesty` (cesty route
    stromu vždy s `/cs`) jsou v témž modulu.
14. **Cache a revalidace:** `getCachedGlobal(slug, depth, locale)`
    a `getCachedDocument(collection, slug, locale)` mají locale v klíči;
    `revalidatePost`/`revalidatePage` volají `revalidatePath` pro každou
    interní cestu z `interniCesty` (`/cs/posts/x`, `/en/posts/x`, home `/cs`),
    nikdy `/posts/x` ani `/` (po rewritu by cache netrefily). Změna článku
    invaliduje i `pages-sitemap` (nese výpis `/{l}/posts`).
15. **AdminBar** hledá kolekci `segments.find(s => s in collectionLabels)`,
    ne podle indexu (prefix posunul segmenty).

### Payload: náhled, seedery, hledání, populace, migrace (A15–A18, A22)

16. **Náhled:** `generatePreviewPath({ collection, slug, locale })` bere
    locale jako řetězec i `{ code }`; `next/preview/route.ts` pouští jen
    relativní cestu s jedním lomítkem (`/^\/(?!\/)/`, žádné `//evil`);
    `defaultLocalePublishOption: 'active'` dává tlačítko „Publish in
    <jazyk>“; v draftu se `prelozeno` nevynucuje.
17. **Seedery publikují jen češtinu** přes `scripts/lib/publikuj-cs.ts`
    (`locale: 'cs'`, `publishSpecificLocale: 'cs'`); po zápisu přečtou
    `locale: 'all'` a varují, když je jiný jazyk označený jako hotový.
18. **Hledání:** `meta.title`/`meta.description` indexu jsou lokalizované
    a index nese `prelozeno` (`src/search/fieldOverrides.ts`);
    `beforeSync` čte pro ne-cs jednou bez fallbacku, skutečný jazyk
    synchronizace přichází přes `skipSync` do `req.context.searchSyncLocale`
    (`src/plugins/index.ts`). `/x/search` hledá jen v `prelozeno: true`.
19. **Populace a bloky:** `zobrazitelny(doc, locale)`
    (`src/i18n/zobrazitelny.ts`) filtruje RelatedPosts a CollectionArchive,
    ArchiveBlock dotazuje s locale; chip kategorie bez názvu v daném jazyce
    se nevykreslí (žádné „Bez kategorie“).
20. **Migrace:** jedna, vygenerovaná přes `payload migrate:create`
    (`src/migrations/20260928_142014_prelozeno.*`), ověřená proti čisté DB;
    `vercel.json` `{ "buildCommand": "npm run ci" }` spouští migrace před
    buildem.

### UI řetězce, sazba a přepínač (A11, A12, A20)

21. **Vlastní slovník místo next-intl:** `src/i18n/ui.ts`, čeština úplná
    a byte-identická s dnešním výstupem, ostatní jazyky `Partial` s pádem
    na cs, `t(locale, key)`; hodnoty smí být funkce (české tvary „min čtení“,
    PageRange, slovo kalkulátor). Proč ne next-intl: web potřebuje ~60
    řetězců, žádný ICU, žádné routování z knihovny (proxy a strom jsou
    vlastní) a žádnou další závislost, kterou by bylo nutné udržovat
    s Next 16; knihovna přináší vlastní middleware a provider, které by
    dublovaly proxy a LocaleProvider.
    Obsah (Kapitola, kalkulátory, SVG figury, texty z CMS) do slovníku
    nepatří.
22. **Sazba se nemění:** `nezlomitelneMezery*`, PostHero jednopísmenné
    předložky, `plural`, `toLocaleString('cs-CZ')` zůstávají (pro latinkové
    jazyky neškodné). Jazykově závislé je jen `formatDateTime(ts, locale)`
    (`Intl.DateTimeFormat`, cs identické „19. 8. 2026“) a `formatAuthors`
    (cs ruční skládání kvůli pevné mezeře ICU, ostatní `Intl.ListFormat`);
    „Obr.“ přes `formatFigureNumber(number, label)`.
23. **Přepínač jazyků** (`src/components/LanguageSwitcher/index.tsx`)
    nezná dokument: odkaz je táž cesta s jiným prefixem, nepřeložený cíl
    obslouží 307. Renderuje se jen při `LIVE_LOCALES.length ≥ 2` (dnes
    identický DOM). Hlavička: položky `.id-capsule__link` ve skupině
    `hidden sm:flex`; patička: prosté odkazy v řádku s ©, s dotykovým cílem
    ≥ 24 px (DESIGN.md 7.13). `lang` na `<a>`, aktivní `aria-current="true"`,
    žádný hreflang na odkazu, žádné vlajky ani chip, `prefetch={false}`.

### SEO po jazycích (A19)

24. Vše z jediné `url = lokalizujCestu(path, locale)`
    (`src/utilities/generateMeta.ts`): canonical, OG url, RSS
    `alternates.types`. `alternates.languages` (+ `x-default` → cs) jen
    při ≥ 2 jazycích dokumentu a jen z reciproční množiny, která obsahuje
    aktuální jazyk; `og:locale` z `OG_LOCALE`, `alternateLocale` ostatní.
    Výpis `/posts` nese hreflang při ≥ 2 jazycích výpisu (cs + živé jazyky
    s ≥ 1 přeloženým článkem, `jazykyVypisu` v `src/i18n/vypis.ts`), aby
    HTML souhlasilo se sitemapou; stránkování `/posts/page/N` hreflang
    nenese (stránka N v cizím jazyce nemusí existovat, sitemapa ji nemá).
25. JSON-LD (`src/utilities/articleSeo.ts`): url, `@id`, drobenka
    a `hasPart` z lokalizované adresy, `inLanguage: locale`, u originálu
    `workTranslation`, u překladu `translationOfWork`; Organization `@id`
    globální. FAQ JSON-LD nese `inLanguage` (jediná viditelná změna českého
    HTML proti stavu před ADR).
26. Sitemapy (`src/utilities/sitemap.ts`): jedno čtení `locale: 'all'`,
    každý dokument cs + (přeložené ∩ živé), `xhtml:link` alternates jen při
    ≥ 2 + x-default; `/x/posts` v pages-sitemap jen pro jazyky s ≥ 1
    přeloženým článkem. RSS (`src/utilities/rss.ts`): `/feed.xml` cs,
    `/{locale}/feed.xml` s `<language>`, jen přeložené položky; `/cs/feed.xml`
    → 308, neživý jazyk nebo jazyk bez přeloženého článku → 307 na `/feed.xml`.
    Dnešní český výstup je byte-identický.

## Důsledky

- Web se dnes chová a vypadá jako před ADR (zlatý snímek prochází); nová
  je jen `inLanguage` ve FAQ JSON-LD a 308/307 na dosud neexistujících
  adresách (`/cs/…`, `/en/…`).
- Zapnutí jazyka je změna kódu (`LIVE_LOCALES` + slovník), ne přepínač
  v adminu. Zaškrtnuté překlady bez živého jazyka se nikde nenabízejí ani
  nedetekují, takže redakce může překládat postupně.
- Každá nová stránka pod `[locale]` musí volat `vynutZivost`
  (`src/i18n/zivost.ts`) a dotazovat s `locale`; každý nový interní odkaz
  jde přes `lokalizujCestu`; každý nový UI řetězec do `src/i18n/ui.ts`.
- Revalidace cílí na cesty route stromu s `/cs`; kdo přidá hook, používá
  `interniCesty`.
- Testy: `tests/int/i18n-*.int.spec.ts`, `proxy-matcher`, `revalidate-hooky`,
  `sitemap-rss`, `search-sync`, `language-switcher`, `article-seo`,
  `hreflang-vypisu`;
  scénáře s dočasně živou němčinou (`LIVE_LOCALES=cs,de`, prod build na
  jiném portu, dočasný překlad v DB s úplným úklidem) nejsou součástí
  `npm run test:e2e`, návod je u nich v `tests/e2e/zive-de/README.md`.

## Známá omezení

- Přepínač nezná dokument: klik na jazyk, ve kterém článek přeložený není,
  skončí 307 na češtině (jedno přesměrování navíc, žádná 404).
- Klik na přepínač je měkká navigace routeru (`<Link>`, RSC fetch), proxy
  při ní cookie nemění: `NEXT_LOCALE` se přepne až při příštím plném načtení.
  Bez dopadu na chování — hodnota cookie se nikde nečte jako vstup, brána
  reaguje jen na její přítomnost a rovnost s jazykem adresy. Tvrdá navigace
  (`<a>`) by cookie přepnula hned; zatím záměrně ne.
- `redirect()` ze stránky (307 nepřeloženého dokumentu, 308/307 z RSS):
  v produkčním buildu vrací PRVNÍ (studený) render trasy hlavičku `Location`
  dvakrát se shodnou hodnotou (GET i HEAD, curl i Node `rawHeaders`;
  reprodukuje se deterministicky, další odpovědi z ISR cache mají jednu).
  Je to chování Next 16.3, ne našeho kódu; prohlížeče berou první hodnotu.
  Scénář 7 shodu hodnot vyžaduje, počet jen zaznamenává. Po nasazení ověřit
  `curl -I …/de/posts/<nepřeložený>` (bod 5 checklistu): `Location` je
  jednohodnotová a některé CDN duplicitu odmítají; Vercel hlavičky
  normalizuje, ale ověřit, ne předpokládat.
- PageSpeed Insights a Lighthouse se po zapnutí jazyka měří na domovské
  stránce daného jazyka (`/de`), ne jen na `/`.
- Vyjednávání jazyka potřebuje `Sec-Fetch-Dest: document`, nebo bez něj
  `Accept` s `text/html` (starší Safari bez Sec-Fetch-Dest se pozná podle
  Accept). Požadavek bez obou hlaviček se nikdy nevyjednává.
- UI řetězce jazyka bez slovníku padají na češtinu; kalkulátory
  (~190 řetězců) a SVG kresby (~350 popisků) zůstávají česky i pod cizí
  adresou, dokud neproběhne odložená fáze s přesazbou.
- Lokalizované slugy nejsou (sdílený slug); popisky hlavičky, patičky
  a alt médií bez překladu jsou české (fallback).

## Jak zapnout jazyk (checklist majitele)

1. V adminu přeložit Pages `home` (celé bloky `layout`) a články: title,
   content, meta; u každého zaškrtnout „Překlad hotový“; publikovat
   tlačítkem „Publish in <jazyk>“ (rozpracované ukládat jako draft, náhled
   funguje i bez zaškrtnutí).
2. Doplnit `src/i18n/ui.ts` pro daný jazyk (~60 řetězců) a přidat kód
   do `LIVE_LOCALES` v `src/i18n/live.ts`. Jeden commit, jeden deploy.
   Do té doby se jazyk nenabízí ani nedetekuje. Env `LIVE_LOCALES` ve
   Vercelu nenastavovat — žije jen v `live.ts` (na Vercelu se stejně
   ignoruje).
3. Ověřit, že Vercel bere `vercel.json` (`buildCommand: npm run ci`,
   migrace `prelozeno` proběhne před buildem; `DATABASE_URL_UNPOOLED`
   nastavená).
4. Po nasazení klik **Reindex** v kolekci Search (index dostane
   lokalizované meta a `prelozeno`).
5. Zkontrolovat `/{jazyk}`, `/{jazyk}/posts`, `/{jazyk}/feed.xml`,
   `/posts-sitemap.xml` (hreflang reciproční) a přepínač v hlavičce
   i patičce; `curl -I https://…/{jazyk}/posts/<nepřeložený>` → 307
   s právě jednou hlavičkou `Location` (Známá omezení); změřit PSI
   na `/{jazyk}`.
6. Volitelně přeložit popisky hlavičky, patičky a alt médií (do té doby
   česky).
7. Seedery přepisují jen cs; po přestavbě českého obsahu zkontrolovat
   v adminu překlady označené jako hotové (seeder na to upozorní).

## Odloženo

- Kalkulátory a SVG kresby po jazycích (redakční práce s přesazbou;
  delší německá slova = kolize popisků, přejímka svg-labels per jazyk).
- Překlady obsahu (dělá majitel v adminu).
- Lokalizované slugy (migrace unikátních indexů, redirecty).

## Odkazy

- Google, „Managing multi-regional and multilingual sites“:
  https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- `docs/seo-lawn-series.md` §„Před budoucími překlady“
- DESIGN.md 7.1 (přepínač v kapsli), 7.13 (přepínač v patičce, dotykový cíl)
