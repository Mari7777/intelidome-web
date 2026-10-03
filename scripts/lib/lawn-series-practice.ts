import { cloneDocument, setFaq } from './lawn-series-helpers'

type Fields = Record<string, any>

const paths = {
  soil: '/magazin/krasny-travnik-zacina-pod-zemi-2',
  ingredients: '/magazin/pisek-biochar-a-dalsi-primesi',
  profile: '/magazin/kalkulator-na-planovani-pudniho-profilu',
  preparation: '/magazin/jak-pripravit-a-ulozit-smes',
}

function findFields(doc: any, blockType: string, title?: string): Fields {
  const matches = doc.root.children
    .map((node: any) => node.fields)
    .filter((fields: Fields | undefined) => fields?.blockType === blockType && (!title || fields.title === title))
  if (matches.length !== 1) throw new Error(`Expected one ${blockType}${title ? `: ${title}` : ''}`)
  return matches[0]
}

function linkPhrase(fields: Fields, phrase: string, url: string, label = phrase): void {
  const link = `[${label}](${url})`
  if (fields.body.includes(link)) return
  if (!fields.body.includes(phrase)) throw new Error(`Expected phrase to link: ${phrase}`)
  fields.body = fields.body.replace(phrase, link)
}

/** Shorten repeated explanations after the final calculator article has been assembled. */
export function reviseProfileArticle(input: unknown): any {
  const doc = cloneDocument(input)

  // Keep the worked example, both short variants, figures and calculator unchanged.
  for (const node of doc.root.children) {
    const fields = node.fields
    if (fields?.blockType !== 'split' || typeof fields.body !== 'string') continue
    fields.body = fields.body
      .replaceAll(`](${paths.ingredients})`, `](${paths.ingredients}#tri-zahrady-jake-pomery-pro-ne-zvolit)`)
      .replaceAll(`](${paths.preparation})`, `](${paths.preparation}#nejprve-promichat-mineralni-zaklad-potom-primesi-melceji)`)
  }

  const inputs = findFields(doc, 'split', 'Co zadat do kalkulátoru půdy pod trávník')
  linkPhrase(inputs, 'Hloubka profilu', `${paths.soil}#pohled-do-hlubin-co-ceka-koreny-o-dvacet-centimetru-niz`)
  const example = findFields(doc, 'split', 'Příklad: kolik materiálu potřebujete pro 100 m² jílovité zahrady')
  linkPhrase(example, 'předem živinami obohacený biochar', `${paths.ingredients}#co-koupit-a-jak-biochar-pripravit`)
  for (const node of doc.root.children) {
    const fields = node.fields
    if (fields?.blockType === 'split' && typeof fields.body === 'string' && fields.body.includes('Skutečnou výšku kontrolujte při práci')) {
      linkPhrase(fields, 'Skutečnou výšku kontrolujte při práci', `${paths.preparation}#cas-na-slehnuti-neni-prazdne-cekani`)
    }
  }

  const faq = findFields(doc, 'faq')
  faq.lead = 'Před objednávkou ověřte režim, jednotky a skutečné materiály.'
  setFaq(doc, 'Musím koupit zeminu uvedenou ve výsledku?', 'Jen v režimu „Nová vrstva“. Ostatní režimy využívají vhodnou původní zeminu; výsledek rozlišuje dovoz a odvoz.')
  setFaq(doc, 'Musí být půda pod trávníkem hluboká právě 30 cm?', 'Ne. Jde o model; zadejte hloubku navrženou podle skutečné půdy a podloží.')
  setFaq(doc, 'Proč se vypočtené kilogramy mohou lišit od dodávky?', 'Kvůli sypné hustotě, vlhkosti a složení materiálu. Údaje před objednávkou ověřte u dodavatele a upravte v kalkulátoru.')
  setFaq(doc, 'Mám vždy přidat deset procent na slehnutí?', 'Ne. Rezervu volte podle materiálu a práce; kalkulátor skutečné slehnutí nepředpovídá. Čistou recepturu rezerva nemění.')
  return doc
}

/** Remove repeated prose while retaining the practical sequence and existing visual blocks. */
export function revisePreparationArticle(input: unknown): any {
  const doc = cloneDocument(input)

  findFields(doc, 'split', 'Jak směs připravit a uložit při skutečné práci').body =
    `Složky a jejich hloubky vybereme podle článku [Písek, biochar a další příměsi](${paths.ingredients}#tri-zahrady-jake-pomery-pro-ne-zvolit). [Kalkulátor půdy pod trávník](${paths.profile}#co-zadat-do-kalkulatoru-pudy-pod-travnik) převede recepturu na množství pro naši plochu. Tady navážeme přípravou podloží, promícháním, uložením směsi a kontrolou slehnutí.`

  const subsoil = findFields(doc, 'split', 'Nejdříve poznat a připravit podloží')
  const subsoilParagraphs: string[] = subsoil.body.split(/\n\n+/)
  // Replace only the introductory paragraph, preserving the concrete preparation guidance.
  subsoilParagraphs[0] =
    `Použitelnou zeminu uchováme odděleně od nevhodné spodiny. Zhutnění, stavební suť a odtok vody prověříme před navážkou; postup popisuje [průzkum půdního profilu v článku Krásný trávník začíná pod zemí](${paths.soil}#pohled-do-hlubin-co-ceka-koreny-o-dvacet-centimetru-niz).`
  const pipeSentence = 'Případnou plánovanou drenáž a potrubí závlahy uložíme před konečným urovnáním a uzavřením půdy.'
  subsoilParagraphs.splice(1, 0, pipeSentence)
  // A second application must not duplicate the newly inserted sentence.
  subsoil.body = subsoilParagraphs.filter((paragraph, index, all) => paragraph !== pipeSentence || all.indexOf(paragraph) === index).join('\n\n')

  findFields(doc, 'split', 'Dodávky a míchání přizpůsobit rozsahu zahrady').body = [
    'Plochu rozdělíme na zvládnutelné pracovní úseky a pro každý vyhradíme jeho podíl objednaných materiálů. Zeminu s pískem promícháme jako první, ostatní příměsi přijdou na řadu postupně podle hloubky. Nemáme-li místo pro všechny hromady, mohou postupně navazovat i dodávky.',
    'Objednávka vychází z objemových poměrů a sypných hustot dodavatele; vážní lístek kontroluje hmotnost. Při práci nemusíme odměřovat kbelík po kbelíku ani dohánět pár kilogramů v mnohatunové směsi. Důležitější je rozptýlit materiál po celé ploše, aby nezůstal v hromádkách či pruzích. Menší příměsi, osivo a přípravky přesto dávkujeme podle jejich účelu a předepsané spotřeby.',
  ].join('\n\n')

  const mixing = findFields(doc, 'split', 'Nejprve promíchat minerální základ, potom příměsi mělčeji')
  linkPhrase(mixing, 'zvoleného režimu', `${paths.profile}#udrzet-vysku-zapravit-nebo-vytvorit-novou-vrstvu`)
  const shallow = doc.root.children.find((node: any) => node.fields?.blockType === 'split' && node.fields.body?.startsWith('Nakonec rovnoměrně rozprostřeme'))?.fields
  if (!shallow) throw new Error('Expected the shallow amendment mixing section')
  linkPhrase(shallow, 'biochar', `${paths.ingredients}#co-koupit-a-jak-biochar-pripravit`, 'předem připravený biochar')
  // The seed assembles the historical combined source before splitting it.
  // Existing CMS preparation articles already end before these seeding sections.
  const mycorrhiza = doc.root.children.find((node: any) => node.fields?.blockType === 'split' && node.fields.title === 'Mykorhizu umístit tam, kde se setká s mladými kořeny')?.fields
  if (mycorrhiza) linkPhrase(mycorrhiza, 'pro mykorhizní přípravek rozhodli', `${paths.ingredients}#mykorhizni-pripravek-ma-vlastni-pravidla-davkovani`)

  const closing = doc.root.children.find((node: any) => node.fields?.blockType === 'split' && node.fields.title === 'První zelené čárky ještě nejsou hotový porost')?.fields
  if (closing) {
    const closingParagraphs: string[] = closing.body.split(/\n\n+/)
    if (closingParagraphs.length < 2 || !closingParagraphs[1].includes('nejvýše třetinu výšky')) {
      throw new Error('Expected the original first-mowing guidance')
    }
    closing.body = [
      ...closingParagraphs.slice(0, 2),
      'Dobře připravená směs se ukáže po vydatném dešti i během suchého týdne: voda má kam odtékat, část vláhy zůstává v půdě a kořeny mohou pokračovat do hloubky. O tom rozhodla práce, kterou už pod zeleným povrchem neuvidíme.',
    ].join('\n\n')
  }

  const faq = findFields(doc, 'faq')
  faq.lead = 'Při práci hlídejte promíchání, hloubku zapravení a ustálení povrchu.'
  setFaq(doc, 'Musím půdní profil stavět z přesných vrstev?', 'Ne. Nejprve promíchejte minerální základ, potom příměsi od hlubšího zapravení k mělčímu. Hloubku přizpůsobte receptuře a ověřte sondou; přesná patra nevytvářejte.')
  setFaq(doc, 'Dokončí rovnoměrné promíchání déšť?', 'Ne. Pevná zrnka zeolitu ani biocharu do potřebné hloubky nepromíchá. Rovnoměrnost ověřte sondou na několika místech.')
  setFaq(doc, 'Jak dlouho nechat směs slehnout?', 'Orientačně 2–6 týdnů, u lehké půdy někdy kolem dvou. K výsevu přistupte až po ustálení výšek a doladění nerovností.')
  return doc
}
