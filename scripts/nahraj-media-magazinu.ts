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

/* `portretFocal` = vlastní ohnisko ořezu na výšku. Ořez slouží telefonu i tabletu
   na výšku (≤ 1024 px, je-li ≥ 1080 px široký); na tabletu 9:16 přečnívá o čtvrtinu
   výšky a Y určuje, kolik nebe nad hlavou zůstane pod plovoucí kapslí (DESIGN 9.1).
   X nech 50 — na telefonu by posunulo už oříznutý záběr. */
type Foto = { filename: string; alt: string; focal: Ohnisko; portret?: string; portretFocal?: { focalX: number; focalY: number } }

const FOTKY: Foto[] = [
  {
    filename: 'hero-namichat-michani.avif',
    // v2 (4. 10. 2026): v1 měl temeno 4 % výšky jako master (pod kapslí i na tabletu).
    // Výřez masteru 1080 × 1236 bez zvětšení, dokreslený nahoru (vršek plotu, nebe)
    // a dolů (zemina) a oříznutý na 9:16: temeno 19 %, postava 19–58 %, hromada do 66 %.
    portret: 'hero-namichat-michani-portret-v2.avif',
    portretFocal: { focalX: 50, focalY: 30 },
    alt: 'Zahradník v podvečerním slunci promíchává rýčem světlý praný písek s tmavou prosátou zeminou přímo na připravené ploše; vedle stojí kolečko s pískem a papírové pytle, vzadu dřevěný plot a levandule.',
    // Ohnisko masteru na výšku platí jen nad 1024 px (tablet má ořez): postava 63–74 % šířky.
    focal: { focalX: 64, focalY: 50, focalPortraitX: 76, focalPortraitY: 50 },
  },
  {
    filename: 'hero-pece-prvni-pruh.avif',
    // v2: dokreslený horní okraj (GPT Image 2.5), temeno 36 % výšky místo 10 % — pod plovoucí kapslí
    portret: 'hero-pece-prvni-pruh-portret-v2.avif',
    // Postava v 36–80 % ořezu: na tabletu ořez dole (Y 100), temeno 148–245 px pod horní hranou.
    portretFocal: { focalX: 50, focalY: 100 },
    alt: 'Zahradník odchází s ruční vřetenovou sekačkou po mladém hustém trávníku a seká první pruh; vpravo dřevěný plot se záhonem levandule, vzadu mladý strom v nízkém večerním slunci.',
    // Ohnisko masteru na výšku (jen nad 1024 px): postava na 64–74 % šířky.
    focal: { focalX: 71, focalY: 55, focalPortraitX: 77, focalPortraitY: 50 },
  },
  {
    // Nové hero přípravy (majiteli se nelíbil rotavátor, 4. 10. 2026). Po kolečku (fyzika)
    // a hráběmi zvolil majitel nivelační bránu podle vlastní předlohy (proporce brány vůči
    // člověku), pruh za bránou hladký (majitel: „kde je půda upravena nivelační bránou, je zem
    // hladká“), neupravená zemina vlevo hrudovitá. Vygenerováno NAČISTO v Nano Banana Pro
    // (kompozice n0 jen jako malá rozmazaná předloha): řetěz úprav předchozích verzí zesílil
    // krajkovou texturu (síťovaný trávník, rozpité cihly), kterou majitel viděl na širokém.
    // Otisky bot v hladkém pruhu vyretušovány. Ořez na výšku = dokreslené okolí s vloženým
    // přesným výřezem masteru: temeno 12 %.
    filename: 'hero-priprava-ukladani.avif',
    portret: 'hero-priprava-ukladani-portret.avif',
    // Na tabletu ořez nahoře (Y 0), dole ubude jen zemina.
    portretFocal: { focalX: 50, focalY: 0 },
    alt: 'Zahradník v podvečerním slunci táhne nivelační bránu po rozprostřené směsi zeminy a písku; za bránou zůstává hladký urovnaný pruh, vlevo ještě hrudovitá zemina. Podél plotu leží černé potrubí závlahy, vzadu odložená ornice na plachtě a terasa domu.',
    // Ohnisko masteru: brána a postava na 40–72 % šířky (X 50 = celé ve čtvercovém náhledu).
    focal: { focalX: 50, focalY: 42, focalPortraitX: 60, focalPortraitY: 50 },
  },
  {
    filename: 'fig-priprava-vidle.avif',
    alt: 'Rycí vidle zapíchnuté do půdy lámou světlou, vyschlou udusanou vrstvu pod tmavou drobivou ornicí; ploché hroudy praskají podél hrotů.',
    focal: { focalX: 50, focalY: 55 },
  },
  {
    // Obr. 03 přípravy místo vidlí (majitel 4. 10. 2026; udusaná vrstva působila jako zeď
    // z bloků a námět se kryl s Obr. 05): ornice stranou, rozrušená jen překážka — jako popisek.
    filename: 'fig-priprava-ornice-stranou.avif',
    // Ověřeno: pruh ~24–28 cm podle hrotů vidlí, hromada odpovídá objemu výkopu.
    alt: 'Mělký odkrytý pruh v trávníku: tmavá ornice z něj leží stranou na plachtě, ve stěně je pod ní tenká světlejší vrstva a dno pokrývají rozrušené hroudy a ploché destičky utužené zeminy, v nichž stojí rycí vidle.',
    focal: { focalX: 55, focalY: 55 },
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
      await nastavOhnisko(payload, existujici.id, foto.focal, { alt: foto.alt, zdroj: path.join(ZDROJ, foto.filename) })
      // Nový ořez na výšku u existující fotky: nahrát a napojit (pole `portrait`).
      if (foto.portret) {
        const portret = (await najdi(foto.portret))?.id ??
          Number((await payload.create({ collection: 'media', data: { alt: `${foto.alt} Svislý ořez pro telefon a tablet na výšku.` }, filePath: path.join(ZDROJ, foto.portret) })).id)
        if (foto.portretFocal) await nastavOhnisko(payload, portret, foto.portretFocal, { zdroj: path.join(ZDROJ, foto.portret) })
        const aktualni = (await payload.findByID({ collection: 'media', id: existujici.id, depth: 0 })) as { portrait?: number | null }
        if (aktualni.portrait !== portret) await payload.update({ collection: 'media', id: existujici.id, data: { portrait: portret } })
      }
      continue
    }
    let portretId: number | undefined
    if (foto.portret) {
      portretId = (await najdi(foto.portret))?.id ??
        Number((await payload.create({ collection: 'media', data: { alt: `${foto.alt} Svislý ořez pro telefon a tablet na výšku.` }, filePath: path.join(ZDROJ, foto.portret) })).id)
      if (foto.portretFocal) await nastavOhnisko(payload, portretId, foto.portretFocal, { zdroj: path.join(ZDROJ, foto.portret) })
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
