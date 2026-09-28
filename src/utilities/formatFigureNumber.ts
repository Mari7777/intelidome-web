/**
 * Číslo figury podle konvence DS 7.12 „Obr. 01“ (dvě číslice); nečíselný
 * zápis („2a“) projde beze změny. `label` = `t(locale, 'figure.label')`.
 * Jeden helper pro bloky Figure i Split (dřív dvě kopie).
 */
export const formatFigureNumber = (raw: string | null | undefined, label: string): string | null => {
  const value = raw?.trim()
  if (!value) return null
  return /^\d+$/.test(value) ? `${label} ${value.padStart(2, '0')}` : `${label} ${value}`
}
