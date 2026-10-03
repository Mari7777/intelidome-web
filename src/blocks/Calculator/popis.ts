/**
 * Název a účel kalkulátorů pro rozcestníky (domovská stránka magazínu,
 * DESIGN.md 8.5). Obsah kalkulátorů do slovníku UI nepatří (src/i18n/ui.ts).
 */
export const POPIS_KALKULATORU: Record<string, { nazev: string; ucel: string }> = {
  vsak: {
    nazev: 'Zkouška vsakování',
    ucel: 'Z poklesu hladiny za daný čas spočítá rychlost vsaku a řekne, jestli půdu nechat, nebo upravit.',
  },
  'pudni-profil': {
    nazev: 'Půdní profil pod trávník',
    ucel: 'Kolik písku, zeminy a příměsí objednat podle plochy a hloubky, včetně dovozu, odvozu a balení.',
  },
  prutok: {
    nazev: 'Kbelíkový test průtoku',
    ucel: 'Z doby, za kterou se naplní kbelík, spočítá průtok zdroje, od kterého se odvíjí návrh závlahy.',
  },
  davka: {
    nazev: 'Dávka a doba zálivky',
    ucel: 'Z plochy a dávky spočítá objem jedné zálivky a dobu běhu při známém průtoku.',
  },
  primesi: {
    nazev: 'Příměs do půdy',
    ucel: 'Z plochy a hloubky zapravení spočítá, kolik příměsi do půdy přidat.',
  },
}
