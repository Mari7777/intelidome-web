import type React from 'react'

import { HlavaNaHlavu } from './HlavaNaHlavu'
import { HlavaNaHlavuMobil } from './HlavaNaHlavuMobil'
import { KbelikovyTest } from './KbelikovyTest'
import { KorenovaZona } from './KorenovaZona'
import { KorenovaZonaMobil } from './KorenovaZonaMobil'
import { RidiciSmycka } from './RidiciSmycka'

export type Drawing = {
  /** Širokoúhlá sazba (viewBox 1080) — desktop a tablet. */
  wide: React.FC
  /**
   * Portrétová sazba. Vznikla pro telefon (kde by posun do stran zabil
   * porovnání dvou stavů), ale slouží i dvousloupcovému bloku na desktopu —
   * do sloupce ~520 px se panoramatická kresba 1080 px nevejde čitelně.
   */
  portrait?: React.FC
}

/**
 * Technické kresby článků (DESIGN.md 9.2).
 *
 * Kresby jsou kód, ne obsah — v CMS se vybírá jen klíč. Díky tomu nejde
 * do databáze žádné SVG a nikde se nevolá `dangerouslySetInnerHTML`.
 */
export const DRAWINGS = {
  'korenova-zona': { wide: KorenovaZona, portrait: KorenovaZonaMobil },
  'kbelikovy-test': { wide: KbelikovyTest },
  'hlava-na-hlavu': { wide: HlavaNaHlavu, portrait: HlavaNaHlavuMobil },
  'ridici-smycka': { wide: RidiciSmycka },
} satisfies Record<string, Drawing>

export type DrawingKey = keyof typeof DRAWINGS
