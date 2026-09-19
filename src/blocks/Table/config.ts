import type { Block } from 'payload'

/**
 * Datová tabulka v článku (obsahový skill: blok `table` — parametry,
 * srovnání, spotřeby). Sazbu drží DS: hairliny --id-line-soft uvnitř
 * komponenty, tabular-nums, hlavička jako label. Obsah je text — čísla
 * se do buněk píší i s jednotkou, zvýraznění nese sloupec, ne buňka.
 */
export const DataTable: Block = {
  slug: 'table',
  interfaceName: 'TableBlock',
  labels: { singular: 'Tabulka', plural: 'Tabulky' },
  fields: [
    { name: 'heading', type: 'text', label: 'Titulek nad tabulkou (nepovinný)' },
    {
      name: 'surface',
      type: 'select',
      defaultValue: 'bila',
      label: 'Povrch',
      admin: {
        description:
          'Přehledová tabulka smí nést posun povrchu jako krémový pás (8.1 p. 5); referenční tabulka v ose prózy zůstává na bílé.',
      },
      options: [
        { label: 'Bílá (v toku textu)', value: 'bila' },
        { label: 'Krémový pás', value: 'krem' },
      ],
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'prose',
      label: 'Šířka',
      admin: {
        description:
          'Číselné tabulky do tří sloupců patří na osu prózy; širší (dlouhé textové buňky) na osu edge.',
      },
      options: [
        { label: 'Osa prózy (700 px)', value: 'prose' },
        { label: 'Široká (edge)', value: 'edge' },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      required: true,
      minRows: 2,
      label: 'Sloupce',
      labels: { singular: 'Sloupec', plural: 'Sloupce' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Hlavička', admin: { width: '70%' } },
            {
              name: 'align',
              type: 'select',
              defaultValue: 'left',
              label: 'Zarovnání',
              admin: { width: '30%', description: 'Čísla doprava.' },
              options: [
                { label: 'Vlevo', value: 'left' },
                { label: 'Doprava', value: 'right' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'rows',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Řádky',
      labels: { singular: 'Řádek', plural: 'Řádky' },
      fields: [
        {
          name: 'cells',
          type: 'array',
          required: true,
          label: 'Buňky (v pořadí sloupců)',
          labels: { singular: 'Buňka', plural: 'Buňky' },
          fields: [{ name: 'value', type: 'text', label: 'Obsah' }],
        },
      ],
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Poznámka pod tabulkou (nepovinná)',
      admin: { description: 'Např. výpočetní předpoklad hustoty. Sází se drobně pod hairline.' },
    },
  ],
}
