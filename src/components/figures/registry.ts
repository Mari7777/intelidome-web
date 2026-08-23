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
   * Svislá sazba pro telefon. Má ji jen figura, které by posun do stran
   * zabil smysl — u porovnání dvou stavů vedle sebe je potřeba vidět
   * oba najednou. Ostatní figury se na telefonu posouvají.
   */
  mobile?: React.FC
}

/**
 * Technické kresby článků (DESIGN.md 9.2).
 *
 * Kresby jsou kód, ne obsah — v CMS se vybírá jen klíč. Díky tomu nejde
 * do databáze žádné SVG a nikde se nevolá `dangerouslySetInnerHTML`.
 */
export const DRAWINGS = {
  'korenova-zona': { wide: KorenovaZona, mobile: KorenovaZonaMobil },
  'kbelikovy-test': { wide: KbelikovyTest },
  'hlava-na-hlavu': { wide: HlavaNaHlavu, mobile: HlavaNaHlavuMobil },
  'ridici-smycka': { wide: RidiciSmycka },
} satisfies Record<string, Drawing>

export type DrawingKey = keyof typeof DRAWINGS
