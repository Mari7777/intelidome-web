import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Faq: Block = {
  slug: 'faq',
  labels: {
    singular: 'Časté otázky',
    plural: 'Časté otázky',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Nadpis sekce',
      admin: {
        description: 'Prázdné = „Časté otázky“ v jazyce stránky (slovník UI).',
      },
    },
    {
      name: 'lead',
      type: 'textarea',
      label: 'Úvodní věta pod nadpisem',
      admin: {
        description:
          'Krátký standfirst v levém sloupci (např. shrnutí článku). Bez něj by vedle šesti otázek stál nadpis v prázdnu.',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Otázky',
      labels: {
        singular: 'Otázka',
        plural: 'Otázky',
      },
      minRows: 3,
      maxRows: 6,
      required: true,
      admin: {
        description: 'Tři až šest skutečných otázek čtenáře. Vkládá se i do strukturovaných dat.',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Otázka',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
            },
          }),
          label: 'Odpověď',
          required: true,
        },
      ],
    },
  ],
  interfaceName: 'FaqBlock',
}
