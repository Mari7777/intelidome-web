import type React from 'react'
import { createElement } from 'react'

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
import { DveZahrady } from './DveZahrady'
import { TunaNeniKubik } from './TunaNeniKubik'
import { TriZahrady } from './TriZahrady'
import { UkladaniOdspodu } from './UkladaniOdspodu'
import { PrvniKorinek } from './PrvniKorinek'
import { NabityBiochar } from './NabityBiochar'
import { MykorhizniVlakna } from './MykorhizniVlakna'
import { ZakladTriZahrad } from './ZakladTriZahrad'
import { SlehnutiVstupu } from './SlehnutiVstupu'
import { PranyPisek } from './PranyPisek'
import { MichaniOdHloubky } from './MichaniOdHloubky'

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
const TriZonyBiovin: React.FC = () => createElement(TriZony, { organika: 'Biovin' })

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
  /*
    Článek „Písek, biochar a další příměsi": stejná konvence — portrétová
    sazba 520 px, registrace pod `wide` i `portrait`. `tri-zony-biovin`
    je táž kresba tří zón s autorovým pojmenováním hroznového kompostu.
  */
  'dve-zahrady': { wide: DveZahrady, portrait: DveZahrady },
  'tuna-neni-kubik': { wide: TunaNeniKubik, portrait: TunaNeniKubik },
  'tri-zony-biovin': { wide: TriZonyBiovin, portrait: TriZonyBiovin },
  'tri-zahrady': { wide: TriZahrady, portrait: TriZahrady },
  'ukladani-odspodu': { wide: UkladaniOdspodu, portrait: UkladaniOdspodu },
  'prvni-korinek': { wide: PrvniKorinek, portrait: PrvniKorinek },
  'nabity-biochar': { wide: NabityBiochar, portrait: NabityBiochar },
  'mykorhizni-vlakna': { wide: MykorhizniVlakna, portrait: MykorhizniVlakna },
  'zaklad-tri-zahrad': { wide: ZakladTriZahrad, portrait: ZakladTriZahrad },
  'slehnuti-vstupu': { wide: SlehnutiVstupu, portrait: SlehnutiVstupu },
  'prany-pisek': { wide: PranyPisek, portrait: PranyPisek },
  'michani-od-hloubky': { wide: MichaniOdHloubky, portrait: MichaniOdHloubky },
} satisfies Record<string, Drawing>

export type DrawingKey = keyof typeof DRAWINGS
