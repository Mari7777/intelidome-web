import { alternateSplitSides, block, cloneDocument, type ArticleDocument, type ArticleNode } from './lawn-series-helpers'

export const SOIL_PHOTOS = {
  intro: {
    filename: 'soil-intro.avif',
    alt: 'Malá půdní sonda v trávníku odhaluje tmavou ornici nad světlejší hutnou zeminou; rýč leží bezpečně vedle jámy.',
  },
  hands: {
    filename: 'soil-hands.avif',
    alt: 'Ruce zkoušejí vlhkou půdu mezi prsty a tvarují z ní krátký váleček pro orientační hmatovou zkoušku.',
  },
  profile: {
    filename: 'soil-profile.avif',
    alt: 'Ruka ukazuje na světlejší utuženou vrstvu pod tmavou ornicí ve stěně půdní sondy.',
  },
  drain: {
    filename: 'soil-drain-shallow.avif',
    alt: 'Mělká široká sonda v trávníku s trochou vody na dně; vedle jámy leží zahradní lopatka jako měřítko při zkoušce vsakování.',
  },
  fork: {
    filename: 'soil-fork.avif',
    alt: 'Zahradník rycími vidlemi uvolňuje utuženou půdu na okraji budoucího trávníku.',
  },
  finish: {
    filename: 'soil-finish.avif',
    alt: 'Připravená zemina pro výsev trávníku se stopami po hrábích a zahradníkem kontrolujícím povrch.',
  },
  lawn: {
    filename: 'soil-lawn.avif',
    alt: 'Přirozený zdravý zahradní trávník po dešti bez stojících louží.',
  },
} as const

export type SoilPhotoKey = keyof typeof SOIL_PHOTOS
export type SoilPhotoIds = Record<SoilPhotoKey, number | string>

type Marker = (node: ArticleNode) => boolean
const named =
  (name: string): Marker =>
  (node) =>
    node.fields?.blockName === name
const splitChapter =
  (number: string): Marker =>
  (node) =>
    node.fields?.blockType === 'split' && node.fields?.blockName === `Kapitola ${number}`
const chapterTitle =
  (title: string): Marker =>
  (node) =>
    node.fields?.blockType === 'chapter' && node.fields?.title === title
const nodeText = (node: ArticleNode): string =>
  (node.children ?? []).map((child: ArticleNode) => child.text ?? nodeText(child)).join('')

const sections: {
  key: SoilPhotoKey
  after: Marker
  before: Marker
  side: 'image-left' | 'image-right'
  ratio?: '1:1' | '4:5'
  caption: string
}[] = [
  {
    key: 'intro',
    after: (node) => node.fields?.blockType === 'summaryBand',
    before: splitChapter('01'),
    side: 'image-right',
    ratio: '1:1',
    caption:
      'Začněte malou sondou: vrchní zelená plocha neprozradí, zda kořeny pod ornicí narazí na překážku.',
  },
  {
    key: 'hands',
    after: splitChapter('01'),
    before: splitChapter('02'),
    side: 'image-left',
    caption:
      'Vzorky berte z několika míst. Vlhká zemina v dlani ukáže, zda drží váleček, drobí se, nebo se rozpadá.',
  },
  {
    key: 'profile',
    after: splitChapter('02'),
    before: splitChapter('03'),
    side: 'image-right',
    ratio: '1:1',
    caption:
      'Sonda ukáže skutečný přechod mezi ornicí a hutnou vrstvou; podle něj určíte rozsah zásahu.',
  },
  {
    key: 'drain',
    after: splitChapter('03'),
    before: (node) => node.fields?.blockType === 'calculator',
    side: 'image-left',
    caption:
      'Zkouška vsakování doplňuje pohled do sondy. Jediná jamka však nemusí vystihnout celou zahradu.',
  },
  {
    key: 'fork',
    after: splitChapter('04'),
    before: chapterTitle('Od poznání půdy k přípravě směsi'),
    side: 'image-right',
    caption:
      'Souvislý prostor pro kořeny vzniká odstraněním skutečné překážky, nikoli automatickou výměnou celé ornice.',
  },
  {
    key: 'finish',
    after: chapterTitle('Od poznání půdy k přípravě směsi'),
    before: chapterTitle('Proč se to všechno nakonec vyplatí?'),
    side: 'image-left',
    caption:
      'Před výsevem zkontrolujte připravený povrch, odtok vody a místa, kde může zemina ještě slehnout.',
  },
  {
    key: 'lawn',
    after: chapterTitle('Proč se to všechno nakonec vyplatí?'),
    // Oddíl zdrojů už článek nemá (3. 10. 2026); hranicí je pak FAQ.
    before: (node) => named('Zdroje a metodika – SEO')(node) || node.fields?.blockType === 'faq',
    side: 'image-right',
    ratio: '1:1',
    caption:
      'Připravená půda není vidět, ale právě na ní stojí odolnost a každodenní péče o trávník.',
  },
]

/**
 * Pair the unchanged Lexical prose with photographs, then alternate the sides
 * of all two-column blocks: photo and drawing pairs stood R R L L R R
 * (layout-check, 3. 10. 2026).
 */
export function illustrateSoilGuide(input: unknown, photos: SoilPhotoIds): ArticleDocument {
  return alternateSplitSides(installSoilPhotos(input, photos))
}

/** Keep lists, links and heading nodes intact. */
function installSoilPhotos(input: unknown, photos: SoilPhotoIds): ArticleDocument {
  const doc = cloneDocument(input)
  const nodes = doc.root.children
  const already = nodes.filter(
    (node) =>
      typeof node.fields?.blockName === 'string' &&
      node.fields.blockName.startsWith('Foto půdy · '),
  )
  if (already.length === sections.length) return doc
  if (already.length) throw new Error('Soil photos are only partially installed')

  for (const section of [...sections].reverse()) {
    const after = nodes.findIndex(section.after)
    const before = nodes.findIndex(section.before)
    if (after < 0 || before <= after + 1)
      throw new Error(`Missing soil photo boundary: ${section.key}`)
    const from = after + 1
    const heading = nodes[from]?.type === 'heading' ? nodes[from] : null
    const content = nodes.slice(from + (heading ? 1 : 0), before)
    if (!content.length || content.some((node) => node.type === 'block')) {
      throw new Error(`Unexpected soil prose group: ${section.key}`)
    }
    const richBody = cloneDocument(doc)
    richBody.root.children = content
    nodes.splice(
      from,
      before - from,
      block({
        blockType: 'split',
        blockName: `Foto půdy · ${section.key}`,
        side: section.side,
        photo: photos[section.key],
        photoRatio: section.ratio ?? '4:5',
        ...(heading ? { title: nodeText(heading), titleLevel: 'h3' } : {}),
        body: '',
        richBody,
        caption: section.caption,
      }),
    )
  }
  return doc
}
