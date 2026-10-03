/** Původní podklady zůstávají k dohledání; aktuální redakční zdroj je společný. */
export function stopLegacyMagazineWrite(): void {
  throw new Error('Články byly rozděleny. Upravte scripts/content/magazine.cs.json a použijte scripts/seed-magazine.ts (nejprve náhled, zápis s --write). Tento historický skript by obnovil staré hranice článků.')
}
