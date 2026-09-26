import { enrichLawnEvidence } from './lawn-seo-evidence'
import { cloneDocument } from './lawn-series-helpers'

/** Each page answers a separate step: diagnose, choose, calculate, carry out. */
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
  'jak-pripravit-a-ulozit-smes': {
    title: 'Příprava směsi pro trávník: míchání, slehnutí a výsev',
    description:
      'Jak promíchat půdu s pískem a zapravit příměsi do správné hloubky. Praktický postup od přípravy podloží přes slehnutí a výsev až po první sečení.',
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
    'Zeminu s případným pískem nejprve promíchejte v celé plánované hloubce. Potom zapravujte příměsi postupně mělčeji podle receptury; samostatná patra nevytvářejte. *Před výsevem nechte povrch slehnout a ověřte, že se jeho výška ustálila.* Následuje výsev, jemná zálivka a první sečení.',
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
  return enrichLawnEvidence(slug, doc)
}
