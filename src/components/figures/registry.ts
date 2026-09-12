import type React from 'react'

import { HlavaNaHlavu } from './HlavaNaHlavu'
import { HlavaNaHlavuMobil } from './HlavaNaHlavuMobil'
import { KbelikovyTest } from './KbelikovyTest'
import { KbelikovyTestPortret } from './KbelikovyTestPortret'
import { KorenovaZona } from './KorenovaZona'
import { KorenovaZonaMobil } from './KorenovaZonaMobil'
import { RidiciSmycka } from './RidiciSmycka'
import { RidiciSmyckaPortret } from './RidiciSmyckaPortret'
import { SitMostu } from './SitMostu'
import { SitMostuPortret } from './SitMostuPortret'
import { HmatovyTest } from './HmatovyTest'
import { PudniProfil } from './PudniProfil'
import { ZkouskaVsaku } from './ZkouskaVsaku'
import { TricetCentimetru } from './TricetCentimetru'
import { TriZony } from './TriZony'
import { Sedani } from './Sedani'

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
  'kbelikovy-test': { wide: KbelikovyTest, portrait: KbelikovyTestPortret },
  'hlava-na-hlavu': { wide: HlavaNaHlavu, portrait: HlavaNaHlavuMobil },
  'ridici-smycka': { wide: RidiciSmycka, portrait: RidiciSmyckaPortret },
  'sit-mostu': { wide: SitMostu, portrait: SitMostuPortret },
  /*
    Článek „Krásný trávník začíná pod zemí": kresby existují jen v portrétové
    sazbě (520 px), protože všechny stojí ve dvousloupci vedle textu — tam
    má portrét vyšší hustotu i čitelnější popisky než panorama (ADR-006,
    dodatek). Registrují se jako `wide` i `portrait`, aby je šlo bezpečně
    vysadit i samostatnou figurou; strop 520 px drží CSS.
  */
  'hmatovy-test': { wide: HmatovyTest, portrait: HmatovyTest },
  'pudni-profil': { wide: PudniProfil, portrait: PudniProfil },
  'zkouska-vsaku': { wide: ZkouskaVsaku, portrait: ZkouskaVsaku },
  'tricet-centimetru': { wide: TricetCentimetru, portrait: TricetCentimetru },
  'tri-zony': { wide: TriZony, portrait: TriZony },
  'sedani': { wide: Sedani, portrait: Sedani },
} satisfies Record<string, Drawing>

export type DrawingKey = keyof typeof DRAWINGS
