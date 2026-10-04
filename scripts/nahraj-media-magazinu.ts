/**
 * Nahraje nové fotky magazínu do knihovny médií LOKÁLNÍ databáze, aby na ně
 * mohl odkázat content/magazine.cs.json (seed-magazine vyžaduje existující
 * média). Zdroj je `zdroje-informaci/fotky/` (mimo git jako public/media).
 * Fotky z 3. 10. 2026 vznikly v GPT Image 2.5 podle referenčních záběrů série
 * (stejná zahrada, plot a světlo) po kontrole článků magazínu.
 * Idempotentní: existující médium jen srovná alt a ohnisko (přes nastavOhnisko,
 * aby se přegenerovaly ořezy).
 * Preview: node --env-file=.env --import tsx scripts/nahraj-media-magazinu.ts
 * Apply:   node --env-file=.env --import tsx scripts/nahraj-media-magazinu.ts --write
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { nastavOhnisko, type Ohnisko } from './lib/ohnisko-medii'

const database = new URL(process.env.DATABASE_URL || '')
if (!['localhost', '127.0.0.1', '[::1]'].includes(database.hostname) || database.pathname !== '/intelidome_web') {
  throw new Error('This script is restricted to the local intelidome_web database')
}

type Foto = { filename: string; alt: string; focal: Ohnisko; portret?: string }

const FOTKY: Foto[] = [
  {
    filename: 'hero-namichat-michani.avif',
    portret: 'hero-namichat-michani-portret.avif',
    alt: 'Zahradník v podvečerním slunci promíchává rýčem světlý praný písek s tmavou prosátou zeminou přímo na připravené ploše; vedle stojí kolečko s pískem a papírové pytle, vzadu dřevěný plot a levandule.',
    // Ohnisko na výšku pro tablet (561–1024 px načítá master, ne ořez): postava 63–74 % šířky.
    focal: { focalX: 64, focalY: 50, focalPortraitX: 76, focalPortraitY: 50 },
  },
  {
    filename: 'hero-pece-prvni-pruh.avif',
    // v2: dokreslený horní okraj (GPT Image 2.5), temeno 36 % výšky místo 10 % — pod plovoucí kapslí
    portret: 'hero-pece-prvni-pruh-portret-v2.avif',
    alt: 'Zahradník odchází s ruční vřetenovou sekačkou po mladém hustém trávníku a seká první pruh; vpravo dřevěný plot se záhonem levandule, vzadu mladý strom v nízkém večerním slunci.',
    // Ohnisko na výšku pro tablet: postava na 64–74 % šířky masteru.
    focal: { focalX: 71, focalY: 55, focalPortraitX: 77, focalPortraitY: 50 },
  },
  {
    // Nové hero přípravy (majiteli se nelíbil rotavátor, 4. 10. 2026): ukládání směsi,
    // potrubí v otevřené rýze a odložená ornice v jednom záběru; vybráno porotou ze čtyř.
    // GPT Image 2.5: kolečko opraveno (obě ruce, rám k ose kola), záběr oddálen (temeno
    // 24 % výšky, tablet na výšku načítá master a hlava jinak lezla pod kapsli). Ořez na
    // výšku = širší výřez masteru dokreslený dolů: děj v horních 13–44 %, pod titulkem zemina.
    filename: 'hero-priprava-ukladani.avif',
    portret: 'hero-priprava-ukladani-portret.avif',
    alt: 'Zahradník v podvečerním slunci vysypává z kolečka směs zeminy a písku na nakypřenou plochu pro nový trávník; podél plotu leží v otevřené rýze černé potrubí závlahy, vzadu odložená ornice na plachtě a terasa domu.',
    // Ohnisko na výšku pro tablet: kolečko a postava na 55–75 % šířky masteru.
    focal: { focalX: 64, focalY: 40, focalPortraitX: 72, focalPortraitY: 50 },
  },
  {
    filename: 'fig-priprava-vidle.avif',
    alt: 'Rycí vidle zapíchnuté do půdy lámou světlou, vyschlou udusanou vrstvu pod tmavou drobivou ornicí; ploché hroudy praskají podél hrotů.',
    focal: { focalX: 50, focalY: 55 },
  },
  {
    filename: 'fig-priprava-kontrola-luzka.avif',
    alt: 'Kontrola lůžka před výsevem: rovná lať leží přes jemně uhrabaný povrch, ruka v rukavici zkouší pevnost zeminy a mělký otisk boty ukazuje, že povrch už nekypří.',
    focal: { focalX: 50, focalY: 50 },
  },
  {
    filename: 'fig-priprava-bosy-travnik.avif',
    alt: 'Bosá chodidla na hustém, zdravém trávníku v nízkém večerním slunci.',
    focal: { focalX: 40, focalY: 45 },
  },
  {
    filename: 'fig-primesi-sonda-zahon-siroka.avif',
    alt: 'Čtvercová sonda vykopaná v připravené holé ploše pro nový trávník: svislé stěny z drobivé hnědé zeminy, na dně tmavší pevnější podloží. V pozadí trávník a dřevěný prknový plot v nízkém večerním slunci.',
    focal: { focalX: 50, focalY: 50 },
  },
  {
    filename: 'fig-primesi-vzorky-zahon-siroka.avif',
    alt: 'Tři hromádky různých půd vedle sebe na připravené holé ploše u trávníku: vlevo šedohnědé hutné hroudy jílu s hladkými plochami, uprostřed tmavá drobtovitá hlína, vpravo světlá sypká písčitá zemina. Za nimi trávník v nízkém večerním slunci a dřevěný prknový plot.',
    focal: { focalX: 50, focalY: 50 },
  },
  {
    filename: 'fig-primesi-hlina-ctverec-siroka.avif',
    alt: 'Zblízka čerstvě obrácená hlinitá zemina v záhonu u trávníku: tmavě hnědé drobty a malé hrudky, vlhké, ale ne mokré, s jemnými světlými kořínky trávy, v teplém bočním večerním světle.',
    focal: { focalX: 50, focalY: 50 },
  },
  {
    filename: 'fig-zasit-plevel-nadhled-siroka.avif',
    alt: 'Pohled shora na výsev asi dva týdny po zasetí: řídká tenká stébla mladé trávy na tmavé půdě a mezi nimi růžice pampelišky, ptačinec a jetel; v rohu leží ruční pletí vidlička s dřevěnou rukojetí.',
    focal: { focalX: 50, focalY: 50 },
  },
  {
    filename: 'fig-dodavka-materialu-ctverec-siroka.avif',
    alt: 'Vysypaná dodávka materiálů na plachtě na okraji trávníku: hromada písku, hromada tmavé zeminy a stoh papírových pytlů s příměsemi, v pozadí dřevěný plot.',
    focal: { focalX: 50, focalY: 50 },
  },
  {
    filename: 'fig-useky-siroka.avif',
    alt: 'Rozkypřená plocha zahrady vyznačená provázkem na nízkých kolících; v pruhu stojí v pravidelných rozestupech tři stejné hromádky světlého písku.',
    focal: { focalX: 50, focalY: 50 },
  },
  {
    // Úvodní sonda v článku o půdě: jáma v původní fotce působila mnohem hlubší než 30 cm
    // (majitel 4. 10. 2026); GPT Image 2.5 ji zmenšil na hloubku listu rýče.
    filename: 'soil-intro-v2.avif',
    alt: 'Malá půdní sonda v trávníku, hluboká asi jako list rýče, odhaluje tmavou ornici nad světlejší hutnou zeminou; rýč leží vedle jámy.',
    focal: { focalX: 50, focalY: 62 },
  },
  {
    // Sonda s rukou v témže článku: stěna působila jako 45–55 cm (majitel 4. 10. 2026);
    // varianta z GPT Image 2.5 vybraná třemi hodnotiteli podle měřítka ruky (~30 cm, celá jáma v záběru).
    filename: 'soil-profile-v2.avif',
    alt: 'Ruka ukazuje do malé půdní sondy v trávníku na světlejší utuženou vrstvu pod tmavou ornicí; jáma je hluboká asi jako jeden a půl dlaně.',
    focal: { focalX: 50, focalY: 55 },
  },
]

const localConfig = await config
if (localConfig.db) {
  localConfig.db = { ...localConfig.db, init: ((original) => (args) => {
    const adapter = original(args)
    ;(adapter as typeof adapter & { push?: boolean }).push = false
    return adapter
  })(localConfig.db.init) }
}
const payload = await getPayload({ config: localConfig })
const zapis = process.argv.includes('--write')
const ZDROJ = path.resolve('zdroje-informaci/fotky')

const najdi = async (filename: string) =>
  (await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1, depth: 0, pagination: false })).docs[0] as
    | { id: number }
    | undefined

try {
  const plan: { soubor: string; akce: string }[] = []
  for (const foto of FOTKY) {
    for (const soubor of [foto.filename, foto.portret].filter(Boolean) as string[]) {
      if (!existsSync(path.join(ZDROJ, soubor))) throw new Error(`Chybí zdroj ${soubor} v zdroje-informaci/fotky`)
    }
    const existujici = await najdi(foto.filename)
    plan.push({ soubor: foto.filename, akce: existujici ? 'srovnat alt a ohnisko' : 'nahrát' })
    if (!zapis) continue
    if (existujici) {
      await nastavOhnisko(payload, existujici.id, foto.focal, { alt: foto.alt })
      // Nový ořez na výšku u existující fotky: nahrát a napojit (pole `portrait`).
      if (foto.portret) {
        const portret = (await najdi(foto.portret))?.id ??
          Number((await payload.create({ collection: 'media', data: { alt: `${foto.alt} Svislý ořez pro telefon.` }, filePath: path.join(ZDROJ, foto.portret) })).id)
        const aktualni = (await payload.findByID({ collection: 'media', id: existujici.id, depth: 0 })) as { portrait?: number | null }
        if (aktualni.portrait !== portret) await payload.update({ collection: 'media', id: existujici.id, data: { portrait: portret } })
      }
      continue
    }
    let portretId: number | undefined
    if (foto.portret) {
      portretId = (await najdi(foto.portret))?.id ??
        Number((await payload.create({ collection: 'media', data: { alt: `${foto.alt} Svislý ořez pro telefon.` }, filePath: path.join(ZDROJ, foto.portret) })).id)
    }
    await payload.create({
      collection: 'media',
      data: { alt: foto.alt, ...foto.focal, ...(portretId ? { portrait: portretId } : {}) },
      filePath: path.join(ZDROJ, foto.filename),
    })
  }
  console.log(JSON.stringify({ mode: zapis ? 'write' : 'preview', plan }, null, 2))
} finally {
  await payload.destroy()
}
process.exit(0)
