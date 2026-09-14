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
      name: 'surface',
      type: 'select',
      defaultValue: 'panel',
      label: 'Povrch',
      admin: {
        description:
          'Pás nese posun povrchu (8.1 p. 3) — v dlouhém článku drží rytmus, který vsazené panely samy neudělají. Mezi dvěma obsidiany musí zůstat aspoň dvě světlé sekce (8.1 p. 2).',
      },
      options: [
        { label: 'Vsazený panel', value: 'panel' },
        { label: 'Obsidianový pás přes celou šířku', value: 'band' },
      ],
    },
    {
      name: 'light',
      type: 'checkbox',
      defaultValue: false,
      label: 'Světlá varianta (krém) — jen pro vsazený panel',
      admin: {
        condition: (_, siblingData) => siblingData?.surface !== 'band',
        description: 'Zůstává kvůli starším článkům; nový obsah volí povrch výš.',
      },
    },
  ],
}
