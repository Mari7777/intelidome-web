import type { Block } from 'payload'

/**
 * Závěrečná výzva článku (DESIGN.md 8.2 řádek N+2) — bílá, centrovaná,
 * jediná centrovaná sekce článku (10/Dont p. 10).
 */
export const CtaBand: Block = {
  slug: 'ctaBand',
  interfaceName: 'CtaBandBlock',
  labels: { singular: 'Závěrečná výzva', plural: 'Závěrečné výzvy' },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Titulek' },
    { name: 'sub', type: 'textarea', required: true, label: 'Podtitul' },
    { name: 'buttonLabel', type: 'text', required: true, label: 'Text tlačítka' },
    { name: 'buttonHref', type: 'text', required: true, label: 'Cíl tlačítka' },
    {
      name: 'ask',
      type: 'textarea',
      label: 'Otázka čtenáři',
      admin: { description: 'Poslední řádek článku — otevřená otázka, ne další výzva.' },
    },
  ],
}
