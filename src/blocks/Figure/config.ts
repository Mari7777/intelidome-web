import type { Block } from 'payload'

export const Figure: Block = {
  slug: 'figure',
  labels: {
    singular: 'Figura s popiskem',
    plural: 'Figury s popiskem',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Obrázek',
      admin: {
        description: 'Fotografie nebo schéma. Alt text se bere z knihovny médií.',
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
