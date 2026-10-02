import { enrichLawnEvidence } from './lawn-seo-evidence'
import { cloneDocument } from './lawn-series-helpers'
import { PREPARATION_META, rewritePreparationLinks } from './split-preparation-seeding'

/** Each page answers a separate step: diagnose, choose, calculate, prepare, seed. */
export const LAWN_SEO: Record<string, { title: string; description: string }> = {
  'krasny-travnik-zacina-pod-zemi-2': {
    title: 'Půda pro trávník: jak poznat její typ a propustnost',
    description:
      'Poznejte jílovitou, hlinitou a písčitou půdu. Hmatová zkouška, půdní sonda a test vsakování ukážou, co upravit před založením trávníku a co zachovat.',
  },
  'pisek-biochar-a-dalsi-primesi': {
    title: 'Směs pro trávník: písek, biochar, zeolit a jejich poměry',
    description:
      'Vyberte příměsi do půdy pro trávník: písek, biochar, zeolit a Actino. Porovnejte modelové objemové poměry a hloubky zapravení pro tři typy zahrad.',
  },
  'kalkulator-na-planovani-pudniho-profilu': {
    title: 'Kalkulátor půdy pod trávník: písek, zemina a příměsi',
    description:
      'Spočítejte množství písku, zeminy a příměsí podle plochy a hloubky. Kalkulátor rozliší dovoz, ponechanou půdu a odvoz i převody na tuny, litry a balení.',
  },
  'jak-pripravit-a-ulozit-smes': PREPARATION_META,
  // Od 2. 10. 2026 má článek o setí vlastní předlohu a seeder (seed-clanek-zasit.ts).
  'jak-zasit-travnik': {
    title: 'Jak zasít trávník: od prvního zalití k pevným kořenům',
    description:
      'Co potřebují travní semena ke klíčení, jak poznat vhodný termín a proč více osiva ani vody nemusí znamenat lepší trávník. Výsev od půdy po první sečení.',
  },
}

const LEADS: Record<string, string> = {
  'krasny-travnik-zacina-pod-zemi-2':
    'Půdu pro trávník nejprve prověřte hmatovou zkouškou, sondou a zkouškou vsakování. Zjistíte její typ, utužení a odtok vody; podle toho zvolíte zásah. Funkční půdu zachovejte. *Přibližně 30 cm je orientační cíl prostoru pro kořeny, nikoli požadavek na výměnu celé vrstvy.*',
  'pisek-biochar-a-dalsi-primesi':
    'Směs pro trávník volíme podle výchozí půdy: u těžké půdy řešíme vzduch a odtok, u chudého písku uchování vody a živin. Podíly příměsí počítáme z objemu půdy do jejich hloubky zapravení. *Uvedené poměry jsou modely pro popsané zahrady, nikoli univerzální dávky.*',
  'kalkulator-na-planovani-pudniho-profilu':
    'Zadejte plochu, hloubku, způsob úpravy a podíly příměsí. Kalkulátor půdy pod trávník spočítá objemy a rozliší, *co dovézt, ponechat a odvézt*. Převody na kilogramy a tuny závisí na sypné hustotě dodávky; skutečné slehnutí směsi výpočet nepředpovídá.',
  'jak-pripravit-a-ulozit-smes':
    'Zeminu s případným pískem nejprve promíchejte v celé plánované hloubce. Potom zapravujte příměsi postupně mělčeji podle receptury; samostatná patra nevytvářejte. *Před výsevem nechte povrch slehnout, ověřte ustálení výšek a doladěním nerovností dokončete seťové lůžko.*',
  'jak-zasit-travnik':
    'Trávník sejte do půdy, která se v hloubce 5 cm drží několik dnů nad 10 °C, nejlépe na konci léta nebo začátkem podzimu. Dávku výrobce rozdělte na dvě poloviny a vysejte křížem, osivo zapravte jen 2–5 mm hluboko a přitlačte lehkým válcem. *Horní vrstvu půdy udržujte stále vlhkou, ne přemokřenou;* jak kořeny sílí, zálivku prodlužujte a prohlubujte. Poprvé sekejte při výšce asi 8 cm.',
}

/** Only replace the existing short summary; preserve all body blocks and model data. */
export function optimizeLawnArticle(slug: string, content: unknown): any {
  const doc = cloneDocument(content)
  const lead = LEADS[slug]
  if (!lead) return doc
  const summaries = doc.root.children.filter((node) => node.fields?.blockType === 'summaryBand')
  if (summaries.length !== 1) {
    throw new Error(`Expected one summary band for ${slug}, received ${summaries.length}`)
  }
  summaries[0].fields.lead = lead
  return rewritePreparationLinks(enrichLawnEvidence(slug, doc))
}
