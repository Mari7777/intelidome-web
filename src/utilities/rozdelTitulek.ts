/**
 * Titulek článku podle dvojtečky: krátký titulek a kvalifikátor
 * („Jak zasít trávník: od prvního zalití k pevným kořenům“). Hero ho sází
 * dvěma hlasy, magazín ukazuje v řádku jen krátký titulek (DESIGN.md 7.15).
 */
export function rozdelTitulek(title: string): [string, string | null] {
  const at = title.indexOf(':')
  if (at === -1) return [title, null]
  return [title.slice(0, at).trim(), title.slice(at + 1).trim() || null]
}
