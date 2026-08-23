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
      ],
    },
    { name: 'eyebrow', type: 'text', label: 'Nadřádek' },
    { name: 'title', type: 'text', label: 'Titulek' },
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
  ],
}
