import type { Block } from 'payload'

export const StatTiles: Block = {
  slug: 'statTiles',
  labels: {
    singular: 'Dlaždice s čísly',
    plural: 'Dlaždice s čísly',
  },
  fields: [
    {
      name: 'tiles',
      type: 'array',
      label: 'Dlaždice',
      labels: {
        singular: 'Dlaždice',
        plural: 'Dlaždice',
      },
      minRows: 2,
      maxRows: 4,
      admin: {
        initCollapsed: false,
        description: 'Pásek 2 až 4 klíčových čísel. Nejlépe funguje hned pod souhrnem článku.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              label: 'Hodnota',
              required: true,
              admin: {
                width: '50%',
                placeholder: '10–15',
                description: 'Samotné číslo, bez jednotky. Např. „10–15" nebo „92".',
              },
            },
            {
              name: 'unit',
              type: 'text',
              label: 'Jednotka',
              admin: {
                width: '50%',
                placeholder: 'l/m²',
                description: 'Nepovinné. Např. „l/m²", „min", „%".',
              },
            },
          ],
        },
        {
          name: 'label',
          type: 'text',
          label: 'Popisek',
          required: true,
          admin: {
            placeholder: 'Dávka na jednu zálivku trávníku',
            description: 'Krátká věta, která číslo vysvětluje. Ideálně do 60 znaků.',
          },
        },
      ],
    },
  ],
  interfaceName: 'StatTilesBlock',
}
