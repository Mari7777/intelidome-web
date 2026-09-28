# Živý běh s dočasnou němčinou (ADR-008, krok 5)

Důkaz, že infrastruktura jazykových verzí funguje, jakmile jazyk ožije —
bez zásahu do dnešního webu a bez trvalých dat v dev DB. Není součástí
`npm run test:e2e` (ten `zive-de` ignoruje): potřebuje **produkční build**
s `LIVE_LOCALES=cs,de` a dočasný německý překlad v dev DB.

## Spuštění

```sh
npm run test:e2e:de            # vše najednou (tests/e2e/zive-de/spustit.sh)
npm run test:e2e:de -- 02      # jen vybrané soubory (argumenty jdou Playwrightu)
```

Skript udělá po sobě: `preklad.ts nastavit` → `next build` (env `LIVE_LOCALES=cs,de`,
`NEXT_PUBLIC_SERVER_URL=http://localhost:3102`) → `next start -p 3102` →
Playwright (`playwright.de.config.ts`) → stop serveru → `preklad.ts uklidit`.
Úklid i zastavení běží vždy (trap), i když build nebo testy spadnou; selhaný
úklid vrátí nenulový kód i při zelených testech.
Log serveru: `node_modules/.cache/zive-de/server.log`. Dev server na 3100 může
běžet dál (`next dev` má `.next/dev`, build píše do `.next`).
**Po běhu zůstává v `.next` testovací build** (`LIVE_LOCALES=cs,de`, origin
`http://localhost:3102` v HTML) a v `.next/cache/fetch-cache/` záznamy z de
serveru (build je nemaže) — před `npm run start` znovu `npm run build`
a smazat `.next/cache/fetch-cache/`.

Ručně po krocích:

```sh
npm run payload -- run tests/e2e/zive-de/preklad.ts nastavit   # PŘED buildem (cs stránky se pečou i s hreflang)
LIVE_LOCALES=cs,de NEXT_PUBLIC_SERVER_URL=http://localhost:3102 npx next build
LIVE_LOCALES=cs,de NEXT_PUBLIC_SERVER_URL=http://localhost:3102 npx next start -p 3102
NODE_OPTIONS=--import=tsx/esm npx playwright test --config=playwright.de.config.ts
npm run payload -- run tests/e2e/zive-de/preklad.ts uklidit    # globalTeardown to dělá také; opakování je neškodné
npm run payload -- run tests/e2e/zive-de/preklad.ts stav       # co je v DB
```

## Dočasný překlad (`preklad.ts`)

- Pages `home`: titulek „TEST de Úvod“, meta de, kopie českého hera a bloků
  (`layout` je lokalizovaný a povinný), `prelozeno: true`, `publishSpecificLocale: 'de'`.
- Článek `zazimovani-zavlahy-krok-za-krokem`: titulek „TEST de Zazimování“, meta de,
  kopie českého obsahu (`content` je povinný), `prelozeno: true`.
- Stav před testem (id verzí, `updated_at`, příznak `latest`, počty řádků
  obsahových tabulek, `search.updated_at`, md5 otisk cs řádků `posts_locales`,
  `pages_locales`, `search_locales`) v `node_modules/.cache/zive-de/stav.json`.
- Úklid: verze vzniklé testem pryč (publikace + snapshot), všechny řádky
  `_locale = 'de'` i `locale = 'de'` (`*_rels`) pryč, `updated_at`/`latest` zpět.
  Tvrdé kontroly (chyba, stav zůstává): `prelozeno.de`, zbylé de řádky, počet
  verzí, shoda otisku cs řádků. Měkká kontrola (jen varování, stav se smaže):
  počty řádků obsahových tabulek — `payload_*` a `users*` (zámky, preference,
  přihlášení otevřeného adminu) se neporovnávají. Zlatý snímek na 3100 pak musí projít.
- Odmítne běžet, když DB už má jakékoli `de` řádky nebo dokument ≥ 46 verzí (strop `maxPerDoc`).
- Známé nepokrytí živým během: `/de/<stránka>` s NEpřeloženou Pages → 307
  na `/<stránka>` (A6). Dev DB má jedinou stránku (`home`) a ta je v běhu
  přeložená; větev je ověřená int testem `i18n-dokumenty` (`rozhodniDokument`).

## Scénáře (číslování podle zadání kroku 5)

| Soubor | Scénáře |
|---|---|
| `01-vyjednavani` | 1–6 volba jazyka na kořeni, 15 RSC cookie, 16 `/cs/…` 308 + query přežije rewrite |
| `02-dokumenty` | 7 nepřeložený 307 / 404, 8 SEO přeloženého (reciproční), 9 bez hreflang, 10 home/výpis/hledání |
| `03-soubory` | 11 sitemapy, 12 RSS, 19 náhled `//evil` |
| `04-prepinac` | 13 přepínač (desktop a 393 px; cookie se po měkké navigaci přepne až plným načtením), 14 jména odkazů, alt, UI česky |
| `05-kontroly` | 17 layout-check + svg-labels (shoda s cs), 18 kotva `#obsah` na 124 px |
