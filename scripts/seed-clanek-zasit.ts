/**
 * Článek „Jak zasít trávník: od prvního zalití k pevným kořenům" do LOKÁLNÍ
 * databáze (stabilní adresa /posts/jak-zasit-travnik).
 * Spuštění:  npm run payload -- run scripts/seed-clanek-zasit.ts
 *
 * Idempotentní: článek najde podle slugu a přepíše jen češtinu
 * (lib/publikuj-cs.ts, ADR-008). Ostrý web se plní vlastním nasazením –
 * publikaci dělá majitel v adminu.
 *
 * Text je autorův, převzatý doslova z předlohy
 * `zdroje-informaci/pro-clanky/clanek pro závlahu zahrady/jak-zasit-travnik.md`.
 * Datový modul lib/seeding-article-content.ts z ní generuje
 * scripts/generate-seeding-content.mjs (dělení odstavců na hranicích vět,
 * kontrola znak po znaku). Souhrn, zdroje a metadata má série na jednom
 * místě v lib/lawn-seo-content.ts a lib/lawn-seo-evidence.ts; FAQ a závěrečná
 * výzva níže jsou redakční text (kandidát na copy-polish).
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { publikujCs } from './lib/publikuj-cs'
import { LAWN_SEO, optimizeLawnArticle } from './lib/lawn-seo-content'
import { block, paragraph, renumberFigures, type ArticleDocument, type ArticleNode } from './lib/lawn-series-helpers'
import { SEEDING_BLEED, SEEDING_ORDER, SEEDING_SECTIONS, SEEDING_TABLES } from './lib/seeding-article-content'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const FOTKY = path.resolve(dirname, '../zdroje-informaci/fotky')

const SLUG = 'jak-zasit-travnik'
const TITLE = 'Jak zasít trávník: od prvního zalití k pevným kořenům'
const HERO = 'hero-zasit-travnik.avif'

/* ── Média ──────────────────────────────────────────────────────── */

/** Soubory k nahrání do knihovny médií, když tam ještě nejsou. Alt a ohnisko
 *  jsou zdrojem pravdy tady. Série jedné zahrady a světla (DESIGN.md 8.2b
 *  p. 8); mastery v zdroje-informaci/fotky/kandidati-zasit. */
const MEDIA: {
  filename: string
  alt: string
  focal?: { focalX: number; focalY: number; focalPortraitX?: number; focalPortraitY?: number }
  portret?: string
}[] = [
  {
    filename: HERO,
    portret: 'hero-zasit-travnik-portret.avif',
    alt: 'Zahradník zády k objektivu kropí hadicí s jemnou sprchou čerstvě osetou plochu tmavé půdy; kapky svítí v nízkém večerním slunci, vzadu dřevěný plot s keři.',
    focal: { focalX: 86, focalY: 50, focalPortraitX: 55, focalPortraitY: 50 },
  },
  {
    filename: 'fig-zasit-terasa-pred.avif',
    alt: 'Pohled z dřevěné terasy s rohem zahradní židle na urovnanou, čerstvě osetou plochu tmavé půdy bez jediného stébla; kolem starší trávník, vzadu dřevěný plot s keři v nízkém večerním slunci.',
  },
  {
    filename: 'fig-zasit-jinovatka.avif',
    alt: 'Detail připravené holé půdy za mrazivého rána: hrudky pokryté jinovatkou, za rozostřeným dřevěným plotem s keři vychází nízké zimní slunce.',
  },
  {
    filename: 'fig-zasit-setove-luzko.avif',
    alt: 'Urovnaná plocha tmavé, jemně drobtovité půdy s položenými hráběmi s dřevěnou násadou a mělkým otiskem boty v popředí; kolem trávník, vzadu dřevěný plot s keři.',
  },
  {
    filename: 'fig-zasit-prvni-zalivka.avif',
    portret: 'fig-zasit-prvni-zalivka-portret.avif',
    alt: 'Široký pohled na čerstvě osetou plochu tmavé půdy, kterou malý postřikovač na bodci kropí jemnou sprchou; kapky svítí v protisvětle před dřevěným plotem s keři.',
    focal: { focalX: 70, focalY: 55 },
  },
  {
    filename: 'fig-zasit-vlhkost-prstem.avif',
    alt: 'Ruka konečky prstů přitlačená na vlhkou, tmavou, jemně drobtovitou půdu se světlými travními semeny; vedle okraj trávníku v teplém večerním světle.',
  },
  {
    filename: 'fig-mlady-porost-ctverec.avif',
    alt: 'Mladý trávník krátce po vzejití: tenká světle zelená stébla různé výšky, mezi nimi ještě prosvítá tmavá půda.',
  },
  {
    filename: 'fig-zasit-stin-stromu.avif',
    alt: 'Mladý trávník u dřevěného plotu: levá část leží v tečkovaném stínu stromu a je řidší, pravá část je v plném nízkém slunci.',
  },
  {
    filename: 'fig-zasit-hnojivo.avif',
    alt: 'Ruka sype kovovou lopatkou světlé granule hnojiva do odměrky na kuchyňské váze na okraji dřevěné terasy; vedle stojí papírový pytel, v pozadí osetá plocha a dřevěný plot.',
  },
  {
    filename: 'fig-zasit-plevel-ctverec.avif',
    alt: 'Detail výsevu asi dva týdny po zasetí: tenká stébla mladé trávy a mezi nimi listové růžice a děložní lístky dvouděložných plevelů na tmavé půdě v protisvětle.',
  },
  {
    filename: 'fig-zasit-husty-travnik.avif',
    alt: 'Ruka v zahradní rukavici vytahuje z hustého, nízko posečeného trávníku pampelišku i s kořenem; v pozadí rozostřený dřevěný plot s keři.',
  },
  {
    filename: 'fig-zasit-oprava.avif',
    alt: 'Ruka rozsévá špetku travního osiva na malé holé místo s nakypřenou půdou uprostřed mladého trávníku; vedle leží ruční hrabičky.',
  },
  {
    filename: 'fig-zasit-terasa-po.avif',
    alt: 'Pohled z dřevěné terasy s rohem zahradní židle na mladý, souvisle zelený trávník; vzadu dřevěný plot s keři v nízkém večerním slunci.',
  },
]

/* ── Obsah ──────────────────────────────────────────────────────── */

const root = (children: ArticleNode[]): ArticleDocument => ({
  root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 },
})
const answer = (markdown: string) => root([paragraph(markdown)])

const sections = new Map(SEEDING_SECTIONS.map((section) => [section.id, section]))

function buildContent(): ArticleDocument {
  const bloky: ArticleNode[] = [
    block({
      blockType: 'summaryBand',
      blockName: 'Od výsevu k zakořeněnému trávníku',
      // Lead doplní optimizeLawnArticle z lib/lawn-seo-content.ts (jediný zdroj série).
      lead: '',
      tiles: [
        { value: '10', unit: '°C', label: 'teplota půdy, od které má výsev smysl' },
        { value: '2–5', unit: 'mm', label: 'hloubka zapravení u běžných směsí' },
        { value: '6–8', unit: 'týdnů', label: 'příznivého počasí má po výsevu zbývat' },
        { value: '8', unit: 'cm', label: 'výška porostu při prvním sečení' },
      ],
    }),
  ]
  for (const id of SEEDING_ORDER) {
    const tabulka = SEEDING_TABLES[id]
    if (tabulka) {
      bloky.push(block({
        blockType: 'table',
        blockName: tabulka.blockName,
        surface: tabulka.surface,
        width: tabulka.width,
        columns: tabulka.head.map((label) => ({ label, align: 'left' })),
        rows: tabulka.rows.map((cells) => ({ cells: cells.map((value) => ({ value })) })),
        ...(tabulka.note ? { note: tabulka.note } : {}),
      }))
      continue
    }
    if (id === 'PREDEL') {
      bloky.push(block({
        blockType: 'figure', blockName: 'Obr. 00', __filename: SEEDING_BLEED.filename,
        number: '00', caption: SEEDING_BLEED.caption, panel: false, layout: 'bleed',
      }))
      continue
    }
    const s = sections.get(id)
    if (!s) throw new Error(`Chybí oddíl rytmu ${id}`)
    if (s.drawing && !s.alt) throw new Error(`Kresba ${s.drawing} nemá popis pro odečítač`)
    bloky.push(block({
      blockType: 'split',
      blockName: s.title ?? `${s.id} – pokračování`,
      side: s.side,
      surface: s.surface,
      ...(s.eyebrow ? { eyebrow: s.eyebrow } : {}),
      ...(s.title ? { title: s.title, titleLevel: s.titleLevel } : {}),
      ...(s.continues ? { continues: true } : {}),
      ...(s.drawing ? { drawing: s.drawing, alt: s.alt } : { __photo: s.photo, photoRatio: s.photoRatio }),
      number: '00',
      caption: s.caption,
      body: s.body.join('\n\n'),
    }))
  }
  bloky.push(
    block({
      blockType: 'faq',
      blockName: 'Časté otázky k setí trávníku',
      heading: 'Časté otázky',
      lead: 'Při výsevu hlídejte teplotu půdy, vláhu u semen a stav mladého porostu, ne kalendář.',
      items: [
        {
          question: 'Kdy je nejlepší zasít trávník?',
          answer: answer('Nejlepší podmínky bývají na konci léta a na začátku podzimu: půda je ještě prohřátá a vzduch už chladnější. Po výsevu má zbývat přibližně šest až osm týdnů počasí příznivého pro růst. Jarní výsev je možný, mladý trávník ale čeká první léto dřív, než stihne dobře zakořenit.'),
        },
        {
          question: 'Při jaké teplotě travní semeno klíčí?',
          answer: answer('U běžných zahradních směsí je rozumné začínat při stabilní teplotě půdy přibližně nad 10 °C; pro klíčení řady trav bývá příznivých 15–25 °C. Měřte půdním teploměrem asi v hloubce 5 cm po několik dnů, jeden teplý odpolední údaj může klamat.'),
        },
        {
          question: 'Za jak dlouho tráva vzejde?',
          answer: answer('Za příznivých podmínek jílek vytrvalý často kolem 5–8 dnů, kostřava červená přibližně za 15–20 dnů a lipnice luční za 21–28 dnů. Směs proto nevzchází najednou; po týdnu nepřisévejte plošně další osivo jen proto, že plocha ještě není celá zelená.'),
        },
        {
          question: 'Jak často zalévat čerstvě zasetý trávník?',
          answer: answer('Tak, aby horní vrstva půdy zůstala průběžně vlhká: kratšími dávkami, za slunce a větru i několikrát denně, za chladna méně a po vydatném dešti vůbec. Cílem je vlhká půda kolem semen, ne kaluže. Jak kořeny rostou, intervaly postupně prodlužujte a dávky zvětšujte.'),
        },
        {
          question: 'Pomůže vysít víc osiva, než doporučuje výrobce?',
          answer: answer('Ne. Na stejné ploše zůstává stejné množství světla, vody i živin; příliš hustý výsev dá mnoho slabých rostlinek, které si stíní. Držte se dávky pro konkrétní směs, trávník postupně zhoustne i odnožováním.'),
        },
        {
          question: 'Kdy nový trávník poprvé posekat?',
          answer: answer('U běžné zahradní směsi při výšce asi 8 cm, se zkrácením zhruba na 6 cm. Rostliny už musí držet v půdě a povrch musí unést sekačku. Sekejte za sucha ostrým nožem a jedním sečením odstraňte nejvýše třetinu výšky.'),
        },
      ],
    }),
    block({
      blockType: 'ctaBand',
      blockName: 'Od první zálivky k automatické závlaze',
      title: 'Od první zálivky k závlaze, která se řídí půdou',
      sub: 'Mladý trávník potřebuje jiný režim na slunci, ve stínu i pod stromem. Průvodce návrhem automatické závlahy ukáže, jak zahradu rozdělit na sektory a každému dát vlastní dávku.',
      buttonLabel: 'Jak navrhnout automatickou závlahu',
      buttonHref: '/posts/jak-navrhnout-automatickou-zavlahu',
      ask: 'A otázka na závěr: víte, kam až dnes sahají kořeny vašeho trávníku?',
    }),
  )
  const doc = optimizeLawnArticle(SLUG, root(bloky)) as ArticleDocument
  renumberFigures(doc)
  return doc
}

/* ── Zápis ──────────────────────────────────────────────────────── */

const run = async () => {
  const databaseURL = new URL(process.env.DATABASE_URL || '')
  if (!['localhost', '127.0.0.1'].includes(databaseURL.hostname) || databaseURL.port !== '5433' || databaseURL.pathname !== '/intelidome_web') {
    throw new Error('Tento seed smí běžet pouze nad lokální databází webu na portu 5433.')
  }
  if (process.env.BLOB_READ_WRITE_TOKEN) throw new Error('Tento seed vyžaduje lokální úložiště médií.')
  const localConfig = await config
  if (localConfig.db) {
    localConfig.db = { ...localConfig.db, init: ((original) => (args) => {
      const adapter = original(args)
      ;(adapter as typeof adapter & { push?: boolean }).push = false
      return adapter
    })(localConfig.db.init) }
  }
  const payload = await getPayload({ config: localConfig })

  const najdi = async (filename: string) =>
    (await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1, pagination: false, depth: 0 })).docs[0]

  /* Fotografie: nahrát, když v knihovně nejsou; existujícím jen srovnat alt
     a ohnisko. Zdroj je `zdroje-informaci/fotky/` (mimo git jako public/media). */
  for (const item of MEDIA) {
    const existujici = await najdi(item.filename)
    if (existujici) {
      await payload.update({ collection: 'media', id: existujici.id, data: { alt: item.alt, ...item.focal } })
      continue
    }
    const filePath = path.join(FOTKY, item.filename)
    if (!existsSync(filePath)) throw new Error(`Fotografie ${item.filename} není v zdroje-informaci/fotky.`)
    let portretId: number | undefined
    if (item.portret) {
      const portretPath = path.join(FOTKY, item.portret)
      if (!existsSync(portretPath)) throw new Error(`Portrétový ořez ${item.portret} chybí.`)
      portretId = Number(
        (await najdi(item.portret))?.id ??
        (await payload.create({ collection: 'media', data: { alt: `${item.alt} — svislý ořez pro telefon` }, filePath: portretPath })).id,
      )
    }
    await payload.create({
      collection: 'media',
      data: { alt: item.alt, ...item.focal, ...(portretId ? { portrait: portretId } : {}) },
      filePath,
    })
    payload.logger.info(`nahráno médium ${item.filename}`)
  }

  /* Bloky odkazují na média názvem souboru – přeložit na ID. Chybějící
     fotka je chyba, ne tichý výpadek oddílu. */
  const content = buildContent()
  for (const node of content.root.children) {
    const fields = node.fields as Record<string, unknown> | undefined
    const soubor = (fields?.__photo ?? fields?.__filename) as string | undefined
    if (!fields || !soubor) continue
    const medium = await najdi(soubor)
    if (!medium) throw new Error(`Chybí médium ${soubor}.`)
    if (fields.__photo) {
      delete fields.__photo
      fields.photo = medium.id
    } else {
      delete fields.__filename
      fields.image = medium.id
    }
  }
  const hero = await najdi(HERO)
  if (!hero) throw new Error(`Chybí titulní fotografie ${HERO}.`)

  const transactionID = await payload.db.beginTransaction()
  if (!transactionID) throw new Error('Zápis článku vyžaduje transakci.')
  const req = await createLocalReq({ locale: 'cs', context: { disableRevalidate: true }, req: { transactionID } }, payload)
  try {
    const found = await payload.find({ collection: 'posts', where: { slug: { equals: SLUG } }, limit: 1, depth: 0, locale: 'cs', draft: false, req })
    const data = {
      title: TITLE,
      heroImage: hero.id,
      content,
      meta: { ...LAWN_SEO[SLUG], image: hero.id },
    }
    if (found.docs[0]) {
      await publikujCs(payload, { collection: 'posts', id: found.docs[0].id, data: data as never, req })
    } else {
      /* Nová instalace: článek založit a propojit se sérií o půdě pod trávníkem. */
      const serie = await payload.find({
        collection: 'posts', depth: 0, locale: 'cs', pagination: false, req,
        where: { slug: { in: ['jak-pripravit-a-ulozit-smes', 'kalkulator-na-planovani-pudniho-profilu', 'pisek-biochar-a-dalsi-primesi', 'krasny-travnik-zacina-pod-zemi-2'] } },
      })
      const created = await payload.create({
        collection: 'posts', depth: 0, locale: 'cs', draft: false, req, context: { disableRevalidate: true },
        data: { ...data, slug: SLUG, generateSlug: false, _status: 'published', publishedAt: new Date().toISOString() } as never,
      })
      await publikujCs(payload, { collection: 'posts', id: created.id, data: { relatedPosts: serie.docs.map((post) => post.id) }, req })
    }
    await payload.db.commitTransaction(transactionID)
    payload.logger.info(`Článek aktualizován: /posts/${SLUG}`)
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID)
    throw error
  } finally {
    await payload.destroy()
  }
  process.exit(0)
}

await run()
