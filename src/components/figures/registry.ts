import type React from 'react'

import { HlavaNaHlavu } from './HlavaNaHlavu'
import { KbelikovyTest } from './KbelikovyTest'
import { KorenovaZona } from './KorenovaZona'
import { RidiciSmycka } from './RidiciSmycka'

/**
 * Technické kresby článků (DESIGN.md 9.2).
 *
 * Kresby jsou kód, ne obsah — v CMS se vybírá jen klíč. Díky tomu nejde
 * do databáze žádné SVG a nikde se nevolá `dangerouslySetInnerHTML`.
 */
export const DRAWINGS = {
  'korenova-zona': KorenovaZona,
  'kbelikovy-test': KbelikovyTest,
  'hlava-na-hlavu': HlavaNaHlavu,
  'ridici-smycka': RidiciSmycka,
} satisfies Record<string, React.FC>

export type DrawingKey = keyof typeof DRAWINGS
