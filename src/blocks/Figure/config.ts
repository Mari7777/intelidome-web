import type { Block } from 'payload'

export const Figure: Block = {
  slug: 'figure',
  labels: {
    singular: 'Figura s popiskem',
    plural: 'Figury s popiskem',
  },
  fields: [
    {
      name: 'drawing',
      type: 'select',
      label: 'Technická kresba',
      admin: {
        description:
          'Vysvětlující SVG figura (DESIGN.md 9.2). Když je vybraná, obrázek se nepoužije — kresba nese výklad, fotografie nálada.',
      },
      options: [
        { label: '— žádná (použít obrázek) —', value: '' },
        { label: 'Kořenová zóna — kam voda skutečně dojde', value: 'korenova-zona' },
        { label: 'Kbelíkový test — tlak, objem, čas', value: 'kbelikovy-test' },
        { label: 'Hlava na hlavu — překrytí dostřiku', value: 'hlava-na-hlavu' },
        { label: 'Řídicí smyčka — čidlo, práh, ventil', value: 'ridici-smycka' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Obrázek',
      admin: {
        description: 'Fotografie nebo schéma. Alt text se bere z knihovny médií.',
        condition: (_, siblingData) => !siblingData?.drawing,
      },
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Popis kresby pro odečítač',
      admin: {
        description: 'Povinný u technické kresby — co figura ukazuje (9.2 p. 8).',
        condition: (_, siblingData) => Boolean(siblingData?.drawing),
      },
    },
    {
      name: 'number',
      type: 'text',
      label: 'Číslo obrázku',
      admin: {
        placeholder: '01',
        description:
          'Dvouciferně, průběžně v rámci článku (01, 02, 03 …). Blok nezná svou pozici, číslo se píše ručně. Prázdné = popisek bez štítku.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      required: true,
      label: 'Popisek — co je vidět a jaká je pointa',
      admin: {
        description: 'Jedna věta: co je na obrázku a co si z toho čtenář má odnést.',
      },
    },
    {
      name: 'panel',
      type: 'checkbox',
      defaultValue: true,
      label: 'Krémový panel kolem obrázku',
      admin: {
        description:
          'Zapnuté pro schémata a ilustrace (obraz dýchá na krému). Vypnout u fotografií přes celou šířku.',
      },
    },
  ],
  interfaceName: 'FigureBlock',
}
