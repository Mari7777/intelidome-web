import type { Block } from 'payload'

/**
 * Souhrn článku (DESIGN.md 8.2 řádek 2) — krémový pás hned po obsidianovém
 * hero. Nese vlastní typografickou roli `summary-lead` a řadu stat-tiles,
 * takže druhá obrazovka mluví jiným hlasem než běžné tělo textu.
 */
export const SummaryBand: Block = {
  slug: 'summaryBand',
  interfaceName: 'SummaryBandBlock',
  labels: { singular: 'Souhrn (krémový pás)', plural: 'Souhrny' },
  fields: [
    {
      name: 'lead',
      type: 'textarea',
      required: true,
      label: 'Souhrn',
      admin: {
        description:
          'Slib článku jednou nebo dvěma větami. Klíčovou frázi obalte hvězdičkami (*takto*) — vysadí se akcentem.',
      },
    },
    {
      name: 'tiles',
      type: 'array',
      label: 'Čísla',
      minRows: 2,
      maxRows: 4,
      admin: { description: 'Řada hodnot pod souhrnem. Každé číslo musí mít oporu v textu článku.' },
      fields: [
        { name: 'value', type: 'text', required: true, label: 'Hodnota' },
        { name: 'unit', type: 'text', label: 'Jednotka' },
        { name: 'label', type: 'text', required: true, label: 'Popisek' },
      ],
    },
  ],
}
