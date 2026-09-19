import type { Block } from 'payload'

/**
 * Dvousloupcový blok text + obraz (DESIGN.md 8.2b, vzor z 8.3 ř. 4).
 * Obraz a text, které patří k sobě, drží jeden blok — jinak by se
 * v Lexicalu nedaly postavit vedle sebe.
 */
export const Split: Block = {
  slug: 'split',
  interfaceName: 'SplitBlock',
  labels: { singular: 'Text vedle obrazu', plural: 'Texty vedle obrazu' },
  fields: [
    {
      name: 'side',
      type: 'select',
      defaultValue: 'image-left',
      required: true,
      label: 'Na které straně je obraz',
      admin: { description: 'Sousední bloky se musí střídat, jinak vznikne pruh.' },
      options: [
        { label: 'Obraz vlevo, text vpravo', value: 'image-left' },
        { label: 'Text vlevo, obraz vpravo', value: 'image-right' },
      ],
    },
    {
      name: 'drawing',
      type: 'select',
      required: true,
      label: 'Kresba',
      admin: {
        description:
          'Do úzkého sloupce patří jen kresba s portrétovou sazbou — panoramatická by měla popisky pod 5 px.',
      },
      options: [
        { label: 'Kořenová zóna', value: 'korenova-zona' },
        { label: 'Kbelíkový test', value: 'kbelikovy-test' },
        { label: 'Hlava na hlavu', value: 'hlava-na-hlavu' },
        { label: 'Řídicí smyčka', value: 'ridici-smycka' },
        /* Článek „Krásný trávník začíná pod zemí" */
        { label: 'Hmatový test půdy', value: 'hmatovy-test' },
        { label: 'Půdní profil (sonda 30 cm)', value: 'pudni-profil' },
        { label: 'Zkouška vsakování', value: 'zkouska-vsaku' },
        { label: 'Třicet centimetrů (100 l vs. 300 l)', value: 'tricet-centimetru' },
        { label: 'Tři zóny profilu', value: 'tri-zony' },
        { label: 'Sedání půdy', value: 'sedani' },
        /* Článek „Písek, biochar a další příměsi" */
        { label: 'Dvě zahrady, jiný úkol', value: 'dve-zahrady' },
        { label: 'Tuna není kubík', value: 'tuna-neni-kubik' },
        { label: 'Tři zóny profilu (Biovin)', value: 'tri-zony-biovin' },
        { label: 'Tři zahrady, tři dávky', value: 'tri-zahrady' },
        { label: 'Ukládání odspodu', value: 'ukladani-odspodu' },
        { label: 'První kořínek (dosah 3 cm)', value: 'prvni-korinek' },
        { label: 'Nabitý vs. nenabitý biochar', value: 'nabity-biochar' },
        { label: 'Mykorhizní vlákna (dosah)', value: 'mykorhizni-vlakna' },
        { label: 'Minerální základ tří zahrad', value: 'zaklad-tri-zahrad' },
        { label: 'Slehnutí: méně než součet vstupů', value: 'slehnuti-vstupu' },
        { label: 'Praný vs. nepraný písek (mezery)', value: 'prany-pisek' },
      ],
    },
    { name: 'eyebrow', type: 'text', label: 'Nadřádek' },
    { name: 'title', type: 'text', label: 'Titulek' },
    {
      name: 'titleLevel',
      type: 'select',
      defaultValue: 'h2',
      label: 'Úroveň titulku',
      admin: { description: 'Kapitola = h2. Podkapitola uvnitř kapitoly = h3 (sazba subtitle).' },
      options: [
        { label: 'Kapitola (h2)', value: 'h2' },
        { label: 'Podkapitola (h3)', value: 'h3' },
      ],
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Text',
      admin: { description: 'Odstavce oddělte prázdným řádkem. **Tučně** takto.' },
    },
    { name: 'number', type: 'text', label: 'Číslo obrázku', admin: { placeholder: '01' } },
    { name: 'caption', type: 'text', required: true, label: 'Popisek' },
    { name: 'alt', type: 'text', required: true, label: 'Popis kresby pro odečítač' },
    {
      name: 'surface',
      type: 'select',
      defaultValue: 'bila',
      label: 'Povrch kapitoly',
      admin: {
        description:
          'Krém nese posun povrchu (8.1 p. 3). Mezi dvěma krémovými pásy má zůstat aspoň jedna bílá sekce.',
      },
      options: [
        { label: 'Bílá (výchozí)', value: 'bila' },
        { label: 'Krémový pás', value: 'krem' },
      ],
    },
  ],
}
