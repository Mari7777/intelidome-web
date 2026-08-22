import type { Block } from 'payload'

export const Chapter: Block = {
  slug: 'chapter',
  labels: {
    singular: 'Kapitola',
    plural: 'Kapitoly',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Nadpis kapitoly',
      required: true,
      admin: {
        description: 'Vysází se jako nadpis druhé úrovně a slouží jako kotva v článku.',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Nadtitulek',
      admin: {
        description:
          'Nepovinný kicker nad nadpisem, například „Kapitola 01“. Číslo se nedoplňuje samo — napište ho ručně. Když pole necháte prázdné, nadtitulek se nezobrazí.',
        placeholder: 'Kapitola 01',
      },
    },
  ],
  interfaceName: 'ChapterBlock',
}
