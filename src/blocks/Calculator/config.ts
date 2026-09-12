import type { Block } from 'payload'

/**
 * Kalkulátor v článku (DESIGN.md 8.2 „volitelně kalkulátor, max 2/článek").
 * Výpočet je kód — v obsahu se vybírá jen který.
 */
export const Calculator: Block = {
  slug: 'calculator',
  interfaceName: 'CalculatorBlock',
  labels: { singular: 'Kalkulátor', plural: 'Kalkulátory' },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      label: 'Který výpočet',
      options: [
        { label: 'Kbelíkový test — průtok zdroje', value: 'prutok' },
        { label: 'Dávka a doba zálivky', value: 'davka' },
        { label: 'Zkouška vsakování — rychlost a verdikt', value: 'vsak' },
        { label: 'Příměs do půdy — litry, kilogramy, pytle', value: 'primesi' },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'axis',
      label: 'Poloha na mřížce',
      admin: { description: 'Mimoosové polohy se musí v článku střídat (ADR-006).' },
      options: [
        { label: 'Na ose (edge 40–1400)', value: 'axis' },
        { label: 'Vysunout doprava (370–1400)', value: 'offset-right' },
        { label: 'Vysunout doleva (40–1070)', value: 'offset-left' },
      ],
    },
    {
      name: 'light',
      type: 'checkbox',
      defaultValue: false,
      label: 'Světlá varianta (krém)',
      admin: {
        description:
          'Druhý kalkulátor v článku musí být světlý — dva obsidianové panely za sebou jsou zakázané (7.7).',
      },
    },
  ],
}
